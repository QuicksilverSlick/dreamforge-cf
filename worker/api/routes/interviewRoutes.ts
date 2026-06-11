/**
 * Intake interview ("21 Questions") routes.
 */

import { InterviewController } from '../controllers/interview/controller';
import { Hono } from 'hono';
import { AppEnv } from '../../types/appenv';
import { adaptController } from '../honoAdapter';
import { AuthConfig, setAuthLevel } from '../../middleware/auth/routeAuth';

export function setupInterviewRoutes(app: Hono<AppEnv>): void {
    const interviewRouter = new Hono<AppEnv>();

    interviewRouter.post('/', setAuthLevel(AuthConfig.authenticated), adaptController(InterviewController, InterviewController.startInterview));
    interviewRouter.get('/:sessionId', setAuthLevel(AuthConfig.authenticated), adaptController(InterviewController, InterviewController.getSession));
    interviewRouter.post('/:sessionId/answer', setAuthLevel(AuthConfig.authenticated), adaptController(InterviewController, InterviewController.submitAnswer));
    interviewRouter.post('/:sessionId/finish', setAuthLevel(AuthConfig.authenticated), adaptController(InterviewController, InterviewController.finishInterview));

    app.route('/api/interview', interviewRouter);
}
