/**
 * Analysis Progress Component
 * Shows real-time progress of repository analysis with WebSocket updates
 */

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ArrowRight, X, Code2, Package, FileSearch, Brain } from 'lucide-react';
import type { AnalysisStateResponse } from '@/api-types-byop';

interface AnalysisProgressProps {
    status: AnalysisStateResponse;
    onViewBlueprint: () => void;
    onCancel: () => void;
    blueprintReady: boolean;
}

export function AnalysisProgress({
    status,
    onViewBlueprint,
    onCancel,
    blueprintReady,
}: AnalysisProgressProps) {
    const { progress, currentPhase, status: analysisStatus, error } = status;

    const isCompleted = analysisStatus === 'completed';
    const isFailed = analysisStatus === 'failed';
    const isAnalyzing = analysisStatus === 'analyzing' || analysisStatus === 'pending';

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-2 rounded-lg border border-border p-8"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary mb-1">
                            {status.repositoryName}
                        </h2>
                        <p className="text-sm text-text-tertiary">
                            {status.fileCount ? `${status.fileCount} files` : 'Analyzing repository'}
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 rounded-lg hover:bg-bg-3 transition-colors"
                        title="Cancel"
                    >
                        <X className="w-5 h-5 text-text-tertiary" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text-secondary">
                            {currentPhase || 'Initializing...'}
                        </span>
                        <span className="text-sm font-bold text-accent">
                            {progress}%
                        </span>
                    </div>
                    <div className="h-3 bg-bg-3 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${
                                isCompleted ? 'bg-green-500' :
                                isFailed ? 'bg-red-500' :
                                'bg-accent'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>
                </div>

                {/* Status Icon & Message */}
                <div className="flex flex-col items-center justify-center py-8">
                    {isAnalyzing && (
                        <>
                            <Loader2 className="w-16 h-16 text-accent animate-spin mb-4" />
                            <p className="text-lg text-text-secondary">
                                Analyzing your codebase...
                            </p>
                            <p className="text-sm text-text-tertiary mt-2">
                                This may take 30-90 seconds
                            </p>
                        </>
                    )}

                    {isCompleted && (
                        <>
                            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                            <p className="text-lg font-semibold text-text-primary">
                                Analysis Complete!
                            </p>
                            <p className="text-sm text-text-tertiary mt-2">
                                Your completion blueprint is ready
                            </p>
                        </>
                    )}

                    {isFailed && (
                        <>
                            <XCircle className="w-16 h-16 text-red-500 mb-4" />
                            <p className="text-lg font-semibold text-text-primary">
                                Analysis Failed
                            </p>
                            <p className="text-sm text-text-tertiary mt-2">
                                {error || 'An error occurred during analysis'}
                            </p>
                        </>
                    )}
                </div>

                {/* Phases Checklist */}
                <div className="space-y-3 mb-8">
                    <PhaseItem
                        label="Reading repository structure"
                        completed={progress > 10}
                        active={progress <= 10 && isAnalyzing}
                        icon={<FileSearch className="w-4 h-4" />}
                    />
                    <PhaseItem
                        label="Analyzing package.json"
                        completed={progress > 30}
                        active={progress > 10 && progress <= 30 && isAnalyzing}
                        icon={<Package className="w-4 h-4" />}
                    />
                    <PhaseItem
                        label="Parsing source files with ts-morph"
                        completed={progress > 30}
                        active={progress > 30 && progress <= 30 && isAnalyzing}
                        icon={<Code2 className="w-4 h-4" />}
                    />
                    <PhaseItem
                        label="Analyzing dependencies"
                        completed={progress > 50}
                        active={progress > 30 && progress <= 50 && isAnalyzing}
                        icon={<Package className="w-4 h-4" />}
                    />
                    <PhaseItem
                        label="Building codebase context"
                        completed={progress > 65}
                        active={progress > 50 && progress <= 65 && isAnalyzing}
                        icon={<FileSearch className="w-4 h-4" />}
                    />
                    <PhaseItem
                        label="Generating completion blueprint with Gemini 2.5 Pro"
                        completed={progress >= 100}
                        active={progress > 65 && progress < 100 && isAnalyzing}
                        icon={<Brain className="w-4 h-4" />}
                    />
                </div>

                {/* Actions */}
                {isCompleted && blueprintReady && (
                    <button
                        onClick={onViewBlueprint}
                        className="w-full px-6 py-3 bg-accent text-black rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                    >
                        View Completion Blueprint
                        <ArrowRight className="w-5 h-5" />
                    </button>
                )}

                {isFailed && (
                    <button
                        onClick={onCancel}
                        className="w-full px-6 py-3 bg-bg-3 text-text-primary rounded-lg font-medium hover:bg-bg-darkest transition-colors"
                    >
                        Go Back
                    </button>
                )}
            </motion.div>
        </div>
    );
}

interface PhaseItemProps {
    label: string;
    completed: boolean;
    active: boolean;
    icon?: React.ReactNode;
}

function PhaseItem({ label, completed, active, icon }: PhaseItemProps) {
    return (
        <div className="flex items-center gap-3">
            <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                ${completed ? 'bg-accent border-accent' :
                  active ? 'border-accent' :
                  'border-border'}
            `}>
                {completed && <CheckCircle2 className="w-4 h-4 text-black" />}
                {active && !completed && (
                    <motion.div
                        className="w-2 h-2 rounded-full bg-accent"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                )}
            </div>
            <div className="flex items-center gap-2 flex-1">
                {icon && (
                    <span className={`shrink-0 ${
                        completed ? 'text-accent' :
                        active ? 'text-accent' :
                        'text-text-tertiary'
                    }`}>
                        {icon}
                    </span>
                )}
                <span className={`text-sm ${
                    completed ? 'text-text-primary font-medium' :
                    active ? 'text-accent font-medium' :
                    'text-text-tertiary'
                }`}>
                    {label}
                </span>
            </div>
        </div>
    );
}
