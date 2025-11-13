/**
 * Blueprint View Component
 * Displays AI-generated completion blueprint with recommendations
 */

import { motion } from 'framer-motion';
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
} from 'lucide-react';
import type { GeneratedBlueprint } from '@/api-types-byop';

interface BlueprintViewProps {
    blueprint: GeneratedBlueprint;
    repositoryName: string;
    onBack: () => void;
    onNewImport: () => void;
}

export function BlueprintView({
    blueprint,
    repositoryName,
    onBack,
    onNewImport,
}: BlueprintViewProps) {
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
                <button
                    onClick={onNewImport}
                    className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Import Another Project
                </button>
            </div>

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
                        <StatCard label="Files" value={currentState.totalFiles.toLocaleString()} />
                        <StatCard label="Lines of Code" value={currentState.totalLinesOfCode.toLocaleString()} />
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
                            const colors = priorityColors[rec.priority];
                            const Icon = categoryIcons[rec.category] || Code2;

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
