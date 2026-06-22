/**
 * Persisted-state migration for the M3 single-agent topology.
 *
 * Hydrating a `CodeGeneratorAgent` DO that was created before M3 will
 * surface the pre-M3 `CodeGenState` shape: flat field names, no
 * discriminator, `inferenceContext` instead of `metadata`,
 * `templateDetails` instead of `templateName`, `agentMode` instead of
 * `behaviorType`. This class is the one place those renames are handled
 * — every behavior and operation downstream assumes the canonical
 * `AgentState` shape.
 *
 * Ported from upstream `cloudflare/vibesdk` `worker/agents/core/
 * stateMigration.ts`. `generateProjectName` is imported from the ported
 * `worker/agents/utils/templateCustomizer.ts` (M3 commit 2b.4) — the
 * inline fallback that lived here in commits 1 through 2b.3 has been
 * removed now that the real helper is available.
 */

import type { TemplateDetails } from '../../services/sandbox/sandboxTypes';
import type { InferenceMetadata } from '../inferutils/config.types';
import { generateNanoId } from '../../utils/idGenerator';
import { MAX_AGENT_QUERY_LENGTH } from '../../api/controllers/agent/types';
import type { StructuredLogger } from '../../logger';
import { generateProjectName } from '../utils/templateCustomizer';
import type { AgentState, FileState } from './state';

// ---------------------------------------------------------------------------
// Legacy detection helpers
// ---------------------------------------------------------------------------

type LegacyFileFormat = {
    file_path?: string;
    file_contents?: string;
    file_purpose?: string;
};

type StateWithDeprecatedFields = AgentState & {
    latestScreenshot?: unknown;
    templateDetails?: TemplateDetails;
    agentMode?: string;
    inferenceContext?: unknown;
};

function hasLegacyFileFormat(file: unknown): file is LegacyFileFormat {
    if (typeof file !== 'object' || file === null) return false;
    return 'file_path' in file || 'file_contents' in file || 'file_purpose' in file;
}

function hasField<K extends string>(
    state: AgentState,
    key: K,
): state is AgentState & Record<K, unknown> {
    return key in state;
}

function isStateWithTemplateDetails(
    state: AgentState,
): state is StateWithDeprecatedFields & { templateDetails: TemplateDetails } {
    return 'templateDetails' in state;
}

