import { Eye, Users2, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import type { PresenceMember } from '@/api-types';

interface CollaborationBarProps {
	members: PresenceMember[];
	currentUserId: string | undefined;
	isViewerDriving: boolean;
	/** True when another member holds the driver seat (this viewer is read-only). */
	isReadOnlyViewer: boolean;
	/** Name of the driver a drive attempt was just soft-blocked behind, or null. */
	drivingBlockedBy: string | null;
	onTakeOver: () => void;
	onRelease: () => void;
	onDismissBlocked: () => void;
}

function initials(name: string): string {
	return name.trim().slice(0, 2).toUpperCase() || '?';
}

/**
 * Live collaboration status for a shared agent session: who's present, who holds
 * the single driver seat, and the soft take-over affordance. Renders nothing for
 * a solo session (only this viewer present and nothing to surface).
 */
export function CollaborationBar({
	members,
	currentUserId,
	isViewerDriving,
	isReadOnlyViewer,
	drivingBlockedBy,
	onTakeOver,
	onRelease,
	onDismissBlocked,
}: CollaborationBarProps) {
	const others = members.filter((m) => m.userId !== currentUserId);
	if (others.length === 0 && !drivingBlockedBy) {
		return null; // solo session — nothing to show
	}

	const driver = members.find((m) => m.isDriver);
	const driverLabel = isViewerDriving
		? 'You’re driving'
		: driver
			? `${driver.displayName} is driving`
			: 'Open — start typing to drive';

	return (
		<div
			role="status"
			aria-live="polite"
			className="mb-2 rounded-lg border border-accent/30 bg-bg-3 px-3 py-2 text-sm"
		>
			<div className="flex items-center gap-3">
				<TooltipProvider>
					<div className="flex -space-x-2">
						{members.map((m) => (
							<Tooltip key={m.userId}>
								<TooltipTrigger asChild>
									<Avatar className="h-6 w-6 border-2 border-bg-3">
										<AvatarImage src={m.avatar ?? undefined} />
										<AvatarFallback className="text-[9px] bg-accent/20 text-text-primary">
											{initials(m.displayName)}
										</AvatarFallback>
									</Avatar>
								</TooltipTrigger>
								<TooltipContent>
									{m.displayName}
									{m.userId === currentUserId ? ' (you)' : ''}
									{m.isDriver ? ' · driving' : ''}
								</TooltipContent>
							</Tooltip>
						))}
					</div>
				</TooltipProvider>

				<span className="flex items-center gap-1.5 text-text-primary/80">
					{isReadOnlyViewer ? (
						<Eye className="h-3.5 w-3.5" />
					) : (
						<Users2 className="h-3.5 w-3.5 text-accent" />
					)}
					{driverLabel}
				</span>

				<div className="ml-auto flex items-center gap-2">
					{isReadOnlyViewer && (
						<Button size="sm" variant="secondary" className="h-7" onClick={onTakeOver}>
							Take over
						</Button>
					)}
					{isViewerDriving && others.length > 0 && (
						<Button size="sm" variant="ghost" className="h-7 text-text-primary/70" onClick={onRelease}>
							Release
						</Button>
					)}
				</div>
			</div>

			{drivingBlockedBy && (
				<div className="mt-2 flex items-center gap-2 rounded-md bg-accent/10 px-2.5 py-1.5 text-xs text-text-primary/90">
					<span className="flex-1">
						<span className="font-medium">{drivingBlockedBy}</span> is actively building — take over to make
						changes.
					</span>
					<Button size="sm" variant="secondary" className="h-6 text-xs" onClick={onTakeOver}>
						Take over
					</Button>
					<button
						type="button"
						aria-label="Dismiss"
						onClick={onDismissBlocked}
						className="text-text-primary/50 hover:text-text-primary"
					>
						<X className="h-3.5 w-3.5" />
					</button>
				</div>
			)}
		</div>
	);
}
