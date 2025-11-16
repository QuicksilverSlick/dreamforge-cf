// import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';

// Plugin to inject Node.js polyfills for ts-morph compatibility
const nodePolyfills = (): Plugin => ({
	name: 'node-polyfills',
	transform(code, id) {
		if (id.includes('ts-morph') || id.includes('@ts-morph')) {
			return {
				code: `
					if (typeof __filename === 'undefined') {
						globalThis.__filename = '';
						globalThis.__dirname = '';
					}
					${code}
				`,
				map: null
			};
		}
	}
});

// https://vite.dev/config/
export default defineConfig({
	optimizeDeps: {
		exclude: [
			'format',
			'editor.all',
			'ts-morph',
			'@ts-morph/common',
			'@ts-morph/bootstrap',
		],
		include: ['monaco-editor/esm/vs/editor/editor.api'],
		force: true,
	},

	// build: {
	//     rollupOptions: {
	//       output: {
	//             advancedChunks: {
	//                 groups: [{name: 'vendor', test: /node_modules/}]
	//             }
	//         }
	//     }
	// },
	plugins: [
		nodePolyfills(),
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

	ssr: {
		// Prevent worker code from being processed for the client
		noExternal: [],
		external: ['ts-morph', '@ts-morph/common', '@ts-morph/bootstrap'],
	},

	// Configure for Prisma + Cloudflare Workers compatibility
	define: {
		// Ensure proper module definitions for Cloudflare Workers context
		'process.env.NODE_ENV': JSON.stringify(
			process.env.NODE_ENV || 'development',
		),
		global: 'globalThis',
		'__filename': '""',
		'__dirname': '""',
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
});
