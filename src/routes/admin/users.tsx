import React from 'react';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';
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
import { useAdminUsers } from '@/hooks/use-admin';
import { formatDate } from './admin-utils';
import { RoleBadge, StatusBadge } from './admin-shared';
import type { AdminUserStatusFilter, UserRole } from '@/api-types';

const PAGE_SIZE = 20;
const ROLE_OPTIONS: UserRole[] = ['superadmin', 'admin', 'support', 'ai_support', 'ai_admin', 'user'];

export default function AdminUsers() {
    const navigate = useNavigate();
    const [qInput, setQInput] = React.useState('');
    const [q, setQ] = React.useState('');
    const [role, setRole] = React.useState<UserRole | 'all'>('all');
    const [status, setStatus] = React.useState<AdminUserStatusFilter>('all');
    const [page, setPage] = React.useState(0);

    // Debounce the search box so we don't fire a request per keystroke. The
    // debounced term and the page reset land in the same batched update, so the
    // list hook is never invoked with a new filter paired with a stale offset.
    React.useEffect(() => {
        const t = setTimeout(() => {
            setQ(qInput.trim());
            setPage(0);
        }, 300);
        return () => clearTimeout(t);
    }, [qInput]);

    const { data, loading, error } = useAdminUsers({
        q: q || undefined,
        role: role === 'all' ? undefined : role,
        status: status === 'all' ? undefined : status,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
    });

    const users = data?.data ?? [];
    const hasMore = data?.pagination.hasMore ?? false;

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Users</h1>
                <p className="text-text-primary/60">Search and manage accounts</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-primary/40" />
                    <Input
                        placeholder="Search email, name, or username"
                        value={qInput}
                        onChange={(e) => setQInput(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select
                    value={role}
                    onValueChange={(v) => {
                        setRole(v as UserRole | 'all');
                        setPage(0);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-44">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All roles</SelectItem>
                        {ROLE_OPTIONS.map((r) => (
                            <SelectItem key={r} value={r}>
                                {r}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={status}
                    onValueChange={(v) => {
                        setStatus(v as AdminUserStatusFilter);
                        setPage(0);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Failed to load users</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Last active</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6}>
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-text-primary/50 py-8">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((u) => (
                                    <TableRow
                                        key={u.id}
                                        className="cursor-pointer"
                                        onClick={() => navigate(`/admin/users/${u.id}`)}
                                    >
                                        <TableCell className="font-medium">{u.email}</TableCell>
                                        <TableCell>{u.displayName}</TableCell>
                                        <TableCell>
                                            <RoleBadge role={u.role} />
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge user={u} />
                                        </TableCell>
                                        <TableCell>{formatDate(u.createdAt)}</TableCell>
                                        <TableCell>{formatDate(u.lastActiveAt)}</TableCell>
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
