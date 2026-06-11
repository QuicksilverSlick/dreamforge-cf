/**
 * Interview Session Service
 * D1-backed storage for intake-interview sessions. Strongly consistent —
 * every chip click writes the session and the next request must read it
 * back, which rules out KV (eventual consistency serves stale questions).
 */

import { BaseService } from './BaseService';
import * as schema from '../schema';
import { and, eq, lt } from 'drizzle-orm';
import type { InterviewSession } from '../../agents/interview/types';

const SESSION_TTL_MS = 60 * 60 * 1000;

export class InterviewSessionService extends BaseService {
    /**
     * Loads a session scoped to its owner. Expired sessions read as absent.
     */
    async getSession(sessionId: string, userId: string): Promise<InterviewSession | null> {
        try {
            const row = await this.database
                .select()
                .from(schema.interviewSessions)
                .where(
                    and(
                        eq(schema.interviewSessions.id, sessionId),
                        eq(schema.interviewSessions.userId, userId)
                    )
                )
                .get();

            if (!row || row.expiresAt.getTime() <= Date.now()) {
                return null;
            }
            return JSON.parse(row.data) as InterviewSession;
        } catch (error) {
            this.logger.error('Failed to load interview session', error);
            return null;
        }
    }

    /**
     * Upserts the session and slides its expiry window.
     */
    async putSession(session: InterviewSession): Promise<void> {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);
        const data = JSON.stringify(session);
        await this.database
            .insert(schema.interviewSessions)
            .values({
                id: session.id,
                userId: session.userId,
                data,
                expiresAt,
                createdAt: now,
                updatedAt: now,
            })
            .onConflictDoUpdate({
                target: schema.interviewSessions.id,
                set: { data, expiresAt, updatedAt: now },
            });
    }

    /**
     * Opportunistic cleanup of expired rows; failures are non-fatal.
     */
    async deleteExpired(): Promise<void> {
        try {
            await this.database
                .delete(schema.interviewSessions)
                .where(lt(schema.interviewSessions.expiresAt, new Date()));
        } catch (error) {
            this.logger.error('Failed to clean up expired interview sessions', error);
        }
    }
}
