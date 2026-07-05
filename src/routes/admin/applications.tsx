import React from 'react';
import { toast } from 'sonner';
import { Search, CheckCircle2, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { apiClient } from '@/lib/api-client';
import { useAdminProduceApplications } from '@/hooks/use-admin';
import { formatDate } from './admin-utils';
import {
    PRODUCE_APPLICATION_STATUSES,
    PRODUCE_STATUS_LABELS,
    PRODUCE_TIER_LABELS,
} from 'shared/constants/produce';
import type { ProduceApplicationStatus } from '@/api-types';

const PAGE_SIZE = 20;

type StageFilter = ProduceApplicationStatus | 'all';

export default function AdminApplications() {
    const [qInput, setQInput] = React.useState('');
    const [q, setQ] = React.useState('');
    const [stage, setStage] = React.useState<StageFilter>('all');
    const [page, setPage] = React.useState(0);
    const [expandedId, setExpandedId] = React.useState<string | null>(null);
    const [updatingId, setUpdatingId] = React.useState<string | null>(null);

    // Debounce the search box; the debounced term + page reset land in one
    // batched update so the list hook never runs a new filter against a
    // stale offset.
    React.useEffect(() => {
        const t = setTimeout(() => {
            setQ(qInput.trim());
            setPage(0);
        }, 300);
        return () => clearTimeout(t);
    }, [qInput]);

    const { data, loading, error, refetch } = useAdminProduceApplications({
        q: q || undefined,
        status: stage === 'all' ? undefined : stage,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
    });
    const applications = data?.data ?? [];
    const hasMore = data?.pagination.hasMore ?? false;
    const statusCounts = data?.statusCounts;
    const allCount = statusCounts
        ? Object.values(statusCounts).reduce((sum, n) => sum + n, 0)
        : undefined;

    const moveToStage = async (applicationId: string, status: ProduceApplicationStatus) => {
        setUpdatingId(applicationId);
        try {
            const res = await apiClient.patchAdminProduceApplicationStatus(applicationId, status);
            if (res.success) {
                toast.success(`Moved to ${PRODUCE_STATUS_LABELS[status]}`);
                await refetch();
            } else {
                toast.error(res.error?.message ?? 'Status update failed');
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Status update failed');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Produce applications</h1>
                <p className="text-text-primary/60">
                    The PRODUCE sales pipeline — every application from the apply page, newest first.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={stage === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            setStage('all');
                            setPage(0);
                        }}
                    >
                        All{allCount !== undefined ? ` (${allCount})` : ''}
                    </Button>
                    {PRODUCE_APPLICATION_STATUSES.map((status) => (
                        <Button
                            key={status}
                            variant={stage === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                                setStage(status);
                                setPage(0);
                            }}
                        >
                            {PRODUCE_STATUS_LABELS[status]}
                            {statusCounts ? ` (${statusCounts[status]})` : ''}
                        </Button>
                    ))}
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-primary/40" />
                    <Input
                        className="pl-9"
                        placeholder="Search name, email, company…"
                        value={qInput}
                        onChange={(e) => setQInput(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Failed to load applications</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Applicant</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Tier</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Received</TableHead>
                                <TableHead className="text-center">Ack</TableHead>
                                <TableHead className="w-40">Stage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={7}>
                                            <Skeleton className="h-10 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : applications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-text-primary/50 py-8">
                                        No applications found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                applications.map((application) => (
                                    <React.Fragment key={application.id}>
                                        <TableRow
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setExpandedId((id) =>
                                                    id === application.id ? null : application.id,
                                                )
                                            }
                                        >
                                            <TableCell>
                                                <div className="line-clamp-1 max-w-[14rem] font-medium">
                                                    {application.name}
                                                </div>
                                                <div className="text-xs text-text-primary/50 line-clamp-1 max-w-[14rem]">
                                                    {application.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="line-clamp-1 max-w-[10rem]">
                                                    {application.company || '—'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                {PRODUCE_TIER_LABELS[application.tier]}
                                            </TableCell>
                                            <TableCell>
                                                <span className="line-clamp-1 max-w-[8rem] text-text-primary/60">
                                                    {application.source || '—'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap text-xs">
                                                {formatDate(application.createdAt, true)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {application.ackSent ? (
                                                    <CheckCircle2 className="h-4 w-4 text-accent inline-block" />
                                                ) : (
                                                    <span className="text-text-primary/40">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <Select
                                                    value={application.status}
                                                    disabled={updatingId === application.id}
                                                    onValueChange={(v) =>
                                                        void moveToStage(
                                                            application.id,
                                                            v as ProduceApplicationStatus,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-36">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {PRODUCE_APPLICATION_STATUSES.map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {PRODUCE_STATUS_LABELS[status]}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                        {expandedId === application.id && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="bg-bg-3/40">
                                                    <div className="space-y-2 py-2">
                                                        <p className="whitespace-pre-wrap text-sm text-text-primary/80">
                                                            {application.projectDescription}
                                                        </p>
                                                        <a
                                                            href={`mailto:${application.email}?subject=${encodeURIComponent('Your Dreamforge Produce application')}`}
                                                            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                                                        >
                                                            <Mail className="h-3.5 w-3.5" />
                                                            Reply to {application.email}
                                                        </a>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary/60">
                    {data ? `${data.pagination.total} total` : ''}
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 0 || loading}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!hasMore || loading}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
