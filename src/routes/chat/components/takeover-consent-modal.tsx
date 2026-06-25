import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { TakeoverRequest } from '../utils/takeover';

interface TakeoverConsentModalProps {
	/** The inbound consent request, or null when there is nothing to decide. */
	request: TakeoverRequest | null;
	/** Send the user's allow/deny decision. */
	onRespond: (requestId: string, allow: boolean) => void;
}

function secondsLeft(expiresAt: number): number {
	return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
}

/**
 * Consent prompt shown to the REAL user when a privileged operator (admin /
 * superadmin / AI agent) wants to take over their live session. Fully controlled
 * (no Escape/overlay dismissal) so it can only be closed by an explicit decision
 * or by expiry — on which the server has already fail-closed to DENY, so the
 * client simply sends a matching deny and clears. Deny and Allow are equal-weight,
 * and focus lands on Deny (rendered first), so an accidental Enter never consents.
 */
export function TakeoverConsentModal({ request, onRespond }: TakeoverConsentModalProps) {
	const [remaining, setRemaining] = useState(0);

	useEffect(() => {
		if (!request) {
			return;
		}
		setRemaining(secondsLeft(request.expiresAt));
		const timer = setInterval(() => {
			const left = secondsLeft(request.expiresAt);
			setRemaining(left);
			if (left <= 0) {
				clearInterval(timer);
				onRespond(request.requestId, false); // fail-closed: lapse == deny
			}
		}, 1000);
		return () => clearInterval(timer);
	}, [request, onRespond]);

	if (!request) {
		return null;
	}

	return (
		<AlertDialog open>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2">
						<ShieldAlert className="h-5 w-5 text-amber-500" />
						Allow someone to take over your session?
					</AlertDialogTitle>
					<AlertDialogDescription>
						{request.reasonUser} They will be able to drive the build and make changes as you. You can
						take back control at any time. This request declines automatically in {remaining}s.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="sm:justify-center sm:gap-3">
					<Button
						variant="outline"
						className="min-w-28"
						onClick={() => onRespond(request.requestId, false)}
					>
						Deny
					</Button>
					<Button className="min-w-28" onClick={() => onRespond(request.requestId, true)}>
						Allow
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
