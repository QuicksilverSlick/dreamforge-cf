import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router';

/**
 * Initialize Sentry for frontend error tracking and session replay.
 *
 * Both inputs are baked in at BUILD time by Vite, so a deploy that forgets to
 * pass them produces a silently blind frontend. That is not hypothetical: a
 * production build ran without a DSN, and a customer's build sat broken for 18
 * hours because no client error ever reached us. Hence the loud failure below.
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  // Derive from Vite's own PROD flag rather than defaulting to 'development'.
  // A production bundle built without VITE_ENVIRONMENT would otherwise fall
  // through to `enabled: false` below and disable itself while looking fine.
  const environment =
    import.meta.env.VITE_ENVIRONMENT || (import.meta.env.PROD ? 'production' : 'development');
  const release = import.meta.env.VITE_RELEASE || 'unknown';

  if (!dsn) {
    // In a dev build this is expected and unremarkable. In a production build
    // it means we are shipping blind, so make it an error rather than a warning
    // that scrolls past unnoticed.
    if (import.meta.env.PROD) {
      console.error(
        'Sentry DSN missing from a PRODUCTION build — frontend errors are not being reported. ' +
          'Set the VITE_SENTRY_DSN build variable in the deploy pipeline.',
      );
    } else {
      console.warn('Sentry DSN not configured, skipping initialization');
    }
    return;
  }

  Sentry.init({
    dsn,
    environment,
    release,
    
    // Use tunnel to bypass ad blockers
    tunnel: '/api/sentry/tunnel',
    
    // Integrations
    integrations: [
      // React Router integration
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      
      // Session Replay
      Sentry.replayIntegration({
        maskAllText: false,
        maskAllInputs: true,
      }),
    ],
    
    // Performance Monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    
    // Replay sampling rates
    replaysSessionSampleRate: environment === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    
    // Only enable in production/staging
    enabled: environment !== 'development',
  });
}

// Helper to set user context
export function setSentryUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
}

// Helper to clear user context on logout
export function clearSentryUser() {
  Sentry.setUser(null);
}

// Helper to capture custom events
export function captureEvent(message: string, level: Sentry.SeverityLevel = 'info', extra?: Record<string, unknown>) {
  Sentry.captureMessage(message, {
    level,
    extra,
  });
}

// Helper to add breadcrumbs
export function addBreadcrumb(
  message: string,
  category: string,
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

// Helper to start a transaction for performance monitoring
export function startTransaction(name: string, op: string) {
  return Sentry.startSpan({ name, op }, () => {
    // Transaction logic here
  });
}

// Export Sentry instance for advanced usage
export { Sentry };
