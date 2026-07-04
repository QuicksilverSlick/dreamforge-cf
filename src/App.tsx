import { Outlet } from 'react-router';
import { AuthProvider } from './contexts/auth-context';
import { AuthModalProvider } from './components/auth/AuthModalProvider';
import { ThemeProvider } from './contexts/theme-context';
import { LimitsProvider } from './contexts/limits-context';
import { BillingProvider } from './contexts/billing-context';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FeatureProvider } from './features';

// Note: upstream additionally wraps the tree in a VaultProvider between
// AuthProvider and LimitsProvider. We deliberately omit that here — the
// zero-knowledge vault (with WebAuthn-PRF) is deferred (Q1) while we keep
// the existing D1-backed SecretsService for BYOK. When vault lands, add
// `<VaultProvider>` between AuthProvider and LimitsProvider to match
// upstream's nesting order.
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FeatureProvider>
          <AuthProvider>
            <LimitsProvider>
              <BillingProvider>
              <AuthModalProvider>
                {/* Providers wrap the Outlet directly; the AppLayout chrome is a
                    nested layout route (AppShell), so chrome-less routes like
                    /invite/:token can render inside auth context but without the
                    sidebar/header. */}
                <Outlet />
                <Toaster richColors position="top-right" />
              </AuthModalProvider>
              </BillingProvider>
            </LimitsProvider>
          </AuthProvider>
        </FeatureProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}