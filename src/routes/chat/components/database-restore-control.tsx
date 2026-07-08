import { useState, useEffect, useCallback } from 'react';
import { DatabaseBackup, Loader, History } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import type { DatabaseRestoreInfo } from '@/api-types';

interface DatabaseRestoreControlProps {
	/** The app whose per-app D1 can be restored. Owner-only on the server. */
	appId?: string;
	/**
	 * False when another org member holds the live driver seat. Restore is more
	 * destructive than deploy, so it mirrors the deploy gate: a read-only viewer
	 * cannot trigger it.
	 */
	canRestore?: boolean;
}

type Stage = 'idle' | 'picker' | 'confirm' | 'restoring';

interface RestorePoint {
	/** Human label, e.g. "24 hours ago". */
	label: string;
	/** ISO timestamp to restore to. */
	timestamp: string;
}

const HOUR_MS = 60 * 60 * 1000;
const PRESETS: Array<{ label: string; ms: number }> = [
	{ label: '1 hour ago', ms: HOUR_MS },
	{ label: '6 hours ago', ms: 6 * HOUR_MS },
	{ label: '24 hours ago', ms: 24 * HOUR_MS },
	{ label: '3 days ago', ms: 3 * 24 * HOUR_MS },
	{ label: '7 days ago', ms: 7 * 24 * HOUR_MS },
];

