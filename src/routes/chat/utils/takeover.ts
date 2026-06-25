import type { UserRole } from '@/api-types';

/**
 * The consent prompt shown to the REAL user when a privileged impersonating
 * operator wants to take over their live session. Role-only — never the
 * operator's name (the server does not send it, to avoid leaking operator
 * identity).
 */
export interface TakeoverRequest {
	requestId: string;
	operatorRole: UserRole | null;
	isAgent: boolean;
	reasonUser: string;
	/** Epoch ms at which the request auto-denies if unanswered. */
	expiresAt: number;
}

/** The OPERATOR's view of their own in-flight takeover request. */
export interface TakeoverStatus {
	kind: 'waiting' | 'denied' | 'timed_out';
	/** Present while 'waiting' — epoch ms the request auto-denies. */
	expiresAt?: number;
}
