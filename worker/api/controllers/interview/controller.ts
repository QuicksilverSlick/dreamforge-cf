/**
 * Intake interview ("21 Questions") endpoints. Sessions live in KV with a
 * sliding TTL; the deterministic engine drives everything, with exactly two
 * model calls per interview (triage at start, synthesis at finish). Interview
 * turns are free for users — chip clicks never touch a model.
 * Spec: docs/specs/21-QUESTIONS-INTAKE-INTERVIEW.md §7.2
 */

import { BaseController } from '../baseController';
import { createLogger } from '../../../logger';
import { generateId } from '../../../utils/idGenerator';
import {
    advance,
    applyTriage,
    buildSummary,
    createSession,
    getProgress,
    InterviewInputError,
    submitAnswer,
} from '../../../agents/interview/engine';
import { runTriage } from '../../../agents/interview/triage';
import { runSynthesis } from '../../../agents/interview/synthesis';
import type { InterviewSession } from '../../../agents/interview/types';
import type { InferenceContext } from '../../../agents/inferutils/config.types';
import type { ApiResponse, ControllerResponse } from '../types';
import type { RouteContext } from '../../types/route-context';
import type { InterviewStateData, StartInterviewRequest, SubmitAnswerRequest } from './types';

const SESSION_TTL_SECONDS = 60 * 60;

function sessionKey(sessionId: string): string {
    return `interview:${sessionId}`;
}

async function loadSession(env: Env, sessionId: string, userId: string): Promise<InterviewSession | null> {
    const raw = await env.VibecoderStore.get(sessionKey(sessionId));
    if (!raw) return null;
    const session = JSON.parse(raw) as InterviewSession;
    if (session.userId !== userId) return null;
    return session;
}

async function saveSession(env: Env, session: InterviewSession): Promise<void> {
    await env.VibecoderStore.put(sessionKey(session.id), JSON.stringify(session), {
        expirationTtl: SESSION_TTL_SECONDS,
    });
}

function buildInferenceContext(sessionId: string, userId: string): InferenceContext {
    return {
        agentId: sessionId,
        userId,
        enableRealtimeCodeFix: false,
        enableFastSmartCodeFix: false,
    };
}

function toStateData(session: InterviewSession): InterviewStateData {
    const question = session.state.finished ? null : advance(session);
    return {
        sessionId: session.id,
        done: session.state.finished,
        question,
        progress: getProgress(session),
        summary: buildSummary(session),
        preAnswered: session.state.preAnsweredIds,
        spec: session.spec,
    };
}

async function finishSession(env: Env, session: InterviewSession): Promise<void> {
    session.state.finished = true;
    session.state.currentQuestionId = null;
    if (!session.spec) {
        session.spec = await runSynthesis(env, buildInferenceContext(session.id, session.userId), session);
    }
}

/**
 * Opens the next question, auto-finishing when none remains (everything
 * answered/pre-answered or budget exhausted), then persists and reports.
 */
async function resolveAndSave(env: Env, session: InterviewSession): Promise<InterviewStateData> {
    let data = toStateData(session);
    if (!data.done && !data.question) {
        await finishSession(env, session);
        data = toStateData(session);
    }
    await saveSession(env, session);
    return data;
}

export class InterviewController extends BaseController {
    static logger = createLogger('InterviewController');

    /**
     * POST /api/interview — start a session. The landing-box prompt seeds the
     * triage pass so already-answered questions are never asked.
     */
    static async startInterview(request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<InterviewStateData>>> {
        try {
            const user = context.user!;
            const bodyResult = await InterviewController.parseJsonBody<StartInterviewRequest>(request);
            if (!bodyResult.success) {
                return bodyResult.response! as ControllerResponse<ApiResponse<InterviewStateData>>;
            }
            const query = bodyResult.data?.query?.trim() ?? '';
            if (query.length > 8000) {
                return InterviewController.createErrorResponse<InterviewStateData>('The idea text is too long', 400);
            }

            const session = createSession(generateId(), user.id, query, Date.now());
            const triage = await runTriage(env, buildInferenceContext(session.id, user.id), query);
            if (triage) {
                applyTriage(session, triage);
            }

            return InterviewController.createSuccessResponse(await resolveAndSave(env, session));
        } catch (error) {
            this.logger.error('Failed to start interview', error);
            return InterviewController.createErrorResponse<InterviewStateData>('Failed to start the interview', 500);
        }
    }

    /**
     * POST /api/interview/:sessionId/answer — answer the open question (or
     * revise an earlier one after "Change something").
     */
    static async submitAnswer(request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<InterviewStateData>>> {
        try {
            const user = context.user!;
            const sessionId = context.pathParams.sessionId;
            if (!sessionId) {
                return InterviewController.createErrorResponse<InterviewStateData>('Session ID is required', 400);
            }
            const bodyResult = await InterviewController.parseJsonBody<SubmitAnswerRequest>(request);
            if (!bodyResult.success) {
                return bodyResult.response! as ControllerResponse<ApiResponse<InterviewStateData>>;
            }
            const { questionId, answer } = bodyResult.data ?? {};
            if (!questionId || !answer) {
                return InterviewController.createErrorResponse<InterviewStateData>('questionId and answer are required', 400);
            }

            const session = await loadSession(env, sessionId, user.id);
            if (!session) {
                return InterviewController.createErrorResponse<InterviewStateData>('Interview session not found or expired', 404);
            }

            try {
                submitAnswer(session, questionId, answer);
            } catch (error) {
                if (error instanceof InterviewInputError) {
                    return InterviewController.createErrorResponse<InterviewStateData>(error.message, 400);
                }
                throw error;
            }

            if (session.state.finished) {
                await finishSession(env, session);
            }
            return InterviewController.createSuccessResponse(await resolveAndSave(env, session));
        } catch (error) {
            this.logger.error('Failed to submit interview answer', error);
            return InterviewController.createErrorResponse<InterviewStateData>('Failed to record the answer', 500);
        }
    }

    /**
     * POST /api/interview/:sessionId/finish — "Just build it with what you've
     * got": synthesize the spec from whatever has been answered so far.
     */
    static async finishInterview(_request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<InterviewStateData>>> {
        try {
            const user = context.user!;
            const sessionId = context.pathParams.sessionId;
            if (!sessionId) {
                return InterviewController.createErrorResponse<InterviewStateData>('Session ID is required', 400);
            }
            const session = await loadSession(env, sessionId, user.id);
            if (!session) {
                return InterviewController.createErrorResponse<InterviewStateData>('Interview session not found or expired', 404);
            }
            await finishSession(env, session);
            return InterviewController.createSuccessResponse(await resolveAndSave(env, session));
        } catch (error) {
            this.logger.error('Failed to finish interview', error);
            return InterviewController.createErrorResponse<InterviewStateData>('Failed to finish the interview', 500);
        }
    }

    /**
     * GET /api/interview/:sessionId — resume after a refresh.
     */
    static async getSession(_request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<InterviewStateData>>> {
        try {
            const user = context.user!;
            const sessionId = context.pathParams.sessionId;
            if (!sessionId) {
                return InterviewController.createErrorResponse<InterviewStateData>('Session ID is required', 400);
            }
            const session = await loadSession(env, sessionId, user.id);
            if (!session) {
                return InterviewController.createErrorResponse<InterviewStateData>('Interview session not found or expired', 404);
            }
            return InterviewController.createSuccessResponse(toStateData(session));
        } catch (error) {
            this.logger.error('Failed to load interview session', error);
            return InterviewController.createErrorResponse<InterviewStateData>('Failed to load the interview', 500);
        }
    }
}
