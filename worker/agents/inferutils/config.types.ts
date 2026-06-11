/**
 * Config Types - Pure type definitions only
 * Extracted from config.ts to avoid importing logic code into frontend
 */

import { ReasoningEffort } from "openai/resources.mjs";
// import { LLMCallsRateLimitConfig } from "../../services/rate-limit/config";

export enum AIModels {
    DISABLED = 'disabled',

	GEMINI_2_0_FLASH = 'google-ai-studio/gemini-2.0-flash',
	GEMINI_2_5_PRO = 'google-ai-studio/gemini-2.5-pro',
	GEMINI_2_5_FLASH = 'google-ai-studio/gemini-2.5-flash',
	GEMINI_2_5_FLASH_LITE = 'google-ai-studio/gemini-2.5-flash-lite',

	GEMINI_1_5_FLASH_8B = 'google-ai-studio/gemini-1.5-flash-8b-latest',
    GEMINI_2_5_FLASH_LATEST = 'google-ai-studio/gemini-2.5-flash-latest',
    GEMINI_2_5_FLASH_LITE_LATEST = 'google-ai-studio/gemini-2.5-flash-lite-latest',
    GEMINI_2_5_PRO_LATEST = 'google-ai-studio/gemini-2.5-pro-latest',

	GEMINI_2_5_PRO_PREVIEW_05_06 = 'google-ai-studio/gemini-2.5-pro-preview-05-06',
	GEMINI_2_5_FLASH_PREVIEW_04_17 = 'google-ai-studio/gemini-2.5-flash-preview-04-17',
	GEMINI_2_5_FLASH_PREVIEW_05_20 = 'google-ai-studio/gemini-2.5-flash-preview-05-20',
	GEMINI_2_5_PRO_PREVIEW_06_05 = 'google-ai-studio/gemini-2.5-pro-preview-06-05',

	// Gemini 3.x (current generation, June 2026)
	GEMINI_3_5_FLASH = 'google-ai-studio/gemini-3.5-flash',
	GEMINI_3_1_FLASH_LITE = 'google-ai-studio/gemini-3.1-flash-lite',
	GEMINI_3_1_PRO_PREVIEW = 'google-ai-studio/gemini-3.1-pro-preview',
	GEMINI_3_FLASH_PREVIEW = 'google-ai-studio/gemini-3-flash-preview',

	CLAUDE_3_5_SONNET_LATEST = 'anthropic/claude-3-5-sonnet-latest',
	CLAUDE_3_7_SONNET_20250219 = 'anthropic/claude-3-7-sonnet-20250219',
	CLAUDE_4_OPUS = 'anthropic/claude-opus-4-20250514',
	CLAUDE_4_SONNET = 'anthropic/claude-sonnet-4-20250514',

	// Claude 4.x (current generation, June 2026)
	CLAUDE_OPUS_4_8 = 'anthropic/claude-opus-4-8',
	CLAUDE_SONNET_4_6 = 'anthropic/claude-sonnet-4-6',
	CLAUDE_HAIKU_4_5 = 'anthropic/claude-haiku-4-5',

	OPENAI_O3 = 'openai/o3',
	OPENAI_O4_MINI = 'openai/o4-mini',
	OPENAI_CHATGPT_4O_LATEST = 'openai/chatgpt-4o-latest',
	OPENAI_4_1 = 'openai/gpt-4.1-2025-04-14',
    OPENAI_5 = 'openai/gpt-5',
    OPENAI_5_MINI = 'openai/gpt-5-mini',
    OPENAI_OSS = 'openai/gpt-oss-120b',

    // GPT-5.4 / 5.5 (current generation, June 2026; gpt-5 / gpt-5-mini sunset)
    OPENAI_5_5 = 'openai/gpt-5.5',
    OPENAI_5_4 = 'openai/gpt-5.4',
    OPENAI_5_4_MINI = 'openai/gpt-5.4-mini',

    // OPENROUTER_QWEN_3_CODER = '[openrouter]qwen/qwen3-coder',
    // OPENROUTER_KIMI_2_5 = '[openrouter]moonshotai/kimi-k2',

    // Cerebras models
    CEREBRAS_GPT_OSS = 'cerebras/gpt-oss-120b',
    CEREBRAS_QWEN_3_CODER = 'cerebras/qwen-3-coder-480b',
}

export interface ModelConfig {
    name: AIModels | string;
    reasoning_effort?: ReasoningEffort;
    max_tokens?: number;
    temperature?: number;
    fallbackModel?: AIModels | string;
}

export interface AgentConfig {
    templateSelection: ModelConfig;
    blueprint: ModelConfig;
    projectSetup: ModelConfig;
    phaseGeneration: ModelConfig;
    phaseImplementation: ModelConfig;
    firstPhaseImplementation: ModelConfig;
    codeReview: ModelConfig;
    fileRegeneration: ModelConfig;
    screenshotAnalysis: ModelConfig;
    realtimeCodeFixer: ModelConfig;
    fastCodeFixer: ModelConfig;
    conversationalResponse: ModelConfig;
    interviewTriage: ModelConfig;
    interviewSynthesis: ModelConfig;
}

// Provider and reasoning effort types for validation
export type ProviderOverrideType = 'cloudflare' | 'direct';
export type ReasoningEffortType = 'low' | 'medium' | 'high';

export type AgentActionKey = keyof AgentConfig;

export type InferenceMetadata = {
    agentId: string;
    userId: string;
    // llmRateLimits: LLMCallsRateLimitConfig;
}

/**
 * Runtime-only inference overrides — BYOK provider keys and AI-Gateway
 * redirection. Ported from upstream as part of M3 commit 2b for parity
 * with the new agent's `metadata.runtimeOverrides` field. The fork
 * doesn't yet populate these (BYOK isn't a fork feature), but typing
 * them now lets the ported codingAgent + behaviors compile cleanly.
 */
export type InferenceRuntimeOverrides = {
    /** Provider API keys (BYOK) keyed by provider id, e.g. "openai" -> key. */
    userApiKeys?: Record<string, string>;
    /** Optional AI gateway override (baseUrl + token). */
    aiGatewayOverride?: { baseUrl: string; token: string };
};

export interface InferenceContext extends InferenceMetadata {
    userModelConfigs?: Record<AgentActionKey, ModelConfig>;
    enableRealtimeCodeFix: boolean;
    enableFastSmartCodeFix: boolean;
}
