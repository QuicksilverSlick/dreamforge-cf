/**
 * BYOP Config Normalizers
 * Automatic, deterministic configuration normalization for imported projects
 *
 * Industry-standard approach used by Vercel, Netlify, Railway, etc.
 * Ensures imported projects work in DreamForge sandbox environment
 */

import { createLogger } from '../../logger';
import { parse, modify, applyEdits } from 'jsonc-parser';

const logger = createLogger('BYOPConfigNormalizers');

export interface BYOPNormalizationResult {
    success: boolean;
    filesModified: string[];
    changes: Array<{
        file: string;
        reason: string;
        change: string;
    }>;
    errors?: string[];
}

export interface DetectedFramework {
    name: string;
    version?: string;
    confidence: 'high' | 'medium' | 'low';
}

/**
 * Detect framework from package.json and file structure
 */
export function detectFramework(files: Record<string, string>): DetectedFramework | null {
    const packageJson = files['package.json'];
    if (!packageJson) return null;

    try {
        const pkg = JSON.parse(packageJson);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        // Next.js detection
        if (deps['next']) {
            return {
                name: 'next',
                version: deps['next'],
                confidence: 'high'
            };
        }

        // Nuxt detection
        if (deps['nuxt'] || deps['nuxt3']) {
            return {
                name: 'nuxt',
                version: deps['nuxt'] || deps['nuxt3'],
                confidence: 'high'
            };
        }

        // SvelteKit detection
        if (deps['@sveltejs/kit']) {
            return {
                name: 'sveltekit',
                version: deps['@sveltejs/kit'],
                confidence: 'high'
            };
        }

        // Vite + React detection
        if (deps['vite'] && deps['react']) {
            return {
                name: 'vite-react',
                version: deps['vite'],
                confidence: 'high'
            };
        }

        // Vite generic
        if (deps['vite']) {
            return {
                name: 'vite',
                version: deps['vite'],
                confidence: 'medium'
            };
        }

        // Create React App detection
        if (deps['react-scripts']) {
            return {
                name: 'cra',
                version: deps['react-scripts'],
                confidence: 'high'
            };
        }

        // Generic React
        if (deps['react']) {
            return {
                name: 'react',
                version: deps['react'],
                confidence: 'low'
            };
        }

        return null;
    } catch (error) {
        logger.error('Failed to detect framework', error);
        return null;
    }
}

/**
 * DreamForge tsconfig.app.json template for React projects
 * CRITICAL: jsx: "react-jsx" is required for React Fast Refresh to work
 */
const TSCONFIG_APP_TEMPLATE = {
    compilerOptions: {
        tsBuildInfoFile: "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: "force",
        noEmit: true,
        jsx: "react-jsx",  // CRITICAL for React Fast Refresh
        strict: false,
        noUnusedLocals: false,
        noUnusedParameters: false,
        noFallthroughCasesInSwitch: false,
        noUncheckedSideEffectImports: true,
        allowSyntheticDefaultImports: true,
        baseUrl: ".",
        paths: {
            "@/*": ["./src/*"],
            "@shared/*": ["./shared/*"]
        }
    },
    include: ["src"]
};

/**
 * DreamForge tsconfig.node.json template for Node tooling
 */
const TSCONFIG_NODE_TEMPLATE = {
    compilerOptions: {
        tsBuildInfoFile: "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
        types: ["@cloudflare/workers-types", "vite/client"],
        target: "ES2022",
        lib: ["ES2023"],
        module: "ESNext",
        skipLibCheck: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: "force",
        noEmit: true,
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
        noFallthroughCasesInSwitch: false,
        noUncheckedSideEffectImports: true,
        paths: {
            "@shared/*": ["./shared/*"]
        }
    },
    include: ["vite.config.ts"]
};

/**
 * DreamForge tsconfig.worker.json template for Cloudflare Workers
 */
const TSCONFIG_WORKER_TEMPLATE = {
    extends: "./tsconfig.node.json",
    compilerOptions: {
        tsBuildInfoFile: "./node_modules/.tmp/tsconfig.worker.tsbuildinfo",
        types: ["@cloudflare/workers-types", "vite/client"],
        lib: ["ES2023", "WebWorker", "ESNext.Intl"]
    },
    include: ["worker"]
};

/**
 * DreamForge tsconfig.json template with project references
 */
const TSCONFIG_ROOT_TEMPLATE = {
    files: [],
    references: [
        { path: "./tsconfig.app.json" },
        { path: "./tsconfig.node.json" },
        { path: "./tsconfig.worker.json" }
    ],
    compilerOptions: {
        incremental: true,
        types: ["@cloudflare/workers-types"],
        baseUrl: ".",
        paths: {
            "@/*": ["./src/*"],
            "@shared/*": ["./shared/*"]
        },
        skipLibCheck: true
    }
};

/**
 * Create complete TypeScript configuration structure for DreamForge sandbox
 * This creates all required tsconfig files with proper settings for React Fast Refresh
 */
