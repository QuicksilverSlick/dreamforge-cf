import React, { memo, useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { useTheme } from '../../contexts/theme-context';

import 'monaco-editor/esm/vs/editor/editor.all.js';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import defaultCode from '../../routes?raw';
import './monaco-editor.module.css';

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === 'json') {
			return new jsonWorker();
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new cssWorker();
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new htmlWorker();
		}
		if (
			label === 'typescript' ||
			label === 'javascript' ||
			label === 'typescriptreact' ||
			label === 'javascriptreact'
		) {
			return new tsWorker();
		}
		return new editorWorker();
	},
};

// Dreamforge "Forge Dark" — teal-accented dark editor theme, tuned for low eye-strain.
// Teal is the cursor + functions only; the rest is a balanced, colour-blind-safe spread
// (violet keywords + green strings avoid the red/green CVD trap).
monaco.editor.defineTheme('v1-dev-dark', {
	base: 'vs-dark',
	inherit: true,
	rules: [
		{ token: '', foreground: 'd6e2de', background: '0e1413' },
		{ token: 'comment', foreground: '5e6e67', fontStyle: 'italic' },
		{ token: 'keyword', foreground: 'b98ae6' },
		{ token: 'number', foreground: 'e5b567' },
		{ token: 'string', foreground: '9fd68a' },
		{ token: 'regexp', foreground: '7fd6bc' },
		{ token: 'type', foreground: '6fb7e8' },
		{ token: 'class', foreground: '6fb7e8' },
		{ token: 'interface', foreground: '6fb7e8' },
		{ token: 'function', foreground: '1fe0c0' },
		{ token: 'member', foreground: 'd6e2de' },
		{ token: 'variable', foreground: 'd6e2de' },
		{ token: 'constant', foreground: 'e8915c' },
		{ token: 'operator', foreground: '7e8c86' },
		{ token: 'delimiter', foreground: '7e8c86' },
		{ token: 'namespace', foreground: '6fb7e8' },
		{ token: 'predefined', foreground: '6fb7e8' },
		{ token: 'tag', foreground: 'e78a9c' },
		{ token: 'attribute.name', foreground: 'e5b567' },
		{ token: 'attribute.value', foreground: '9fd68a' },
		{ token: 'invalid', foreground: 'f2818f' },
	],
	colors: {
		'editor.background': '#0e1413',
		'editor.foreground': '#d6e2de',
		'editorLineNumber.foreground': '#48564f',
		'editorLineNumber.activeForeground': '#8fa39b',
		'editorCursor.foreground': '#1fe0c0',
		'editorIndentGuide.background': '#1c2622',
		'editorIndentGuide.activeBackground': '#2e3b36',
		'editor.selectionBackground': '#1f4d45',
		'editor.inactiveSelectionBackground': '#17302c',
		'editor.lineHighlightBackground': '#161d1b',
		'editor.wordHighlightBackground': '#1fe0c022',
		'editor.wordHighlightStrongBackground': '#1fe0c033',
		'editor.findMatchBackground': '#e5b56744',
		'editor.findMatchHighlightBackground': '#e5b56722',
		'editorBracketMatch.background': '#2a6f6333',
		'editorBracketMatch.border': '#2a6f63',
		'editorGutter.background': '#0e1413',
		'editorWidget.background': '#141917',
		'editorWidget.border': '#222b27',
		'editorSuggestWidget.background': '#141917',
		'editorSuggestWidget.border': '#222b27',
		'editorHoverWidget.background': '#141917',
		'editorHoverWidget.border': '#222b27',
		'scrollbarSlider.background': '#2e3b3680',
		'scrollbarSlider.hoverBackground': '#3a4a44aa',
	},
});

monaco.editor.defineTheme('v1-dev', {
	base: 'vs',
	inherit: true,
	rules: [
		{ token: '', foreground: '000000', background: 'fbfbfc' },
		{ token: 'comment', foreground: '6e7781', fontStyle: 'italic' },
		{ token: 'keyword', foreground: '0e8c7a' },
		{ token: 'number', foreground: '0550ae' },
		{ token: 'string', foreground: '0a3069' },
		{ token: 'type', foreground: '0e8c7a' },
		{ token: 'class', foreground: '0e8c7a' },
		{ token: 'interface', foreground: '0e8c7a' },
		{ token: 'function', foreground: '953800' },
		{ token: 'member', foreground: '0550ae' },
		{ token: 'variable', foreground: '24292f' },
		{ token: 'constant', foreground: '0550ae' },
		{ token: 'operator', foreground: '0e8c7a' },
		{ token: 'namespace', foreground: '0e8c7a' },
		{ token: 'predefined', foreground: '0e8c7a' },
		{ token: 'invalid', foreground: 'ff0000' },
	],
	colors: {
		'editor.background': '#fbfbfc',
		'editor.foreground': '#24292f',
		'editorLineNumber.foreground': '#8c959f',
		'editorLineNumber.activeForeground': '#24292f',
		'editorCursor.foreground': '#0e8c7a',
		'editorIndentGuide.background': '#d0d7de',
		'editorIndentGuide.activeBackground': '#8c959f',
		'editor.selectionBackground': '#0e8c7a20',
		'editor.inactiveSelectionBackground': '#0e8c7a10',
		'editor.lineHighlightBackground': '#0e8c7a08',
		'editor.wordHighlightBackground': '#0e8c7a15',
		'editor.wordHighlightStrongBackground': '#0e8c7a20',
		'editor.findMatchBackground': '#0e8c7a30',
		'editor.findMatchHighlightBackground': '#0e8c7a15',
	},
});

