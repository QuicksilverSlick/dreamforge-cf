import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Post-build step: copy the marketing landing pages from their source location
 * (`worker/static/landing-pages/`) into the asset directory the deployed worker
 * actually serves.
 *
 * Layout produced by the rest of the build:
 *   dist/
 *     client/                  — frontend SPA + ASSETS-served files. This is
 *                                the real serving root: dist/dreamforge_cf/wrangler.json
 *                                resolves `assets.directory` to `../client`.
 *     dreamforge_cf/           — pre-bundled worker (from @cloudflare/vite-plugin)
 *
 * This script writes into `dist/client/marketing/` (and `.../dream-builder/`)
 * because that's the path the worker rewrites to in `worker/index.ts`:
 *     marketingPath = '/marketing/'
 *     env.ASSETS.fetch(marketingPath)
 *
 * `env.ASSETS` resolves against `dist/client/`, so files MUST land there to be
 * reachable at runtime.
 */

const PROJECT_ROOT = process.cwd();
const SRC_INDIVIDUAL = join(PROJECT_ROOT, 'worker', 'static', 'landing-pages');
const SRC_ENTERPRISE = join(SRC_INDIVIDUAL, 'dream-builder');

const ASSETS_DIR = join(PROJECT_ROOT, 'dist', 'client');
const MARKETING_DIR = join(ASSETS_DIR, 'marketing');
const DREAM_BUILDER_DIR = join(MARKETING_DIR, 'dream-builder');

if (!existsSync(ASSETS_DIR)) {
	throw new Error(
		`Asset directory does not exist: ${ASSETS_DIR}. Did 'vite build' run first?`
	);
}
mkdirSync(MARKETING_DIR, { recursive: true });
mkdirSync(DREAM_BUILDER_DIR, { recursive: true });

const FILES = ['index.html', 'styles.css', 'script.js'] as const;

console.log('📄 Copying individual landing page to dist/client/marketing/...');
for (const file of FILES) {
	copyFileSync(join(SRC_INDIVIDUAL, file), join(MARKETING_DIR, file));
}

console.log('📄 Copying enterprise landing page to dist/client/marketing/dream-builder/...');
for (const file of FILES) {
	copyFileSync(join(SRC_ENTERPRISE, file), join(DREAM_BUILDER_DIR, file));
}

console.log('✅ Landing pages copied successfully!');
console.log('  - Individual: dist/client/marketing/');
console.log('  - Enterprise: dist/client/marketing/dream-builder/');
