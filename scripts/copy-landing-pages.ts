import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Post-build script to copy landing pages to dist/
 * This runs after Vite builds the React app
 */

const DIST_DIR = join(process.cwd(), 'dist');
const MARKETING_DIR = join(DIST_DIR, 'marketing');
const DREAM_BUILDER_DIR = join(MARKETING_DIR, 'dream-builder');

// Ensure directories exist
if (!existsSync(MARKETING_DIR)) {
	mkdirSync(MARKETING_DIR, { recursive: true });
}
if (!existsSync(DREAM_BUILDER_DIR)) {
	mkdirSync(DREAM_BUILDER_DIR, { recursive: true });
}

// Copy individual landing page (root)
console.log('📄 Copying individual landing page to dist/marketing/...');
copyFileSync(
	join(process.cwd(), 'landing-pages/individuals/index.html'),
	join(MARKETING_DIR, 'index.html')
);
copyFileSync(
	join(process.cwd(), 'landing-pages/individuals/styles.css'),
	join(MARKETING_DIR, 'styles.css')
);
copyFileSync(
	join(process.cwd(), 'landing-pages/individuals/script.js'),
	join(MARKETING_DIR, 'script.js')
);

// Copy enterprise landing page (dream-builder)
console.log('📄 Copying enterprise landing page to dist/marketing/dream-builder/...');
copyFileSync(
	join(process.cwd(), 'features/enterprise-landing/index.html'),
	join(DREAM_BUILDER_DIR, 'index.html')
);
copyFileSync(
	join(process.cwd(), 'features/enterprise-landing/styles.css'),
	join(DREAM_BUILDER_DIR, 'styles.css')
);
copyFileSync(
	join(process.cwd(), 'features/enterprise-landing/script.js'),
	join(DREAM_BUILDER_DIR, 'script.js')
);

console.log('✅ Landing pages copied successfully!');
console.log('  - Individual: dist/marketing/');
console.log('  - Enterprise: dist/marketing/dream-builder/');
