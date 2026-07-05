import { copyFileSync, mkdirSync, existsSync, cpSync } from 'fs';
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
 * This script writes into `dist/client/marketing/` because that's the path the
 * worker rewrites to in `worker/index.ts`:
 *     marketingPath = '/marketing/'
 *     env.ASSETS.fetch(marketingPath)
 *
 * `env.ASSETS` resolves against `dist/client/`, so files MUST land there to be
 * reachable at runtime.
 */

const PROJECT_ROOT = process.cwd();
const SRC_INDIVIDUAL = join(PROJECT_ROOT, 'worker', 'static', 'landing-pages');

const ASSETS_DIR = join(PROJECT_ROOT, 'dist', 'client');
const MARKETING_DIR = join(ASSETS_DIR, 'marketing');

if (!existsSync(ASSETS_DIR)) {
	throw new Error(
		`Asset directory does not exist: ${ASSETS_DIR}. Did 'vite build' run first?`
	);
}
mkdirSync(MARKETING_DIR, { recursive: true });

const FILES = ['index.html', 'pricing.html', 'styles.css', 'script.js'] as const;
// Optional top-level files (copied only if present) and the shared image assets dir.
const OPTIONAL_FILES = ['favicon.svg'] as const;

console.log('📄 Copying individual landing page to dist/client/marketing/...');
for (const file of FILES) {
	copyFileSync(join(SRC_INDIVIDUAL, file), join(MARKETING_DIR, file));
}
for (const file of OPTIONAL_FILES) {
	const src = join(SRC_INDIVIDUAL, file);
	if (existsSync(src)) copyFileSync(src, join(MARKETING_DIR, file));
}

const SRC_ASSETS = join(SRC_INDIVIDUAL, 'assets');
if (existsSync(SRC_ASSETS)) {
	console.log('🖼️  Copying brand image assets to dist/client/marketing/assets/...');
	cpSync(SRC_ASSETS, join(MARKETING_DIR, 'assets'), { recursive: true });
}

console.log('✅ Landing page copied successfully!');
console.log('  - Marketing: dist/client/marketing/');
