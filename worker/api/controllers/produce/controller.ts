/**
 * PRODUCE application intake — the public form on the marketing site
 * (getdreamforge.com/apply) POSTs here. No auth: the applicant is a prospect,
 * not a user.
 *
 * Abuse posture: the global IP-keyed rate limiter (app.ts) still applies, a
 * honeypot field triggers a silent fake success, input is zod-validated, and
 * the controller enforces the Origin allowlist server-side — the CSRF
 * double-submit check is skipped for this path in app.ts because the
 * marketing domain never receives a CSRF cookie, and the endpoint carries no
 * ambient credentials for a forged request to ride.
 *
 * Emails are best-effort via ctx.waitUntil AFTER the D1 insert: an email
 * outage never loses an application.
 */

import { BaseController } from '../baseController';
import { successResponse, errorResponse } from '../../responses';
import { RouteContext } from '../../types/route-context';
import { createDatabaseService } from '../../../database/database';
import * as schema from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '../../../utils/idGenerator';
import { EmailService } from '../../../services/email/EmailService';
import { isOriginAllowed } from '../../../config/security';
import { applyBodySchema, PRODUCE_TIER_LABELS } from './schemas';

export class ProduceController extends BaseController {
    static async submitApplication(
        request: Request,
        env: Env,
        ctx: ExecutionContext,
        _context: RouteContext,
    ): Promise<Response> {
        const origin = request.headers.get('Origin');
        if (origin && !isOriginAllowed(env, origin)) {
            return errorResponse('Origin not allowed', 403);
        }

        const parsed = await this.parseJsonBody<unknown>(request);
        if (!parsed.success) {
            return parsed.response ?? errorResponse('Invalid request body', 400);
        }
        const validation = applyBodySchema.safeParse(parsed.data ?? {});
        if (!validation.success) {
            return errorResponse(validation.error.issues[0]?.message ?? 'Invalid application', 400);
        }
        const body = validation.data;

        // Honeypot tripped: pretend success, store nothing, send nothing.
        if (body.website) {
            return successResponse({ received: true });
        }

        const db = createDatabaseService(env).db;
        const id = generateId();
        await db.insert(schema.produceApplications).values({
            id,
            name: body.name,
            email: body.email,
            company: body.company || null,
            tier: body.tier,
            projectDescription: body.projectDescription,
            source: body.source || null,
        });

        const emailService = new EmailService(env);
        const tierLabel = PRODUCE_TIER_LABELS[body.tier];
        ctx.waitUntil(
            (async () => {
                const [ack] = await Promise.all([
                    emailService.sendProduceApplicationAck({
                        to: body.email,
                        name: body.name,
                        tierLabel,
                    }),
                    emailService.sendProduceApplicationNotice({
                        name: body.name,
                        email: body.email,
                        company: body.company || null,
                        tierLabel,
                        projectDescription: body.projectDescription,
                    }),
                ]);
                if (ack.sent) {
                    await db
                        .update(schema.produceApplications)
                        .set({ ackSent: true })
                        .where(eq(schema.produceApplications.id, id));
                }
            })(),
        );

        return successResponse({ received: true });
    }
}
