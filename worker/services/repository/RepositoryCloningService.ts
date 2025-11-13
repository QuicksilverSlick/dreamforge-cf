/**
 * Repository Cloning Service
 * Handles cloning GitHub repositories into sandbox containers for BYOP feature
 */

import { createLogger } from '../../logger';
import type { SandboxSdkClient } from '../sandbox/sandboxSdkClient';

const logger = createLogger('RepositoryCloningService');

export interface CloneRepositoryOptions {
    repositoryUrl: string;
    accessToken: string;
    targetPath?: string;
    shallow?: boolean;
    branch?: string;
}

export interface CloneResult {
    success: boolean;
    clonePath: string;
    error?: string;
    filesCount?: number;
    repositoryName?: string;
}

/**
 * Service for cloning GitHub repositories into sandbox containers
 */
export class RepositoryCloningService {
    /**
     * Clone a GitHub repository into a sandbox container
     */
    static async cloneRepository(
        sandboxClient: SandboxSdkClient,
        options: CloneRepositoryOptions
    ): Promise<CloneResult> {
        try {
            const {
                repositoryUrl,
                accessToken,
                targetPath = '/app/imported-repo',
                shallow = true,
                branch
            } = options;

            // Extract repository name from URL
            const repoName = this.extractRepositoryName(repositoryUrl);
            if (!repoName) {
                throw new Error('Invalid repository URL');
            }

            // Construct authenticated clone URL
            const authenticatedUrl = this.createAuthenticatedUrl(repositoryUrl, accessToken);

            // Build git clone command
            const cloneCommand = this.buildCloneCommand({
                url: authenticatedUrl,
                targetPath,
                shallow,
                branch
            });

            logger.info('Cloning repository', {
                repository: repoName,
                targetPath,
                shallow,
                branch: branch || 'default'
            });

            // Execute clone command in sandbox
            const cloneResult = await sandboxClient.exec({
                command: cloneCommand,
                timeout: 120000 // 2 minute timeout for large repos
            });

            if (cloneResult.exitCode !== 0) {
                const errorMessage = cloneResult.stderr || 'Clone failed';
                logger.error('Repository clone failed', {
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

            // Count files in cloned repository
            const filesCount = await this.countRepositoryFiles(sandboxClient, targetPath);

            logger.info('Repository cloned successfully', {
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
            logger.error('Error cloning repository', error);
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
    private static extractRepositoryName(url: string): string | null {
        try {
            // Handle various GitHub URL formats:
            // - https://github.com/owner/repo
            // - https://github.com/owner/repo.git
            // - git@github.com:owner/repo.git

            const httpsMatch = url.match(/github\.com[/:]([\w-]+\/[\w-]+?)(\.git)?$/);
            if (httpsMatch) {
                return httpsMatch[1];
            }

            return null;
        } catch (error) {
            logger.error('Failed to extract repository name', error);
            return null;
        }
    }

    /**
     * Create authenticated GitHub URL with access token
     */
    private static createAuthenticatedUrl(url: string, accessToken: string): string {
        // Convert SSH URLs to HTTPS
        if (url.startsWith('git@github.com:')) {
            url = url.replace('git@github.com:', 'https://github.com/');
        }

        // Ensure HTTPS protocol
        if (!url.startsWith('https://')) {
            url = 'https://github.com/' + url;
        }

        // Remove .git extension if present
        url = url.replace(/\.git$/, '');

        // Insert token into URL: https://token@github.com/owner/repo
        return url.replace('https://github.com/', `https://${accessToken}@github.com/`);
    }

    /**
     * Build git clone command with options
     */
    private static buildCloneCommand(options: {
        url: string;
        targetPath: string;
        shallow: boolean;
        branch?: string;
    }): string {
        const { url, targetPath, shallow, branch } = options;

        let command = 'git clone';

        // Add shallow clone flag for performance
        if (shallow) {
            command += ' --depth=1';
        }

        // Add branch specification if provided
        if (branch) {
            command += ` --branch ${branch}`;
        }

        // Add single-branch flag for shallow clones
        if (shallow) {
            command += ' --single-branch';
        }

        // Add URL and target path
        command += ` "${url}" "${targetPath}"`;

        return command;
    }

    /**
     * Count files in cloned repository (excluding .git directory)
     */
    private static async countRepositoryFiles(
        sandboxClient: SandboxSdkClient,
        repositoryPath: string
    ): Promise<number> {
        try {
            const countResult = await sandboxClient.exec({
                command: `find "${repositoryPath}" -type f ! -path "*/.git/*" | wc -l`,
                timeout: 30000
            });

            if (countResult.exitCode === 0) {
                const count = parseInt(countResult.stdout.trim(), 10);
                return isNaN(count) ? 0 : count;
            }

            return 0;
        } catch (error) {
            logger.error('Failed to count repository files', error);
            return 0;
        }
    }

    /**
     * List files in cloned repository
     */
    static async listRepositoryFiles(
        sandboxClient: SandboxSdkClient,
        repositoryPath: string,
        maxDepth: number = 3
    ): Promise<string[]> {
        try {
            const listResult = await sandboxClient.exec({
                command: `find "${repositoryPath}" -maxdepth ${maxDepth} -type f ! -path "*/.git/*" ! -path "*/node_modules/*"`,
                timeout: 30000
            });

            if (listResult.exitCode === 0) {
                return listResult.stdout
                    .split('\n')
                    .filter((line: string) => line.trim().length > 0)
                    .map((path: string) => path.replace(repositoryPath + '/', ''));
            }

            return [];
        } catch (error) {
            logger.error('Failed to list repository files', error);
            return [];
        }
    }

    /**
     * Read file content from cloned repository
     */
    static async readRepositoryFile(
        sandboxClient: SandboxSdkClient,
        filePath: string
    ): Promise<string | null> {
        try {
            const readResult = await sandboxClient.exec({
                command: `cat "${filePath}"`,
                timeout: 10000
            });

            if (readResult.exitCode === 0) {
                return readResult.stdout;
            }

            logger.error('Failed to read file', {
                filePath,
                exitCode: readResult.exitCode,
                stderr: readResult.stderr
            });
            return null;
        } catch (error) {
            logger.error('Error reading repository file', error);
            return null;
        }
    }

    /**
     * Delete cloned repository from container
     */
    static async deleteRepository(
        sandboxClient: SandboxSdkClient,
        repositoryPath: string
    ): Promise<boolean> {
        try {
            const deleteResult = await sandboxClient.exec({
                command: `rm -rf "${repositoryPath}"`,
                timeout: 30000
            });

            if (deleteResult.exitCode === 0) {
                logger.info('Repository deleted successfully', { repositoryPath });
                return true;
            }

            logger.error('Failed to delete repository', {
                repositoryPath,
                exitCode: deleteResult.exitCode,
                stderr: deleteResult.stderr
            });
            return false;
        } catch (error) {
            logger.error('Error deleting repository', error);
            return false;
        }
    }
}
