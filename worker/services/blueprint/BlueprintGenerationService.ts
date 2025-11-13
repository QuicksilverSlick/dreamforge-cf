/**
 * Blueprint Generation Service
 * Uses Gemini 2.5 Pro to analyze imported codebases and generate completion blueprints
 */

import { createLogger } from '../../logger';
import type { Ai } from '@cloudflare/workers-types';

const logger = createLogger('BlueprintGenerationService');

export interface CodebaseContext {
    repositoryName: string;
    repositoryUrl: string;
    framework?: string;
    packageManager?: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    fileStructure: FileNode[];
    sourceFiles: SourceFileAnalysis[];
    configFiles: ConfigFileInfo[];
    readmeContent?: string;
}

export interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    size?: number;
    children?: FileNode[];
}

export interface SourceFileAnalysis {
    path: string;
    language: string;
    linesOfCode: number;
    complexity?: number;
    functions: FunctionInfo[];
    classes: ClassInfo[];
    imports: string[];
    exports: string[];
    hasTests: boolean;
    todos: TodoComment[];
    fixmes: FixmeComment[];
}

export interface FunctionInfo {
    name: string;
    parameters: string[];
    returnType?: string;
    isAsync: boolean;
    isExported: boolean;
    hasDocumentation: boolean;
}

export interface ClassInfo {
    name: string;
    extends?: string;
    implements?: string[];
    methods: string[];
    properties: string[];
    isExported: boolean;
}

export interface ConfigFileInfo {
    path: string;
    type: string;
    content: Record<string, unknown>;
}

export interface TodoComment {
    file: string;
    line: number;
    text: string;
}

export interface FixmeComment {
    file: string;
    line: number;
    text: string;
}

export interface GeneratedBlueprint {
    projectName: string;
    description: string;
    currentState: {
        completenessPercentage: number;
        implementedFeatures: string[];
        missingFeatures: string[];
        architectureNotes: string[];
    };
    recommendations: {
        priority: 'critical' | 'high' | 'medium' | 'low';
        category: string;
        title: string;
        description: string;
        estimatedEffort: string;
        files: string[];
    }[];
    suggestedPhases: {
        phaseNumber: number;
        phaseName: string;
        objectives: string[];
        deliverables: string[];
        dependencies: string[];
    }[];
    technicalDebt: {
        category: string;
        severity: 'high' | 'medium' | 'low';
        description: string;
        location: string;
    }[];
    nextSteps: string[];
}

/**
 * Blueprint Generation Service using Gemini 2.5 Pro
 */
export class BlueprintGenerationService {
    /**
     * Generate a completion blueprint using Gemini 2.5 Pro with thinking mode
     */
    static async generateBlueprint(
        ai: Ai,
        context: CodebaseContext
    ): Promise<GeneratedBlueprint> {
        try {
            logger.info('Generating blueprint with Gemini 2.5 Pro', {
                repository: context.repositoryName,
                fileCount: context.sourceFiles.length
            });

            const prompt = this.buildAnalysisPrompt(context);

            // Use Gemini 2.5 Pro with thinking mode for deep analysis
            const response = await ai.run('@cf/google/gemini-2.0-flash-thinking-exp-1219', {
                prompt,
                max_tokens: 8000,
                temperature: 0.7
            }) as { response: string };

            const blueprint = this.parseGeminiResponse(response.response, context);

            logger.info('Blueprint generated successfully', {
                repository: context.repositoryName,
                completeness: blueprint.currentState.completenessPercentage,
                recommendations: blueprint.recommendations.length
            });

            return blueprint;

        } catch (error) {
            logger.error('Failed to generate blueprint', error);
            return this.createFallbackBlueprint(context);
        }
    }

