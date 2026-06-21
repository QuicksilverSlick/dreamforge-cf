import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Building2, Check, ChevronsUpDown, Plus, Settings } from 'lucide-react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { useMyOrgs } from '@/hooks/use-organizations';
import { formatOrgRole, isOrgAdminRole } from '@/routes/org/org-utils';
import { apiClient } from '@/lib/api-client';

/**
 * Active-org switcher for the global header. Lists the user's orgs, switches the
 * active org (per-session, server-resolved), and creates team orgs. The org
 * context shown here is the SAME per-request context the server enforces — this
 * is convenience, not authorization.
 */
export function OrgSwitcher() {
    const navigate = useNavigate();
    const { activeOrgId, activeOrgRole, switchOrg, refreshUser } = useAuth();
    const { data, refetch } = useMyOrgs();
    const [createOpen, setCreateOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);
    const [switching, setSwitching] = useState(false);

    const orgs = data?.organizations ?? [];
    const active = orgs.find((o) => o.org.id === activeOrgId);
    const activeName = active?.org.name ?? 'Organization';
    const canManage = isOrgAdminRole(activeOrgRole) && active?.org.isPersonal === false;

    const handleSwitch = async (orgId: string) => {
        if (orgId === activeOrgId || switching) {
            return;
        }
        setSwitching(true);
        try {
            await switchOrg(orgId);
            toast.success('Switched organization');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to switch organization');
        } finally {
            setSwitching(false);
        }
    };

    const handleCreate = async () => {
        const name = newName.trim();
        if (!name || creating) {
            return;
        }
        setCreating(true);
        try {
            const res = await apiClient.createTeam(name);
            if (res.success && res.data) {
                // The server auto-switches the session into the new team.
                await refreshUser();
                await refetch();
                setCreateOpen(false);
                setNewName('');
                toast.success(`Created ${res.data.organization.name}`);
                navigate('/organization');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create team');
        } finally {
            setCreating(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="max-w-[200px] gap-2"
                        aria-label="Switch organization"
                    >
                        <Building2 className="h-4 w-4 shrink-0 text-text-primary/60" />
                        <span className="truncate">{activeName}</span>
                        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-text-primary/40" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                    {orgs.map(({ org, role }) => (
                        <DropdownMenuItem
                            key={org.id}
                            onSelect={() => handleSwitch(org.id)}
                            className="flex items-center justify-between gap-2"
                        >
                            <span className="flex min-w-0 items-center gap-2">
                                <span className="truncate">{org.name}</span>
                                {org.isPersonal && (
                                    <span className="text-xs text-text-primary/40">Personal</span>
                                )}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-xs text-text-primary/50">{formatOrgRole(role)}</span>
                                {org.id === activeOrgId && <Check className="h-4 w-4 text-accent" />}
                            </span>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    {canManage && (
                        <DropdownMenuItem onSelect={() => navigate('/organization')}>
                            <Settings className="mr-2 h-4 w-4" />
                            Manage organization
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onSelect={() => setCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create team
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a team</DialogTitle>
                        <DialogDescription>
                            A team lets you invite others and collaborate on apps together.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="team-name">Team name</Label>
                        <Input
                            id="team-name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Acme Inc."
                            maxLength={100}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    void handleCreate();
                                }
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={creating}>
                            Cancel
                        </Button>
                        <Button onClick={() => void handleCreate()} disabled={creating || !newName.trim()}>
                            {creating ? 'Creating…' : 'Create team'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