monaco.editor.setTheme('v1-dev-dark');

// Resolve the editor theme from the actually-rendered UI: the theme context applies a
// `.dark` class to <html>, so reading it matches what the user sees even when the app
// theme is 'system' (the previous `theme === 'dark'` check fell through to the light
// theme for 'system', which is why the editor showed up white in a dark app).
function effectiveEditorTheme(): 'v1-dev-dark' | 'v1-dev' {
	return typeof document !== 'undefined' &&
		document.documentElement.classList.contains('dark')
		? 'v1-dev-dark'
		: 'v1-dev';
}

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
	noSemanticValidation: true,
	noSyntaxValidation: true,
});

// Configure TypeScript defaults for JSX support
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
	jsx: monaco.languages.typescript.JsxEmit.React,
	allowJs: true,
	allowSyntheticDefaultImports: true,
	esModuleInterop: true,
	moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
	module: monaco.languages.typescript.ModuleKind.ESNext,
	target: monaco.languages.typescript.ScriptTarget.ESNext,
	jsxFactory: 'React.createElement',
	jsxFragmentFactory: 'React.Fragment',
});

// Configure JavaScript defaults for JSX support
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
	allowJs: true,
	allowSyntheticDefaultImports: true,
	esModuleInterop: true,
	jsx: monaco.languages.typescript.JsxEmit.React,
	moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
	module: monaco.languages.typescript.ModuleKind.ESNext,
	target: monaco.languages.typescript.ScriptTarget.ESNext,
	jsxFactory: 'React.createElement',
	jsxFragmentFactory: 'React.Fragment',
});

export type MonacoEditorProps = React.ComponentProps<'div'> & {
	createOptions?: monaco.editor.IStandaloneEditorConstructionOptions;
	find?: string;
	replace?: string;
};

/**
 * TODO: Create a file map to properly manage multiple files in monaco
 */

export const MonacoEditor = memo<MonacoEditorProps>(function MonacoEditor({
	createOptions = {},
	find,
	replace,
	...props
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const editor = useRef<monaco.editor.IStandaloneCodeEditor>(undefined);
	const prevValue = useRef<string>(createOptions.value || '');
	const stickyScroll = useRef(true);
	const { theme } = useTheme();


	useEffect(() => {
		editor.current = monaco.editor.create(containerRef.current!, {
			language: createOptions.language || 'typescript',
			minimap: { enabled: false },
			automaticLayout: true,
			value: defaultCode,
			fontSize: 13,
			...createOptions,
			// Theme resolution is owned by this component (it must follow the live
			// `.dark` class), so it is applied last and intentionally overrides any
			// `theme` passed through createOptions.
			theme: effectiveEditorTheme(),
		});

		// Add scroll listener to detect user interaction
		const editorDomNode = editor.current.getDomNode();
		if (editorDomNode) {
			editorDomNode.addEventListener('wheel', () => {
				if (stickyScroll.current) {
					stickyScroll.current = false;
				}
			});

			editorDomNode.addEventListener('keydown', (e) => {
				// Disable sticky scroll on arrow keys, Page Up/Down
				if (e.key.includes('Arrow') || e.key.includes('Page')) {
					if (stickyScroll.current) {
						stickyScroll.current = false;
					}
				}
			});
		}

		return () => {
			editor.current?.dispose();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (editor.current && createOptions.value !== prevValue.current) {
			const model = editor.current.getModel();
			if (!model) return;

			editor.current.setValue(createOptions.value || '');

			if (stickyScroll.current) {
				// Scroll to bottom
				const lineCount = model.getLineCount();
				editor.current.revealLine(lineCount);
			}

			if (createOptions.language) {
				monaco.editor.setModelLanguage(model, createOptions.language);
			}

			prevValue.current = createOptions.value || '';
		}
	}, [createOptions.value, createOptions.language]);

	useEffect(() => {
		if (!editor.current || !find) return;

		const model = editor.current.getModel();
		if (!model) return;

		const decorations: monaco.editor.IModelDeltaDecoration[] = [];
		const text = model.getValue();
		let match: RegExpExecArray | null;
		const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

		while ((match = regex.exec(text)) !== null) {
			const startPos = model.getPositionAt(match.index);
			const endPos = model.getPositionAt(match.index + match[0].length);

			decorations.push({
				range: new monaco.Range(
					startPos.lineNumber,
					startPos.column,
					endPos.lineNumber,
					endPos.column,
				),
				options: {
					inlineClassName: 'diffDelete',
					hoverMessage: {
						value: replace
							? `Will be replaced with: ${replace}`
							: 'Will be deleted',
					},
				},
			});

			if (replace) {
				decorations.push({
					range: new monaco.Range(
						startPos.lineNumber,
						startPos.column,
						endPos.lineNumber,
						endPos.column,
					),
					options: {
						after: {
							content: replace,
							inlineClassName: 'diffInsert',
						},
					},
				});
			}
		}

		const oldDecorations = editor.current.getModel()?.getAllDecorations() || [];
		editor.current.deltaDecorations(
			oldDecorations.map((d) => d.id),
			decorations,
		);
	}, [find, replace]);

	// Update theme when app theme changes
	useEffect(() => {
		if (editor.current) {
			monaco.editor.setTheme(effectiveEditorTheme());
		}
	}, [theme]);

	return <div {...props} ref={containerRef}></div>;
});
