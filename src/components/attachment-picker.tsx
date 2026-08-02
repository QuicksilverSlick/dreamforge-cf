import { useRef } from 'react';
import { Plus, FileText, X, LoaderCircle } from 'lucide-react';
import clsx from 'clsx';
import type { ProcessedAttachment } from '@/api-types';
import { SUPPORTED_IMAGE_MIME_TYPES } from '@/api-types';
import { DOCUMENT_ATTACHMENT_ACCEPT } from '@/hooks/use-attachment-upload';
import { partitionAttachmentFiles } from '@/lib/attachment-classify';

/** Accept list covering both lanes: images + text-like documents. */
const UNIFIED_ATTACH_ACCEPT = [SUPPORTED_IMAGE_MIME_TYPES.join(','), DOCUMENT_ATTACHMENT_ACCEPT].join(',');

/**
 * Single "+" control that accepts images and documents in one click. Picked
 * files are split by {@link partitionAttachmentFiles} and handed to the two
 * upload lanes — images to `onImagesSelected`, everything else to
 * `onFilesSelected` — so the caller keeps its existing per-lane hooks.
 */
export function UnifiedAttachButton({
	onImagesSelected,
	onFilesSelected,
	disabled,
	busy,
	className,
	iconClassName = 'size-5',
}: {
	onImagesSelected: (files: File[]) => void;
	onFilesSelected: (files: File[]) => void;
	disabled?: boolean;
	/** Show a spinner while an upload is in flight (control stays clickable). */
	busy?: boolean;
	className?: string;
	iconClassName?: string;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	return (
		<>
			<input
				ref={inputRef}
				type="file"
				multiple
				accept={UNIFIED_ATTACH_ACCEPT}
				className="hidden"
				onChange={(e) => {
					const files = Array.from(e.target.files ?? []);
					if (files.length > 0) {
						const { images, documents } = partitionAttachmentFiles(files);
						if (images.length > 0) onImagesSelected(images);
						if (documents.length > 0) onFilesSelected(documents);
					}
					// Reset so re-selecting the same file fires change again.
					e.target.value = '';
				}}
			/>
			<button
				type="button"
				disabled={disabled}
				onClick={() => inputRef.current?.click()}
				title="Attach images or documents"
				aria-label="Attach images or documents"
				className={clsx(
					'p-1 rounded-md text-text-tertiary transition-colors hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed',
					className,
				)}
			>
				{busy ? <LoaderCircle className={clsx(iconClassName, 'animate-spin')} /> : <Plus className={iconClassName} />}
			</button>
		</>
	);
}

/**
 * Chips for attached files. With `onRemove` they are removable (composer);
 * without it they render read-only (e.g. the sent-message echo in chat).
 */
export function AttachmentChips({
	attachments,
	onRemove,
	className,
}: {
	attachments: Array<Pick<ProcessedAttachment, 'id' | 'filename' | 'extractedKey'>>;
	onRemove?: (id: string) => void;
	className?: string;
}) {
	if (attachments.length === 0) return null;
	return (
		<div className={clsx('flex flex-wrap gap-2', className)}>
			{attachments.map((a) => (
				<span
					key={a.id}
					className="inline-flex max-w-[16rem] items-center gap-1.5 rounded-md border border-border-primary bg-bg-3 px-2 py-1 text-xs text-text-secondary"
				>
					<FileText className="size-3.5 shrink-0 text-text-tertiary" />
					<span className="truncate">{a.filename}</span>
					{!a.extractedKey && (
						<span className="shrink-0 text-text-tertiary/70" title="Stored, but no text could be read">
							(no text)
						</span>
					)}
					{onRemove && (
						<button
							type="button"
							onClick={() => onRemove(a.id)}
							aria-label={`Remove ${a.filename}`}
							className="shrink-0 text-text-tertiary hover:text-text-primary"
						>
							<X className="size-3.5" />
						</button>
					)}
				</span>
			))}
		</div>
	);
}
