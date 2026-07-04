/**
 * Header Spark-balance badge — the platform-billing replacement for the
 * Cloudflare-connect UsageLimitsBadge (billing spec §7.4). Shows the org's
 * live balance; turns red when the balance can't cover a build. Clicking
 * opens the upgrade dialog.
 */

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { useBillingContext } from '@/contexts/billing-context';
import { SparksUpgradeDialog } from '@/components/billing/sparks-upgrade-dialog';

export function SparksBalanceBadge() {
	const { data } = useBillingContext();
	const [dialogOpen, setDialogOpen] = useState(false);

	if (!data?.meteringEnabled) return null;

	const low = data.balance < data.sparkCosts.build;
	const planName = data.subscription
		? data.plans.find((p) => p.key === data.subscription?.planKey)?.name
		: null;

	return (
		<>
			<button
				type="button"
				onClick={() => setDialogOpen(true)}
				title={planName ? `${planName} plan` : 'Sparks balance'}
				className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
					low
						? 'border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/20'
						: 'border-accent/40 bg-bg-4 text-text-primary hover:bg-accent/10'
				}`}
			>
				<Zap className={`h-3.5 w-3.5 ${low ? 'text-red-500' : 'text-accent'}`} />
				<span className="tabular-nums">{Math.max(0, data.balance).toLocaleString()}</span>
				<span className="hidden md:inline text-text-tertiary">Sparks</span>
			</button>
			{dialogOpen && (
				<SparksUpgradeDialog billing={data} open={dialogOpen} onClose={() => setDialogOpen(false)} />
			)}
		</>
	);
}
