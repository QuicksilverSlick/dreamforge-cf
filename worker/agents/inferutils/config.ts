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


// Current posture (June 2026): all roles run on Google models through the AI
// Gateway OpenAI-compat endpoint — the path that is credentialed and proven in
// prod. Quality is tuned per role rather than via one max model:
//   - blueprint + firstPhaseImplementation: Gemini 3.1 Pro Preview at high
//     reasoning effort. These are single-pass, design-defining steps where 3.1
//     Pro's single-file reasoning is strongest; high effort lets it fully apply
//     the design skill.
//   - phaseImplementation + codeReview: Gemini 3.5 Flash (Google's newest GA
//     frontier model, which beats 3.1 Pro on long-horizon agentic benchmarks)
//     at high reasoning effort for the multi-step phase loop.
//   - trivial/latency roles: Gemini 3.5 Flash / 3.1 Flash-Lite.
//
// NOTE: Claude Opus 4.8 is NOT usable here. The whole inference layer calls
// models via the OpenAI SDK -> AI Gateway `/compat` endpoint, and Anthropic's
// OpenAI-compat layer silently drops `response_format` (our structured
// outputs), so Claude code-gen calls fail schema validation at agent init
// (verified: two prod outages, builds 74b95461 & 3a641bc9). Upstream
// cloudflare/vibesdk reaches the same conclusion — it routes Gemini 3 Pro +
// Grok, never Claude. Using Opus requires a native Anthropic Messages backend
// (`/ai/v1/messages`), a separate project, not a config flip.
export const AGENT_CONFIG: AgentConfig = {
    templateSelection: {
        name: AIModels.GEMINI_3_1_FLASH_LITE,
        max_tokens: 2000,
        fallbackModel: AIModels.GEMINI_3_5_FLASH,
        temperature: 0.6,
    },
    blueprint: {
        name: AIModels.GEMINI_3_1_PRO_PREVIEW,
        reasoning_effort: 'high',
        max_tokens: 64000,
        fallbackModel: AIModels.GEMINI_3_5_FLASH,
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
        name: AIModels.GEMINI_3_1_PRO_PREVIEW,
        reasoning_effort: 'high',
        max_tokens: 64000,
        temperature: 0.2,
        fallbackModel: AIModels.GEMINI_3_5_FLASH,
    },
    phaseImplementation: {
        name: AIModels.GEMINI_3_5_FLASH,
        reasoning_effort: 'high',
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
    // Intake interview (21 Questions): triage extracts what the first prompt
    // already answered; synthesis folds answers into the build spec. Both are
    // single structured-output calls outside the generation loop.
    interviewTriage: {
        name: AIModels.GEMINI_3_1_FLASH_LITE,
        reasoning_effort: 'low',
        max_tokens: 4000,
        temperature: 0,
        fallbackModel: AIModels.GEMINI_3_5_FLASH,
    },
    interviewSynthesis: {
        name: AIModels.GEMINI_3_5_FLASH,
        reasoning_effort: 'low',
        max_tokens: 8000,
        temperature: 0.2,
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
    // Visual review of post-deploy preview screenshots; findings feed the
    // next phase generation (behaviors/base.ts queueScreenshotAnalysis).
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
