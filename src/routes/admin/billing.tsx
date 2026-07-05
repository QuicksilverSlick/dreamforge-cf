/**
 * /admin/billing — operator Sparks credit controls (billing spec §0.5).
 * Look up any user (email / id) or org (id / slug) → live balance, plan,
 * recent ledger → grant / deduct / set with a mandatory reason. Superadmin
 * only (server-enforced); every view and adjustment is audited server-side.
 */

import React from 'react';
import { Search, Zap, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { formatDate } from './admin-utils';
import type { AdminBillingSummaryData } from '@/api-types';

type AdjustMode = 'grant' | 'deduct' | 'set';

export default function AdminBilling() {
    const [query, setQuery] = React.useState('');
    const [searching, setSearching] = React.useState(false);
    const [summary, setSummary] = React.useState<AdminBillingSummaryData | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const [mode, setMode] = React.useState<AdjustMode>('grant');
    const [amount, setAmount] = React.useState('');
    const [reason, setReason] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const runSearch = async (q?: string) => {
        const term = (q ?? query).trim();
        if (!term) return;
        setSearching(true);
        setError(null);
        try {
            const response = await apiClient.getAdminBillingSummary(term);
            if (response.success && response.data) {
                setSummary(response.data);
            } else {
                setSummary(null);
                setError(response.error?.message ?? 'No organization or user matched that query');
            }
        } catch (err) {
            setSummary(null);
            setError(err instanceof Error ? err.message : 'Lookup failed');
        } finally {
            setSearching(false);
        }
    };

    const submitAdjustment = async () => {
        if (!summary) return;
        const value = Number(amount);
        if (!Number.isInteger(value) || value <= 0) {
            toast.error('Amount must be a positive whole number of Sparks');
            return;
        }
        if (reason.trim().length < 3) {
            toast.error('A reason is required (min 3 characters)');
            return;
        }
        setSubmitting(true);
        try {
            const payload =
                mode === 'set'
                    ? { orgId: summary.org.id, setTo: value, reason: reason.trim() }
                    : { orgId: summary.org.id, delta: mode === 'grant' ? value : -value, reason: reason.trim() };
            const response = await apiClient.postAdminBillingAdjust(payload);
            if (response.success && response.data) {
                toast.success(
                    `Balance updated: ${response.data.delta > 0 ? '+' : ''}${response.data.delta} Sparks → ${response.data.balanceAfter.toLocaleString()}`,
                );
                setAmount('');
                setReason('');
                await runSearch(summary.org.id);
            } else {
                toast.error(response.error?.message ?? 'Adjustment failed');
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Adjustment failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Zap className="h-6 w-6 text-accent" />
                    Sparks Billing
                </h1>
                <p className="text-sm text-text-tertiary">
                    Look up a user or organization, inspect their balance and ledger, and apply audited
                    credit adjustments.
                </p>
            </div>

            {/* Lookup */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    runSearch();
                }}
                className="flex gap-2"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="User email, user id, org id, or org slug…"
                        className="pl-9"
                    />
                </div>
                <Button type="submit" disabled={searching || !query.trim()}>
                    {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Look up'}
                </Button>
            </form>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {summary && (
                <>
                    {/* Balance summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                                {summary.org.name}
                                <Badge variant="secondary">{summary.org.isPersonal ? 'personal org' : 'team org'}</Badge>
                                {summary.subscription ? (
                                    <Badge>
                                        {summary.subscription.planKey} · {summary.subscription.status}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">free</Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap items-end gap-x-10 gap-y-3">
                            <div>
                                <div className="text-xs text-text-tertiary">Balance</div>
                                <div className="text-3xl font-bold tabular-nums flex items-center gap-1.5">
                                    <Zap className="h-5 w-5 text-accent" />
                                    {summary.balance.toLocaleString()}
                                </div>
                                {summary.debt > 0 && (
                                    <div className="text-xs text-red-500">{summary.debt.toLocaleString()} Sparks debt outstanding</div>
                                )}
                            </div>
                            <div className="text-sm text-text-secondary space-y-0.5">
                                <div>
                                    <span className="text-text-tertiary">Org id:</span>{' '}
                                    <code className="text-xs">{summary.org.id}</code>
                                </div>
                                <div>
                                    <span className="text-text-tertiary">Owner:</span> {summary.org.ownerEmail ?? '—'}
                                </div>
                                {summary.matchedUser && (
                                    <div>
                                        <span className="text-text-tertiary">Matched user:</span> {summary.matchedUser.email}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Adjustment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Adjust credits</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap items-end gap-3">
                            <div className="w-36">
                                <div className="mb-1 text-xs text-text-tertiary">Action</div>
                                <Select value={mode} onValueChange={(v) => setMode(v as AdjustMode)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="grant">Grant (+)</SelectItem>
                                        <SelectItem value="deduct">Deduct (−)</SelectItem>
                                        <SelectItem value="set">Set balance to</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-36">
                                <div className="mb-1 text-xs text-text-tertiary">Sparks</div>
                                <Input
                                    inputMode="numeric"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="e.g. 400"
                                />
                            </div>
                            <div className="min-w-64 flex-1">
                                <div className="mb-1 text-xs text-text-tertiary">Reason (required, audited)</div>
                                <Input
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="e.g. refund: failed builds on 2026-07-04"
                                />
                            </div>
                            <Button onClick={submitAdjustment} disabled={submitting}>
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Ledger */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Recent ledger</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {summary.ledger.length === 0 ? (
                                <p className="text-sm text-text-tertiary">No ledger entries yet.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>When</TableHead>
                                                <TableHead>Kind</TableHead>
                                                <TableHead>Action</TableHead>
                                                <TableHead className="text-right">Δ Sparks</TableHead>
                                                <TableHead className="text-right">Balance after</TableHead>
                                                <TableHead>Reason</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {summary.ledger.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell className="whitespace-nowrap text-xs">
                                                        {row.createdAt ? formatDate(String(row.createdAt)) : '—'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={row.delta >= 0 ? 'secondary' : 'outline'} className="text-xs">
                                                            {row.kind}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-xs">{row.actionType ?? '—'}</TableCell>
                                                    <TableCell
                                                        className={`text-right tabular-nums ${row.delta >= 0 ? 'text-accent' : 'text-red-500'}`}
                                                    >
                                                        {row.delta > 0 ? `+${row.delta}` : row.delta}
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">{row.balanceAfter}</TableCell>
                                                    <TableCell className="max-w-64 truncate text-xs text-text-tertiary">
                                                        {row.reason ?? '—'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