function isStateWithAgentMode(
    state: AgentState,
): state is StateWithDeprecatedFields & { agentMode: string } {
    return 'agentMode' in state;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function extractInferenceMetadata(value: unknown): InferenceMetadata | null {
    if (!isRecord(value)) return null;
    const agentId = value.agentId;
    const userId = value.userId;
    if (typeof agentId !== 'string' || agentId.trim() === '') return null;
    if (typeof userId !== 'string' || userId.trim() === '') return null;
    return { agentId, userId };
}

// ---------------------------------------------------------------------------
// Migration entrypoints
// ---------------------------------------------------------------------------

export class StateMigration {
    /**
     * Common migrations that apply to any behavior. Returns the migrated
     * state when changes were made, or `null` when the state is already
     * canonical.
     */
    static migrateCommon(state: AgentState): AgentState | null {
        const stateRecord = state as unknown as Record<string, unknown>;

        if (state.metadata?.agentId && state.metadata?.userId) {
            return null;
        }

        const hasLegacyInferenceContext = hasField(state, 'inferenceContext');
        if (hasLegacyInferenceContext) {
            const rawInferenceContext = stateRecord.inferenceContext;
            const extractedMetadata = extractInferenceMetadata(rawInferenceContext);

            if (extractedMetadata) {
                const nextStateRecord: Record<string, unknown> = {
                    ...stateRecord,
                    metadata: extractedMetadata,
                };
                delete nextStateRecord.inferenceContext;
                return nextStateRecord as unknown as AgentState;
            }
        }

        return null;
    }

    /**
     * Phasic-state migrations: query truncation, file-format upgrade,
     * deprecated-prop cleanup, `templateDetails → templateName`,
     * `projectName` synthesis, `projectType` defaulting,
     * `agentMode → behaviorType` rename.
     */
    static migratePhasic(
        state: AgentState,
        logger: StructuredLogger,
    ): AgentState | null {
        let needsMigration = false;
        const stateRecord = state as unknown as Record<string, unknown>;

        // Truncate over-long queries (legacy payloads predate the cap).
        if (state.query && state.query.length > MAX_AGENT_QUERY_LENGTH) {
            logger.warn(
                'Large prompt detected. Truncating query to avoid performance issues',
            );
            state.query = state.query.slice(0, MAX_AGENT_QUERY_LENGTH);
            needsMigration = true;
        }

        // Migrate file format ({ file_path, file_contents, … } → FileState).
        const migrateFile = (file: FileState | unknown): FileState => {
            if (hasLegacyFileFormat(file)) {
                return {
                    filePath: (file as FileState).filePath || file.file_path || '',
                    fileContents:
                        (file as FileState).fileContents || file.file_contents || '',
                    filePurpose:
                        (file as FileState).filePurpose || file.file_purpose || '',
                    lasthash: (file as FileState).lasthash || '',
                    lastmodified: (file as FileState).lastmodified || 0,
                    unmerged: (file as FileState).unmerged || [],
                    lastDiff: (file as FileState).lastDiff || '',
                };
            }
            return file as FileState;
        };

        const migratedFilesMap: Record<string, FileState> = {};
        for (const [key, file] of Object.entries(state.generatedFilesMap)) {
            const migratedFile = migrateFile(file);
            migratedFilesMap[key] = { ...migratedFile };
            if (migratedFile !== file) {
                needsMigration = true;
            }
        }

        // Drop deprecated fields.
        const stateHasDeprecatedProps = hasField(state, 'latestScreenshot');
        if (stateHasDeprecatedProps) {
            needsMigration = true;
        }

        const stateHasProjectUpdatesAccumulator = hasField(
            state,
            'projectUpdatesAccumulator',
        );
        if (!stateHasProjectUpdatesAccumulator) {
            needsMigration = true;
        }

        // templateDetails → templateName.
        let migratedTemplateName = state.templateName;
        const hasTemplateDetails = isStateWithTemplateDetails(state);
        if (hasTemplateDetails) {
            migratedTemplateName = state.templateDetails.name;
            needsMigration = true;
            logger.info('Migrating templateDetails to templateName', {
                templateName: migratedTemplateName,
            });
        }

        // Synthesize projectName when missing.
        let migratedProjectName = state.projectName;
        if (!state.projectName) {
            migratedProjectName = generateProjectName(
                state.blueprint?.projectName || migratedTemplateName || state.query,
                generateNanoId(),
                20,
            );
            needsMigration = true;
            logger.info('Generating missing projectName', {
                projectName: migratedProjectName,
            });
        }

        // Default projectType when missing or invalid.
        let migratedProjectType = state.projectType;
        const hasProjectType = hasField(state, 'projectType');
        if (
            !hasProjectType ||
            (migratedProjectType !== 'app' &&
                migratedProjectType !== 'presentation' &&
                migratedProjectType !== 'general' &&
                migratedProjectType !== 'workflow')
        ) {
            migratedProjectType = 'app';
            needsMigration = true;
            logger.info('Adding default projectType for legacy state', {
                projectType: migratedProjectType,
            });
        }

        // Default behaviorType when missing.
        let migratedBehaviorType = state.behaviorType;
        const rawBehaviorType = stateRecord.behaviorType;
        const hasValidBehaviorType =
            rawBehaviorType === 'phasic' || rawBehaviorType === 'agentic';

        if (!hasField(state, 'behaviorType') || !hasValidBehaviorType) {
            migratedBehaviorType = 'phasic';
            needsMigration = true;
            logger.info('Adding default behaviorType for legacy state', {
                behaviorType: migratedBehaviorType,
            });
        }

        // Map legacy agentMode → behaviorType when present.
        if (isStateWithAgentMode(state)) {
            migratedBehaviorType = state.agentMode === 'smart' ? 'agentic' : 'phasic';
            needsMigration = true;
            logger.info('Migrating agentMode to behaviorType', {
                oldMode: state.agentMode,
                newType: migratedBehaviorType,
            });
        }

        const migratedProjectUpdatesAccumulator =
            stateHasProjectUpdatesAccumulator &&
            Array.isArray(
                (stateRecord as Record<string, unknown>).projectUpdatesAccumulator,
            )
                ? (stateRecord.projectUpdatesAccumulator as string[])
                : [];

        if (needsMigration) {
            logger.info(
                'Migrating state: schema format fixes and legacy field cleanup',
                {
                    generatedFilesCount: Object.keys(migratedFilesMap).length,
                },
            );

            const nextStateRecord: Record<string, unknown> = {
                ...stateRecord,
                behaviorType: migratedBehaviorType,
                projectType: migratedProjectType,
                generatedFilesMap: migratedFilesMap,
                projectUpdatesAccumulator: migratedProjectUpdatesAccumulator,
                templateName: migratedTemplateName,
                projectName: migratedProjectName,
            };

            const newState = nextStateRecord as unknown as AgentState;

            const stateWithDeprecated = newState as StateWithDeprecatedFields;
            if (stateHasDeprecatedProps) {
                delete stateWithDeprecated.latestScreenshot;
            }
            if (hasTemplateDetails) {
                delete stateWithDeprecated.templateDetails;
            }
            if (isStateWithAgentMode(state)) {
                // `agentMode` is a required (mirrored) field on
                // BaseProjectState rather than legacy-only, so we rewrite it
                // to match the new `behaviorType` rather than deleting it.
                // Once a follow-up removes `agentMode` from the type, this
                // branch becomes a delete again.
                stateWithDeprecated.agentMode =
                    migratedBehaviorType === 'agentic' ? 'smart' : 'deterministic';
            }

            return newState;
        }

        return null;
    }
}
