import { useRef } from 'react';
import { Paperclip, FileText, X, LoaderCircle } from 'lucide-react';
import clsx from 'clsx';
import type { ProcessedAttachment } from '@/api-types';
import { TEXT_ATTACHMENT_ACCEPT } from '@/hooks/use-attachment-upload';

/** Paperclip button that opens a file picker for text-like build attachments. */
export function AttachmentPickerButton({
	onFilesSelected,
	disabled,
}: {
	onFilesSelected: (files: File[]) => void;
	disabled?: boolean;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	return (
		<>
			<input
				ref={inputRef}
				type="file"
				multiple
				accept={TEXT_ATTACHMENT_ACCEPT}
				className="hidden"
				onChange={(e) => {
					const files = Array.from(e.target.files ?? []);
					if (files.length > 0) onFilesSelected(files);
					// Reset so re-selecting the same file fires change again.
					e.target.value = '';
				}}
			/>
			<button
				type="button"
				disabled={disabled}
				onClick={() => inputRef.current?.click()}
				title="Attach files (docs, data, notes)"
				aria-label="Attach files"
				className="p-1 rounded-md text-text-tertiary transition-colors hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{disabled ? <LoaderCircle className="size-5 animate-spin" /> : <Paperclip className="size-5" />}
			</button>
		</>
	);
}

/** Removable chips for the currently-attached files. */
export function AttachmentChips({
	attachments,
	onRemove,
	className,
}: {
	attachments: ProcessedAttachment[];
	onRemove: (id: string) => void;
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
					<button
						type="button"
						onClick={() => onRemove(a.id)}
						aria-label={`Remove ${a.filename}`}
						className="shrink-0 text-text-tertiary hover:text-text-primary"
					>
						<X className="size-3.5" />
					</button>
				</span>
			))}
		</div>
	);
}
