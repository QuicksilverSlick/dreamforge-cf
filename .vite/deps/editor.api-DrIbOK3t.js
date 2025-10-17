import { __export } from "./chunk-DbKvDyjX.js";
import { $, ActionBar, ActionRunner, ActionRunnerWithContext, ActionViewItem, ApplyUpdateResult, AriaLabelProvider, BareFontInfo, BaseActionViewItem, BidirectionalMap, BrowserFeatures, BugIndicatingError, Button, COI, CONTEXT_ACCESSIBILITY_MODE_ENABLED, CancellationToken, CancellationTokenSource as CancellationTokenSource$1, CharacterClassifier, CodeEditorWidget, Codicon, Color, ColorScheme, CommandsRegistry, ConfigurationChangedEvent, ConsoleLogger, ContextKeyExpr, CountBadge, DataUri, DebounceEmitter, DefaultLinesDiffComputer, DeferredPromise, DetailedLineRangeMapping, DiffEditorWidget, Dimension, Disposable, DisposableStore, DomEmitter, DomScrollableElement, EDITOR_FONT_DEFAULTS, EDITOR_MODEL_DEFAULTS, EditOperation, EditorCommand, EditorContextKeys, EditorOptions, EditorType, EditorZoom, ElectronAcceleratorLabelProvider, Emitter as Emitter$1, EmptySubmenuAction, EncodedTokenizationResult, Event, EventBufferer, EventHelper, EventType, EventType$1, Extensions as Extensions$2, Extensions$1, Extensions$2 as Extensions, FileAccess, FindInput, FindMatch, FoldingRangeKind, FontInfo, FontMeasurements, FormattingConflicts, Gesture, GlobalIdleValue, HSLA, HoverAction, HoverWidget as HoverWidget$1, IAccessibilityService, IAccessibilitySignalService, IBulkEditService, IClipboardService, ICodeEditorService, ICommandService, IConfigurationService, IContextKeyService, IContextMenuService, IContextViewService, IDialogService, IEditorProgressService, IEditorWorkerService, IEnvironmentService, IHoverService, IInstantiationService, IKeybindingService, ILabelService, ILanguageConfigurationService, ILanguageFeaturesService, ILanguageService, IListService, ILogService, IME, IMMUTABLE_CODE_TO_KEY_CODE, IMarkerDecorationsService, IMarkerService, IMenuService, IModelService, INotificationService, IOpenerService, IProgressService, IQuickInputService, ISemanticTokensStylingService, IStorageService, ITelemetryService, ITextModelService, ITextResourceConfigurationService, ITextResourcePropertiesService, IThemeService, ITreeSitterParserService, IUndoRedoService, IWorkspaceContextService, IWorkspaceTrustManagementService, IconLabel, IdGenerator, ImmortalReference, InMemoryStorageService, InputFocusedContext, InternalEditorAction, IntervalTimer, ItemActivation, Iterable, KeyChord, KeyCodeChord, KeyCodeUtils, KeybindingLabel, KeybindingsRegistry, Lazy, LazyTokenizationSupport, LcsDiff, LineRange, LineRangeMapping, LineTokens, LinesDiff, LinkedList, ListService, MarkdownRenderer, MarkerSeverity as MarkerSeverity$1, MenuId, MenuRegistry, MenuService, MenuWorkbenchToolBar, Mimes, ModesRegistry, ModifierKeyEmitter, MovedText, MultiplexLogger, MutableDisposable, NO_KEY_MODS, NoOpNotification, NullState, OS, OVERRIDE_PROPERTY_REGEX, ObservableElementSizeObserver, OffsetRange, OverviewRulerLane, PLAINTEXT_LANGUAGE_ID, PauseableEmitter, Position as Position$1, PrefixSumComputer, QuickInputButtonLocation, QuickInputHideReason, QuickPickFocus, Range as Range$2, Range$1, RangeMapping, RawContextKey, Registry, RenderIndentGuides, RenderLineInput, ResolvedChord, ResolvedKeybinding, ResourceEdit, ResourceEditStackSnapshot, ResourceMap, ResourceTextEdit, RunOnceScheduler, STANDALONE_EDITOR_WORKSPACE_ID, Schemas, Scrollable, SelectedSuggestionInfo, Selection as Selection$1, SemanticTokensProviderStyling, Separator, ServiceCollection, SmoothScrollableElement, StandaloneCodeEditorNLS, StandaloneServicesNLS, StandardKeyboardEvent, StandardMouseEvent, StopWatch, StringSHA1, SubmenuAction, SyncDescriptor, TernarySearchTree, TextModel, TextModelResolvedOptions, Themable, ThemeIcon, ThrottledDelayer, TimeoutTimer, Toggle, Token as Token$1, TokenMetadata, TokenizationRegistry, TokenizationResult, UILabelProvider, URI, UndoRedoGroup, UndoRedoSource, UnicodeTextModelHighlighter, UserSettingsLabelProvider, ViewLineRenderingData, Widget, WindowIntervalTimer, WorkbenchHoverDelegate, WorkbenchObjectTree, WorkspaceFolder, _util, activeContrastBorder, addDisposableListener, addMatchMediaChangeListener, addStandardDisposableListener, addToValueTree, append, asCSSPropertyValue, asCSSUrl, asCssVariable, asCssVariableName, assertFn, autorun, autorunWithStore, basename, basename$1, canceled, checkAdjacentItems, clearNode, cloneAndChange, coalesce, combinedDisposable, compareBy, createActionViewItem, createAndFillInContextMenuActions, createCSSRule, createDecorator, createProxyObject, createSingleCallFunction, createStyleSheet, createTrustedTypesPolicy, decodeKeybinding, deepClone, deepFreeze, defaultButtonStyles, defaultCountBadgeStyles, defaultInputBoxStyles, defaultKeybindingLabelStyles, defaultMenuStyles, defaultProgressBarStyles, defaultToggleStyles, derived, derivedWithStore, diffSets, disposableObservableValue, dispose, distinct, editorActiveIndentGuide1, editorBackground, editorForeground, editorHoverBorder, editorInactiveSelection, editorIndentGuide1, editorSelectionHighlight, ensureValidWordDefinition, equals as equals$1, equals$1 as equals, escape, expressionsAreEqualWithConstantSubstitution, extractSelection, findFirstMax, firstNonWhitespaceIndex, firstOrDefault, format, getActiveDocument, getActiveElement, getActiveWindow, getAllMethodNames, getClientArea, getCodiconAriaLabel, getCodiconFontCharacters, getConfigurationValue, getDomNodePagePosition, getDomNodeZoomLevel, getEditorFeatures, getHoverAccessibleViewHint, getIconRegistry, getListStyles, getNLSLanguage, getNLSMessages, getSingletonServiceDescriptors, getTotalHeight, getTotalWidth, getWindow, getWordAtText, globalTransaction, h, hash, hide, illegalArgument, illegalState, implies, isAncestor, isAncestorOfActiveElement, isCancellationError, isDark, isDiffEditorConfigurationKey, isDisposable, isEditStackElement, isEditorConfigurationKey, isEventLike, isFalsyOrEmpty, isFirefox, isFunction, isHTMLAnchorElement, isHTMLElement, isHighContrast, isIOS, isInShadowDOM, isLinux, isMacintosh, isMarkdownString, isMouseEvent, isNonEmptyArray, isObject, isSafari, isString as isString$1, isUpperAsciiLetter, isWeb, isWebkitWebView, lastNonWhitespaceIndex, localize, ltrim, mainWindow, matchesFuzzyIconAware, matchesScheme, matchesSomeScheme, memoize, minimapError, minimapInfo, minimapWarning, normalizePath, nullTokenize, nullTokenizeEncoded, numberComparator, observableCodeEditor, observableFromEvent, observableValue, observableValueOpts, onDidRegisterWindow, onUnexpectedError, onWillUnregisterWindow, openLinkFromMarkdown, overrideIdentifiersFromKey, overviewRulerError, overviewRulerInfo, overviewRulerWarning, parse as parse$1, parse$1 as parse, parseLabelWithIcons, pickerGroupBorder, pickerGroupForeground, posix, prepend, quickInputBackground, quickInputForeground, quickInputListFocusBackground, quickInputListFocusForeground, quickInputListFocusIconForeground, quickInputTitleBackground, readHotReloadableExport, recomputeInitiallyAndOnChange, regExpLeadsToEndlessLoop, registerColor, registerEditorContribution, registerSingleton, registerThemingParticipant, removeFromValueTree, renderLabelWithIcons, renderViewLine2, reset, rtrim, scheduleAtNextAnimationFrame, score, setARIAContainer, setBaseLayerHoverDelegate, setHoverDelegateFactory, severity_default, shouldSynchronizeModel, show, splitLines, startsWithUTF8BOM, status, stringDiff, stripIcons, themeColorFromId, timeout, toDisposable, toValuesTree, trackFocus, transaction, transformErrorForSerialization, widgetBorder, widgetShadow, windowOpenNoOpener } from "./standaloneStrings-CqRzS2r_.js";
import "/home/bishop/projects/dreamforge/node_modules/monaco-editor/esm/vs/editor/standalone/browser/standalone-tokens.css";
import "/home/bishop/projects/dreamforge/node_modules/monaco-editor/esm/vs/editor/browser/services/hoverService/hover.css";
import "/home/bishop/projects/dreamforge/node_modules/monaco-editor/esm/vs/base/browser/ui/contextview/contextview.css";
import "/home/bishop/projects/dreamforge/node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickInput/standaloneQuickInput.css";
import "/home/bishop/projects/dreamforge/node_modules/monaco-editor/esm/vs/platform/quickinput/browser/media/quickInput.css";
import "/home/bishop/projects/dreamforge/node_modules/monaco-editor/esm/vs/base/browser/ui/progressbar/progressbar.css";
import "/home/bishop/projects/dreamforge/node_modules/monaco-editor/esm/vs/editor/browser/widget/multiDiffEditor/style.css";

//#region node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneEnums.js
var AccessibilitySupport;
(function(AccessibilitySupport$1) {
	/**
	* This should be the browser case where it is not known if a screen reader is attached or no.
	*/
	AccessibilitySupport$1[AccessibilitySupport$1["Unknown"] = 0] = "Unknown";
	AccessibilitySupport$1[AccessibilitySupport$1["Disabled"] = 1] = "Disabled";
	AccessibilitySupport$1[AccessibilitySupport$1["Enabled"] = 2] = "Enabled";
})(AccessibilitySupport || (AccessibilitySupport = {}));
var CodeActionTriggerType;
(function(CodeActionTriggerType$1) {
	CodeActionTriggerType$1[CodeActionTriggerType$1["Invoke"] = 1] = "Invoke";
	CodeActionTriggerType$1[CodeActionTriggerType$1["Auto"] = 2] = "Auto";
})(CodeActionTriggerType || (CodeActionTriggerType = {}));
var CompletionItemInsertTextRule;
(function(CompletionItemInsertTextRule$1) {
	CompletionItemInsertTextRule$1[CompletionItemInsertTextRule$1["None"] = 0] = "None";
	/**
	* Adjust whitespace/indentation of multiline insert texts to
	* match the current line indentation.
	*/
	CompletionItemInsertTextRule$1[CompletionItemInsertTextRule$1["KeepWhitespace"] = 1] = "KeepWhitespace";
	/**
	* `insertText` is a snippet.
	*/
	CompletionItemInsertTextRule$1[CompletionItemInsertTextRule$1["InsertAsSnippet"] = 4] = "InsertAsSnippet";
})(CompletionItemInsertTextRule || (CompletionItemInsertTextRule = {}));
var CompletionItemKind;
(function(CompletionItemKind$1) {
	CompletionItemKind$1[CompletionItemKind$1["Method"] = 0] = "Method";
	CompletionItemKind$1[CompletionItemKind$1["Function"] = 1] = "Function";
	CompletionItemKind$1[CompletionItemKind$1["Constructor"] = 2] = "Constructor";
	CompletionItemKind$1[CompletionItemKind$1["Field"] = 3] = "Field";
	CompletionItemKind$1[CompletionItemKind$1["Variable"] = 4] = "Variable";
	CompletionItemKind$1[CompletionItemKind$1["Class"] = 5] = "Class";
	CompletionItemKind$1[CompletionItemKind$1["Struct"] = 6] = "Struct";
	CompletionItemKind$1[CompletionItemKind$1["Interface"] = 7] = "Interface";
	CompletionItemKind$1[CompletionItemKind$1["Module"] = 8] = "Module";
	CompletionItemKind$1[CompletionItemKind$1["Property"] = 9] = "Property";
	CompletionItemKind$1[CompletionItemKind$1["Event"] = 10] = "Event";
	CompletionItemKind$1[CompletionItemKind$1["Operator"] = 11] = "Operator";
	CompletionItemKind$1[CompletionItemKind$1["Unit"] = 12] = "Unit";
	CompletionItemKind$1[CompletionItemKind$1["Value"] = 13] = "Value";
	CompletionItemKind$1[CompletionItemKind$1["Constant"] = 14] = "Constant";
	CompletionItemKind$1[CompletionItemKind$1["Enum"] = 15] = "Enum";
	CompletionItemKind$1[CompletionItemKind$1["EnumMember"] = 16] = "EnumMember";
	CompletionItemKind$1[CompletionItemKind$1["Keyword"] = 17] = "Keyword";
	CompletionItemKind$1[CompletionItemKind$1["Text"] = 18] = "Text";
	CompletionItemKind$1[CompletionItemKind$1["Color"] = 19] = "Color";
	CompletionItemKind$1[CompletionItemKind$1["File"] = 20] = "File";
	CompletionItemKind$1[CompletionItemKind$1["Reference"] = 21] = "Reference";
	CompletionItemKind$1[CompletionItemKind$1["Customcolor"] = 22] = "Customcolor";
	CompletionItemKind$1[CompletionItemKind$1["Folder"] = 23] = "Folder";
	CompletionItemKind$1[CompletionItemKind$1["TypeParameter"] = 24] = "TypeParameter";
	CompletionItemKind$1[CompletionItemKind$1["User"] = 25] = "User";
	CompletionItemKind$1[CompletionItemKind$1["Issue"] = 26] = "Issue";
	CompletionItemKind$1[CompletionItemKind$1["Snippet"] = 27] = "Snippet";
})(CompletionItemKind || (CompletionItemKind = {}));
var CompletionItemTag;
(function(CompletionItemTag$1) {
	CompletionItemTag$1[CompletionItemTag$1["Deprecated"] = 1] = "Deprecated";
})(CompletionItemTag || (CompletionItemTag = {}));
/**
* How a suggest provider was triggered.
*/
var CompletionTriggerKind;
(function(CompletionTriggerKind$1) {
	CompletionTriggerKind$1[CompletionTriggerKind$1["Invoke"] = 0] = "Invoke";
	CompletionTriggerKind$1[CompletionTriggerKind$1["TriggerCharacter"] = 1] = "TriggerCharacter";
	CompletionTriggerKind$1[CompletionTriggerKind$1["TriggerForIncompleteCompletions"] = 2] = "TriggerForIncompleteCompletions";
})(CompletionTriggerKind || (CompletionTriggerKind = {}));
/**
* A positioning preference for rendering content widgets.
*/
var ContentWidgetPositionPreference;
(function(ContentWidgetPositionPreference$1) {
	/**
	* Place the content widget exactly at a position
	*/
	ContentWidgetPositionPreference$1[ContentWidgetPositionPreference$1["EXACT"] = 0] = "EXACT";
	/**
	* Place the content widget above a position
	*/
	ContentWidgetPositionPreference$1[ContentWidgetPositionPreference$1["ABOVE"] = 1] = "ABOVE";
	/**
	* Place the content widget below a position
	*/
	ContentWidgetPositionPreference$1[ContentWidgetPositionPreference$1["BELOW"] = 2] = "BELOW";
})(ContentWidgetPositionPreference || (ContentWidgetPositionPreference = {}));
/**
* Describes the reason the cursor has changed its position.
*/
var CursorChangeReason;
(function(CursorChangeReason$1) {
	/**
	* Unknown or not set.
	*/
	CursorChangeReason$1[CursorChangeReason$1["NotSet"] = 0] = "NotSet";
	/**
	* A `model.setValue()` was called.
	*/
	CursorChangeReason$1[CursorChangeReason$1["ContentFlush"] = 1] = "ContentFlush";
	/**
	* The `model` has been changed outside of this cursor and the cursor recovers its position from associated markers.
	*/
	CursorChangeReason$1[CursorChangeReason$1["RecoverFromMarkers"] = 2] = "RecoverFromMarkers";
	/**
	* There was an explicit user gesture.
	*/
	CursorChangeReason$1[CursorChangeReason$1["Explicit"] = 3] = "Explicit";
	/**
	* There was a Paste.
	*/
	CursorChangeReason$1[CursorChangeReason$1["Paste"] = 4] = "Paste";
	/**
	* There was an Undo.
	*/
	CursorChangeReason$1[CursorChangeReason$1["Undo"] = 5] = "Undo";
	/**
	* There was a Redo.
	*/
	CursorChangeReason$1[CursorChangeReason$1["Redo"] = 6] = "Redo";
})(CursorChangeReason || (CursorChangeReason = {}));
/**
* The default end of line to use when instantiating models.
*/
var DefaultEndOfLine;
(function(DefaultEndOfLine$1) {
	/**
	* Use line feed (\n) as the end of line character.
	*/
	DefaultEndOfLine$1[DefaultEndOfLine$1["LF"] = 1] = "LF";
	/**
	* Use carriage return and line feed (\r\n) as the end of line character.
	*/
	DefaultEndOfLine$1[DefaultEndOfLine$1["CRLF"] = 2] = "CRLF";
})(DefaultEndOfLine || (DefaultEndOfLine = {}));
/**
* A document highlight kind.
*/
var DocumentHighlightKind;
(function(DocumentHighlightKind$1) {
	/**
	* A textual occurrence.
	*/
	DocumentHighlightKind$1[DocumentHighlightKind$1["Text"] = 0] = "Text";
	/**
	* Read-access of a symbol, like reading a variable.
	*/
	DocumentHighlightKind$1[DocumentHighlightKind$1["Read"] = 1] = "Read";
	/**
	* Write-access of a symbol, like writing to a variable.
	*/
	DocumentHighlightKind$1[DocumentHighlightKind$1["Write"] = 2] = "Write";
})(DocumentHighlightKind || (DocumentHighlightKind = {}));
/**
* Configuration options for auto indentation in the editor
*/
var EditorAutoIndentStrategy;
(function(EditorAutoIndentStrategy$1) {
	EditorAutoIndentStrategy$1[EditorAutoIndentStrategy$1["None"] = 0] = "None";
	EditorAutoIndentStrategy$1[EditorAutoIndentStrategy$1["Keep"] = 1] = "Keep";
	EditorAutoIndentStrategy$1[EditorAutoIndentStrategy$1["Brackets"] = 2] = "Brackets";
	EditorAutoIndentStrategy$1[EditorAutoIndentStrategy$1["Advanced"] = 3] = "Advanced";
	EditorAutoIndentStrategy$1[EditorAutoIndentStrategy$1["Full"] = 4] = "Full";
})(EditorAutoIndentStrategy || (EditorAutoIndentStrategy = {}));
var EditorOption;
(function(EditorOption$1) {
	EditorOption$1[EditorOption$1["acceptSuggestionOnCommitCharacter"] = 0] = "acceptSuggestionOnCommitCharacter";
	EditorOption$1[EditorOption$1["acceptSuggestionOnEnter"] = 1] = "acceptSuggestionOnEnter";
	EditorOption$1[EditorOption$1["accessibilitySupport"] = 2] = "accessibilitySupport";
	EditorOption$1[EditorOption$1["accessibilityPageSize"] = 3] = "accessibilityPageSize";
	EditorOption$1[EditorOption$1["ariaLabel"] = 4] = "ariaLabel";
	EditorOption$1[EditorOption$1["ariaRequired"] = 5] = "ariaRequired";
	EditorOption$1[EditorOption$1["autoClosingBrackets"] = 6] = "autoClosingBrackets";
	EditorOption$1[EditorOption$1["autoClosingComments"] = 7] = "autoClosingComments";
	EditorOption$1[EditorOption$1["screenReaderAnnounceInlineSuggestion"] = 8] = "screenReaderAnnounceInlineSuggestion";
	EditorOption$1[EditorOption$1["autoClosingDelete"] = 9] = "autoClosingDelete";
	EditorOption$1[EditorOption$1["autoClosingOvertype"] = 10] = "autoClosingOvertype";
	EditorOption$1[EditorOption$1["autoClosingQuotes"] = 11] = "autoClosingQuotes";
	EditorOption$1[EditorOption$1["autoIndent"] = 12] = "autoIndent";
	EditorOption$1[EditorOption$1["automaticLayout"] = 13] = "automaticLayout";
	EditorOption$1[EditorOption$1["autoSurround"] = 14] = "autoSurround";
	EditorOption$1[EditorOption$1["bracketPairColorization"] = 15] = "bracketPairColorization";
	EditorOption$1[EditorOption$1["guides"] = 16] = "guides";
	EditorOption$1[EditorOption$1["codeLens"] = 17] = "codeLens";
	EditorOption$1[EditorOption$1["codeLensFontFamily"] = 18] = "codeLensFontFamily";
	EditorOption$1[EditorOption$1["codeLensFontSize"] = 19] = "codeLensFontSize";
	EditorOption$1[EditorOption$1["colorDecorators"] = 20] = "colorDecorators";
	EditorOption$1[EditorOption$1["colorDecoratorsLimit"] = 21] = "colorDecoratorsLimit";
	EditorOption$1[EditorOption$1["columnSelection"] = 22] = "columnSelection";
	EditorOption$1[EditorOption$1["comments"] = 23] = "comments";
	EditorOption$1[EditorOption$1["contextmenu"] = 24] = "contextmenu";
	EditorOption$1[EditorOption$1["copyWithSyntaxHighlighting"] = 25] = "copyWithSyntaxHighlighting";
	EditorOption$1[EditorOption$1["cursorBlinking"] = 26] = "cursorBlinking";
	EditorOption$1[EditorOption$1["cursorSmoothCaretAnimation"] = 27] = "cursorSmoothCaretAnimation";
	EditorOption$1[EditorOption$1["cursorStyle"] = 28] = "cursorStyle";
	EditorOption$1[EditorOption$1["cursorSurroundingLines"] = 29] = "cursorSurroundingLines";
	EditorOption$1[EditorOption$1["cursorSurroundingLinesStyle"] = 30] = "cursorSurroundingLinesStyle";
	EditorOption$1[EditorOption$1["cursorWidth"] = 31] = "cursorWidth";
	EditorOption$1[EditorOption$1["disableLayerHinting"] = 32] = "disableLayerHinting";
	EditorOption$1[EditorOption$1["disableMonospaceOptimizations"] = 33] = "disableMonospaceOptimizations";
	EditorOption$1[EditorOption$1["domReadOnly"] = 34] = "domReadOnly";
	EditorOption$1[EditorOption$1["dragAndDrop"] = 35] = "dragAndDrop";
	EditorOption$1[EditorOption$1["dropIntoEditor"] = 36] = "dropIntoEditor";
	EditorOption$1[EditorOption$1["emptySelectionClipboard"] = 37] = "emptySelectionClipboard";
	EditorOption$1[EditorOption$1["experimentalWhitespaceRendering"] = 38] = "experimentalWhitespaceRendering";
	EditorOption$1[EditorOption$1["extraEditorClassName"] = 39] = "extraEditorClassName";
	EditorOption$1[EditorOption$1["fastScrollSensitivity"] = 40] = "fastScrollSensitivity";
	EditorOption$1[EditorOption$1["find"] = 41] = "find";
	EditorOption$1[EditorOption$1["fixedOverflowWidgets"] = 42] = "fixedOverflowWidgets";
	EditorOption$1[EditorOption$1["folding"] = 43] = "folding";
	EditorOption$1[EditorOption$1["foldingStrategy"] = 44] = "foldingStrategy";
	EditorOption$1[EditorOption$1["foldingHighlight"] = 45] = "foldingHighlight";
	EditorOption$1[EditorOption$1["foldingImportsByDefault"] = 46] = "foldingImportsByDefault";
	EditorOption$1[EditorOption$1["foldingMaximumRegions"] = 47] = "foldingMaximumRegions";
	EditorOption$1[EditorOption$1["unfoldOnClickAfterEndOfLine"] = 48] = "unfoldOnClickAfterEndOfLine";
	EditorOption$1[EditorOption$1["fontFamily"] = 49] = "fontFamily";
	EditorOption$1[EditorOption$1["fontInfo"] = 50] = "fontInfo";
	EditorOption$1[EditorOption$1["fontLigatures"] = 51] = "fontLigatures";
	EditorOption$1[EditorOption$1["fontSize"] = 52] = "fontSize";
	EditorOption$1[EditorOption$1["fontWeight"] = 53] = "fontWeight";
	EditorOption$1[EditorOption$1["fontVariations"] = 54] = "fontVariations";
	EditorOption$1[EditorOption$1["formatOnPaste"] = 55] = "formatOnPaste";
	EditorOption$1[EditorOption$1["formatOnType"] = 56] = "formatOnType";
	EditorOption$1[EditorOption$1["glyphMargin"] = 57] = "glyphMargin";
	EditorOption$1[EditorOption$1["gotoLocation"] = 58] = "gotoLocation";
	EditorOption$1[EditorOption$1["hideCursorInOverviewRuler"] = 59] = "hideCursorInOverviewRuler";
	EditorOption$1[EditorOption$1["hover"] = 60] = "hover";
	EditorOption$1[EditorOption$1["inDiffEditor"] = 61] = "inDiffEditor";
	EditorOption$1[EditorOption$1["inlineSuggest"] = 62] = "inlineSuggest";
	EditorOption$1[EditorOption$1["inlineEdit"] = 63] = "inlineEdit";
	EditorOption$1[EditorOption$1["letterSpacing"] = 64] = "letterSpacing";
	EditorOption$1[EditorOption$1["lightbulb"] = 65] = "lightbulb";
	EditorOption$1[EditorOption$1["lineDecorationsWidth"] = 66] = "lineDecorationsWidth";
	EditorOption$1[EditorOption$1["lineHeight"] = 67] = "lineHeight";
	EditorOption$1[EditorOption$1["lineNumbers"] = 68] = "lineNumbers";
	EditorOption$1[EditorOption$1["lineNumbersMinChars"] = 69] = "lineNumbersMinChars";
	EditorOption$1[EditorOption$1["linkedEditing"] = 70] = "linkedEditing";
	EditorOption$1[EditorOption$1["links"] = 71] = "links";
	EditorOption$1[EditorOption$1["matchBrackets"] = 72] = "matchBrackets";
	EditorOption$1[EditorOption$1["minimap"] = 73] = "minimap";
	EditorOption$1[EditorOption$1["mouseStyle"] = 74] = "mouseStyle";
	EditorOption$1[EditorOption$1["mouseWheelScrollSensitivity"] = 75] = "mouseWheelScrollSensitivity";
	EditorOption$1[EditorOption$1["mouseWheelZoom"] = 76] = "mouseWheelZoom";
	EditorOption$1[EditorOption$1["multiCursorMergeOverlapping"] = 77] = "multiCursorMergeOverlapping";
	EditorOption$1[EditorOption$1["multiCursorModifier"] = 78] = "multiCursorModifier";
	EditorOption$1[EditorOption$1["multiCursorPaste"] = 79] = "multiCursorPaste";
	EditorOption$1[EditorOption$1["multiCursorLimit"] = 80] = "multiCursorLimit";
	EditorOption$1[EditorOption$1["occurrencesHighlight"] = 81] = "occurrencesHighlight";
	EditorOption$1[EditorOption$1["overviewRulerBorder"] = 82] = "overviewRulerBorder";
	EditorOption$1[EditorOption$1["overviewRulerLanes"] = 83] = "overviewRulerLanes";
	EditorOption$1[EditorOption$1["padding"] = 84] = "padding";
	EditorOption$1[EditorOption$1["pasteAs"] = 85] = "pasteAs";
	EditorOption$1[EditorOption$1["parameterHints"] = 86] = "parameterHints";
	EditorOption$1[EditorOption$1["peekWidgetDefaultFocus"] = 87] = "peekWidgetDefaultFocus";
	EditorOption$1[EditorOption$1["placeholder"] = 88] = "placeholder";
	EditorOption$1[EditorOption$1["definitionLinkOpensInPeek"] = 89] = "definitionLinkOpensInPeek";
	EditorOption$1[EditorOption$1["quickSuggestions"] = 90] = "quickSuggestions";
	EditorOption$1[EditorOption$1["quickSuggestionsDelay"] = 91] = "quickSuggestionsDelay";
	EditorOption$1[EditorOption$1["readOnly"] = 92] = "readOnly";
	EditorOption$1[EditorOption$1["readOnlyMessage"] = 93] = "readOnlyMessage";
	EditorOption$1[EditorOption$1["renameOnType"] = 94] = "renameOnType";
	EditorOption$1[EditorOption$1["renderControlCharacters"] = 95] = "renderControlCharacters";
	EditorOption$1[EditorOption$1["renderFinalNewline"] = 96] = "renderFinalNewline";
	EditorOption$1[EditorOption$1["renderLineHighlight"] = 97] = "renderLineHighlight";
	EditorOption$1[EditorOption$1["renderLineHighlightOnlyWhenFocus"] = 98] = "renderLineHighlightOnlyWhenFocus";
	EditorOption$1[EditorOption$1["renderValidationDecorations"] = 99] = "renderValidationDecorations";
	EditorOption$1[EditorOption$1["renderWhitespace"] = 100] = "renderWhitespace";
	EditorOption$1[EditorOption$1["revealHorizontalRightPadding"] = 101] = "revealHorizontalRightPadding";
	EditorOption$1[EditorOption$1["roundedSelection"] = 102] = "roundedSelection";
	EditorOption$1[EditorOption$1["rulers"] = 103] = "rulers";
	EditorOption$1[EditorOption$1["scrollbar"] = 104] = "scrollbar";
	EditorOption$1[EditorOption$1["scrollBeyondLastColumn"] = 105] = "scrollBeyondLastColumn";
	EditorOption$1[EditorOption$1["scrollBeyondLastLine"] = 106] = "scrollBeyondLastLine";
	EditorOption$1[EditorOption$1["scrollPredominantAxis"] = 107] = "scrollPredominantAxis";
	EditorOption$1[EditorOption$1["selectionClipboard"] = 108] = "selectionClipboard";
	EditorOption$1[EditorOption$1["selectionHighlight"] = 109] = "selectionHighlight";
	EditorOption$1[EditorOption$1["selectOnLineNumbers"] = 110] = "selectOnLineNumbers";
	EditorOption$1[EditorOption$1["showFoldingControls"] = 111] = "showFoldingControls";
	EditorOption$1[EditorOption$1["showUnused"] = 112] = "showUnused";
	EditorOption$1[EditorOption$1["snippetSuggestions"] = 113] = "snippetSuggestions";
	EditorOption$1[EditorOption$1["smartSelect"] = 114] = "smartSelect";
	EditorOption$1[EditorOption$1["smoothScrolling"] = 115] = "smoothScrolling";
	EditorOption$1[EditorOption$1["stickyScroll"] = 116] = "stickyScroll";
	EditorOption$1[EditorOption$1["stickyTabStops"] = 117] = "stickyTabStops";
	EditorOption$1[EditorOption$1["stopRenderingLineAfter"] = 118] = "stopRenderingLineAfter";
	EditorOption$1[EditorOption$1["suggest"] = 119] = "suggest";
	EditorOption$1[EditorOption$1["suggestFontSize"] = 120] = "suggestFontSize";
	EditorOption$1[EditorOption$1["suggestLineHeight"] = 121] = "suggestLineHeight";
	EditorOption$1[EditorOption$1["suggestOnTriggerCharacters"] = 122] = "suggestOnTriggerCharacters";
	EditorOption$1[EditorOption$1["suggestSelection"] = 123] = "suggestSelection";
	EditorOption$1[EditorOption$1["tabCompletion"] = 124] = "tabCompletion";
	EditorOption$1[EditorOption$1["tabIndex"] = 125] = "tabIndex";
	EditorOption$1[EditorOption$1["unicodeHighlighting"] = 126] = "unicodeHighlighting";
	EditorOption$1[EditorOption$1["unusualLineTerminators"] = 127] = "unusualLineTerminators";
	EditorOption$1[EditorOption$1["useShadowDOM"] = 128] = "useShadowDOM";
	EditorOption$1[EditorOption$1["useTabStops"] = 129] = "useTabStops";
	EditorOption$1[EditorOption$1["wordBreak"] = 130] = "wordBreak";
	EditorOption$1[EditorOption$1["wordSegmenterLocales"] = 131] = "wordSegmenterLocales";
	EditorOption$1[EditorOption$1["wordSeparators"] = 132] = "wordSeparators";
	EditorOption$1[EditorOption$1["wordWrap"] = 133] = "wordWrap";
	EditorOption$1[EditorOption$1["wordWrapBreakAfterCharacters"] = 134] = "wordWrapBreakAfterCharacters";
	EditorOption$1[EditorOption$1["wordWrapBreakBeforeCharacters"] = 135] = "wordWrapBreakBeforeCharacters";
	EditorOption$1[EditorOption$1["wordWrapColumn"] = 136] = "wordWrapColumn";
	EditorOption$1[EditorOption$1["wordWrapOverride1"] = 137] = "wordWrapOverride1";
	EditorOption$1[EditorOption$1["wordWrapOverride2"] = 138] = "wordWrapOverride2";
	EditorOption$1[EditorOption$1["wrappingIndent"] = 139] = "wrappingIndent";
	EditorOption$1[EditorOption$1["wrappingStrategy"] = 140] = "wrappingStrategy";
	EditorOption$1[EditorOption$1["showDeprecated"] = 141] = "showDeprecated";
	EditorOption$1[EditorOption$1["inlayHints"] = 142] = "inlayHints";
	EditorOption$1[EditorOption$1["editorClassName"] = 143] = "editorClassName";
	EditorOption$1[EditorOption$1["pixelRatio"] = 144] = "pixelRatio";
	EditorOption$1[EditorOption$1["tabFocusMode"] = 145] = "tabFocusMode";
	EditorOption$1[EditorOption$1["layoutInfo"] = 146] = "layoutInfo";
	EditorOption$1[EditorOption$1["wrappingInfo"] = 147] = "wrappingInfo";
	EditorOption$1[EditorOption$1["defaultColorDecorators"] = 148] = "defaultColorDecorators";
	EditorOption$1[EditorOption$1["colorDecoratorsActivatedOn"] = 149] = "colorDecoratorsActivatedOn";
	EditorOption$1[EditorOption$1["inlineCompletionsAccessibilityVerbose"] = 150] = "inlineCompletionsAccessibilityVerbose";
})(EditorOption || (EditorOption = {}));
/**
* End of line character preference.
*/
var EndOfLinePreference;
(function(EndOfLinePreference$1) {
	/**
	* Use the end of line character identified in the text buffer.
	*/
	EndOfLinePreference$1[EndOfLinePreference$1["TextDefined"] = 0] = "TextDefined";
	/**
	* Use line feed (\n) as the end of line character.
	*/
	EndOfLinePreference$1[EndOfLinePreference$1["LF"] = 1] = "LF";
	/**
	* Use carriage return and line feed (\r\n) as the end of line character.
	*/
	EndOfLinePreference$1[EndOfLinePreference$1["CRLF"] = 2] = "CRLF";
})(EndOfLinePreference || (EndOfLinePreference = {}));
/**
* End of line character preference.
*/
var EndOfLineSequence;
(function(EndOfLineSequence$1) {
	/**
	* Use line feed (\n) as the end of line character.
	*/
	EndOfLineSequence$1[EndOfLineSequence$1["LF"] = 0] = "LF";
	/**
	* Use carriage return and line feed (\r\n) as the end of line character.
	*/
	EndOfLineSequence$1[EndOfLineSequence$1["CRLF"] = 1] = "CRLF";
})(EndOfLineSequence || (EndOfLineSequence = {}));
/**
* Vertical Lane in the glyph margin of the editor.
*/
var GlyphMarginLane;
(function(GlyphMarginLane$1) {
	GlyphMarginLane$1[GlyphMarginLane$1["Left"] = 1] = "Left";
	GlyphMarginLane$1[GlyphMarginLane$1["Center"] = 2] = "Center";
	GlyphMarginLane$1[GlyphMarginLane$1["Right"] = 3] = "Right";
})(GlyphMarginLane || (GlyphMarginLane = {}));
var HoverVerbosityAction;
(function(HoverVerbosityAction$1) {
	/**
	* Increase the verbosity of the hover
	*/
	HoverVerbosityAction$1[HoverVerbosityAction$1["Increase"] = 0] = "Increase";
	/**
	* Decrease the verbosity of the hover
	*/
	HoverVerbosityAction$1[HoverVerbosityAction$1["Decrease"] = 1] = "Decrease";
})(HoverVerbosityAction || (HoverVerbosityAction = {}));
/**
* Describes what to do with the indentation when pressing Enter.
*/
var IndentAction;
(function(IndentAction$1) {
	/**
	* Insert new line and copy the previous line's indentation.
	*/
	IndentAction$1[IndentAction$1["None"] = 0] = "None";
	/**
	* Insert new line and indent once (relative to the previous line's indentation).
	*/
	IndentAction$1[IndentAction$1["Indent"] = 1] = "Indent";
	/**
	* Insert two new lines:
	*  - the first one indented which will hold the cursor
	*  - the second one at the same indentation level
	*/
	IndentAction$1[IndentAction$1["IndentOutdent"] = 2] = "IndentOutdent";
	/**
	* Insert new line and outdent once (relative to the previous line's indentation).
	*/
	IndentAction$1[IndentAction$1["Outdent"] = 3] = "Outdent";
})(IndentAction || (IndentAction = {}));
var InjectedTextCursorStops;
(function(InjectedTextCursorStops$1) {
	InjectedTextCursorStops$1[InjectedTextCursorStops$1["Both"] = 0] = "Both";
	InjectedTextCursorStops$1[InjectedTextCursorStops$1["Right"] = 1] = "Right";
	InjectedTextCursorStops$1[InjectedTextCursorStops$1["Left"] = 2] = "Left";
	InjectedTextCursorStops$1[InjectedTextCursorStops$1["None"] = 3] = "None";
})(InjectedTextCursorStops || (InjectedTextCursorStops = {}));
var InlayHintKind;
(function(InlayHintKind$1) {
	InlayHintKind$1[InlayHintKind$1["Type"] = 1] = "Type";
	InlayHintKind$1[InlayHintKind$1["Parameter"] = 2] = "Parameter";
})(InlayHintKind || (InlayHintKind = {}));
/**
* How an {@link InlineCompletionsProvider inline completion provider} was triggered.
*/
var InlineCompletionTriggerKind;
(function(InlineCompletionTriggerKind$1) {
	/**
	* Completion was triggered automatically while editing.
	* It is sufficient to return a single completion item in this case.
	*/
	InlineCompletionTriggerKind$1[InlineCompletionTriggerKind$1["Automatic"] = 0] = "Automatic";
	/**
	* Completion was triggered explicitly by a user gesture.
	* Return multiple completion items to enable cycling through them.
	*/
	InlineCompletionTriggerKind$1[InlineCompletionTriggerKind$1["Explicit"] = 1] = "Explicit";
})(InlineCompletionTriggerKind || (InlineCompletionTriggerKind = {}));
var InlineEditTriggerKind;
(function(InlineEditTriggerKind$1) {
	InlineEditTriggerKind$1[InlineEditTriggerKind$1["Invoke"] = 0] = "Invoke";
	InlineEditTriggerKind$1[InlineEditTriggerKind$1["Automatic"] = 1] = "Automatic";
})(InlineEditTriggerKind || (InlineEditTriggerKind = {}));
/**
* Virtual Key Codes, the value does not hold any inherent meaning.
* Inspired somewhat from https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
* But these are "more general", as they should work across browsers & OS`s.
*/
var KeyCode$1;
(function(KeyCode$2) {
	KeyCode$2[KeyCode$2["DependsOnKbLayout"] = -1] = "DependsOnKbLayout";
	/**
	* Placed first to cover the 0 value of the enum.
	*/
	KeyCode$2[KeyCode$2["Unknown"] = 0] = "Unknown";
	KeyCode$2[KeyCode$2["Backspace"] = 1] = "Backspace";
	KeyCode$2[KeyCode$2["Tab"] = 2] = "Tab";
	KeyCode$2[KeyCode$2["Enter"] = 3] = "Enter";
	KeyCode$2[KeyCode$2["Shift"] = 4] = "Shift";
	KeyCode$2[KeyCode$2["Ctrl"] = 5] = "Ctrl";
	KeyCode$2[KeyCode$2["Alt"] = 6] = "Alt";
	KeyCode$2[KeyCode$2["PauseBreak"] = 7] = "PauseBreak";
	KeyCode$2[KeyCode$2["CapsLock"] = 8] = "CapsLock";
	KeyCode$2[KeyCode$2["Escape"] = 9] = "Escape";
	KeyCode$2[KeyCode$2["Space"] = 10] = "Space";
	KeyCode$2[KeyCode$2["PageUp"] = 11] = "PageUp";
	KeyCode$2[KeyCode$2["PageDown"] = 12] = "PageDown";
	KeyCode$2[KeyCode$2["End"] = 13] = "End";
	KeyCode$2[KeyCode$2["Home"] = 14] = "Home";
	KeyCode$2[KeyCode$2["LeftArrow"] = 15] = "LeftArrow";
	KeyCode$2[KeyCode$2["UpArrow"] = 16] = "UpArrow";
	KeyCode$2[KeyCode$2["RightArrow"] = 17] = "RightArrow";
	KeyCode$2[KeyCode$2["DownArrow"] = 18] = "DownArrow";
	KeyCode$2[KeyCode$2["Insert"] = 19] = "Insert";
	KeyCode$2[KeyCode$2["Delete"] = 20] = "Delete";
	KeyCode$2[KeyCode$2["Digit0"] = 21] = "Digit0";
	KeyCode$2[KeyCode$2["Digit1"] = 22] = "Digit1";
	KeyCode$2[KeyCode$2["Digit2"] = 23] = "Digit2";
	KeyCode$2[KeyCode$2["Digit3"] = 24] = "Digit3";
	KeyCode$2[KeyCode$2["Digit4"] = 25] = "Digit4";
	KeyCode$2[KeyCode$2["Digit5"] = 26] = "Digit5";
	KeyCode$2[KeyCode$2["Digit6"] = 27] = "Digit6";
	KeyCode$2[KeyCode$2["Digit7"] = 28] = "Digit7";
	KeyCode$2[KeyCode$2["Digit8"] = 29] = "Digit8";
	KeyCode$2[KeyCode$2["Digit9"] = 30] = "Digit9";
	KeyCode$2[KeyCode$2["KeyA"] = 31] = "KeyA";
	KeyCode$2[KeyCode$2["KeyB"] = 32] = "KeyB";
	KeyCode$2[KeyCode$2["KeyC"] = 33] = "KeyC";
	KeyCode$2[KeyCode$2["KeyD"] = 34] = "KeyD";
	KeyCode$2[KeyCode$2["KeyE"] = 35] = "KeyE";
	KeyCode$2[KeyCode$2["KeyF"] = 36] = "KeyF";
	KeyCode$2[KeyCode$2["KeyG"] = 37] = "KeyG";
	KeyCode$2[KeyCode$2["KeyH"] = 38] = "KeyH";
	KeyCode$2[KeyCode$2["KeyI"] = 39] = "KeyI";
	KeyCode$2[KeyCode$2["KeyJ"] = 40] = "KeyJ";
	KeyCode$2[KeyCode$2["KeyK"] = 41] = "KeyK";
	KeyCode$2[KeyCode$2["KeyL"] = 42] = "KeyL";
	KeyCode$2[KeyCode$2["KeyM"] = 43] = "KeyM";
	KeyCode$2[KeyCode$2["KeyN"] = 44] = "KeyN";
	KeyCode$2[KeyCode$2["KeyO"] = 45] = "KeyO";
	KeyCode$2[KeyCode$2["KeyP"] = 46] = "KeyP";
	KeyCode$2[KeyCode$2["KeyQ"] = 47] = "KeyQ";
	KeyCode$2[KeyCode$2["KeyR"] = 48] = "KeyR";
	KeyCode$2[KeyCode$2["KeyS"] = 49] = "KeyS";
	KeyCode$2[KeyCode$2["KeyT"] = 50] = "KeyT";
	KeyCode$2[KeyCode$2["KeyU"] = 51] = "KeyU";
	KeyCode$2[KeyCode$2["KeyV"] = 52] = "KeyV";
	KeyCode$2[KeyCode$2["KeyW"] = 53] = "KeyW";
	KeyCode$2[KeyCode$2["KeyX"] = 54] = "KeyX";
	KeyCode$2[KeyCode$2["KeyY"] = 55] = "KeyY";
	KeyCode$2[KeyCode$2["KeyZ"] = 56] = "KeyZ";
	KeyCode$2[KeyCode$2["Meta"] = 57] = "Meta";
	KeyCode$2[KeyCode$2["ContextMenu"] = 58] = "ContextMenu";
	KeyCode$2[KeyCode$2["F1"] = 59] = "F1";
	KeyCode$2[KeyCode$2["F2"] = 60] = "F2";
	KeyCode$2[KeyCode$2["F3"] = 61] = "F3";
	KeyCode$2[KeyCode$2["F4"] = 62] = "F4";
	KeyCode$2[KeyCode$2["F5"] = 63] = "F5";
	KeyCode$2[KeyCode$2["F6"] = 64] = "F6";
	KeyCode$2[KeyCode$2["F7"] = 65] = "F7";
	KeyCode$2[KeyCode$2["F8"] = 66] = "F8";
	KeyCode$2[KeyCode$2["F9"] = 67] = "F9";
	KeyCode$2[KeyCode$2["F10"] = 68] = "F10";
	KeyCode$2[KeyCode$2["F11"] = 69] = "F11";
	KeyCode$2[KeyCode$2["F12"] = 70] = "F12";
	KeyCode$2[KeyCode$2["F13"] = 71] = "F13";
	KeyCode$2[KeyCode$2["F14"] = 72] = "F14";
	KeyCode$2[KeyCode$2["F15"] = 73] = "F15";
	KeyCode$2[KeyCode$2["F16"] = 74] = "F16";
	KeyCode$2[KeyCode$2["F17"] = 75] = "F17";
	KeyCode$2[KeyCode$2["F18"] = 76] = "F18";
	KeyCode$2[KeyCode$2["F19"] = 77] = "F19";
	KeyCode$2[KeyCode$2["F20"] = 78] = "F20";
	KeyCode$2[KeyCode$2["F21"] = 79] = "F21";
	KeyCode$2[KeyCode$2["F22"] = 80] = "F22";
	KeyCode$2[KeyCode$2["F23"] = 81] = "F23";
	KeyCode$2[KeyCode$2["F24"] = 82] = "F24";
	KeyCode$2[KeyCode$2["NumLock"] = 83] = "NumLock";
	KeyCode$2[KeyCode$2["ScrollLock"] = 84] = "ScrollLock";
	/**
	* Used for miscellaneous characters; it can vary by keyboard.
	* For the US standard keyboard, the ';:' key
	*/
	KeyCode$2[KeyCode$2["Semicolon"] = 85] = "Semicolon";
	/**
	* For any country/region, the '+' key
	* For the US standard keyboard, the '=+' key
	*/
	KeyCode$2[KeyCode$2["Equal"] = 86] = "Equal";
	/**
	* For any country/region, the ',' key
	* For the US standard keyboard, the ',<' key
	*/
	KeyCode$2[KeyCode$2["Comma"] = 87] = "Comma";
	/**
	* For any country/region, the '-' key
	* For the US standard keyboard, the '-_' key
	*/
	KeyCode$2[KeyCode$2["Minus"] = 88] = "Minus";
	/**
	* For any country/region, the '.' key
	* For the US standard keyboard, the '.>' key
	*/
	KeyCode$2[KeyCode$2["Period"] = 89] = "Period";
	/**
	* Used for miscellaneous characters; it can vary by keyboard.
	* For the US standard keyboard, the '/?' key
	*/
	KeyCode$2[KeyCode$2["Slash"] = 90] = "Slash";
	/**
	* Used for miscellaneous characters; it can vary by keyboard.
	* For the US standard keyboard, the '`~' key
	*/
	KeyCode$2[KeyCode$2["Backquote"] = 91] = "Backquote";
	/**
	* Used for miscellaneous characters; it can vary by keyboard.
	* For the US standard keyboard, the '[{' key
	*/
	KeyCode$2[KeyCode$2["BracketLeft"] = 92] = "BracketLeft";
	/**
	* Used for miscellaneous characters; it can vary by keyboard.
	* For the US standard keyboard, the '\|' key
	*/
	KeyCode$2[KeyCode$2["Backslash"] = 93] = "Backslash";
	/**
	* Used for miscellaneous characters; it can vary by keyboard.
	* For the US standard keyboard, the ']}' key
	*/
	KeyCode$2[KeyCode$2["BracketRight"] = 94] = "BracketRight";
	/**
	* Used for miscellaneous characters; it can vary by keyboard.
	* For the US standard keyboard, the ''"' key
	*/
	KeyCode$2[KeyCode$2["Quote"] = 95] = "Quote";
	/**
	* Used for miscellaneous characters; it can vary by keyboard.
	*/
	KeyCode$2[KeyCode$2["OEM_8"] = 96] = "OEM_8";
	/**
	* Either the angle bracket key or the backslash key on the RT 102-key keyboard.
	*/
	KeyCode$2[KeyCode$2["IntlBackslash"] = 97] = "IntlBackslash";
	KeyCode$2[KeyCode$2["Numpad0"] = 98] = "Numpad0";
	KeyCode$2[KeyCode$2["Numpad1"] = 99] = "Numpad1";
	KeyCode$2[KeyCode$2["Numpad2"] = 100] = "Numpad2";
	KeyCode$2[KeyCode$2["Numpad3"] = 101] = "Numpad3";
	KeyCode$2[KeyCode$2["Numpad4"] = 102] = "Numpad4";
	KeyCode$2[KeyCode$2["Numpad5"] = 103] = "Numpad5";
	KeyCode$2[KeyCode$2["Numpad6"] = 104] = "Numpad6";
	KeyCode$2[KeyCode$2["Numpad7"] = 105] = "Numpad7";
	KeyCode$2[KeyCode$2["Numpad8"] = 106] = "Numpad8";
	KeyCode$2[KeyCode$2["Numpad9"] = 107] = "Numpad9";
	KeyCode$2[KeyCode$2["NumpadMultiply"] = 108] = "NumpadMultiply";
	KeyCode$2[KeyCode$2["NumpadAdd"] = 109] = "NumpadAdd";
	KeyCode$2[KeyCode$2["NUMPAD_SEPARATOR"] = 110] = "NUMPAD_SEPARATOR";
	KeyCode$2[KeyCode$2["NumpadSubtract"] = 111] = "NumpadSubtract";
	KeyCode$2[KeyCode$2["NumpadDecimal"] = 112] = "NumpadDecimal";
	KeyCode$2[KeyCode$2["NumpadDivide"] = 113] = "NumpadDivide";
	/**
	* Cover all key codes when IME is processing input.
	*/
	KeyCode$2[KeyCode$2["KEY_IN_COMPOSITION"] = 114] = "KEY_IN_COMPOSITION";
	KeyCode$2[KeyCode$2["ABNT_C1"] = 115] = "ABNT_C1";
	KeyCode$2[KeyCode$2["ABNT_C2"] = 116] = "ABNT_C2";
	KeyCode$2[KeyCode$2["AudioVolumeMute"] = 117] = "AudioVolumeMute";
	KeyCode$2[KeyCode$2["AudioVolumeUp"] = 118] = "AudioVolumeUp";
	KeyCode$2[KeyCode$2["AudioVolumeDown"] = 119] = "AudioVolumeDown";
	KeyCode$2[KeyCode$2["BrowserSearch"] = 120] = "BrowserSearch";
	KeyCode$2[KeyCode$2["BrowserHome"] = 121] = "BrowserHome";
	KeyCode$2[KeyCode$2["BrowserBack"] = 122] = "BrowserBack";
	KeyCode$2[KeyCode$2["BrowserForward"] = 123] = "BrowserForward";
	KeyCode$2[KeyCode$2["MediaTrackNext"] = 124] = "MediaTrackNext";
	KeyCode$2[KeyCode$2["MediaTrackPrevious"] = 125] = "MediaTrackPrevious";
	KeyCode$2[KeyCode$2["MediaStop"] = 126] = "MediaStop";
	KeyCode$2[KeyCode$2["MediaPlayPause"] = 127] = "MediaPlayPause";
	KeyCode$2[KeyCode$2["LaunchMediaPlayer"] = 128] = "LaunchMediaPlayer";
	KeyCode$2[KeyCode$2["LaunchMail"] = 129] = "LaunchMail";
	KeyCode$2[KeyCode$2["LaunchApp2"] = 130] = "LaunchApp2";
	/**
	* VK_CLEAR, 0x0C, CLEAR key
	*/
	KeyCode$2[KeyCode$2["Clear"] = 131] = "Clear";
	/**
	* Placed last to cover the length of the enum.
	* Please do not depend on this value!
	*/
	KeyCode$2[KeyCode$2["MAX_VALUE"] = 132] = "MAX_VALUE";
})(KeyCode$1 || (KeyCode$1 = {}));
var MarkerSeverity$2;
(function(MarkerSeverity$3) {
	MarkerSeverity$3[MarkerSeverity$3["Hint"] = 1] = "Hint";
	MarkerSeverity$3[MarkerSeverity$3["Info"] = 2] = "Info";
	MarkerSeverity$3[MarkerSeverity$3["Warning"] = 4] = "Warning";
	MarkerSeverity$3[MarkerSeverity$3["Error"] = 8] = "Error";
})(MarkerSeverity$2 || (MarkerSeverity$2 = {}));
var MarkerTag$1;
(function(MarkerTag$2) {
	MarkerTag$2[MarkerTag$2["Unnecessary"] = 1] = "Unnecessary";
	MarkerTag$2[MarkerTag$2["Deprecated"] = 2] = "Deprecated";
})(MarkerTag$1 || (MarkerTag$1 = {}));
/**
* Position in the minimap to render the decoration.
*/
var MinimapPosition;
(function(MinimapPosition$1) {
	MinimapPosition$1[MinimapPosition$1["Inline"] = 1] = "Inline";
	MinimapPosition$1[MinimapPosition$1["Gutter"] = 2] = "Gutter";
})(MinimapPosition || (MinimapPosition = {}));
/**
* Section header style.
*/
var MinimapSectionHeaderStyle;
(function(MinimapSectionHeaderStyle$1) {
	MinimapSectionHeaderStyle$1[MinimapSectionHeaderStyle$1["Normal"] = 1] = "Normal";
	MinimapSectionHeaderStyle$1[MinimapSectionHeaderStyle$1["Underlined"] = 2] = "Underlined";
})(MinimapSectionHeaderStyle || (MinimapSectionHeaderStyle = {}));
/**
* Type of hit element with the mouse in the editor.
*/
var MouseTargetType;
(function(MouseTargetType$1) {
	/**
	* Mouse is on top of an unknown element.
	*/
	MouseTargetType$1[MouseTargetType$1["UNKNOWN"] = 0] = "UNKNOWN";
	/**
	* Mouse is on top of the textarea used for input.
	*/
	MouseTargetType$1[MouseTargetType$1["TEXTAREA"] = 1] = "TEXTAREA";
	/**
	* Mouse is on top of the glyph margin
	*/
	MouseTargetType$1[MouseTargetType$1["GUTTER_GLYPH_MARGIN"] = 2] = "GUTTER_GLYPH_MARGIN";
	/**
	* Mouse is on top of the line numbers
	*/
	MouseTargetType$1[MouseTargetType$1["GUTTER_LINE_NUMBERS"] = 3] = "GUTTER_LINE_NUMBERS";
	/**
	* Mouse is on top of the line decorations
	*/
	MouseTargetType$1[MouseTargetType$1["GUTTER_LINE_DECORATIONS"] = 4] = "GUTTER_LINE_DECORATIONS";
	/**
	* Mouse is on top of the whitespace left in the gutter by a view zone.
	*/
	MouseTargetType$1[MouseTargetType$1["GUTTER_VIEW_ZONE"] = 5] = "GUTTER_VIEW_ZONE";
	/**
	* Mouse is on top of text in the content.
	*/
	MouseTargetType$1[MouseTargetType$1["CONTENT_TEXT"] = 6] = "CONTENT_TEXT";
	/**
	* Mouse is on top of empty space in the content (e.g. after line text or below last line)
	*/
	MouseTargetType$1[MouseTargetType$1["CONTENT_EMPTY"] = 7] = "CONTENT_EMPTY";
	/**
	* Mouse is on top of a view zone in the content.
	*/
	MouseTargetType$1[MouseTargetType$1["CONTENT_VIEW_ZONE"] = 8] = "CONTENT_VIEW_ZONE";
	/**
	* Mouse is on top of a content widget.
	*/
	MouseTargetType$1[MouseTargetType$1["CONTENT_WIDGET"] = 9] = "CONTENT_WIDGET";
	/**
	* Mouse is on top of the decorations overview ruler.
	*/
	MouseTargetType$1[MouseTargetType$1["OVERVIEW_RULER"] = 10] = "OVERVIEW_RULER";
	/**
	* Mouse is on top of a scrollbar.
	*/
	MouseTargetType$1[MouseTargetType$1["SCROLLBAR"] = 11] = "SCROLLBAR";
	/**
	* Mouse is on top of an overlay widget.
	*/
	MouseTargetType$1[MouseTargetType$1["OVERLAY_WIDGET"] = 12] = "OVERLAY_WIDGET";
	/**
	* Mouse is outside of the editor.
	*/
	MouseTargetType$1[MouseTargetType$1["OUTSIDE_EDITOR"] = 13] = "OUTSIDE_EDITOR";
})(MouseTargetType || (MouseTargetType = {}));
var NewSymbolNameTag;
(function(NewSymbolNameTag$1) {
	NewSymbolNameTag$1[NewSymbolNameTag$1["AIGenerated"] = 1] = "AIGenerated";
})(NewSymbolNameTag || (NewSymbolNameTag = {}));
var NewSymbolNameTriggerKind;
(function(NewSymbolNameTriggerKind$1) {
	NewSymbolNameTriggerKind$1[NewSymbolNameTriggerKind$1["Invoke"] = 0] = "Invoke";
	NewSymbolNameTriggerKind$1[NewSymbolNameTriggerKind$1["Automatic"] = 1] = "Automatic";
})(NewSymbolNameTriggerKind || (NewSymbolNameTriggerKind = {}));
/**
* A positioning preference for rendering overlay widgets.
*/
var OverlayWidgetPositionPreference;
(function(OverlayWidgetPositionPreference$1) {
	/**
	* Position the overlay widget in the top right corner
	*/
	OverlayWidgetPositionPreference$1[OverlayWidgetPositionPreference$1["TOP_RIGHT_CORNER"] = 0] = "TOP_RIGHT_CORNER";
	/**
	* Position the overlay widget in the bottom right corner
	*/
	OverlayWidgetPositionPreference$1[OverlayWidgetPositionPreference$1["BOTTOM_RIGHT_CORNER"] = 1] = "BOTTOM_RIGHT_CORNER";
	/**
	* Position the overlay widget in the top center
	*/
	OverlayWidgetPositionPreference$1[OverlayWidgetPositionPreference$1["TOP_CENTER"] = 2] = "TOP_CENTER";
})(OverlayWidgetPositionPreference || (OverlayWidgetPositionPreference = {}));
/**
* Vertical Lane in the overview ruler of the editor.
*/
var OverviewRulerLane$1;
(function(OverviewRulerLane$2) {
	OverviewRulerLane$2[OverviewRulerLane$2["Left"] = 1] = "Left";
	OverviewRulerLane$2[OverviewRulerLane$2["Center"] = 2] = "Center";
	OverviewRulerLane$2[OverviewRulerLane$2["Right"] = 4] = "Right";
	OverviewRulerLane$2[OverviewRulerLane$2["Full"] = 7] = "Full";
})(OverviewRulerLane$1 || (OverviewRulerLane$1 = {}));
/**
* How a partial acceptance was triggered.
*/
var PartialAcceptTriggerKind;
(function(PartialAcceptTriggerKind$1) {
	PartialAcceptTriggerKind$1[PartialAcceptTriggerKind$1["Word"] = 0] = "Word";
	PartialAcceptTriggerKind$1[PartialAcceptTriggerKind$1["Line"] = 1] = "Line";
	PartialAcceptTriggerKind$1[PartialAcceptTriggerKind$1["Suggest"] = 2] = "Suggest";
})(PartialAcceptTriggerKind || (PartialAcceptTriggerKind = {}));
var PositionAffinity;
(function(PositionAffinity$1) {
	/**
	* Prefers the left most position.
	*/
	PositionAffinity$1[PositionAffinity$1["Left"] = 0] = "Left";
	/**
	* Prefers the right most position.
	*/
	PositionAffinity$1[PositionAffinity$1["Right"] = 1] = "Right";
	/**
	* No preference.
	*/
	PositionAffinity$1[PositionAffinity$1["None"] = 2] = "None";
	/**
	* If the given position is on injected text, prefers the position left of it.
	*/
	PositionAffinity$1[PositionAffinity$1["LeftOfInjectedText"] = 3] = "LeftOfInjectedText";
	/**
	* If the given position is on injected text, prefers the position right of it.
	*/
	PositionAffinity$1[PositionAffinity$1["RightOfInjectedText"] = 4] = "RightOfInjectedText";
})(PositionAffinity || (PositionAffinity = {}));
var RenderLineNumbersType;
(function(RenderLineNumbersType$1) {
	RenderLineNumbersType$1[RenderLineNumbersType$1["Off"] = 0] = "Off";
	RenderLineNumbersType$1[RenderLineNumbersType$1["On"] = 1] = "On";
	RenderLineNumbersType$1[RenderLineNumbersType$1["Relative"] = 2] = "Relative";
	RenderLineNumbersType$1[RenderLineNumbersType$1["Interval"] = 3] = "Interval";
	RenderLineNumbersType$1[RenderLineNumbersType$1["Custom"] = 4] = "Custom";
})(RenderLineNumbersType || (RenderLineNumbersType = {}));
var RenderMinimap;
(function(RenderMinimap$1) {
	RenderMinimap$1[RenderMinimap$1["None"] = 0] = "None";
	RenderMinimap$1[RenderMinimap$1["Text"] = 1] = "Text";
	RenderMinimap$1[RenderMinimap$1["Blocks"] = 2] = "Blocks";
})(RenderMinimap || (RenderMinimap = {}));
var ScrollType;
(function(ScrollType$1) {
	ScrollType$1[ScrollType$1["Smooth"] = 0] = "Smooth";
	ScrollType$1[ScrollType$1["Immediate"] = 1] = "Immediate";
})(ScrollType || (ScrollType = {}));
var ScrollbarVisibility;
(function(ScrollbarVisibility$1) {
	ScrollbarVisibility$1[ScrollbarVisibility$1["Auto"] = 1] = "Auto";
	ScrollbarVisibility$1[ScrollbarVisibility$1["Hidden"] = 2] = "Hidden";
	ScrollbarVisibility$1[ScrollbarVisibility$1["Visible"] = 3] = "Visible";
})(ScrollbarVisibility || (ScrollbarVisibility = {}));
/**
* The direction of a selection.
*/
var SelectionDirection$1;
(function(SelectionDirection$2) {
	/**
	* The selection starts above where it ends.
	*/
	SelectionDirection$2[SelectionDirection$2["LTR"] = 0] = "LTR";
	/**
	* The selection starts below where it ends.
	*/
	SelectionDirection$2[SelectionDirection$2["RTL"] = 1] = "RTL";
})(SelectionDirection$1 || (SelectionDirection$1 = {}));
var ShowLightbulbIconMode;
(function(ShowLightbulbIconMode$1) {
	ShowLightbulbIconMode$1["Off"] = "off";
	ShowLightbulbIconMode$1["OnCode"] = "onCode";
	ShowLightbulbIconMode$1["On"] = "on";
})(ShowLightbulbIconMode || (ShowLightbulbIconMode = {}));
var SignatureHelpTriggerKind;
(function(SignatureHelpTriggerKind$1) {
	SignatureHelpTriggerKind$1[SignatureHelpTriggerKind$1["Invoke"] = 1] = "Invoke";
	SignatureHelpTriggerKind$1[SignatureHelpTriggerKind$1["TriggerCharacter"] = 2] = "TriggerCharacter";
	SignatureHelpTriggerKind$1[SignatureHelpTriggerKind$1["ContentChange"] = 3] = "ContentChange";
})(SignatureHelpTriggerKind || (SignatureHelpTriggerKind = {}));
/**
* A symbol kind.
*/
var SymbolKind;
(function(SymbolKind$1) {
	SymbolKind$1[SymbolKind$1["File"] = 0] = "File";
	SymbolKind$1[SymbolKind$1["Module"] = 1] = "Module";
	SymbolKind$1[SymbolKind$1["Namespace"] = 2] = "Namespace";
	SymbolKind$1[SymbolKind$1["Package"] = 3] = "Package";
	SymbolKind$1[SymbolKind$1["Class"] = 4] = "Class";
	SymbolKind$1[SymbolKind$1["Method"] = 5] = "Method";
	SymbolKind$1[SymbolKind$1["Property"] = 6] = "Property";
	SymbolKind$1[SymbolKind$1["Field"] = 7] = "Field";
	SymbolKind$1[SymbolKind$1["Constructor"] = 8] = "Constructor";
	SymbolKind$1[SymbolKind$1["Enum"] = 9] = "Enum";
	SymbolKind$1[SymbolKind$1["Interface"] = 10] = "Interface";
	SymbolKind$1[SymbolKind$1["Function"] = 11] = "Function";
	SymbolKind$1[SymbolKind$1["Variable"] = 12] = "Variable";
	SymbolKind$1[SymbolKind$1["Constant"] = 13] = "Constant";
	SymbolKind$1[SymbolKind$1["String"] = 14] = "String";
	SymbolKind$1[SymbolKind$1["Number"] = 15] = "Number";
	SymbolKind$1[SymbolKind$1["Boolean"] = 16] = "Boolean";
	SymbolKind$1[SymbolKind$1["Array"] = 17] = "Array";
	SymbolKind$1[SymbolKind$1["Object"] = 18] = "Object";
	SymbolKind$1[SymbolKind$1["Key"] = 19] = "Key";
	SymbolKind$1[SymbolKind$1["Null"] = 20] = "Null";
	SymbolKind$1[SymbolKind$1["EnumMember"] = 21] = "EnumMember";
	SymbolKind$1[SymbolKind$1["Struct"] = 22] = "Struct";
	SymbolKind$1[SymbolKind$1["Event"] = 23] = "Event";
	SymbolKind$1[SymbolKind$1["Operator"] = 24] = "Operator";
	SymbolKind$1[SymbolKind$1["TypeParameter"] = 25] = "TypeParameter";
})(SymbolKind || (SymbolKind = {}));
var SymbolTag;
(function(SymbolTag$1) {
	SymbolTag$1[SymbolTag$1["Deprecated"] = 1] = "Deprecated";
})(SymbolTag || (SymbolTag = {}));
/**
* The kind of animation in which the editor's cursor should be rendered.
*/
var TextEditorCursorBlinkingStyle;
(function(TextEditorCursorBlinkingStyle$1) {
	/**
	* Hidden
	*/
	TextEditorCursorBlinkingStyle$1[TextEditorCursorBlinkingStyle$1["Hidden"] = 0] = "Hidden";
	/**
	* Blinking
	*/
	TextEditorCursorBlinkingStyle$1[TextEditorCursorBlinkingStyle$1["Blink"] = 1] = "Blink";
	/**
	* Blinking with smooth fading
	*/
	TextEditorCursorBlinkingStyle$1[TextEditorCursorBlinkingStyle$1["Smooth"] = 2] = "Smooth";
	/**
	* Blinking with prolonged filled state and smooth fading
	*/
	TextEditorCursorBlinkingStyle$1[TextEditorCursorBlinkingStyle$1["Phase"] = 3] = "Phase";
	/**
	* Expand collapse animation on the y axis
	*/
	TextEditorCursorBlinkingStyle$1[TextEditorCursorBlinkingStyle$1["Expand"] = 4] = "Expand";
	/**
	* No-Blinking
	*/
	TextEditorCursorBlinkingStyle$1[TextEditorCursorBlinkingStyle$1["Solid"] = 5] = "Solid";
})(TextEditorCursorBlinkingStyle || (TextEditorCursorBlinkingStyle = {}));
/**
* The style in which the editor's cursor should be rendered.
*/
var TextEditorCursorStyle;
(function(TextEditorCursorStyle$1) {
	/**
	* As a vertical line (sitting between two characters).
	*/
	TextEditorCursorStyle$1[TextEditorCursorStyle$1["Line"] = 1] = "Line";
	/**
	* As a block (sitting on top of a character).
	*/
	TextEditorCursorStyle$1[TextEditorCursorStyle$1["Block"] = 2] = "Block";
	/**
	* As a horizontal line (sitting under a character).
	*/
	TextEditorCursorStyle$1[TextEditorCursorStyle$1["Underline"] = 3] = "Underline";
	/**
	* As a thin vertical line (sitting between two characters).
	*/
	TextEditorCursorStyle$1[TextEditorCursorStyle$1["LineThin"] = 4] = "LineThin";
	/**
	* As an outlined block (sitting on top of a character).
	*/
	TextEditorCursorStyle$1[TextEditorCursorStyle$1["BlockOutline"] = 5] = "BlockOutline";
	/**
	* As a thin horizontal line (sitting under a character).
	*/
	TextEditorCursorStyle$1[TextEditorCursorStyle$1["UnderlineThin"] = 6] = "UnderlineThin";
})(TextEditorCursorStyle || (TextEditorCursorStyle = {}));
/**
* Describes the behavior of decorations when typing/editing near their edges.
* Note: Please do not edit the values, as they very carefully match `DecorationRangeBehavior`
*/
var TrackedRangeStickiness;
(function(TrackedRangeStickiness$1) {
	TrackedRangeStickiness$1[TrackedRangeStickiness$1["AlwaysGrowsWhenTypingAtEdges"] = 0] = "AlwaysGrowsWhenTypingAtEdges";
	TrackedRangeStickiness$1[TrackedRangeStickiness$1["NeverGrowsWhenTypingAtEdges"] = 1] = "NeverGrowsWhenTypingAtEdges";
	TrackedRangeStickiness$1[TrackedRangeStickiness$1["GrowsOnlyWhenTypingBefore"] = 2] = "GrowsOnlyWhenTypingBefore";
	TrackedRangeStickiness$1[TrackedRangeStickiness$1["GrowsOnlyWhenTypingAfter"] = 3] = "GrowsOnlyWhenTypingAfter";
})(TrackedRangeStickiness || (TrackedRangeStickiness = {}));
/**
* Describes how to indent wrapped lines.
*/
var WrappingIndent;
(function(WrappingIndent$1) {
	/**
	* No indentation => wrapped lines begin at column 1.
	*/
	WrappingIndent$1[WrappingIndent$1["None"] = 0] = "None";
	/**
	* Same => wrapped lines get the same indentation as the parent.
	*/
	WrappingIndent$1[WrappingIndent$1["Same"] = 1] = "Same";
	/**
	* Indent => wrapped lines get +1 indentation toward the parent.
	*/
	WrappingIndent$1[WrappingIndent$1["Indent"] = 2] = "Indent";
	/**
	* DeepIndent => wrapped lines get +2 indentation toward the parent.
	*/
	WrappingIndent$1[WrappingIndent$1["DeepIndent"] = 3] = "DeepIndent";
})(WrappingIndent || (WrappingIndent = {}));

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/services/editorBaseApi.js
var KeyMod$1 = class {
	static {
		this.CtrlCmd = 2048;
	}
	static {
		this.Shift = 1024;
	}
	static {
		this.Alt = 512;
	}
	static {
		this.WinCtrl = 256;
	}
	static chord(firstPart, secondPart) {
		return KeyChord(firstPart, secondPart);
	}
};
function createMonacoBaseAPI() {
	return {
		editor: void 0,
		languages: void 0,
		CancellationTokenSource: CancellationTokenSource$1,
		Emitter: Emitter$1,
		KeyCode: KeyCode$1,
		KeyMod: KeyMod$1,
		Position: Position$1,
		Range: Range$1,
		Selection: Selection$1,
		SelectionDirection: SelectionDirection$1,
		MarkerSeverity: MarkerSeverity$2,
		MarkerTag: MarkerTag$1,
		Uri: URI,
		Token: Token$1
	};
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/base/common/worker/simpleWorker.js
var DEFAULT_CHANNEL = "default";
var INITIALIZE = "$initialize";
var webWorkerWarningLogged = false;
function logOnceWebWorkerWarning(err) {
	if (!isWeb) return;
	if (!webWorkerWarningLogged) {
		webWorkerWarningLogged = true;
		console.warn("Could not create web worker(s). Falling back to loading web worker code in main thread, which might cause UI freezes. Please see https://github.com/microsoft/monaco-editor#faq");
	}
	console.warn(err.message);
}
var RequestMessage = class {
	constructor(vsWorker, req, channel, method, args) {
		this.vsWorker = vsWorker;
		this.req = req;
		this.channel = channel;
		this.method = method;
		this.args = args;
		this.type = 0;
	}
};
var ReplyMessage = class {
	constructor(vsWorker, seq, res, err) {
		this.vsWorker = vsWorker;
		this.seq = seq;
		this.res = res;
		this.err = err;
		this.type = 1;
	}
};
var SubscribeEventMessage = class {
	constructor(vsWorker, req, channel, eventName, arg) {
		this.vsWorker = vsWorker;
		this.req = req;
		this.channel = channel;
		this.eventName = eventName;
		this.arg = arg;
		this.type = 2;
	}
};
var EventMessage = class {
	constructor(vsWorker, req, event) {
		this.vsWorker = vsWorker;
		this.req = req;
		this.event = event;
		this.type = 3;
	}
};
var UnsubscribeEventMessage = class {
	constructor(vsWorker, req) {
		this.vsWorker = vsWorker;
		this.req = req;
		this.type = 4;
	}
};
var SimpleWorkerProtocol = class {
	constructor(handler) {
		this._workerId = -1;
		this._handler = handler;
		this._lastSentReq = 0;
		this._pendingReplies = Object.create(null);
		this._pendingEmitters = /* @__PURE__ */ new Map();
		this._pendingEvents = /* @__PURE__ */ new Map();
	}
	setWorkerId(workerId) {
		this._workerId = workerId;
	}
	sendMessage(channel, method, args) {
		const req = String(++this._lastSentReq);
		return new Promise((resolve, reject) => {
			this._pendingReplies[req] = {
				resolve,
				reject
			};
			this._send(new RequestMessage(this._workerId, req, channel, method, args));
		});
	}
	listen(channel, eventName, arg) {
		let req = null;
		const emitter = new Emitter$1({
			onWillAddFirstListener: () => {
				req = String(++this._lastSentReq);
				this._pendingEmitters.set(req, emitter);
				this._send(new SubscribeEventMessage(this._workerId, req, channel, eventName, arg));
			},
			onDidRemoveLastListener: () => {
				this._pendingEmitters.delete(req);
				this._send(new UnsubscribeEventMessage(this._workerId, req));
				req = null;
			}
		});
		return emitter.event;
	}
	handleMessage(message) {
		if (!message || !message.vsWorker) return;
		if (this._workerId !== -1 && message.vsWorker !== this._workerId) return;
		this._handleMessage(message);
	}
	createProxyToRemoteChannel(channel, sendMessageBarrier) {
		return new Proxy(Object.create(null), { get: (target, name) => {
			if (typeof name === "string" && !target[name]) {
				if (propertyIsDynamicEvent(name)) target[name] = (arg) => {
					return this.listen(channel, name, arg);
				};
				else if (propertyIsEvent(name)) target[name] = this.listen(channel, name, void 0);
				else if (name.charCodeAt(0) === 36) target[name] = async (...myArgs) => {
					await sendMessageBarrier?.();
					return this.sendMessage(channel, name, myArgs);
				};
			}
			return target[name];
		} });
	}
	_handleMessage(msg) {
		switch (msg.type) {
			case 1: return this._handleReplyMessage(msg);
			case 0: return this._handleRequestMessage(msg);
			case 2: return this._handleSubscribeEventMessage(msg);
			case 3: return this._handleEventMessage(msg);
			case 4: return this._handleUnsubscribeEventMessage(msg);
		}
	}
	_handleReplyMessage(replyMessage) {
		if (!this._pendingReplies[replyMessage.seq]) {
			console.warn("Got reply to unknown seq");
			return;
		}
		const reply = this._pendingReplies[replyMessage.seq];
		delete this._pendingReplies[replyMessage.seq];
		if (replyMessage.err) {
			let err = replyMessage.err;
			if (replyMessage.err.$isError) {
				err = /* @__PURE__ */ new Error();
				err.name = replyMessage.err.name;
				err.message = replyMessage.err.message;
				err.stack = replyMessage.err.stack;
			}
			reply.reject(err);
			return;
		}
		reply.resolve(replyMessage.res);
	}
	_handleRequestMessage(requestMessage) {
		const req = requestMessage.req;
		this._handler.handleMessage(requestMessage.channel, requestMessage.method, requestMessage.args).then((r) => {
			this._send(new ReplyMessage(this._workerId, req, r, void 0));
		}, (e) => {
			if (e.detail instanceof Error) e.detail = transformErrorForSerialization(e.detail);
			this._send(new ReplyMessage(this._workerId, req, void 0, transformErrorForSerialization(e)));
		});
	}
	_handleSubscribeEventMessage(msg) {
		const req = msg.req;
		const disposable = this._handler.handleEvent(msg.channel, msg.eventName, msg.arg)((event) => {
			this._send(new EventMessage(this._workerId, req, event));
		});
		this._pendingEvents.set(req, disposable);
	}
	_handleEventMessage(msg) {
		if (!this._pendingEmitters.has(msg.req)) {
			console.warn("Got event for unknown req");
			return;
		}
		this._pendingEmitters.get(msg.req).fire(msg.event);
	}
	_handleUnsubscribeEventMessage(msg) {
		if (!this._pendingEvents.has(msg.req)) {
			console.warn("Got unsubscribe for unknown req");
			return;
		}
		this._pendingEvents.get(msg.req).dispose();
		this._pendingEvents.delete(msg.req);
	}
	_send(msg) {
		const transfer = [];
		if (msg.type === 0) {
			for (let i = 0; i < msg.args.length; i++) if (msg.args[i] instanceof ArrayBuffer) transfer.push(msg.args[i]);
		} else if (msg.type === 1) {
			if (msg.res instanceof ArrayBuffer) transfer.push(msg.res);
		}
		this._handler.sendMessage(msg, transfer);
	}
};
/**
* Main thread side
*/
var SimpleWorkerClient = class extends Disposable {
	constructor(workerFactory, workerDescriptor) {
		super();
		this._localChannels = /* @__PURE__ */ new Map();
		this._worker = this._register(workerFactory.create({
			amdModuleId: "vs/base/common/worker/simpleWorker",
			esmModuleLocation: workerDescriptor.esmModuleLocation,
			label: workerDescriptor.label
		}, (msg) => {
			this._protocol.handleMessage(msg);
		}, (err) => {
			onUnexpectedError(err);
		}));
		this._protocol = new SimpleWorkerProtocol({
			sendMessage: (msg, transfer) => {
				this._worker.postMessage(msg, transfer);
			},
			handleMessage: (channel, method, args) => {
				return this._handleMessage(channel, method, args);
			},
			handleEvent: (channel, eventName, arg) => {
				return this._handleEvent(channel, eventName, arg);
			}
		});
		this._protocol.setWorkerId(this._worker.getId());
		let loaderConfiguration = null;
		const globalRequire = globalThis.require;
		if (typeof globalRequire !== "undefined" && typeof globalRequire.getConfig === "function") loaderConfiguration = globalRequire.getConfig();
		else if (typeof globalThis.requirejs !== "undefined") loaderConfiguration = globalThis.requirejs.s.contexts._.config;
		this._onModuleLoaded = this._protocol.sendMessage(DEFAULT_CHANNEL, INITIALIZE, [
			this._worker.getId(),
			JSON.parse(JSON.stringify(loaderConfiguration)),
			workerDescriptor.amdModuleId
		]);
		this.proxy = this._protocol.createProxyToRemoteChannel(DEFAULT_CHANNEL, async () => {
			await this._onModuleLoaded;
		});
		this._onModuleLoaded.catch((e) => {
			this._onError("Worker failed to load " + workerDescriptor.amdModuleId, e);
		});
	}
	_handleMessage(channelName, method, args) {
		const channel = this._localChannels.get(channelName);
		if (!channel) return Promise.reject(/* @__PURE__ */ new Error(`Missing channel ${channelName} on main thread`));
		if (typeof channel[method] !== "function") return Promise.reject(/* @__PURE__ */ new Error(`Missing method ${method} on main thread channel ${channelName}`));
		try {
			return Promise.resolve(channel[method].apply(channel, args));
		} catch (e) {
			return Promise.reject(e);
		}
	}
	_handleEvent(channelName, eventName, arg) {
		const channel = this._localChannels.get(channelName);
		if (!channel) throw new Error(`Missing channel ${channelName} on main thread`);
		if (propertyIsDynamicEvent(eventName)) {
			const event = channel[eventName].call(channel, arg);
			if (typeof event !== "function") throw new Error(`Missing dynamic event ${eventName} on main thread channel ${channelName}.`);
			return event;
		}
		if (propertyIsEvent(eventName)) {
			const event = channel[eventName];
			if (typeof event !== "function") throw new Error(`Missing event ${eventName} on main thread channel ${channelName}.`);
			return event;
		}
		throw new Error(`Malformed event name ${eventName}`);
	}
	setChannel(channel, handler) {
		this._localChannels.set(channel, handler);
	}
	_onError(message, error) {
		console.error(message);
		console.info(error);
	}
};
function propertyIsEvent(name) {
	return name[0] === "o" && name[1] === "n" && isUpperAsciiLetter(name.charCodeAt(2));
}
function propertyIsDynamicEvent(name) {
	return /^onDynamic/.test(name) && isUpperAsciiLetter(name.charCodeAt(9));
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/base/browser/defaultWorkerFactory.js
var ttPolicy$1;
if (typeof self === "object" && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope" && globalThis.workerttPolicy !== void 0) ttPolicy$1 = globalThis.workerttPolicy;
else ttPolicy$1 = createTrustedTypesPolicy("defaultWorkerFactory", { createScriptURL: (value) => value });
function getWorker(esmWorkerLocation, label) {
	const monacoEnvironment = globalThis.MonacoEnvironment;
	if (monacoEnvironment) {
		if (typeof monacoEnvironment.getWorker === "function") return monacoEnvironment.getWorker("workerMain.js", label);
		if (typeof monacoEnvironment.getWorkerUrl === "function") {
			const workerUrl = monacoEnvironment.getWorkerUrl("workerMain.js", label);
			return new Worker(ttPolicy$1 ? ttPolicy$1.createScriptURL(workerUrl) : workerUrl, {
				name: label,
				type: "module"
			});
		}
	}
	if (esmWorkerLocation) {
		const workerUrl = getWorkerBootstrapUrl(label, esmWorkerLocation.toString(true));
		const worker = new Worker(ttPolicy$1 ? ttPolicy$1.createScriptURL(workerUrl) : workerUrl, {
			name: label,
			type: "module"
		});
		return whenESMWorkerReady(worker);
	}
	throw new Error(`You must define a function MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker`);
}
function getWorkerBootstrapUrl(label, workerScriptUrl, workerBaseUrl) {
	if (/^((http:)|(https:)|(file:)|(vscode-file:))/.test(workerScriptUrl) && workerScriptUrl.substring(0, globalThis.origin.length) !== globalThis.origin) {} else {
		const start = workerScriptUrl.lastIndexOf("?");
		const end = workerScriptUrl.lastIndexOf("#", start);
		const params = start > 0 ? new URLSearchParams(workerScriptUrl.substring(start + 1, ~end ? end : void 0)) : new URLSearchParams();
		COI.addSearchParam(params, true, true);
		if (!params.toString()) workerScriptUrl = `${workerScriptUrl}#${label}`;
		else workerScriptUrl = `${workerScriptUrl}?${params.toString()}#${label}`;
	}
	const blob = new Blob([coalesce([
		`/*${label}*/`,
		workerBaseUrl ? `globalThis.MonacoEnvironment = { baseUrl: '${workerBaseUrl}' };` : void 0,
		`globalThis._VSCODE_NLS_MESSAGES = ${JSON.stringify(getNLSMessages())};`,
		`globalThis._VSCODE_NLS_LANGUAGE = ${JSON.stringify(getNLSLanguage())};`,
		`globalThis._VSCODE_FILE_ROOT = '${globalThis._VSCODE_FILE_ROOT}';`,
		`const ttPolicy = globalThis.trustedTypes?.createPolicy('defaultWorkerFactory', { createScriptURL: value => value });`,
		`globalThis.workerttPolicy = ttPolicy;`,
		`await import(ttPolicy?.createScriptURL('${workerScriptUrl}') ?? '${workerScriptUrl}');`,
		`globalThis.postMessage({ type: 'vscode-worker-ready' });`,
		`/*${label}*/`
	]).join("")], { type: "application/javascript" });
	return URL.createObjectURL(blob);
}
function whenESMWorkerReady(worker) {
	return new Promise((resolve, reject) => {
		worker.onmessage = function(e) {
			if (e.data.type === "vscode-worker-ready") {
				worker.onmessage = null;
				resolve(worker);
			}
		};
		worker.onerror = reject;
	});
}
function isPromiseLike(obj) {
	if (typeof obj.then === "function") return true;
	return false;
}
/**
* A worker that uses HTML5 web workers so that is has
* its own global scope and its own thread.
*/
var WebWorker = class extends Disposable {
	constructor(esmWorkerLocation, amdModuleId, id, label, onMessageCallback, onErrorCallback) {
		super();
		this.id = id;
		this.label = label;
		const workerOrPromise = getWorker(esmWorkerLocation, label);
		if (isPromiseLike(workerOrPromise)) this.worker = workerOrPromise;
		else this.worker = Promise.resolve(workerOrPromise);
		this.postMessage(amdModuleId, []);
		this.worker.then((w) => {
			w.onmessage = function(ev) {
				onMessageCallback(ev.data);
			};
			w.onmessageerror = onErrorCallback;
			if (typeof w.addEventListener === "function") w.addEventListener("error", onErrorCallback);
		});
		this._register(toDisposable(() => {
			this.worker?.then((w) => {
				w.onmessage = null;
				w.onmessageerror = null;
				w.removeEventListener("error", onErrorCallback);
				w.terminate();
			});
			this.worker = null;
		}));
	}
	getId() {
		return this.id;
	}
	postMessage(message, transfer) {
		this.worker?.then((w) => {
			try {
				w.postMessage(message, transfer);
			} catch (err) {
				onUnexpectedError(err);
				onUnexpectedError(new Error(`FAILED to post message to '${this.label}'-worker`, { cause: err }));
			}
		});
	}
};
var WorkerDescriptor = class {
	constructor(amdModuleId, label) {
		this.amdModuleId = amdModuleId;
		this.label = label;
		this.esmModuleLocation = FileAccess.asBrowserUri(`${amdModuleId}.esm.js`);
	}
};
var DefaultWorkerFactory = class DefaultWorkerFactory {
	static {
		this.LAST_WORKER_ID = 0;
	}
	constructor() {
		this._webWorkerFailedBeforeError = false;
	}
	create(desc, onMessageCallback, onErrorCallback) {
		const workerId = ++DefaultWorkerFactory.LAST_WORKER_ID;
		if (this._webWorkerFailedBeforeError) throw this._webWorkerFailedBeforeError;
		return new WebWorker(desc.esmModuleLocation, desc.amdModuleId, workerId, desc.label || "anonymous" + workerId, onMessageCallback, (err) => {
			logOnceWebWorkerWarning(err);
			this._webWorkerFailedBeforeError = err;
			onErrorCallback(err);
		});
	}
};
function createWebWorker$2(arg0, arg1) {
	const workerDescriptor = typeof arg0 === "string" ? new WorkerDescriptor(arg0, arg1) : arg0;
	return new SimpleWorkerClient(new DefaultWorkerFactory(), workerDescriptor);
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/languages/linkComputer.js
var Uint8Matrix = class {
	constructor(rows, cols, defaultValue) {
		const data = new Uint8Array(rows * cols);
		for (let i = 0, len = rows * cols; i < len; i++) data[i] = defaultValue;
		this._data = data;
		this.rows = rows;
		this.cols = cols;
	}
	get(row, col) {
		return this._data[row * this.cols + col];
	}
	set(row, col, value) {
		this._data[row * this.cols + col] = value;
	}
};
var StateMachine = class {
	constructor(edges) {
		let maxCharCode = 0;
		let maxState = 0;
		for (let i = 0, len = edges.length; i < len; i++) {
			const [from, chCode, to] = edges[i];
			if (chCode > maxCharCode) maxCharCode = chCode;
			if (from > maxState) maxState = from;
			if (to > maxState) maxState = to;
		}
		maxCharCode++;
		maxState++;
		const states = new Uint8Matrix(maxState, maxCharCode, 0);
		for (let i = 0, len = edges.length; i < len; i++) {
			const [from, chCode, to] = edges[i];
			states.set(from, chCode, to);
		}
		this._states = states;
		this._maxCharCode = maxCharCode;
	}
	nextState(currentState, chCode) {
		if (chCode < 0 || chCode >= this._maxCharCode) return 0;
		return this._states.get(currentState, chCode);
	}
};
var _stateMachine = null;
function getStateMachine() {
	if (_stateMachine === null) _stateMachine = new StateMachine([
		[
			1,
			104,
			2
		],
		[
			1,
			72,
			2
		],
		[
			1,
			102,
			6
		],
		[
			1,
			70,
			6
		],
		[
			2,
			116,
			3
		],
		[
			2,
			84,
			3
		],
		[
			3,
			116,
			4
		],
		[
			3,
			84,
			4
		],
		[
			4,
			112,
			5
		],
		[
			4,
			80,
			5
		],
		[
			5,
			115,
			9
		],
		[
			5,
			83,
			9
		],
		[
			5,
			58,
			10
		],
		[
			6,
			105,
			7
		],
		[
			6,
			73,
			7
		],
		[
			7,
			108,
			8
		],
		[
			7,
			76,
			8
		],
		[
			8,
			101,
			9
		],
		[
			8,
			69,
			9
		],
		[
			9,
			58,
			10
		],
		[
			10,
			47,
			11
		],
		[
			11,
			47,
			12
		]
	]);
	return _stateMachine;
}
var _classifier = null;
function getClassifier() {
	if (_classifier === null) {
		_classifier = new CharacterClassifier(0);
		const FORCE_TERMINATION_CHARACTERS = " 	<>'\"、。｡､，．：；‘〈「『〔（［｛｢｣｝］）〕』」〉’｀～…";
		for (let i = 0; i < 35; i++) _classifier.set(FORCE_TERMINATION_CHARACTERS.charCodeAt(i), 1);
		const CANNOT_END_WITH_CHARACTERS = ".,;:";
		for (let i = 0; i < 4; i++) _classifier.set(CANNOT_END_WITH_CHARACTERS.charCodeAt(i), 2);
	}
	return _classifier;
}
var LinkComputer = class LinkComputer {
	static _createLink(classifier, line, lineNumber, linkBeginIndex, linkEndIndex) {
		let lastIncludedCharIndex = linkEndIndex - 1;
		do {
			const chCode = line.charCodeAt(lastIncludedCharIndex);
			if (classifier.get(chCode) !== 2) break;
			lastIncludedCharIndex--;
		} while (lastIncludedCharIndex > linkBeginIndex);
		if (linkBeginIndex > 0) {
			const charCodeBeforeLink = line.charCodeAt(linkBeginIndex - 1);
			const lastCharCodeInLink = line.charCodeAt(lastIncludedCharIndex);
			if (charCodeBeforeLink === 40 && lastCharCodeInLink === 41 || charCodeBeforeLink === 91 && lastCharCodeInLink === 93 || charCodeBeforeLink === 123 && lastCharCodeInLink === 125) lastIncludedCharIndex--;
		}
		return {
			range: {
				startLineNumber: lineNumber,
				startColumn: linkBeginIndex + 1,
				endLineNumber: lineNumber,
				endColumn: lastIncludedCharIndex + 2
			},
			url: line.substring(linkBeginIndex, lastIncludedCharIndex + 1)
		};
	}
	static computeLinks(model, stateMachine = getStateMachine()) {
		const classifier = getClassifier();
		const result = [];
		for (let i = 1, lineCount = model.getLineCount(); i <= lineCount; i++) {
			const line = model.getLineContent(i);
			const len = line.length;
			let j = 0;
			let linkBeginIndex = 0;
			let linkBeginChCode = 0;
			let state = 1;
			let hasOpenParens = false;
			let hasOpenSquareBracket = false;
			let inSquareBrackets = false;
			let hasOpenCurlyBracket = false;
			while (j < len) {
				let resetStateMachine = false;
				const chCode = line.charCodeAt(j);
				if (state === 13) {
					let chClass;
					switch (chCode) {
						case 40:
							hasOpenParens = true;
							chClass = 0;
							break;
						case 41:
							chClass = hasOpenParens ? 0 : 1;
							break;
						case 91:
							inSquareBrackets = true;
							hasOpenSquareBracket = true;
							chClass = 0;
							break;
						case 93:
							inSquareBrackets = false;
							chClass = hasOpenSquareBracket ? 0 : 1;
							break;
						case 123:
							hasOpenCurlyBracket = true;
							chClass = 0;
							break;
						case 125:
							chClass = hasOpenCurlyBracket ? 0 : 1;
							break;
						case 39:
						case 34:
						case 96:
							if (linkBeginChCode === chCode) chClass = 1;
							else if (linkBeginChCode === 39 || linkBeginChCode === 34 || linkBeginChCode === 96) chClass = 0;
							else chClass = 1;
							break;
						case 42:
							chClass = linkBeginChCode === 42 ? 1 : 0;
							break;
						case 124:
							chClass = linkBeginChCode === 124 ? 1 : 0;
							break;
						case 32:
							chClass = inSquareBrackets ? 0 : 1;
							break;
						default: chClass = classifier.get(chCode);
					}
					if (chClass === 1) {
						result.push(LinkComputer._createLink(classifier, line, i, linkBeginIndex, j));
						resetStateMachine = true;
					}
				} else if (state === 12) {
					let chClass;
					if (chCode === 91) {
						hasOpenSquareBracket = true;
						chClass = 0;
					} else chClass = classifier.get(chCode);
					if (chClass === 1) resetStateMachine = true;
					else state = 13;
				} else {
					state = stateMachine.nextState(state, chCode);
					if (state === 0) resetStateMachine = true;
				}
				if (resetStateMachine) {
					state = 1;
					hasOpenParens = false;
					hasOpenSquareBracket = false;
					hasOpenCurlyBracket = false;
					linkBeginIndex = j + 1;
					linkBeginChCode = chCode;
				}
				j++;
			}
			if (state === 13) result.push(LinkComputer._createLink(classifier, line, i, linkBeginIndex, len));
		}
		return result;
	}
};
/**
* Returns an array of all links contains in the provided
* document. *Note* that this operation is computational
* expensive and should not run in the UI thread.
*/
function computeLinks(model) {
	if (!model || typeof model.getLineCount !== "function" || typeof model.getLineContent !== "function") return [];
	return LinkComputer.computeLinks(model);
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/languages/supports/inplaceReplaceSupport.js
var BasicInplaceReplace = class BasicInplaceReplace {
	constructor() {
		this._defaultValueSet = [
			["true", "false"],
			["True", "False"],
			[
				"Private",
				"Public",
				"Friend",
				"ReadOnly",
				"Partial",
				"Protected",
				"WriteOnly"
			],
			[
				"public",
				"protected",
				"private"
			]
		];
	}
	static {
		this.INSTANCE = new BasicInplaceReplace();
	}
	navigateValueSet(range1, text1, range2, text2, up) {
		if (range1 && text1) {
			const result = this.doNavigateValueSet(text1, up);
			if (result) return {
				range: range1,
				value: result
			};
		}
		if (range2 && text2) {
			const result = this.doNavigateValueSet(text2, up);
			if (result) return {
				range: range2,
				value: result
			};
		}
		return null;
	}
	doNavigateValueSet(text, up) {
		const numberResult = this.numberReplace(text, up);
		if (numberResult !== null) return numberResult;
		return this.textReplace(text, up);
	}
	numberReplace(value, up) {
		const precision = Math.pow(10, value.length - (value.lastIndexOf(".") + 1));
		let n1 = Number(value);
		const n2 = parseFloat(value);
		if (!isNaN(n1) && !isNaN(n2) && n1 === n2) if (n1 === 0 && !up) return null;
		else {
			n1 = Math.floor(n1 * precision);
			n1 += up ? precision : -precision;
			return String(n1 / precision);
		}
		return null;
	}
	textReplace(value, up) {
		return this.valueSetsReplace(this._defaultValueSet, value, up);
	}
	valueSetsReplace(valueSets, value, up) {
		let result = null;
		for (let i = 0, len = valueSets.length; result === null && i < len; i++) result = this.valueSetReplace(valueSets[i], value, up);
		return result;
	}
	valueSetReplace(valueSet, value, up) {
		let idx = valueSet.indexOf(value);
		if (idx >= 0) {
			idx += up ? 1 : -1;
			if (idx < 0) idx = valueSet.length - 1;
			else idx %= valueSet.length;
			return valueSet[idx];
		}
		return null;
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerHost.js
var EditorWorkerHost = class EditorWorkerHost {
	static {
		this.CHANNEL_NAME = "editorWorkerHost";
	}
	static getChannel(workerServer) {
		return workerServer.getChannel(EditorWorkerHost.CHANNEL_NAME);
	}
	static setChannel(workerClient, obj) {
		workerClient.setChannel(EditorWorkerHost.CHANNEL_NAME, obj);
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/diff/legacyLinesDiffComputer.js
var MINIMUM_MATCHING_CHARACTER_LENGTH = 3;
var LegacyLinesDiffComputer = class {
	computeDiff(originalLines, modifiedLines, options) {
		const result = new DiffComputer(originalLines, modifiedLines, {
			maxComputationTime: options.maxComputationTimeMs,
			shouldIgnoreTrimWhitespace: options.ignoreTrimWhitespace,
			shouldComputeCharChanges: true,
			shouldMakePrettyDiff: true,
			shouldPostProcessCharChanges: true
		}).computeDiff();
		const changes = [];
		let lastChange = null;
		for (const c of result.changes) {
			let originalRange;
			if (c.originalEndLineNumber === 0) originalRange = new LineRange(c.originalStartLineNumber + 1, c.originalStartLineNumber + 1);
			else originalRange = new LineRange(c.originalStartLineNumber, c.originalEndLineNumber + 1);
			let modifiedRange;
			if (c.modifiedEndLineNumber === 0) modifiedRange = new LineRange(c.modifiedStartLineNumber + 1, c.modifiedStartLineNumber + 1);
			else modifiedRange = new LineRange(c.modifiedStartLineNumber, c.modifiedEndLineNumber + 1);
			let change = new DetailedLineRangeMapping(originalRange, modifiedRange, c.charChanges?.map((c$1) => new RangeMapping(new Range$1(c$1.originalStartLineNumber, c$1.originalStartColumn, c$1.originalEndLineNumber, c$1.originalEndColumn), new Range$1(c$1.modifiedStartLineNumber, c$1.modifiedStartColumn, c$1.modifiedEndLineNumber, c$1.modifiedEndColumn))));
			if (lastChange) {
				if (lastChange.modified.endLineNumberExclusive === change.modified.startLineNumber || lastChange.original.endLineNumberExclusive === change.original.startLineNumber) {
					change = new DetailedLineRangeMapping(lastChange.original.join(change.original), lastChange.modified.join(change.modified), lastChange.innerChanges && change.innerChanges ? lastChange.innerChanges.concat(change.innerChanges) : void 0);
					changes.pop();
				}
			}
			changes.push(change);
			lastChange = change;
		}
		assertFn(() => {
			return checkAdjacentItems(changes, (m1, m2) => m2.original.startLineNumber - m1.original.endLineNumberExclusive === m2.modified.startLineNumber - m1.modified.endLineNumberExclusive && m1.original.endLineNumberExclusive < m2.original.startLineNumber && m1.modified.endLineNumberExclusive < m2.modified.startLineNumber);
		});
		return new LinesDiff(changes, [], result.quitEarly);
	}
};
function computeDiff(originalSequence, modifiedSequence, continueProcessingPredicate, pretty) {
	return new LcsDiff(originalSequence, modifiedSequence, continueProcessingPredicate).ComputeDiff(pretty);
}
var LineSequence = class {
	constructor(lines) {
		const startColumns = [];
		const endColumns = [];
		for (let i = 0, length = lines.length; i < length; i++) {
			startColumns[i] = getFirstNonBlankColumn(lines[i], 1);
			endColumns[i] = getLastNonBlankColumn(lines[i], 1);
		}
		this.lines = lines;
		this._startColumns = startColumns;
		this._endColumns = endColumns;
	}
	getElements() {
		const elements = [];
		for (let i = 0, len = this.lines.length; i < len; i++) elements[i] = this.lines[i].substring(this._startColumns[i] - 1, this._endColumns[i] - 1);
		return elements;
	}
	getStrictElement(index) {
		return this.lines[index];
	}
	getStartLineNumber(i) {
		return i + 1;
	}
	getEndLineNumber(i) {
		return i + 1;
	}
	createCharSequence(shouldIgnoreTrimWhitespace, startIndex, endIndex) {
		const charCodes = [];
		const lineNumbers = [];
		const columns = [];
		let len = 0;
		for (let index = startIndex; index <= endIndex; index++) {
			const lineContent = this.lines[index];
			const startColumn = shouldIgnoreTrimWhitespace ? this._startColumns[index] : 1;
			const endColumn = shouldIgnoreTrimWhitespace ? this._endColumns[index] : lineContent.length + 1;
			for (let col = startColumn; col < endColumn; col++) {
				charCodes[len] = lineContent.charCodeAt(col - 1);
				lineNumbers[len] = index + 1;
				columns[len] = col;
				len++;
			}
			if (!shouldIgnoreTrimWhitespace && index < endIndex) {
				charCodes[len] = 10;
				lineNumbers[len] = index + 1;
				columns[len] = lineContent.length + 1;
				len++;
			}
		}
		return new CharSequence(charCodes, lineNumbers, columns);
	}
};
var CharSequence = class {
	constructor(charCodes, lineNumbers, columns) {
		this._charCodes = charCodes;
		this._lineNumbers = lineNumbers;
		this._columns = columns;
	}
	toString() {
		return "[" + this._charCodes.map((s, idx) => (s === 10 ? "\\n" : String.fromCharCode(s)) + `-(${this._lineNumbers[idx]},${this._columns[idx]})`).join(", ") + "]";
	}
	_assertIndex(index, arr) {
		if (index < 0 || index >= arr.length) throw new Error(`Illegal index`);
	}
	getElements() {
		return this._charCodes;
	}
	getStartLineNumber(i) {
		if (i > 0 && i === this._lineNumbers.length) return this.getEndLineNumber(i - 1);
		this._assertIndex(i, this._lineNumbers);
		return this._lineNumbers[i];
	}
	getEndLineNumber(i) {
		if (i === -1) return this.getStartLineNumber(i + 1);
		this._assertIndex(i, this._lineNumbers);
		if (this._charCodes[i] === 10) return this._lineNumbers[i] + 1;
		return this._lineNumbers[i];
	}
	getStartColumn(i) {
		if (i > 0 && i === this._columns.length) return this.getEndColumn(i - 1);
		this._assertIndex(i, this._columns);
		return this._columns[i];
	}
	getEndColumn(i) {
		if (i === -1) return this.getStartColumn(i + 1);
		this._assertIndex(i, this._columns);
		if (this._charCodes[i] === 10) return 1;
		return this._columns[i] + 1;
	}
};
var CharChange = class CharChange {
	constructor(originalStartLineNumber, originalStartColumn, originalEndLineNumber, originalEndColumn, modifiedStartLineNumber, modifiedStartColumn, modifiedEndLineNumber, modifiedEndColumn) {
		this.originalStartLineNumber = originalStartLineNumber;
		this.originalStartColumn = originalStartColumn;
		this.originalEndLineNumber = originalEndLineNumber;
		this.originalEndColumn = originalEndColumn;
		this.modifiedStartLineNumber = modifiedStartLineNumber;
		this.modifiedStartColumn = modifiedStartColumn;
		this.modifiedEndLineNumber = modifiedEndLineNumber;
		this.modifiedEndColumn = modifiedEndColumn;
	}
	static createFromDiffChange(diffChange, originalCharSequence, modifiedCharSequence) {
		const originalStartLineNumber = originalCharSequence.getStartLineNumber(diffChange.originalStart);
		const originalStartColumn = originalCharSequence.getStartColumn(diffChange.originalStart);
		const originalEndLineNumber = originalCharSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
		const originalEndColumn = originalCharSequence.getEndColumn(diffChange.originalStart + diffChange.originalLength - 1);
		const modifiedStartLineNumber = modifiedCharSequence.getStartLineNumber(diffChange.modifiedStart);
		const modifiedStartColumn = modifiedCharSequence.getStartColumn(diffChange.modifiedStart);
		const modifiedEndLineNumber = modifiedCharSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
		const modifiedEndColumn = modifiedCharSequence.getEndColumn(diffChange.modifiedStart + diffChange.modifiedLength - 1);
		return new CharChange(originalStartLineNumber, originalStartColumn, originalEndLineNumber, originalEndColumn, modifiedStartLineNumber, modifiedStartColumn, modifiedEndLineNumber, modifiedEndColumn);
	}
};
function postProcessCharChanges(rawChanges) {
	if (rawChanges.length <= 1) return rawChanges;
	const result = [rawChanges[0]];
	let prevChange = result[0];
	for (let i = 1, len = rawChanges.length; i < len; i++) {
		const currChange = rawChanges[i];
		const originalMatchingLength = currChange.originalStart - (prevChange.originalStart + prevChange.originalLength);
		const modifiedMatchingLength = currChange.modifiedStart - (prevChange.modifiedStart + prevChange.modifiedLength);
		if (Math.min(originalMatchingLength, modifiedMatchingLength) < MINIMUM_MATCHING_CHARACTER_LENGTH) {
			prevChange.originalLength = currChange.originalStart + currChange.originalLength - prevChange.originalStart;
			prevChange.modifiedLength = currChange.modifiedStart + currChange.modifiedLength - prevChange.modifiedStart;
		} else {
			result.push(currChange);
			prevChange = currChange;
		}
	}
	return result;
}
var LineChange = class LineChange {
	constructor(originalStartLineNumber, originalEndLineNumber, modifiedStartLineNumber, modifiedEndLineNumber, charChanges) {
		this.originalStartLineNumber = originalStartLineNumber;
		this.originalEndLineNumber = originalEndLineNumber;
		this.modifiedStartLineNumber = modifiedStartLineNumber;
		this.modifiedEndLineNumber = modifiedEndLineNumber;
		this.charChanges = charChanges;
	}
	static createFromDiffResult(shouldIgnoreTrimWhitespace, diffChange, originalLineSequence, modifiedLineSequence, continueCharDiff, shouldComputeCharChanges, shouldPostProcessCharChanges) {
		let originalStartLineNumber;
		let originalEndLineNumber;
		let modifiedStartLineNumber;
		let modifiedEndLineNumber;
		let charChanges = void 0;
		if (diffChange.originalLength === 0) {
			originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart) - 1;
			originalEndLineNumber = 0;
		} else {
			originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart);
			originalEndLineNumber = originalLineSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
		}
		if (diffChange.modifiedLength === 0) {
			modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart) - 1;
			modifiedEndLineNumber = 0;
		} else {
			modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart);
			modifiedEndLineNumber = modifiedLineSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
		}
		if (shouldComputeCharChanges && diffChange.originalLength > 0 && diffChange.originalLength < 20 && diffChange.modifiedLength > 0 && diffChange.modifiedLength < 20 && continueCharDiff()) {
			const originalCharSequence = originalLineSequence.createCharSequence(shouldIgnoreTrimWhitespace, diffChange.originalStart, diffChange.originalStart + diffChange.originalLength - 1);
			const modifiedCharSequence = modifiedLineSequence.createCharSequence(shouldIgnoreTrimWhitespace, diffChange.modifiedStart, diffChange.modifiedStart + diffChange.modifiedLength - 1);
			if (originalCharSequence.getElements().length > 0 && modifiedCharSequence.getElements().length > 0) {
				let rawChanges = computeDiff(originalCharSequence, modifiedCharSequence, continueCharDiff, true).changes;
				if (shouldPostProcessCharChanges) rawChanges = postProcessCharChanges(rawChanges);
				charChanges = [];
				for (let i = 0, length = rawChanges.length; i < length; i++) charChanges.push(CharChange.createFromDiffChange(rawChanges[i], originalCharSequence, modifiedCharSequence));
			}
		}
		return new LineChange(originalStartLineNumber, originalEndLineNumber, modifiedStartLineNumber, modifiedEndLineNumber, charChanges);
	}
};
var DiffComputer = class {
	constructor(originalLines, modifiedLines, opts) {
		this.shouldComputeCharChanges = opts.shouldComputeCharChanges;
		this.shouldPostProcessCharChanges = opts.shouldPostProcessCharChanges;
		this.shouldIgnoreTrimWhitespace = opts.shouldIgnoreTrimWhitespace;
		this.shouldMakePrettyDiff = opts.shouldMakePrettyDiff;
		this.originalLines = originalLines;
		this.modifiedLines = modifiedLines;
		this.original = new LineSequence(originalLines);
		this.modified = new LineSequence(modifiedLines);
		this.continueLineDiff = createContinueProcessingPredicate(opts.maxComputationTime);
		this.continueCharDiff = createContinueProcessingPredicate(opts.maxComputationTime === 0 ? 0 : Math.min(opts.maxComputationTime, 5e3));
	}
	computeDiff() {
		if (this.original.lines.length === 1 && this.original.lines[0].length === 0) {
			if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0) return {
				quitEarly: false,
				changes: []
			};
			return {
				quitEarly: false,
				changes: [{
					originalStartLineNumber: 1,
					originalEndLineNumber: 1,
					modifiedStartLineNumber: 1,
					modifiedEndLineNumber: this.modified.lines.length,
					charChanges: void 0
				}]
			};
		}
		if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0) return {
			quitEarly: false,
			changes: [{
				originalStartLineNumber: 1,
				originalEndLineNumber: this.original.lines.length,
				modifiedStartLineNumber: 1,
				modifiedEndLineNumber: 1,
				charChanges: void 0
			}]
		};
		const diffResult = computeDiff(this.original, this.modified, this.continueLineDiff, this.shouldMakePrettyDiff);
		const rawChanges = diffResult.changes;
		const quitEarly = diffResult.quitEarly;
		if (this.shouldIgnoreTrimWhitespace) {
			const lineChanges = [];
			for (let i = 0, length = rawChanges.length; i < length; i++) lineChanges.push(LineChange.createFromDiffResult(this.shouldIgnoreTrimWhitespace, rawChanges[i], this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
			return {
				quitEarly,
				changes: lineChanges
			};
		}
		const result = [];
		let originalLineIndex = 0;
		let modifiedLineIndex = 0;
		for (let i = -1, len = rawChanges.length; i < len; i++) {
			const nextChange = i + 1 < len ? rawChanges[i + 1] : null;
			const originalStop = nextChange ? nextChange.originalStart : this.originalLines.length;
			const modifiedStop = nextChange ? nextChange.modifiedStart : this.modifiedLines.length;
			while (originalLineIndex < originalStop && modifiedLineIndex < modifiedStop) {
				const originalLine = this.originalLines[originalLineIndex];
				const modifiedLine = this.modifiedLines[modifiedLineIndex];
				if (originalLine !== modifiedLine) {
					{
						let originalStartColumn = getFirstNonBlankColumn(originalLine, 1);
						let modifiedStartColumn = getFirstNonBlankColumn(modifiedLine, 1);
						while (originalStartColumn > 1 && modifiedStartColumn > 1) {
							const originalChar = originalLine.charCodeAt(originalStartColumn - 2);
							const modifiedChar = modifiedLine.charCodeAt(modifiedStartColumn - 2);
							if (originalChar !== modifiedChar) break;
							originalStartColumn--;
							modifiedStartColumn--;
						}
						if (originalStartColumn > 1 || modifiedStartColumn > 1) this._pushTrimWhitespaceCharChange(result, originalLineIndex + 1, 1, originalStartColumn, modifiedLineIndex + 1, 1, modifiedStartColumn);
					}
					{
						let originalEndColumn = getLastNonBlankColumn(originalLine, 1);
						let modifiedEndColumn = getLastNonBlankColumn(modifiedLine, 1);
						const originalMaxColumn = originalLine.length + 1;
						const modifiedMaxColumn = modifiedLine.length + 1;
						while (originalEndColumn < originalMaxColumn && modifiedEndColumn < modifiedMaxColumn) {
							const originalChar = originalLine.charCodeAt(originalEndColumn - 1);
							const modifiedChar = originalLine.charCodeAt(modifiedEndColumn - 1);
							if (originalChar !== modifiedChar) break;
							originalEndColumn++;
							modifiedEndColumn++;
						}
						if (originalEndColumn < originalMaxColumn || modifiedEndColumn < modifiedMaxColumn) this._pushTrimWhitespaceCharChange(result, originalLineIndex + 1, originalEndColumn, originalMaxColumn, modifiedLineIndex + 1, modifiedEndColumn, modifiedMaxColumn);
					}
				}
				originalLineIndex++;
				modifiedLineIndex++;
			}
			if (nextChange) {
				result.push(LineChange.createFromDiffResult(this.shouldIgnoreTrimWhitespace, nextChange, this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
				originalLineIndex += nextChange.originalLength;
				modifiedLineIndex += nextChange.modifiedLength;
			}
		}
		return {
			quitEarly,
			changes: result
		};
	}
	_pushTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn) {
		if (this._mergeTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn)) return;
		let charChanges = void 0;
		if (this.shouldComputeCharChanges) charChanges = [new CharChange(originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn)];
		result.push(new LineChange(originalLineNumber, originalLineNumber, modifiedLineNumber, modifiedLineNumber, charChanges));
	}
	_mergeTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn) {
		const len = result.length;
		if (len === 0) return false;
		const prevChange = result[len - 1];
		if (prevChange.originalEndLineNumber === 0 || prevChange.modifiedEndLineNumber === 0) return false;
		if (prevChange.originalEndLineNumber === originalLineNumber && prevChange.modifiedEndLineNumber === modifiedLineNumber) {
			if (this.shouldComputeCharChanges && prevChange.charChanges) prevChange.charChanges.push(new CharChange(originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn));
			return true;
		}
		if (prevChange.originalEndLineNumber + 1 === originalLineNumber && prevChange.modifiedEndLineNumber + 1 === modifiedLineNumber) {
			prevChange.originalEndLineNumber = originalLineNumber;
			prevChange.modifiedEndLineNumber = modifiedLineNumber;
			if (this.shouldComputeCharChanges && prevChange.charChanges) prevChange.charChanges.push(new CharChange(originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn));
			return true;
		}
		return false;
	}
};
function getFirstNonBlankColumn(txt, defaultValue) {
	const r = firstNonWhitespaceIndex(txt);
	if (r === -1) return defaultValue;
	return r + 1;
}
function getLastNonBlankColumn(txt, defaultValue) {
	const r = lastNonWhitespaceIndex(txt);
	if (r === -1) return defaultValue;
	return r + 2;
}
function createContinueProcessingPredicate(maximumRuntime) {
	if (maximumRuntime === 0) return () => true;
	const startTime = Date.now();
	return () => {
		return Date.now() - startTime < maximumRuntime;
	};
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/diff/linesDiffComputers.js
const linesDiffComputers = {
	getLegacy: () => new LegacyLinesDiffComputer(),
	getDefault: () => new DefaultLinesDiffComputer()
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/languages/defaultDocumentColorsComputer.js
function _parseCaptureGroups(captureGroups) {
	const values = [];
	for (const captureGroup of captureGroups) {
		const parsedNumber = Number(captureGroup);
		if (parsedNumber || parsedNumber === 0 && captureGroup.replace(/\s/g, "") !== "") values.push(parsedNumber);
	}
	return values;
}
function _toIColor(r, g, b, a) {
	return {
		red: r / 255,
		blue: b / 255,
		green: g / 255,
		alpha: a
	};
}
function _findRange(model, match) {
	const index = match.index;
	const length = match[0].length;
	if (!index) return;
	const startPosition = model.positionAt(index);
	return {
		startLineNumber: startPosition.lineNumber,
		startColumn: startPosition.column,
		endLineNumber: startPosition.lineNumber,
		endColumn: startPosition.column + length
	};
}
function _findHexColorInformation(range, hexValue) {
	if (!range) return;
	const parsedHexColor = Color.Format.CSS.parseHex(hexValue);
	if (!parsedHexColor) return;
	return {
		range,
		color: _toIColor(parsedHexColor.rgba.r, parsedHexColor.rgba.g, parsedHexColor.rgba.b, parsedHexColor.rgba.a)
	};
}
function _findRGBColorInformation(range, matches, isAlpha) {
	if (!range || matches.length !== 1) return;
	const captureGroups = matches[0].values();
	const parsedRegex = _parseCaptureGroups(captureGroups);
	return {
		range,
		color: _toIColor(parsedRegex[0], parsedRegex[1], parsedRegex[2], isAlpha ? parsedRegex[3] : 1)
	};
}
function _findHSLColorInformation(range, matches, isAlpha) {
	if (!range || matches.length !== 1) return;
	const captureGroups = matches[0].values();
	const parsedRegex = _parseCaptureGroups(captureGroups);
	const colorEquivalent = new Color(new HSLA(parsedRegex[0], parsedRegex[1] / 100, parsedRegex[2] / 100, isAlpha ? parsedRegex[3] : 1));
	return {
		range,
		color: _toIColor(colorEquivalent.rgba.r, colorEquivalent.rgba.g, colorEquivalent.rgba.b, colorEquivalent.rgba.a)
	};
}
function _findMatches(model, regex) {
	if (typeof model === "string") return [...model.matchAll(regex)];
	else return model.findMatches(regex);
}
function computeColors(model) {
	const result = [];
	const initialValidationMatches = _findMatches(model, /\b(rgb|rgba|hsl|hsla)(\([0-9\s,.\%]*\))|(#)([A-Fa-f0-9]{3})\b|(#)([A-Fa-f0-9]{4})\b|(#)([A-Fa-f0-9]{6})\b|(#)([A-Fa-f0-9]{8})\b/gm);
	if (initialValidationMatches.length > 0) for (const initialMatch of initialValidationMatches) {
		const initialCaptureGroups = initialMatch.filter((captureGroup) => captureGroup !== void 0);
		const colorScheme = initialCaptureGroups[1];
		const colorParameters = initialCaptureGroups[2];
		if (!colorParameters) continue;
		let colorInformation;
		if (colorScheme === "rgb") colorInformation = _findRGBColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*\)$/gm), false);
		else if (colorScheme === "rgba") colorInformation = _findRGBColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(0[.][0-9]+|[.][0-9]+|[01][.]|[01])\s*\)$/gm), true);
		else if (colorScheme === "hsl") colorInformation = _findHSLColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, /^\(\s*(36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])\s*,\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*,\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*\)$/gm), false);
		else if (colorScheme === "hsla") colorInformation = _findHSLColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, /^\(\s*(36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])\s*,\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*,\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*,\s*(0[.][0-9]+|[.][0-9]+|[01][.]|[01])\s*\)$/gm), true);
		else if (colorScheme === "#") colorInformation = _findHexColorInformation(_findRange(model, initialMatch), colorScheme + colorParameters);
		if (colorInformation) result.push(colorInformation);
	}
	return result;
}
/**
* Returns an array of all default document colors in the provided document
*/
function computeDefaultDocumentColors(model) {
	if (!model || typeof model.getValue !== "function" || typeof model.positionAt !== "function") return [];
	return computeColors(model);
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/services/findSectionHeaders.js
var markRegex = new RegExp("\\bMARK:\\s*(.*)$", "d");
var trimDashesRegex = /^-+|-+$/g;
/**
* Find section headers in the model.
*
* @param model the text model to search in
* @param options options to search with
* @returns an array of section headers
*/
function findSectionHeaders(model, options) {
	let headers = [];
	if (options.findRegionSectionHeaders && options.foldingRules?.markers) {
		const regionHeaders = collectRegionHeaders(model, options);
		headers = headers.concat(regionHeaders);
	}
	if (options.findMarkSectionHeaders) {
		const markHeaders = collectMarkHeaders(model);
		headers = headers.concat(markHeaders);
	}
	return headers;
}
function collectRegionHeaders(model, options) {
	const regionHeaders = [];
	const endLineNumber = model.getLineCount();
	for (let lineNumber = 1; lineNumber <= endLineNumber; lineNumber++) {
		const lineContent = model.getLineContent(lineNumber);
		const match = lineContent.match(options.foldingRules.markers.start);
		if (match) {
			const range = {
				startLineNumber: lineNumber,
				startColumn: match[0].length + 1,
				endLineNumber: lineNumber,
				endColumn: lineContent.length + 1
			};
			if (range.endColumn > range.startColumn) {
				const sectionHeader = {
					range,
					...getHeaderText(lineContent.substring(match[0].length)),
					shouldBeInComments: false
				};
				if (sectionHeader.text || sectionHeader.hasSeparatorLine) regionHeaders.push(sectionHeader);
			}
		}
	}
	return regionHeaders;
}
function collectMarkHeaders(model) {
	const markHeaders = [];
	const endLineNumber = model.getLineCount();
	for (let lineNumber = 1; lineNumber <= endLineNumber; lineNumber++) {
		const lineContent = model.getLineContent(lineNumber);
		addMarkHeaderIfFound(lineContent, lineNumber, markHeaders);
	}
	return markHeaders;
}
function addMarkHeaderIfFound(lineContent, lineNumber, sectionHeaders) {
	markRegex.lastIndex = 0;
	const match = markRegex.exec(lineContent);
	if (match) {
		const column = match.indices[1][0] + 1;
		const endColumn = match.indices[1][1] + 1;
		const range = {
			startLineNumber: lineNumber,
			startColumn: column,
			endLineNumber: lineNumber,
			endColumn
		};
		if (range.endColumn > range.startColumn) {
			const sectionHeader = {
				range,
				...getHeaderText(match[1]),
				shouldBeInComments: true
			};
			if (sectionHeader.text || sectionHeader.hasSeparatorLine) sectionHeaders.push(sectionHeader);
		}
	}
}
function getHeaderText(text) {
	text = text.trim();
	const hasSeparatorLine = text.startsWith("-");
	text = text.replace(trimDashesRegex, "");
	return {
		text,
		hasSeparatorLine
	};
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/model/mirrorTextModel.js
var MirrorTextModel = class {
	constructor(uri, lines, eol, versionId) {
		this._uri = uri;
		this._lines = lines;
		this._eol = eol;
		this._versionId = versionId;
		this._lineStarts = null;
		this._cachedTextValue = null;
	}
	dispose() {
		this._lines.length = 0;
	}
	get version() {
		return this._versionId;
	}
	getText() {
		if (this._cachedTextValue === null) this._cachedTextValue = this._lines.join(this._eol);
		return this._cachedTextValue;
	}
	onEvents(e) {
		if (e.eol && e.eol !== this._eol) {
			this._eol = e.eol;
			this._lineStarts = null;
		}
		const changes = e.changes;
		for (const change of changes) {
			this._acceptDeleteRange(change.range);
			this._acceptInsertText(new Position$1(change.range.startLineNumber, change.range.startColumn), change.text);
		}
		this._versionId = e.versionId;
		this._cachedTextValue = null;
	}
	_ensureLineStarts() {
		if (!this._lineStarts) {
			const eolLength = this._eol.length;
			const linesLength = this._lines.length;
			const lineStartValues = new Uint32Array(linesLength);
			for (let i = 0; i < linesLength; i++) lineStartValues[i] = this._lines[i].length + eolLength;
			this._lineStarts = new PrefixSumComputer(lineStartValues);
		}
	}
	/**
	* All changes to a line's text go through this method
	*/
	_setLineText(lineIndex, newValue) {
		this._lines[lineIndex] = newValue;
		if (this._lineStarts) this._lineStarts.setValue(lineIndex, this._lines[lineIndex].length + this._eol.length);
	}
	_acceptDeleteRange(range) {
		if (range.startLineNumber === range.endLineNumber) {
			if (range.startColumn === range.endColumn) return;
			this._setLineText(range.startLineNumber - 1, this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1) + this._lines[range.startLineNumber - 1].substring(range.endColumn - 1));
			return;
		}
		this._setLineText(range.startLineNumber - 1, this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1) + this._lines[range.endLineNumber - 1].substring(range.endColumn - 1));
		this._lines.splice(range.startLineNumber, range.endLineNumber - range.startLineNumber);
		if (this._lineStarts) this._lineStarts.removeValues(range.startLineNumber, range.endLineNumber - range.startLineNumber);
	}
	_acceptInsertText(position, insertText) {
		if (insertText.length === 0) return;
		const insertLines = splitLines(insertText);
		if (insertLines.length === 1) {
			this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1) + insertLines[0] + this._lines[position.lineNumber - 1].substring(position.column - 1));
			return;
		}
		insertLines[insertLines.length - 1] += this._lines[position.lineNumber - 1].substring(position.column - 1);
		this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1) + insertLines[0]);
		const newLengths = new Uint32Array(insertLines.length - 1);
		for (let i = 1; i < insertLines.length; i++) {
			this._lines.splice(position.lineNumber + i - 1, 0, insertLines[i]);
			newLengths[i - 1] = insertLines[i].length + this._eol.length;
		}
		if (this._lineStarts) this._lineStarts.insertValues(position.lineNumber, newLengths);
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/services/textModelSync/textModelSync.impl.js
/**
* Stop syncing a model to the worker if it was not needed for 1 min.
*/
const STOP_SYNC_MODEL_DELTA_TIME_MS = 60 * 1e3;
var WorkerTextModelSyncClient = class extends Disposable {
	constructor(proxy, modelService, keepIdleModels = false) {
		super();
		this._syncedModels = Object.create(null);
		this._syncedModelsLastUsedTime = Object.create(null);
		this._proxy = proxy;
		this._modelService = modelService;
		if (!keepIdleModels) {
			const timer = new IntervalTimer();
			timer.cancelAndSet(() => this._checkStopModelSync(), Math.round(STOP_SYNC_MODEL_DELTA_TIME_MS / 2));
			this._register(timer);
		}
	}
	dispose() {
		for (const modelUrl in this._syncedModels) dispose(this._syncedModels[modelUrl]);
		this._syncedModels = Object.create(null);
		this._syncedModelsLastUsedTime = Object.create(null);
		super.dispose();
	}
	ensureSyncedResources(resources, forceLargeModels = false) {
		for (const resource of resources) {
			const resourceStr = resource.toString();
			if (!this._syncedModels[resourceStr]) this._beginModelSync(resource, forceLargeModels);
			if (this._syncedModels[resourceStr]) this._syncedModelsLastUsedTime[resourceStr] = (/* @__PURE__ */ new Date()).getTime();
		}
	}
	_checkStopModelSync() {
		const currentTime = (/* @__PURE__ */ new Date()).getTime();
		const toRemove = [];
		for (const modelUrl in this._syncedModelsLastUsedTime) if (currentTime - this._syncedModelsLastUsedTime[modelUrl] > STOP_SYNC_MODEL_DELTA_TIME_MS) toRemove.push(modelUrl);
		for (const e of toRemove) this._stopModelSync(e);
	}
	_beginModelSync(resource, forceLargeModels) {
		const model = this._modelService.getModel(resource);
		if (!model) return;
		if (!forceLargeModels && model.isTooLargeForSyncing()) return;
		const modelUrl = resource.toString();
		this._proxy.$acceptNewModel({
			url: model.uri.toString(),
			lines: model.getLinesContent(),
			EOL: model.getEOL(),
			versionId: model.getVersionId()
		});
		const toDispose = new DisposableStore();
		toDispose.add(model.onDidChangeContent((e) => {
			this._proxy.$acceptModelChanged(modelUrl.toString(), e);
		}));
		toDispose.add(model.onWillDispose(() => {
			this._stopModelSync(modelUrl);
		}));
		toDispose.add(toDisposable(() => {
			this._proxy.$acceptRemovedModel(modelUrl);
		}));
		this._syncedModels[modelUrl] = toDispose;
	}
	_stopModelSync(modelUrl) {
		const toDispose = this._syncedModels[modelUrl];
		delete this._syncedModels[modelUrl];
		delete this._syncedModelsLastUsedTime[modelUrl];
		dispose(toDispose);
	}
};
var WorkerTextModelSyncServer = class {
	constructor() {
		this._models = Object.create(null);
	}
	getModel(uri) {
		return this._models[uri];
	}
	getModels() {
		const all = [];
		Object.keys(this._models).forEach((key) => all.push(this._models[key]));
		return all;
	}
	$acceptNewModel(data) {
		this._models[data.url] = new MirrorModel(URI.parse(data.url), data.lines, data.EOL, data.versionId);
	}
	$acceptModelChanged(uri, e) {
		if (!this._models[uri]) return;
		this._models[uri].onEvents(e);
	}
	$acceptRemovedModel(uri) {
		if (!this._models[uri]) return;
		delete this._models[uri];
	}
};
var MirrorModel = class extends MirrorTextModel {
	get uri() {
		return this._uri;
	}
	get eol() {
		return this._eol;
	}
	getValue() {
		return this.getText();
	}
	findMatches(regex) {
		const matches = [];
		for (let i = 0; i < this._lines.length; i++) {
			const line = this._lines[i];
			const offsetToAdd = this.offsetAt(new Position$1(i + 1, 1));
			const iteratorOverMatches = line.matchAll(regex);
			for (const match of iteratorOverMatches) {
				if (match.index || match.index === 0) match.index = match.index + offsetToAdd;
				matches.push(match);
			}
		}
		return matches;
	}
	getLinesContent() {
		return this._lines.slice(0);
	}
	getLineCount() {
		return this._lines.length;
	}
	getLineContent(lineNumber) {
		return this._lines[lineNumber - 1];
	}
	getWordAtPosition(position, wordDefinition) {
		const wordAtText = getWordAtText(position.column, ensureValidWordDefinition(wordDefinition), this._lines[position.lineNumber - 1], 0);
		if (wordAtText) return new Range$1(position.lineNumber, wordAtText.startColumn, position.lineNumber, wordAtText.endColumn);
		return null;
	}
	words(wordDefinition) {
		const lines = this._lines;
		const wordenize = this._wordenize.bind(this);
		let lineNumber = 0;
		let lineText = "";
		let wordRangesIdx = 0;
		let wordRanges = [];
		return { *[Symbol.iterator]() {
			while (true) if (wordRangesIdx < wordRanges.length) {
				const value = lineText.substring(wordRanges[wordRangesIdx].start, wordRanges[wordRangesIdx].end);
				wordRangesIdx += 1;
				yield value;
			} else if (lineNumber < lines.length) {
				lineText = lines[lineNumber];
				wordRanges = wordenize(lineText, wordDefinition);
				wordRangesIdx = 0;
				lineNumber += 1;
			} else break;
		} };
	}
	getLineWords(lineNumber, wordDefinition) {
		const content = this._lines[lineNumber - 1];
		const ranges = this._wordenize(content, wordDefinition);
		const words = [];
		for (const range of ranges) words.push({
			word: content.substring(range.start, range.end),
			startColumn: range.start + 1,
			endColumn: range.end + 1
		});
		return words;
	}
	_wordenize(content, wordDefinition) {
		const result = [];
		let match;
		wordDefinition.lastIndex = 0;
		while (match = wordDefinition.exec(content)) {
			if (match[0].length === 0) break;
			result.push({
				start: match.index,
				end: match.index + match[0].length
			});
		}
		return result;
	}
	getValueInRange(range) {
		range = this._validateRange(range);
		if (range.startLineNumber === range.endLineNumber) return this._lines[range.startLineNumber - 1].substring(range.startColumn - 1, range.endColumn - 1);
		const lineEnding = this._eol;
		const startLineIndex = range.startLineNumber - 1;
		const endLineIndex = range.endLineNumber - 1;
		const resultLines = [];
		resultLines.push(this._lines[startLineIndex].substring(range.startColumn - 1));
		for (let i = startLineIndex + 1; i < endLineIndex; i++) resultLines.push(this._lines[i]);
		resultLines.push(this._lines[endLineIndex].substring(0, range.endColumn - 1));
		return resultLines.join(lineEnding);
	}
	offsetAt(position) {
		position = this._validatePosition(position);
		this._ensureLineStarts();
		return this._lineStarts.getPrefixSum(position.lineNumber - 2) + (position.column - 1);
	}
	positionAt(offset) {
		offset = Math.floor(offset);
		offset = Math.max(0, offset);
		this._ensureLineStarts();
		const out = this._lineStarts.getIndexOf(offset);
		const lineLength = this._lines[out.index].length;
		return {
			lineNumber: 1 + out.index,
			column: 1 + Math.min(out.remainder, lineLength)
		};
	}
	_validateRange(range) {
		const start = this._validatePosition({
			lineNumber: range.startLineNumber,
			column: range.startColumn
		});
		const end = this._validatePosition({
			lineNumber: range.endLineNumber,
			column: range.endColumn
		});
		if (start.lineNumber !== range.startLineNumber || start.column !== range.startColumn || end.lineNumber !== range.endLineNumber || end.column !== range.endColumn) return {
			startLineNumber: start.lineNumber,
			startColumn: start.column,
			endLineNumber: end.lineNumber,
			endColumn: end.column
		};
		return range;
	}
	_validatePosition(position) {
		if (!Position$1.isIPosition(position)) throw new Error("bad position");
		let { lineNumber, column } = position;
		let hasChanged = false;
		if (lineNumber < 1) {
			lineNumber = 1;
			column = 1;
			hasChanged = true;
		} else if (lineNumber > this._lines.length) {
			lineNumber = this._lines.length;
			column = this._lines[lineNumber - 1].length + 1;
			hasChanged = true;
		} else {
			const maxCharacter = this._lines[lineNumber - 1].length + 1;
			if (column < 1) {
				column = 1;
				hasChanged = true;
			} else if (column > maxCharacter) {
				column = maxCharacter;
				hasChanged = true;
			}
		}
		if (!hasChanged) return position;
		else return {
			lineNumber,
			column
		};
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/services/editorSimpleWorker.js
/**
* @internal
*/
var BaseEditorSimpleWorker = class {
	constructor() {
		this._workerTextModelSyncServer = new WorkerTextModelSyncServer();
	}
	dispose() {}
	_getModel(uri) {
		return this._workerTextModelSyncServer.getModel(uri);
	}
	_getModels() {
		return this._workerTextModelSyncServer.getModels();
	}
	$acceptNewModel(data) {
		this._workerTextModelSyncServer.$acceptNewModel(data);
	}
	$acceptModelChanged(uri, e) {
		this._workerTextModelSyncServer.$acceptModelChanged(uri, e);
	}
	$acceptRemovedModel(uri) {
		this._workerTextModelSyncServer.$acceptRemovedModel(uri);
	}
	async $computeUnicodeHighlights(url, options, range) {
		const model = this._getModel(url);
		if (!model) return {
			ranges: [],
			hasMore: false,
			ambiguousCharacterCount: 0,
			invisibleCharacterCount: 0,
			nonBasicAsciiCharacterCount: 0
		};
		return UnicodeTextModelHighlighter.computeUnicodeHighlights(model, options, range);
	}
	async $findSectionHeaders(url, options) {
		const model = this._getModel(url);
		if (!model) return [];
		return findSectionHeaders(model, options);
	}
	async $computeDiff(originalUrl, modifiedUrl, options, algorithm) {
		const original = this._getModel(originalUrl);
		const modified = this._getModel(modifiedUrl);
		if (!original || !modified) return null;
		return EditorSimpleWorker.computeDiff(original, modified, options, algorithm);
	}
	static computeDiff(originalTextModel, modifiedTextModel, options, algorithm) {
		const diffAlgorithm = algorithm === "advanced" ? linesDiffComputers.getDefault() : linesDiffComputers.getLegacy();
		const originalLines = originalTextModel.getLinesContent();
		const modifiedLines = modifiedTextModel.getLinesContent();
		const result = diffAlgorithm.computeDiff(originalLines, modifiedLines, options);
		const identical = result.changes.length > 0 ? false : this._modelsAreIdentical(originalTextModel, modifiedTextModel);
		function getLineChanges(changes) {
			return changes.map((m) => [
				m.original.startLineNumber,
				m.original.endLineNumberExclusive,
				m.modified.startLineNumber,
				m.modified.endLineNumberExclusive,
				m.innerChanges?.map((m$1) => [
					m$1.originalRange.startLineNumber,
					m$1.originalRange.startColumn,
					m$1.originalRange.endLineNumber,
					m$1.originalRange.endColumn,
					m$1.modifiedRange.startLineNumber,
					m$1.modifiedRange.startColumn,
					m$1.modifiedRange.endLineNumber,
					m$1.modifiedRange.endColumn
				])
			]);
		}
		return {
			identical,
			quitEarly: result.hitTimeout,
			changes: getLineChanges(result.changes),
			moves: result.moves.map((m) => [
				m.lineRangeMapping.original.startLineNumber,
				m.lineRangeMapping.original.endLineNumberExclusive,
				m.lineRangeMapping.modified.startLineNumber,
				m.lineRangeMapping.modified.endLineNumberExclusive,
				getLineChanges(m.changes)
			])
		};
	}
	static _modelsAreIdentical(original, modified) {
		const originalLineCount = original.getLineCount();
		const modifiedLineCount = modified.getLineCount();
		if (originalLineCount !== modifiedLineCount) return false;
		for (let line = 1; line <= originalLineCount; line++) {
			const originalLine = original.getLineContent(line);
			const modifiedLine = modified.getLineContent(line);
			if (originalLine !== modifiedLine) return false;
		}
		return true;
	}
	static {
		this._diffLimit = 1e5;
	}
	async $computeMoreMinimalEdits(modelUrl, edits, pretty) {
		const model = this._getModel(modelUrl);
		if (!model) return edits;
		const result = [];
		let lastEol = void 0;
		edits = edits.slice(0).sort((a, b) => {
			if (a.range && b.range) return Range$1.compareRangesUsingStarts(a.range, b.range);
			const aRng = a.range ? 0 : 1;
			const bRng = b.range ? 0 : 1;
			return aRng - bRng;
		});
		let writeIndex = 0;
		for (let readIndex = 1; readIndex < edits.length; readIndex++) if (Range$1.getEndPosition(edits[writeIndex].range).equals(Range$1.getStartPosition(edits[readIndex].range))) {
			edits[writeIndex].range = Range$1.fromPositions(Range$1.getStartPosition(edits[writeIndex].range), Range$1.getEndPosition(edits[readIndex].range));
			edits[writeIndex].text += edits[readIndex].text;
		} else {
			writeIndex++;
			edits[writeIndex] = edits[readIndex];
		}
		edits.length = writeIndex + 1;
		for (let { range, text, eol } of edits) {
			if (typeof eol === "number") lastEol = eol;
			if (Range$1.isEmpty(range) && !text) continue;
			const original = model.getValueInRange(range);
			text = text.replace(/\r\n|\n|\r/g, model.eol);
			if (original === text) continue;
			if (Math.max(text.length, original.length) > EditorSimpleWorker._diffLimit) {
				result.push({
					range,
					text
				});
				continue;
			}
			const changes = stringDiff(original, text, pretty);
			const editOffset = model.offsetAt(Range$1.lift(range).getStartPosition());
			for (const change of changes) {
				const start = model.positionAt(editOffset + change.originalStart);
				const end = model.positionAt(editOffset + change.originalStart + change.originalLength);
				const newEdit = {
					text: text.substr(change.modifiedStart, change.modifiedLength),
					range: {
						startLineNumber: start.lineNumber,
						startColumn: start.column,
						endLineNumber: end.lineNumber,
						endColumn: end.column
					}
				};
				if (model.getValueInRange(newEdit.range) !== newEdit.text) result.push(newEdit);
			}
		}
		if (typeof lastEol === "number") result.push({
			eol: lastEol,
			text: "",
			range: {
				startLineNumber: 0,
				startColumn: 0,
				endLineNumber: 0,
				endColumn: 0
			}
		});
		return result;
	}
	async $computeLinks(modelUrl) {
		const model = this._getModel(modelUrl);
		if (!model) return null;
		return computeLinks(model);
	}
	async $computeDefaultDocumentColors(modelUrl) {
		const model = this._getModel(modelUrl);
		if (!model) return null;
		return computeDefaultDocumentColors(model);
	}
	static {
		this._suggestionsLimit = 1e4;
	}
	async $textualSuggest(modelUrls, leadingWord, wordDef, wordDefFlags) {
		const sw = new StopWatch();
		const wordDefRegExp = new RegExp(wordDef, wordDefFlags);
		const seen = /* @__PURE__ */ new Set();
		outer: for (const url of modelUrls) {
			const model = this._getModel(url);
			if (!model) continue;
			for (const word of model.words(wordDefRegExp)) {
				if (word === leadingWord || !isNaN(Number(word))) continue;
				seen.add(word);
				if (seen.size > EditorSimpleWorker._suggestionsLimit) break outer;
			}
		}
		return {
			words: Array.from(seen),
			duration: sw.elapsed()
		};
	}
	async $computeWordRanges(modelUrl, range, wordDef, wordDefFlags) {
		const model = this._getModel(modelUrl);
		if (!model) return Object.create(null);
		const wordDefRegExp = new RegExp(wordDef, wordDefFlags);
		const result = Object.create(null);
		for (let line = range.startLineNumber; line < range.endLineNumber; line++) {
			const words = model.getLineWords(line, wordDefRegExp);
			for (const word of words) {
				if (!isNaN(Number(word.word))) continue;
				let array = result[word.word];
				if (!array) {
					array = [];
					result[word.word] = array;
				}
				array.push({
					startLineNumber: line,
					startColumn: word.startColumn,
					endLineNumber: line,
					endColumn: word.endColumn
				});
			}
		}
		return result;
	}
	async $navigateValueSet(modelUrl, range, up, wordDef, wordDefFlags) {
		const model = this._getModel(modelUrl);
		if (!model) return null;
		const wordDefRegExp = new RegExp(wordDef, wordDefFlags);
		if (range.startColumn === range.endColumn) range = {
			startLineNumber: range.startLineNumber,
			startColumn: range.startColumn,
			endLineNumber: range.endLineNumber,
			endColumn: range.endColumn + 1
		};
		const selectionText = model.getValueInRange(range);
		const wordRange = model.getWordAtPosition({
			lineNumber: range.startLineNumber,
			column: range.startColumn
		}, wordDefRegExp);
		if (!wordRange) return null;
		const word = model.getValueInRange(wordRange);
		return BasicInplaceReplace.INSTANCE.navigateValueSet(range, selectionText, wordRange, word, up);
	}
};
/**
* @internal
*/
var EditorSimpleWorker = class extends BaseEditorSimpleWorker {
	constructor(_host, _foreignModuleFactory) {
		super();
		this._host = _host;
		this._foreignModuleFactory = _foreignModuleFactory;
		this._foreignModule = null;
	}
	async $ping() {
		return "pong";
	}
	$loadForeignModule(moduleId, createData, foreignHostMethods) {
		const proxyMethodRequest = (method, args) => {
			return this._host.$fhr(method, args);
		};
		const ctx = {
			host: createProxyObject(foreignHostMethods, proxyMethodRequest),
			getMirrorModels: () => {
				return this._getModels();
			}
		};
		if (this._foreignModuleFactory) {
			this._foreignModule = this._foreignModuleFactory(ctx, createData);
			return Promise.resolve(getAllMethodNames(this._foreignModule));
		}
		return new Promise((resolve, reject) => {
			const onModuleCallback = (foreignModule) => {
				this._foreignModule = foreignModule.create(ctx, createData);
				resolve(getAllMethodNames(this._foreignModule));
			};
			import(`${FileAccess.asBrowserUri(`${moduleId}.js`).toString(true)}`).then(onModuleCallback).catch(reject);
		});
	}
	$fmr(method, args) {
		if (!this._foreignModule || typeof this._foreignModule[method] !== "function") return Promise.reject(/* @__PURE__ */ new Error("Missing requestHandler or method: " + method));
		try {
			return Promise.resolve(this._foreignModule[method].apply(this._foreignModule, args));
		} catch (e) {
			return Promise.reject(e);
		}
	}
};
if (typeof importScripts === "function") globalThis.monaco = createMonacoBaseAPI();

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/browser/services/editorWorkerService.js
var __decorate$28 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$27 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
/**
* Stop the worker if it was not needed for 5 min.
*/
var STOP_WORKER_DELTA_TIME_MS = 300 * 1e3;
function canSyncModel(modelService, resource) {
	const model = modelService.getModel(resource);
	if (!model) return false;
	if (model.isTooLargeForSyncing()) return false;
	return true;
}
var EditorWorkerService = class EditorWorkerService$1 extends Disposable {
	constructor(workerDescriptor, modelService, configurationService, logService, _languageConfigurationService, languageFeaturesService) {
		super();
		this._languageConfigurationService = _languageConfigurationService;
		this._modelService = modelService;
		this._workerManager = this._register(new WorkerManager(workerDescriptor, this._modelService));
		this._logService = logService;
		this._register(languageFeaturesService.linkProvider.register({
			language: "*",
			hasAccessToAllModels: true
		}, { provideLinks: async (model, token) => {
			if (!canSyncModel(this._modelService, model.uri)) return Promise.resolve({ links: [] });
			const links = await (await this._workerWithResources([model.uri])).$computeLinks(model.uri.toString());
			return links && { links };
		} }));
		this._register(languageFeaturesService.completionProvider.register("*", new WordBasedCompletionItemProvider(this._workerManager, configurationService, this._modelService, this._languageConfigurationService)));
	}
	dispose() {
		super.dispose();
	}
	canComputeUnicodeHighlights(uri) {
		return canSyncModel(this._modelService, uri);
	}
	async computedUnicodeHighlights(uri, options, range) {
		return (await this._workerWithResources([uri])).$computeUnicodeHighlights(uri.toString(), options, range);
	}
	async computeDiff(original, modified, options, algorithm) {
		const result = await (await this._workerWithResources([original, modified], true)).$computeDiff(original.toString(), modified.toString(), options, algorithm);
		if (!result) return null;
		return {
			identical: result.identical,
			quitEarly: result.quitEarly,
			changes: toLineRangeMappings(result.changes),
			moves: result.moves.map((m) => new MovedText(new LineRangeMapping(new LineRange(m[0], m[1]), new LineRange(m[2], m[3])), toLineRangeMappings(m[4])))
		};
		function toLineRangeMappings(changes) {
			return changes.map((c) => new DetailedLineRangeMapping(new LineRange(c[0], c[1]), new LineRange(c[2], c[3]), c[4]?.map((c$1) => new RangeMapping(new Range$1(c$1[0], c$1[1], c$1[2], c$1[3]), new Range$1(c$1[4], c$1[5], c$1[6], c$1[7])))));
		}
	}
	async computeMoreMinimalEdits(resource, edits, pretty = false) {
		if (isNonEmptyArray(edits)) {
			if (!canSyncModel(this._modelService, resource)) return Promise.resolve(edits);
			const sw = StopWatch.create();
			const result = this._workerWithResources([resource]).then((worker) => worker.$computeMoreMinimalEdits(resource.toString(), edits, pretty));
			result.finally(() => this._logService.trace("FORMAT#computeMoreMinimalEdits", resource.toString(true), sw.elapsed()));
			return Promise.race([result, timeout(1e3).then(() => edits)]);
		} else return Promise.resolve(void 0);
	}
	canNavigateValueSet(resource) {
		return canSyncModel(this._modelService, resource);
	}
	async navigateValueSet(resource, range, up) {
		const model = this._modelService.getModel(resource);
		if (!model) return null;
		const wordDefRegExp = this._languageConfigurationService.getLanguageConfiguration(model.getLanguageId()).getWordDefinition();
		const wordDef = wordDefRegExp.source;
		const wordDefFlags = wordDefRegExp.flags;
		return (await this._workerWithResources([resource])).$navigateValueSet(resource.toString(), range, up, wordDef, wordDefFlags);
	}
	canComputeWordRanges(resource) {
		return canSyncModel(this._modelService, resource);
	}
	async computeWordRanges(resource, range) {
		const model = this._modelService.getModel(resource);
		if (!model) return Promise.resolve(null);
		const wordDefRegExp = this._languageConfigurationService.getLanguageConfiguration(model.getLanguageId()).getWordDefinition();
		const wordDef = wordDefRegExp.source;
		const wordDefFlags = wordDefRegExp.flags;
		return (await this._workerWithResources([resource])).$computeWordRanges(resource.toString(), range, wordDef, wordDefFlags);
	}
	async findSectionHeaders(uri, options) {
		return (await this._workerWithResources([uri])).$findSectionHeaders(uri.toString(), options);
	}
	async computeDefaultDocumentColors(uri) {
		return (await this._workerWithResources([uri])).$computeDefaultDocumentColors(uri.toString());
	}
	async _workerWithResources(resources, forceLargeModels = false) {
		return await (await this._workerManager.withWorker()).workerWithSyncedResources(resources, forceLargeModels);
	}
};
EditorWorkerService = __decorate$28([
	__param$27(1, IModelService),
	__param$27(2, ITextResourceConfigurationService),
	__param$27(3, ILogService),
	__param$27(4, ILanguageConfigurationService),
	__param$27(5, ILanguageFeaturesService)
], EditorWorkerService);
var WordBasedCompletionItemProvider = class {
	constructor(workerManager, configurationService, modelService, languageConfigurationService) {
		this.languageConfigurationService = languageConfigurationService;
		this._debugDisplayName = "wordbasedCompletions";
		this._workerManager = workerManager;
		this._configurationService = configurationService;
		this._modelService = modelService;
	}
	async provideCompletionItems(model, position) {
		const config = this._configurationService.getValue(model.uri, position, "editor");
		if (config.wordBasedSuggestions === "off") return;
		const models = [];
		if (config.wordBasedSuggestions === "currentDocument") {
			if (canSyncModel(this._modelService, model.uri)) models.push(model.uri);
		} else for (const candidate of this._modelService.getModels()) {
			if (!canSyncModel(this._modelService, candidate.uri)) continue;
			if (candidate === model) models.unshift(candidate.uri);
			else if (config.wordBasedSuggestions === "allDocuments" || candidate.getLanguageId() === model.getLanguageId()) models.push(candidate.uri);
		}
		if (models.length === 0) return;
		const wordDefRegExp = this.languageConfigurationService.getLanguageConfiguration(model.getLanguageId()).getWordDefinition();
		const word = model.getWordAtPosition(position);
		const replace = !word ? Range$1.fromPositions(position) : new Range$1(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
		const insert = replace.setEndPosition(position.lineNumber, position.column);
		const data = await (await this._workerManager.withWorker()).textualSuggest(models, word?.word, wordDefRegExp);
		if (!data) return;
		return {
			duration: data.duration,
			suggestions: data.words.map((word$1) => {
				return {
					kind: 18,
					label: word$1,
					insertText: word$1,
					range: {
						insert,
						replace
					}
				};
			})
		};
	}
};
var WorkerManager = class WorkerManager$1 extends Disposable {
	constructor(_workerDescriptor, modelService) {
		super();
		this._workerDescriptor = _workerDescriptor;
		this._modelService = modelService;
		this._editorWorkerClient = null;
		this._lastWorkerUsedTime = (/* @__PURE__ */ new Date()).getTime();
		this._register(new WindowIntervalTimer()).cancelAndSet(() => this._checkStopIdleWorker(), Math.round(STOP_WORKER_DELTA_TIME_MS / 2), mainWindow);
		this._register(this._modelService.onModelRemoved((_) => this._checkStopEmptyWorker()));
	}
	dispose() {
		if (this._editorWorkerClient) {
			this._editorWorkerClient.dispose();
			this._editorWorkerClient = null;
		}
		super.dispose();
	}
	/**
	* Check if the model service has no more models and stop the worker if that is the case.
	*/
	_checkStopEmptyWorker() {
		if (!this._editorWorkerClient) return;
		if (this._modelService.getModels().length === 0) {
			this._editorWorkerClient.dispose();
			this._editorWorkerClient = null;
		}
	}
	/**
	* Check if the worker has been idle for a while and then stop it.
	*/
	_checkStopIdleWorker() {
		if (!this._editorWorkerClient) return;
		if ((/* @__PURE__ */ new Date()).getTime() - this._lastWorkerUsedTime > STOP_WORKER_DELTA_TIME_MS) {
			this._editorWorkerClient.dispose();
			this._editorWorkerClient = null;
		}
	}
	withWorker() {
		this._lastWorkerUsedTime = (/* @__PURE__ */ new Date()).getTime();
		if (!this._editorWorkerClient) this._editorWorkerClient = new EditorWorkerClient(this._workerDescriptor, false, this._modelService);
		return Promise.resolve(this._editorWorkerClient);
	}
};
WorkerManager = __decorate$28([__param$27(1, IModelService)], WorkerManager);
var SynchronousWorkerClient = class {
	constructor(instance) {
		this._instance = instance;
		this.proxy = this._instance;
	}
	dispose() {
		this._instance.dispose();
	}
	setChannel(channel, handler) {
		throw new Error(`Not supported`);
	}
};
var EditorWorkerClient = class EditorWorkerClient$1 extends Disposable {
	constructor(_workerDescriptor, keepIdleModels, modelService) {
		super();
		this._workerDescriptor = _workerDescriptor;
		this._disposed = false;
		this._modelService = modelService;
		this._keepIdleModels = keepIdleModels;
		this._worker = null;
		this._modelManager = null;
	}
	fhr(method, args) {
		throw new Error(`Not implemented!`);
	}
	_getOrCreateWorker() {
		if (!this._worker) try {
			this._worker = this._register(createWebWorker$2(this._workerDescriptor));
			EditorWorkerHost.setChannel(this._worker, this._createEditorWorkerHost());
		} catch (err) {
			logOnceWebWorkerWarning(err);
			this._worker = this._createFallbackLocalWorker();
		}
		return this._worker;
	}
	async _getProxy() {
		try {
			const proxy = this._getOrCreateWorker().proxy;
			await proxy.$ping();
			return proxy;
		} catch (err) {
			logOnceWebWorkerWarning(err);
			this._worker = this._createFallbackLocalWorker();
			return this._worker.proxy;
		}
	}
	_createFallbackLocalWorker() {
		return new SynchronousWorkerClient(new EditorSimpleWorker(this._createEditorWorkerHost(), null));
	}
	_createEditorWorkerHost() {
		return { $fhr: (method, args) => this.fhr(method, args) };
	}
	_getOrCreateModelManager(proxy) {
		if (!this._modelManager) this._modelManager = this._register(new WorkerTextModelSyncClient(proxy, this._modelService, this._keepIdleModels));
		return this._modelManager;
	}
	async workerWithSyncedResources(resources, forceLargeModels = false) {
		if (this._disposed) return Promise.reject(canceled());
		const proxy = await this._getProxy();
		this._getOrCreateModelManager(proxy).ensureSyncedResources(resources, forceLargeModels);
		return proxy;
	}
	async textualSuggest(resources, leadingWord, wordDefRegExp) {
		const proxy = await this.workerWithSyncedResources(resources);
		const wordDef = wordDefRegExp.source;
		const wordDefFlags = wordDefRegExp.flags;
		return proxy.$textualSuggest(resources.map((r) => r.toString()), leadingWord, wordDef, wordDefFlags);
	}
	dispose() {
		super.dispose();
		this._disposed = true;
	}
};
EditorWorkerClient = __decorate$28([__param$27(2, IModelService)], EditorWorkerClient);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/browser/services/abstractCodeEditorService.js
var __decorate$27 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$26 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var AbstractCodeEditorService = class AbstractCodeEditorService$1 extends Disposable {
	constructor(_themeService) {
		super();
		this._themeService = _themeService;
		this._onWillCreateCodeEditor = this._register(new Emitter$1());
		this._onCodeEditorAdd = this._register(new Emitter$1());
		this.onCodeEditorAdd = this._onCodeEditorAdd.event;
		this._onCodeEditorRemove = this._register(new Emitter$1());
		this.onCodeEditorRemove = this._onCodeEditorRemove.event;
		this._onWillCreateDiffEditor = this._register(new Emitter$1());
		this._onDiffEditorAdd = this._register(new Emitter$1());
		this.onDiffEditorAdd = this._onDiffEditorAdd.event;
		this._onDiffEditorRemove = this._register(new Emitter$1());
		this.onDiffEditorRemove = this._onDiffEditorRemove.event;
		this._decorationOptionProviders = /* @__PURE__ */ new Map();
		this._codeEditorOpenHandlers = new LinkedList();
		this._modelProperties = /* @__PURE__ */ new Map();
		this._codeEditors = Object.create(null);
		this._diffEditors = Object.create(null);
		this._globalStyleSheet = null;
	}
	willCreateCodeEditor() {
		this._onWillCreateCodeEditor.fire();
	}
	addCodeEditor(editor$1) {
		this._codeEditors[editor$1.getId()] = editor$1;
		this._onCodeEditorAdd.fire(editor$1);
	}
	removeCodeEditor(editor$1) {
		if (delete this._codeEditors[editor$1.getId()]) this._onCodeEditorRemove.fire(editor$1);
	}
	listCodeEditors() {
		return Object.keys(this._codeEditors).map((id) => this._codeEditors[id]);
	}
	willCreateDiffEditor() {
		this._onWillCreateDiffEditor.fire();
	}
	addDiffEditor(editor$1) {
		this._diffEditors[editor$1.getId()] = editor$1;
		this._onDiffEditorAdd.fire(editor$1);
	}
	listDiffEditors() {
		return Object.keys(this._diffEditors).map((id) => this._diffEditors[id]);
	}
	getFocusedCodeEditor() {
		let editorWithWidgetFocus = null;
		const editors = this.listCodeEditors();
		for (const editor$1 of editors) {
			if (editor$1.hasTextFocus()) return editor$1;
			if (editor$1.hasWidgetFocus()) editorWithWidgetFocus = editor$1;
		}
		return editorWithWidgetFocus;
	}
	removeDecorationType(key) {
		const provider = this._decorationOptionProviders.get(key);
		if (provider) {
			provider.refCount--;
			if (provider.refCount <= 0) {
				this._decorationOptionProviders.delete(key);
				provider.dispose();
				this.listCodeEditors().forEach((ed) => ed.removeDecorationsByType(key));
			}
		}
	}
	setModelProperty(resource, key, value) {
		const key1 = resource.toString();
		let dest;
		if (this._modelProperties.has(key1)) dest = this._modelProperties.get(key1);
		else {
			dest = /* @__PURE__ */ new Map();
			this._modelProperties.set(key1, dest);
		}
		dest.set(key, value);
	}
	getModelProperty(resource, key) {
		const key1 = resource.toString();
		if (this._modelProperties.has(key1)) return this._modelProperties.get(key1).get(key);
	}
	async openCodeEditor(input, source, sideBySide) {
		for (const handler of this._codeEditorOpenHandlers) {
			const candidate = await handler(input, source, sideBySide);
			if (candidate !== null) return candidate;
		}
		return null;
	}
	registerCodeEditorOpenHandler(handler) {
		const rm = this._codeEditorOpenHandlers.unshift(handler);
		return toDisposable(rm);
	}
};
AbstractCodeEditorService = __decorate$27([__param$26(0, IThemeService)], AbstractCodeEditorService);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeEditorService.js
var __decorate$26 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$25 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var StandaloneCodeEditorService = class StandaloneCodeEditorService$1 extends AbstractCodeEditorService {
	constructor(contextKeyService, themeService) {
		super(themeService);
		this._register(this.onCodeEditorAdd(() => this._checkContextKey()));
		this._register(this.onCodeEditorRemove(() => this._checkContextKey()));
		this._editorIsOpen = contextKeyService.createKey("editorIsOpen", false);
		this._activeCodeEditor = null;
		this._register(this.registerCodeEditorOpenHandler(async (input, source, sideBySide) => {
			if (!source) return null;
			return this.doOpenEditor(source, input);
		}));
	}
	_checkContextKey() {
		let hasCodeEditor = false;
		for (const editor$1 of this.listCodeEditors()) if (!editor$1.isSimpleWidget) {
			hasCodeEditor = true;
			break;
		}
		this._editorIsOpen.set(hasCodeEditor);
	}
	setActiveCodeEditor(activeCodeEditor) {
		this._activeCodeEditor = activeCodeEditor;
	}
	getActiveCodeEditor() {
		return this._activeCodeEditor;
	}
	doOpenEditor(editor$1, input) {
		if (!this.findModel(editor$1, input.resource)) {
			if (input.resource) {
				const schema = input.resource.scheme;
				if (schema === Schemas.http || schema === Schemas.https) {
					windowOpenNoOpener(input.resource.toString());
					return editor$1;
				}
			}
			return null;
		}
		const selection = input.options ? input.options.selection : null;
		if (selection) if (typeof selection.endLineNumber === "number" && typeof selection.endColumn === "number") {
			editor$1.setSelection(selection);
			editor$1.revealRangeInCenter(selection, 1);
		} else {
			const pos = {
				lineNumber: selection.startLineNumber,
				column: selection.startColumn
			};
			editor$1.setPosition(pos);
			editor$1.revealPositionInCenter(pos, 1);
		}
		return editor$1;
	}
	findModel(editor$1, resource) {
		const model = editor$1.getModel();
		if (model && model.uri.toString() !== resource.toString()) return null;
		return model;
	}
};
StandaloneCodeEditorService = __decorate$26([__param$25(0, IContextKeyService), __param$25(1, IThemeService)], StandaloneCodeEditorService);
registerSingleton(ICodeEditorService, StandaloneCodeEditorService, 0);

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/layout/browser/layoutService.js
const ILayoutService = createDecorator("layoutService");

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneLayoutService.js
var __decorate$25 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$24 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var StandaloneLayoutService = class StandaloneLayoutService$1 {
	get mainContainer() {
		return firstOrDefault(this._codeEditorService.listCodeEditors())?.getContainerDomNode() ?? mainWindow.document.body;
	}
	get activeContainer() {
		return (this._codeEditorService.getFocusedCodeEditor() ?? this._codeEditorService.getActiveCodeEditor())?.getContainerDomNode() ?? this.mainContainer;
	}
	get mainContainerDimension() {
		return getClientArea(this.mainContainer);
	}
	get activeContainerDimension() {
		return getClientArea(this.activeContainer);
	}
	get containers() {
		return coalesce(this._codeEditorService.listCodeEditors().map((codeEditor) => codeEditor.getContainerDomNode()));
	}
	getContainer() {
		return this.activeContainer;
	}
	whenContainerStylesLoaded() {}
	focus() {
		this._codeEditorService.getFocusedCodeEditor()?.focus();
	}
	constructor(_codeEditorService) {
		this._codeEditorService = _codeEditorService;
		this.onDidLayoutMainContainer = Event.None;
		this.onDidLayoutActiveContainer = Event.None;
		this.onDidLayoutContainer = Event.None;
		this.onDidChangeActiveContainer = Event.None;
		this.onDidAddContainer = Event.None;
		this.mainContainerOffset = {
			top: 0,
			quickPickTop: 0
		};
		this.activeContainerOffset = {
			top: 0,
			quickPickTop: 0
		};
	}
};
StandaloneLayoutService = __decorate$25([__param$24(0, ICodeEditorService)], StandaloneLayoutService);
var EditorScopedLayoutService = class EditorScopedLayoutService$1 extends StandaloneLayoutService {
	get mainContainer() {
		return this._container;
	}
	constructor(_container, codeEditorService) {
		super(codeEditorService);
		this._container = _container;
	}
};
EditorScopedLayoutService = __decorate$25([__param$24(1, ICodeEditorService)], EditorScopedLayoutService);
registerSingleton(ILayoutService, StandaloneLayoutService, 1);

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/undoRedo/common/undoRedoService.js
var __decorate$24 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$23 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
function getResourceLabel(resource) {
	return resource.scheme === Schemas.file ? resource.fsPath : resource.path;
}
var stackElementCounter = 0;
var ResourceStackElement = class {
	constructor(actual, resourceLabel, strResource, groupId, groupOrder, sourceId, sourceOrder) {
		this.id = ++stackElementCounter;
		this.type = 0;
		this.actual = actual;
		this.label = actual.label;
		this.confirmBeforeUndo = actual.confirmBeforeUndo || false;
		this.resourceLabel = resourceLabel;
		this.strResource = strResource;
		this.resourceLabels = [this.resourceLabel];
		this.strResources = [this.strResource];
		this.groupId = groupId;
		this.groupOrder = groupOrder;
		this.sourceId = sourceId;
		this.sourceOrder = sourceOrder;
		this.isValid = true;
	}
	setValid(isValid) {
		this.isValid = isValid;
	}
	toString() {
		return `[id:${this.id}] [group:${this.groupId}] [${this.isValid ? "  VALID" : "INVALID"}] ${this.actual.constructor.name} - ${this.actual}`;
	}
};
var ResourceReasonPair = class {
	constructor(resourceLabel, reason) {
		this.resourceLabel = resourceLabel;
		this.reason = reason;
	}
};
var RemovedResources = class {
	constructor() {
		this.elements = /* @__PURE__ */ new Map();
	}
	createMessage() {
		const externalRemoval = [];
		const noParallelUniverses = [];
		for (const [, element] of this.elements) (element.reason === 0 ? externalRemoval : noParallelUniverses).push(element.resourceLabel);
		const messages = [];
		if (externalRemoval.length > 0) messages.push(localize({
			key: "externalRemoval",
			comment: ["{0} is a list of filenames"]
		}, "The following files have been closed and modified on disk: {0}.", externalRemoval.join(", ")));
		if (noParallelUniverses.length > 0) messages.push(localize({
			key: "noParallelUniverses",
			comment: ["{0} is a list of filenames"]
		}, "The following files have been modified in an incompatible way: {0}.", noParallelUniverses.join(", ")));
		return messages.join("\n");
	}
	get size() {
		return this.elements.size;
	}
	has(strResource) {
		return this.elements.has(strResource);
	}
	set(strResource, value) {
		this.elements.set(strResource, value);
	}
	delete(strResource) {
		return this.elements.delete(strResource);
	}
};
var WorkspaceStackElement = class {
	constructor(actual, resourceLabels, strResources, groupId, groupOrder, sourceId, sourceOrder) {
		this.id = ++stackElementCounter;
		this.type = 1;
		this.actual = actual;
		this.label = actual.label;
		this.confirmBeforeUndo = actual.confirmBeforeUndo || false;
		this.resourceLabels = resourceLabels;
		this.strResources = strResources;
		this.groupId = groupId;
		this.groupOrder = groupOrder;
		this.sourceId = sourceId;
		this.sourceOrder = sourceOrder;
		this.removedResources = null;
		this.invalidatedResources = null;
	}
	canSplit() {
		return typeof this.actual.split === "function";
	}
	removeResource(resourceLabel, strResource, reason) {
		if (!this.removedResources) this.removedResources = new RemovedResources();
		if (!this.removedResources.has(strResource)) this.removedResources.set(strResource, new ResourceReasonPair(resourceLabel, reason));
	}
	setValid(resourceLabel, strResource, isValid) {
		if (isValid) {
			if (this.invalidatedResources) {
				this.invalidatedResources.delete(strResource);
				if (this.invalidatedResources.size === 0) this.invalidatedResources = null;
			}
		} else {
			if (!this.invalidatedResources) this.invalidatedResources = new RemovedResources();
			if (!this.invalidatedResources.has(strResource)) this.invalidatedResources.set(strResource, new ResourceReasonPair(resourceLabel, 0));
		}
	}
	toString() {
		return `[id:${this.id}] [group:${this.groupId}] [${this.invalidatedResources ? "INVALID" : "  VALID"}] ${this.actual.constructor.name} - ${this.actual}`;
	}
};
var ResourceEditStack = class {
	constructor(resourceLabel, strResource) {
		this.resourceLabel = resourceLabel;
		this.strResource = strResource;
		this._past = [];
		this._future = [];
		this.locked = false;
		this.versionId = 1;
	}
	dispose() {
		for (const element of this._past) if (element.type === 1) element.removeResource(this.resourceLabel, this.strResource, 0);
		for (const element of this._future) if (element.type === 1) element.removeResource(this.resourceLabel, this.strResource, 0);
		this.versionId++;
	}
	toString() {
		const result = [];
		result.push(`* ${this.strResource}:`);
		for (let i = 0; i < this._past.length; i++) result.push(`   * [UNDO] ${this._past[i]}`);
		for (let i = this._future.length - 1; i >= 0; i--) result.push(`   * [REDO] ${this._future[i]}`);
		return result.join("\n");
	}
	flushAllElements() {
		this._past = [];
		this._future = [];
		this.versionId++;
	}
	_setElementValidFlag(element, isValid) {
		if (element.type === 1) element.setValid(this.resourceLabel, this.strResource, isValid);
		else element.setValid(isValid);
	}
	setElementsValidFlag(isValid, filter) {
		for (const element of this._past) if (filter(element.actual)) this._setElementValidFlag(element, isValid);
		for (const element of this._future) if (filter(element.actual)) this._setElementValidFlag(element, isValid);
	}
	pushElement(element) {
		for (const futureElement of this._future) if (futureElement.type === 1) futureElement.removeResource(this.resourceLabel, this.strResource, 1);
		this._future = [];
		this._past.push(element);
		this.versionId++;
	}
	createSnapshot(resource) {
		const elements = [];
		for (let i = 0, len = this._past.length; i < len; i++) elements.push(this._past[i].id);
		for (let i = this._future.length - 1; i >= 0; i--) elements.push(this._future[i].id);
		return new ResourceEditStackSnapshot(resource, elements);
	}
	restoreSnapshot(snapshot) {
		const snapshotLength = snapshot.elements.length;
		let isOK = true;
		let snapshotIndex = 0;
		let removePastAfter = -1;
		for (let i = 0, len = this._past.length; i < len; i++, snapshotIndex++) {
			const element = this._past[i];
			if (isOK && (snapshotIndex >= snapshotLength || element.id !== snapshot.elements[snapshotIndex])) {
				isOK = false;
				removePastAfter = 0;
			}
			if (!isOK && element.type === 1) element.removeResource(this.resourceLabel, this.strResource, 0);
		}
		let removeFutureBefore = -1;
		for (let i = this._future.length - 1; i >= 0; i--, snapshotIndex++) {
			const element = this._future[i];
			if (isOK && (snapshotIndex >= snapshotLength || element.id !== snapshot.elements[snapshotIndex])) {
				isOK = false;
				removeFutureBefore = i;
			}
			if (!isOK && element.type === 1) element.removeResource(this.resourceLabel, this.strResource, 0);
		}
		if (removePastAfter !== -1) this._past = this._past.slice(0, removePastAfter);
		if (removeFutureBefore !== -1) this._future = this._future.slice(removeFutureBefore + 1);
		this.versionId++;
	}
	getElements() {
		const past = [];
		const future = [];
		for (const element of this._past) past.push(element.actual);
		for (const element of this._future) future.push(element.actual);
		return {
			past,
			future
		};
	}
	getClosestPastElement() {
		if (this._past.length === 0) return null;
		return this._past[this._past.length - 1];
	}
	getSecondClosestPastElement() {
		if (this._past.length < 2) return null;
		return this._past[this._past.length - 2];
	}
	getClosestFutureElement() {
		if (this._future.length === 0) return null;
		return this._future[this._future.length - 1];
	}
	hasPastElements() {
		return this._past.length > 0;
	}
	hasFutureElements() {
		return this._future.length > 0;
	}
	splitPastWorkspaceElement(toRemove, individualMap) {
		for (let j = this._past.length - 1; j >= 0; j--) if (this._past[j] === toRemove) {
			if (individualMap.has(this.strResource)) this._past[j] = individualMap.get(this.strResource);
			else this._past.splice(j, 1);
			break;
		}
		this.versionId++;
	}
	splitFutureWorkspaceElement(toRemove, individualMap) {
		for (let j = this._future.length - 1; j >= 0; j--) if (this._future[j] === toRemove) {
			if (individualMap.has(this.strResource)) this._future[j] = individualMap.get(this.strResource);
			else this._future.splice(j, 1);
			break;
		}
		this.versionId++;
	}
	moveBackward(element) {
		this._past.pop();
		this._future.push(element);
		this.versionId++;
	}
	moveForward(element) {
		this._future.pop();
		this._past.push(element);
		this.versionId++;
	}
};
var EditStackSnapshot = class {
	constructor(editStacks) {
		this.editStacks = editStacks;
		this._versionIds = [];
		for (let i = 0, len = this.editStacks.length; i < len; i++) this._versionIds[i] = this.editStacks[i].versionId;
	}
	isValid() {
		for (let i = 0, len = this.editStacks.length; i < len; i++) if (this._versionIds[i] !== this.editStacks[i].versionId) return false;
		return true;
	}
};
var missingEditStack = new ResourceEditStack("", "");
missingEditStack.locked = true;
var UndoRedoService = class UndoRedoService$1 {
	constructor(_dialogService, _notificationService) {
		this._dialogService = _dialogService;
		this._notificationService = _notificationService;
		this._editStacks = /* @__PURE__ */ new Map();
		this._uriComparisonKeyComputers = [];
	}
	getUriComparisonKey(resource) {
		for (const uriComparisonKeyComputer of this._uriComparisonKeyComputers) if (uriComparisonKeyComputer[0] === resource.scheme) return uriComparisonKeyComputer[1].getComparisonKey(resource);
		return resource.toString();
	}
	_print(label) {
		console.log(`------------------------------------`);
		console.log(`AFTER ${label}: `);
		const str = [];
		for (const element of this._editStacks) str.push(element[1].toString());
		console.log(str.join("\n"));
	}
	pushElement(element, group = UndoRedoGroup.None, source = UndoRedoSource.None) {
		if (element.type === 0) {
			const resourceLabel = getResourceLabel(element.resource);
			const strResource = this.getUriComparisonKey(element.resource);
			this._pushElement(new ResourceStackElement(element, resourceLabel, strResource, group.id, group.nextOrder(), source.id, source.nextOrder()));
		} else {
			const seen = /* @__PURE__ */ new Set();
			const resourceLabels = [];
			const strResources = [];
			for (const resource of element.resources) {
				const resourceLabel = getResourceLabel(resource);
				const strResource = this.getUriComparisonKey(resource);
				if (seen.has(strResource)) continue;
				seen.add(strResource);
				resourceLabels.push(resourceLabel);
				strResources.push(strResource);
			}
			if (resourceLabels.length === 1) this._pushElement(new ResourceStackElement(element, resourceLabels[0], strResources[0], group.id, group.nextOrder(), source.id, source.nextOrder()));
			else this._pushElement(new WorkspaceStackElement(element, resourceLabels, strResources, group.id, group.nextOrder(), source.id, source.nextOrder()));
		}
	}
	_pushElement(element) {
		for (let i = 0, len = element.strResources.length; i < len; i++) {
			const resourceLabel = element.resourceLabels[i];
			const strResource = element.strResources[i];
			let editStack;
			if (this._editStacks.has(strResource)) editStack = this._editStacks.get(strResource);
			else {
				editStack = new ResourceEditStack(resourceLabel, strResource);
				this._editStacks.set(strResource, editStack);
			}
			editStack.pushElement(element);
		}
	}
	getLastElement(resource) {
		const strResource = this.getUriComparisonKey(resource);
		if (this._editStacks.has(strResource)) {
			const editStack = this._editStacks.get(strResource);
			if (editStack.hasFutureElements()) return null;
			const closestPastElement = editStack.getClosestPastElement();
			return closestPastElement ? closestPastElement.actual : null;
		}
		return null;
	}
	_splitPastWorkspaceElement(toRemove, ignoreResources) {
		const individualArr = toRemove.actual.split();
		const individualMap = /* @__PURE__ */ new Map();
		for (const _element of individualArr) {
			const resourceLabel = getResourceLabel(_element.resource);
			const strResource = this.getUriComparisonKey(_element.resource);
			const element = new ResourceStackElement(_element, resourceLabel, strResource, 0, 0, 0, 0);
			individualMap.set(element.strResource, element);
		}
		for (const strResource of toRemove.strResources) {
			if (ignoreResources && ignoreResources.has(strResource)) continue;
			this._editStacks.get(strResource).splitPastWorkspaceElement(toRemove, individualMap);
		}
	}
	_splitFutureWorkspaceElement(toRemove, ignoreResources) {
		const individualArr = toRemove.actual.split();
		const individualMap = /* @__PURE__ */ new Map();
		for (const _element of individualArr) {
			const resourceLabel = getResourceLabel(_element.resource);
			const strResource = this.getUriComparisonKey(_element.resource);
			const element = new ResourceStackElement(_element, resourceLabel, strResource, 0, 0, 0, 0);
			individualMap.set(element.strResource, element);
		}
		for (const strResource of toRemove.strResources) {
			if (ignoreResources && ignoreResources.has(strResource)) continue;
			this._editStacks.get(strResource).splitFutureWorkspaceElement(toRemove, individualMap);
		}
	}
	removeElements(resource) {
		const strResource = typeof resource === "string" ? resource : this.getUriComparisonKey(resource);
		if (this._editStacks.has(strResource)) {
			this._editStacks.get(strResource).dispose();
			this._editStacks.delete(strResource);
		}
	}
	setElementsValidFlag(resource, isValid, filter) {
		const strResource = this.getUriComparisonKey(resource);
		if (this._editStacks.has(strResource)) this._editStacks.get(strResource).setElementsValidFlag(isValid, filter);
	}
	createSnapshot(resource) {
		const strResource = this.getUriComparisonKey(resource);
		if (this._editStacks.has(strResource)) return this._editStacks.get(strResource).createSnapshot(resource);
		return new ResourceEditStackSnapshot(resource, []);
	}
	restoreSnapshot(snapshot) {
		const strResource = this.getUriComparisonKey(snapshot.resource);
		if (this._editStacks.has(strResource)) {
			const editStack = this._editStacks.get(strResource);
			editStack.restoreSnapshot(snapshot);
			if (!editStack.hasPastElements() && !editStack.hasFutureElements()) {
				editStack.dispose();
				this._editStacks.delete(strResource);
			}
		}
	}
	getElements(resource) {
		const strResource = this.getUriComparisonKey(resource);
		if (this._editStacks.has(strResource)) return this._editStacks.get(strResource).getElements();
		return {
			past: [],
			future: []
		};
	}
	_findClosestUndoElementWithSource(sourceId) {
		if (!sourceId) return [null, null];
		let matchedElement = null;
		let matchedStrResource = null;
		for (const [strResource, editStack] of this._editStacks) {
			const candidate = editStack.getClosestPastElement();
			if (!candidate) continue;
			if (candidate.sourceId === sourceId) {
				if (!matchedElement || candidate.sourceOrder > matchedElement.sourceOrder) {
					matchedElement = candidate;
					matchedStrResource = strResource;
				}
			}
		}
		return [matchedElement, matchedStrResource];
	}
	canUndo(resourceOrSource) {
		if (resourceOrSource instanceof UndoRedoSource) {
			const [, matchedStrResource] = this._findClosestUndoElementWithSource(resourceOrSource.id);
			return matchedStrResource ? true : false;
		}
		const strResource = this.getUriComparisonKey(resourceOrSource);
		if (this._editStacks.has(strResource)) return this._editStacks.get(strResource).hasPastElements();
		return false;
	}
	_onError(err, element) {
		onUnexpectedError(err);
		for (const strResource of element.strResources) this.removeElements(strResource);
		this._notificationService.error(err);
	}
	_acquireLocks(editStackSnapshot) {
		for (const editStack of editStackSnapshot.editStacks) if (editStack.locked) throw new Error("Cannot acquire edit stack lock");
		for (const editStack of editStackSnapshot.editStacks) editStack.locked = true;
		return () => {
			for (const editStack of editStackSnapshot.editStacks) editStack.locked = false;
		};
	}
	_safeInvokeWithLocks(element, invoke, editStackSnapshot, cleanup, continuation) {
		const releaseLocks = this._acquireLocks(editStackSnapshot);
		let result;
		try {
			result = invoke();
		} catch (err) {
			releaseLocks();
			cleanup.dispose();
			return this._onError(err, element);
		}
		if (result) return result.then(() => {
			releaseLocks();
			cleanup.dispose();
			return continuation();
		}, (err) => {
			releaseLocks();
			cleanup.dispose();
			return this._onError(err, element);
		});
		else {
			releaseLocks();
			cleanup.dispose();
			return continuation();
		}
	}
	async _invokeWorkspacePrepare(element) {
		if (typeof element.actual.prepareUndoRedo === "undefined") return Disposable.None;
		const result = element.actual.prepareUndoRedo();
		if (typeof result === "undefined") return Disposable.None;
		return result;
	}
	_invokeResourcePrepare(element, callback) {
		if (element.actual.type !== 1 || typeof element.actual.prepareUndoRedo === "undefined") return callback(Disposable.None);
		const r = element.actual.prepareUndoRedo();
		if (!r) return callback(Disposable.None);
		if (isDisposable(r)) return callback(r);
		return r.then((disposable) => {
			return callback(disposable);
		});
	}
	_getAffectedEditStacks(element) {
		const affectedEditStacks = [];
		for (const strResource of element.strResources) affectedEditStacks.push(this._editStacks.get(strResource) || missingEditStack);
		return new EditStackSnapshot(affectedEditStacks);
	}
	_tryToSplitAndUndo(strResource, element, ignoreResources, message) {
		if (element.canSplit()) {
			this._splitPastWorkspaceElement(element, ignoreResources);
			this._notificationService.warn(message);
			return new WorkspaceVerificationError(this._undo(strResource, 0, true));
		} else {
			for (const strResource$1 of element.strResources) this.removeElements(strResource$1);
			this._notificationService.warn(message);
			return new WorkspaceVerificationError();
		}
	}
	_checkWorkspaceUndo(strResource, element, editStackSnapshot, checkInvalidatedResources) {
		if (element.removedResources) return this._tryToSplitAndUndo(strResource, element, element.removedResources, localize({
			key: "cannotWorkspaceUndo",
			comment: ["{0} is a label for an operation. {1} is another message."]
		}, "Could not undo '{0}' across all files. {1}", element.label, element.removedResources.createMessage()));
		if (checkInvalidatedResources && element.invalidatedResources) return this._tryToSplitAndUndo(strResource, element, element.invalidatedResources, localize({
			key: "cannotWorkspaceUndo",
			comment: ["{0} is a label for an operation. {1} is another message."]
		}, "Could not undo '{0}' across all files. {1}", element.label, element.invalidatedResources.createMessage()));
		const cannotUndoDueToResources = [];
		for (const editStack of editStackSnapshot.editStacks) if (editStack.getClosestPastElement() !== element) cannotUndoDueToResources.push(editStack.resourceLabel);
		if (cannotUndoDueToResources.length > 0) return this._tryToSplitAndUndo(strResource, element, null, localize({
			key: "cannotWorkspaceUndoDueToChanges",
			comment: ["{0} is a label for an operation. {1} is a list of filenames."]
		}, "Could not undo '{0}' across all files because changes were made to {1}", element.label, cannotUndoDueToResources.join(", ")));
		const cannotLockDueToResources = [];
		for (const editStack of editStackSnapshot.editStacks) if (editStack.locked) cannotLockDueToResources.push(editStack.resourceLabel);
		if (cannotLockDueToResources.length > 0) return this._tryToSplitAndUndo(strResource, element, null, localize({
			key: "cannotWorkspaceUndoDueToInProgressUndoRedo",
			comment: ["{0} is a label for an operation. {1} is a list of filenames."]
		}, "Could not undo '{0}' across all files because there is already an undo or redo operation running on {1}", element.label, cannotLockDueToResources.join(", ")));
		if (!editStackSnapshot.isValid()) return this._tryToSplitAndUndo(strResource, element, null, localize({
			key: "cannotWorkspaceUndoDueToInMeantimeUndoRedo",
			comment: ["{0} is a label for an operation. {1} is a list of filenames."]
		}, "Could not undo '{0}' across all files because an undo or redo operation occurred in the meantime", element.label));
		return null;
	}
	_workspaceUndo(strResource, element, undoConfirmed) {
		const affectedEditStacks = this._getAffectedEditStacks(element);
		const verificationError = this._checkWorkspaceUndo(strResource, element, affectedEditStacks, false);
		if (verificationError) return verificationError.returnValue;
		return this._confirmAndExecuteWorkspaceUndo(strResource, element, affectedEditStacks, undoConfirmed);
	}
	_isPartOfUndoGroup(element) {
		if (!element.groupId) return false;
		for (const [, editStack] of this._editStacks) {
			const pastElement = editStack.getClosestPastElement();
			if (!pastElement) continue;
			if (pastElement === element) {
				const secondPastElement = editStack.getSecondClosestPastElement();
				if (secondPastElement && secondPastElement.groupId === element.groupId) return true;
			}
			if (pastElement.groupId === element.groupId) return true;
		}
		return false;
	}
	async _confirmAndExecuteWorkspaceUndo(strResource, element, editStackSnapshot, undoConfirmed) {
		if (element.canSplit() && !this._isPartOfUndoGroup(element)) {
			let UndoChoice;
			(function(UndoChoice$1) {
				UndoChoice$1[UndoChoice$1["All"] = 0] = "All";
				UndoChoice$1[UndoChoice$1["This"] = 1] = "This";
				UndoChoice$1[UndoChoice$1["Cancel"] = 2] = "Cancel";
			})(UndoChoice || (UndoChoice = {}));
			const { result } = await this._dialogService.prompt({
				type: severity_default.Info,
				message: localize("confirmWorkspace", "Would you like to undo '{0}' across all files?", element.label),
				buttons: [{
					label: localize({
						key: "ok",
						comment: ["{0} denotes a number that is > 1, && denotes a mnemonic"]
					}, "&&Undo in {0} Files", editStackSnapshot.editStacks.length),
					run: () => UndoChoice.All
				}, {
					label: localize({
						key: "nok",
						comment: ["&& denotes a mnemonic"]
					}, "Undo this &&File"),
					run: () => UndoChoice.This
				}],
				cancelButton: { run: () => UndoChoice.Cancel }
			});
			if (result === UndoChoice.Cancel) return;
			if (result === UndoChoice.This) {
				this._splitPastWorkspaceElement(element, null);
				return this._undo(strResource, 0, true);
			}
			const verificationError1 = this._checkWorkspaceUndo(strResource, element, editStackSnapshot, false);
			if (verificationError1) return verificationError1.returnValue;
			undoConfirmed = true;
		}
		let cleanup;
		try {
			cleanup = await this._invokeWorkspacePrepare(element);
		} catch (err) {
			return this._onError(err, element);
		}
		const verificationError2 = this._checkWorkspaceUndo(strResource, element, editStackSnapshot, true);
		if (verificationError2) {
			cleanup.dispose();
			return verificationError2.returnValue;
		}
		for (const editStack of editStackSnapshot.editStacks) editStack.moveBackward(element);
		return this._safeInvokeWithLocks(element, () => element.actual.undo(), editStackSnapshot, cleanup, () => this._continueUndoInGroup(element.groupId, undoConfirmed));
	}
	_resourceUndo(editStack, element, undoConfirmed) {
		if (!element.isValid) {
			editStack.flushAllElements();
			return;
		}
		if (editStack.locked) {
			const message = localize({
				key: "cannotResourceUndoDueToInProgressUndoRedo",
				comment: ["{0} is a label for an operation."]
			}, "Could not undo '{0}' because there is already an undo or redo operation running.", element.label);
			this._notificationService.warn(message);
			return;
		}
		return this._invokeResourcePrepare(element, (cleanup) => {
			editStack.moveBackward(element);
			return this._safeInvokeWithLocks(element, () => element.actual.undo(), new EditStackSnapshot([editStack]), cleanup, () => this._continueUndoInGroup(element.groupId, undoConfirmed));
		});
	}
	_findClosestUndoElementInGroup(groupId) {
		if (!groupId) return [null, null];
		let matchedElement = null;
		let matchedStrResource = null;
		for (const [strResource, editStack] of this._editStacks) {
			const candidate = editStack.getClosestPastElement();
			if (!candidate) continue;
			if (candidate.groupId === groupId) {
				if (!matchedElement || candidate.groupOrder > matchedElement.groupOrder) {
					matchedElement = candidate;
					matchedStrResource = strResource;
				}
			}
		}
		return [matchedElement, matchedStrResource];
	}
	_continueUndoInGroup(groupId, undoConfirmed) {
		if (!groupId) return;
		const [, matchedStrResource] = this._findClosestUndoElementInGroup(groupId);
		if (matchedStrResource) return this._undo(matchedStrResource, 0, undoConfirmed);
	}
	undo(resourceOrSource) {
		if (resourceOrSource instanceof UndoRedoSource) {
			const [, matchedStrResource] = this._findClosestUndoElementWithSource(resourceOrSource.id);
			return matchedStrResource ? this._undo(matchedStrResource, resourceOrSource.id, false) : void 0;
		}
		if (typeof resourceOrSource === "string") return this._undo(resourceOrSource, 0, false);
		return this._undo(this.getUriComparisonKey(resourceOrSource), 0, false);
	}
	_undo(strResource, sourceId = 0, undoConfirmed) {
		if (!this._editStacks.has(strResource)) return;
		const editStack = this._editStacks.get(strResource);
		const element = editStack.getClosestPastElement();
		if (!element) return;
		if (element.groupId) {
			const [matchedElement, matchedStrResource] = this._findClosestUndoElementInGroup(element.groupId);
			if (element !== matchedElement && matchedStrResource) return this._undo(matchedStrResource, sourceId, undoConfirmed);
		}
		if ((element.sourceId !== sourceId || element.confirmBeforeUndo) && !undoConfirmed) return this._confirmAndContinueUndo(strResource, sourceId, element);
		try {
			if (element.type === 1) return this._workspaceUndo(strResource, element, undoConfirmed);
			else return this._resourceUndo(editStack, element, undoConfirmed);
		} finally {}
	}
	async _confirmAndContinueUndo(strResource, sourceId, element) {
		if (!(await this._dialogService.confirm({
			message: localize("confirmDifferentSource", "Would you like to undo '{0}'?", element.label),
			primaryButton: localize({
				key: "confirmDifferentSource.yes",
				comment: ["&& denotes a mnemonic"]
			}, "&&Yes"),
			cancelButton: localize("confirmDifferentSource.no", "No")
		})).confirmed) return;
		return this._undo(strResource, sourceId, true);
	}
	_findClosestRedoElementWithSource(sourceId) {
		if (!sourceId) return [null, null];
		let matchedElement = null;
		let matchedStrResource = null;
		for (const [strResource, editStack] of this._editStacks) {
			const candidate = editStack.getClosestFutureElement();
			if (!candidate) continue;
			if (candidate.sourceId === sourceId) {
				if (!matchedElement || candidate.sourceOrder < matchedElement.sourceOrder) {
					matchedElement = candidate;
					matchedStrResource = strResource;
				}
			}
		}
		return [matchedElement, matchedStrResource];
	}
	canRedo(resourceOrSource) {
		if (resourceOrSource instanceof UndoRedoSource) {
			const [, matchedStrResource] = this._findClosestRedoElementWithSource(resourceOrSource.id);
			return matchedStrResource ? true : false;
		}
		const strResource = this.getUriComparisonKey(resourceOrSource);
		if (this._editStacks.has(strResource)) return this._editStacks.get(strResource).hasFutureElements();
		return false;
	}
	_tryToSplitAndRedo(strResource, element, ignoreResources, message) {
		if (element.canSplit()) {
			this._splitFutureWorkspaceElement(element, ignoreResources);
			this._notificationService.warn(message);
			return new WorkspaceVerificationError(this._redo(strResource));
		} else {
			for (const strResource$1 of element.strResources) this.removeElements(strResource$1);
			this._notificationService.warn(message);
			return new WorkspaceVerificationError();
		}
	}
	_checkWorkspaceRedo(strResource, element, editStackSnapshot, checkInvalidatedResources) {
		if (element.removedResources) return this._tryToSplitAndRedo(strResource, element, element.removedResources, localize({
			key: "cannotWorkspaceRedo",
			comment: ["{0} is a label for an operation. {1} is another message."]
		}, "Could not redo '{0}' across all files. {1}", element.label, element.removedResources.createMessage()));
		if (checkInvalidatedResources && element.invalidatedResources) return this._tryToSplitAndRedo(strResource, element, element.invalidatedResources, localize({
			key: "cannotWorkspaceRedo",
			comment: ["{0} is a label for an operation. {1} is another message."]
		}, "Could not redo '{0}' across all files. {1}", element.label, element.invalidatedResources.createMessage()));
		const cannotRedoDueToResources = [];
		for (const editStack of editStackSnapshot.editStacks) if (editStack.getClosestFutureElement() !== element) cannotRedoDueToResources.push(editStack.resourceLabel);
		if (cannotRedoDueToResources.length > 0) return this._tryToSplitAndRedo(strResource, element, null, localize({
			key: "cannotWorkspaceRedoDueToChanges",
			comment: ["{0} is a label for an operation. {1} is a list of filenames."]
		}, "Could not redo '{0}' across all files because changes were made to {1}", element.label, cannotRedoDueToResources.join(", ")));
		const cannotLockDueToResources = [];
		for (const editStack of editStackSnapshot.editStacks) if (editStack.locked) cannotLockDueToResources.push(editStack.resourceLabel);
		if (cannotLockDueToResources.length > 0) return this._tryToSplitAndRedo(strResource, element, null, localize({
			key: "cannotWorkspaceRedoDueToInProgressUndoRedo",
			comment: ["{0} is a label for an operation. {1} is a list of filenames."]
		}, "Could not redo '{0}' across all files because there is already an undo or redo operation running on {1}", element.label, cannotLockDueToResources.join(", ")));
		if (!editStackSnapshot.isValid()) return this._tryToSplitAndRedo(strResource, element, null, localize({
			key: "cannotWorkspaceRedoDueToInMeantimeUndoRedo",
			comment: ["{0} is a label for an operation. {1} is a list of filenames."]
		}, "Could not redo '{0}' across all files because an undo or redo operation occurred in the meantime", element.label));
		return null;
	}
	_workspaceRedo(strResource, element) {
		const affectedEditStacks = this._getAffectedEditStacks(element);
		const verificationError = this._checkWorkspaceRedo(strResource, element, affectedEditStacks, false);
		if (verificationError) return verificationError.returnValue;
		return this._executeWorkspaceRedo(strResource, element, affectedEditStacks);
	}
	async _executeWorkspaceRedo(strResource, element, editStackSnapshot) {
		let cleanup;
		try {
			cleanup = await this._invokeWorkspacePrepare(element);
		} catch (err) {
			return this._onError(err, element);
		}
		const verificationError = this._checkWorkspaceRedo(strResource, element, editStackSnapshot, true);
		if (verificationError) {
			cleanup.dispose();
			return verificationError.returnValue;
		}
		for (const editStack of editStackSnapshot.editStacks) editStack.moveForward(element);
		return this._safeInvokeWithLocks(element, () => element.actual.redo(), editStackSnapshot, cleanup, () => this._continueRedoInGroup(element.groupId));
	}
	_resourceRedo(editStack, element) {
		if (!element.isValid) {
			editStack.flushAllElements();
			return;
		}
		if (editStack.locked) {
			const message = localize({
				key: "cannotResourceRedoDueToInProgressUndoRedo",
				comment: ["{0} is a label for an operation."]
			}, "Could not redo '{0}' because there is already an undo or redo operation running.", element.label);
			this._notificationService.warn(message);
			return;
		}
		return this._invokeResourcePrepare(element, (cleanup) => {
			editStack.moveForward(element);
			return this._safeInvokeWithLocks(element, () => element.actual.redo(), new EditStackSnapshot([editStack]), cleanup, () => this._continueRedoInGroup(element.groupId));
		});
	}
	_findClosestRedoElementInGroup(groupId) {
		if (!groupId) return [null, null];
		let matchedElement = null;
		let matchedStrResource = null;
		for (const [strResource, editStack] of this._editStacks) {
			const candidate = editStack.getClosestFutureElement();
			if (!candidate) continue;
			if (candidate.groupId === groupId) {
				if (!matchedElement || candidate.groupOrder < matchedElement.groupOrder) {
					matchedElement = candidate;
					matchedStrResource = strResource;
				}
			}
		}
		return [matchedElement, matchedStrResource];
	}
	_continueRedoInGroup(groupId) {
		if (!groupId) return;
		const [, matchedStrResource] = this._findClosestRedoElementInGroup(groupId);
		if (matchedStrResource) return this._redo(matchedStrResource);
	}
	redo(resourceOrSource) {
		if (resourceOrSource instanceof UndoRedoSource) {
			const [, matchedStrResource] = this._findClosestRedoElementWithSource(resourceOrSource.id);
			return matchedStrResource ? this._redo(matchedStrResource) : void 0;
		}
		if (typeof resourceOrSource === "string") return this._redo(resourceOrSource);
		return this._redo(this.getUriComparisonKey(resourceOrSource));
	}
	_redo(strResource) {
		if (!this._editStacks.has(strResource)) return;
		const editStack = this._editStacks.get(strResource);
		const element = editStack.getClosestFutureElement();
		if (!element) return;
		if (element.groupId) {
			const [matchedElement, matchedStrResource] = this._findClosestRedoElementInGroup(element.groupId);
			if (element !== matchedElement && matchedStrResource) return this._redo(matchedStrResource);
		}
		try {
			if (element.type === 1) return this._workspaceRedo(strResource, element);
			else return this._resourceRedo(editStack, element);
		} finally {}
	}
};
UndoRedoService = __decorate$24([__param$23(0, IDialogService), __param$23(1, INotificationService)], UndoRedoService);
var WorkspaceVerificationError = class {
	constructor(returnValue) {
		this.returnValue = returnValue;
	}
};
registerSingleton(IUndoRedoService, UndoRedoService, 1);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/services/semanticTokensStylingService.js
var __decorate$23 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$22 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var SemanticTokensStylingService = class SemanticTokensStylingService$1 extends Disposable {
	constructor(_themeService, _logService, _languageService) {
		super();
		this._themeService = _themeService;
		this._logService = _logService;
		this._languageService = _languageService;
		this._caches = /* @__PURE__ */ new WeakMap();
		this._register(this._themeService.onDidColorThemeChange(() => {
			this._caches = /* @__PURE__ */ new WeakMap();
		}));
	}
	getStyling(provider) {
		if (!this._caches.has(provider)) this._caches.set(provider, new SemanticTokensProviderStyling(provider.getLegend(), this._themeService, this._languageService, this._logService));
		return this._caches.get(provider);
	}
};
SemanticTokensStylingService = __decorate$23([
	__param$22(0, IThemeService),
	__param$22(1, ILogService),
	__param$22(2, ILanguageService)
], SemanticTokensStylingService);
registerSingleton(ISemanticTokensStylingService, SemanticTokensStylingService, 1);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/languageFeatureRegistry.js
function isExclusive(selector) {
	if (typeof selector === "string") return false;
	else if (Array.isArray(selector)) return selector.every(isExclusive);
	else return !!selector.exclusive;
}
var MatchCandidate = class {
	constructor(uri, languageId, notebookUri, notebookType, recursive) {
		this.uri = uri;
		this.languageId = languageId;
		this.notebookUri = notebookUri;
		this.notebookType = notebookType;
		this.recursive = recursive;
	}
	equals(other) {
		return this.notebookType === other.notebookType && this.languageId === other.languageId && this.uri.toString() === other.uri.toString() && this.notebookUri?.toString() === other.notebookUri?.toString() && this.recursive === other.recursive;
	}
};
var LanguageFeatureRegistry = class LanguageFeatureRegistry {
	constructor(_notebookInfoResolver) {
		this._notebookInfoResolver = _notebookInfoResolver;
		this._clock = 0;
		this._entries = [];
		this._onDidChange = new Emitter$1();
		this.onDidChange = this._onDidChange.event;
	}
	register(selector, provider) {
		let entry = {
			selector,
			provider,
			_score: -1,
			_time: this._clock++
		};
		this._entries.push(entry);
		this._lastCandidate = void 0;
		this._onDidChange.fire(this._entries.length);
		return toDisposable(() => {
			if (entry) {
				const idx = this._entries.indexOf(entry);
				if (idx >= 0) {
					this._entries.splice(idx, 1);
					this._lastCandidate = void 0;
					this._onDidChange.fire(this._entries.length);
					entry = void 0;
				}
			}
		});
	}
	has(model) {
		return this.all(model).length > 0;
	}
	all(model) {
		if (!model) return [];
		this._updateScores(model, false);
		const result = [];
		for (const entry of this._entries) if (entry._score > 0) result.push(entry.provider);
		return result;
	}
	ordered(model, recursive = false) {
		const result = [];
		this._orderedForEach(model, recursive, (entry) => result.push(entry.provider));
		return result;
	}
	orderedGroups(model) {
		const result = [];
		let lastBucket;
		let lastBucketScore;
		this._orderedForEach(model, false, (entry) => {
			if (lastBucket && lastBucketScore === entry._score) lastBucket.push(entry.provider);
			else {
				lastBucketScore = entry._score;
				lastBucket = [entry.provider];
				result.push(lastBucket);
			}
		});
		return result;
	}
	_orderedForEach(model, recursive, callback) {
		this._updateScores(model, recursive);
		for (const entry of this._entries) if (entry._score > 0) callback(entry);
	}
	_updateScores(model, recursive) {
		const notebookInfo = this._notebookInfoResolver?.(model.uri);
		const candidate = notebookInfo ? new MatchCandidate(model.uri, model.getLanguageId(), notebookInfo.uri, notebookInfo.type, recursive) : new MatchCandidate(model.uri, model.getLanguageId(), void 0, void 0, recursive);
		if (this._lastCandidate?.equals(candidate)) return;
		this._lastCandidate = candidate;
		for (const entry of this._entries) {
			entry._score = score(entry.selector, candidate.uri, candidate.languageId, shouldSynchronizeModel(model), candidate.notebookUri, candidate.notebookType);
			if (isExclusive(entry.selector) && entry._score > 0) if (recursive) entry._score = 0;
			else {
				for (const entry$1 of this._entries) entry$1._score = 0;
				entry._score = 1e3;
				break;
			}
		}
		this._entries.sort(LanguageFeatureRegistry._compareByScoreAndTime);
	}
	static _compareByScoreAndTime(a, b) {
		if (a._score < b._score) return 1;
		else if (a._score > b._score) return -1;
		if (isBuiltinSelector(a.selector) && !isBuiltinSelector(b.selector)) return 1;
		else if (!isBuiltinSelector(a.selector) && isBuiltinSelector(b.selector)) return -1;
		if (a._time < b._time) return 1;
		else if (a._time > b._time) return -1;
		else return 0;
	}
};
function isBuiltinSelector(selector) {
	if (typeof selector === "string") return false;
	if (Array.isArray(selector)) return selector.some(isBuiltinSelector);
	return Boolean(selector.isBuiltin);
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/services/languageFeaturesService.js
var LanguageFeaturesService = class {
	constructor() {
		this.referenceProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.renameProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.newSymbolNamesProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.codeActionProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.definitionProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.typeDefinitionProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.declarationProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.implementationProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.documentSymbolProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.inlayHintsProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.colorProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.codeLensProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.documentFormattingEditProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.documentRangeFormattingEditProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.onTypeFormattingEditProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.signatureHelpProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.hoverProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.documentHighlightProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.multiDocumentHighlightProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.selectionRangeProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.foldingRangeProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.linkProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.inlineCompletionsProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.inlineEditProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.completionProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.linkedEditingRangeProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.documentRangeSemanticTokensProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.documentSemanticTokensProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.documentDropEditProvider = new LanguageFeatureRegistry(this._score.bind(this));
		this.documentPasteEditProvider = new LanguageFeatureRegistry(this._score.bind(this));
	}
	_score(uri) {
		return this._notebookTypeResolver?.(uri);
	}
};
registerSingleton(ILanguageFeaturesService, LanguageFeaturesService, 1);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/browser/services/hoverService/hoverWidget.js
var __decorate$22 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$21 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var $$4 = $;
var HoverWidget = class HoverWidget$2 extends Widget {
	get _targetWindow() {
		return getWindow(this._target.targetElements[0]);
	}
	get _targetDocumentElement() {
		return getWindow(this._target.targetElements[0]).document.documentElement;
	}
	get isDisposed() {
		return this._isDisposed;
	}
	get isMouseIn() {
		return this._lockMouseTracker.isMouseIn;
	}
	get domNode() {
		return this._hover.containerDomNode;
	}
	get onDispose() {
		return this._onDispose.event;
	}
	get onRequestLayout() {
		return this._onRequestLayout.event;
	}
	get anchor() {
		return this._hoverPosition === 2 ? 0 : 1;
	}
	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
	/**
	* Whether the hover is "locked" by holding the alt/option key. When locked, the hover will not
	* hide and can be hovered regardless of whether the `hideOnHover` hover option is set.
	*/
	get isLocked() {
		return this._isLocked;
	}
	set isLocked(value) {
		if (this._isLocked === value) return;
		this._isLocked = value;
		this._hoverContainer.classList.toggle("locked", this._isLocked);
	}
	constructor(options, _keybindingService, _configurationService, _openerService, _instantiationService, _accessibilityService) {
		super();
		this._keybindingService = _keybindingService;
		this._configurationService = _configurationService;
		this._openerService = _openerService;
		this._instantiationService = _instantiationService;
		this._accessibilityService = _accessibilityService;
		this._messageListeners = new DisposableStore();
		this._isDisposed = false;
		this._forcePosition = false;
		this._x = 0;
		this._y = 0;
		this._isLocked = false;
		this._enableFocusTraps = false;
		this._addedFocusTrap = false;
		this._onDispose = this._register(new Emitter$1());
		this._onRequestLayout = this._register(new Emitter$1());
		this._linkHandler = options.linkHandler || ((url) => {
			return openLinkFromMarkdown(this._openerService, url, isMarkdownString(options.content) ? options.content.isTrusted : void 0);
		});
		this._target = "targetElements" in options.target ? options.target : new ElementHoverTarget(options.target);
		this._hoverPointer = options.appearance?.showPointer ? $$4("div.workbench-hover-pointer") : void 0;
		this._hover = this._register(new HoverWidget$1());
		this._hover.containerDomNode.classList.add("workbench-hover", "fadeIn");
		if (options.appearance?.compact) this._hover.containerDomNode.classList.add("workbench-hover", "compact");
		if (options.appearance?.skipFadeInAnimation) this._hover.containerDomNode.classList.add("skip-fade-in");
		if (options.additionalClasses) this._hover.containerDomNode.classList.add(...options.additionalClasses);
		if (options.position?.forcePosition) this._forcePosition = true;
		if (options.trapFocus) this._enableFocusTraps = true;
		this._hoverPosition = options.position?.hoverPosition ?? 3;
		this.onmousedown(this._hover.containerDomNode, (e) => e.stopPropagation());
		this.onkeydown(this._hover.containerDomNode, (e) => {
			if (e.equals(9)) this.dispose();
		});
		this._register(addDisposableListener(this._targetWindow, "blur", () => this.dispose()));
		const rowElement = $$4("div.hover-row.markdown-hover");
		const contentsElement = $$4("div.hover-contents");
		if (typeof options.content === "string") {
			contentsElement.textContent = options.content;
			contentsElement.style.whiteSpace = "pre-wrap";
		} else if (isHTMLElement(options.content)) {
			contentsElement.appendChild(options.content);
			contentsElement.classList.add("html-hover-contents");
		} else {
			const markdown = options.content;
			const { element } = this._instantiationService.createInstance(MarkdownRenderer, { codeBlockFontFamily: this._configurationService.getValue("editor").fontFamily || EDITOR_FONT_DEFAULTS.fontFamily }).render(markdown, {
				actionHandler: {
					callback: (content) => this._linkHandler(content),
					disposables: this._messageListeners
				},
				asyncRenderCallback: () => {
					contentsElement.classList.add("code-hover-contents");
					this.layout();
					this._onRequestLayout.fire();
				}
			});
			contentsElement.appendChild(element);
		}
		rowElement.appendChild(contentsElement);
		this._hover.contentsDomNode.appendChild(rowElement);
		if (options.actions && options.actions.length > 0) {
			const statusBarElement = $$4("div.hover-row.status-bar");
			const actionsElement = $$4("div.actions");
			options.actions.forEach((action) => {
				const keybinding = this._keybindingService.lookupKeybinding(action.commandId);
				const keybindingLabel = keybinding ? keybinding.getLabel() : null;
				HoverAction.render(actionsElement, {
					label: action.label,
					commandId: action.commandId,
					run: (e) => {
						action.run(e);
						this.dispose();
					},
					iconClass: action.iconClass
				}, keybindingLabel);
			});
			statusBarElement.appendChild(actionsElement);
			this._hover.containerDomNode.appendChild(statusBarElement);
		}
		this._hoverContainer = $$4("div.workbench-hover-container");
		if (this._hoverPointer) this._hoverContainer.appendChild(this._hoverPointer);
		this._hoverContainer.appendChild(this._hover.containerDomNode);
		let hideOnHover;
		if (options.actions && options.actions.length > 0) hideOnHover = false;
		else if (options.persistence?.hideOnHover === void 0) hideOnHover = typeof options.content === "string" || isMarkdownString(options.content) && !options.content.value.includes("](") && !options.content.value.includes("</a>");
		else hideOnHover = options.persistence.hideOnHover;
		if (options.appearance?.showHoverHint) {
			const statusBarElement = $$4("div.hover-row.status-bar");
			const infoElement = $$4("div.info");
			infoElement.textContent = localize("hoverhint", "Hold {0} key to mouse over", isMacintosh ? "Option" : "Alt");
			statusBarElement.appendChild(infoElement);
			this._hover.containerDomNode.appendChild(statusBarElement);
		}
		const mouseTrackerTargets = [...this._target.targetElements];
		if (!hideOnHover) mouseTrackerTargets.push(this._hoverContainer);
		const mouseTracker = this._register(new CompositeMouseTracker(mouseTrackerTargets));
		this._register(mouseTracker.onMouseOut(() => {
			if (!this._isLocked) this.dispose();
		}));
		if (hideOnHover) {
			const mouseTracker2Targets = [...this._target.targetElements, this._hoverContainer];
			this._lockMouseTracker = this._register(new CompositeMouseTracker(mouseTracker2Targets));
			this._register(this._lockMouseTracker.onMouseOut(() => {
				if (!this._isLocked) this.dispose();
			}));
		} else this._lockMouseTracker = mouseTracker;
	}
	addFocusTrap() {
		if (!this._enableFocusTraps || this._addedFocusTrap) return;
		this._addedFocusTrap = true;
		const firstContainerFocusElement = this._hover.containerDomNode;
		const lastContainerFocusElement = this.findLastFocusableChild(this._hover.containerDomNode);
		if (lastContainerFocusElement) {
			const beforeContainerFocusElement = prepend(this._hoverContainer, $$4("div"));
			const afterContainerFocusElement = append(this._hoverContainer, $$4("div"));
			beforeContainerFocusElement.tabIndex = 0;
			afterContainerFocusElement.tabIndex = 0;
			this._register(addDisposableListener(afterContainerFocusElement, "focus", (e) => {
				firstContainerFocusElement.focus();
				e.preventDefault();
			}));
			this._register(addDisposableListener(beforeContainerFocusElement, "focus", (e) => {
				lastContainerFocusElement.focus();
				e.preventDefault();
			}));
		}
	}
	findLastFocusableChild(root) {
		if (root.hasChildNodes()) for (let i = 0; i < root.childNodes.length; i++) {
			const node = root.childNodes.item(root.childNodes.length - i - 1);
			if (node.nodeType === node.ELEMENT_NODE) {
				const parsedNode = node;
				if (typeof parsedNode.tabIndex === "number" && parsedNode.tabIndex >= 0) return parsedNode;
			}
			const recursivelyFoundElement = this.findLastFocusableChild(node);
			if (recursivelyFoundElement) return recursivelyFoundElement;
		}
	}
	render(container) {
		container.appendChild(this._hoverContainer);
		const accessibleViewHint = this._hoverContainer.contains(this._hoverContainer.ownerDocument.activeElement) && getHoverAccessibleViewHint(this._configurationService.getValue("accessibility.verbosity.hover") === true && this._accessibilityService.isScreenReaderOptimized(), this._keybindingService.lookupKeybinding("editor.action.accessibleView")?.getAriaLabel());
		if (accessibleViewHint) status(accessibleViewHint);
		this.layout();
		this.addFocusTrap();
	}
	layout() {
		this._hover.containerDomNode.classList.remove("right-aligned");
		this._hover.contentsDomNode.style.maxHeight = "";
		const getZoomAccountedBoundingClientRect = (e) => {
			const zoom = getDomNodeZoomLevel(e);
			const boundingRect = e.getBoundingClientRect();
			return {
				top: boundingRect.top * zoom,
				bottom: boundingRect.bottom * zoom,
				right: boundingRect.right * zoom,
				left: boundingRect.left * zoom
			};
		};
		const { top, right, bottom, left } = this._target.targetElements.map((e) => getZoomAccountedBoundingClientRect(e))[0];
		const width = right - left;
		const height = bottom - top;
		const targetRect = {
			top,
			right,
			bottom,
			left,
			width,
			height,
			center: {
				x: left + width / 2,
				y: top + height / 2
			}
		};
		this.adjustHorizontalHoverPosition(targetRect);
		this.adjustVerticalHoverPosition(targetRect);
		this.adjustHoverMaxHeight(targetRect);
		this._hoverContainer.style.padding = "";
		this._hoverContainer.style.margin = "";
		if (this._hoverPointer) {
			switch (this._hoverPosition) {
				case 1:
					targetRect.left += 3;
					targetRect.right += 3;
					this._hoverContainer.style.paddingLeft = `3px`;
					this._hoverContainer.style.marginLeft = `-3px`;
					break;
				case 0:
					targetRect.left -= 3;
					targetRect.right -= 3;
					this._hoverContainer.style.paddingRight = `3px`;
					this._hoverContainer.style.marginRight = `-3px`;
					break;
				case 2:
					targetRect.top += 3;
					targetRect.bottom += 3;
					this._hoverContainer.style.paddingTop = `3px`;
					this._hoverContainer.style.marginTop = `-3px`;
					break;
				case 3:
					targetRect.top -= 3;
					targetRect.bottom -= 3;
					this._hoverContainer.style.paddingBottom = `3px`;
					this._hoverContainer.style.marginBottom = `-3px`;
					break;
			}
			targetRect.center.x = targetRect.left + width / 2;
			targetRect.center.y = targetRect.top + height / 2;
		}
		this.computeXCordinate(targetRect);
		this.computeYCordinate(targetRect);
		if (this._hoverPointer) {
			this._hoverPointer.classList.remove("top");
			this._hoverPointer.classList.remove("left");
			this._hoverPointer.classList.remove("right");
			this._hoverPointer.classList.remove("bottom");
			this.setHoverPointerPosition(targetRect);
		}
		this._hover.onContentsChanged();
	}
	computeXCordinate(target) {
		const hoverWidth = this._hover.containerDomNode.clientWidth + 2;
		if (this._target.x !== void 0) this._x = this._target.x;
		else if (this._hoverPosition === 1) this._x = target.right;
		else if (this._hoverPosition === 0) this._x = target.left - hoverWidth;
		else {
			if (this._hoverPointer) this._x = target.center.x - this._hover.containerDomNode.clientWidth / 2;
			else this._x = target.left;
			if (this._x + hoverWidth >= this._targetDocumentElement.clientWidth) {
				this._hover.containerDomNode.classList.add("right-aligned");
				this._x = Math.max(this._targetDocumentElement.clientWidth - hoverWidth - 2, this._targetDocumentElement.clientLeft);
			}
		}
		if (this._x < this._targetDocumentElement.clientLeft) this._x = target.left + 2;
	}
	computeYCordinate(target) {
		if (this._target.y !== void 0) this._y = this._target.y;
		else if (this._hoverPosition === 3) this._y = target.top;
		else if (this._hoverPosition === 2) this._y = target.bottom - 2;
		else if (this._hoverPointer) this._y = target.center.y + this._hover.containerDomNode.clientHeight / 2;
		else this._y = target.bottom;
		if (this._y > this._targetWindow.innerHeight) this._y = target.bottom;
	}
	adjustHorizontalHoverPosition(target) {
		if (this._target.x !== void 0) return;
		const hoverPointerOffset = this._hoverPointer ? 3 : 0;
		if (this._forcePosition) {
			const padding = hoverPointerOffset + 2;
			if (this._hoverPosition === 1) this._hover.containerDomNode.style.maxWidth = `${this._targetDocumentElement.clientWidth - target.right - padding}px`;
			else if (this._hoverPosition === 0) this._hover.containerDomNode.style.maxWidth = `${target.left - padding}px`;
			return;
		}
		if (this._hoverPosition === 1) {
			if (this._targetDocumentElement.clientWidth - target.right < this._hover.containerDomNode.clientWidth + hoverPointerOffset) if (target.left >= this._hover.containerDomNode.clientWidth + hoverPointerOffset) this._hoverPosition = 0;
			else this._hoverPosition = 2;
		} else if (this._hoverPosition === 0) {
			if (target.left < this._hover.containerDomNode.clientWidth + hoverPointerOffset) if (this._targetDocumentElement.clientWidth - target.right >= this._hover.containerDomNode.clientWidth + hoverPointerOffset) this._hoverPosition = 1;
			else this._hoverPosition = 2;
			if (target.left - this._hover.containerDomNode.clientWidth - hoverPointerOffset <= this._targetDocumentElement.clientLeft) this._hoverPosition = 1;
		}
	}
	adjustVerticalHoverPosition(target) {
		if (this._target.y !== void 0 || this._forcePosition) return;
		const hoverPointerOffset = this._hoverPointer ? 3 : 0;
		if (this._hoverPosition === 3) {
			if (target.top - this._hover.containerDomNode.clientHeight - hoverPointerOffset < 0) this._hoverPosition = 2;
		} else if (this._hoverPosition === 2) {
			if (target.bottom + this._hover.containerDomNode.clientHeight + hoverPointerOffset > this._targetWindow.innerHeight) this._hoverPosition = 3;
		}
	}
	adjustHoverMaxHeight(target) {
		let maxHeight = this._targetWindow.innerHeight / 2;
		if (this._forcePosition) {
			const padding = (this._hoverPointer ? 3 : 0) + 2;
			if (this._hoverPosition === 3) maxHeight = Math.min(maxHeight, target.top - padding);
			else if (this._hoverPosition === 2) maxHeight = Math.min(maxHeight, this._targetWindow.innerHeight - target.bottom - padding);
		}
		this._hover.containerDomNode.style.maxHeight = `${maxHeight}px`;
		if (this._hover.contentsDomNode.clientHeight < this._hover.contentsDomNode.scrollHeight) {
			const extraRightPadding = `${this._hover.scrollbar.options.verticalScrollbarSize}px`;
			if (this._hover.contentsDomNode.style.paddingRight !== extraRightPadding) this._hover.contentsDomNode.style.paddingRight = extraRightPadding;
		}
	}
	setHoverPointerPosition(target) {
		if (!this._hoverPointer) return;
		switch (this._hoverPosition) {
			case 0:
			case 1: {
				this._hoverPointer.classList.add(this._hoverPosition === 0 ? "right" : "left");
				const hoverHeight = this._hover.containerDomNode.clientHeight;
				if (hoverHeight > target.height) this._hoverPointer.style.top = `${target.center.y - (this._y - hoverHeight) - 3}px`;
				else this._hoverPointer.style.top = `${Math.round(hoverHeight / 2) - 3}px`;
				break;
			}
			case 3:
			case 2: {
				this._hoverPointer.classList.add(this._hoverPosition === 3 ? "bottom" : "top");
				const hoverWidth = this._hover.containerDomNode.clientWidth;
				let pointerLeftPosition = Math.round(hoverWidth / 2) - 3;
				const pointerX = this._x + pointerLeftPosition;
				if (pointerX < target.left || pointerX > target.right) pointerLeftPosition = target.center.x - this._x - 3;
				this._hoverPointer.style.left = `${pointerLeftPosition}px`;
				break;
			}
		}
	}
	focus() {
		this._hover.containerDomNode.focus();
	}
	dispose() {
		if (!this._isDisposed) {
			this._onDispose.fire();
			this._hoverContainer.remove();
			this._messageListeners.dispose();
			this._target.dispose();
			super.dispose();
		}
		this._isDisposed = true;
	}
};
HoverWidget = __decorate$22([
	__param$21(1, IKeybindingService),
	__param$21(2, IConfigurationService),
	__param$21(3, IOpenerService),
	__param$21(4, IInstantiationService),
	__param$21(5, IAccessibilityService)
], HoverWidget);
var CompositeMouseTracker = class extends Widget {
	get onMouseOut() {
		return this._onMouseOut.event;
	}
	get isMouseIn() {
		return this._isMouseIn;
	}
	constructor(_elements) {
		super();
		this._elements = _elements;
		this._isMouseIn = true;
		this._onMouseOut = this._register(new Emitter$1());
		this._elements.forEach((n) => this.onmouseover(n, () => this._onTargetMouseOver(n)));
		this._elements.forEach((n) => this.onmouseleave(n, () => this._onTargetMouseLeave(n)));
	}
	_onTargetMouseOver(target) {
		this._isMouseIn = true;
		this._clearEvaluateMouseStateTimeout(target);
	}
	_onTargetMouseLeave(target) {
		this._isMouseIn = false;
		this._evaluateMouseState(target);
	}
	_evaluateMouseState(target) {
		this._clearEvaluateMouseStateTimeout(target);
		this._mouseTimeout = getWindow(target).setTimeout(() => this._fireIfMouseOutside(), 0);
	}
	_clearEvaluateMouseStateTimeout(target) {
		if (this._mouseTimeout) {
			getWindow(target).clearTimeout(this._mouseTimeout);
			this._mouseTimeout = void 0;
		}
	}
	_fireIfMouseOutside() {
		if (!this._isMouseIn) this._onMouseOut.fire();
	}
};
var ElementHoverTarget = class {
	constructor(_element) {
		this._element = _element;
		this.targetElements = [this._element];
	}
	dispose() {}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/base/browser/ui/contextview/contextview.js
function isAnchor(obj) {
	const anchor = obj;
	return !!anchor && typeof anchor.x === "number" && typeof anchor.y === "number";
}
var LayoutAnchorMode;
(function(LayoutAnchorMode$1) {
	LayoutAnchorMode$1[LayoutAnchorMode$1["AVOID"] = 0] = "AVOID";
	LayoutAnchorMode$1[LayoutAnchorMode$1["ALIGN"] = 1] = "ALIGN";
})(LayoutAnchorMode || (LayoutAnchorMode = {}));
/**
* Lays out a one dimensional view next to an anchor in a viewport.
*
* @returns The view offset within the viewport.
*/
function layout(viewportSize, viewSize, anchor) {
	const layoutAfterAnchorBoundary = anchor.mode === LayoutAnchorMode.ALIGN ? anchor.offset : anchor.offset + anchor.size;
	const layoutBeforeAnchorBoundary = anchor.mode === LayoutAnchorMode.ALIGN ? anchor.offset + anchor.size : anchor.offset;
	if (anchor.position === 0) {
		if (viewSize <= viewportSize - layoutAfterAnchorBoundary) return layoutAfterAnchorBoundary;
		if (viewSize <= layoutBeforeAnchorBoundary) return layoutBeforeAnchorBoundary - viewSize;
		return Math.max(viewportSize - viewSize, 0);
	} else {
		if (viewSize <= layoutBeforeAnchorBoundary) return layoutBeforeAnchorBoundary - viewSize;
		if (viewSize <= viewportSize - layoutAfterAnchorBoundary) return layoutAfterAnchorBoundary;
		return 0;
	}
}
var ContextView = class ContextView extends Disposable {
	static {
		this.BUBBLE_UP_EVENTS = [
			"click",
			"keydown",
			"focus",
			"blur"
		];
	}
	static {
		this.BUBBLE_DOWN_EVENTS = ["click"];
	}
	constructor(container, domPosition) {
		super();
		this.container = null;
		this.useFixedPosition = false;
		this.useShadowDOM = false;
		this.delegate = null;
		this.toDisposeOnClean = Disposable.None;
		this.toDisposeOnSetContainer = Disposable.None;
		this.shadowRoot = null;
		this.shadowRootHostElement = null;
		this.view = $(".context-view");
		hide(this.view);
		this.setContainer(container, domPosition);
		this._register(toDisposable(() => this.setContainer(null, 1)));
	}
	setContainer(container, domPosition) {
		this.useFixedPosition = domPosition !== 1;
		const usedShadowDOM = this.useShadowDOM;
		this.useShadowDOM = domPosition === 3;
		if (container === this.container && usedShadowDOM === this.useShadowDOM) return;
		if (this.container) {
			this.toDisposeOnSetContainer.dispose();
			this.view.remove();
			if (this.shadowRoot) {
				this.shadowRoot = null;
				this.shadowRootHostElement?.remove();
				this.shadowRootHostElement = null;
			}
			this.container = null;
		}
		if (container) {
			this.container = container;
			if (this.useShadowDOM) {
				this.shadowRootHostElement = $(".shadow-root-host");
				this.container.appendChild(this.shadowRootHostElement);
				this.shadowRoot = this.shadowRootHostElement.attachShadow({ mode: "open" });
				const style = document.createElement("style");
				style.textContent = SHADOW_ROOT_CSS;
				this.shadowRoot.appendChild(style);
				this.shadowRoot.appendChild(this.view);
				this.shadowRoot.appendChild($("slot"));
			} else this.container.appendChild(this.view);
			const toDisposeOnSetContainer = new DisposableStore();
			ContextView.BUBBLE_UP_EVENTS.forEach((event) => {
				toDisposeOnSetContainer.add(addStandardDisposableListener(this.container, event, (e) => {
					this.onDOMEvent(e, false);
				}));
			});
			ContextView.BUBBLE_DOWN_EVENTS.forEach((event) => {
				toDisposeOnSetContainer.add(addStandardDisposableListener(this.container, event, (e) => {
					this.onDOMEvent(e, true);
				}, true));
			});
			this.toDisposeOnSetContainer = toDisposeOnSetContainer;
		}
	}
	show(delegate) {
		if (this.isVisible()) this.hide();
		clearNode(this.view);
		this.view.className = "context-view monaco-component";
		this.view.style.top = "0px";
		this.view.style.left = "0px";
		this.view.style.zIndex = `${2575 + (delegate.layer ?? 0)}`;
		this.view.style.position = this.useFixedPosition ? "fixed" : "absolute";
		show(this.view);
		this.toDisposeOnClean = delegate.render(this.view) || Disposable.None;
		this.delegate = delegate;
		this.doLayout();
		this.delegate.focus?.();
	}
	getViewElement() {
		return this.view;
	}
	layout() {
		if (!this.isVisible()) return;
		if (this.delegate.canRelayout === false && !(isIOS && BrowserFeatures.pointerEvents)) {
			this.hide();
			return;
		}
		this.delegate?.layout?.();
		this.doLayout();
	}
	doLayout() {
		if (!this.isVisible()) return;
		const anchor = this.delegate.getAnchor();
		let around;
		if (isHTMLElement(anchor)) {
			const elementPosition = getDomNodePagePosition(anchor);
			const zoom = getDomNodeZoomLevel(anchor);
			around = {
				top: elementPosition.top * zoom,
				left: elementPosition.left * zoom,
				width: elementPosition.width * zoom,
				height: elementPosition.height * zoom
			};
		} else if (isAnchor(anchor)) around = {
			top: anchor.y,
			left: anchor.x,
			width: anchor.width || 1,
			height: anchor.height || 2
		};
		else around = {
			top: anchor.posy,
			left: anchor.posx,
			width: 2,
			height: 2
		};
		const viewSizeWidth = getTotalWidth(this.view);
		const viewSizeHeight = getTotalHeight(this.view);
		const anchorPosition = this.delegate.anchorPosition || 0;
		const anchorAlignment = this.delegate.anchorAlignment || 0;
		const anchorAxisAlignment = this.delegate.anchorAxisAlignment || 0;
		let top;
		let left;
		const activeWindow = getActiveWindow();
		if (anchorAxisAlignment === 0) {
			const verticalAnchor = {
				offset: around.top - activeWindow.pageYOffset,
				size: around.height,
				position: anchorPosition === 0 ? 0 : 1
			};
			const horizontalAnchor = {
				offset: around.left,
				size: around.width,
				position: anchorAlignment === 0 ? 0 : 1,
				mode: LayoutAnchorMode.ALIGN
			};
			top = layout(activeWindow.innerHeight, viewSizeHeight, verticalAnchor) + activeWindow.pageYOffset;
			if (Range$2.intersects({
				start: top,
				end: top + viewSizeHeight
			}, {
				start: verticalAnchor.offset,
				end: verticalAnchor.offset + verticalAnchor.size
			})) horizontalAnchor.mode = LayoutAnchorMode.AVOID;
			left = layout(activeWindow.innerWidth, viewSizeWidth, horizontalAnchor);
		} else {
			const horizontalAnchor = {
				offset: around.left,
				size: around.width,
				position: anchorAlignment === 0 ? 0 : 1
			};
			const verticalAnchor = {
				offset: around.top,
				size: around.height,
				position: anchorPosition === 0 ? 0 : 1,
				mode: LayoutAnchorMode.ALIGN
			};
			left = layout(activeWindow.innerWidth, viewSizeWidth, horizontalAnchor);
			if (Range$2.intersects({
				start: left,
				end: left + viewSizeWidth
			}, {
				start: horizontalAnchor.offset,
				end: horizontalAnchor.offset + horizontalAnchor.size
			})) verticalAnchor.mode = LayoutAnchorMode.AVOID;
			top = layout(activeWindow.innerHeight, viewSizeHeight, verticalAnchor) + activeWindow.pageYOffset;
		}
		this.view.classList.remove("top", "bottom", "left", "right");
		this.view.classList.add(anchorPosition === 0 ? "bottom" : "top");
		this.view.classList.add(anchorAlignment === 0 ? "left" : "right");
		this.view.classList.toggle("fixed", this.useFixedPosition);
		const containerPosition = getDomNodePagePosition(this.container);
		this.view.style.top = `${top - (this.useFixedPosition ? getDomNodePagePosition(this.view).top : containerPosition.top)}px`;
		this.view.style.left = `${left - (this.useFixedPosition ? getDomNodePagePosition(this.view).left : containerPosition.left)}px`;
		this.view.style.width = "initial";
	}
	hide(data) {
		const delegate = this.delegate;
		this.delegate = null;
		if (delegate?.onHide) delegate.onHide(data);
		this.toDisposeOnClean.dispose();
		hide(this.view);
	}
	isVisible() {
		return !!this.delegate;
	}
	onDOMEvent(e, onCapture) {
		if (this.delegate) {
			if (this.delegate.onDOMEvent) this.delegate.onDOMEvent(e, getWindow(e).document.activeElement);
			else if (onCapture && !isAncestor(e.target, this.container)) this.hide();
		}
	}
	dispose() {
		this.hide();
		super.dispose();
	}
};
var SHADOW_ROOT_CSS = `
	:host {
		all: initial; /* 1st rule so subsequent properties are reset. */
	}

	.codicon[class*='codicon-'] {
		font: normal normal normal 16px/1 codicon;
		display: inline-block;
		text-decoration: none;
		text-rendering: auto;
		text-align: center;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}

	:host {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", "HelveticaNeue-Light", system-ui, "Ubuntu", "Droid Sans", sans-serif;
	}

	:host-context(.mac) { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
	:host-context(.mac:lang(zh-Hans)) { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", sans-serif; }
	:host-context(.mac:lang(zh-Hant)) { font-family: -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif; }
	:host-context(.mac:lang(ja)) { font-family: -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic Pro", sans-serif; }
	:host-context(.mac:lang(ko)) { font-family: -apple-system, BlinkMacSystemFont, "Nanum Gothic", "Apple SD Gothic Neo", "AppleGothic", sans-serif; }

	:host-context(.windows) { font-family: "Segoe WPC", "Segoe UI", sans-serif; }
	:host-context(.windows:lang(zh-Hans)) { font-family: "Segoe WPC", "Segoe UI", "Microsoft YaHei", sans-serif; }
	:host-context(.windows:lang(zh-Hant)) { font-family: "Segoe WPC", "Segoe UI", "Microsoft Jhenghei", sans-serif; }
	:host-context(.windows:lang(ja)) { font-family: "Segoe WPC", "Segoe UI", "Yu Gothic UI", "Meiryo UI", sans-serif; }
	:host-context(.windows:lang(ko)) { font-family: "Segoe WPC", "Segoe UI", "Malgun Gothic", "Dotom", sans-serif; }

	:host-context(.linux) { font-family: system-ui, "Ubuntu", "Droid Sans", sans-serif; }
	:host-context(.linux:lang(zh-Hans)) { font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans SC", "Source Han Sans CN", "Source Han Sans", sans-serif; }
	:host-context(.linux:lang(zh-Hant)) { font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans TC", "Source Han Sans TW", "Source Han Sans", sans-serif; }
	:host-context(.linux:lang(ja)) { font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans J", "Source Han Sans JP", "Source Han Sans", sans-serif; }
	:host-context(.linux:lang(ko)) { font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans K", "Source Han Sans JR", "Source Han Sans", "UnDotum", "FBaekmuk Gulim", sans-serif; }
`;

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextViewService.js
var __decorate$21 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$20 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var ContextViewHandler = class ContextViewHandler$1 extends Disposable {
	constructor(layoutService) {
		super();
		this.layoutService = layoutService;
		this.contextView = this._register(new ContextView(this.layoutService.mainContainer, 1));
		this.layout();
		this._register(layoutService.onDidLayoutContainer(() => this.layout()));
	}
	showContextView(delegate, container, shadowRoot) {
		let domPosition;
		if (container) if (container === this.layoutService.getContainer(getWindow(container))) domPosition = 1;
		else if (shadowRoot) domPosition = 3;
		else domPosition = 2;
		else domPosition = 1;
		this.contextView.setContainer(container ?? this.layoutService.activeContainer, domPosition);
		this.contextView.show(delegate);
		const openContextView = { close: () => {
			if (this.openContextView === openContextView) this.hideContextView();
		} };
		this.openContextView = openContextView;
		return openContextView;
	}
	layout() {
		this.contextView.layout();
	}
	hideContextView(data) {
		this.contextView.hide(data);
		this.openContextView = void 0;
	}
};
ContextViewHandler = __decorate$21([__param$20(0, ILayoutService)], ContextViewHandler);
var ContextViewService = class extends ContextViewHandler {
	getContextViewElement() {
		return this.contextView.getViewElement();
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/browser/services/hoverService/updatableHoverWidget.js
var ManagedHoverWidget = class {
	constructor(hoverDelegate, target, fadeInAnimation) {
		this.hoverDelegate = hoverDelegate;
		this.target = target;
		this.fadeInAnimation = fadeInAnimation;
	}
	async update(content, focus, options) {
		if (this._cancellationTokenSource) {
			this._cancellationTokenSource.dispose(true);
			this._cancellationTokenSource = void 0;
		}
		if (this.isDisposed) return;
		let resolvedContent;
		if (content === void 0 || isString$1(content) || isHTMLElement(content)) resolvedContent = content;
		else if (!isFunction(content.markdown)) resolvedContent = content.markdown ?? content.markdownNotSupportedFallback;
		else {
			if (!this._hoverWidget) this.show(localize("iconLabel.loading", "Loading..."), focus, options);
			this._cancellationTokenSource = new CancellationTokenSource$1();
			const token = this._cancellationTokenSource.token;
			resolvedContent = await content.markdown(token);
			if (resolvedContent === void 0) resolvedContent = content.markdownNotSupportedFallback;
			if (this.isDisposed || token.isCancellationRequested) return;
		}
		this.show(resolvedContent, focus, options);
	}
	show(content, focus, options) {
		const oldHoverWidget = this._hoverWidget;
		if (this.hasContent(content)) {
			const hoverOptions = {
				content,
				target: this.target,
				actions: options?.actions,
				linkHandler: options?.linkHandler,
				trapFocus: options?.trapFocus,
				appearance: {
					showPointer: this.hoverDelegate.placement === "element",
					skipFadeInAnimation: !this.fadeInAnimation || !!oldHoverWidget,
					showHoverHint: options?.appearance?.showHoverHint
				},
				position: { hoverPosition: 2 }
			};
			this._hoverWidget = this.hoverDelegate.showHover(hoverOptions, focus);
		}
		oldHoverWidget?.dispose();
	}
	hasContent(content) {
		if (!content) return false;
		if (isMarkdownString(content)) return !!content.value;
		return true;
	}
	get isDisposed() {
		return this._hoverWidget?.isDisposed;
	}
	dispose() {
		this._hoverWidget?.dispose();
		this._cancellationTokenSource?.dispose(true);
		this._cancellationTokenSource = void 0;
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/browser/services/hoverService/hoverService.js
var __decorate$20 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$19 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var HoverService = class HoverService$1 extends Disposable {
	constructor(_instantiationService, contextMenuService, _keybindingService, _layoutService, _accessibilityService) {
		super();
		this._instantiationService = _instantiationService;
		this._keybindingService = _keybindingService;
		this._layoutService = _layoutService;
		this._accessibilityService = _accessibilityService;
		this._managedHovers = /* @__PURE__ */ new Map();
		contextMenuService.onDidShowContextMenu(() => this.hideHover());
		this._contextViewHandler = this._register(new ContextViewHandler(this._layoutService));
	}
	showHover(options, focus, skipLastFocusedUpdate) {
		if (getHoverOptionsIdentity(this._currentHoverOptions) === getHoverOptionsIdentity(options)) return;
		if (this._currentHover && this._currentHoverOptions?.persistence?.sticky) return;
		this._currentHoverOptions = options;
		this._lastHoverOptions = options;
		const trapFocus = options.trapFocus || this._accessibilityService.isScreenReaderOptimized();
		const activeElement = getActiveElement();
		if (!skipLastFocusedUpdate) if (trapFocus && activeElement) {
			if (!activeElement.classList.contains("monaco-hover")) this._lastFocusedElementBeforeOpen = activeElement;
		} else this._lastFocusedElementBeforeOpen = void 0;
		const hoverDisposables = new DisposableStore();
		const hover = this._instantiationService.createInstance(HoverWidget, options);
		if (options.persistence?.sticky) hover.isLocked = true;
		hover.onDispose(() => {
			if (this._currentHover?.domNode && isAncestorOfActiveElement(this._currentHover.domNode)) this._lastFocusedElementBeforeOpen?.focus();
			if (this._currentHoverOptions === options) this._currentHoverOptions = void 0;
			hoverDisposables.dispose();
		}, void 0, hoverDisposables);
		if (!options.container) {
			const targetElement = isHTMLElement(options.target) ? options.target : options.target.targetElements[0];
			options.container = this._layoutService.getContainer(getWindow(targetElement));
		}
		this._contextViewHandler.showContextView(new HoverContextViewDelegate(hover, focus), options.container);
		hover.onRequestLayout(() => this._contextViewHandler.layout(), void 0, hoverDisposables);
		if (options.persistence?.sticky) hoverDisposables.add(addDisposableListener(getWindow(options.container).document, EventType$1.MOUSE_DOWN, (e) => {
			if (!isAncestor(e.target, hover.domNode)) this.doHideHover();
		}));
		else {
			if ("targetElements" in options.target) for (const element of options.target.targetElements) hoverDisposables.add(addDisposableListener(element, EventType$1.CLICK, () => this.hideHover()));
			else hoverDisposables.add(addDisposableListener(options.target, EventType$1.CLICK, () => this.hideHover()));
			const focusedElement = getActiveElement();
			if (focusedElement) {
				const focusedElementDocument = getWindow(focusedElement).document;
				hoverDisposables.add(addDisposableListener(focusedElement, EventType$1.KEY_DOWN, (e) => this._keyDown(e, hover, !!options.persistence?.hideOnKeyDown)));
				hoverDisposables.add(addDisposableListener(focusedElementDocument, EventType$1.KEY_DOWN, (e) => this._keyDown(e, hover, !!options.persistence?.hideOnKeyDown)));
				hoverDisposables.add(addDisposableListener(focusedElement, EventType$1.KEY_UP, (e) => this._keyUp(e, hover)));
				hoverDisposables.add(addDisposableListener(focusedElementDocument, EventType$1.KEY_UP, (e) => this._keyUp(e, hover)));
			}
		}
		if ("IntersectionObserver" in mainWindow) {
			const observer = new IntersectionObserver((e) => this._intersectionChange(e, hover), { threshold: 0 });
			const firstTargetElement = "targetElements" in options.target ? options.target.targetElements[0] : options.target;
			observer.observe(firstTargetElement);
			hoverDisposables.add(toDisposable(() => observer.disconnect()));
		}
		this._currentHover = hover;
		return hover;
	}
	hideHover() {
		if (this._currentHover?.isLocked || !this._currentHoverOptions) return;
		this.doHideHover();
	}
	doHideHover() {
		this._currentHover = void 0;
		this._currentHoverOptions = void 0;
		this._contextViewHandler.hideContextView();
	}
	_intersectionChange(entries, hover) {
		if (!entries[entries.length - 1].isIntersecting) hover.dispose();
	}
	showAndFocusLastHover() {
		if (!this._lastHoverOptions) return;
		this.showHover(this._lastHoverOptions, true, true);
	}
	_keyDown(e, hover, hideOnKeyDown) {
		if (e.key === "Alt") {
			hover.isLocked = true;
			return;
		}
		const event = new StandardKeyboardEvent(e);
		if (this._keybindingService.resolveKeyboardEvent(event).getSingleModifierDispatchChords().some((value) => !!value) || this._keybindingService.softDispatch(event, event.target).kind !== 0) return;
		if (hideOnKeyDown && (!this._currentHoverOptions?.trapFocus || e.key !== "Tab")) {
			this.hideHover();
			this._lastFocusedElementBeforeOpen?.focus();
		}
	}
	_keyUp(e, hover) {
		if (e.key === "Alt") {
			hover.isLocked = false;
			if (!hover.isMouseIn) {
				this.hideHover();
				this._lastFocusedElementBeforeOpen?.focus();
			}
		}
	}
	setupManagedHover(hoverDelegate, targetElement, content, options) {
		targetElement.setAttribute("custom-hover", "true");
		if (targetElement.title !== "") {
			console.warn("HTML element already has a title attribute, which will conflict with the custom hover. Please remove the title attribute.");
			console.trace("Stack trace:", targetElement.title);
			targetElement.title = "";
		}
		let hoverPreparation;
		let hoverWidget;
		const hideHover = (disposeWidget, disposePreparation) => {
			const hadHover = hoverWidget !== void 0;
			if (disposeWidget) {
				hoverWidget?.dispose();
				hoverWidget = void 0;
			}
			if (disposePreparation) {
				hoverPreparation?.dispose();
				hoverPreparation = void 0;
			}
			if (hadHover) {
				hoverDelegate.onDidHideHover?.();
				hoverWidget = void 0;
			}
		};
		const triggerShowHover = (delay, focus, target, trapFocus) => {
			return new TimeoutTimer(async () => {
				if (!hoverWidget || hoverWidget.isDisposed) {
					hoverWidget = new ManagedHoverWidget(hoverDelegate, target || targetElement, delay > 0);
					await hoverWidget.update(typeof content === "function" ? content() : content, focus, {
						...options,
						trapFocus
					});
				}
			}, delay);
		};
		let isMouseDown = false;
		const mouseDownEmitter = addDisposableListener(targetElement, EventType$1.MOUSE_DOWN, () => {
			isMouseDown = true;
			hideHover(true, true);
		}, true);
		const mouseUpEmitter = addDisposableListener(targetElement, EventType$1.MOUSE_UP, () => {
			isMouseDown = false;
		}, true);
		const mouseLeaveEmitter = addDisposableListener(targetElement, EventType$1.MOUSE_LEAVE, (e) => {
			isMouseDown = false;
			hideHover(false, e.fromElement === targetElement);
		}, true);
		const onMouseOver = (e) => {
			if (hoverPreparation) return;
			const toDispose = new DisposableStore();
			const target = {
				targetElements: [targetElement],
				dispose: () => {}
			};
			if (hoverDelegate.placement === void 0 || hoverDelegate.placement === "mouse") {
				const onMouseMove = (e$1) => {
					target.x = e$1.x + 10;
					if (isHTMLElement(e$1.target) && getHoverTargetElement(e$1.target, targetElement) !== targetElement) hideHover(true, true);
				};
				toDispose.add(addDisposableListener(targetElement, EventType$1.MOUSE_MOVE, onMouseMove, true));
			}
			hoverPreparation = toDispose;
			if (isHTMLElement(e.target) && getHoverTargetElement(e.target, targetElement) !== targetElement) return;
			toDispose.add(triggerShowHover(hoverDelegate.delay, false, target));
		};
		const mouseOverDomEmitter = addDisposableListener(targetElement, EventType$1.MOUSE_OVER, onMouseOver, true);
		const onFocus = () => {
			if (isMouseDown || hoverPreparation) return;
			const target = {
				targetElements: [targetElement],
				dispose: () => {}
			};
			const toDispose = new DisposableStore();
			const onBlur = () => hideHover(true, true);
			toDispose.add(addDisposableListener(targetElement, EventType$1.BLUR, onBlur, true));
			toDispose.add(triggerShowHover(hoverDelegate.delay, false, target));
			hoverPreparation = toDispose;
		};
		let focusDomEmitter;
		const tagName = targetElement.tagName.toLowerCase();
		if (tagName !== "input" && tagName !== "textarea") focusDomEmitter = addDisposableListener(targetElement, EventType$1.FOCUS, onFocus, true);
		const hover = {
			show: (focus) => {
				hideHover(false, true);
				triggerShowHover(0, focus, void 0, focus);
			},
			hide: () => {
				hideHover(true, true);
			},
			update: async (newContent, hoverOptions) => {
				content = newContent;
				await hoverWidget?.update(content, void 0, hoverOptions);
			},
			dispose: () => {
				this._managedHovers.delete(targetElement);
				mouseOverDomEmitter.dispose();
				mouseLeaveEmitter.dispose();
				mouseDownEmitter.dispose();
				mouseUpEmitter.dispose();
				focusDomEmitter?.dispose();
				hideHover(true, true);
			}
		};
		this._managedHovers.set(targetElement, hover);
		return hover;
	}
	showManagedHover(target) {
		const hover = this._managedHovers.get(target);
		if (hover) hover.show(true);
	}
	dispose() {
		this._managedHovers.forEach((hover) => hover.dispose());
		super.dispose();
	}
};
HoverService = __decorate$20([
	__param$19(0, IInstantiationService),
	__param$19(1, IContextMenuService),
	__param$19(2, IKeybindingService),
	__param$19(3, ILayoutService),
	__param$19(4, IAccessibilityService)
], HoverService);
function getHoverOptionsIdentity(options) {
	if (options === void 0) return;
	return options?.id ?? options;
}
var HoverContextViewDelegate = class {
	get anchorPosition() {
		return this._hover.anchor;
	}
	constructor(_hover, _focus = false) {
		this._hover = _hover;
		this._focus = _focus;
		this.layer = 1;
	}
	render(container) {
		this._hover.render(container);
		if (this._focus) this._hover.focus();
		return this._hover;
	}
	getAnchor() {
		return {
			x: this._hover.x,
			y: this._hover.y
		};
	}
	layout() {
		this._hover.layout();
	}
};
function getHoverTargetElement(element, stopElement) {
	stopElement = stopElement ?? getWindow(element).document.body;
	while (!element.hasAttribute("custom-hover") && element !== stopElement) element = element.parentElement;
	return element;
}
registerSingleton(IHoverService, HoverService, 1);
registerThemingParticipant((theme, collector) => {
	const hoverBorder = theme.getColor(editorHoverBorder);
	if (hoverBorder) {
		collector.addRule(`.monaco-workbench .workbench-hover .hover-row:not(:first-child):not(:empty) { border-top: 1px solid ${hoverBorder.transparent(.5)}; }`);
		collector.addRule(`.monaco-workbench .workbench-hover hr { border-top: 1px solid ${hoverBorder.transparent(.5)}; }`);
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/configuration/common/configurationModels.js
function freeze(data) {
	return Object.isFrozen(data) ? data : deepFreeze(data);
}
var ConfigurationModel = class ConfigurationModel {
	static createEmptyModel(logService) {
		return new ConfigurationModel({}, [], [], void 0, logService);
	}
	constructor(_contents, _keys, _overrides, raw, logService) {
		this._contents = _contents;
		this._keys = _keys;
		this._overrides = _overrides;
		this.raw = raw;
		this.logService = logService;
		this.overrideConfigurations = /* @__PURE__ */ new Map();
	}
	get rawConfiguration() {
		if (!this._rawConfiguration) if (this.raw?.length) {
			const rawConfigurationModels = this.raw.map((raw) => {
				if (raw instanceof ConfigurationModel) return raw;
				const parser = new ConfigurationModelParser("", this.logService);
				parser.parseRaw(raw);
				return parser.configurationModel;
			});
			this._rawConfiguration = rawConfigurationModels.reduce((previous, current) => current === previous ? current : previous.merge(current), rawConfigurationModels[0]);
		} else this._rawConfiguration = this;
		return this._rawConfiguration;
	}
	get contents() {
		return this._contents;
	}
	get overrides() {
		return this._overrides;
	}
	get keys() {
		return this._keys;
	}
	isEmpty() {
		return this._keys.length === 0 && Object.keys(this._contents).length === 0 && this._overrides.length === 0;
	}
	getValue(section) {
		return section ? getConfigurationValue(this.contents, section) : this.contents;
	}
	inspect(section, overrideIdentifier) {
		const that = this;
		return {
			get value() {
				return freeze(that.rawConfiguration.getValue(section));
			},
			get override() {
				return overrideIdentifier ? freeze(that.rawConfiguration.getOverrideValue(section, overrideIdentifier)) : void 0;
			},
			get merged() {
				return freeze(overrideIdentifier ? that.rawConfiguration.override(overrideIdentifier).getValue(section) : that.rawConfiguration.getValue(section));
			},
			get overrides() {
				const overrides = [];
				for (const { contents, identifiers, keys } of that.rawConfiguration.overrides) {
					const value = new ConfigurationModel(contents, keys, [], void 0, that.logService).getValue(section);
					if (value !== void 0) overrides.push({
						identifiers,
						value
					});
				}
				return overrides.length ? freeze(overrides) : void 0;
			}
		};
	}
	getOverrideValue(section, overrideIdentifier) {
		const overrideContents = this.getContentsForOverrideIdentifer(overrideIdentifier);
		return overrideContents ? section ? getConfigurationValue(overrideContents, section) : overrideContents : void 0;
	}
	override(identifier) {
		let overrideConfigurationModel = this.overrideConfigurations.get(identifier);
		if (!overrideConfigurationModel) {
			overrideConfigurationModel = this.createOverrideConfigurationModel(identifier);
			this.overrideConfigurations.set(identifier, overrideConfigurationModel);
		}
		return overrideConfigurationModel;
	}
	merge(...others) {
		const contents = deepClone(this.contents);
		const overrides = deepClone(this.overrides);
		const keys = [...this.keys];
		const raws = this.raw?.length ? [...this.raw] : [this];
		for (const other of others) {
			raws.push(...other.raw?.length ? other.raw : [other]);
			if (other.isEmpty()) continue;
			this.mergeContents(contents, other.contents);
			for (const otherOverride of other.overrides) {
				const [override] = overrides.filter((o) => equals(o.identifiers, otherOverride.identifiers));
				if (override) {
					this.mergeContents(override.contents, otherOverride.contents);
					override.keys.push(...otherOverride.keys);
					override.keys = distinct(override.keys);
				} else overrides.push(deepClone(otherOverride));
			}
			for (const key of other.keys) if (keys.indexOf(key) === -1) keys.push(key);
		}
		return new ConfigurationModel(contents, keys, overrides, raws.every((raw) => raw instanceof ConfigurationModel) ? void 0 : raws, this.logService);
	}
	createOverrideConfigurationModel(identifier) {
		const overrideContents = this.getContentsForOverrideIdentifer(identifier);
		if (!overrideContents || typeof overrideContents !== "object" || !Object.keys(overrideContents).length) return this;
		const contents = {};
		for (const key of distinct([...Object.keys(this.contents), ...Object.keys(overrideContents)])) {
			let contentsForKey = this.contents[key];
			const overrideContentsForKey = overrideContents[key];
			if (overrideContentsForKey) if (typeof contentsForKey === "object" && typeof overrideContentsForKey === "object") {
				contentsForKey = deepClone(contentsForKey);
				this.mergeContents(contentsForKey, overrideContentsForKey);
			} else contentsForKey = overrideContentsForKey;
			contents[key] = contentsForKey;
		}
		return new ConfigurationModel(contents, this.keys, this.overrides, void 0, this.logService);
	}
	mergeContents(source, target) {
		for (const key of Object.keys(target)) {
			if (key in source) {
				if (isObject(source[key]) && isObject(target[key])) {
					this.mergeContents(source[key], target[key]);
					continue;
				}
			}
			source[key] = deepClone(target[key]);
		}
	}
	getContentsForOverrideIdentifer(identifier) {
		let contentsForIdentifierOnly = null;
		let contents = null;
		const mergeContents = (contentsToMerge) => {
			if (contentsToMerge) if (contents) this.mergeContents(contents, contentsToMerge);
			else contents = deepClone(contentsToMerge);
		};
		for (const override of this.overrides) if (override.identifiers.length === 1 && override.identifiers[0] === identifier) contentsForIdentifierOnly = override.contents;
		else if (override.identifiers.includes(identifier)) mergeContents(override.contents);
		mergeContents(contentsForIdentifierOnly);
		return contents;
	}
	toJSON() {
		return {
			contents: this.contents,
			overrides: this.overrides,
			keys: this.keys
		};
	}
	setValue(key, value) {
		this.updateValue(key, value, false);
	}
	removeValue(key) {
		const index = this.keys.indexOf(key);
		if (index === -1) return;
		this.keys.splice(index, 1);
		removeFromValueTree(this.contents, key);
		if (OVERRIDE_PROPERTY_REGEX.test(key)) this.overrides.splice(this.overrides.findIndex((o) => equals(o.identifiers, overrideIdentifiersFromKey(key))), 1);
	}
	updateValue(key, value, add) {
		addToValueTree(this.contents, key, value, (e) => this.logService.error(e));
		add = add || this.keys.indexOf(key) === -1;
		if (add) this.keys.push(key);
		if (OVERRIDE_PROPERTY_REGEX.test(key)) {
			const identifiers = overrideIdentifiersFromKey(key);
			const override = {
				identifiers,
				keys: Object.keys(this.contents[key]),
				contents: toValuesTree(this.contents[key], (message) => this.logService.error(message))
			};
			const index = this.overrides.findIndex((o) => equals(o.identifiers, identifiers));
			if (index !== -1) this.overrides[index] = override;
			else this.overrides.push(override);
		}
	}
};
var ConfigurationModelParser = class {
	constructor(_name, logService) {
		this._name = _name;
		this.logService = logService;
		this._raw = null;
		this._configurationModel = null;
		this._restrictedConfigurations = [];
	}
	get configurationModel() {
		return this._configurationModel || ConfigurationModel.createEmptyModel(this.logService);
	}
	parseRaw(raw, options) {
		this._raw = raw;
		const { contents, keys, overrides, restricted, hasExcludedProperties } = this.doParseRaw(raw, options);
		this._configurationModel = new ConfigurationModel(contents, keys, overrides, hasExcludedProperties ? [raw] : void 0, this.logService);
		this._restrictedConfigurations = restricted || [];
	}
	doParseRaw(raw, options) {
		const configurationProperties = Registry.as(Extensions.Configuration).getConfigurationProperties();
		const filtered = this.filter(raw, configurationProperties, true, options);
		raw = filtered.raw;
		const contents = toValuesTree(raw, (message) => this.logService.error(`Conflict in settings file ${this._name}: ${message}`));
		const keys = Object.keys(raw);
		const overrides = this.toOverrides(raw, (message) => this.logService.error(`Conflict in settings file ${this._name}: ${message}`));
		return {
			contents,
			keys,
			overrides,
			restricted: filtered.restricted,
			hasExcludedProperties: filtered.hasExcludedProperties
		};
	}
	filter(properties, configurationProperties, filterOverriddenProperties, options) {
		let hasExcludedProperties = false;
		if (!options?.scopes && !options?.skipRestricted && !options?.exclude?.length) return {
			raw: properties,
			restricted: [],
			hasExcludedProperties
		};
		const raw = {};
		const restricted = [];
		for (const key in properties) if (OVERRIDE_PROPERTY_REGEX.test(key) && filterOverriddenProperties) {
			const result = this.filter(properties[key], configurationProperties, false, options);
			raw[key] = result.raw;
			hasExcludedProperties = hasExcludedProperties || result.hasExcludedProperties;
			restricted.push(...result.restricted);
		} else {
			const propertySchema = configurationProperties[key];
			const scope = propertySchema ? typeof propertySchema.scope !== "undefined" ? propertySchema.scope : 3 : void 0;
			if (propertySchema?.restricted) restricted.push(key);
			if (!options.exclude?.includes(key) && (options.include?.includes(key) || (scope === void 0 || options.scopes === void 0 || options.scopes.includes(scope)) && !(options.skipRestricted && propertySchema?.restricted))) raw[key] = properties[key];
			else hasExcludedProperties = true;
		}
		return {
			raw,
			restricted,
			hasExcludedProperties
		};
	}
	toOverrides(raw, conflictReporter) {
		const overrides = [];
		for (const key of Object.keys(raw)) if (OVERRIDE_PROPERTY_REGEX.test(key)) {
			const overrideRaw = {};
			for (const keyInOverrideRaw in raw[key]) overrideRaw[keyInOverrideRaw] = raw[key][keyInOverrideRaw];
			overrides.push({
				identifiers: overrideIdentifiersFromKey(key),
				keys: Object.keys(overrideRaw),
				contents: toValuesTree(overrideRaw, conflictReporter)
			});
		}
		return overrides;
	}
};
var ConfigurationInspectValue = class {
	constructor(key, overrides, _value, overrideIdentifiers, defaultConfiguration, policyConfiguration, applicationConfiguration, userConfiguration, localUserConfiguration, remoteUserConfiguration, workspaceConfiguration, folderConfigurationModel, memoryConfigurationModel) {
		this.key = key;
		this.overrides = overrides;
		this._value = _value;
		this.overrideIdentifiers = overrideIdentifiers;
		this.defaultConfiguration = defaultConfiguration;
		this.policyConfiguration = policyConfiguration;
		this.applicationConfiguration = applicationConfiguration;
		this.userConfiguration = userConfiguration;
		this.localUserConfiguration = localUserConfiguration;
		this.remoteUserConfiguration = remoteUserConfiguration;
		this.workspaceConfiguration = workspaceConfiguration;
		this.folderConfigurationModel = folderConfigurationModel;
		this.memoryConfigurationModel = memoryConfigurationModel;
	}
	toInspectValue(inspectValue) {
		return inspectValue?.value !== void 0 || inspectValue?.override !== void 0 || inspectValue?.overrides !== void 0 ? inspectValue : void 0;
	}
	get userInspectValue() {
		if (!this._userInspectValue) this._userInspectValue = this.userConfiguration.inspect(this.key, this.overrides.overrideIdentifier);
		return this._userInspectValue;
	}
	get user() {
		return this.toInspectValue(this.userInspectValue);
	}
};
var Configuration = class Configuration {
	constructor(_defaultConfiguration, _policyConfiguration, _applicationConfiguration, _localUserConfiguration, _remoteUserConfiguration, _workspaceConfiguration, _folderConfigurations, _memoryConfiguration, _memoryConfigurationByResource, logService) {
		this._defaultConfiguration = _defaultConfiguration;
		this._policyConfiguration = _policyConfiguration;
		this._applicationConfiguration = _applicationConfiguration;
		this._localUserConfiguration = _localUserConfiguration;
		this._remoteUserConfiguration = _remoteUserConfiguration;
		this._workspaceConfiguration = _workspaceConfiguration;
		this._folderConfigurations = _folderConfigurations;
		this._memoryConfiguration = _memoryConfiguration;
		this._memoryConfigurationByResource = _memoryConfigurationByResource;
		this.logService = logService;
		this._workspaceConsolidatedConfiguration = null;
		this._foldersConsolidatedConfigurations = new ResourceMap();
		this._userConfiguration = null;
	}
	getValue(section, overrides, workspace) {
		return this.getConsolidatedConfigurationModel(section, overrides, workspace).getValue(section);
	}
	updateValue(key, value, overrides = {}) {
		let memoryConfiguration;
		if (overrides.resource) {
			memoryConfiguration = this._memoryConfigurationByResource.get(overrides.resource);
			if (!memoryConfiguration) {
				memoryConfiguration = ConfigurationModel.createEmptyModel(this.logService);
				this._memoryConfigurationByResource.set(overrides.resource, memoryConfiguration);
			}
		} else memoryConfiguration = this._memoryConfiguration;
		if (value === void 0) memoryConfiguration.removeValue(key);
		else memoryConfiguration.setValue(key, value);
		if (!overrides.resource) this._workspaceConsolidatedConfiguration = null;
	}
	inspect(key, overrides, workspace) {
		const consolidateConfigurationModel = this.getConsolidatedConfigurationModel(key, overrides, workspace);
		const folderConfigurationModel = this.getFolderConfigurationModelForResource(overrides.resource, workspace);
		const memoryConfigurationModel = overrides.resource ? this._memoryConfigurationByResource.get(overrides.resource) || this._memoryConfiguration : this._memoryConfiguration;
		const overrideIdentifiers = /* @__PURE__ */ new Set();
		for (const override of consolidateConfigurationModel.overrides) for (const overrideIdentifier of override.identifiers) if (consolidateConfigurationModel.getOverrideValue(key, overrideIdentifier) !== void 0) overrideIdentifiers.add(overrideIdentifier);
		return new ConfigurationInspectValue(key, overrides, consolidateConfigurationModel.getValue(key), overrideIdentifiers.size ? [...overrideIdentifiers] : void 0, this._defaultConfiguration, this._policyConfiguration.isEmpty() ? void 0 : this._policyConfiguration, this.applicationConfiguration.isEmpty() ? void 0 : this.applicationConfiguration, this.userConfiguration, this.localUserConfiguration, this.remoteUserConfiguration, workspace ? this._workspaceConfiguration : void 0, folderConfigurationModel ? folderConfigurationModel : void 0, memoryConfigurationModel);
	}
	get applicationConfiguration() {
		return this._applicationConfiguration;
	}
	get userConfiguration() {
		if (!this._userConfiguration) this._userConfiguration = this._remoteUserConfiguration.isEmpty() ? this._localUserConfiguration : this._localUserConfiguration.merge(this._remoteUserConfiguration);
		return this._userConfiguration;
	}
	get localUserConfiguration() {
		return this._localUserConfiguration;
	}
	get remoteUserConfiguration() {
		return this._remoteUserConfiguration;
	}
	getConsolidatedConfigurationModel(section, overrides, workspace) {
		let configurationModel = this.getConsolidatedConfigurationModelForResource(overrides, workspace);
		if (overrides.overrideIdentifier) configurationModel = configurationModel.override(overrides.overrideIdentifier);
		if (!this._policyConfiguration.isEmpty() && this._policyConfiguration.getValue(section) !== void 0) configurationModel = configurationModel.merge(this._policyConfiguration);
		return configurationModel;
	}
	getConsolidatedConfigurationModelForResource({ resource }, workspace) {
		let consolidateConfiguration = this.getWorkspaceConsolidatedConfiguration();
		if (workspace && resource) {
			const root = workspace.getFolder(resource);
			if (root) consolidateConfiguration = this.getFolderConsolidatedConfiguration(root.uri) || consolidateConfiguration;
			const memoryConfigurationForResource = this._memoryConfigurationByResource.get(resource);
			if (memoryConfigurationForResource) consolidateConfiguration = consolidateConfiguration.merge(memoryConfigurationForResource);
		}
		return consolidateConfiguration;
	}
	getWorkspaceConsolidatedConfiguration() {
		if (!this._workspaceConsolidatedConfiguration) this._workspaceConsolidatedConfiguration = this._defaultConfiguration.merge(this.applicationConfiguration, this.userConfiguration, this._workspaceConfiguration, this._memoryConfiguration);
		return this._workspaceConsolidatedConfiguration;
	}
	getFolderConsolidatedConfiguration(folder) {
		let folderConsolidatedConfiguration = this._foldersConsolidatedConfigurations.get(folder);
		if (!folderConsolidatedConfiguration) {
			const workspaceConsolidateConfiguration = this.getWorkspaceConsolidatedConfiguration();
			const folderConfiguration = this._folderConfigurations.get(folder);
			if (folderConfiguration) {
				folderConsolidatedConfiguration = workspaceConsolidateConfiguration.merge(folderConfiguration);
				this._foldersConsolidatedConfigurations.set(folder, folderConsolidatedConfiguration);
			} else folderConsolidatedConfiguration = workspaceConsolidateConfiguration;
		}
		return folderConsolidatedConfiguration;
	}
	getFolderConfigurationModelForResource(resource, workspace) {
		if (workspace && resource) {
			const root = workspace.getFolder(resource);
			if (root) return this._folderConfigurations.get(root.uri);
		}
	}
	toData() {
		return {
			defaults: {
				contents: this._defaultConfiguration.contents,
				overrides: this._defaultConfiguration.overrides,
				keys: this._defaultConfiguration.keys
			},
			policy: {
				contents: this._policyConfiguration.contents,
				overrides: this._policyConfiguration.overrides,
				keys: this._policyConfiguration.keys
			},
			application: {
				contents: this.applicationConfiguration.contents,
				overrides: this.applicationConfiguration.overrides,
				keys: this.applicationConfiguration.keys
			},
			user: {
				contents: this.userConfiguration.contents,
				overrides: this.userConfiguration.overrides,
				keys: this.userConfiguration.keys
			},
			workspace: {
				contents: this._workspaceConfiguration.contents,
				overrides: this._workspaceConfiguration.overrides,
				keys: this._workspaceConfiguration.keys
			},
			folders: [...this._folderConfigurations.keys()].reduce((result, folder) => {
				const { contents, overrides, keys } = this._folderConfigurations.get(folder);
				result.push([folder, {
					contents,
					overrides,
					keys
				}]);
				return result;
			}, [])
		};
	}
	static parse(data, logService) {
		const defaultConfiguration = this.parseConfigurationModel(data.defaults, logService);
		const policyConfiguration = this.parseConfigurationModel(data.policy, logService);
		const applicationConfiguration = this.parseConfigurationModel(data.application, logService);
		const userConfiguration = this.parseConfigurationModel(data.user, logService);
		const workspaceConfiguration = this.parseConfigurationModel(data.workspace, logService);
		const folders = data.folders.reduce((result, value) => {
			result.set(URI.revive(value[0]), this.parseConfigurationModel(value[1], logService));
			return result;
		}, new ResourceMap());
		return new Configuration(defaultConfiguration, policyConfiguration, applicationConfiguration, userConfiguration, ConfigurationModel.createEmptyModel(logService), workspaceConfiguration, folders, ConfigurationModel.createEmptyModel(logService), new ResourceMap(), logService);
	}
	static parseConfigurationModel(model, logService) {
		return new ConfigurationModel(model.contents, model.keys, model.overrides, void 0, logService);
	}
};
var ConfigurationChangeEvent = class {
	constructor(change, previous, currentConfiguraiton, currentWorkspace, logService) {
		this.change = change;
		this.previous = previous;
		this.currentConfiguraiton = currentConfiguraiton;
		this.currentWorkspace = currentWorkspace;
		this.logService = logService;
		this._marker = "\n";
		this._markerCode1 = this._marker.charCodeAt(0);
		this._markerCode2 = ".".charCodeAt(0);
		this.affectedKeys = /* @__PURE__ */ new Set();
		this._previousConfiguration = void 0;
		for (const key of change.keys) this.affectedKeys.add(key);
		for (const [, keys] of change.overrides) for (const key of keys) this.affectedKeys.add(key);
		this._affectsConfigStr = this._marker;
		for (const key of this.affectedKeys) this._affectsConfigStr += key + this._marker;
	}
	get previousConfiguration() {
		if (!this._previousConfiguration && this.previous) this._previousConfiguration = Configuration.parse(this.previous.data, this.logService);
		return this._previousConfiguration;
	}
	affectsConfiguration(section, overrides) {
		const needle = this._marker + section;
		const idx = this._affectsConfigStr.indexOf(needle);
		if (idx < 0) return false;
		const pos = idx + needle.length;
		if (pos >= this._affectsConfigStr.length) return false;
		const code = this._affectsConfigStr.charCodeAt(pos);
		if (code !== this._markerCode1 && code !== this._markerCode2) return false;
		if (overrides) {
			const value1 = this.previousConfiguration ? this.previousConfiguration.getValue(section, overrides, this.previous?.workspace) : void 0;
			const value2 = this.currentConfiguraiton.getValue(section, overrides, this.currentWorkspace);
			return !equals$1(value1, value2);
		}
		return true;
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybindingResolver.js
const NoMatchingKb = { kind: 0 };
var MoreChordsNeeded = { kind: 1 };
function KbFound(commandId, commandArgs, isBubble) {
	return {
		kind: 2,
		commandId,
		commandArgs,
		isBubble
	};
}
/**
* Stores mappings from keybindings to commands and from commands to keybindings.
* Given a sequence of chords, `resolve`s which keybinding it matches
*/
var KeybindingResolver = class KeybindingResolver {
	constructor(defaultKeybindings, overrides, log$1) {
		this._log = log$1;
		this._defaultKeybindings = defaultKeybindings;
		this._defaultBoundCommands = /* @__PURE__ */ new Map();
		for (const defaultKeybinding of defaultKeybindings) {
			const command = defaultKeybinding.command;
			if (command && command.charAt(0) !== "-") this._defaultBoundCommands.set(command, true);
		}
		this._map = /* @__PURE__ */ new Map();
		this._lookupMap = /* @__PURE__ */ new Map();
		this._keybindings = KeybindingResolver.handleRemovals([].concat(defaultKeybindings).concat(overrides));
		for (let i = 0, len = this._keybindings.length; i < len; i++) {
			const k = this._keybindings[i];
			if (k.chords.length === 0) continue;
			const when = k.when?.substituteConstants();
			if (when && when.type === 0) continue;
			this._addKeyPress(k.chords[0], k);
		}
	}
	static _isTargetedForRemoval(defaultKb, keypress, when) {
		if (keypress) {
			for (let i = 0; i < keypress.length; i++) if (keypress[i] !== defaultKb.chords[i]) return false;
		}
		if (when && when.type !== 1) {
			if (!defaultKb.when) return false;
			if (!expressionsAreEqualWithConstantSubstitution(when, defaultKb.when)) return false;
		}
		return true;
	}
	/**
	* Looks for rules containing "-commandId" and removes them.
	*/
	static handleRemovals(rules) {
		const removals = /* @__PURE__ */ new Map();
		for (let i = 0, len = rules.length; i < len; i++) {
			const rule = rules[i];
			if (rule.command && rule.command.charAt(0) === "-") {
				const command = rule.command.substring(1);
				if (!removals.has(command)) removals.set(command, [rule]);
				else removals.get(command).push(rule);
			}
		}
		if (removals.size === 0) return rules;
		const result = [];
		for (let i = 0, len = rules.length; i < len; i++) {
			const rule = rules[i];
			if (!rule.command || rule.command.length === 0) {
				result.push(rule);
				continue;
			}
			if (rule.command.charAt(0) === "-") continue;
			const commandRemovals = removals.get(rule.command);
			if (!commandRemovals || !rule.isDefault) {
				result.push(rule);
				continue;
			}
			let isRemoved = false;
			for (const commandRemoval of commandRemovals) {
				const when = commandRemoval.when;
				if (this._isTargetedForRemoval(rule, commandRemoval.chords, when)) {
					isRemoved = true;
					break;
				}
			}
			if (!isRemoved) {
				result.push(rule);
				continue;
			}
		}
		return result;
	}
	_addKeyPress(keypress, item) {
		const conflicts = this._map.get(keypress);
		if (typeof conflicts === "undefined") {
			this._map.set(keypress, [item]);
			this._addToLookupMap(item);
			return;
		}
		for (let i = conflicts.length - 1; i >= 0; i--) {
			const conflict = conflicts[i];
			if (conflict.command === item.command) continue;
			let isShorterKbPrefix = true;
			for (let i$1 = 1; i$1 < conflict.chords.length && i$1 < item.chords.length; i$1++) if (conflict.chords[i$1] !== item.chords[i$1]) {
				isShorterKbPrefix = false;
				break;
			}
			if (!isShorterKbPrefix) continue;
			if (KeybindingResolver.whenIsEntirelyIncluded(conflict.when, item.when)) this._removeFromLookupMap(conflict);
		}
		conflicts.push(item);
		this._addToLookupMap(item);
	}
	_addToLookupMap(item) {
		if (!item.command) return;
		let arr = this._lookupMap.get(item.command);
		if (typeof arr === "undefined") {
			arr = [item];
			this._lookupMap.set(item.command, arr);
		} else arr.push(item);
	}
	_removeFromLookupMap(item) {
		if (!item.command) return;
		const arr = this._lookupMap.get(item.command);
		if (typeof arr === "undefined") return;
		for (let i = 0, len = arr.length; i < len; i++) if (arr[i] === item) {
			arr.splice(i, 1);
			return;
		}
	}
	/**
	* Returns true if it is provable `a` implies `b`.
	*/
	static whenIsEntirelyIncluded(a, b) {
		if (!b || b.type === 1) return true;
		if (!a || a.type === 1) return false;
		return implies(a, b);
	}
	getKeybindings() {
		return this._keybindings;
	}
	lookupPrimaryKeybinding(commandId, context) {
		const items = this._lookupMap.get(commandId);
		if (typeof items === "undefined" || items.length === 0) return null;
		if (items.length === 1) return items[0];
		for (let i = items.length - 1; i >= 0; i--) {
			const item = items[i];
			if (context.contextMatchesRules(item.when)) return item;
		}
		return items[items.length - 1];
	}
	/**
	* Looks up a keybinding trigged as a result of pressing a sequence of chords - `[...currentChords, keypress]`
	*
	* Example: resolving 3 chords pressed sequentially - `cmd+k cmd+p cmd+i`:
	* 	`currentChords = [ 'cmd+k' , 'cmd+p' ]` and `keypress = `cmd+i` - last pressed chord
	*/
	resolve(context, currentChords, keypress) {
		const pressedChords = [...currentChords, keypress];
		this._log(`| Resolving ${pressedChords}`);
		const kbCandidates = this._map.get(pressedChords[0]);
		if (kbCandidates === void 0) {
			this._log(`\\ No keybinding entries.`);
			return NoMatchingKb;
		}
		let lookupMap = null;
		if (pressedChords.length < 2) lookupMap = kbCandidates;
		else {
			lookupMap = [];
			for (let i = 0, len = kbCandidates.length; i < len; i++) {
				const candidate = kbCandidates[i];
				if (pressedChords.length > candidate.chords.length) continue;
				let prefixMatches = true;
				for (let i$1 = 1; i$1 < pressedChords.length; i$1++) if (candidate.chords[i$1] !== pressedChords[i$1]) {
					prefixMatches = false;
					break;
				}
				if (prefixMatches) lookupMap.push(candidate);
			}
		}
		const result = this._findCommand(context, lookupMap);
		if (!result) {
			this._log(`\\ From ${lookupMap.length} keybinding entries, no when clauses matched the context.`);
			return NoMatchingKb;
		}
		if (pressedChords.length < result.chords.length) {
			this._log(`\\ From ${lookupMap.length} keybinding entries, awaiting ${result.chords.length - pressedChords.length} more chord(s), when: ${printWhenExplanation(result.when)}, source: ${printSourceExplanation(result)}.`);
			return MoreChordsNeeded;
		}
		this._log(`\\ From ${lookupMap.length} keybinding entries, matched ${result.command}, when: ${printWhenExplanation(result.when)}, source: ${printSourceExplanation(result)}.`);
		return KbFound(result.command, result.commandArgs, result.bubble);
	}
	_findCommand(context, matches) {
		for (let i = matches.length - 1; i >= 0; i--) {
			const k = matches[i];
			if (!KeybindingResolver._contextMatchesRules(context, k.when)) continue;
			return k;
		}
		return null;
	}
	static _contextMatchesRules(context, rules) {
		if (!rules) return true;
		return rules.evaluate(context);
	}
};
function printWhenExplanation(when) {
	if (!when) return `no when condition`;
	return `${when.serialize()}`;
}
function printSourceExplanation(kb) {
	return kb.extensionId ? kb.isBuiltinExtension ? `built-in extension ${kb.extensionId}` : `user extension ${kb.extensionId}` : kb.isDefault ? `built-in` : `user`;
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/keybinding/common/abstractKeybindingService.js
var HIGH_FREQ_COMMANDS = /^(cursor|delete|undo|redo|tab|editor\.action\.clipboard)/;
var AbstractKeybindingService = class extends Disposable {
	get onDidUpdateKeybindings() {
		return this._onDidUpdateKeybindings ? this._onDidUpdateKeybindings.event : Event.None;
	}
	get inChordMode() {
		return this._currentChords.length > 0;
	}
	constructor(_contextKeyService, _commandService, _telemetryService, _notificationService, _logService) {
		super();
		this._contextKeyService = _contextKeyService;
		this._commandService = _commandService;
		this._telemetryService = _telemetryService;
		this._notificationService = _notificationService;
		this._logService = _logService;
		this._onDidUpdateKeybindings = this._register(new Emitter$1());
		this._currentChords = [];
		this._currentChordChecker = new IntervalTimer();
		this._currentChordStatusMessage = null;
		this._ignoreSingleModifiers = KeybindingModifierSet.EMPTY;
		this._currentSingleModifier = null;
		this._currentSingleModifierClearTimeout = new TimeoutTimer();
		this._currentlyDispatchingCommandId = null;
		this._logging = false;
	}
	dispose() {
		super.dispose();
	}
	_log(str) {
		if (this._logging) this._logService.info(`[KeybindingService]: ${str}`);
	}
	getKeybindings() {
		return this._getResolver().getKeybindings();
	}
	lookupKeybinding(commandId, context) {
		const result = this._getResolver().lookupPrimaryKeybinding(commandId, context || this._contextKeyService);
		if (!result) return;
		return result.resolvedKeybinding;
	}
	dispatchEvent(e, target) {
		return this._dispatch(e, target);
	}
	softDispatch(e, target) {
		this._log(`/ Soft dispatching keyboard event`);
		const keybinding = this.resolveKeyboardEvent(e);
		if (keybinding.hasMultipleChords()) {
			console.warn("keyboard event should not be mapped to multiple chords");
			return NoMatchingKb;
		}
		const [firstChord] = keybinding.getDispatchChords();
		if (firstChord === null) {
			this._log(`\\ Keyboard event cannot be dispatched`);
			return NoMatchingKb;
		}
		const contextValue = this._contextKeyService.getContext(target);
		const currentChords = this._currentChords.map((({ keypress }) => keypress));
		return this._getResolver().resolve(contextValue, currentChords, firstChord);
	}
	_scheduleLeaveChordMode() {
		const chordLastInteractedTime = Date.now();
		this._currentChordChecker.cancelAndSet(() => {
			if (!this._documentHasFocus()) {
				this._leaveChordMode();
				return;
			}
			if (Date.now() - chordLastInteractedTime > 5e3) this._leaveChordMode();
		}, 500);
	}
	_expectAnotherChord(firstChord, keypressLabel) {
		this._currentChords.push({
			keypress: firstChord,
			label: keypressLabel
		});
		switch (this._currentChords.length) {
			case 0: throw illegalState("impossible");
			case 1:
				this._currentChordStatusMessage = this._notificationService.status(localize("first.chord", "({0}) was pressed. Waiting for second key of chord...", keypressLabel));
				break;
			default: {
				const fullKeypressLabel = this._currentChords.map(({ label }) => label).join(", ");
				this._currentChordStatusMessage = this._notificationService.status(localize("next.chord", "({0}) was pressed. Waiting for next key of chord...", fullKeypressLabel));
			}
		}
		this._scheduleLeaveChordMode();
		if (IME.enabled) IME.disable();
	}
	_leaveChordMode() {
		if (this._currentChordStatusMessage) {
			this._currentChordStatusMessage.dispose();
			this._currentChordStatusMessage = null;
		}
		this._currentChordChecker.cancel();
		this._currentChords = [];
		IME.enable();
	}
	_dispatch(e, target) {
		return this._doDispatch(this.resolveKeyboardEvent(e), target, false);
	}
	_singleModifierDispatch(e, target) {
		const keybinding = this.resolveKeyboardEvent(e);
		const [singleModifier] = keybinding.getSingleModifierDispatchChords();
		if (singleModifier) {
			if (this._ignoreSingleModifiers.has(singleModifier)) {
				this._log(`+ Ignoring single modifier ${singleModifier} due to it being pressed together with other keys.`);
				this._ignoreSingleModifiers = KeybindingModifierSet.EMPTY;
				this._currentSingleModifierClearTimeout.cancel();
				this._currentSingleModifier = null;
				return false;
			}
			this._ignoreSingleModifiers = KeybindingModifierSet.EMPTY;
			if (this._currentSingleModifier === null) {
				this._log(`+ Storing single modifier for possible chord ${singleModifier}.`);
				this._currentSingleModifier = singleModifier;
				this._currentSingleModifierClearTimeout.cancelAndSet(() => {
					this._log(`+ Clearing single modifier due to 300ms elapsed.`);
					this._currentSingleModifier = null;
				}, 300);
				return false;
			}
			if (singleModifier === this._currentSingleModifier) {
				this._log(`/ Dispatching single modifier chord ${singleModifier} ${singleModifier}`);
				this._currentSingleModifierClearTimeout.cancel();
				this._currentSingleModifier = null;
				return this._doDispatch(keybinding, target, true);
			}
			this._log(`+ Clearing single modifier due to modifier mismatch: ${this._currentSingleModifier} ${singleModifier}`);
			this._currentSingleModifierClearTimeout.cancel();
			this._currentSingleModifier = null;
			return false;
		}
		const [firstChord] = keybinding.getChords();
		this._ignoreSingleModifiers = new KeybindingModifierSet(firstChord);
		if (this._currentSingleModifier !== null) this._log(`+ Clearing single modifier due to other key up.`);
		this._currentSingleModifierClearTimeout.cancel();
		this._currentSingleModifier = null;
		return false;
	}
	_doDispatch(userKeypress, target, isSingleModiferChord = false) {
		let shouldPreventDefault = false;
		if (userKeypress.hasMultipleChords()) {
			console.warn("Unexpected keyboard event mapped to multiple chords");
			return false;
		}
		let userPressedChord = null;
		let currentChords = null;
		if (isSingleModiferChord) {
			const [dispatchKeyname] = userKeypress.getSingleModifierDispatchChords();
			userPressedChord = dispatchKeyname;
			currentChords = dispatchKeyname ? [dispatchKeyname] : [];
		} else {
			[userPressedChord] = userKeypress.getDispatchChords();
			currentChords = this._currentChords.map(({ keypress }) => keypress);
		}
		if (userPressedChord === null) {
			this._log(`\\ Keyboard event cannot be dispatched in keydown phase.`);
			return shouldPreventDefault;
		}
		const contextValue = this._contextKeyService.getContext(target);
		const keypressLabel = userKeypress.getLabel();
		const resolveResult = this._getResolver().resolve(contextValue, currentChords, userPressedChord);
		switch (resolveResult.kind) {
			case 0:
				this._logService.trace("KeybindingService#dispatch", keypressLabel, `[ No matching keybinding ]`);
				if (this.inChordMode) {
					const currentChordsLabel = this._currentChords.map(({ label }) => label).join(", ");
					this._log(`+ Leaving multi-chord mode: Nothing bound to "${currentChordsLabel}, ${keypressLabel}".`);
					this._notificationService.status(localize("missing.chord", "The key combination ({0}, {1}) is not a command.", currentChordsLabel, keypressLabel), { hideAfter: 10 * 1e3 });
					this._leaveChordMode();
					shouldPreventDefault = true;
				}
				return shouldPreventDefault;
			case 1:
				this._logService.trace("KeybindingService#dispatch", keypressLabel, `[ Several keybindings match - more chords needed ]`);
				shouldPreventDefault = true;
				this._expectAnotherChord(userPressedChord, keypressLabel);
				this._log(this._currentChords.length === 1 ? `+ Entering multi-chord mode...` : `+ Continuing multi-chord mode...`);
				return shouldPreventDefault;
			case 2:
				this._logService.trace("KeybindingService#dispatch", keypressLabel, `[ Will dispatch command ${resolveResult.commandId} ]`);
				if (resolveResult.commandId === null || resolveResult.commandId === "") {
					if (this.inChordMode) {
						const currentChordsLabel = this._currentChords.map(({ label }) => label).join(", ");
						this._log(`+ Leaving chord mode: Nothing bound to "${currentChordsLabel}, ${keypressLabel}".`);
						this._notificationService.status(localize("missing.chord", "The key combination ({0}, {1}) is not a command.", currentChordsLabel, keypressLabel), { hideAfter: 10 * 1e3 });
						this._leaveChordMode();
						shouldPreventDefault = true;
					}
				} else {
					if (this.inChordMode) this._leaveChordMode();
					if (!resolveResult.isBubble) shouldPreventDefault = true;
					this._log(`+ Invoking command ${resolveResult.commandId}.`);
					this._currentlyDispatchingCommandId = resolveResult.commandId;
					try {
						if (typeof resolveResult.commandArgs === "undefined") this._commandService.executeCommand(resolveResult.commandId).then(void 0, (err) => this._notificationService.warn(err));
						else this._commandService.executeCommand(resolveResult.commandId, resolveResult.commandArgs).then(void 0, (err) => this._notificationService.warn(err));
					} finally {
						this._currentlyDispatchingCommandId = null;
					}
					if (!HIGH_FREQ_COMMANDS.test(resolveResult.commandId)) this._telemetryService.publicLog2("workbenchActionExecuted", {
						id: resolveResult.commandId,
						from: "keybinding",
						detail: userKeypress.getUserSettingsLabel() ?? void 0
					});
				}
				return shouldPreventDefault;
		}
	}
	mightProducePrintableCharacter(event) {
		if (event.ctrlKey || event.metaKey) return false;
		if (event.keyCode >= 31 && event.keyCode <= 56 || event.keyCode >= 21 && event.keyCode <= 30) return true;
		return false;
	}
};
var KeybindingModifierSet = class KeybindingModifierSet {
	static {
		this.EMPTY = new KeybindingModifierSet(null);
	}
	constructor(source) {
		this._ctrlKey = source ? source.ctrlKey : false;
		this._shiftKey = source ? source.shiftKey : false;
		this._altKey = source ? source.altKey : false;
		this._metaKey = source ? source.metaKey : false;
	}
	has(modifier) {
		switch (modifier) {
			case "ctrl": return this._ctrlKey;
			case "shift": return this._shiftKey;
			case "alt": return this._altKey;
			case "meta": return this._metaKey;
		}
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/keybinding/common/resolvedKeybindingItem.js
var ResolvedKeybindingItem = class {
	constructor(resolvedKeybinding, command, commandArgs, when, isDefault, extensionId, isBuiltinExtension) {
		this._resolvedKeybindingItemBrand = void 0;
		this.resolvedKeybinding = resolvedKeybinding;
		this.chords = resolvedKeybinding ? toEmptyArrayIfContainsNull(resolvedKeybinding.getDispatchChords()) : [];
		if (resolvedKeybinding && this.chords.length === 0) this.chords = toEmptyArrayIfContainsNull(resolvedKeybinding.getSingleModifierDispatchChords());
		this.bubble = command ? command.charCodeAt(0) === 94 : false;
		this.command = this.bubble ? command.substr(1) : command;
		this.commandArgs = commandArgs;
		this.when = when;
		this.isDefault = isDefault;
		this.extensionId = extensionId;
		this.isBuiltinExtension = isBuiltinExtension;
	}
};
function toEmptyArrayIfContainsNull(arr) {
	const result = [];
	for (let i = 0, len = arr.length; i < len; i++) {
		const element = arr[i];
		if (!element) return [];
		result.push(element);
	}
	return result;
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/keybinding/common/baseResolvedKeybinding.js
var BaseResolvedKeybinding = class extends ResolvedKeybinding {
	constructor(os, chords) {
		super();
		if (chords.length === 0) throw illegalArgument(`chords`);
		this._os = os;
		this._chords = chords;
	}
	getLabel() {
		return UILabelProvider.toLabel(this._os, this._chords, (keybinding) => this._getLabel(keybinding));
	}
	getAriaLabel() {
		return AriaLabelProvider.toLabel(this._os, this._chords, (keybinding) => this._getAriaLabel(keybinding));
	}
	getElectronAccelerator() {
		if (this._chords.length > 1) return null;
		if (this._chords[0].isDuplicateModifierCase()) return null;
		return ElectronAcceleratorLabelProvider.toLabel(this._os, this._chords, (keybinding) => this._getElectronAccelerator(keybinding));
	}
	getUserSettingsLabel() {
		return UserSettingsLabelProvider.toLabel(this._os, this._chords, (keybinding) => this._getUserSettingsLabel(keybinding));
	}
	hasMultipleChords() {
		return this._chords.length > 1;
	}
	getChords() {
		return this._chords.map((keybinding) => this._getChord(keybinding));
	}
	_getChord(keybinding) {
		return new ResolvedChord(keybinding.ctrlKey, keybinding.shiftKey, keybinding.altKey, keybinding.metaKey, this._getLabel(keybinding), this._getAriaLabel(keybinding));
	}
	getDispatchChords() {
		return this._chords.map((keybinding) => this._getChordDispatch(keybinding));
	}
	getSingleModifierDispatchChords() {
		return this._chords.map((keybinding) => this._getSingleModifierChordDispatch(keybinding));
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/keybinding/common/usLayoutResolvedKeybinding.js
/**
* Do not instantiate. Use KeybindingService to get a ResolvedKeybinding seeded with information about the current kb layout.
*/
var USLayoutResolvedKeybinding = class USLayoutResolvedKeybinding extends BaseResolvedKeybinding {
	constructor(chords, os) {
		super(os, chords);
	}
	_keyCodeToUILabel(keyCode) {
		if (this._os === 2) switch (keyCode) {
			case 15: return "←";
			case 16: return "↑";
			case 17: return "→";
			case 18: return "↓";
		}
		return KeyCodeUtils.toString(keyCode);
	}
	_getLabel(chord) {
		if (chord.isDuplicateModifierCase()) return "";
		return this._keyCodeToUILabel(chord.keyCode);
	}
	_getAriaLabel(chord) {
		if (chord.isDuplicateModifierCase()) return "";
		return KeyCodeUtils.toString(chord.keyCode);
	}
	_getElectronAccelerator(chord) {
		return KeyCodeUtils.toElectronAccelerator(chord.keyCode);
	}
	_getUserSettingsLabel(chord) {
		if (chord.isDuplicateModifierCase()) return "";
		const result = KeyCodeUtils.toUserSettingsUS(chord.keyCode);
		return result ? result.toLowerCase() : result;
	}
	_getChordDispatch(chord) {
		return USLayoutResolvedKeybinding.getDispatchStr(chord);
	}
	static getDispatchStr(chord) {
		if (chord.isModifierKey()) return null;
		let result = "";
		if (chord.ctrlKey) result += "ctrl+";
		if (chord.shiftKey) result += "shift+";
		if (chord.altKey) result += "alt+";
		if (chord.metaKey) result += "meta+";
		result += KeyCodeUtils.toString(chord.keyCode);
		return result;
	}
	_getSingleModifierChordDispatch(keybinding) {
		if (keybinding.keyCode === 5 && !keybinding.shiftKey && !keybinding.altKey && !keybinding.metaKey) return "ctrl";
		if (keybinding.keyCode === 4 && !keybinding.ctrlKey && !keybinding.altKey && !keybinding.metaKey) return "shift";
		if (keybinding.keyCode === 6 && !keybinding.ctrlKey && !keybinding.shiftKey && !keybinding.metaKey) return "alt";
		if (keybinding.keyCode === 57 && !keybinding.ctrlKey && !keybinding.shiftKey && !keybinding.altKey) return "meta";
		return null;
	}
	/**
	* *NOTE*: Check return value for `KeyCode.Unknown`.
	*/
	static _scanCodeToKeyCode(scanCode) {
		const immutableKeyCode = IMMUTABLE_CODE_TO_KEY_CODE[scanCode];
		if (immutableKeyCode !== -1) return immutableKeyCode;
		switch (scanCode) {
			case 10: return 31;
			case 11: return 32;
			case 12: return 33;
			case 13: return 34;
			case 14: return 35;
			case 15: return 36;
			case 16: return 37;
			case 17: return 38;
			case 18: return 39;
			case 19: return 40;
			case 20: return 41;
			case 21: return 42;
			case 22: return 43;
			case 23: return 44;
			case 24: return 45;
			case 25: return 46;
			case 26: return 47;
			case 27: return 48;
			case 28: return 49;
			case 29: return 50;
			case 30: return 51;
			case 31: return 52;
			case 32: return 53;
			case 33: return 54;
			case 34: return 55;
			case 35: return 56;
			case 36: return 22;
			case 37: return 23;
			case 38: return 24;
			case 39: return 25;
			case 40: return 26;
			case 41: return 27;
			case 42: return 28;
			case 43: return 29;
			case 44: return 30;
			case 45: return 21;
			case 51: return 88;
			case 52: return 86;
			case 53: return 92;
			case 54: return 94;
			case 55: return 93;
			case 56: return 0;
			case 57: return 85;
			case 58: return 95;
			case 59: return 91;
			case 60: return 87;
			case 61: return 89;
			case 62: return 90;
			case 106: return 97;
		}
		return 0;
	}
	static _toKeyCodeChord(chord) {
		if (!chord) return null;
		if (chord instanceof KeyCodeChord) return chord;
		const keyCode = this._scanCodeToKeyCode(chord.scanCode);
		if (keyCode === 0) return null;
		return new KeyCodeChord(chord.ctrlKey, chord.shiftKey, chord.altKey, chord.metaKey, keyCode);
	}
	static resolveKeybinding(keybinding, os) {
		const chords = toEmptyArrayIfContainsNull(keybinding.chords.map((chord) => this._toKeyCodeChord(chord)));
		if (chords.length > 0) return [new USLayoutResolvedKeybinding(chords, os)];
		return [];
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/services/languagesAssociations.js
var registeredAssociations = [];
var nonUserRegisteredAssociations = [];
var userRegisteredAssociations = [];
/**
* Associate a language to the registry (platform).
* * **NOTE**: This association will lose over associations registered using `registerConfiguredLanguageAssociation`.
* * **NOTE**: Use `clearPlatformLanguageAssociations` to remove all associations registered using this function.
*/
function registerPlatformLanguageAssociation(association, warnOnOverwrite = false) {
	_registerLanguageAssociation(association, false, warnOnOverwrite);
}
function _registerLanguageAssociation(association, userConfigured, warnOnOverwrite) {
	const associationItem = toLanguageAssociationItem(association, userConfigured);
	registeredAssociations.push(associationItem);
	if (!associationItem.userConfigured) nonUserRegisteredAssociations.push(associationItem);
	else userRegisteredAssociations.push(associationItem);
	if (warnOnOverwrite && !associationItem.userConfigured) registeredAssociations.forEach((a) => {
		if (a.mime === associationItem.mime || a.userConfigured) return;
		if (associationItem.extension && a.extension === associationItem.extension) console.warn(`Overwriting extension <<${associationItem.extension}>> to now point to mime <<${associationItem.mime}>>`);
		if (associationItem.filename && a.filename === associationItem.filename) console.warn(`Overwriting filename <<${associationItem.filename}>> to now point to mime <<${associationItem.mime}>>`);
		if (associationItem.filepattern && a.filepattern === associationItem.filepattern) console.warn(`Overwriting filepattern <<${associationItem.filepattern}>> to now point to mime <<${associationItem.mime}>>`);
		if (associationItem.firstline && a.firstline === associationItem.firstline) console.warn(`Overwriting firstline <<${associationItem.firstline}>> to now point to mime <<${associationItem.mime}>>`);
	});
}
function toLanguageAssociationItem(association, userConfigured) {
	return {
		id: association.id,
		mime: association.mime,
		filename: association.filename,
		extension: association.extension,
		filepattern: association.filepattern,
		firstline: association.firstline,
		userConfigured,
		filenameLowercase: association.filename ? association.filename.toLowerCase() : void 0,
		extensionLowercase: association.extension ? association.extension.toLowerCase() : void 0,
		filepatternLowercase: association.filepattern ? parse$1(association.filepattern.toLowerCase()) : void 0,
		filepatternOnPath: association.filepattern ? association.filepattern.indexOf(posix.sep) >= 0 : false
	};
}
/**
* Clear language associations from the registry (platform).
*/
function clearPlatformLanguageAssociations() {
	registeredAssociations = registeredAssociations.filter((a) => a.userConfigured);
	nonUserRegisteredAssociations = [];
}
/**
* @see `getMimeTypes`
*/
function getLanguageIds(resource, firstLine) {
	return getAssociations(resource, firstLine).map((item) => item.id);
}
function getAssociations(resource, firstLine) {
	let path;
	if (resource) switch (resource.scheme) {
		case Schemas.file:
			path = resource.fsPath;
			break;
		case Schemas.data:
			path = DataUri.parseMetaData(resource).get(DataUri.META_DATA_LABEL);
			break;
		case Schemas.vscodeNotebookCell:
			path = void 0;
			break;
		default: path = resource.path;
	}
	if (!path) return [{
		id: "unknown",
		mime: Mimes.unknown
	}];
	path = path.toLowerCase();
	const filename = basename$1(path);
	const configuredLanguage = getAssociationByPath(path, filename, userRegisteredAssociations);
	if (configuredLanguage) return [configuredLanguage, {
		id: PLAINTEXT_LANGUAGE_ID,
		mime: Mimes.text
	}];
	const registeredLanguage = getAssociationByPath(path, filename, nonUserRegisteredAssociations);
	if (registeredLanguage) return [registeredLanguage, {
		id: PLAINTEXT_LANGUAGE_ID,
		mime: Mimes.text
	}];
	if (firstLine) {
		const firstlineLanguage = getAssociationByFirstline(firstLine);
		if (firstlineLanguage) return [firstlineLanguage, {
			id: PLAINTEXT_LANGUAGE_ID,
			mime: Mimes.text
		}];
	}
	return [{
		id: "unknown",
		mime: Mimes.unknown
	}];
}
function getAssociationByPath(path, filename, associations) {
	let filenameMatch = void 0;
	let patternMatch = void 0;
	let extensionMatch = void 0;
	for (let i = associations.length - 1; i >= 0; i--) {
		const association = associations[i];
		if (filename === association.filenameLowercase) {
			filenameMatch = association;
			break;
		}
		if (association.filepattern) {
			if (!patternMatch || association.filepattern.length > patternMatch.filepattern.length) {
				const target = association.filepatternOnPath ? path : filename;
				if (association.filepatternLowercase?.(target)) patternMatch = association;
			}
		}
		if (association.extension) {
			if (!extensionMatch || association.extension.length > extensionMatch.extension.length) {
				if (filename.endsWith(association.extensionLowercase)) extensionMatch = association;
			}
		}
	}
	if (filenameMatch) return filenameMatch;
	if (patternMatch) return patternMatch;
	if (extensionMatch) return extensionMatch;
}
function getAssociationByFirstline(firstLine) {
	if (startsWithUTF8BOM(firstLine)) firstLine = firstLine.substr(1);
	if (firstLine.length > 0) for (let i = registeredAssociations.length - 1; i >= 0; i--) {
		const association = registeredAssociations[i];
		if (!association.firstline) continue;
		const matches = firstLine.match(association.firstline);
		if (matches && matches.length > 0) return association;
	}
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/services/languagesRegistry.js
var hasOwnProperty = Object.prototype.hasOwnProperty;
var NULL_LANGUAGE_ID = "vs.editor.nullLanguage";
var LanguageIdCodec = class {
	constructor() {
		this._languageIdToLanguage = [];
		this._languageToLanguageId = /* @__PURE__ */ new Map();
		this._register(NULL_LANGUAGE_ID, 0);
		this._register(PLAINTEXT_LANGUAGE_ID, 1);
		this._nextLanguageId = 2;
	}
	_register(language, languageId) {
		this._languageIdToLanguage[languageId] = language;
		this._languageToLanguageId.set(language, languageId);
	}
	register(language) {
		if (this._languageToLanguageId.has(language)) return;
		const languageId = this._nextLanguageId++;
		this._register(language, languageId);
	}
	encodeLanguageId(languageId) {
		return this._languageToLanguageId.get(languageId) || 0;
	}
	decodeLanguageId(languageId) {
		return this._languageIdToLanguage[languageId] || NULL_LANGUAGE_ID;
	}
};
var LanguagesRegistry = class LanguagesRegistry extends Disposable {
	static {
		this.instanceCount = 0;
	}
	constructor(useModesRegistry = true, warnOnOverwrite = false) {
		super();
		this._onDidChange = this._register(new Emitter$1());
		this.onDidChange = this._onDidChange.event;
		LanguagesRegistry.instanceCount++;
		this._warnOnOverwrite = warnOnOverwrite;
		this.languageIdCodec = new LanguageIdCodec();
		this._dynamicLanguages = [];
		this._languages = {};
		this._mimeTypesMap = {};
		this._nameMap = {};
		this._lowercaseNameMap = {};
		if (useModesRegistry) {
			this._initializeFromRegistry();
			this._register(ModesRegistry.onDidChangeLanguages((m) => {
				this._initializeFromRegistry();
			}));
		}
	}
	dispose() {
		LanguagesRegistry.instanceCount--;
		super.dispose();
	}
	_initializeFromRegistry() {
		this._languages = {};
		this._mimeTypesMap = {};
		this._nameMap = {};
		this._lowercaseNameMap = {};
		clearPlatformLanguageAssociations();
		const desc = [].concat(ModesRegistry.getLanguages()).concat(this._dynamicLanguages);
		this._registerLanguages(desc);
	}
	_registerLanguages(desc) {
		for (const d of desc) this._registerLanguage(d);
		this._mimeTypesMap = {};
		this._nameMap = {};
		this._lowercaseNameMap = {};
		Object.keys(this._languages).forEach((langId) => {
			const language = this._languages[langId];
			if (language.name) this._nameMap[language.name] = language.identifier;
			language.aliases.forEach((alias) => {
				this._lowercaseNameMap[alias.toLowerCase()] = language.identifier;
			});
			language.mimetypes.forEach((mimetype) => {
				this._mimeTypesMap[mimetype] = language.identifier;
			});
		});
		Registry.as(Extensions.Configuration).registerOverrideIdentifiers(this.getRegisteredLanguageIds());
		this._onDidChange.fire();
	}
	_registerLanguage(lang) {
		const langId = lang.id;
		let resolvedLanguage;
		if (hasOwnProperty.call(this._languages, langId)) resolvedLanguage = this._languages[langId];
		else {
			this.languageIdCodec.register(langId);
			resolvedLanguage = {
				identifier: langId,
				name: null,
				mimetypes: [],
				aliases: [],
				extensions: [],
				filenames: [],
				configurationFiles: [],
				icons: []
			};
			this._languages[langId] = resolvedLanguage;
		}
		this._mergeLanguage(resolvedLanguage, lang);
	}
	_mergeLanguage(resolvedLanguage, lang) {
		const langId = lang.id;
		let primaryMime = null;
		if (Array.isArray(lang.mimetypes) && lang.mimetypes.length > 0) {
			resolvedLanguage.mimetypes.push(...lang.mimetypes);
			primaryMime = lang.mimetypes[0];
		}
		if (!primaryMime) {
			primaryMime = `text/x-${langId}`;
			resolvedLanguage.mimetypes.push(primaryMime);
		}
		if (Array.isArray(lang.extensions)) {
			if (lang.configuration) resolvedLanguage.extensions = lang.extensions.concat(resolvedLanguage.extensions);
			else resolvedLanguage.extensions = resolvedLanguage.extensions.concat(lang.extensions);
			for (const extension of lang.extensions) registerPlatformLanguageAssociation({
				id: langId,
				mime: primaryMime,
				extension
			}, this._warnOnOverwrite);
		}
		if (Array.isArray(lang.filenames)) for (const filename of lang.filenames) {
			registerPlatformLanguageAssociation({
				id: langId,
				mime: primaryMime,
				filename
			}, this._warnOnOverwrite);
			resolvedLanguage.filenames.push(filename);
		}
		if (Array.isArray(lang.filenamePatterns)) for (const filenamePattern of lang.filenamePatterns) registerPlatformLanguageAssociation({
			id: langId,
			mime: primaryMime,
			filepattern: filenamePattern
		}, this._warnOnOverwrite);
		if (typeof lang.firstLine === "string" && lang.firstLine.length > 0) {
			let firstLineRegexStr = lang.firstLine;
			if (firstLineRegexStr.charAt(0) !== "^") firstLineRegexStr = "^" + firstLineRegexStr;
			try {
				const firstLineRegex = new RegExp(firstLineRegexStr);
				if (!regExpLeadsToEndlessLoop(firstLineRegex)) registerPlatformLanguageAssociation({
					id: langId,
					mime: primaryMime,
					firstline: firstLineRegex
				}, this._warnOnOverwrite);
			} catch (err) {
				console.warn(`[${lang.id}]: Invalid regular expression \`${firstLineRegexStr}\`: `, err);
			}
		}
		resolvedLanguage.aliases.push(langId);
		let langAliases = null;
		if (typeof lang.aliases !== "undefined" && Array.isArray(lang.aliases)) if (lang.aliases.length === 0) langAliases = [null];
		else langAliases = lang.aliases;
		if (langAliases !== null) for (const langAlias of langAliases) {
			if (!langAlias || langAlias.length === 0) continue;
			resolvedLanguage.aliases.push(langAlias);
		}
		const containsAliases = langAliases !== null && langAliases.length > 0;
		if (containsAliases && langAliases[0] === null) {} else {
			const bestName = (containsAliases ? langAliases[0] : null) || langId;
			if (containsAliases || !resolvedLanguage.name) resolvedLanguage.name = bestName;
		}
		if (lang.configuration) resolvedLanguage.configurationFiles.push(lang.configuration);
		if (lang.icon) resolvedLanguage.icons.push(lang.icon);
	}
	isRegisteredLanguageId(languageId) {
		if (!languageId) return false;
		return hasOwnProperty.call(this._languages, languageId);
	}
	getRegisteredLanguageIds() {
		return Object.keys(this._languages);
	}
	getLanguageIdByLanguageName(languageName) {
		const languageNameLower = languageName.toLowerCase();
		if (!hasOwnProperty.call(this._lowercaseNameMap, languageNameLower)) return null;
		return this._lowercaseNameMap[languageNameLower];
	}
	getLanguageIdByMimeType(mimeType) {
		if (!mimeType) return null;
		if (hasOwnProperty.call(this._mimeTypesMap, mimeType)) return this._mimeTypesMap[mimeType];
		return null;
	}
	guessLanguageIdByFilepathOrFirstLine(resource, firstLine) {
		if (!resource && !firstLine) return [];
		return getLanguageIds(resource, firstLine);
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/services/languageService.js
var LanguageService = class LanguageService extends Disposable {
	static {
		this.instanceCount = 0;
	}
	constructor(warnOnOverwrite = false) {
		super();
		this._onDidRequestBasicLanguageFeatures = this._register(new Emitter$1());
		this.onDidRequestBasicLanguageFeatures = this._onDidRequestBasicLanguageFeatures.event;
		this._onDidRequestRichLanguageFeatures = this._register(new Emitter$1());
		this.onDidRequestRichLanguageFeatures = this._onDidRequestRichLanguageFeatures.event;
		this._onDidChange = this._register(new Emitter$1({ leakWarningThreshold: 200 }));
		this.onDidChange = this._onDidChange.event;
		this._requestedBasicLanguages = /* @__PURE__ */ new Set();
		this._requestedRichLanguages = /* @__PURE__ */ new Set();
		LanguageService.instanceCount++;
		this._registry = this._register(new LanguagesRegistry(true, warnOnOverwrite));
		this.languageIdCodec = this._registry.languageIdCodec;
		this._register(this._registry.onDidChange(() => this._onDidChange.fire()));
	}
	dispose() {
		LanguageService.instanceCount--;
		super.dispose();
	}
	isRegisteredLanguageId(languageId) {
		return this._registry.isRegisteredLanguageId(languageId);
	}
	getLanguageIdByLanguageName(languageName) {
		return this._registry.getLanguageIdByLanguageName(languageName);
	}
	getLanguageIdByMimeType(mimeType) {
		return this._registry.getLanguageIdByMimeType(mimeType);
	}
	guessLanguageIdByFilepathOrFirstLine(resource, firstLine) {
		const languageIds = this._registry.guessLanguageIdByFilepathOrFirstLine(resource, firstLine);
		return firstOrDefault(languageIds, null);
	}
	createById(languageId) {
		return new LanguageSelection(this.onDidChange, () => {
			return this._createAndGetLanguageIdentifier(languageId);
		});
	}
	createByFilepathOrFirstLine(resource, firstLine) {
		return new LanguageSelection(this.onDidChange, () => {
			const languageId = this.guessLanguageIdByFilepathOrFirstLine(resource, firstLine);
			return this._createAndGetLanguageIdentifier(languageId);
		});
	}
	_createAndGetLanguageIdentifier(languageId) {
		if (!languageId || !this.isRegisteredLanguageId(languageId)) languageId = PLAINTEXT_LANGUAGE_ID;
		return languageId;
	}
	requestBasicLanguageFeatures(languageId) {
		if (!this._requestedBasicLanguages.has(languageId)) {
			this._requestedBasicLanguages.add(languageId);
			this._onDidRequestBasicLanguageFeatures.fire(languageId);
		}
	}
	requestRichLanguageFeatures(languageId) {
		if (!this._requestedRichLanguages.has(languageId)) {
			this._requestedRichLanguages.add(languageId);
			this.requestBasicLanguageFeatures(languageId);
			TokenizationRegistry.getOrCreate(languageId);
			this._onDidRequestRichLanguageFeatures.fire(languageId);
		}
	}
};
var LanguageSelection = class {
	constructor(onDidChangeLanguages, selector) {
		this._value = observableFromEvent(this, onDidChangeLanguages, () => selector());
		this.onDidChange = Event.fromObservable(this._value);
	}
	get languageId() {
		return this._value.get();
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/base/browser/ui/menu/menu.js
const MENU_MNEMONIC_REGEX = /\(&([^\s&])\)|(^|[^&])&([^\s&])/;
const MENU_ESCAPED_MNEMONIC_REGEX = /(&amp;)?(&amp;)([^\s&])/g;
var HorizontalDirection;
(function(HorizontalDirection$1) {
	HorizontalDirection$1[HorizontalDirection$1["Right"] = 0] = "Right";
	HorizontalDirection$1[HorizontalDirection$1["Left"] = 1] = "Left";
})(HorizontalDirection || (HorizontalDirection = {}));
var VerticalDirection;
(function(VerticalDirection$1) {
	VerticalDirection$1[VerticalDirection$1["Above"] = 0] = "Above";
	VerticalDirection$1[VerticalDirection$1["Below"] = 1] = "Below";
})(VerticalDirection || (VerticalDirection = {}));
var Menu = class Menu extends ActionBar {
	constructor(container, actions, options, menuStyles) {
		container.classList.add("monaco-menu-container");
		container.setAttribute("role", "presentation");
		const menuElement = document.createElement("div");
		menuElement.classList.add("monaco-menu");
		menuElement.setAttribute("role", "presentation");
		super(menuElement, {
			orientation: 1,
			actionViewItemProvider: (action) => this.doGetActionViewItem(action, options, parentData),
			context: options.context,
			actionRunner: options.actionRunner,
			ariaLabel: options.ariaLabel,
			ariaRole: "menu",
			focusOnlyEnabledItems: true,
			triggerKeys: {
				keys: [3, ...isMacintosh || isLinux ? [10] : []],
				keyDown: true
			}
		});
		this.menuStyles = menuStyles;
		this.menuElement = menuElement;
		this.actionsList.tabIndex = 0;
		this.initializeOrUpdateStyleSheet(container, menuStyles);
		this._register(Gesture.addTarget(menuElement));
		this._register(addDisposableListener(menuElement, EventType$1.KEY_DOWN, (e) => {
			if (new StandardKeyboardEvent(e).equals(2)) e.preventDefault();
		}));
		if (options.enableMnemonics) this._register(addDisposableListener(menuElement, EventType$1.KEY_DOWN, (e) => {
			const key = e.key.toLocaleLowerCase();
			if (this.mnemonics.has(key)) {
				EventHelper.stop(e, true);
				const actions$1 = this.mnemonics.get(key);
				if (actions$1.length === 1) {
					if (actions$1[0] instanceof SubmenuMenuActionViewItem && actions$1[0].container) this.focusItemByElement(actions$1[0].container);
					actions$1[0].onClick(e);
				}
				if (actions$1.length > 1) {
					const action = actions$1.shift();
					if (action && action.container) {
						this.focusItemByElement(action.container);
						actions$1.push(action);
					}
					this.mnemonics.set(key, actions$1);
				}
			}
		}));
		if (isLinux) this._register(addDisposableListener(menuElement, EventType$1.KEY_DOWN, (e) => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(14) || event.equals(11)) {
				this.focusedItem = this.viewItems.length - 1;
				this.focusNext();
				EventHelper.stop(e, true);
			} else if (event.equals(13) || event.equals(12)) {
				this.focusedItem = 0;
				this.focusPrevious();
				EventHelper.stop(e, true);
			}
		}));
		this._register(addDisposableListener(this.domNode, EventType$1.MOUSE_OUT, (e) => {
			const relatedTarget = e.relatedTarget;
			if (!isAncestor(relatedTarget, this.domNode)) {
				this.focusedItem = void 0;
				this.updateFocus();
				e.stopPropagation();
			}
		}));
		this._register(addDisposableListener(this.actionsList, EventType$1.MOUSE_OVER, (e) => {
			let target = e.target;
			if (!target || !isAncestor(target, this.actionsList) || target === this.actionsList) return;
			while (target.parentElement !== this.actionsList && target.parentElement !== null) target = target.parentElement;
			if (target.classList.contains("action-item")) {
				const lastFocusedItem = this.focusedItem;
				this.setFocusedItem(target);
				if (lastFocusedItem !== this.focusedItem) this.updateFocus();
			}
		}));
		this._register(Gesture.addTarget(this.actionsList));
		this._register(addDisposableListener(this.actionsList, EventType.Tap, (e) => {
			let target = e.initialTarget;
			if (!target || !isAncestor(target, this.actionsList) || target === this.actionsList) return;
			while (target.parentElement !== this.actionsList && target.parentElement !== null) target = target.parentElement;
			if (target.classList.contains("action-item")) {
				const lastFocusedItem = this.focusedItem;
				this.setFocusedItem(target);
				if (lastFocusedItem !== this.focusedItem) this.updateFocus();
			}
		}));
		const parentData = { parent: this };
		this.mnemonics = /* @__PURE__ */ new Map();
		this.scrollableElement = this._register(new DomScrollableElement(menuElement, {
			alwaysConsumeMouseWheel: true,
			horizontal: 2,
			vertical: 3,
			verticalScrollbarSize: 7,
			handleMouseWheel: true,
			useShadows: true
		}));
		const scrollElement = this.scrollableElement.getDomNode();
		scrollElement.style.position = "";
		this.styleScrollElement(scrollElement, menuStyles);
		this._register(addDisposableListener(menuElement, EventType.Change, (e) => {
			EventHelper.stop(e, true);
			const scrollTop = this.scrollableElement.getScrollPosition().scrollTop;
			this.scrollableElement.setScrollPosition({ scrollTop: scrollTop - e.translationY });
		}));
		this._register(addDisposableListener(scrollElement, EventType$1.MOUSE_UP, (e) => {
			e.preventDefault();
		}));
		const window = getWindow(container);
		menuElement.style.maxHeight = `${Math.max(10, window.innerHeight - container.getBoundingClientRect().top - 35)}px`;
		actions = actions.filter((a, idx) => {
			if (options.submenuIds?.has(a.id)) {
				console.warn(`Found submenu cycle: ${a.id}`);
				return false;
			}
			if (a instanceof Separator) {
				if (idx === actions.length - 1 || idx === 0) return false;
				if (actions[idx - 1] instanceof Separator) return false;
			}
			return true;
		});
		this.push(actions, {
			icon: true,
			label: true,
			isMenu: true
		});
		container.appendChild(this.scrollableElement.getDomNode());
		this.scrollableElement.scanDomNode();
		this.viewItems.filter((item) => !(item instanceof MenuSeparatorActionViewItem)).forEach((item, index, array) => {
			item.updatePositionInSet(index + 1, array.length);
		});
	}
	initializeOrUpdateStyleSheet(container, style) {
		if (!this.styleSheet) if (isInShadowDOM(container)) this.styleSheet = createStyleSheet(container);
		else {
			if (!Menu.globalStyleSheet) Menu.globalStyleSheet = createStyleSheet();
			this.styleSheet = Menu.globalStyleSheet;
		}
		this.styleSheet.textContent = getMenuWidgetCSS(style, isInShadowDOM(container));
	}
	styleScrollElement(scrollElement, style) {
		const fgColor = style.foregroundColor ?? "";
		const bgColor = style.backgroundColor ?? "";
		const border = style.borderColor ? `1px solid ${style.borderColor}` : "";
		const borderRadius = "5px";
		const shadow = style.shadowColor ? `0 2px 8px ${style.shadowColor}` : "";
		scrollElement.style.outline = border;
		scrollElement.style.borderRadius = borderRadius;
		scrollElement.style.color = fgColor;
		scrollElement.style.backgroundColor = bgColor;
		scrollElement.style.boxShadow = shadow;
	}
	getContainer() {
		return this.scrollableElement.getDomNode();
	}
	get onScroll() {
		return this.scrollableElement.onScroll;
	}
	focusItemByElement(element) {
		const lastFocusedItem = this.focusedItem;
		this.setFocusedItem(element);
		if (lastFocusedItem !== this.focusedItem) this.updateFocus();
	}
	setFocusedItem(element) {
		for (let i = 0; i < this.actionsList.children.length; i++) {
			const elem = this.actionsList.children[i];
			if (element === elem) {
				this.focusedItem = i;
				break;
			}
		}
	}
	updateFocus(fromRight) {
		super.updateFocus(fromRight, true, true);
		if (typeof this.focusedItem !== "undefined") this.scrollableElement.setScrollPosition({ scrollTop: Math.round(this.menuElement.scrollTop) });
	}
	doGetActionViewItem(action, options, parentData) {
		if (action instanceof Separator) return new MenuSeparatorActionViewItem(options.context, action, { icon: true }, this.menuStyles);
		else if (action instanceof SubmenuAction) {
			const menuActionViewItem = new SubmenuMenuActionViewItem(action, action.actions, parentData, {
				...options,
				submenuIds: new Set([...options.submenuIds || [], action.id])
			}, this.menuStyles);
			if (options.enableMnemonics) {
				const mnemonic = menuActionViewItem.getMnemonic();
				if (mnemonic && menuActionViewItem.isEnabled()) {
					let actionViewItems = [];
					if (this.mnemonics.has(mnemonic)) actionViewItems = this.mnemonics.get(mnemonic);
					actionViewItems.push(menuActionViewItem);
					this.mnemonics.set(mnemonic, actionViewItems);
				}
			}
			return menuActionViewItem;
		} else {
			const menuItemOptions = {
				enableMnemonics: options.enableMnemonics,
				useEventAsContext: options.useEventAsContext
			};
			if (options.getKeyBinding) {
				const keybinding = options.getKeyBinding(action);
				if (keybinding) {
					const keybindingLabel = keybinding.getLabel();
					if (keybindingLabel) menuItemOptions.keybinding = keybindingLabel;
				}
			}
			const menuActionViewItem = new BaseMenuActionViewItem(options.context, action, menuItemOptions, this.menuStyles);
			if (options.enableMnemonics) {
				const mnemonic = menuActionViewItem.getMnemonic();
				if (mnemonic && menuActionViewItem.isEnabled()) {
					let actionViewItems = [];
					if (this.mnemonics.has(mnemonic)) actionViewItems = this.mnemonics.get(mnemonic);
					actionViewItems.push(menuActionViewItem);
					this.mnemonics.set(mnemonic, actionViewItems);
				}
			}
			return menuActionViewItem;
		}
	}
};
var BaseMenuActionViewItem = class extends BaseActionViewItem {
	constructor(ctx, action, options, menuStyle) {
		options.isMenu = true;
		super(action, action, options);
		this.menuStyle = menuStyle;
		this.options = options;
		this.options.icon = options.icon !== void 0 ? options.icon : false;
		this.options.label = options.label !== void 0 ? options.label : true;
		this.cssClass = "";
		if (this.options.label && options.enableMnemonics) {
			const label = this.action.label;
			if (label) {
				const matches = MENU_MNEMONIC_REGEX.exec(label);
				if (matches) this.mnemonic = (!!matches[1] ? matches[1] : matches[3]).toLocaleLowerCase();
			}
		}
		this.runOnceToEnableMouseUp = new RunOnceScheduler(() => {
			if (!this.element) return;
			this._register(addDisposableListener(this.element, EventType$1.MOUSE_UP, (e) => {
				EventHelper.stop(e, true);
				if (isFirefox) {
					if (new StandardMouseEvent(getWindow(this.element), e).rightButton) return;
					this.onClick(e);
				} else setTimeout(() => {
					this.onClick(e);
				}, 0);
			}));
			this._register(addDisposableListener(this.element, EventType$1.CONTEXT_MENU, (e) => {
				EventHelper.stop(e, true);
			}));
		}, 100);
		this._register(this.runOnceToEnableMouseUp);
	}
	render(container) {
		super.render(container);
		if (!this.element) return;
		this.container = container;
		this.item = append(this.element, $("a.action-menu-item"));
		if (this._action.id === Separator.ID) this.item.setAttribute("role", "presentation");
		else {
			this.item.setAttribute("role", "menuitem");
			if (this.mnemonic) this.item.setAttribute("aria-keyshortcuts", `${this.mnemonic}`);
		}
		this.check = append(this.item, $("span.menu-item-check" + ThemeIcon.asCSSSelector(Codicon.menuSelection)));
		this.check.setAttribute("role", "none");
		this.label = append(this.item, $("span.action-label"));
		if (this.options.label && this.options.keybinding) append(this.item, $("span.keybinding")).textContent = this.options.keybinding;
		this.runOnceToEnableMouseUp.schedule();
		this.updateClass();
		this.updateLabel();
		this.updateTooltip();
		this.updateEnabled();
		this.updateChecked();
		this.applyStyle();
	}
	blur() {
		super.blur();
		this.applyStyle();
	}
	focus() {
		super.focus();
		this.item?.focus();
		this.applyStyle();
	}
	updatePositionInSet(pos, setSize) {
		if (this.item) {
			this.item.setAttribute("aria-posinset", `${pos}`);
			this.item.setAttribute("aria-setsize", `${setSize}`);
		}
	}
	updateLabel() {
		if (!this.label) return;
		if (this.options.label) {
			clearNode(this.label);
			let label = stripIcons(this.action.label);
			if (label) {
				const cleanLabel = cleanMnemonic(label);
				if (!this.options.enableMnemonics) label = cleanLabel;
				this.label.setAttribute("aria-label", cleanLabel.replace(/&&/g, "&"));
				const matches = MENU_MNEMONIC_REGEX.exec(label);
				if (matches) {
					label = escape(label);
					MENU_ESCAPED_MNEMONIC_REGEX.lastIndex = 0;
					let escMatch = MENU_ESCAPED_MNEMONIC_REGEX.exec(label);
					while (escMatch && escMatch[1]) escMatch = MENU_ESCAPED_MNEMONIC_REGEX.exec(label);
					const replaceDoubleEscapes = (str) => str.replace(/&amp;&amp;/g, "&amp;");
					if (escMatch) this.label.append(ltrim(replaceDoubleEscapes(label.substr(0, escMatch.index)), " "), $("u", { "aria-hidden": "true" }, escMatch[3]), rtrim(replaceDoubleEscapes(label.substr(escMatch.index + escMatch[0].length)), " "));
					else this.label.innerText = replaceDoubleEscapes(label).trim();
					this.item?.setAttribute("aria-keyshortcuts", (!!matches[1] ? matches[1] : matches[3]).toLocaleLowerCase());
				} else this.label.innerText = label.replace(/&&/g, "&").trim();
			}
		}
	}
	updateTooltip() {}
	updateClass() {
		if (this.cssClass && this.item) this.item.classList.remove(...this.cssClass.split(" "));
		if (this.options.icon && this.label) {
			this.cssClass = this.action.class || "";
			this.label.classList.add("icon");
			if (this.cssClass) this.label.classList.add(...this.cssClass.split(" "));
			this.updateEnabled();
		} else if (this.label) this.label.classList.remove("icon");
	}
	updateEnabled() {
		if (this.action.enabled) {
			if (this.element) {
				this.element.classList.remove("disabled");
				this.element.removeAttribute("aria-disabled");
			}
			if (this.item) {
				this.item.classList.remove("disabled");
				this.item.removeAttribute("aria-disabled");
				this.item.tabIndex = 0;
			}
		} else {
			if (this.element) {
				this.element.classList.add("disabled");
				this.element.setAttribute("aria-disabled", "true");
			}
			if (this.item) {
				this.item.classList.add("disabled");
				this.item.setAttribute("aria-disabled", "true");
			}
		}
	}
	updateChecked() {
		if (!this.item) return;
		const checked = this.action.checked;
		this.item.classList.toggle("checked", !!checked);
		if (checked !== void 0) {
			this.item.setAttribute("role", "menuitemcheckbox");
			this.item.setAttribute("aria-checked", checked ? "true" : "false");
		} else {
			this.item.setAttribute("role", "menuitem");
			this.item.setAttribute("aria-checked", "");
		}
	}
	getMnemonic() {
		return this.mnemonic;
	}
	applyStyle() {
		const isSelected = this.element && this.element.classList.contains("focused");
		const fgColor = isSelected && this.menuStyle.selectionForegroundColor ? this.menuStyle.selectionForegroundColor : this.menuStyle.foregroundColor;
		const bgColor = isSelected && this.menuStyle.selectionBackgroundColor ? this.menuStyle.selectionBackgroundColor : void 0;
		const outline = isSelected && this.menuStyle.selectionBorderColor ? `1px solid ${this.menuStyle.selectionBorderColor}` : "";
		const outlineOffset = isSelected && this.menuStyle.selectionBorderColor ? `-1px` : "";
		if (this.item) {
			this.item.style.color = fgColor ?? "";
			this.item.style.backgroundColor = bgColor ?? "";
			this.item.style.outline = outline;
			this.item.style.outlineOffset = outlineOffset;
		}
		if (this.check) this.check.style.color = fgColor ?? "";
	}
};
var SubmenuMenuActionViewItem = class extends BaseMenuActionViewItem {
	constructor(action, submenuActions, parentData, submenuOptions, menuStyles) {
		super(action, action, submenuOptions, menuStyles);
		this.submenuActions = submenuActions;
		this.parentData = parentData;
		this.submenuOptions = submenuOptions;
		this.mysubmenu = null;
		this.submenuDisposables = this._register(new DisposableStore());
		this.mouseOver = false;
		this.expandDirection = submenuOptions && submenuOptions.expandDirection !== void 0 ? submenuOptions.expandDirection : {
			horizontal: HorizontalDirection.Right,
			vertical: VerticalDirection.Below
		};
		this.showScheduler = new RunOnceScheduler(() => {
			if (this.mouseOver) {
				this.cleanupExistingSubmenu(false);
				this.createSubmenu(false);
			}
		}, 250);
		this.hideScheduler = new RunOnceScheduler(() => {
			if (this.element && !isAncestor(getActiveElement(), this.element) && this.parentData.submenu === this.mysubmenu) {
				this.parentData.parent.focus(false);
				this.cleanupExistingSubmenu(true);
			}
		}, 750);
	}
	render(container) {
		super.render(container);
		if (!this.element) return;
		if (this.item) {
			this.item.classList.add("monaco-submenu-item");
			this.item.tabIndex = 0;
			this.item.setAttribute("aria-haspopup", "true");
			this.updateAriaExpanded("false");
			this.submenuIndicator = append(this.item, $("span.submenu-indicator" + ThemeIcon.asCSSSelector(Codicon.menuSubmenu)));
			this.submenuIndicator.setAttribute("aria-hidden", "true");
		}
		this._register(addDisposableListener(this.element, EventType$1.KEY_UP, (e) => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(17) || event.equals(3)) {
				EventHelper.stop(e, true);
				this.createSubmenu(true);
			}
		}));
		this._register(addDisposableListener(this.element, EventType$1.KEY_DOWN, (e) => {
			const event = new StandardKeyboardEvent(e);
			if (getActiveElement() === this.item) {
				if (event.equals(17) || event.equals(3)) EventHelper.stop(e, true);
			}
		}));
		this._register(addDisposableListener(this.element, EventType$1.MOUSE_OVER, (e) => {
			if (!this.mouseOver) {
				this.mouseOver = true;
				this.showScheduler.schedule();
			}
		}));
		this._register(addDisposableListener(this.element, EventType$1.MOUSE_LEAVE, (e) => {
			this.mouseOver = false;
		}));
		this._register(addDisposableListener(this.element, EventType$1.FOCUS_OUT, (e) => {
			if (this.element && !isAncestor(getActiveElement(), this.element)) this.hideScheduler.schedule();
		}));
		this._register(this.parentData.parent.onScroll(() => {
			if (this.parentData.submenu === this.mysubmenu) {
				this.parentData.parent.focus(false);
				this.cleanupExistingSubmenu(true);
			}
		}));
	}
	updateEnabled() {}
	onClick(e) {
		EventHelper.stop(e, true);
		this.cleanupExistingSubmenu(false);
		this.createSubmenu(true);
	}
	cleanupExistingSubmenu(force) {
		if (this.parentData.submenu && (force || this.parentData.submenu !== this.mysubmenu)) {
			try {
				this.parentData.submenu.dispose();
			} catch {}
			this.parentData.submenu = void 0;
			this.updateAriaExpanded("false");
			if (this.submenuContainer) {
				this.submenuDisposables.clear();
				this.submenuContainer = void 0;
			}
		}
	}
	calculateSubmenuMenuLayout(windowDimensions, submenu, entry, expandDirection) {
		const ret = {
			top: 0,
			left: 0
		};
		ret.left = layout(windowDimensions.width, submenu.width, {
			position: expandDirection.horizontal === HorizontalDirection.Right ? 0 : 1,
			offset: entry.left,
			size: entry.width
		});
		if (ret.left >= entry.left && ret.left < entry.left + entry.width) {
			if (entry.left + 10 + submenu.width <= windowDimensions.width) ret.left = entry.left + 10;
			entry.top += 10;
			entry.height = 0;
		}
		ret.top = layout(windowDimensions.height, submenu.height, {
			position: 0,
			offset: entry.top,
			size: 0
		});
		if (ret.top + submenu.height === entry.top && ret.top + entry.height + submenu.height <= windowDimensions.height) ret.top += entry.height;
		return ret;
	}
	createSubmenu(selectFirstItem = true) {
		if (!this.element) return;
		if (!this.parentData.submenu) {
			this.updateAriaExpanded("true");
			this.submenuContainer = append(this.element, $("div.monaco-submenu"));
			this.submenuContainer.classList.add("menubar-menu-items-holder", "context-view");
			const computedStyles = getWindow(this.parentData.parent.domNode).getComputedStyle(this.parentData.parent.domNode);
			const paddingTop = parseFloat(computedStyles.paddingTop || "0") || 0;
			this.submenuContainer.style.zIndex = "1";
			this.submenuContainer.style.position = "fixed";
			this.submenuContainer.style.top = "0";
			this.submenuContainer.style.left = "0";
			this.parentData.submenu = new Menu(this.submenuContainer, this.submenuActions.length ? this.submenuActions : [new EmptySubmenuAction()], this.submenuOptions, this.menuStyle);
			const entryBox = this.element.getBoundingClientRect();
			const entryBoxUpdated = {
				top: entryBox.top - paddingTop,
				left: entryBox.left,
				height: entryBox.height + 2 * paddingTop,
				width: entryBox.width
			};
			const viewBox = this.submenuContainer.getBoundingClientRect();
			const window = getWindow(this.element);
			const { top, left } = this.calculateSubmenuMenuLayout(new Dimension(window.innerWidth, window.innerHeight), Dimension.lift(viewBox), entryBoxUpdated, this.expandDirection);
			this.submenuContainer.style.left = `${left - viewBox.left}px`;
			this.submenuContainer.style.top = `${top - viewBox.top}px`;
			this.submenuDisposables.add(addDisposableListener(this.submenuContainer, EventType$1.KEY_UP, (e) => {
				if (new StandardKeyboardEvent(e).equals(15)) {
					EventHelper.stop(e, true);
					this.parentData.parent.focus();
					this.cleanupExistingSubmenu(true);
				}
			}));
			this.submenuDisposables.add(addDisposableListener(this.submenuContainer, EventType$1.KEY_DOWN, (e) => {
				if (new StandardKeyboardEvent(e).equals(15)) EventHelper.stop(e, true);
			}));
			this.submenuDisposables.add(this.parentData.submenu.onDidCancel(() => {
				this.parentData.parent.focus();
				this.cleanupExistingSubmenu(true);
			}));
			this.parentData.submenu.focus(selectFirstItem);
			this.mysubmenu = this.parentData.submenu;
		} else this.parentData.submenu.focus(false);
	}
	updateAriaExpanded(value) {
		if (this.item) this.item?.setAttribute("aria-expanded", value);
	}
	applyStyle() {
		super.applyStyle();
		const fgColor = this.element && this.element.classList.contains("focused") && this.menuStyle.selectionForegroundColor ? this.menuStyle.selectionForegroundColor : this.menuStyle.foregroundColor;
		if (this.submenuIndicator) this.submenuIndicator.style.color = fgColor ?? "";
	}
	dispose() {
		super.dispose();
		this.hideScheduler.dispose();
		if (this.mysubmenu) {
			this.mysubmenu.dispose();
			this.mysubmenu = null;
		}
		if (this.submenuContainer) this.submenuContainer = void 0;
	}
};
var MenuSeparatorActionViewItem = class extends ActionViewItem {
	constructor(context, action, options, menuStyles) {
		super(context, action, options);
		this.menuStyles = menuStyles;
	}
	render(container) {
		super.render(container);
		if (this.label) this.label.style.borderBottomColor = this.menuStyles.separatorColor ? `${this.menuStyles.separatorColor}` : "";
	}
};
function cleanMnemonic(label) {
	const regex = MENU_MNEMONIC_REGEX;
	const matches = regex.exec(label);
	if (!matches) return label;
	const mnemonicInText = !matches[1];
	return label.replace(regex, mnemonicInText ? "$2$3" : "").trim();
}
function formatRule(c) {
	const fontCharacter = getCodiconFontCharacters()[c.id];
	return `.codicon-${c.id}:before { content: '\\${fontCharacter.toString(16)}'; }`;
}
function getMenuWidgetCSS(style, isForShadowDom) {
	let result = `
.monaco-menu {
	font-size: 13px;
	border-radius: 5px;
	min-width: 160px;
}

${formatRule(Codicon.menuSelection)}
${formatRule(Codicon.menuSubmenu)}

.monaco-menu .monaco-action-bar {
	text-align: right;
	overflow: hidden;
	white-space: nowrap;
}

.monaco-menu .monaco-action-bar .actions-container {
	display: flex;
	margin: 0 auto;
	padding: 0;
	width: 100%;
	justify-content: flex-end;
}

.monaco-menu .monaco-action-bar.vertical .actions-container {
	display: inline-block;
}

.monaco-menu .monaco-action-bar.reverse .actions-container {
	flex-direction: row-reverse;
}

.monaco-menu .monaco-action-bar .action-item {
	cursor: pointer;
	display: inline-block;
	transition: transform 50ms ease;
	position: relative;  /* DO NOT REMOVE - this is the key to preventing the ghosting icon bug in Chrome 42 */
}

.monaco-menu .monaco-action-bar .action-item.disabled {
	cursor: default;
}

.monaco-menu .monaco-action-bar .action-item .icon,
.monaco-menu .monaco-action-bar .action-item .codicon {
	display: inline-block;
}

.monaco-menu .monaco-action-bar .action-item .codicon {
	display: flex;
	align-items: center;
}

.monaco-menu .monaco-action-bar .action-label {
	font-size: 11px;
	margin-right: 4px;
}

.monaco-menu .monaco-action-bar .action-item.disabled .action-label,
.monaco-menu .monaco-action-bar .action-item.disabled .action-label:hover {
	color: var(--vscode-disabledForeground);
}

/* Vertical actions */

.monaco-menu .monaco-action-bar.vertical {
	text-align: left;
}

.monaco-menu .monaco-action-bar.vertical .action-item {
	display: block;
}

.monaco-menu .monaco-action-bar.vertical .action-label.separator {
	display: block;
	border-bottom: 1px solid var(--vscode-menu-separatorBackground);
	padding-top: 1px;
	padding: 30px;
}

.monaco-menu .secondary-actions .monaco-action-bar .action-label {
	margin-left: 6px;
}

/* Action Items */
.monaco-menu .monaco-action-bar .action-item.select-container {
	overflow: hidden; /* somehow the dropdown overflows its container, we prevent it here to not push */
	flex: 1;
	max-width: 170px;
	min-width: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
}

.monaco-menu .monaco-action-bar.vertical {
	margin-left: 0;
	overflow: visible;
}

.monaco-menu .monaco-action-bar.vertical .actions-container {
	display: block;
}

.monaco-menu .monaco-action-bar.vertical .action-item {
	padding: 0;
	transform: none;
	display: flex;
}

.monaco-menu .monaco-action-bar.vertical .action-item.active {
	transform: none;
}

.monaco-menu .monaco-action-bar.vertical .action-menu-item {
	flex: 1 1 auto;
	display: flex;
	height: 2em;
	align-items: center;
	position: relative;
	margin: 0 4px;
	border-radius: 4px;
}

.monaco-menu .monaco-action-bar.vertical .action-menu-item:hover .keybinding,
.monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .keybinding {
	opacity: unset;
}

.monaco-menu .monaco-action-bar.vertical .action-label {
	flex: 1 1 auto;
	text-decoration: none;
	padding: 0 1em;
	background: none;
	font-size: 12px;
	line-height: 1;
}

.monaco-menu .monaco-action-bar.vertical .keybinding,
.monaco-menu .monaco-action-bar.vertical .submenu-indicator {
	display: inline-block;
	flex: 2 1 auto;
	padding: 0 1em;
	text-align: right;
	font-size: 12px;
	line-height: 1;
}

.monaco-menu .monaco-action-bar.vertical .submenu-indicator {
	height: 100%;
}

.monaco-menu .monaco-action-bar.vertical .submenu-indicator.codicon {
	font-size: 16px !important;
	display: flex;
	align-items: center;
}

.monaco-menu .monaco-action-bar.vertical .submenu-indicator.codicon::before {
	margin-left: auto;
	margin-right: -20px;
}

.monaco-menu .monaco-action-bar.vertical .action-item.disabled .keybinding,
.monaco-menu .monaco-action-bar.vertical .action-item.disabled .submenu-indicator {
	opacity: 0.4;
}

.monaco-menu .monaco-action-bar.vertical .action-label:not(.separator) {
	display: inline-block;
	box-sizing: border-box;
	margin: 0;
}

.monaco-menu .monaco-action-bar.vertical .action-item {
	position: static;
	overflow: visible;
}

.monaco-menu .monaco-action-bar.vertical .action-item .monaco-submenu {
	position: absolute;
}

.monaco-menu .monaco-action-bar.vertical .action-label.separator {
	width: 100%;
	height: 0px !important;
	opacity: 1;
}

.monaco-menu .monaco-action-bar.vertical .action-label.separator.text {
	padding: 0.7em 1em 0.1em 1em;
	font-weight: bold;
	opacity: 1;
}

.monaco-menu .monaco-action-bar.vertical .action-label:hover {
	color: inherit;
}

.monaco-menu .monaco-action-bar.vertical .menu-item-check {
	position: absolute;
	visibility: hidden;
	width: 1em;
	height: 100%;
}

.monaco-menu .monaco-action-bar.vertical .action-menu-item.checked .menu-item-check {
	visibility: visible;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* Context Menu */

.context-view.monaco-menu-container {
	outline: 0;
	border: none;
	animation: fadeIn 0.083s linear;
	-webkit-app-region: no-drag;
}

.context-view.monaco-menu-container :focus,
.context-view.monaco-menu-container .monaco-action-bar.vertical:focus,
.context-view.monaco-menu-container .monaco-action-bar.vertical :focus {
	outline: 0;
}

.hc-black .context-view.monaco-menu-container,
.hc-light .context-view.monaco-menu-container,
:host-context(.hc-black) .context-view.monaco-menu-container,
:host-context(.hc-light) .context-view.monaco-menu-container {
	box-shadow: none;
}

.hc-black .monaco-menu .monaco-action-bar.vertical .action-item.focused,
.hc-light .monaco-menu .monaco-action-bar.vertical .action-item.focused,
:host-context(.hc-black) .monaco-menu .monaco-action-bar.vertical .action-item.focused,
:host-context(.hc-light) .monaco-menu .monaco-action-bar.vertical .action-item.focused {
	background: none;
}

/* Vertical Action Bar Styles */

.monaco-menu .monaco-action-bar.vertical {
	padding: 4px 0;
}

.monaco-menu .monaco-action-bar.vertical .action-menu-item {
	height: 2em;
}

.monaco-menu .monaco-action-bar.vertical .action-label:not(.separator),
.monaco-menu .monaco-action-bar.vertical .keybinding {
	font-size: inherit;
	padding: 0 2em;
	max-height: 100%;
}

.monaco-menu .monaco-action-bar.vertical .menu-item-check {
	font-size: inherit;
	width: 2em;
}

.monaco-menu .monaco-action-bar.vertical .action-label.separator {
	font-size: inherit;
	margin: 5px 0 !important;
	padding: 0;
	border-radius: 0;
}

.linux .monaco-menu .monaco-action-bar.vertical .action-label.separator,
:host-context(.linux) .monaco-menu .monaco-action-bar.vertical .action-label.separator {
	margin-left: 0;
	margin-right: 0;
}

.monaco-menu .monaco-action-bar.vertical .submenu-indicator {
	font-size: 60%;
	padding: 0 1.8em;
}

.linux .monaco-menu .monaco-action-bar.vertical .submenu-indicator,
:host-context(.linux) .monaco-menu .monaco-action-bar.vertical .submenu-indicator {
	height: 100%;
	mask-size: 10px 10px;
	-webkit-mask-size: 10px 10px;
}

.monaco-menu .action-item {
	cursor: default;
}`;
	if (isForShadowDom) {
		result += `
			/* Arrows */
			.monaco-scrollable-element > .scrollbar > .scra {
				cursor: pointer;
				font-size: 11px !important;
			}

			.monaco-scrollable-element > .visible {
				opacity: 1;

				/* Background rule added for IE9 - to allow clicks on dom node */
				background:rgba(0,0,0,0);

				transition: opacity 100ms linear;
			}
			.monaco-scrollable-element > .invisible {
				opacity: 0;
				pointer-events: none;
			}
			.monaco-scrollable-element > .invisible.fade {
				transition: opacity 800ms linear;
			}

			/* Scrollable Content Inset Shadow */
			.monaco-scrollable-element > .shadow {
				position: absolute;
				display: none;
			}
			.monaco-scrollable-element > .shadow.top {
				display: block;
				top: 0;
				left: 3px;
				height: 3px;
				width: 100%;
			}
			.monaco-scrollable-element > .shadow.left {
				display: block;
				top: 3px;
				left: 0;
				height: 100%;
				width: 3px;
			}
			.monaco-scrollable-element > .shadow.top-left-corner {
				display: block;
				top: 0;
				left: 0;
				height: 3px;
				width: 3px;
			}
		`;
		const scrollbarShadowColor = style.scrollbarShadow;
		if (scrollbarShadowColor) result += `
				.monaco-scrollable-element > .shadow.top {
					box-shadow: ${scrollbarShadowColor} 0 6px 6px -6px inset;
				}

				.monaco-scrollable-element > .shadow.left {
					box-shadow: ${scrollbarShadowColor} 6px 0 6px -6px inset;
				}

				.monaco-scrollable-element > .shadow.top.left {
					box-shadow: ${scrollbarShadowColor} 6px 6px 6px -6px inset;
				}
			`;
		const scrollbarSliderBackgroundColor = style.scrollbarSliderBackground;
		if (scrollbarSliderBackgroundColor) result += `
				.monaco-scrollable-element > .scrollbar > .slider {
					background: ${scrollbarSliderBackgroundColor};
				}
			`;
		const scrollbarSliderHoverBackgroundColor = style.scrollbarSliderHoverBackground;
		if (scrollbarSliderHoverBackgroundColor) result += `
				.monaco-scrollable-element > .scrollbar > .slider:hover {
					background: ${scrollbarSliderHoverBackgroundColor};
				}
			`;
		const scrollbarSliderActiveBackgroundColor = style.scrollbarSliderActiveBackground;
		if (scrollbarSliderActiveBackgroundColor) result += `
				.monaco-scrollable-element > .scrollbar > .slider.active {
					background: ${scrollbarSliderActiveBackgroundColor};
				}
			`;
	}
	return result;
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextMenuHandler.js
var ContextMenuHandler = class {
	constructor(contextViewService, telemetryService, notificationService, keybindingService) {
		this.contextViewService = contextViewService;
		this.telemetryService = telemetryService;
		this.notificationService = notificationService;
		this.keybindingService = keybindingService;
		this.focusToReturn = null;
		this.lastContainer = null;
		this.block = null;
		this.blockDisposable = null;
		this.options = { blockMouse: true };
	}
	configure(options) {
		this.options = options;
	}
	showContextMenu(delegate) {
		const actions = delegate.getActions();
		if (!actions.length) return;
		this.focusToReturn = getActiveElement();
		let menu;
		const shadowRootElement = isHTMLElement(delegate.domForShadowRoot) ? delegate.domForShadowRoot : void 0;
		this.contextViewService.showContextView({
			getAnchor: () => delegate.getAnchor(),
			canRelayout: false,
			anchorAlignment: delegate.anchorAlignment,
			anchorAxisAlignment: delegate.anchorAxisAlignment,
			render: (container) => {
				this.lastContainer = container;
				const className = delegate.getMenuClassName ? delegate.getMenuClassName() : "";
				if (className) container.className += " " + className;
				if (this.options.blockMouse) {
					this.block = container.appendChild($(".context-view-block"));
					this.block.style.position = "fixed";
					this.block.style.cursor = "initial";
					this.block.style.left = "0";
					this.block.style.top = "0";
					this.block.style.width = "100%";
					this.block.style.height = "100%";
					this.block.style.zIndex = "-1";
					this.blockDisposable?.dispose();
					this.blockDisposable = addDisposableListener(this.block, EventType$1.MOUSE_DOWN, (e) => e.stopPropagation());
				}
				const menuDisposables = new DisposableStore();
				const actionRunner = delegate.actionRunner || new ActionRunner();
				actionRunner.onWillRun((evt) => this.onActionRun(evt, !delegate.skipTelemetry), this, menuDisposables);
				actionRunner.onDidRun(this.onDidActionRun, this, menuDisposables);
				menu = new Menu(container, actions, {
					actionViewItemProvider: delegate.getActionViewItem,
					context: delegate.getActionsContext ? delegate.getActionsContext() : null,
					actionRunner,
					getKeyBinding: delegate.getKeyBinding ? delegate.getKeyBinding : (action) => this.keybindingService.lookupKeybinding(action.id)
				}, defaultMenuStyles);
				menu.onDidCancel(() => this.contextViewService.hideContextView(true), null, menuDisposables);
				menu.onDidBlur(() => this.contextViewService.hideContextView(true), null, menuDisposables);
				const targetWindow = getWindow(container);
				menuDisposables.add(addDisposableListener(targetWindow, EventType$1.BLUR, () => this.contextViewService.hideContextView(true)));
				menuDisposables.add(addDisposableListener(targetWindow, EventType$1.MOUSE_DOWN, (e) => {
					if (e.defaultPrevented) return;
					const event = new StandardMouseEvent(targetWindow, e);
					let element = event.target;
					if (event.rightButton) return;
					while (element) {
						if (element === container) return;
						element = element.parentElement;
					}
					this.contextViewService.hideContextView(true);
				}));
				return combinedDisposable(menuDisposables, menu);
			},
			focus: () => {
				menu?.focus(!!delegate.autoSelectFirstItem);
			},
			onHide: (didCancel) => {
				delegate.onHide?.(!!didCancel);
				if (this.block) {
					this.block.remove();
					this.block = null;
				}
				this.blockDisposable?.dispose();
				this.blockDisposable = null;
				if (!!this.lastContainer && (getActiveElement() === this.lastContainer || isAncestor(getActiveElement(), this.lastContainer))) this.focusToReturn?.focus();
				this.lastContainer = null;
			}
		}, shadowRootElement, !!shadowRootElement);
	}
	onActionRun(e, logTelemetry) {
		if (logTelemetry) this.telemetryService.publicLog2("workbenchActionExecuted", {
			id: e.action.id,
			from: "contextMenu"
		});
		this.contextViewService.hideContextView(false);
	}
	onDidActionRun(e) {
		if (e.error && !isCancellationError(e.error)) this.notificationService.error(e.error);
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextMenuService.js
var __decorate$19 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$18 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var ContextMenuService = class ContextMenuService$1 extends Disposable {
	get contextMenuHandler() {
		if (!this._contextMenuHandler) this._contextMenuHandler = new ContextMenuHandler(this.contextViewService, this.telemetryService, this.notificationService, this.keybindingService);
		return this._contextMenuHandler;
	}
	constructor(telemetryService, notificationService, contextViewService, keybindingService, menuService, contextKeyService) {
		super();
		this.telemetryService = telemetryService;
		this.notificationService = notificationService;
		this.contextViewService = contextViewService;
		this.keybindingService = keybindingService;
		this.menuService = menuService;
		this.contextKeyService = contextKeyService;
		this._contextMenuHandler = void 0;
		this._onDidShowContextMenu = this._store.add(new Emitter$1());
		this.onDidShowContextMenu = this._onDidShowContextMenu.event;
		this._onDidHideContextMenu = this._store.add(new Emitter$1());
	}
	configure(options) {
		this.contextMenuHandler.configure(options);
	}
	showContextMenu(delegate) {
		delegate = ContextMenuMenuDelegate.transform(delegate, this.menuService, this.contextKeyService);
		this.contextMenuHandler.showContextMenu({
			...delegate,
			onHide: (didCancel) => {
				delegate.onHide?.(didCancel);
				this._onDidHideContextMenu.fire();
			}
		});
		ModifierKeyEmitter.getInstance().resetKeyStatus();
		this._onDidShowContextMenu.fire();
	}
};
ContextMenuService = __decorate$19([
	__param$18(0, ITelemetryService),
	__param$18(1, INotificationService),
	__param$18(2, IContextViewService),
	__param$18(3, IKeybindingService),
	__param$18(4, IMenuService),
	__param$18(5, IContextKeyService)
], ContextMenuService);
var ContextMenuMenuDelegate;
(function(ContextMenuMenuDelegate$1) {
	function is(thing) {
		return thing && thing.menuId instanceof MenuId;
	}
	function transform(delegate, menuService, globalContextKeyService) {
		if (!is(delegate)) return delegate;
		const { menuId, menuActionOptions, contextKeyService } = delegate;
		return {
			...delegate,
			getActions: () => {
				const target = [];
				if (menuId) {
					const menu = menuService.getMenuActions(menuId, contextKeyService ?? globalContextKeyService, menuActionOptions);
					createAndFillInContextMenuActions(menu, target);
				}
				if (!delegate.getActions) return target;
				else return Separator.join(delegate.getActions(), target);
			}
		};
	}
	ContextMenuMenuDelegate$1.transform = transform;
})(ContextMenuMenuDelegate || (ContextMenuMenuDelegate = {}));

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/editor/common/editor.js
var EditorOpenSource;
(function(EditorOpenSource$1) {
	/**
	* Default: the editor is opening via a programmatic call
	* to the editor service API.
	*/
	EditorOpenSource$1[EditorOpenSource$1["API"] = 0] = "API";
	/**
	* Indicates that a user action triggered the opening, e.g.
	* via mouse or keyboard use.
	*/
	EditorOpenSource$1[EditorOpenSource$1["USER"] = 1] = "USER";
})(EditorOpenSource || (EditorOpenSource = {}));

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/browser/services/openerService.js
var __decorate$18 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$17 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var CommandOpener = class CommandOpener$1 {
	constructor(_commandService) {
		this._commandService = _commandService;
	}
	async open(target, options) {
		if (!matchesScheme(target, Schemas.command)) return false;
		if (!options?.allowCommands) return true;
		if (typeof target === "string") target = URI.parse(target);
		if (Array.isArray(options.allowCommands)) {
			if (!options.allowCommands.includes(target.path)) return true;
		}
		let args = [];
		try {
			args = parse(decodeURIComponent(target.query));
		} catch {
			try {
				args = parse(target.query);
			} catch {}
		}
		if (!Array.isArray(args)) args = [args];
		await this._commandService.executeCommand(target.path, ...args);
		return true;
	}
};
CommandOpener = __decorate$18([__param$17(0, ICommandService)], CommandOpener);
var EditorOpener = class EditorOpener$1 {
	constructor(_editorService) {
		this._editorService = _editorService;
	}
	async open(target, options) {
		if (typeof target === "string") target = URI.parse(target);
		const { selection, uri } = extractSelection(target);
		target = uri;
		if (target.scheme === Schemas.file) target = normalizePath(target);
		await this._editorService.openCodeEditor({
			resource: target,
			options: {
				selection,
				source: options?.fromUserGesture ? EditorOpenSource.USER : EditorOpenSource.API,
				...options?.editorOptions
			}
		}, this._editorService.getFocusedCodeEditor(), options?.openToSide);
		return true;
	}
};
EditorOpener = __decorate$18([__param$17(0, ICodeEditorService)], EditorOpener);
var OpenerService = class OpenerService$1 {
	constructor(editorService, commandService) {
		this._openers = new LinkedList();
		this._validators = new LinkedList();
		this._resolvers = new LinkedList();
		this._resolvedUriTargets = new ResourceMap((uri) => uri.with({
			path: null,
			fragment: null,
			query: null
		}).toString());
		this._externalOpeners = new LinkedList();
		this._defaultExternalOpener = { openExternal: async (href) => {
			if (matchesSomeScheme(href, Schemas.http, Schemas.https)) windowOpenNoOpener(href);
			else mainWindow.location.href = href;
			return true;
		} };
		this._openers.push({ open: async (target, options) => {
			if (options?.openExternal || matchesSomeScheme(target, Schemas.mailto, Schemas.http, Schemas.https, Schemas.vsls)) {
				await this._doOpenExternal(target, options);
				return true;
			}
			return false;
		} });
		this._openers.push(new CommandOpener(commandService));
		this._openers.push(new EditorOpener(editorService));
	}
	registerOpener(opener) {
		return { dispose: this._openers.unshift(opener) };
	}
	async open(target, options) {
		const targetURI = typeof target === "string" ? URI.parse(target) : target;
		const validationTarget = this._resolvedUriTargets.get(targetURI) ?? target;
		for (const validator of this._validators) if (!await validator.shouldOpen(validationTarget, options)) return false;
		for (const opener of this._openers) if (await opener.open(target, options)) return true;
		return false;
	}
	async resolveExternalUri(resource, options) {
		for (const resolver of this._resolvers) try {
			const result = await resolver.resolveExternalUri(resource, options);
			if (result) {
				if (!this._resolvedUriTargets.has(result.resolved)) this._resolvedUriTargets.set(result.resolved, resource);
				return result;
			}
		} catch {}
		throw new Error("Could not resolve external URI: " + resource.toString());
	}
	async _doOpenExternal(resource, options) {
		const uri = typeof resource === "string" ? URI.parse(resource) : resource;
		let externalUri;
		try {
			externalUri = (await this.resolveExternalUri(uri, options)).resolved;
		} catch {
			externalUri = uri;
		}
		let href;
		if (typeof resource === "string" && uri.toString() === externalUri.toString()) href = resource;
		else href = encodeURI(externalUri.toString(true));
		if (options?.allowContributedOpeners) {
			const preferredOpenerId = typeof options?.allowContributedOpeners === "string" ? options?.allowContributedOpeners : void 0;
			for (const opener of this._externalOpeners) if (await opener.openExternal(href, {
				sourceUri: uri,
				preferredOpenerId
			}, CancellationToken.None)) return true;
		}
		return this._defaultExternalOpener.openExternal(href, { sourceUri: uri }, CancellationToken.None);
	}
	dispose() {
		this._validators.clear();
	}
};
OpenerService = __decorate$18([__param$17(0, ICodeEditorService), __param$17(1, ICommandService)], OpenerService);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/services/markerDecorationsService.js
var __decorate$17 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$16 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var MarkerDecorationsService = class MarkerDecorationsService$1 extends Disposable {
	constructor(modelService, _markerService) {
		super();
		this._markerService = _markerService;
		this._onDidChangeMarker = this._register(new Emitter$1());
		this._markerDecorations = new ResourceMap();
		modelService.getModels().forEach((model) => this._onModelAdded(model));
		this._register(modelService.onModelAdded(this._onModelAdded, this));
		this._register(modelService.onModelRemoved(this._onModelRemoved, this));
		this._register(this._markerService.onMarkerChanged(this._handleMarkerChange, this));
	}
	dispose() {
		super.dispose();
		this._markerDecorations.forEach((value) => value.dispose());
		this._markerDecorations.clear();
	}
	getMarker(uri, decoration) {
		const markerDecorations = this._markerDecorations.get(uri);
		return markerDecorations ? markerDecorations.getMarker(decoration) || null : null;
	}
	_handleMarkerChange(changedResources) {
		changedResources.forEach((resource) => {
			const markerDecorations = this._markerDecorations.get(resource);
			if (markerDecorations) this._updateDecorations(markerDecorations);
		});
	}
	_onModelAdded(model) {
		const markerDecorations = new MarkerDecorations(model);
		this._markerDecorations.set(model.uri, markerDecorations);
		this._updateDecorations(markerDecorations);
	}
	_onModelRemoved(model) {
		const markerDecorations = this._markerDecorations.get(model.uri);
		if (markerDecorations) {
			markerDecorations.dispose();
			this._markerDecorations.delete(model.uri);
		}
		if (model.uri.scheme === Schemas.inMemory || model.uri.scheme === Schemas.internal || model.uri.scheme === Schemas.vscode) this._markerService?.read({ resource: model.uri }).map((marker) => marker.owner).forEach((owner) => this._markerService.remove(owner, [model.uri]));
	}
	_updateDecorations(markerDecorations) {
		const markers = this._markerService.read({
			resource: markerDecorations.model.uri,
			take: 500
		});
		if (markerDecorations.update(markers)) this._onDidChangeMarker.fire(markerDecorations.model);
	}
};
MarkerDecorationsService = __decorate$17([__param$16(0, IModelService), __param$16(1, IMarkerService)], MarkerDecorationsService);
var MarkerDecorations = class extends Disposable {
	constructor(model) {
		super();
		this.model = model;
		this._map = new BidirectionalMap();
		this._register(toDisposable(() => {
			this.model.deltaDecorations([...this._map.values()], []);
			this._map.clear();
		}));
	}
	update(markers) {
		const { added, removed } = diffSets(new Set(this._map.keys()), new Set(markers));
		if (added.length === 0 && removed.length === 0) return false;
		const oldIds = removed.map((marker) => this._map.get(marker));
		const newDecorations = added.map((marker) => {
			return {
				range: this._createDecorationRange(this.model, marker),
				options: this._createDecorationOption(marker)
			};
		});
		const ids = this.model.deltaDecorations(oldIds, newDecorations);
		for (const removedMarker of removed) this._map.delete(removedMarker);
		for (let index = 0; index < ids.length; index++) this._map.set(added[index], ids[index]);
		return true;
	}
	getMarker(decoration) {
		return this._map.getKey(decoration.id);
	}
	_createDecorationRange(model, rawMarker) {
		let ret = Range$1.lift(rawMarker);
		if (rawMarker.severity === MarkerSeverity$1.Hint && !this._hasMarkerTag(rawMarker, 1) && !this._hasMarkerTag(rawMarker, 2)) ret = ret.setEndPosition(ret.startLineNumber, ret.startColumn + 2);
		ret = model.validateRange(ret);
		if (ret.isEmpty()) {
			const maxColumn = model.getLineLastNonWhitespaceColumn(ret.startLineNumber) || model.getLineMaxColumn(ret.startLineNumber);
			if (maxColumn === 1 || ret.endColumn >= maxColumn) return ret;
			const word = model.getWordAtPosition(ret.getStartPosition());
			if (word) ret = new Range$1(ret.startLineNumber, word.startColumn, ret.endLineNumber, word.endColumn);
		} else if (rawMarker.endColumn === Number.MAX_VALUE && rawMarker.startColumn === 1 && ret.startLineNumber === ret.endLineNumber) {
			const minColumn = model.getLineFirstNonWhitespaceColumn(rawMarker.startLineNumber);
			if (minColumn < ret.endColumn) {
				ret = new Range$1(ret.startLineNumber, minColumn, ret.endLineNumber, ret.endColumn);
				rawMarker.startColumn = minColumn;
			}
		}
		return ret;
	}
	_createDecorationOption(marker) {
		let className;
		let color = void 0;
		let zIndex;
		let inlineClassName = void 0;
		let minimap;
		switch (marker.severity) {
			case MarkerSeverity$1.Hint:
				if (this._hasMarkerTag(marker, 2)) className = void 0;
				else if (this._hasMarkerTag(marker, 1)) className = "squiggly-unnecessary";
				else className = "squiggly-hint";
				zIndex = 0;
				break;
			case MarkerSeverity$1.Info:
				className = "squiggly-info";
				color = themeColorFromId(overviewRulerInfo);
				zIndex = 10;
				minimap = {
					color: themeColorFromId(minimapInfo),
					position: 1
				};
				break;
			case MarkerSeverity$1.Warning:
				className = "squiggly-warning";
				color = themeColorFromId(overviewRulerWarning);
				zIndex = 20;
				minimap = {
					color: themeColorFromId(minimapWarning),
					position: 1
				};
				break;
			case MarkerSeverity$1.Error:
			default:
				className = "squiggly-error";
				color = themeColorFromId(overviewRulerError);
				zIndex = 30;
				minimap = {
					color: themeColorFromId(minimapError),
					position: 1
				};
				break;
		}
		if (marker.tags) {
			if (marker.tags.indexOf(1) !== -1) inlineClassName = "squiggly-inline-unnecessary";
			if (marker.tags.indexOf(2) !== -1) inlineClassName = "squiggly-inline-deprecated";
		}
		return {
			description: "marker-decoration",
			stickiness: 1,
			className,
			showIfCollapsed: true,
			overviewRuler: {
				color,
				position: OverviewRulerLane.Right
			},
			minimap,
			zIndex,
			inlineClassName
		};
	}
	_hasMarkerTag(marker, tag) {
		if (marker.tags) return marker.tags.indexOf(tag) >= 0;
		return false;
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/services/modelService.js
var __decorate$16 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$15 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var ModelService_1;
function MODEL_ID(resource) {
	return resource.toString();
}
var ModelData = class {
	constructor(model, onWillDispose, onDidChangeLanguage) {
		this.model = model;
		this._modelEventListeners = new DisposableStore();
		this.model = model;
		this._modelEventListeners.add(model.onWillDispose(() => onWillDispose(model)));
		this._modelEventListeners.add(model.onDidChangeLanguage((e) => onDidChangeLanguage(model, e)));
	}
	dispose() {
		this._modelEventListeners.dispose();
	}
};
var DEFAULT_EOL = isLinux || isMacintosh ? 1 : 2;
var DisposedModelInfo = class {
	constructor(uri, initialUndoRedoSnapshot, time, sharesUndoRedoStack, heapSize, sha1, versionId, alternativeVersionId) {
		this.uri = uri;
		this.initialUndoRedoSnapshot = initialUndoRedoSnapshot;
		this.time = time;
		this.sharesUndoRedoStack = sharesUndoRedoStack;
		this.heapSize = heapSize;
		this.sha1 = sha1;
		this.versionId = versionId;
		this.alternativeVersionId = alternativeVersionId;
	}
};
var ModelService = class ModelService$1 extends Disposable {
	static {
		ModelService_1 = this;
	}
	static {
		this.MAX_MEMORY_FOR_CLOSED_FILES_UNDO_STACK = 20 * 1024 * 1024;
	}
	constructor(_configurationService, _resourcePropertiesService, _undoRedoService, _instantiationService) {
		super();
		this._configurationService = _configurationService;
		this._resourcePropertiesService = _resourcePropertiesService;
		this._undoRedoService = _undoRedoService;
		this._instantiationService = _instantiationService;
		this._onModelAdded = this._register(new Emitter$1());
		this.onModelAdded = this._onModelAdded.event;
		this._onModelRemoved = this._register(new Emitter$1());
		this.onModelRemoved = this._onModelRemoved.event;
		this._onModelModeChanged = this._register(new Emitter$1());
		this.onModelLanguageChanged = this._onModelModeChanged.event;
		this._modelCreationOptionsByLanguageAndResource = Object.create(null);
		this._models = {};
		this._disposedModels = /* @__PURE__ */ new Map();
		this._disposedModelsHeapSize = 0;
		this._register(this._configurationService.onDidChangeConfiguration((e) => this._updateModelOptions(e)));
		this._updateModelOptions(void 0);
	}
	static _readModelOptions(config, isForSimpleWidget) {
		let tabSize = EDITOR_MODEL_DEFAULTS.tabSize;
		if (config.editor && typeof config.editor.tabSize !== "undefined") {
			const parsedTabSize = parseInt(config.editor.tabSize, 10);
			if (!isNaN(parsedTabSize)) tabSize = parsedTabSize;
			if (tabSize < 1) tabSize = 1;
		}
		let indentSize = "tabSize";
		if (config.editor && typeof config.editor.indentSize !== "undefined" && config.editor.indentSize !== "tabSize") {
			const parsedIndentSize = parseInt(config.editor.indentSize, 10);
			if (!isNaN(parsedIndentSize)) indentSize = Math.max(parsedIndentSize, 1);
		}
		let insertSpaces = EDITOR_MODEL_DEFAULTS.insertSpaces;
		if (config.editor && typeof config.editor.insertSpaces !== "undefined") insertSpaces = config.editor.insertSpaces === "false" ? false : Boolean(config.editor.insertSpaces);
		let newDefaultEOL = DEFAULT_EOL;
		const eol = config.eol;
		if (eol === "\r\n") newDefaultEOL = 2;
		else if (eol === "\n") newDefaultEOL = 1;
		let trimAutoWhitespace = EDITOR_MODEL_DEFAULTS.trimAutoWhitespace;
		if (config.editor && typeof config.editor.trimAutoWhitespace !== "undefined") trimAutoWhitespace = config.editor.trimAutoWhitespace === "false" ? false : Boolean(config.editor.trimAutoWhitespace);
		let detectIndentation = EDITOR_MODEL_DEFAULTS.detectIndentation;
		if (config.editor && typeof config.editor.detectIndentation !== "undefined") detectIndentation = config.editor.detectIndentation === "false" ? false : Boolean(config.editor.detectIndentation);
		let largeFileOptimizations = EDITOR_MODEL_DEFAULTS.largeFileOptimizations;
		if (config.editor && typeof config.editor.largeFileOptimizations !== "undefined") largeFileOptimizations = config.editor.largeFileOptimizations === "false" ? false : Boolean(config.editor.largeFileOptimizations);
		let bracketPairColorizationOptions = EDITOR_MODEL_DEFAULTS.bracketPairColorizationOptions;
		if (config.editor?.bracketPairColorization && typeof config.editor.bracketPairColorization === "object") bracketPairColorizationOptions = {
			enabled: !!config.editor.bracketPairColorization.enabled,
			independentColorPoolPerBracketType: !!config.editor.bracketPairColorization.independentColorPoolPerBracketType
		};
		return {
			isForSimpleWidget,
			tabSize,
			indentSize,
			insertSpaces,
			detectIndentation,
			defaultEOL: newDefaultEOL,
			trimAutoWhitespace,
			largeFileOptimizations,
			bracketPairColorizationOptions
		};
	}
	_getEOL(resource, language) {
		if (resource) return this._resourcePropertiesService.getEOL(resource, language);
		const eol = this._configurationService.getValue("files.eol", { overrideIdentifier: language });
		if (eol && typeof eol === "string" && eol !== "auto") return eol;
		return OS === 3 || OS === 2 ? "\n" : "\r\n";
	}
	_shouldRestoreUndoStack() {
		const result = this._configurationService.getValue("files.restoreUndoStack");
		if (typeof result === "boolean") return result;
		return true;
	}
	getCreationOptions(languageIdOrSelection, resource, isForSimpleWidget) {
		const language = typeof languageIdOrSelection === "string" ? languageIdOrSelection : languageIdOrSelection.languageId;
		let creationOptions = this._modelCreationOptionsByLanguageAndResource[language + resource];
		if (!creationOptions) {
			const editor$1 = this._configurationService.getValue("editor", {
				overrideIdentifier: language,
				resource
			});
			const eol = this._getEOL(resource, language);
			creationOptions = ModelService_1._readModelOptions({
				editor: editor$1,
				eol
			}, isForSimpleWidget);
			this._modelCreationOptionsByLanguageAndResource[language + resource] = creationOptions;
		}
		return creationOptions;
	}
	_updateModelOptions(e) {
		const oldOptionsByLanguageAndResource = this._modelCreationOptionsByLanguageAndResource;
		this._modelCreationOptionsByLanguageAndResource = Object.create(null);
		const keys = Object.keys(this._models);
		for (let i = 0, len = keys.length; i < len; i++) {
			const modelId = keys[i];
			const modelData = this._models[modelId];
			const language = modelData.model.getLanguageId();
			const uri = modelData.model.uri;
			if (e && !e.affectsConfiguration("editor", {
				overrideIdentifier: language,
				resource: uri
			}) && !e.affectsConfiguration("files.eol", {
				overrideIdentifier: language,
				resource: uri
			})) continue;
			const oldOptions = oldOptionsByLanguageAndResource[language + uri];
			const newOptions = this.getCreationOptions(language, uri, modelData.model.isForSimpleWidget);
			ModelService_1._setModelOptionsForModel(modelData.model, newOptions, oldOptions);
		}
	}
	static _setModelOptionsForModel(model, newOptions, currentOptions) {
		if (currentOptions && currentOptions.defaultEOL !== newOptions.defaultEOL && model.getLineCount() === 1) model.setEOL(newOptions.defaultEOL === 1 ? 0 : 1);
		if (currentOptions && currentOptions.detectIndentation === newOptions.detectIndentation && currentOptions.insertSpaces === newOptions.insertSpaces && currentOptions.tabSize === newOptions.tabSize && currentOptions.indentSize === newOptions.indentSize && currentOptions.trimAutoWhitespace === newOptions.trimAutoWhitespace && equals$1(currentOptions.bracketPairColorizationOptions, newOptions.bracketPairColorizationOptions)) return;
		if (newOptions.detectIndentation) {
			model.detectIndentation(newOptions.insertSpaces, newOptions.tabSize);
			model.updateOptions({
				trimAutoWhitespace: newOptions.trimAutoWhitespace,
				bracketColorizationOptions: newOptions.bracketPairColorizationOptions
			});
		} else model.updateOptions({
			insertSpaces: newOptions.insertSpaces,
			tabSize: newOptions.tabSize,
			indentSize: newOptions.indentSize,
			trimAutoWhitespace: newOptions.trimAutoWhitespace,
			bracketColorizationOptions: newOptions.bracketPairColorizationOptions
		});
	}
	_insertDisposedModel(disposedModelData) {
		this._disposedModels.set(MODEL_ID(disposedModelData.uri), disposedModelData);
		this._disposedModelsHeapSize += disposedModelData.heapSize;
	}
	_removeDisposedModel(resource) {
		const disposedModelData = this._disposedModels.get(MODEL_ID(resource));
		if (disposedModelData) this._disposedModelsHeapSize -= disposedModelData.heapSize;
		this._disposedModels.delete(MODEL_ID(resource));
		return disposedModelData;
	}
	_ensureDisposedModelsHeapSize(maxModelsHeapSize) {
		if (this._disposedModelsHeapSize > maxModelsHeapSize) {
			const disposedModels = [];
			this._disposedModels.forEach((entry) => {
				if (!entry.sharesUndoRedoStack) disposedModels.push(entry);
			});
			disposedModels.sort((a, b) => a.time - b.time);
			while (disposedModels.length > 0 && this._disposedModelsHeapSize > maxModelsHeapSize) {
				const disposedModel = disposedModels.shift();
				this._removeDisposedModel(disposedModel.uri);
				if (disposedModel.initialUndoRedoSnapshot !== null) this._undoRedoService.restoreSnapshot(disposedModel.initialUndoRedoSnapshot);
			}
		}
	}
	_createModelData(value, languageIdOrSelection, resource, isForSimpleWidget) {
		const options = this.getCreationOptions(languageIdOrSelection, resource, isForSimpleWidget);
		const model = this._instantiationService.createInstance(TextModel, value, languageIdOrSelection, options, resource);
		if (resource && this._disposedModels.has(MODEL_ID(resource))) {
			const disposedModelData = this._removeDisposedModel(resource);
			const elements = this._undoRedoService.getElements(resource);
			const sha1Computer = this._getSHA1Computer();
			const sha1IsEqual = sha1Computer.canComputeSHA1(model) ? sha1Computer.computeSHA1(model) === disposedModelData.sha1 : false;
			if (sha1IsEqual || disposedModelData.sharesUndoRedoStack) {
				for (const element of elements.past) if (isEditStackElement(element) && element.matchesResource(resource)) element.setModel(model);
				for (const element of elements.future) if (isEditStackElement(element) && element.matchesResource(resource)) element.setModel(model);
				this._undoRedoService.setElementsValidFlag(resource, true, (element) => isEditStackElement(element) && element.matchesResource(resource));
				if (sha1IsEqual) {
					model._overwriteVersionId(disposedModelData.versionId);
					model._overwriteAlternativeVersionId(disposedModelData.alternativeVersionId);
					model._overwriteInitialUndoRedoSnapshot(disposedModelData.initialUndoRedoSnapshot);
				}
			} else if (disposedModelData.initialUndoRedoSnapshot !== null) this._undoRedoService.restoreSnapshot(disposedModelData.initialUndoRedoSnapshot);
		}
		const modelId = MODEL_ID(model.uri);
		if (this._models[modelId]) throw new Error("ModelService: Cannot add model because it already exists!");
		const modelData = new ModelData(model, (model$1) => this._onWillDispose(model$1), (model$1, e) => this._onDidChangeLanguage(model$1, e));
		this._models[modelId] = modelData;
		return modelData;
	}
	createModel(value, languageSelection, resource, isForSimpleWidget = false) {
		let modelData;
		if (languageSelection) modelData = this._createModelData(value, languageSelection, resource, isForSimpleWidget);
		else modelData = this._createModelData(value, PLAINTEXT_LANGUAGE_ID, resource, isForSimpleWidget);
		this._onModelAdded.fire(modelData.model);
		return modelData.model;
	}
	getModels() {
		const ret = [];
		const keys = Object.keys(this._models);
		for (let i = 0, len = keys.length; i < len; i++) {
			const modelId = keys[i];
			ret.push(this._models[modelId].model);
		}
		return ret;
	}
	getModel(resource) {
		const modelId = MODEL_ID(resource);
		const modelData = this._models[modelId];
		if (!modelData) return null;
		return modelData.model;
	}
	_schemaShouldMaintainUndoRedoElements(resource) {
		return resource.scheme === Schemas.file || resource.scheme === Schemas.vscodeRemote || resource.scheme === Schemas.vscodeUserData || resource.scheme === Schemas.vscodeNotebookCell || resource.scheme === "fake-fs";
	}
	_onWillDispose(model) {
		const modelId = MODEL_ID(model.uri);
		const modelData = this._models[modelId];
		const sharesUndoRedoStack = this._undoRedoService.getUriComparisonKey(model.uri) !== model.uri.toString();
		let maintainUndoRedoStack = false;
		let heapSize = 0;
		if (sharesUndoRedoStack || this._shouldRestoreUndoStack() && this._schemaShouldMaintainUndoRedoElements(model.uri)) {
			const elements = this._undoRedoService.getElements(model.uri);
			if (elements.past.length > 0 || elements.future.length > 0) {
				for (const element of elements.past) if (isEditStackElement(element) && element.matchesResource(model.uri)) {
					maintainUndoRedoStack = true;
					heapSize += element.heapSize(model.uri);
					element.setModel(model.uri);
				}
				for (const element of elements.future) if (isEditStackElement(element) && element.matchesResource(model.uri)) {
					maintainUndoRedoStack = true;
					heapSize += element.heapSize(model.uri);
					element.setModel(model.uri);
				}
			}
		}
		const maxMemory = ModelService_1.MAX_MEMORY_FOR_CLOSED_FILES_UNDO_STACK;
		const sha1Computer = this._getSHA1Computer();
		if (!maintainUndoRedoStack) {
			if (!sharesUndoRedoStack) {
				const initialUndoRedoSnapshot = modelData.model.getInitialUndoRedoSnapshot();
				if (initialUndoRedoSnapshot !== null) this._undoRedoService.restoreSnapshot(initialUndoRedoSnapshot);
			}
		} else if (!sharesUndoRedoStack && (heapSize > maxMemory || !sha1Computer.canComputeSHA1(model))) {
			const initialUndoRedoSnapshot = modelData.model.getInitialUndoRedoSnapshot();
			if (initialUndoRedoSnapshot !== null) this._undoRedoService.restoreSnapshot(initialUndoRedoSnapshot);
		} else {
			this._ensureDisposedModelsHeapSize(maxMemory - heapSize);
			this._undoRedoService.setElementsValidFlag(model.uri, false, (element) => isEditStackElement(element) && element.matchesResource(model.uri));
			this._insertDisposedModel(new DisposedModelInfo(model.uri, modelData.model.getInitialUndoRedoSnapshot(), Date.now(), sharesUndoRedoStack, heapSize, sha1Computer.computeSHA1(model), model.getVersionId(), model.getAlternativeVersionId()));
		}
		delete this._models[modelId];
		modelData.dispose();
		delete this._modelCreationOptionsByLanguageAndResource[model.getLanguageId() + model.uri];
		this._onModelRemoved.fire(model);
	}
	_onDidChangeLanguage(model, e) {
		const oldLanguageId = e.oldLanguage;
		const newLanguageId = model.getLanguageId();
		const oldOptions = this.getCreationOptions(oldLanguageId, model.uri, model.isForSimpleWidget);
		const newOptions = this.getCreationOptions(newLanguageId, model.uri, model.isForSimpleWidget);
		ModelService_1._setModelOptionsForModel(model, newOptions, oldOptions);
		this._onModelModeChanged.fire({
			model,
			oldLanguageId
		});
	}
	_getSHA1Computer() {
		return new DefaultModelSHA1Computer();
	}
};
ModelService = ModelService_1 = __decorate$16([
	__param$15(0, IConfigurationService),
	__param$15(1, ITextResourcePropertiesService),
	__param$15(2, IUndoRedoService),
	__param$15(3, IInstantiationService)
], ModelService);
var DefaultModelSHA1Computer = class DefaultModelSHA1Computer {
	static {
		this.MAX_MODEL_SIZE = 10 * 1024 * 1024;
	}
	canComputeSHA1(model) {
		return model.getValueLength() <= DefaultModelSHA1Computer.MAX_MODEL_SIZE;
	}
	computeSHA1(model) {
		const shaComputer = new StringSHA1();
		const snapshot = model.createSnapshot();
		let text;
		while (text = snapshot.read()) shaComputer.update(text);
		return shaComputer.digest();
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/quickinput/common/quickAccess.js
var DefaultQuickAccessFilterValue;
(function(DefaultQuickAccessFilterValue$1) {
	/**
	* Keep the value as it is given to quick access.
	*/
	DefaultQuickAccessFilterValue$1[DefaultQuickAccessFilterValue$1["PRESERVE"] = 0] = "PRESERVE";
	/**
	* Use the value that was used last time something was accepted from the picker.
	*/
	DefaultQuickAccessFilterValue$1[DefaultQuickAccessFilterValue$1["LAST"] = 1] = "LAST";
})(DefaultQuickAccessFilterValue || (DefaultQuickAccessFilterValue = {}));
const Extensions$3 = { Quickaccess: "workbench.contributions.quickaccess" };
var QuickAccessRegistry = class {
	constructor() {
		this.providers = [];
		this.defaultProvider = void 0;
	}
	registerQuickAccessProvider(provider) {
		if (provider.prefix.length === 0) this.defaultProvider = provider;
		else this.providers.push(provider);
		this.providers.sort((providerA, providerB) => providerB.prefix.length - providerA.prefix.length);
		return toDisposable(() => {
			this.providers.splice(this.providers.indexOf(provider), 1);
			if (this.defaultProvider === provider) this.defaultProvider = void 0;
		});
	}
	getQuickAccessProviders() {
		return coalesce([this.defaultProvider, ...this.providers]);
	}
	getQuickAccessProvider(prefix) {
		return (prefix ? this.providers.find((provider) => prefix.startsWith(provider.prefix)) || void 0 : void 0) || this.defaultProvider;
	}
};
Registry.add(Extensions$3.Quickaccess, new QuickAccessRegistry());

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/quickinput/browser/quickAccess.js
var __decorate$15 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$14 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var QuickAccessController = class QuickAccessController$1 extends Disposable {
	constructor(quickInputService, instantiationService) {
		super();
		this.quickInputService = quickInputService;
		this.instantiationService = instantiationService;
		this.registry = Registry.as(Extensions$3.Quickaccess);
		this.mapProviderToDescriptor = /* @__PURE__ */ new Map();
		this.lastAcceptedPickerValues = /* @__PURE__ */ new Map();
		this.visibleQuickAccess = void 0;
	}
	show(value = "", options) {
		this.doShowOrPick(value, false, options);
	}
	doShowOrPick(value, pick, options) {
		const [provider, descriptor] = this.getOrInstantiateProvider(value, options?.enabledProviderPrefixes);
		const visibleQuickAccess = this.visibleQuickAccess;
		const visibleDescriptor = visibleQuickAccess?.descriptor;
		if (visibleQuickAccess && descriptor && visibleDescriptor === descriptor) {
			if (value !== descriptor.prefix && !options?.preserveValue) visibleQuickAccess.picker.value = value;
			this.adjustValueSelection(visibleQuickAccess.picker, descriptor, options);
			return;
		}
		if (descriptor && !options?.preserveValue) {
			let newValue = void 0;
			if (visibleQuickAccess && visibleDescriptor && visibleDescriptor !== descriptor) {
				const newValueCandidateWithoutPrefix = visibleQuickAccess.value.substr(visibleDescriptor.prefix.length);
				if (newValueCandidateWithoutPrefix) newValue = `${descriptor.prefix}${newValueCandidateWithoutPrefix}`;
			}
			if (!newValue) {
				const defaultFilterValue = provider?.defaultFilterValue;
				if (defaultFilterValue === DefaultQuickAccessFilterValue.LAST) newValue = this.lastAcceptedPickerValues.get(descriptor);
				else if (typeof defaultFilterValue === "string") newValue = `${descriptor.prefix}${defaultFilterValue}`;
			}
			if (typeof newValue === "string") value = newValue;
		}
		const visibleSelection = visibleQuickAccess?.picker?.valueSelection;
		const visibleValue = visibleQuickAccess?.picker?.value;
		const disposables = new DisposableStore();
		const picker = disposables.add(this.quickInputService.createQuickPick({ useSeparators: true }));
		picker.value = value;
		this.adjustValueSelection(picker, descriptor, options);
		picker.placeholder = options?.placeholder ?? descriptor?.placeholder;
		picker.quickNavigate = options?.quickNavigateConfiguration;
		picker.hideInput = !!picker.quickNavigate && !visibleQuickAccess;
		if (typeof options?.itemActivation === "number" || options?.quickNavigateConfiguration) picker.itemActivation = options?.itemActivation ?? ItemActivation.SECOND;
		picker.contextKey = descriptor?.contextKey;
		picker.filterValue = (value$1) => value$1.substring(descriptor ? descriptor.prefix.length : 0);
		let pickPromise = void 0;
		if (pick) {
			pickPromise = new DeferredPromise();
			disposables.add(Event.once(picker.onWillAccept)((e) => {
				e.veto();
				picker.hide();
			}));
		}
		disposables.add(this.registerPickerListeners(picker, provider, descriptor, value, options));
		const cts = disposables.add(new CancellationTokenSource$1());
		if (provider) disposables.add(provider.provide(picker, cts.token, options?.providerOptions));
		Event.once(picker.onDidHide)(() => {
			if (picker.selectedItems.length === 0) cts.cancel();
			disposables.dispose();
			pickPromise?.complete(picker.selectedItems.slice(0));
		});
		picker.show();
		if (visibleSelection && visibleValue === value) picker.valueSelection = visibleSelection;
		if (pick) return pickPromise?.p;
	}
	adjustValueSelection(picker, descriptor, options) {
		let valueSelection;
		if (options?.preserveValue) valueSelection = [picker.value.length, picker.value.length];
		else valueSelection = [descriptor?.prefix.length ?? 0, picker.value.length];
		picker.valueSelection = valueSelection;
	}
	registerPickerListeners(picker, provider, descriptor, value, options) {
		const disposables = new DisposableStore();
		const visibleQuickAccess = this.visibleQuickAccess = {
			picker,
			descriptor,
			value
		};
		disposables.add(toDisposable(() => {
			if (visibleQuickAccess === this.visibleQuickAccess) this.visibleQuickAccess = void 0;
		}));
		disposables.add(picker.onDidChangeValue((value$1) => {
			const [providerForValue] = this.getOrInstantiateProvider(value$1, options?.enabledProviderPrefixes);
			if (providerForValue !== provider) this.show(value$1, {
				enabledProviderPrefixes: options?.enabledProviderPrefixes,
				preserveValue: true,
				providerOptions: options?.providerOptions
			});
			else visibleQuickAccess.value = value$1;
		}));
		if (descriptor) disposables.add(picker.onDidAccept(() => {
			this.lastAcceptedPickerValues.set(descriptor, picker.value);
		}));
		return disposables;
	}
	getOrInstantiateProvider(value, enabledProviderPrefixes) {
		const providerDescriptor = this.registry.getQuickAccessProvider(value);
		if (!providerDescriptor || enabledProviderPrefixes && !enabledProviderPrefixes?.includes(providerDescriptor.prefix)) return [void 0, void 0];
		let provider = this.mapProviderToDescriptor.get(providerDescriptor);
		if (!provider) {
			provider = this.instantiationService.createInstance(providerDescriptor.ctor);
			this.mapProviderToDescriptor.set(providerDescriptor, provider);
		}
		return [provider, providerDescriptor];
	}
};
QuickAccessController = __decorate$15([__param$14(0, IQuickInputService), __param$14(1, IInstantiationService)], QuickAccessController);

//#endregion
//#region node_modules/monaco-editor/esm/vs/base/common/linkedText.js
var __decorate$14 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LinkedText = class {
	constructor(nodes) {
		this.nodes = nodes;
	}
	toString() {
		return this.nodes.map((node) => typeof node === "string" ? node : node.label).join("");
	}
};
__decorate$14([memoize], LinkedText.prototype, "toString", null);
var LINK_REGEX = /\[([^\]]+)\]\(((?:https?:\/\/|command:|file:)[^\)\s]+)(?: (["'])(.+?)(\3))?\)/gi;
function parseLinkedText(text) {
	const result = [];
	let index = 0;
	let match;
	while (match = LINK_REGEX.exec(text)) {
		if (match.index - index > 0) result.push(text.substring(index, match.index));
		const [, label, href, , title] = match;
		if (title) result.push({
			label,
			href,
			title
		});
		else result.push({
			label,
			href
		});
		index = match.index + match[0].length;
	}
	if (index < text.length) result.push(text.substring(index));
	return new LinkedText(result);
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/quickinput/browser/quickInputUtils.js
var iconPathToClass = {};
var iconClassGenerator = new IdGenerator("quick-input-button-icon-");
function getIconClass(iconPath) {
	if (!iconPath) return;
	let iconClass;
	const key = iconPath.dark.toString();
	if (iconPathToClass[key]) iconClass = iconPathToClass[key];
	else {
		iconClass = iconClassGenerator.nextId();
		createCSSRule(`.${iconClass}, .hc-light .${iconClass}`, `background-image: ${asCSSUrl(iconPath.light || iconPath.dark)}`);
		createCSSRule(`.vs-dark .${iconClass}, .hc-black .${iconClass}`, `background-image: ${asCSSUrl(iconPath.dark)}`);
		iconPathToClass[key] = iconClass;
	}
	return iconClass;
}
function quickInputButtonToAction(button, id, run) {
	let cssClasses = button.iconClass || getIconClass(button.iconPath);
	if (button.alwaysVisible) cssClasses = cssClasses ? `${cssClasses} always-visible` : "always-visible";
	return {
		id,
		label: "",
		tooltip: button.tooltip || "",
		class: cssClasses,
		enabled: true,
		run
	};
}
function renderQuickInputDescription(description, container, actionHandler) {
	reset(container);
	const parsed = parseLinkedText(description);
	let tabIndex = 0;
	for (const node of parsed.nodes) if (typeof node === "string") container.append(...renderLabelWithIcons(node));
	else {
		let title = node.title;
		if (!title && node.href.startsWith("command:")) title = localize("executeCommand", "Click to execute command '{0}'", node.href.substring(8));
		else if (!title) title = node.href;
		const anchor = $("a", {
			href: node.href,
			title,
			tabIndex: tabIndex++
		}, node.label);
		anchor.style.textDecoration = "underline";
		const handleOpen = (e) => {
			if (isEventLike(e)) EventHelper.stop(e, true);
			actionHandler.callback(node.href);
		};
		const onClick = actionHandler.disposables.add(new DomEmitter(anchor, EventType$1.CLICK)).event;
		const onKeydown = actionHandler.disposables.add(new DomEmitter(anchor, EventType$1.KEY_DOWN)).event;
		const onSpaceOrEnter = Event.chain(onKeydown, ($$5) => $$5.filter((e) => {
			const event = new StandardKeyboardEvent(e);
			return event.equals(10) || event.equals(3);
		}));
		actionHandler.disposables.add(Gesture.addTarget(anchor));
		const onTap = actionHandler.disposables.add(new DomEmitter(anchor, EventType.Tap)).event;
		Event.any(onClick, onTap, onSpaceOrEnter)(handleOpen, null, actionHandler.disposables);
		container.appendChild(anchor);
	}
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/quickinput/browser/quickInput.js
var __decorate$13 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$13 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
const inQuickInputContextKeyValue = "inQuickInput";
const InQuickInputContextKey = new RawContextKey(inQuickInputContextKeyValue, false, localize("inQuickInput", "Whether keyboard focus is inside the quick input control"));
const inQuickInputContext = ContextKeyExpr.has(inQuickInputContextKeyValue);
const quickInputTypeContextKeyValue = "quickInputType";
const QuickInputTypeContextKey = new RawContextKey(quickInputTypeContextKeyValue, void 0, localize("quickInputType", "The type of the currently visible quick input"));
const endOfQuickInputBoxContextKeyValue = "cursorAtEndOfQuickInputBox";
const EndOfQuickInputBoxContextKey = new RawContextKey(endOfQuickInputBoxContextKeyValue, false, localize("cursorAtEndOfQuickInputBox", "Whether the cursor in the quick input is at the end of the input box"));
const endOfQuickInputBoxContext = ContextKeyExpr.has(endOfQuickInputBoxContextKeyValue);
const backButton = {
	iconClass: ThemeIcon.asClassName(Codicon.quickInputBack),
	tooltip: localize("quickInput.back", "Back"),
	handle: -1
};
var QuickInput = class QuickInput extends Disposable {
	static {
		this.noPromptMessage = localize("inputModeEntry", "Press 'Enter' to confirm your input or 'Escape' to cancel");
	}
	constructor(ui) {
		super();
		this.ui = ui;
		this._widgetUpdated = false;
		this.visible = false;
		this._enabled = true;
		this._busy = false;
		this._ignoreFocusOut = false;
		this._leftButtons = [];
		this._rightButtons = [];
		this._inlineButtons = [];
		this.buttonsUpdated = false;
		this._toggles = [];
		this.togglesUpdated = false;
		this.noValidationMessage = QuickInput.noPromptMessage;
		this._severity = severity_default.Ignore;
		this.onDidTriggerButtonEmitter = this._register(new Emitter$1());
		this.onDidHideEmitter = this._register(new Emitter$1());
		this.onWillHideEmitter = this._register(new Emitter$1());
		this.onDisposeEmitter = this._register(new Emitter$1());
		this.visibleDisposables = this._register(new DisposableStore());
		this.onDidHide = this.onDidHideEmitter.event;
	}
	get title() {
		return this._title;
	}
	set title(title) {
		this._title = title;
		this.update();
	}
	get description() {
		return this._description;
	}
	set description(description) {
		this._description = description;
		this.update();
	}
	get step() {
		return this._steps;
	}
	set step(step) {
		this._steps = step;
		this.update();
	}
	get totalSteps() {
		return this._totalSteps;
	}
	set totalSteps(totalSteps) {
		this._totalSteps = totalSteps;
		this.update();
	}
	get enabled() {
		return this._enabled;
	}
	set enabled(enabled) {
		this._enabled = enabled;
		this.update();
	}
	get contextKey() {
		return this._contextKey;
	}
	set contextKey(contextKey) {
		this._contextKey = contextKey;
		this.update();
	}
	get busy() {
		return this._busy;
	}
	set busy(busy) {
		this._busy = busy;
		this.update();
	}
	get ignoreFocusOut() {
		return this._ignoreFocusOut;
	}
	set ignoreFocusOut(ignoreFocusOut) {
		const shouldUpdate = this._ignoreFocusOut !== ignoreFocusOut && !isIOS;
		this._ignoreFocusOut = ignoreFocusOut && !isIOS;
		if (shouldUpdate) this.update();
	}
	get titleButtons() {
		return this._leftButtons.length ? [...this._leftButtons, this._rightButtons] : this._rightButtons;
	}
	get buttons() {
		return [
			...this._leftButtons,
			...this._rightButtons,
			...this._inlineButtons
		];
	}
	set buttons(buttons) {
		this._leftButtons = buttons.filter((b) => b === backButton);
		this._rightButtons = buttons.filter((b) => b !== backButton && b.location !== QuickInputButtonLocation.Inline);
		this._inlineButtons = buttons.filter((b) => b.location === QuickInputButtonLocation.Inline);
		this.buttonsUpdated = true;
		this.update();
	}
	get toggles() {
		return this._toggles;
	}
	set toggles(toggles) {
		this._toggles = toggles ?? [];
		this.togglesUpdated = true;
		this.update();
	}
	get validationMessage() {
		return this._validationMessage;
	}
	set validationMessage(validationMessage) {
		this._validationMessage = validationMessage;
		this.update();
	}
	get severity() {
		return this._severity;
	}
	set severity(severity) {
		this._severity = severity;
		this.update();
	}
	show() {
		if (this.visible) return;
		this.visibleDisposables.add(this.ui.onDidTriggerButton((button) => {
			if (this.buttons.indexOf(button) !== -1) this.onDidTriggerButtonEmitter.fire(button);
		}));
		this.ui.show(this);
		this.visible = true;
		this._lastValidationMessage = void 0;
		this._lastSeverity = void 0;
		if (this.buttons.length) this.buttonsUpdated = true;
		if (this.toggles.length) this.togglesUpdated = true;
		this.update();
	}
	hide() {
		if (!this.visible) return;
		this.ui.hide();
	}
	didHide(reason = QuickInputHideReason.Other) {
		this.visible = false;
		this.visibleDisposables.clear();
		this.onDidHideEmitter.fire({ reason });
	}
	willHide(reason = QuickInputHideReason.Other) {
		this.onWillHideEmitter.fire({ reason });
	}
	update() {
		if (!this.visible) return;
		const title = this.getTitle();
		if (title && this.ui.title.textContent !== title) this.ui.title.textContent = title;
		else if (!title && this.ui.title.innerHTML !== "&nbsp;") this.ui.title.innerText = "\xA0";
		const description = this.getDescription();
		if (this.ui.description1.textContent !== description) this.ui.description1.textContent = description;
		if (this.ui.description2.textContent !== description) this.ui.description2.textContent = description;
		if (this._widgetUpdated) {
			this._widgetUpdated = false;
			if (this._widget) reset(this.ui.widget, this._widget);
			else reset(this.ui.widget);
		}
		if (this.busy && !this.busyDelay) {
			this.busyDelay = new TimeoutTimer();
			this.busyDelay.setIfNotSet(() => {
				if (this.visible) this.ui.progressBar.infinite();
			}, 800);
		}
		if (!this.busy && this.busyDelay) {
			this.ui.progressBar.stop();
			this.busyDelay.cancel();
			this.busyDelay = void 0;
		}
		if (this.buttonsUpdated) {
			this.buttonsUpdated = false;
			this.ui.leftActionBar.clear();
			const leftButtons = this._leftButtons.map((button, index) => quickInputButtonToAction(button, `id-${index}`, async () => this.onDidTriggerButtonEmitter.fire(button)));
			this.ui.leftActionBar.push(leftButtons, {
				icon: true,
				label: false
			});
			this.ui.rightActionBar.clear();
			const rightButtons = this._rightButtons.map((button, index) => quickInputButtonToAction(button, `id-${index}`, async () => this.onDidTriggerButtonEmitter.fire(button)));
			this.ui.rightActionBar.push(rightButtons, {
				icon: true,
				label: false
			});
			this.ui.inlineActionBar.clear();
			const inlineButtons = this._inlineButtons.map((button, index) => quickInputButtonToAction(button, `id-${index}`, async () => this.onDidTriggerButtonEmitter.fire(button)));
			this.ui.inlineActionBar.push(inlineButtons, {
				icon: true,
				label: false
			});
		}
		if (this.togglesUpdated) {
			this.togglesUpdated = false;
			const concreteToggles = this.toggles?.filter((opts) => opts instanceof Toggle) ?? [];
			this.ui.inputBox.toggles = concreteToggles;
		}
		this.ui.ignoreFocusOut = this.ignoreFocusOut;
		this.ui.setEnabled(this.enabled);
		this.ui.setContextKey(this.contextKey);
		const validationMessage = this.validationMessage || this.noValidationMessage;
		if (this._lastValidationMessage !== validationMessage) {
			this._lastValidationMessage = validationMessage;
			reset(this.ui.message);
			renderQuickInputDescription(validationMessage, this.ui.message, {
				callback: (content) => {
					this.ui.linkOpenerDelegate(content);
				},
				disposables: this.visibleDisposables
			});
		}
		if (this._lastSeverity !== this.severity) {
			this._lastSeverity = this.severity;
			this.showMessageDecoration(this.severity);
		}
	}
	getTitle() {
		if (this.title && this.step) return `${this.title} (${this.getSteps()})`;
		if (this.title) return this.title;
		if (this.step) return this.getSteps();
		return "";
	}
	getDescription() {
		return this.description || "";
	}
	getSteps() {
		if (this.step && this.totalSteps) return localize("quickInput.steps", "{0}/{1}", this.step, this.totalSteps);
		if (this.step) return String(this.step);
		return "";
	}
	showMessageDecoration(severity) {
		this.ui.inputBox.showDecoration(severity);
		if (severity !== severity_default.Ignore) {
			const styles = this.ui.inputBox.stylesForType(severity);
			this.ui.message.style.color = styles.foreground ? `${styles.foreground}` : "";
			this.ui.message.style.backgroundColor = styles.background ? `${styles.background}` : "";
			this.ui.message.style.border = styles.border ? `1px solid ${styles.border}` : "";
			this.ui.message.style.marginBottom = "-2px";
		} else {
			this.ui.message.style.color = "";
			this.ui.message.style.backgroundColor = "";
			this.ui.message.style.border = "";
			this.ui.message.style.marginBottom = "";
		}
	}
	dispose() {
		this.hide();
		this.onDisposeEmitter.fire();
		super.dispose();
	}
};
var QuickPick = class QuickPick extends QuickInput {
	constructor() {
		super(...arguments);
		this._value = "";
		this.onDidChangeValueEmitter = this._register(new Emitter$1());
		this.onWillAcceptEmitter = this._register(new Emitter$1());
		this.onDidAcceptEmitter = this._register(new Emitter$1());
		this.onDidCustomEmitter = this._register(new Emitter$1());
		this._items = [];
		this.itemsUpdated = false;
		this._canSelectMany = false;
		this._canAcceptInBackground = false;
		this._matchOnDescription = false;
		this._matchOnDetail = false;
		this._matchOnLabel = true;
		this._matchOnLabelMode = "fuzzy";
		this._sortByLabel = true;
		this._keepScrollPosition = false;
		this._itemActivation = ItemActivation.FIRST;
		this._activeItems = [];
		this.activeItemsUpdated = false;
		this.activeItemsToConfirm = [];
		this.onDidChangeActiveEmitter = this._register(new Emitter$1());
		this._selectedItems = [];
		this.selectedItemsUpdated = false;
		this.selectedItemsToConfirm = [];
		this.onDidChangeSelectionEmitter = this._register(new Emitter$1());
		this.onDidTriggerItemButtonEmitter = this._register(new Emitter$1());
		this.onDidTriggerSeparatorButtonEmitter = this._register(new Emitter$1());
		this.valueSelectionUpdated = true;
		this._ok = "default";
		this._customButton = false;
		this._focusEventBufferer = new EventBufferer();
		this.type = "quickPick";
		this.filterValue = (value) => value;
		this.onDidChangeValue = this.onDidChangeValueEmitter.event;
		this.onWillAccept = this.onWillAcceptEmitter.event;
		this.onDidAccept = this.onDidAcceptEmitter.event;
		this.onDidChangeActive = this.onDidChangeActiveEmitter.event;
		this.onDidChangeSelection = this.onDidChangeSelectionEmitter.event;
		this.onDidTriggerItemButton = this.onDidTriggerItemButtonEmitter.event;
		this.onDidTriggerSeparatorButton = this.onDidTriggerSeparatorButtonEmitter.event;
	}
	static {
		this.DEFAULT_ARIA_LABEL = localize("quickInputBox.ariaLabel", "Type to narrow down results.");
	}
	get quickNavigate() {
		return this._quickNavigate;
	}
	set quickNavigate(quickNavigate) {
		this._quickNavigate = quickNavigate;
		this.update();
	}
	get value() {
		return this._value;
	}
	set value(value) {
		this.doSetValue(value);
	}
	doSetValue(value, skipUpdate) {
		if (this._value !== value) {
			this._value = value;
			if (!skipUpdate) this.update();
			if (this.visible) {
				if (this.ui.list.filter(this.filterValue(this._value))) this.trySelectFirst();
			}
			this.onDidChangeValueEmitter.fire(this._value);
		}
	}
	set ariaLabel(ariaLabel) {
		this._ariaLabel = ariaLabel;
		this.update();
	}
	get ariaLabel() {
		return this._ariaLabel;
	}
	get placeholder() {
		return this._placeholder;
	}
	set placeholder(placeholder) {
		this._placeholder = placeholder;
		this.update();
	}
	get items() {
		return this._items;
	}
	get scrollTop() {
		return this.ui.list.scrollTop;
	}
	set scrollTop(scrollTop) {
		this.ui.list.scrollTop = scrollTop;
	}
	set items(items) {
		this._items = items;
		this.itemsUpdated = true;
		this.update();
	}
	get canSelectMany() {
		return this._canSelectMany;
	}
	set canSelectMany(canSelectMany) {
		this._canSelectMany = canSelectMany;
		this.update();
	}
	get canAcceptInBackground() {
		return this._canAcceptInBackground;
	}
	set canAcceptInBackground(canAcceptInBackground) {
		this._canAcceptInBackground = canAcceptInBackground;
	}
	get matchOnDescription() {
		return this._matchOnDescription;
	}
	set matchOnDescription(matchOnDescription) {
		this._matchOnDescription = matchOnDescription;
		this.update();
	}
	get matchOnDetail() {
		return this._matchOnDetail;
	}
	set matchOnDetail(matchOnDetail) {
		this._matchOnDetail = matchOnDetail;
		this.update();
	}
	get matchOnLabel() {
		return this._matchOnLabel;
	}
	set matchOnLabel(matchOnLabel) {
		this._matchOnLabel = matchOnLabel;
		this.update();
	}
	get matchOnLabelMode() {
		return this._matchOnLabelMode;
	}
	set matchOnLabelMode(matchOnLabelMode) {
		this._matchOnLabelMode = matchOnLabelMode;
		this.update();
	}
	get sortByLabel() {
		return this._sortByLabel;
	}
	set sortByLabel(sortByLabel) {
		this._sortByLabel = sortByLabel;
		this.update();
	}
	get keepScrollPosition() {
		return this._keepScrollPosition;
	}
	set keepScrollPosition(keepScrollPosition) {
		this._keepScrollPosition = keepScrollPosition;
	}
	get itemActivation() {
		return this._itemActivation;
	}
	set itemActivation(itemActivation) {
		this._itemActivation = itemActivation;
	}
	get activeItems() {
		return this._activeItems;
	}
	set activeItems(activeItems) {
		this._activeItems = activeItems;
		this.activeItemsUpdated = true;
		this.update();
	}
	get selectedItems() {
		return this._selectedItems;
	}
	set selectedItems(selectedItems) {
		this._selectedItems = selectedItems;
		this.selectedItemsUpdated = true;
		this.update();
	}
	get keyMods() {
		if (this._quickNavigate) return NO_KEY_MODS;
		return this.ui.keyMods;
	}
	get valueSelection() {
		const selection = this.ui.inputBox.getSelection();
		if (!selection) return;
		return [selection.start, selection.end];
	}
	set valueSelection(valueSelection) {
		this._valueSelection = valueSelection;
		this.valueSelectionUpdated = true;
		this.update();
	}
	get customButton() {
		return this._customButton;
	}
	set customButton(showCustomButton) {
		this._customButton = showCustomButton;
		this.update();
	}
	get customLabel() {
		return this._customButtonLabel;
	}
	set customLabel(label) {
		this._customButtonLabel = label;
		this.update();
	}
	get customHover() {
		return this._customButtonHover;
	}
	set customHover(hover) {
		this._customButtonHover = hover;
		this.update();
	}
	get ok() {
		return this._ok;
	}
	set ok(showOkButton) {
		this._ok = showOkButton;
		this.update();
	}
	get hideInput() {
		return !!this._hideInput;
	}
	set hideInput(hideInput) {
		this._hideInput = hideInput;
		this.update();
	}
	trySelectFirst() {
		if (!this.canSelectMany) this.ui.list.focus(QuickPickFocus.First);
	}
	show() {
		if (!this.visible) {
			this.visibleDisposables.add(this.ui.inputBox.onDidChange((value) => {
				this.doSetValue(value, true);
			}));
			this.visibleDisposables.add(this.ui.onDidAccept(() => {
				if (this.canSelectMany) {
					if (!this.ui.list.getCheckedElements().length) {
						this._selectedItems = [];
						this.onDidChangeSelectionEmitter.fire(this.selectedItems);
					}
				} else if (this.activeItems[0]) {
					this._selectedItems = [this.activeItems[0]];
					this.onDidChangeSelectionEmitter.fire(this.selectedItems);
				}
				this.handleAccept(false);
			}));
			this.visibleDisposables.add(this.ui.onDidCustom(() => {
				this.onDidCustomEmitter.fire();
			}));
			this.visibleDisposables.add(this._focusEventBufferer.wrapEvent(this.ui.list.onDidChangeFocus, (_, e) => e)((focusedItems) => {
				if (this.activeItemsUpdated) return;
				if (this.activeItemsToConfirm !== this._activeItems && equals(focusedItems, this._activeItems, (a, b) => a === b)) return;
				this._activeItems = focusedItems;
				this.onDidChangeActiveEmitter.fire(focusedItems);
			}));
			this.visibleDisposables.add(this.ui.list.onDidChangeSelection(({ items: selectedItems, event }) => {
				if (this.canSelectMany) {
					if (selectedItems.length) this.ui.list.setSelectedElements([]);
					return;
				}
				if (this.selectedItemsToConfirm !== this._selectedItems && equals(selectedItems, this._selectedItems, (a, b) => a === b)) return;
				this._selectedItems = selectedItems;
				this.onDidChangeSelectionEmitter.fire(selectedItems);
				if (selectedItems.length) this.handleAccept(isMouseEvent(event) && event.button === 1);
			}));
			this.visibleDisposables.add(this.ui.list.onChangedCheckedElements((checkedItems) => {
				if (!this.canSelectMany || !this.visible) return;
				if (this.selectedItemsToConfirm !== this._selectedItems && equals(checkedItems, this._selectedItems, (a, b) => a === b)) return;
				this._selectedItems = checkedItems;
				this.onDidChangeSelectionEmitter.fire(checkedItems);
			}));
			this.visibleDisposables.add(this.ui.list.onButtonTriggered((event) => this.onDidTriggerItemButtonEmitter.fire(event)));
			this.visibleDisposables.add(this.ui.list.onSeparatorButtonTriggered((event) => this.onDidTriggerSeparatorButtonEmitter.fire(event)));
			this.visibleDisposables.add(this.registerQuickNavigation());
			this.valueSelectionUpdated = true;
		}
		super.show();
	}
	handleAccept(inBackground) {
		let veto = false;
		this.onWillAcceptEmitter.fire({ veto: () => veto = true });
		if (!veto) this.onDidAcceptEmitter.fire({ inBackground });
	}
	registerQuickNavigation() {
		return addDisposableListener(this.ui.container, EventType$1.KEY_UP, (e) => {
			if (this.canSelectMany || !this._quickNavigate) return;
			const keyboardEvent = new StandardKeyboardEvent(e);
			const keyCode = keyboardEvent.keyCode;
			if (this._quickNavigate.keybindings.some((k) => {
				const chords = k.getChords();
				if (chords.length > 1) return false;
				if (chords[0].shiftKey && keyCode === 4) {
					if (keyboardEvent.ctrlKey || keyboardEvent.altKey || keyboardEvent.metaKey) return false;
					return true;
				}
				if (chords[0].altKey && keyCode === 6) return true;
				if (chords[0].ctrlKey && keyCode === 5) return true;
				if (chords[0].metaKey && keyCode === 57) return true;
				return false;
			})) {
				if (this.activeItems[0]) {
					this._selectedItems = [this.activeItems[0]];
					this.onDidChangeSelectionEmitter.fire(this.selectedItems);
					this.handleAccept(false);
				}
				this._quickNavigate = void 0;
			}
		});
	}
	update() {
		if (!this.visible) return;
		const scrollTopBefore = this.keepScrollPosition ? this.scrollTop : 0;
		const hasDescription = !!this.description;
		const visibilities = {
			title: !!this.title || !!this.step || !!this.titleButtons.length,
			description: hasDescription,
			checkAll: this.canSelectMany && !this._hideCheckAll,
			checkBox: this.canSelectMany,
			inputBox: !this._hideInput,
			progressBar: !this._hideInput || hasDescription,
			visibleCount: true,
			count: this.canSelectMany && !this._hideCountBadge,
			ok: this.ok === "default" ? this.canSelectMany : this.ok,
			list: true,
			message: !!this.validationMessage,
			customButton: this.customButton
		};
		this.ui.setVisibilities(visibilities);
		super.update();
		if (this.ui.inputBox.value !== this.value) this.ui.inputBox.value = this.value;
		if (this.valueSelectionUpdated) {
			this.valueSelectionUpdated = false;
			this.ui.inputBox.select(this._valueSelection && {
				start: this._valueSelection[0],
				end: this._valueSelection[1]
			});
		}
		if (this.ui.inputBox.placeholder !== (this.placeholder || "")) this.ui.inputBox.placeholder = this.placeholder || "";
		let ariaLabel = this.ariaLabel;
		if (!ariaLabel && visibilities.inputBox) {
			ariaLabel = this.placeholder || QuickPick.DEFAULT_ARIA_LABEL;
			if (this.title) ariaLabel += ` - ${this.title}`;
		}
		if (this.ui.list.ariaLabel !== ariaLabel) this.ui.list.ariaLabel = ariaLabel ?? null;
		this.ui.list.matchOnDescription = this.matchOnDescription;
		this.ui.list.matchOnDetail = this.matchOnDetail;
		this.ui.list.matchOnLabel = this.matchOnLabel;
		this.ui.list.matchOnLabelMode = this.matchOnLabelMode;
		this.ui.list.sortByLabel = this.sortByLabel;
		if (this.itemsUpdated) {
			this.itemsUpdated = false;
			this._focusEventBufferer.bufferEvents(() => {
				this.ui.list.setElements(this.items);
				this.ui.list.shouldLoop = !this.canSelectMany;
				this.ui.list.filter(this.filterValue(this.ui.inputBox.value));
				switch (this._itemActivation) {
					case ItemActivation.NONE:
						this._itemActivation = ItemActivation.FIRST;
						break;
					case ItemActivation.SECOND:
						this.ui.list.focus(QuickPickFocus.Second);
						this._itemActivation = ItemActivation.FIRST;
						break;
					case ItemActivation.LAST:
						this.ui.list.focus(QuickPickFocus.Last);
						this._itemActivation = ItemActivation.FIRST;
						break;
					default:
						this.trySelectFirst();
						break;
				}
			});
		}
		if (this.ui.container.classList.contains("show-checkboxes") !== !!this.canSelectMany) if (this.canSelectMany) this.ui.list.clearFocus();
		else this.trySelectFirst();
		if (this.activeItemsUpdated) {
			this.activeItemsUpdated = false;
			this.activeItemsToConfirm = this._activeItems;
			this.ui.list.setFocusedElements(this.activeItems);
			if (this.activeItemsToConfirm === this._activeItems) this.activeItemsToConfirm = null;
		}
		if (this.selectedItemsUpdated) {
			this.selectedItemsUpdated = false;
			this.selectedItemsToConfirm = this._selectedItems;
			if (this.canSelectMany) this.ui.list.setCheckedElements(this.selectedItems);
			else this.ui.list.setSelectedElements(this.selectedItems);
			if (this.selectedItemsToConfirm === this._selectedItems) this.selectedItemsToConfirm = null;
		}
		this.ui.customButton.label = this.customLabel || "";
		this.ui.customButton.element.title = this.customHover || "";
		if (!visibilities.inputBox) {
			this.ui.list.domFocus();
			if (this.canSelectMany) this.ui.list.focus(QuickPickFocus.First);
		}
		if (this.keepScrollPosition) this.scrollTop = scrollTopBefore;
	}
	focus(focus) {
		this.ui.list.focus(focus);
		if (this.canSelectMany) this.ui.list.domFocus();
	}
	accept(inBackground) {
		if (inBackground && !this._canAcceptInBackground) return;
		if (this.activeItems[0]) {
			this._selectedItems = [this.activeItems[0]];
			this.onDidChangeSelectionEmitter.fire(this.selectedItems);
			this.handleAccept(inBackground ?? false);
		}
	}
};
var InputBox = class extends QuickInput {
	constructor() {
		super(...arguments);
		this._value = "";
		this.valueSelectionUpdated = true;
		this._password = false;
		this.onDidValueChangeEmitter = this._register(new Emitter$1());
		this.onDidAcceptEmitter = this._register(new Emitter$1());
		this.type = "inputBox";
		this.onDidChangeValue = this.onDidValueChangeEmitter.event;
		this.onDidAccept = this.onDidAcceptEmitter.event;
	}
	get value() {
		return this._value;
	}
	set value(value) {
		this._value = value || "";
		this.update();
	}
	get placeholder() {
		return this._placeholder;
	}
	set placeholder(placeholder) {
		this._placeholder = placeholder;
		this.update();
	}
	get password() {
		return this._password;
	}
	set password(password) {
		this._password = password;
		this.update();
	}
	show() {
		if (!this.visible) {
			this.visibleDisposables.add(this.ui.inputBox.onDidChange((value) => {
				if (value === this.value) return;
				this._value = value;
				this.onDidValueChangeEmitter.fire(value);
			}));
			this.visibleDisposables.add(this.ui.onDidAccept(() => this.onDidAcceptEmitter.fire()));
			this.valueSelectionUpdated = true;
		}
		super.show();
	}
	update() {
		if (!this.visible) return;
		this.ui.container.classList.remove("hidden-input");
		const visibilities = {
			title: !!this.title || !!this.step || !!this.titleButtons.length,
			description: !!this.description || !!this.step,
			inputBox: true,
			message: true,
			progressBar: true
		};
		this.ui.setVisibilities(visibilities);
		super.update();
		if (this.ui.inputBox.value !== this.value) this.ui.inputBox.value = this.value;
		if (this.valueSelectionUpdated) {
			this.valueSelectionUpdated = false;
			this.ui.inputBox.select(this._valueSelection && {
				start: this._valueSelection[0],
				end: this._valueSelection[1]
			});
		}
		if (this.ui.inputBox.placeholder !== (this.placeholder || "")) this.ui.inputBox.placeholder = this.placeholder || "";
		if (this.ui.inputBox.password !== this.password) this.ui.inputBox.password = this.password;
	}
};
var QuickInputHoverDelegate = class QuickInputHoverDelegate$1 extends WorkbenchHoverDelegate {
	constructor(configurationService, hoverService) {
		super("element", false, (options) => this.getOverrideOptions(options), configurationService, hoverService);
	}
	getOverrideOptions(options) {
		return {
			persistence: { hideOnKeyDown: false },
			appearance: {
				showHoverHint: (isHTMLElement(options.content) ? options.content.textContent ?? "" : typeof options.content === "string" ? options.content : options.content.value).includes("\n"),
				skipFadeInAnimation: true
			}
		};
	}
};
QuickInputHoverDelegate = __decorate$13([__param$13(0, IConfigurationService), __param$13(1, IHoverService)], QuickInputHoverDelegate);

//#endregion
//#region node_modules/monaco-editor/esm/vs/base/browser/ui/progressbar/progressbar.js
var CSS_DONE = "done";
var CSS_ACTIVE = "active";
var CSS_INFINITE = "infinite";
var CSS_INFINITE_LONG_RUNNING = "infinite-long-running";
var CSS_DISCRETE = "discrete";
/**
* A progress bar with support for infinite or discrete progress.
*/
var ProgressBar = class ProgressBar extends Disposable {
	/**
	* After a certain time of showing the progress bar, switch
	* to long-running mode and throttle animations to reduce
	* the pressure on the GPU process.
	*
	* https://github.com/microsoft/vscode/issues/97900
	* https://github.com/microsoft/vscode/issues/138396
	*/
	static {
		this.LONG_RUNNING_INFINITE_THRESHOLD = 1e4;
	}
	constructor(container, options) {
		super();
		this.progressSignal = this._register(new MutableDisposable());
		this.workedVal = 0;
		this.showDelayedScheduler = this._register(new RunOnceScheduler(() => show(this.element), 0));
		this.longRunningScheduler = this._register(new RunOnceScheduler(() => this.infiniteLongRunning(), ProgressBar.LONG_RUNNING_INFINITE_THRESHOLD));
		this.create(container, options);
	}
	create(container, options) {
		this.element = document.createElement("div");
		this.element.classList.add("monaco-progress-container");
		this.element.setAttribute("role", "progressbar");
		this.element.setAttribute("aria-valuemin", "0");
		container.appendChild(this.element);
		this.bit = document.createElement("div");
		this.bit.classList.add("progress-bit");
		this.bit.style.backgroundColor = options?.progressBarBackground || "#0E70C0";
		this.element.appendChild(this.bit);
	}
	off() {
		this.bit.style.width = "inherit";
		this.bit.style.opacity = "1";
		this.element.classList.remove(CSS_ACTIVE, CSS_INFINITE, CSS_INFINITE_LONG_RUNNING, CSS_DISCRETE);
		this.workedVal = 0;
		this.totalWork = void 0;
		this.longRunningScheduler.cancel();
		this.progressSignal.clear();
	}
	/**
	* Stops the progressbar from showing any progress instantly without fading out.
	*/
	stop() {
		return this.doDone(false);
	}
	doDone(delayed) {
		this.element.classList.add(CSS_DONE);
		if (!this.element.classList.contains(CSS_INFINITE)) {
			this.bit.style.width = "inherit";
			if (delayed) setTimeout(() => this.off(), 200);
			else this.off();
		} else {
			this.bit.style.opacity = "0";
			if (delayed) setTimeout(() => this.off(), 200);
			else this.off();
		}
		return this;
	}
	/**
	* Use this mode to indicate progress that has no total number of work units.
	*/
	infinite() {
		this.bit.style.width = "2%";
		this.bit.style.opacity = "1";
		this.element.classList.remove(CSS_DISCRETE, CSS_DONE, CSS_INFINITE_LONG_RUNNING);
		this.element.classList.add(CSS_ACTIVE, CSS_INFINITE);
		this.longRunningScheduler.schedule();
		return this;
	}
	infiniteLongRunning() {
		this.element.classList.add(CSS_INFINITE_LONG_RUNNING);
	}
	getContainer() {
		return this.element;
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/quickinput/browser/quickInputBox.js
var $$3 = $;
var QuickInputBox = class extends Disposable {
	constructor(parent, inputBoxStyles, toggleStyles) {
		super();
		this.parent = parent;
		this.onKeyDown = (handler) => {
			return addStandardDisposableListener(this.findInput.inputBox.inputElement, EventType$1.KEY_DOWN, handler);
		};
		this.onDidChange = (handler) => {
			return this.findInput.onDidChange(handler);
		};
		this.container = append(this.parent, $$3(".quick-input-box"));
		this.findInput = this._register(new FindInput(this.container, void 0, {
			label: "",
			inputBoxStyles,
			toggleStyles
		}));
		const input = this.findInput.inputBox.inputElement;
		input.role = "combobox";
		input.ariaHasPopup = "menu";
		input.ariaAutoComplete = "list";
		input.ariaExpanded = "true";
	}
	get value() {
		return this.findInput.getValue();
	}
	set value(value) {
		this.findInput.setValue(value);
	}
	select(range = null) {
		this.findInput.inputBox.select(range);
	}
	getSelection() {
		return this.findInput.inputBox.getSelection();
	}
	isSelectionAtEnd() {
		return this.findInput.inputBox.isSelectionAtEnd();
	}
	get placeholder() {
		return this.findInput.inputBox.inputElement.getAttribute("placeholder") || "";
	}
	set placeholder(placeholder) {
		this.findInput.inputBox.setPlaceHolder(placeholder);
	}
	get password() {
		return this.findInput.inputBox.inputElement.type === "password";
	}
	set password(password) {
		this.findInput.inputBox.inputElement.type = password ? "password" : "text";
	}
	set enabled(enabled) {
		this.findInput.inputBox.inputElement.toggleAttribute("readonly", !enabled);
	}
	set toggles(toggles) {
		this.findInput.setAdditionalToggles(toggles);
	}
	setAttribute(name, value) {
		this.findInput.inputBox.inputElement.setAttribute(name, value);
	}
	showDecoration(decoration) {
		if (decoration === severity_default.Ignore) this.findInput.clearMessage();
		else this.findInput.showMessage({
			type: decoration === severity_default.Info ? 1 : decoration === severity_default.Warning ? 2 : 3,
			content: ""
		});
	}
	stylesForType(decoration) {
		return this.findInput.inputBox.stylesForType(decoration === severity_default.Info ? 1 : decoration === severity_default.Warning ? 2 : 3);
	}
	setFocus() {
		this.findInput.focus();
	}
	layout() {
		this.findInput.inputBox.layout();
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/base/common/comparers.js
var intlFileNameCollatorBaseNumeric = new Lazy(() => {
	const collator = new Intl.Collator(void 0, {
		numeric: true,
		sensitivity: "base"
	});
	return {
		collator,
		collatorIsNumeric: collator.resolvedOptions().numeric
	};
});
new Lazy(() => {
	return { collator: new Intl.Collator(void 0, { numeric: true }) };
});
new Lazy(() => {
	return { collator: new Intl.Collator(void 0, {
		numeric: true,
		sensitivity: "accent"
	}) };
});
/** Compares filenames without distinguishing the name from the extension. Disambiguates by unicode comparison. */
function compareFileNames(one, other, caseSensitive = false) {
	const a = one || "";
	const b = other || "";
	const result = intlFileNameCollatorBaseNumeric.value.collator.compare(a, b);
	if (intlFileNameCollatorBaseNumeric.value.collatorIsNumeric && result === 0 && a !== b) return a < b ? -1 : 1;
	return result;
}
function compareAnything(one, other, lookFor) {
	const elementAName = one.toLowerCase();
	const elementBName = other.toLowerCase();
	const prefixCompare = compareByPrefix(one, other, lookFor);
	if (prefixCompare) return prefixCompare;
	const elementASuffixMatch = elementAName.endsWith(lookFor);
	const elementBSuffixMatch = elementBName.endsWith(lookFor);
	if (elementASuffixMatch !== elementBSuffixMatch) return elementASuffixMatch ? -1 : 1;
	const r = compareFileNames(elementAName, elementBName);
	if (r !== 0) return r;
	return elementAName.localeCompare(elementBName);
}
function compareByPrefix(one, other, lookFor) {
	const elementAName = one.toLowerCase();
	const elementBName = other.toLowerCase();
	const elementAPrefixMatch = elementAName.startsWith(lookFor);
	const elementBPrefixMatch = elementBName.startsWith(lookFor);
	if (elementAPrefixMatch !== elementBPrefixMatch) return elementAPrefixMatch ? -1 : 1;
	else if (elementAPrefixMatch && elementBPrefixMatch) {
		if (elementAName.length < elementBName.length) return -1;
		if (elementAName.length > elementBName.length) return 1;
	}
	return 0;
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/quickinput/browser/quickInputTree.js
var __decorate$12 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$12 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var QuickPickItemElementRenderer_1;
var $$2 = $;
var BaseQuickPickItemElement = class {
	constructor(index, hasCheckbox, mainItem) {
		this.index = index;
		this.hasCheckbox = hasCheckbox;
		this._hidden = false;
		this._init = new Lazy(() => {
			const saneLabel = mainItem.label ?? "";
			const saneSortLabel = parseLabelWithIcons(saneLabel).text.trim();
			const saneAriaLabel = mainItem.ariaLabel || [
				saneLabel,
				this.saneDescription,
				this.saneDetail
			].map((s) => getCodiconAriaLabel(s)).filter((s) => !!s).join(", ");
			return {
				saneLabel,
				saneSortLabel,
				saneAriaLabel
			};
		});
		this._saneDescription = mainItem.description;
		this._saneTooltip = mainItem.tooltip;
	}
	get saneLabel() {
		return this._init.value.saneLabel;
	}
	get saneSortLabel() {
		return this._init.value.saneSortLabel;
	}
	get saneAriaLabel() {
		return this._init.value.saneAriaLabel;
	}
	get element() {
		return this._element;
	}
	set element(value) {
		this._element = value;
	}
	get hidden() {
		return this._hidden;
	}
	set hidden(value) {
		this._hidden = value;
	}
	get saneDescription() {
		return this._saneDescription;
	}
	set saneDescription(value) {
		this._saneDescription = value;
	}
	get saneDetail() {
		return this._saneDetail;
	}
	set saneDetail(value) {
		this._saneDetail = value;
	}
	get saneTooltip() {
		return this._saneTooltip;
	}
	set saneTooltip(value) {
		this._saneTooltip = value;
	}
	get labelHighlights() {
		return this._labelHighlights;
	}
	set labelHighlights(value) {
		this._labelHighlights = value;
	}
	get descriptionHighlights() {
		return this._descriptionHighlights;
	}
	set descriptionHighlights(value) {
		this._descriptionHighlights = value;
	}
	get detailHighlights() {
		return this._detailHighlights;
	}
	set detailHighlights(value) {
		this._detailHighlights = value;
	}
};
var QuickPickItemElement = class extends BaseQuickPickItemElement {
	constructor(index, hasCheckbox, fireButtonTriggered, _onChecked, item, _separator) {
		super(index, hasCheckbox, item);
		this.fireButtonTriggered = fireButtonTriggered;
		this._onChecked = _onChecked;
		this.item = item;
		this._separator = _separator;
		this._checked = false;
		this.onChecked = hasCheckbox ? Event.map(Event.filter(this._onChecked.event, (e) => e.element === this), (e) => e.checked) : Event.None;
		this._saneDetail = item.detail;
		this._labelHighlights = item.highlights?.label;
		this._descriptionHighlights = item.highlights?.description;
		this._detailHighlights = item.highlights?.detail;
	}
	get separator() {
		return this._separator;
	}
	set separator(value) {
		this._separator = value;
	}
	get checked() {
		return this._checked;
	}
	set checked(value) {
		if (value !== this._checked) {
			this._checked = value;
			this._onChecked.fire({
				element: this,
				checked: value
			});
		}
	}
	get checkboxDisabled() {
		return !!this.item.disabled;
	}
};
var QuickPickSeparatorFocusReason;
(function(QuickPickSeparatorFocusReason$1) {
	/**
	* No item is hovered or active
	*/
	QuickPickSeparatorFocusReason$1[QuickPickSeparatorFocusReason$1["NONE"] = 0] = "NONE";
	/**
	* Some item within this section is hovered
	*/
	QuickPickSeparatorFocusReason$1[QuickPickSeparatorFocusReason$1["MOUSE_HOVER"] = 1] = "MOUSE_HOVER";
	/**
	* Some item within this section is active
	*/
	QuickPickSeparatorFocusReason$1[QuickPickSeparatorFocusReason$1["ACTIVE_ITEM"] = 2] = "ACTIVE_ITEM";
})(QuickPickSeparatorFocusReason || (QuickPickSeparatorFocusReason = {}));
var QuickPickSeparatorElement = class extends BaseQuickPickItemElement {
	constructor(index, fireSeparatorButtonTriggered, separator) {
		super(index, false, separator);
		this.fireSeparatorButtonTriggered = fireSeparatorButtonTriggered;
		this.separator = separator;
		this.children = new Array();
		/**
		* If this item is >0, it means that there is some item in the list that is either:
		* * hovered over
		* * active
		*/
		this.focusInsideSeparator = QuickPickSeparatorFocusReason.NONE;
	}
};
var QuickInputItemDelegate = class {
	getHeight(element) {
		if (element instanceof QuickPickSeparatorElement) return 30;
		return element.saneDetail ? 44 : 22;
	}
	getTemplateId(element) {
		if (element instanceof QuickPickItemElement) return QuickPickItemElementRenderer.ID;
		else return QuickPickSeparatorElementRenderer.ID;
	}
};
var QuickInputAccessibilityProvider = class {
	getWidgetAriaLabel() {
		return localize("quickInput", "Quick Input");
	}
	getAriaLabel(element) {
		return element.separator?.label ? `${element.saneAriaLabel}, ${element.separator.label}` : element.saneAriaLabel;
	}
	getWidgetRole() {
		return "listbox";
	}
	getRole(element) {
		return element.hasCheckbox ? "checkbox" : "option";
	}
	isChecked(element) {
		if (!element.hasCheckbox || !(element instanceof QuickPickItemElement)) return;
		return {
			get value() {
				return element.checked;
			},
			onDidChange: (e) => element.onChecked(() => e())
		};
	}
};
var BaseQuickInputListRenderer = class {
	constructor(hoverDelegate) {
		this.hoverDelegate = hoverDelegate;
	}
	renderTemplate(container) {
		const data = Object.create(null);
		data.toDisposeElement = new DisposableStore();
		data.toDisposeTemplate = new DisposableStore();
		data.entry = append(container, $$2(".quick-input-list-entry"));
		const label = append(data.entry, $$2("label.quick-input-list-label"));
		data.toDisposeTemplate.add(addStandardDisposableListener(label, EventType$1.CLICK, (e) => {
			if (!data.checkbox.offsetParent) e.preventDefault();
		}));
		data.checkbox = append(label, $$2("input.quick-input-list-checkbox"));
		data.checkbox.type = "checkbox";
		const rows = append(label, $$2(".quick-input-list-rows"));
		const row1 = append(rows, $$2(".quick-input-list-row"));
		const row2 = append(rows, $$2(".quick-input-list-row"));
		data.label = new IconLabel(row1, {
			supportHighlights: true,
			supportDescriptionHighlights: true,
			supportIcons: true,
			hoverDelegate: this.hoverDelegate
		});
		data.toDisposeTemplate.add(data.label);
		data.icon = prepend(data.label.element, $$2(".quick-input-list-icon"));
		const keybindingContainer = append(row1, $$2(".quick-input-list-entry-keybinding"));
		data.keybinding = new KeybindingLabel(keybindingContainer, OS);
		data.toDisposeTemplate.add(data.keybinding);
		const detailContainer = append(row2, $$2(".quick-input-list-label-meta"));
		data.detail = new IconLabel(detailContainer, {
			supportHighlights: true,
			supportIcons: true,
			hoverDelegate: this.hoverDelegate
		});
		data.toDisposeTemplate.add(data.detail);
		data.separator = append(data.entry, $$2(".quick-input-list-separator"));
		data.actionBar = new ActionBar(data.entry, this.hoverDelegate ? { hoverDelegate: this.hoverDelegate } : void 0);
		data.actionBar.domNode.classList.add("quick-input-list-entry-action-bar");
		data.toDisposeTemplate.add(data.actionBar);
		return data;
	}
	disposeTemplate(data) {
		data.toDisposeElement.dispose();
		data.toDisposeTemplate.dispose();
	}
	disposeElement(_element, _index, data) {
		data.toDisposeElement.clear();
		data.actionBar.clear();
	}
};
var QuickPickItemElementRenderer = class QuickPickItemElementRenderer$1 extends BaseQuickInputListRenderer {
	static {
		QuickPickItemElementRenderer_1 = this;
	}
	static {
		this.ID = "quickpickitem";
	}
	constructor(hoverDelegate, themeService) {
		super(hoverDelegate);
		this.themeService = themeService;
		this._itemsWithSeparatorsFrequency = /* @__PURE__ */ new Map();
	}
	get templateId() {
		return QuickPickItemElementRenderer_1.ID;
	}
	renderTemplate(container) {
		const data = super.renderTemplate(container);
		data.toDisposeTemplate.add(addStandardDisposableListener(data.checkbox, EventType$1.CHANGE, (e) => {
			data.element.checked = data.checkbox.checked;
		}));
		return data;
	}
	renderElement(node, index, data) {
		const element = node.element;
		data.element = element;
		element.element = data.entry ?? void 0;
		const mainItem = element.item;
		data.checkbox.checked = element.checked;
		data.toDisposeElement.add(element.onChecked((checked) => data.checkbox.checked = checked));
		data.checkbox.disabled = element.checkboxDisabled;
		const { labelHighlights, descriptionHighlights, detailHighlights } = element;
		if (mainItem.iconPath) {
			const icon = isDark(this.themeService.getColorTheme().type) ? mainItem.iconPath.dark : mainItem.iconPath.light ?? mainItem.iconPath.dark;
			const iconUrl = URI.revive(icon);
			data.icon.className = "quick-input-list-icon";
			data.icon.style.backgroundImage = asCSSUrl(iconUrl);
		} else {
			data.icon.style.backgroundImage = "";
			data.icon.className = mainItem.iconClass ? `quick-input-list-icon ${mainItem.iconClass}` : "";
		}
		let descriptionTitle;
		if (!element.saneTooltip && element.saneDescription) descriptionTitle = {
			markdown: {
				value: element.saneDescription,
				supportThemeIcons: true
			},
			markdownNotSupportedFallback: element.saneDescription
		};
		const options = {
			matches: labelHighlights || [],
			descriptionTitle,
			descriptionMatches: descriptionHighlights || [],
			labelEscapeNewLines: true
		};
		options.extraClasses = mainItem.iconClasses;
		options.italic = mainItem.italic;
		options.strikethrough = mainItem.strikethrough;
		data.entry.classList.remove("quick-input-list-separator-as-item");
		data.label.setLabel(element.saneLabel, element.saneDescription, options);
		data.keybinding.set(mainItem.keybinding);
		if (element.saneDetail) {
			let title;
			if (!element.saneTooltip) title = {
				markdown: {
					value: element.saneDetail,
					supportThemeIcons: true
				},
				markdownNotSupportedFallback: element.saneDetail
			};
			data.detail.element.style.display = "";
			data.detail.setLabel(element.saneDetail, void 0, {
				matches: detailHighlights,
				title,
				labelEscapeNewLines: true
			});
		} else data.detail.element.style.display = "none";
		if (element.separator?.label) {
			data.separator.textContent = element.separator.label;
			data.separator.style.display = "";
			this.addItemWithSeparator(element);
		} else data.separator.style.display = "none";
		data.entry.classList.toggle("quick-input-list-separator-border", !!element.separator);
		const buttons = mainItem.buttons;
		if (buttons && buttons.length) {
			data.actionBar.push(buttons.map((button, index$1) => quickInputButtonToAction(button, `id-${index$1}`, () => element.fireButtonTriggered({
				button,
				item: element.item
			}))), {
				icon: true,
				label: false
			});
			data.entry.classList.add("has-actions");
		} else data.entry.classList.remove("has-actions");
	}
	disposeElement(element, _index, data) {
		this.removeItemWithSeparator(element.element);
		super.disposeElement(element, _index, data);
	}
	isItemWithSeparatorVisible(item) {
		return this._itemsWithSeparatorsFrequency.has(item);
	}
	addItemWithSeparator(item) {
		this._itemsWithSeparatorsFrequency.set(item, (this._itemsWithSeparatorsFrequency.get(item) || 0) + 1);
	}
	removeItemWithSeparator(item) {
		const frequency = this._itemsWithSeparatorsFrequency.get(item) || 0;
		if (frequency > 1) this._itemsWithSeparatorsFrequency.set(item, frequency - 1);
		else this._itemsWithSeparatorsFrequency.delete(item);
	}
};
QuickPickItemElementRenderer = QuickPickItemElementRenderer_1 = __decorate$12([__param$12(1, IThemeService)], QuickPickItemElementRenderer);
var QuickPickSeparatorElementRenderer = class QuickPickSeparatorElementRenderer extends BaseQuickInputListRenderer {
	constructor() {
		super(...arguments);
		this._visibleSeparatorsFrequency = /* @__PURE__ */ new Map();
	}
	static {
		this.ID = "quickpickseparator";
	}
	get templateId() {
		return QuickPickSeparatorElementRenderer.ID;
	}
	get visibleSeparators() {
		return [...this._visibleSeparatorsFrequency.keys()];
	}
	isSeparatorVisible(separator) {
		return this._visibleSeparatorsFrequency.has(separator);
	}
	renderTemplate(container) {
		const data = super.renderTemplate(container);
		data.checkbox.style.display = "none";
		return data;
	}
	renderElement(node, index, data) {
		const element = node.element;
		data.element = element;
		element.element = data.entry ?? void 0;
		element.element.classList.toggle("focus-inside", !!element.focusInsideSeparator);
		const mainItem = element.separator;
		const { labelHighlights, descriptionHighlights, detailHighlights } = element;
		data.icon.style.backgroundImage = "";
		data.icon.className = "";
		let descriptionTitle;
		if (!element.saneTooltip && element.saneDescription) descriptionTitle = {
			markdown: {
				value: element.saneDescription,
				supportThemeIcons: true
			},
			markdownNotSupportedFallback: element.saneDescription
		};
		const options = {
			matches: labelHighlights || [],
			descriptionTitle,
			descriptionMatches: descriptionHighlights || [],
			labelEscapeNewLines: true
		};
		data.entry.classList.add("quick-input-list-separator-as-item");
		data.label.setLabel(element.saneLabel, element.saneDescription, options);
		if (element.saneDetail) {
			let title;
			if (!element.saneTooltip) title = {
				markdown: {
					value: element.saneDetail,
					supportThemeIcons: true
				},
				markdownNotSupportedFallback: element.saneDetail
			};
			data.detail.element.style.display = "";
			data.detail.setLabel(element.saneDetail, void 0, {
				matches: detailHighlights,
				title,
				labelEscapeNewLines: true
			});
		} else data.detail.element.style.display = "none";
		data.separator.style.display = "none";
		data.entry.classList.add("quick-input-list-separator-border");
		const buttons = mainItem.buttons;
		if (buttons && buttons.length) {
			data.actionBar.push(buttons.map((button, index$1) => quickInputButtonToAction(button, `id-${index$1}`, () => element.fireSeparatorButtonTriggered({
				button,
				separator: element.separator
			}))), {
				icon: true,
				label: false
			});
			data.entry.classList.add("has-actions");
		} else data.entry.classList.remove("has-actions");
		this.addSeparator(element);
	}
	disposeElement(element, _index, data) {
		this.removeSeparator(element.element);
		if (!this.isSeparatorVisible(element.element)) element.element.element?.classList.remove("focus-inside");
		super.disposeElement(element, _index, data);
	}
	addSeparator(separator) {
		this._visibleSeparatorsFrequency.set(separator, (this._visibleSeparatorsFrequency.get(separator) || 0) + 1);
	}
	removeSeparator(separator) {
		const frequency = this._visibleSeparatorsFrequency.get(separator) || 0;
		if (frequency > 1) this._visibleSeparatorsFrequency.set(separator, frequency - 1);
		else this._visibleSeparatorsFrequency.delete(separator);
	}
};
var QuickInputTree = class QuickInputTree$1 extends Disposable {
	constructor(parent, hoverDelegate, linkOpenerDelegate, id, instantiationService, accessibilityService) {
		super();
		this.parent = parent;
		this.hoverDelegate = hoverDelegate;
		this.linkOpenerDelegate = linkOpenerDelegate;
		this.accessibilityService = accessibilityService;
		this._onKeyDown = new Emitter$1();
		this._onLeave = new Emitter$1();
		/**
		* Event that is fired when the tree would no longer have focus.
		*/
		this.onLeave = this._onLeave.event;
		this._visibleCountObservable = observableValue("VisibleCount", 0);
		this.onChangedVisibleCount = Event.fromObservable(this._visibleCountObservable, this._store);
		this._allVisibleCheckedObservable = observableValue("AllVisibleChecked", false);
		this.onChangedAllVisibleChecked = Event.fromObservable(this._allVisibleCheckedObservable, this._store);
		this._checkedCountObservable = observableValue("CheckedCount", 0);
		this.onChangedCheckedCount = Event.fromObservable(this._checkedCountObservable, this._store);
		this._checkedElementsObservable = observableValueOpts({ equalsFn: equals }, new Array());
		this.onChangedCheckedElements = Event.fromObservable(this._checkedElementsObservable, this._store);
		this._onButtonTriggered = new Emitter$1();
		this.onButtonTriggered = this._onButtonTriggered.event;
		this._onSeparatorButtonTriggered = new Emitter$1();
		this.onSeparatorButtonTriggered = this._onSeparatorButtonTriggered.event;
		this._elementChecked = new Emitter$1();
		this._elementCheckedEventBufferer = new EventBufferer();
		this._hasCheckboxes = false;
		this._inputElements = new Array();
		this._elementTree = new Array();
		this._itemElements = new Array();
		this._elementDisposable = this._register(new DisposableStore());
		this._matchOnDescription = false;
		this._matchOnDetail = false;
		this._matchOnLabel = true;
		this._matchOnLabelMode = "fuzzy";
		this._sortByLabel = true;
		this._shouldLoop = true;
		this._container = append(this.parent, $$2(".quick-input-list"));
		this._separatorRenderer = new QuickPickSeparatorElementRenderer(hoverDelegate);
		this._itemRenderer = instantiationService.createInstance(QuickPickItemElementRenderer, hoverDelegate);
		this._tree = this._register(instantiationService.createInstance(WorkbenchObjectTree, "QuickInput", this._container, new QuickInputItemDelegate(), [this._itemRenderer, this._separatorRenderer], {
			filter: { filter(element) {
				return element.hidden ? 0 : element instanceof QuickPickSeparatorElement ? 2 : 1;
			} },
			sorter: { compare: (element, otherElement) => {
				if (!this.sortByLabel || !this._lastQueryString) return 0;
				const normalizedSearchValue = this._lastQueryString.toLowerCase();
				return compareEntries(element, otherElement, normalizedSearchValue);
			} },
			accessibilityProvider: new QuickInputAccessibilityProvider(),
			setRowLineHeight: false,
			multipleSelectionSupport: false,
			hideTwistiesOfChildlessElements: true,
			renderIndentGuides: RenderIndentGuides.None,
			findWidgetEnabled: false,
			indent: 0,
			horizontalScrolling: false,
			allowNonCollapsibleParents: true,
			alwaysConsumeMouseWheel: true
		}));
		this._tree.getHTMLElement().id = id;
		this._registerListeners();
	}
	get onDidChangeFocus() {
		return Event.map(this._tree.onDidChangeFocus, (e) => e.elements.filter((e$1) => e$1 instanceof QuickPickItemElement).map((e$1) => e$1.item), this._store);
	}
	get onDidChangeSelection() {
		return Event.map(this._tree.onDidChangeSelection, (e) => ({
			items: e.elements.filter((e$1) => e$1 instanceof QuickPickItemElement).map((e$1) => e$1.item),
			event: e.browserEvent
		}), this._store);
	}
	get displayed() {
		return this._container.style.display !== "none";
	}
	set displayed(value) {
		this._container.style.display = value ? "" : "none";
	}
	get scrollTop() {
		return this._tree.scrollTop;
	}
	set scrollTop(scrollTop) {
		this._tree.scrollTop = scrollTop;
	}
	get ariaLabel() {
		return this._tree.ariaLabel;
	}
	set ariaLabel(label) {
		this._tree.ariaLabel = label ?? "";
	}
	set enabled(value) {
		this._tree.getHTMLElement().style.pointerEvents = value ? "" : "none";
	}
	get matchOnDescription() {
		return this._matchOnDescription;
	}
	set matchOnDescription(value) {
		this._matchOnDescription = value;
	}
	get matchOnDetail() {
		return this._matchOnDetail;
	}
	set matchOnDetail(value) {
		this._matchOnDetail = value;
	}
	get matchOnLabel() {
		return this._matchOnLabel;
	}
	set matchOnLabel(value) {
		this._matchOnLabel = value;
	}
	get matchOnLabelMode() {
		return this._matchOnLabelMode;
	}
	set matchOnLabelMode(value) {
		this._matchOnLabelMode = value;
	}
	get sortByLabel() {
		return this._sortByLabel;
	}
	set sortByLabel(value) {
		this._sortByLabel = value;
	}
	get shouldLoop() {
		return this._shouldLoop;
	}
	set shouldLoop(value) {
		this._shouldLoop = value;
	}
	_registerListeners() {
		this._registerOnKeyDown();
		this._registerOnContainerClick();
		this._registerOnMouseMiddleClick();
		this._registerOnTreeModelChanged();
		this._registerOnElementChecked();
		this._registerOnContextMenu();
		this._registerHoverListeners();
		this._registerSelectionChangeListener();
		this._registerSeparatorActionShowingListeners();
	}
	_registerOnKeyDown() {
		this._register(this._tree.onKeyDown((e) => {
			const event = new StandardKeyboardEvent(e);
			switch (event.keyCode) {
				case 10:
					this.toggleCheckbox();
					break;
			}
			this._onKeyDown.fire(event);
		}));
	}
	_registerOnContainerClick() {
		this._register(addDisposableListener(this._container, EventType$1.CLICK, (e) => {
			if (e.x || e.y) this._onLeave.fire();
		}));
	}
	_registerOnMouseMiddleClick() {
		this._register(addDisposableListener(this._container, EventType$1.AUXCLICK, (e) => {
			if (e.button === 1) this._onLeave.fire();
		}));
	}
	_registerOnTreeModelChanged() {
		this._register(this._tree.onDidChangeModel(() => {
			const visibleCount = this._itemElements.filter((e) => !e.hidden).length;
			this._visibleCountObservable.set(visibleCount, void 0);
			if (this._hasCheckboxes) this._updateCheckedObservables();
		}));
	}
	_registerOnElementChecked() {
		this._register(this._elementCheckedEventBufferer.wrapEvent(this._elementChecked.event, (_, e) => e)((_) => this._updateCheckedObservables()));
	}
	_registerOnContextMenu() {
		this._register(this._tree.onContextMenu((e) => {
			if (e.element) {
				e.browserEvent.preventDefault();
				this._tree.setSelection([e.element]);
			}
		}));
	}
	_registerHoverListeners() {
		const delayer = this._register(new ThrottledDelayer(this.hoverDelegate.delay));
		this._register(this._tree.onMouseOver(async (e) => {
			if (isHTMLAnchorElement(e.browserEvent.target)) {
				delayer.cancel();
				return;
			}
			if (!isHTMLAnchorElement(e.browserEvent.relatedTarget) && isAncestor(e.browserEvent.relatedTarget, e.element?.element)) return;
			try {
				await delayer.trigger(async () => {
					if (e.element instanceof QuickPickItemElement) this.showHover(e.element);
				});
			} catch (e$1) {
				if (!isCancellationError(e$1)) throw e$1;
			}
		}));
		this._register(this._tree.onMouseOut((e) => {
			if (isAncestor(e.browserEvent.relatedTarget, e.element?.element)) return;
			delayer.cancel();
		}));
	}
	/**
	* Register's focus change and mouse events so that we can track when items inside of a
	* separator's section are focused or hovered so that we can display the separator's actions
	*/
	_registerSeparatorActionShowingListeners() {
		this._register(this._tree.onDidChangeFocus((e) => {
			const parent = e.elements[0] ? this._tree.getParentElement(e.elements[0]) : null;
			for (const separator of this._separatorRenderer.visibleSeparators) {
				const value = separator === parent;
				if (!!(separator.focusInsideSeparator & QuickPickSeparatorFocusReason.ACTIVE_ITEM) !== value) {
					if (value) separator.focusInsideSeparator |= QuickPickSeparatorFocusReason.ACTIVE_ITEM;
					else separator.focusInsideSeparator &= ~QuickPickSeparatorFocusReason.ACTIVE_ITEM;
					this._tree.rerender(separator);
				}
			}
		}));
		this._register(this._tree.onMouseOver((e) => {
			const parent = e.element ? this._tree.getParentElement(e.element) : null;
			for (const separator of this._separatorRenderer.visibleSeparators) {
				if (separator !== parent) continue;
				if (!!!(separator.focusInsideSeparator & QuickPickSeparatorFocusReason.MOUSE_HOVER)) {
					separator.focusInsideSeparator |= QuickPickSeparatorFocusReason.MOUSE_HOVER;
					this._tree.rerender(separator);
				}
			}
		}));
		this._register(this._tree.onMouseOut((e) => {
			const parent = e.element ? this._tree.getParentElement(e.element) : null;
			for (const separator of this._separatorRenderer.visibleSeparators) {
				if (separator !== parent) continue;
				if (!!(separator.focusInsideSeparator & QuickPickSeparatorFocusReason.MOUSE_HOVER)) {
					separator.focusInsideSeparator &= ~QuickPickSeparatorFocusReason.MOUSE_HOVER;
					this._tree.rerender(separator);
				}
			}
		}));
	}
	_registerSelectionChangeListener() {
		this._register(this._tree.onDidChangeSelection((e) => {
			const elementsWithoutSeparators = e.elements.filter((e$1) => e$1 instanceof QuickPickItemElement);
			if (elementsWithoutSeparators.length !== e.elements.length) {
				if (e.elements.length === 1 && e.elements[0] instanceof QuickPickSeparatorElement) {
					this._tree.setFocus([e.elements[0].children[0]]);
					this._tree.reveal(e.elements[0], 0);
				}
				this._tree.setSelection(elementsWithoutSeparators);
			}
		}));
	}
	setAllVisibleChecked(checked) {
		this._elementCheckedEventBufferer.bufferEvents(() => {
			this._itemElements.forEach((element) => {
				if (!element.hidden && !element.checkboxDisabled) element.checked = checked;
			});
		});
	}
	setElements(inputElements) {
		this._elementDisposable.clear();
		this._lastQueryString = void 0;
		this._inputElements = inputElements;
		this._hasCheckboxes = this.parent.classList.contains("show-checkboxes");
		let currentSeparatorElement;
		this._itemElements = new Array();
		this._elementTree = inputElements.reduce((result, item, index) => {
			let element;
			if (item.type === "separator") {
				if (!item.buttons) return result;
				currentSeparatorElement = new QuickPickSeparatorElement(index, (e) => this._onSeparatorButtonTriggered.fire(e), item);
				element = currentSeparatorElement;
			} else {
				const previous = index > 0 ? inputElements[index - 1] : void 0;
				let separator;
				if (previous && previous.type === "separator" && !previous.buttons) {
					currentSeparatorElement = void 0;
					separator = previous;
				}
				const qpi = new QuickPickItemElement(index, this._hasCheckboxes, (e) => this._onButtonTriggered.fire(e), this._elementChecked, item, separator);
				this._itemElements.push(qpi);
				if (currentSeparatorElement) {
					currentSeparatorElement.children.push(qpi);
					return result;
				}
				element = qpi;
			}
			result.push(element);
			return result;
		}, new Array());
		this._setElementsToTree(this._elementTree);
		if (this.accessibilityService.isScreenReaderOptimized()) setTimeout(() => {
			const focusedElement = this._tree.getHTMLElement().querySelector(`.monaco-list-row.focused`);
			const parent = focusedElement?.parentNode;
			if (focusedElement && parent) {
				const nextSibling = focusedElement.nextSibling;
				focusedElement.remove();
				parent.insertBefore(focusedElement, nextSibling);
			}
		}, 0);
	}
	setFocusedElements(items) {
		const elements = items.map((item) => this._itemElements.find((e) => e.item === item)).filter((e) => !!e).filter((e) => !e.hidden);
		this._tree.setFocus(elements);
		if (items.length > 0) {
			const focused = this._tree.getFocus()[0];
			if (focused) this._tree.reveal(focused);
		}
	}
	getActiveDescendant() {
		return this._tree.getHTMLElement().getAttribute("aria-activedescendant");
	}
	setSelectedElements(items) {
		const elements = items.map((item) => this._itemElements.find((e) => e.item === item)).filter((e) => !!e);
		this._tree.setSelection(elements);
	}
	getCheckedElements() {
		return this._itemElements.filter((e) => e.checked).map((e) => e.item);
	}
	setCheckedElements(items) {
		this._elementCheckedEventBufferer.bufferEvents(() => {
			const checked = /* @__PURE__ */ new Set();
			for (const item of items) checked.add(item);
			for (const element of this._itemElements) element.checked = checked.has(element.item);
		});
	}
	focus(what) {
		if (!this._itemElements.length) return;
		if (what === QuickPickFocus.Second && this._itemElements.length < 2) what = QuickPickFocus.First;
		switch (what) {
			case QuickPickFocus.First:
				this._tree.scrollTop = 0;
				this._tree.focusFirst(void 0, (e) => e.element instanceof QuickPickItemElement);
				break;
			case QuickPickFocus.Second: {
				this._tree.scrollTop = 0;
				let isSecondItem = false;
				this._tree.focusFirst(void 0, (e) => {
					if (!(e.element instanceof QuickPickItemElement)) return false;
					if (isSecondItem) return true;
					isSecondItem = !isSecondItem;
					return false;
				});
				break;
			}
			case QuickPickFocus.Last:
				this._tree.scrollTop = this._tree.scrollHeight;
				this._tree.focusLast(void 0, (e) => e.element instanceof QuickPickItemElement);
				break;
			case QuickPickFocus.Next: {
				const prevFocus = this._tree.getFocus();
				this._tree.focusNext(void 0, this._shouldLoop, void 0, (e) => {
					if (!(e.element instanceof QuickPickItemElement)) return false;
					this._tree.reveal(e.element);
					return true;
				});
				const currentFocus = this._tree.getFocus();
				if (prevFocus.length && prevFocus[0] === currentFocus[0] && prevFocus[0] === this._itemElements[this._itemElements.length - 1]) this._onLeave.fire();
				break;
			}
			case QuickPickFocus.Previous: {
				const prevFocus = this._tree.getFocus();
				this._tree.focusPrevious(void 0, this._shouldLoop, void 0, (e) => {
					if (!(e.element instanceof QuickPickItemElement)) return false;
					const parent = this._tree.getParentElement(e.element);
					if (parent === null || parent.children[0] !== e.element) this._tree.reveal(e.element);
					else this._tree.reveal(parent);
					return true;
				});
				const currentFocus = this._tree.getFocus();
				if (prevFocus.length && prevFocus[0] === currentFocus[0] && prevFocus[0] === this._itemElements[0]) this._onLeave.fire();
				break;
			}
			case QuickPickFocus.NextPage:
				this._tree.focusNextPage(void 0, (e) => {
					if (!(e.element instanceof QuickPickItemElement)) return false;
					this._tree.reveal(e.element);
					return true;
				});
				break;
			case QuickPickFocus.PreviousPage:
				this._tree.focusPreviousPage(void 0, (e) => {
					if (!(e.element instanceof QuickPickItemElement)) return false;
					const parent = this._tree.getParentElement(e.element);
					if (parent === null || parent.children[0] !== e.element) this._tree.reveal(e.element);
					else this._tree.reveal(parent);
					return true;
				});
				break;
			case QuickPickFocus.NextSeparator: {
				let foundSeparatorAsItem = false;
				const before = this._tree.getFocus()[0];
				this._tree.focusNext(void 0, true, void 0, (e) => {
					if (foundSeparatorAsItem) return true;
					if (e.element instanceof QuickPickSeparatorElement) {
						foundSeparatorAsItem = true;
						if (this._separatorRenderer.isSeparatorVisible(e.element)) this._tree.reveal(e.element.children[0]);
						else this._tree.reveal(e.element, 0);
					} else if (e.element instanceof QuickPickItemElement) {
						if (e.element.separator) {
							if (this._itemRenderer.isItemWithSeparatorVisible(e.element)) this._tree.reveal(e.element);
							else this._tree.reveal(e.element, 0);
							return true;
						} else if (e.element === this._elementTree[0]) {
							this._tree.reveal(e.element, 0);
							return true;
						}
					}
					return false;
				});
				const after = this._tree.getFocus()[0];
				if (before === after) {
					this._tree.scrollTop = this._tree.scrollHeight;
					this._tree.focusLast(void 0, (e) => e.element instanceof QuickPickItemElement);
				}
				break;
			}
			case QuickPickFocus.PreviousSeparator: {
				let focusElement;
				let foundSeparator = !!this._tree.getFocus()[0]?.separator;
				this._tree.focusPrevious(void 0, true, void 0, (e) => {
					if (e.element instanceof QuickPickSeparatorElement) if (foundSeparator) {
						if (!focusElement) {
							if (this._separatorRenderer.isSeparatorVisible(e.element)) this._tree.reveal(e.element);
							else this._tree.reveal(e.element, 0);
							focusElement = e.element.children[0];
						}
					} else foundSeparator = true;
					else if (e.element instanceof QuickPickItemElement) {
						if (!focusElement) {
							if (e.element.separator) {
								if (this._itemRenderer.isItemWithSeparatorVisible(e.element)) this._tree.reveal(e.element);
								else this._tree.reveal(e.element, 0);
								focusElement = e.element;
							} else if (e.element === this._elementTree[0]) {
								this._tree.reveal(e.element, 0);
								return true;
							}
						}
					}
					return false;
				});
				if (focusElement) this._tree.setFocus([focusElement]);
				break;
			}
		}
	}
	clearFocus() {
		this._tree.setFocus([]);
	}
	domFocus() {
		this._tree.domFocus();
	}
	layout(maxHeight) {
		this._tree.getHTMLElement().style.maxHeight = maxHeight ? `${Math.floor(maxHeight / 44) * 44 + 6}px` : "";
		this._tree.layout();
	}
	filter(query) {
		this._lastQueryString = query;
		if (!(this._sortByLabel || this._matchOnLabel || this._matchOnDescription || this._matchOnDetail)) {
			this._tree.layout();
			return false;
		}
		const queryWithWhitespace = query;
		query = query.trim();
		if (!query || !(this.matchOnLabel || this.matchOnDescription || this.matchOnDetail)) this._itemElements.forEach((element) => {
			element.labelHighlights = void 0;
			element.descriptionHighlights = void 0;
			element.detailHighlights = void 0;
			element.hidden = false;
			const previous = element.index && this._inputElements[element.index - 1];
			if (element.item) element.separator = previous && previous.type === "separator" && !previous.buttons ? previous : void 0;
		});
		else {
			let currentSeparator;
			this._itemElements.forEach((element) => {
				let labelHighlights;
				if (this.matchOnLabelMode === "fuzzy") labelHighlights = this.matchOnLabel ? matchesFuzzyIconAware(query, parseLabelWithIcons(element.saneLabel)) ?? void 0 : void 0;
				else labelHighlights = this.matchOnLabel ? matchesContiguousIconAware(queryWithWhitespace, parseLabelWithIcons(element.saneLabel)) ?? void 0 : void 0;
				const descriptionHighlights = this.matchOnDescription ? matchesFuzzyIconAware(query, parseLabelWithIcons(element.saneDescription || "")) ?? void 0 : void 0;
				const detailHighlights = this.matchOnDetail ? matchesFuzzyIconAware(query, parseLabelWithIcons(element.saneDetail || "")) ?? void 0 : void 0;
				if (labelHighlights || descriptionHighlights || detailHighlights) {
					element.labelHighlights = labelHighlights;
					element.descriptionHighlights = descriptionHighlights;
					element.detailHighlights = detailHighlights;
					element.hidden = false;
				} else {
					element.labelHighlights = void 0;
					element.descriptionHighlights = void 0;
					element.detailHighlights = void 0;
					element.hidden = element.item ? !element.item.alwaysShow : true;
				}
				if (element.item) element.separator = void 0;
				else if (element.separator) element.hidden = true;
				if (!this.sortByLabel) {
					const previous = element.index && this._inputElements[element.index - 1] || void 0;
					if (previous?.type === "separator" && !previous.buttons) currentSeparator = previous;
					if (currentSeparator && !element.hidden) {
						element.separator = currentSeparator;
						currentSeparator = void 0;
					}
				}
			});
		}
		this._setElementsToTree(this._sortByLabel && query ? this._itemElements : this._elementTree);
		this._tree.layout();
		return true;
	}
	toggleCheckbox() {
		this._elementCheckedEventBufferer.bufferEvents(() => {
			const elements = this._tree.getFocus().filter((e) => e instanceof QuickPickItemElement);
			const allChecked = this._allVisibleChecked(elements);
			for (const element of elements) if (!element.checkboxDisabled) element.checked = !allChecked;
		});
	}
	style(styles) {
		this._tree.style(styles);
	}
	toggleHover() {
		const focused = this._tree.getFocus()[0];
		if (!focused?.saneTooltip || !(focused instanceof QuickPickItemElement)) return;
		if (this._lastHover && !this._lastHover.isDisposed) {
			this._lastHover.dispose();
			return;
		}
		this.showHover(focused);
		const store = new DisposableStore();
		store.add(this._tree.onDidChangeFocus((e) => {
			if (e.elements[0] instanceof QuickPickItemElement) this.showHover(e.elements[0]);
		}));
		if (this._lastHover) store.add(this._lastHover);
		this._elementDisposable.add(store);
	}
	_setElementsToTree(elements) {
		const treeElements = new Array();
		for (const element of elements) if (element instanceof QuickPickSeparatorElement) treeElements.push({
			element,
			collapsible: false,
			collapsed: false,
			children: element.children.map((e) => ({
				element: e,
				collapsible: false,
				collapsed: false
			}))
		});
		else treeElements.push({
			element,
			collapsible: false,
			collapsed: false
		});
		this._tree.setChildren(null, treeElements);
	}
	_allVisibleChecked(elements, whenNoneVisible = true) {
		for (let i = 0, n = elements.length; i < n; i++) {
			const element = elements[i];
			if (!element.hidden) if (!element.checked) return false;
			else whenNoneVisible = true;
		}
		return whenNoneVisible;
	}
	_updateCheckedObservables() {
		transaction((tx) => {
			this._allVisibleCheckedObservable.set(this._allVisibleChecked(this._itemElements, false), tx);
			const checkedCount = this._itemElements.filter((element) => element.checked).length;
			this._checkedCountObservable.set(checkedCount, tx);
			this._checkedElementsObservable.set(this.getCheckedElements(), tx);
		});
	}
	/**
	* Disposes of the hover and shows a new one for the given index if it has a tooltip.
	* @param element The element to show the hover for
	*/
	showHover(element) {
		if (this._lastHover && !this._lastHover.isDisposed) {
			this.hoverDelegate.onDidHideHover?.();
			this._lastHover?.dispose();
		}
		if (!element.element || !element.saneTooltip) return;
		this._lastHover = this.hoverDelegate.showHover({
			content: element.saneTooltip,
			target: element.element,
			linkHandler: (url) => {
				this.linkOpenerDelegate(url);
			},
			appearance: { showPointer: true },
			container: this._container,
			position: { hoverPosition: 1 }
		}, false);
	}
};
__decorate$12([memoize], QuickInputTree.prototype, "onDidChangeFocus", null);
__decorate$12([memoize], QuickInputTree.prototype, "onDidChangeSelection", null);
QuickInputTree = __decorate$12([__param$12(4, IInstantiationService), __param$12(5, IAccessibilityService)], QuickInputTree);
function matchesContiguousIconAware(query, target) {
	const { text, iconOffsets } = target;
	if (!iconOffsets || iconOffsets.length === 0) return matchesContiguous(query, text);
	const wordToMatchAgainstWithoutIconsTrimmed = ltrim(text, " ");
	const leadingWhitespaceOffset = text.length - wordToMatchAgainstWithoutIconsTrimmed.length;
	const matches = matchesContiguous(query, wordToMatchAgainstWithoutIconsTrimmed);
	if (matches) for (const match of matches) {
		const iconOffset = iconOffsets[match.start + leadingWhitespaceOffset] + leadingWhitespaceOffset;
		match.start += iconOffset;
		match.end += iconOffset;
	}
	return matches;
}
function matchesContiguous(word, wordToMatchAgainst) {
	const matchIndex = wordToMatchAgainst.toLowerCase().indexOf(word.toLowerCase());
	if (matchIndex !== -1) return [{
		start: matchIndex,
		end: matchIndex + word.length
	}];
	return null;
}
function compareEntries(elementA, elementB, lookFor) {
	const labelHighlightsA = elementA.labelHighlights || [];
	const labelHighlightsB = elementB.labelHighlights || [];
	if (labelHighlightsA.length && !labelHighlightsB.length) return -1;
	if (!labelHighlightsA.length && labelHighlightsB.length) return 1;
	if (labelHighlightsA.length === 0 && labelHighlightsB.length === 0) return 0;
	return compareAnything(elementA.saneSortLabel, elementB.saneSortLabel, lookFor);
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/quickinput/browser/quickInputActions.js
var defaultCommandAndKeybindingRule = {
	weight: 200,
	when: ContextKeyExpr.and(ContextKeyExpr.equals(quickInputTypeContextKeyValue, "quickPick"), inQuickInputContext),
	metadata: { description: localize("quickPick", "Used while in the context of the quick pick. If you change one keybinding for this command, you should change all of the other keybindings (modifier variants) of this command as well.") }
};
function registerQuickPickCommandAndKeybindingRule(rule, options = {}) {
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		...defaultCommandAndKeybindingRule,
		...rule,
		secondary: getSecondary(rule.primary, rule.secondary ?? [], options)
	});
}
var ctrlKeyMod = isMacintosh ? 256 : 2048;
function getSecondary(primary, secondary, options = {}) {
	if (options.withAltMod) secondary.push(512 + primary);
	if (options.withCtrlMod) {
		secondary.push(ctrlKeyMod + primary);
		if (options.withAltMod) secondary.push(512 + ctrlKeyMod + primary);
	}
	if (options.withCmdMod && isMacintosh) {
		secondary.push(2048 + primary);
		if (options.withCtrlMod) secondary.push(2304 + primary);
		if (options.withAltMod) {
			secondary.push(2560 + primary);
			if (options.withCtrlMod) secondary.push(2816 + primary);
		}
	}
	return secondary;
}
function focusHandler(focus, focusOnQuickNatigate) {
	return (accessor) => {
		const currentQuickPick = accessor.get(IQuickInputService).currentQuickInput;
		if (!currentQuickPick) return;
		if (focusOnQuickNatigate && currentQuickPick.quickNavigate) return currentQuickPick.focus(focusOnQuickNatigate);
		return currentQuickPick.focus(focus);
	};
}
registerQuickPickCommandAndKeybindingRule({
	id: "quickInput.pageNext",
	primary: 12,
	handler: focusHandler(QuickPickFocus.NextPage)
}, {
	withAltMod: true,
	withCtrlMod: true,
	withCmdMod: true
});
registerQuickPickCommandAndKeybindingRule({
	id: "quickInput.pagePrevious",
	primary: 11,
	handler: focusHandler(QuickPickFocus.PreviousPage)
}, {
	withAltMod: true,
	withCtrlMod: true,
	withCmdMod: true
});
registerQuickPickCommandAndKeybindingRule({
	id: "quickInput.first",
	primary: ctrlKeyMod + 14,
	handler: focusHandler(QuickPickFocus.First)
}, {
	withAltMod: true,
	withCmdMod: true
});
registerQuickPickCommandAndKeybindingRule({
	id: "quickInput.last",
	primary: ctrlKeyMod + 13,
	handler: focusHandler(QuickPickFocus.Last)
}, {
	withAltMod: true,
	withCmdMod: true
});
registerQuickPickCommandAndKeybindingRule({
	id: "quickInput.next",
	primary: 18,
	handler: focusHandler(QuickPickFocus.Next)
}, { withCtrlMod: true });
registerQuickPickCommandAndKeybindingRule({
	id: "quickInput.previous",
	primary: 16,
	handler: focusHandler(QuickPickFocus.Previous)
}, { withCtrlMod: true });
var nextSeparatorFallbackDesc = localize("quickInput.nextSeparatorWithQuickAccessFallback", "If we're in quick access mode, this will navigate to the next item. If we are not in quick access mode, this will navigate to the next separator.");
var prevSeparatorFallbackDesc = localize("quickInput.previousSeparatorWithQuickAccessFallback", "If we're in quick access mode, this will navigate to the previous item. If we are not in quick access mode, this will navigate to the previous separator.");
if (isMacintosh) {
	registerQuickPickCommandAndKeybindingRule({
		id: "quickInput.nextSeparatorWithQuickAccessFallback",
		primary: 2066,
		handler: focusHandler(QuickPickFocus.NextSeparator, QuickPickFocus.Next),
		metadata: { description: nextSeparatorFallbackDesc }
	});
	registerQuickPickCommandAndKeybindingRule({
		id: "quickInput.nextSeparator",
		primary: 2578,
		secondary: [2322],
		handler: focusHandler(QuickPickFocus.NextSeparator)
	}, { withCtrlMod: true });
	registerQuickPickCommandAndKeybindingRule({
		id: "quickInput.previousSeparatorWithQuickAccessFallback",
		primary: 2064,
		handler: focusHandler(QuickPickFocus.PreviousSeparator, QuickPickFocus.Previous),
		metadata: { description: prevSeparatorFallbackDesc }
	});
	registerQuickPickCommandAndKeybindingRule({
		id: "quickInput.previousSeparator",
		primary: 2576,
		secondary: [2320],
		handler: focusHandler(QuickPickFocus.PreviousSeparator)
	}, { withCtrlMod: true });
} else {
	registerQuickPickCommandAndKeybindingRule({
		id: "quickInput.nextSeparatorWithQuickAccessFallback",
		primary: 530,
		handler: focusHandler(QuickPickFocus.NextSeparator, QuickPickFocus.Next),
		metadata: { description: nextSeparatorFallbackDesc }
	});
	registerQuickPickCommandAndKeybindingRule({
		id: "quickInput.nextSeparator",
		primary: 2578,
		handler: focusHandler(QuickPickFocus.NextSeparator)
	});
	registerQuickPickCommandAndKeybindingRule({
		id: "quickInput.previousSeparatorWithQuickAccessFallback",
		primary: 528,
		handler: focusHandler(QuickPickFocus.PreviousSeparator, QuickPickFocus.Previous),
		metadata: { description: prevSeparatorFallbackDesc }
	});
	registerQuickPickCommandAndKeybindingRule({
		id: "quickInput.previousSeparator",
		primary: 2576,
		handler: focusHandler(QuickPickFocus.PreviousSeparator)
	});
}
registerQuickPickCommandAndKeybindingRule({
	id: "quickInput.acceptInBackground",
	when: ContextKeyExpr.and(defaultCommandAndKeybindingRule.when, ContextKeyExpr.or(InputFocusedContext.negate(), endOfQuickInputBoxContext)),
	primary: 17,
	weight: 250,
	handler: (accessor) => {
		accessor.get(IQuickInputService).currentQuickInput?.accept(true);
	}
}, {
	withAltMod: true,
	withCtrlMod: true,
	withCmdMod: true
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/quickinput/browser/quickInputController.js
var __decorate$11 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$11 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var QuickInputController_1;
var $$1 = $;
var QuickInputController = class QuickInputController$1 extends Disposable {
	static {
		QuickInputController_1 = this;
	}
	static {
		this.MAX_WIDTH = 600;
	}
	get currentQuickInput() {
		return this.controller ?? void 0;
	}
	get container() {
		return this._container;
	}
	constructor(options, layoutService, instantiationService, contextKeyService) {
		super();
		this.options = options;
		this.layoutService = layoutService;
		this.instantiationService = instantiationService;
		this.contextKeyService = contextKeyService;
		this.enabled = true;
		this.onDidAcceptEmitter = this._register(new Emitter$1());
		this.onDidCustomEmitter = this._register(new Emitter$1());
		this.onDidTriggerButtonEmitter = this._register(new Emitter$1());
		this.keyMods = {
			ctrlCmd: false,
			alt: false
		};
		this.controller = null;
		this.onShowEmitter = this._register(new Emitter$1());
		this.onShow = this.onShowEmitter.event;
		this.onHideEmitter = this._register(new Emitter$1());
		this.onHide = this.onHideEmitter.event;
		this.inQuickInputContext = InQuickInputContextKey.bindTo(this.contextKeyService);
		this.quickInputTypeContext = QuickInputTypeContextKey.bindTo(this.contextKeyService);
		this.endOfQuickInputBoxContext = EndOfQuickInputBoxContextKey.bindTo(this.contextKeyService);
		this.idPrefix = options.idPrefix;
		this._container = options.container;
		this.styles = options.styles;
		this._register(Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => this.registerKeyModsListeners(window, disposables), {
			window: mainWindow,
			disposables: this._store
		}));
		this._register(onWillUnregisterWindow((window) => {
			if (this.ui && getWindow(this.ui.container) === window) {
				this.reparentUI(this.layoutService.mainContainer);
				this.layout(this.layoutService.mainContainerDimension, this.layoutService.mainContainerOffset.quickPickTop);
			}
		}));
	}
	registerKeyModsListeners(window, disposables) {
		const listener = (e) => {
			this.keyMods.ctrlCmd = e.ctrlKey || e.metaKey;
			this.keyMods.alt = e.altKey;
		};
		for (const event of [
			EventType$1.KEY_DOWN,
			EventType$1.KEY_UP,
			EventType$1.MOUSE_DOWN
		]) disposables.add(addDisposableListener(window, event, listener, true));
	}
	getUI(showInActiveContainer) {
		if (this.ui) {
			if (showInActiveContainer) {
				if (getWindow(this._container) !== getWindow(this.layoutService.activeContainer)) {
					this.reparentUI(this.layoutService.activeContainer);
					this.layout(this.layoutService.activeContainerDimension, this.layoutService.activeContainerOffset.quickPickTop);
				}
			}
			return this.ui;
		}
		const container = append(this._container, $$1(".quick-input-widget.show-file-icons"));
		container.tabIndex = -1;
		container.style.display = "none";
		const styleSheet = createStyleSheet(container);
		const titleBar = append(container, $$1(".quick-input-titlebar"));
		const leftActionBar = this._register(new ActionBar(titleBar, { hoverDelegate: this.options.hoverDelegate }));
		leftActionBar.domNode.classList.add("quick-input-left-action-bar");
		const title = append(titleBar, $$1(".quick-input-title"));
		const rightActionBar = this._register(new ActionBar(titleBar, { hoverDelegate: this.options.hoverDelegate }));
		rightActionBar.domNode.classList.add("quick-input-right-action-bar");
		const headerContainer = append(container, $$1(".quick-input-header"));
		const checkAll = append(headerContainer, $$1("input.quick-input-check-all"));
		checkAll.type = "checkbox";
		checkAll.setAttribute("aria-label", localize("quickInput.checkAll", "Toggle all checkboxes"));
		this._register(addStandardDisposableListener(checkAll, EventType$1.CHANGE, (e) => {
			const checked = checkAll.checked;
			list.setAllVisibleChecked(checked);
		}));
		this._register(addDisposableListener(checkAll, EventType$1.CLICK, (e) => {
			if (e.x || e.y) inputBox.setFocus();
		}));
		const description2 = append(headerContainer, $$1(".quick-input-description"));
		const inputContainer = append(headerContainer, $$1(".quick-input-and-message"));
		const filterContainer = append(inputContainer, $$1(".quick-input-filter"));
		const inputBox = this._register(new QuickInputBox(filterContainer, this.styles.inputBox, this.styles.toggle));
		inputBox.setAttribute("aria-describedby", `${this.idPrefix}message`);
		const visibleCountContainer = append(filterContainer, $$1(".quick-input-visible-count"));
		visibleCountContainer.setAttribute("aria-live", "polite");
		visibleCountContainer.setAttribute("aria-atomic", "true");
		const visibleCount = new CountBadge(visibleCountContainer, { countFormat: localize({
			key: "quickInput.visibleCount",
			comment: ["This tells the user how many items are shown in a list of items to select from. The items can be anything. Currently not visible, but read by screen readers."]
		}, "{0} Results") }, this.styles.countBadge);
		const countContainer = append(filterContainer, $$1(".quick-input-count"));
		countContainer.setAttribute("aria-live", "polite");
		const count = new CountBadge(countContainer, { countFormat: localize({
			key: "quickInput.countSelected",
			comment: ["This tells the user how many items are selected in a list of items to select from. The items can be anything."]
		}, "{0} Selected") }, this.styles.countBadge);
		const inlineActionBar = this._register(new ActionBar(headerContainer, { hoverDelegate: this.options.hoverDelegate }));
		inlineActionBar.domNode.classList.add("quick-input-inline-action-bar");
		const okContainer = append(headerContainer, $$1(".quick-input-action"));
		const ok = this._register(new Button(okContainer, this.styles.button));
		ok.label = localize("ok", "OK");
		this._register(ok.onDidClick((e) => {
			this.onDidAcceptEmitter.fire();
		}));
		const customButtonContainer = append(headerContainer, $$1(".quick-input-action"));
		const customButton = this._register(new Button(customButtonContainer, {
			...this.styles.button,
			supportIcons: true
		}));
		customButton.label = localize("custom", "Custom");
		this._register(customButton.onDidClick((e) => {
			this.onDidCustomEmitter.fire();
		}));
		const message = append(inputContainer, $$1(`#${this.idPrefix}message.quick-input-message`));
		const progressBar = this._register(new ProgressBar(container, this.styles.progressBar));
		progressBar.getContainer().classList.add("quick-input-progress");
		const widget = append(container, $$1(".quick-input-html-widget"));
		widget.tabIndex = -1;
		const description1 = append(container, $$1(".quick-input-description"));
		const listId = this.idPrefix + "list";
		const list = this._register(this.instantiationService.createInstance(QuickInputTree, container, this.options.hoverDelegate, this.options.linkOpenerDelegate, listId));
		inputBox.setAttribute("aria-controls", listId);
		this._register(list.onDidChangeFocus(() => {
			inputBox.setAttribute("aria-activedescendant", list.getActiveDescendant() ?? "");
		}));
		this._register(list.onChangedAllVisibleChecked((checked) => {
			checkAll.checked = checked;
		}));
		this._register(list.onChangedVisibleCount((c) => {
			visibleCount.setCount(c);
		}));
		this._register(list.onChangedCheckedCount((c) => {
			count.setCount(c);
		}));
		this._register(list.onLeave(() => {
			setTimeout(() => {
				if (!this.controller) return;
				inputBox.setFocus();
				if (this.controller instanceof QuickPick && this.controller.canSelectMany) list.clearFocus();
			}, 0);
		}));
		const focusTracker = trackFocus(container);
		this._register(focusTracker);
		this._register(addDisposableListener(container, EventType$1.FOCUS, (e) => {
			const ui = this.getUI();
			if (isAncestor(e.relatedTarget, ui.inputContainer)) {
				const value = ui.inputBox.isSelectionAtEnd();
				if (this.endOfQuickInputBoxContext.get() !== value) this.endOfQuickInputBoxContext.set(value);
			}
			if (isAncestor(e.relatedTarget, ui.container)) return;
			this.inQuickInputContext.set(true);
			this.previousFocusElement = isHTMLElement(e.relatedTarget) ? e.relatedTarget : void 0;
		}, true));
		this._register(focusTracker.onDidBlur(() => {
			if (!this.getUI().ignoreFocusOut && !this.options.ignoreFocusOut()) this.hide(QuickInputHideReason.Blur);
			this.inQuickInputContext.set(false);
			this.endOfQuickInputBoxContext.set(false);
			this.previousFocusElement = void 0;
		}));
		this._register(inputBox.onKeyDown((_) => {
			const value = this.getUI().inputBox.isSelectionAtEnd();
			if (this.endOfQuickInputBoxContext.get() !== value) this.endOfQuickInputBoxContext.set(value);
		}));
		this._register(addDisposableListener(container, EventType$1.FOCUS, (e) => {
			inputBox.setFocus();
		}));
		this._register(addStandardDisposableListener(container, EventType$1.KEY_DOWN, (event) => {
			if (isAncestor(event.target, widget)) return;
			switch (event.keyCode) {
				case 3:
					EventHelper.stop(event, true);
					if (this.enabled) this.onDidAcceptEmitter.fire();
					break;
				case 9:
					EventHelper.stop(event, true);
					this.hide(QuickInputHideReason.Gesture);
					break;
				case 2:
					if (!event.altKey && !event.ctrlKey && !event.metaKey) {
						const selectors = [
							".quick-input-list .monaco-action-bar .always-visible",
							".quick-input-list-entry:hover .monaco-action-bar",
							".monaco-list-row.focused .monaco-action-bar"
						];
						if (container.classList.contains("show-checkboxes")) selectors.push("input");
						else selectors.push("input[type=text]");
						if (this.getUI().list.displayed) selectors.push(".monaco-list");
						if (this.getUI().message) selectors.push(".quick-input-message a");
						if (this.getUI().widget) {
							if (isAncestor(event.target, this.getUI().widget)) break;
							selectors.push(".quick-input-html-widget");
						}
						const stops = container.querySelectorAll(selectors.join(", "));
						if (event.shiftKey && event.target === stops[0]) {
							EventHelper.stop(event, true);
							list.clearFocus();
						} else if (!event.shiftKey && isAncestor(event.target, stops[stops.length - 1])) {
							EventHelper.stop(event, true);
							stops[0].focus();
						}
					}
					break;
				case 10:
					if (event.ctrlKey) {
						EventHelper.stop(event, true);
						this.getUI().list.toggleHover();
					}
					break;
			}
		}));
		this.ui = {
			container,
			styleSheet,
			leftActionBar,
			titleBar,
			title,
			description1,
			description2,
			widget,
			rightActionBar,
			inlineActionBar,
			checkAll,
			inputContainer,
			filterContainer,
			inputBox,
			visibleCountContainer,
			visibleCount,
			countContainer,
			count,
			okContainer,
			ok,
			message,
			customButtonContainer,
			customButton,
			list,
			progressBar,
			onDidAccept: this.onDidAcceptEmitter.event,
			onDidCustom: this.onDidCustomEmitter.event,
			onDidTriggerButton: this.onDidTriggerButtonEmitter.event,
			ignoreFocusOut: false,
			keyMods: this.keyMods,
			show: (controller) => this.show(controller),
			hide: () => this.hide(),
			setVisibilities: (visibilities) => this.setVisibilities(visibilities),
			setEnabled: (enabled) => this.setEnabled(enabled),
			setContextKey: (contextKey) => this.options.setContextKey(contextKey),
			linkOpenerDelegate: (content) => this.options.linkOpenerDelegate(content)
		};
		this.updateStyles();
		return this.ui;
	}
	reparentUI(container) {
		if (this.ui) {
			this._container = container;
			append(this._container, this.ui.container);
		}
	}
	pick(picks, options = {}, token = CancellationToken.None) {
		return new Promise((doResolve, reject) => {
			let resolve = (result) => {
				resolve = doResolve;
				options.onKeyMods?.(input.keyMods);
				doResolve(result);
			};
			if (token.isCancellationRequested) {
				resolve(void 0);
				return;
			}
			const input = this.createQuickPick({ useSeparators: true });
			let activeItem;
			const disposables = [
				input,
				input.onDidAccept(() => {
					if (input.canSelectMany) {
						resolve(input.selectedItems.slice());
						input.hide();
					} else {
						const result = input.activeItems[0];
						if (result) {
							resolve(result);
							input.hide();
						}
					}
				}),
				input.onDidChangeActive((items) => {
					const focused = items[0];
					if (focused && options.onDidFocus) options.onDidFocus(focused);
				}),
				input.onDidChangeSelection((items) => {
					if (!input.canSelectMany) {
						const result = items[0];
						if (result) {
							resolve(result);
							input.hide();
						}
					}
				}),
				input.onDidTriggerItemButton((event) => options.onDidTriggerItemButton && options.onDidTriggerItemButton({
					...event,
					removeItem: () => {
						const index = input.items.indexOf(event.item);
						if (index !== -1) {
							const items = input.items.slice();
							const removed = items.splice(index, 1);
							const activeItems = input.activeItems.filter((activeItem$1) => activeItem$1 !== removed[0]);
							const keepScrollPositionBefore = input.keepScrollPosition;
							input.keepScrollPosition = true;
							input.items = items;
							if (activeItems) input.activeItems = activeItems;
							input.keepScrollPosition = keepScrollPositionBefore;
						}
					}
				})),
				input.onDidTriggerSeparatorButton((event) => options.onDidTriggerSeparatorButton?.(event)),
				input.onDidChangeValue((value) => {
					if (activeItem && !value && (input.activeItems.length !== 1 || input.activeItems[0] !== activeItem)) input.activeItems = [activeItem];
				}),
				token.onCancellationRequested(() => {
					input.hide();
				}),
				input.onDidHide(() => {
					dispose(disposables);
					resolve(void 0);
				})
			];
			input.title = options.title;
			if (options.value) input.value = options.value;
			input.canSelectMany = !!options.canPickMany;
			input.placeholder = options.placeHolder;
			input.ignoreFocusOut = !!options.ignoreFocusLost;
			input.matchOnDescription = !!options.matchOnDescription;
			input.matchOnDetail = !!options.matchOnDetail;
			input.matchOnLabel = options.matchOnLabel === void 0 || options.matchOnLabel;
			input.quickNavigate = options.quickNavigate;
			input.hideInput = !!options.hideInput;
			input.contextKey = options.contextKey;
			input.busy = true;
			Promise.all([picks, options.activeItem]).then(([items, _activeItem]) => {
				activeItem = _activeItem;
				input.busy = false;
				input.items = items;
				if (input.canSelectMany) input.selectedItems = items.filter((item) => item.type !== "separator" && item.picked);
				if (activeItem) input.activeItems = [activeItem];
			});
			input.show();
			Promise.resolve(picks).then(void 0, (err) => {
				reject(err);
				input.hide();
			});
		});
	}
	createQuickPick(options = { useSeparators: false }) {
		const ui = this.getUI(true);
		return new QuickPick(ui);
	}
	createInputBox() {
		const ui = this.getUI(true);
		return new InputBox(ui);
	}
	show(controller) {
		const ui = this.getUI(true);
		this.onShowEmitter.fire();
		const oldController = this.controller;
		this.controller = controller;
		oldController?.didHide();
		this.setEnabled(true);
		ui.leftActionBar.clear();
		ui.title.textContent = "";
		ui.description1.textContent = "";
		ui.description2.textContent = "";
		reset(ui.widget);
		ui.rightActionBar.clear();
		ui.inlineActionBar.clear();
		ui.checkAll.checked = false;
		ui.inputBox.placeholder = "";
		ui.inputBox.password = false;
		ui.inputBox.showDecoration(severity_default.Ignore);
		ui.visibleCount.setCount(0);
		ui.count.setCount(0);
		reset(ui.message);
		ui.progressBar.stop();
		ui.list.setElements([]);
		ui.list.matchOnDescription = false;
		ui.list.matchOnDetail = false;
		ui.list.matchOnLabel = true;
		ui.list.sortByLabel = true;
		ui.ignoreFocusOut = false;
		ui.inputBox.toggles = void 0;
		const backKeybindingLabel = this.options.backKeybindingLabel();
		backButton.tooltip = backKeybindingLabel ? localize("quickInput.backWithKeybinding", "Back ({0})", backKeybindingLabel) : localize("quickInput.back", "Back");
		ui.container.style.display = "";
		this.updateLayout();
		ui.inputBox.setFocus();
		this.quickInputTypeContext.set(controller.type);
	}
	isVisible() {
		return !!this.ui && this.ui.container.style.display !== "none";
	}
	setVisibilities(visibilities) {
		const ui = this.getUI();
		ui.title.style.display = visibilities.title ? "" : "none";
		ui.description1.style.display = visibilities.description && (visibilities.inputBox || visibilities.checkAll) ? "" : "none";
		ui.description2.style.display = visibilities.description && !(visibilities.inputBox || visibilities.checkAll) ? "" : "none";
		ui.checkAll.style.display = visibilities.checkAll ? "" : "none";
		ui.inputContainer.style.display = visibilities.inputBox ? "" : "none";
		ui.filterContainer.style.display = visibilities.inputBox ? "" : "none";
		ui.visibleCountContainer.style.display = visibilities.visibleCount ? "" : "none";
		ui.countContainer.style.display = visibilities.count ? "" : "none";
		ui.okContainer.style.display = visibilities.ok ? "" : "none";
		ui.customButtonContainer.style.display = visibilities.customButton ? "" : "none";
		ui.message.style.display = visibilities.message ? "" : "none";
		ui.progressBar.getContainer().style.display = visibilities.progressBar ? "" : "none";
		ui.list.displayed = !!visibilities.list;
		ui.container.classList.toggle("show-checkboxes", !!visibilities.checkBox);
		ui.container.classList.toggle("hidden-input", !visibilities.inputBox && !visibilities.description);
		this.updateLayout();
	}
	setEnabled(enabled) {
		if (enabled !== this.enabled) {
			this.enabled = enabled;
			for (const item of this.getUI().leftActionBar.viewItems) item.action.enabled = enabled;
			for (const item of this.getUI().rightActionBar.viewItems) item.action.enabled = enabled;
			this.getUI().checkAll.disabled = !enabled;
			this.getUI().inputBox.enabled = enabled;
			this.getUI().ok.enabled = enabled;
			this.getUI().list.enabled = enabled;
		}
	}
	hide(reason) {
		const controller = this.controller;
		if (!controller) return;
		controller.willHide(reason);
		const container = this.ui?.container;
		const focusChanged = container && !isAncestorOfActiveElement(container);
		this.controller = null;
		this.onHideEmitter.fire();
		if (container) container.style.display = "none";
		if (!focusChanged) {
			let currentElement = this.previousFocusElement;
			while (currentElement && !currentElement.offsetParent) currentElement = currentElement.parentElement ?? void 0;
			if (currentElement?.offsetParent) {
				currentElement.focus();
				this.previousFocusElement = void 0;
			} else this.options.returnFocus();
		}
		controller.didHide(reason);
	}
	layout(dimension, titleBarOffset) {
		this.dimension = dimension;
		this.titleBarOffset = titleBarOffset;
		this.updateLayout();
	}
	updateLayout() {
		if (this.ui && this.isVisible()) {
			this.ui.container.style.top = `${this.titleBarOffset}px`;
			const style = this.ui.container.style;
			const width = Math.min(this.dimension.width * .62, QuickInputController_1.MAX_WIDTH);
			style.width = width + "px";
			style.marginLeft = "-" + width / 2 + "px";
			this.ui.inputBox.layout();
			this.ui.list.layout(this.dimension && this.dimension.height * .4);
		}
	}
	applyStyles(styles) {
		this.styles = styles;
		this.updateStyles();
	}
	updateStyles() {
		if (this.ui) {
			const { quickInputTitleBackground: quickInputTitleBackground$1, quickInputBackground: quickInputBackground$1, quickInputForeground: quickInputForeground$1, widgetBorder: widgetBorder$1, widgetShadow: widgetShadow$1 } = this.styles.widget;
			this.ui.titleBar.style.backgroundColor = quickInputTitleBackground$1 ?? "";
			this.ui.container.style.backgroundColor = quickInputBackground$1 ?? "";
			this.ui.container.style.color = quickInputForeground$1 ?? "";
			this.ui.container.style.border = widgetBorder$1 ? `1px solid ${widgetBorder$1}` : "";
			this.ui.container.style.boxShadow = widgetShadow$1 ? `0 0 8px 2px ${widgetShadow$1}` : "";
			this.ui.list.style(this.styles.list);
			const content = [];
			if (this.styles.pickerGroup.pickerGroupBorder) content.push(`.quick-input-list .quick-input-list-entry { border-top-color:  ${this.styles.pickerGroup.pickerGroupBorder}; }`);
			if (this.styles.pickerGroup.pickerGroupForeground) content.push(`.quick-input-list .quick-input-list-separator { color:  ${this.styles.pickerGroup.pickerGroupForeground}; }`);
			if (this.styles.pickerGroup.pickerGroupForeground) content.push(`.quick-input-list .quick-input-list-separator-as-item { color: var(--vscode-descriptionForeground); }`);
			if (this.styles.keybindingLabel.keybindingLabelBackground || this.styles.keybindingLabel.keybindingLabelBorder || this.styles.keybindingLabel.keybindingLabelBottomBorder || this.styles.keybindingLabel.keybindingLabelShadow || this.styles.keybindingLabel.keybindingLabelForeground) {
				content.push(".quick-input-list .monaco-keybinding > .monaco-keybinding-key {");
				if (this.styles.keybindingLabel.keybindingLabelBackground) content.push(`background-color: ${this.styles.keybindingLabel.keybindingLabelBackground};`);
				if (this.styles.keybindingLabel.keybindingLabelBorder) content.push(`border-color: ${this.styles.keybindingLabel.keybindingLabelBorder};`);
				if (this.styles.keybindingLabel.keybindingLabelBottomBorder) content.push(`border-bottom-color: ${this.styles.keybindingLabel.keybindingLabelBottomBorder};`);
				if (this.styles.keybindingLabel.keybindingLabelShadow) content.push(`box-shadow: inset 0 -1px 0 ${this.styles.keybindingLabel.keybindingLabelShadow};`);
				if (this.styles.keybindingLabel.keybindingLabelForeground) content.push(`color: ${this.styles.keybindingLabel.keybindingLabelForeground};`);
				content.push("}");
			}
			const newStyles = content.join("\n");
			if (newStyles !== this.ui.styleSheet.textContent) this.ui.styleSheet.textContent = newStyles;
		}
	}
};
QuickInputController = QuickInputController_1 = __decorate$11([
	__param$11(1, ILayoutService),
	__param$11(2, IInstantiationService),
	__param$11(3, IContextKeyService)
], QuickInputController);

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/quickinput/browser/quickInputService.js
var __decorate$10 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$10 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var QuickInputService = class QuickInputService$1 extends Themable {
	get controller() {
		if (!this._controller) this._controller = this._register(this.createController());
		return this._controller;
	}
	get hasController() {
		return !!this._controller;
	}
	get currentQuickInput() {
		return this.controller.currentQuickInput;
	}
	get quickAccess() {
		if (!this._quickAccess) this._quickAccess = this._register(this.instantiationService.createInstance(QuickAccessController));
		return this._quickAccess;
	}
	constructor(instantiationService, contextKeyService, themeService, layoutService, configurationService) {
		super(themeService);
		this.instantiationService = instantiationService;
		this.contextKeyService = contextKeyService;
		this.layoutService = layoutService;
		this.configurationService = configurationService;
		this._onShow = this._register(new Emitter$1());
		this._onHide = this._register(new Emitter$1());
		this.contexts = /* @__PURE__ */ new Map();
	}
	createController(host = this.layoutService, options) {
		const defaultOptions = {
			idPrefix: "quickInput_",
			container: host.activeContainer,
			ignoreFocusOut: () => false,
			backKeybindingLabel: () => void 0,
			setContextKey: (id) => this.setContextKey(id),
			linkOpenerDelegate: (content) => {
				this.instantiationService.invokeFunction((accessor) => {
					accessor.get(IOpenerService).open(content, {
						allowCommands: true,
						fromUserGesture: true
					});
				});
			},
			returnFocus: () => host.focus(),
			styles: this.computeStyles(),
			hoverDelegate: this._register(this.instantiationService.createInstance(QuickInputHoverDelegate))
		};
		const controller = this._register(this.instantiationService.createInstance(QuickInputController, {
			...defaultOptions,
			...options
		}));
		controller.layout(host.activeContainerDimension, host.activeContainerOffset.quickPickTop);
		this._register(host.onDidLayoutActiveContainer((dimension) => {
			if (getWindow(host.activeContainer) === getWindow(controller.container)) controller.layout(dimension, host.activeContainerOffset.quickPickTop);
		}));
		this._register(host.onDidChangeActiveContainer(() => {
			if (controller.isVisible()) return;
			controller.layout(host.activeContainerDimension, host.activeContainerOffset.quickPickTop);
		}));
		this._register(controller.onShow(() => {
			this.resetContextKeys();
			this._onShow.fire();
		}));
		this._register(controller.onHide(() => {
			this.resetContextKeys();
			this._onHide.fire();
		}));
		return controller;
	}
	setContextKey(id) {
		let key;
		if (id) {
			key = this.contexts.get(id);
			if (!key) {
				key = new RawContextKey(id, false).bindTo(this.contextKeyService);
				this.contexts.set(id, key);
			}
		}
		if (key && key.get()) return;
		this.resetContextKeys();
		key?.set(true);
	}
	resetContextKeys() {
		this.contexts.forEach((context) => {
			if (context.get()) context.reset();
		});
	}
	pick(picks, options, token = CancellationToken.None) {
		return this.controller.pick(picks, options, token);
	}
	createQuickPick(options = { useSeparators: false }) {
		return this.controller.createQuickPick(options);
	}
	createInputBox() {
		return this.controller.createInputBox();
	}
	updateStyles() {
		if (this.hasController) this.controller.applyStyles(this.computeStyles());
	}
	computeStyles() {
		return {
			widget: {
				quickInputBackground: asCssVariable(quickInputBackground),
				quickInputForeground: asCssVariable(quickInputForeground),
				quickInputTitleBackground: asCssVariable(quickInputTitleBackground),
				widgetBorder: asCssVariable(widgetBorder),
				widgetShadow: asCssVariable(widgetShadow)
			},
			inputBox: defaultInputBoxStyles,
			toggle: defaultToggleStyles,
			countBadge: defaultCountBadgeStyles,
			button: defaultButtonStyles,
			progressBar: defaultProgressBarStyles,
			keybindingLabel: defaultKeybindingLabelStyles,
			list: getListStyles({
				listBackground: quickInputBackground,
				listFocusBackground: quickInputListFocusBackground,
				listFocusForeground: quickInputListFocusForeground,
				listInactiveFocusForeground: quickInputListFocusForeground,
				listInactiveSelectionIconForeground: quickInputListFocusIconForeground,
				listInactiveFocusBackground: quickInputListFocusBackground,
				listFocusOutline: activeContrastBorder,
				listInactiveFocusOutline: activeContrastBorder
			}),
			pickerGroup: {
				pickerGroupBorder: asCssVariable(pickerGroupBorder),
				pickerGroupForeground: asCssVariable(pickerGroupForeground)
			}
		};
	}
};
QuickInputService = __decorate$10([
	__param$10(0, IInstantiationService),
	__param$10(1, IContextKeyService),
	__param$10(2, IThemeService),
	__param$10(3, ILayoutService),
	__param$10(4, IConfigurationService)
], QuickInputService);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickInput/standaloneQuickInputService.js
var __decorate$9 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$9 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var EditorScopedQuickInputService = class EditorScopedQuickInputService$1 extends QuickInputService {
	constructor(editor$1, instantiationService, contextKeyService, themeService, codeEditorService, configurationService) {
		super(instantiationService, contextKeyService, themeService, new EditorScopedLayoutService(editor$1.getContainerDomNode(), codeEditorService), configurationService);
		this.host = void 0;
		const contribution = QuickInputEditorContribution.get(editor$1);
		if (contribution) {
			const widget = contribution.widget;
			this.host = {
				_serviceBrand: void 0,
				get mainContainer() {
					return widget.getDomNode();
				},
				getContainer() {
					return widget.getDomNode();
				},
				whenContainerStylesLoaded() {},
				get containers() {
					return [widget.getDomNode()];
				},
				get activeContainer() {
					return widget.getDomNode();
				},
				get mainContainerDimension() {
					return editor$1.getLayoutInfo();
				},
				get activeContainerDimension() {
					return editor$1.getLayoutInfo();
				},
				get onDidLayoutMainContainer() {
					return editor$1.onDidLayoutChange;
				},
				get onDidLayoutActiveContainer() {
					return editor$1.onDidLayoutChange;
				},
				get onDidLayoutContainer() {
					return Event.map(editor$1.onDidLayoutChange, (dimension) => ({
						container: widget.getDomNode(),
						dimension
					}));
				},
				get onDidChangeActiveContainer() {
					return Event.None;
				},
				get onDidAddContainer() {
					return Event.None;
				},
				get mainContainerOffset() {
					return {
						top: 0,
						quickPickTop: 0
					};
				},
				get activeContainerOffset() {
					return {
						top: 0,
						quickPickTop: 0
					};
				},
				focus: () => editor$1.focus()
			};
		} else this.host = void 0;
	}
	createController() {
		return super.createController(this.host);
	}
};
EditorScopedQuickInputService = __decorate$9([
	__param$9(1, IInstantiationService),
	__param$9(2, IContextKeyService),
	__param$9(3, IThemeService),
	__param$9(4, ICodeEditorService),
	__param$9(5, IConfigurationService)
], EditorScopedQuickInputService);
var StandaloneQuickInputService = class StandaloneQuickInputService$1 {
	get activeService() {
		const editor$1 = this.codeEditorService.getFocusedCodeEditor();
		if (!editor$1) throw new Error("Quick input service needs a focused editor to work.");
		let quickInputService = this.mapEditorToService.get(editor$1);
		if (!quickInputService) {
			const newQuickInputService = quickInputService = this.instantiationService.createInstance(EditorScopedQuickInputService, editor$1);
			this.mapEditorToService.set(editor$1, quickInputService);
			createSingleCallFunction(editor$1.onDidDispose)(() => {
				newQuickInputService.dispose();
				this.mapEditorToService.delete(editor$1);
			});
		}
		return quickInputService;
	}
	get currentQuickInput() {
		return this.activeService.currentQuickInput;
	}
	get quickAccess() {
		return this.activeService.quickAccess;
	}
	constructor(instantiationService, codeEditorService) {
		this.instantiationService = instantiationService;
		this.codeEditorService = codeEditorService;
		this.mapEditorToService = /* @__PURE__ */ new Map();
	}
	pick(picks, options, token = CancellationToken.None) {
		return this.activeService.pick(picks, options, token);
	}
	createQuickPick(options = { useSeparators: false }) {
		return this.activeService.createQuickPick(options);
	}
	createInputBox() {
		return this.activeService.createInputBox();
	}
};
StandaloneQuickInputService = __decorate$9([__param$9(0, IInstantiationService), __param$9(1, ICodeEditorService)], StandaloneQuickInputService);
var QuickInputEditorContribution = class QuickInputEditorContribution {
	static {
		this.ID = "editor.controller.quickInput";
	}
	static get(editor$1) {
		return editor$1.getContribution(QuickInputEditorContribution.ID);
	}
	constructor(editor$1) {
		this.editor = editor$1;
		this.widget = new QuickInputEditorWidget(this.editor);
	}
	dispose() {
		this.widget.dispose();
	}
};
var QuickInputEditorWidget = class QuickInputEditorWidget {
	static {
		this.ID = "editor.contrib.quickInputWidget";
	}
	constructor(codeEditor) {
		this.codeEditor = codeEditor;
		this.domNode = document.createElement("div");
		this.codeEditor.addOverlayWidget(this);
	}
	getId() {
		return QuickInputEditorWidget.ID;
	}
	getDomNode() {
		return this.domNode;
	}
	getPosition() {
		return { preference: 2 };
	}
	dispose() {
		this.codeEditor.removeOverlayWidget(this);
	}
};
registerEditorContribution(QuickInputEditorContribution.ID, QuickInputEditorContribution, 4);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/common/languages/supports/tokenization.js
var ParsedTokenThemeRule = class {
	constructor(token, index, fontStyle, foreground, background) {
		this._parsedThemeRuleBrand = void 0;
		this.token = token;
		this.index = index;
		this.fontStyle = fontStyle;
		this.foreground = foreground;
		this.background = background;
	}
};
/**
* Parse a raw theme into rules.
*/
function parseTokenTheme(source) {
	if (!source || !Array.isArray(source)) return [];
	const result = [];
	let resultLen = 0;
	for (let i = 0, len = source.length; i < len; i++) {
		const entry = source[i];
		let fontStyle = -1;
		if (typeof entry.fontStyle === "string") {
			fontStyle = 0;
			const segments = entry.fontStyle.split(" ");
			for (let j = 0, lenJ = segments.length; j < lenJ; j++) switch (segments[j]) {
				case "italic":
					fontStyle = fontStyle | 1;
					break;
				case "bold":
					fontStyle = fontStyle | 2;
					break;
				case "underline":
					fontStyle = fontStyle | 4;
					break;
				case "strikethrough":
					fontStyle = fontStyle | 8;
					break;
			}
		}
		let foreground = null;
		if (typeof entry.foreground === "string") foreground = entry.foreground;
		let background = null;
		if (typeof entry.background === "string") background = entry.background;
		result[resultLen++] = new ParsedTokenThemeRule(entry.token || "", i, fontStyle, foreground, background);
	}
	return result;
}
/**
* Resolve rules (i.e. inheritance).
*/
function resolveParsedTokenThemeRules(parsedThemeRules, customTokenColors) {
	parsedThemeRules.sort((a, b) => {
		const r = strcmp(a.token, b.token);
		if (r !== 0) return r;
		return a.index - b.index;
	});
	let defaultFontStyle = 0;
	let defaultForeground = "000000";
	let defaultBackground = "ffffff";
	while (parsedThemeRules.length >= 1 && parsedThemeRules[0].token === "") {
		const incomingDefaults = parsedThemeRules.shift();
		if (incomingDefaults.fontStyle !== -1) defaultFontStyle = incomingDefaults.fontStyle;
		if (incomingDefaults.foreground !== null) defaultForeground = incomingDefaults.foreground;
		if (incomingDefaults.background !== null) defaultBackground = incomingDefaults.background;
	}
	const colorMap = new ColorMap();
	for (const color of customTokenColors) colorMap.getId(color);
	const foregroundColorId = colorMap.getId(defaultForeground);
	const backgroundColorId = colorMap.getId(defaultBackground);
	const defaults = new ThemeTrieElementRule(defaultFontStyle, foregroundColorId, backgroundColorId);
	const root = new ThemeTrieElement(defaults);
	for (let i = 0, len = parsedThemeRules.length; i < len; i++) {
		const rule = parsedThemeRules[i];
		root.insert(rule.token, rule.fontStyle, colorMap.getId(rule.foreground), colorMap.getId(rule.background));
	}
	return new TokenTheme(colorMap, root);
}
var colorRegExp = /^#?([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?$/;
var ColorMap = class {
	constructor() {
		this._lastColorId = 0;
		this._id2color = [];
		this._color2id = /* @__PURE__ */ new Map();
	}
	getId(color) {
		if (color === null) return 0;
		const match = color.match(colorRegExp);
		if (!match) throw new Error("Illegal value for token color: " + color);
		color = match[1].toUpperCase();
		let value = this._color2id.get(color);
		if (value) return value;
		value = ++this._lastColorId;
		this._color2id.set(color, value);
		this._id2color[value] = Color.fromHex("#" + color);
		return value;
	}
	getColorMap() {
		return this._id2color.slice(0);
	}
};
var TokenTheme = class {
	static createFromRawTokenTheme(source, customTokenColors) {
		return this.createFromParsedTokenTheme(parseTokenTheme(source), customTokenColors);
	}
	static createFromParsedTokenTheme(source, customTokenColors) {
		return resolveParsedTokenThemeRules(source, customTokenColors);
	}
	constructor(colorMap, root) {
		this._colorMap = colorMap;
		this._root = root;
		this._cache = /* @__PURE__ */ new Map();
	}
	getColorMap() {
		return this._colorMap.getColorMap();
	}
	_match(token) {
		return this._root.match(token);
	}
	match(languageId, token) {
		let result = this._cache.get(token);
		if (typeof result === "undefined") {
			const rule = this._match(token);
			const standardToken = toStandardTokenType(token);
			result = (rule.metadata | standardToken << 8) >>> 0;
			this._cache.set(token, result);
		}
		return (result | languageId << 0) >>> 0;
	}
};
var STANDARD_TOKEN_TYPE_REGEXP = /\b(comment|string|regex|regexp)\b/;
function toStandardTokenType(tokenType) {
	const m = tokenType.match(STANDARD_TOKEN_TYPE_REGEXP);
	if (!m) return 0;
	switch (m[1]) {
		case "comment": return 1;
		case "string": return 2;
		case "regex": return 3;
		case "regexp": return 3;
	}
	throw new Error("Unexpected match for standard token type!");
}
function strcmp(a, b) {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}
var ThemeTrieElementRule = class ThemeTrieElementRule {
	constructor(fontStyle, foreground, background) {
		this._themeTrieElementRuleBrand = void 0;
		this._fontStyle = fontStyle;
		this._foreground = foreground;
		this._background = background;
		this.metadata = (this._fontStyle << 11 | this._foreground << 15 | this._background << 24) >>> 0;
	}
	clone() {
		return new ThemeTrieElementRule(this._fontStyle, this._foreground, this._background);
	}
	acceptOverwrite(fontStyle, foreground, background) {
		if (fontStyle !== -1) this._fontStyle = fontStyle;
		if (foreground !== 0) this._foreground = foreground;
		if (background !== 0) this._background = background;
		this.metadata = (this._fontStyle << 11 | this._foreground << 15 | this._background << 24) >>> 0;
	}
};
var ThemeTrieElement = class ThemeTrieElement {
	constructor(mainRule) {
		this._themeTrieElementBrand = void 0;
		this._mainRule = mainRule;
		this._children = /* @__PURE__ */ new Map();
	}
	match(token) {
		if (token === "") return this._mainRule;
		const dotIndex = token.indexOf(".");
		let head;
		let tail;
		if (dotIndex === -1) {
			head = token;
			tail = "";
		} else {
			head = token.substring(0, dotIndex);
			tail = token.substring(dotIndex + 1);
		}
		const child = this._children.get(head);
		if (typeof child !== "undefined") return child.match(tail);
		return this._mainRule;
	}
	insert(token, fontStyle, foreground, background) {
		if (token === "") {
			this._mainRule.acceptOverwrite(fontStyle, foreground, background);
			return;
		}
		const dotIndex = token.indexOf(".");
		let head;
		let tail;
		if (dotIndex === -1) {
			head = token;
			tail = "";
		} else {
			head = token.substring(0, dotIndex);
			tail = token.substring(dotIndex + 1);
		}
		let child = this._children.get(head);
		if (typeof child === "undefined") {
			child = new ThemeTrieElement(this._mainRule.clone());
			this._children.set(head, child);
		}
		child.insert(tail, fontStyle, foreground, background);
	}
};
function generateTokensCSSForColorMap(colorMap) {
	const rules = [];
	for (let i = 1, len = colorMap.length; i < len; i++) {
		const color = colorMap[i];
		rules[i] = `.mtk${i} { color: ${color}; }`;
	}
	rules.push(".mtki { font-style: italic; }");
	rules.push(".mtkb { font-weight: bold; }");
	rules.push(".mtku { text-decoration: underline; text-underline-position: under; }");
	rules.push(".mtks { text-decoration: line-through; }");
	rules.push(".mtks.mtku { text-decoration: underline line-through; text-underline-position: under; }");
	return rules.join("\n");
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/common/themes.js
const vs = {
	base: "vs",
	inherit: false,
	rules: [
		{
			token: "",
			foreground: "000000",
			background: "fffffe"
		},
		{
			token: "invalid",
			foreground: "cd3131"
		},
		{
			token: "emphasis",
			fontStyle: "italic"
		},
		{
			token: "strong",
			fontStyle: "bold"
		},
		{
			token: "variable",
			foreground: "001188"
		},
		{
			token: "variable.predefined",
			foreground: "4864AA"
		},
		{
			token: "constant",
			foreground: "dd0000"
		},
		{
			token: "comment",
			foreground: "008000"
		},
		{
			token: "number",
			foreground: "098658"
		},
		{
			token: "number.hex",
			foreground: "3030c0"
		},
		{
			token: "regexp",
			foreground: "800000"
		},
		{
			token: "annotation",
			foreground: "808080"
		},
		{
			token: "type",
			foreground: "008080"
		},
		{
			token: "delimiter",
			foreground: "000000"
		},
		{
			token: "delimiter.html",
			foreground: "383838"
		},
		{
			token: "delimiter.xml",
			foreground: "0000FF"
		},
		{
			token: "tag",
			foreground: "800000"
		},
		{
			token: "tag.id.pug",
			foreground: "4F76AC"
		},
		{
			token: "tag.class.pug",
			foreground: "4F76AC"
		},
		{
			token: "meta.scss",
			foreground: "800000"
		},
		{
			token: "metatag",
			foreground: "e00000"
		},
		{
			token: "metatag.content.html",
			foreground: "FF0000"
		},
		{
			token: "metatag.html",
			foreground: "808080"
		},
		{
			token: "metatag.xml",
			foreground: "808080"
		},
		{
			token: "metatag.php",
			fontStyle: "bold"
		},
		{
			token: "key",
			foreground: "863B00"
		},
		{
			token: "string.key.json",
			foreground: "A31515"
		},
		{
			token: "string.value.json",
			foreground: "0451A5"
		},
		{
			token: "attribute.name",
			foreground: "FF0000"
		},
		{
			token: "attribute.value",
			foreground: "0451A5"
		},
		{
			token: "attribute.value.number",
			foreground: "098658"
		},
		{
			token: "attribute.value.unit",
			foreground: "098658"
		},
		{
			token: "attribute.value.html",
			foreground: "0000FF"
		},
		{
			token: "attribute.value.xml",
			foreground: "0000FF"
		},
		{
			token: "string",
			foreground: "A31515"
		},
		{
			token: "string.html",
			foreground: "0000FF"
		},
		{
			token: "string.sql",
			foreground: "FF0000"
		},
		{
			token: "string.yaml",
			foreground: "0451A5"
		},
		{
			token: "keyword",
			foreground: "0000FF"
		},
		{
			token: "keyword.json",
			foreground: "0451A5"
		},
		{
			token: "keyword.flow",
			foreground: "AF00DB"
		},
		{
			token: "keyword.flow.scss",
			foreground: "0000FF"
		},
		{
			token: "operator.scss",
			foreground: "666666"
		},
		{
			token: "operator.sql",
			foreground: "778899"
		},
		{
			token: "operator.swift",
			foreground: "666666"
		},
		{
			token: "predefined.sql",
			foreground: "C700C7"
		}
	],
	colors: {
		[editorBackground]: "#FFFFFE",
		[editorForeground]: "#000000",
		[editorInactiveSelection]: "#E5EBF1",
		[editorIndentGuide1]: "#D3D3D3",
		[editorActiveIndentGuide1]: "#939393",
		[editorSelectionHighlight]: "#ADD6FF4D"
	}
};
const vs_dark = {
	base: "vs-dark",
	inherit: false,
	rules: [
		{
			token: "",
			foreground: "D4D4D4",
			background: "1E1E1E"
		},
		{
			token: "invalid",
			foreground: "f44747"
		},
		{
			token: "emphasis",
			fontStyle: "italic"
		},
		{
			token: "strong",
			fontStyle: "bold"
		},
		{
			token: "variable",
			foreground: "74B0DF"
		},
		{
			token: "variable.predefined",
			foreground: "4864AA"
		},
		{
			token: "variable.parameter",
			foreground: "9CDCFE"
		},
		{
			token: "constant",
			foreground: "569CD6"
		},
		{
			token: "comment",
			foreground: "608B4E"
		},
		{
			token: "number",
			foreground: "B5CEA8"
		},
		{
			token: "number.hex",
			foreground: "5BB498"
		},
		{
			token: "regexp",
			foreground: "B46695"
		},
		{
			token: "annotation",
			foreground: "cc6666"
		},
		{
			token: "type",
			foreground: "3DC9B0"
		},
		{
			token: "delimiter",
			foreground: "DCDCDC"
		},
		{
			token: "delimiter.html",
			foreground: "808080"
		},
		{
			token: "delimiter.xml",
			foreground: "808080"
		},
		{
			token: "tag",
			foreground: "569CD6"
		},
		{
			token: "tag.id.pug",
			foreground: "4F76AC"
		},
		{
			token: "tag.class.pug",
			foreground: "4F76AC"
		},
		{
			token: "meta.scss",
			foreground: "A79873"
		},
		{
			token: "meta.tag",
			foreground: "CE9178"
		},
		{
			token: "metatag",
			foreground: "DD6A6F"
		},
		{
			token: "metatag.content.html",
			foreground: "9CDCFE"
		},
		{
			token: "metatag.html",
			foreground: "569CD6"
		},
		{
			token: "metatag.xml",
			foreground: "569CD6"
		},
		{
			token: "metatag.php",
			fontStyle: "bold"
		},
		{
			token: "key",
			foreground: "9CDCFE"
		},
		{
			token: "string.key.json",
			foreground: "9CDCFE"
		},
		{
			token: "string.value.json",
			foreground: "CE9178"
		},
		{
			token: "attribute.name",
			foreground: "9CDCFE"
		},
		{
			token: "attribute.value",
			foreground: "CE9178"
		},
		{
			token: "attribute.value.number.css",
			foreground: "B5CEA8"
		},
		{
			token: "attribute.value.unit.css",
			foreground: "B5CEA8"
		},
		{
			token: "attribute.value.hex.css",
			foreground: "D4D4D4"
		},
		{
			token: "string",
			foreground: "CE9178"
		},
		{
			token: "string.sql",
			foreground: "FF0000"
		},
		{
			token: "keyword",
			foreground: "569CD6"
		},
		{
			token: "keyword.flow",
			foreground: "C586C0"
		},
		{
			token: "keyword.json",
			foreground: "CE9178"
		},
		{
			token: "keyword.flow.scss",
			foreground: "569CD6"
		},
		{
			token: "operator.scss",
			foreground: "909090"
		},
		{
			token: "operator.sql",
			foreground: "778899"
		},
		{
			token: "operator.swift",
			foreground: "909090"
		},
		{
			token: "predefined.sql",
			foreground: "FF00FF"
		}
	],
	colors: {
		[editorBackground]: "#1E1E1E",
		[editorForeground]: "#D4D4D4",
		[editorInactiveSelection]: "#3A3D41",
		[editorIndentGuide1]: "#404040",
		[editorActiveIndentGuide1]: "#707070",
		[editorSelectionHighlight]: "#ADD6FF26"
	}
};
const hc_black = {
	base: "hc-black",
	inherit: false,
	rules: [
		{
			token: "",
			foreground: "FFFFFF",
			background: "000000"
		},
		{
			token: "invalid",
			foreground: "f44747"
		},
		{
			token: "emphasis",
			fontStyle: "italic"
		},
		{
			token: "strong",
			fontStyle: "bold"
		},
		{
			token: "variable",
			foreground: "1AEBFF"
		},
		{
			token: "variable.parameter",
			foreground: "9CDCFE"
		},
		{
			token: "constant",
			foreground: "569CD6"
		},
		{
			token: "comment",
			foreground: "608B4E"
		},
		{
			token: "number",
			foreground: "FFFFFF"
		},
		{
			token: "regexp",
			foreground: "C0C0C0"
		},
		{
			token: "annotation",
			foreground: "569CD6"
		},
		{
			token: "type",
			foreground: "3DC9B0"
		},
		{
			token: "delimiter",
			foreground: "FFFF00"
		},
		{
			token: "delimiter.html",
			foreground: "FFFF00"
		},
		{
			token: "tag",
			foreground: "569CD6"
		},
		{
			token: "tag.id.pug",
			foreground: "4F76AC"
		},
		{
			token: "tag.class.pug",
			foreground: "4F76AC"
		},
		{
			token: "meta",
			foreground: "D4D4D4"
		},
		{
			token: "meta.tag",
			foreground: "CE9178"
		},
		{
			token: "metatag",
			foreground: "569CD6"
		},
		{
			token: "metatag.content.html",
			foreground: "1AEBFF"
		},
		{
			token: "metatag.html",
			foreground: "569CD6"
		},
		{
			token: "metatag.xml",
			foreground: "569CD6"
		},
		{
			token: "metatag.php",
			fontStyle: "bold"
		},
		{
			token: "key",
			foreground: "9CDCFE"
		},
		{
			token: "string.key",
			foreground: "9CDCFE"
		},
		{
			token: "string.value",
			foreground: "CE9178"
		},
		{
			token: "attribute.name",
			foreground: "569CD6"
		},
		{
			token: "attribute.value",
			foreground: "3FF23F"
		},
		{
			token: "string",
			foreground: "CE9178"
		},
		{
			token: "string.sql",
			foreground: "FF0000"
		},
		{
			token: "keyword",
			foreground: "569CD6"
		},
		{
			token: "keyword.flow",
			foreground: "C586C0"
		},
		{
			token: "operator.sql",
			foreground: "778899"
		},
		{
			token: "operator.swift",
			foreground: "909090"
		},
		{
			token: "predefined.sql",
			foreground: "FF00FF"
		}
	],
	colors: {
		[editorBackground]: "#000000",
		[editorForeground]: "#FFFFFF",
		[editorIndentGuide1]: "#FFFFFF",
		[editorActiveIndentGuide1]: "#FFFFFF"
	}
};
const hc_light = {
	base: "hc-light",
	inherit: false,
	rules: [
		{
			token: "",
			foreground: "292929",
			background: "FFFFFF"
		},
		{
			token: "invalid",
			foreground: "B5200D"
		},
		{
			token: "emphasis",
			fontStyle: "italic"
		},
		{
			token: "strong",
			fontStyle: "bold"
		},
		{
			token: "variable",
			foreground: "264F70"
		},
		{
			token: "variable.predefined",
			foreground: "4864AA"
		},
		{
			token: "constant",
			foreground: "dd0000"
		},
		{
			token: "comment",
			foreground: "008000"
		},
		{
			token: "number",
			foreground: "098658"
		},
		{
			token: "number.hex",
			foreground: "3030c0"
		},
		{
			token: "regexp",
			foreground: "800000"
		},
		{
			token: "annotation",
			foreground: "808080"
		},
		{
			token: "type",
			foreground: "008080"
		},
		{
			token: "delimiter",
			foreground: "000000"
		},
		{
			token: "delimiter.html",
			foreground: "383838"
		},
		{
			token: "tag",
			foreground: "800000"
		},
		{
			token: "tag.id.pug",
			foreground: "4F76AC"
		},
		{
			token: "tag.class.pug",
			foreground: "4F76AC"
		},
		{
			token: "meta.scss",
			foreground: "800000"
		},
		{
			token: "metatag",
			foreground: "e00000"
		},
		{
			token: "metatag.content.html",
			foreground: "B5200D"
		},
		{
			token: "metatag.html",
			foreground: "808080"
		},
		{
			token: "metatag.xml",
			foreground: "808080"
		},
		{
			token: "metatag.php",
			fontStyle: "bold"
		},
		{
			token: "key",
			foreground: "863B00"
		},
		{
			token: "string.key.json",
			foreground: "A31515"
		},
		{
			token: "string.value.json",
			foreground: "0451A5"
		},
		{
			token: "attribute.name",
			foreground: "264F78"
		},
		{
			token: "attribute.value",
			foreground: "0451A5"
		},
		{
			token: "string",
			foreground: "A31515"
		},
		{
			token: "string.sql",
			foreground: "B5200D"
		},
		{
			token: "keyword",
			foreground: "0000FF"
		},
		{
			token: "keyword.flow",
			foreground: "AF00DB"
		},
		{
			token: "operator.sql",
			foreground: "778899"
		},
		{
			token: "operator.swift",
			foreground: "666666"
		},
		{
			token: "predefined.sql",
			foreground: "C700C7"
		}
	],
	colors: {
		[editorBackground]: "#FFFFFF",
		[editorForeground]: "#292929",
		[editorIndentGuide1]: "#292929",
		[editorActiveIndentGuide1]: "#292929"
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/theme/browser/iconsStyleSheet.js
function getIconsStyleSheet(themeService) {
	const disposable = new DisposableStore();
	const onDidChangeEmmiter = disposable.add(new Emitter$1());
	const iconRegistry = getIconRegistry();
	disposable.add(iconRegistry.onDidChange(() => onDidChangeEmmiter.fire()));
	if (themeService) disposable.add(themeService.onDidProductIconThemeChange(() => onDidChangeEmmiter.fire()));
	return {
		dispose: () => disposable.dispose(),
		onDidChange: onDidChangeEmmiter.event,
		getCSS() {
			const productIconTheme = themeService ? themeService.getProductIconTheme() : new UnthemedProductIconTheme();
			const usedFontIds = {};
			const rules = [];
			const rootAttribs = [];
			for (const contribution of iconRegistry.getIcons()) {
				const definition = productIconTheme.getIcon(contribution);
				if (!definition) continue;
				const fontContribution = definition.font;
				const fontFamilyVar = `--vscode-icon-${contribution.id}-font-family`;
				const contentVar = `--vscode-icon-${contribution.id}-content`;
				if (fontContribution) {
					usedFontIds[fontContribution.id] = fontContribution.definition;
					rootAttribs.push(`${fontFamilyVar}: ${asCSSPropertyValue(fontContribution.id)};`, `${contentVar}: '${definition.fontCharacter}';`);
					rules.push(`.codicon-${contribution.id}:before { content: '${definition.fontCharacter}'; font-family: ${asCSSPropertyValue(fontContribution.id)}; }`);
				} else {
					rootAttribs.push(`${contentVar}: '${definition.fontCharacter}'; ${fontFamilyVar}: 'codicon';`);
					rules.push(`.codicon-${contribution.id}:before { content: '${definition.fontCharacter}'; }`);
				}
			}
			for (const id in usedFontIds) {
				const definition = usedFontIds[id];
				const fontWeight = definition.weight ? `font-weight: ${definition.weight};` : "";
				const fontStyle = definition.style ? `font-style: ${definition.style};` : "";
				const src = definition.src.map((l) => `${asCSSUrl(l.location)} format('${l.format}')`).join(", ");
				rules.push(`@font-face { src: ${src}; font-family: ${asCSSPropertyValue(id)};${fontWeight}${fontStyle} font-display: block; }`);
			}
			rules.push(`:root { ${rootAttribs.join(" ")} }`);
			return rules.join("\n");
		}
	};
}
var UnthemedProductIconTheme = class {
	getIcon(contribution) {
		const iconRegistry = getIconRegistry();
		let definition = contribution.defaults;
		while (ThemeIcon.isThemeIcon(definition)) {
			const c = iconRegistry.getIcon(definition.id);
			if (!c) return;
			definition = c.defaults;
		}
		return definition;
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneThemeService.js
const VS_LIGHT_THEME_NAME = "vs";
const VS_DARK_THEME_NAME = "vs-dark";
const HC_BLACK_THEME_NAME = "hc-black";
const HC_LIGHT_THEME_NAME = "hc-light";
var colorRegistry = Registry.as(Extensions$1.ColorContribution);
var themingRegistry = Registry.as(Extensions$2.ThemingContribution);
var StandaloneTheme = class {
	constructor(name, standaloneThemeData) {
		this.semanticHighlighting = false;
		this.themeData = standaloneThemeData;
		const base = standaloneThemeData.base;
		if (name.length > 0) {
			if (isBuiltinTheme(name)) this.id = name;
			else this.id = base + " " + name;
			this.themeName = name;
		} else {
			this.id = base;
			this.themeName = base;
		}
		this.colors = null;
		this.defaultColors = Object.create(null);
		this._tokenTheme = null;
	}
	get base() {
		return this.themeData.base;
	}
	notifyBaseUpdated() {
		if (this.themeData.inherit) {
			this.colors = null;
			this._tokenTheme = null;
		}
	}
	getColors() {
		if (!this.colors) {
			const colors = /* @__PURE__ */ new Map();
			for (const id in this.themeData.colors) colors.set(id, Color.fromHex(this.themeData.colors[id]));
			if (this.themeData.inherit) {
				const baseData = getBuiltinRules(this.themeData.base);
				for (const id in baseData.colors) if (!colors.has(id)) colors.set(id, Color.fromHex(baseData.colors[id]));
			}
			this.colors = colors;
		}
		return this.colors;
	}
	getColor(colorId, useDefault) {
		const color = this.getColors().get(colorId);
		if (color) return color;
		if (useDefault !== false) return this.getDefault(colorId);
	}
	getDefault(colorId) {
		let color = this.defaultColors[colorId];
		if (color) return color;
		color = colorRegistry.resolveDefaultColor(colorId, this);
		this.defaultColors[colorId] = color;
		return color;
	}
	defines(colorId) {
		return this.getColors().has(colorId);
	}
	get type() {
		switch (this.base) {
			case VS_LIGHT_THEME_NAME: return ColorScheme.LIGHT;
			case HC_BLACK_THEME_NAME: return ColorScheme.HIGH_CONTRAST_DARK;
			case HC_LIGHT_THEME_NAME: return ColorScheme.HIGH_CONTRAST_LIGHT;
			default: return ColorScheme.DARK;
		}
	}
	get tokenTheme() {
		if (!this._tokenTheme) {
			let rules = [];
			let encodedTokensColors = [];
			if (this.themeData.inherit) {
				const baseData = getBuiltinRules(this.themeData.base);
				rules = baseData.rules;
				if (baseData.encodedTokensColors) encodedTokensColors = baseData.encodedTokensColors;
			}
			const editorForeground$1 = this.themeData.colors["editor.foreground"];
			const editorBackground$1 = this.themeData.colors["editor.background"];
			if (editorForeground$1 || editorBackground$1) {
				const rule = { token: "" };
				if (editorForeground$1) rule.foreground = editorForeground$1;
				if (editorBackground$1) rule.background = editorBackground$1;
				rules.push(rule);
			}
			rules = rules.concat(this.themeData.rules);
			if (this.themeData.encodedTokensColors) encodedTokensColors = this.themeData.encodedTokensColors;
			this._tokenTheme = TokenTheme.createFromRawTokenTheme(rules, encodedTokensColors);
		}
		return this._tokenTheme;
	}
	getTokenStyleMetadata(type, modifiers, modelLanguage) {
		const metadata = this.tokenTheme._match([type].concat(modifiers).join(".")).metadata;
		const foreground = TokenMetadata.getForeground(metadata);
		const fontStyle = TokenMetadata.getFontStyle(metadata);
		return {
			foreground,
			italic: Boolean(fontStyle & 1),
			bold: Boolean(fontStyle & 2),
			underline: Boolean(fontStyle & 4),
			strikethrough: Boolean(fontStyle & 8)
		};
	}
};
function isBuiltinTheme(themeName) {
	return themeName === VS_LIGHT_THEME_NAME || themeName === VS_DARK_THEME_NAME || themeName === HC_BLACK_THEME_NAME || themeName === HC_LIGHT_THEME_NAME;
}
function getBuiltinRules(builtinTheme) {
	switch (builtinTheme) {
		case VS_LIGHT_THEME_NAME: return vs;
		case VS_DARK_THEME_NAME: return vs_dark;
		case HC_BLACK_THEME_NAME: return hc_black;
		case HC_LIGHT_THEME_NAME: return hc_light;
	}
}
function newBuiltInTheme(builtinTheme) {
	const themeData = getBuiltinRules(builtinTheme);
	return new StandaloneTheme(builtinTheme, themeData);
}
var StandaloneThemeService = class extends Disposable {
	constructor() {
		super();
		this._onColorThemeChange = this._register(new Emitter$1());
		this.onDidColorThemeChange = this._onColorThemeChange.event;
		this._onProductIconThemeChange = this._register(new Emitter$1());
		this.onDidProductIconThemeChange = this._onProductIconThemeChange.event;
		this._environment = Object.create(null);
		this._builtInProductIconTheme = new UnthemedProductIconTheme();
		this._autoDetectHighContrast = true;
		this._knownThemes = /* @__PURE__ */ new Map();
		this._knownThemes.set(VS_LIGHT_THEME_NAME, newBuiltInTheme(VS_LIGHT_THEME_NAME));
		this._knownThemes.set(VS_DARK_THEME_NAME, newBuiltInTheme(VS_DARK_THEME_NAME));
		this._knownThemes.set(HC_BLACK_THEME_NAME, newBuiltInTheme(HC_BLACK_THEME_NAME));
		this._knownThemes.set(HC_LIGHT_THEME_NAME, newBuiltInTheme(HC_LIGHT_THEME_NAME));
		const iconsStyleSheet = this._register(getIconsStyleSheet(this));
		this._codiconCSS = iconsStyleSheet.getCSS();
		this._themeCSS = "";
		this._allCSS = `${this._codiconCSS}\n${this._themeCSS}`;
		this._globalStyleElement = null;
		this._styleElements = [];
		this._colorMapOverride = null;
		this.setTheme(VS_LIGHT_THEME_NAME);
		this._onOSSchemeChanged();
		this._register(iconsStyleSheet.onDidChange(() => {
			this._codiconCSS = iconsStyleSheet.getCSS();
			this._updateCSS();
		}));
		addMatchMediaChangeListener(mainWindow, "(forced-colors: active)", () => {
			this._onOSSchemeChanged();
		});
	}
	registerEditorContainer(domNode) {
		if (isInShadowDOM(domNode)) return this._registerShadowDomContainer(domNode);
		return this._registerRegularEditorContainer();
	}
	_registerRegularEditorContainer() {
		if (!this._globalStyleElement) {
			this._globalStyleElement = createStyleSheet(void 0, (style) => {
				style.className = "monaco-colors";
				style.textContent = this._allCSS;
			});
			this._styleElements.push(this._globalStyleElement);
		}
		return Disposable.None;
	}
	_registerShadowDomContainer(domNode) {
		const styleElement = createStyleSheet(domNode, (style) => {
			style.className = "monaco-colors";
			style.textContent = this._allCSS;
		});
		this._styleElements.push(styleElement);
		return { dispose: () => {
			for (let i = 0; i < this._styleElements.length; i++) if (this._styleElements[i] === styleElement) {
				this._styleElements.splice(i, 1);
				return;
			}
		} };
	}
	defineTheme(themeName, themeData) {
		if (!/^[a-z0-9\-]+$/i.test(themeName)) throw new Error("Illegal theme name!");
		if (!isBuiltinTheme(themeData.base) && !isBuiltinTheme(themeName)) throw new Error("Illegal theme base!");
		this._knownThemes.set(themeName, new StandaloneTheme(themeName, themeData));
		if (isBuiltinTheme(themeName)) this._knownThemes.forEach((theme) => {
			if (theme.base === themeName) theme.notifyBaseUpdated();
		});
		if (this._theme.themeName === themeName) this.setTheme(themeName);
	}
	getColorTheme() {
		return this._theme;
	}
	setColorMapOverride(colorMapOverride) {
		this._colorMapOverride = colorMapOverride;
		this._updateThemeOrColorMap();
	}
	setTheme(themeName) {
		let theme;
		if (this._knownThemes.has(themeName)) theme = this._knownThemes.get(themeName);
		else theme = this._knownThemes.get(VS_LIGHT_THEME_NAME);
		this._updateActualTheme(theme);
	}
	_updateActualTheme(desiredTheme) {
		if (!desiredTheme || this._theme === desiredTheme) return;
		this._theme = desiredTheme;
		this._updateThemeOrColorMap();
	}
	_onOSSchemeChanged() {
		if (this._autoDetectHighContrast) {
			const wantsHighContrast = mainWindow.matchMedia(`(forced-colors: active)`).matches;
			if (wantsHighContrast !== isHighContrast(this._theme.type)) {
				let newThemeName;
				if (isDark(this._theme.type)) newThemeName = wantsHighContrast ? HC_BLACK_THEME_NAME : VS_DARK_THEME_NAME;
				else newThemeName = wantsHighContrast ? HC_LIGHT_THEME_NAME : VS_LIGHT_THEME_NAME;
				this._updateActualTheme(this._knownThemes.get(newThemeName));
			}
		}
	}
	setAutoDetectHighContrast(autoDetectHighContrast) {
		this._autoDetectHighContrast = autoDetectHighContrast;
		this._onOSSchemeChanged();
	}
	_updateThemeOrColorMap() {
		const cssRules = [];
		const hasRule = {};
		const ruleCollector = { addRule: (rule) => {
			if (!hasRule[rule]) {
				cssRules.push(rule);
				hasRule[rule] = true;
			}
		} };
		themingRegistry.getThemingParticipants().forEach((p) => p(this._theme, ruleCollector, this._environment));
		const colorVariables = [];
		for (const item of colorRegistry.getColors()) {
			const color = this._theme.getColor(item.id, true);
			if (color) colorVariables.push(`${asCssVariableName(item.id)}: ${color.toString()};`);
		}
		ruleCollector.addRule(`.monaco-editor, .monaco-diff-editor, .monaco-component { ${colorVariables.join("\n")} }`);
		const colorMap = this._colorMapOverride || this._theme.tokenTheme.getColorMap();
		ruleCollector.addRule(generateTokensCSSForColorMap(colorMap));
		this._themeCSS = cssRules.join("\n");
		this._updateCSS();
		TokenizationRegistry.setColorMap(colorMap);
		this._onColorThemeChange.fire(this._theme);
	}
	_updateCSS() {
		this._allCSS = `${this._codiconCSS}\n${this._themeCSS}`;
		this._styleElements.forEach((styleElement) => styleElement.textContent = this._allCSS);
	}
	getFileIconTheme() {
		return {
			hasFileIcons: false,
			hasFolderIcons: false,
			hidesExplorerArrows: false
		};
	}
	getProductIconTheme() {
		return this._builtInProductIconTheme;
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/common/standaloneTheme.js
const IStandaloneThemeService = createDecorator("themeService");

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/accessibility/browser/accessibilityService.js
var __decorate$8 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$8 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var AccessibilityService = class AccessibilityService$1 extends Disposable {
	constructor(_contextKeyService, _layoutService, _configurationService) {
		super();
		this._contextKeyService = _contextKeyService;
		this._layoutService = _layoutService;
		this._configurationService = _configurationService;
		this._accessibilitySupport = 0;
		this._onDidChangeScreenReaderOptimized = new Emitter$1();
		this._onDidChangeReducedMotion = new Emitter$1();
		this._onDidChangeLinkUnderline = new Emitter$1();
		this._accessibilityModeEnabledContext = CONTEXT_ACCESSIBILITY_MODE_ENABLED.bindTo(this._contextKeyService);
		const updateContextKey = () => this._accessibilityModeEnabledContext.set(this.isScreenReaderOptimized());
		this._register(this._configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration("editor.accessibilitySupport")) {
				updateContextKey();
				this._onDidChangeScreenReaderOptimized.fire();
			}
			if (e.affectsConfiguration("workbench.reduceMotion")) {
				this._configMotionReduced = this._configurationService.getValue("workbench.reduceMotion");
				this._onDidChangeReducedMotion.fire();
			}
		}));
		updateContextKey();
		this._register(this.onDidChangeScreenReaderOptimized(() => updateContextKey()));
		const reduceMotionMatcher = mainWindow.matchMedia(`(prefers-reduced-motion: reduce)`);
		this._systemMotionReduced = reduceMotionMatcher.matches;
		this._configMotionReduced = this._configurationService.getValue("workbench.reduceMotion");
		this._linkUnderlinesEnabled = this._configurationService.getValue("accessibility.underlineLinks");
		this.initReducedMotionListeners(reduceMotionMatcher);
		this.initLinkUnderlineListeners();
	}
	initReducedMotionListeners(reduceMotionMatcher) {
		this._register(addDisposableListener(reduceMotionMatcher, "change", () => {
			this._systemMotionReduced = reduceMotionMatcher.matches;
			if (this._configMotionReduced === "auto") this._onDidChangeReducedMotion.fire();
		}));
		const updateRootClasses = () => {
			const reduce = this.isMotionReduced();
			this._layoutService.mainContainer.classList.toggle("reduce-motion", reduce);
			this._layoutService.mainContainer.classList.toggle("enable-motion", !reduce);
		};
		updateRootClasses();
		this._register(this.onDidChangeReducedMotion(() => updateRootClasses()));
	}
	initLinkUnderlineListeners() {
		this._register(this._configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration("accessibility.underlineLinks")) {
				this._linkUnderlinesEnabled = this._configurationService.getValue("accessibility.underlineLinks");
				this._onDidChangeLinkUnderline.fire();
			}
		}));
		const updateLinkUnderlineClasses = () => {
			const underlineLinks = this._linkUnderlinesEnabled;
			this._layoutService.mainContainer.classList.toggle("underline-links", underlineLinks);
		};
		updateLinkUnderlineClasses();
		this._register(this.onDidChangeLinkUnderlines(() => updateLinkUnderlineClasses()));
	}
	onDidChangeLinkUnderlines(listener) {
		return this._onDidChangeLinkUnderline.event(listener);
	}
	get onDidChangeScreenReaderOptimized() {
		return this._onDidChangeScreenReaderOptimized.event;
	}
	isScreenReaderOptimized() {
		const config = this._configurationService.getValue("editor.accessibilitySupport");
		return config === "on" || config === "auto" && this._accessibilitySupport === 2;
	}
	get onDidChangeReducedMotion() {
		return this._onDidChangeReducedMotion.event;
	}
	isMotionReduced() {
		const config = this._configMotionReduced;
		return config === "on" || config === "auto" && this._systemMotionReduced;
	}
	getAccessibilitySupport() {
		return this._accessibilitySupport;
	}
};
AccessibilityService = __decorate$8([
	__param$8(0, IContextKeyService),
	__param$8(1, ILayoutService),
	__param$8(2, IConfigurationService)
], AccessibilityService);

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/clipboard/browser/clipboardService.js
var __decorate$7 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$7 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var BrowserClipboardService_1;
/**
* Custom mime type used for storing a list of uris in the clipboard.
*
* Requires support for custom web clipboards https://github.com/w3c/clipboard-apis/pull/175
*/
var vscodeResourcesMime = "application/vnd.code.resources";
var BrowserClipboardService = class BrowserClipboardService$1 extends Disposable {
	static {
		BrowserClipboardService_1 = this;
	}
	constructor(layoutService, logService) {
		super();
		this.layoutService = layoutService;
		this.logService = logService;
		this.mapTextToType = /* @__PURE__ */ new Map();
		this.findText = "";
		this.resources = [];
		this.resourcesStateHash = void 0;
		if (isSafari || isWebkitWebView) this.installWebKitWriteTextWorkaround();
		this._register(Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => {
			disposables.add(addDisposableListener(window.document, "copy", () => this.clearResourcesState()));
		}, {
			window: mainWindow,
			disposables: this._store
		}));
	}
	installWebKitWriteTextWorkaround() {
		const handler = () => {
			const currentWritePromise = new DeferredPromise();
			if (this.webKitPendingClipboardWritePromise && !this.webKitPendingClipboardWritePromise.isSettled) this.webKitPendingClipboardWritePromise.cancel();
			this.webKitPendingClipboardWritePromise = currentWritePromise;
			getActiveWindow().navigator.clipboard.write([new ClipboardItem({ "text/plain": currentWritePromise.p })]).catch(async (err) => {
				if (!(err instanceof Error) || err.name !== "NotAllowedError" || !currentWritePromise.isRejected) this.logService.error(err);
			});
		};
		this._register(Event.runAndSubscribe(this.layoutService.onDidAddContainer, ({ container, disposables }) => {
			disposables.add(addDisposableListener(container, "click", handler));
			disposables.add(addDisposableListener(container, "keydown", handler));
		}, {
			container: this.layoutService.mainContainer,
			disposables: this._store
		}));
	}
	async writeText(text, type) {
		this.clearResourcesState();
		if (type) {
			this.mapTextToType.set(type, text);
			return;
		}
		if (this.webKitPendingClipboardWritePromise) return this.webKitPendingClipboardWritePromise.complete(text);
		try {
			return await getActiveWindow().navigator.clipboard.writeText(text);
		} catch (error) {
			console.error(error);
		}
		this.fallbackWriteText(text);
	}
	fallbackWriteText(text) {
		const activeDocument = getActiveDocument();
		const activeElement = activeDocument.activeElement;
		const textArea = activeDocument.body.appendChild($("textarea", { "aria-hidden": true }));
		textArea.style.height = "1px";
		textArea.style.width = "1px";
		textArea.style.position = "absolute";
		textArea.value = text;
		textArea.focus();
		textArea.select();
		activeDocument.execCommand("copy");
		if (isHTMLElement(activeElement)) activeElement.focus();
		textArea.remove();
	}
	async readText(type) {
		if (type) return this.mapTextToType.get(type) || "";
		try {
			return await getActiveWindow().navigator.clipboard.readText();
		} catch (error) {
			console.error(error);
		}
		return "";
	}
	async readFindText() {
		return this.findText;
	}
	async writeFindText(text) {
		this.findText = text;
	}
	static {
		this.MAX_RESOURCE_STATE_SOURCE_LENGTH = 1e3;
	}
	async readResources() {
		try {
			const items = await getActiveWindow().navigator.clipboard.read();
			for (const item of items) if (item.types.includes(`web ${vscodeResourcesMime}`)) {
				const blob = await item.getType(`web ${vscodeResourcesMime}`);
				return JSON.parse(await blob.text()).map((x) => URI.from(x));
			}
		} catch (error) {}
		const resourcesStateHash = await this.computeResourcesStateHash();
		if (this.resourcesStateHash !== resourcesStateHash) this.clearResourcesState();
		return this.resources;
	}
	async computeResourcesStateHash() {
		if (this.resources.length === 0) return;
		const clipboardText = await this.readText();
		return hash(clipboardText.substring(0, BrowserClipboardService_1.MAX_RESOURCE_STATE_SOURCE_LENGTH));
	}
	clearInternalState() {
		this.clearResourcesState();
	}
	clearResourcesState() {
		this.resources = [];
		this.resourcesStateHash = void 0;
	}
};
BrowserClipboardService = BrowserClipboardService_1 = __decorate$7([__param$7(0, ILayoutService), __param$7(1, ILogService)], BrowserClipboardService);

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/contextkey/browser/contextKeyService.js
var __decorate$6 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$6 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var KEYBINDING_CONTEXT_ATTR = "data-keybinding-context";
var Context = class {
	constructor(id, parent) {
		this._id = id;
		this._parent = parent;
		this._value = Object.create(null);
		this._value["_contextId"] = id;
	}
	get value() {
		return { ...this._value };
	}
	setValue(key, value) {
		if (this._value[key] !== value) {
			this._value[key] = value;
			return true;
		}
		return false;
	}
	removeValue(key) {
		if (key in this._value) {
			delete this._value[key];
			return true;
		}
		return false;
	}
	getValue(key) {
		const ret = this._value[key];
		if (typeof ret === "undefined" && this._parent) return this._parent.getValue(key);
		return ret;
	}
};
var NullContext = class NullContext extends Context {
	static {
		this.INSTANCE = new NullContext();
	}
	constructor() {
		super(-1, null);
	}
	setValue(key, value) {
		return false;
	}
	removeValue(key) {
		return false;
	}
	getValue(key) {}
};
var ConfigAwareContextValuesContainer = class ConfigAwareContextValuesContainer extends Context {
	static {
		this._keyPrefix = "config.";
	}
	constructor(id, _configurationService, emitter) {
		super(id, null);
		this._configurationService = _configurationService;
		this._values = TernarySearchTree.forConfigKeys();
		this._listener = this._configurationService.onDidChangeConfiguration((event) => {
			if (event.source === 7) {
				const allKeys = Array.from(this._values, ([k]) => k);
				this._values.clear();
				emitter.fire(new ArrayContextKeyChangeEvent(allKeys));
			} else {
				const changedKeys = [];
				for (const configKey of event.affectedKeys) {
					const contextKey = `config.${configKey}`;
					const cachedItems = this._values.findSuperstr(contextKey);
					if (cachedItems !== void 0) {
						changedKeys.push(...Iterable.map(cachedItems, ([key]) => key));
						this._values.deleteSuperstr(contextKey);
					}
					if (this._values.has(contextKey)) {
						changedKeys.push(contextKey);
						this._values.delete(contextKey);
					}
				}
				emitter.fire(new ArrayContextKeyChangeEvent(changedKeys));
			}
		});
	}
	dispose() {
		this._listener.dispose();
	}
	getValue(key) {
		if (key.indexOf(ConfigAwareContextValuesContainer._keyPrefix) !== 0) return super.getValue(key);
		if (this._values.has(key)) return this._values.get(key);
		const configKey = key.substr(ConfigAwareContextValuesContainer._keyPrefix.length);
		const configValue = this._configurationService.getValue(configKey);
		let value = void 0;
		switch (typeof configValue) {
			case "number":
			case "boolean":
			case "string":
				value = configValue;
				break;
			default: if (Array.isArray(configValue)) value = JSON.stringify(configValue);
			else value = configValue;
		}
		this._values.set(key, value);
		return value;
	}
	setValue(key, value) {
		return super.setValue(key, value);
	}
	removeValue(key) {
		return super.removeValue(key);
	}
};
var ContextKey = class {
	constructor(service, key, defaultValue) {
		this._service = service;
		this._key = key;
		this._defaultValue = defaultValue;
		this.reset();
	}
	set(value) {
		this._service.setContext(this._key, value);
	}
	reset() {
		if (typeof this._defaultValue === "undefined") this._service.removeContext(this._key);
		else this._service.setContext(this._key, this._defaultValue);
	}
	get() {
		return this._service.getContextKeyValue(this._key);
	}
};
var SimpleContextKeyChangeEvent = class {
	constructor(key) {
		this.key = key;
	}
	affectsSome(keys) {
		return keys.has(this.key);
	}
	allKeysContainedIn(keys) {
		return this.affectsSome(keys);
	}
};
var ArrayContextKeyChangeEvent = class {
	constructor(keys) {
		this.keys = keys;
	}
	affectsSome(keys) {
		for (const key of this.keys) if (keys.has(key)) return true;
		return false;
	}
	allKeysContainedIn(keys) {
		return this.keys.every((key) => keys.has(key));
	}
};
var CompositeContextKeyChangeEvent = class {
	constructor(events) {
		this.events = events;
	}
	affectsSome(keys) {
		for (const e of this.events) if (e.affectsSome(keys)) return true;
		return false;
	}
	allKeysContainedIn(keys) {
		return this.events.every((evt) => evt.allKeysContainedIn(keys));
	}
};
function allEventKeysInContext(event, context) {
	return event.allKeysContainedIn(new Set(Object.keys(context)));
}
var AbstractContextKeyService = class extends Disposable {
	constructor(myContextId) {
		super();
		this._onDidChangeContext = this._register(new PauseableEmitter({ merge: (input) => new CompositeContextKeyChangeEvent(input) }));
		this.onDidChangeContext = this._onDidChangeContext.event;
		this._isDisposed = false;
		this._myContextId = myContextId;
	}
	createKey(key, defaultValue) {
		if (this._isDisposed) throw new Error(`AbstractContextKeyService has been disposed`);
		return new ContextKey(this, key, defaultValue);
	}
	bufferChangeEvents(callback) {
		this._onDidChangeContext.pause();
		try {
			callback();
		} finally {
			this._onDidChangeContext.resume();
		}
	}
	createScoped(domNode) {
		if (this._isDisposed) throw new Error(`AbstractContextKeyService has been disposed`);
		return new ScopedContextKeyService(this, domNode);
	}
	contextMatchesRules(rules) {
		if (this._isDisposed) throw new Error(`AbstractContextKeyService has been disposed`);
		const context = this.getContextValuesContainer(this._myContextId);
		return rules ? rules.evaluate(context) : true;
	}
	getContextKeyValue(key) {
		if (this._isDisposed) return;
		return this.getContextValuesContainer(this._myContextId).getValue(key);
	}
	setContext(key, value) {
		if (this._isDisposed) return;
		const myContext = this.getContextValuesContainer(this._myContextId);
		if (!myContext) return;
		if (myContext.setValue(key, value)) this._onDidChangeContext.fire(new SimpleContextKeyChangeEvent(key));
	}
	removeContext(key) {
		if (this._isDisposed) return;
		if (this.getContextValuesContainer(this._myContextId).removeValue(key)) this._onDidChangeContext.fire(new SimpleContextKeyChangeEvent(key));
	}
	getContext(target) {
		if (this._isDisposed) return NullContext.INSTANCE;
		return this.getContextValuesContainer(findContextAttr(target));
	}
	dispose() {
		super.dispose();
		this._isDisposed = true;
	}
};
var ContextKeyService = class ContextKeyService$1 extends AbstractContextKeyService {
	constructor(configurationService) {
		super(0);
		this._contexts = /* @__PURE__ */ new Map();
		this._lastContextId = 0;
		const myContext = this._register(new ConfigAwareContextValuesContainer(this._myContextId, configurationService, this._onDidChangeContext));
		this._contexts.set(this._myContextId, myContext);
	}
	getContextValuesContainer(contextId) {
		if (this._isDisposed) return NullContext.INSTANCE;
		return this._contexts.get(contextId) || NullContext.INSTANCE;
	}
	createChildContext(parentContextId = this._myContextId) {
		if (this._isDisposed) throw new Error(`ContextKeyService has been disposed`);
		const id = ++this._lastContextId;
		this._contexts.set(id, new Context(id, this.getContextValuesContainer(parentContextId)));
		return id;
	}
	disposeContext(contextId) {
		if (!this._isDisposed) this._contexts.delete(contextId);
	}
};
ContextKeyService = __decorate$6([__param$6(0, IConfigurationService)], ContextKeyService);
var ScopedContextKeyService = class extends AbstractContextKeyService {
	constructor(parent, domNode) {
		super(parent.createChildContext());
		this._parentChangeListener = this._register(new MutableDisposable());
		this._parent = parent;
		this._updateParentChangeListener();
		this._domNode = domNode;
		if (this._domNode.hasAttribute(KEYBINDING_CONTEXT_ATTR)) {
			let extraInfo = "";
			if (this._domNode.classList) extraInfo = Array.from(this._domNode.classList.values()).join(", ");
			console.error(`Element already has context attribute${extraInfo ? ": " + extraInfo : ""}`);
		}
		this._domNode.setAttribute(KEYBINDING_CONTEXT_ATTR, String(this._myContextId));
	}
	_updateParentChangeListener() {
		this._parentChangeListener.value = this._parent.onDidChangeContext((e) => {
			const thisContextValues = this._parent.getContextValuesContainer(this._myContextId).value;
			if (!allEventKeysInContext(e, thisContextValues)) this._onDidChangeContext.fire(e);
		});
	}
	dispose() {
		if (this._isDisposed) return;
		this._parent.disposeContext(this._myContextId);
		this._domNode.removeAttribute(KEYBINDING_CONTEXT_ATTR);
		super.dispose();
	}
	getContextValuesContainer(contextId) {
		if (this._isDisposed) return NullContext.INSTANCE;
		return this._parent.getContextValuesContainer(contextId);
	}
	createChildContext(parentContextId = this._myContextId) {
		if (this._isDisposed) throw new Error(`ScopedContextKeyService has been disposed`);
		return this._parent.createChildContext(parentContextId);
	}
	disposeContext(contextId) {
		if (this._isDisposed) return;
		this._parent.disposeContext(contextId);
	}
};
function findContextAttr(domNode) {
	while (domNode) {
		if (domNode.hasAttribute(KEYBINDING_CONTEXT_ATTR)) {
			const attr = domNode.getAttribute(KEYBINDING_CONTEXT_ATTR);
			if (attr) return parseInt(attr, 10);
			return NaN;
		}
		domNode = domNode.parentElement;
	}
	return 0;
}
function setContext(accessor, contextKey, contextValue) {
	accessor.get(IContextKeyService).createKey(String(contextKey), stringifyURIs(contextValue));
}
function stringifyURIs(contextValue) {
	return cloneAndChange(contextValue, (obj) => {
		if (typeof obj === "object" && obj.$mid === 1) return URI.revive(obj).toString();
		if (obj instanceof URI) return obj.toString();
	});
}
CommandsRegistry.registerCommand("_setContext", setContext);
CommandsRegistry.registerCommand({
	id: "getContextKeyInfo",
	handler() {
		return [...RawContextKey.all()].sort((a, b) => a.key.localeCompare(b.key));
	},
	metadata: {
		description: localize("getContextKeyInfo", "A command that returns information about context keys"),
		args: []
	}
});
CommandsRegistry.registerCommand("_generateContextKeyInfo", function() {
	const result = [];
	const seen = /* @__PURE__ */ new Set();
	for (const info of RawContextKey.all()) if (!seen.has(info.key)) {
		seen.add(info.key);
		result.push(info);
	}
	result.sort((a, b) => a.key.localeCompare(b.key));
	console.log(JSON.stringify(result, void 0, 2));
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/instantiation/common/graph.js
var Node = class {
	constructor(key, data) {
		this.key = key;
		this.data = data;
		this.incoming = /* @__PURE__ */ new Map();
		this.outgoing = /* @__PURE__ */ new Map();
	}
};
var Graph = class {
	constructor(_hashFn) {
		this._hashFn = _hashFn;
		this._nodes = /* @__PURE__ */ new Map();
	}
	roots() {
		const ret = [];
		for (const node of this._nodes.values()) if (node.outgoing.size === 0) ret.push(node);
		return ret;
	}
	insertEdge(from, to) {
		const fromNode = this.lookupOrInsertNode(from);
		const toNode = this.lookupOrInsertNode(to);
		fromNode.outgoing.set(toNode.key, toNode);
		toNode.incoming.set(fromNode.key, fromNode);
	}
	removeNode(data) {
		const key = this._hashFn(data);
		this._nodes.delete(key);
		for (const node of this._nodes.values()) {
			node.outgoing.delete(key);
			node.incoming.delete(key);
		}
	}
	lookupOrInsertNode(data) {
		const key = this._hashFn(data);
		let node = this._nodes.get(key);
		if (!node) {
			node = new Node(key, data);
			this._nodes.set(key, node);
		}
		return node;
	}
	isEmpty() {
		return this._nodes.size === 0;
	}
	toString() {
		const data = [];
		for (const [key, value] of this._nodes) data.push(`${key}\n\t(-> incoming)[${[...value.incoming.keys()].join(", ")}]\n\t(outgoing ->)[${[...value.outgoing.keys()].join(",")}]\n`);
		return data.join("\n");
	}
	/**
	* This is brute force and slow and **only** be used
	* to trouble shoot.
	*/
	findCycleSlow() {
		for (const [id, node] of this._nodes) {
			const seen = new Set([id]);
			const res = this._findCycle(node, seen);
			if (res) return res;
		}
	}
	_findCycle(node, seen) {
		for (const [id, outgoing] of node.outgoing) {
			if (seen.has(id)) return [...seen, id].join(" -> ");
			seen.add(id);
			const value = this._findCycle(outgoing, seen);
			if (value) return value;
			seen.delete(id);
		}
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiationService.js
var _enableAllTracing = false;
var CyclicDependencyError = class extends Error {
	constructor(graph) {
		super("cyclic dependency between services");
		this.message = graph.findCycleSlow() ?? `UNABLE to detect cycle, dumping graph: \n${graph.toString()}`;
	}
};
var InstantiationService = class InstantiationService {
	constructor(_services = new ServiceCollection(), _strict = false, _parent, _enableTracing = _enableAllTracing) {
		this._services = _services;
		this._strict = _strict;
		this._parent = _parent;
		this._enableTracing = _enableTracing;
		this._isDisposed = false;
		this._servicesToMaybeDispose = /* @__PURE__ */ new Set();
		this._children = /* @__PURE__ */ new Set();
		this._activeInstantiations = /* @__PURE__ */ new Set();
		this._services.set(IInstantiationService, this);
		this._globalGraph = _enableTracing ? _parent?._globalGraph ?? new Graph((e) => e) : void 0;
	}
	dispose() {
		if (!this._isDisposed) {
			this._isDisposed = true;
			dispose(this._children);
			this._children.clear();
			for (const candidate of this._servicesToMaybeDispose) if (isDisposable(candidate)) candidate.dispose();
			this._servicesToMaybeDispose.clear();
		}
	}
	_throwIfDisposed() {
		if (this._isDisposed) throw new Error("InstantiationService has been disposed");
	}
	createChild(services, store) {
		this._throwIfDisposed();
		const that = this;
		const result = new class extends InstantiationService {
			dispose() {
				that._children.delete(result);
				super.dispose();
			}
		}(services, this._strict, this, this._enableTracing);
		this._children.add(result);
		store?.add(result);
		return result;
	}
	invokeFunction(fn, ...args) {
		this._throwIfDisposed();
		const _trace = Trace.traceInvocation(this._enableTracing, fn);
		let _done = false;
		try {
			return fn({ get: (id) => {
				if (_done) throw illegalState("service accessor is only valid during the invocation of its target method");
				const result = this._getOrCreateServiceInstance(id, _trace);
				if (!result) throw new Error(`[invokeFunction] unknown service '${id}'`);
				return result;
			} }, ...args);
		} finally {
			_done = true;
			_trace.stop();
		}
	}
	createInstance(ctorOrDescriptor, ...rest) {
		this._throwIfDisposed();
		let _trace;
		let result;
		if (ctorOrDescriptor instanceof SyncDescriptor) {
			_trace = Trace.traceCreation(this._enableTracing, ctorOrDescriptor.ctor);
			result = this._createInstance(ctorOrDescriptor.ctor, ctorOrDescriptor.staticArguments.concat(rest), _trace);
		} else {
			_trace = Trace.traceCreation(this._enableTracing, ctorOrDescriptor);
			result = this._createInstance(ctorOrDescriptor, rest, _trace);
		}
		_trace.stop();
		return result;
	}
	_createInstance(ctor, args = [], _trace) {
		const serviceDependencies = _util.getServiceDependencies(ctor).sort((a, b) => a.index - b.index);
		const serviceArgs = [];
		for (const dependency of serviceDependencies) {
			const service = this._getOrCreateServiceInstance(dependency.id, _trace);
			if (!service) this._throwIfStrict(`[createInstance] ${ctor.name} depends on UNKNOWN service ${dependency.id}.`, false);
			serviceArgs.push(service);
		}
		const firstServiceArgPos = serviceDependencies.length > 0 ? serviceDependencies[0].index : args.length;
		if (args.length !== firstServiceArgPos) {
			console.trace(`[createInstance] First service dependency of ${ctor.name} at position ${firstServiceArgPos + 1} conflicts with ${args.length} static arguments`);
			const delta = firstServiceArgPos - args.length;
			if (delta > 0) args = args.concat(new Array(delta));
			else args = args.slice(0, firstServiceArgPos);
		}
		return Reflect.construct(ctor, args.concat(serviceArgs));
	}
	_setCreatedServiceInstance(id, instance) {
		if (this._services.get(id) instanceof SyncDescriptor) this._services.set(id, instance);
		else if (this._parent) this._parent._setCreatedServiceInstance(id, instance);
		else throw new Error("illegalState - setting UNKNOWN service instance");
	}
	_getServiceInstanceOrDescriptor(id) {
		const instanceOrDesc = this._services.get(id);
		if (!instanceOrDesc && this._parent) return this._parent._getServiceInstanceOrDescriptor(id);
		else return instanceOrDesc;
	}
	_getOrCreateServiceInstance(id, _trace) {
		if (this._globalGraph && this._globalGraphImplicitDependency) this._globalGraph.insertEdge(this._globalGraphImplicitDependency, String(id));
		const thing = this._getServiceInstanceOrDescriptor(id);
		if (thing instanceof SyncDescriptor) return this._safeCreateAndCacheServiceInstance(id, thing, _trace.branch(id, true));
		else {
			_trace.branch(id, false);
			return thing;
		}
	}
	_safeCreateAndCacheServiceInstance(id, desc, _trace) {
		if (this._activeInstantiations.has(id)) throw new Error(`illegal state - RECURSIVELY instantiating service '${id}'`);
		this._activeInstantiations.add(id);
		try {
			return this._createAndCacheServiceInstance(id, desc, _trace);
		} finally {
			this._activeInstantiations.delete(id);
		}
	}
	_createAndCacheServiceInstance(id, desc, _trace) {
		const graph = new Graph((data) => data.id.toString());
		let cycleCount = 0;
		const stack = [{
			id,
			desc,
			_trace
		}];
		const seen = /* @__PURE__ */ new Set();
		while (stack.length) {
			const item = stack.pop();
			if (seen.has(String(item.id))) continue;
			seen.add(String(item.id));
			graph.lookupOrInsertNode(item);
			if (cycleCount++ > 1e3) throw new CyclicDependencyError(graph);
			for (const dependency of _util.getServiceDependencies(item.desc.ctor)) {
				const instanceOrDesc = this._getServiceInstanceOrDescriptor(dependency.id);
				if (!instanceOrDesc) this._throwIfStrict(`[createInstance] ${id} depends on ${dependency.id} which is NOT registered.`, true);
				this._globalGraph?.insertEdge(String(item.id), String(dependency.id));
				if (instanceOrDesc instanceof SyncDescriptor) {
					const d = {
						id: dependency.id,
						desc: instanceOrDesc,
						_trace: item._trace.branch(dependency.id, true)
					};
					graph.insertEdge(item, d);
					stack.push(d);
				}
			}
		}
		while (true) {
			const roots = graph.roots();
			if (roots.length === 0) {
				if (!graph.isEmpty()) throw new CyclicDependencyError(graph);
				break;
			}
			for (const { data } of roots) {
				if (this._getServiceInstanceOrDescriptor(data.id) instanceof SyncDescriptor) {
					const instance = this._createServiceInstanceWithOwner(data.id, data.desc.ctor, data.desc.staticArguments, data.desc.supportsDelayedInstantiation, data._trace);
					this._setCreatedServiceInstance(data.id, instance);
				}
				graph.removeNode(data);
			}
		}
		return this._getServiceInstanceOrDescriptor(id);
	}
	_createServiceInstanceWithOwner(id, ctor, args = [], supportsDelayedInstantiation, _trace) {
		if (this._services.get(id) instanceof SyncDescriptor) return this._createServiceInstance(id, ctor, args, supportsDelayedInstantiation, _trace, this._servicesToMaybeDispose);
		else if (this._parent) return this._parent._createServiceInstanceWithOwner(id, ctor, args, supportsDelayedInstantiation, _trace);
		else throw new Error(`illegalState - creating UNKNOWN service instance ${ctor.name}`);
	}
	_createServiceInstance(id, ctor, args = [], supportsDelayedInstantiation, _trace, disposeBucket) {
		if (!supportsDelayedInstantiation) {
			const result = this._createInstance(ctor, args, _trace);
			disposeBucket.add(result);
			return result;
		} else {
			const child = new InstantiationService(void 0, this._strict, this, this._enableTracing);
			child._globalGraphImplicitDependency = String(id);
			const earlyListeners = /* @__PURE__ */ new Map();
			const idle = new GlobalIdleValue(() => {
				const result = child._createInstance(ctor, args, _trace);
				for (const [key, values] of earlyListeners) {
					const candidate = result[key];
					if (typeof candidate === "function") for (const value of values) value.disposable = candidate.apply(result, value.listener);
				}
				earlyListeners.clear();
				disposeBucket.add(result);
				return result;
			});
			return new Proxy(Object.create(null), {
				get(target, key) {
					if (!idle.isInitialized) {
						if (typeof key === "string" && (key.startsWith("onDid") || key.startsWith("onWill"))) {
							let list = earlyListeners.get(key);
							if (!list) {
								list = new LinkedList();
								earlyListeners.set(key, list);
							}
							const event = (callback, thisArg, disposables) => {
								if (idle.isInitialized) return idle.value[key](callback, thisArg, disposables);
								else {
									const entry = {
										listener: [
											callback,
											thisArg,
											disposables
										],
										disposable: void 0
									};
									const rm = list.push(entry);
									return toDisposable(() => {
										rm();
										entry.disposable?.dispose();
									});
								}
							};
							return event;
						}
					}
					if (key in target) return target[key];
					const obj = idle.value;
					let prop = obj[key];
					if (typeof prop !== "function") return prop;
					prop = prop.bind(obj);
					target[key] = prop;
					return prop;
				},
				set(_target, p, value) {
					idle.value[p] = value;
					return true;
				},
				getPrototypeOf(_target) {
					return ctor.prototype;
				}
			});
		}
	}
	_throwIfStrict(msg, printWarning) {
		if (printWarning) console.warn(msg);
		if (this._strict) throw new Error(msg);
	}
};
var Trace = class Trace {
	static {
		this.all = /* @__PURE__ */ new Set();
	}
	static {
		this._None = new class extends Trace {
			constructor() {
				super(0, null);
			}
			stop() {}
			branch() {
				return this;
			}
		}();
	}
	static traceInvocation(_enableTracing, ctor) {
		return !_enableTracing ? Trace._None : new Trace(2, ctor.name || (/* @__PURE__ */ new Error()).stack.split("\n").slice(3, 4).join("\n"));
	}
	static traceCreation(_enableTracing, ctor) {
		return !_enableTracing ? Trace._None : new Trace(1, ctor.name);
	}
	static {
		this._totals = 0;
	}
	constructor(type, name) {
		this.type = type;
		this.name = name;
		this._start = Date.now();
		this._dep = [];
	}
	branch(id, first) {
		const child = new Trace(3, id.toString());
		this._dep.push([
			id,
			first,
			child
		]);
		return child;
	}
	stop() {
		const dur = Date.now() - this._start;
		Trace._totals += dur;
		let causedCreation = false;
		function printChild(n, trace) {
			const res = [];
			const prefix = new Array(n + 1).join("	");
			for (const [id, first, child] of trace._dep) if (first && child) {
				causedCreation = true;
				res.push(`${prefix}CREATES -> ${id}`);
				const nested = printChild(n + 1, child);
				if (nested) res.push(nested);
			} else res.push(`${prefix}uses -> ${id}`);
			return res.join("\n");
		}
		const lines = [
			`${this.type === 1 ? "CREATE" : "CALL"} ${this.name}`,
			`${printChild(1, this)}`,
			`DONE, took ${dur.toFixed(2)}ms (grand total ${Trace._totals.toFixed(2)}ms)`
		];
		if (dur > 2 || causedCreation) Trace.all.add(lines.join("\n"));
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/markers/common/markerService.js
const unsupportedSchemas = new Set([
	Schemas.inMemory,
	Schemas.vscodeSourceControl,
	Schemas.walkThrough,
	Schemas.walkThroughSnippet,
	Schemas.vscodeChatCodeBlock
]);
var DoubleResourceMap = class {
	constructor() {
		this._byResource = new ResourceMap();
		this._byOwner = /* @__PURE__ */ new Map();
	}
	set(resource, owner, value) {
		let ownerMap = this._byResource.get(resource);
		if (!ownerMap) {
			ownerMap = /* @__PURE__ */ new Map();
			this._byResource.set(resource, ownerMap);
		}
		ownerMap.set(owner, value);
		let resourceMap = this._byOwner.get(owner);
		if (!resourceMap) {
			resourceMap = new ResourceMap();
			this._byOwner.set(owner, resourceMap);
		}
		resourceMap.set(resource, value);
	}
	get(resource, owner) {
		return this._byResource.get(resource)?.get(owner);
	}
	delete(resource, owner) {
		let removedA = false;
		let removedB = false;
		const ownerMap = this._byResource.get(resource);
		if (ownerMap) removedA = ownerMap.delete(owner);
		const resourceMap = this._byOwner.get(owner);
		if (resourceMap) removedB = resourceMap.delete(resource);
		if (removedA !== removedB) throw new Error("illegal state");
		return removedA && removedB;
	}
	values(key) {
		if (typeof key === "string") return this._byOwner.get(key)?.values() ?? Iterable.empty();
		if (URI.isUri(key)) return this._byResource.get(key)?.values() ?? Iterable.empty();
		return Iterable.map(Iterable.concat(...this._byOwner.values()), (map) => map[1]);
	}
};
var MarkerStats = class {
	constructor(service) {
		this.errors = 0;
		this.infos = 0;
		this.warnings = 0;
		this.unknowns = 0;
		this._data = new ResourceMap();
		this._service = service;
		this._subscription = service.onMarkerChanged(this._update, this);
	}
	dispose() {
		this._subscription.dispose();
	}
	_update(resources) {
		for (const resource of resources) {
			const oldStats = this._data.get(resource);
			if (oldStats) this._substract(oldStats);
			const newStats = this._resourceStats(resource);
			this._add(newStats);
			this._data.set(resource, newStats);
		}
	}
	_resourceStats(resource) {
		const result = {
			errors: 0,
			warnings: 0,
			infos: 0,
			unknowns: 0
		};
		if (unsupportedSchemas.has(resource.scheme)) return result;
		for (const { severity } of this._service.read({ resource })) if (severity === MarkerSeverity$1.Error) result.errors += 1;
		else if (severity === MarkerSeverity$1.Warning) result.warnings += 1;
		else if (severity === MarkerSeverity$1.Info) result.infos += 1;
		else result.unknowns += 1;
		return result;
	}
	_substract(op) {
		this.errors -= op.errors;
		this.warnings -= op.warnings;
		this.infos -= op.infos;
		this.unknowns -= op.unknowns;
	}
	_add(op) {
		this.errors += op.errors;
		this.warnings += op.warnings;
		this.infos += op.infos;
		this.unknowns += op.unknowns;
	}
};
var MarkerService = class MarkerService {
	constructor() {
		this._onMarkerChanged = new DebounceEmitter({
			delay: 0,
			merge: MarkerService._merge
		});
		this.onMarkerChanged = this._onMarkerChanged.event;
		this._data = new DoubleResourceMap();
		this._stats = new MarkerStats(this);
	}
	dispose() {
		this._stats.dispose();
		this._onMarkerChanged.dispose();
	}
	remove(owner, resources) {
		for (const resource of resources || []) this.changeOne(owner, resource, []);
	}
	changeOne(owner, resource, markerData) {
		if (isFalsyOrEmpty(markerData)) {
			if (this._data.delete(resource, owner)) this._onMarkerChanged.fire([resource]);
		} else {
			const markers = [];
			for (const data of markerData) {
				const marker = MarkerService._toMarker(owner, resource, data);
				if (marker) markers.push(marker);
			}
			this._data.set(resource, owner, markers);
			this._onMarkerChanged.fire([resource]);
		}
	}
	static _toMarker(owner, resource, data) {
		let { code, severity, message, source, startLineNumber, startColumn, endLineNumber, endColumn, relatedInformation, tags } = data;
		if (!message) return;
		startLineNumber = startLineNumber > 0 ? startLineNumber : 1;
		startColumn = startColumn > 0 ? startColumn : 1;
		endLineNumber = endLineNumber >= startLineNumber ? endLineNumber : startLineNumber;
		endColumn = endColumn > 0 ? endColumn : startColumn;
		return {
			resource,
			owner,
			code,
			severity,
			message,
			source,
			startLineNumber,
			startColumn,
			endLineNumber,
			endColumn,
			relatedInformation,
			tags
		};
	}
	changeAll(owner, data) {
		const changes = [];
		const existing = this._data.values(owner);
		if (existing) for (const data$1 of existing) {
			const first = Iterable.first(data$1);
			if (first) {
				changes.push(first.resource);
				this._data.delete(first.resource, owner);
			}
		}
		if (isNonEmptyArray(data)) {
			const groups = new ResourceMap();
			for (const { resource, marker: markerData } of data) {
				const marker = MarkerService._toMarker(owner, resource, markerData);
				if (!marker) continue;
				const array = groups.get(resource);
				if (!array) {
					groups.set(resource, [marker]);
					changes.push(resource);
				} else array.push(marker);
			}
			for (const [resource, value] of groups) this._data.set(resource, owner, value);
		}
		if (changes.length > 0) this._onMarkerChanged.fire(changes);
	}
	read(filter = Object.create(null)) {
		let { owner, resource, severities, take } = filter;
		if (!take || take < 0) take = -1;
		if (owner && resource) {
			const data = this._data.get(resource, owner);
			if (!data) return [];
			else {
				const result = [];
				for (const marker of data) if (MarkerService._accept(marker, severities)) {
					const newLen = result.push(marker);
					if (take > 0 && newLen === take) break;
				}
				return result;
			}
		} else if (!owner && !resource) {
			const result = [];
			for (const markers of this._data.values()) for (const data of markers) if (MarkerService._accept(data, severities)) {
				const newLen = result.push(data);
				if (take > 0 && newLen === take) return result;
			}
			return result;
		} else {
			const iterable = this._data.values(resource ?? owner);
			const result = [];
			for (const markers of iterable) for (const data of markers) if (MarkerService._accept(data, severities)) {
				const newLen = result.push(data);
				if (take > 0 && newLen === take) return result;
			}
			return result;
		}
	}
	static _accept(marker, severities) {
		return severities === void 0 || (severities & marker.severity) === marker.severity;
	}
	static _merge(all) {
		const set = new ResourceMap();
		for (const array of all) for (const item of array) set.set(item, true);
		return Array.from(set.keys());
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/configuration/common/configurations.js
var DefaultConfiguration = class extends Disposable {
	get configurationModel() {
		return this._configurationModel;
	}
	constructor(logService) {
		super();
		this.logService = logService;
		this._configurationModel = ConfigurationModel.createEmptyModel(this.logService);
	}
	reload() {
		this.resetConfigurationModel();
		return this.configurationModel;
	}
	getConfigurationDefaultOverrides() {
		return {};
	}
	resetConfigurationModel() {
		this._configurationModel = ConfigurationModel.createEmptyModel(this.logService);
		const properties = Registry.as(Extensions.Configuration).getConfigurationProperties();
		this.updateConfigurationModel(Object.keys(properties), properties);
	}
	updateConfigurationModel(properties, configurationProperties) {
		const configurationDefaultsOverrides = this.getConfigurationDefaultOverrides();
		for (const key of properties) {
			const defaultOverrideValue = configurationDefaultsOverrides[key];
			const propertySchema = configurationProperties[key];
			if (defaultOverrideValue !== void 0) this._configurationModel.setValue(key, defaultOverrideValue);
			else if (propertySchema) this._configurationModel.setValue(key, propertySchema.default);
			else this._configurationModel.removeValue(key);
		}
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/log/common/logService.js
var LogService = class extends Disposable {
	constructor(primaryLogger, otherLoggers = []) {
		super();
		this.logger = new MultiplexLogger([primaryLogger, ...otherLoggers]);
		this._register(primaryLogger.onDidChangeLogLevel((level) => this.setLevel(level)));
	}
	get onDidChangeLogLevel() {
		return this.logger.onDidChangeLogLevel;
	}
	setLevel(level) {
		this.logger.setLevel(level);
	}
	getLevel() {
		return this.logger.getLevel();
	}
	trace(message, ...args) {
		this.logger.trace(message, ...args);
	}
	debug(message, ...args) {
		this.logger.debug(message, ...args);
	}
	info(message, ...args) {
		this.logger.info(message, ...args);
	}
	warn(message, ...args) {
		this.logger.warn(message, ...args);
	}
	error(message, ...args) {
		this.logger.error(message, ...args);
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneTreeSitterService.js
/**
* The monaco build doesn't like the dynamic import of tree sitter in the real service.
* We use a dummy sertive here to make the build happy.
*/
var StandaloneTreeSitterParserService = class {
	getParseResult(textModel) {}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js
var __decorate$5 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$5 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var SimpleModel = class {
	constructor(model) {
		this.disposed = false;
		this.model = model;
		this._onWillDispose = new Emitter$1();
	}
	get textEditorModel() {
		return this.model;
	}
	dispose() {
		this.disposed = true;
		this._onWillDispose.fire();
	}
};
var StandaloneTextModelService = class StandaloneTextModelService$1 {
	constructor(modelService) {
		this.modelService = modelService;
	}
	createModelReference(resource) {
		const model = this.modelService.getModel(resource);
		if (!model) return Promise.reject(/* @__PURE__ */ new Error(`Model not found`));
		return Promise.resolve(new ImmortalReference(new SimpleModel(model)));
	}
};
StandaloneTextModelService = __decorate$5([__param$5(0, IModelService)], StandaloneTextModelService);
var StandaloneEditorProgressService = class StandaloneEditorProgressService {
	static {
		this.NULL_PROGRESS_RUNNER = {
			done: () => {},
			total: () => {},
			worked: () => {}
		};
	}
	show() {
		return StandaloneEditorProgressService.NULL_PROGRESS_RUNNER;
	}
	async showWhile(promise, delay) {
		await promise;
	}
};
var StandaloneProgressService = class {
	withProgress(_options, task, onDidCancel) {
		return task({ report: () => {} });
	}
};
var StandaloneEnvironmentService = class {
	constructor() {
		this.isExtensionDevelopment = false;
		this.isBuilt = false;
	}
};
var StandaloneDialogService = class {
	async confirm(confirmation) {
		return {
			confirmed: this.doConfirm(confirmation.message, confirmation.detail),
			checkboxChecked: false
		};
	}
	doConfirm(message, detail) {
		let messageText = message;
		if (detail) messageText = messageText + "\n\n" + detail;
		return mainWindow.confirm(messageText);
	}
	async prompt(prompt) {
		let result = void 0;
		if (this.doConfirm(prompt.message, prompt.detail)) {
			const promptButtons = [...prompt.buttons ?? []];
			if (prompt.cancelButton && typeof prompt.cancelButton !== "string" && typeof prompt.cancelButton !== "boolean") promptButtons.push(prompt.cancelButton);
			result = await promptButtons[0]?.run({ checkboxChecked: false });
		}
		return { result };
	}
	async error(message, detail) {
		await this.prompt({
			type: severity_default.Error,
			message,
			detail
		});
	}
};
var StandaloneNotificationService = class StandaloneNotificationService {
	static {
		this.NO_OP = new NoOpNotification();
	}
	info(message) {
		return this.notify({
			severity: severity_default.Info,
			message
		});
	}
	warn(message) {
		return this.notify({
			severity: severity_default.Warning,
			message
		});
	}
	error(error) {
		return this.notify({
			severity: severity_default.Error,
			message: error
		});
	}
	notify(notification) {
		switch (notification.severity) {
			case severity_default.Error:
				console.error(notification.message);
				break;
			case severity_default.Warning:
				console.warn(notification.message);
				break;
			default:
				console.log(notification.message);
				break;
		}
		return StandaloneNotificationService.NO_OP;
	}
	prompt(severity, message, choices, options) {
		return StandaloneNotificationService.NO_OP;
	}
	status(message, options) {
		return Disposable.None;
	}
};
var StandaloneCommandService = class StandaloneCommandService$1 {
	constructor(instantiationService) {
		this._onWillExecuteCommand = new Emitter$1();
		this._onDidExecuteCommand = new Emitter$1();
		this.onDidExecuteCommand = this._onDidExecuteCommand.event;
		this._instantiationService = instantiationService;
	}
	executeCommand(id, ...args) {
		const command = CommandsRegistry.getCommand(id);
		if (!command) return Promise.reject(/* @__PURE__ */ new Error(`command '${id}' not found`));
		try {
			this._onWillExecuteCommand.fire({
				commandId: id,
				args
			});
			const result = this._instantiationService.invokeFunction.apply(this._instantiationService, [command.handler, ...args]);
			this._onDidExecuteCommand.fire({
				commandId: id,
				args
			});
			return Promise.resolve(result);
		} catch (err) {
			return Promise.reject(err);
		}
	}
};
StandaloneCommandService = __decorate$5([__param$5(0, IInstantiationService)], StandaloneCommandService);
var StandaloneKeybindingService = class StandaloneKeybindingService$1 extends AbstractKeybindingService {
	constructor(contextKeyService, commandService, telemetryService, notificationService, logService, codeEditorService) {
		super(contextKeyService, commandService, telemetryService, notificationService, logService);
		this._cachedResolver = null;
		this._dynamicKeybindings = [];
		this._domNodeListeners = [];
		const addContainer = (domNode) => {
			const disposables = new DisposableStore();
			disposables.add(addDisposableListener(domNode, EventType$1.KEY_DOWN, (e) => {
				const keyEvent = new StandardKeyboardEvent(e);
				if (this._dispatch(keyEvent, keyEvent.target)) {
					keyEvent.preventDefault();
					keyEvent.stopPropagation();
				}
			}));
			disposables.add(addDisposableListener(domNode, EventType$1.KEY_UP, (e) => {
				const keyEvent = new StandardKeyboardEvent(e);
				if (this._singleModifierDispatch(keyEvent, keyEvent.target)) keyEvent.preventDefault();
			}));
			this._domNodeListeners.push(new DomNodeListeners(domNode, disposables));
		};
		const removeContainer = (domNode) => {
			for (let i = 0; i < this._domNodeListeners.length; i++) {
				const domNodeListeners = this._domNodeListeners[i];
				if (domNodeListeners.domNode === domNode) {
					this._domNodeListeners.splice(i, 1);
					domNodeListeners.dispose();
				}
			}
		};
		const addCodeEditor = (codeEditor) => {
			if (codeEditor.getOption(61)) return;
			addContainer(codeEditor.getContainerDomNode());
		};
		const removeCodeEditor = (codeEditor) => {
			if (codeEditor.getOption(61)) return;
			removeContainer(codeEditor.getContainerDomNode());
		};
		this._register(codeEditorService.onCodeEditorAdd(addCodeEditor));
		this._register(codeEditorService.onCodeEditorRemove(removeCodeEditor));
		codeEditorService.listCodeEditors().forEach(addCodeEditor);
		const addDiffEditor = (diffEditor) => {
			addContainer(diffEditor.getContainerDomNode());
		};
		const removeDiffEditor = (diffEditor) => {
			removeContainer(diffEditor.getContainerDomNode());
		};
		this._register(codeEditorService.onDiffEditorAdd(addDiffEditor));
		this._register(codeEditorService.onDiffEditorRemove(removeDiffEditor));
		codeEditorService.listDiffEditors().forEach(addDiffEditor);
	}
	addDynamicKeybinding(command, keybinding, handler, when) {
		return combinedDisposable(CommandsRegistry.registerCommand(command, handler), this.addDynamicKeybindings([{
			keybinding,
			command,
			when
		}]));
	}
	addDynamicKeybindings(rules) {
		const entries = rules.map((rule) => {
			return {
				keybinding: decodeKeybinding(rule.keybinding, OS),
				command: rule.command ?? null,
				commandArgs: rule.commandArgs,
				when: rule.when,
				weight1: 1e3,
				weight2: 0,
				extensionId: null,
				isBuiltinExtension: false
			};
		});
		this._dynamicKeybindings = this._dynamicKeybindings.concat(entries);
		this.updateResolver();
		return toDisposable(() => {
			for (let i = 0; i < this._dynamicKeybindings.length; i++) if (this._dynamicKeybindings[i] === entries[0]) {
				this._dynamicKeybindings.splice(i, entries.length);
				this.updateResolver();
				return;
			}
		});
	}
	updateResolver() {
		this._cachedResolver = null;
		this._onDidUpdateKeybindings.fire();
	}
	_getResolver() {
		if (!this._cachedResolver) {
			const defaults = this._toNormalizedKeybindingItems(KeybindingsRegistry.getDefaultKeybindings(), true);
			const overrides = this._toNormalizedKeybindingItems(this._dynamicKeybindings, false);
			this._cachedResolver = new KeybindingResolver(defaults, overrides, (str) => this._log(str));
		}
		return this._cachedResolver;
	}
	_documentHasFocus() {
		return mainWindow.document.hasFocus();
	}
	_toNormalizedKeybindingItems(items, isDefault) {
		const result = [];
		let resultLen = 0;
		for (const item of items) {
			const when = item.when || void 0;
			const keybinding = item.keybinding;
			if (!keybinding) result[resultLen++] = new ResolvedKeybindingItem(void 0, item.command, item.commandArgs, when, isDefault, null, false);
			else {
				const resolvedKeybindings = USLayoutResolvedKeybinding.resolveKeybinding(keybinding, OS);
				for (const resolvedKeybinding of resolvedKeybindings) result[resultLen++] = new ResolvedKeybindingItem(resolvedKeybinding, item.command, item.commandArgs, when, isDefault, null, false);
			}
		}
		return result;
	}
	resolveKeyboardEvent(keyboardEvent) {
		const chord = new KeyCodeChord(keyboardEvent.ctrlKey, keyboardEvent.shiftKey, keyboardEvent.altKey, keyboardEvent.metaKey, keyboardEvent.keyCode);
		return new USLayoutResolvedKeybinding([chord], OS);
	}
};
StandaloneKeybindingService = __decorate$5([
	__param$5(0, IContextKeyService),
	__param$5(1, ICommandService),
	__param$5(2, ITelemetryService),
	__param$5(3, INotificationService),
	__param$5(4, ILogService),
	__param$5(5, ICodeEditorService)
], StandaloneKeybindingService);
var DomNodeListeners = class extends Disposable {
	constructor(domNode, disposables) {
		super();
		this.domNode = domNode;
		this._register(disposables);
	}
};
function isConfigurationOverrides(thing) {
	return thing && typeof thing === "object" && (!thing.overrideIdentifier || typeof thing.overrideIdentifier === "string") && (!thing.resource || thing.resource instanceof URI);
}
var StandaloneConfigurationService = class StandaloneConfigurationService$1 {
	constructor(logService) {
		this.logService = logService;
		this._onDidChangeConfiguration = new Emitter$1();
		this.onDidChangeConfiguration = this._onDidChangeConfiguration.event;
		const defaultConfiguration = new DefaultConfiguration(logService);
		this._configuration = new Configuration(defaultConfiguration.reload(), ConfigurationModel.createEmptyModel(logService), ConfigurationModel.createEmptyModel(logService), ConfigurationModel.createEmptyModel(logService), ConfigurationModel.createEmptyModel(logService), ConfigurationModel.createEmptyModel(logService), new ResourceMap(), ConfigurationModel.createEmptyModel(logService), new ResourceMap(), logService);
		defaultConfiguration.dispose();
	}
	getValue(arg1, arg2) {
		const section = typeof arg1 === "string" ? arg1 : void 0;
		const overrides = isConfigurationOverrides(arg1) ? arg1 : isConfigurationOverrides(arg2) ? arg2 : {};
		return this._configuration.getValue(section, overrides, void 0);
	}
	updateValues(values) {
		const previous = { data: this._configuration.toData() };
		const changedKeys = [];
		for (const entry of values) {
			const [key, value] = entry;
			if (this.getValue(key) === value) continue;
			this._configuration.updateValue(key, value);
			changedKeys.push(key);
		}
		if (changedKeys.length > 0) {
			const configurationChangeEvent = new ConfigurationChangeEvent({
				keys: changedKeys,
				overrides: []
			}, previous, this._configuration, void 0, this.logService);
			configurationChangeEvent.source = 8;
			this._onDidChangeConfiguration.fire(configurationChangeEvent);
		}
		return Promise.resolve();
	}
	updateValue(key, value, arg3, arg4) {
		return this.updateValues([[key, value]]);
	}
	inspect(key, options = {}) {
		return this._configuration.inspect(key, options, void 0);
	}
};
StandaloneConfigurationService = __decorate$5([__param$5(0, ILogService)], StandaloneConfigurationService);
var StandaloneResourceConfigurationService = class StandaloneResourceConfigurationService$1 {
	constructor(configurationService, modelService, languageService) {
		this.configurationService = configurationService;
		this.modelService = modelService;
		this.languageService = languageService;
		this._onDidChangeConfiguration = new Emitter$1();
		this.configurationService.onDidChangeConfiguration((e) => {
			this._onDidChangeConfiguration.fire({
				affectedKeys: e.affectedKeys,
				affectsConfiguration: (resource, configuration) => e.affectsConfiguration(configuration)
			});
		});
	}
	getValue(resource, arg2, arg3) {
		const position = Position$1.isIPosition(arg2) ? arg2 : null;
		const section = position ? typeof arg3 === "string" ? arg3 : void 0 : typeof arg2 === "string" ? arg2 : void 0;
		const language = resource ? this.getLanguage(resource, position) : void 0;
		if (typeof section === "undefined") return this.configurationService.getValue({
			resource,
			overrideIdentifier: language
		});
		return this.configurationService.getValue(section, {
			resource,
			overrideIdentifier: language
		});
	}
	getLanguage(resource, position) {
		const model = this.modelService.getModel(resource);
		if (model) return position ? model.getLanguageIdAtPosition(position.lineNumber, position.column) : model.getLanguageId();
		return this.languageService.guessLanguageIdByFilepathOrFirstLine(resource);
	}
};
StandaloneResourceConfigurationService = __decorate$5([
	__param$5(0, IConfigurationService),
	__param$5(1, IModelService),
	__param$5(2, ILanguageService)
], StandaloneResourceConfigurationService);
var StandaloneResourcePropertiesService = class StandaloneResourcePropertiesService$1 {
	constructor(configurationService) {
		this.configurationService = configurationService;
	}
	getEOL(resource, language) {
		const eol = this.configurationService.getValue("files.eol", {
			overrideIdentifier: language,
			resource
		});
		if (eol && typeof eol === "string" && eol !== "auto") return eol;
		return isLinux || isMacintosh ? "\n" : "\r\n";
	}
};
StandaloneResourcePropertiesService = __decorate$5([__param$5(0, IConfigurationService)], StandaloneResourcePropertiesService);
var StandaloneTelemetryService = class {
	publicLog2() {}
};
var StandaloneWorkspaceContextService = class StandaloneWorkspaceContextService {
	static {
		this.SCHEME = "inmemory";
	}
	constructor() {
		const resource = URI.from({
			scheme: StandaloneWorkspaceContextService.SCHEME,
			authority: "model",
			path: "/"
		});
		this.workspace = {
			id: STANDALONE_EDITOR_WORKSPACE_ID,
			folders: [new WorkspaceFolder({
				uri: resource,
				name: "",
				index: 0
			})]
		};
	}
	getWorkspace() {
		return this.workspace;
	}
	getWorkspaceFolder(resource) {
		return resource && resource.scheme === StandaloneWorkspaceContextService.SCHEME ? this.workspace.folders[0] : null;
	}
};
function updateConfigurationService(configurationService, source, isDiffEditor) {
	if (!source) return;
	if (!(configurationService instanceof StandaloneConfigurationService)) return;
	const toUpdate = [];
	Object.keys(source).forEach((key) => {
		if (isEditorConfigurationKey(key)) toUpdate.push([`editor.${key}`, source[key]]);
		if (isDiffEditor && isDiffEditorConfigurationKey(key)) toUpdate.push([`diffEditor.${key}`, source[key]]);
	});
	if (toUpdate.length > 0) configurationService.updateValues(toUpdate);
}
var StandaloneBulkEditService = class StandaloneBulkEditService$1 {
	constructor(_modelService) {
		this._modelService = _modelService;
	}
	hasPreviewHandler() {
		return false;
	}
	async apply(editsIn, _options) {
		const edits = Array.isArray(editsIn) ? editsIn : ResourceEdit.convert(editsIn);
		const textEdits = /* @__PURE__ */ new Map();
		for (const edit of edits) {
			if (!(edit instanceof ResourceTextEdit)) throw new Error("bad edit - only text edits are supported");
			const model = this._modelService.getModel(edit.resource);
			if (!model) throw new Error("bad edit - model not found");
			if (typeof edit.versionId === "number" && model.getVersionId() !== edit.versionId) throw new Error("bad state - model changed in the meantime");
			let array = textEdits.get(model);
			if (!array) {
				array = [];
				textEdits.set(model, array);
			}
			array.push(EditOperation.replaceMove(Range$1.lift(edit.textEdit.range), edit.textEdit.text));
		}
		let totalEdits = 0;
		let totalFiles = 0;
		for (const [model, edits$1] of textEdits) {
			model.pushStackElement();
			model.pushEditOperations([], edits$1, () => []);
			model.pushStackElement();
			totalFiles += 1;
			totalEdits += edits$1.length;
		}
		return {
			ariaSummary: format(StandaloneServicesNLS.bulkEditServiceSummary, totalEdits, totalFiles),
			isApplied: totalEdits > 0
		};
	}
};
StandaloneBulkEditService = __decorate$5([__param$5(0, IModelService)], StandaloneBulkEditService);
var StandaloneUriLabelService = class {
	getUriLabel(resource, options) {
		if (resource.scheme === "file") return resource.fsPath;
		return resource.path;
	}
	getUriBasenameLabel(resource) {
		return basename(resource);
	}
};
var StandaloneContextViewService = class StandaloneContextViewService$1 extends ContextViewService {
	constructor(layoutService, _codeEditorService) {
		super(layoutService);
		this._codeEditorService = _codeEditorService;
	}
	showContextView(delegate, container, shadowRoot) {
		if (!container) {
			const codeEditor = this._codeEditorService.getFocusedCodeEditor() || this._codeEditorService.getActiveCodeEditor();
			if (codeEditor) container = codeEditor.getContainerDomNode();
		}
		return super.showContextView(delegate, container, shadowRoot);
	}
};
StandaloneContextViewService = __decorate$5([__param$5(0, ILayoutService), __param$5(1, ICodeEditorService)], StandaloneContextViewService);
var StandaloneWorkspaceTrustManagementService = class {
	constructor() {
		this._neverEmitter = new Emitter$1();
		this.onDidChangeTrust = this._neverEmitter.event;
	}
	isWorkspaceTrusted() {
		return true;
	}
};
var StandaloneLanguageService = class extends LanguageService {
	constructor() {
		super();
	}
};
var StandaloneLogService = class extends LogService {
	constructor() {
		super(new ConsoleLogger());
	}
};
var StandaloneContextMenuService = class StandaloneContextMenuService$1 extends ContextMenuService {
	constructor(telemetryService, notificationService, contextViewService, keybindingService, menuService, contextKeyService) {
		super(telemetryService, notificationService, contextViewService, keybindingService, menuService, contextKeyService);
		this.configure({ blockMouse: false });
	}
};
StandaloneContextMenuService = __decorate$5([
	__param$5(0, ITelemetryService),
	__param$5(1, INotificationService),
	__param$5(2, IContextViewService),
	__param$5(3, IKeybindingService),
	__param$5(4, IMenuService),
	__param$5(5, IContextKeyService)
], StandaloneContextMenuService);
const standaloneEditorWorkerDescriptor = {
	amdModuleId: "vs/editor/common/services/editorSimpleWorker",
	esmModuleLocation: void 0,
	label: "editorWorkerService"
};
var StandaloneEditorWorkerService = class StandaloneEditorWorkerService$1 extends EditorWorkerService {
	constructor(modelService, configurationService, logService, languageConfigurationService, languageFeaturesService) {
		super(standaloneEditorWorkerDescriptor, modelService, configurationService, logService, languageConfigurationService, languageFeaturesService);
	}
};
StandaloneEditorWorkerService = __decorate$5([
	__param$5(0, IModelService),
	__param$5(1, ITextResourceConfigurationService),
	__param$5(2, ILogService),
	__param$5(3, ILanguageConfigurationService),
	__param$5(4, ILanguageFeaturesService)
], StandaloneEditorWorkerService);
var StandaloneAccessbilitySignalService = class {
	async playSignal(cue, options) {}
};
registerSingleton(ILogService, StandaloneLogService, 0);
registerSingleton(IConfigurationService, StandaloneConfigurationService, 0);
registerSingleton(ITextResourceConfigurationService, StandaloneResourceConfigurationService, 0);
registerSingleton(ITextResourcePropertiesService, StandaloneResourcePropertiesService, 0);
registerSingleton(IWorkspaceContextService, StandaloneWorkspaceContextService, 0);
registerSingleton(ILabelService, StandaloneUriLabelService, 0);
registerSingleton(ITelemetryService, StandaloneTelemetryService, 0);
registerSingleton(IDialogService, StandaloneDialogService, 0);
registerSingleton(IEnvironmentService, StandaloneEnvironmentService, 0);
registerSingleton(INotificationService, StandaloneNotificationService, 0);
registerSingleton(IMarkerService, MarkerService, 0);
registerSingleton(ILanguageService, StandaloneLanguageService, 0);
registerSingleton(IStandaloneThemeService, StandaloneThemeService, 0);
registerSingleton(IModelService, ModelService, 0);
registerSingleton(IMarkerDecorationsService, MarkerDecorationsService, 0);
registerSingleton(IContextKeyService, ContextKeyService, 0);
registerSingleton(IProgressService, StandaloneProgressService, 0);
registerSingleton(IEditorProgressService, StandaloneEditorProgressService, 0);
registerSingleton(IStorageService, InMemoryStorageService, 0);
registerSingleton(IEditorWorkerService, StandaloneEditorWorkerService, 0);
registerSingleton(IBulkEditService, StandaloneBulkEditService, 0);
registerSingleton(IWorkspaceTrustManagementService, StandaloneWorkspaceTrustManagementService, 0);
registerSingleton(ITextModelService, StandaloneTextModelService, 0);
registerSingleton(IAccessibilityService, AccessibilityService, 0);
registerSingleton(IListService, ListService, 0);
registerSingleton(ICommandService, StandaloneCommandService, 0);
registerSingleton(IKeybindingService, StandaloneKeybindingService, 0);
registerSingleton(IQuickInputService, StandaloneQuickInputService, 0);
registerSingleton(IContextViewService, StandaloneContextViewService, 0);
registerSingleton(IOpenerService, OpenerService, 0);
registerSingleton(IClipboardService, BrowserClipboardService, 0);
registerSingleton(IContextMenuService, StandaloneContextMenuService, 0);
registerSingleton(IMenuService, MenuService, 0);
registerSingleton(IAccessibilitySignalService, StandaloneAccessbilitySignalService, 0);
registerSingleton(ITreeSitterParserService, StandaloneTreeSitterParserService, 0);
/**
* We don't want to eagerly instantiate services because embedders get a one time chance
* to override services when they create the first editor.
*/
var StandaloneServices;
(function(StandaloneServices$1) {
	const serviceCollection = new ServiceCollection();
	for (const [id, descriptor] of getSingletonServiceDescriptors()) serviceCollection.set(id, descriptor);
	const instantiationService = new InstantiationService(serviceCollection, true);
	serviceCollection.set(IInstantiationService, instantiationService);
	function get(serviceId) {
		if (!initialized) initialize({});
		const r = serviceCollection.get(serviceId);
		if (!r) throw new Error("Missing service " + serviceId);
		if (r instanceof SyncDescriptor) return instantiationService.invokeFunction((accessor) => accessor.get(serviceId));
		else return r;
	}
	StandaloneServices$1.get = get;
	let initialized = false;
	const onDidInitialize = new Emitter$1();
	function initialize(overrides) {
		if (initialized) return instantiationService;
		initialized = true;
		for (const [id, descriptor] of getSingletonServiceDescriptors()) if (!serviceCollection.get(id)) serviceCollection.set(id, descriptor);
		for (const serviceId in overrides) if (overrides.hasOwnProperty(serviceId)) {
			const serviceIdentifier = createDecorator(serviceId);
			if (serviceCollection.get(serviceIdentifier) instanceof SyncDescriptor) serviceCollection.set(serviceIdentifier, overrides[serviceId]);
		}
		const editorFeatures = getEditorFeatures();
		for (const feature of editorFeatures) try {
			instantiationService.createInstance(feature);
		} catch (err) {
			onUnexpectedError(err);
		}
		onDidInitialize.fire();
		return instantiationService;
	}
	StandaloneServices$1.initialize = initialize;
	/**
	* Executes callback once services are initialized.
	*/
	function withServices(callback) {
		if (initialized) return callback();
		const disposable = new DisposableStore();
		const listener = disposable.add(onDidInitialize.event(() => {
			listener.dispose();
			disposable.add(callback());
		}));
		return disposable;
	}
	StandaloneServices$1.withServices = withServices;
})(StandaloneServices || (StandaloneServices = {}));

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneWebWorker.js
/**
* Create a new web worker that has model syncing capabilities built in.
* Specify an AMD module to load that will `create` an object that will be proxied.
*/
function createWebWorker(modelService, opts) {
	return new MonacoWebWorkerImpl(modelService, opts);
}
var MonacoWebWorkerImpl = class extends EditorWorkerClient {
	constructor(modelService, opts) {
		const workerDescriptor = {
			amdModuleId: standaloneEditorWorkerDescriptor.amdModuleId,
			esmModuleLocation: standaloneEditorWorkerDescriptor.esmModuleLocation,
			label: opts.label
		};
		super(workerDescriptor, opts.keepIdleModels || false, modelService);
		this._foreignModuleId = opts.moduleId;
		this._foreignModuleCreateData = opts.createData || null;
		this._foreignModuleHost = opts.host || null;
		this._foreignProxy = null;
	}
	fhr(method, args) {
		if (!this._foreignModuleHost || typeof this._foreignModuleHost[method] !== "function") return Promise.reject(/* @__PURE__ */ new Error("Missing method " + method + " or missing main thread foreign host."));
		try {
			return Promise.resolve(this._foreignModuleHost[method].apply(this._foreignModuleHost, args));
		} catch (e) {
			return Promise.reject(e);
		}
	}
	_getForeignProxy() {
		if (!this._foreignProxy) this._foreignProxy = this._getProxy().then((proxy) => {
			const foreignHostMethods = this._foreignModuleHost ? getAllMethodNames(this._foreignModuleHost) : [];
			return proxy.$loadForeignModule(this._foreignModuleId, this._foreignModuleCreateData, foreignHostMethods).then((foreignMethods) => {
				this._foreignModuleCreateData = null;
				const proxyMethodRequest = (method, args) => {
					return proxy.$fmr(method, args);
				};
				const createProxyMethod = (method, proxyMethodRequest$1) => {
					return function() {
						const args = Array.prototype.slice.call(arguments, 0);
						return proxyMethodRequest$1(method, args);
					};
				};
				const foreignProxy = {};
				for (const foreignMethod of foreignMethods) foreignProxy[foreignMethod] = createProxyMethod(foreignMethod, proxyMethodRequest);
				return foreignProxy;
			});
		});
		return this._foreignProxy;
	}
	getProxy() {
		return this._getForeignProxy();
	}
	withSyncedResources(resources) {
		return this.workerWithSyncedResources(resources).then((_) => this.getProxy());
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/common/monarch/monarchCommon.js
function isFuzzyActionArr(what) {
	return Array.isArray(what);
}
function isFuzzyAction(what) {
	return !isFuzzyActionArr(what);
}
function isString(what) {
	return typeof what === "string";
}
function isIAction(what) {
	return !isString(what);
}
/**
* Is a string null, undefined, or empty?
*/
function empty(s) {
	return s ? false : true;
}
/**
* Puts a string to lower case if 'ignoreCase' is set.
*/
function fixCase(lexer, str) {
	return lexer.ignoreCase && str ? str.toLowerCase() : str;
}
/**
* Ensures there are no bad characters in a CSS token class.
*/
function sanitize(s) {
	return s.replace(/[&<>'"_]/g, "-");
}
/**
* Logs a message.
*/
function log(lexer, msg) {
	console.log(`${lexer.languageId}: ${msg}`);
}
function createError(lexer, msg) {
	return /* @__PURE__ */ new Error(`${lexer.languageId}: ${msg}`);
}
/**
* substituteMatches is used on lexer strings and can substitutes predefined patterns:
* 		$$  => $
* 		$#  => id
* 		$n  => matched entry n
* 		@attr => contents of lexer[attr]
*
* See documentation for more info
*/
function substituteMatches(lexer, str, id, matches, state) {
	const re = /\$((\$)|(#)|(\d\d?)|[sS](\d\d?)|@(\w+))/g;
	let stateMatches = null;
	return str.replace(re, function(full, sub, dollar, hash$1, n, s, attr, ofs, total) {
		if (!empty(dollar)) return "$";
		if (!empty(hash$1)) return fixCase(lexer, id);
		if (!empty(n) && n < matches.length) return fixCase(lexer, matches[n]);
		if (!empty(attr) && lexer && typeof lexer[attr] === "string") return lexer[attr];
		if (stateMatches === null) {
			stateMatches = state.split(".");
			stateMatches.unshift(state);
		}
		if (!empty(s) && s < stateMatches.length) return fixCase(lexer, stateMatches[s]);
		return "";
	});
}
/**
* substituteMatchesRe is used on lexer regex rules and can substitutes predefined patterns:
* 		$Sn => n'th part of state
*
*/
function substituteMatchesRe(lexer, str, state) {
	const re = /\$[sS](\d\d?)/g;
	let stateMatches = null;
	return str.replace(re, function(full, s) {
		if (stateMatches === null) {
			stateMatches = state.split(".");
			stateMatches.unshift(state);
		}
		if (!empty(s) && s < stateMatches.length) return fixCase(lexer, stateMatches[s]);
		return "";
	});
}
/**
* Find the tokenizer rules for a specific state (i.e. next action)
*/
function findRules(lexer, inState) {
	let state = inState;
	while (state && state.length > 0) {
		const rules = lexer.tokenizer[state];
		if (rules) return rules;
		const idx = state.lastIndexOf(".");
		if (idx < 0) state = null;
		else state = state.substr(0, idx);
	}
	return null;
}
/**
* Is a certain state defined? In contrast to 'findRules' this works on a ILexerMin.
* This is used during compilation where we may know the defined states
* but not yet whether the corresponding rules are correct.
*/
function stateExists(lexer, inState) {
	let state = inState;
	while (state && state.length > 0) {
		if (lexer.stateNames[state]) return true;
		const idx = state.lastIndexOf(".");
		if (idx < 0) state = null;
		else state = state.substr(0, idx);
	}
	return false;
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/common/monarch/monarchLexer.js
var __decorate$4 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$4 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var MonarchTokenizer_1;
var CACHE_STACK_DEPTH = 5;
/**
* Reuse the same stack elements up to a certain depth.
*/
var MonarchStackElementFactory = class MonarchStackElementFactory {
	static {
		this._INSTANCE = new MonarchStackElementFactory(CACHE_STACK_DEPTH);
	}
	static create(parent, state) {
		return this._INSTANCE.create(parent, state);
	}
	constructor(maxCacheDepth) {
		this._maxCacheDepth = maxCacheDepth;
		this._entries = Object.create(null);
	}
	create(parent, state) {
		if (parent !== null && parent.depth >= this._maxCacheDepth) return new MonarchStackElement(parent, state);
		let stackElementId = MonarchStackElement.getStackElementId(parent);
		if (stackElementId.length > 0) stackElementId += "|";
		stackElementId += state;
		let result = this._entries[stackElementId];
		if (result) return result;
		result = new MonarchStackElement(parent, state);
		this._entries[stackElementId] = result;
		return result;
	}
};
var MonarchStackElement = class MonarchStackElement {
	constructor(parent, state) {
		this.parent = parent;
		this.state = state;
		this.depth = (this.parent ? this.parent.depth : 0) + 1;
	}
	static getStackElementId(element) {
		let result = "";
		while (element !== null) {
			if (result.length > 0) result += "|";
			result += element.state;
			element = element.parent;
		}
		return result;
	}
	static _equals(a, b) {
		while (a !== null && b !== null) {
			if (a === b) return true;
			if (a.state !== b.state) return false;
			a = a.parent;
			b = b.parent;
		}
		if (a === null && b === null) return true;
		return false;
	}
	equals(other) {
		return MonarchStackElement._equals(this, other);
	}
	push(state) {
		return MonarchStackElementFactory.create(this, state);
	}
	pop() {
		return this.parent;
	}
	popall() {
		let result = this;
		while (result.parent) result = result.parent;
		return result;
	}
	switchTo(state) {
		return MonarchStackElementFactory.create(this.parent, state);
	}
};
var EmbeddedLanguageData = class EmbeddedLanguageData {
	constructor(languageId, state) {
		this.languageId = languageId;
		this.state = state;
	}
	equals(other) {
		return this.languageId === other.languageId && this.state.equals(other.state);
	}
	clone() {
		if (this.state.clone() === this.state) return this;
		return new EmbeddedLanguageData(this.languageId, this.state);
	}
};
/**
* Reuse the same line states up to a certain depth.
*/
var MonarchLineStateFactory = class MonarchLineStateFactory {
	static {
		this._INSTANCE = new MonarchLineStateFactory(CACHE_STACK_DEPTH);
	}
	static create(stack, embeddedLanguageData) {
		return this._INSTANCE.create(stack, embeddedLanguageData);
	}
	constructor(maxCacheDepth) {
		this._maxCacheDepth = maxCacheDepth;
		this._entries = Object.create(null);
	}
	create(stack, embeddedLanguageData) {
		if (embeddedLanguageData !== null) return new MonarchLineState(stack, embeddedLanguageData);
		if (stack !== null && stack.depth >= this._maxCacheDepth) return new MonarchLineState(stack, embeddedLanguageData);
		const stackElementId = MonarchStackElement.getStackElementId(stack);
		let result = this._entries[stackElementId];
		if (result) return result;
		result = new MonarchLineState(stack, null);
		this._entries[stackElementId] = result;
		return result;
	}
};
var MonarchLineState = class MonarchLineState {
	constructor(stack, embeddedLanguageData) {
		this.stack = stack;
		this.embeddedLanguageData = embeddedLanguageData;
	}
	clone() {
		if ((this.embeddedLanguageData ? this.embeddedLanguageData.clone() : null) === this.embeddedLanguageData) return this;
		return MonarchLineStateFactory.create(this.stack, this.embeddedLanguageData);
	}
	equals(other) {
		if (!(other instanceof MonarchLineState)) return false;
		if (!this.stack.equals(other.stack)) return false;
		if (this.embeddedLanguageData === null && other.embeddedLanguageData === null) return true;
		if (this.embeddedLanguageData === null || other.embeddedLanguageData === null) return false;
		return this.embeddedLanguageData.equals(other.embeddedLanguageData);
	}
};
var MonarchClassicTokensCollector = class {
	constructor() {
		this._tokens = [];
		this._languageId = null;
		this._lastTokenType = null;
		this._lastTokenLanguage = null;
	}
	enterLanguage(languageId) {
		this._languageId = languageId;
	}
	emit(startOffset, type) {
		if (this._lastTokenType === type && this._lastTokenLanguage === this._languageId) return;
		this._lastTokenType = type;
		this._lastTokenLanguage = this._languageId;
		this._tokens.push(new Token$1(startOffset, type, this._languageId));
	}
	nestedLanguageTokenize(embeddedLanguageLine, hasEOL, embeddedLanguageData, offsetDelta) {
		const nestedLanguageId = embeddedLanguageData.languageId;
		const embeddedModeState = embeddedLanguageData.state;
		const nestedLanguageTokenizationSupport = TokenizationRegistry.get(nestedLanguageId);
		if (!nestedLanguageTokenizationSupport) {
			this.enterLanguage(nestedLanguageId);
			this.emit(offsetDelta, "");
			return embeddedModeState;
		}
		const nestedResult = nestedLanguageTokenizationSupport.tokenize(embeddedLanguageLine, hasEOL, embeddedModeState);
		if (offsetDelta !== 0) for (const token of nestedResult.tokens) this._tokens.push(new Token$1(token.offset + offsetDelta, token.type, token.language));
		else this._tokens = this._tokens.concat(nestedResult.tokens);
		this._lastTokenType = null;
		this._lastTokenLanguage = null;
		this._languageId = null;
		return nestedResult.endState;
	}
	finalize(endState) {
		return new TokenizationResult(this._tokens, endState);
	}
};
var MonarchModernTokensCollector = class MonarchModernTokensCollector {
	constructor(languageService, theme) {
		this._languageService = languageService;
		this._theme = theme;
		this._prependTokens = null;
		this._tokens = [];
		this._currentLanguageId = 0;
		this._lastTokenMetadata = 0;
	}
	enterLanguage(languageId) {
		this._currentLanguageId = this._languageService.languageIdCodec.encodeLanguageId(languageId);
	}
	emit(startOffset, type) {
		const metadata = this._theme.match(this._currentLanguageId, type) | 1024;
		if (this._lastTokenMetadata === metadata) return;
		this._lastTokenMetadata = metadata;
		this._tokens.push(startOffset);
		this._tokens.push(metadata);
	}
	static _merge(a, b, c) {
		const aLen = a !== null ? a.length : 0;
		const bLen = b.length;
		const cLen = c !== null ? c.length : 0;
		if (aLen === 0 && bLen === 0 && cLen === 0) return new Uint32Array(0);
		if (aLen === 0 && bLen === 0) return c;
		if (bLen === 0 && cLen === 0) return a;
		const result = new Uint32Array(aLen + bLen + cLen);
		if (a !== null) result.set(a);
		for (let i = 0; i < bLen; i++) result[aLen + i] = b[i];
		if (c !== null) result.set(c, aLen + bLen);
		return result;
	}
	nestedLanguageTokenize(embeddedLanguageLine, hasEOL, embeddedLanguageData, offsetDelta) {
		const nestedLanguageId = embeddedLanguageData.languageId;
		const embeddedModeState = embeddedLanguageData.state;
		const nestedLanguageTokenizationSupport = TokenizationRegistry.get(nestedLanguageId);
		if (!nestedLanguageTokenizationSupport) {
			this.enterLanguage(nestedLanguageId);
			this.emit(offsetDelta, "");
			return embeddedModeState;
		}
		const nestedResult = nestedLanguageTokenizationSupport.tokenizeEncoded(embeddedLanguageLine, hasEOL, embeddedModeState);
		if (offsetDelta !== 0) for (let i = 0, len = nestedResult.tokens.length; i < len; i += 2) nestedResult.tokens[i] += offsetDelta;
		this._prependTokens = MonarchModernTokensCollector._merge(this._prependTokens, this._tokens, nestedResult.tokens);
		this._tokens = [];
		this._currentLanguageId = 0;
		this._lastTokenMetadata = 0;
		return nestedResult.endState;
	}
	finalize(endState) {
		return new EncodedTokenizationResult(MonarchModernTokensCollector._merge(this._prependTokens, this._tokens, null), endState);
	}
};
var MonarchTokenizer = MonarchTokenizer_1 = class MonarchTokenizer$1 extends Disposable {
	constructor(languageService, standaloneThemeService, languageId, lexer, _configurationService) {
		super();
		this._configurationService = _configurationService;
		this._languageService = languageService;
		this._standaloneThemeService = standaloneThemeService;
		this._languageId = languageId;
		this._lexer = lexer;
		this._embeddedLanguages = Object.create(null);
		this.embeddedLoaded = Promise.resolve(void 0);
		let emitting = false;
		this._register(TokenizationRegistry.onDidChange((e) => {
			if (emitting) return;
			let isOneOfMyEmbeddedModes = false;
			for (let i = 0, len = e.changedLanguages.length; i < len; i++) {
				const language = e.changedLanguages[i];
				if (this._embeddedLanguages[language]) {
					isOneOfMyEmbeddedModes = true;
					break;
				}
			}
			if (isOneOfMyEmbeddedModes) {
				emitting = true;
				TokenizationRegistry.handleChange([this._languageId]);
				emitting = false;
			}
		}));
		this._maxTokenizationLineLength = this._configurationService.getValue("editor.maxTokenizationLineLength", { overrideIdentifier: this._languageId });
		this._register(this._configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration("editor.maxTokenizationLineLength")) this._maxTokenizationLineLength = this._configurationService.getValue("editor.maxTokenizationLineLength", { overrideIdentifier: this._languageId });
		}));
	}
	getLoadStatus() {
		const promises = [];
		for (const nestedLanguageId in this._embeddedLanguages) {
			const tokenizationSupport = TokenizationRegistry.get(nestedLanguageId);
			if (tokenizationSupport) {
				if (tokenizationSupport instanceof MonarchTokenizer_1) {
					const nestedModeStatus = tokenizationSupport.getLoadStatus();
					if (nestedModeStatus.loaded === false) promises.push(nestedModeStatus.promise);
				}
				continue;
			}
			if (!TokenizationRegistry.isResolved(nestedLanguageId)) promises.push(TokenizationRegistry.getOrCreate(nestedLanguageId));
		}
		if (promises.length === 0) return { loaded: true };
		return {
			loaded: false,
			promise: Promise.all(promises).then((_) => void 0)
		};
	}
	getInitialState() {
		const rootState = MonarchStackElementFactory.create(null, this._lexer.start);
		return MonarchLineStateFactory.create(rootState, null);
	}
	tokenize(line, hasEOL, lineState) {
		if (line.length >= this._maxTokenizationLineLength) return nullTokenize(this._languageId, lineState);
		const tokensCollector = new MonarchClassicTokensCollector();
		const endLineState = this._tokenize(line, hasEOL, lineState, tokensCollector);
		return tokensCollector.finalize(endLineState);
	}
	tokenizeEncoded(line, hasEOL, lineState) {
		if (line.length >= this._maxTokenizationLineLength) return nullTokenizeEncoded(this._languageService.languageIdCodec.encodeLanguageId(this._languageId), lineState);
		const tokensCollector = new MonarchModernTokensCollector(this._languageService, this._standaloneThemeService.getColorTheme().tokenTheme);
		const endLineState = this._tokenize(line, hasEOL, lineState, tokensCollector);
		return tokensCollector.finalize(endLineState);
	}
	_tokenize(line, hasEOL, lineState, collector) {
		if (lineState.embeddedLanguageData) return this._nestedTokenize(line, hasEOL, lineState, 0, collector);
		else return this._myTokenize(line, hasEOL, lineState, 0, collector);
	}
	_findLeavingNestedLanguageOffset(line, state) {
		let rules = this._lexer.tokenizer[state.stack.state];
		if (!rules) {
			rules = findRules(this._lexer, state.stack.state);
			if (!rules) throw createError(this._lexer, "tokenizer state is not defined: " + state.stack.state);
		}
		let popOffset = -1;
		let hasEmbeddedPopRule = false;
		for (const rule of rules) {
			if (!isIAction(rule.action) || rule.action.nextEmbedded !== "@pop") continue;
			hasEmbeddedPopRule = true;
			let regex = rule.resolveRegex(state.stack.state);
			const regexSource = regex.source;
			if (regexSource.substr(0, 4) === "^(?:" && regexSource.substr(regexSource.length - 1, 1) === ")") {
				const flags = (regex.ignoreCase ? "i" : "") + (regex.unicode ? "u" : "");
				regex = new RegExp(regexSource.substr(4, regexSource.length - 5), flags);
			}
			const result = line.search(regex);
			if (result === -1 || result !== 0 && rule.matchOnlyAtLineStart) continue;
			if (popOffset === -1 || result < popOffset) popOffset = result;
		}
		if (!hasEmbeddedPopRule) throw createError(this._lexer, "no rule containing nextEmbedded: \"@pop\" in tokenizer embedded state: " + state.stack.state);
		return popOffset;
	}
	_nestedTokenize(line, hasEOL, lineState, offsetDelta, tokensCollector) {
		const popOffset = this._findLeavingNestedLanguageOffset(line, lineState);
		if (popOffset === -1) {
			const nestedEndState = tokensCollector.nestedLanguageTokenize(line, hasEOL, lineState.embeddedLanguageData, offsetDelta);
			return MonarchLineStateFactory.create(lineState.stack, new EmbeddedLanguageData(lineState.embeddedLanguageData.languageId, nestedEndState));
		}
		const nestedLanguageLine = line.substring(0, popOffset);
		if (nestedLanguageLine.length > 0) tokensCollector.nestedLanguageTokenize(nestedLanguageLine, false, lineState.embeddedLanguageData, offsetDelta);
		const restOfTheLine = line.substring(popOffset);
		return this._myTokenize(restOfTheLine, hasEOL, lineState, offsetDelta + popOffset, tokensCollector);
	}
	_safeRuleName(rule) {
		if (rule) return rule.name;
		return "(unknown)";
	}
	_myTokenize(lineWithoutLF, hasEOL, lineState, offsetDelta, tokensCollector) {
		tokensCollector.enterLanguage(this._languageId);
		const lineWithoutLFLength = lineWithoutLF.length;
		const line = hasEOL && this._lexer.includeLF ? lineWithoutLF + "\n" : lineWithoutLF;
		const lineLength = line.length;
		let embeddedLanguageData = lineState.embeddedLanguageData;
		let stack = lineState.stack;
		let pos = 0;
		let groupMatching = null;
		let forceEvaluation = true;
		while (forceEvaluation || pos < lineLength) {
			const pos0 = pos;
			const stackLen0 = stack.depth;
			const groupLen0 = groupMatching ? groupMatching.groups.length : 0;
			const state = stack.state;
			let matches = null;
			let matched = null;
			let action = null;
			let rule = null;
			let enteringEmbeddedLanguage = null;
			if (groupMatching) {
				matches = groupMatching.matches;
				const groupEntry = groupMatching.groups.shift();
				matched = groupEntry.matched;
				action = groupEntry.action;
				rule = groupMatching.rule;
				if (groupMatching.groups.length === 0) groupMatching = null;
			} else {
				if (!forceEvaluation && pos >= lineLength) break;
				forceEvaluation = false;
				let rules = this._lexer.tokenizer[state];
				if (!rules) {
					rules = findRules(this._lexer, state);
					if (!rules) throw createError(this._lexer, "tokenizer state is not defined: " + state);
				}
				const restOfLine = line.substr(pos);
				for (const rule$1 of rules) if (pos === 0 || !rule$1.matchOnlyAtLineStart) {
					matches = restOfLine.match(rule$1.resolveRegex(state));
					if (matches) {
						matched = matches[0];
						action = rule$1.action;
						break;
					}
				}
			}
			if (!matches) {
				matches = [""];
				matched = "";
			}
			if (!action) {
				if (pos < lineLength) {
					matches = [line.charAt(pos)];
					matched = matches[0];
				}
				action = this._lexer.defaultToken;
			}
			if (matched === null) break;
			pos += matched.length;
			while (isFuzzyAction(action) && isIAction(action) && action.test) action = action.test(matched, matches, state, pos === lineLength);
			let result = null;
			if (typeof action === "string" || Array.isArray(action)) result = action;
			else if (action.group) result = action.group;
			else if (action.token !== null && action.token !== void 0) {
				if (action.tokenSubst) result = substituteMatches(this._lexer, action.token, matched, matches, state);
				else result = action.token;
				if (action.nextEmbedded) if (action.nextEmbedded === "@pop") {
					if (!embeddedLanguageData) throw createError(this._lexer, "cannot pop embedded language if not inside one");
					embeddedLanguageData = null;
				} else if (embeddedLanguageData) throw createError(this._lexer, "cannot enter embedded language from within an embedded language");
				else enteringEmbeddedLanguage = substituteMatches(this._lexer, action.nextEmbedded, matched, matches, state);
				if (action.goBack) pos = Math.max(0, pos - action.goBack);
				if (action.switchTo && typeof action.switchTo === "string") {
					let nextState = substituteMatches(this._lexer, action.switchTo, matched, matches, state);
					if (nextState[0] === "@") nextState = nextState.substr(1);
					if (!findRules(this._lexer, nextState)) throw createError(this._lexer, "trying to switch to a state '" + nextState + "' that is undefined in rule: " + this._safeRuleName(rule));
					else stack = stack.switchTo(nextState);
				} else if (action.transform && typeof action.transform === "function") throw createError(this._lexer, "action.transform not supported");
				else if (action.next) if (action.next === "@push") if (stack.depth >= this._lexer.maxStack) throw createError(this._lexer, "maximum tokenizer stack size reached: [" + stack.state + "," + stack.parent.state + ",...]");
				else stack = stack.push(state);
				else if (action.next === "@pop") if (stack.depth <= 1) throw createError(this._lexer, "trying to pop an empty stack in rule: " + this._safeRuleName(rule));
				else stack = stack.pop();
				else if (action.next === "@popall") stack = stack.popall();
				else {
					let nextState = substituteMatches(this._lexer, action.next, matched, matches, state);
					if (nextState[0] === "@") nextState = nextState.substr(1);
					if (!findRules(this._lexer, nextState)) throw createError(this._lexer, "trying to set a next state '" + nextState + "' that is undefined in rule: " + this._safeRuleName(rule));
					else stack = stack.push(nextState);
				}
				if (action.log && typeof action.log === "string") log(this._lexer, this._lexer.languageId + ": " + substituteMatches(this._lexer, action.log, matched, matches, state));
			}
			if (result === null) throw createError(this._lexer, "lexer rule has no well-defined action in rule: " + this._safeRuleName(rule));
			const computeNewStateForEmbeddedLanguage = (enteringEmbeddedLanguage$1) => {
				const languageId = this._languageService.getLanguageIdByLanguageName(enteringEmbeddedLanguage$1) || this._languageService.getLanguageIdByMimeType(enteringEmbeddedLanguage$1) || enteringEmbeddedLanguage$1;
				const embeddedLanguageData$1 = this._getNestedEmbeddedLanguageData(languageId);
				if (pos < lineLength) {
					const restOfLine = lineWithoutLF.substr(pos);
					return this._nestedTokenize(restOfLine, hasEOL, MonarchLineStateFactory.create(stack, embeddedLanguageData$1), offsetDelta + pos, tokensCollector);
				} else return MonarchLineStateFactory.create(stack, embeddedLanguageData$1);
			};
			if (Array.isArray(result)) {
				if (groupMatching && groupMatching.groups.length > 0) throw createError(this._lexer, "groups cannot be nested: " + this._safeRuleName(rule));
				if (matches.length !== result.length + 1) throw createError(this._lexer, "matched number of groups does not match the number of actions in rule: " + this._safeRuleName(rule));
				let totalLen = 0;
				for (let i = 1; i < matches.length; i++) totalLen += matches[i].length;
				if (totalLen !== matched.length) throw createError(this._lexer, "with groups, all characters should be matched in consecutive groups in rule: " + this._safeRuleName(rule));
				groupMatching = {
					rule,
					matches,
					groups: []
				};
				for (let i = 0; i < result.length; i++) groupMatching.groups[i] = {
					action: result[i],
					matched: matches[i + 1]
				};
				pos -= matched.length;
				continue;
			} else {
				if (result === "@rematch") {
					pos -= matched.length;
					matched = "";
					matches = null;
					result = "";
					if (enteringEmbeddedLanguage !== null) return computeNewStateForEmbeddedLanguage(enteringEmbeddedLanguage);
				}
				if (matched.length === 0) if (lineLength === 0 || stackLen0 !== stack.depth || state !== stack.state || (!groupMatching ? 0 : groupMatching.groups.length) !== groupLen0) continue;
				else throw createError(this._lexer, "no progress in tokenizer in rule: " + this._safeRuleName(rule));
				let tokenType = null;
				if (isString(result) && result.indexOf("@brackets") === 0) {
					const rest = result.substr(9);
					const bracket = findBracket(this._lexer, matched);
					if (!bracket) throw createError(this._lexer, "@brackets token returned but no bracket defined as: " + matched);
					tokenType = sanitize(bracket.token + rest);
				} else {
					const token = result === "" ? "" : result + this._lexer.tokenPostfix;
					tokenType = sanitize(token);
				}
				if (pos0 < lineWithoutLFLength) tokensCollector.emit(pos0 + offsetDelta, tokenType);
			}
			if (enteringEmbeddedLanguage !== null) return computeNewStateForEmbeddedLanguage(enteringEmbeddedLanguage);
		}
		return MonarchLineStateFactory.create(stack, embeddedLanguageData);
	}
	_getNestedEmbeddedLanguageData(languageId) {
		if (!this._languageService.isRegisteredLanguageId(languageId)) return new EmbeddedLanguageData(languageId, NullState);
		if (languageId !== this._languageId) {
			this._languageService.requestBasicLanguageFeatures(languageId);
			TokenizationRegistry.getOrCreate(languageId);
			this._embeddedLanguages[languageId] = true;
		}
		const tokenizationSupport = TokenizationRegistry.get(languageId);
		if (tokenizationSupport) return new EmbeddedLanguageData(languageId, tokenizationSupport.getInitialState());
		return new EmbeddedLanguageData(languageId, NullState);
	}
};
MonarchTokenizer = MonarchTokenizer_1 = __decorate$4([__param$4(4, IConfigurationService)], MonarchTokenizer);
/**
* Searches for a bracket in the 'brackets' attribute that matches the input.
*/
function findBracket(lexer, matched) {
	if (!matched) return null;
	matched = fixCase(lexer, matched);
	const brackets = lexer.brackets;
	for (const bracket of brackets) if (bracket.open === matched) return {
		token: bracket.token,
		bracketType: 1
	};
	else if (bracket.close === matched) return {
		token: bracket.token,
		bracketType: -1
	};
	return null;
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/colorizer.js
var ttPolicy = createTrustedTypesPolicy("standaloneColorizer", { createHTML: (value) => value });
var Colorizer = class {
	static colorizeElement(themeService, languageService, domNode, options) {
		options = options || {};
		const theme = options.theme || "vs";
		const mimeType = options.mimeType || domNode.getAttribute("lang") || domNode.getAttribute("data-lang");
		if (!mimeType) {
			console.error("Mode not detected");
			return Promise.resolve();
		}
		const languageId = languageService.getLanguageIdByMimeType(mimeType) || mimeType;
		themeService.setTheme(theme);
		const text = domNode.firstChild ? domNode.firstChild.nodeValue : "";
		domNode.className += " " + theme;
		const render = (str) => {
			domNode.innerHTML = ttPolicy?.createHTML(str) ?? str;
		};
		return this.colorize(languageService, text || "", languageId, options).then(render, (err) => console.error(err));
	}
	static async colorize(languageService, text, languageId, options) {
		const languageIdCodec = languageService.languageIdCodec;
		let tabSize = 4;
		if (options && typeof options.tabSize === "number") tabSize = options.tabSize;
		if (startsWithUTF8BOM(text)) text = text.substr(1);
		const lines = splitLines(text);
		if (!languageService.isRegisteredLanguageId(languageId)) return _fakeColorize(lines, tabSize, languageIdCodec);
		const tokenizationSupport = await TokenizationRegistry.getOrCreate(languageId);
		if (tokenizationSupport) return _colorize(lines, tabSize, tokenizationSupport, languageIdCodec);
		return _fakeColorize(lines, tabSize, languageIdCodec);
	}
	static colorizeLine(line, mightContainNonBasicASCII, mightContainRTL, tokens, tabSize = 4) {
		const isBasicASCII = ViewLineRenderingData.isBasicASCII(line, mightContainNonBasicASCII);
		const containsRTL = ViewLineRenderingData.containsRTL(line, isBasicASCII, mightContainRTL);
		return renderViewLine2(new RenderLineInput(false, true, line, false, isBasicASCII, containsRTL, 0, tokens, [], tabSize, 0, 0, 0, 0, -1, "none", false, false, null)).html;
	}
	static colorizeModelLine(model, lineNumber, tabSize = 4) {
		const content = model.getLineContent(lineNumber);
		model.tokenization.forceTokenization(lineNumber);
		const inflatedTokens = model.tokenization.getLineTokens(lineNumber).inflate();
		return this.colorizeLine(content, model.mightContainNonBasicASCII(), model.mightContainRTL(), inflatedTokens, tabSize);
	}
};
function _colorize(lines, tabSize, tokenizationSupport, languageIdCodec) {
	return new Promise((c, e) => {
		const execute = () => {
			const result = _actualColorize(lines, tabSize, tokenizationSupport, languageIdCodec);
			if (tokenizationSupport instanceof MonarchTokenizer) {
				const status$1 = tokenizationSupport.getLoadStatus();
				if (status$1.loaded === false) {
					status$1.promise.then(execute, e);
					return;
				}
			}
			c(result);
		};
		execute();
	});
}
function _fakeColorize(lines, tabSize, languageIdCodec) {
	let html = [];
	const defaultMetadata = 33587200;
	const tokens = new Uint32Array(2);
	tokens[0] = 0;
	tokens[1] = defaultMetadata;
	for (let i = 0, length = lines.length; i < length; i++) {
		const line = lines[i];
		tokens[0] = line.length;
		const lineTokens = new LineTokens(tokens, line, languageIdCodec);
		const isBasicASCII = ViewLineRenderingData.isBasicASCII(line, true);
		const containsRTL = ViewLineRenderingData.containsRTL(line, isBasicASCII, true);
		const renderResult = renderViewLine2(new RenderLineInput(false, true, line, false, isBasicASCII, containsRTL, 0, lineTokens, [], tabSize, 0, 0, 0, 0, -1, "none", false, false, null));
		html = html.concat(renderResult.html);
		html.push("<br/>");
	}
	return html.join("");
}
function _actualColorize(lines, tabSize, tokenizationSupport, languageIdCodec) {
	let html = [];
	let state = tokenizationSupport.getInitialState();
	for (let i = 0, length = lines.length; i < length; i++) {
		const line = lines[i];
		const tokenizeResult = tokenizationSupport.tokenizeEncoded(line, true, state);
		LineTokens.convertToEndOffset(tokenizeResult.tokens, line.length);
		const lineTokens = new LineTokens(tokenizeResult.tokens, line, languageIdCodec);
		const isBasicASCII = ViewLineRenderingData.isBasicASCII(line, true);
		const containsRTL = ViewLineRenderingData.containsRTL(line, isBasicASCII, true);
		const renderResult = renderViewLine2(new RenderLineInput(false, true, line, false, isBasicASCII, containsRTL, 0, lineTokens.inflate(), [], tabSize, 0, 0, 0, 0, -1, "none", false, false, null));
		html = html.concat(renderResult.html);
		html.push("<br/>");
		state = tokenizeResult.endState;
	}
	return html.join("");
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeEditor.js
var __decorate$3 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$3 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var LAST_GENERATED_COMMAND_ID = 0;
var ariaDomNodeCreated = false;
/**
* Create ARIA dom node inside parent,
* or only for the first editor instantiation inside document.body.
* @param parent container element for ARIA dom node
*/
function createAriaDomNode(parent) {
	if (!parent) {
		if (ariaDomNodeCreated) return;
		ariaDomNodeCreated = true;
	}
	setARIAContainer(parent || mainWindow.document.body);
}
/**
* A code editor to be used both by the standalone editor and the standalone diff editor.
*/
var StandaloneCodeEditor = class StandaloneCodeEditor$1 extends CodeEditorWidget {
	constructor(domElement, _options, instantiationService, codeEditorService, commandService, contextKeyService, hoverService, keybindingService, themeService, notificationService, accessibilityService, languageConfigurationService, languageFeaturesService) {
		const options = { ..._options };
		options.ariaLabel = options.ariaLabel || StandaloneCodeEditorNLS.editorViewAccessibleLabel;
		super(domElement, options, {}, instantiationService, codeEditorService, commandService, contextKeyService, themeService, notificationService, accessibilityService, languageConfigurationService, languageFeaturesService);
		if (keybindingService instanceof StandaloneKeybindingService) this._standaloneKeybindingService = keybindingService;
		else this._standaloneKeybindingService = null;
		createAriaDomNode(options.ariaContainerElement);
		setHoverDelegateFactory((placement, enableInstantHover) => instantiationService.createInstance(WorkbenchHoverDelegate, placement, enableInstantHover, {}));
		setBaseLayerHoverDelegate(hoverService);
	}
	addCommand(keybinding, handler, context) {
		if (!this._standaloneKeybindingService) {
			console.warn("Cannot add command because the editor is configured with an unrecognized KeybindingService");
			return null;
		}
		const commandId = "DYNAMIC_" + ++LAST_GENERATED_COMMAND_ID;
		const whenExpression = ContextKeyExpr.deserialize(context);
		this._standaloneKeybindingService.addDynamicKeybinding(commandId, keybinding, handler, whenExpression);
		return commandId;
	}
	createContextKey(key, defaultValue) {
		return this._contextKeyService.createKey(key, defaultValue);
	}
	addAction(_descriptor) {
		if (typeof _descriptor.id !== "string" || typeof _descriptor.label !== "string" || typeof _descriptor.run !== "function") throw new Error("Invalid action descriptor, `id`, `label` and `run` are required properties!");
		if (!this._standaloneKeybindingService) {
			console.warn("Cannot add keybinding because the editor is configured with an unrecognized KeybindingService");
			return Disposable.None;
		}
		const id = _descriptor.id;
		const label = _descriptor.label;
		const precondition = ContextKeyExpr.and(ContextKeyExpr.equals("editorId", this.getId()), ContextKeyExpr.deserialize(_descriptor.precondition));
		const keybindings = _descriptor.keybindings;
		const keybindingsWhen = ContextKeyExpr.and(precondition, ContextKeyExpr.deserialize(_descriptor.keybindingContext));
		const contextMenuGroupId = _descriptor.contextMenuGroupId || null;
		const contextMenuOrder = _descriptor.contextMenuOrder || 0;
		const run = (_accessor, ...args) => {
			return Promise.resolve(_descriptor.run(this, ...args));
		};
		const toDispose = new DisposableStore();
		const uniqueId = this.getId() + ":" + id;
		toDispose.add(CommandsRegistry.registerCommand(uniqueId, run));
		if (contextMenuGroupId) {
			const menuItem = {
				command: {
					id: uniqueId,
					title: label
				},
				when: precondition,
				group: contextMenuGroupId,
				order: contextMenuOrder
			};
			toDispose.add(MenuRegistry.appendMenuItem(MenuId.EditorContext, menuItem));
		}
		if (Array.isArray(keybindings)) for (const kb of keybindings) toDispose.add(this._standaloneKeybindingService.addDynamicKeybinding(uniqueId, kb, run, keybindingsWhen));
		const internalAction = new InternalEditorAction(uniqueId, label, label, void 0, precondition, (...args) => Promise.resolve(_descriptor.run(this, ...args)), this._contextKeyService);
		this._actions.set(id, internalAction);
		toDispose.add(toDisposable(() => {
			this._actions.delete(id);
		}));
		return toDispose;
	}
	_triggerCommand(handlerId, payload) {
		if (this._codeEditorService instanceof StandaloneCodeEditorService) try {
			this._codeEditorService.setActiveCodeEditor(this);
			super._triggerCommand(handlerId, payload);
		} finally {
			this._codeEditorService.setActiveCodeEditor(null);
		}
		else super._triggerCommand(handlerId, payload);
	}
};
StandaloneCodeEditor = __decorate$3([
	__param$3(2, IInstantiationService),
	__param$3(3, ICodeEditorService),
	__param$3(4, ICommandService),
	__param$3(5, IContextKeyService),
	__param$3(6, IHoverService),
	__param$3(7, IKeybindingService),
	__param$3(8, IThemeService),
	__param$3(9, INotificationService),
	__param$3(10, IAccessibilityService),
	__param$3(11, ILanguageConfigurationService),
	__param$3(12, ILanguageFeaturesService)
], StandaloneCodeEditor);
var StandaloneEditor = class StandaloneEditor$1 extends StandaloneCodeEditor {
	constructor(domElement, _options, instantiationService, codeEditorService, commandService, contextKeyService, hoverService, keybindingService, themeService, notificationService, configurationService, accessibilityService, modelService, languageService, languageConfigurationService, languageFeaturesService) {
		const options = { ..._options };
		updateConfigurationService(configurationService, options, false);
		const themeDomRegistration = themeService.registerEditorContainer(domElement);
		if (typeof options.theme === "string") themeService.setTheme(options.theme);
		if (typeof options.autoDetectHighContrast !== "undefined") themeService.setAutoDetectHighContrast(Boolean(options.autoDetectHighContrast));
		const _model = options.model;
		delete options.model;
		super(domElement, options, instantiationService, codeEditorService, commandService, contextKeyService, hoverService, keybindingService, themeService, notificationService, accessibilityService, languageConfigurationService, languageFeaturesService);
		this._configurationService = configurationService;
		this._standaloneThemeService = themeService;
		this._register(themeDomRegistration);
		let model;
		if (typeof _model === "undefined") {
			const languageId = languageService.getLanguageIdByMimeType(options.language) || options.language || PLAINTEXT_LANGUAGE_ID;
			model = createTextModel(modelService, languageService, options.value || "", languageId, void 0);
			this._ownsModel = true;
		} else {
			model = _model;
			this._ownsModel = false;
		}
		this._attachModel(model);
		if (model) {
			const e = {
				oldModelUrl: null,
				newModelUrl: model.uri
			};
			this._onDidChangeModel.fire(e);
		}
	}
	dispose() {
		super.dispose();
	}
	updateOptions(newOptions) {
		updateConfigurationService(this._configurationService, newOptions, false);
		if (typeof newOptions.theme === "string") this._standaloneThemeService.setTheme(newOptions.theme);
		if (typeof newOptions.autoDetectHighContrast !== "undefined") this._standaloneThemeService.setAutoDetectHighContrast(Boolean(newOptions.autoDetectHighContrast));
		super.updateOptions(newOptions);
	}
	_postDetachModelCleanup(detachedModel) {
		super._postDetachModelCleanup(detachedModel);
		if (detachedModel && this._ownsModel) {
			detachedModel.dispose();
			this._ownsModel = false;
		}
	}
};
StandaloneEditor = __decorate$3([
	__param$3(2, IInstantiationService),
	__param$3(3, ICodeEditorService),
	__param$3(4, ICommandService),
	__param$3(5, IContextKeyService),
	__param$3(6, IHoverService),
	__param$3(7, IKeybindingService),
	__param$3(8, IStandaloneThemeService),
	__param$3(9, INotificationService),
	__param$3(10, IConfigurationService),
	__param$3(11, IAccessibilityService),
	__param$3(12, IModelService),
	__param$3(13, ILanguageService),
	__param$3(14, ILanguageConfigurationService),
	__param$3(15, ILanguageFeaturesService)
], StandaloneEditor);
var StandaloneDiffEditor2 = class StandaloneDiffEditor2$1 extends DiffEditorWidget {
	constructor(domElement, _options, instantiationService, contextKeyService, codeEditorService, themeService, notificationService, configurationService, contextMenuService, editorProgressService, clipboardService, accessibilitySignalService) {
		const options = { ..._options };
		updateConfigurationService(configurationService, options, true);
		const themeDomRegistration = themeService.registerEditorContainer(domElement);
		if (typeof options.theme === "string") themeService.setTheme(options.theme);
		if (typeof options.autoDetectHighContrast !== "undefined") themeService.setAutoDetectHighContrast(Boolean(options.autoDetectHighContrast));
		super(domElement, options, {}, contextKeyService, instantiationService, codeEditorService, accessibilitySignalService, editorProgressService);
		this._configurationService = configurationService;
		this._standaloneThemeService = themeService;
		this._register(themeDomRegistration);
	}
	dispose() {
		super.dispose();
	}
	updateOptions(newOptions) {
		updateConfigurationService(this._configurationService, newOptions, true);
		if (typeof newOptions.theme === "string") this._standaloneThemeService.setTheme(newOptions.theme);
		if (typeof newOptions.autoDetectHighContrast !== "undefined") this._standaloneThemeService.setAutoDetectHighContrast(Boolean(newOptions.autoDetectHighContrast));
		super.updateOptions(newOptions);
	}
	_createInnerEditor(instantiationService, container, options) {
		return instantiationService.createInstance(StandaloneCodeEditor, container, options);
	}
	getOriginalEditor() {
		return super.getOriginalEditor();
	}
	getModifiedEditor() {
		return super.getModifiedEditor();
	}
	addCommand(keybinding, handler, context) {
		return this.getModifiedEditor().addCommand(keybinding, handler, context);
	}
	createContextKey(key, defaultValue) {
		return this.getModifiedEditor().createContextKey(key, defaultValue);
	}
	addAction(descriptor) {
		return this.getModifiedEditor().addAction(descriptor);
	}
};
StandaloneDiffEditor2 = __decorate$3([
	__param$3(2, IInstantiationService),
	__param$3(3, IContextKeyService),
	__param$3(4, ICodeEditorService),
	__param$3(5, IStandaloneThemeService),
	__param$3(6, INotificationService),
	__param$3(7, IConfigurationService),
	__param$3(8, IContextMenuService),
	__param$3(9, IEditorProgressService),
	__param$3(10, IClipboardService),
	__param$3(11, IAccessibilitySignalService)
], StandaloneDiffEditor2);
/**
* @internal
*/
function createTextModel(modelService, languageService, value, languageId, uri) {
	value = value || "";
	if (!languageId) {
		const firstLF = value.indexOf("\n");
		let firstLine = value;
		if (firstLF !== -1) firstLine = value.substring(0, firstLF);
		return doCreateModel(modelService, value, languageService.createByFilepathOrFirstLine(uri || null, firstLine), uri);
	}
	return doCreateModel(modelService, value, languageService.createById(languageId), uri);
}
/**
* @internal
*/
function doCreateModel(modelService, value, languageSelection, uri) {
	return modelService.createModel(value, languageSelection, uri);
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/browser/widget/multiDiffEditor/diffEditorItemTemplate.js
var __decorate$2 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$2 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var TemplateData = class {
	constructor(viewModel, deltaScrollVertical) {
		this.viewModel = viewModel;
		this.deltaScrollVertical = deltaScrollVertical;
	}
	getId() {
		return this.viewModel;
	}
};
var DiffEditorItemTemplate = class DiffEditorItemTemplate$1 extends Disposable {
	constructor(_container, _overflowWidgetsDomNode, _workbenchUIElementFactory, _instantiationService, _parentContextKeyService) {
		super();
		this._container = _container;
		this._overflowWidgetsDomNode = _overflowWidgetsDomNode;
		this._workbenchUIElementFactory = _workbenchUIElementFactory;
		this._instantiationService = _instantiationService;
		this._viewModel = observableValue(this, void 0);
		this._collapsed = derived(this, (reader) => this._viewModel.read(reader)?.collapsed.read(reader));
		this._editorContentHeight = observableValue(this, 500);
		this.contentHeight = derived(this, (reader) => {
			return (this._collapsed.read(reader) ? 0 : this._editorContentHeight.read(reader)) + this._outerEditorHeight;
		});
		this._modifiedContentWidth = observableValue(this, 0);
		this._modifiedWidth = observableValue(this, 0);
		this._originalContentWidth = observableValue(this, 0);
		this._originalWidth = observableValue(this, 0);
		this.maxScroll = derived(this, (reader) => {
			const scroll1 = this._modifiedContentWidth.read(reader) - this._modifiedWidth.read(reader);
			const scroll2 = this._originalContentWidth.read(reader) - this._originalWidth.read(reader);
			if (scroll1 > scroll2) return {
				maxScroll: scroll1,
				width: this._modifiedWidth.read(reader)
			};
			else return {
				maxScroll: scroll2,
				width: this._originalWidth.read(reader)
			};
		});
		this._elements = h("div.multiDiffEntry", [h("div.header@header", [h("div.header-content", [
			h("div.collapse-button@collapseButton"),
			h("div.file-path", [
				h("div.title.modified.show-file-icons@primaryPath", []),
				h("div.status.deleted@status", ["R"]),
				h("div.title.original.show-file-icons@secondaryPath", [])
			]),
			h("div.actions@actions")
		])]), h("div.editorParent", [h("div.editorContainer@editor")])]);
		this.editor = this._register(this._instantiationService.createInstance(DiffEditorWidget, this._elements.editor, { overflowWidgetsDomNode: this._overflowWidgetsDomNode }, {}));
		this.isModifedFocused = observableCodeEditor(this.editor.getModifiedEditor()).isFocused;
		this.isOriginalFocused = observableCodeEditor(this.editor.getOriginalEditor()).isFocused;
		this.isFocused = derived(this, (reader) => this.isModifedFocused.read(reader) || this.isOriginalFocused.read(reader));
		this._resourceLabel = this._workbenchUIElementFactory.createResourceLabel ? this._register(this._workbenchUIElementFactory.createResourceLabel(this._elements.primaryPath)) : void 0;
		this._resourceLabel2 = this._workbenchUIElementFactory.createResourceLabel ? this._register(this._workbenchUIElementFactory.createResourceLabel(this._elements.secondaryPath)) : void 0;
		this._dataStore = this._register(new DisposableStore());
		this._headerHeight = 40;
		this._lastScrollTop = -1;
		this._isSettingScrollTop = false;
		const btn = new Button(this._elements.collapseButton, {});
		this._register(autorun((reader) => {
			btn.element.className = "";
			btn.icon = this._collapsed.read(reader) ? Codicon.chevronRight : Codicon.chevronDown;
		}));
		this._register(btn.onDidClick(() => {
			this._viewModel.get()?.collapsed.set(!this._collapsed.get(), void 0);
		}));
		this._register(autorun((reader) => {
			this._elements.editor.style.display = this._collapsed.read(reader) ? "none" : "block";
		}));
		this._register(this.editor.getModifiedEditor().onDidLayoutChange((e) => {
			const width = this.editor.getModifiedEditor().getLayoutInfo().contentWidth;
			this._modifiedWidth.set(width, void 0);
		}));
		this._register(this.editor.getOriginalEditor().onDidLayoutChange((e) => {
			const width = this.editor.getOriginalEditor().getLayoutInfo().contentWidth;
			this._originalWidth.set(width, void 0);
		}));
		this._register(this.editor.onDidContentSizeChange((e) => {
			globalTransaction((tx) => {
				this._editorContentHeight.set(e.contentHeight, tx);
				this._modifiedContentWidth.set(this.editor.getModifiedEditor().getContentWidth(), tx);
				this._originalContentWidth.set(this.editor.getOriginalEditor().getContentWidth(), tx);
			});
		}));
		this._register(this.editor.getOriginalEditor().onDidScrollChange((e) => {
			if (this._isSettingScrollTop) return;
			if (!e.scrollTopChanged || !this._data) return;
			const delta = e.scrollTop - this._lastScrollTop;
			this._data.deltaScrollVertical(delta);
		}));
		this._register(autorun((reader) => {
			const isActive = this._viewModel.read(reader)?.isActive.read(reader);
			this._elements.root.classList.toggle("active", isActive);
		}));
		this._container.appendChild(this._elements.root);
		this._outerEditorHeight = this._headerHeight;
		this._contextKeyService = this._register(_parentContextKeyService.createScoped(this._elements.actions));
		const instantiationService = this._register(this._instantiationService.createChild(new ServiceCollection([IContextKeyService, this._contextKeyService])));
		this._register(instantiationService.createInstance(MenuWorkbenchToolBar, this._elements.actions, MenuId.MultiDiffEditorFileToolbar, {
			actionRunner: this._register(new ActionRunnerWithContext(() => this._viewModel.get()?.modifiedUri)),
			menuOptions: { shouldForwardArgs: true },
			toolbarOptions: { primaryGroup: (g) => g.startsWith("navigation") },
			actionViewItemProvider: (action, options) => createActionViewItem(instantiationService, action, options)
		}));
	}
	setScrollLeft(left) {
		if (this._modifiedContentWidth.get() - this._modifiedWidth.get() > this._originalContentWidth.get() - this._originalWidth.get()) this.editor.getModifiedEditor().setScrollLeft(left);
		else this.editor.getOriginalEditor().setScrollLeft(left);
	}
	setData(data) {
		this._data = data;
		function updateOptions(options) {
			return {
				...options,
				scrollBeyondLastLine: false,
				hideUnchangedRegions: { enabled: true },
				scrollbar: {
					vertical: "hidden",
					horizontal: "hidden",
					handleMouseWheel: false,
					useShadows: false
				},
				renderOverviewRuler: false,
				fixedOverflowWidgets: true,
				overviewRulerBorder: false
			};
		}
		if (!data) {
			globalTransaction((tx) => {
				this._viewModel.set(void 0, tx);
				this.editor.setDiffModel(null, tx);
				this._dataStore.clear();
			});
			return;
		}
		const value = data.viewModel.documentDiffItem;
		globalTransaction((tx) => {
			this._resourceLabel?.setUri(data.viewModel.modifiedUri ?? data.viewModel.originalUri, { strikethrough: data.viewModel.modifiedUri === void 0 });
			let isRenamed = false;
			let isDeleted = false;
			let isAdded = false;
			let flag = "";
			if (data.viewModel.modifiedUri && data.viewModel.originalUri && data.viewModel.modifiedUri.path !== data.viewModel.originalUri.path) {
				flag = "R";
				isRenamed = true;
			} else if (!data.viewModel.modifiedUri) {
				flag = "D";
				isDeleted = true;
			} else if (!data.viewModel.originalUri) {
				flag = "A";
				isAdded = true;
			}
			this._elements.status.classList.toggle("renamed", isRenamed);
			this._elements.status.classList.toggle("deleted", isDeleted);
			this._elements.status.classList.toggle("added", isAdded);
			this._elements.status.innerText = flag;
			this._resourceLabel2?.setUri(isRenamed ? data.viewModel.originalUri : void 0, { strikethrough: true });
			this._dataStore.clear();
			this._viewModel.set(data.viewModel, tx);
			this.editor.setDiffModel(data.viewModel.diffEditorViewModelRef, tx);
			this.editor.updateOptions(updateOptions(value.options ?? {}));
		});
		if (value.onOptionsDidChange) this._dataStore.add(value.onOptionsDidChange(() => {
			this.editor.updateOptions(updateOptions(value.options ?? {}));
		}));
		data.viewModel.isAlive.recomputeInitiallyAndOnChange(this._dataStore, (value$1) => {
			if (!value$1) this.setData(void 0);
		});
		if (data.viewModel.documentDiffItem.contextKeys) for (const [key, value$1] of Object.entries(data.viewModel.documentDiffItem.contextKeys)) this._contextKeyService.createKey(key, value$1);
	}
	render(verticalRange, width, editorScroll, viewPort) {
		this._elements.root.style.visibility = "visible";
		this._elements.root.style.top = `${verticalRange.start}px`;
		this._elements.root.style.height = `${verticalRange.length}px`;
		this._elements.root.style.width = `${width}px`;
		this._elements.root.style.position = "absolute";
		const maxDelta = verticalRange.length - this._headerHeight;
		const delta = Math.max(0, Math.min(viewPort.start - verticalRange.start, maxDelta));
		this._elements.header.style.transform = `translateY(${delta}px)`;
		globalTransaction((tx) => {
			this.editor.layout({
				width: width - 16 - 2,
				height: verticalRange.length - this._outerEditorHeight
			});
		});
		try {
			this._isSettingScrollTop = true;
			this._lastScrollTop = editorScroll;
			this.editor.getOriginalEditor().setScrollTop(editorScroll);
		} finally {
			this._isSettingScrollTop = false;
		}
		this._elements.header.classList.toggle("shadow", delta > 0 || editorScroll > 0);
		this._elements.header.classList.toggle("collapsed", delta === maxDelta);
	}
	hide() {
		this._elements.root.style.top = `-100000px`;
		this._elements.root.style.visibility = "hidden";
	}
};
DiffEditorItemTemplate = __decorate$2([__param$2(3, IInstantiationService), __param$2(4, IContextKeyService)], DiffEditorItemTemplate);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/browser/widget/multiDiffEditor/objectPool.js
var ObjectPool = class {
	constructor(_create) {
		this._create = _create;
		this._unused = /* @__PURE__ */ new Set();
		this._used = /* @__PURE__ */ new Set();
		this._itemData = /* @__PURE__ */ new Map();
	}
	getUnusedObj(data) {
		let obj;
		if (this._unused.size === 0) {
			obj = this._create(data);
			this._itemData.set(obj, data);
		} else {
			const values = [...this._unused.values()];
			obj = values.find((obj$1) => this._itemData.get(obj$1).getId() === data.getId()) ?? values[0];
			this._unused.delete(obj);
			this._itemData.set(obj, data);
			obj.setData(data);
		}
		this._used.add(obj);
		return {
			object: obj,
			dispose: () => {
				this._used.delete(obj);
				if (this._unused.size > 5) obj.dispose();
				else this._unused.add(obj);
			}
		};
	}
	dispose() {
		for (const obj of this._used) obj.dispose();
		for (const obj of this._unused) obj.dispose();
		this._used.clear();
		this._unused.clear();
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/browser/widget/multiDiffEditor/multiDiffEditorWidgetImpl.js
var __decorate$1 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$1 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var MultiDiffEditorWidgetImpl = class MultiDiffEditorWidgetImpl$1 extends Disposable {
	constructor(_element, _dimension, _viewModel, _workbenchUIElementFactory, _parentContextKeyService, _parentInstantiationService) {
		super();
		this._element = _element;
		this._dimension = _dimension;
		this._viewModel = _viewModel;
		this._workbenchUIElementFactory = _workbenchUIElementFactory;
		this._parentContextKeyService = _parentContextKeyService;
		this._parentInstantiationService = _parentInstantiationService;
		this._scrollableElements = h("div.scrollContent", [h("div@content", { style: { overflow: "hidden" } }), h("div.monaco-editor@overflowWidgetsDomNode", {})]);
		this._scrollable = this._register(new Scrollable({
			forceIntegerValues: false,
			scheduleAtNextAnimationFrame: (cb) => scheduleAtNextAnimationFrame(getWindow(this._element), cb),
			smoothScrollDuration: 100
		}));
		this._scrollableElement = this._register(new SmoothScrollableElement(this._scrollableElements.root, {
			vertical: 1,
			horizontal: 1,
			useShadows: false
		}, this._scrollable));
		this._elements = h("div.monaco-component.multiDiffEditor", {}, [h("div", {}, [this._scrollableElement.getDomNode()]), h("div.placeholder@placeholder", {}, [h("div", [localize("noChangedFiles", "No Changed Files")])])]);
		this._sizeObserver = this._register(new ObservableElementSizeObserver(this._element, void 0));
		this._objectPool = this._register(new ObjectPool((data) => {
			const template = this._instantiationService.createInstance(DiffEditorItemTemplate, this._scrollableElements.content, this._scrollableElements.overflowWidgetsDomNode, this._workbenchUIElementFactory);
			template.setData(data);
			return template;
		}));
		this.scrollTop = observableFromEvent(this, this._scrollableElement.onScroll, () => this._scrollableElement.getScrollPosition().scrollTop);
		this.scrollLeft = observableFromEvent(this, this._scrollableElement.onScroll, () => this._scrollableElement.getScrollPosition().scrollLeft);
		this._viewItemsInfo = derivedWithStore(this, (reader, store) => {
			const vm = this._viewModel.read(reader);
			if (!vm) return {
				items: [],
				getItem: (_d) => {
					throw new BugIndicatingError();
				}
			};
			const viewModels = vm.items.read(reader);
			const map = /* @__PURE__ */ new Map();
			return {
				items: viewModels.map((d) => {
					const item = store.add(new VirtualizedViewItem(d, this._objectPool, this.scrollLeft, (delta) => {
						this._scrollableElement.setScrollPosition({ scrollTop: this._scrollableElement.getScrollPosition().scrollTop + delta });
					}));
					const data = this._lastDocStates?.[item.getKey()];
					if (data) transaction((tx) => {
						item.setViewState(data, tx);
					});
					map.set(d, item);
					return item;
				}),
				getItem: (d) => map.get(d)
			};
		});
		this._viewItems = this._viewItemsInfo.map(this, (items) => items.items);
		this._spaceBetweenPx = 0;
		this._totalHeight = this._viewItems.map(this, (items, reader) => items.reduce((r, i) => r + i.contentHeight.read(reader) + this._spaceBetweenPx, 0));
		this._contextKeyService = this._register(this._parentContextKeyService.createScoped(this._element));
		this._instantiationService = this._register(this._parentInstantiationService.createChild(new ServiceCollection([IContextKeyService, this._contextKeyService])));
		/** This accounts for documents that are not loaded yet. */
		this._lastDocStates = {};
		this._contextKeyService.createKey(EditorContextKeys.inMultiDiffEditor.key, true);
		this._register(autorunWithStore((reader, store) => {
			const viewModel = this._viewModel.read(reader);
			if (viewModel && viewModel.contextKeys) for (const [key, value] of Object.entries(viewModel.contextKeys)) {
				const contextKey = this._contextKeyService.createKey(key, void 0);
				contextKey.set(value);
				store.add(toDisposable(() => contextKey.reset()));
			}
		}));
		const ctxAllCollapsed = this._parentContextKeyService.createKey(EditorContextKeys.multiDiffEditorAllCollapsed.key, false);
		this._register(autorun((reader) => {
			const viewModel = this._viewModel.read(reader);
			if (viewModel) {
				const allCollapsed = viewModel.items.read(reader).every((item) => item.collapsed.read(reader));
				ctxAllCollapsed.set(allCollapsed);
			}
		}));
		this._register(autorun((reader) => {
			/** @description Update widget dimension */
			const dimension = this._dimension.read(reader);
			this._sizeObserver.observe(dimension);
		}));
		this._register(autorun((reader) => {
			/** @description Update widget dimension */
			const items = this._viewItems.read(reader);
			this._elements.placeholder.classList.toggle("visible", items.length === 0);
		}));
		this._scrollableElements.content.style.position = "relative";
		this._register(autorun((reader) => {
			/** @description Update scroll dimensions */
			const height = this._sizeObserver.height.read(reader);
			this._scrollableElements.root.style.height = `${height}px`;
			const totalHeight = this._totalHeight.read(reader);
			this._scrollableElements.content.style.height = `${totalHeight}px`;
			const width = this._sizeObserver.width.read(reader);
			let scrollWidth = width;
			const viewItems = this._viewItems.read(reader);
			const max = findFirstMax(viewItems, compareBy((i) => i.maxScroll.read(reader).maxScroll, numberComparator));
			if (max) {
				const maxScroll = max.maxScroll.read(reader);
				scrollWidth = width + maxScroll.maxScroll;
			}
			this._scrollableElement.setScrollDimensions({
				width,
				height,
				scrollHeight: totalHeight,
				scrollWidth
			});
		}));
		_element.replaceChildren(this._elements.root);
		this._register(toDisposable(() => {
			_element.replaceChildren();
		}));
		this._register(this._register(autorun((reader) => {
			/** @description Render all */
			globalTransaction((tx) => {
				this.render(reader);
			});
		})));
	}
	render(reader) {
		const scrollTop = this.scrollTop.read(reader);
		let contentScrollOffsetToScrollOffset = 0;
		let itemHeightSumBefore = 0;
		let itemContentHeightSumBefore = 0;
		const viewPortHeight = this._sizeObserver.height.read(reader);
		const contentViewPort = OffsetRange.ofStartAndLength(scrollTop, viewPortHeight);
		const width = this._sizeObserver.width.read(reader);
		for (const v of this._viewItems.read(reader)) {
			const itemContentHeight = v.contentHeight.read(reader);
			const itemHeight = Math.min(itemContentHeight, viewPortHeight);
			const itemRange = OffsetRange.ofStartAndLength(itemHeightSumBefore, itemHeight);
			const itemContentRange = OffsetRange.ofStartAndLength(itemContentHeightSumBefore, itemContentHeight);
			if (itemContentRange.isBefore(contentViewPort)) {
				contentScrollOffsetToScrollOffset -= itemContentHeight - itemHeight;
				v.hide();
			} else if (itemContentRange.isAfter(contentViewPort)) v.hide();
			else {
				const scroll = Math.max(0, Math.min(contentViewPort.start - itemContentRange.start, itemContentHeight - itemHeight));
				contentScrollOffsetToScrollOffset -= scroll;
				const viewPort = OffsetRange.ofStartAndLength(scrollTop + contentScrollOffsetToScrollOffset, viewPortHeight);
				v.render(itemRange, scroll, width, viewPort);
			}
			itemHeightSumBefore += itemHeight + this._spaceBetweenPx;
			itemContentHeightSumBefore += itemContentHeight + this._spaceBetweenPx;
		}
		this._scrollableElements.content.style.transform = `translateY(${-(scrollTop + contentScrollOffsetToScrollOffset)}px)`;
	}
};
MultiDiffEditorWidgetImpl = __decorate$1([__param$1(4, IContextKeyService), __param$1(5, IInstantiationService)], MultiDiffEditorWidgetImpl);
var VirtualizedViewItem = class extends Disposable {
	constructor(viewModel, _objectPool, _scrollLeft, _deltaScrollVertical) {
		super();
		this.viewModel = viewModel;
		this._objectPool = _objectPool;
		this._scrollLeft = _scrollLeft;
		this._deltaScrollVertical = _deltaScrollVertical;
		this._templateRef = this._register(disposableObservableValue(this, void 0));
		this.contentHeight = derived(this, (reader) => this._templateRef.read(reader)?.object.contentHeight?.read(reader) ?? this.viewModel.lastTemplateData.read(reader).contentHeight);
		this.maxScroll = derived(this, (reader) => this._templateRef.read(reader)?.object.maxScroll.read(reader) ?? {
			maxScroll: 0,
			scrollWidth: 0
		});
		this.template = derived(this, (reader) => this._templateRef.read(reader)?.object);
		this._isHidden = observableValue(this, false);
		this._isFocused = derived(this, (reader) => this.template.read(reader)?.isFocused.read(reader) ?? false);
		this.viewModel.setIsFocused(this._isFocused, void 0);
		this._register(autorun((reader) => {
			const scrollLeft = this._scrollLeft.read(reader);
			this._templateRef.read(reader)?.object.setScrollLeft(scrollLeft);
		}));
		this._register(autorun((reader) => {
			const ref = this._templateRef.read(reader);
			if (!ref) return;
			if (!this._isHidden.read(reader)) return;
			if (ref.object.isFocused.read(reader)) return;
			this._clear();
		}));
	}
	dispose() {
		this._clear();
		super.dispose();
	}
	toString() {
		return `VirtualViewItem(${this.viewModel.documentDiffItem.modified?.uri.toString()})`;
	}
	getKey() {
		return this.viewModel.getKey();
	}
	setViewState(viewState, tx) {
		this.viewModel.collapsed.set(viewState.collapsed, tx);
		this._updateTemplateData(tx);
		const data = this.viewModel.lastTemplateData.get();
		const selections = viewState.selections?.map(Selection$1.liftSelection);
		this.viewModel.lastTemplateData.set({
			...data,
			selections
		}, tx);
		const ref = this._templateRef.get();
		if (ref) {
			if (selections) ref.object.editor.setSelections(selections);
		}
	}
	_updateTemplateData(tx) {
		const ref = this._templateRef.get();
		if (!ref) return;
		this.viewModel.lastTemplateData.set({
			contentHeight: ref.object.contentHeight.get(),
			selections: ref.object.editor.getSelections() ?? void 0
		}, tx);
	}
	_clear() {
		const ref = this._templateRef.get();
		if (!ref) return;
		transaction((tx) => {
			this._updateTemplateData(tx);
			ref.object.hide();
			this._templateRef.set(void 0, tx);
		});
	}
	hide() {
		this._isHidden.set(true, void 0);
	}
	render(verticalSpace, offset, width, viewPort) {
		this._isHidden.set(false, void 0);
		let ref = this._templateRef.get();
		if (!ref) {
			ref = this._objectPool.getUnusedObj(new TemplateData(this.viewModel, this._deltaScrollVertical));
			this._templateRef.set(ref, void 0);
			const selections = this.viewModel.lastTemplateData.get().selections;
			if (selections) ref.object.editor.setSelections(selections);
		}
		ref.object.render(verticalSpace, width, offset, viewPort);
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/browser/widget/multiDiffEditor/colors.js
const multiDiffEditorHeaderBackground = registerColor("multiDiffEditor.headerBackground", {
	dark: "#262626",
	light: "tab.inactiveBackground",
	hcDark: "tab.inactiveBackground",
	hcLight: "tab.inactiveBackground"
}, localize("multiDiffEditor.headerBackground", "The background color of the diff editor's header"));
const multiDiffEditorBackground = registerColor("multiDiffEditor.background", editorBackground, localize("multiDiffEditor.background", "The background color of the multi file diff editor"));
const multiDiffEditorBorder = registerColor("multiDiffEditor.border", {
	dark: "sideBarSectionHeader.border",
	light: "#cccccc",
	hcDark: "sideBarSectionHeader.border",
	hcLight: "#cccccc"
}, localize("multiDiffEditor.border", "The border color of the multi file diff editor"));

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/browser/widget/multiDiffEditor/multiDiffEditorWidget.js
var __decorate = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var MultiDiffEditorWidget = class MultiDiffEditorWidget$1 extends Disposable {
	constructor(_element, _workbenchUIElementFactory, _instantiationService) {
		super();
		this._element = _element;
		this._workbenchUIElementFactory = _workbenchUIElementFactory;
		this._instantiationService = _instantiationService;
		this._dimension = observableValue(this, void 0);
		this._viewModel = observableValue(this, void 0);
		this._widgetImpl = derivedWithStore(this, (reader, store) => {
			readHotReloadableExport(DiffEditorItemTemplate, reader);
			return store.add(this._instantiationService.createInstance(readHotReloadableExport(MultiDiffEditorWidgetImpl, reader), this._element, this._dimension, this._viewModel, this._workbenchUIElementFactory));
		});
		this._register(recomputeInitiallyAndOnChange(this._widgetImpl));
	}
};
MultiDiffEditorWidget = __decorate([__param(2, IInstantiationService)], MultiDiffEditorWidget);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneEditor.js
/**
* Create a new editor under `domElement`.
* `domElement` should be empty (not contain other dom nodes).
* The editor will read the size of `domElement`.
*/
function create(domElement, options, override) {
	return StandaloneServices.initialize(override || {}).createInstance(StandaloneEditor, domElement, options);
}
/**
* Emitted when an editor is created.
* Creating a diff editor might cause this listener to be invoked with the two editors.
* @event
*/
function onDidCreateEditor(listener) {
	return StandaloneServices.get(ICodeEditorService).onCodeEditorAdd((editor$1) => {
		listener(editor$1);
	});
}
/**
* Emitted when an diff editor is created.
* @event
*/
function onDidCreateDiffEditor(listener) {
	return StandaloneServices.get(ICodeEditorService).onDiffEditorAdd((editor$1) => {
		listener(editor$1);
	});
}
/**
* Get all the created editors.
*/
function getEditors() {
	return StandaloneServices.get(ICodeEditorService).listCodeEditors();
}
/**
* Get all the created diff editors.
*/
function getDiffEditors() {
	return StandaloneServices.get(ICodeEditorService).listDiffEditors();
}
/**
* Create a new diff editor under `domElement`.
* `domElement` should be empty (not contain other dom nodes).
* The editor will read the size of `domElement`.
*/
function createDiffEditor(domElement, options, override) {
	return StandaloneServices.initialize(override || {}).createInstance(StandaloneDiffEditor2, domElement, options);
}
function createMultiFileDiffEditor(domElement, override) {
	const instantiationService = StandaloneServices.initialize(override || {});
	return new MultiDiffEditorWidget(domElement, {}, instantiationService);
}
/**
* Add a command.
*/
function addCommand(descriptor) {
	if (typeof descriptor.id !== "string" || typeof descriptor.run !== "function") throw new Error("Invalid command descriptor, `id` and `run` are required properties!");
	return CommandsRegistry.registerCommand(descriptor.id, descriptor.run);
}
/**
* Add an action to all editors.
*/
function addEditorAction(descriptor) {
	if (typeof descriptor.id !== "string" || typeof descriptor.label !== "string" || typeof descriptor.run !== "function") throw new Error("Invalid action descriptor, `id`, `label` and `run` are required properties!");
	const precondition = ContextKeyExpr.deserialize(descriptor.precondition);
	const run = (accessor, ...args) => {
		return EditorCommand.runEditorCommand(accessor, args, precondition, (accessor$1, editor$1, args$1) => Promise.resolve(descriptor.run(editor$1, ...args$1)));
	};
	const toDispose = new DisposableStore();
	toDispose.add(CommandsRegistry.registerCommand(descriptor.id, run));
	if (descriptor.contextMenuGroupId) {
		const menuItem = {
			command: {
				id: descriptor.id,
				title: descriptor.label
			},
			when: precondition,
			group: descriptor.contextMenuGroupId,
			order: descriptor.contextMenuOrder || 0
		};
		toDispose.add(MenuRegistry.appendMenuItem(MenuId.EditorContext, menuItem));
	}
	if (Array.isArray(descriptor.keybindings)) {
		const keybindingService = StandaloneServices.get(IKeybindingService);
		if (!(keybindingService instanceof StandaloneKeybindingService)) console.warn("Cannot add keybinding because the editor is configured with an unrecognized KeybindingService");
		else {
			const keybindingsWhen = ContextKeyExpr.and(precondition, ContextKeyExpr.deserialize(descriptor.keybindingContext));
			toDispose.add(keybindingService.addDynamicKeybindings(descriptor.keybindings.map((keybinding) => {
				return {
					keybinding,
					command: descriptor.id,
					when: keybindingsWhen
				};
			})));
		}
	}
	return toDispose;
}
/**
* Add a keybinding rule.
*/
function addKeybindingRule(rule) {
	return addKeybindingRules([rule]);
}
/**
* Add keybinding rules.
*/
function addKeybindingRules(rules) {
	const keybindingService = StandaloneServices.get(IKeybindingService);
	if (!(keybindingService instanceof StandaloneKeybindingService)) {
		console.warn("Cannot add keybinding because the editor is configured with an unrecognized KeybindingService");
		return Disposable.None;
	}
	return keybindingService.addDynamicKeybindings(rules.map((rule) => {
		return {
			keybinding: rule.keybinding,
			command: rule.command,
			commandArgs: rule.commandArgs,
			when: ContextKeyExpr.deserialize(rule.when)
		};
	}));
}
/**
* Create a new editor model.
* You can specify the language that should be set for this model or let the language be inferred from the `uri`.
*/
function createModel(value, language, uri) {
	const languageService = StandaloneServices.get(ILanguageService);
	const languageId = languageService.getLanguageIdByMimeType(language) || language;
	return createTextModel(StandaloneServices.get(IModelService), languageService, value, languageId, uri);
}
/**
* Change the language for a model.
*/
function setModelLanguage(model, mimeTypeOrLanguageId) {
	const languageService = StandaloneServices.get(ILanguageService);
	const languageId = languageService.getLanguageIdByMimeType(mimeTypeOrLanguageId) || mimeTypeOrLanguageId || PLAINTEXT_LANGUAGE_ID;
	model.setLanguage(languageService.createById(languageId));
}
/**
* Set the markers for a model.
*/
function setModelMarkers(model, owner, markers) {
	if (model) StandaloneServices.get(IMarkerService).changeOne(owner, model.uri, markers);
}
/**
* Remove all markers of an owner.
*/
function removeAllMarkers(owner) {
	StandaloneServices.get(IMarkerService).changeAll(owner, []);
}
/**
* Get markers for owner and/or resource
*
* @returns list of markers
*/
function getModelMarkers(filter) {
	return StandaloneServices.get(IMarkerService).read(filter);
}
/**
* Emitted when markers change for a model.
* @event
*/
function onDidChangeMarkers(listener) {
	return StandaloneServices.get(IMarkerService).onMarkerChanged(listener);
}
/**
* Get the model that has `uri` if it exists.
*/
function getModel(uri) {
	return StandaloneServices.get(IModelService).getModel(uri);
}
/**
* Get all the created models.
*/
function getModels() {
	return StandaloneServices.get(IModelService).getModels();
}
/**
* Emitted when a model is created.
* @event
*/
function onDidCreateModel(listener) {
	return StandaloneServices.get(IModelService).onModelAdded(listener);
}
/**
* Emitted right before a model is disposed.
* @event
*/
function onWillDisposeModel(listener) {
	return StandaloneServices.get(IModelService).onModelRemoved(listener);
}
/**
* Emitted when a different language is set to a model.
* @event
*/
function onDidChangeModelLanguage(listener) {
	return StandaloneServices.get(IModelService).onModelLanguageChanged((e) => {
		listener({
			model: e.model,
			oldLanguage: e.oldLanguageId
		});
	});
}
/**
* Create a new web worker that has model syncing capabilities built in.
* Specify an AMD module to load that will `create` an object that will be proxied.
*/
function createWebWorker$1(opts) {
	return createWebWorker(StandaloneServices.get(IModelService), opts);
}
/**
* Colorize the contents of `domNode` using attribute `data-lang`.
*/
function colorizeElement(domNode, options) {
	const languageService = StandaloneServices.get(ILanguageService);
	const themeService = StandaloneServices.get(IStandaloneThemeService);
	return Colorizer.colorizeElement(themeService, languageService, domNode, options).then(() => {
		themeService.registerEditorContainer(domNode);
	});
}
/**
* Colorize `text` using language `languageId`.
*/
function colorize(text, languageId, options) {
	const languageService = StandaloneServices.get(ILanguageService);
	StandaloneServices.get(IStandaloneThemeService).registerEditorContainer(mainWindow.document.body);
	return Colorizer.colorize(languageService, text, languageId, options);
}
/**
* Colorize a line in a model.
*/
function colorizeModelLine(model, lineNumber, tabSize = 4) {
	StandaloneServices.get(IStandaloneThemeService).registerEditorContainer(mainWindow.document.body);
	return Colorizer.colorizeModelLine(model, lineNumber, tabSize);
}
/**
* @internal
*/
function getSafeTokenizationSupport(language) {
	const tokenizationSupport = TokenizationRegistry.get(language);
	if (tokenizationSupport) return tokenizationSupport;
	return {
		getInitialState: () => NullState,
		tokenize: (line, hasEOL, state) => nullTokenize(language, state)
	};
}
/**
* Tokenize `text` using language `languageId`
*/
function tokenize(text, languageId) {
	TokenizationRegistry.getOrCreate(languageId);
	const tokenizationSupport = getSafeTokenizationSupport(languageId);
	const lines = splitLines(text);
	const result = [];
	let state = tokenizationSupport.getInitialState();
	for (let i = 0, len = lines.length; i < len; i++) {
		const line = lines[i];
		const tokenizationResult = tokenizationSupport.tokenize(line, true, state);
		result[i] = tokenizationResult.tokens;
		state = tokenizationResult.endState;
	}
	return result;
}
/**
* Define a new theme or update an existing theme.
*/
function defineTheme(themeName, themeData) {
	StandaloneServices.get(IStandaloneThemeService).defineTheme(themeName, themeData);
}
/**
* Switches to a theme.
*/
function setTheme(themeName) {
	StandaloneServices.get(IStandaloneThemeService).setTheme(themeName);
}
/**
* Clears all cached font measurements and triggers re-measurement.
*/
function remeasureFonts() {
	FontMeasurements.clearAllFontInfos();
}
/**
* Register a command.
*/
function registerCommand(id, handler) {
	return CommandsRegistry.registerCommand({
		id,
		handler
	});
}
/**
* Registers a handler that is called when a link is opened in any editor. The handler callback should return `true` if the link was handled and `false` otherwise.
* The handler that was registered last will be called first when a link is opened.
*
* Returns a disposable that can unregister the opener again.
*/
function registerLinkOpener(opener) {
	return StandaloneServices.get(IOpenerService).registerOpener({ async open(resource) {
		if (typeof resource === "string") resource = URI.parse(resource);
		return opener.open(resource);
	} });
}
/**
* Registers a handler that is called when a resource other than the current model should be opened in the editor (e.g. "go to definition").
* The handler callback should return `true` if the request was handled and `false` otherwise.
*
* Returns a disposable that can unregister the opener again.
*
* If no handler is registered the default behavior is to do nothing for models other than the currently attached one.
*/
function registerEditorOpener(opener) {
	return StandaloneServices.get(ICodeEditorService).registerCodeEditorOpenHandler(async (input, source, sideBySide) => {
		if (!source) return null;
		const selection = input.options?.selection;
		let selectionOrPosition;
		if (selection && typeof selection.endLineNumber === "number" && typeof selection.endColumn === "number") selectionOrPosition = selection;
		else if (selection) selectionOrPosition = {
			lineNumber: selection.startLineNumber,
			column: selection.startColumn
		};
		if (await opener.openCodeEditor(source, input.resource, selectionOrPosition)) return source;
		return null;
	});
}
/**
* @internal
*/
function createMonacoEditorAPI() {
	return {
		create,
		getEditors,
		getDiffEditors,
		onDidCreateEditor,
		onDidCreateDiffEditor,
		createDiffEditor,
		addCommand,
		addEditorAction,
		addKeybindingRule,
		addKeybindingRules,
		createModel,
		setModelLanguage,
		setModelMarkers,
		getModelMarkers,
		removeAllMarkers,
		onDidChangeMarkers,
		getModels,
		getModel,
		onDidCreateModel,
		onWillDisposeModel,
		onDidChangeModelLanguage,
		createWebWorker: createWebWorker$1,
		colorizeElement,
		colorize,
		colorizeModelLine,
		tokenize,
		defineTheme,
		setTheme,
		remeasureFonts,
		registerCommand,
		registerLinkOpener,
		registerEditorOpener,
		AccessibilitySupport,
		ContentWidgetPositionPreference,
		CursorChangeReason,
		DefaultEndOfLine,
		EditorAutoIndentStrategy,
		EditorOption,
		EndOfLinePreference,
		EndOfLineSequence,
		MinimapPosition,
		MinimapSectionHeaderStyle,
		MouseTargetType,
		OverlayWidgetPositionPreference,
		OverviewRulerLane: OverviewRulerLane$1,
		GlyphMarginLane,
		RenderLineNumbersType,
		RenderMinimap,
		ScrollbarVisibility,
		ScrollType,
		TextEditorCursorBlinkingStyle,
		TextEditorCursorStyle,
		TrackedRangeStickiness,
		WrappingIndent,
		InjectedTextCursorStops,
		PositionAffinity,
		ShowLightbulbIconMode,
		ConfigurationChangedEvent,
		BareFontInfo,
		FontInfo,
		TextModelResolvedOptions,
		FindMatch,
		ApplyUpdateResult,
		EditorZoom,
		createMultiFileDiffEditor,
		EditorType,
		EditorOptions
	};
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/common/monarch/monarchCompile.js
function isArrayOf(elemType, obj) {
	if (!obj) return false;
	if (!Array.isArray(obj)) return false;
	for (const el of obj) if (!elemType(el)) return false;
	return true;
}
function bool(prop, defValue) {
	if (typeof prop === "boolean") return prop;
	return defValue;
}
function string(prop, defValue) {
	if (typeof prop === "string") return prop;
	return defValue;
}
function arrayToHash(array) {
	const result = {};
	for (const e of array) result[e] = true;
	return result;
}
function createKeywordMatcher(arr, caseInsensitive = false) {
	if (caseInsensitive) arr = arr.map(function(x) {
		return x.toLowerCase();
	});
	const hash$1 = arrayToHash(arr);
	if (caseInsensitive) return function(word) {
		return hash$1[word.toLowerCase()] !== void 0 && hash$1.hasOwnProperty(word.toLowerCase());
	};
	else return function(word) {
		return hash$1[word] !== void 0 && hash$1.hasOwnProperty(word);
	};
}
function compileRegExp(lexer, str, handleSn) {
	str = str.replace(/@@/g, `\x01`);
	let n = 0;
	let hadExpansion;
	do {
		hadExpansion = false;
		str = str.replace(/@(\w+)/g, function(s, attr) {
			hadExpansion = true;
			let sub = "";
			if (typeof lexer[attr] === "string") sub = lexer[attr];
			else if (lexer[attr] && lexer[attr] instanceof RegExp) sub = lexer[attr].source;
			else if (lexer[attr] === void 0) throw createError(lexer, "language definition does not contain attribute '" + attr + "', used at: " + str);
			else throw createError(lexer, "attribute reference '" + attr + "' must be a string, used at: " + str);
			return empty(sub) ? "" : "(?:" + sub + ")";
		});
		n++;
	} while (hadExpansion && n < 5);
	str = str.replace(/\x01/g, "@");
	const flags = (lexer.ignoreCase ? "i" : "") + (lexer.unicode ? "u" : "");
	if (handleSn) {
		if (str.match(/\$[sS](\d\d?)/g)) {
			let lastState = null;
			let lastRegEx = null;
			return (state) => {
				if (lastRegEx && lastState === state) return lastRegEx;
				lastState = state;
				lastRegEx = new RegExp(substituteMatchesRe(lexer, str, state), flags);
				return lastRegEx;
			};
		}
	}
	return new RegExp(str, flags);
}
/**
* Compiles guard functions for case matches.
* This compiles 'cases' attributes into efficient match functions.
*
*/
function selectScrutinee(id, matches, state, num) {
	if (num < 0) return id;
	if (num < matches.length) return matches[num];
	if (num >= 100) {
		num = num - 100;
		const parts = state.split(".");
		parts.unshift(state);
		if (num < parts.length) return parts[num];
	}
	return null;
}
function createGuard(lexer, ruleName, tkey, val) {
	let scrut = -1;
	let oppat = tkey;
	let matches = tkey.match(/^\$(([sS]?)(\d\d?)|#)(.*)$/);
	if (matches) {
		if (matches[3]) {
			scrut = parseInt(matches[3]);
			if (matches[2]) scrut = scrut + 100;
		}
		oppat = matches[4];
	}
	let op = "~";
	let pat = oppat;
	if (!oppat || oppat.length === 0) {
		op = "!=";
		pat = "";
	} else if (/^\w*$/.test(pat)) op = "==";
	else {
		matches = oppat.match(/^(@|!@|~|!~|==|!=)(.*)$/);
		if (matches) {
			op = matches[1];
			pat = matches[2];
		}
	}
	let tester;
	if ((op === "~" || op === "!~") && /^(\w|\|)*$/.test(pat)) {
		const inWords = createKeywordMatcher(pat.split("|"), lexer.ignoreCase);
		tester = function(s) {
			return op === "~" ? inWords(s) : !inWords(s);
		};
	} else if (op === "@" || op === "!@") {
		const words = lexer[pat];
		if (!words) throw createError(lexer, "the @ match target '" + pat + "' is not defined, in rule: " + ruleName);
		if (!isArrayOf(function(elem) {
			return typeof elem === "string";
		}, words)) throw createError(lexer, "the @ match target '" + pat + "' must be an array of strings, in rule: " + ruleName);
		const inWords = createKeywordMatcher(words, lexer.ignoreCase);
		tester = function(s) {
			return op === "@" ? inWords(s) : !inWords(s);
		};
	} else if (op === "~" || op === "!~") if (pat.indexOf("$") < 0) {
		const re = compileRegExp(lexer, "^" + pat + "$", false);
		tester = function(s) {
			return op === "~" ? re.test(s) : !re.test(s);
		};
	} else tester = function(s, id, matches$1, state) {
		return compileRegExp(lexer, "^" + substituteMatches(lexer, pat, id, matches$1, state) + "$", false).test(s);
	};
	else if (pat.indexOf("$") < 0) {
		const patx = fixCase(lexer, pat);
		tester = function(s) {
			return op === "==" ? s === patx : s !== patx;
		};
	} else {
		const patx = fixCase(lexer, pat);
		tester = function(s, id, matches$1, state, eos) {
			const patexp = substituteMatches(lexer, patx, id, matches$1, state);
			return op === "==" ? s === patexp : s !== patexp;
		};
	}
	if (scrut === -1) return {
		name: tkey,
		value: val,
		test: function(id, matches$1, state, eos) {
			return tester(id, id, matches$1, state, eos);
		}
	};
	else return {
		name: tkey,
		value: val,
		test: function(id, matches$1, state, eos) {
			const scrutinee = selectScrutinee(id, matches$1, state, scrut);
			return tester(!scrutinee ? "" : scrutinee, id, matches$1, state, eos);
		}
	};
}
/**
* Compiles an action: i.e. optimize regular expressions and case matches
* and do many sanity checks.
*
* This is called only during compilation but if the lexer definition
* contains user functions as actions (which is usually not allowed), then this
* may be called during lexing. It is important therefore to compile common cases efficiently
*/
function compileAction(lexer, ruleName, action) {
	if (!action) return { token: "" };
	else if (typeof action === "string") return action;
	else if (action.token || action.token === "") if (typeof action.token !== "string") throw createError(lexer, "a 'token' attribute must be of type string, in rule: " + ruleName);
	else {
		const newAction = { token: action.token };
		if (action.token.indexOf("$") >= 0) newAction.tokenSubst = true;
		if (typeof action.bracket === "string") if (action.bracket === "@open") newAction.bracket = 1;
		else if (action.bracket === "@close") newAction.bracket = -1;
		else throw createError(lexer, "a 'bracket' attribute must be either '@open' or '@close', in rule: " + ruleName);
		if (action.next) if (typeof action.next !== "string") throw createError(lexer, "the next state must be a string value in rule: " + ruleName);
		else {
			let next = action.next;
			if (!/^(@pop|@push|@popall)$/.test(next)) {
				if (next[0] === "@") next = next.substr(1);
				if (next.indexOf("$") < 0) {
					if (!stateExists(lexer, substituteMatches(lexer, next, "", [], ""))) throw createError(lexer, "the next state '" + action.next + "' is not defined in rule: " + ruleName);
				}
			}
			newAction.next = next;
		}
		if (typeof action.goBack === "number") newAction.goBack = action.goBack;
		if (typeof action.switchTo === "string") newAction.switchTo = action.switchTo;
		if (typeof action.log === "string") newAction.log = action.log;
		if (typeof action.nextEmbedded === "string") {
			newAction.nextEmbedded = action.nextEmbedded;
			lexer.usesEmbedded = true;
		}
		return newAction;
	}
	else if (Array.isArray(action)) {
		const results = [];
		for (let i = 0, len = action.length; i < len; i++) results[i] = compileAction(lexer, ruleName, action[i]);
		return { group: results };
	} else if (action.cases) {
		const cases = [];
		for (const tkey in action.cases) if (action.cases.hasOwnProperty(tkey)) {
			const val = compileAction(lexer, ruleName, action.cases[tkey]);
			if (tkey === "@default" || tkey === "@" || tkey === "") cases.push({
				test: void 0,
				value: val,
				name: tkey
			});
			else if (tkey === "@eos") cases.push({
				test: function(id, matches, state, eos) {
					return eos;
				},
				value: val,
				name: tkey
			});
			else cases.push(createGuard(lexer, ruleName, tkey, val));
		}
		const def = lexer.defaultToken;
		return { test: function(id, matches, state, eos) {
			for (const _case of cases) if (!_case.test || _case.test(id, matches, state, eos)) return _case.value;
			return def;
		} };
	} else throw createError(lexer, "an action must be a string, an object with a 'token' or 'cases' attribute, or an array of actions; in rule: " + ruleName);
}
/**
* Helper class for creating matching rules
*/
var Rule = class {
	constructor(name) {
		this.regex = /* @__PURE__ */ new RegExp("");
		this.action = { token: "" };
		this.matchOnlyAtLineStart = false;
		this.name = "";
		this.name = name;
	}
	setRegex(lexer, re) {
		let sregex;
		if (typeof re === "string") sregex = re;
		else if (re instanceof RegExp) sregex = re.source;
		else throw createError(lexer, "rules must start with a match string or regular expression: " + this.name);
		this.matchOnlyAtLineStart = sregex.length > 0 && sregex[0] === "^";
		this.name = this.name + ": " + sregex;
		this.regex = compileRegExp(lexer, "^(?:" + (this.matchOnlyAtLineStart ? sregex.substr(1) : sregex) + ")", true);
	}
	setAction(lexer, act) {
		this.action = compileAction(lexer, this.name, act);
	}
	resolveRegex(state) {
		if (this.regex instanceof RegExp) return this.regex;
		else return this.regex(state);
	}
};
/**
* Compiles a json description function into json where all regular expressions,
* case matches etc, are compiled and all include rules are expanded.
* We also compile the bracket definitions, supply defaults, and do many sanity checks.
* If the 'jsonStrict' parameter is 'false', we allow at certain locations
* regular expression objects and functions that get called during lexing.
* (Currently we have no samples that need this so perhaps we should always have
* jsonStrict to true).
*/
function compile(languageId, json) {
	if (!json || typeof json !== "object") throw new Error("Monarch: expecting a language definition object");
	const lexer = {
		languageId,
		includeLF: bool(json.includeLF, false),
		noThrow: false,
		maxStack: 100,
		start: typeof json.start === "string" ? json.start : null,
		ignoreCase: bool(json.ignoreCase, false),
		unicode: bool(json.unicode, false),
		tokenPostfix: string(json.tokenPostfix, "." + languageId),
		defaultToken: string(json.defaultToken, "source"),
		usesEmbedded: false,
		stateNames: {},
		tokenizer: {},
		brackets: []
	};
	const lexerMin = json;
	lexerMin.languageId = languageId;
	lexerMin.includeLF = lexer.includeLF;
	lexerMin.ignoreCase = lexer.ignoreCase;
	lexerMin.unicode = lexer.unicode;
	lexerMin.noThrow = lexer.noThrow;
	lexerMin.usesEmbedded = lexer.usesEmbedded;
	lexerMin.stateNames = json.tokenizer;
	lexerMin.defaultToken = lexer.defaultToken;
	function addRules(state, newrules, rules) {
		for (const rule of rules) {
			let include = rule.include;
			if (include) {
				if (typeof include !== "string") throw createError(lexer, "an 'include' attribute must be a string at: " + state);
				if (include[0] === "@") include = include.substr(1);
				if (!json.tokenizer[include]) throw createError(lexer, "include target '" + include + "' is not defined at: " + state);
				addRules(state + "." + include, newrules, json.tokenizer[include]);
			} else {
				const newrule = new Rule(state);
				if (Array.isArray(rule) && rule.length >= 1 && rule.length <= 3) {
					newrule.setRegex(lexerMin, rule[0]);
					if (rule.length >= 3) if (typeof rule[1] === "string") newrule.setAction(lexerMin, {
						token: rule[1],
						next: rule[2]
					});
					else if (typeof rule[1] === "object") {
						const rule1 = rule[1];
						rule1.next = rule[2];
						newrule.setAction(lexerMin, rule1);
					} else throw createError(lexer, "a next state as the last element of a rule can only be given if the action is either an object or a string, at: " + state);
					else newrule.setAction(lexerMin, rule[1]);
				} else {
					if (!rule.regex) throw createError(lexer, "a rule must either be an array, or an object with a 'regex' or 'include' field at: " + state);
					if (rule.name) {
						if (typeof rule.name === "string") newrule.name = rule.name;
					}
					if (rule.matchOnlyAtStart) newrule.matchOnlyAtLineStart = bool(rule.matchOnlyAtLineStart, false);
					newrule.setRegex(lexerMin, rule.regex);
					newrule.setAction(lexerMin, rule.action);
				}
				newrules.push(newrule);
			}
		}
	}
	if (!json.tokenizer || typeof json.tokenizer !== "object") throw createError(lexer, "a language definition must define the 'tokenizer' attribute as an object");
	lexer.tokenizer = [];
	for (const key in json.tokenizer) if (json.tokenizer.hasOwnProperty(key)) {
		if (!lexer.start) lexer.start = key;
		const rules = json.tokenizer[key];
		lexer.tokenizer[key] = new Array();
		addRules("tokenizer." + key, lexer.tokenizer[key], rules);
	}
	lexer.usesEmbedded = lexerMin.usesEmbedded;
	if (json.brackets) {
		if (!Array.isArray(json.brackets)) throw createError(lexer, "the 'brackets' attribute must be defined as an array");
	} else json.brackets = [
		{
			open: "{",
			close: "}",
			token: "delimiter.curly"
		},
		{
			open: "[",
			close: "]",
			token: "delimiter.square"
		},
		{
			open: "(",
			close: ")",
			token: "delimiter.parenthesis"
		},
		{
			open: "<",
			close: ">",
			token: "delimiter.angle"
		}
	];
	const brackets = [];
	for (const el of json.brackets) {
		let desc = el;
		if (desc && Array.isArray(desc) && desc.length === 3) desc = {
			token: desc[2],
			open: desc[0],
			close: desc[1]
		};
		if (desc.open === desc.close) throw createError(lexer, "open and close brackets in a 'brackets' attribute must be different: " + desc.open + "\n hint: use the 'bracket' attribute if matching on equal brackets is required.");
		if (typeof desc.open === "string" && typeof desc.token === "string" && typeof desc.close === "string") brackets.push({
			token: desc.token + lexer.tokenPostfix,
			open: fixCase(lexer, desc.open),
			close: fixCase(lexer, desc.close)
		});
		else throw createError(lexer, "every element in the 'brackets' array must be a '{open,close,token}' object or array");
	}
	lexer.brackets = brackets;
	lexer.noThrow = true;
	return lexer;
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneLanguages.js
/**
* Register information about a new language.
*/
function register(language) {
	ModesRegistry.registerLanguage(language);
}
/**
* Get the information of all the registered languages.
*/
function getLanguages() {
	let result = [];
	result = result.concat(ModesRegistry.getLanguages());
	return result;
}
function getEncodedLanguageId(languageId) {
	return StandaloneServices.get(ILanguageService).languageIdCodec.encodeLanguageId(languageId);
}
/**
* An event emitted when a language is associated for the first time with a text model.
* @event
*/
function onLanguage(languageId, callback) {
	return StandaloneServices.withServices(() => {
		const disposable = StandaloneServices.get(ILanguageService).onDidRequestRichLanguageFeatures((encounteredLanguageId) => {
			if (encounteredLanguageId === languageId) {
				disposable.dispose();
				callback();
			}
		});
		return disposable;
	});
}
/**
* An event emitted when a language is associated for the first time with a text model or
* when a language is encountered during the tokenization of another language.
* @event
*/
function onLanguageEncountered(languageId, callback) {
	return StandaloneServices.withServices(() => {
		const disposable = StandaloneServices.get(ILanguageService).onDidRequestBasicLanguageFeatures((encounteredLanguageId) => {
			if (encounteredLanguageId === languageId) {
				disposable.dispose();
				callback();
			}
		});
		return disposable;
	});
}
/**
* Set the editing configuration for a language.
*/
function setLanguageConfiguration(languageId, configuration) {
	if (!StandaloneServices.get(ILanguageService).isRegisteredLanguageId(languageId)) throw new Error(`Cannot set configuration for unknown language ${languageId}`);
	return StandaloneServices.get(ILanguageConfigurationService).register(languageId, configuration, 100);
}
/**
* @internal
*/
var EncodedTokenizationSupportAdapter = class {
	constructor(languageId, actual) {
		this._languageId = languageId;
		this._actual = actual;
	}
	dispose() {}
	getInitialState() {
		return this._actual.getInitialState();
	}
	tokenize(line, hasEOL, state) {
		if (typeof this._actual.tokenize === "function") return TokenizationSupportAdapter.adaptTokenize(this._languageId, this._actual, line, state);
		throw new Error("Not supported!");
	}
	tokenizeEncoded(line, hasEOL, state) {
		const result = this._actual.tokenizeEncoded(line, state);
		return new EncodedTokenizationResult(result.tokens, result.endState);
	}
};
/**
* @internal
*/
var TokenizationSupportAdapter = class TokenizationSupportAdapter {
	constructor(_languageId, _actual, _languageService, _standaloneThemeService) {
		this._languageId = _languageId;
		this._actual = _actual;
		this._languageService = _languageService;
		this._standaloneThemeService = _standaloneThemeService;
	}
	dispose() {}
	getInitialState() {
		return this._actual.getInitialState();
	}
	static _toClassicTokens(tokens, language) {
		const result = [];
		let previousStartIndex = 0;
		for (let i = 0, len = tokens.length; i < len; i++) {
			const t = tokens[i];
			let startIndex = t.startIndex;
			if (i === 0) startIndex = 0;
			else if (startIndex < previousStartIndex) startIndex = previousStartIndex;
			result[i] = new Token$1(startIndex, t.scopes, language);
			previousStartIndex = startIndex;
		}
		return result;
	}
	static adaptTokenize(language, actual, line, state) {
		const actualResult = actual.tokenize(line, state);
		const tokens = TokenizationSupportAdapter._toClassicTokens(actualResult.tokens, language);
		let endState;
		if (actualResult.endState.equals(state)) endState = state;
		else endState = actualResult.endState;
		return new TokenizationResult(tokens, endState);
	}
	tokenize(line, hasEOL, state) {
		return TokenizationSupportAdapter.adaptTokenize(this._languageId, this._actual, line, state);
	}
	_toBinaryTokens(languageIdCodec, tokens) {
		const languageId = languageIdCodec.encodeLanguageId(this._languageId);
		const tokenTheme = this._standaloneThemeService.getColorTheme().tokenTheme;
		const result = [];
		let resultLen = 0;
		let previousStartIndex = 0;
		for (let i = 0, len = tokens.length; i < len; i++) {
			const t = tokens[i];
			const metadata = tokenTheme.match(languageId, t.scopes) | 1024;
			if (resultLen > 0 && result[resultLen - 1] === metadata) continue;
			let startIndex = t.startIndex;
			if (i === 0) startIndex = 0;
			else if (startIndex < previousStartIndex) startIndex = previousStartIndex;
			result[resultLen++] = startIndex;
			result[resultLen++] = metadata;
			previousStartIndex = startIndex;
		}
		const actualResult = new Uint32Array(resultLen);
		for (let i = 0; i < resultLen; i++) actualResult[i] = result[i];
		return actualResult;
	}
	tokenizeEncoded(line, hasEOL, state) {
		const actualResult = this._actual.tokenize(line, state);
		const tokens = this._toBinaryTokens(this._languageService.languageIdCodec, actualResult.tokens);
		let endState;
		if (actualResult.endState.equals(state)) endState = state;
		else endState = actualResult.endState;
		return new EncodedTokenizationResult(tokens, endState);
	}
};
function isATokensProvider(provider) {
	return typeof provider.getInitialState === "function";
}
function isEncodedTokensProvider(provider) {
	return "tokenizeEncoded" in provider;
}
function isThenable(obj) {
	return obj && typeof obj.then === "function";
}
/**
* Change the color map that is used for token colors.
* Supported formats (hex): #RRGGBB, $RRGGBBAA, #RGB, #RGBA
*/
function setColorMap(colorMap) {
	const standaloneThemeService = StandaloneServices.get(IStandaloneThemeService);
	if (colorMap) {
		const result = [null];
		for (let i = 1, len = colorMap.length; i < len; i++) result[i] = Color.fromHex(colorMap[i]);
		standaloneThemeService.setColorMapOverride(result);
	} else standaloneThemeService.setColorMapOverride(null);
}
/**
* @internal
*/
function createTokenizationSupportAdapter(languageId, provider) {
	if (isEncodedTokensProvider(provider)) return new EncodedTokenizationSupportAdapter(languageId, provider);
	else return new TokenizationSupportAdapter(languageId, provider, StandaloneServices.get(ILanguageService), StandaloneServices.get(IStandaloneThemeService));
}
/**
* Register a tokens provider factory for a language. This tokenizer will be exclusive with a tokenizer
* set using `setTokensProvider` or one created using `setMonarchTokensProvider`, but will work together
* with a tokens provider set using `registerDocumentSemanticTokensProvider` or `registerDocumentRangeSemanticTokensProvider`.
*/
function registerTokensProviderFactory(languageId, factory) {
	const adaptedFactory = new LazyTokenizationSupport(async () => {
		const result = await Promise.resolve(factory.create());
		if (!result) return null;
		if (isATokensProvider(result)) return createTokenizationSupportAdapter(languageId, result);
		return new MonarchTokenizer(StandaloneServices.get(ILanguageService), StandaloneServices.get(IStandaloneThemeService), languageId, compile(languageId, result), StandaloneServices.get(IConfigurationService));
	});
	return TokenizationRegistry.registerFactory(languageId, adaptedFactory);
}
/**
* Set the tokens provider for a language (manual implementation). This tokenizer will be exclusive
* with a tokenizer created using `setMonarchTokensProvider`, or with `registerTokensProviderFactory`,
* but will work together with a tokens provider set using `registerDocumentSemanticTokensProvider`
* or `registerDocumentRangeSemanticTokensProvider`.
*/
function setTokensProvider(languageId, provider) {
	if (!StandaloneServices.get(ILanguageService).isRegisteredLanguageId(languageId)) throw new Error(`Cannot set tokens provider for unknown language ${languageId}`);
	if (isThenable(provider)) return registerTokensProviderFactory(languageId, { create: () => provider });
	return TokenizationRegistry.register(languageId, createTokenizationSupportAdapter(languageId, provider));
}
/**
* Set the tokens provider for a language (monarch implementation). This tokenizer will be exclusive
* with a tokenizer set using `setTokensProvider`, or with `registerTokensProviderFactory`, but will
* work together with a tokens provider set using `registerDocumentSemanticTokensProvider` or
* `registerDocumentRangeSemanticTokensProvider`.
*/
function setMonarchTokensProvider(languageId, languageDef) {
	const create$1 = (languageDef$1) => {
		return new MonarchTokenizer(StandaloneServices.get(ILanguageService), StandaloneServices.get(IStandaloneThemeService), languageId, compile(languageId, languageDef$1), StandaloneServices.get(IConfigurationService));
	};
	if (isThenable(languageDef)) return registerTokensProviderFactory(languageId, { create: () => languageDef });
	return TokenizationRegistry.register(languageId, create$1(languageDef));
}
/**
* Register a reference provider (used by e.g. reference search).
*/
function registerReferenceProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).referenceProvider.register(languageSelector, provider);
}
/**
* Register a rename provider (used by e.g. rename symbol).
*/
function registerRenameProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).renameProvider.register(languageSelector, provider);
}
/**
* Register a new symbol-name provider (e.g., when a symbol is being renamed, show new possible symbol-names)
*/
function registerNewSymbolNameProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).newSymbolNamesProvider.register(languageSelector, provider);
}
/**
* Register a signature help provider (used by e.g. parameter hints).
*/
function registerSignatureHelpProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).signatureHelpProvider.register(languageSelector, provider);
}
/**
* Register a hover provider (used by e.g. editor hover).
*/
function registerHoverProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).hoverProvider.register(languageSelector, { provideHover: async (model, position, token, context) => {
		const word = model.getWordAtPosition(position);
		return Promise.resolve(provider.provideHover(model, position, token, context)).then((value) => {
			if (!value) return;
			if (!value.range && word) value.range = new Range$1(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
			if (!value.range) value.range = new Range$1(position.lineNumber, position.column, position.lineNumber, position.column);
			return value;
		});
	} });
}
/**
* Register a document symbol provider (used by e.g. outline).
*/
function registerDocumentSymbolProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).documentSymbolProvider.register(languageSelector, provider);
}
/**
* Register a document highlight provider (used by e.g. highlight occurrences).
*/
function registerDocumentHighlightProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).documentHighlightProvider.register(languageSelector, provider);
}
/**
* Register an linked editing range provider.
*/
function registerLinkedEditingRangeProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).linkedEditingRangeProvider.register(languageSelector, provider);
}
/**
* Register a definition provider (used by e.g. go to definition).
*/
function registerDefinitionProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).definitionProvider.register(languageSelector, provider);
}
/**
* Register a implementation provider (used by e.g. go to implementation).
*/
function registerImplementationProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).implementationProvider.register(languageSelector, provider);
}
/**
* Register a type definition provider (used by e.g. go to type definition).
*/
function registerTypeDefinitionProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).typeDefinitionProvider.register(languageSelector, provider);
}
/**
* Register a code lens provider (used by e.g. inline code lenses).
*/
function registerCodeLensProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).codeLensProvider.register(languageSelector, provider);
}
/**
* Register a code action provider (used by e.g. quick fix).
*/
function registerCodeActionProvider(languageSelector, provider, metadata) {
	return StandaloneServices.get(ILanguageFeaturesService).codeActionProvider.register(languageSelector, {
		providedCodeActionKinds: metadata?.providedCodeActionKinds,
		documentation: metadata?.documentation,
		provideCodeActions: (model, range, context, token) => {
			const markers = StandaloneServices.get(IMarkerService).read({ resource: model.uri }).filter((m) => {
				return Range$1.areIntersectingOrTouching(m, range);
			});
			return provider.provideCodeActions(model, range, {
				markers,
				only: context.only,
				trigger: context.trigger
			}, token);
		},
		resolveCodeAction: provider.resolveCodeAction
	});
}
/**
* Register a formatter that can handle only entire models.
*/
function registerDocumentFormattingEditProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).documentFormattingEditProvider.register(languageSelector, provider);
}
/**
* Register a formatter that can handle a range inside a model.
*/
function registerDocumentRangeFormattingEditProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).documentRangeFormattingEditProvider.register(languageSelector, provider);
}
/**
* Register a formatter than can do formatting as the user types.
*/
function registerOnTypeFormattingEditProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).onTypeFormattingEditProvider.register(languageSelector, provider);
}
/**
* Register a link provider that can find links in text.
*/
function registerLinkProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).linkProvider.register(languageSelector, provider);
}
/**
* Register a completion item provider (use by e.g. suggestions).
*/
function registerCompletionItemProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).completionProvider.register(languageSelector, provider);
}
/**
* Register a document color provider (used by Color Picker, Color Decorator).
*/
function registerColorProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).colorProvider.register(languageSelector, provider);
}
/**
* Register a folding range provider
*/
function registerFoldingRangeProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).foldingRangeProvider.register(languageSelector, provider);
}
/**
* Register a declaration provider
*/
function registerDeclarationProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).declarationProvider.register(languageSelector, provider);
}
/**
* Register a selection range provider
*/
function registerSelectionRangeProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).selectionRangeProvider.register(languageSelector, provider);
}
/**
* Register a document semantic tokens provider. A semantic tokens provider will complement and enhance a
* simple top-down tokenizer. Simple top-down tokenizers can be set either via `setMonarchTokensProvider`
* or `setTokensProvider`.
*
* For the best user experience, register both a semantic tokens provider and a top-down tokenizer.
*/
function registerDocumentSemanticTokensProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).documentSemanticTokensProvider.register(languageSelector, provider);
}
/**
* Register a document range semantic tokens provider. A semantic tokens provider will complement and enhance a
* simple top-down tokenizer. Simple top-down tokenizers can be set either via `setMonarchTokensProvider`
* or `setTokensProvider`.
*
* For the best user experience, register both a semantic tokens provider and a top-down tokenizer.
*/
function registerDocumentRangeSemanticTokensProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).documentRangeSemanticTokensProvider.register(languageSelector, provider);
}
/**
* Register an inline completions provider.
*/
function registerInlineCompletionsProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).inlineCompletionsProvider.register(languageSelector, provider);
}
function registerInlineEditProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).inlineEditProvider.register(languageSelector, provider);
}
/**
* Register an inlay hints provider.
*/
function registerInlayHintsProvider(languageSelector, provider) {
	return StandaloneServices.get(ILanguageFeaturesService).inlayHintsProvider.register(languageSelector, provider);
}
/**
* @internal
*/
function createMonacoLanguagesAPI() {
	return {
		register,
		getLanguages,
		onLanguage,
		onLanguageEncountered,
		getEncodedLanguageId,
		setLanguageConfiguration,
		setColorMap,
		registerTokensProviderFactory,
		setTokensProvider,
		setMonarchTokensProvider,
		registerReferenceProvider,
		registerRenameProvider,
		registerNewSymbolNameProvider,
		registerCompletionItemProvider,
		registerSignatureHelpProvider,
		registerHoverProvider,
		registerDocumentSymbolProvider,
		registerDocumentHighlightProvider,
		registerLinkedEditingRangeProvider,
		registerDefinitionProvider,
		registerImplementationProvider,
		registerTypeDefinitionProvider,
		registerCodeLensProvider,
		registerCodeActionProvider,
		registerDocumentFormattingEditProvider,
		registerDocumentRangeFormattingEditProvider,
		registerOnTypeFormattingEditProvider,
		registerLinkProvider,
		registerColorProvider,
		registerFoldingRangeProvider,
		registerDeclarationProvider,
		registerSelectionRangeProvider,
		registerDocumentSemanticTokensProvider,
		registerDocumentRangeSemanticTokensProvider,
		registerInlineCompletionsProvider,
		registerInlineEditProvider,
		registerInlayHintsProvider,
		DocumentHighlightKind,
		CompletionItemKind,
		CompletionItemTag,
		CompletionItemInsertTextRule,
		SymbolKind,
		SymbolTag,
		IndentAction,
		CompletionTriggerKind,
		SignatureHelpTriggerKind,
		InlayHintKind,
		InlineCompletionTriggerKind,
		InlineEditTriggerKind,
		CodeActionTriggerType,
		NewSymbolNameTag,
		NewSymbolNameTriggerKind,
		PartialAcceptTriggerKind,
		HoverVerbosityAction,
		FoldingRangeKind,
		SelectedSuggestionInfo
	};
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/editor.api.js
var editor_api_exports = /* @__PURE__ */ __export({
	CancellationTokenSource: () => CancellationTokenSource,
	Emitter: () => Emitter,
	KeyCode: () => KeyCode,
	KeyMod: () => KeyMod,
	MarkerSeverity: () => MarkerSeverity,
	MarkerTag: () => MarkerTag,
	Position: () => Position,
	Range: () => Range,
	Selection: () => Selection,
	SelectionDirection: () => SelectionDirection,
	Token: () => Token,
	Uri: () => Uri,
	editor: () => editor,
	languages: () => languages
});
EditorOptions.wrappingIndent.defaultValue = 0;
EditorOptions.glyphMargin.defaultValue = false;
EditorOptions.autoIndent.defaultValue = 3;
EditorOptions.overviewRulerLanes.defaultValue = 2;
FormattingConflicts.setFormatterSelector((formatter, document$1, mode) => Promise.resolve(formatter[0]));
var api = createMonacoBaseAPI();
api.editor = createMonacoEditorAPI();
api.languages = createMonacoLanguagesAPI();
const CancellationTokenSource = api.CancellationTokenSource;
const Emitter = api.Emitter;
const KeyCode = api.KeyCode;
const KeyMod = api.KeyMod;
const Position = api.Position;
const Range = api.Range;
const Selection = api.Selection;
const SelectionDirection = api.SelectionDirection;
const MarkerSeverity = api.MarkerSeverity;
const MarkerTag = api.MarkerTag;
const Uri = api.Uri;
const Token = api.Token;
const editor = api.editor;
const languages = api.languages;
if (globalThis.MonacoEnvironment?.globalAPI || typeof define === "function" && define.amd) globalThis.monaco = api;
if (typeof globalThis.require !== "undefined" && typeof globalThis.require.config === "function") globalThis.require.config({ ignoreDuplicateModules: [
	"vscode-languageserver-types",
	"vscode-languageserver-types/main",
	"vscode-languageserver-textdocument",
	"vscode-languageserver-textdocument/main",
	"vscode-nls",
	"vscode-nls/vscode-nls",
	"jsonc-parser",
	"jsonc-parser/main",
	"vscode-uri",
	"vscode-uri/index",
	"vs/basic-languages/typescript/typescript"
] });

//#endregion
export { CancellationTokenSource, Emitter, Extensions$3 as Extensions, HC_BLACK_THEME_NAME, HC_LIGHT_THEME_NAME, IStandaloneThemeService, KeyCode, KeyMod, MarkerSeverity, MarkerTag, Position, Range, Selection, SelectionDirection, Token, Uri, VS_DARK_THEME_NAME, VS_LIGHT_THEME_NAME, editor, editor_api_exports, languages };
//# sourceMappingURL=editor.api-DrIbOK3t.js.map