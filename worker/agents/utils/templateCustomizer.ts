import { modify, applyEdits } from 'jsonc-parser';

export interface TemplateCustomizationOptions {
    projectName: string;
    commandsHistory: string[];
}

export interface CustomizedTemplateFiles {
    'package.json': string;
    'wrangler.jsonc'?: string;
    'vite.config.ts'?: string;
    '.bootstrap.js': string;
    '.gitignore': string;
}

/**
 * Customize all template configuration files
 * - Updates package.json with project name and prepare script
 * - Updates wrangler.jsonc with project name (if exists)
 * - Updates vite.config.ts to read PORT environment variable (if exists)
 * - Generates .bootstrap.js script
 * - Updates .gitignore to exclude bootstrap marker
 */
export function customizeTemplateFiles(
    templateFiles: Record<string, string>,
    options: TemplateCustomizationOptions
): Partial<CustomizedTemplateFiles> {
    const customized: Partial<CustomizedTemplateFiles> = {};
    
    // 1. Customize package.json
    if (templateFiles['package.json']) {
        customized['package.json'] = customizePackageJson(
            templateFiles['package.json'],
            options.projectName
        );
    }
    
    // 2. Customize wrangler.jsonc
    if (templateFiles['wrangler.jsonc']) {
        customized['wrangler.jsonc'] = customizeWranglerJsonc(
            templateFiles['wrangler.jsonc'],
            options.projectName
        );
    }

    // 3. Customize vite.config.ts to support PORT environment variable
    if (templateFiles['vite.config.ts']) {
        customized['vite.config.ts'] = customizeViteConfig(
            templateFiles['vite.config.ts']
        );
    }

    // 4. Generate bootstrap script
    customized['.bootstrap.js'] = generateBootstrapScript(
        options.projectName,
        options.commandsHistory
    );

    // 5. Update .gitignore
    customized['.gitignore'] = updateGitignore(
        templateFiles['.gitignore'] || ''
    );
    
    return customized;
}

/**
 * Update package.json with project name and prepare script
 */
export function customizePackageJson(content: string, projectName: string): string {
    const pkg = JSON.parse(content);
    pkg.name = projectName;
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.prepare = 'bun .bootstrap.js || true';
    return JSON.stringify(pkg, null, 2);
}

/**
 * Update wrangler.jsonc with project name (preserves comments)
 */
function customizeWranglerJsonc(content: string, projectName: string): string {
    const edits = modify(content, ['name'], projectName, {
        formattingOptions: {
            tabSize: 2,
            insertSpaces: true,
            eol: '\n'
        }
    });
    return applyEdits(content, edits);
}

/**
 * Customize vite.config.ts to properly read PORT environment variable
 * and configure server to listen on all interfaces for container networking
 *
 * CRITICAL: Uses import.meta.env.PORT (Vite/Workers-compatible) instead of process.env.PORT (Node.js-only)
 * This prevents crashes in Cloudflare Workers/Sandbox environments
 */
