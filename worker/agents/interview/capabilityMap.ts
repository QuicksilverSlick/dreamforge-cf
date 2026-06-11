/**
 * Deterministic answer -> capability mapping: EARS acceptance-criteria
 * snippets and credential requirements derived from capability flags.
 * Spec: docs/specs/21-QUESTIONS-INTAKE-INTERVIEW.md §4
 */

import type { AcceptanceCriterion, CapabilityFlags, DerivedState } from './types';

export const ARCHETYPE_LABELS: Record<string, string> = {
    'booking': 'a booking app',
    'store': 'an online store',
    'portal': 'a customer portal',
    'internal-tool': 'an internal tool',
    'community': 'a community app',
    'content': 'a content or blog site',
    'dashboard': 'a dashboard',
    'other': 'an app',
};

/**
 * EARS-style acceptance criteria seeded by each capability flag. The
 * synthesis pass may rephrase stories around them, but these criteria are
 * deterministic so the build agent always receives requirements, not vibes.
 */
const EARS_SNIPPETS: Partial<Record<keyof CapabilityFlags & string, string[]>> = {
    'auth.full': [
        'WHEN a visitor signs up, THE SYSTEM SHALL create an account and start a signed-in session.',
        'WHEN a signed-out visitor opens a page that belongs to an account, THE SYSTEM SHALL redirect them to sign in.',
    ],
    'auth.invite-only': [
        'WHEN a visitor without an invitation attempts to sign up, THE SYSTEM SHALL refuse account creation and explain that access is invite-only.',
    ],
    'payments.checkout': [
        'WHEN a customer completes checkout, THE SYSTEM SHALL record the payment and show a confirmation page.',
        'IF a payment fails, THEN THE SYSTEM SHALL show a clear retry message without losing the customer\'s selection.',
    ],
    'payments.subscriptions': [
        'WHEN a customer subscribes, THE SYSTEM SHALL grant access for the paid period and record the subscription status.',
        'WHEN a subscription payment fails, THE SYSTEM SHALL notify the owner and mark the account past-due.',
    ],
    'payments.invoicing': [
        'WHEN the owner sends an invoice, THE SYSTEM SHALL record it and track whether it has been paid.',
    ],
    'scheduling.calendar': [
        'WHEN a visitor books an open time, THE SYSTEM SHALL reserve that slot and prevent double-booking.',
        'WHEN a booking is created, THE SYSTEM SHALL show it to the owner immediately.',
    ],
    'scheduling.reminders': [
        'WHEN an appointment is approaching, THE SYSTEM SHALL send a reminder before it starts.',
    ],
    'catalog': [
        'WHEN the owner adds or edits a product, THE SYSTEM SHALL show the change to visitors immediately.',
    ],
    'cart': [
        'WHEN a customer adds an item to their cart, THE SYSTEM SHALL keep the cart through page reloads until checkout.',
    ],
    'uploads': [
        'WHEN a user uploads a file or photo, THE SYSTEM SHALL store it and show it where it belongs.',
        'IF an upload is too large or an unsupported type, THEN THE SYSTEM SHALL explain the limit clearly.',
    ],
    'notifications.email': [
        'WHEN something the owner cares about happens (new signup, order, or booking), THE SYSTEM SHALL email the owner about it.',
    ],
    'admin.dashboard': [
        'WHEN the owner signs in, THE SYSTEM SHALL provide a private area showing recent activity, the list of people, and the business records.',
        'WHEN someone who is not the owner opens the private area, THE SYSTEM SHALL deny access.',
    ],
    'roles.multi': [
        'WHEN a user opens the app, THE SYSTEM SHALL only show the screens and actions their role allows.',
    ],
};

const CREDENTIAL_REQUIREMENTS: Partial<Record<keyof CapabilityFlags & string, string>> = {
    'payments.checkout': 'Stripe API keys',
    'payments.subscriptions': 'Stripe API keys',
    'payments.invoicing': 'Stripe API keys',
    'notifications.email': 'Email provider API key (e.g. Resend)',
    'scheduling.reminders': 'Email provider API key (e.g. Resend)',
};

export function expandAcceptanceCriteria(flags: CapabilityFlags): AcceptanceCriterion[] {
    const criteria: AcceptanceCriterion[] = [];
    for (const [flag, snippets] of Object.entries(EARS_SNIPPETS)) {
        if (!flags[flag as keyof CapabilityFlags] || !snippets) continue;
        for (const criterion of snippets) {
            criteria.push({ id: `AC-${criteria.length + 1}`, criterion });
        }
    }
    return criteria;
}

export function deriveCredentialsNeeded(flags: CapabilityFlags): string[] {
    const needed = new Set<string>();
    for (const [flag, credential] of Object.entries(CREDENTIAL_REQUIREMENTS)) {
        if (flags[flag as keyof CapabilityFlags] && credential) {
            needed.add(credential);
        }
    }
    return [...needed];
}

/**
 * Admin "back room" decision (spec §3 Q8 / §4.1): when the app clearly has
 * outside users AND takes orders/bookings/payments/signups, include the admin
 * baseline without asking. Single-user apps never get it. Everything else
 * gets the question. Pure — the engine applies the flag and assumption.
 */
export function adminBackroomDecision(state: Pick<DerivedState, 'fields' | 'capabilityChips' | 'flags'>): 'auto-include' | 'excluded' | 'ask' {
    const { fields, capabilityChips } = state;
    if (fields.audience === 'just-me') {
        return 'excluded';
    }
    const hasCommerceSignals =
        capabilityChips.includes('payments') ||
        capabilityChips.includes('booking') ||
        capabilityChips.includes('selling') ||
        capabilityChips.includes('accounts');
    const hasOutsideUsers = fields.audience === 'customers' || fields.audience === 'anyone';
    if (hasOutsideUsers && hasCommerceSignals) {
        return 'auto-include';
    }
    return 'ask';
}

export const ADMIN_AUTO_INCLUDE_ASSUMPTION =
    'We added a private back room where you can see orders, bookings, and the people using your app — remove it if you don\'t want it.';
