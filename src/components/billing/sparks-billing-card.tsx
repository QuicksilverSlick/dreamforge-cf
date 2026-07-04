/**
 * Settings → Billing card: live Spark balance, current plan + renewal,
 * upgrade/portal actions, and the Spark price card in plain English.
 * The primary billing surface; Cloudflare-connect now lives BELOW this as an
 * advanced option (billing spec §7.4).
 */

import { useState } from 'react';
import { Zap, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { useBillingContext } from '@/contexts/billing-context';
import { SparksUpgradeDialog } from '@/components/billing/sparks-upgrade-dialog';

export function SparksBillingCard() {
	const { data } = useBillingContext();
	const [upgradeOpen, setUpgradeOpen] = useState(false);
	const [portalBusy, setPortalBusy] = useState(false);

	if (!data?.meteringEnabled) return null;

	const plan = data.subscription
		? data.plans.find((p) => p.key === data.subscription?.planKey)
		: data.plans.find((p) => p.priceUsd === 0);
	const renewsAt = data.subscription?.currentPeriodEnd
		? new Date(data.subscription.currentPeriodEnd).toLocaleDateString()
		: null;

	const openPortal = async () => {
		setPortalBusy(true);
		try {
			const response = await apiClient.createPortalSession(data.orgId);
			if (response.data?.url) {
				window.location.href = response.data.url;
				return;
			}
			toast.error(response.error?.message ?? 'Could not open the billing portal');
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Could not open the billing portal');
		} finally {
			setPortalBusy(false);
		}
	};

	const actionRows: Array<{ label: string; cost: number }> = [
		{ label: 'Full app build', cost: data.sparkCosts.build },
		{ label: 'Edit / revision', cost: data.sparkCosts.edit },
		{ label: 'Generated image', cost: data.sparkCosts.image },
		{ label: 'Deploy to production', cost: data.sparkCosts.deploy },
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Zap className="h-5 w-5 text-amber-500" />
					Sparks & billing
				</CardTitle>
				<CardDescription>
					Sparks are the credits that power your builds. Every plan refills monthly; unused
					Sparks roll over for a month.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<div className="flex flex-wrap items-center gap-x-8 gap-y-2">
					<div>
						<div className="text-xs text-text-tertiary">Balance</div>
						<div className="text-2xl font-bold tabular-nums">
							{data.balance.toLocaleString()}
							<span className="ml-1 text-sm font-normal text-text-tertiary">Sparks</span>
						</div>
						{data.debt > 0 && (
							<div className="text-xs text-red-500">
								{data.debt.toLocaleString()} Sparks owed from a refund — spending is paused.
							</div>
						)}
					</div>
					<div>
						<div className="text-xs text-text-tertiary">Plan</div>
						<div className="text-base font-medium">
							{plan?.name ?? 'Free'}
							{data.subscription && (
								<span className="ml-2 text-xs text-text-tertiary">({data.subscription.status})</span>
							)}
						</div>
						{renewsAt && <div className="text-xs text-text-tertiary">Renews {renewsAt}</div>}
					</div>
					<div className="ml-auto flex gap-2">
						{data.canManageBilling && (
							<>
								<Button size="sm" onClick={() => setUpgradeOpen(true)}>
									{data.subscription ? 'Change plan' : 'Upgrade'}
								</Button>
								{data.subscription && (
									<Button size="sm" variant="outline" onClick={openPortal} disabled={portalBusy}>
										{portalBusy ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<>
												Billing portal
												<ExternalLink className="ml-1 h-3 w-3" />
											</>
										)}
									</Button>
								)}
							</>
						)}
					</div>
				</div>

				<div className="grid grid-cols-2 gap-x-8 gap-y-1 rounded-md border border-border-primary bg-bg-3 p-3 text-sm sm:grid-cols-4">
					{actionRows.map((row) => (
						<div key={row.label} className="flex flex-col">
							<span className="text-xs text-text-tertiary">{row.label}</span>
							<span className="flex items-center gap-1 font-medium tabular-nums">
								<Zap className="h-3 w-3 text-amber-500" />
								{row.cost}
							</span>
						</div>
					))}
				</div>
			</CardContent>
			{upgradeOpen && (
				<SparksUpgradeDialog billing={data} open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
			)}
		</Card>
	);
}
