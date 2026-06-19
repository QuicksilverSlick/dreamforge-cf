import { Navigate } from 'react-router';
import { useAuth } from '../contexts/auth-context';
import { Skeleton } from '../components/ui/skeleton';
import { isAdminRole } from './admin/admin-utils';

interface AdminRouteProps {
    children: React.ReactNode;
}

/**
 * Role-aware route guard. Like ProtectedRoute, but also requires an operator
 * role. A signed-in non-operator is redirected to home rather than shown a 403
 * page — the console's existence isn't revealed. Authorization is always
 * enforced server-side; this is UX, not the security boundary.
 */
export function AdminRoute({ children }: AdminRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();

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

    if (!isAuthenticated || !isAdminRole(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
