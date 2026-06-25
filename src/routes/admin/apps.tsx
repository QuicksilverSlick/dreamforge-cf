import React from 'react';
import { useNavigate } from 'react-router';
import { Search, ImageOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useAdminApps } from '@/hooks/use-admin';
import { formatDate } from './admin-utils';
import type { AdminAppStatusFilter, AdminAppVisibilityFilter, AdminAppSummary } from '@/api-types';

const PAGE_SIZE = 20;

/** Org plan badge — the free/paid signal (everyone is 'free' until billing lands). */
function PlanBadge({ plan }: { plan: string | null }) {
    const p = plan ?? 'free';
    return <Badge variant={p === 'free' ? 'outline' : 'default'}>{p}</Badge>;
}

function AppStatusBadge({ status }: { status: AdminAppSummary['status'] }) {
    return (
        <Badge variant={status === 'completed' ? 'secondary' : 'outline'}>
            {status === 'completed' ? 'Completed' : 'Generating'}
        </Badge>
    );
}

function Thumb({ url, title }: { url: string | null; title: string }) {
    if (!url) {
        return (
            <div className="flex h-10 w-16 items-center justify-center rounded bg-bg-3 text-text-primary/30">
                <ImageOff className="h-4 w-4" />
            </div>
        );
    }
    return <img src={url} alt={title} className="h-10 w-16 rounded object-cover" loading="lazy" />;
}

export default function AdminApps() {
    const navigate = useNavigate();
    const [qInput, setQInput] = React.useState('');
    const [q, setQ] = React.useState('');
    const [status, setStatus] = React.useState<AdminAppStatusFilter>('all');
    const [visibility, setVisibility] = React.useState<AdminAppVisibilityFilter>('all');
    const [page, setPage] = React.useState(0);

    // Debounce the search box; the debounced term + page reset land in one batched
    // update so the list hook never runs a new filter against a stale offset.
    React.useEffect(() => {
        const t = setTimeout(() => {
            setQ(qInput.trim());
            setPage(0);
        }, 300);
        return () => clearTimeout(t);
    }, [qInput]);

    const { data, loading, error } = useAdminApps({
        q: q || undefined,
        status: status === 'all' ? undefined : status,
        visibility: visibility === 'all' ? undefined : visibility,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
    });

    const apps = data?.data ?? [];
    const hasMore = data?.pagination.hasMore ?? false;

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Apps</h1>
                <p className="text-text-primary/60">Every app across all users — click a row to open the owner</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-primary/40" />
                    <Input
                        placeholder="Search title, description, or owner email"
                        value={qInput}
                        onChange={(e) => setQInput(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select
                    value={status}
                    onValueChange={(v) => {
                        setStatus(v as AdminAppStatusFilter);
                        setPage(0);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-44">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="generating">Generating</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={visibility}
                    onValueChange={(v) => {
                        setVisibility(v as AdminAppVisibilityFilter);
                        setPage(0);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All visibility</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Failed to load apps</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20">Preview</TableHead>
                                <TableHead>App</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Visibility</TableHead>
                                <TableHead>Created</TableHead>
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
                            ) : apps.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-text-primary/50 py-8">
                                        No apps found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                apps.map((a) => (
                                    <TableRow
                                        key={a.id}
                                        className={a.ownerId ? 'cursor-pointer' : undefined}
                                        onClick={() => a.ownerId && navigate(`/admin/users/${a.ownerId}`)}
                                    >
                                        <TableCell>
                                            <Thumb url={a.screenshotUrl} title={a.title} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium line-clamp-1 max-w-xs">{a.title}</div>
                                            {a.framework && (
                                                <div className="text-xs text-text-primary/50">{a.framework}</div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="line-clamp-1 max-w-[14rem]">{a.ownerEmail ?? '—'}</div>
                                            {a.ownerProvider && (
                                                <div className="text-xs text-text-primary/50">via {a.ownerProvider}</div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <PlanBadge plan={a.orgPlan} />
                                        </TableCell>
                                        <TableCell>
                                            <AppStatusBadge status={a.status} />
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={a.visibility === 'public' ? 'secondary' : 'outline'}>
                                                {a.visibility}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{formatDate(a.createdAt)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary/60">{data ? `${data.pagination.total} total` : ''}</span>
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
