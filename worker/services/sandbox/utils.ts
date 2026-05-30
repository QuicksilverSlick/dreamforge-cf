import type { TemplateDetails, TemplateFile } from './sandboxTypes';

/**
 * Returns the subset of template files that match the `importantFiles`
 * patterns.  Patterns are matched as exact paths or as prefixes (a
 * pattern matches any file whose path starts with it).
 *
 * Falls back to the `files` array when `allFiles` / `importantFiles`
 * are not populated (legacy persisted state).
 */
export function getTemplateImportantFiles(
    templateDetails: TemplateDetails,
    filterRedacted = true,
): TemplateFile[] {
    const { importantFiles, allFiles, redactedFiles } = templateDetails;

    // Legacy path: fields not yet populated on this TemplateDetails instance
    if (!allFiles || !importantFiles) {
        return templateDetails.files;
    }

    const redactedSet = new Set(redactedFiles);
    const importantSet = new Set(importantFiles);

    const result: TemplateFile[] = [];

    for (const [filePath, fileContents] of Object.entries(allFiles)) {
        const isExactMatch = importantSet.has(filePath);
        const isMatch = isExactMatch || importantFiles.some(pattern => filePath.startsWith(pattern));

        if (isMatch) {
            const isRedacted = filterRedacted && redactedSet.has(filePath);
            const contents = isRedacted ? 'REDACTED' : fileContents;
            if (contents) {
                result.push({ filePath, fileContents: contents });
            }
        }
    }

    return result;
}

/**
 * Converts the `allFiles` Record into a `TemplateFile[]` array.
 * Falls back to `files` when `allFiles` is not populated.
 */
export function getTemplateFiles(templateDetails: TemplateDetails): TemplateFile[] {
    if (!templateDetails.allFiles) {
        return templateDetails.files;
    }
    return Object.entries(templateDetails.allFiles).map(([filePath, fileContents]) => ({
        filePath,
        fileContents,
    }));
}

/**
 * Checks whether a file path is allowed to be modified, given
 * the template's `dontTouchFiles` list.
 */
export function isFileModifiable(
    filePath: string,
    dontTouchFiles: string[],
): { allowed: boolean; reason?: string } {
    const normalized = filePath.replace(/^\/+/, '');

    for (const pattern of dontTouchFiles) {
        if (normalized === pattern || normalized.startsWith(pattern)) {
            return { allowed: false, reason: `File is protected: ${pattern}` };
        }
    }

    return { allowed: true };
}
