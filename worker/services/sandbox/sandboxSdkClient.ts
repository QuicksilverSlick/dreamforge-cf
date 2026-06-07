import { getSandbox, Sandbox, ExecResult, parseSSEStream, LogEvent } from '@cloudflare/sandbox';

import {
    TemplateDetailsResponse,
    BootstrapResponse,
    GetInstanceResponse,
    BootstrapStatusResponse,
    ShutdownResponse,
    WriteFilesRequest,
    WriteFilesResponse,
    GetFilesResponse,
    ExecuteCommandsResponse,
    RuntimeErrorResponse,
    ClearErrorsResponse,
    StaticAnalysisResponse,
    DeploymentResult,
    FileTreeNode,
    RuntimeError,
    CommandExecutionResult,
    CodeIssue,
    InstanceDetails,
    LintSeverity,
    TemplateInfo,
    TemplateDetails,
    GitHubPushRequest, GitHubPushResponse,
    GetLogsResponse,
    ListInstancesResponse,
    StoredError,
} from './sandboxTypes';

import { createObjectLogger } from '../../logger';
import { env } from 'cloudflare:workers'
import { BaseSandboxService } from './BaseSandboxService';

import { 
    buildDeploymentConfig, 
    parseWranglerConfig, 
    deployToDispatch, 
} from '../deployer/deploy';
import { 
    createAssetManifest 
} from '../deployer/utils/index';
import { CodeFixResult, FileFetcher, fixProjectIssues } from '../code-fixer';
import { FileObject } from '../code-fixer/types';
import { generateId } from '../../utils/idGenerator';
import { ResourceProvisioner } from './resourceProvisioner';
import { TemplateParser } from './templateParser';
import { ResourceProvisioningResult } from './types';
import { GitHubService } from '../github/GitHubService';
import { getPreviewDomain } from '../../utils/urls';
import { isDev } from 'worker/utils/envs';
import { FileOutputType } from 'worker/agents/schemas';
// Export the Sandbox class in your Worker
export { Sandbox as UserAppSandboxService, Sandbox as DeployerService} from "@cloudflare/sandbox";


interface InstanceMetadata {
    templateName: string;
    projectName: string;
    startTime: string;
    webhookUrl?: string;
    previewURL?: string;
    tunnelURL?: string;
    processId?: string;
    allocatedPort?: number;
    donttouch_files: string[];
    redacted_files: string[];
}

type SandboxType = Sandbox;

/**
 * A session-bound view of the sandbox API. Derived from the SDK's
 * `createSession` return type so it tracks the pinned `@cloudflare/sandbox`
 * version without importing an internal type.
 */
type ExecutionSession = Awaited<ReturnType<Sandbox['createSession']>>;

/**
 * Streaming event for enhanced command execution
 */
export interface StreamEvent {
    type: 'stdout' | 'stderr' | 'exit' | 'error';
    data?: string;
    code?: number;
    error?: string;
    timestamp: Date;
}

export enum AllocationStrategy {
    MANY_TO_ONE = 'many_to_one',
    ONE_TO_ONE = 'one_to_one',
}
  