function customizeViteConfig(content: string): string {
    // Check if server configuration already exists
    const hasServerConfig = /server\s*:\s*{/.test(content);

    if (hasServerConfig) {
        // Check if port configuration exists
        const hasPortConfig = /port\s*:/.test(content);

        if (!hasPortConfig) {
            // Add port configuration to existing server block
            // Use parseInt with fallback for type safety (import.meta.env values are strings)
            content = content.replace(
                /(server\s*:\s*{)/,
                `$1\n\t\tport: parseInt(import.meta.env.PORT as string || '5173', 10),\n\t\thost: '0.0.0.0',`
            );
        } else {
            // Replace existing port configuration
            content = content.replace(
                /port\s*:\s*[^,\n}]+/,
                `port: parseInt(import.meta.env.PORT as string || '5173', 10)`
            );
            // Add host if missing
            if (!/host\s*:/.test(content)) {
                content = content.replace(
                    /(server\s*:\s*{)/,
                    `$1\n\t\thost: '0.0.0.0',`
                );
            }
        }
    } else {
        // Add entire server configuration block before plugins if exists, or before export closing
        if (/plugins\s*:\s*\[/.test(content)) {
            content = content.replace(
                /(plugins\s*:\s*\[)/,
                `server: {\n\t\tport: parseInt(import.meta.env.PORT as string || '5173', 10),\n\t\thost: '0.0.0.0',\n\t\tallowedHosts: true,\n\t},\n\n\t$1`
            );
        } else {
            // Add before closing brace of defineConfig
            content = content.replace(
                /(\n\}\);?\s*$)/,
                `\n\tserver: {\n\t\tport: parseInt(import.meta.env.PORT as string || '5173', 10),\n\t\thost: '0.0.0.0',\n\t\tallowedHosts: true,\n\t},$1`
            );
        }
    }

    return content;
}

/**
 * Generate bootstrap script with proper command escaping
 */
export function generateBootstrapScript(projectName: string, commands: string[]): string {
    // Escape strings for safe embedding in JavaScript
    const safeProjectName = JSON.stringify(projectName);
    const safeCommands = JSON.stringify(commands, null, 4);
    
    return `#!/usr/bin/env bun
/**
 * Auto-generated bootstrap script
 * Runs once after git clone to setup project correctly
 * This file will self-delete after successful execution
 */

const fs = require('fs');
const { execSync } = require('child_process');

const PROJECT_NAME = ${safeProjectName};
const BOOTSTRAP_MARKER = '.bootstrap-complete';

// Check if already bootstrapped
if (fs.existsSync(BOOTSTRAP_MARKER)) {
    console.log('✓ Bootstrap already completed');
    process.exit(0);
}

console.log('🚀 Running first-time project setup...\\n');

try {
    // Update package.json
    updatePackageJson();
    
    // Update wrangler.jsonc if exists
    updateWranglerJsonc();
    
    // Run setup commands
    runSetupCommands();
    
    // Mark as complete
    fs.writeFileSync(BOOTSTRAP_MARKER, new Date().toISOString());
    
    // Self-delete
    fs.unlinkSync(__filename);
    
    console.log('\\n✅ Bootstrap complete! Project ready.');
} catch (error) {
    console.error('❌ Bootstrap failed:', error.message);
    console.log('You may need to manually update package.json and wrangler.jsonc');
    process.exit(1);
}

function updatePackageJson() {
    try {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.name = PROJECT_NAME;
        
        // Remove prepare script after bootstrap
        if (pkg.scripts && pkg.scripts.prepare) {
            delete pkg.scripts.prepare;
        }
        
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
        console.log('✓ Updated package.json with project name: ' + PROJECT_NAME);
    } catch (error) {
        console.error('Failed to update package.json:', error.message);
        throw error;
    }
}

function updateWranglerJsonc() {
    if (!fs.existsSync('wrangler.jsonc')) {
        console.log('⊘ wrangler.jsonc not found, skipping');
        return;
    }
    
    try {
        let content = fs.readFileSync('wrangler.jsonc', 'utf8');
        content = content.replace(/"name"\\s*:\\s*"[^"]*"/, \`"name": "\${PROJECT_NAME}"\`);
        fs.writeFileSync('wrangler.jsonc', content);
        console.log('✓ Updated wrangler.jsonc with project name: ' + PROJECT_NAME);
    } catch (error) {
        console.warn('⚠️  Failed to update wrangler.jsonc:', error.message);
    }
}

function runSetupCommands() {
    const commands = ${safeCommands};
    
    if (commands.length === 0) {
        console.log('⊘ No setup commands to run');
        return;
    }
    
    console.log('\\n📦 Running setup commands...\\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const cmd of commands) {
        console.log(\`▸ \${cmd}\`);
        try {
            execSync(cmd, { 
                stdio: 'inherit',
                cwd: process.cwd()
            });
            successCount++;
        } catch (error) {
            failCount++;
            console.warn(\`⚠️  Command failed: \${cmd}\`);
            console.warn(\`   Error: \${error.message}\`);
        }
    }
    
    console.log(\`\\n✓ Commands completed: \${successCount} successful, \${failCount} failed\\n\`);
}
`;
}

/**
 * Update .gitignore to exclude bootstrap marker
 */
function updateGitignore(content: string): string {
    if (content.includes('.bootstrap-complete')) {
        return content;
    }
    return content + '\n# Bootstrap marker\n.bootstrap-complete\n';
}

/**
 * Generate project name from blueprint or query
 */
export function generateProjectName(
    projectName: string,
    uniqueSuffix: string,
    maxPrefixLength: number = 20
): string {
    let prefix = projectName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
    
    prefix = prefix.slice(0, maxPrefixLength);
    return `${prefix}-${uniqueSuffix}`.toLowerCase();
}
