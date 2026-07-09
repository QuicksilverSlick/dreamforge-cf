/**
 * Pure-helper tests for the platform-side D1 migration applicator. These lock
 * the wrangler-parity invariants that keep the bookkeeping seed compatible
 * with `wrangler d1 migrations apply`:
 *  - the apply payload is ONE multi-statement string = file text + a
 *    bookkeeping INSERT carrying the EXACT bare filename (name-only dedup);
 *  - ONLY unambiguous transaction control is stripped — trigger bodies
 *    (bare `BEGIN` / `END;` lines) must pass through byte-identical, since
 *    stripping them corrupts the DDL into a permanent-wedge syntax error;
 *  - migration names are validated hard enough that a container-controlled
 *    filename can neither inject SQL nor traverse paths;
 *  - created-object parsing (verification + the narrowly-gated recovery
 *    path) understands drizzle's quoting, ignores comments, excludes the
 *    transient `__new_<table>` rebuild tables, and refuses to classify
 *    anything but pure CREATE TABLE/INDEX files as recoverable.
 */
import { describe, it, expect } from 'vitest';
import {
	D1_MIGRATIONS_TABLE_DDL,
	buildMigrationApplySql,
	compareMigrationNames,
	isValidMigrationName,
	parseCreatedTableNames,
	parseVerifiableCreates,
	stripSqlComments,
	stripTransactionStatements,
} from './d1MigrationApplicator';

const TRIGGER_SQL = [
	'CREATE TRIGGER touch_updated AFTER UPDATE ON tasks',
	'FOR EACH ROW',
	'BEGIN',
	"  UPDATE tasks SET updated_at = unixepoch() WHERE id = NEW.id;",
	'END;',
].join('\n');

describe('isValidMigrationName', () => {
	it('accepts drizzle-style migration filenames', () => {
		expect(isValidMigrationName('0001_init.sql')).toBe(true);
		expect(isValidMigrationName('0002_add-games_table.sql')).toBe(true);
		expect(isValidMigrationName('20260709_users.v2.sql')).toBe(true);
	});

	it('rejects names that could inject SQL or traverse paths', () => {
		expect(isValidMigrationName("0001'); DROP TABLE user;--.sql")).toBe(false);
		expect(isValidMigrationName('../../../etc/passwd.sql')).toBe(false);
		expect(isValidMigrationName('migrations/0001_init.sql')).toBe(false);
		expect(isValidMigrationName('0001 init.sql')).toBe(false);
		expect(isValidMigrationName('.hidden.sql')).toBe(false);
		expect(isValidMigrationName('0001_init.sql.txt')).toBe(false);
		expect(isValidMigrationName('0001_init')).toBe(false);
	});
});

describe('compareMigrationNames', () => {
	it('orders by numeric prefix, surviving unpadded numbers', () => {
		const names = ['10_z.sql', '0002_b.sql', '9_y.sql', '0001_a.sql'];
		expect([...names].sort(compareMigrationNames)).toEqual(['0001_a.sql', '0002_b.sql', '9_y.sql', '10_z.sql']);
	});

	it('falls back to stable byte order without numeric prefixes', () => {
		expect(compareMigrationNames('a.sql', 'b.sql')).toBeLessThan(0);
	});
});

describe('stripTransactionStatements', () => {
	it('removes unambiguous transaction control lines D1 rejects', () => {
		const sql = [
			'BEGIN TRANSACTION;',
			'BEGIN;',
			'CREATE TABLE `user` (`id` text PRIMARY KEY NOT NULL);',
			'SAVEPOINT sp1;',
			'CREATE INDEX `idx` ON `user` (`id`);',
			'RELEASE sp1;',
			'END TRANSACTION;',
			'COMMIT;',
		].join('\n');
		const stripped = stripTransactionStatements(sql);
		expect(stripped).not.toMatch(/TRANSACTION|SAVEPOINT|RELEASE|COMMIT|BEGIN;/i);
		expect(stripped).toContain('CREATE TABLE `user`');
		expect(stripped).toContain('CREATE INDEX `idx`');
	});

	it('passes CREATE TRIGGER bodies through byte-identical (bare BEGIN / END; are trigger syntax)', () => {
		expect(stripTransactionStatements(TRIGGER_SQL)).toBe(TRIGGER_SQL);
	});

	it('strips a transaction wrapper AROUND a trigger without touching the trigger body', () => {
		const wrapped = `BEGIN TRANSACTION;\n${TRIGGER_SQL}\nCOMMIT;`;
		expect(stripTransactionStatements(wrapped)).toBe(TRIGGER_SQL);
	});

	it('preserves drizzle statement-breakpoint comments and ordinary SQL', () => {
		const sql = 'CREATE TABLE `a` (`id` text);\n--> statement-breakpoint\nCREATE TABLE `b` (`id` text);';
		expect(stripTransactionStatements(sql)).toBe(sql);
	});

	it('does not strip column lines merely containing keyword-like words', () => {
		const sql = 'CREATE TABLE `t` (\n\t`committed` integer DEFAULT false NOT NULL\n);';
		expect(stripTransactionStatements(sql)).toBe(sql);
	});
});

