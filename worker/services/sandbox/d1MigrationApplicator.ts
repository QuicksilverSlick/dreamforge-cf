/**
 * Applies a template's SQL migrations to a per-app REMOTE D1 database from the
 * platform worker — the only party holding a real Cloudflare API token (the
 * sandbox container's API traffic is routed through the authorizing proxy,
 * which deny-by-default 403s every D1 REST endpoint, so an in-container
 * `wrangler d1 migrations apply --remote` can never succeed).
 *
 * Mechanism is deliberately what `wrangler d1 migrations apply --remote` does
 * internally (wrangler `d1/migrations/apply.ts`):
 *   1. prime the bookkeeping table (same DDL wrangler uses),
 *   2. `SELECT name FROM d1_migrations` to find applied migrations,
 *   3. per unapplied file, ONE multi-statement POST
 *      `/d1/database/{uuid}/query` whose sql = the file's full text + an
 *      appended bookkeeping INSERT.
 * The bookkeeping name is the exact bare filename (`0001_init.sql`) —
 * wrangler's unapplied-check is a pure name-string comparison, so a matching
 * seed makes a later token-holding `wrangler d1 migrations apply --remote`
 * (e.g. on a user's own machine) report "no migrations to apply".
 *
 * Divergences from wrangler, all deliberate:
 *   - `INSERT OR IGNORE` for the bookkeeping row (wrangler uses plain INSERT):
 *     with `name TEXT UNIQUE` this makes retries of a partially-applied
 *     migration safe.
 *   - Multi-statement `/query` has NO atomicity guarantee (D1 is auto-commit;
 *     partial application is real — workers-sdk#6348), so after applying we
 *     VERIFY the created tables exist in sqlite_master before reporting ok.
 *     Template DDL is therefore idempotent (`CREATE TABLE IF NOT EXISTS`) so a
 *     retry after partial application converges; for non-idempotent
 *     AI-generated files a narrowly-gated recovery path (see
 *     {@link D1MigrationApplicator.recoverIfAlreadyApplied}) prevents a
 *     permanent wedge without ever silently skipping unexecuted statements.
 *
 * Concurrency note: two overlapping deploys of the same app could race this
 * applier. The bookkeeping INSERT is OR IGNORE and the DDL is idempotent, so
 * double-application of CREATEs is harmless; a data-carrying (INSERT) AI
 * migration could double-run its DML in that window — accepted, since deploys
 * for one app funnel through its single Durable Object.
 */

import { env } from 'cloudflare:workers';
import { StructuredLogger } from '../../logger';

export interface MigrationFile {
	/** Bare filename relative to the template's migrations dir, e.g. `0001_init.sql`. */
	name: string;
	/** Full SQL text of the migration file. */
	sql: string;
}

export interface MigrationApplyResult {
	ok: boolean;
	/** Names of migrations applied in THIS call (empty when everything was already applied). */
	applied: string[];
	error?: string;
}

/** wrangler's default bookkeeping table name (`DEFAULT_MIGRATION_TABLE`). */
export const D1_MIGRATIONS_TABLE = 'd1_migrations';

/** wrangler's bookkeeping DDL (`getCreateMigrationsTableQuery`). */
export const D1_MIGRATIONS_TABLE_DDL = `CREATE TABLE IF NOT EXISTS "${D1_MIGRATIONS_TABLE}"(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);`;

/**
 * Migration filenames come from the container's filesystem, which the AI can
 * write to — validate strictly so a hostile name can neither inject SQL into
 * the bookkeeping INSERT nor traverse paths. Rejects quotes, slashes, spaces
 * and leading dots by construction.
 */
const MIGRATION_NAME_RE = /^[0-9A-Za-z_][0-9A-Za-z._-]*\.sql$/;

/**
 * Sanity cap per migration FILE (in UTF-16 code units — close enough for a
 * bound). D1's hard limit is 100 KB per individual STATEMENT; a schema
 * migration anywhere near this file size is malformed.
 */
const MAX_MIGRATION_CHARS = 256 * 1024;

const MAX_ATTEMPTS = 3;

export function isValidMigrationName(name: string): boolean {
	return MIGRATION_NAME_RE.test(name);
}

/**
 * Order like wrangler: numeric prefix first (drizzle zero-pads, so this
 * matches lexicographic for well-formed sets, but survives an unpadded
 * `10_x.sql` vs `9_y.sql`), stable byte order otherwise.
 */
