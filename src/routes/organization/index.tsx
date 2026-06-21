import React from 'react';
import { useNavigate } from 'react-router';
import { Copy, Mail, Trash2, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { useMyOrgs, useOrgMembers, useOrgInvites } from '@/hooks/use-organizations';
import { formatOrgRole } from '@/routes/org/org-utils';
import { formatDate } from '@/routes/admin/admin-utils';
import { apiClient } from '@/lib/api-client';
import type { OrgMemberView, OrgRole } from '@/api-types';

/** Organization settings + member management for the ACTIVE org. */
export default function OrganizationPage() {
    const navigate = useNavigate();
    const { user, activeOrgId, activeOrgRole, refreshUser } = useAuth();
    const { data: myOrgs, refetch: refetchOrgs } = useMyOrgs();
    const active = myOrgs?.organizations.find((o) => o.org.id === activeOrgId);
    const isPersonal = active?.org.isPersonal ?? false;
    const isOwner = activeOrgRole === 'owner';

    if (active && isPersonal) {
        return (
            <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Organization</h1>
                    <p className="text-text-primary/60">{active.org.name}</p>
                </div>
                <Alert>
                    <AlertTitle>This is your personal workspace</AlertTitle>
                    <AlertDescription>
                        Personal workspaces are just for you. Create a team to invite others and collaborate
                        on apps together — use the organization switcher in the top bar, then come back here to
                        manage members.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
            <div>
                <h1 className="text-2xl font-semibold">Organization</h1>
                <p className="text-text-primary/60">Manage your team's settings, members, and invitations</p>
            </div>

            <OrgSettingsCard
                orgId={activeOrgId}
                orgName={active?.org.name ?? ''}
                onRenamed={async () => {
                    await Promise.all([refreshUser(), refetchOrgs()]);
                }}
            />

            <MembersCard
                orgId={activeOrgId}
                currentUserId={user?.id}
                isOwner={isOwner}
                onLeft={async () => {
                    await refreshUser();
                    navigate('/');
                }}
            />

            <InvitesCard orgId={activeOrgId} />

            {isOwner && activeOrgId && (
                <DangerZoneCard
                    orgId={activeOrgId}
                    orgName={active?.org.name ?? ''}
                    onDeleted={async () => {
                        await Promise.all([refreshUser(), refetchOrgs()]);
                        navigate('/');
                    }}
                />
            )}
        </div>
    );
}

/** Owner-only delete with a type-the-name confirmation (the action is irreversible). */
function DangerZoneCard({
    orgId,
    orgName,
    onDeleted,
}: {
    orgId: string;
    orgName: string;
    onDeleted: () => Promise<void>;
}) {
    const [open, setOpen] = React.useState(false);
    const [confirmText, setConfirmText] = React.useState('');
    const [busy, setBusy] = React.useState(false);
    const canDelete = confirmText.trim() === orgName.trim() && orgName.trim() !== '';

    const handleDelete = async () => {
        if (!canDelete || busy) {
            return;
        }
        setBusy(true);
        try {
            const res = await apiClient.deleteOrg(orgId);
            if (!res.success) {
                throw new Error(res.error?.message ?? 'Failed to delete organization');
            }
            toast.success(`Deleted "${orgName}"`);
            setOpen(false);
            await onDeleted();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete organization');
        } finally {
            setBusy(false);
        }
    };

    return (
        <Card className="border-destructive/40">
            <CardHeader>
                <CardTitle className="text-destructive">Danger zone</CardTitle>
                <CardDescription>
                    Deleting this team is permanent and can’t be undone. Its apps move to your personal
                    workspace, and all members lose access.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    variant="destructive"
                    onClick={() => {
                        setConfirmText('');
                        setOpen(true);
                    }}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete this team
                </Button>
            </CardContent>

            <AlertDialog open={open} onOpenChange={(o) => !busy && setOpen(o)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete “{orgName}”?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This permanently deletes the team. Its apps will be moved to your personal
                            workspace and all members will lose access. To confirm, type the team name below.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2 py-2">
                        <Label htmlFor="confirm-org-name">
                            Type <span className="font-medium text-text-primary">{orgName}</span> to confirm
                        </Label>
                        <Input
                            id="confirm-org-name"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder={orgName}
                            autoComplete="off"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                void handleDelete();
                            }}
                            disabled={!canDelete || busy}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {busy ? 'Deleting…' : 'Delete team'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

function OrgSettingsCard({
    orgId,
    orgName,
    onRenamed,
}: {
    orgId: string | undefined;
    orgName: string;
    onRenamed: () => Promise<void>;
}) {
    const [name, setName] = React.useState(orgName);
    const [saving, setSaving] = React.useState(false);
    React.useEffect(() => setName(orgName), [orgName]);

    const dirty = name.trim() !== orgName && name.trim().length > 0;

    const save = async () => {
        if (!orgId || !dirty || saving) {
            return;
        }
        setSaving(true);
        try {
            const res = await apiClient.renameOrg(orgId, name.trim());
            if (res.success) {
                toast.success('Organization renamed');
                await onRenamed();
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to rename');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Your organization's display name.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="org-name">Name</Label>
                        <Input
                            id="org-name"
                            value={name}
                            maxLength={100}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => void save()} disabled={!dirty || saving}>
                        {saving ? 'Saving…' : 'Save'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function MembersCard({
    orgId,
    currentUserId,
    isOwner,
    onLeft,
}: {
    orgId: string | undefined;
    currentUserId: string | undefined;
    isOwner: boolean;
    onLeft: () => Promise<void>;
}) {
    const { data, loading, error, refetch } = useOrgMembers(orgId);
    const [pendingRemove, setPendingRemove] = React.useState<OrgMemberView | null>(null);
    const [busy, setBusy] = React.useState(false);
    const members = data?.members ?? [];

    const roleOptions: OrgRole[] = isOwner ? ['owner', 'admin', 'member'] : ['admin', 'member'];

    const canEditRow = (m: OrgMemberView): boolean => {
        if (m.userId === currentUserId) {
            return false; // never edit your own role from the table
        }
        return isOwner || m.role !== 'owner'; // admins can't touch owners
    };

    const changeRole = async (m: OrgMemberView, role: OrgRole) => {
        if (!orgId || role === m.role || busy) {
            return;
        }
        setBusy(true);
        try {
            const res = await apiClient.updateOrgMember(orgId, m.userId, role);
            if (res.success) {
                toast.success(`Updated ${m.email}'s role`);
                await refetch();
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to update role');
        } finally {
            setBusy(false);
        }
    };

    const remove = async () => {
        if (!orgId || !pendingRemove) {
            return;
        }
        const target = pendingRemove;
        setBusy(true);
        try {
            const res = await apiClient.removeOrgMember(orgId, target.userId);
            if (res.success) {
                const isSelf = target.userId === currentUserId;
                toast.success(isSelf ? 'You left the organization' : `Removed ${target.email}`);
                setPendingRemove(null);
                if (isSelf) {
                    await onLeft();
                } else {
                    await refetch();
                }
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to remove member');
        } finally {
            setBusy(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Members</CardTitle>
                <CardDescription>People with access to this organization's apps.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {error && (
                    <Alert variant="destructive" className="m-4">
                        <AlertTitle>Failed to load members</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={4}>
                                        <Skeleton className="h-6 w-full" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : members.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="py-8 text-center text-text-primary/50">
                                    No members
                                </TableCell>
                            </TableRow>
                        ) : (
                            members.map((m) => {
                                const isSelf = m.userId === currentUserId;
                                return (
                                    <TableRow key={m.membershipId}>
                                        <TableCell>
                                            <div className="font-medium">{m.displayName || m.email}</div>
                                            <div className="text-xs text-text-primary/50">{m.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            {canEditRow(m) ? (
                                                <Select
                                                    value={m.role}
                                                    onValueChange={(v) => void changeRole(m, v as OrgRole)}
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {roleOptions.map((r) => (
                                                            <SelectItem key={r} value={r}>
                                                                {formatOrgRole(r)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Badge variant="secondary">{formatOrgRole(m.role)}</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{formatDate(m.joinedAt)}</TableCell>
                                        <TableCell className="text-right">
                                            {isSelf ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setPendingRemove(m)}
                                                >
                                                    Leave
                                                </Button>
                                            ) : (
                                                canEditRow(m) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label={`Remove ${m.email}`}
                                                        onClick={() => setPendingRemove(m)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                )
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            <AlertDialog open={!!pendingRemove} onOpenChange={(o) => !o && setPendingRemove(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {pendingRemove?.userId === currentUserId ? 'Leave organization?' : 'Remove member?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingRemove?.userId === currentUserId
                                ? 'You will lose access to this organization and its apps.'
                                : `${pendingRemove?.email} will lose access to this organization and its apps.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => void remove()} disabled={busy}>
                            {pendingRemove?.userId === currentUserId ? 'Leave' : 'Remove'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

function InvitesCard({ orgId }: { orgId: string | undefined }) {
    const { data, loading, error, refetch } = useOrgInvites(orgId);
    const [inviteOpen, setInviteOpen] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [role, setRole] = React.useState<'admin' | 'member'>('member');
    const [sending, setSending] = React.useState(false);
    const [lastLink, setLastLink] = React.useState<string | null>(null);
    const [busy, setBusy] = React.useState(false);
    const invites = data?.invitations ?? [];

    const sendInvite = async () => {
        if (!orgId || !email.trim() || sending) {
            return;
        }
        setSending(true);
        try {
            const res = await apiClient.createOrgInvite(orgId, email.trim(), role);
            if (res.success && res.data) {
                setLastLink(res.data.acceptUrl);
                setEmail('');
                await refetch();
                toast.success(
                    res.data.email.sent
                        ? `Invitation emailed to ${res.data.invitation.inviteeEmail}`
                        : 'Invitation created — copy the link to share it',
                );
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to create invitation');
        } finally {
            setSending(false);
        }
    };

    const revoke = async (inviteId: string) => {
        if (!orgId || busy) {
            return;
        }
        setBusy(true);
        try {
            const res = await apiClient.revokeOrgInvite(orgId, inviteId);
            if (res.success) {
                toast.success('Invitation revoked');
                await refetch();
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to revoke invitation');
        } finally {
            setBusy(false);
        }
    };

    const copyLink = async (link: string) => {
        try {
            await navigator.clipboard.writeText(link);
            toast.success('Link copied');
        } catch {
            toast.error('Could not copy link');
        }
    };

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle>Pending invitations</CardTitle>
                    <CardDescription>Invite people by email, or share the link directly.</CardDescription>
                </div>
                <Button
                    size="sm"
                    onClick={() => {
                        setLastLink(null);
                        setInviteOpen(true);
                    }}
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                {error && (
                    <Alert variant="destructive" className="m-4">
                        <AlertTitle>Failed to load invitations</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Skeleton className="h-6 w-full" />
                                </TableCell>
                            </TableRow>
                        ) : invites.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="py-8 text-center text-text-primary/50">
                                    No pending invitations
                                </TableCell>
                            </TableRow>
                        ) : (
                            invites.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-medium">{inv.inviteeEmail}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{formatOrgRole(inv.role)}</Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(inv.expiresAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={busy}
                                            onClick={() => void revoke(inv.id)}
                                        >
                                            Revoke
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite a member</DialogTitle>
                        <DialogDescription>
                            They'll receive an email with a link to join. You can also copy the link to share it
                            yourself.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="invite-email">Email</Label>
                            <Input
                                id="invite-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="teammate@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="invite-role">Role</Label>
                            <Select value={role} onValueChange={(v) => setRole(v as 'admin' | 'member')}>
                                <SelectTrigger id="invite-role">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {lastLink && (
                            <Alert>
                                <Mail className="h-4 w-4" />
                                <AlertTitle>Invitation ready</AlertTitle>
                                <AlertDescription className="space-y-2">
                                    <span className="block break-all text-xs text-text-primary/70">{lastLink}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => void copyLink(lastLink)}
                                    >
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy link
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setInviteOpen(false)}>
                            Close
                        </Button>
                        <Button onClick={() => void sendInvite()} disabled={sending || !email.trim()}>
                            {sending ? 'Sending…' : 'Send invitation'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
