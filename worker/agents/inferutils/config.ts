import { AgentConfig, AIModels } from "./config.types";

/*
Use these configs instead for better performance, less bugs and costs:

    blueprint: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'medium',
        max_tokens: 16000,
        fallbackModel: AIModels.OPENAI_O3,
        temperature: 1,
    },
    projectSetup: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'medium',
        max_tokens: 10000,
        temperature: 1,
        fallbackModel: AIModels.GEMINI_2_5_FLASH,
    },
    phaseGeneration: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'medium',
        max_tokens: 32000,
        temperature: 1,
        fallbackModel: AIModels.GEMINI_2_5_FLASH,
    },
    codeReview: {
        name: AIModels.OPENAI_5,
        reasoning_effort: 'medium',
        max_tokens: 32000,
        temperature: 1,
        fallbackModel: AIModels.GEMINI_2_5_PRO,
    },
    fileRegeneration: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'low',
        max_tokens: 32000,
        temperature: 1,
        fallbackModel: AIModels.CLAUDE_4_SONNET,
    },
    realtimeCodeFixer: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'low',
        max_tokens: 32000,
        temperature: 1,
        fallbackModel: AIModels.CLAUDE_4_SONNET,
    },

For real time code fixer, here are some alternatives: 
    realtimeCodeFixer: {
        name: AIModels.CEREBRAS_QWEN_3_CODER,
        reasoning_effort: undefined,
        max_tokens: 10000,
        temperature: 0.0,
        fallbackModel: AIModels.GEMINI_2_5_PRO,
    },

OR
    realtimeCodeFixer: {
        name: AIModels.KIMI_2_5,
        providerOverride: 'direct',
        reasoning_effort: 'medium',
        max_tokens: 32000,
        temperature: 0.7,
        fallbackModel: AIModels.OPENAI_OSS,
    },
*/


// Max-quality posture (June 2026): Claude Opus 4.8 drives every code-bearing
// and review role (most capable for long-horizon agentic coding; ~4x less
// likely than its predecessor to let flaws in its own code pass unremarked),
// with Claude Sonnet 4.6 as the coding fallback. Trivial / high-volume,
// latency-sensitive roles use the current Gemini 3.x GA models.
export const AGENT_CONFIG: AgentConfig = {
    templateSelection: {
        name: AIModels.GEMINI_3_1_FLASH_LITE,
        max_tokens: 2000,
        fallbackModel: AIModels.GEMINI_3_5_FLASH,
        temperature: 0.6,
    },
    blueprint: {
        name: AIModels.CLAUDE_OPUS_4_8,
        reasoning_effort: 'high',
        max_tokens: 64000,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
        temperature: 0.7,
    },
    projectSetup: {
        name: AIModels.GEMINI_3_5_FLASH,
        reasoning_effort: 'low',
        max_tokens: 10000,
        temperature: 0.2,
        fallbackModel: AIModels.GEMINI_3_1_FLASH_LITE,
    },
    phaseGeneration: {
        name: AIModels.CLAUDE_OPUS_4_8,
        reasoning_effort: 'medium',
        max_tokens: 32000,
        temperature: 0.2,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
    },
    firstPhaseImplementation: {
        name: AIModels.CLAUDE_OPUS_4_8,
        reasoning_effort: 'high',
        max_tokens: 64000,
        temperature: 0.2,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
    },
    phaseImplementation: {
        name: AIModels.CLAUDE_OPUS_4_8,
        reasoning_effort: 'medium',
        max_tokens: 64000,
        temperature: 0.2,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
    },
    realtimeCodeFixer: {
        name: AIModels.DISABLED,
        reasoning_effort: 'low',
        max_tokens: 32000,
        temperature: 1,
        fallbackModel: AIModels.GEMINI_3_5_FLASH,
    },
    fastCodeFixer: {
        name: AIModels.CLAUDE_SONNET_4_6,
        reasoning_effort: undefined,
        max_tokens: 64000,
        temperature: 0.0,
        fallbackModel: AIModels.GEMINI_3_5_FLASH,
    },
    conversationalResponse: {
        name: AIModels.GEMINI_3_5_FLASH,
        reasoning_effort: 'low',
        max_tokens: 4000,
        temperature: 0,
        fallbackModel: AIModels.GEMINI_3_1_FLASH_LITE,
    },
    codeReview: {
        name: AIModels.CLAUDE_OPUS_4_8,
        reasoning_effort: 'high',
        max_tokens: 32000,
        temperature: 0.1,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
    },
    fileRegeneration: {
        name: AIModels.CLAUDE_OPUS_4_8,
        reasoning_effort: 'medium',
        max_tokens: 32000,
        temperature: 0,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
    },
    // Not used right now
    screenshotAnalysis: {
        name: AIModels.GEMINI_3_5_FLASH,
        reasoning_effort: 'medium',
        max_tokens: 8000,
        temperature: 0.1,
        fallbackModel: AIModels.GEMINI_3_1_FLASH_LITE,
    },
};


// Model validation utilities
export const ALL_AI_MODELS: readonly AIModels[] = Object.values(AIModels);
export type AIModelType = AIModels;

// Create tuple type for Zod enum validation
export const AI_MODELS_TUPLE = Object.values(AIModels) as [AIModels, ...AIModels[]];

export function isValidAIModel(model: string): model is AIModels {
    return Object.values(AIModels).includes(model as AIModels);
}

export function getValidAIModelsArray(): readonly AIModels[] {
    return ALL_AI_MODELS;
}
