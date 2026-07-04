/**
 * The Sparks upgrade dialog — what a user sees when they're out of (or low on)
 * Sparks, replacing the legacy "Connect your Cloudflare account" modal
 * (billing spec §7.4). Shows the live balance, the EXPLORE plans, and a
 * plain-English translation of what Sparks buy. Org owners/admins go straight
 * to Stripe Checkout; members are pointed at their org admin.
 */

import { useState } from 'react';
import { Zap, Loader2, ExternalLink } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient, type BillingSummary } from '@/lib/api-client';

interface SparksUpgradeDialogProps {
	billing: BillingSummary;
	open: boolean;
	onClose: () => void;
	/** Optional headline override (e.g. the server's out-of-Sparks message). */
	reason?: string;
}

export function SparksUpgradeDialog({ billing, open, onClose, reason }: SparksUpgradeDialogProps) {
	const [busyPlanKey, setBusyPlanKey] = useState<string | null>(null);

	const paidPlans = billing.plans.filter((p) => p.priceUsd > 0);
	const buildCost = billing.sparkCosts.build;
	const editCost = billing.sparkCosts.edit;
	const hasPaidPlan = Boolean(billing.subscription);

	const startCheckout = async (planKey: string) => {
		setBusyPlanKey(planKey);
		try {
			const response = await apiClient.createCheckoutSession(billing.orgId, planKey);
			if (response.data?.url) {
				window.location.href = response.data.url;
				return;
			}
			toast.error(response.error?.message ?? 'Could not start checkout');
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Could not start checkout');
		} finally {
			setBusyPlanKey(null);
		}
	};

	const openPortal = async () => {
		setBusyPlanKey('portal');
		try {
			const response = await apiClient.createPortalSession(billing.orgId);
			if (response.data?.url) {
				window.location.href = response.data.url;
				return;
			}
			toast.error(response.error?.message ?? 'Could not open the billing portal');
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Could not open the billing portal');
		} finally {
			setBusyPlanKey(null);
		}
	};

	return (
		<Dialog open={open} onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<div className="mb-2 flex items-center gap-2">
						<Zap className="h-8 w-8 text-accent" />
						<span className="text-2xl font-semibold tabular-nums">
							{Math.max(0, billing.balance).toLocaleString()}
						</span>
						<span className="text-sm text-text-tertiary">Sparks left</span>
					</div>
					<DialogTitle className="text-xl">
						{reason ?? (billing.balance < buildCost ? 'You need more Sparks' : 'Get more Sparks')}
					</DialogTitle>
					<DialogDescription className="pt-1 text-sm">
						Sparks power everything you build here — a full app build is {buildCost}, an edit
						is {editCost}. Pick a plan and keep going; unused Sparks roll over a month.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-3 sm:grid-cols-2">
					{paidPlans.map((plan) => {
						const buildsPerMonth = Math.floor(plan.monthlySparks / buildCost);
						const busy = busyPlanKey === plan.key;
						return (
							<div
								key={plan.key}
								className="flex flex-col gap-2 rounded-lg border border-border-primary bg-bg-3 p-4"
							>
								<div className="flex items-baseline justify-between">
									<span className="font-semibold">{plan.name}</span>
									<span className="text-lg font-bold">
										${plan.priceUsd}
										<span className="text-xs font-normal text-text-tertiary">/mo</span>
									</span>
								</div>
								<div className="flex items-center gap-1 text-sm text-text-secondary">
									<Zap className="h-3.5 w-3.5 text-accent" />
									{plan.monthlySparks.toLocaleString()} Sparks / month
								</div>
								<p className="text-xs text-text-tertiary">
									≈ {buildsPerMonth} full app builds, or fewer builds plus hundreds of edits.
								</p>
								{billing.canManageBilling ? (
									<Button
										size="sm"
										className="mt-auto w-full"
										disabled={busyPlanKey !== null || !billing.stripeConfigured}
										onClick={() => startCheckout(plan.key)}
									>
										{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : `Get ${plan.name.replace('Explore ', '')}`}
									</Button>
								) : null}
							</div>
						);
					})}
				</div>

				{!billing.canManageBilling && (
					<p className="text-xs text-text-tertiary">
						Only your organization's owner or admin can change the plan — ask them to upgrade.
					</p>
				)}

				{billing.canManageBilling && hasPaidPlan && (
					<button
						type="button"
						onClick={openPortal}
						disabled={busyPlanKey !== null}
						className="inline-flex items-center gap-1 self-start text-xs text-text-tertiary underline-offset-2 hover:underline"
					>
						Manage existing subscription
						<ExternalLink className="h-3 w-3" />
					</button>
				)}
			</DialogContent>
		</Dialog>
	);
}
