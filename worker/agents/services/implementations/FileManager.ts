import * as Diff from 'diff';
import { IFileManager } from '../interfaces/IFileManager';
import { IStateManager } from '../interfaces/IStateManager';
import { FileOutputType } from '../../schemas';
import { FileState } from '../../core/state';
import { TemplateDetails } from '../../../services/sandbox/sandboxTypes';
import { FileProcessing } from '../../domain/pure/FileProcessing';
import { GitVersionControl } from 'worker/agents/git';

/**
 * Soft cap on the per-app git store (a fraction of the DO's 10GB SQLite, leaving
 * ample headroom for agent state + conversation history). Above this, auto-commit
 * halts so a runaway repo can never block the agent's own writes. A fail-safe —
 * a single generated app's history realistically never approaches it.
 */
const GIT_STORE_SOFT_CAP_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

/**
 * Manages file operations for code generation. Handles both template and
 * generated files, and auto-commits every write to the per-app git repo
 * (stored in the DO's SQLite via SqliteFS) so each change is a revertible
 * checkpoint — the basis for agent-applied-fix reversion points.
 */
export class FileManager implements IFileManager {
    constructor(
        private stateManager: IStateManager,
        private git: GitVersionControl,
    ) {
        // After a git operation that rewrites the working tree (notably a revert
        // via `git.reset`), re-sync the in-state file map from git HEAD so the
        // rest of the agent sees the rolled-back files.
        this.git.setOnFilesChangedCallback(() => {
            void this.syncGeneratedFilesMapFromGit();
        });
    }

    getTemplateFile(path: string): { filePath: string; fileContents: string } | null {
        const state = this.stateManager.getState();
        return state.templateDetails?.files?.find(file => file.filePath === path) || null;
    }

    getGeneratedFile(path: string): FileOutputType | null {
        const state = this.stateManager.getState();
        return state.generatedFilesMap[path] || null;
    }

    getAllFiles(): FileOutputType[] {
        const state = this.stateManager.getState();
        return FileProcessing.getAllFiles(state.templateDetails, state.generatedFilesMap);
    }

    saveGeneratedFile(file: FileOutputType, commitMessage?: string): Promise<void> {
        return this.saveGeneratedFiles([file], commitMessage);
    }

    /**
     * Record file changes to state, then auto-commit them to the per-app git
     * repo. State recording is SYNCHRONOUS-FIRST, so even an un-awaited caller
     * still updates `generatedFilesMap`; only the git commit is deferred. A
     * `commitMessage` labels the checkpoint (e.g. a phase or a fix) and creates a
     * revertible commit; without one, the changes are staged for the next
     * labeled commit. A git failure never blocks generation (logged, swallowed).
     */
    async saveGeneratedFiles(files: FileOutputType[], commitMessage?: string): Promise<void> {
        const fileStates = this.recordGeneratedFiles(files);
        // Storage fail-safe: never let the git store grow into the DO's own state.
        if (this.gitStoreOverCap()) {
            return;
        }
        try {
            if (commitMessage) {
                await this.commitToGit(fileStates, commitMessage);
            } else {
                // Stage on EVERY save, not only when a textual diff exists: a
                // brand-new file has an empty lastDiff, so a diff-string guard would
                // never stage it and it would be missing from the next commit / the
                // reversion history. git.stage early-returns on an empty list.
                await this.git.stage(fileStates);
            }
        } catch (error) {
            console.error('[FileManager] Failed to persist files to git:', error, commitMessage);
        }
    }