    /**
     * Build comprehensive analysis prompt for Gemini
     */
    private static buildAnalysisPrompt(context: CodebaseContext): string {
        const todoCount = context.sourceFiles.reduce((acc, file) => acc + file.todos.length, 0);
        const fixmeCount = context.sourceFiles.reduce((acc, file) => acc + file.fixmes.length, 0);
        const totalLOC = context.sourceFiles.reduce((acc, file) => acc + file.linesOfCode, 0);

        const fileList = context.sourceFiles
            .slice(0, 50) // Limit to top 50 files for context
            .map(f => `- ${f.path} (${f.linesOfCode} LOC, ${f.functions.length} functions, ${f.classes.length} classes)`)
            .join('\n');

        const dependencyList = Object.entries(context.dependencies)
            .slice(0, 20)
            .map(([name, version]) => `- ${name}@${version}`)
            .join('\n');

        return `You are an expert software architect analyzing a codebase to generate a completion blueprint.

# Repository Information
**Name**: ${context.repositoryName}
**URL**: ${context.repositoryUrl}
**Framework**: ${context.framework || 'Unknown'}
**Package Manager**: ${context.packageManager || 'Unknown'}

# Codebase Statistics
- **Total Files**: ${context.sourceFiles.length}
- **Total Lines of Code**: ${totalLOC.toLocaleString()}
- **TODO Comments**: ${todoCount}
- **FIXME Comments**: ${fixmeCount}
- **Config Files**: ${context.configFiles.length}

# Key Dependencies
${dependencyList}

# File Structure (Top 50 Files)
${fileList}

${context.readmeContent ? `# README Content\n${context.readmeContent.substring(0, 2000)}\n` : ''}

# Your Task
Analyze this codebase and generate a comprehensive completion blueprint. Consider:

1. **Current State Assessment**: Estimate completeness percentage based on:
   - Code coverage and test presence
   - TODO/FIXME comments
   - Missing error handling
   - Incomplete features
   - Documentation gaps

2. **Architecture Analysis**: Identify:
   - Design patterns used
   - Code organization quality
   - Potential architectural improvements
   - Scalability concerns

3. **Prioritized Recommendations**: Provide specific, actionable recommendations categorized by:
   - Critical (blocks production deployment)
   - High (important for stability/security)
   - Medium (improves quality)
   - Low (nice-to-have enhancements)

4. **Implementation Phases**: Break work into logical phases with:
   - Clear objectives
   - Concrete deliverables
   - Dependencies between phases

5. **Technical Debt**: Identify code smells, anti-patterns, or legacy issues

6. **Next Steps**: Provide immediate actionable next steps

# Output Format
Respond with a JSON object matching this structure:
{
  "projectName": "string",
  "description": "brief project description",
  "currentState": {
    "completenessPercentage": 0-100,
    "implementedFeatures": ["feature1", "feature2"],
    "missingFeatures": ["feature1", "feature2"],
    "architectureNotes": ["note1", "note2"]
  },
  "recommendations": [
    {
      "priority": "critical|high|medium|low",
      "category": "security|performance|testing|documentation|features|bugs",
      "title": "short title",
      "description": "detailed description",
      "estimatedEffort": "hours or days",
      "files": ["file paths affected"]
    }
  ],
  "suggestedPhases": [
    {
      "phaseNumber": 1,
      "phaseName": "Phase Name",
      "objectives": ["objective1", "objective2"],
      "deliverables": ["deliverable1"],
      "dependencies": ["dependency on other phases"]
    }
  ],
  "technicalDebt": [
    {
      "category": "code-smell|anti-pattern|legacy|performance",
      "severity": "high|medium|low",
      "description": "description",
      "location": "file or module"
    }
  ],
  "nextSteps": ["step1", "step2", "step3"]
}

Be specific, actionable, and realistic in your analysis.`;
    }

    /**
     * Parse Gemini's response into structured blueprint
     */
    private static parseGeminiResponse(
        response: string,
        context: CodebaseContext
    ): GeneratedBlueprint {
        try {
            // Extract JSON from response (Gemini might wrap it in markdown)
            const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
                             response.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                const jsonStr = jsonMatch[1] || jsonMatch[0];
                const parsed = JSON.parse(jsonStr);

                // Validate and return parsed blueprint
                return {
                    projectName: parsed.projectName || context.repositoryName,
                    description: parsed.description || 'Project analysis',
                    currentState: parsed.currentState || {
                        completenessPercentage: 50,
                        implementedFeatures: [],
                        missingFeatures: [],
                        architectureNotes: []
                    },
                    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
                    suggestedPhases: Array.isArray(parsed.suggestedPhases) ? parsed.suggestedPhases : [],
                    technicalDebt: Array.isArray(parsed.technicalDebt) ? parsed.technicalDebt : [],
                    nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : []
                };
            }

            // If no JSON found, create fallback
            logger.warn('Could not parse Gemini response as JSON, using fallback');
            return this.createFallbackBlueprint(context);

        } catch (error) {
            logger.error('Error parsing Gemini response', error);
            return this.createFallbackBlueprint(context);
        }
    }

    /**
     * Create a fallback blueprint when Gemini analysis fails
     */
    private static createFallbackBlueprint(context: CodebaseContext): GeneratedBlueprint {
        const todoCount = context.sourceFiles.reduce((acc, file) => acc + file.todos.length, 0);
        const testCount = context.sourceFiles.filter(f => f.hasTests).length;
        const completeness = Math.round((testCount / context.sourceFiles.length) * 100) || 50;

        return {
            projectName: context.repositoryName,
            description: `${context.framework || 'JavaScript'} project with ${context.sourceFiles.length} source files`,
            currentState: {
                completenessPercentage: completeness,
                implementedFeatures: [
                    `${context.sourceFiles.length} source files implemented`,
                    `${Object.keys(context.dependencies).length} dependencies configured`
                ],
                missingFeatures: [
                    todoCount > 0 ? `${todoCount} TODO items pending` : 'Review pending features',
                    testCount === 0 ? 'Test coverage needed' : 'Additional test coverage'
                ],
                architectureNotes: [
                    `Framework: ${context.framework || 'Not detected'}`,
                    `Package Manager: ${context.packageManager || 'Not detected'}`
                ]
            },
            recommendations: [
                {
                    priority: 'high',
                    category: 'testing',
                    title: 'Add Test Coverage',
                    description: 'Implement unit tests for core functionality',
                    estimatedEffort: '2-4 days',
                    files: context.sourceFiles.filter(f => !f.hasTests).slice(0, 5).map(f => f.path)
                }
            ],
            suggestedPhases: [
                {
                    phaseNumber: 1,
                    phaseName: 'Foundation & Testing',
                    objectives: ['Add test coverage', 'Fix critical TODOs'],
                    deliverables: ['Test suite', 'Resolved critical issues'],
                    dependencies: []
                }
            ],
            technicalDebt: [],
            nextSteps: [
                'Review and resolve TODO comments',
                'Add comprehensive test coverage',
                'Document core functionality'
            ]
        };
    }
}
