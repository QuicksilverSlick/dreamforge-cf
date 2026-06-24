import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import type { ImpersonationStatusData } from '@/api-types';

const POLL_MS = 30_000; // re-pull the live expiry
const TICK_MS = 15_000; // advance the countdown
const WARN_MS = 2 * 60 * 1000; // prompt to extend when under 2 min remain

/**
 * Persistent "Viewing as <user>" bar shown on every authenticated route while
 * impersonating, plus the pre-expiry extend prompt. Renders nothing for a normal
 * session. Reads the live grant expiry from GET /api/impersonation/status; if the
 * grant has expired/been revoked server-side, it refreshes the profile so the SPA
 * flips back to the operator automatically.
 */
export function ImpersonationBanner() {
	const { user, refreshUser } = useAuth();
	const navigate = useNavigate();
	const isImpersonating = !!user?.impersonatedBy;

	const [status, setStatus] = useState<ImpersonationStatusData | null>(null);
	const [now, setNow] = useState(() => Date.now());
	const [busy, setBusy] = useState(false);

	const refresh = useCallback(async () => {
		try {
			const res = await apiClient.getImpersonationStatus();
			if (res.success && res.data?.impersonating) {
				setStatus(res.data);
			} else {
				// Grant gone server-side — flip the SPA back to the operator.
				setStatus(null);
				await refreshUser();
			}
		} catch {
			// Best-effort: keep the last-known status.
		}
	}, [refreshUser]);

	useEffect(() => {
		if (!isImpersonating) {
			setStatus(null);
			return;
		}
		void refresh();
		const poll = setInterval(() => void refresh(), POLL_MS);
		const tick = setInterval(() => setNow(Date.now()), TICK_MS);
		return () => {
			clearInterval(poll);
			clearInterval(tick);
		};
	}, [isImpersonating, refresh]);

	const exit = useCallback(async () => {
		setBusy(true);
		try {
			await apiClient.stopImpersonation();
			await refreshUser();
			navigate('/');
			toast.success('Returned to your own account');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Could not exit impersonation');
		} finally {
			setBusy(false);
		}
	}, [navigate, refreshUser]);

	const extend = useCallback(async () => {
		setBusy(true);
		try {
			const res = await apiClient.extendImpersonation();
			if (res.success) {
				setNow(Date.now());
				await refresh();
				toast.success('Session extended');
			} else {
				toast.error('Could not extend session');
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Could not extend session');
		} finally {
			setBusy(false);
		}
	}, [refresh]);

	if (!isImpersonating) {
		return null;
	}

	const expiresAt = status?.expiresAt ? new Date(status.expiresAt).getTime() : null;
	const absExpiresAt = status?.absoluteExpiresAt ? new Date(status.absoluteExpiresAt).getTime() : null;
	// At the immovable absolute cap, extend() can't move the window (the server
	// clamps it and a further extend 409s) — only Exit resolves the session.
	const atCap = expiresAt !== null && absExpiresAt !== null && expiresAt >= absExpiresAt;
	const msLeft = expiresAt !== null ? expiresAt - now : null;
	const minutesLeft = msLeft !== null ? Math.max(0, Math.ceil(msLeft / 60_000)) : null;
	const targetName =
		status?.target?.displayName || status?.target?.email || user?.displayName || user?.email || 'user';
	// Hard prompt under the warning threshold — only Extend / Exit resolve it
	// (appropriate for a privileged, expiring session).
	const showPrompt = msLeft !== null && msLeft <= WARN_MS && msLeft > 0;

	return (
		<>
			<div
				role="status"
				aria-live="polite"
				className="flex items-center justify-between gap-3 border-b border-amber-500/40 bg-amber-500/15 px-4 py-2 text-sm text-text-primary"
			>
				<span className="flex items-center gap-2">
					<Eye className="h-4 w-4 text-amber-500" />
					<span>
						Viewing as <span className="font-medium">{targetName}</span>
						{minutesLeft !== null && (
							<span className="text-text-primary/60"> · {minutesLeft} min left</span>
						)}
					</span>
				</span>
				<span className="flex items-center gap-2">
					{!atCap && (
						<Button size="sm" variant="ghost" className="h-7" onClick={extend} disabled={busy}>
							Extend
						</Button>
					)}
					<Button size="sm" variant="secondary" className="h-7" onClick={exit} disabled={busy}>
						Exit
					</Button>
				</span>
			</div>

			<Dialog open={showPrompt} onOpenChange={() => undefined}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{atCap ? 'Maximum session length reached' : 'Impersonation session ending'}
						</DialogTitle>
						<DialogDescription>
							{atCap
								? `This impersonation session has reached its maximum length. Exit to return to your own account.`
								: `Your session viewing as ${targetName} expires in about ${minutesLeft} minute${
										minutesLeft === 1 ? '' : 's'
								  }. Extend to keep going, or exit back to your own account.`}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={exit} disabled={busy}>
							Exit
						</Button>
						{!atCap && (
							<Button onClick={extend} disabled={busy}>
								Extend session
							</Button>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