export function compareMigrationNames(a: string, b: string): number {
	const numA = parseInt(a, 10);
	const numB = parseInt(b, 10);
	if (!Number.isNaN(numA) && !Number.isNaN(numB) && numA !== numB) {
		return numA - numB;
	}
	return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Remove SQL comments for PARSING purposes only (never for execution): `--`
 * line comments (including drizzle's `--> statement-breakpoint`) and block
 * comments would otherwise produce phantom CREATE matches.
 */
export function stripSqlComments(sql: string): string {
	return sql.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/--.*$/gm, '');
}

/**
 * D1 rejects explicit transaction control ("cannot start a transaction within
 * a transaction") — strip whole lines of it. ONLY the unambiguous forms:
 * tool-emitted transactional statements are `BEGIN;` / `BEGIN TRANSACTION;` /
 * `COMMIT;` / `END TRANSACTION;`. A bare `BEGIN` (no semicolon) opens a
 * CREATE TRIGGER body and a bare `END;` closes it — stripping those corrupts
 * trigger DDL into a syntax error, so they are deliberately NOT matched.
 */
export function stripTransactionStatements(sql: string): string {
	const re = /^\s*(BEGIN\s*;|BEGIN\s+(TRANSACTION|DEFERRED|IMMEDIATE|EXCLUSIVE)\b[^;]*;?|COMMIT(\s+TRANSACTION)?\s*;?|END\s+TRANSACTION\s*;?|ROLLBACK\b[^;]*;?|SAVEPOINT\b[^;]*;?|RELEASE\b[^;]*;?)\s*$/i;
	return sql
		.split('\n')
		.filter((line) => !re.test(line))
		.join('\n');
}

/**
 * One migration = one multi-statement /query payload, wrangler's exact shape:
 * the (transaction-stripped) file text plus the bookkeeping INSERT. The name
 * is interpolated directly — safe because callers only pass names that
 * satisfy {@link isValidMigrationName} (no quotes possible).
 */
export function buildMigrationApplySql(migration: MigrationFile): string {
	return `${stripTransactionStatements(migration.sql)}\nINSERT OR IGNORE INTO ${D1_MIGRATIONS_TABLE} (name) values ('${migration.name}');`;
}

/**
 * Table names a migration creates — the post-apply verification set. Parses
 * comment-stripped SQL and excludes drizzle's transient `__new_<table>`
 * rebuild tables (created and renamed away within the same migration, so
 * they must NOT be expected to exist afterwards).
 */
export function parseCreatedTableNames(sql: string): string[] {
	const clean = stripSqlComments(sql);
	const names: string[] = [];
	const re = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"[]?([A-Za-z0-9_]+)[`"\]]?/gi;
	let match: RegExpExecArray | null;
	while ((match = re.exec(clean)) !== null) {
		if (!match[1].startsWith('__')) {
			names.push(match[1]);
		}
	}
	return [...new Set(names)];
}

/**
 * Statement-level classification used to gate the recovery path. A migration
 * is only "recoverable by inspection" when EVERY statement is a CREATE
 * TABLE / CREATE [UNIQUE] INDEX whose existence sqlite_master can prove.
 * Anything else (ALTER, INSERT, UPDATE, DROP, triggers — whose bodies defeat
 * naive `;` splitting) makes the migration non-recoverable: we cannot prove
 * those statements ran, so a failed apply must stay failed and loud rather
 * than be silently marked applied.
 */
export function parseVerifiableCreates(sql: string): { recoverable: boolean; tables: string[]; indexes: string[] } {
	const clean = stripSqlComments(stripTransactionStatements(sql));
	const statements = clean
		.split(';')
		.map((s) => s.trim())
		.filter((s) => s.length > 0);
	const tables: string[] = [];
	const indexes: string[] = [];
	for (const statement of statements) {
		const tableMatch = /^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"[]?([A-Za-z0-9_]+)[`"\]]?/i.exec(statement);
		if (tableMatch) {
			if (!tableMatch[1].startsWith('__')) tables.push(tableMatch[1]);
			continue;
		}
		const indexMatch = /^CREATE\s+(?:UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"[]?([A-Za-z0-9_]+)[`"\]]?/i.exec(statement);
		if (indexMatch) {
			indexes.push(indexMatch[1]);
			continue;
		}
		return { recoverable: false, tables: [], indexes: [] };
	}
	if (tables.length === 0 && indexes.length === 0) {
		return { recoverable: false, tables: [], indexes: [] };
	}
	return { recoverable: true, tables: [...new Set(tables)], indexes: [...new Set(indexes)] };
}

interface D1QueryStatementResult {
	success: boolean;
	results?: Array<Record<string, unknown>>;
}

