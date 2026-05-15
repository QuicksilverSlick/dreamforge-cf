/**
 * Cloudflare Workers Compatibility Checker
 *
 * Automated detection and fixing of compatibility issues when migrating projects
 * from Vercel, Netlify, or traditional hosting to Cloudflare Workers.
 *
 * Based on comprehensive research from November 2025 migration guides.
 */

export interface CompatibilityIssue {
    type: IssueType;
    severity: 'blocker' | 'high' | 'medium' | 'low';
    file: string;
    line?: number;
    column?: number;
    pattern: string;
    match: string;
    message: string;
    suggestion: string;
    autoFixable: boolean;
    autoFix?: {
        type: 'replace' | 'remove' | 'config' | 'dependency';
        replacement?: string;
        configUpdate?: Record<string, unknown>;
    };
    documentationUrl?: string;
}

export type IssueType =
    | 'node-builtin-fs'
    | 'node-builtin-path'
    | 'node-builtin-os'
    | 'node-builtin-child-process'
    | 'node-builtin-requires-compat'
    | 'process-cwd'
    | 'dirname-filename'
    | 'vercel-edge'
    | 'netlify-functions'
    | 'express-server'
    | 'database-postgres'
    | 'database-mysql'
    | 'database-mongodb'
    | 's3-storage'
    | 'redis-session'
    | 'incompatible-package'
    | 'requires-nodejs-compat'
    | 'process-env'
    | 'import-meta-env'
    | 'dynamic-import'
    | 'bcrypt-native'
    | 'browser-api'
    | 'middleware-express'
    | 'oauth-redirect';

export interface MigrationAnalysisResult {
    platform: 'vercel' | 'netlify' | 'traditional' | 'unknown';
    issues: CompatibilityIssue[];
    blockers: CompatibilityIssue[];
    requiredConfig: RequiredConfiguration;
    dependencies: DependencyAnalysis;
    estimatedEffort: 'low' | 'medium' | 'high';
    migrationComplexity: number; // 0-100
    readyForMigration: boolean;
}

export interface RequiredConfiguration {
    needsNodejsCompat: boolean;
    needsDynamicImports: boolean;
    needsHyperdrive: boolean;
    needsR2: boolean;
    needsKV: boolean;
    needsDurableObjects: boolean;
    wranglerConfig: Partial<WranglerConfig>;
}

export interface DependencyAnalysis {
    incompatible: Array<{ name: string; reason: string; alternative: string }>;
    requiresNodejsCompat: string[];
    recommended: Array<{ current: string; recommended: string; reason: string }>;
}

export interface WranglerConfig {
    compatibility_flags?: string[];
    compatibility_date?: string;
    vars?: Record<string, string>;
    rules?: Array<{
        type: string;
        globs: string[];
        fallthrough?: boolean;
    }>;
    find_additional_modules?: boolean;
    kv_namespaces?: Array<{ binding: string; id: string }>;
    r2_buckets?: Array<{ binding: string; bucket_name: string }>;
    d1_databases?: Array<{ binding: string; database_name: string; database_id: string }>;
    durable_objects?: {
        bindings?: Array<{ name: string; class_name: string; script_name?: string }>;
    };
}

/**
 * Detection patterns for compatibility issues
 */
