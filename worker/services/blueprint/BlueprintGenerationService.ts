/**
 * Blueprint Generation Service
 * Uses Gemini 2.5 Pro to analyze imported codebases and generate completion blueprints
 */

import { createLogger } from '../../logger';

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

export interface Recommendation {
    priority: 'high' | 'medium' | 'low';
    category: 'functionality' | 'security' | 'performance' | 'quality' | 'testing';
    title: string;
    description: string;
    estimatedEffort?: string;
}

export interface CompletionPhase {
    phase: number;
    title: string;
    tasks: string[];
    estimatedTime?: string;
}

export interface GeneratedBlueprint {
    projectName: string;
    description: string;
    currentState: {
        framework?: string;
        totalFiles: number;
        totalLinesOfCode: number;
        completenessPercentage: number;
        implementedFeatures: string[];
        missingComponents: string[];
    };
    recommendations: Recommendation[];
    nextSteps: string[];
    technicalDebt: string[];
    completionPhases: CompletionPhase[];
}

/**
 * Blueprint Generation Service using Gemini 2.5 Pro via Cloudflare AI Gateway
 */
export class BlueprintGenerationService {
    /**
     * Generate a completion blueprint using Gemini 2.5 Pro via AI Gateway
     */
    static async generateBlueprint(
        env: {
            CF_ACCOUNT_ID?: string;
            CF_AI_GATEWAY_ID?: string;
            GOOGLE_AI_STUDIO_API_KEY?: string;
            DEV_MODE?: string;
        },
        context: CodebaseContext
    ): Promise<GeneratedBlueprint> {
        try {
            logger.info('Generating blueprint with Gemini 2.5 Pro via AI Gateway', {
                repository: context.repositoryName,
                fileCount: context.sourceFiles.length
            });

            // In local Vite dev mode, skip external AI Gateway call due to workerd TLS validation
            // This is a known limitation: external HTTPS fetches fail in workerd local development
            // For production testing, use: npm run dev:remote (wrangler dev --remote)
            if (env.DEV_MODE === 'true') {
                logger.warn('DEV_MODE detected: Using fallback blueprint. For production Gemini testing, use: npm run dev:remote');
                return this.createFallbackBlueprint(context);
            }

            // Validate required environment variables
            if (!env.CF_ACCOUNT_ID || !env.CF_AI_GATEWAY_ID || !env.GOOGLE_AI_STUDIO_API_KEY) {
                logger.warn('Missing AI Gateway configuration, using fallback blueprint');
                return this.createFallbackBlueprint(context);
            }

            const prompt = this.buildAnalysisPrompt(context);

            // Call Gemini 2.5 Flash via Cloudflare AI Gateway
            const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/${env.CF_AI_GATEWAY_ID}/google-ai-studio/v1/models/gemini-2.5-pro:generateContent`;

            let response;
            try {
                response = await fetch(gatewayUrl, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'x-goog-api-key': env.GOOGLE_AI_STUDIO_API_KEY
                    },
                    body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [{ text: prompt }]
                        }],
                        generationConfig: {
                            maxOutputTokens: 8000,
                            temperature: 0.7
                        }
                    })
                });
            } catch (fetchError) {
                // Handle workerd local development TLS validation errors
                // This occurs when external HTTPS fetches fail due to certificate validation
                // in local development with miniflare/workerd
                const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
                if (errorMessage.includes('fetch failed') ||
                    errorMessage.includes('TLS') ||
                    errorMessage.includes('certificate')) {
                    logger.warn('External API fetch failed (likely local workerd TLS issue), using fallback blueprint', {
                        error: errorMessage
                    });
                    return this.createFallbackBlueprint(context);
                }
                // Re-throw if it's a different kind of error
                throw fetchError;
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`AI Gateway request failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json() as {
                candidates?: Array<{
                    content?: {
                        parts?: Array<{ text?: string }>;
                    };
                }>;
            };

            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!generatedText) {
                throw new Error('No content generated from Gemini');
            }

            const blueprint = this.parseAIResponse(generatedText, context);

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
Analyze this codebase and generate a comprehensive completion blueprint for **Dreamforge AI-assisted development**.

**IMPORTANT CONTEXT**: This project will be completed using Dreamforge, an AI-powered development platform that:
- Generates code 10-50x faster than human developers
- Can implement features, fix bugs, and refactor code autonomously
- Works iteratively with human oversight and guidance
- **All time estimates should reflect AI-assisted development speed**

Consider:

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
   - High (important for stability/security/functionality)
   - Medium (improves quality)
   - Low (nice-to-have enhancements)

4. **Implementation Phases**: Break work into logical phases with:
   - Clear objectives
   - Concrete deliverables
   - Dependencies between phases
   - **AI-assisted time estimates** (minutes/hours, not days/weeks)

5. **Technical Debt**: Identify code smells, anti-patterns, or legacy issues

6. **Next Steps**: Provide immediate actionable next steps for AI implementation

# Output Format
Respond with a JSON object matching this structure:
{
  "projectName": "string",
  "description": "brief project description",
  "currentState": {
    "framework": "framework name",
    "totalFiles": ${context.sourceFiles.length},
    "totalLinesOfCode": ${context.sourceFiles.reduce((acc, f) => acc + f.linesOfCode, 0)},
    "completenessPercentage": 0-100,
    "implementedFeatures": ["feature1", "feature2"],
    "missingComponents": ["component1", "component2"]
  },
  "recommendations": [
    {
      "priority": "high|medium|low",
      "category": "functionality|security|performance|quality|testing",
      "title": "short title",
      "description": "detailed description",
      "estimatedEffort": "AI-assisted time (e.g., '15-30 min', '1-2 hours') - optional"
    }
  ],
  "completionPhases": [
    {
      "phase": 1,
      "title": "Phase Name",
      "tasks": ["task1", "task2"],
      "estimatedTime": "AI-assisted time (e.g., '30-45 min', '2-3 hours') - optional"
    }
  ],
  "technicalDebt": ["debt item 1", "debt item 2"],
  "nextSteps": ["step1", "step2", "step3"]
}

**CRITICAL REMINDER**: All time estimates must reflect AI-assisted development speed:
- Simple tasks (bug fixes, minor features): 10-30 minutes
- Medium tasks (new components, API endpoints): 30-90 minutes
- Complex tasks (major features, refactoring): 2-4 hours
- Very complex tasks (architecture changes): 4-8 hours

Be specific, actionable, and optimistic about AI capabilities.`;
    }

    /**
     * Parse AI model response into structured blueprint
     */
    private static parseAIResponse(
        response: string,
        context: CodebaseContext
    ): GeneratedBlueprint {
        try {
            // Extract JSON from response (LLM might wrap it in markdown)
            const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
                             response.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                const jsonStr = jsonMatch[1] || jsonMatch[0];
                const parsed = JSON.parse(jsonStr);

                // Calculate totals for fallback
                const totalFiles = context.sourceFiles.length;
                const totalLOC = context.sourceFiles.reduce((acc, f) => acc + f.linesOfCode, 0);

                // Validate and return parsed blueprint
                return {
                    projectName: parsed.projectName || context.repositoryName,
                    description: parsed.description || 'Project analysis',
                    currentState: {
                        framework: parsed.currentState?.framework || context.framework,
                        totalFiles: parsed.currentState?.totalFiles || totalFiles,
                        totalLinesOfCode: parsed.currentState?.totalLinesOfCode || totalLOC,
                        completenessPercentage: parsed.currentState?.completenessPercentage ?? 50,
                        implementedFeatures: Array.isArray(parsed.currentState?.implementedFeatures)
                            ? parsed.currentState.implementedFeatures
                            : [],
                        missingComponents: Array.isArray(parsed.currentState?.missingComponents)
                            ? parsed.currentState.missingComponents
                            : Array.isArray(parsed.currentState?.missingFeatures)
                                ? parsed.currentState.missingFeatures
                                : []
                    },
                    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
                    nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
                    technicalDebt: Array.isArray(parsed.technicalDebt) ? parsed.technicalDebt : [],
                    completionPhases: Array.isArray(parsed.completionPhases) ? parsed.completionPhases : []
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
        const totalFiles = context.sourceFiles.length;
        const totalLOC = context.sourceFiles.reduce((acc, f) => acc + f.linesOfCode, 0);

        return {
            projectName: context.repositoryName,
            description: `${context.framework || 'JavaScript'} project with ${totalFiles} source files`,
            currentState: {
                framework: context.framework,
                totalFiles,
                totalLinesOfCode: totalLOC,
                completenessPercentage: completeness,
                implementedFeatures: [
                    `${totalFiles} source files implemented`,
                    `${Object.keys(context.dependencies).length} dependencies configured`
                ],
                missingComponents: [
                    todoCount > 0 ? `${todoCount} TODO items pending` : 'Review pending features',
                    testCount === 0 ? 'Test coverage needed' : 'Additional test coverage'
                ]
            },
            recommendations: [
                {
                    priority: 'high',
                    category: 'testing',
                    title: 'Add Test Coverage',
                    description: 'Implement unit tests for core functionality using AI-assisted development',
                    estimatedEffort: '2-3 hours'
                }
            ],
            nextSteps: [
                'Review and resolve TODO comments (30-45 min)',
                'Add comprehensive test coverage (2-3 hours)',
                'Document core functionality (1-2 hours)'
            ],
            technicalDebt: [],
            completionPhases: [
                {
                    phase: 1,
                    title: 'Foundation & Testing',
                    tasks: [
                        'Add test coverage for core functionality',
                        'Fix critical TODOs',
                        'Create test suite',
                        'Resolve critical issues'
                    ],
                    estimatedTime: '3-4 hours'
                }
            ]
        };
    }
}
