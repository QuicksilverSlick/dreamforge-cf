/**
 * BYOP (Bring Your Own Project) Import Page
 * Allows users to import GitHub repositories for analysis and completion
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGitHubRepositories, useImportRepository, useAnalysisStatus, useBlueprint } from '@/hooks/use-byop';
import { GitHubRepositoryList } from '@/components/byop/GitHubRepositoryList';
import { AnalysisProgress } from '@/components/byop/AnalysisProgress';
import { BlueprintView } from '@/components/byop/BlueprintView';
import type { GitHubRepository } from '@/api-types-byop';

export default function ImportPage() {
    const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);
    const [analysisId, setAnalysisId] = useState<string | null>(null);
    const [showBlueprint, setShowBlueprint] = useState(false);

    const { repositories, loading: loadingRepos, error: reposError, refetch: refetchRepos } = useGitHubRepositories();
    const { importRepository, loading: importing, error: importError } = useImportRepository();
    const { status: analysisStatus } = useAnalysisStatus(analysisId);
    const { blueprint, error: blueprintError } = useBlueprint(
        analysisStatus?.status === 'completed' ? analysisId : null
    );

    const handleSelectRepo = (repo: GitHubRepository) => {
        setSelectedRepo(repo);
    };

    const handleImport = async (repo: GitHubRepository, branch?: string) => {
        const result = await importRepository({
            repositoryUrl: repo.url,
            branch: branch || repo.defaultBranch,
        });

        if (result) {
            setAnalysisId(result.analysisId);
        }
    };

    const handleViewBlueprint = () => {
        setShowBlueprint(true);
    };

    const handleBack = () => {
        setShowBlueprint(false);
        setAnalysisId(null);
        setSelectedRepo(null);
    };

    const handleNewImport = () => {
        setShowBlueprint(false);
        setAnalysisId(null);
        setSelectedRepo(null);
    };

    return (
        <div className="min-h-screen bg-bg-3">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-6xl font-bold mb-3 font-[departureMono] text-accent">
                            IMPORT PROJECT
                        </h1>
                        <p className="text-text-tertiary text-lg">
                            Import your GitHub repository and get AI-powered completion recommendations
                        </p>
                    </div>

                    {/* Blueprint View */}
                    {showBlueprint && blueprint ? (
                        <BlueprintView
                            blueprint={blueprint.blueprint}
                            repositoryName={analysisStatus?.repositoryName || 'Unknown'}
                            onBack={handleBack}
                            onNewImport={handleNewImport}
                        />
                    ) : analysisId && analysisStatus ? (
                        /* Analysis Progress */
                        <AnalysisProgress
                            status={analysisStatus}
                            onViewBlueprint={handleViewBlueprint}
                            onCancel={handleBack}
                            blueprintReady={analysisStatus.status === 'completed'}
                        />
                    ) : (
                        /* Repository List */
                        <GitHubRepositoryList
                            repositories={repositories}
                            loading={loadingRepos}
                            error={reposError || importError}
                            selectedRepo={selectedRepo}
                            onSelectRepo={handleSelectRepo}
                            onImport={handleImport}
                            importing={importing}
                            onRefresh={refetchRepos}
                        />
                    )}

                    {/* Error Messages */}
                    {(reposError || importError || blueprintError) && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-400 text-sm">
                                {reposError || importError || blueprintError}
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
