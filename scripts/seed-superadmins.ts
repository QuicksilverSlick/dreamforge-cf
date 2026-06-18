#!/usr/bin/env bun
/**
 * Seed / upsert platform operator accounts (Phase 0 keystone).
 *
 * Credentials are NEVER hardcoded here. Provide them at run time via either:
 *   - env var SEED_SUPERADMINS = JSON array, or
 *   - --file <path-to-json>           (a gitignored creds file)
 * Each entry: { "email", "password", "displayName", "role"?, "username"? }
 * `role` defaults to "superadmin".
 *
 * Passwords are hashed locally with the SAME PBKDF2 primitive the worker uses
 * (worker/utils/cryptoUtils.pbkdf2 → SHA-256, 100k iters, 16-byte salt,
 * base64(salt‖hash)), so the stored hash verifies against PasswordService.
 *
 * Safe by default: prints the idempotent SQL (DRY RUN). Pass --execute to
 * apply it via the OAuth-authed wrangler CLI. Target defaults to --local;
 * pass --remote to write production D1.
 *
 *   bun scripts/seed-superadmins.ts --file ./.seed.json                 # dry run
 *   bun scripts/seed-superadmins.ts --file ./.seed.json --execute --remote
 *
 * REQUIRES the `role` column to exist (migration 0008) in the target DB.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pbkdf2 } from '../worker/utils/cryptoUtils';
import { validatePassword } from '../worker/utils/validationUtils';
import type { UserRole } from '../worker/types/auth-types';

const D1_DATABASE = 'vibesdk-db';
const VALID_ROLES: readonly UserRole[] = ['superadmin', 'admin', 'user', 'support', 'ai_support', 'ai_admin'];

interface SeedUser {
    email: string;
    password: string;
    displayName: string;
    role?: UserRole;
    username?: string;
}

/** Mirror of PasswordService.hash — keep the storage format in lockstep. */
async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await pbkdf2(password, salt, 100000, 32);
    const combined = new Uint8Array(salt.length + hash.length);
    combined.set(salt);
    combined.set(hash, salt.length);
    return btoa(String.fromCharCode(...combined));
}

function sqlString(value: string): string {
    return `'${value.replace(/'/g, "''")}'`;
}

function loadSeedUsers(filePath: string | null): SeedUser[] {
    const raw = filePath ? readFileSync(filePath, 'utf8') : process.env.SEED_SUPERADMINS;
    if (!raw) {
        throw new Error('No credentials provided. Set SEED_SUPERADMINS env or pass --file <json>.');
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Credentials must be a non-empty JSON array.');
    }
    return parsed.map((entry, i): SeedUser => {
        if (typeof entry !== 'object' || entry === null) throw new Error(`Entry ${i} is not an object.`);
        const e = entry as Record<string, unknown>;
        if (typeof e.email !== 'string' || typeof e.password !== 'string' || typeof e.displayName !== 'string') {
            throw new Error(`Entry ${i} requires string email, password, displayName.`);
        }
        const role = (e.role as UserRole) ?? 'superadmin';
        if (!VALID_ROLES.includes(role)) throw new Error(`Entry ${i} has invalid role "${role}".`);
        return {
            email: e.email,
            password: e.password,
            displayName: e.displayName,
            role,
            username: typeof e.username === 'string' ? e.username : undefined,
        };
    });
}

async function buildSql(users: SeedUser[]): Promise<string> {
    const statements: string[] = [];
    for (const u of users) {
        const check = validatePassword(u.password);
        if (!check.valid) {
            throw new Error(`Password for ${u.email} is invalid: ${check.errors?.join(', ')}`);
        }
        const id = crypto.randomUUID();
        const email = u.email.toLowerCase();
        const passwordHash = await hashPassword(u.password);
        // Idempotent by email: insert a fresh email-provider account, or update
        // an EXISTING email account. The `WHERE users.provider = 'email'` guard
        // means a pre-existing OAuth account (github/google) is NEVER silently
        // promoted to superadmin or made password-loginable by a colliding email
        // — the conflicting insert simply no-ops for it.
        statements.push(
            `INSERT INTO users (id, email, display_name, provider, provider_id, email_verified, password_hash, role, is_active, is_suspended, created_at, updated_at)\n` +
            `VALUES (${sqlString(id)}, ${sqlString(email)}, ${sqlString(u.displayName)}, 'email', ${sqlString(id)}, 1, ${sqlString(passwordHash)}, ${sqlString(u.role!)}, 1, 0, unixepoch(), unixepoch())\n` +
            `ON CONFLICT(email) DO UPDATE SET role = excluded.role, password_hash = excluded.password_hash, display_name = excluded.display_name, is_active = 1, is_suspended = 0, updated_at = unixepoch()\n` +
            `WHERE users.provider = 'email';`,
        );
    }
    return statements.join('\n\n');
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);
    const execute = args.includes('--execute');
    const remote = args.includes('--remote');
    const fileFlag = args.indexOf('--file');
    const filePath = fileFlag >= 0 ? args[fileFlag + 1] ?? null : null;

    const users = loadSeedUsers(filePath);
    const sql = await buildSql(users);
    const target = remote ? 'REMOTE (production)' : 'local';

    console.log(`\n-- Seeding ${users.length} account(s) → ${target}:`);
    for (const u of users) console.log(`--   ${u.email}  role=${u.role}  (${u.displayName})`);
    console.log(`\n${sql}\n`);

    if (!execute) {
        console.log('DRY RUN — no changes applied. Re-run with --execute (and --remote for production) to apply.');
        return;
    }

    const tmp = join(tmpdir(), `df-seed-${Date.now()}.sql`);
    // The temp path is the only interpolated arg; assert it is shell-safe so
    // the shell:true below (needed for wrangler's .cmd shim on Windows) cannot
    // be abused. The SQL itself goes through the file, never the command line.
    if (!/^[A-Za-z0-9_./\\:-]+$/.test(tmp)) {
        throw new Error(`Refusing unsafe temp path: ${tmp}`);
    }
    writeFileSync(tmp, sql, 'utf8');
    try {
        const wranglerArgs = ['d1', 'execute', D1_DATABASE, remote ? '--remote' : '--local', `--file=${tmp}`];
        console.log(`Applying via: wrangler ${wranglerArgs.join(' ')}`);
        // shell:true is required on Windows where `wrangler` resolves to a .cmd
        // shim; all args are literal constants plus the asserted-safe temp path.
        execFileSync('wrangler', wranglerArgs, { stdio: 'inherit', shell: true });
        console.log('\nSeed applied successfully.');
    } finally {
        unlinkSync(tmp);
    }
}

void main().catch((err: unknown) => {
    console.error('Seed failed:', err instanceof Error ? err.message : String(err));
    process.exit(1);
});
