import { BaseController } from '../baseController';
import type { ControllerResponse, ApiResponse } from '../types';
import type { RouteContext } from '../../types/route-context';
import { createLogger } from '../../../logger';
import { ScreenshotSecurity } from '../../../utils/screenshot-security';

// -------------------------
// Helpers
// -------------------------
function isValidAppId(id: string): boolean {
    // Allow alphanumeric, underscore, dash. Prevent dots and slashes.
    // Length 1-128.
    return /^[A-Za-z0-9_-]{1,128}$/.test(id);
}

function validateFileName(file: string): string | null {
    // Reject any traversal or path separators
    if (file.includes('..') || file.includes('/') || file.includes('\\') || file.includes('\0')) {
        return null;
    }
    // Enforce simple filename pattern
    if (!/^[A-Za-z0-9._-]{1,128}$/.test(file)) {
        return null;
    }
    // Disallow leading dot files
    if (file.startsWith('.')) {
        return null;
    }
    // Validate extension
    const extIndex = file.lastIndexOf('.');
    if (extIndex <= 0 || extIndex === file.length - 1) {
        return null;
    }
    const ext = file.substring(extIndex + 1).toLowerCase();
    const allowed = new Set(['png', 'jpg', 'jpeg', 'webp']);
    if (!allowed.has(ext)) {
        return null;
    }
    return file;
}

function getMimeByExtension(file: string): string | undefined {
    const ext = file.substring(file.lastIndexOf('.') + 1).toLowerCase();
    switch (ext) {
        case 'png': return 'image/png';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'webp': return 'image/webp';
        default: return undefined;
    }
}
// -------------------------
// Validators for the public R2-image serve paths (`/api/generated/*` and
// `/api/uploads/*`). These are intentionally looser than the screenshot
// validators (which use a single-segment `:id/:file` pattern) because the
// R2 keys can be either 1-segment (`generated/<filename>`, legacy uploads)
// or 2-segment (`<type>/<id>/<filename>`, current upload code at
// worker/utils/images.ts:144). The validator below sanitises the full
// suffix in one pass. `%` is allowed because `uploadImageToR2`
// percent-encodes filenames into the stored key.
// -------------------------
const ALLOWED_GENERATED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif']);

function validateGeneratedSuffix(suffix: string): { ok: true; filename: string; ext: string } | { ok: false } {
    if (!suffix) return { ok: false };
    if (suffix.length > 256) return { ok: false };
    if (suffix.includes('..') || suffix.includes('\\') || suffix.includes('\0')) return { ok: false };
    // URL-safe characters only: alphanumerics, dot, hyphen, underscore,
    // forward slash, percent (encoded filename bytes)
    if (!/^[A-Za-z0-9._/%-]+$/.test(suffix)) return { ok: false };
    // No leading or trailing slash, no double slashes
    if (suffix.startsWith('/') || suffix.endsWith('/') || suffix.includes('//')) return { ok: false };
    const lastSlash = suffix.lastIndexOf('/');
    const filename = lastSlash >= 0 ? suffix.slice(lastSlash + 1) : suffix;
    if (filename.startsWith('.')) return { ok: false };
    const extIndex = filename.lastIndexOf('.');
    if (extIndex <= 0 || extIndex === filename.length - 1) return { ok: false };
    const ext = filename.slice(extIndex + 1).toLowerCase();
    if (!ALLOWED_GENERATED_EXTENSIONS.has(ext)) return { ok: false };
    return { ok: true, filename, ext };
}

const GENERATED_MIME_BY_EXT: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
};

export class ScreenshotsController extends BaseController {
    static logger = createLogger('ScreenshotsController');

