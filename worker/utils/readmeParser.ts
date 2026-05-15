/**
 * README.md Parser Utility
 * Extracts project name and metadata from README.md files
 */

import { createLogger } from '../logger';

const logger = createLogger('ReadmeParser');

export interface ReadmeMetadata {
    projectName: string | null;
    description: string | null;
    headingLevel: number | null;
}

/**
 * Extract project name from README.md content
 *
 * Looks for the first H1 heading (# Title) in the README.md file.
 * If no H1 is found, returns null to fall back to repository name.
 *
 * @param readmeContent - The raw markdown content of README.md
 * @returns The extracted project name or null if not found
 */
export function extractProjectNameFromReadme(readmeContent: string | undefined): string | null {
    if (!readmeContent || readmeContent.trim().length === 0) {
        logger.debug('No README content provided');
        return null;
    }

    try {
        const lines = readmeContent.split('\n');

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Skip empty lines
            if (!trimmedLine) {
                continue;
            }

            // Check for H1 markdown heading (# Title)
            const h1Match = trimmedLine.match(/^#\s+(.+)$/);
            if (h1Match) {
                const projectName = h1Match[1].trim();

                // Remove common badges and emoji from project name
                const cleanName = cleanProjectName(projectName);

                if (cleanName.length > 0) {
                    logger.info('Extracted project name from README.md H1 heading', {
                        original: projectName,
                        cleaned: cleanName
                    });
                    return cleanName;
                }
            }
        }

        logger.debug('No H1 heading found in README.md');
        return null;

    } catch (error) {
        logger.error('Error parsing README.md for project name', error);
        return null;
    }
}

/**
 * Clean project name by removing badges, emoji, and extra formatting
 */
function cleanProjectName(name: string): string {
    let cleaned = name;

    // Remove markdown image syntax (badges): ![alt](url) or [![alt](url)](link)
    cleaned = cleaned.replace(/\[?!\[.*?\]\(.*?\)\]?\(.*?\)/g, '');
    cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, '');

    // Remove markdown links: [text](url)
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Remove HTML tags
    cleaned = cleaned.replace(/<[^>]+>/g, '');

    // Remove common emoji (Unicode emoji ranges)
    cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}]/gu, ''); // Emoticons
    cleaned = cleaned.replace(/[\u{1F300}-\u{1F5FF}]/gu, ''); // Misc Symbols and Pictographs
    cleaned = cleaned.replace(/[\u{1F680}-\u{1F6FF}]/gu, ''); // Transport and Map
    cleaned = cleaned.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, ''); // Flags (iOS)
    cleaned = cleaned.replace(/[\u{2600}-\u{26FF}]/gu, '');   // Misc symbols
    cleaned = cleaned.replace(/[\u{2700}-\u{27BF}]/gu, '');   // Dingbats

    // Remove markdown bold/italic: **text** or *text* or __text__ or _text_
    cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2');
    cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2');

    // Remove inline code: `text`
    cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
}

/**
 * Extract comprehensive metadata from README.md
 *
 * @param readmeContent - The raw markdown content of README.md
 * @returns ReadmeMetadata object with project name, description, and heading level
 */
export function extractReadmeMetadata(readmeContent: string | undefined): ReadmeMetadata {
    const metadata: ReadmeMetadata = {
        projectName: null,
        description: null,
        headingLevel: null
    };

    if (!readmeContent || readmeContent.trim().length === 0) {
        return metadata;
    }

    try {
        const lines = readmeContent.split('\n');
        let foundH1 = false;

        for (let i = 0; i < lines.length; i++) {
            const trimmedLine = lines[i].trim();

            // Skip empty lines
            if (!trimmedLine) {
                continue;
            }

            // Look for first H1 heading
            if (!foundH1) {
                const h1Match = trimmedLine.match(/^(#{1})\s+(.+)$/);
                if (h1Match) {
                    foundH1 = true;
                    metadata.headingLevel = h1Match[1].length;
                    metadata.projectName = cleanProjectName(h1Match[2].trim());

                    // Look for description in the next non-empty lines
                    for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
                        const descLine = lines[j].trim();

                        // Skip empty lines and other headings
                        if (!descLine || descLine.startsWith('#')) {
                            continue;
                        }

                        // Skip badge lines (contain multiple ![])
                        if (descLine.match(/!\[.*?\]\(.*?\)/g)?.length && descLine.match(/!\[.*?\]\(.*?\)/g)!.length > 1) {
                            continue;
                        }

                        // Found a description line
                        metadata.description = descLine;
                        break;
                    }

                    break;
                }
            }
        }

        logger.debug('Extracted README metadata', metadata);
        return metadata;

    } catch (error) {
        logger.error('Error extracting README metadata', error);
        return metadata;
    }
}

/**
 * Get display name for project (prefers README name, falls back to repository name)
 *
 * @param readmeContent - The raw markdown content of README.md
 * @param repositoryName - The repository name from GitHub (e.g., "owner/repo")
 * @returns The best available project name
 */
export function getProjectDisplayName(
    readmeContent: string | undefined,
    repositoryName: string
): string {
    const extractedName = extractProjectNameFromReadme(readmeContent);

    if (extractedName && extractedName.length > 0) {
        logger.info('Using project name from README.md', {
            readmeName: extractedName,
            repositoryName
        });
        return extractedName;
    }

    // Fall back to repository name (remove owner prefix if present)
    const repoNameOnly = repositoryName.split('/').pop() || repositoryName;

    logger.info('Using repository name as fallback', {
        repositoryName: repoNameOnly,
        fullRepositoryName: repositoryName
    });

    return repoNameOnly;
}