/** Convert an ISO timestamp to the `datetime-local` input value (local time). */
function toLocalInputValue(iso: string): string {
	const d = new Date(iso);
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Owner control to restore an app's per-app D1 to an earlier point via D1 Time
 * Travel (continuity arc, CONT-4). Renders only for apps that have a provisioned
 * database. The flow is deliberately two-step and fail-closed: pick a point,
 * then an explicit destructive confirm (Cancel focused). The restore is
 * reversible — the success toast offers an Undo backed by the pre-restore
 * bookmark. There is no agent path to this; only the owner can trigger it.
 */
export function DatabaseRestoreControl({ appId, canRestore = true }: DatabaseRestoreControlProps) {
	const [info, setInfo] = useState<DatabaseRestoreInfo | null>(null);
	const [stage, setStage] = useState<Stage>('idle');
	const [selected, setSelected] = useState<RestorePoint | null>(null);
	const [customValue, setCustomValue] = useState('');

	useEffect(() => {
		if (!appId) {
			return;
		}
		let cancelled = false;
		apiClient
			.getAppDatabaseRestoreInfo(appId)
			.then((res) => {
				if (!cancelled && res.success && res.data) {
					setInfo(res.data);
				}
			})
			.catch(() => {
				/* non-fatal: the control just stays hidden */
			});
		return () => {
			cancelled = true;
		};
	}, [appId]);

	const runRestore = useCallback(
		async (params: { timestamp?: string; bookmark?: string }, isUndo: boolean) => {
			if (!appId) {
				return;
			}
			// The undo runs from the success toast (no dialog is open), so it must
			// NOT flip to 'restoring' — that would re-open the destructive confirm
			// dialog with a now-empty label. Only the confirm-driven restore does.
			if (!isUndo) {
				setStage('restoring');
			}
			try {
				const res = await apiClient.restoreAppDatabase(appId, params);
				if (res.success && res.data) {
					const previousBookmark = res.data.previousBookmark;
					toast.success(isUndo ? 'Restore undone' : 'Database restored', {
						description: isUndo
							? 'Your database is back to where it was before the restore.'
							: 'Your app data was rolled back to the point you chose.',
						duration: 12000,
						action: isUndo
							? undefined
							: {
									label: 'Undo',
									onClick: () => {
										void runRestore({ bookmark: previousBookmark }, true);
									},
								},
					});
					setStage('idle');
					setSelected(null);
					setCustomValue('');
				} else {
					toast.error(res.error?.message || 'Restore failed');
					setStage('idle');
				}
			} catch (error) {
				toast.error(error instanceof Error ? error.message : 'Restore failed');
				setStage('idle');
			}
		},
		[appId],
	);

	if (!appId || !info?.hasDatabase) {
		return null;
	}

	// Compute the restore window from the CURRENT time, not the value captured at
	// mount — otherwise a long-open tab drifts and a preset labelled "1 hour ago"
	// would restore much further back than it says. earliestRestoreAt (from the
	// server, already bounded by the database's creation) is the lower floor.
	const retentionMs = info.retentionDays * 24 * HOUR_MS;
	const earliestMs = Math.max(new Date(info.earliestRestoreAt).getTime(), Date.now() - retentionMs);

	const choosePreset = (preset: { label: string; ms: number }) => {
		setSelected({ label: preset.label, timestamp: new Date(Date.now() - preset.ms).toISOString() });
		setStage('confirm');
	};

	const chooseCustom = () => {
		if (!customValue) {
			return;
		}
		const chosen = new Date(customValue);
		if (Number.isNaN(chosen.getTime())) {
			toast.error('Pick a valid date and time');
			return;
		}
		if (chosen.getTime() > Date.now()) {
			toast.error('Choose a time in the past');
			return;
		}
		if (chosen.getTime() < earliestMs) {
			toast.error(`That's outside the restorable window (last ${info.retentionDays} days)`);
			return;
		}
		setSelected({ label: chosen.toLocaleString(), timestamp: chosen.toISOString() });
		setStage('confirm');
	};

	const closeAll = () => {
		if (stage === 'restoring') {
			return;
		}
		setStage('idle');
		setSelected(null);
	};

	return (
		<>
			<div className="border border-border-primary/50 rounded-lg p-3 bg-bg-3/20 dark:bg-bg-3/10 mt-2">
				<div className="flex items-center gap-3">
					<div className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center text-text-tertiary">
						<History className="w-4 h-4" />
					</div>
					<div className="flex-1">
						<div className="text-sm font-medium text-text-primary">Database time travel</div>
						<div className="text-xs mt-0.5 text-text-tertiary">
							Roll your app's data back to an earlier point (last {info.retentionDays} days).
						</div>
					</div>
					<Button
						variant="secondary"
						className="h-8 px-3 text-sm"
						disabled={!canRestore}
						title={!canRestore ? 'Another member is driving — take over to restore' : undefined}
						onClick={() => setStage('picker')}
					>
						<DatabaseBackup className="w-4 h-4 mr-2" />
						Restore…
					</Button>
				</div>
			</div>

			{/* Point picker */}
			<AlertDialog open={stage === 'picker'}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<History className="h-5 w-5 text-accent" />
							Restore your database
						</AlertDialogTitle>
						<AlertDialogDescription>
							Choose a point to roll your app's data back to. Time Travel keeps the last{' '}
							{info.retentionDays} days. You can undo a restore right after.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex flex-wrap gap-2 py-1">
						{PRESETS.map((preset) => {
							// Hide points before the database existed (earliestMs floor).
							const restorable = Date.now() - preset.ms >= earliestMs;
							return (
								<Button
									key={preset.label}
									variant="outline"
									className="h-8 px-3 text-sm"
									disabled={!restorable}
									title={!restorable ? 'Before this database was created' : undefined}
									onClick={() => choosePreset(preset)}
								>
									{preset.label}
								</Button>
							);
						})}
					</div>
					<div className="pt-1">
						<label className="text-xs text-text-tertiary block mb-1">Or pick an exact time</label>
						<div className="flex items-center gap-2">
							<input
								type="datetime-local"
								className="flex-1 h-9 px-2 text-sm rounded-md border border-border-primary bg-bg-2 text-text-primary"
								min={toLocalInputValue(new Date(earliestMs).toISOString())}
								max={toLocalInputValue(new Date().toISOString())}
								value={customValue}
								onChange={(e) => setCustomValue(e.target.value)}
							/>
							<Button variant="secondary" className="h-9 px-3 text-sm" disabled={!customValue} onClick={chooseCustom}>
								Continue
							</Button>
						</div>
					</div>
					<AlertDialogFooter>
						<Button variant="outline" onClick={closeAll}>
							Cancel
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Fail-closed destructive confirm */}
			<AlertDialog open={stage === 'confirm' || stage === 'restoring'}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<DatabaseBackup className="h-5 w-5 text-amber-500" />
							Restore to {selected?.label}?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Your app's database will be rolled back to this point. Data created after it will be
							replaced. This is reversible — you can undo the restore immediately afterward.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="sm:justify-center sm:gap-3">
						<Button variant="outline" className="min-w-28" disabled={stage === 'restoring'} onClick={() => setStage('picker')}>
							Cancel
						</Button>
						<Button
							className="min-w-28 bg-amber-500 hover:bg-amber-600 text-white"
							disabled={stage === 'restoring' || !selected}
							onClick={() => selected && runRestore({ timestamp: selected.timestamp }, false)}
						>
							{stage === 'restoring' ? (
								<>
									<Loader className="w-4 h-4 mr-2 animate-spin" />
									Restoring…
								</>
							) : (
								'Restore'
							)}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
