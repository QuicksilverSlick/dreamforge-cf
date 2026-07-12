/**
 * Human-readable display vocabulary for AI agent activity, shared by the
 * worker and the SPA (importable from both `worker/` and `src/`).
 *
 * The chat used to render raw internal tool names ("Completed get_logs" ×5),
 * which means nothing to the person whose app is being built. This module is
 * the single source of truth translating internal identifiers into
 * plain-language labels + a small role vocabulary, so a non-technical user can
 * follow what the agent is doing and WHICH agent is doing it.
 *
 * Keep this file dependency-free (no imports from `worker/`): `shared/` is
 * consumed by the client bundle, so a worker import here would create a cycle
 * and pull server code into the browser.
 */

/**
 * The user-facing "who is working" vocabulary. Every internal agent operation
 * (AGENT_CONFIG key) and every activity maps onto exactly one of these, so the
 * user sees a stable, tiny cast of characters rather than 15 internal names.
 */
export type AgentRole = 'architect' | 'builder' | 'debugger' | 'reviewer' | 'assistant';

export interface RoleDisplay {
    /** Short badge label shown next to an activity line. */
    label: string;
    /** One-line "what this role does", for tooltips/legends. */
    blurb: string;
}

export const ROLE_DISPLAY: Record<AgentRole, RoleDisplay> = {
    architect: { label: 'Architect', blurb: 'Plans what to build and how the pieces fit together.' },
    builder: { label: 'Builder', blurb: 'Writes the code and publishes updates to your preview.' },
    debugger: { label: 'Debugger', blurb: 'Investigates errors and fixes what is broken.' },
    reviewer: { label: 'Reviewer', blurb: 'Checks the code for problems before it ships.' },
    assistant: { label: 'Assistant', blurb: 'Talks with you and coordinates the work.' },
};

export interface ToolDisplay {
    /** Plain-language present-tense label, e.g. "Reading your app's error logs". */
    label: string;
    /** Which agent this activity belongs to. */
    role: AgentRole;
    /**
     * Optional extra detail derived from the tool's arguments (already on the
     * wire), e.g. the text of a queued request. Returns undefined when there is
     * nothing useful to add.
     */
    detail?: (args: Record<string, unknown> | undefined) => string | undefined;
}

/** Trim a free-text arg to a short, single-line excerpt for a detail chip. */
function excerpt(value: unknown, max = 90): string | undefined {
    if (typeof value !== 'string') return undefined;
    const clean = value.replace(/\s+/g, ' ').trim();
    if (!clean) return undefined;
    return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

/**
 * The six conversational tools (worker/agents/tools/customTools.ts) plus the
 * pseudo-activities that ride the same channel. Keys are the raw internal
 * tool names as they arrive on the wire.
 */
export const TOOL_DISPLAY: Record<string, ToolDisplay> = {
    get_logs: {
        label: "Reading your app's activity logs to find the problem",
        role: 'debugger',
    },
    queue_request: {
        label: 'Adding your request to the build list',
        role: 'assistant',
        detail: (args) => excerpt(args?.request ?? args?.modificationRequest),
    },
    deploy_preview: {
        label: 'Publishing the latest version to your preview',
        role: 'builder',
    },
    generate_image: {
        label: 'Creating an image for your app',
        role: 'builder',
        detail: (args) => excerpt(args?.prompt, 70),
    },
    web_search: {
        label: 'Looking something up on the web',
        role: 'assistant',
        detail: (args) => excerpt(args?.query, 70),
    },
    use_attached_image: {
        label: 'Adding your image to the app',
        role: 'builder',
        detail: (args) => excerpt(args?.path, 70),
    },
    submit_feedback: {
        label: 'Noting feedback about the build',
        role: 'assistant',
    },
    // Pseudo-activities that use the same tool-event channel.
    summarize_history: {
        label: 'Summarizing the conversation so far',
        role: 'assistant',
    },
};

/** Convert an unknown/raw tool name into a readable Title Case-ish phrase. */
function humanizeToolName(name: string): string {
    const words = name.replace(/[_-]+/g, ' ').trim();
    if (!words) return 'Working';
    return words.charAt(0).toUpperCase() + words.slice(1);
}

export interface ResolvedToolDisplay {
    label: string;
    role: AgentRole;
    roleLabel: string;
    detail?: string;
}

/**
 * Resolve a tool event to its display form. Falls back to a humanized name +
 * the Assistant role for any tool not in the map, so a newly-added tool
 * degrades gracefully instead of leaking a raw identifier.
 */
export function getToolDisplay(name: string, args?: Record<string, unknown>): ResolvedToolDisplay {
    const entry = TOOL_DISPLAY[name];
    if (!entry) {
        return { label: humanizeToolName(name), role: 'assistant', roleLabel: ROLE_DISPLAY.assistant.label };
    }
    return {
        label: entry.label,
        role: entry.role,
        roleLabel: ROLE_DISPLAY[entry.role].label,
        detail: entry.detail?.(args),
    };
}
