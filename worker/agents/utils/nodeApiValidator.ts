/**
 * Node.js API Validator
 *
 * Scans generated code for Node.js-specific APIs that will crash in Cloudflare Workers/Sandbox environments.
 * This prevents deployment of incompatible code before it reaches runtime.
 */

export interface NodeApiViolation {
    filePath: string;
    lineNumber: number;
    column: number;
    api: string;
    message: string;
    suggestion: string;
}

export interface NodeApiValidationResult {
    valid: boolean;
    violations: NodeApiViolation[];
    summary: string;
}

/**
 * Forbidden Node.js patterns and their replacements
 */
const FORBIDDEN_PATTERNS: Array<{
    pattern: RegExp;
    api: string;
    message: string;
    suggestion: string;
}> = [
    {
        pattern: /process\.env\.(\w+)/g,
        api: 'process.env',
        message: 'Node.js process.env is not available in Workers/Browser environment',
        suggestion: 'Use import.meta.env.VITE_$1 instead (prefix with VITE_ for Vite to expose it)',
    },
    {
        pattern: /__dirname/g,
        api: '__dirname',
        message: 'Node.js __dirname global is not available in Workers/Browser environment',
        suggestion: 'Use relative imports like ./path/to/file or import.meta.url',
    },
    {
        pattern: /__filename/g,
        api: '__filename',
        message: 'Node.js __filename global is not available in Workers/Browser environment',
        suggestion: 'Use import.meta.url instead',
    },
    {
        pattern: /\brequire\s*\(/g,
        api: 'require()',
        message: 'CommonJS require() is not supported in ES modules',
        suggestion: 'Use ES6 imports: import module from "module"',
    },
    {
        pattern: /path\.resolve\s*\(/g,
        api: 'path.resolve',
        message: 'Node.js path module is not available in Workers/Browser environment',
        suggestion: 'Use string concatenation or relative paths',
    },
    {
        pattern: /path\.join\s*\(/g,
        api: 'path.join',
        message: 'Node.js path module is not available in Workers/Browser environment',
        suggestion: 'Use string template literals or URL APIs',
    },
    {
        pattern: /fs\.(readFileSync|writeFileSync|readFile|writeFile|existsSync|mkdirSync)/g,
        api: 'fs module',
        message: 'Node.js fs (filesystem) module is not available in Workers/Browser environment',
        suggestion: 'Use fetch() for reading remote files or import for static assets',
    },
    {
        pattern: /child_process\.(exec|execSync|spawn|fork)/g,
        api: 'child_process',
        message: 'Node.js child_process module is not available in Workers/Browser environment',
        suggestion: 'Remove subprocess execution - not supported in serverless',
    },
    {
        pattern: /os\.(platform|cpus|hostname|tmpdir)/g,
        api: 'os module',
        message: 'Node.js os module is not available in Workers/Browser environment',
        suggestion: 'Remove OS-level APIs - not available in serverless',
    },
    {
        pattern: /\bBuffer\.(from|alloc|concat)/g,
        api: 'Buffer',
        message: 'Node.js Buffer may not work consistently in Workers/Browser',
        suggestion: 'Use Uint8Array or Web Crypto API instead',
    },
];

/**
 * Files that should be excluded from validation (external dependencies, etc.)
 */
const EXCLUDED_PATHS = [
    /node_modules/,
    /\.min\.(js|ts)$/,
    /dist\//,
    /build\//,
];

/**
 * Validate a single file for Node.js API usage
 */
export function validateFile(filePath: string, content: string): NodeApiViolation[] {
    // Skip excluded files
    if (EXCLUDED_PATHS.some(pattern => pattern.test(filePath))) {
        return [];
    }

    // Skip non-JS/TS files
    if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(filePath)) {
        return [];
    }

    const violations: NodeApiViolation[] = [];
    const lines = content.split('\n');

    for (const { pattern, api, message, suggestion } of FORBIDDEN_PATTERNS) {
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            let match: RegExpExecArray | null;

            // Reset lastIndex for global regex
            pattern.lastIndex = 0;

            while ((match = pattern.exec(line)) !== null) {
                violations.push({
                    filePath,
                    lineNumber: lineIndex + 1,
                    column: match.index + 1,
                    api,
                    message,
                    suggestion: suggestion.replace(/\$1/g, match[1] || ''),
                });
            }
        }
    }

    return violations;
}

/**
 * Validate multiple files for Node.js API usage
 */
export function validateFiles(files: Record<string, string>): NodeApiValidationResult {
    const allViolations: NodeApiViolation[] = [];

    for (const [filePath, content] of Object.entries(files)) {
        const fileViolations = validateFile(filePath, content);
        allViolations.push(...fileViolations);
    }

    const valid = allViolations.length === 0;
    const summary = valid
        ? 'No Node.js API violations detected'
        : `Found ${allViolations.length} Node.js API violation(s) in ${new Set(allViolations.map(v => v.filePath)).size} file(s)`;

    return {
        valid,
        violations: allViolations,
        summary,
    };
}

/**
 * Format violations as human-readable error messages
 */
export function formatViolations(violations: NodeApiViolation[]): string {
    if (violations.length === 0) {
        return 'No Node.js API violations detected.';
    }

    const byFile = violations.reduce((acc, violation) => {
        if (!acc[violation.filePath]) {
            acc[violation.filePath] = [];
        }
        acc[violation.filePath].push(violation);
        return acc;
    }, {} as Record<string, NodeApiViolation[]>);

    const output: string[] = [];
    output.push(`🚨 Found ${violations.length} Node.js API violation(s) - These will crash in Workers/Sandbox:\n`);

    for (const [filePath, fileViolations] of Object.entries(byFile)) {
        output.push(`\n${filePath}:`);
        for (const violation of fileViolations) {
            output.push(`  Line ${violation.lineNumber}:${violation.column} - ${violation.api}`);
            output.push(`    ❌ ${violation.message}`);
            output.push(`    ✅ ${violation.suggestion}`);
        }
    }

    return output.join('\n');
}
