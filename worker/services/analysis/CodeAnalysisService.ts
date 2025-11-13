/**
 * Code Analysis Service
 * Uses ts-morph to parse and analyze TypeScript/JavaScript source files
 */

import { Project, SourceFile, SyntaxKind } from 'ts-morph';
import { createLogger } from '../../logger';
import type { SourceFileAnalysis, FunctionInfo, ClassInfo, TodoComment, FixmeComment } from '../blueprint/BlueprintGenerationService';

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
        try {
            // Try ts-morph analysis first
            return await this.analyzeWithTsMorph(fileContents);
        } catch (error) {
            logger.warn('ts-morph analysis failed, falling back to basic analysis', error);

            // Fallback to basic regex-based analysis
            return this.analyzeWithRegex(fileContents);
        }
    }

    /**
     * Analyze using ts-morph (full AST parsing)
     */
    private static async analyzeWithTsMorph(
        fileContents: Map<string, string>
    ): Promise<SourceFileAnalysis[]> {
        const project = new Project({
            useInMemoryFileSystem: true,
            compilerOptions: {
                target: 99, // ESNext
                module: 99, // ESNext
                allowJs: true,
                checkJs: false,
                jsx: 2, // React
                strict: false
            }
        });

        const analyses: SourceFileAnalysis[] = [];

        for (const [filePath, content] of fileContents.entries()) {
            if (!this.isAnalyzableFile(filePath)) {
                continue;
            }

            try {
                const sourceFile = project.createSourceFile(filePath, content, {
                    overwrite: true
                });

                const analysis = this.analyzeSourceFile(sourceFile, filePath);
                analyses.push(analysis);

            } catch (error) {
                logger.warn(`Failed to analyze file: ${filePath}`, error);
            }
        }

        logger.info(`Analyzed ${analyses.length} source files with ts-morph`);
        return analyses;
    }

    /**
     * Fallback: Basic regex-based analysis when ts-morph is unavailable
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
     * Analyze a single source file
     */
    private static analyzeSourceFile(sourceFile: SourceFile, filePath: string): SourceFileAnalysis {
        const language = this.detectLanguage(filePath);
        const linesOfCode = sourceFile.getEndLineNumber();

        const functions = this.extractFunctions(sourceFile);
        const classes = this.extractClasses(sourceFile);
        const imports = this.extractImports(sourceFile);
        const exports = this.extractExports(sourceFile);
        const todos = this.extractTodoComments(sourceFile, filePath);
        const fixmes = this.extractFixmeComments(sourceFile, filePath);

        const hasTests = this.detectTestFile(filePath);

        return {
            path: filePath,
            language,
            linesOfCode,
            functions,
            classes,
            imports,
            exports,
            hasTests,
            todos,
            fixmes
        };
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
     * Extract function information
     */
    private static extractFunctions(sourceFile: SourceFile): FunctionInfo[] {
        const functions: FunctionInfo[] = [];

        // Function declarations
        sourceFile.getFunctions().forEach(func => {
            const name = func.getName() || 'anonymous';
            const parameters = func.getParameters().map(p => p.getName());
            const returnType = func.getReturnType().getText();
            const isAsync = func.isAsync();
            const isExported = func.isExported();
            const hasDocumentation = func.getJsDocs().length > 0;

            functions.push({
                name,
                parameters,
                returnType,
                isAsync,
                isExported,
                hasDocumentation
            });
        });

        // Arrow functions and function expressions (variables)
        sourceFile.getVariableDeclarations().forEach(varDecl => {
            const initializer = varDecl.getInitializer();
            if (initializer && (
                initializer.getKind() === SyntaxKind.ArrowFunction ||
                initializer.getKind() === SyntaxKind.FunctionExpression
            )) {
                const name = varDecl.getName();
                const funcExpr = initializer.asKind(SyntaxKind.ArrowFunction) ||
                               initializer.asKind(SyntaxKind.FunctionExpression);

                if (funcExpr) {
                    const parameters = funcExpr.getParameters().map(p => p.getName());
                    const isAsync = funcExpr.isAsync();
                    const parent = varDecl.getParent()?.getParent();
                    const isExported = parent?.getKind() === SyntaxKind.VariableStatement &&
                                      (parent as any).isExported?.() || false;

                    functions.push({
                        name,
                        parameters,
                        isAsync,
                        isExported,
                        hasDocumentation: false
                    });
                }
            }
        });

        return functions;
    }

    /**
     * Extract class information
     */
    private static extractClasses(sourceFile: SourceFile): ClassInfo[] {
        const classes: ClassInfo[] = [];

        sourceFile.getClasses().forEach(cls => {
            const name = cls.getName() || 'anonymous';
            const extendsClause = cls.getExtends()?.getText();
            const implementsClauses = cls.getImplements().map(i => i.getText());
            const methods = cls.getMethods().map(m => m.getName());
            const properties = cls.getProperties().map(p => p.getName());
            const isExported = cls.isExported();

            classes.push({
                name,
                extends: extendsClause,
                implements: implementsClauses.length > 0 ? implementsClauses : undefined,
                methods,
                properties,
                isExported
            });
        });

        return classes;
    }

    /**
     * Extract import statements
     */
    private static extractImports(sourceFile: SourceFile): string[] {
        const imports: string[] = [];

        sourceFile.getImportDeclarations().forEach(imp => {
            const moduleSpecifier = imp.getModuleSpecifierValue();
            imports.push(moduleSpecifier);
        });

        return imports;
    }

    /**
     * Extract export statements
     */
    private static extractExports(sourceFile: SourceFile): string[] {
        const exports: string[] = [];

        sourceFile.getExportDeclarations().forEach(exp => {
            const moduleSpecifier = exp.getModuleSpecifierValue();
            if (moduleSpecifier) {
                exports.push(moduleSpecifier);
            }
        });

        // Named exports
        sourceFile.getExportedDeclarations().forEach((declarations, name) => {
            exports.push(name);
        });

        return exports;
    }

    /**
     * Extract TODO comments
     */
    private static extractTodoComments(sourceFile: SourceFile, filePath: string): TodoComment[] {
        const todos: TodoComment[] = [];
        const fullText = sourceFile.getFullText();
        const lines = fullText.split('\n');

        lines.forEach((line, index) => {
            const todoMatch = line.match(/\/\/\s*TODO:?\s*(.+)/i) ||
                            line.match(/\/\*\s*TODO:?\s*(.+)\*\//i);

            if (todoMatch) {
                todos.push({
                    file: filePath,
                    line: index + 1,
                    text: todoMatch[1].trim()
                });
            }
        });

        return todos;
    }

    /**
     * Extract FIXME comments
     */
    private static extractFixmeComments(sourceFile: SourceFile, filePath: string): FixmeComment[] {
        const fixmes: FixmeComment[] = [];
        const fullText = sourceFile.getFullText();
        const lines = fullText.split('\n');

        lines.forEach((line, index) => {
            const fixmeMatch = line.match(/\/\/\s*FIXME:?\s*(.+)/i) ||
                             line.match(/\/\*\s*FIXME:?\s*(.+)\*\//i);

            if (fixmeMatch) {
                fixmes.push({
                    file: filePath,
                    line: index + 1,
                    text: fixmeMatch[1].trim()
                });
            }
        });

        return fixmes;
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