export function createTsConfigStructure(
    files: Record<string, string>,
    framework?: DetectedFramework | null
): { filesCreated: string[]; changes: string[] } {
    const filesCreated: string[] = [];
    const changes: string[] = [];

    // Only apply to React/Vite projects
    if (!framework || !['vite-react', 'react', 'cra', 'vite'].includes(framework.name)) {
        return { filesCreated, changes };
    }

    logger.info('Creating DreamForge tsconfig structure for React project', { framework: framework.name });

    // Create tsconfig.app.json (CRITICAL for React Fast Refresh)
    if (!files['tsconfig.app.json']) {
        files['tsconfig.app.json'] = JSON.stringify(TSCONFIG_APP_TEMPLATE, null, 2);
        filesCreated.push('tsconfig.app.json');
        changes.push('Created tsconfig.app.json with jsx: "react-jsx" for React Fast Refresh');
        logger.info('✅ Created tsconfig.app.json with React Fast Refresh support');
    } else {
        // Ensure existing tsconfig.app.json has correct jsx setting
        try {
            const existing = JSON.parse(files['tsconfig.app.json']);
            if (existing.compilerOptions?.jsx !== 'react-jsx') {
                existing.compilerOptions = existing.compilerOptions || {};
                existing.compilerOptions.jsx = 'react-jsx';
                files['tsconfig.app.json'] = JSON.stringify(existing, null, 2);
                changes.push('Fixed tsconfig.app.json: set jsx to "react-jsx" for React Fast Refresh');
            }
        } catch (error) {
            logger.warn('Could not parse existing tsconfig.app.json', error);
        }
    }

    // Create tsconfig.node.json
    if (!files['tsconfig.node.json']) {
        files['tsconfig.node.json'] = JSON.stringify(TSCONFIG_NODE_TEMPLATE, null, 2);
        filesCreated.push('tsconfig.node.json');
        changes.push('Created tsconfig.node.json for Vite tooling');
    }

    // Create tsconfig.worker.json
    if (!files['tsconfig.worker.json']) {
        files['tsconfig.worker.json'] = JSON.stringify(TSCONFIG_WORKER_TEMPLATE, null, 2);
        filesCreated.push('tsconfig.worker.json');
        changes.push('Created tsconfig.worker.json for Cloudflare Workers');
    }

    // Update main tsconfig.json to use project references
    if (files['tsconfig.json']) {
        try {
            const existing = JSON.parse(files['tsconfig.json']);

            // Check if it already has proper structure
            const hasReferences = existing.references &&
                existing.references.some((ref: { path: string }) => ref.path === './tsconfig.app.json');

            if (!hasReferences) {
                // Replace with DreamForge template structure
                files['tsconfig.json'] = JSON.stringify(TSCONFIG_ROOT_TEMPLATE, null, 2);
                changes.push('Updated tsconfig.json to use project references structure');
                logger.info('✅ Updated tsconfig.json with project references');
            }
        } catch (error) {
            // Invalid JSON, replace entirely
            files['tsconfig.json'] = JSON.stringify(TSCONFIG_ROOT_TEMPLATE, null, 2);
            changes.push('Replaced invalid tsconfig.json with DreamForge template');
        }
    } else {
        // No tsconfig.json exists, create it
        files['tsconfig.json'] = JSON.stringify(TSCONFIG_ROOT_TEMPLATE, null, 2);
        filesCreated.push('tsconfig.json');
        changes.push('Created tsconfig.json with project references');
    }

    return { filesCreated, changes };
}

/**
 * Normalize TypeScript configuration for sandbox compatibility
 * Now delegates to createTsConfigStructure for complete setup
 * @deprecated Use createTsConfigStructure instead for comprehensive tsconfig setup
 */
export function normalizeTsConfig(
    tsconfigContent: string,
    framework?: DetectedFramework
): { content: string; changes: string[] } {
    const changes: string[] = [];

    try {
        const tsconfig = JSON.parse(tsconfigContent);
        tsconfig.compilerOptions = tsconfig.compilerOptions || {};

        // Standard path aliases for sandbox
        const originalPaths = JSON.stringify(tsconfig.compilerOptions.paths);
        tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};

        // Ensure @ alias points to src
        if (!tsconfig.compilerOptions.paths['@/*'] ||
            JSON.stringify(tsconfig.compilerOptions.paths['@/*']) !== JSON.stringify(['./src/*'])) {
            tsconfig.compilerOptions.paths['@/*'] = ['./src/*'];
            changes.push('Set @/* path alias to ./src/*');
        }

        // Add @shared alias for shared types
        if (!tsconfig.compilerOptions.paths['@shared/*']) {
            tsconfig.compilerOptions.paths['@shared/*'] = ['./shared/*'];
            changes.push('Added @shared/* alias for shared types');
        }

        // Ensure baseUrl is set
        if (tsconfig.compilerOptions.baseUrl !== '.') {
            tsconfig.compilerOptions.baseUrl = '.';
            changes.push('Set baseUrl to "."');
        }

        // CRITICAL: Set jsx to react-jsx for React Fast Refresh
        if (framework?.name && ['vite-react', 'react', 'cra'].includes(framework.name)) {
            if (tsconfig.compilerOptions.jsx !== 'react-jsx') {
                tsconfig.compilerOptions.jsx = 'react-jsx';
                changes.push('Set jsx to "react-jsx" for React Fast Refresh');
            }
        }

        // Framework-specific adjustments
        if (framework?.name === 'next') {
            // Next.js specific tsconfig adjustments
            tsconfig.compilerOptions.jsx = tsconfig.compilerOptions.jsx || 'preserve';
            tsconfig.compilerOptions.module = tsconfig.compilerOptions.module || 'esnext';
            tsconfig.compilerOptions.moduleResolution = 'bundler';
            changes.push('Applied Next.js TypeScript optimizations');
        }

        // Ensure module resolution works in sandbox
        if (!tsconfig.compilerOptions.moduleResolution) {
            tsconfig.compilerOptions.moduleResolution = 'bundler';
            changes.push('Set moduleResolution to "bundler"');
        }

        // Ensure skipLibCheck for faster builds
        if (tsconfig.compilerOptions.skipLibCheck !== true) {
            tsconfig.compilerOptions.skipLibCheck = true;
            changes.push('Enabled skipLibCheck for faster builds');
        }

        const newPaths = JSON.stringify(tsconfig.compilerOptions.paths);
        if (originalPaths !== newPaths) {
            logger.info('TypeScript paths normalized', {
                before: originalPaths,
                after: newPaths
            });
        }

        return {
            content: JSON.stringify(tsconfig, null, 2),
            changes
        };
    } catch (error) {
        logger.error('Failed to normalize tsconfig.json', error);
        return {
            content: tsconfigContent,
            changes: [`Error parsing tsconfig.json: ${error instanceof Error ? error.message : 'Unknown error'}`]
        };
    }
}

