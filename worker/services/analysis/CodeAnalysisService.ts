/**
 * Code Analysis Service
 * Uses regex-based analysis for Cloudflare Workers compatibility
 * Note: ts-morph was removed due to Node.js dependency incompatibility with Workers
 */

import { createLogger } from '../../logger';
import type { SourceFileAnalysis, FunctionInfo, ClassInfo } from '../blueprint/BlueprintGenerationService';

const logger = createLogger('CodeAnalysisService');

/**
 * Service for analyzing source code using ts-morph
 */
export class CodeAnalysisService {
    /**
     * Analyze multiple source files
     */
    static async analyzeSourceFiles(
        fileContents: Map<string, string>
    ): Promise<SourceFileAnalysis[]> {
        // TEMPORARY FIX: Bypass ts-morph due to memory constraints in Cloudflare Workers
        // ts-morph loads the entire TypeScript compiler (925KB) + creates in-memory AST
        // This exceeds the 128MB Worker memory limit for repos with 20+ files
        // TODO: Migrate to @typescript-eslint/typescript-estree (lighter alternative)
        logger.info('Using regex-based analysis for Cloudflare Workers compatibility', {
            fileCount: fileContents.size
        });
        return this.analyzeWithRegex(fileContents);

        /* Original ts-morph code - commented out due to memory issues
        try {
            return await this.analyzeWithTsMorph(fileContents);
        } catch (error) {
            logger.warn('ts-morph analysis failed, falling back to basic analysis', error);
            return this.analyzeWithRegex(fileContents);
        }
        */
    }

    /**
     * Regex-based analysis for Cloudflare Workers compatibility
     */
    private static analyzeWithRegex(
        fileContents: Map<string, string>
    ): SourceFileAnalysis[] {
        const analyses: SourceFileAnalysis[] = [];

        for (const [filePath, content] of fileContents.entries()) {
            if (!this.isAnalyzableFile(filePath)) {
                continue;
            }

            const lines = content.split('\n');
            const language = this.detectLanguage(filePath);

            // Extract functions using regex
            const functionPattern = /(?:function|const|let|var)\s+(\w+)\s*(?:=\s*)?(?:async\s+)?(?:\([^)]*\)|\(.*?\))\s*(?:=>|{)/g;
            const functions: FunctionInfo[] = [];
            let match;
            while ((match = functionPattern.exec(content)) !== null) {
                functions.push({
                    name: match[1],
                    parameters: [],
                    isAsync: content.substring(Math.max(0, match.index - 10), match.index).includes('async'),
                    isExported: content.substring(Math.max(0, match.index - 20), match.index).includes('export'),
                    hasDocumentation: false
                });
            }

            // Extract classes using regex
            const classPattern = /class\s+(\w+)(?:\s+extends\s+(\w+))?/g;
            const classes: ClassInfo[] = [];
            while ((match = classPattern.exec(content)) !== null) {
                classes.push({
                    name: match[1],
                    extends: match[2],
                    methods: [],
                    properties: [],
                    isExported: content.substring(Math.max(0, match.index - 20), match.index).includes('export')
                });
            }

            // Extract imports
            const importPattern = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
            const imports: string[] = [];
            while ((match = importPattern.exec(content)) !== null) {
                imports.push(match[1]);
            }

            // Extract TODO/FIXME comments
            const todos = this.extractCommentsFromText(content, filePath, /TODO:?\s*(.+)/i);
            const fixmes = this.extractCommentsFromText(content, filePath, /FIXME:?\s*(.+)/i);

            analyses.push({
                path: filePath,
                language,
                linesOfCode: lines.length,
                functions,
                classes,
                imports,
                exports: [],
                hasTests: this.detectTestFile(filePath),
                todos,
                fixmes
            });
        }

        logger.info(`Analyzed ${analyses.length} source files with regex fallback`);
        return analyses;
    }

    /**
     * Extract comments using regex
     */
    private static extractCommentsFromText(
        content: string,
        filePath: string,
        pattern: RegExp
    ): Array<{ file: string; line: number; text: string }> {
        const results: Array<{ file: string; line: number; text: string }> = [];
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            const match = line.match(pattern);
            if (match) {
                results.push({
                    file: filePath,
                    line: index + 1,
                    text: match[1].trim()
                });
            }
        });

        return results;
    }

    /**
     * Check if file should be analyzed
     */
    private static isAnalyzableFile(filePath: string): boolean {
        const analyzableExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
        return analyzableExtensions.some(ext => filePath.endsWith(ext));
    }

    /**
     * Detect programming language from file extension
     */
    private static detectLanguage(filePath: string): string {
        if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) return 'typescript';
        if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) return 'javascript';
        if (filePath.endsWith('.mjs')) return 'javascript-module';
        if (filePath.endsWith('.cjs')) return 'javascript-commonjs';
        return 'javascript';
    }

    /**
     * Detect if file is a test file
     */
    private static detectTestFile(filePath: string): boolean {
        const testPatterns = [
            '.test.',
            '.spec.',
            '__tests__',
            '__test__',
            '/tests/',
            '/test/'
        ];

        return testPatterns.some(pattern => filePath.includes(pattern));
    }
}
