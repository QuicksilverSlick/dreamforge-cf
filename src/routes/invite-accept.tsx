import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DreamforgeIcon } from '@/components/icons/logos';
import { useAuth } from '@/contexts/auth-context';
import { useAuthModal } from '@/components/auth/AuthModalProvider';
import { apiClient } from '@/lib/api-client';

type AcceptState =
    | { kind: 'idle' }
    | { kind: 'accepting' }
    | { kind: 'done'; orgName: string }
    | { kind: 'error'; message: string };

/**
 * Chrome-less invitation accept landing (/invite/:token). Rendered outside the
 * AppLayout but inside auth context + the sign-in modal. An unauthenticated
 * visitor signs in/up here (the token is preserved), then the invite is accepted
 * and the session auto-switches into the joined org.
 */
export default function InviteAccept() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, refreshUser } = useAuth();
    const { showAuthModal } = useAuthModal();
    const [state, setState] = React.useState<AcceptState>({ kind: 'idle' });
    const attemptedRef = React.useRef(false);

    const intendedUrl = token ? `/invite/${token}` : '/';

    const accept = React.useCallback(async () => {
        if (!token || attemptedRef.current) {
            return;
        }
        attemptedRef.current = true;
        setState({ kind: 'accepting' });
        try {
            const res = await apiClient.acceptInvite(token);
            if (res.success && res.data) {
                await refreshUser(); // server already switched the active org
                setState({ kind: 'done', orgName: res.data.organization.name });
            } else {
                setState({ kind: 'error', message: 'This invitation could not be accepted.' });
            }
        } catch (error) {
            setState({ kind: 'error', message: error instanceof Error ? error.message : 'Failed to accept invitation' });
        }
    }, [token, refreshUser]);

    // Once authenticated, accept automatically (also fires right after sign-in).
    React.useEffect(() => {
        if (!isLoading && isAuthenticated && state.kind === 'idle') {
            void accept();
        }
    }, [isLoading, isAuthenticated, state.kind, accept]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-bg-2 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="items-center text-center">
                    <DreamforgeIcon style={{ width: 48, height: 48 }} />
                    <CardTitle className="mt-2">Team invitation</CardTitle>
                    <CardDescription>{renderSubtitle(state, isLoading, isAuthenticated)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!token && <p className="text-center text-sm text-destructive">Missing invitation token.</p>}

                    {token && isLoading && <Skeleton className="h-10 w-full" />}

                    {token && !isLoading && !isAuthenticated && (
                        <Button
                            className="w-full"
                            onClick={() => showAuthModal('accept your team invitation', () => void accept(), intendedUrl)}
                        >
                            Sign in to accept
                        </Button>
                    )}

                    {token && state.kind === 'accepting' && <Skeleton className="h-10 w-full" />}

                    {state.kind === 'done' && (
                        <div className="space-y-3">
                            <p className="text-center text-sm text-text-primary/70">
                                You've joined <strong>{state.orgName}</strong>.
                            </p>
                            <Button className="w-full" onClick={() => navigate('/organization')}>
                                Go to organization
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                                Go to dashboard
                            </Button>
                        </div>
                    )}

                    {state.kind === 'error' && (
                        <div className="space-y-3">
                            <p className="text-center text-sm text-destructive">{state.message}</p>
                            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                                Go to dashboard
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function renderSubtitle(state: AcceptState, isLoading: boolean, isAuthenticated: boolean): string {
    if (state.kind === 'done') {
        return 'Invitation accepted';
    }
    if (state.kind === 'error') {
        return 'Something went wrong';
    }
    if (isLoading) {
        return 'Checking your session…';
    }
    if (!isAuthenticated) {
        return 'Sign in or create an account to join the team.';
    }
    return 'Joining the team…';
}