export const DETECTION_PATTERNS: Record<IssueType, {
    regex: RegExp;
    severity: CompatibilityIssue['severity'];
    message: string;
    suggestion: string;
    autoFixable: boolean;
    documentationUrl?: string;
}> = {
    'node-builtin-fs': {
        regex: /(?:require\(['"]fs['"]\)|import\s+.*\s+from\s+['"]fs['"]|import\s+.*\s+from\s+['"]node:fs['"]|import\s+.*\s+from\s+['"]fs\/promises['"])/g,
        severity: 'blocker',
        message: 'File system (fs) module is not supported in Cloudflare Workers',
        suggestion: 'Replace file system operations with R2 storage. Use env.MY_BUCKET.get() and env.MY_BUCKET.put() for file operations.',
        autoFixable: false,
        documentationUrl: 'https://developers.cloudflare.com/r2/'
    },
    'node-builtin-path': {
        regex: /(?:require\(['"]path['"]\)|import\s+.*\s+from\s+['"]path['"]|import\s+.*\s+from\s+['"]node:path['"])/g,
        severity: 'medium',
        message: 'Path module usage detected',
        suggestion: 'Replace path operations with string manipulation or use @cloudflare/workers-path polyfill. With nodejs_compat flag, import from "node:path".',
        autoFixable: true,
        documentationUrl: 'https://developers.cloudflare.com/workers/runtime-apis/nodejs/'
    },
    'node-builtin-os': {
        regex: /(?:require\(['"]os['"]\)|import\s+.*\s+from\s+['"]os['"])/g,
        severity: 'blocker',
        message: 'OS module is not supported in Cloudflare Workers',
        suggestion: 'Remove OS module usage. Workers run in a sandboxed environment without OS-level access.',
        autoFixable: false
    },
    'node-builtin-child-process': {
        regex: /(?:require\(['"]child_process['"]\)|import\s+.*\s+from\s+['"]child_process['"])/g,
        severity: 'blocker',
        message: 'Child process spawning is not supported in Cloudflare Workers',
        suggestion: 'Remove child process usage. Consider using Workers for Platforms or external services for process execution.',
        autoFixable: false
    },
    'node-builtin-requires-compat': {
        regex: /(?:require\(['"](?:node:)?(?:crypto|buffer|events|util|assert|stream|http|https|url|querystring)['"]\)|import\s+.*\s+from\s+['"](?:node:)?(?:crypto|buffer|events|util|assert|stream|http|https|url|querystring)['"])/g,
        severity: 'medium',
        message: 'Node.js built-in requires nodejs_compat flag',
        suggestion: 'Add "nodejs_compat" to compatibility_flags in wrangler.jsonc and ensure imports use "node:" prefix (e.g., "node:crypto").',
        autoFixable: true,
        documentationUrl: 'https://developers.cloudflare.com/workers/runtime-apis/nodejs/'
    },
    'process-cwd': {
        regex: /process\.cwd\(\)/g,
        severity: 'high',
        message: 'process.cwd() is not supported in Workers',
        suggestion: 'Replace with static configuration or environment variables. Workers have no concept of current working directory.',
        autoFixable: true
    },
    'dirname-filename': {
        regex: /(?:__dirname|__filename)/g,
        severity: 'high',
        message: '__dirname and __filename are not available in Workers',
        suggestion: 'Use static paths or import.meta.url. Example: new URL("./file.json", import.meta.url)',
        autoFixable: true
    },
    'vercel-edge': {
        regex: /@vercel\/edge/g,
        severity: 'high',
        message: 'Vercel Edge specific imports detected',
        suggestion: 'Replace @vercel/edge imports with Cloudflare Workers equivalents. Migrate vercel.json to wrangler.jsonc.',
        autoFixable: false,
        documentationUrl: 'https://developers.cloudflare.com/workers/static-assets/migration-guides/vercel-to-workers/'
    },
    'netlify-functions': {
        regex: /(?:netlify\/functions|@netlify\/functions)/g,
        severity: 'high',
        message: 'Netlify Functions detected',
        suggestion: 'Migrate Netlify Functions to Cloudflare Workers. Convert netlify.toml to wrangler.jsonc.',
        autoFixable: false,
        documentationUrl: 'https://developers.cloudflare.com/workers/static-assets/migration-guides/netlify-to-workers/'
    },
    'express-server': {
        regex: /(?:app\.listen\(|server\.listen\(|createServer\()/g,
        severity: 'blocker',
        message: 'Express/HTTP server listening code detected',
        suggestion: 'Remove server listening code. Cloudflare Workers handle requests automatically. Consider migrating to Hono framework.',
        autoFixable: false
    },
    'database-postgres': {
        regex: /(?:import\s+.*\s+from\s+['"]pg['"]|import\s+.*\s+from\s+['"]postgres['"]|new\s+Pool\(|new\s+Client\()/g,
        severity: 'high',
        message: 'PostgreSQL client detected',
        suggestion: 'Migrate to Cloudflare D1 (SQLite) or use Hyperdrive for PostgreSQL connections. Update connection strings to environment bindings.',
        autoFixable: false,
        documentationUrl: 'https://developers.cloudflare.com/d1/'
    },
    'database-mysql': {
        regex: /(?:import\s+.*\s+from\s+['"]mysql2['"]|createConnection\()/g,
        severity: 'high',
        message: 'MySQL client detected',
        suggestion: 'Migrate to Cloudflare D1 (SQLite). Convert MySQL schema to SQLite syntax.',
        autoFixable: false,
        documentationUrl: 'https://developers.cloudflare.com/d1/'
    },
    'database-mongodb': {
        regex: /(?:import\s+.*\s+from\s+['"]mongodb['"]|mongoose\.|MongoClient)/g,
        severity: 'high',
        message: 'MongoDB client detected',
        suggestion: 'Migrate to Cloudflare Durable Objects for document storage or convert to D1 relational schema.',
        autoFixable: false,
        documentationUrl: 'https://developers.cloudflare.com/durable-objects/'
    },
    's3-storage': {
        regex: /(?:@aws-sdk\/client-s3|aws-sdk|S3Client|s3\.upload\(|s3\.getObject\()/g,
        severity: 'high',
        message: 'AWS S3 storage detected',
        suggestion: 'Migrate to Cloudflare R2. Replace S3 SDK calls with R2 API (env.MY_BUCKET.get/put).',
        autoFixable: false,
        documentationUrl: 'https://developers.cloudflare.com/r2/'
    },
    'redis-session': {
        regex: /(?:redis\.createClient|connect-redis|express-session|MemoryStore)/g,
        severity: 'high',
        message: 'Redis or session storage detected',
        suggestion: 'Migrate sessions to Cloudflare KV for simple storage or Durable Objects for stateful sessions.',
        autoFixable: false,
        documentationUrl: 'https://developers.cloudflare.com/kv/'
    },
    'incompatible-package': {
        regex: /(?:["'](?:bcrypt|sharp|jimp|canvas|puppeteer|playwright)["'])/g,
        severity: 'blocker',
        message: 'Incompatible NPM package detected',
        suggestion: 'Replace with Workers-compatible alternatives: bcrypt→bcryptjs, sharp→Cloudflare Images API.',
        autoFixable: true
    },
    'requires-nodejs-compat': {
        regex: /(?:["'](?:jsonwebtoken|passport|body-parser|got|knex)["'])/g,
        severity: 'medium',
        message: 'Package requires nodejs_compat flag',
        suggestion: 'Add "nodejs_compat" to compatibility_flags in wrangler.jsonc.',
        autoFixable: true
    },
    'process-env': {
        regex: /process\.env\./g,
        severity: 'medium',
        message: 'process.env usage detected',
        suggestion: 'Use environment bindings from wrangler.jsonc. Access via env parameter in fetch handler. With nodejs_compat and compatibility_date >= 2025-04-01, process.env is supported.',
        autoFixable: false,
        documentationUrl: 'https://developers.cloudflare.com/workers/configuration/environment-variables/'
    },
    'import-meta-env': {
        regex: /import\.meta\.env\.VITE_/g,
        severity: 'low',
        message: 'Vite environment variables detected',
        suggestion: 'Ensure client-side environment variables use VITE_ prefix. Server-side variables should use wrangler bindings.',
        autoFixable: false
    },
    'dynamic-import': {
        regex: /import\([^)]*\$\{[^}]*\}[^)]*\)/g,
        severity: 'medium',
        message: 'Dynamic imports with variables detected',
        suggestion: 'Configure wrangler.jsonc with rules for dynamic imports. Add find_additional_modules: true and glob patterns.',
        autoFixable: true,
        documentationUrl: 'https://developers.cloudflare.com/workers/wrangler/bundling/'
    },
    'bcrypt-native': {
        regex: /(?:import\s+.*\s+from\s+['"]bcrypt['"]|require\(['"]bcrypt['"]\))/g,
        severity: 'blocker',
        message: 'Native bcrypt detected (has C++ bindings)',
        suggestion: 'Replace "bcrypt" with "bcryptjs" (pure JavaScript implementation).',
        autoFixable: true
    },
    'browser-api': {
        regex: /(?:XMLHttpRequest|document\.|window\.|localStorage|sessionStorage)/g,
        severity: 'high',
        message: 'Browser-specific API detected in server code',
        suggestion: 'Move browser APIs to client-side code only. Use fetch() instead of XMLHttpRequest in Workers.',
        autoFixable: false
    },
    'middleware-express': {
        regex: /(?:app\.use\(|express\.Router|helmet\(|compression\()/g,
        severity: 'medium',
        message: 'Express middleware detected',
        suggestion: 'Migrate to Hono framework for Workers. Replace Express middleware with Hono equivalents.',
        autoFixable: false,
        documentationUrl: 'https://hono.dev/docs/getting-started/cloudflare-workers'
    },
    'oauth-redirect': {
        regex: /(?:OAuth2Strategy|GoogleStrategy|GitHubStrategy|redirect_uri)/g,
        severity: 'medium',
        message: 'OAuth configuration detected',
        suggestion: 'Update OAuth redirect URIs to match your Workers domain (e.g., https://your-worker.workers.dev/auth/callback).',
        autoFixable: false
    }
};

/**
 * Incompatible packages that must be replaced
 */
export const INCOMPATIBLE_PACKAGES: Record<string, { reason: string; alternative: string }> = {
    'bcrypt': {
        reason: 'Native C++ bindings not supported in Workers',
        alternative: 'bcryptjs'
    },
    'sharp': {
        reason: 'Native image processing library',
        alternative: 'Cloudflare Images API or @cf/image-resizing'
    },
    'jimp': {
        reason: 'Heavy image processing library',
        alternative: 'Cloudflare Images API'
    },
    'canvas': {
        reason: 'Native canvas bindings',
        alternative: 'Use client-side canvas or Cloudflare Images'
    },
    'puppeteer': {
        reason: 'Headless browser not supported',
        alternative: 'Cloudflare Browser Rendering API (Enterprise)'
    },
    'playwright': {
        reason: 'Headless browser not supported',
        alternative: 'Cloudflare Browser Rendering API (Enterprise)'
    },
    'node-fetch': {
        reason: 'Redundant - Workers have native fetch()',
        alternative: 'Native fetch() API'
    },
    'isomorphic-fetch': {
        reason: 'Redundant - Workers have native fetch()',
        alternative: 'Native fetch() API'
    },
    'axios': {
        reason: 'Larger than native fetch, unnecessary',
        alternative: 'Native fetch() API'
    }
};

/**
 * Packages that work with nodejs_compat flag
 */
export const NODEJS_COMPAT_PACKAGES = [
    'jsonwebtoken',
    'jose',
    'passport',
    'cookie-parser',
    'body-parser',
    'got',
    'knex',
    'mailparser',
    'csv-stringify',
    'cookie-signature',
    'stream-slice'
];

/**
 * Recommended package replacements
 */
export const RECOMMENDED_REPLACEMENTS: Record<string, string> = {
    'express': 'hono',
    'dotenv': 'wrangler environment bindings',
    'multer': 'native FormData API',
    'jsonwebtoken': '@tsndr/cloudflare-worker-jwt',
    'cors': 'hono/cors middleware',
    'helmet': 'manual security headers'
};

/**
 * Platform detection patterns
 */
export const PLATFORM_PATTERNS = {
    vercel: [
        /vercel\.json/,
        /\.vercel\//,
        /@vercel\//,
        /VERCEL_URL/,
        /getServerSideProps/,
        /getStaticProps/
    ],
    netlify: [
        /netlify\.toml/,
        /netlify\/functions\//,
        /_redirects/,
        /_headers/,
        /@netlify\/functions/
    ],
    traditional: [
        /app\.listen\(/,
        /server\.listen\(/,
        /createServer\(/,
        /express\(/
    ]
};

/**
 * Analyze codebase for Cloudflare Workers compatibility
 */
export class CloudflareCompatibilityChecker {
    private issues: CompatibilityIssue[] = [];
    private fileContents: Map<string, string>;
    private packageJson: Record<string, unknown> | null = null;

    constructor(fileContents: Map<string, string>) {
        this.fileContents = fileContents;

        // Parse package.json if available
        const pkgContent = fileContents.get('package.json');
        if (pkgContent) {
            try {
                this.packageJson = JSON.parse(pkgContent);
            } catch {
                // Invalid package.json
            }
        }
    }

    /**
     * Run full compatibility analysis
     */
    public async analyze(): Promise<MigrationAnalysisResult> {
        this.issues = [];

        // Scan all source files
        for (const [filePath, content] of this.fileContents.entries()) {
            if (this.shouldScanFile(filePath)) {
                this.scanFile(filePath, content);
            }
        }

        // Analyze dependencies
        const dependencyAnalysis = this.analyzeDependencies();

        // Determine platform
        const platform = this.detectPlatform();

        // Calculate required configuration
        const requiredConfig = this.calculateRequiredConfig();

        // Calculate complexity and readiness
        const blockers = this.issues.filter(i => i.severity === 'blocker');
        const migrationComplexity = this.calculateComplexity();
        const estimatedEffort = this.estimateEffort(migrationComplexity);
        const readyForMigration = blockers.length === 0;

        return {
            platform,
            issues: this.issues,
            blockers,
            requiredConfig,
            dependencies: dependencyAnalysis,
            estimatedEffort,
            migrationComplexity,
            readyForMigration
        };
    }

    /**
     * Determine if file should be scanned
     */
    private shouldScanFile(filePath: string): boolean {
        const extensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
        const excludePatterns = [
            /node_modules\//,
            /\.git\//,
            /dist\//,
            /build\//,
            /\.next\//,
            /\.vercel\//
        ];

        return (
            extensions.some(ext => filePath.endsWith(ext)) &&
            !excludePatterns.some(pattern => pattern.test(filePath))
        );
    }

    /**
     * Scan individual file for compatibility issues
     */
    private scanFile(filePath: string, content: string): void {
        // Lines available for future line-specific analysis
        // const lines = content.split('\n');

        for (const [issueType, pattern] of Object.entries(DETECTION_PATTERNS)) {
            const { regex, severity, message, suggestion, autoFixable, documentationUrl } = pattern;

            let match: RegExpExecArray | null;
            while ((match = regex.exec(content)) !== null) {
                const lineNumber = content.substring(0, match.index).split('\n').length;

                this.issues.push({
                    type: issueType as IssueType,
                    severity,
                    file: filePath,
                    line: lineNumber,
                    pattern: regex.source,
                    match: match[0],
                    message,
                    suggestion,
                    autoFixable,
                    documentationUrl
                });
            }
        }
    }

    /**
     * Analyze package dependencies
     */
    private analyzeDependencies(): DependencyAnalysis {
        const incompatible: DependencyAnalysis['incompatible'] = [];
        const requiresNodejsCompat: string[] = [];
        const recommended: DependencyAnalysis['recommended'] = [];

        if (!this.packageJson) {
            return { incompatible, requiresNodejsCompat, recommended };
        }

        const allDeps = {
            ...(this.packageJson.dependencies as Record<string, string> || {}),
            ...(this.packageJson.devDependencies as Record<string, string> || {})
        };

        for (const [pkg, _version] of Object.entries(allDeps)) {
            // Check incompatible packages
            if (INCOMPATIBLE_PACKAGES[pkg]) {
                const { reason, alternative } = INCOMPATIBLE_PACKAGES[pkg];
                incompatible.push({ name: pkg, reason, alternative });
            }

            // Check packages requiring nodejs_compat
            if (NODEJS_COMPAT_PACKAGES.includes(pkg)) {
                requiresNodejsCompat.push(pkg);
            }

            // Check recommended replacements
            if (RECOMMENDED_REPLACEMENTS[pkg]) {
                recommended.push({
                    current: pkg,
                    recommended: RECOMMENDED_REPLACEMENTS[pkg],
                    reason: `Workers-optimized alternative available`
                });
            }
        }

        return { incompatible, requiresNodejsCompat, recommended };
    }

    /**
     * Detect source platform
     */
    private detectPlatform(): MigrationAnalysisResult['platform'] {
        const filePaths = Array.from(this.fileContents.keys());
        const allContent = Array.from(this.fileContents.values()).join('\n');

        // Check Vercel patterns
        if (PLATFORM_PATTERNS.vercel.some(pattern =>
            filePaths.some(path => pattern.test(path)) || pattern.test(allContent)
        )) {
            return 'vercel';
        }

        // Check Netlify patterns
        if (PLATFORM_PATTERNS.netlify.some(pattern =>
            filePaths.some(path => pattern.test(path)) || pattern.test(allContent)
        )) {
            return 'netlify';
        }

        // Check traditional hosting patterns
        if (PLATFORM_PATTERNS.traditional.some(pattern => pattern.test(allContent))) {
            return 'traditional';
        }

        return 'unknown';
    }

    /**
     * Calculate required Cloudflare configuration
     */
    private calculateRequiredConfig(): RequiredConfiguration {
        const needsNodejsCompat = this.issues.some(
            i => i.type === 'node-builtin-requires-compat' || i.type === 'requires-nodejs-compat'
        );
        const needsDynamicImports = this.issues.some(i => i.type === 'dynamic-import');
        const needsHyperdrive = this.issues.some(i => i.type === 'database-postgres');
        const needsR2 = this.issues.some(i => i.type === 'node-builtin-fs' || i.type === 's3-storage');
        const needsKV = this.issues.some(i => i.type === 'redis-session');
        const needsDurableObjects = this.issues.some(i => i.type === 'database-mongodb');

        const wranglerConfig: Partial<WranglerConfig> = {};

        if (needsNodejsCompat) {
            wranglerConfig.compatibility_flags = ['nodejs_compat'];
            wranglerConfig.compatibility_date = '2025-09-15';
        }

        if (needsDynamicImports) {
            wranglerConfig.rules = [{
                type: 'ESModule',
                globs: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
                fallthrough: true
            }];
            wranglerConfig.find_additional_modules = true;
        }

        return {
            needsNodejsCompat,
            needsDynamicImports,
            needsHyperdrive,
            needsR2,
            needsKV,
            needsDurableObjects,
            wranglerConfig
        };
    }

    /**
     * Calculate migration complexity (0-100)
     */
    private calculateComplexity(): number {
        let complexity = 0;

        // Weight by severity
        this.issues.forEach(issue => {
            switch (issue.severity) {
                case 'blocker':
                    complexity += 20;
                    break;
                case 'high':
                    complexity += 10;
                    break;
                case 'medium':
                    complexity += 5;
                    break;
                case 'low':
                    complexity += 1;
                    break;
            }
        });

        return Math.min(100, complexity);
    }

    /**
     * Estimate migration effort
     */
    private estimateEffort(complexity: number): 'low' | 'medium' | 'high' {
        if (complexity < 20) return 'low';
        if (complexity < 50) return 'medium';
        return 'high';
    }
}

/**
 * Generate automatic fixes for compatible issues
 */
export class AutomaticFixer {
    public static generateFixes(issues: CompatibilityIssue[]): Map<string, string> {
        const fixes = new Map<string, string>();

        for (const issue of issues.filter(i => i.autoFixable)) {
            const filePath = issue.file;

            // Get or initialize file fixes
            if (!fixes.has(filePath)) {
                fixes.set(filePath, '');
            }

            // Generate fix based on issue type
            switch (issue.type) {
                case 'bcrypt-native':
                    // Replace bcrypt with bcryptjs in imports
                    fixes.set(filePath, this.replaceBcrypt(issue.match));
                    break;

                case 'process-cwd':
                    // Replace process.cwd() with empty string or config
                    fixes.set(filePath, this.replaceProcessCwd(issue.match));
                    break;

                case 'dirname-filename':
                    // Replace __dirname/__filename with import.meta.url
                    fixes.set(filePath, this.replaceDirnameFilename(issue.match));
                    break;

                default:
                    // Generic replacement if autoFix is defined
                    if (issue.autoFix?.replacement) {
                        fixes.set(filePath, issue.match.replace(issue.match, issue.autoFix.replacement));
                    }
            }
        }

        return fixes;
    }

    private static replaceBcrypt(match: string): string {
        return match.replace(/['"]bcrypt['"]/g, '"bcryptjs"');
    }

    private static replaceProcessCwd(_match: string): string {
        return '""'; // Replace with empty string, user should configure
    }

    private static replaceDirnameFilename(match: string): string {
        if (match === '__dirname') {
            return 'new URL(".", import.meta.url).pathname';
        }
        if (match === '__filename') {
            return 'new URL(import.meta.url).pathname';
        }
        return match;
    }
}
