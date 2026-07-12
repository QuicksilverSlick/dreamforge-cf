import { toast } from 'sonner';
import { generateId } from '@/utils/id-generator';
import type { RateLimitError, ConversationMessage } from '@/api-types';
import type { AgentRole } from 'shared/agents/activityDisplay';

export type ToolEvent = {
    name: string;
    status: 'start' | 'success' | 'error';
    timestamp: number;
    /** Tool arguments (already on the wire) — powers the detail line. */
    args?: Record<string, unknown>;
    /** Repeat count: N identical consecutive calls collapse into one row (×N). */
    count?: number;
};

/**
 * One plain-language line in a fix-cycle activity card ("Building the changes…",
 * "Your update is live — try it again now."). `tone` drives the icon/emphasis.
 */
export type ActivityLine = {
    text: string;
    role: AgentRole;
    tone: 'progress' | 'done' | 'attention';
    timestamp: number;
};

export interface SuggestionChip {
    id: string;
    label: string;
    benefit: string;
    scope: string;
    prompt: string;
    sparks: number;
}

export interface ImageConsentCard {
    images: Array<{ path: string; purpose: string }>;
    count: number;
    totalSparks: number;
}

export type ChatMessage = Omit<ConversationMessage, 'content'> & {
    content: string;
    ui?: {
        isThinking?: boolean;
        toolEvents?: ToolEvent[];
        /** Post-build enhancement chips — accepting one sends a normal priced request. */
        suggestions?: SuggestionChip[];
        /** Blueprint-image consent card (images debit Sparks). */
        imageConsent?: ImageConsentCard;
        /** Rolling plain-language narration of a fix cycle (one card per cycle). */
        activityLines?: ActivityLine[];
    };
};

/**
 * Check if a message ID should appear in conversational chat
 */
export function isConversationalMessage(messageId: string): boolean {
    const conversationalIds = [
        'main',
        'creating-blueprint',
        'conversation_response',
        'fetching-chat',
        'chat-not-found',
        'resuming-chat',
        'chat-welcome',
        'deployment-status',
        'code_reviewed',
        'improvement-suggestions',
        'image-consent',
    ];

    // `activity-<cycleId>` cards are narration WE deliberately create for a fix
    // cycle — admit them without widening the fixed list above (which would let
    // raw phase/deploy chatter through).
    return conversationalIds.includes(messageId)
        || messageId.startsWith('conv-')
        || messageId.startsWith('activity-');
}

/**
 * Append a narration line to the fix cycle's single rolling activity card
 * (conversationId `activity-<cycleId>`), creating the card on the first line.
 * One card per cycle keeps chat readable instead of one bubble per event.
 */
export function appendActivityLine(
    messages: ChatMessage[],
    cycleId: string,
    line: Omit<ActivityLine, 'timestamp'>,
): ChatMessage[] {
    const conversationId = `activity-${cycleId}`;
    const entry: ActivityLine = { ...line, timestamp: Date.now() };
    const idx = messages.findIndex(m => m.conversationId === conversationId && m.role === 'assistant');
    if (idx === -1) {
        return [...messages, { role: 'assistant', conversationId, content: '', ui: { activityLines: [entry] } }];
    }
    return messages.map((m, i) =>
        i === idx
            ? { ...m, ui: { ...m.ui, activityLines: [...(m.ui?.activityLines ?? []), entry] } }
            : m,
    );
}

/**
 * Create an assistant message
 */
export function createAIMessage(
    conversationId: string,
    content: string,
    isThinking?: boolean
): ChatMessage {
    return {
        role: 'assistant',
        conversationId,
        content,
        ui: { isThinking },
    };
}

/**
 * Create a user message
 */
export function createUserMessage(message: string): ChatMessage {
    return {
        role: 'user',
        conversationId: generateId(),
        content: message,
    };
}

/**
 * Handle rate limit errors consistently
 */