function getAutoAllocatedSandbox(sessionId: string): string {
    // Distribute sessions across available containers using consistent hashing
    // Convert session ID to hash for deterministic assignment
    let hash = 0;
    for (let i = 0; i < sessionId.length; i++) {
      const char = sessionId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    hash = Math.abs(hash);

    const max_instances = env.MAX_SANDBOX_INSTANCES ? Number(env.MAX_SANDBOX_INSTANCES) : 10;
    const containerIndex = hash % max_instances;
    const containerId = `container-pool-${containerIndex}`;
    
    console.log(`Session mapped to container`, { sessionId, containerId, hash, containerIndex });
    return containerId;
}

export class SandboxSdkClient extends BaseSandboxService {
    private sandbox: SandboxType;
    private metadataCache = new Map<string, InstanceMetadata>();
    /**
     * Per-instance `ExecutionSession` cache. Keyed by session id — the
     * instance id for the main per-instance session, {@link DEFAULT_SESSION_ID}
     * for container-global ops, and `${instanceId}-dev` / `${instanceId}-tunnel`
     * for long-lived processes. Explicit sessions replace the SDK's implicit
     * default session, which dies ~75s after creation in `@cloudflare/sandbox`
     * 0.5.6 ("shell has died") — the root cause of the long-standing
     * preview-serving breakage.
     */
    private sessionCache = new Map<string, ExecutionSession>();

    private static readonly DEFAULT_SESSION_ID = 'sandbox-default';

    constructor(sandboxId: string, agentId: string) {
        if (env.ALLOCATION_STRATEGY === AllocationStrategy.MANY_TO_ONE) {
            sandboxId = getAutoAllocatedSandbox(sandboxId);
        }
        super(sandboxId);
        this.sandbox = this.getSandbox();
        
        this.logger = createObjectLogger(this, 'SandboxSdkClient');
        this.logger.setFields({
            sandboxId: this.sandboxId,
            agentId,
        });
        this.logger.info('SandboxSdkClient initialized', { sandboxId: this.sandboxId });
    }

    async initialize(): Promise<void> {
        // Establish the default session up front, then verify the sandbox
        // responds. Session creation must happen here (async) rather than in
        // the constructor.
        await this.getDefaultSession();
        const echoResult = await this.safeSandboxExec('echo "Hello World"');
        if (echoResult.exitCode !== 0) {
            throw new Error(`Failed to run echo command: ${echoResult.stderr}`);
        }
        this.logger.info('Sandbox initialization complete')
    }

    private getWranglerKVKey(instanceId: string): string {
        return `wrangler-${instanceId}`;
    }

    private getSandbox(): SandboxType {
        if (!this.sandbox) {
            this.sandbox = getSandbox(env.Sandbox, this.sandboxId);
        }
        return this.sandbox;
    }

    /**
     * Create a session with the given id + cwd, falling back to retrieving an
     * existing one (a sibling request sharing the same container pool may have
     * already created it) and self-correcting its working directory.
     */
    private async getOrCreateSession(sessionId: string, cwd: string): Promise<ExecutionSession> {
        try {
            this.logger.info('Creating new sandbox session', { sessionId, cwd });
            return await this.getSandbox().createSession({ id: sessionId, cwd });
        } catch (error) {
            this.logger.info('Sandbox session already exists, retrieving it', {
                sessionId,
                cwd,
                error: error instanceof Error ? error.message : String(error),
            });
            const existingSession = await this.getSandbox().getSession(sessionId);

            const pwdResult = await existingSession.exec('pwd');
            const actualCwd = pwdResult.stdout.trim();
            if (actualCwd !== cwd) {
                this.logger.warn('Existing session has wrong cwd, changing directory', {
                    sessionId,
                    expectedCwd: cwd,
                    actualCwd,
                });
                await existingSession.exec(`cd ${cwd}`);
                const verifyResult = await existingSession.exec('pwd');
                if (verifyResult.stdout.trim() !== cwd) {
                    this.logger.error(`Failed to set working directory to ${cwd}, currently at ${verifyResult.stdout.trim()}`);
                } else {
                    this.logger.info('Changed directory for existing session', { sessionId, cwd });
                }
            }
            return existingSession;
        }
    }

    /**
     * Get (or lazily create) the cached session for an instance. The main
     * per-instance session runs in `/workspace/${instanceId}`; the default
     * session runs in `/workspace`. Callers needing a different cwd (dev /
     * tunnel process sessions) must pass it explicitly.
     */
    private async getInstanceSession(instanceId: string, cwd?: string): Promise<ExecutionSession> {
        const cached = this.sessionCache.get(instanceId);
        if (cached) {
            return cached;
        }
        const resolvedCwd = instanceId === SandboxSdkClient.DEFAULT_SESSION_ID
            ? '/workspace'
            : cwd ?? `/workspace/${instanceId}`;
        const session = await this.getOrCreateSession(instanceId, resolvedCwd);
        this.sessionCache.set(instanceId, session);
        return session;
    }

    /** The container-global session for template / pre-instance operations. */
    private async getDefaultSession(): Promise<ExecutionSession> {
        return this.getInstanceSession(SandboxSdkClient.DEFAULT_SESSION_ID, '/workspace');
    }

    private invalidateSessionCache(instanceId: string): void {
        if (this.sessionCache.delete(instanceId)) {
            this.logger.debug('Session cache invalidated', { instanceId });
        }
    }

    /** Direct exec against the container-global default session. */
    private async safeSandboxExec(command: string, timeout?: number): Promise<ExecResult> {
        const session = await this.getDefaultSession();
        return await session.exec(command, { timeout });
    }

    /** Write a binary file to the sandbox using small base64 chunks to avoid large control messages. */
    private async writeBinaryFileViaBase64(targetPath: string, data: ArrayBuffer, bytesPerChunk: number = 16 * 1024): Promise<void> {
        const dir = targetPath.includes('/') ? targetPath.slice(0, targetPath.lastIndexOf('/')) : '.';
        // Ensure directory and clean target file
        await this.safeSandboxExec(`mkdir -p '${dir}'`);
        await this.safeSandboxExec(`rm -f '${targetPath}'`);

        const buffer = new Uint8Array(data);
        for (let i = 0; i < buffer.length; i += bytesPerChunk) {
            const chunk = buffer.subarray(i, Math.min(i + bytesPerChunk, buffer.length));
            const base64Chunk = btoa(String.fromCharCode(...chunk));
            // Append decoded bytes into the target file inside the sandbox
            const appendResult = await this.safeSandboxExec(`printf '%s' '${base64Chunk}' | base64 -d >> '${targetPath}'`);
            if (appendResult.exitCode !== 0) {
                throw new Error(`Failed to append to ${targetPath}: ${appendResult.stderr}`);
            }
        }
    }

    private getInstanceMetadataFile(instanceId: string): string {
        return `${instanceId}-metadata.json`;
    }

    private async executeCommand(instanceId: string, command: string, timeout?: number): Promise<ExecResult> {
        // The instance session's cwd is `/workspace/${instanceId}`, so the
        // command runs in the instance directory without a `cd` prefix.
        const session = await this.getInstanceSession(instanceId);
        return await session.exec(command, { timeout });
    }

    private async getInstanceMetadata(instanceId: string): Promise<InstanceMetadata> {
        // Check cache first
        if (this.metadataCache.has(instanceId)) {
            return this.metadataCache.get(instanceId)!;
        }
        
        // Cache miss - read from disk
        try {
            const session = await this.getDefaultSession();
            const metadataFile = await session.readFile(this.getInstanceMetadataFile(instanceId));
            if (!metadataFile.success) {
                throw new Error('Failed to read instance metadata file');
            }
            const metadata = JSON.parse(metadataFile.content) as InstanceMetadata;
            this.metadataCache.set(instanceId, metadata); // Cache it
            return metadata;
        } catch (error) {
            this.logger.error(`Failed to read instance metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw new Error(`Failed to read instance metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private async storeInstanceMetadata(instanceId: string, metadata: InstanceMetadata): Promise<void> {
        const session = await this.getDefaultSession();
        await session.writeFile(this.getInstanceMetadataFile(instanceId), JSON.stringify(metadata));
        this.metadataCache.set(instanceId, metadata); // Update cache
    }

    private invalidateMetadataCache(instanceId: string): void {
        this.metadataCache.delete(instanceId);
    }

    private async allocateAvailablePort(excludedPorts: number[] = [3000]): Promise<number> {
        const startTime = Date.now();
        const excludeList = excludedPorts.join(' ');
        
        // Single command to find first available port in dev range (8001-8999).
        // Uses `break` (not `exit`) — this runs in the persistent session shell,
        // and a top-level `exit` would terminate the session itself, killing every
        // subsequent command on it. Matches upstream.
        const findPortCmd = `
            for port in $(seq 8001 8999); do
                if ! echo "${excludeList}" | grep -q "\\\\b$port\\\\b" &&
                   ! netstat -tuln 2>/dev/null | grep -q ":$port " &&
                   ! ss -tuln 2>/dev/null | grep -q ":$port "; then
                    echo $port
                    break
                fi
            done
        `;
        
        const result = await this.safeSandboxExec(findPortCmd.trim());
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        this.logger.info(`Port allocation took ${duration} seconds`);
        if (result.exitCode === 0 && result.stdout.trim()) {
            const port = parseInt(result.stdout.trim());
            this.logger.info(`Allocated available port: ${port}`);
            return port;
        }
        
        throw new Error('No available ports found in range 8001-8999');
    }

    private async checkTemplateExists(templateName: string): Promise<boolean> {
        // Single command to check if template directory and package.json both exist
        const checkResult = await this.safeSandboxExec(`test -f ${templateName}/package.json && echo "exists" || echo "missing"`);
        return checkResult.exitCode === 0 && checkResult.stdout.trim() === "exists";
    }

    async downloadTemplate(templateName: string, downloadDir?: string) : Promise<ArrayBuffer> {
        // Fetch the zip file from R2
        const downloadUrl = downloadDir ? `${downloadDir}/${templateName}.zip` : `${templateName}.zip`;
        this.logger.info(`Fetching object: ${downloadUrl} from R2 bucket`);
        const r2Object = await env.TEMPLATES_BUCKET.get(downloadUrl);
          
        if (!r2Object) {
            throw new Error(`Object '${downloadUrl}' not found in bucket`);
        }
    
        const zipData = await r2Object.arrayBuffer();
    
        this.logger.info(`Downloaded zip file (${zipData.byteLength} bytes)`);
        return zipData;
    }

    private async ensureTemplateExists(templateName: string, downloadDir?: string, isInstance: boolean = false) {
        if (!await this.checkTemplateExists(templateName)) {
            // Download and extract template
            this.logger.info(`Template doesnt exist, Downloading template from: ${templateName}`);
            
            const zipData = await this.downloadTemplate(templateName, downloadDir);
            // Stream zip to sandbox in safe base64 chunks and write directly as binary
            await this.writeBinaryFileViaBase64(`${templateName}.zip`, zipData);
            this.logger.info(`Wrote zip file to sandbox in chunks: ${templateName}.zip`);
            
            const setupResult = await this.safeSandboxExec(`unzip -o -q ${templateName}.zip -d ${isInstance ? '.' : templateName}`);
        
            if (setupResult.exitCode !== 0) {
                throw new Error(`Failed to download/extract template: ${setupResult.stderr}`);
            }
        } else {
            this.logger.info(`Template already exists`);
        }
    }

    async getTemplateDetails(templateName: string): Promise<TemplateDetailsResponse> {
        try {
            this.logger.info('Retrieving template details', { templateName });
            
            await this.ensureTemplateExists(templateName);

            this.logger.info('Template setup complete');

            const [fileTree, catalogInfo, dontTouchFiles, redactedFiles] = await Promise.all([
                this.buildFileTree(templateName),
                this.getTemplateFromCatalog(templateName),
                this.fetchDontTouchFiles(templateName),
                this.fetchRedactedFiles(templateName)
            ]);
            
            if (!fileTree) {
                throw new Error(`Failed to build file tree for template ${templateName}`);
            }

            const filesResponse = await this.getFiles(templateName, undefined, true, redactedFiles);    // Use template name as directory

            this.logger.info('Template files retrieved');

            // Parse package.json for dependencies
            let dependencies: Record<string, string> = {};
            try {
                const packageJsonFile = filesResponse.files.find(file => file.filePath === 'package.json');
                if (!packageJsonFile) {
                    throw new Error('package.json not found');
                }
                const packageJson = JSON.parse(packageJsonFile.fileContents) as {
                    dependencies?: Record<string, string>;
                    devDependencies?: Record<string, string>;
                };
                dependencies = { 
                    ...packageJson.dependencies || {}, 
                    ...packageJson.devDependencies || {}
                };
            } catch {
                this.logger.info('No package.json found', { templateName });
            }
            // Materialize the upstream-shape mirrors `importantFiles` +
            // `allFiles` at construction time. `allFiles` is a path → contents
            // Record built from `files`; `importantFiles` is the catalog's
            // declared list of priority files, falling back to the empty list
            // when the catalog does not specify any. Both are read by the
            // ported `worker/services/sandbox/utils.ts` and
            // `worker/agents/utils/templates.ts` helpers added in M3 commit 2b.1.
            const allFiles: Record<string, string> = {};
            for (const file of filesResponse.files) {
                allFiles[file.filePath] = file.fileContents;
            }
            // `catalogInfo` does not currently carry an `importantFiles` field
            // in the fork's catalog schema. M3 commit 2b will widen the catalog
            // to surface this; until then we populate with an empty array so
            // downstream consumers (e.g. ported helpers added later in M3)
            // see a defined-but-empty list rather than `undefined`.
            const importantFiles: string[] = [];

            const templateDetails: TemplateDetails = {
                name: templateName,
                description: {
                    selection: catalogInfo?.description.selection || '',
                    usage: catalogInfo?.description.usage || ''
                },
                fileTree,
                files: filesResponse.files,
                language: catalogInfo?.language,
                deps: dependencies,
                projectType: catalogInfo?.projectType,
                renderMode: catalogInfo?.renderMode,
                disabled: catalogInfo?.disabled,
                dontTouchFiles,
                redactedFiles,
                frameworks: catalogInfo?.frameworks || [],
                slideDirectory: catalogInfo?.slideDirectory,
                importantFiles,
                allFiles,
            };
            
            this.logger.info('Template files retrieved', { templateName, fileCount: filesResponse.files.length });

            return {
                success: true,
                templateDetails
            };
        } catch (error) {
            this.logger.error('getTemplateDetails', error, { templateName });
            return {
                success: false,
                error: `Failed to get template details: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    private async getTemplateFromCatalog(templateName: string): Promise<TemplateInfo | null> {
        try {
            const templatesResponse = await SandboxSdkClient.listTemplates();
            if (templatesResponse.success) {
                return templatesResponse.templates.find(t => t.name === templateName) || null;
            }
            return null;
        } catch {
            return null;
        }
    }

    private async buildFileTree(instanceId: string): Promise<FileTreeNode | undefined> {
        try {
            // Directories to exclude from file tree
            const EXCLUDED_DIRS = [
                ".github",
                "node_modules",
                ".git",
                "dist",
                ".wrangler",
                ".vscode",
                ".next",
                ".cache",
                ".idea",
                ".DS_Store"
            ];
            // Build exclusion string for find command
            const excludedDirsFind = EXCLUDED_DIRS.map(dir => `-name "${dir}"`).join(" -o ");
            // File type exclusions
            const excludedFileTypes = [
                "*.jpg",
                "*.jpeg",
                "*.png",
                "*.gif",
                "*.svg",
                "*.ico",
                "*.webp",
                "*.bmp"
            ];
            const excludedFilesFind = excludedFileTypes.map(ext => `-not -name "${ext}"`).join(" ");
            // Build the command dynamically
            const buildTreeCmd = `echo "===FILES==="; find . -type d \\( ${excludedDirsFind} \\) -prune -o \\( -type f ${excludedFilesFind} \\) -print; echo "===DIRS==="; find . -type d \\( ${excludedDirsFind} \\) -prune -o -type d -print`;

            const filesResult = await this.executeCommand(instanceId, buildTreeCmd);
            if (filesResult.exitCode === 0) {
                const output = filesResult.stdout.trim();
                const sections = output.split('===DIRS===');
                const fileSection = sections[0].replace('===FILES===', '').trim();
                const dirSection = sections[1] ? sections[1].trim() : '';
                
                const files = fileSection.split('\n').filter(line => line.trim() && line !== '.');
                const dirs = dirSection.split('\n').filter(line => line.trim() && line !== '.');
                
                // Create sets for quick lookup
                const fileSet = new Set(files.map(f => f.startsWith('./') ? f.substring(2) : f));
                // const dirSet = new Set(dirs.map(d => d.startsWith('./') ? d.substring(2) : d));
                
                // Combine all paths
                const allPaths = [...files, ...dirs].map(path => 
                    path.startsWith('./') ? path.substring(2) : path
                ).filter(path => path && path !== '.');
                
                // Build tree with proper file/directory detection
                const root: FileTreeNode = {
                    path: '',
                    type: 'directory',
                    children: []
                };

                allPaths.forEach(filePath => {
                    const parts = filePath.split('/').filter(part => part);
                    let current = root;

                    parts.forEach((_, index) => {
                        const path = parts.slice(0, index + 1).join('/');
                        const isFile = fileSet.has(path);
                        
                        let child = current.children?.find(c => c.path === path);
                        
                        if (!child) {
                            child = {
                                path,
                                type: isFile ? 'file' : 'directory',
                                children: isFile ? undefined : []
                            };
                            current.children = current.children || [];
                            current.children.push(child);
                        }
                        
                        if (!isFile) {
                            current = child;
                        }
                    });
                });

                return root;
            }
        } catch (error) {
            this.logger.warn('Failed to build file tree', error);
        }
        return undefined;
    }

    // ==========================================
    // INSTANCE LIFECYCLE
    // ==========================================

    async listAllInstances(): Promise<ListInstancesResponse> {
        try {
            this.logger.info('Retrieving instance metadata');

            // Use a single command to find metadata files only in current directory (not nested)
            const bulkResult = await this.safeSandboxExec(`find . -maxdepth 1 -name "*-metadata.json" -type f -exec sh -c 'echo "===FILE:$1==="; cat "$1"' _ {} \\;`);
            
            if (bulkResult.exitCode !== 0) {
                return {
                    success: true,
                    instances: [],
                    count: 0
                };
            }
            
            const instances: InstanceDetails[] = [];
            
            // Parse the combined output
            const sections = bulkResult.stdout.split('===FILE:').filter(section => section.trim());
            
            for (const section of sections) {
                try {
                    const lines = section.trim().split('\n');
                    if (lines.length < 2) continue;
                    
                    // First line contains the file path, remaining lines contain the JSON
                    const filePath = lines[0].replace('===', '');
                    const jsonContent = lines.slice(1).join('\n');
                    
                    // Extract instance ID from filename (remove ./ prefix and -metadata.json suffix)
                    const instanceId = filePath.replace('./', '').replace('-metadata.json', '');
                    
                    // Parse metadata
                    const metadata = JSON.parse(jsonContent) as InstanceMetadata;
                    
                    // Update cache with the metadata we just read
                    this.metadataCache.set(instanceId, metadata);
                    
                    // Create lightweight instance details from metadata
                    const instanceDetails: InstanceDetails = {
                        runId: instanceId,
                        templateName: metadata.templateName,
                        startTime: new Date(metadata.startTime),
                        uptime: Math.floor((Date.now() - new Date(metadata.startTime).getTime()) / 1000),
                        directory: instanceId,
                        serviceDirectory: instanceId,
                        previewURL: metadata.previewURL,
                        processId: metadata.processId,
                        tunnelURL: metadata.tunnelURL,
                        // Skip file tree
                        fileTree: undefined,
                        runtimeErrors: undefined
                    };
                    
                    instances.push(instanceDetails);
                } catch (error) {
                    this.logger.warn(`Failed to process metadata section`, error);
                }
            }
            
            this.logger.info('Instance list retrieved', { instanceCount: instances.length });
            
            return {
                success: true,
                instances,
                count: instances.length
            };
        } catch (error) {
            this.logger.error('listAllInstances', error);
            return {
                success: false,
                instances: [],
                count: 0,
                error: `Failed to list instances: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    /**
     * Waits for the development server to actually serve HTTP on the given port
     * by probing `http://localhost:<port>/` from inside the container until it
     * returns a 2xx/3xx response (Vite serves the SPA index once it is genuinely
     * accepting requests).
     *
     * This replaces the previous log-pattern heuristic, which reported "ready"
     * as soon as Vite printed its `Local: http://…` line — before the server
     * was reliably answering requests. That gap let `DEPLOYMENT_COMPLETED` (and
     * the preview URL) be emitted prematurely, so the preview iframe hammered
     * the URL with 404s for several seconds. A real HTTP probe closes that race.
     */
    private async waitForServerReady(instanceId: string, port: number, maxWaitTimeMs: number = 30000): Promise<boolean> {
        const startTime = Date.now();
        const pollIntervalMs = 500;
        const maxAttempts = Math.ceil(maxWaitTimeMs / pollIntervalMs);

        this.logger.info('Waiting for development server HTTP readiness', { instanceId, port, timeoutMs: maxWaitTimeMs });

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const probe = await this.executeCommand(
                    instanceId,
                    `curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://localhost:${port}/`,
                );
                const code = parseInt((probe.stdout ?? '').trim(), 10);
                // Any 2xx/3xx means Vite is live and serving. `000` (curl's
                // no-response sentinel) or a connection error means not up yet.
                if (Number.isFinite(code) && code >= 200 && code < 400) {
                    this.logger.info('Development server HTTP-ready', {
                        instanceId,
                        port,
                        httpCode: code,
                        elapsedTimeMs: Date.now() - startTime,
                        attempts: `${attempt}/${maxAttempts}`,
                    });
                    return true;
                }
            } catch (error) {
                this.logger.warn(`HTTP readiness probe error for ${instanceId} (attempt ${attempt})`, error);
            }

            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
            }
        }

        this.logger.warn('Development server HTTP readiness timeout', {
            instanceId,
            port,
            elapsedTimeMs: Date.now() - startTime,
            totalAttempts: maxAttempts,
        });
        return false;
    }

    private async startDevServer(instanceId: string, port: number): Promise<string> {
        try {
            // Use CLI tools for enhanced monitoring instead of direct process start.
            // The dev session's cwd is the instance directory, so no `cwd` option
            // is passed (it would otherwise double-nest under the session cwd).
            const devSession = await this.getOrCreateSession(`${instanceId}-dev`, `/workspace/${instanceId}`);
            const process = await devSession.startProcess(
                `VITE_LOGGER_TYPE=json monitor-cli process start --instance-id ${instanceId} --port ${port} -- bun run dev`,
            );
            this.logger.info('Development server started', { instanceId, processId: process.id });

            // Block until the dev server actually serves HTTP on the port, so
            // the caller only exposes/returns the preview URL once it is ready.
            // This is the readiness gate: it prevents DEPLOYMENT_COMPLETED from
            // being broadcast before the server answers requests (which caused
            // the preview 404-poll storm). On timeout we proceed best-effort —
            // the client's retry loop covers any residual lag — rather than
            // failing the whole deploy.
            try {
                const isReady = await this.waitForServerReady(instanceId, port, 30000);
                if (!isReady) {
                    this.logger.warn('Development server did not reach HTTP readiness within timeout; proceeding best-effort', { instanceId, port });
                }
            } catch (readinessError) {
                this.logger.warn(`Error during readiness check for ${instanceId}:`, readinessError);
                this.logger.info('Continuing with server startup despite readiness check error', { instanceId });
            }

            return process.id;
        } catch (error) {
            this.logger.warn('Failed to start dev server', error);
            throw error;
        }
    }

    /**
     * Provisions Cloudflare resources for template placeholders in wrangler.jsonc
     */
    private async provisionTemplateResources(instanceId: string, projectName: string): Promise<ResourceProvisioningResult> {
        try {
            const session = await this.getInstanceSession(instanceId);

            // Read wrangler.jsonc file
            const wranglerFile = await session.readFile(`/workspace/${instanceId}/wrangler.jsonc`);
            if (!wranglerFile.success) {
                this.logger.info(`No wrangler.jsonc found for ${instanceId}, skipping resource provisioning`);
                return {
                    success: true,
                    provisioned: [],
                    failed: [],
                    replacements: {},
                    wranglerUpdated: false
                };
            }

            // Parse and detect placeholders
            const templateParser = new TemplateParser(this.logger);
            const parseResult = templateParser.parseWranglerConfig(wranglerFile.content);

            if (!parseResult.hasPlaceholders) {
                this.logger.info('No placeholders found in wrangler configuration', { instanceId });
                return {
                    success: true,
                    provisioned: [],
                    failed: [],
                    replacements: {},
                    wranglerUpdated: false
                };
            }

            this.logger.info('Placeholders found for provisioning', { instanceId, count: parseResult.placeholders.length });

            // Initialize resource provisioner (skip if credentials are not available)
            let resourceProvisioner: ResourceProvisioner;
            try {
                resourceProvisioner = new ResourceProvisioner(this.logger);
            } catch (error) {
                this.logger.warn(`Cannot initialize resource provisioner: ${error instanceof Error ? error.message : 'Unknown error'}`);
                return {
                    success: true,
                    provisioned: [],
                    failed: parseResult.placeholders.map(p => ({
                        placeholder: p.placeholder,
                        resourceType: p.resourceType,
                        error: 'Missing Cloudflare credentials',
                        binding: p.binding
                    })),
                    replacements: {},
                    wranglerUpdated: false
                };
            }
            
            const provisioned: ResourceProvisioningResult['provisioned'] = [];
            const failed: ResourceProvisioningResult['failed'] = [];
            const replacements: Record<string, string> = {};

            // Provision each resource
            for (const placeholderInfo of parseResult.placeholders) {
                this.logger.info(`Provisioning ${placeholderInfo.resourceType} resource for placeholder ${placeholderInfo.placeholder}`);
                
                const provisionResult = await resourceProvisioner.provisionResource(
                    placeholderInfo.resourceType,
                    projectName
                );

                if (provisionResult.success && provisionResult.resourceId) {
                    provisioned.push({
                        placeholder: placeholderInfo.placeholder,
                        resourceType: placeholderInfo.resourceType,
                        resourceId: provisionResult.resourceId,
                        binding: placeholderInfo.binding
                    });
                    replacements[placeholderInfo.placeholder] = provisionResult.resourceId;
                } else {
                    failed.push({
                        placeholder: placeholderInfo.placeholder,
                        resourceType: placeholderInfo.resourceType,
                        error: provisionResult.error || 'Unknown error',
                        binding: placeholderInfo.binding
                    });
                    this.logger.warn(`Failed to provision ${placeholderInfo.resourceType} for ${placeholderInfo.placeholder}: ${provisionResult.error}`);
                }
            }

            // Update wrangler.jsonc if we have replacements
            let wranglerUpdated = false;
            if (Object.keys(replacements).length > 0) {
                const updatedContent = templateParser.replacePlaceholders(wranglerFile.content, replacements);
                const writeResult = await session.writeFile(`/workspace/${instanceId}/wrangler.jsonc`, updatedContent);
                
                if (writeResult.success) {
                    wranglerUpdated = true;
                    this.logger.info(`Updated wrangler.jsonc with ${Object.keys(replacements).length} resource IDs for ${instanceId}`);
                    this.logger.info(templateParser.createReplacementSummary(replacements));
                } else {
                    this.logger.error(`Failed to update wrangler.jsonc for ${instanceId}`);
                }
            }

            const result: ResourceProvisioningResult = {
                success: failed.length === 0,
                provisioned,
                failed,
                replacements,
                wranglerUpdated
            };

            if (failed.length > 0) {
                this.logger.warn(`Resource provisioning completed with ${failed.length} failures for ${instanceId}`);
            } else {
                this.logger.info(`Resource provisioning completed successfully for ${instanceId}`);
            }

            return result;
        } catch (error) {
            this.logger.error(`Exception during resource provisioning for ${instanceId}:`, error);
            return {
                success: false,
                provisioned: [],
                failed: [],
                replacements: {},
                wranglerUpdated: false
            };
        }
    }

    /*
    * Starts a cloudflared tunnel for the specified instance
    * Super usefulfor local development
    */
    private async startCloudflaredTunnel(instanceId: string, port: number): Promise<string> {
        try {
            const tunnelSession = await this.getOrCreateSession(`${instanceId}-tunnel`, `/workspace/${instanceId}`);
            const process = await tunnelSession.startProcess(
                `cloudflared tunnel --url http://localhost:${port}`,
            );
            this.logger.info(`Started cloudflared tunnel for ${instanceId}`);

            // Stream process logs to extract the preview URL (process management
            // is container-global, addressed via the bare sandbox stub).
            const logStream = await this.getSandbox().streamProcessLogs(process.id);
            
            return new Promise<string>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    // reject(new Error('Timeout waiting for cloudflared tunnel URL'));
                    this.logger.warn('Timeout waiting for cloudflared tunnel URL');
                    resolve('');
                }, 20000); // 20 second timeout

                const processLogs = async () => {
                    try {
                        for await (const event of parseSSEStream<LogEvent>(logStream)) {
                            if (event.data) {
                                const logLine = event.data;
                                this.logger.info(`Cloudflared log ===> ${logLine}`);
                                
                                // Look for the preview URL in the logs
                                // Format: https://subdomain.trycloudflare.com
                                const urlMatch = logLine.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
                                if (urlMatch) {
                                    clearTimeout(timeout);
                                    const previewURL = urlMatch[0];
                                    this.logger.info(`Found cloudflared tunnel URL: ${previewURL}`);
                                    resolve(previewURL);
                                    return;
                                }
                            }
                        }
                    } catch (error) {
                        this.logger.error('Cloudflare tunnel process failed', error);
                        clearTimeout(timeout);
                        reject(error);
                    }
                };

                processLogs();
            });
        } catch (error) {
            this.logger.warn('Failed to start cloudflared tunnel', error);
            throw error;
        }
    }

    /**
     * Updates project configuration files with the specified project name
     */
    private async updateProjectConfiguration(instanceId: string, projectName: string): Promise<void> {
        try {
            // Update package.json with new project name (top-level only). Runs
            // in the instance session (cwd = instance dir), so no `cd` prefix.
            this.logger.info(`Updating package.json with project name: ${projectName}`);
            const packageJsonResult = await this.executeCommand(instanceId, `sed -i '1,10s/^[ \t]*"name"[ ]*:[ ]*"[^"]*"/  "name": "${projectName}"/' package.json`);

            if (packageJsonResult.exitCode !== 0) {
                this.logger.warn('Failed to update package.json', packageJsonResult.stderr);
            }

            // Update wrangler.jsonc with new project name (top-level only)
            this.logger.info(`Updating wrangler.jsonc with project name: ${projectName}`);
            const wranglerResult = await this.executeCommand(instanceId, `sed -i '0,/"name":/s/"name"[ ]*:[ ]*"[^"]*"/"name": "${projectName}"/' wrangler.jsonc`);
               
            if (wranglerResult.exitCode !== 0) {
                this.logger.warn('Failed to update wrangler.jsonc', wranglerResult.stderr);
            }
            
            this.logger.info('Project configuration updated successfully');
        } catch (error) {
            this.logger.error(`Error updating project configuration: ${error}`);
            throw error;
        }
    }

    private async setLocalEnvVars(instanceId: string, localEnvVars: Record<string, string>): Promise<void> {
        try {
            const session = await this.getInstanceSession(instanceId);
            // Simply save all env vars in '.dev.vars' file
            const envVarsContent = Object.entries(localEnvVars)
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');
            await session.writeFile(`/workspace/${instanceId}/.dev.vars`, envVarsContent);
        } catch (error) {
            this.logger.error(`Error setting local environment variables: ${error}`);
            throw error;
        }
    }

    private async setupInstance(instanceId: string, projectName: string, localEnvVars?: Record<string, string>): Promise<{previewURL: string, tunnelURL: string, processId: string, allocatedPort: number} | undefined> {
        try {
            const sandbox = this.getSandbox();
            // Update project configuration with the specified project name
            await this.updateProjectConfiguration(instanceId, projectName);
            
            // Provision Cloudflare resources if template has placeholders
            const resourceProvisioningResult = await this.provisionTemplateResources(instanceId, projectName);
            if (!resourceProvisioningResult.success && resourceProvisioningResult.failed.length > 0) {
                this.logger.warn(`Some resources failed to provision for ${instanceId}, but continuing setup process`);
            }
            
            // Store wrangler.jsonc configuration in KV after resource provisioning
            try {
                const instanceSession = await this.getInstanceSession(instanceId);
                const wranglerConfigFile = await instanceSession.readFile(`/workspace/${instanceId}/wrangler.jsonc`);
                if (wranglerConfigFile.success) {
                    await env.VibecoderStore.put(this.getWranglerKVKey(instanceId), wranglerConfigFile.content);
                    this.logger.info('Wrangler configuration stored in KV', { instanceId });
                } else {
                    this.logger.warn('Could not read wrangler.jsonc for KV storage', { instanceId });
                }
            } catch (error) {
                this.logger.warn('Failed to store wrangler config in KV', { instanceId, error: error instanceof Error ? error.message : 'Unknown error' });
                // Non-blocking - continue with setup
            }
            
            // Allocate single port for both dev server and tunnel
            const allocatedPort = await this.allocateAvailablePort();

            // If on local development, start cloudflared tunnel
            let tunnelUrlPromise = Promise.resolve('');
            if (isDev(env) || env.USE_TUNNEL_FOR_PREVIEW) {
                this.logger.info('Starting cloudflared tunnel for local development', { instanceId });
                tunnelUrlPromise = this.startCloudflaredTunnel(instanceId, allocatedPort);
            }

            this.logger.info('Installing dependencies', { instanceId });
            const [installResult, tunnelURL] = await Promise.all([
                this.executeCommand(instanceId, `bun install`, 40000),
                tunnelUrlPromise
            ]);
            this.logger.info('Dependencies installed', { instanceId, tunnelURL });
                
            if (installResult.exitCode === 0) {
                // Try to start development server in background
                try {
                    if (localEnvVars) {
                        await this.setLocalEnvVars(instanceId, localEnvVars);
                    }
                    // Initialize git repository
                    await this.executeCommand(instanceId, `git init`);
                    this.logger.info('Git repository initialized', { instanceId });
                    // Start dev server on allocated port
                    const processId = await this.startDevServer(instanceId, allocatedPort);
                    this.logger.info('Instance created successfully', { instanceId, processId, port: allocatedPort });
                        
                    // Expose the same port for preview URL
                    const previewResult = await sandbox.exposePort(allocatedPort, { hostname: getPreviewDomain(env) });
                    let previewURL = previewResult.url;
                    if (!isDev(env)) {
                        const previewDomain = getPreviewDomain(env);
                        if (previewDomain) {
                            // Replace CUSTOM_DOMAIN with previewDomain in previewURL
                            previewURL = previewURL.replace(env.CUSTOM_DOMAIN, previewDomain);
                        }
                    }

                    if(env.USE_TUNNEL_FOR_PREVIEW) {
                        this.logger.info('Using tunnel url instead for preview as configured', { instanceId, tunnelURL });
                        previewURL = tunnelURL;
                    }
                        
                    this.logger.info('Preview URL exposed', { instanceId, previewURL });
                        
                    return { previewURL, tunnelURL, processId, allocatedPort };
                } catch (error) {
                    this.logger.warn('Failed to start dev server', error);
                    return undefined;
                }
            } else {
                this.logger.warn('Failed to install dependencies', installResult.stderr);
            }
        } catch (error) {
            this.logger.warn('Failed to setup instance', error);
        }
        
        return undefined;
    }

    private async fetchDontTouchFiles(templateName: string): Promise<string[]> {
        let donttouchFiles: string[] = [];
        try {
            // Read .donttouch_files.json
            const session = await this.getDefaultSession();
            const donttouchFile = await session.readFile(`/workspace/${templateName}/.donttouch_files.json`);
            if (donttouchFile.exitCode !== 0) {
                this.logger.warn(`Failed to read .donttouch_files.json: ${donttouchFile.content}`);
            }
            donttouchFiles = JSON.parse(donttouchFile.content) as string[];
        } catch (error) {
            this.logger.warn(`Failed to read .donttouch_files.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        return donttouchFiles;
    }

    private async fetchRedactedFiles(templateName: string): Promise<string[]> {
        let redactedFiles: string[] = [];
        try {
            // Read .redacted_files.json
            const session = await this.getDefaultSession();
            const redactedFile = await session.readFile(`/workspace/${templateName}/.redacted_files.json`);
            if (redactedFile.exitCode !== 0) {
                this.logger.warn(`Failed to read .redacted_files.json: ${redactedFile.content}`);
            }
            redactedFiles = JSON.parse(redactedFile.content) as string[];
        } catch (error) {
            this.logger.warn(`Failed to read .redacted_files.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        return redactedFiles;
    }

    async createInstance(templateName: string, projectName: string, webhookUrl?: string, localEnvVars?: Record<string, string>): Promise<BootstrapResponse> {
        try {
            const sandbox = this.getSandbox();
            // Set environment variables FIRST, before any other operations
            if (localEnvVars && Object.keys(localEnvVars).length > 0) {
                this.logger.info('Configuring environment variables', { envVars: Object.keys(localEnvVars) });
                await sandbox.setEnvVars(localEnvVars);
            }
            if (env.ALLOCATION_STRATEGY === 'one_to_one') {
                // Multiple instances shouldn't exist in the same sandbox

                // If there are already instances running in sandbox, log them
                const instancesResp = await this.listAllInstances();
                if (instancesResp.success && instancesResp.instances.length > 0) {
                    this.logger.error('There are already instances running in sandbox, creating a new instance may cause issues', { instances: instancesResp.instances });
                    // Try to see if this instance actually exists and if the process is active
                    const firstInstance = instancesResp.instances[0];
                    const instanceStatus = await this.getInstanceStatus(firstInstance.runId);
                    if (instanceStatus.success && instanceStatus.isHealthy) {
                        this.logger.error('Instance already exists and is active, creating a new instance may cause issues', { instance: firstInstance });
                        // Return instance information
                        return {
                            success: true,
                            runId: firstInstance.runId,
                            previewURL: instanceStatus.previewURL,
                            tunnelURL: instanceStatus.tunnelURL,
                            processId: instanceStatus.processId,
                            message: instanceStatus.message
                        };
                    } else {
                        this.logger.error('Instance already exists but is not active, Removing old instance', { instance: firstInstance });
                        await this.shutdownInstance(firstInstance.runId);
                    }
                }
            }
            
            const instanceId = `i-${generateId()}`;
            this.logger.info('Creating sandbox instance', { instanceId, templateName, projectName });
            
            await this.ensureTemplateExists(templateName);

            const [donttouchFiles, redactedFiles] = await Promise.all([
                this.fetchDontTouchFiles(templateName),
                this.fetchRedactedFiles(templateName)
            ]);

            const moveTemplateResult = await this.safeSandboxExec(`mv ${templateName} ${instanceId}`);
            if (moveTemplateResult.exitCode !== 0) {
                throw new Error(`Failed to move template: ${moveTemplateResult.stderr}`);
            }

            const setupPromise = () => this.setupInstance(instanceId, projectName, localEnvVars);
            const setupResult = await setupPromise();
            if (!setupResult) {
                return {
                    success: false,
                    error: 'Failed to setup instance'
                };
            }
            const results: {previewURL: string, tunnelURL: string, processId: string, allocatedPort: number} = setupResult;
            // Store instance metadata
            const metadata = {
                templateName: templateName,
                projectName: projectName,
                startTime: new Date().toISOString(),
                webhookUrl: webhookUrl,
                previewURL: results?.previewURL,
                processId: results?.processId,
                tunnelURL: results?.tunnelURL,
                allocatedPort: results?.allocatedPort,
                donttouch_files: donttouchFiles,
                redacted_files: redactedFiles,
            };
            await this.storeInstanceMetadata(instanceId, metadata);

            return {
                success: true,
                runId: instanceId,
                message: `Successfully created instance from template ${templateName}`,
                previewURL: results?.previewURL,
                tunnelURL: results?.tunnelURL,
                processId: results?.processId,
            };
        } catch (error) {
            this.logger.error('createInstance', error, { templateName: templateName, projectName: projectName });
            return {
                success: false,
                error: `Failed to create instance: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async getInstanceDetails(instanceId: string): Promise<GetInstanceResponse> {
        try {            
            // Get instance metadata
            const metadata = await this.getInstanceMetadata(instanceId);
            if (!metadata) {
                return {
                    success: false,
                    error: `Instance ${instanceId} not found or metadata corrupted`
                };
            }

            const startTime = new Date(metadata.startTime);
            const uptime = Math.floor((Date.now() - startTime.getTime()) / 1000);

            // Get runtime errors
            const [fileTree, runtimeErrors] = await Promise.all([
                this.buildFileTree(instanceId),
                this.getInstanceErrors(instanceId)
            ]);

            const instanceDetails: InstanceDetails = {
                runId: instanceId,
                templateName: metadata.templateName,
                startTime,
                uptime,
                directory: instanceId,
                serviceDirectory: instanceId,
                fileTree,
                runtimeErrors: runtimeErrors.errors,
                previewURL: metadata.previewURL,
                processId: metadata.processId,
                tunnelURL: metadata.tunnelURL,
            };

            return {
                success: true,
                instance: instanceDetails
            };
        } catch (error) {
            this.logger.error('getInstanceDetails', error, { instanceId });
            return { 
                success: false,
                error: `Failed to get instance details: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async getInstanceStatus(instanceId: string): Promise<BootstrapStatusResponse> {
        try {
            // Check if instance exists by checking metadata
            const metadata = await this.getInstanceMetadata(instanceId);
            if (!metadata) {
                return {
                    success: false,
                    pending: false,
                    isHealthy: false,
                    error: `Instance ${instanceId} not found`
                };
            }
            
            let isHealthy = true;
            try {
                // Optionally check if process is still running
                if (metadata.processId) {
                    for (let i = 0; i < 3; i++) {
                        try {
                            const processes = await this.getSandbox().listProcesses();
                            const process = processes.find((p: { id: string; status: string }) => p.id === metadata.processId);
                            isHealthy = !!(process && process.status === 'running');
                            break;
                        } catch (error) {
                            this.logger.error(`Failed to check process ${metadata.processId}, retrying...${i + 1}/3`, {error});
                            isHealthy = false; // Process not found or not running
                        }
                    }
                }
            } catch {
                // No preview available
                isHealthy = false;
            }

            // A serving instance always has an exposed preview URL. If it is
            // missing, the instance is not actually reachable (wedged container
            // / dead dev server even if a stale process lingers), so report it
            // unhealthy — callers reset and recreate instead of handing back a
            // dead preview the UI can never load.
            if (isHealthy && !metadata.previewURL) {
                this.logger.warn('Instance process is running but has no preview URL; treating as unhealthy', { instanceId });
                isHealthy = false;
            }

            return {
                success: true,
                pending: false,
                isHealthy,
                message: isHealthy ? 'Instance is running normally' : 'Instance may have issues',
                previewURL: metadata.previewURL,
                tunnelURL: metadata.tunnelURL,
                processId: metadata.processId
            };
        } catch (error) {
            this.logger.error('getInstanceStatus', error, { instanceId });
            return {
                success: false,
                pending: false,
                isHealthy: false,
                error: `Failed to get instance status: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async shutdownInstance(instanceId: string): Promise<ShutdownResponse> {
        try {
            // Check if instance exists 
            const metadata = await this.getInstanceMetadata(instanceId);
            if (!metadata) {
                return {
                    success: false,
                    error: `Instance ${instanceId} not found`
                };
            }

            this.logger.info(`Shutting down instance: ${instanceId}`);

            const sandbox = this.getSandbox();
            
            if (metadata.processId) {
                try {
                    await sandbox.killProcess(metadata.processId);
                } catch (error) {
                    this.logger.warn(`Failed to kill process ${metadata.processId}`, error);
                }
            }
            
            // Unexpose the allocated port if we know what it was
            if (metadata.allocatedPort) {
                try {
                    await sandbox.unexposePort(metadata.allocatedPort);
                    this.logger.info(`Unexposed port ${metadata.allocatedPort} for instance ${instanceId}`);
                } catch (error) {
                    this.logger.warn(`Failed to unexpose port ${metadata.allocatedPort}`, error);
                }
            }
            
            // Clean up files (instances live under /workspace, not /app)
            await this.safeSandboxExec(`rm -rf ${instanceId}`);

            // Invalidate session cache
            this.invalidateSessionCache(instanceId);

            // Invalidate metadata cache since instance is being shutdown
            this.invalidateMetadataCache(instanceId);

            return {
                success: true,
                message: `Successfully shutdown instance ${instanceId}`
            };
        } catch (error) {
            this.logger.error('shutdownInstance', error, { instanceId });
            return {
                success: false,
                error: `Failed to shutdown instance: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    // ==========================================
    // FILE OPERATIONS
    // ==========================================

    async writeFiles(instanceId: string, files: WriteFilesRequest['files'], commitMessage?: string): Promise<WriteFilesResponse> {
        try {
            const session = await this.getInstanceSession(instanceId);

            const results = [];

            // Filter out donttouch files
            const metadata = await this.getInstanceMetadata(instanceId);
            const donttouchFiles = new Set(metadata.donttouch_files);

            const filteredFiles = files.filter(file => !donttouchFiles.has(file.filePath));

            const writePromises = filteredFiles.map(file => session.writeFile(`/workspace/${instanceId}/${file.filePath}`, file.fileContents));
            
            const writeResults = await Promise.all(writePromises);
            
            for (const writeResult of writeResults) {
                if (writeResult.success) {
                    results.push({
                        file: writeResult.path,
                        success: true
                    });
                    
                    this.logger.info('File written', { filePath: writeResult.path });
                } else {
                    this.logger.error('File write failed', { filePath: writeResult.path });
                    results.push({
                        file: writeResult.path,
                        success: false,
                        error: 'Unknown error'
                    });
                }
            }

            // Add files that were not written to results
            const wereDontTouchFiles = files.filter(file => donttouchFiles.has(file.filePath));
            wereDontTouchFiles.forEach(file => {
                results.push({
                    file: file.filePath,
                    success: false,
                    error: 'File is forbidden to be modified'
                });
            });

            if (wereDontTouchFiles.length > 0) {
                this.logger.warn('Files were not written (protected by donttouch_files)', { files: wereDontTouchFiles.map(f => f.filePath) });
            }

            const successCount = results.filter(r => r.success).length;

            // If code files were modified, touch vite.config.ts to trigger a rebuild
            if (successCount > 0 && filteredFiles.some(file => file.filePath.endsWith('.ts') || file.filePath.endsWith('.tsx'))) {
                await this.executeCommand(instanceId, `touch vite.config.ts`);
            }

            // Try to commit
            try {
                const commitResult = await this.createLatestCommit(instanceId, commitMessage || 'Initial commit');
                this.logger.info('Files committed to git', { result: commitResult });
            } catch (error) {
                this.logger.error('Git commit failed', { error: error instanceof Error ? error.message : 'Unknown error' });
            }

            return {
                success: true,
                results,
                message: `Successfully wrote ${successCount}/${files.length} files`
            };
        } catch (error) {
            this.logger.error('writeFiles', error, { instanceId });
            return {
                success: false,
                results: files.map(f => ({ file: f.filePath, success: false, error: 'Instance error' })),
                error: `Failed to write files: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async getFiles(templateOrInstanceId: string, filePaths?: string[], applyFilter: boolean = true, redactedFiles?: string[]): Promise<GetFilesResponse> {
        try {
            const session = await this.getInstanceSession(templateOrInstanceId);

            if (!filePaths) {
                // Read '.important_files.json' in instance directory. The session
                // cwd is the instance/template dir, so no `cd` prefix is needed.
                const importantFiles = await session.exec(`jq -r '.[]' .important_files.json | while read -r path; do if [ -d "$path" ]; then find "$path" -type f; elif [ -f "$path" ]; then echo "$path"; fi; done`);
                this.logger.info(`Read important files: stdout: ${importantFiles.stdout}, stderr: ${importantFiles.stderr}`);
                filePaths = importantFiles.stdout.split('\n').filter(path => path);
                if (!filePaths) {
                    return {
                        success: false,
                        files: [],
                        error: 'Failed to read important files'
                    };
                }
                this.logger.info(`Successfully read important files: ${filePaths}`);
                applyFilter = true;
            }

            let redactedPaths: Set<string> = new Set();

            if (applyFilter) {
                if (redactedFiles) {
                    redactedPaths = new Set(redactedFiles);
                } else {
                    try {
                        const metadata = await this.getInstanceMetadata(templateOrInstanceId);
                        redactedPaths = new Set(metadata.redacted_files);
                    } catch (error) {
                        this.logger.warn('Failed to get redacted files', { templateOrInstanceId });
                    }
                }
            }

            const files = [];
            const errors = [];

            const readPromises = filePaths.map(async (filePath) => {
                try {
                    const result = await session.readFile(`/workspace/${templateOrInstanceId}/${filePath}`);
                    return {
                        result,
                        filePath
                    };
                } catch (error) {
                    return {
                        result: null,
                        filePath,
                        error
                    };
                }
            });
        
            const readResults = await Promise.allSettled(readPromises);
        
            for (const readResult of readResults) {
                if (readResult.status === 'fulfilled') {
                    const { result, filePath } = readResult.value;
                    if (result && result.success) {
                        files.push({
                            filePath: filePath,
                            fileContents: (applyFilter && redactedPaths.has(filePath)) ? '[REDACTED]' : result.content
                        });
                        
                        this.logger.info('File read successfully', { filePath });
                    } else {
                        this.logger.error('File read failed', { filePath });
                        errors.push({
                            file: filePath,
                            error: 'Failed to read file'
                        });
                    }
                } else {
                    this.logger.error(`Promise rejected for file read`);
                    errors.push({
                        file: 'unknown',
                        error: 'Promise rejected'
                    });
                }
            }

            return {
                success: true,
                files,
                errors: errors.length > 0 ? errors : undefined
            };
        } catch (error) {
            this.logger.error('getFiles', error, { templateOrInstanceId });
            return {
                success: false,
                files: [],
                error: `Failed to get files: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    // ==========================================
    // LOG RETRIEVAL
    // ==========================================
    async getLogs(instanceId: string, onlyRecent?: boolean): Promise<GetLogsResponse> {
        try {
            this.logger.info('Retrieving instance logs', { instanceId });
            // Use CLI to get all logs and reset the file
            const cmd = `timeout 10s monitor-cli logs get -i ${instanceId} --format raw ${onlyRecent ? '--reset' : ''}`;
            const result = await this.executeCommand(instanceId, cmd, 15000);
            return {
                success: true,
                logs: {
                    stdout: result.stdout,
                    stderr: result.stderr,
                },
                error: undefined
            };
        } catch (error) {
            this.logger.error('getLogs', error, { instanceId });
            return {
                success: false,
                logs: {
                    stdout: '',
                    stderr: '',
                },
                error: `Failed to get logs: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    // ==========================================
    // COMMAND EXECUTION
    // ==========================================

    async executeCommands(instanceId: string, commands: string[], timeout?: number): Promise<ExecuteCommandsResponse> {
        try {
            const results: CommandExecutionResult[] = [];
            
            for (const command of commands) {
                try {
                    const result = await this.executeCommand(instanceId, command, timeout);

                    results.push({
                        command,
                        success: result.exitCode === 0,
                        output: result.stdout,
                        error: result.stderr || undefined,
                        exitCode: result.exitCode
                    });
                    
                    if (result.exitCode !== 0) {
                        this.logger.error('Command execution failed', { command, error: result.stderr });
                    }
                    
                    this.logger.info('Command executed', { command, exitCode: result.exitCode, stdout: result.stdout, stderr: result.stderr });
                } catch (error) {
                    this.logger.error('Command execution failed with error', { command, error });
                    results.push({
                        command,
                        success: false,
                        output: '',
                        error: error instanceof Error ? error.message : 'Execution error'
                    });
                }
            }

            const successCount = results.filter(r => r.success).length;
            return {
                success: true,
                results,
                message: `Executed ${successCount}/${commands.length} commands successfully`
            };
        } catch (error) {
            this.logger.error('executeCommands', error, { instanceId });
            return {
                success: false,
                results: commands.map(cmd => ({
                    command: cmd,
                    success: false,
                    output: '',
                    error: 'Instance error' 
                })),
                error: `Failed to execute commands: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    // ==========================================
    // ERROR MANAGEMENT
    // ==========================================

    async getInstanceErrors(instanceId: string, clear?: boolean): Promise<RuntimeErrorResponse> {
        try {
            let errors: RuntimeError[] = [];
            const cmd = `timeout 3s monitor-cli errors list -i ${instanceId} --format json ${clear ? '--reset' : ''}`;
            const result = await this.executeCommand(instanceId, cmd, 15000);
            
            if (result.exitCode === 0) {
                let response: {success: boolean, errors: StoredError[]};
                try {
                    response = JSON.parse(result.stdout);
                    this.logger.info(`getInstanceErrors - ${response.errors.length ? 'errors found' : ''}: ${result.stdout}`);
                } catch (parseError) {
                    this.logger.warn('Failed to parse CLI output as JSON', { stdout: result.stdout });
                    throw new Error('Invalid JSON response from CLI tools');
                }
                if (response.success && response.errors) {
                    // Convert StoredError objects to RuntimeError format
                    errors = response.errors;

                    return {
                        success: true,
                        errors,
                        hasErrors: errors.length > 0
                    };
                }
            } 
            this.logger.error(`Failed to get errors for instance ${instanceId}: STDERR: ${result.stderr}, STDOUT: ${result.stdout}`);

            return {
                success: false,
                errors: [],
                hasErrors: false,
                error: `Failed to get errors for instance ${instanceId}: STDERR: ${result.stderr}, STDOUT: ${result.stdout}`
            };
        } catch (error) {
            this.logger.error('getInstanceErrors', error, { instanceId });
            return {
                success: false,
                errors: [],
                hasErrors: false,
                error: `Failed to get errors: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async clearInstanceErrors(instanceId: string): Promise<ClearErrorsResponse> {
        try {
            const clearedCount = 0;

            // Try enhanced error system first - clear ALL errors
            try {
                const cmd = `timeout 10s monitor-cli errors clear -i ${instanceId} --confirm`;
                const result = await this.executeCommand(instanceId, cmd, 15000); // 15 second timeout
                
                if (result.exitCode === 0) {
                    let response: any;
                    try {
                        response = JSON.parse(result.stdout);
                    } catch (parseError) {
                        this.logger.warn('Failed to parse CLI output as JSON', { stdout: result.stdout });
                        throw new Error('Invalid JSON response from CLI tools');
                    }
                    if (response.success) {
                        return {
                            success: true,
                            message: response.message || `Cleared ${response.clearedCount || 0} errors`
                        };
                    }
                }
            } catch (enhancedError) {
                this.logger.warn('Error clearing unavailable, falling back to legacy', enhancedError);
            }

            this.logger.info(`Cleared ${clearedCount} errors for instance ${instanceId}`);

            return {
                success: true,
                message: `Cleared ${clearedCount} errors`
            };
        } catch (error) {
            this.logger.error('clearInstanceErrors', error, { instanceId });
            return {
                success: false,
                error: `Failed to clear errors: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    // ==========================================
    // CODE ANALYSIS & FIXING
    // ==========================================

    async runStaticAnalysisCode(instanceId: string): Promise<StaticAnalysisResponse> {
        try {
            const lintIssues: CodeIssue[] = [];
            const typecheckIssues: CodeIssue[] = [];

            // Track whether each analyzer actually completed and produced a
            // trustworthy result. A command that rejected (e.g. exec failed on
            // a wedged instance) or that exited non-zero without yielding any
            // parseable diagnostics is INCONCLUSIVE — it must not be reported
            // as "clean", or compile-breaking code (e.g. a named/default
            // export mismatch, TS2614) sails through the deterministic fixer's
            // zero-issues early-return and ships to a "successful" preview.
            let typecheckConclusive = true;
            let lintConclusive = true;

            // Run ESLint and TypeScript check in parallel
            const [lintResult, tscResult] = await Promise.allSettled([
                this.executeCommand(instanceId, 'bun run lint'),
                this.executeCommand(instanceId, 'bunx tsc -b --incremental --noEmit --pretty false')
            ]);

            const results: StaticAnalysisResponse = {
                success: true,
                lint: {
                    issues: [],
                    summary: {
                        errorCount: 0,
                        warningCount: 0,
                        infoCount: 0
                    },
                    rawOutput: ''
                },
                typecheck: {
                    issues: [],
                    summary: {
                        errorCount: 0,
                        warningCount: 0,
                        infoCount: 0
                    },
                    rawOutput: ''
                }
            };
            
            // Process ESLint results
            if (lintResult.status === 'fulfilled') {
                try {
                    const lintData = JSON.parse(lintResult.value.stdout) as Array<{
                        filePath: string;
                        messages: Array<{
                            message: string;
                            line?: number;
                            column?: number;
                            severity: number;
                            ruleId?: string;
                        }>;
                    }>;
                    
                    for (const fileResult of lintData) {
                        for (const message of fileResult.messages || []) {
                            lintIssues.push({
                                message: message.message,
                                filePath: fileResult.filePath,
                                line: message.line || 0,
                                column: message.column,
                                severity: this.mapESLintSeverity(message.severity),
                                ruleId: message.ruleId,
                                source: 'eslint'
                            });
                        }
                    }
                } catch (error) {
                    this.logger.warn('Failed to parse ESLint output', error);
                    // Non-JSON output from `bun run lint` means ESLint did not
                    // produce a readable report (crash / config failure), not
                    // that the code is clean.
                    lintConclusive = false;
                }

                results.lint.issues = lintIssues;
                results.lint.summary = {
                    errorCount: lintIssues.filter(issue => issue.severity === 'error').length,
                    warningCount: lintIssues.filter(issue => issue.severity === 'warning').length,
                    infoCount: lintIssues.filter(issue => issue.severity === 'info').length
                };
                results.lint.rawOutput = `STDOUT: ${lintResult.value.stdout}\nSTDERR: ${lintResult.value.stderr}`;
            } else if (lintResult.status === 'rejected') {
                this.logger.warn('ESLint analysis failed', lintResult.reason);
                lintConclusive = false;
            }

            // Process TypeScript check results
            if (tscResult.status === 'fulfilled') {
                const tscExitCode = tscResult.value.exitCode;
                try {
                    // TypeScript errors can come from either stdout or stderr
                    const output = tscResult.value.stderr || tscResult.value.stdout;
                    
                    if (!output || output.trim() === '') {
                        this.logger.info('No TypeScript output to parse');
                    } else {
                        this.logger.info(`Parsing TypeScript output: ${output.substring(0, 200)}...`);
                        
                        // Split by lines and parse each error
                        const lines = output.split('\n');
                        let currentError: any = null;
                        
                        for (const line of lines) {
                            // Match TypeScript error format: path(line,col): error TSxxxx: message
                            const match = line.match(/^(.+?)\((\d+),(\d+)\): error TS(\d+): (.*)$/);
                            if (match) {
                                // If we have a previous error being built, add it
                                if (currentError) {
                                    typecheckIssues.push(currentError);
                                }
                                
                                // Start building new error
                                currentError = {
                                    message: match[5].trim(),
                                    filePath: match[1].trim(),
                                    line: parseInt(match[2]),
                                    column: parseInt(match[3]),
                                    severity: 'error' as const,
                                    source: 'typescript',
                                    ruleId: `TS${match[4]}`
                                };
                                
                                this.logger.info(`Found TypeScript error: ${currentError.filePath}:${currentError.line} - ${currentError.ruleId}`);
                            } else if (currentError && line.trim() && !line.startsWith('src/') && !line.includes(': error TS')) {
                                // This might be a continuation of the error message
                                currentError.message += ' ' + line.trim();
                            }
                        }
                        
                        // Add the last error if it exists
                        if (currentError) {
                            typecheckIssues.push(currentError);
                        }
                        
                        this.logger.info(`Parsed ${typecheckIssues.length} TypeScript errors`);
                    }
                } catch (error) {
                    this.logger.warn('Failed to parse TypeScript output', error);
                    typecheckConclusive = false;
                }

                // `tsc` exits non-zero whenever it finds errors. If it exited
                // non-zero but we extracted no structured diagnostics, the run
                // failed in a way we cannot read (build-config error such as
                // TS6306, a wedged instance, unexpected framing) — treat it as
                // inconclusive rather than clean.
                if (typeof tscExitCode === 'number' && tscExitCode !== 0 && typecheckIssues.length === 0) {
                    this.logger.warn(
                        `tsc exited ${tscExitCode} with no parseable diagnostics; treating typecheck as inconclusive`,
                    );
                    typecheckConclusive = false;
                }

                results.typecheck.issues = typecheckIssues;
                results.typecheck.summary = {
                    errorCount: typecheckIssues.filter(issue => issue.severity === 'error').length,
                    warningCount: typecheckIssues.filter(issue => issue.severity === 'warning').length,
                    infoCount: typecheckIssues.filter(issue => issue.severity === 'info').length
                };
                results.typecheck.rawOutput = `STDOUT: ${tscResult.value.stdout}\nSTDERR: ${tscResult.value.stderr}`;
            } else if (tscResult.status === 'rejected') {
                this.logger.warn('TypeScript analysis failed', tscResult.reason);
                typecheckConclusive = false;
            }

            this.logger.info(`Analysis completed: ${lintIssues.length} lint issues, ${typecheckIssues.length} typecheck issues`);

            // Surface an inconclusive run so callers can retry / self-heal
            // instead of mistaking "could not check" for "no issues".
            if (!typecheckConclusive || !lintConclusive) {
                const failedParts = [
                    typecheckConclusive ? null : 'typecheck',
                    lintConclusive ? null : 'lint',
                ].filter((part): part is string => part !== null);
                results.success = false;
                results.error = `Static analysis inconclusive: ${failedParts.join(' + ')} did not complete; not safe to treat as clean`;
            }

            return {
                ...results
            };
        } catch (error) {
            this.logger.error('runStaticAnalysisCode', error, { instanceId });
            return {
                success: false,
                lint: { issues: [] },
                typecheck: { issues: [] },
                error: `Failed to run analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    // Development utility method for fixing code issues
    async fixCodeIssues(instanceId: string, allFiles?: FileObject[]): Promise<CodeFixResult> {
        try {
            this.logger.info(`Fixing code issues for ${instanceId}`);
            const session = await this.getInstanceSession(instanceId);
            // First run static analysis
            const analysisResult = await this.runStaticAnalysisCode(instanceId);
            this.logger.info(`Static analysis completed for ${instanceId}`);
            // Then get all the files
            const files = allFiles || (await this.getFiles(instanceId)).files;
            this.logger.info(`Files retrieved for ${instanceId}`);
            
            // Create file fetcher callback
            const fileFetcher: FileFetcher = async (filePath: string) => {
                // Fetch a single file from the instance
                try {
                    const result = await session.readFile(`/workspace/${instanceId}/${filePath}`);
                    if (result.success) {
                        this.logger.info(`Successfully fetched file: ${filePath}`);
                        return {
                            filePath: filePath,
                            fileContents: result.content,
                            filePurpose: `Fetched file: ${filePath}`
                        };
                    } else {
                        this.logger.debug(`File not found: ${filePath}`);
                    }
                } catch (error) {
                    this.logger.debug(`Failed to fetch file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
                return null;
            };

            // Use the new functional API
            const fixResult = await fixProjectIssues(
                files.map(file => ({
                    filePath: file.filePath,
                    fileContents: file.fileContents,
                    filePurpose: ''
                })),
                analysisResult.typecheck.issues,
                fileFetcher
            );
            await Promise.all(
                fixResult.modifiedFiles.map((file: FileObject) =>
                    session.writeFile(`/workspace/${instanceId}/${file.filePath}`, file.fileContents),
                ),
            );
            this.logger.info(`Code fix completed for ${instanceId}`);
            return fixResult;
        } catch (error) {
            this.logger.error('fixCodeIssues', error, { instanceId });
            return {
                fixedIssues: [],
                unfixableIssues: [],
                modifiedFiles: []
            };
        }
    }

    private mapESLintSeverity(severity: number): LintSeverity {
        switch (severity) {
            case 1: return 'warning';
            case 2: return 'error';
            default: return 'info';
        }
    }

    // ==========================================
    // DEPLOYMENT
    // ==========================================
    async deployToCloudflareWorkers(instanceId: string): Promise<DeploymentResult> {
        try {
            this.logger.info('Starting deployment', { instanceId });
            
            // Get project metadata
            const metadata = await this.getInstanceMetadata(instanceId);
            const projectName = metadata?.projectName || instanceId;
            
            // Get credentials from environment (secure - no exposure to external processes)
            const accountId = env.CLOUDFLARE_ACCOUNT_ID;
            const apiToken = env.CLOUDFLARE_API_TOKEN;
            
            if (!accountId || !apiToken) {
                throw new Error('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set in environment');
            }
            
            const session = await this.getDefaultSession();
            this.logger.info('Processing deployment', { instanceId });
            
            // Step 1: Run build commands (bun run build && bunx wrangler build)
            this.logger.info('Building project');
            const buildResult = await this.executeCommand(instanceId, 'bun run build');
            if (buildResult.exitCode !== 0) {
                this.logger.warn('Build step failed or not available', buildResult.stdout, buildResult.stderr);
                throw new Error(`Build failed: ${buildResult.stderr}`);
            }
            
            const wranglerBuildResult = await this.executeCommand(instanceId, 'bunx wrangler build');
            if (wranglerBuildResult.exitCode !== 0) {
                this.logger.warn('Wrangler build failed', wranglerBuildResult.stdout, wranglerBuildResult.stderr);
                // Continue anyway - some projects might not need wrangler build
            }
            
            // Step 2: Parse wrangler config from KV
            this.logger.info('Reading wrangler configuration from KV');
            const wranglerConfigContent = await env.VibecoderStore.get(this.getWranglerKVKey(instanceId));
            
            if (!wranglerConfigContent) {
                // This should never happen unless KV itself has some issues
                throw new Error(`Wrangler config not found in KV for ${instanceId}`);
            } else {
                this.logger.info('Using wrangler configuration from KV');
            }
            
            const config = parseWranglerConfig(wranglerConfigContent);
            
            this.logger.info('Worker configuration', { scriptName: config.name });
            this.logger.info('Worker compatibility', { compatibilityDate: config.compatibility_date });
            
            // Step 3: Read worker script from dist
            this.logger.info('Reading worker script');
            const workerPath = `${instanceId}/dist/index.js`;
            const workerFile = await session.readFile(`/workspace/${workerPath}`);
            if (!workerFile.success) {
                throw new Error(`Worker script not found at ${workerPath}. Please build the project first.`);
            }
            
            const workerContent = workerFile.content;
            this.logger.info('Worker script loaded', { sizeKB: (workerContent.length / 1024).toFixed(2) });
            
            // Step 3a: Check for additional worker modules (ESM imports)
            // Process them the same way as assets but as strings for the Map
            let additionalModules: Map<string, string> | undefined;
            try {
                const workerAssetsPath = `${instanceId}/dist/assets`;
                const workerAssetsResult = await this.safeSandboxExec(`test -d ${workerAssetsPath} && echo "exists" || echo "missing"`);
                const hasWorkerAssets = workerAssetsResult.exitCode === 0 && workerAssetsResult.stdout.trim() === "exists";
                
                if (hasWorkerAssets) {
                    this.logger.info('Processing additional worker modules', { workerAssetsPath });
                    
                    // Find all JS files in the worker assets directory
                    const findResult = await this.safeSandboxExec(`find ${workerAssetsPath} -type f -name "*.js"`);
                    if (findResult.exitCode === 0) {
                        const modulePaths = findResult.stdout.trim().split('\n').filter(path => path);
                        
                        if (modulePaths.length > 0) {
                            additionalModules = new Map<string, string>();
                            
                            for (const fullPath of modulePaths) {
                                const relativePath = fullPath.replace(`${instanceId}/dist/`, '');
                                
                                try {
                                    const buffer = await this.readFileAsBase64Buffer(fullPath);
                                    const moduleContent = buffer.toString('utf8');
                                    additionalModules.set(relativePath, moduleContent);
                                    
                                    this.logger.info('Worker module loaded', { 
                                        path: relativePath, 
                                        sizeKB: (moduleContent.length / 1024).toFixed(2) 
                                    });
                                } catch (error) {
                                    this.logger.warn(`Failed to read worker module ${fullPath}:`, error);
                                }
                            }
                            
                            if (additionalModules.size > 0) {
                                this.logger.info('Found additional worker modules', { count: additionalModules.size });
                            }
                        }
                    }
                }
            } catch (error) {
                this.logger.error('Failed to process additional worker modules:', error);
            }
            
            // Step 4: Check for static assets and process them
            const assetsPath = `${instanceId}/dist/client`;
            let assetsManifest: Record<string, { hash: string; size: number }> | undefined;
            let fileContents: Map<string, Buffer> | undefined;
            
            const assetDirResult = await this.safeSandboxExec(`test -d ${assetsPath} && echo "exists" || echo "missing"`);
            const hasAssets = assetDirResult.exitCode === 0 && assetDirResult.stdout.trim() === "exists";
            
            if (hasAssets) {
                this.logger.info('Processing static assets', { assetsPath });
                const assetProcessResult = await this.processAssetsInSandbox(instanceId, assetsPath);
                assetsManifest = assetProcessResult.assetsManifest;
                fileContents = assetProcessResult.fileContents;
            } else {
                this.logger.info('No static assets found, deploying worker only');
            }
            
            // Step 5: Override config for dispatch deployment
            const dispatchConfig = {
                ...config,
                name: config.name
            };
        
            
            // Step 6: Build deployment config using pure function
            const deployConfig = buildDeploymentConfig(
                dispatchConfig,
                workerContent,
                accountId,
                apiToken,
                assetsManifest,
                config.compatibility_flags
            );
            
            // Step 7: Deploy using pure function
            this.logger.info('Deploying to Cloudflare');
            if ('DISPATCH_NAMESPACE' in env) {
                this.logger.info('Using dispatch namespace', { dispatchNamespace: env.DISPATCH_NAMESPACE });
                await deployToDispatch(
                    {
                        ...deployConfig,
                        dispatchNamespace: env.DISPATCH_NAMESPACE as string
                    },
                    fileContents,
                    additionalModules,
                    config.migrations,
                    config.assets
                );
            } else {
                throw new Error('DISPATCH_NAMESPACE not found in environment variables, cannot deploy without dispatch namespace');
            }
            
            // Step 8: Determine deployment URL
            const deployedUrl = `${this.getProtocolForHost()}://${projectName}.${getPreviewDomain(env)}`;
            const deploymentId = projectName;
            
            this.logger.info('Deployment successful', { 
                instanceId,
                deployedUrl, 
                deploymentId,
                mode: 'dispatch-namespace'
            });
            
            return {
                success: true,
                message: `Successfully deployed ${instanceId} using secure API deployment`,
                deployedUrl,
                deploymentId,
                output: `Deployed`
            };
            
        } catch (error) {
            this.logger.error('deployToCloudflareWorkers', error, { instanceId });
            return {
                success: false,
                message: `Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    
    /**
     * Process static assets in sandbox and create manifest for deployment
     */
    private async processAssetsInSandbox(_instanceId: string, assetsPath: string): Promise<{
        assetsManifest: Record<string, { hash: string; size: number }>;
        fileContents: Map<string, Buffer>;
    }> {
        // Get list of all files in assets directory
        const findResult = await this.safeSandboxExec(`find ${assetsPath} -type f`);
        if (findResult.exitCode !== 0) {
            throw new Error(`Failed to list assets: ${findResult.stderr}`);
        }
        
        const filePaths = findResult.stdout.trim().split('\n').filter(path => path);
        this.logger.info('Asset files found', { count: filePaths.length });
        
        const fileContents = new Map<string, Buffer>();
        const filesAsArrayBuffer = new Map<string, ArrayBuffer>();
        
        // Read each file and calculate hashes
        for (const fullPath of filePaths) {
            const relativePath = fullPath.replace(`${assetsPath}/`, '/');
            
            try {
                // Use base64 encoding to preserve binary files and Unicode
                const buffer = await this.readFileAsBase64Buffer(fullPath);
                fileContents.set(relativePath, buffer);
                
                const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
                filesAsArrayBuffer.set(relativePath, arrayBuffer);
                
                this.logger.info('Asset file processed', { path: relativePath, sizeBytes: buffer.length });
            } catch (error) {
                this.logger.warn(`Failed to read asset file ${fullPath}:`, error);
            }
        }
        
        // Create asset manifest using pure function
        const assetsManifest = await createAssetManifest(filesAsArrayBuffer);
        const assetCount = Object.keys(assetsManifest).length;
        this.logger.info('Asset manifest created', { assetCount });
        
        return { assetsManifest, fileContents };
    }
    
    /**
     * Read file from sandbox as base64 and convert to Buffer
     */
    private async readFileAsBase64Buffer(filePath: string): Promise<Buffer> {
        // Use base64 with no line wrapping (-w 0) to preserve binary data
        const base64Result = await this.safeSandboxExec(`base64 -w 0 "${filePath}"`);
        if (base64Result.exitCode !== 0) {
            throw new Error(`Failed to encode file: ${base64Result.stderr}`);
        }
        
        return Buffer.from(base64Result.stdout, 'base64');
    }

    /**
     * Get protocol for host (utility method)
     */
    private getProtocolForHost(): string {
        // Simple heuristic - use https for production-like domains
        const previewDomain = getPreviewDomain(env);
        if (previewDomain.includes('localhost') || previewDomain.includes('127.0.0.1')) {
            return 'http';
        }
        return 'https';
    }

    // ==========================================
    // GITHUB INTEGRATION
    // ==========================================

    private async createLatestCommit(instanceId: string, commitMessage: string): Promise<string> {
        // Sanitize commit message to prevent shell injection
        // Remove control characters, limit length, and escape special characters
        const sanitizedMessage = commitMessage
            .substring(0, 500) // Limit message length
            // eslint-disable-next-line no-control-regex -- intentional: remove ASCII control chars from commit message
            .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
            .replace(/[`$\\]/g, '\\$&') // Escape backticks, dollar signs, and backslashes
            .replace(/"/g, '\\"') // Escape double quotes
            .trim() || 'Auto-commit'; // Fallback to default message if empty
        
        // Check if there are changes to commit
        const statusResult = await this.executeCommand(instanceId, `git status --porcelain`);
        if (statusResult.exitCode !== 0) {
            this.logger.warn(`Git status check failed: ${statusResult.stderr}`);
        } else if (!statusResult.stdout.trim()) {
            this.logger.info('No changes to commit');
            // Return current HEAD if no changes
            const hashResult = await this.executeCommand(instanceId, `git rev-parse HEAD`);
            if (hashResult.exitCode === 0) {
                return hashResult.stdout.trim();
            }
            throw new Error(`No commits found in repository: ${hashResult.stderr}`);
        }
        
        // Add all changes (including untracked files)
        const addResult = await this.executeCommand(instanceId, `git add -A`);
        if (addResult.exitCode !== 0) {
            // Try alternative add command if the first fails
            const altAddResult = await this.executeCommand(instanceId, `git add . 2>/dev/null || git add --all`);
            if (altAddResult.exitCode !== 0) {
                throw new Error(`Git add failed: ${addResult.stderr || altAddResult.stderr}`);
            }
        }
        
        // Commit with sanitized message
        const commitResult = await this.executeCommand(instanceId, `git commit -m "${sanitizedMessage}" --allow-empty-message`);
        if (commitResult.exitCode !== 0) {
            // Check if error is due to no changes (shouldn't happen due to earlier check, but be safe)
            if (commitResult.stdout.includes('nothing to commit') || 
                commitResult.stderr.includes('nothing to commit')) {
                this.logger.info('Nothing to commit, working tree clean');
                const hashResult = await this.executeCommand(instanceId, `git rev-parse HEAD`);
                if (hashResult.exitCode === 0) {
                    return hashResult.stdout.trim();
                }
            }
            throw new Error(`Git commit failed: ${commitResult.stderr}`);
        }
        
        // Extract commit hash from the commit result
        const hashResult = await this.executeCommand(instanceId, `git rev-parse HEAD`);
        if (hashResult.exitCode === 0) {
            return hashResult.stdout.trim();
        }
        throw new Error(`Git rev-parse failed: ${hashResult.stderr}`);
    }

    /**
     * Push files to GitHub using secure API-based approach
     * Extracts git context from sandbox and delegates to GitHubService
     */
    async pushToGitHub(instanceId: string, request: GitHubPushRequest, allFiles: FileOutputType[]): Promise<GitHubPushResponse> {
        // Validate required parameters
        if (!instanceId?.trim()) {
            return {
                success: false,
                error: 'Instance ID is required'
            };
        }

        if (!request?.cloneUrl?.trim()) {
            return {
                success: false,
                error: 'Clone URL is required'
            };
        }

        if (!request?.token?.trim()) {
            return {
                success: false,
                error: 'GitHub token is required'
            };
        }

        if (!request?.email?.trim() || !request?.username?.trim()) {
            return {
                success: false,
                error: 'Git user email and username are required'
            };
        }

        try {
            this.logger.info(`Starting GitHub push for instance ${instanceId}`);

            // Extract git context from local repository
            const gitContext = await this.extractGitContext(instanceId);
            
            if (!gitContext.isGitRepo) {
                this.logger.error('No git repository found in sandbox');
                return {
                    success: false,
                    error: 'No git repository found in sandbox instance'
                };
            }

            // Auto-commit any uncommitted or untracked changes before push
            let finalGitContext = gitContext;
            if (gitContext.hasUncommittedChanges || gitContext.hasUntrackedFiles) {
                this.logger.info('Auto-committing changes before GitHub push', {
                    hasUncommittedChanges: gitContext.hasUncommittedChanges,
                    hasUntrackedFiles: gitContext.hasUntrackedFiles,
                    untrackedFileCount: gitContext.untrackedFiles.length
                });
                
                try {
                    // Auto-commit all changes
                    await this.createLatestCommit(instanceId, 'Auto-commit before GitHub push');
                    
                    // Re-extract git context after commit
                    finalGitContext = await this.extractGitContext(instanceId);
                    this.logger.info('Auto-commit successful', {
                        newCommitCount: finalGitContext.localCommits.length
                    });
                } catch (error) {
                    this.logger.error('Auto-commit failed', error);
                    return {
                        success: false,
                        error: `Failed to auto-commit changes: ${error instanceof Error ? error.message : 'Unknown error'}`
                    };
                }
            }

            // Use broader file selection - all files if we have any, otherwise tracked files
            const filesToUse = finalGitContext.allFiles.length > 0 ? finalGitContext.allFiles : finalGitContext.trackedFiles;
            const filesToUseSet = new Set(filesToUse);
            const cachedFiles = allFiles.filter(file => filesToUseSet.has(file.filePath) && file.fileContents.trim() !== '[REDACTED]');
            const cachedFilePaths = new Set(cachedFiles.map(file => file.filePath));
            const filesToFetch = filesToUse.filter(file => !cachedFilePaths.has(file));
            const filesNotCached = await this.getFileDirect(instanceId, filesToFetch);
            const files = [...cachedFiles, ...filesNotCached];

            this.logger.info(`Total files to push: ${files.length}`, {
                cachedFilePaths,
                filesToFetch,
                filesToUse,
            });
            
            if (files.length === 0) {
                this.logger.warn('No files found to push');
                return {
                    success: true,
                    commitSha: undefined
                };
            }

            // Delegate to secure GitHub service
            const result = await GitHubService.pushFilesToRepository(files, request, {
                localCommits: finalGitContext.localCommits,
                hasUncommittedChanges: finalGitContext.hasUncommittedChanges
            });
            
            this.logger.info('GitHub push completed', { 
                instanceId, 
                success: result.success, 
                commitSha: result.commitSha,
                localCommitCount: finalGitContext.localCommits.length,
                fileCount: files.length
            });

            return result;

        } catch (error) {
            this.logger.error('pushToGitHub failed', error, { instanceId, repositoryUrl: request.repositoryHtmlUrl });
            
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            return {
                success: false,
                error: `Secure GitHub push failed: ${errorMessage}`,
                details: {
                    operation: 'secure_api_push',
                    stderr: errorMessage
                }
            };
        }
    }

    /**
     * Read contents of any file
     */
    private async getFileDirect(instanceId: string, filePaths: string[]): Promise<{
        filePath: string;
        fileContents: string;
    }[]> {
        const files: { filePath: string; fileContents: string; }[] = [];

        this.logger.info(`Reading ${filePaths.length} files`, { instanceId });

        const session = await this.getInstanceSession(instanceId);
        for (const filePath of filePaths) {
            try {
                const readResult = await session.readFile(`/workspace/${instanceId}/${filePath}`);
                if (readResult.success && readResult.content) {
                    files.push({
                        filePath,
                        fileContents: readResult.content
                    });
                    this.logger.debug(`Successfully read file: ${filePath}`, { sizeBytes: readResult.content.length });
                } else {
                    this.logger.warn(`File read failed or empty: ${filePath}`);
                }
            } catch (error) {
                this.logger.warn(`Failed to read file ${filePath}`, error);
            }
        }

        this.logger.info(`Successfully read ${files.length}/${filePaths.length} files`);
        return files;
    }

    /**
     * Extract git history and file tracking information from local repository
     */
    private async extractGitContext(instanceId: string): Promise<{
        localCommits: Array<{
            hash: string;
            message: string;
            timestamp: string;
        }>;
        trackedFiles: string[];
        untrackedFiles: string[];
        allFiles: string[];
        hasUncommittedChanges: boolean;
        hasUntrackedFiles: boolean;
        isGitRepo: boolean;
    }> {
        try {
            // First check if this is even a git repository
            const gitCheckResult = await this.executeCommand(instanceId, 'git status');
            if (gitCheckResult.exitCode !== 0) {
                this.logger.warn('Not a git repository or git not initialized', { instanceId });
                return {
                    localCommits: [],
                    trackedFiles: [],
                    untrackedFiles: [],
                    allFiles: [],
                    hasUncommittedChanges: false,
                    hasUntrackedFiles: false,
                    isGitRepo: false
                };
            }

            // Get full commit history (oldest first to preserve order for GitHub)
            const logResult = await this.executeCommand(instanceId, 'git log --oneline --reverse --pretty=format:"%H|%s|%cI"');
            const localCommits: Array<{hash: string; message: string; timestamp: string}> = [];
            
            if (logResult.exitCode === 0 && logResult.stdout.trim()) {
                const commitLines = logResult.stdout.trim().split('\n');
                for (const line of commitLines) {
                    const [hash, message, timestamp] = line.split('|');
                    if (hash && message) {
                        localCommits.push({
                            hash: hash.trim(),
                            message: message.trim(),
                            timestamp: timestamp?.trim() || new Date().toISOString()
                        });
                    }
                }
            }

            // Get git-tracked files (respects .gitignore)
            const lsFilesResult = await this.executeCommand(instanceId, 'git ls-files');
            const trackedFiles = lsFilesResult.exitCode === 0 
                ? lsFilesResult.stdout.trim().split('\n').filter(f => f.trim())
                : [];

            // Get untracked files (respects .gitignore)
            const untrackedResult = await this.executeCommand(instanceId, 'git ls-files --others --exclude-standard');
            const untrackedFiles = untrackedResult.exitCode === 0
                ? untrackedResult.stdout.trim().split('\n').filter(f => f.trim())
                : [];

            // Combine all files
            const allFiles = [...trackedFiles, ...untrackedFiles];

            // Check if there are uncommitted changes (staged or modified)
            const statusResult = await this.executeCommand(instanceId, 'git status --porcelain');
            const hasUncommittedChanges = statusResult.exitCode === 0 && statusResult.stdout.trim().length > 0;
            const hasUntrackedFiles = untrackedFiles.length > 0;

            this.logger.info('Full git context extracted', {
                instanceId,
                localCommitCount: localCommits.length,
                trackedFileCount: trackedFiles.length,
                untrackedFileCount: untrackedFiles.length,
                totalFileCount: allFiles.length,
                hasUncommittedChanges,
                hasUntrackedFiles,
                latestCommit: localCommits[localCommits.length - 1]?.message
            });

            return { 
                localCommits, 
                trackedFiles,
                untrackedFiles,
                allFiles,
                hasUncommittedChanges,
                hasUntrackedFiles,
                isGitRepo: true 
            };
        } catch (error) {
            this.logger.warn('Failed to extract git context, using defaults', error);
            return {
                localCommits: [],
                trackedFiles: [],
                untrackedFiles: [],
                allFiles: [],
                hasUncommittedChanges: false,
                hasUntrackedFiles: false,
                isGitRepo: false
            };
        }
    }

    // ==========================================
    // REPOSITORY CLONING (BYOP FEATURE)
    // ==========================================

    /**
     * Clone a GitHub repository into the sandbox container
     */
    async cloneGitHubRepository(options: {
        repositoryUrl: string;
        accessToken: string;
        targetPath?: string;
        branch?: string;
    }): Promise<{
        success: boolean;
        clonePath: string;
        error?: string;
        repositoryName?: string;
        filesCount?: number;
    }> {
        try {
            const {
                repositoryUrl,
                accessToken,
                targetPath = '/app/imported-repo',
                branch
            } = options;

            const repoName = this.extractRepositoryName(repositoryUrl);
            if (!repoName) {
                return {
                    success: false,
                    clonePath: targetPath,
                    error: 'Invalid repository URL'
                };
            }

            // Validate repository URL to prevent injection attacks
            if (!this.validateRepositoryUrl(repositoryUrl)) {
                return {
                    success: false,
                    clonePath: targetPath,
                    error: 'Invalid repository URL format'
                };
            }

            // Create credential helper script to avoid token exposure in command line
            const credHelperPath = '/tmp/git-credential-helper.sh';

            this.logger.info('Starting git clone process', {
                repository: repoName,
                targetPath,
                branch: branch || 'default'
            });

            // Write credential helper script using printf to avoid shell expansion issues
            this.logger.info('Creating credential helper script');

            // Escape the access token for safe embedding in the printf command
            const escapedToken = accessToken.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/\$/g, '\\$');

            const writeResult = await this.safeSandboxExec(
                `printf '#!/bin/sh\\n' > ${credHelperPath} && ` +
                `printf '# Git credential helper for GitHub authentication\\n' >> ${credHelperPath} && ` +
                `printf 'echo "[CRED_HELPER] Called with: $1" >&2\\n' >> ${credHelperPath} && ` +
                `printf 'case "$1" in\\n' >> ${credHelperPath} && ` +
                `printf '  *Username*|*username*)\\n' >> ${credHelperPath} && ` +
                `printf '    echo "[CRED_HELPER] Username: token" >&2\\n' >> ${credHelperPath} && ` +
                `printf '    echo "token"\\n' >> ${credHelperPath} && ` +
                `printf '    ;;\\n' >> ${credHelperPath} && ` +
                `printf '  *Password*|*password*)\\n' >> ${credHelperPath} && ` +
                `printf '    echo "[CRED_HELPER] Password: (${accessToken.length} chars)" >&2\\n' >> ${credHelperPath} && ` +
                `printf '    echo "${escapedToken}"\\n' >> ${credHelperPath} && ` +
                `printf '    ;;\\n' >> ${credHelperPath} && ` +
                `printf '  *)\\n' >> ${credHelperPath} && ` +
                `printf '    echo "[CRED_HELPER] ERROR: Unknown prompt: $1" >&2\\n' >> ${credHelperPath} && ` +
                `printf '    exit 1\\n' >> ${credHelperPath} && ` +
                `printf '    ;;\\n' >> ${credHelperPath} && ` +
                `printf 'esac\\n' >> ${credHelperPath}`,
                10000
            );

            if (writeResult.exitCode !== 0) {
                this.logger.error('Failed to create credential helper', { stderr: writeResult.stderr });
                return {
                    success: false,
                    clonePath: targetPath,
                    error: 'Failed to setup authentication'
                };
            }

            // Make script executable
            this.logger.info('Making credential helper executable');
            await this.safeSandboxExec(`chmod +x ${credHelperPath}`, 5000);

            // Test network connectivity
            this.logger.info('Testing GitHub connectivity');
            const pingResult = await this.safeSandboxExec('curl -I https://github.com', 10000);
            this.logger.info('GitHub connectivity test result', {
                exitCode: pingResult.exitCode,
                stdout: pingResult.stdout.substring(0, 200)
            });

            // Normalize repository URL (no token embedded)
            const cleanUrl = this.normalizeRepositoryUrl(repositoryUrl);

            // Build clone command with credential helper
            let cloneCommand = `GIT_ASKPASS=${credHelperPath} git clone --depth=1 --single-branch`;
            if (branch) {
                cloneCommand += ` --branch ${branch}`;
            }
            cloneCommand += ` "${cleanUrl}" "${targetPath}"`;

            this.logger.info('Executing git clone command', {
                repository: repoName,
                targetPath,
                branch: branch || 'default'
            });

            const cloneResult = await this.safeSandboxExec(cloneCommand, 120000);

            this.logger.info('Git clone command completed', {
                exitCode: cloneResult.exitCode,
                hasStdout: !!cloneResult.stdout,
                hasStderr: !!cloneResult.stderr
            });

            // Clean up credential helper immediately
            await this.safeSandboxExec(`rm -f ${credHelperPath}`, 5000);

            if (cloneResult.exitCode !== 0) {
                // Sanitize error message to remove any potential token leaks
                const errorMessage = this.sanitizeGitError(cloneResult.stderr || 'Clone failed');
                this.logger.error('Repository clone failed', {
                    repository: repoName,
                    exitCode: cloneResult.exitCode,
                    stderr: errorMessage
                });

                return {
                    success: false,
                    clonePath: targetPath,
                    error: errorMessage
                };
            }

            const countResult = await this.safeSandboxExec(
                `find "${targetPath}" -type f ! -path "*/.git/*" | wc -l`,
                30000
            );
            const filesCount = countResult.exitCode === 0
                ? parseInt(countResult.stdout.trim(), 10) || 0
                : 0;

            this.logger.info('Repository cloned successfully', {
                repository: repoName,
                clonePath: targetPath,
                filesCount
            });

            return {
                success: true,
                clonePath: targetPath,
                filesCount,
                repositoryName: repoName
            };

        } catch (error) {
            this.logger.error('Error cloning repository', error);
            return {
                success: false,
                clonePath: options.targetPath || '/app/imported-repo',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Extract repository name from GitHub URL
     */
    private extractRepositoryName(url: string): string | null {
        try {
            const httpsMatch = url.match(/github\.com[/:]([\w-]+\/[\w-]+?)(\.git)?$/);
            if (httpsMatch) {
                return httpsMatch[1];
            }
            return null;
        } catch (error) {
            this.logger.error('Failed to extract repository name', error);
            return null;
        }
    }

    /**
     * Validate repository URL to prevent injection attacks
     */
    private validateRepositoryUrl(url: string): boolean {
        try {
            // Allow github.com URLs only
            const pattern = /^(https:\/\/github\.com\/|git@github\.com:)[\w-]+\/[\w.-]+(\.git)?$/;
            return pattern.test(url);
        } catch {
            return false;
        }
    }

    /**
     * Normalize repository URL (remove credentials, standardize format)
     */
    private normalizeRepositoryUrl(url: string): string {
        // Convert SSH to HTTPS
        if (url.startsWith('git@github.com:')) {
            url = url.replace('git@github.com:', 'https://github.com/');
        }

        // Ensure HTTPS protocol
        if (!url.startsWith('https://')) {
            url = 'https://github.com/' + url;
        }

        // Remove any embedded credentials
        url = url.replace(/\/\/[^@]+@/, '//');

        // Ensure .git suffix
        if (!url.endsWith('.git')) {
            url = url + '.git';
        }

        return url;
    }

    /**
     * Sanitize git error messages to remove potential token leaks
     */
    private sanitizeGitError(errorMessage: string): string {
        // Remove any URLs that might contain tokens
        let sanitized = errorMessage.replace(/https:\/\/[^@]*@github\.com/g, 'https://github.com');

        // Remove any base64-looking strings that might be tokens
        sanitized = sanitized.replace(/[A-Za-z0-9+/=]{30,}/g, '[REDACTED]');

        // Remove anything that looks like an OAuth token
        sanitized = sanitized.replace(/gh[ps]_[A-Za-z0-9]{30,}/g, '[REDACTED]');

        return sanitized;
    }

    /**
     * Read a file as a string
     */
    async readFileAsString(filePath: string): Promise<string | null> {
        try {
            const session = await this.getDefaultSession();
            const result = await session.readFile(filePath);
            return result.content ?? null;
        } catch (error) {
            this.logger.warn('Failed to read file as string', { filePath, error });
            return null;
        }
    }

    /**
     * List files in a directory with optional pattern matching
     */
    async listRepositoryFiles(options: {
        repositoryPath: string;
        patterns?: string[];
        maxFiles?: number;
    }): Promise<string[]> {
        const { repositoryPath, patterns = ['*.ts', '*.tsx', '*.js', '*.jsx', '*.json', '*.md'], maxFiles = 1000 } = options;

        try {
            // Build find command to list files matching patterns
            const patternArgs = patterns.map(p => `-name "${p}"`).join(' -o ');
            const findCommand = `find "${repositoryPath}" -type f \\( ${patternArgs} \\) ! -path "*/.git/*" ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/build/*" | head -n ${maxFiles}`;

            const result = await this.safeSandboxExec(findCommand, 30000);

            if (result.exitCode !== 0) {
                this.logger.warn('Failed to list repository files', {
                    repositoryPath,
                    stderr: result.stderr
                });
                return [];
            }

            const files = result.stdout
                .trim()
                .split('\n')
                .filter(f => f.length > 0);

            return files;
        } catch (error) {
            this.logger.error('Error listing repository files', { error });
            return [];
        }
    }
}