    /**
     * Serve AI-generated images stored in R2 under `generated/<key>`.
     *
     * Public route, no auth. Mounted at `/api/generated/*`. Pairs with the
     * upload code path in `worker/utils/images.ts` (`uploadImageToR2` +
     * `getPublicUrlForR2Image`) which writes to `generated/<id>/<filename>`
     * and emits URLs of the form `https://<CUSTOM_DOMAIN>/api/<r2Key>`.
     *
     * Also supports the legacy 1-segment pattern (`generated/<filename>`)
     * that pre-dates the current upload code — the two homepage hero images
     * referenced by `28dayreset.com` use that pattern.
     *
     * The route handler reads the suffix directly from the request URL
     * rather than depending on Hono path params, so both `/:file` and
     * `/:id/:file` registrations route to the same logic.
     */
    static async serveGeneratedImage(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        _context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<never>>> {
        return ScreenshotsController.serveBucketImage(request, env, 'generated');
    }

    /**
     * Serve images stored in R2 under `uploads/<key>` — user-supplied assets
     * referenced by generated apps (e.g. logos and photos harvested from the
     * user's own reference website). Same posture as `/api/generated/*`:
     * public, unguessable keys, immutable caching.
     */
    static async serveUploadedImage(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        _context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<never>>> {
        return ScreenshotsController.serveBucketImage(request, env, 'uploads');
    }

    private static async serveBucketImage(
        request: Request,
        env: Env,
        root: 'generated' | 'uploads',
    ): Promise<ControllerResponse<ApiResponse<never>>> {
        try {
            const url = new URL(request.url);
            const prefix = `/api/${root}/`;
            if (!url.pathname.startsWith(prefix)) {
                return ScreenshotsController.createErrorResponse('Not found', 404);
            }
            const suffix = url.pathname.slice(prefix.length);

            const validation = validateGeneratedSuffix(suffix);
            if (!validation.ok) {
                return ScreenshotsController.createErrorResponse('Not found', 404);
            }

            const key = `${root}/${suffix}`;
            const obj = await env.TEMPLATES_BUCKET.get(key);
            if (!obj || !obj.body) {
                return ScreenshotsController.createErrorResponse('Image not found', 404);
            }

            const contentType =
                obj.httpMetadata?.contentType ||
                GENERATED_MIME_BY_EXT[validation.ext] ||
                'application/octet-stream';
            const headers = new Headers({
                'Content-Type': contentType,
                // Images are immutable once uploaded under a stable key, so we
                // can cache aggressively. 1 day at the edge with revalidation
                // matches the screenshot route's prior posture.
                'Cache-Control': 'public, max-age=86400, immutable',
                'X-Content-Type-Options': 'nosniff',
                // Public CDN-style asset: openly loadable cross-origin from any
                // generated-app preview (sandbox or browser-render subdomain) as
                // an <img>/background. No credentials, no per-origin Vary.
                'Access-Control-Allow-Origin': '*',
                'Cross-Origin-Resource-Policy': 'cross-origin',
            });

            return new Response(obj.body, { headers }) as unknown as ControllerResponse<ApiResponse<never>>;
        } catch (error) {
            ScreenshotsController.logger.error('Error serving R2 image', { root, error });
            return ScreenshotsController.createErrorResponse('Internal server error', 500);
        }
    }

    static async serveScreenshot(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<never>>> {
        try {
            const appId = context.pathParams.id;
            const file = context.pathParams.file;

            if (!appId || !file) {
                return ScreenshotsController.createErrorResponse('Missing path parameters', 400);
            }

            // Validate and sanitize path parameters
            if (!isValidAppId(appId)) {
                return ScreenshotsController.createErrorResponse('Invalid app id', 400);
            }

            const validatedFile = validateFileName(file);
            if (!validatedFile) {
                return ScreenshotsController.createErrorResponse('Invalid file name', 400);
            }

            // Verify screenshot access token
            const url = new URL(request.url);
            const token = url.searchParams.get('token');

            if (!token) {
                return ScreenshotsController.createErrorResponse('Screenshot not found', 404);
            }

            const security = new ScreenshotSecurity(env);
            const isValidToken = await security.verifyToken(token, appId);
            if (!isValidToken) {
                return ScreenshotsController.createErrorResponse('Screenshot not found', 404);
            }

            const key = `screenshots/${appId}/${validatedFile}`;
            const obj = await env.TEMPLATES_BUCKET.get(key);
            if (!obj || !obj.body) {
                return ScreenshotsController.createErrorResponse('Screenshot not found', 404);
            }

            const contentType = obj.httpMetadata?.contentType || getMimeByExtension(validatedFile) || 'image/png';
            const headers = new Headers({
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=21600',
                'X-Content-Type-Options': 'nosniff',
            });

			// We return a naked Response because our controller helper types expect JSON, but this route is binary.
			// It's safe because the router uses this Response directly.
			return new Response(obj.body, {
				headers,
			}) as unknown as ControllerResponse<ApiResponse<never>>;
		        } catch (error) {
            this.logger.error('Error serving screenshot', { error });
            return ScreenshotsController.createErrorResponse('Internal server error', 500);
        }
    }
}
