import { BaseController } from '../baseController';
import type { ControllerResponse, ApiResponse } from '../types';
import type { RouteContext } from '../../types/route-context';
import { generateId } from '../../../utils/idGenerator';
import {
    classifyUpload,
    extensionOf,
    MAX_ATTACHMENTS_PER_BUILD,
    EXTRACTED_SUFFIX,
    type ProcessedAttachment,
} from '../../../types/attachment';
import { extractAttachmentText, excerptOf } from '../../../services/attachments/extract';
import { createObjectLogger } from '../../../logger';

/** R2 root for build attachments — owner-scoped by the userId segment. */
const ATTACHMENT_ROOT = 'attachments';

export interface UploadAttachmentsResponse {
    attachments: ProcessedAttachment[];
    /** Per-file rejections (bad type/size/content) — surfaced, not fatal. */
    rejected: Array<{ filename: string; reason: string }>;
}

/** `attachments/<userId>/<id>/<filename>` — private, owner-gated. */
function attachmentKey(userId: string, id: string, filename: string): string {
    return `${ATTACHMENT_ROOT}/${userId}/${id}/${encodeURIComponent(filename)}`;
}

export class AttachmentsController extends BaseController {
    static logger = createObjectLogger({ name: 'AttachmentsController' }, 'AttachmentsController');

    /**
     * POST /api/attachments — authenticated multipart upload of build
     * attachments. Each file is validated (extension + MIME + content sniff),
     * stored under a private owner-scoped R2 key, and text-like files are
     * extracted to a sibling `extracted.md`. Returns reference metadata only
     * (never blobs). Invalid files are reported per-file, not fatal.
     */
    static async uploadAttachments(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<UploadAttachmentsResponse>>> {
        const user = context.user;
        if (!user) {
            return AttachmentsController.createErrorResponse<UploadAttachmentsResponse>('Authentication required', 401);
        }

        let form: FormData;
        try {
            form = await request.formData();
        } catch {
            return AttachmentsController.createErrorResponse<UploadAttachmentsResponse>('Expected multipart/form-data', 400);
        }

        // Workerd FormData yields file entries as Blobs carrying a `.name`, but
        // its getAll() type is narrowed to string[] — widen through unknown to
        // the real runtime union. (File isn't a value/type in the worker lib.)
        type UploadedFile = Blob & { name?: string };
        const entries = form.getAll('files') as unknown as Array<string | UploadedFile>;
        const files = entries.filter(
            (f): f is UploadedFile => typeof f !== 'string' && typeof f.arrayBuffer === 'function',
        );
        if (files.length === 0) {
            return AttachmentsController.createErrorResponse<UploadAttachmentsResponse>('No files provided', 400);
        }
        if (files.length > MAX_ATTACHMENTS_PER_BUILD) {
            return AttachmentsController.createErrorResponse<UploadAttachmentsResponse>(
                `You can attach at most ${MAX_ATTACHMENTS_PER_BUILD} files.`,
                400,
            );
        }

        const attachments: ProcessedAttachment[] = [];
        const rejected: Array<{ filename: string; reason: string }> = [];

        for (const file of files) {
            const filename = file.name || 'file';
            try {
                const bytes = new Uint8Array(await file.arrayBuffer());
                const classified = classifyUpload(filename, file.type, bytes);
                if (!classified.ok) {
                    rejected.push({ filename, reason: classified.reason });
                    continue;
                }
                // v1: images have their own multimodal path; this endpoint is
                // for text-like/document context files.
                if (!classified.textLike) {
                    rejected.push({ filename, reason: 'Attach images with the image button.' });
                    continue;
                }

                const id = generateId();
                const r2Key = attachmentKey(user.id, id, filename);
                const meta = { ownerUserId: user.id, kind: classified.kind };
                await env.TEMPLATES_BUCKET.put(r2Key, bytes, {
                    httpMetadata: { contentType: classified.mimeType },
                    customMetadata: meta,
                });

                const attachment: ProcessedAttachment = {
                    id,
                    kind: classified.kind,
                    filename,
                    mimeType: classified.mimeType,
                    size: bytes.length,
                    r2Key,
                };

                const extracted = extractAttachmentText(bytes, { textLike: true, kind: classified.kind });
                if (extracted.ok) {
                    const extractedKey = `${ATTACHMENT_ROOT}/${user.id}/${id}/${EXTRACTED_SUFFIX}`;
                    await env.TEMPLATES_BUCKET.put(extractedKey, extracted.text, {
                        httpMetadata: { contentType: 'text/markdown' },
                        customMetadata: meta,
                    });
                    attachment.extractedKey = extractedKey;
                    attachment.excerpt = excerptOf(extracted.text);
                } else {
                    rejected.push({ filename, reason: extracted.reason });
                    // Keep the original stored; it just carries no extracted text.
                }

                attachments.push(attachment);
            } catch (error) {
                AttachmentsController.logger.error('Attachment upload failed', { filename, error });
                rejected.push({ filename, reason: 'Upload failed — please try again.' });
            }
        }

        return AttachmentsController.createSuccessResponse<UploadAttachmentsResponse>({ attachments, rejected });
    }

    /**
     * GET /api/attachments/:userId/:id/:file — owner-gated download of a stored
     * attachment (original or extracted text). Unlike public preview images,
     * documents contain private data: only the owner (or a superadmin) may
     * read them, verified against BOTH the path's userId segment and the R2
     * object's ownerUserId metadata. Served privately (no cross-origin, no
     * shared cache).
     */
    static async serveAttachment(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<never>>> {
        const user = context.user;
        if (!user) {
            return AttachmentsController.createErrorResponse('Authentication required', 401);
        }
        const { userId, id, file } = context.pathParams;
        if (!userId || !id || !file) {
            return AttachmentsController.createErrorResponse('Not found', 404);
        }
        const isSuperadmin = user.role === 'superadmin';
        if (userId !== user.id && !isSuperadmin) {
            // Don't distinguish "not yours" from "missing" — 404 either way.
            return AttachmentsController.createErrorResponse('Not found', 404);
        }

        // Reconstruct the key from the raw path suffix (handles the encoded
        // filename exactly as stored) rather than re-encoding pathParams.
        const url = new URL(request.url);
        const prefix = '/api/attachments/';
        if (!url.pathname.startsWith(prefix)) {
            return AttachmentsController.createErrorResponse('Not found', 404);
        }
        const suffix = url.pathname.slice(prefix.length);
        if (suffix.includes('..')) {
            return AttachmentsController.createErrorResponse('Not found', 404);
        }
        const key = `${ATTACHMENT_ROOT}/${suffix}`;

        const obj = await env.TEMPLATES_BUCKET.get(key);
        if (!obj || !obj.body) {
            return AttachmentsController.createErrorResponse('Not found', 404);
        }
        // Defense in depth: the stored owner must match too.
        const ownerMeta = obj.customMetadata?.ownerUserId;
        if (ownerMeta && ownerMeta !== userId) {
            return AttachmentsController.createErrorResponse('Not found', 404);
        }

        const headers = new Headers({
            'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
            'Cache-Control': 'private, no-store',
            'X-Content-Type-Options': 'nosniff',
            // Force download of the raw file rather than inline rendering, so a
            // malicious .html/.svg attachment can't run in our origin.
            'Content-Disposition': `attachment; filename="${extensionOf(file) ? file : 'attachment'}"`,
        });
        return new Response(obj.body, { headers }) as unknown as ControllerResponse<ApiResponse<never>>;
    }
}
