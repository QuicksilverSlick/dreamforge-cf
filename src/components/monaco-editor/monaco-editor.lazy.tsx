import { lazy, memo, Suspense } from 'react';
import type { MonacoEditorProps } from './monaco-editor';

/**
 * Lazily-loaded Monaco editor.
 *
 * Monaco is ~3.7 MB — by far the heaviest thing we ship — and importing it
 * statically put it in the entry graph, so `index.html` preloaded it and every
 * visitor paid for it before the app rendered, whether or not they ever opened
 * the code view. Splitting it into its own chunk alone did NOT fix that: a
 * static import is still a static import, and the browser fetches it either way.
 *
 * Deferring the import behind `lazy()` is what actually keeps it off the
 * critical path — it now downloads when the editor first mounts.
 *
 * The props type is imported type-only, so this wrapper carries no runtime
 * dependency on monaco and the call sites stay unchanged.
 */
const MonacoEditorImpl = lazy(() =>
	import('./monaco-editor').then((module) => ({ default: module.MonacoEditor })),
);

function EditorSkeleton() {
	return (
		<div
			className="size-full animate-pulse rounded-md bg-text-primary/5"
			aria-label="Loading editor"
			role="status"
		/>
	);
}

export const MonacoEditor = memo(function MonacoEditor(props: MonacoEditorProps) {
	return (
		<Suspense fallback={<EditorSkeleton />}>
			<MonacoEditorImpl {...props} />
		</Suspense>
	);
});

export type { MonacoEditorProps };
