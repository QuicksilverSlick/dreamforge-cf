import React from 'react';
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
import { Badge } from '@/components/ui/badge';
import { useAdminAuditLogs } from '@/hooks/use-admin';
import { formatDate } from './admin-utils';

const PAGE_SIZE = 50;
const ENTITY_TYPES = ['user', 'app', 'audit_log', 'session'];

export default function AdminAudit() {
    const [userIdInput, setUserIdInput] = React.useState('');
    const [userId, setUserId] = React.useState('');
    const [entityType, setEntityType] = React.useState<string>('all');
    const [actionInput, setActionInput] = React.useState('');
    const [action, setAction] = React.useState('');
    const [page, setPage] = React.useState(0);

    // Debounced text filters + page reset in one batched update, so the list
    // hook is never invoked with a new filter paired with a stale offset.
    React.useEffect(() => {
        const t = setTimeout(() => {
            setUserId(userIdInput.trim());
            setAction(actionInput.trim());
            setPage(0);
        }, 300);
        return () => clearTimeout(t);
    }, [userIdInput, actionInput]);

    const { data, loading, error } = useAdminAuditLogs({
        userId: userId || undefined,
        entityType: entityType === 'all' ? undefined : entityType,
        action: action || undefined,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
    });

    const rows = data?.data ?? [];
    const hasMore = data?.pagination.hasMore ?? false;

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Audit log</h1>
                <p className="text-text-primary/60">Operator actions and cross-user access</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                    placeholder="Actor user ID"
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    className="sm:w-64"
                />
                <Input
                    placeholder="Action (e.g. admin.user.suspend)"
                    value={actionInput}
                    onChange={(e) => setActionInput(e.target.value)}
                    className="flex-1"
                />
                <Select
                    value={entityType}
                    onValueChange={(v) => {
                        setEntityType(v);
                        setPage(0);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-44">
                        <SelectValue placeholder="Entity type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All entities</SelectItem>
                        {ENTITY_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                                {t}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Failed to load audit log</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Actor</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>IP</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5}>
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-text-primary/50 py-8">
                                        No audit entries
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {formatDate(row.createdAt, true)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {row.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{row.userId ?? '—'}</TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {row.entityType}:{row.entityId}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{row.ipAddress ?? '—'}</TableCell>
                                    </TableRow>
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
