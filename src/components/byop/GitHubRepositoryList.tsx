/**
 * GitHub Repository List Component
 * Displays user's GitHub repositories with import functionality
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, GitBranch, Star, GitFork, Code, Calendar, AlertTriangle } from 'lucide-react';
import type { GitHubRepository } from '@/api-types-byop';

interface GitHubRepositoryListProps {
    repositories: GitHubRepository[];
    loading: boolean;
    error: string | null;
    selectedRepo: GitHubRepository | null;
    onSelectRepo: (repo: GitHubRepository) => void;
    onImport: (repo: GitHubRepository, branch?: string) => Promise<void>;
    importing: boolean;
    onRefresh: () => void;
}

export function GitHubRepositoryList({
    repositories,
    loading,
    error,
    selectedRepo,
    onSelectRepo,
    onImport,
    importing,
    onRefresh,
}: GitHubRepositoryListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [branchInput, setBranchInput] = useState('');

    const filteredRepos = repositories.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.language?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleImport = () => {
        if (selectedRepo) {
            onImport(selectedRepo, branchInput || undefined);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-8 h-8 text-accent animate-spin" />
                    <p className="text-text-secondary">Loading your repositories...</p>
                </div>
            </div>
        );
    }

    if (error && repositories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <AlertTriangle className="size-14 text-amber-500" />
                <h3 className="text-xl font-semibold text-text-primary">Failed to load repositories</h3>
                <p className="text-text-tertiary text-center max-w-md">{error}</p>
                <button
                    onClick={onRefresh}
                    className="mt-4 px-6 py-2 bg-accent text-text-inverted rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                    <input
                        type="text"
                        placeholder="Search repositories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-bg-2 border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent"
                    />
                </div>
                <button
                    onClick={onRefresh}
                    className="px-4 py-3 bg-bg-2 border border-border rounded-lg hover:bg-bg-1 transition-colors"
                    title="Refresh repositories"
                >
                    <RefreshCw className="w-5 h-5 text-text-secondary" />
                </button>
            </div>

            {/* Repository Count */}
            <div className="flex items-center justify-between">
                <p className="text-text-secondary">
                    {filteredRepos.length} {filteredRepos.length === 1 ? 'repository' : 'repositories'}
                    {searchQuery && ` matching "${searchQuery}"`}
                </p>
            </div>

            {/* Repository Grid */}
            {filteredRepos.length === 0 ? (
                <div className="text-center py-20 text-text-tertiary">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No repositories found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredRepos.map((repo) => (
                            <RepositoryCard
                                key={repo.id}
                                repo={repo}
                                selected={selectedRepo?.id === repo.id}
                                onSelect={() => onSelectRepo(repo)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Import Panel */}
            <AnimatePresence>
                {selectedRepo && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-0 left-0 right-0 bg-bg-1 border-t border-border p-6 shadow-lg"
                    >
                        <div className="container mx-auto max-w-6xl">
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                                        Import {selectedRepo.fullName}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <GitBranch className="w-4 h-4 text-text-tertiary" />
                                            <input
                                                type="text"
                                                placeholder={`Branch (default: ${selectedRepo.defaultBranch})`}
                                                value={branchInput}
                                                onChange={(e) => setBranchInput(e.target.value)}
                                                className="px-3 py-2 bg-bg-2 border border-border rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => onSelectRepo(null!)}
                                        className="px-6 py-2 bg-bg-2 border border-border rounded-lg text-text-primary hover:bg-bg-darkest transition-colors"
                                        disabled={importing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleImport}
                                        disabled={importing}
                                        className="px-8 py-2 bg-accent text-text-inverted rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {importing ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Importing...
                                            </>
                                        ) : (
                                            'Start Import'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface RepositoryCardProps {
    repo: GitHubRepository;
    selected: boolean;
    onSelect: () => void;
}

function RepositoryCard({ repo, selected, onSelect }: RepositoryCardProps) {
    return (
        <motion.button
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={onSelect}
            className={`
                w-full p-6 rounded-lg border-2 transition-all text-left
                ${selected
                    ? 'border-accent bg-accent/5'
                    : 'border-border bg-bg-2 hover:border-accent/50 hover:bg-bg-1'
                }
            `}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary truncate">
                            {repo.name}
                        </h3>
                        {repo.isPrivate && (
                            <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30">
                                Private
                            </span>
                        )}
                        {repo.language && (
                            <span className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded border border-accent/30">
                                {repo.language}
                            </span>
                        )}
                    </div>

                    {repo.description && (
                        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                            {repo.description}
                        </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-text-tertiary">
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5" />
                            <span>{repo.stargazersCount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <GitFork className="w-3.5 h-3.5" />
                            <span>{repo.forksCount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <GitBranch className="w-3.5 h-3.5" />
                            <span>{repo.defaultBranch}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.button>
    );
}
