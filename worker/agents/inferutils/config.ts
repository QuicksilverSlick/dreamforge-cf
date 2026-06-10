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


// Current posture (June 2026): coding + review roles run on Gemini 3.5 Flash
// (Google's GA frontier coding model), trivial roles on Gemini 3.1 Flash-Lite.
//
// NOTE: The max-quality target for the code-bearing roles is Claude Opus 4.8
// (CLAUDE_OPUS_4_8) with a Claude Sonnet 4.6 fallback — Opus 4.8 is the most
// capable model for long-horizon agentic coding and ~4x less likely than its
// predecessor to let flaws in its own code pass. That is blocked until the
// Anthropic provider credential is added to the AI Gateway secret store
// (alias `default` -> secret `anthropic_default`); without it every
// `anthropic/*` call returns gateway error 2041. Flip the roles below back to
// CLAUDE_OPUS_4_8 / fallback CLAUDE_SONNET_4_6 once that credential exists.
export const AGENT_CONFIG: AgentConfig = {
    templateSelection: {
        name: AIModels.GEMINI_3_1_FLASH_LITE,
        max_tokens: 2000,
        fallbackModel: AIModels.GEMINI_3_5_FLASH,
        temperature: 0.6,
    },
    blueprint: {
        name: AIModels.GEMINI_3_5_FLASH,
        reasoning_effort: 'medium',
        max_tokens: 64000,
        fallbackModel: AIModels.GEMINI_2_5_PRO,
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
        name: AIModels.GEMINI_3_5_FLASH,
        reasoning_effort: 'low',
        max_tokens: 32000,
        temperature: 0.2,
        fallbackModel: AIModels.GEMINI_2_5_PRO,
    },
    firstPhaseImplementation: {
        name: AIModels.GEMINI_3_5_FLASH,
        reasoning_effort: 'medium',
        max_tokens: 64000,
        temperature: 0.2,
        fallbackModel: AIModels.GEMINI_2_5_PRO,
    },
    phaseImplementation: {
        name: AIModels.GEMINI_3_5_FLASH,
        reasoning_effort: 'medium',
        max_tokens: 64000,
        temperature: 0.2,
        fallbackModel: AIModels.GEMINI_2_5_PRO,
    },
    realtimeCodeFixer: {
        name: AIModels.DISABLED,
        reasoning_effort: 'low',
        max_tokens: 32000,
        temperature: 1,
        fallbackModel: AIModels.GEMINI_3_5_FLASH,
    },
    fastCodeFixer: {
        name: AIModels.GEMINI_3_5_FLASH,
        reasoning_effort: undefined,
        max_tokens: 64000,
        temperature: 0.0,
        fallbackModel: AIModels.GEMINI_2_5_FLASH,
    },
    conversationalResponse: {
        name: AIModels.GEMINI_3_5_FLASH,
        reasoning_effort: 'low',
        max_tokens: 4000,
        temperature: 0,
        fallbackModel: AIModels.GEMINI_3_1_FLASH_LITE,
    },
    codeReview: {
        name: AIModels.GEMINI_3_5_FLASH,
        reasoning_effort: 'medium',
        max_tokens: 32000,
        temperature: 0.1,
        fallbackModel: AIModels.GEMINI_2_5_PRO,
    },
    fileRegeneration: {
        name: AIModels.GEMINI_3_5_FLASH,
        reasoning_effort: 'low',
        max_tokens: 32000,
        temperature: 0,
        fallbackModel: AIModels.GEMINI_2_5_PRO,
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