    /**
     * Fail-safe guard against the per-app git store growing into the DO's 10GB
     * SQLite cap (which would block the agent's own setState). Auto-commit halts
     * at a soft cap that leaves ample headroom for state + conversation history;
     * reverts (reads) keep working. A single app realistically never approaches
     * this — it's a safety valve, not a normal-path limit. A stats failure must
     * not block generation (assume under cap).
     */
    private gitStoreOverCap(): boolean {
        try {
            const { totalBytes } = this.git.getStorageStats();
            if (totalBytes >= GIT_STORE_SOFT_CAP_BYTES) {
                console.error('[FileManager] git store at soft cap — halting auto-commit to protect agent state', {
                    totalBytes,
                    cap: GIT_STORE_SOFT_CAP_BYTES,
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('[FileManager] Failed to read git storage stats:', error);
            return false;
        }
    }

    /**
     * Commit to git. The FIRST commit (no HEAD yet) commits the COMPLETE current
     * file set so the first reversion point is the whole project — not just this
     * change. This establishes the baseline lazily here (inside generation, which
     * is already async/slow and sequential) instead of eagerly on the DO wake-up /
     * WS-connect path. Subsequent commits are incremental.
     */
    private async commitToGit(changed: FileState[], message: string): Promise<void> {
        const head = await this.git.getHead();
        if (head === null) {
            await this.git.init();
            await this.git.commit(this.getGeneratedFiles(), message);
        } else {
            await this.git.commit(changed, message);
        }
    }

    /** Synchronous state-recording half of a save. Returns the recorded states. */
    private recordGeneratedFiles(files: FileOutputType[]): FileState[] {
        const state = this.stateManager.getState();
        const filesMap = { ...state.generatedFilesMap };
        const recorded: FileState[] = [];

        for (const file of files) {
            let lastDiff = '';
            const oldFile = filesMap[file.filePath];
            if (oldFile) {
                try {
                    // Generate diff of old file and new file
                    lastDiff = Diff.createPatch(file.filePath, oldFile.fileContents, file.fileContents);
                } catch (error) {
                    console.error(`Failed to generate diff for file ${file.filePath}:`, error);
                }
            }
            const fileState: FileState = {
                ...file,
                lasthash: '',
                lastmodified: Date.now(),
                unmerged: [],
                lastDiff,
            };
            filesMap[file.filePath] = fileState;
            recorded.push(fileState);
        }

        this.stateManager.setState({
            ...state,
            generatedFilesMap: filesMap,
        });
        return recorded;
    }

    /**
     * Rebuild `generatedFilesMap` from git HEAD — invoked via the
     * onFilesChanged callback after the working tree is rewritten (a revert).
     * Preserves existing file purposes; never throws (keeps prior state on
     * failure).
     */
    async syncGeneratedFilesMapFromGit(): Promise<void> {
        try {
            const gitFiles = await this.git.getAllFilesFromHead();
            const state = this.stateManager.getState();
            const oldMap = state.generatedFilesMap;
            const newMap: Record<string, FileState> = {};

            for (const file of gitFiles) {
                const existing = oldMap[file.filePath];
                newMap[file.filePath] = {
                    filePath: file.filePath,
                    fileContents: file.fileContents,
                    filePurpose: existing?.filePurpose || 'Generated file',
                    lasthash: '',
                    lastmodified: Date.now(),
                    unmerged: [],
                    lastDiff: '',
                };
            }

            this.stateManager.setState({
                ...state,
                generatedFilesMap: newMap,
            });
        } catch (error) {
            console.error('[FileManager] Failed to sync generatedFilesMap from git:', error);
        }
    }

    deleteFiles(filePaths: string[]): void {
        const state = this.stateManager.getState();
        const newFilesMap = { ...state.generatedFilesMap };

        for (const filePath of filePaths) {
            delete newFilesMap[filePath];
        }

        this.stateManager.setState({
            ...state,
            generatedFilesMap: newFilesMap,
        });
    }

    getFile(path: string): FileOutputType | null {
        const generatedFile = this.getGeneratedFile(path);
        if (generatedFile) {
            return generatedFile;
        }

        const templateFile = this.getTemplateFile(path);
        if (!templateFile) {
            return null;
        }
        return {...templateFile, filePurpose: 'Template file'};
    }

    getFileContents(path: string): string {
        const generatedFile = this.getGeneratedFile(path);
        if (generatedFile) {
            return generatedFile.fileContents;
        }

        const templateFile = this.getTemplateFile(path);
        return templateFile?.fileContents || '';
    }

    fileExists(path: string): boolean {
        return !!this.getGeneratedFile(path) || !!this.getTemplateFile(path);
    }

    getGeneratedFilePaths(): string[] {
        const state = this.stateManager.getState();
        return Object.keys(state.generatedFilesMap);
    }

    getTemplateDetails(): TemplateDetails | undefined {
        const state = this.stateManager.getState();
        return state.templateDetails;
    }

    getGeneratedFilesMap(): Record<string, FileOutputType> {
        const state = this.stateManager.getState();
        return state.generatedFilesMap;
    }

    getGeneratedFiles(): FileOutputType[] {
        const state = this.stateManager.getState();
        return Object.values(state.generatedFilesMap);
    }
}