interface D1QueryResponse {
	success: boolean;
	errors: Array<{ code?: number; message?: string }>;
	result?: D1QueryStatementResult[];
}

interface QueryOutcome {
	ok: boolean;
	/** Per-statement result sets (present when ok). */
	result?: D1QueryStatementResult[];
	error?: string;
	/** True when the failure was an HTTP 429 — caller backs off longer. */
	rateLimited?: boolean;
}

export class D1MigrationApplicator {
	private readonly logger: Pick<StructuredLogger, 'info' | 'warn' | 'error'>;
	private readonly accountId: string;
	private readonly apiToken: string;

	constructor(logger: Pick<StructuredLogger, 'info' | 'warn' | 'error'>) {
		this.logger = logger;
		this.accountId = env.CLOUDFLARE_ACCOUNT_ID;
		this.apiToken = env.CLOUDFLARE_API_TOKEN;
		if (!this.accountId || !this.apiToken) {
			throw new Error('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set to apply D1 migrations');
		}
	}

	/**
	 * Apply any unapplied migrations to the given database. Idempotent: applied
	 * names are read from the bookkeeping table first, and re-running after a
	 * partial application converges as long as the DDL is IF NOT EXISTS.
	 * Never throws — callers run this best-effort on the deploy path.
	 */
	async apply(databaseId: string, migrations: MigrationFile[]): Promise<MigrationApplyResult> {
		const candidates = migrations
			.filter((m) => {
				if (!isValidMigrationName(m.name)) {
					this.logger.warn(`Skipping migration with unsafe name: ${JSON.stringify(m.name)}`);
					return false;
				}
				if (m.sql.length > MAX_MIGRATION_CHARS) {
					this.logger.warn(`Skipping oversized migration ${m.name} (${m.sql.length} chars)`);
					return false;
				}
				return true;
			})
			.sort((a, b) => compareMigrationNames(a.name, b.name));

		if (candidates.length === 0) {
			return { ok: true, applied: [] };
		}

		let lastError = 'unknown error';
		for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
			const outcome = await this.applyOnce(databaseId, candidates);
			if (outcome.ok) return outcome.result;
			lastError = outcome.error;
			if (attempt < MAX_ATTEMPTS) {
				// The global API rate limit (1,200 req / 5 min) is shared by every
				// platform token use — back off firmly on 429 and never retry
				// unbounded, or a migration storm can starve D1 creates + deploys.
				const delayMs = outcome.rateLimited ? 5000 * attempt : 1000 * 2 ** (attempt - 1);
				this.logger.warn(
					`D1 migration apply attempt ${attempt}/${MAX_ATTEMPTS} failed for ${databaseId}: ${lastError}; retrying in ${delayMs}ms`,
				);
				await new Promise((resolve) => setTimeout(resolve, delayMs));
			}
		}
		return { ok: false, applied: [], error: lastError };
	}

	private async applyOnce(
		databaseId: string,
		candidates: MigrationFile[],
	): Promise<{ ok: true; result: MigrationApplyResult } | { ok: false; error: string; rateLimited?: boolean }> {
		// 1) Prime the bookkeeping table (wrangler's exact DDL — IF NOT EXISTS).
		const prime = await this.query(databaseId, D1_MIGRATIONS_TABLE_DDL);
		if (!prime.ok) return { ok: false, error: `priming ${D1_MIGRATIONS_TABLE}: ${prime.error}`, rateLimited: prime.rateLimited };

		// 2) Which migrations are already recorded?
		const appliedQuery = await this.query(databaseId, `SELECT name FROM ${D1_MIGRATIONS_TABLE};`);
		if (!appliedQuery.ok) return { ok: false, error: `reading ${D1_MIGRATIONS_TABLE}: ${appliedQuery.error}`, rateLimited: appliedQuery.rateLimited };
		const appliedNames = new Set(
			(appliedQuery.result ?? []).flatMap((statement) =>
				(statement.results ?? []).map((row) => String(row.name)),
			),
		);

		const unapplied = candidates.filter((m) => !appliedNames.has(m.name));
		if (unapplied.length === 0) {
			return { ok: true, result: { ok: true, applied: [] } };
		}

		// 3) Apply each unapplied migration — one multi-statement /query per
		// file, exactly wrangler's remote-apply shape.
		const applied: string[] = [];
		for (const migration of unapplied) {
			const apply = await this.query(databaseId, buildMigrationApplySql(migration));
			if (!apply.ok) {
				// Recovery for a PRIOR partial application of non-idempotent DDL
				// (AI-generated migrations lack IF NOT EXISTS). Deliberately
				// narrow — see recoverIfAlreadyApplied — so a migration whose
				// statements did NOT all run can never be silently marked
				// applied.
				const recovered = await this.recoverIfAlreadyApplied(databaseId, migration, apply.error ?? '');
				if (recovered) {
					this.logger.warn(
						`Migration ${migration.name} was already applied (partial earlier run); seeded bookkeeping only`,
					);
					applied.push(migration.name);
					continue;
				}
				return { ok: false, error: `applying ${migration.name}: ${apply.error}`, rateLimited: apply.rateLimited };
			}
			applied.push(migration.name);
		}

		// 4) Verify the DDL actually stuck (multi-statement /query is not
		// atomic — partial application is real). Missing tables fail the run so
		// the bounded retry re-applies the idempotent DDL.
		const expectedTables = unapplied.flatMap((m) => parseCreatedTableNames(m.sql));
		if (expectedTables.length > 0) {
			const existing = await this.listSqliteMaster(databaseId, 'table');
			if (!existing.ok) return { ok: false, error: `verifying tables: ${existing.error}`, rateLimited: existing.rateLimited };
			const missing = expectedTables.filter((t) => !existing.names.has(t));
			if (missing.length > 0) {
				return { ok: false, error: `verification failed — tables missing after apply: ${missing.join(', ')}` };
			}
		}

		return { ok: true, result: { ok: true, applied } };
	}

	/**
	 * True (after seeding the bookkeeping row) ONLY when we can PROVE the
	 * migration's every statement already ran. Three gates, all required:
	 *   1. the apply failure says "already exists" (any other failure is not a
	 *      re-application symptom);
	 *   2. every statement is a CREATE TABLE / CREATE INDEX whose existence
	 *      sqlite_master can attest (a migration containing ALTER / INSERT /
	 *      trigger / anything else is never recovered — those statements may
	 *      not have run, and marking the file applied would silently drop
	 *      them);
	 *   3. every parsed table AND index actually exists.
	 */
	private async recoverIfAlreadyApplied(databaseId: string, migration: MigrationFile, applyError: string): Promise<boolean> {
		if (!/already exists/i.test(applyError)) return false;
		const parsed = parseVerifiableCreates(migration.sql);
		if (!parsed.recoverable) return false;
		if (parsed.tables.length > 0) {
			const tables = await this.listSqliteMaster(databaseId, 'table');
			if (!tables.ok || !parsed.tables.every((t) => tables.names.has(t))) return false;
		}
		if (parsed.indexes.length > 0) {
			const indexes = await this.listSqliteMaster(databaseId, 'index');
			if (!indexes.ok || !parsed.indexes.every((i) => indexes.names.has(i))) return false;
		}
		const seed = await this.query(
			databaseId,
			`INSERT OR IGNORE INTO ${D1_MIGRATIONS_TABLE} (name) values ('${migration.name}');`,
		);
		return seed.ok;
	}

	private async listSqliteMaster(
		databaseId: string,
		type: 'table' | 'index',
	): Promise<{ ok: true; names: Set<string> } | { ok: false; error?: string; rateLimited?: boolean }> {
		const outcome = await this.query(databaseId, `SELECT name FROM sqlite_master WHERE type='${type}';`);
		if (!outcome.ok) return { ok: false, error: outcome.error, rateLimited: outcome.rateLimited };
		return {
			ok: true,
			names: new Set(
				(outcome.result ?? []).flatMap((statement) =>
					(statement.results ?? []).map((row) => String(row.name)),
				),
			),
		};
	}

	private async query(databaseId: string, sql: string): Promise<QueryOutcome> {
		try {
			const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${databaseId}/query`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${this.apiToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ sql }),
			});
			if (!response.ok) {
				const body = await response.text();
				return {
					ok: false,
					error: `HTTP ${response.status}: ${body.slice(0, 500)}`,
					rateLimited: response.status === 429,
				};
			}
			const payload: D1QueryResponse = await response.json();
			if (!payload.success) {
				return { ok: false, error: `API error: ${JSON.stringify(payload.errors).slice(0, 500)}` };
			}
			// Every statement in the batch must report success — a partially
			// failed batch is a failure (the retry re-runs idempotent DDL).
			const failedIndex = (payload.result ?? []).findIndex((statement) => !statement.success);
			if (failedIndex !== -1) {
				return { ok: false, error: `statement ${failedIndex + 1} in the batch reported failure` };
			}
			return { ok: true, result: payload.result ?? [] };
		} catch (error) {
			return { ok: false, error: error instanceof Error ? error.message : String(error) };
		}
	}
}