describe('buildMigrationApplySql', () => {
	it('appends the bookkeeping INSERT with the exact bare filename', () => {
		const payload = buildMigrationApplySql({ name: '0001_init.sql', sql: 'CREATE TABLE `user` (`id` text);' });
		expect(payload).toBe(
			"CREATE TABLE `user` (`id` text);\nINSERT OR IGNORE INTO d1_migrations (name) values ('0001_init.sql');",
		);
	});

	it('strips transaction wrappers from the file text before appending', () => {
		const payload = buildMigrationApplySql({
			name: '0002_more.sql',
			sql: 'BEGIN;\nCREATE TABLE `games` (`id` text);\nCOMMIT;',
		});
		expect(payload).not.toMatch(/BEGIN|COMMIT/);
		expect(payload).toContain("values ('0002_more.sql');");
	});
});

describe('stripSqlComments', () => {
	it('removes line and block comments', () => {
		const sql = '-- CREATE TABLE phantom (id text);\nCREATE TABLE real (id text); /* CREATE TABLE ghost (x) */';
		const clean = stripSqlComments(sql);
		expect(clean).not.toContain('phantom');
		expect(clean).not.toContain('ghost');
		expect(clean).toContain('CREATE TABLE real');
	});
});

describe('parseCreatedTableNames', () => {
	it('parses backtick, quoted, bracketed, bare and IF NOT EXISTS forms', () => {
		const sql = [
			'CREATE TABLE `user` (`id` text);',
			'CREATE TABLE IF NOT EXISTS "session" (id text);',
			'CREATE TABLE [account] (id text);',
			'CREATE TABLE verification (id text);',
			'create table if not exists tasks (id text);',
		].join('\n');
		expect(parseCreatedTableNames(sql)).toEqual(['user', 'session', 'account', 'verification', 'tasks']);
	});

	it('ignores comments, indexes and non-DDL statements', () => {
		const sql = '-- CREATE TABLE phantom (id text);\nCREATE INDEX `idx` ON `user` (`id`);\nINSERT INTO user VALUES (1);';
		expect(parseCreatedTableNames(sql)).toEqual([]);
	});

	it("excludes drizzle's transient __new_ rebuild tables (renamed away in-migration)", () => {
		const sql = 'CREATE TABLE `__new_user` (`id` text);\nALTER TABLE `__new_user` RENAME TO `user`;';
		expect(parseCreatedTableNames(sql)).toEqual([]);
	});
});

describe('parseVerifiableCreates (recovery gating)', () => {
	it('classifies a pure CREATE TABLE + INDEX migration as recoverable', () => {
		const sql = 'CREATE TABLE `games` (`id` text);\n--> statement-breakpoint\nCREATE UNIQUE INDEX `games_code` ON `games` (`code`);';
		expect(parseVerifiableCreates(sql)).toEqual({ recoverable: true, tables: ['games'], indexes: ['games_code'] });
	});

	it('refuses migrations containing ALTER — their execution cannot be proven', () => {
		const sql = 'CREATE TABLE `games` (`id` text);\nALTER TABLE `user` ADD COLUMN plan text;';
		expect(parseVerifiableCreates(sql).recoverable).toBe(false);
	});

	it('refuses INSERT / data-carrying migrations', () => {
		const sql = "INSERT INTO settings (key, value) VALUES ('theme', 'dark');";
		expect(parseVerifiableCreates(sql).recoverable).toBe(false);
	});

	it('refuses trigger migrations (bodies defeat statement splitting)', () => {
		expect(parseVerifiableCreates(TRIGGER_SQL).recoverable).toBe(false);
	});

	it('refuses empty/comment-only files', () => {
		expect(parseVerifiableCreates('-- nothing here\n').recoverable).toBe(false);
	});
});

describe('D1_MIGRATIONS_TABLE_DDL', () => {
	it("matches wrangler's bookkeeping table shape (name-unique, IF NOT EXISTS)", () => {
		expect(D1_MIGRATIONS_TABLE_DDL).toBe(
			'CREATE TABLE IF NOT EXISTS "d1_migrations"(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);',
		);
	});
});
