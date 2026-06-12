/**
 * Intake interview ("21 Questions") — the pre-build conversation that turns a
 * first idea into a complete build spec. One question at a time, chips first,
 * free text always available, with a live "Your app so far" panel and escape
 * hatches everywhere. Spec: docs/specs/21-QUESTIONS-INTAKE-INTERVIEW.md §3, §7
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Pencil, Sparkles, X } from 'lucide-react';
import clsx from 'clsx';
import { apiClient } from '@/lib/api-client';
import type { InterviewAnswer, InterviewQuestion, InterviewStateData } from '@/api-types';

const SESSION_STORAGE_KEY = 'dreamforge:interview-session';

interface TranscriptEntry {
    question: InterviewQuestion;
    answerLabel: string;
}

function answerLabelFor(question: InterviewQuestion, answer: InterviewAnswer): string {
    switch (answer.kind) {
        case 'skip':
            return 'Skipped';
        case 'delegate':
            return 'You decide';
        case 'text':
            return answer.text;
        case 'chips': {
            const labels = answer.chipIds.map(
                (id) => question.chips.find((chip) => chip.id === id)?.label ?? id,
            );
            return labels.join(', ');
        }
    }
}

export default function InterviewPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') ?? '';
    const agentMode = searchParams.get('agentMode') ?? 'deterministic';
    const imagesParam = searchParams.get('images');

    const [state, setState] = useState<InterviewStateData | null>(null);
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [multiSelection, setMultiSelection] = useState<string[]>([]);
    const [freeText, setFreeText] = useState('');
    const [editing, setEditing] = useState<InterviewQuestion | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    // Ref-based guard: state updates are async, so a key-repeat Enter could
    // double-submit before `submitting` re-renders.
    const inFlightRef = useRef(false);
    const [starting, setStarting] = useState(true);
    const [finishing, setFinishing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const startBuild = useCallback((enhancedQuery: string, interviewSessionId?: string) => {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        const imageParam = imagesParam ? `&images=${encodeURIComponent(imagesParam)}` : '';
        // The session id lets the builder load the full structured spec
        // (stories, acceptance criteria, capability flags), not just the brief.
        const sessionParam = interviewSessionId ? `&interviewSession=${encodeURIComponent(interviewSessionId)}` : '';
        navigate(`/chat/new?query=${encodeURIComponent(enhancedQuery)}&agentMode=${encodeURIComponent(agentMode)}${sessionParam}${imageParam}`);
    }, [navigate, agentMode, imagesParam]);

    const applyState = useCallback((data: InterviewStateData) => {
        setState(data);
        setMultiSelection([]);
        setFreeText(data.question?.prefill ?? '');
        setEditing(null);
        if (data.done && data.spec) {
            startBuild(data.spec.enhancedQuery, data.sessionId);
        }
    }, [startBuild]);

    useEffect(() => {
        let cancelled = false;
        const begin = async () => {
            try {
                const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
                if (existing) {
                    try {
                        const response = await apiClient.getInterviewSession(existing);
                        if (!cancelled && response.data) {
                            applyState(response.data);
                            return;
                        }
                    } catch {
                        sessionStorage.removeItem(SESSION_STORAGE_KEY);
                    }
                }
                const response = await apiClient.startInterview(query);
                if (cancelled) return;
                if (response.data) {
                    sessionStorage.setItem(SESSION_STORAGE_KEY, response.data.sessionId);
                    applyState(response.data);
                }
            } catch {
                if (!cancelled) {
                    setError('We couldn\'t start the interview. You can build straight from your idea instead.');
                }
            } finally {
                if (!cancelled) setStarting(false);
            }
        };
        void begin();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript, state?.question?.id]);

    const submit = async (question: InterviewQuestion, answer: InterviewAnswer) => {
        if (!state || inFlightRef.current) return;
        inFlightRef.current = true;
        setSubmitting(true);
        setError(null);
        try {
            const response = await apiClient.submitInterviewAnswer(state.sessionId, question.id, answer);
            if (response.data) {
                const label = answerLabelFor(question, answer);
                setTranscript((prev) => {
                    const existingIndex = prev.findIndex((entry) => entry.question.id === question.id);
                    if (existingIndex >= 0) {
                        const next = [...prev];
                        next[existingIndex] = { question, answerLabel: label };
                        return next;
                    }
                    return [...prev, { question, answerLabel: label }];
                });
                setEditMode(false);
                applyState(response.data);
            }
        } catch {
            setError('That answer didn\'t save — try again.');
        } finally {
            inFlightRef.current = false;
            setSubmitting(false);
        }
    };

    const handleConfirmChip = async (chipId: string) => {
        if (!state?.question) return;
        if (chipId === 'change-something') {
            setEditMode(true);
            return;
        }
        await submit(state.question, { kind: 'chips', chipIds: [chipId] });
    };

    const justBuildIt = async () => {
        if (!state || finishing) return;
        setFinishing(true);
        setError(null);
        try {
            const response = await apiClient.finishInterview(state.sessionId);
            if (response.data?.spec) {
                startBuild(response.data.spec.enhancedQuery, response.data.sessionId);
            } else if (query) {
                startBuild(query);
            }
        } catch {
            // Never strand the user: fall back to building from the raw idea.
            if (query) {
                startBuild(query);
            } else {
                setError('We couldn\'t wrap up the interview — try again.');
                setFinishing(false);
            }
        }
    };

    const activeQuestion = editing ?? state?.question ?? null;
    const isConfirm = activeQuestion?.id === 'p5-confirm';

    if (starting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Sparkles className="size-8 text-accent animate-pulse" />
                <p className="text-text-secondary">Reading your idea so we only ask what we need to…</p>
            </div>
        );
    }

    if (!state) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
                <p className="text-text-secondary">{error ?? 'Something went wrong starting the interview.'}</p>
                {query && (
                    <button
                        onClick={() => startBuild(query)}
                        className="bg-accent text-text-inverted px-4 py-2 rounded-lg font-medium"
                    >
                        Build straight from my idea
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            <div className="flex flex-col min-h-[70vh]">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-medium text-accent tracking-tight">Let's get this right</h1>
                        <p className="text-sm text-text-tertiary mt-1">
                            A few quick questions — free, and never more than 21.
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="text-xs text-text-tertiary">
                            Question {Math.min(state.progress.asked, state.progress.cap)} of up to {state.progress.cap}
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                    {transcript.map((entry) => (
                        <div key={entry.question.id} className="flex flex-col gap-1.5">
                            <div className="self-start max-w-[85%] bg-bg-4 dark:bg-bg-2 border border-accent/15 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-text-primary">
                                {entry.question.text}
                            </div>
                            <button
                                type="button"
                                disabled={!editMode || submitting}
                                onClick={() => editMode && setEditing(entry.question)}
                                className={clsx(
                                    'self-end max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-left',
                                    'bg-accent/10 text-text-primary border border-accent/20',
                                    editMode && 'hover:border-accent cursor-pointer',
                                )}
                            >
                                {entry.answerLabel}
                                {editMode && <Pencil className="inline size-3 ml-2 text-accent" />}
                            </button>
                        </div>
                    ))}

                    {editMode && !editing && (
                        <div className="self-center text-xs text-text-tertiary bg-bg-4/60 dark:bg-bg-2/60 rounded-full px-4 py-1.5">
                            Tap any answer above to change it
                            <button className="ml-2 underline" onClick={() => setEditMode(false)}>cancel</button>
                        </div>
                    )}

                    {/* Mount-only animation: an exit choreography here (AnimatePresence
                        mode="wait") proved able to strand the outgoing question and
                        never mount the next one. Robust beats pretty. */}
                    {activeQuestion && (!editMode || editing) && (
                            <motion.div
                                key={activeQuestion.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-3 mt-1"
                            >
                                <div className="self-start max-w-[85%] bg-bg-4 dark:bg-bg-2 border border-accent/30 rounded-2xl rounded-bl-sm px-4 py-3 text-text-primary shadow-sm">
                                    {activeQuestion.text}
                                </div>

                                {isConfirm && state.summary.points.length > 0 && (
                                    <SummaryCard
                                        headline={state.summary.headline}
                                        points={state.summary.points}
                                        assumptions={state.summary.assumptions}
                                        compact
                                    />
                                )}

                                <div className="flex flex-wrap gap-2 ml-1">
                                    {activeQuestion.kind !== 'free' &&
                                        activeQuestion.chips.map((chip) => {
                                            const selected = multiSelection.includes(chip.id);
                                            return (
                                                <button
                                                    key={chip.id}
                                                    type="button"
                                                    disabled={submitting}
                                                    onClick={() => {
                                                        if (activeQuestion.kind === 'multi') {
                                                            setMultiSelection((prev) =>
                                                                selected ? prev.filter((id) => id !== chip.id) : [...prev, chip.id],
                                                            );
                                                        } else if (isConfirm && !editing) {
                                                            void handleConfirmChip(chip.id);
                                                        } else {
                                                            void submit(activeQuestion, { kind: 'chips', chipIds: [chip.id] });
                                                        }
                                                    }}
                                                    className={clsx(
                                                        'px-3.5 py-2 rounded-full text-sm border transition-all duration-150',
                                                        selected
                                                            ? 'bg-accent text-text-inverted border-accent'
                                                            : 'bg-bg-4 dark:bg-bg-2 text-text-primary border-accent/30 hover:border-accent',
                                                        submitting && 'opacity-50 cursor-not-allowed',
                                                    )}
                                                >
                                                    {selected && <Check className="inline size-3.5 mr-1.5 -mt-0.5" />}
                                                    {chip.label}
                                                </button>
                                            );
                                        })}

                                    {activeQuestion.kind === 'multi' && (
                                        <button
                                            type="button"
                                            disabled={submitting || multiSelection.length === 0}
                                            onClick={() => void submit(activeQuestion, { kind: 'chips', chipIds: multiSelection })}
                                            className="px-4 py-2 rounded-full text-sm font-medium bg-accent text-text-inverted disabled:opacity-50"
                                        >
                                            Continue <ArrowRight className="inline size-3.5 ml-1 -mt-0.5" />
                                        </button>
                                    )}
                                </div>

                                {activeQuestion.kind === 'free' && (
                                    <form
                                        className="flex gap-2 ml-1 max-w-xl"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (freeText.trim()) {
                                                void submit(activeQuestion, { kind: 'text', text: freeText.trim() });
                                            }
                                        }}
                                    >
                                        <textarea
                                            value={freeText}
                                            onChange={(e) => setFreeText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    if (freeText.trim()) {
                                                        void submit(activeQuestion, { kind: 'text', text: freeText.trim() });
                                                    }
                                                }
                                            }}
                                            rows={2}
                                            autoFocus
                                            placeholder="Type your answer…"
                                            className="flex-1 resize-none rounded-xl border border-accent/30 bg-bg-4 dark:bg-bg-2 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent"
                                        />
                                        <button
                                            type="submit"
                                            disabled={submitting || !freeText.trim()}
                                            className="self-end bg-accent text-text-inverted p-2.5 rounded-xl disabled:opacity-50"
                                        >
                                            <ArrowRight className="size-4" />
                                        </button>
                                    </form>
                                )}

                                {(activeQuestion.skippable || activeQuestion.delegatable) && (
                                    <div className="flex gap-3 ml-1 text-xs text-text-tertiary">
                                        {activeQuestion.delegatable && (
                                            <button
                                                type="button"
                                                disabled={submitting}
                                                onClick={() => void submit(activeQuestion, { kind: 'delegate' })}
                                                className="underline underline-offset-2 hover:text-text-secondary"
                                            >
                                                You decide
                                            </button>
                                        )}
                                        {activeQuestion.skippable && (
                                            <button
                                                type="button"
                                                disabled={submitting}
                                                onClick={() => void submit(activeQuestion, { kind: 'skip' })}
                                                className="underline underline-offset-2 hover:text-text-secondary"
                                            >
                                                Skip
                                            </button>
                                        )}
                                    </div>
                                )}

                                {editing && (
                                    <button
                                        type="button"
                                        onClick={() => setEditing(null)}
                                        className="self-start ml-1 text-xs text-text-tertiary underline underline-offset-2"
                                    >
                                        <X className="inline size-3 mr-1" />Never mind, keep my answer
                                    </button>
                                )}
                            </motion.div>
                    )}

                    {finishing && (
                        <div className="flex items-center gap-2 text-sm text-text-secondary mt-2">
                            <Sparkles className="size-4 text-accent animate-pulse" />
                            Writing up your build plan…
                        </div>
                    )}
                    {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
                    <div ref={bottomRef} />
                </div>

                <div className="mt-8 pt-4 border-t border-accent/10 flex items-center justify-between">
                    <p className="text-xs text-text-tertiary">
                        This interview is free — it never uses your build credits.
                    </p>
                    {!isConfirm && (
                        <button
                            type="button"
                            disabled={finishing}
                            onClick={() => void justBuildIt()}
                            className="text-sm text-accent hover:underline underline-offset-4 disabled:opacity-50"
                        >
                            Just build it with what you've got →
                        </button>
                    )}
                </div>
            </div>

            <aside className="hidden lg:block">
                <div className="sticky top-8">
                    <SummaryCard
                        headline={state.summary.headline}
                        points={state.summary.points}
                        assumptions={state.summary.assumptions}
                    />
                </div>
            </aside>
        </div>
    );
}

