import { Badge } from '@/components/ui/badge';
import type { AdminUserSummary, UserRole } from '@/api-types';

const ROLE_VARIANT: Record<UserRole, 'default' | 'secondary' | 'outline'> = {
    superadmin: 'default',
    admin: 'secondary',
    support: 'secondary',
    ai_support: 'secondary',
    ai_admin: 'secondary',
    user: 'outline',
};

export function RoleBadge({ role }: { role: UserRole }) {
    return <Badge variant={ROLE_VARIANT[role] ?? 'outline'}>{role}</Badge>;
}

/** Status derived from the same fields auth enforcement uses. */
export function StatusBadge({ user }: { user: Pick<AdminUserSummary, 'isSuspended' | 'isActive'> }) {
    if (user.isSuspended) {
        return <Badge variant="destructive">Suspended</Badge>;
    }
    if (user.isActive === false) {
        return <Badge variant="secondary">Inactive</Badge>;
    }
    return <Badge variant="outline">Active</Badge>;
}
