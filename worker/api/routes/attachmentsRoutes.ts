/**
 * Build attachment routes — authenticated upload of user files that feed a
 * build as context, and owner-gated download. Documents contain private data,
 * so every route requires auth (unlike the public preview-image routes).
 */

import { Hono } from 'hono';
import { AppEnv } from '../../types/appenv';
import { adaptController } from '../honoAdapter';
import { AttachmentsController } from '../controllers/attachments/controller';
import { AuthConfig, setAuthLevel } from '../../middleware/auth/routeAuth';

export function setupAttachmentRoutes(app: Hono<AppEnv>): void {
    const router = new Hono<AppEnv>();

    // Multipart upload (auth'd + auth-rate-limited by the middleware).
    router.post(
        '/',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(AttachmentsController, AttachmentsController.uploadAttachments),
    );

    // Owner-gated download: /api/attachments/<userId>/<id>/<file>.
    router.get(
        '/:userId/:id/:file',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(AttachmentsController, AttachmentsController.serveAttachment),
    );

    app.route('/api/attachments', router);
}
