import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import {
	type ProcessedAttachment,
	MAX_ATTACHMENT_SIZE_BYTES,
	MAX_ATTACHMENTS_PER_BUILD,
	SUPPORTED_ATTACHMENT_TYPES,
	extensionOf,
} from '@/api-types';

export interface UseAttachmentUploadReturn {
	attachments: ProcessedAttachment[];
	addFiles: (files: File[]) => Promise<void>;
	removeAttachment: (id: string) => void;
	clearAttachments: () => void;
	isUploading: boolean;
}

/** Extensions this picker offers — text-like files and rich documents
 * (pdf/docx/xlsx/odt/ods). Images ride the image lane of the unified button. */
export const DOCUMENT_ATTACHMENT_EXTENSIONS = Object.entries(SUPPORTED_ATTACHMENT_TYPES)
	.filter(([, spec]) => spec.kind !== 'image')
	.map(([ext]) => `.${ext}`);

/** `accept` attribute for the file input. */
export const DOCUMENT_ATTACHMENT_ACCEPT = DOCUMENT_ATTACHMENT_EXTENSIONS.join(',');

/**
 * Upload-first attachment handling: files go straight to R2 via
 * /api/attachments and only compact refs are held, so the build request
 * never carries file blobs. Client-side pre-checks (extension, size, count)
 * give instant feedback before the round-trip; the server re-validates
 * authoritatively.
 */
export function useAttachmentUpload(): UseAttachmentUploadReturn {
	const [attachments, setAttachments] = useState<ProcessedAttachment[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	const addFiles = useCallback(async (files: File[]) => {
		if (files.length === 0) return;

		const room = MAX_ATTACHMENTS_PER_BUILD - attachments.length;
		if (room <= 0) {
			toast.error(`You can attach at most ${MAX_ATTACHMENTS_PER_BUILD} files.`);
			return;
		}

		const candidates: File[] = [];
		for (const file of files.slice(0, room)) {
			const ext = extensionOf(file.name);
			const spec = ext ? SUPPORTED_ATTACHMENT_TYPES[ext] : undefined;
			if (!spec || spec.kind === 'image') {
				toast.error(`${file.name}: that file type isn't supported here.`);
				continue;
			}
			if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
				toast.error(`${file.name} is larger than ${Math.round(MAX_ATTACHMENT_SIZE_BYTES / (1024 * 1024))} MB.`);
				continue;
			}
			candidates.push(file);
		}
		if (files.length > room) {
			toast.error(`Only ${room} more file${room === 1 ? '' : 's'} can be attached.`);
		}
		if (candidates.length === 0) return;

		setIsUploading(true);
		try {
			const result = await apiClient.uploadAttachments(candidates);
			for (const r of result.rejected) toast.error(`${r.filename}: ${r.reason}`);
			if (result.attachments.length > 0) {
				setAttachments((prev) => [...prev, ...result.attachments].slice(0, MAX_ATTACHMENTS_PER_BUILD));
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Attachment upload failed.');
		} finally {
			setIsUploading(false);
		}
	}, [attachments.length]);

	const removeAttachment = useCallback((id: string) => {
		setAttachments((prev) => prev.filter((a) => a.id !== id));
	}, []);

	const clearAttachments = useCallback(() => setAttachments([]), []);

	return { attachments, addFiles, removeAttachment, clearAttachments, isUploading };
}
