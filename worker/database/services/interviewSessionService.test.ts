/**
 * InterviewSessionService tests — D1-backed session storage. The properties
 * under test are the ones the interview's correctness depends on:
 * read-your-writes on rapid successive updates, owner scoping, expiry.
 */

import { env, applyD1Migrations } from 'cloudflare:test';
import type { D1Migration } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
import { InterviewSessionService } from './InterviewSessionService';
import { createSession, submitAnswer, advance } from '../../agents/interview/engine';

declare module 'cloudflare:test' {
    interface ProvidedEnv extends Env {
        TEST_MIGRATIONS: D1Migration[];
    }
}

const USER_A = 'interview-user-a';
const USER_B = 'interview-user-b';

async function insertUser(id: string): Promise<void> {
    await env.DB.prepare(
        'INSERT INTO users (id, email, display_name, provider, provider_id) VALUES (?, ?, ?, ?, ?)'
    )
        .bind(id, `${id}@example.com`, id, 'github', `provider-${id}`)
        .run();
}

beforeAll(async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
    await insertUser(USER_A);
    await insertUser(USER_B);
});

describe('InterviewSessionService', () => {
    it('reads its own writes across rapid successive updates', async () => {
        const service = new InterviewSessionService(env);
        const session = createSession('rapid-session', USER_A, 'a booking app', Date.now());
        await service.putSession(session);

        // Simulate chip-speed answering: mutate -> save -> immediately reload,
        // five times in a row. Every reload must observe the latest answer.
        for (let i = 0; i < 5; i++) {
            const loaded = await service.getSession('rapid-session', USER_A);
            expect(loaded).not.toBeNull();
            const question = advance(loaded!);
            if (!question) break;
            submitAnswer(
                loaded!,
                question.id,
                question.kind === 'free'
                    ? { kind: 'text', text: `answer ${i}` }
                    : { kind: 'chips', chipIds: [question.chips[0].id] },
            );
            await service.putSession(loaded!);

            const reloaded = await service.getSession('rapid-session', USER_A);
            expect(reloaded!.state.answers[question.id]).toEqual(loaded!.state.answers[question.id]);
            expect(reloaded!.state.askedQuestionIds).toEqual(loaded!.state.askedQuestionIds);
        }
    });

    it('scopes sessions to their owner', async () => {
        const service = new InterviewSessionService(env);
        await service.putSession(createSession('owned-session', USER_A, '', Date.now()));

        expect(await service.getSession('owned-session', USER_B)).toBeNull();
        expect(await service.getSession('owned-session', USER_A)).not.toBeNull();
    });

    it('treats expired sessions as absent and cleans them up', async () => {
        const service = new InterviewSessionService(env);
        await service.putSession(createSession('expired-session', USER_A, '', Date.now()));
        await env.DB.prepare('UPDATE interview_sessions SET expires_at = ? WHERE id = ?')
            .bind(Math.floor(Date.now() / 1000) - 60, 'expired-session')
            .run();

        expect(await service.getSession('expired-session', USER_A)).toBeNull();

        await service.deleteExpired();
        const row = await env.DB.prepare('SELECT id FROM interview_sessions WHERE id = ?')
            .bind('expired-session')
            .first();
        expect(row).toBeNull();
    });
});