/**
 * DreamForge Vite configuration template
 * Includes @vitejs/plugin-react and @cloudflare/vite-plugin
 *
 * CRITICAL: Uses function export form for proper mode handling with Cloudflare plugin.
 * This ensures React Fast Refresh works correctly in the sandbox environment.
 */
const VITE_CONFIG_TEMPLATE = `import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return defineConfig({
        plugins: [
            react({
                // Ensure Fast Refresh works in sandbox environment
                fastRefresh: true,
                // Babel options for proper transformation
                babel: {
                    parserOpts: {
                        plugins: ['decorators-legacy', 'classProperties']
                    }
                }
            })
            // Note: @cloudflare/vite-plugin is not included in sandbox environment
            // to avoid miniflare initialization issues. Cloudflare Workers deployment
            // is handled separately through the DreamForge deployment system.
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@shared': path.resolve(__dirname, './shared'),
            },
            // CRITICAL: Force single React instance to prevent "Invalid hook call" errors
            // This prevents libraries like @radix-ui and framer-motion from bundling separate React copies
            dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
        },
        server: {
            port: parseInt(env.PORT || process.env.PORT || '5173', 10),
            host: '0.0.0.0',
            allowedHosts: true,
            // HMR configuration for sandbox tunnel environment
            // Disable HMR WebSocket client to prevent connection errors through the tunnel
            // Full page reloads still work correctly
            hmr: false,
        },
        optimizeDeps: {
            // Pre-bundle these dependencies for faster cold start
            // Include common UI libraries to prevent duplicate bundling
            include: [
                'react',
                'react-dom',
                'react-router-dom',
                'react/jsx-runtime',
                'react/jsx-dev-runtime',
                '@radix-ui/react-dialog',
                '@radix-ui/react-slot',
                '@radix-ui/react-compose-refs',
                'framer-motion',
            ],
            // Force re-bundling on changes
            force: true,
            // Ensure Vite processes these correctly
            esbuildOptions: {
                target: 'esnext',
            },
        },
        build: {
            target: 'esnext',
            sourcemap: true,
            // Ensure consistent chunking for React
            rollupOptions: {
                output: {
                    manualChunks: {
                        'react-vendor': ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
                    },
                },
            },
        },
        define: {
            global: 'globalThis',
        },
        cacheDir: 'node_modules/.vite',
    });
};
`;

/**
 * Normalize Vite configuration for sandbox environment
 * Ensures proper port binding, host configuration, React Fast Refresh, and Cloudflare plugin
 * Supports: defineConfig({...}), export default {...}, module.exports = {...}, function exports
 */