function SummaryCard({
    headline,
    points,
    assumptions,
    compact = false,
}: {
    headline: string | null;
    points: string[];
    assumptions: string[];
    compact?: boolean;
}) {
    if (points.length === 0 && assumptions.length === 0) {
        return compact ? null : (
            <div className="rounded-2xl border border-accent/15 bg-bg-4/50 dark:bg-bg-2/50 p-5">
                <h2 className="text-sm font-medium text-text-secondary mb-2">Your app so far</h2>
                <p className="text-xs text-text-tertiary">As you answer, your app takes shape here.</p>
            </div>
        );
    }
    return (
        <div className={clsx('rounded-2xl border border-accent/15 bg-bg-4/50 dark:bg-bg-2/50 p-5', compact && 'max-w-xl ml-1')}>
            <h2 className="text-sm font-medium text-text-secondary mb-2">Your app so far</h2>
            {headline && <p className="text-sm font-medium text-text-primary mb-2">{headline}</p>}
            <ul className="flex flex-col gap-1.5">
                {points.map((point) => (
                    <li key={point} className="text-xs text-text-secondary flex gap-2">
                        <Check className="size-3.5 text-accent shrink-0 mt-px" />
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
            {assumptions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-accent/10">
                    <h3 className="text-xs font-medium text-text-tertiary mb-1.5">We chose for you</h3>
                    <ul className="flex flex-col gap-1">
                        {assumptions.map((assumption) => (
                            <li key={assumption} className="text-xs text-text-tertiary">{assumption}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
