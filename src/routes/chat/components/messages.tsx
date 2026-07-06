import { AIAvatar } from '../../../components/icons/logos';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';
import { SAFE_MARKDOWN_COMPONENTS } from './markdown-components';
import { LoaderCircle, Check, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { SuggestionChip, ImageConsentCard } from '../utils/message-helpers';
import type { ToolEvent } from '../utils/message-helpers';

/**
 * Strip internal system tags that should not be displayed to users
 */
function sanitizeMessageForDisplay(message: string): string {
	// Remove <system_context>...</system_context> tags and their content
	return message.replace(/<system_context>[\s\S]*?<\/system_context>\n/gi, '').trim();
}

export function UserMessage({ message }: { message: string }) {
	const sanitizedMessage = sanitizeMessageForDisplay(message);
	
	return (
		<div className="flex gap-3">
			<div className="align-text-top pl-1">
				<div className="size-6 flex items-center justify-center rounded-full bg-accent text-text-inverted">
					<span className="text-xs font-semibold">U</span>
				</div>
			</div>
			<div className="flex flex-col gap-2 min-w-0">
				<div className="font-medium text-text-50">You</div>
				<Markdown className="text-text-primary/80">{sanitizedMessage}</Markdown>
			</div>
		</div>
	);
}

export function AIMessage({
	message,
	isThinking,
	toolEvents,
	suggestions,
	imageConsent,
	onSuggestionAccept,
	onImageConsent,
}: {
	message: string;
	isThinking?: boolean;
	toolEvents?: ToolEvent[];
	suggestions?: SuggestionChip[];
	imageConsent?: ImageConsentCard;
	onSuggestionAccept?: (chip: SuggestionChip) => void;
	onImageConsent?: (approved: boolean) => void;
}) {
	const [usedChipIds, setUsedChipIds] = useState<Set<string>>(new Set());
	const [consentAnswered, setConsentAnswered] = useState<null | boolean>(null);
	const sanitizedMessage = sanitizeMessageForDisplay(message);
	
	return (
		<div className="flex gap-3">
			<div className="pl-1">
				<AIAvatar style={{ width: '38px', height: '38px' }} />
			</div>
			<div className="flex flex-col gap-2 min-w-0">
				<div className="font-mono font-medium text-text-50" style={{ marginTop: '11px' }}>Dreamforge</div>
				{toolEvents && toolEvents.length > 0 && (
					<div className="mb-1.5 flex flex-col gap-1">
						{toolEvents.map((ev) => (
							<div
								key={`${ev.name}-${ev.timestamp}`}
								className="flex items-center gap-1.5 text-xs text-text-tertiary"
							>
								{ev.status === 'start' && (
									<LoaderCircle className="size-3 animate-spin" />
								)}
								{ev.status === 'success' && <Check className="size-3" />}
								{ev.status === 'error' && <AlertTriangle className="size-3" />}
								<span className="font-mono tracking-tight">
									{ev.status === 'start' && 'Running'}
									{ev.status === 'success' && 'Completed'}
									{ev.status === 'error' && 'Error'}
									{' '}
									{ev.name}
								</span>
							</div>
						))}
					</div>
				)}
				<Markdown className={clsx('a-tag', isThinking ? 'animate-pulse' : '')}>
					{sanitizedMessage}
				</Markdown>
				{suggestions && suggestions.length > 0 && (
					<div className="mt-1 flex flex-col gap-2">
						{suggestions.map((chip) => {
							const used = usedChipIds.has(chip.id);
							return (
								<button
									key={chip.id}
									type="button"
									disabled={used || !onSuggestionAccept}
									onClick={() => {
										setUsedChipIds((prev) => new Set(prev).add(chip.id));
										onSuggestionAccept?.(chip);
									}}
									className={clsx(
										'group flex w-full max-w-md flex-col gap-0.5 rounded-lg border p-2.5 text-left transition-colors',
										used
											? 'border-border-primary bg-bg-3/40 opacity-50'
											: 'border-accent/40 bg-bg-3 hover:border-accent hover:bg-accent/10',
									)}
								>
									<span className="flex items-center justify-between gap-2 text-sm font-medium text-text-primary">
										{chip.label}
										<span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-accent">
											{used ? (
												<>
													<Check className="size-3" />
													Queued
												</>
											) : (
												<>
													<Zap className="size-3" />
													{chip.sparks}
												</>
											)}
										</span>
									</span>
									<span className="text-xs text-text-tertiary">{chip.benefit}</span>
									<span className="text-[10px] uppercase tracking-wide text-text-tertiary/70">
										{chip.scope}
									</span>
								</button>
							);
						})}
					</div>
				)}
				{imageConsent && (
					<div className="mt-1 flex w-full max-w-md flex-col gap-2 rounded-lg border border-accent/40 bg-bg-3 p-3">
						<div className="flex flex-col gap-1 text-xs text-text-tertiary">
							{imageConsent.images.map((img) => (
								<span key={img.path} className="flex items-center gap-1.5 truncate">
									<span className="size-1 shrink-0 rounded-full bg-accent/60" />
									{img.purpose && img.purpose !== 'icon' ? img.purpose : img.path}
								</span>
							))}
						</div>
						{consentAnswered === null ? (
							<div className="flex flex-wrap gap-2">
								<Button
									size="sm"
									disabled={!onImageConsent}
									onClick={() => {
										setConsentAnswered(true);
										onImageConsent?.(true);
									}}
									className="gap-1.5"
								>
									Generate {imageConsent.count} image{imageConsent.count === 1 ? '' : 's'}
									<span className="inline-flex items-center gap-0.5 tabular-nums opacity-90">
										<Zap className="size-3.5" />
										{imageConsent.totalSparks}
									</span>
								</Button>
								<Button
									size="sm"
									variant="outline"
									disabled={!onImageConsent}
									onClick={() => {
										setConsentAnswered(false);
										onImageConsent?.(false);
									}}
								>
									Skip — build without images
								</Button>
							</div>
						) : (
							<span className="text-xs text-text-tertiary">
								{consentAnswered
									? 'Generating images — they will appear in the preview as each one lands.'
									: 'Skipped. You can ask for images anytime in chat.'}
							</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

interface MarkdownProps extends React.ComponentProps<'article'> {
	children: string;
}

export function Markdown({ children, className, ...props }: MarkdownProps) {
	return (
		<article
			className={clsx('prose prose-sm prose-teal', className)}
			{...props}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[
					[
						rehypeExternalLinks,
						{ target: '_blank', rel: ['noopener', 'noreferrer', 'nofollow'] },
					],
				]}
				components={SAFE_MARKDOWN_COMPONENTS}
			>
				{children}
			</ReactMarkdown>
		</article>
	);
}
