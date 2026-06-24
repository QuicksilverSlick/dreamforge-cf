import { FileOutputType } from '../../schemas';
import { TemplateDetails } from '../../../services/sandbox/sandboxTypes';

/**
 * Interface for file management operations
 * Abstracts file storage and retrieval
 */
export interface IFileManager {
    /**
     * Get a template file by path
     */
    getTemplateFile(path: string): { filePath: string; fileContents: string } | null;

    /**
     * Get a generated file by path
     */
    getGeneratedFile(path: string): FileOutputType | null;

    /**
     * Get all files (template + generated)
     */
    getAllFiles(): FileOutputType[];

    /**
     * Save a generated file. Records state synchronously, then auto-commits to
     * the per-app git repo (a labeled checkpoint when `commitMessage` is given).
     */
    saveGeneratedFile(file: FileOutputType, commitMessage?: string): Promise<void>;

    /**
     * Save multiple generated files. Records state synchronously, then
     * auto-commits to git (a labeled, revertible checkpoint when `commitMessage`
     * is given; otherwise the changes are staged for the next labeled commit).
     */
    saveGeneratedFiles(files: FileOutputType[], commitMessage?: string): Promise<void>;

    /**
     * Delete files from the file manager
     */
    deleteFiles(filePaths: string[]): void;

    /**
     * Get file contents by path (template or generated)
     */
    getFileContents(path: string): string;

    /**
     * Check if file exists (template or generated)
     */
    fileExists(path: string): boolean;

    /**
     * Get all generated file paths
     */
    getGeneratedFilePaths(): string[];

    /**
     * Get template details
     */
    getTemplateDetails(): TemplateDetails | undefined;

    /**
     * Get generated files map
     */
    getGeneratedFilesMap(): Record<string, FileOutputType>;
    
    /**
     * Get generated files
     */
    getGeneratedFiles(): FileOutputType[];
}