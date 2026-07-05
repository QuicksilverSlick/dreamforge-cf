/**
 * PRODUCE application constants — single source of truth for the tier and
 * pipeline-status enums shared by the D1 schema, the public apply intake,
 * the operator console API, and the admin UI.
 */

export const PRODUCE_APPLICATION_TIERS = [
	'traction_sprint',
	'solo',
	'team_studio',
	'team_pro',
	'enterprise',
	'unsure',
] as const;
export type ProduceApplicationTier = (typeof PRODUCE_APPLICATION_TIERS)[number];

/** Human-readable tier names used in emails and the operator console. */
export const PRODUCE_TIER_LABELS: Record<ProduceApplicationTier, string> = {
	traction_sprint: 'Traction Sprint',
	solo: 'Solo',
	team_studio: 'Team Studio',
	team_pro: 'Team Pro',
	enterprise: 'Enterprise',
	unsure: 'Not sure yet',
};

/** Sales pipeline stages, in funnel order (won/lost are both terminal). */
export const PRODUCE_APPLICATION_STATUSES = ['new', 'contacted', 'scoping', 'won', 'lost'] as const;
export type ProduceApplicationStatus = (typeof PRODUCE_APPLICATION_STATUSES)[number];

export const PRODUCE_STATUS_LABELS: Record<ProduceApplicationStatus, string> = {
	new: 'New',
	contacted: 'Contacted',
	scoping: 'Scoping',
	won: 'Won',
	lost: 'Lost',
};
