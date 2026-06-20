import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout/app-layout';

/**
 * Layout route that applies the main app chrome (sidebar + header) around its
 * children. Sibling routes of this layout (e.g. /invite/:token) render inside
 * the providers but without the chrome.
 */
export function AppShell() {
    return (
        <AppLayout>
            <Outlet />
        </AppLayout>
    );
}
