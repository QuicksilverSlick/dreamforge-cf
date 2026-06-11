/**
 * Intake interview API types.
 */

import type {
    InterviewAnswer,
    InterviewProgress,
    InterviewSpec,
    InterviewSummary,
    QuestionPayload,
} from '../../../agents/interview/types';

export interface StartInterviewRequest {
    query?: string;
}

export interface SubmitAnswerRequest {
    questionId: string;
    answer: InterviewAnswer;
}

export interface InterviewStateData {
    sessionId: string;
    done: boolean;
    question: QuestionPayload | null;
    progress: InterviewProgress;
    summary: InterviewSummary;
    /** Question ids answered by triage from the initial prompt. */
    preAnswered: string[];
    /** Present once the interview is finished and synthesized. */
    spec: InterviewSpec | null;
}