export function normalizeViteConfig(
    viteConfigContent: string
): { content: string; changes: string[] } {
    const changes: string[] = [];
    let normalized = viteConfigContent;

    // Detect export pattern for config object
    const hasDefineConfig = normalized.includes('export default defineConfig');
    const hasFunctionExport = /export default \(\s*\{?\s*mode/.test(normalized); // ({ mode }) => or (mode) =>
    const hasPlainExport = normalized.includes('export default {');
    const hasCommonJS = normalized.includes('module.exports');
    const isESM = normalized.includes('import ') || hasPlainExport || hasDefineConfig || hasFunctionExport;

    // Determine the config opening pattern
    let configOpenPattern: string;
    if (hasDefineConfig) {
        configOpenPattern = 'export default defineConfig({';
    } else if (hasPlainExport) {
        configOpenPattern = 'export default {';
    } else if (hasCommonJS) {
        configOpenPattern = 'module.exports = {';
    } else {
        configOpenPattern = 'export default {';
    }

    // Ensure React plugin is imported for Fast Refresh support
    const reactImportESMPattern = /import\s+(\w+)\s+from\s+['"]@vitejs\/plugin-react['"]/;
    const reactImportCJSPattern = /const\s+(\w+)\s+=\s+require\(['"]@vitejs\/plugin-react['"]\)/;
    const reactRequirePattern = /require\(['"]@vitejs\/plugin-react['"]\)/;

    const esmMatch = normalized.match(reactImportESMPattern);
    const cjsMatch = normalized.match(reactImportCJSPattern);
    const hasReactImport = esmMatch || cjsMatch || reactRequirePattern.test(normalized);

    let reactVariableName = esmMatch?.[1] || cjsMatch?.[1] || 'react';

    if (!hasReactImport) {
        const importStatement = isESM
            ? "import react from '@vitejs/plugin-react';\n"
            : "const react = require('@vitejs/plugin-react');\n";

        if (normalized.startsWith('import') || normalized.startsWith('const') || normalized.startsWith('require')) {
            const lines = normalized.split('\n');
            let lastImportIndex = 0;
            for (let i = 0; i < lines.length; i++) {
                const trimmed = lines[i].trim();
                if (trimmed.startsWith('import') || trimmed.startsWith('const') || trimmed.startsWith('require')) {
                    lastImportIndex = i;
                }
            }
            lines.splice(lastImportIndex + 1, 0, importStatement.trim());
            normalized = lines.join('\n');
        } else {
            normalized = importStatement + normalized;
        }
        changes.push('Added @vitejs/plugin-react import for Fast Refresh');
        reactVariableName = 'react';
    }

    // NOTE: We no longer add @cloudflare/vite-plugin to sandbox projects
    // The plugin causes "Expected miniflare to be defined" errors in the sandbox environment
    // Cloudflare Workers deployment is handled separately through the DreamForge deployment system

    // Ensure plugins array includes the React plugin call
    const reactPluginCall = `${reactVariableName}()`;
    const pluginCallPattern = new RegExp(`${reactVariableName}\\s*\\(`);

    if (!normalized.includes('plugins:')) {
        const pluginsConfig = `\n    plugins: [${reactPluginCall}],`;

        if (normalized.includes(configOpenPattern)) {
            normalized = normalized.replace(
                configOpenPattern,
                `${configOpenPattern}${pluginsConfig}`
            );
            changes.push('Added plugins array with React plugin');
        }
    } else {
        if (!pluginCallPattern.test(normalized)) {
            normalized = normalized.replace(
                /(plugins\s*:\s*\[)/,
                `$1${reactPluginCall}, `
            );
            changes.push('Added react() to existing plugins array for Fast Refresh');
        }
    }

    // Ensure @ alias points to src directory AND dedupe is set for React
    if (!normalized.includes('resolve:') || !normalized.includes("'@':")) {
        const aliasConfig = `
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@shared': path.resolve(__dirname, './shared'),
        },
        // CRITICAL: Force single React instance to prevent "Invalid hook call" errors
        dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },`;

        if (normalized.includes(configOpenPattern)) {
            normalized = normalized.replace(
                configOpenPattern,
                `${configOpenPattern}${aliasConfig}`
            );
            changes.push('Added @ and @shared path aliases with React dedupe');
        }
    } else if (!normalized.includes('dedupe:')) {
        // Add dedupe to existing resolve config
        normalized = normalized.replace(
            /(resolve\s*:\s*{)/,
            `$1\n        dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],`
        );
        changes.push('Added React dedupe to prevent duplicate instances');
    }

    // Ensure server config exists with proper port, host, and HMR disabled for tunnel
    if (!normalized.includes('server:')) {
        const serverConfig = `
    server: {
        port: parseInt(process.env.PORT || '5173', 10),
        host: '0.0.0.0',
        allowedHosts: true,
        // Disable HMR WebSocket client for sandbox tunnel environment
        hmr: false,
    },`;

        if (normalized.includes(configOpenPattern)) {
            normalized = normalized.replace(
                configOpenPattern,
                `${configOpenPattern}${serverConfig}`
            );
            changes.push('Added server config with port, host, allowedHosts, and HMR disabled');
        }
    } else {
        if (!normalized.includes('port:')) {
            normalized = normalized.replace(
                /(server\s*:\s*{)/,
                `$1\n        port: parseInt(process.env.PORT || '5173', 10),`
            );
            changes.push('Added port configuration to server');
        }

        if (!normalized.includes("host:")) {
            normalized = normalized.replace(
                /(server\s*:\s*{)/,
                `$1\n        host: '0.0.0.0',`
            );
            changes.push('Added host: 0.0.0.0 to server config');
        }

        if (!normalized.includes("allowedHosts:")) {
            normalized = normalized.replace(
                /(server\s*:\s*{)/,
                `$1\n        allowedHosts: true,`
            );
            changes.push('Added allowedHosts: true to server config');
        }

        // Disable HMR for sandbox tunnel environment to prevent WebSocket connection errors
        if (!normalized.includes('hmr:')) {
            normalized = normalized.replace(
                /(server\s*:\s*{)/,
                `$1\n        hmr: false,`
            );
            changes.push('Disabled HMR for sandbox tunnel environment');
        } else if (normalized.includes('hmr:') && !normalized.includes('hmr: false') && !normalized.includes('hmr:false')) {
            // Replace existing hmr config with false
            normalized = normalized.replace(
                /hmr\s*:\s*{[^}]*}/,
                'hmr: false'
            );
            changes.push('Disabled HMR for sandbox tunnel environment');
        }
    }

    // Ensure path is imported if we added alias
    if (changes.some(c => c.includes('alias')) && !normalized.includes("import path from") && !normalized.includes("require('path')")) {
        const pathImport = isESM ? "import path from 'path';" : "const path = require('path');";

        if (normalized.startsWith('import') || normalized.startsWith('const') || normalized.startsWith('require')) {
            const lines = normalized.split('\n');
            let lastImportIndex = 0;
            for (let i = 0; i < lines.length; i++) {
                const trimmed = lines[i].trim();
                if (trimmed.startsWith('import') || trimmed.startsWith('const') || trimmed.startsWith('require')) {
                    lastImportIndex = i;
                }
            }
            lines.splice(lastImportIndex + 1, 0, pathImport);
            normalized = lines.join('\n');
        } else {
            normalized = `${pathImport}\n${normalized}`;
        }
        changes.push('Added path import for alias resolution');
    }

    return { content: normalized, changes };
}

/**
 * Create a complete vite.config.ts from template
 * Used when no vite.config exists or when the existing one is too broken to fix
 */
export function createViteConfigFromTemplate(
    files: Record<string, string>
): { created: boolean; filename?: string } {
    const viteConfigFile = files['vite.config.ts'] ? 'vite.config.ts' :
                           files['vite.config.js'] ? 'vite.config.js' :
                           files['vite.config.mjs'] ? 'vite.config.mjs' :
                           files['vite.config.cjs'] ? 'vite.config.cjs' :
                           null;

    if (!viteConfigFile) {
        files['vite.config.ts'] = VITE_CONFIG_TEMPLATE;
        logger.info('✅ Created vite.config.ts from DreamForge template');
        return { created: true, filename: 'vite.config.ts' };
    }

    return { created: false };
}

/**
 * Normalize Next.js configuration for sandbox environment
 */
export function normalizeNextConfig(
    nextConfigContent: string
): { content: string; changes: string[] } {
    const changes: string[] = [];
    let normalized = nextConfigContent;

    // Ensure Next.js config has proper server configuration
    if (!normalized.includes('serverRuntimeConfig') && !normalized.includes('env:')) {
        // Add environment variable support
        const envConfig = `
    env: {
        PORT: process.env.PORT || '3000',
    },`;

        if (normalized.includes('module.exports = {')) {
            normalized = normalized.replace(
                'module.exports = {',
                `module.exports = {${envConfig}`
            );
            changes.push('Added PORT environment variable support');
        }
    }

    return { content: normalized, changes };
}

/**
 * Required DreamForge dependencies for React projects
 * These must be present in package.json for the sandbox to work
 *
 * CRITICAL VERSION NOTES:
 * ======================
 * @vitejs/plugin-react v5.x uses Oxc's React refresh transform (NOT react-refresh npm package)
 * @vitejs/plugin-react v4.x uses traditional react-refresh@0.17.x package
 *
 * The sandbox works ONLY with v4.x because Oxc isn't properly configured.
 * Using v5.x causes: "RefreshRuntime.getRefreshReg is not a function"
 *
 * Version constraints:
 * - @vitejs/plugin-react: 4.x.x (NOT 5.x - breaks HMR in sandbox!)
 * - react-refresh: 0.17.x (required by plugin-react 4.x)
 * - react: 18.x (React 19 compatibility varies)
 */
const REQUIRED_DEV_DEPENDENCIES = {
    '@vitejs/plugin-react': '~4.3.4',    // STRICT: 4.x only! 5.x uses Oxc which breaks sandbox HMR
    // NOTE: @cloudflare/vite-plugin is NOT required for sandbox - it causes miniflare init errors
    '@cloudflare/workers-types': '^4.20250807.0',
    'vite': '^6.3.1',
    'typescript': '5.8',
    'react-refresh': '~0.17.0'           // Required by plugin-react 4.x
};

const REQUIRED_DEPENDENCIES = {
    'react': '^18.3.1',                  // React 18 for stability
    'react-dom': '^18.3.1'
};

/**
 * CRITICAL dependencies that MUST be replaced if they exist with incompatible versions
 * These are dependencies where the wrong version breaks the sandbox (e.g., v5.x plugin-react uses Oxc)
 */
const FORCE_REPLACE_DEPENDENCIES: Record<string, { version: string; reason: string }> = {
    '@vitejs/plugin-react': {
        version: '~4.3.4',
        reason: 'v5.x uses Oxc refresh transform which breaks sandbox HMR'
    }
};

/**
 * Check if an existing version is compatible with our required version
 * Returns false if the existing version would resolve to a breaking version (e.g., 5.x)
 */
function isVersionCompatible(existing: string, required: string): boolean {
    // If existing has ^5 or ~5 or starts with 5, it's incompatible with ~4.x
    if (required.startsWith('~4') && existing.match(/[~^]?5/)) {
        return false;
    }
    // If required is exact or tilde range and existing allows major version bump
    if (required.startsWith('~') && existing.startsWith('^')) {
        return false; // ^ allows major bumps which could break things
    }
    return true;
}

/**
 * Normalize package.json to ensure required dependencies are present
 * IMPORTANT: This function will REPLACE incompatible versions of critical dependencies
 * to prevent sandbox-breaking issues like RefreshRuntime.getRefreshReg errors
 */
export function normalizePackageJson(
    files: Record<string, string>,
    framework?: DetectedFramework | null
): { changes: string[] } {
    const changes: string[] = [];

    if (!files['package.json']) {
        return { changes };
    }

    // Only apply to React/Vite projects
    if (!framework || !['vite-react', 'react', 'cra', 'vite'].includes(framework.name)) {
        return { changes };
    }

    try {
        const pkg = JSON.parse(files['package.json']);

        pkg.dependencies = pkg.dependencies || {};
        pkg.devDependencies = pkg.devDependencies || {};

        // CRITICAL: Force replace incompatible versions of critical dependencies
        for (const [dep, config] of Object.entries(FORCE_REPLACE_DEPENDENCIES)) {
            const existingInDeps = pkg.dependencies[dep];
            const existingInDevDeps = pkg.devDependencies[dep];
            const existing = existingInDeps || existingInDevDeps;

            if (existing) {
                if (!isVersionCompatible(existing, config.version)) {
                    // Replace the incompatible version
                    if (existingInDeps) {
                        delete pkg.dependencies[dep];
                    }
                    pkg.devDependencies[dep] = config.version;
                    changes.push(`🔧 REPLACED ${dep}@${existing} → ${config.version} (${config.reason})`);
                    logger.warn(`⚠️ Replacing incompatible ${dep}@${existing} with ${config.version}`, {
                        reason: config.reason,
                        existing,
                        required: config.version
                    });
                }
            } else {
                // Add missing critical dependency
                pkg.devDependencies[dep] = config.version;
                changes.push(`Added critical devDependency: ${dep}@${config.version}`);
            }
        }

        // Check and add required dependencies
        for (const [dep, version] of Object.entries(REQUIRED_DEPENDENCIES)) {
            if (!pkg.dependencies[dep] && !pkg.devDependencies[dep]) {
                pkg.dependencies[dep] = version;
                changes.push(`Added missing dependency: ${dep}@${version}`);
            }
        }

        // Check and add required devDependencies (skip if already handled by FORCE_REPLACE)
        for (const [dep, version] of Object.entries(REQUIRED_DEV_DEPENDENCIES)) {
            if (FORCE_REPLACE_DEPENDENCIES[dep]) continue; // Already handled above
            if (!pkg.dependencies[dep] && !pkg.devDependencies[dep]) {
                pkg.devDependencies[dep] = version;
                changes.push(`Added missing devDependency: ${dep}@${version}`);
            }
        }

        // Ensure scripts are present
        pkg.scripts = pkg.scripts || {};
        if (!pkg.scripts.dev) {
            pkg.scripts.dev = 'vite';
            changes.push('Added dev script: vite');
        }
        if (!pkg.scripts.build) {
            pkg.scripts.build = 'tsc -b && vite build';
            changes.push('Added build script: tsc -b && vite build');
        }
        if (!pkg.scripts.preview) {
            pkg.scripts.preview = 'vite preview';
            changes.push('Added preview script: vite preview');
        }

        if (changes.length > 0) {
            files['package.json'] = JSON.stringify(pkg, null, 2);
            logger.info('✅ Normalized package.json with DreamForge dependencies', {
                changesCount: changes.length,
                changes
            });
        }

    } catch (error) {
        logger.error('Failed to normalize package.json', error);
    }

    return { changes };
}

/**
 * Ensure vite.config exists for React projects
 * Creates a complete vite.config with React and Cloudflare plugins if missing
 */
export function ensureViteConfig(
    files: Record<string, string>,
    framework?: DetectedFramework | null
): { created: boolean; filename?: string } {
    // Check if vite.config already exists
    const viteConfigFile = files['vite.config.ts'] ? 'vite.config.ts' :
                           files['vite.config.js'] ? 'vite.config.js' :
                           files['vite.config.mjs'] ? 'vite.config.mjs' :
                           files['vite.config.cjs'] ? 'vite.config.cjs' :
                           null;

    // If config exists or not a React/Vite project, return
    if (viteConfigFile || !framework || !['vite-react', 'react', 'cra', 'vite'].includes(framework.name)) {
        return { created: false };
    }

    // Create vite.config.ts using the DreamForge template
    files['vite.config.ts'] = VITE_CONFIG_TEMPLATE;
    logger.info('✅ Created vite.config.ts with DreamForge template (React + Cloudflare plugins)');

    return { created: true, filename: 'vite.config.ts' };
}

/**
 * Wrangler.jsonc template with nodejs_compat flag
 * Required for @cloudflare/vite-plugin to work correctly
 */
const WRANGLER_JSONC_TEMPLATE = `{
  "name": "dreamforge-app",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"],
  "main": "src/index.ts"
}
`;

/**
 * Normalize wrangler.jsonc to ensure nodejs_compat flag is present
 * This is CRITICAL when @cloudflare/vite-plugin is used
 *
 * The @cloudflare/vite-plugin requires Node.js APIs that are only available
 * with the nodejs_compat compatibility flag enabled.
 */
export function normalizeWranglerJsonc(
    wranglerContent: string | null,
    hasCloudflareVitePlugin: boolean
): { content: string; changes: string[]; created: boolean } {
    const changes: string[] = [];
    const created = false;

    // If no wrangler.jsonc exists and we're using @cloudflare/vite-plugin, create one
    if (!wranglerContent && hasCloudflareVitePlugin) {
        logger.info('Creating wrangler.jsonc with nodejs_compat for @cloudflare/vite-plugin');
        return {
            content: WRANGLER_JSONC_TEMPLATE,
            changes: ['Created wrangler.jsonc with nodejs_compat flag for @cloudflare/vite-plugin compatibility'],
            created: true
        };
    }

    if (!wranglerContent) {
        return { content: '', changes: [], created: false };
    }

    let normalized = wranglerContent;

    try {
        // Parse JSONC to check current configuration
        const config = parse(wranglerContent) as Record<string, unknown>;
        const existingFlags = config.compatibility_flags as string[] | undefined;
        const hasNodejsCompat = existingFlags?.includes('nodejs_compat');

        // If we're using @cloudflare/vite-plugin but nodejs_compat is missing, add it
        if (hasCloudflareVitePlugin && !hasNodejsCompat) {
            logger.info('Adding nodejs_compat flag to wrangler.jsonc for @cloudflare/vite-plugin');

            if (!existingFlags) {
                // Add compatibility_flags array with nodejs_compat
                const edits = modify(normalized, ['compatibility_flags'], ['nodejs_compat'], {
                    formattingOptions: {
                        tabSize: 2,
                        insertSpaces: true,
                        eol: '\n'
                    }
                });
                normalized = applyEdits(normalized, edits);
                changes.push('Added compatibility_flags: ["nodejs_compat"] for @cloudflare/vite-plugin');
            } else {
                // Add nodejs_compat to existing array
                const newFlags = [...existingFlags, 'nodejs_compat'];
                const edits = modify(normalized, ['compatibility_flags'], newFlags, {
                    formattingOptions: {
                        tabSize: 2,
                        insertSpaces: true,
                        eol: '\n'
                    }
                });
                normalized = applyEdits(normalized, edits);
                changes.push('Added nodejs_compat to existing compatibility_flags for @cloudflare/vite-plugin');
            }
        }

        // Ensure compatibility_date is set (required for nodejs_compat)
        if (!config.compatibility_date) {
            const edits = modify(normalized, ['compatibility_date'], '2025-01-01', {
                formattingOptions: {
                    tabSize: 2,
                    insertSpaces: true,
                    eol: '\n'
                }
            });
            normalized = applyEdits(normalized, edits);
            changes.push('Added compatibility_date: "2025-01-01"');
        }

    } catch (error) {
        logger.error('Failed to normalize wrangler.jsonc', error);
        changes.push(`Error parsing wrangler.jsonc: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { content: normalized, changes, created };
}

/**
 * Main normalization orchestrator
 * Applies all relevant normalizers based on detected framework
 *
 * ORDER OF OPERATIONS (CRITICAL):
 * 1. Detect framework from package.json
 * 2. Create complete tsconfig structure (tsconfig.json + tsconfig.app.json + tsconfig.node.json + tsconfig.worker.json)
 * 3. Ensure vite.config.ts exists with React + Cloudflare plugins
 * 4. Normalize existing vite.config if present
 * 5. Normalize package.json with required dependencies
 * 6. Normalize wrangler.jsonc with nodejs_compat (CRITICAL for @cloudflare/vite-plugin)
 * 7. Apply framework-specific normalizations (Next.js, etc.)
 */
export function normalizeBYOPConfigs(
    files: Record<string, string>
): BYOPNormalizationResult {
    logger.info('🔧 Starting BYOP configuration normalization', {
        fileCount: Object.keys(files).length,
        hasPackageJson: !!files['package.json'],
        hasTsconfig: !!files['tsconfig.json'],
        hasViteConfig: !!(files['vite.config.ts'] || files['vite.config.js'])
    });

    const result: BYOPNormalizationResult = {
        success: true,
        filesModified: [],
        changes: [],
        errors: []
    };

    try {
        // Step 1: Detect framework
        const framework = detectFramework(files);
        logger.info('Framework detected', {
            name: framework?.name,
            version: framework?.version,
            confidence: framework?.confidence
        });

        // Step 2: CRITICAL - Create complete tsconfig structure for React projects
        // This creates tsconfig.json, tsconfig.app.json, tsconfig.node.json, tsconfig.worker.json
        // MUST be done before other normalizations to ensure jsx: "react-jsx" is set
        const tsconfigResult = createTsConfigStructure(files, framework);
        if (tsconfigResult.filesCreated.length > 0 || tsconfigResult.changes.length > 0) {
            result.filesModified.push(...tsconfigResult.filesCreated);
            result.changes.push(
                ...tsconfigResult.changes.map(change => ({
                    file: 'tsconfig structure',
                    reason: 'DreamForge TypeScript configuration',
                    change
                }))
            );
            logger.info('✅ Created DreamForge tsconfig structure', {
                filesCreated: tsconfigResult.filesCreated,
                changes: tsconfigResult.changes
            });
        }

        // Step 3: Ensure vite.config exists with React + Cloudflare plugins
        const viteConfigResult = ensureViteConfig(files, framework);
        if (viteConfigResult.created) {
            result.filesModified.push(viteConfigResult.filename!);
            result.changes.push({
                file: viteConfigResult.filename!,
                reason: 'DreamForge Vite configuration',
                change: 'Created vite.config.ts with @vitejs/plugin-react and @cloudflare/vite-plugin'
            });
        }

        // Step 4: Normalize existing vite.config (add missing plugins, server config, etc.)
        const viteConfigFile = files['vite.config.ts'] ? 'vite.config.ts' :
                               files['vite.config.js'] ? 'vite.config.js' :
                               files['vite.config.mjs'] ? 'vite.config.mjs' :
                               files['vite.config.cjs'] ? 'vite.config.cjs' :
                               null;

        if (viteConfigFile && files[viteConfigFile] && !viteConfigResult.created) {
            const { content, changes } = normalizeViteConfig(files[viteConfigFile]);
            if (changes.length > 0) {
                files[viteConfigFile] = content;
                if (!result.filesModified.includes(viteConfigFile)) {
                    result.filesModified.push(viteConfigFile);
                }
                result.changes.push(
                    ...changes.map(change => ({
                        file: viteConfigFile,
                        reason: 'Vite sandbox compatibility',
                        change
                    }))
                );
            }
        }

        // Step 5: Normalize package.json with required dependencies
        const pkgResult = normalizePackageJson(files, framework);
        if (pkgResult.changes.length > 0) {
            if (!result.filesModified.includes('package.json')) {
                result.filesModified.push('package.json');
            }
            result.changes.push(
                ...pkgResult.changes.map(change => ({
                    file: 'package.json',
                    reason: 'DreamForge dependency requirements',
                    change
                }))
            );
        }

        // Step 6: Normalize wrangler.jsonc with nodejs_compat flag if project has cloudflare plugin
        // NOTE: We no longer add @cloudflare/vite-plugin to new sandbox projects to avoid miniflare errors
        // But we still need to handle existing projects that may have it
        const viteContent = files['vite.config.ts'] || files['vite.config.js'] ||
                            files['vite.config.mjs'] || files['vite.config.cjs'] || '';
        const hasCloudflareVitePlugin = viteContent.includes('@cloudflare/vite-plugin') ||
                                         viteContent.includes('cloudflare()');

        if (hasCloudflareVitePlugin) {
            const wranglerContent = files['wrangler.jsonc'] || files['wrangler.json'] || null;
            const wranglerResult = normalizeWranglerJsonc(wranglerContent, true);

            if (wranglerResult.changes.length > 0 || wranglerResult.created) {
                const wranglerFile = wranglerResult.created ? 'wrangler.jsonc' :
                                     (files['wrangler.jsonc'] ? 'wrangler.jsonc' : 'wrangler.json');
                files[wranglerFile] = wranglerResult.content;

                if (!result.filesModified.includes(wranglerFile)) {
                    result.filesModified.push(wranglerFile);
                }
                result.changes.push(
                    ...wranglerResult.changes.map(change => ({
                        file: wranglerFile,
                        reason: '@cloudflare/vite-plugin compatibility (existing project)',
                        change
                    }))
                );
                logger.info('✅ Normalized wrangler.jsonc for existing @cloudflare/vite-plugin project', {
                    created: wranglerResult.created,
                    changes: wranglerResult.changes
                });
            }
        }

        // Step 7: Normalize tsconfig.json content if it exists (for legacy compatibility)
        if (files['tsconfig.json'] && tsconfigResult.filesCreated.length === 0) {
            const { content, changes } = normalizeTsConfig(files['tsconfig.json'], framework || undefined);
            if (changes.length > 0) {
                files['tsconfig.json'] = content;
                if (!result.filesModified.includes('tsconfig.json')) {
                    result.filesModified.push('tsconfig.json');
                }
                result.changes.push(
                    ...changes.map(change => ({
                        file: 'tsconfig.json',
                        reason: 'TypeScript normalization',
                        change
                    }))
                );
            }
        }

        // Step 8: Normalize next.config.js (for Next.js projects)
        if (framework?.name === 'next' && (files['next.config.js'] || files['next.config.mjs'])) {
            const configFile = files['next.config.js'] ? 'next.config.js' : 'next.config.mjs';
            const { content, changes } = normalizeNextConfig(files[configFile]!);
            if (changes.length > 0) {
                files[configFile] = content;
                result.filesModified.push(configFile);
                result.changes.push(
                    ...changes.map(change => ({
                        file: configFile,
                        reason: 'Next.js sandbox compatibility',
                        change
                    }))
                );
            }
        }

        logger.info('✅ BYOP normalization completed successfully', {
            filesModified: result.filesModified.length,
            totalChanges: result.changes.length,
            framework: framework?.name,
            files: result.filesModified
        });

    } catch (error) {
        result.success = false;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        result.errors = [errorMessage];
        logger.error('❌ BYOP normalization failed', error);
    }

    return result;
}

/**
 * Validate that normalized configs are safe and correct
 * Security check to prevent malicious config injection
 */
export function validateNormalizedConfigs(
    files: Record<string, string>
): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
        // Validate tsconfig.json
        if (files['tsconfig.json']) {
            const tsconfig = JSON.parse(files['tsconfig.json']);

            // Ensure paths don't escape project directory
            if (tsconfig.compilerOptions?.paths) {
                for (const [alias, paths] of Object.entries(tsconfig.compilerOptions.paths)) {
                    for (const p of paths as string[]) {
                        if (p.includes('..') && !p.startsWith('../shared')) {
                            errors.push(`Unsafe path alias detected: ${alias} -> ${p}`);
                        }
                    }
                }
            }
        }

        // Validate package.json hasn't been modified
        if (files['package.json']) {
            const pkg = JSON.parse(files['package.json']);

            // Ensure no malicious scripts were added
            if (pkg.scripts?.preinstall || pkg.scripts?.postinstall) {
                logger.warn('Project has install scripts, monitoring for safety', {
                    preinstall: pkg.scripts.preinstall,
                    postinstall: pkg.scripts.postinstall
                });
            }
        }

    } catch (error) {
        errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
