// import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	optimizeDeps: {
		exclude: ['format', 'editor.all'],
		include: ['monaco-editor/esm/vs/editor/editor.api'],
		force: true,
	},

	// Do NOT add a `vendor`-style advancedChunks group here. It was measured on
	// 2026-08-01 and made the critical path substantially WORSE:
	//
	//   default chunking + lazy monaco ..... 1.51 MB, 1 preloaded file
	//   with vendor/monaco/react groups .... 5.12 MB, 8 preloaded files
	//
	// A catch-all `test: /node_modules/` group pulls DYNAMICALLY imported
	// dependencies (monaco, loaded on demand by monaco-editor.lazy.tsx) into a
	// named chunk that the entry statically depends on. Rolldown then emits a
	// `<link rel="modulepreload">` for it in index.html, so the browser fetches
	// the whole thing up front and the code splitting is silently undone.
	//
	// Entry size is a code-splitting problem, not a chunking problem: defer the
	// heavy import instead. See monaco-editor.lazy.tsx.
	plugins: [
		react(),
		svgr(),
		cloudflare({
			configPath: 'wrangler.jsonc',
		}),
		tailwindcss(),
		// sentryVitePlugin({
		// 	org: 'cloudflare-0u',
		// 	project: 'javascript-react',
		// }),
	],

	resolve: {
		alias: {
			debug: 'debug/src/browser',
			'@': path.resolve(__dirname, './src'),
			'shared': path.resolve(__dirname, './shared'),
			'worker': path.resolve(__dirname, './worker'),
		},
	},

	// Configure for Prisma + Cloudflare Workers compatibility
	define: {
		// Ensure proper module definitions for Cloudflare Workers context
		'process.env.NODE_ENV': JSON.stringify(
			process.env.NODE_ENV || 'development',
		),
		global: 'globalThis',
		// '__filename': '""',
		// '__dirname': '""',
	},

	worker: {
		// Handle Prisma in worker context for development
		format: 'es',
	},

	server: {
		allowedHosts: true,
	},

	// Clear cache more aggressively
	cacheDir: 'node_modules/.vite',

	build: {
		sourcemap: true,
	},
});