export function handleRateLimitError(
    rateLimitError: RateLimitError,
    onDebugMessage?: (
        type: 'error' | 'warning' | 'info' | 'websocket',
        message: string,
        details?: string,
        source?: string,
        messageType?: string,
        rawMessage?: unknown
    ) => void
): ChatMessage {
    let displayMessage = rateLimitError.message;
    
    if (rateLimitError.suggestions && rateLimitError.suggestions.length > 0) {
        displayMessage += `\n\nSuggestions:\n${rateLimitError.suggestions.map(s => `• ${s}`).join('\n')}`;
    }
    
    toast.error(displayMessage);
    
    onDebugMessage?.(
        'error',
        `Rate Limit: ${rateLimitError.limitType.replace('_', ' ')} limit exceeded`,
        `Limit: ${rateLimitError.limit} per ${Math.floor((rateLimitError.period || 0) / 3600)}h\nRetry after: ${(rateLimitError.period || 0) / 3600}h\n\nSuggestions:\n${rateLimitError.suggestions?.join('\n') || 'None'}`,
        'Rate Limiting',
        rateLimitError.limitType,
        rateLimitError
    );
    
    return createAIMessage(
        `rate_limit_${Date.now()}`,
        displayMessage
    );
}

/**
 * Add or update a message in the messages array
 */
export function addOrUpdateMessage(
    messages: ChatMessage[],
    newMessage: ChatMessage,
): ChatMessage[] {
    // Special handling for 'main' assistant message - update if thinking, otherwise append
    if (newMessage.conversationId === 'main') {
        const mainMessageIndex = messages.findIndex(m => m.conversationId === 'main' && m.ui?.isThinking);
        if (mainMessageIndex !== -1) {
            return messages.map((msg, index) =>
                index === mainMessageIndex 
                    ? { ...msg, ...newMessage }
                    : msg
            );
        }
    }
    // For all other messages, append
    return [...messages, newMessage];
}

/**
 * Handle streaming conversation messages
 */
export function handleStreamingMessage(
    messages: ChatMessage[],
    conversationId: string,
    chunk: string,
    isNewMessage: boolean
): ChatMessage[] {
    const existingMessageIndex = messages.findIndex(m => m.conversationId === conversationId && m.role === 'assistant');
    if (existingMessageIndex !== -1 && !isNewMessage) {
        // Append chunk to existing assistant message
        return messages.map((msg, index) =>
            index === existingMessageIndex
                ? { ...msg, content: msg.content + chunk }
                : msg
        );
    } else {
        // Create new streaming assistant message
        return [...messages, createAIMessage(conversationId, chunk, false)];
    }
}

/**
 * Append or update a tool event inline within an AI message bubble
 * - If a message with messageId doesn't exist yet, create a placeholder AI message with empty content
 * - If a matching 'start' exists and a 'success' comes in for the same tool, update that entry in place
 */
export function appendToolEvent(
    messages: ChatMessage[],
    conversationId: string,
    tool: { name: string; status: 'start' | 'success' | 'error'; args?: Record<string, unknown> }
): ChatMessage[] {
    const idx = messages.findIndex(m => m.conversationId === conversationId && m.role === 'assistant');
    const timestamp = Date.now();

    // If message is not present, create a new placeholder assistant message with tool event
    if (idx === -1) {
        const newMsg: ChatMessage = {
            role: 'assistant',
            conversationId,
            content: '',
            ui: { toolEvents: [{ name: tool.name, status: tool.status, timestamp, args: tool.args }] },
        };
        return [...messages, newMsg];
    }

    return messages.map((m, i) => {
        if (i !== idx) return m;
        const current = m.ui?.toolEvents ?? [];
        if (tool.status === 'success') {
            // Find last event for this tool and flip it to success
            for (let j = current.length - 1; j >= 0; j--) {
                if (current[j].name === tool.name) {
                    return {
                        ...m,
                        ui: {
                            ...m.ui,
                            toolEvents: current.map((ev, k) =>
                                k === j ? { ...ev, status: 'success', timestamp } : ev
                            ),
                        }
                    };
                }
            }
            // If no prior start, just append success as a separate line
            return { ...m, ui: { ...m.ui, toolEvents: [...current, { name: tool.name, status: 'success', timestamp, args: tool.args }] } };
        }
        // A 'start' identical to the last row (same tool, already running/done)
        // collapses into a ×N counter instead of stacking duplicate lines
        // (e.g. get_logs called 5 times in a row reads as one "×5" chip).
        const last = current[current.length - 1];
        if (last && last.name === tool.name && last.status !== 'error') {
            return {
                ...m,
                ui: {
                    ...m.ui,
                    toolEvents: current.map((ev, k) =>
                        k === current.length - 1
                            ? { ...ev, status: tool.status, timestamp, count: (ev.count ?? 1) + 1 }
                            : ev
                    ),
                },
            };
        }
        // Default: append event
        return { ...m, ui: { ...m.ui, toolEvents: [...current, { name: tool.name, status: tool.status, timestamp, args: tool.args }] } };
    });
}
