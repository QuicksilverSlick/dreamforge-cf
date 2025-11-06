/**
 * Wrapper for Individuals Landing Page
 * Provides necessary context providers without app chrome (sidebar, header)
 */

import { ThemeProvider } from '@/contexts/theme-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import IndividualsLandingPage from './IndividualsLandingPage';

export default function IndividualsLandingWrapper() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <IndividualsLandingPage />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
