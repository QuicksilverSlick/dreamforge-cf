/**
 * Request validation for the public PRODUCE application intake.
 *
 * The `website` field is a honeypot: it is visually hidden on the form, so a
 * non-empty value marks the submission as bot traffic (silently dropped by
 * the controller with a fake success response).
 */

import { z } from 'zod';
import { PRODUCE_TIERS, type ProduceTier } from '../../../database/schema';

export const applyBodySchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer'),
    email: z.string().trim().email('A valid email address is required').max(255),
    company: z.string().trim().max(120, 'Company must be 120 characters or fewer').optional(),
    tier: z.enum(PRODUCE_TIERS),
    projectDescription: z
        .string()
        .trim()
        .min(10, 'Tell us a little about the project (at least 10 characters)')
        .max(4000, 'Project description must be 4000 characters or fewer'),
    source: z.string().trim().max(200).optional(),
    website: z.string().max(500).optional(),
});
export type ApplyBody = z.infer<typeof applyBodySchema>;

/** Human-readable tier names used in emails and the admin view. */
export const PRODUCE_TIER_LABELS: Record<ProduceTier, string> = {
    traction_sprint: 'Traction Sprint',
    solo: 'Solo',
    team_studio: 'Team Studio',
    team_pro: 'Team Pro',
    enterprise: 'Enterprise',
    unsure: 'Not sure yet',
};
