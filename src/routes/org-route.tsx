import { Navigate } from 'react-router';
import { useAuth } from '../contexts/auth-context';
import { Skeleton } from '../components/ui/skeleton';
import { isOrgAdminRole } from './org/org-utils';

interface OrgRouteProps {
    children: React.ReactNode;
}

/**
 * Org-admin route guard. Gates on the user's role in their ACTIVE org
 * (owner/admin). A signed-in member is redirected home rather than shown a 403.
 * UX only — the server (AuthConfig.orgAdminOnly) is the real boundary.
 */
export function OrgRoute({ children }: OrgRouteProps) {
    const { isAuthenticated, isLoading, activeOrgRole } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-48" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !isOrgAdminRole(activeOrgRole)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
