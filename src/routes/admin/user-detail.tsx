import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Ban, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import {
    useAdminUser,
    useAdminUserApps,
    useAdminUserSessions,
    useAdminUserSecrets,
} from '@/hooks/use-admin';
import { formatDate } from './admin-utils';
import { RoleBadge, StatusBadge } from './admin-shared';

function StatTile({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg border border-border p-4">
            <div className="text-2xl font-semibold">{value.toLocaleString()}</div>
            <div className="text-sm text-text-primary/60">{label}</div>
        </div>
    );
}

// --- Lazily-loaded tabs: each hook runs only when its tab is mounted (active),
// so the cross-user view (and its audit entry) fires on actual access. ---

function AppsTab({ userId }: { userId: string }) {
    const { data, loading, error } = useAdminUserApps(userId);
    if (loading) return <Skeleton className="h-40 w-full" />;
    if (error) return <p className="text-sm text-red-500">{error}</p>;
    const apps = data?.data ?? [];
    if (apps.length === 0) return <p className="text-sm text-text-primary/50 py-4">No apps.</p>;
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Framework</TableHead>
                    <TableHead>Created</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {apps.map((app) => (
                    <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.title}</TableCell>
                        <TableCell>{app.status}</TableCell>
                        <TableCell>{app.visibility}</TableCell>
                        <TableCell>{app.framework ?? '—'}</TableCell>
                        <TableCell>{formatDate(app.createdAt)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function SessionsTab({ userId }: { userId: string }) {
    const { data, loading, error } = useAdminUserSessions(userId);
    if (loading) return <Skeleton className="h-40 w-full" />;
    if (error) return <p className="text-sm text-red-500">{error}</p>;
    const sessions = data?.sessions ?? [];
    if (sessions.length === 0) return <p className="text-sm text-text-primary/50 py-4">No active sessions.</p>;
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>IP address</TableHead>
                    <TableHead>Device / user agent</TableHead>
                    <TableHead>Last active</TableHead>
                    <TableHead>Created</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sessions.map((s) => (
                    <TableRow key={s.id}>
                        <TableCell>{s.ipAddress ?? '—'}</TableCell>
                        <TableCell className="max-w-md truncate">{s.userAgent ?? '—'}</TableCell>
                        <TableCell>{formatDate(s.lastActivity, true)}</TableCell>
                        <TableCell>{formatDate(s.createdAt, true)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function SecretsTab({ userId }: { userId: string }) {
    const { data, loading, error } = useAdminUserSecrets(userId);
    if (loading) return <Skeleton className="h-40 w-full" />;
    if (error) return <p className="text-sm text-red-500">{error}</p>;
    const secrets = data?.secrets ?? [];
    const github = data?.github ?? null;
    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-2 text-sm font-medium text-text-primary/70">BYOK / secrets</h3>
                {secrets.length === 0 ? (
                    <p className="text-sm text-text-primary/50">No stored secrets.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Provider</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Preview</TableHead>
                                <TableHead>Active</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {secrets.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-medium">{s.name}</TableCell>
                                    <TableCell>{s.provider}</TableCell>
                                    <TableCell>{s.secretType}</TableCell>
                                    <TableCell className="font-mono text-xs">{s.keyPreview}</TableCell>
                                    <TableCell>{s.isActive ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                <p className="mt-2 text-xs text-text-primary/40">
                    Secret values are encrypted and never shown — preview only.
                </p>
            </div>
            <div>
                <h3 className="mb-2 text-sm font-medium text-text-primary/70">GitHub connection</h3>
                {github?.connected ? (
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant={github.isActive && !github.isRevoked ? 'outline' : 'secondary'}>
                            {github.isRevoked ? 'Revoked' : github.isActive ? 'Connected' : 'Inactive'}
                        </Badge>
                        <span className="text-text-primary/60">
                            scopes: {github.scopes.length ? github.scopes.join(', ') : '—'}
                        </span>
                    </div>
                ) : (
                    <p className="text-sm text-text-primary/50">Not connected.</p>
                )}
            </div>
        </div>
    );
}

export default function AdminUserDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userId = id ?? '';
    const { data, loading, error, refetch } = useAdminUser(userId);

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [reason, setReason] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const user = data?.user;
    const isSuspended = !!user?.isSuspended;

    const handleAction = async () => {
        if (!user) return;
        if (!isSuspended && reason.trim().length < 3) {
            toast.error('A reason (at least 3 characters) is required to suspend.');
            return;
        }
        setSubmitting(true);
        try {
            const res = isSuspended
                ? await apiClient.reactivateUser(user.id, reason.trim() || undefined)
                : await apiClient.suspendUser(user.id, reason.trim());
            if (res.success) {
                toast.success(isSuspended ? 'Account reactivated' : 'Account suspended');
                setDialogOpen(false);
                setReason('');
                await refetch();
            } else {
                toast.error('Action failed');
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Action failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/users')} className="-ml-2">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to users
            </Button>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Failed to load user</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loading ? (
                <Skeleton className="h-40 w-full" />
            ) : user ? (
                <>
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-xl">{user.displayName}</CardTitle>
                                <p className="text-text-primary/60">{user.email}</p>
                                <div className="flex items-center gap-2 pt-1">
                                    <RoleBadge role={user.role} />
                                    <StatusBadge user={user} />
                                    <span className="text-xs text-text-primary/50">
                                        via {user.provider} · joined {formatDate(user.createdAt)}
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant={isSuspended ? 'outline' : 'destructive'}
                                onClick={() => {
                                    setReason('');
                                    setDialogOpen(true);
                                }}
                            >
                                {isSuspended ? (
                                    <>
                                        <ShieldCheck className="h-4 w-4 mr-2" /> Reactivate
                                    </>
                                ) : (
                                    <>
                                        <Ban className="h-4 w-4 mr-2" /> Suspend
                                    </>
                                )}
                            </Button>
                        </CardHeader>
                    </Card>

                    <Tabs defaultValue="overview">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="apps">Apps</TabsTrigger>
                            <TabsTrigger value="sessions">Sessions</TabsTrigger>
                            <TabsTrigger value="secrets">Secrets</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="pt-4">
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <StatTile label="Apps" value={data!.stats.appCount} />
                                <StatTile label="Public apps" value={data!.stats.publicAppCount} />
                                <StatTile label="Favorites" value={data!.stats.favoriteCount} />
                                <StatTile label="Likes received" value={data!.stats.totalLikesReceived} />
                                <StatTile label="Views received" value={data!.stats.totalViewsReceived} />
                                <StatTile label="Streak (days)" value={data!.stats.streakDays} />
                            </div>
                        </TabsContent>
                        <TabsContent value="apps" className="pt-4">
                            <AppsTab userId={user.id} />
                        </TabsContent>
                        <TabsContent value="sessions" className="pt-4">
                            <SessionsTab userId={user.id} />
                        </TabsContent>
                        <TabsContent value="secrets" className="pt-4">
                            <SecretsTab userId={user.id} />
                        </TabsContent>
                    </Tabs>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {isSuspended ? 'Reactivate account' : 'Suspend account'}
                                </DialogTitle>
                                <DialogDescription>
                                    {isSuspended
                                        ? 'This restores the user’s access immediately.'
                                        : 'The user will be signed out and blocked from authenticating until reactivated.'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                                <Textarea
                                    placeholder={
                                        isSuspended ? 'Reason (optional)' : 'Reason (required, for the audit log)'
                                    }
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                                    Cancel
                                </Button>
                                <Button
                                    variant={isSuspended ? 'default' : 'destructive'}
                                    onClick={handleAction}
                                    disabled={submitting}
                                >
                                    {isSuspended ? 'Reactivate' : 'Suspend'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            ) : (
                !loading && <p className="text-text-primary/50">User not found.</p>
            )}
        </div>
    );
}
