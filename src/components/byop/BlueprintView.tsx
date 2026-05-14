/**
 * Blueprint View Component
 * Displays AI-generated completion blueprint with recommendations
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Plus,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Code2,
    Shield,
    Zap,
    TestTube,
    Sparkles,
    Rocket,
    X,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { apiClient, ApiError } from '@/lib/api-client';
import type { GeneratedBlueprint } from '@/api-types-byop';

interface BlueprintViewProps {
    blueprint: GeneratedBlueprint;
    repositoryName: string;
    analysisId: string;
    onBack: () => void;
    onNewImport: () => void;
}

export function BlueprintView({
    blueprint,
    repositoryName,
    analysisId,
    onBack,
    onNewImport,
}: BlueprintViewProps) {
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { currentState, recommendations, nextSteps, technicalDebt, completionPhases } = blueprint;

    const priorityColors = {
        high: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
        medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
        low: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    };

    const categoryIcons = {
        functionality: Code2,
        security: Shield,
        performance: Zap,
        quality: Sparkles,
        testing: TestTube,
    };

    const handleStartBuilding = async () => {
        setIsStarting(true);
        setError(null);

        try {
            const response = await apiClient.startBuilding(analysisId);

            if (response.data?.success && response.data.agentId) {
                navigate(`/chat/${response.data.agentId}`);
            } else {
                setError('Failed to start building session');
            }
        } catch (err) {
            const errorMessage = err instanceof ApiError
                ? err.message
                : err instanceof Error
                    ? err.message
                    : 'Unknown error';
            setError(errorMessage);
        } finally {
            setIsStarting(false);
            setShowConfirmModal(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowConfirmModal(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30"
                    >
                        <Rocket className="w-5 h-5" />
                        Start Building
                    </button>
                    <button
                        onClick={onNewImport}
                        className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Import Another
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg"
                >
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Project Overview */}
                <div className="bg-bg-2 rounded-lg border border-border p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary mb-2">
                                {repositoryName}
                            </h1>
                            <p className="text-text-secondary">{blueprint.description}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-accent mb-1">
                                {currentState.completenessPercentage}%
                            </div>
                            <div className="text-sm text-text-tertiary">Complete</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <StatCard label="Files" value={(currentState.totalFiles ?? 0).toLocaleString()} />
                        <StatCard label="Lines of Code" value={(currentState.totalLinesOfCode ?? 0).toLocaleString()} />
                        <StatCard label="Framework" value={currentState.framework || 'N/A'} />
                        <StatCard label="Recommendations" value={recommendations.length.toString()} />
                    </div>
                </div>

                {/* Current State */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-bg-2 rounded-lg border border-border p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <h2 className="text-xl font-semibold text-text-primary">Implemented Features</h2>
                        </div>
                        <ul className="space-y-2">
                            {currentState.implementedFeatures.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-text-secondary">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-bg-2 rounded-lg border border-border p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-xl font-semibold text-text-primary">Missing Components</h2>
                        </div>
                        <ul className="space-y-2">
                            {currentState.missingComponents.map((component, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-text-secondary">{component}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-bg-2 rounded-lg border border-border p-6">
                    <h2 className="text-2xl font-semibold text-text-primary mb-4">
                        Recommendations
                    </h2>
                    <div className="space-y-3">
                        {recommendations.map((rec, i) => {
                            const colors = priorityColors[rec.priority as keyof typeof priorityColors] || priorityColors.medium;
                            const Icon = categoryIcons[rec.category as keyof typeof categoryIcons] || Code2;

                            return (
                                <div
                                    key={i}
                                    className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <Icon className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-text-primary">{rec.title}</h3>
                                                    <span className={`px-2 py-0.5 text-xs rounded ${colors.bg} ${colors.text} border ${colors.border} uppercase font-medium`}>
                                                        {rec.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-text-secondary mb-2">
                                                    {rec.description}
                                                </p>
                                                {rec.estimatedEffort && (
                                                    <div className="flex items-center gap-1 text-xs text-text-tertiary">
                                                        <TrendingUp className="w-3.5 h-3.5" />
                                                        <span>Estimated effort: {rec.estimatedEffort}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-bg-2 rounded-lg border border-border p-6">
                    <h2 className="text-2xl font-semibold text-text-primary mb-4">
                        Next Steps
                    </h2>
                    <ol className="space-y-2">
                        {nextSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-black text-sm font-bold flex-shrink-0">
                                    {i + 1}
                                </span>
                                <span className="text-text-secondary pt-0.5">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Completion Phases */}
                {completionPhases.length > 0 && (
                    <div className="bg-bg-2 rounded-lg border border-border p-6">
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">
                            Completion Phases
                        </h2>
                        <div className="space-y-4">
                            {completionPhases.map((phase) => (
                                <div key={phase.phase} className="border border-border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-text-primary">
                                            Phase {phase.phase}: {phase.title}
                                        </h3>
                                        {phase.estimatedTime && (
                                            <span className="text-sm text-text-tertiary">
                                                {phase.estimatedTime}
                                            </span>
                                        )}
                                    </div>
                                    <ul className="space-y-1">
                                        {phase.tasks.map((task, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <span className="text-accent mt-1">•</span>
                                                <span className="text-text-secondary">{task}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Technical Debt */}
                {technicalDebt.length > 0 && (
                    <div className="bg-bg-2 rounded-lg border border-border p-6">
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">
                            Technical Debt
                        </h2>
                        <ul className="space-y-2">
                            {technicalDebt.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-text-secondary">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </motion.div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => !isStarting && setShowConfirmModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-bg-2 border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                                        <Rocket className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-text-primary">Start AI-Assisted Development</h2>
                                        <p className="text-sm text-text-tertiary">Review the plan before starting</p>
                                    </div>
                                </div>
                                {!isStarting && (
                                    <button
                                        onClick={() => setShowConfirmModal(false)}
                                        className="text-text-secondary hover:text-text-primary transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {/* Modal Body */}
                            <div className="px-6 py-4 overflow-y-auto flex-1">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">
                                            What will Dreamforge AI do?
                                        </h3>
                                        <p className="text-text-secondary text-sm leading-relaxed">
                                            Dreamforge will analyze your project and implement improvements based on the blueprint.
                                            The AI will focus on high-priority recommendations and missing components.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">
                                            Priority Tasks
                                        </h3>
                                        <ul className="space-y-2">
                                            {recommendations
                                                .filter(r => r.priority === 'high')
                                                .slice(0, 3)
                                                .map((rec, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm">
                                                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                                        <span className="text-text-secondary">{rec.title}</span>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">
                                            Next Steps
                                        </h3>
                                        <ul className="space-y-2">
                                            {nextSteps.slice(0, 3).map((step, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm">
                                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-bold flex-shrink-0 mt-0.5">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-text-secondary">{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-text-primary mb-1">
                                                    AI-Assisted Speed
                                                </h4>
                                                <p className="text-xs text-text-secondary leading-relaxed">
                                                    Dreamforge works 10-50x faster than manual development.
                                                    Most improvements complete in minutes to hours, not days or weeks.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    disabled={isStarting}
                                    className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStartBuilding}
                                    disabled={isStarting}
                                    className="flex items-center gap-2 px-6 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isStarting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin drop-shadow-[0_0_10px_rgba(0,0,0,0.4)]" />
                                            Starting...
                                        </>
                                    ) : (
                                        <>
                                            <Rocket className="w-5 h-5" />
                                            Confirm & Start
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string;
}

function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">{value}</div>
            <div className="text-xs text-text-tertiary">{label}</div>
        </div>
    );
}
