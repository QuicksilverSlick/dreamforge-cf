import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type FormEvent,
	type ReactElement,
} from 'react';
import { ArrowRight } from 'react-feather';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router';
import { MonacoEditor } from '../../components/monaco-editor/monaco-editor.lazy';
import { useAuth } from '@/contexts/auth-context';
import { CollaborationBar } from './components/collaboration-bar';
import { TakeoverConsentModal } from './components/takeover-consent-modal';
import { AnimatePresence, motion } from 'framer-motion';
import { Expand, Github, LoaderCircle, RefreshCw, Save } from 'lucide-react';
import { Blueprint } from './components/blueprint';
import { FileExplorer } from './components/file-explorer';
import { UserMessage, AIMessage } from './components/messages';
import { PhaseTimeline } from './components/phase-timeline';
import { PreviewIframe } from './components/preview-iframe';
import { ViewModeSwitch } from './components/view-mode-switch';
import { DebugPanel, type DebugMessage } from './components/debug-panel';
import { DeploymentControls } from './components/deployment-controls';
import { DatabaseRestoreControl } from './components/database-restore-control';
import { useChat, type FileType } from './hooks/use-chat';
import { type ModelConfigsData, type BlueprintType, type AttachmentRef, SUPPORTED_IMAGE_MIME_TYPES } from '@/api-types';
import { Copy } from './components/copy';
import { useFileContentStream } from './hooks/use-file-content-stream';
import { logger } from '@/utils/logger';
import { useApp } from '@/hooks/use-app';
import { AgentModeDisplay } from '@/components/agent-mode-display';
import { useGitHubExport } from '@/hooks/use-github-export';
import { GitHubExportModal } from '@/components/github-export-modal';
import { ModelConfigInfo } from './components/model-config-info';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useAttachmentUpload } from '@/hooks/use-attachment-upload';
import { useDragDrop } from '@/hooks/use-drag-drop';
import { ImageAttachmentPreview } from '@/components/image-attachment-preview';
import { UnifiedAttachButton, AttachmentChips } from '@/components/attachment-picker';
import { createAIMessage } from './utils/message-helpers';
import { useLimitsContext } from '@/contexts/limits-context';
import { useBillingContext } from '@/contexts/billing-context';
import { SparksUpgradeDialog } from '@/components/billing/sparks-upgrade-dialog';
import { CreditsBanner } from '@/components/credits-banner';
import { checkCanSendPrompt, getBackendLimitDialog } from '@/utils/usage-limit-checker';
import { startCloudflareConnect } from '@/utils/cloudflare-connect';
import { Button } from '@/components/ui/button';

export default function Chat() {
	const { chatId: urlChatId } = useParams();

	const [searchParams] = useSearchParams();
	const location = useLocation();
	const userQuery = searchParams.get('query');
	const agentMode = searchParams.get('agentMode') || 'deterministic';

	// Only auto-start a brand-new session when it originated from in-app
	// navigation (home prompt box and interview finish set `fromPrompt` in
	// router state). A cold external load of /chat/new?query= requires an
	// explicit confirmation instead, since the query seeds the agent's system
	// prompt and the build debits Sparks (CSRF-flavored link crafting).
	const startedFromInApp =
		(location.state as { fromPrompt?: boolean } | null)?.fromPrompt === true;
	const autoStart = urlChatId !== 'new' || startedFromInApp;

	// Extract images from URL params if present
	const userImages = useMemo(() => {
		const imagesParam = searchParams.get('images');
		if (!imagesParam) return undefined;
		try {
			return JSON.parse(decodeURIComponent(imagesParam));
		} catch (error) {
			console.error('Failed to parse images from URL:', error);
			return undefined;
		}
	}, [searchParams]);

	// Extract already-uploaded attachment refs from URL params if present.
	const userAttachments = useMemo(() => {
		const param = searchParams.get('attachments');
		if (!param) return undefined;
		try {
			return JSON.parse(decodeURIComponent(param)) as AttachmentRef[];
		} catch (error) {
			console.error('Failed to parse attachments from URL:', error);
			return undefined;
		}
	}, [searchParams]);

	// Load existing app data if chatId is provided
	const { app, loading: appLoading } = useApp(urlChatId);

	// If we have an existing app, use its data
	const displayQuery = app ? app.originalPrompt || app.title : userQuery || '';
	const appTitle = app?.title;

	// Manual refresh trigger for preview
	const [manualRefreshTrigger, setManualRefreshTrigger] = useState(0);

	// Debug message utilities
	const addDebugMessage = useCallback(
		(
			type: DebugMessage['type'],
			message: string,
			details?: string,
			source?: string,
			messageType?: string,
			rawMessage?: unknown,
		) => {
			const debugMessage: DebugMessage = {
				id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
				timestamp: Date.now(),
				type,
				message,
				details,
				source,
				messageType,
				rawMessage,
			};

			// Cap retained debug messages: a long build emits thousands of WS
			// events and unbounded growth balloons memory and render cost.
			setDebugMessages((prev) => [...prev, debugMessage].slice(-500));
		},
		[],
	);

	const clearDebugMessages = useCallback(() => {
		setDebugMessages([]);
	}, []);

	const {
		messages,
		edit,
		bootstrapFiles,
		chatId,
		query,
		files,
		isGeneratingBlueprint,
		isBootstrapping,
		totalFiles,
		websocket,
		sendUserMessage,
		sendAiMessage,
		blueprint,
		previewUrl,
		clearEdit,
		projectStages,
		phaseTimeline,
		isThinking,
		onCompleteBootstrap,
		// Deployment and generation control
		isDeploying,
		cloudflareDeploymentUrl,
		deploymentError,
		isRedeployReady,
		isGenerationPaused,
		isGenerating,
		handleStopGeneration,
		handleResumeGeneration,
		handleDeployToCloudflare,
		// Preview refresh control
		shouldRefreshPreview,
		// Preview deployment state
		isPreviewDeploying,
		// Image generation progress
		imageGeneration,
		// Org collaboration: presence + single-driver seat
		presenceMembers,
		currentDriverId,
		drivingBlockedBy,
		setDrivingBlockedBy,
		claimDriving,
		releaseDriving,
		// Consent-gated takeover
		takeoverRequest,
		takeoverStatus,
		operatorHoldsGrant,
		respondToTakeover,
		dismissTakeoverStatus,
		// In-editor code editing
		saveFileEdit,
		// CF-OAuth: free build tier exhausted at creation
		creationLimitExceeded,
		clearCreationLimit,
		// Externally-sourced session start gate
		awaitingStartConfirmation,
		confirmStart,
	} = useChat({
		chatId: urlChatId,
		query: userQuery,
		images: userImages,
		attachments: userAttachments,
		agentMode: agentMode as 'deterministic' | 'smart',
		interviewSessionId: searchParams.get('interviewSession'),
		autoStart,
		onDebugMessage: addDebugMessage,
	});

	// Org collaboration: who am I, and the single-driver state for this session.
	const { user } = useAuth();
	const isViewerDriving = !!currentDriverId && currentDriverId === user?.id;
	const isReadOnlyViewer = !!currentDriverId && currentDriverId !== user?.id;
	const currentDriverName =
		presenceMembers.find((m) => m.isDriver)?.displayName ?? 'Another member';
	// While impersonating, the effective user IS the target, so user.displayName is
	// the impersonated user's name — used to reframe the take-over copy.
	const impersonatingAs = user?.impersonatedBy
		? (user.displayName ?? user.email ?? 'this user')
		: null;

	// GitHub export functionality - use urlChatId directly from URL params
	const githubExport = useGitHubExport(websocket, urlChatId);

	const navigate = useNavigate();

	const [activeFilePath, setActiveFilePath] = useState<string>();
	const [view, setView] = useState<'editor' | 'preview' | 'blueprint' | 'terminal'>(
		'editor',
	);

	// Terminal state
	// const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);

	// Debug panel state
	const [debugMessages, setDebugMessages] = useState<DebugMessage[]>([]);
	const deploymentControlsRef = useRef<HTMLDivElement>(null);

	// Model config info state
	const [modelConfigs, setModelConfigs] = useState<{
		agents: Array<{ key: string; name: string; description: string; }>;
		userConfigs: ModelConfigsData['configs'];
		defaultConfigs: ModelConfigsData['defaults'];
	} | undefined>();
	const [loadingConfigs, setLoadingConfigs] = useState(false);

	// Handler for model config info requests
	const handleRequestConfigs = useCallback(() => {
		if (!websocket) return;

		setLoadingConfigs(true);
		websocket.send(JSON.stringify({
			type: 'get_model_configs'
		}));
	}, [websocket]);

	// Listen for model config info WebSocket messages
	useEffect(() => {
		if (!websocket) return;

		const handleMessage = (event: MessageEvent) => {
			try {
				const message = JSON.parse(event.data);
				if (message.type === 'model_configs_info') {
					setModelConfigs(message.configs);
					setLoadingConfigs(false);
				}
			} catch (error) {
				logger.error('Error parsing WebSocket message for model configs:', error);
			}
		};

		websocket.addEventListener('message', handleMessage);

		return () => {
			websocket.removeEventListener('message', handleMessage);
		};
	}, [websocket]);

	const hasSeenPreview = useRef(false);
	const hasSwitchedFile = useRef(false);
	// const wasChatDisabled = useRef(true);
	// const hasShownWelcome = useRef(false);

	const editorRef = useRef<HTMLDivElement>(null);
	const previewRef = useRef<HTMLIFrameElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	const [newMessage, setNewMessage] = useState('');
	const [showTooltip, setShowTooltip] = useState(false);

	// CF-OAuth usage gating. Inert unless ENABLE_CLOUDFLARE_LIMITS is on — with the
	// flag off the backend reports cloudflareConnectEnabled:false and unlimited
	// usage, so the pre-send check never blocks and the banner never renders.
	const { data: limitsData, loading: limitsLoading } = useLimitsContext();
	const [limitDialog, setLimitDialog] = useState<ReactElement | null>(null);
	// Sparks metering (billing spec §7.4): when live, the out-of-Sparks upgrade
	// dialog replaces every legacy connect-Cloudflare surface below.
	const { data: billingData } = useBillingContext();
	const [sparksDialogOpen, setSparksDialogOpen] = useState(false);

	// Agent creation was blocked by the free-tier gate (429). Surface the
	// connect/configure dialog from our own limitsData (getBackendLimitDialog
	// returns no dialog for a connected user who merely hit the per-day cap, so it
	// self-distinguishes). Gated on the flag → inert until ENABLE_CLOUDFLARE_LIMITS.
	useEffect(() => {
		if (!creationLimitExceeded) return;
		if (billingData?.meteringEnabled) {
			// Platform billing: the 429 means the Spark debit failed — upsell.
			setSparksDialogOpen(true);
		} else if (limitsData?.cloudflareConnectEnabled) {
			const { dialogComponent } = getBackendLimitDialog(
				limitsData,
				() => startCloudflareConnect(),
				() => setLimitDialog(null),
			);
			setLimitDialog(dialogComponent ?? null);
		}
		clearCreationLimit();
	}, [creationLimitExceeded, limitsData, billingData, clearCreationLimit]);
	
	// Word count utilities
	const MAX_WORDS = 4000;
	const countWords = (text: string): number => {
		return text.trim().split(/\s+/).filter(word => word.length > 0).length;
	};

	const { images, addImages, removeImage, clearImages, isProcessing } = useImageUpload({
		onError: (error) => {
			console.error('Chat image upload error:', error);
		},
	});
	const {
		attachments,
		addFiles,
		removeAttachment,
		clearAttachments,
		isUploading: isUploadingAttachments,
	} = useAttachmentUpload();

	// Fake stream bootstrap files
	const { streamedFiles: streamedBootstrapFiles, doneStreaming } =
		useFileContentStream(bootstrapFiles, {
			tps: 600,
			enabled: isBootstrapping,
		});

	const handleFileClick = useCallback((file: FileType) => {
		logger.debug('handleFileClick()', file);
		clearEdit();
		setActiveFilePath(file.filePath);
		setView('editor');
		if (!hasSwitchedFile.current) {
			hasSwitchedFile.current = true;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleViewModeChange = useCallback((mode: 'preview' | 'editor' | 'blueprint') => {
		setView(mode);
	}, []);

	// // Terminal functions
	// const handleTerminalCommand = useCallback((command: string) => {
	// 	if (websocket && websocket.readyState === WebSocket.OPEN) {
	// 		// Add command to terminal logs
	// 		const commandLog: TerminalLog = {
	// 			id: `cmd-${Date.now()}`,
	// 			content: command,
	// 			type: 'command',
	// 			timestamp: Date.now()
	// 		};
	// 		setTerminalLogs(prev => [...prev, commandLog]);

	// 		// Send command via WebSocket
	// 		websocket.send(JSON.stringify({
	// 			type: 'terminal_command',
	// 			command,
	// 			timestamp: Date.now()
	// 		}));
	// 	}
	// }, [websocket, setTerminalLogs]);

	const generatingCount = useMemo(
		() =>
			files.reduce(
				(count, file) => (file.isGenerating ? count + 1 : count),
				0,
			),
		[files],
	);

	const codeGenState = useMemo(() => {
		return projectStages.find((stage) => stage.id === 'code')?.status;
	}, [projectStages]);

	const generatingFile = useMemo(() => {
		// code gen status should be active
		if (codeGenState === 'active') {
			for (let i = files.length - 1; i >= 0; i--) {
				if (files[i].isGenerating) return files[i];
			}
		}
		return undefined;
	}, [files, codeGenState]);

	const activeFile = useMemo(() => {
		if (!hasSwitchedFile.current && generatingFile) {
			return generatingFile;
		}
		if (!hasSwitchedFile.current && isBootstrapping) {
			return streamedBootstrapFiles.find(
				(file) => file.filePath === activeFilePath,
			);
		}
		return (
			files.find((file) => file.filePath === activeFilePath) ??
			streamedBootstrapFiles.find(
				(file) => file.filePath === activeFilePath,
			)
		);
	}, [
		activeFilePath,
		generatingFile,
		files,
		streamedBootstrapFiles,
		isBootstrapping,
	]);

	// In-editor code editing: per-file buffer of unsaved manual edits (path → contents).
	const [unsavedEdits, setUnsavedEdits] = useState<Record<string, string>>({});

	// A file is user-editable only if it's an already-GENERATED file (not a
	// template/bootstrap one), this viewer holds the driver seat, and nothing is
	// generating. Saving is otherwise gated server-side too (USER_EDIT_FILE is a
	// driving command), so this is the UI affordance, not the security boundary.
	const isActiveFileGenerated =
		!!activeFilePath && files.some((f) => f.filePath === activeFilePath);
	const canEditCode =
		isActiveFileGenerated && isViewerDriving && !isGenerating && !activeFile?.isGenerating;
	const isActiveFileDirty = !!activeFilePath && unsavedEdits[activeFilePath] !== undefined;
	const editorValue =
		(activeFilePath && unsavedEdits[activeFilePath] !== undefined
			? unsavedEdits[activeFilePath]
			: activeFile?.fileContents) || '';

	const handleEditorChange = useCallback(
		(contents: string) => {
			if (!canEditCode || !activeFilePath) return;
			const saved = activeFile?.fileContents ?? '';
			setUnsavedEdits((prev) => {
				if (contents === saved) {
					if (prev[activeFilePath] === undefined) return prev;
					const next = { ...prev };
					delete next[activeFilePath];
					return next;
				}
				if (prev[activeFilePath] === contents) return prev;
				return { ...prev, [activeFilePath]: contents };
			});
		},
		[canEditCode, activeFilePath, activeFile?.fileContents],
	);

	const handleSaveEdit = useCallback(() => {
		if (!activeFilePath || unsavedEdits[activeFilePath] === undefined) return;
		saveFileEdit(activeFilePath, unsavedEdits[activeFilePath]);
	}, [activeFilePath, unsavedEdits, saveFileEdit]);

	// Reconcile the buffer when `files` updates (notably the save echo): drop any
	// buffer whose contents now match the saved file (no longer dirty).
	useEffect(() => {
		setUnsavedEdits((prev) => {
			let changed = false;
			const next = { ...prev };
			for (const f of files) {
				if (next[f.filePath] !== undefined && next[f.filePath] === f.fileContents) {
					delete next[f.filePath];
					changed = true;
				}
			}
			return changed ? next : prev;
		});
	}, [files]);

	const isPhase1Complete = useMemo(() => {
		return phaseTimeline.length > 0 && phaseTimeline[0].status === 'completed';
	}, [phaseTimeline]);

	const isGitHubExportReady = useMemo(() => {
		return isPhase1Complete && !!urlChatId;
	}, [isPhase1Complete, urlChatId]);

	const showMainView = useMemo(
		() =>
			streamedBootstrapFiles.length > 0 ||
			!!blueprint ||
			files.length > 0,
		[streamedBootstrapFiles, blueprint, files.length],
	);

	const [mainMessage, ...otherMessages] = useMemo(() => messages, [messages]);

	const { scrollToBottom } = useAutoScroll(messagesContainerRef, { behavior: 'smooth', watch: [messages] });

	const prevMessagesLengthRef = useRef(0);

	useEffect(() => {
		// Force scroll when a new message is appended (length increase)
		if (messages.length > prevMessagesLengthRef.current) {
			requestAnimationFrame(() => scrollToBottom());
		}
		prevMessagesLengthRef.current = messages.length;
	}, [messages.length, scrollToBottom]);

	useEffect(() => {
		if (previewUrl && !hasSeenPreview.current && isPhase1Complete) {
			setView('preview');
			setShowTooltip(true);
			setTimeout(() => {
				setShowTooltip(false);
			}, 3000); // Auto-hide tooltip after 3 seconds
		}
	}, [previewUrl, isPhase1Complete]);

	useEffect(() => {
		if (chatId) {
			navigate(`/chat/${chatId}`, {
				replace: true,
			});
		}
	}, [chatId, navigate]);

	useEffect(() => {
		if (!edit) return;
		if (files.some((file) => file.filePath === edit.filePath)) {
			setActiveFilePath(edit.filePath);
			setView('editor');
		}
	}, [edit, files]);

	useEffect(() => {
		if (
			isBootstrapping &&
			streamedBootstrapFiles.length > 0 &&
			!hasSwitchedFile.current
		) {
			setActiveFilePath(streamedBootstrapFiles.at(-1)!.filePath);
		} else if (
			view === 'editor' &&
			!activeFile &&
			files.length > 0 &&
			!hasSwitchedFile.current
		) {
			setActiveFilePath(files.at(-1)!.filePath);
		}
	}, [view, activeFile, files, isBootstrapping, streamedBootstrapFiles]);

	useEffect(() => {
		if (view !== 'blueprint' && isGeneratingBlueprint) {
			setView('blueprint');
		} else if (
			!hasSwitchedFile.current &&
			view === 'blueprint' &&
			!isGeneratingBlueprint
		) {
			setView('editor');
		}
	}, [isGeneratingBlueprint, view]);

	useEffect(() => {
		if (doneStreaming && !isGeneratingBlueprint && !blueprint) {
			onCompleteBootstrap();
			sendAiMessage(
				createAIMessage(
					'creating-blueprint',
					'Bootstrapping complete, now creating a blueprint for you...',
					true,
				),
			);
		}
	}, [
		doneStreaming,
		isGeneratingBlueprint,
		sendAiMessage,
		blueprint,
		onCompleteBootstrap,
	]);

	const isRunning = useMemo(() => {
		return (
			isBootstrapping || isGeneratingBlueprint // || codeGenState === 'active'
		);
	}, [isBootstrapping, isGeneratingBlueprint]);

	// Check if chat input should be disabled (before blueprint completion and agentId assignment)
	const isChatDisabled = useMemo(() => {
		const blueprintStage = projectStages.find(
			(stage) => stage.id === 'blueprint',
		);
		const isBlueprintComplete = blueprintStage?.status === 'completed';
		const hasAgentId = !!chatId;

		// Disable until both blueprint is complete AND we have an agentId
		return !isBlueprintComplete || !hasAgentId;
	}, [projectStages, chatId]);

	const chatFormRef = useRef<HTMLFormElement>(null);
	const { isDragging: isChatDragging, dragHandlers: chatDragHandlers } = useDragDrop({
		onFilesDropped: addImages,
		accept: [...SUPPORTED_IMAGE_MIME_TYPES],
		disabled: isChatDisabled,
	});

	const onNewMessage = useCallback(
		(e: FormEvent) => {
			e.preventDefault();

			// Don't submit if chat is disabled or message is empty
			if (isChatDisabled || !newMessage.trim()) {
				return;
			}

			// Single-driver (soft): if another member is driving, surface the take-over
			// prompt instead of sending — the server would soft-block it anyway.
			if (isReadOnlyViewer) {
				setDrivingBlockedBy(currentDriverName);
				return;
			}

			// CF-OAuth: once the free tier is exhausted, surface the connect/configure
			// dialog instead of sending. No-op until ENABLE_CLOUDFLARE_LIMITS is on
			// (cloudflareConnectEnabled gates it; the backend also reports within-limits).
			// Under Sparks metering the server-side atomic debit is the gate; the
			// WS USAGE_LIMIT_EXCEEDED error surfaces the block. The legacy
			// client-side CF gate only runs on BYO-era deployments.
			if (!billingData?.meteringEnabled && limitsData?.cloudflareConnectEnabled) {
				const check = checkCanSendPrompt(
					limitsData,
					limitsLoading,
					() => startCloudflareConnect(),
					() => setLimitDialog(null),
				);
				if (!check.canProceed) {
					setLimitDialog(check.dialogComponent ?? null);
					return;
				}
			}

			// When generation is active, send as conversational AI suggestion.
			// The server debits the 30-Spark edit on receipt — nudge the balance
			// badge shortly after so the drain is visible without a refresh.
			window.setTimeout(() => window.dispatchEvent(new Event('billing-updated')), 2000);
			const attachmentRefs: AttachmentRef[] = attachments.map((a) => ({
				id: a.id,
				filename: a.filename,
				kind: a.kind,
				extractedKey: a.extractedKey,
			}));
			websocket?.send(
				JSON.stringify({
					type: 'user_suggestion',
					message: newMessage,
					images: images.length > 0 ? images : undefined,
					attachments: attachmentRefs.length > 0 ? attachmentRefs : undefined,
				}),
			);
			sendUserMessage(newMessage);
			setNewMessage('');
			// Clear images/attachments after sending
			if (images.length > 0) {
				clearImages();
			}
			if (attachments.length > 0) {
				clearAttachments();
			}
			// Ensure we scroll after sending our own message
			requestAnimationFrame(() => scrollToBottom());
		},
		[newMessage, websocket, sendUserMessage, isChatDisabled, scrollToBottom, images, clearImages, attachments, clearAttachments, isReadOnlyViewer, currentDriverName, setDrivingBlockedBy, limitsData, limitsLoading, billingData?.meteringEnabled],
	);

	const [progress, total] = useMemo((): [number, number] => {
		// Calculate phase progress instead of file progress
		const completedPhases = phaseTimeline.filter(p => p.status === 'completed').length;

		// Get predicted phase count from blueprint, fallback to current phase count
		const predictedPhaseCount = blueprint?.implementationRoadmap?.length || 0;
		const totalPhases = Math.max(predictedPhaseCount, phaseTimeline.length, 1);

		return [completedPhases, totalPhases];
	}, [phaseTimeline, blueprint?.implementationRoadmap]);

	if (import.meta.env.DEV) {
		logger.debug({
			messages,
			files,
			blueprint,
			query,
			userQuery,
			chatId,
			previewUrl,
			generatingFile,
			activeFile,
			bootstrapFiles,
			streamedBootstrapFiles,
			isGeneratingBlueprint,
			view,
			totalFiles,
			generatingCount,
			isBootstrapping,
			activeFilePath,
			progress,
			total,
			isRunning,
			projectStages,
		});
	}

	if (awaitingStartConfirmation) {
		return (
			<div className="size-full flex items-center justify-center p-6 text-text-primary">
				<div className="max-w-lg w-full flex flex-col gap-4 rounded-xl border border-border-primary bg-bg-2 p-6">
					<h1 className="text-lg font-medium">Start building this app?</h1>
					<p className="text-sm text-text-secondary">
						This link wants to start a new project with the prompt
						below. It will use your account and your Sparks — review
						it before continuing.
					</p>
					<div className="rounded-lg border border-border-primary bg-bg-3 p-4 max-h-64 overflow-y-auto">
						<p className="text-sm text-text-primary whitespace-pre-wrap break-words">
							{displayQuery}
						</p>
					</div>
					<div className="flex items-center justify-end gap-2">
						<Button variant="outline" onClick={() => navigate('/')}>
							Cancel
						</Button>
						<Button onClick={confirmStart}>Start building</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="size-full flex flex-col min-h-0 text-text-primary">
			<div className="flex-1 flex min-h-0 overflow-hidden justify-center">
				<motion.div
					layout="position"
					className="flex-1 shrink-0 flex flex-col basis-0 max-w-lg relative z-10 h-full min-h-0"
				>
					<div className="flex-1 overflow-y-auto min-h-0 chat-messages-scroll" ref={messagesContainerRef}>
						<div className="pt-5 px-4 pb-4 text-sm flex flex-col gap-5">
							{appLoading ? (
								<div className="flex items-center gap-2 text-text-tertiary">
									<LoaderCircle className="size-4 animate-spin" />
									Loading app...
								</div>
							) : (
								<>
									{appTitle && (
										<div className="text-lg font-semibold mb-2">
											{appTitle}
										</div>
									)}
									<UserMessage
										message={query ?? displayQuery}
									/>
									{import.meta.env
										.VITE_AGENT_MODE_ENABLED && (
										<div className="flex justify-between items-center py-2 border-b border-border-primary/50 mb-4">
											<AgentModeDisplay
												mode={
													agentMode as
														| 'deterministic'
														| 'smart'
												}
											/>
										</div>
									)}
								</>
							)}

							{mainMessage && (
								<AIMessage
									message={mainMessage.content}
									isThinking={mainMessage.ui?.isThinking}
									toolEvents={mainMessage.ui?.toolEvents}
									activityLines={mainMessage.ui?.activityLines}
								/>
							)}

							<PhaseTimeline
								projectStages={projectStages}
								phaseTimeline={phaseTimeline}
								files={files}
								view={view}
								activeFile={activeFile}
								onFileClick={handleFileClick}
								isThinkingNext={isThinking}
								isPreviewDeploying={isPreviewDeploying}
								imageGeneration={imageGeneration}
								progress={progress}
								total={total}
								parentScrollRef={messagesContainerRef}
								onViewChange={(viewMode) => {
									setView(viewMode);
									hasSwitchedFile.current = true;
								}}
								chatId={chatId}
								isDeploying={isDeploying}
								handleDeployToCloudflare={handleDeployToCloudflare}
							/>

							{/* Deployment and Generation Controls */}
							{chatId && (
								<motion.div
									ref={deploymentControlsRef}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: 0.2 }}
									className="px-4 mb-6"
								>
									<DeploymentControls
										isPhase1Complete={isPhase1Complete}
										isDeploying={isDeploying}
										deploymentUrl={cloudflareDeploymentUrl}
										instanceId={chatId || ''}
										isRedeployReady={isRedeployReady}
										deploymentError={deploymentError}
										appId={app?.id || chatId}
										appVisibility={app?.visibility}
										isGenerating={
											isGenerating ||
											isGeneratingBlueprint
										}
										isPaused={isGenerationPaused}
										canDeploy={!isReadOnlyViewer}
										onDeploy={handleDeployToCloudflare}
										onStopGeneration={handleStopGeneration}
										onResumeGeneration={
											handleResumeGeneration
										}
										onVisibilityUpdate={(newVisibility) => {
											// Update app state if needed
											if (app) {
												app.visibility = newVisibility;
											}
										}}
									/>
									<DatabaseRestoreControl appId={app?.id || chatId} canRestore={!isReadOnlyViewer} />
								</motion.div>
							)}

							{otherMessages.map((message) => {
								if (message.role === 'assistant') {
									return (
										<AIMessage
											key={message.conversationId}
											message={message.content}
											isThinking={message.ui?.isThinking}
											toolEvents={message.ui?.toolEvents}
											activityLines={message.ui?.activityLines}
											suggestions={message.ui?.suggestions}
											imageConsent={message.ui?.imageConsent}
											onSuggestionAccept={(chip) => {
												// An accepted chip is a normal priced request:
												// the server's atomic debit is the gate (out of
												// Sparks => the standard limit popup comes back).
												websocket?.send(
													JSON.stringify({
														type: 'user_suggestion',
														message: chip.prompt,
													}),
												);
												sendUserMessage(chip.prompt);
											}}
											onImageConsent={(approved) => {
												websocket?.send(
													JSON.stringify({
														type: approved
															? 'approve_blueprint_images'
															: 'decline_blueprint_images',
													}),
												);
											}}
										/>
									);
								}
								return (
									<UserMessage
										key={message.conversationId}
										message={message.content}
									/>
								);
							})}
						</div>
					</div>

					<div className="shrink-0 px-4">
						<CollaborationBar
							members={presenceMembers}
							currentUserId={user?.id}
							isViewerDriving={isViewerDriving}
							isReadOnlyViewer={isReadOnlyViewer}
							drivingBlockedBy={drivingBlockedBy}
							impersonatingAs={impersonatingAs}
							onTakeOver={claimDriving}
							onRelease={releaseDriving}
							onDismissBlocked={() => setDrivingBlockedBy(null)}
						/>

						{/* Operator side: status of an in-flight takeover request. */}
						{takeoverStatus && (
							<div
								role="status"
								aria-live="polite"
								className="mb-2 flex items-center gap-2 rounded-lg border border-accent/30 bg-bg-3 px-3 py-2 text-xs text-text-primary/90"
							>
								<span className="flex-1">
									{takeoverStatus.kind === 'waiting'
										? 'Waiting for the user to allow your takeover…'
										: takeoverStatus.kind === 'denied'
											? 'The user denied your takeover request.'
											: 'No response — your takeover request timed out.'}
								</span>
								{takeoverStatus.kind !== 'waiting' && (
									<button
										type="button"
										onClick={dismissTakeoverStatus}
										className="text-text-primary/50 hover:text-text-primary"
									>
										Dismiss
									</button>
								)}
							</div>
						)}

						{/* Real user side: an operator is driving as you after you consented. */}
						{operatorHoldsGrant && (
							<div
								role="status"
								aria-live="polite"
								className="mb-2 flex items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-text-primary/90"
							>
								<span className="flex-1">An operator is making changes as you.</span>
								<button
									type="button"
									onClick={claimDriving}
									className="rounded-md border border-amber-500/50 px-2 py-1 font-medium hover:bg-amber-500/20"
								>
									Take back control
								</button>
							</div>
						)}
					</div>

					<TakeoverConsentModal request={takeoverRequest} onRespond={respondToTakeover} />

					{limitDialog}

					{billingData?.meteringEnabled && sparksDialogOpen && (
						<SparksUpgradeDialog
							billing={billingData}
							open={sparksDialogOpen}
							onClose={() => setSparksDialogOpen(false)}
							reason="You're out of Sparks for this build"
						/>
					)}

					{!billingData?.meteringEnabled && limitsData?.cloudflareConnectEnabled && (
						<CreditsBanner
							limitsData={limitsData}
							onConnectCloudflare={() => startCloudflareConnect()}
							className="mx-4 mb-1"
						/>
					)}

					<form
                        ref={chatFormRef}
                        onSubmit={onNewMessage}
                        className="shrink-0 p-4 pb-5 bg-transparent"
                        {...chatDragHandlers}
                    >
					<div className="relative">
						{isChatDragging && (
							<div className="absolute inset-0 flex items-center justify-center bg-accent/10 backdrop-blur-sm rounded-xl z-50 pointer-events-none">
								<p className="text-accent font-medium">Drop images here</p>
							</div>
						)}
						{images.length > 0 && (
							<div className="mb-2">
								<ImageAttachmentPreview
									images={images}
									onRemove={removeImage}
									compact
								/>
							</div>
						)}
						{attachments.length > 0 && (
							<AttachmentChips
								attachments={attachments}
								onRemove={removeAttachment}
								className="mb-2"
							/>
						)}
						<textarea
							value={newMessage}
							onChange={(e) => {
								const newValue = e.target.value;
								const newWordCount = countWords(newValue);
								
								// Only update if within word limit
								if (newWordCount <= MAX_WORDS) {
									setNewMessage(newValue);
									const ta = e.currentTarget;
									ta.style.height = 'auto';
									ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
								}
							}}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										if (!e.shiftKey) {
											// Submit on Enter without Shift
											e.preventDefault();
											onNewMessage(e);
										}
										// Shift+Enter will create a new line (default textarea behavior)
									}
								}}
								disabled={isChatDisabled}
								placeholder={
									isChatDisabled
										? 'Please wait for blueprint completion...'
										: isRunning
											? 'Chat with AI while generating...'
											: 'Ask a follow up...'
								}
								rows={1}
								className="w-full bg-bg-2 border border-text-primary/10 rounded-xl pl-11 pr-11 py-2 text-sm outline-none focus:border-white/20 drop-shadow-2xl text-text-primary placeholder:!text-text-primary/50 disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-y-auto no-scrollbar min-h-[36px] max-h-[120px]"
								style={{
									// Auto-resize based on content
									height: 'auto',
									minHeight: '36px'
								}}
								ref={(textarea) => {
									if (textarea) {
										// Auto-resize textarea based on content
										textarea.style.height = 'auto';
										textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
									}
								}}
							/>
							<div className="absolute left-1.5 bottom-2 flex items-center">
								<UnifiedAttachButton
									onImagesSelected={addImages}
									onFilesSelected={addFiles}
									disabled={isChatDisabled}
									busy={isProcessing || isUploadingAttachments}
									iconClassName="size-4"
								/>
							</div>
							<div className="absolute right-1.5 bottom-2.5 flex items-center">
								<button
									type="submit"
									disabled={!newMessage.trim() || isChatDisabled}
									className="p-1.5 rounded-md bg-accent/90 hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent text-text-inverted disabled:text-text-primary transition-colors"
								>
									<ArrowRight className="size-4" />
								</button>
							</div>
						</div>
					</form>
				</motion.div>

				<AnimatePresence>
					{showMainView && (
					<motion.div
						layout="position"
						className="flex-1 flex shrink-0 basis-0 p-4 pl-0 ml-2 z-30 min-h-0"
						initial={{ opacity: 0, scale: 0.84 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
					>
							{view === 'preview' && previewUrl && (
								<div className="flex-1 flex flex-col bg-bg-3 rounded-xl shadow-md shadow-bg-2 overflow-hidden border border-border-primary">
									<div className="grid grid-cols-3 px-2 h-10 border-b bg-bg-2">
										<div className="flex items-center">
											<ViewModeSwitch
												view={view}
												onChange={handleViewModeChange}
												previewAvailable={!!previewUrl}
												showTooltip={showTooltip}
											/>
										</div>

										<div className="flex items-center justify-center">
											<div className="flex items-center gap-2">
												<span className="text-sm font-mono text-text-50/70">
													{blueprint?.title ??
														'Preview'}
												</span>
												<Copy text={previewUrl} />
												<button
													className="p-1 hover:bg-bg-2 rounded transition-colors"
													onClick={() => {
														setManualRefreshTrigger(
															Date.now(),
														);
													}}
													title="Refresh preview"
												>
													<RefreshCw className="size-4 text-text-primary/50" />
												</button>
											</div>
										</div>

										<div className="flex items-center justify-end gap-1.5">
											{/* <button
												className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-md transition-all duration-200 text-xs font-medium shadow-sm"
												onClick={() => handleDeployToCloudflare(chatId!)}
												disabled={isDeploying}
												title="Save & Deploy"
											>
												{isDeploying ? (
													<LoaderCircle className="size-3 animate-spin" />
												) : (
													<Save className="size-3" />
												)}
												{isDeploying ? 'Deploying...' : 'Save'}
											</button> */}
											<ModelConfigInfo
												configs={modelConfigs}
												onRequestConfigs={handleRequestConfigs}
												loading={loadingConfigs}
											/>
											<button
												className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200 text-xs font-medium shadow-sm ${
													isGitHubExportReady
														? 'bg-gray-800 hover:bg-gray-900 text-white'
														: 'bg-gray-600 text-gray-400 cursor-not-allowed'
												}`}
												onClick={isGitHubExportReady ? githubExport.openModal : undefined}
												disabled={!isGitHubExportReady}
												title={
													isGitHubExportReady
														? "Export to GitHub"
														: !isPhase1Complete
															? "Complete Phase 1 to enable GitHub export"
															: "Waiting for chat session to initialize..."
												}
												aria-label={
													isGitHubExportReady
														? "Export to GitHub"
														: !isPhase1Complete
															? "GitHub export disabled - complete Phase 1 first"
															: "GitHub export disabled - waiting for chat session"
												}
											>
												<Github className="size-3" />
												GitHub
											</button>
											<button
												className="p-1 hover:bg-bg-2 rounded transition-colors"
												onClick={() => {
													previewRef.current?.requestFullscreen();
												}}
												title="Fullscreen"
											>
												<Expand className="size-4 text-text-primary/50" />
											</button>
										</div>
									</div>
									<PreviewIframe
										src={previewUrl}
										ref={previewRef}
										className="flex-1 w-full h-full border-0"
										title="Preview"
										shouldRefreshPreview={
											shouldRefreshPreview
										}
										manualRefreshTrigger={
											manualRefreshTrigger
										}
										webSocket={websocket}
									/>
								</div>
							)}

							{view === 'blueprint' && (
								<div className="flex-1 flex flex-col bg-bg-3 rounded-xl shadow-md shadow-bg-2 overflow-hidden border border-border-primary">
									{/* Toolbar */}
									<div className="flex items-center justify-center px-2 h-10 bg-bg-2 border-b">
										<div className="flex items-center gap-2">
											<span className="text-sm text-text-50/70 font-mono">
												Blueprint.md
											</span>
											{previewUrl && (
												<Copy text={previewUrl} />
											)}
										</div>
									</div>
									<div className="flex-1 overflow-y-auto bg-bg-3">
										<div className="py-12 mx-auto">
											<Blueprint
												blueprint={
													blueprint ??
													({} as BlueprintType)
												}
												className="w-full max-w-2xl mx-auto"
											/>
										</div>
									</div>
								</div>
							)}


                            {/* Disabled terminal for now */}
							{/* {view === 'terminal' && (
								<div className="flex-1 flex flex-col bg-bg-3 rounded-xl shadow-md shadow-bg-2 overflow-hidden border border-border-primary">
									<div className="grid grid-cols-3 px-2 h-10 bg-bg-2 border-b">
										<div className="flex items-center">
											<ViewModeSwitch
												view={view}
												onChange={handleViewModeChange}
												previewAvailable={!!previewUrl}
												showTooltip={showTooltip}
												terminalAvailable={true}
											/>
										</div>

										<div className="flex items-center justify-center">
											<div className="flex items-center gap-3">
												<span className="text-sm font-mono text-text-50/70">
													Terminal
												</span>
												<div className={clsx(
													'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
													websocket && websocket.readyState === WebSocket.OPEN
														? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
														: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
												)}>
													<div className={clsx(
														'size-1.5 rounded-full',
														websocket && websocket.readyState === WebSocket.OPEN ? 'bg-green-500' : 'bg-red-500'
													)} />
													{websocket && websocket.readyState === WebSocket.OPEN ? 'Connected' : 'Disconnected'}
												</div>
											</div>
										</div>

										<div className="flex items-center justify-end gap-1.5">
											<button
												onClick={() => {
													const logText = terminalLogs
														.map(log => `[${new Date(log.timestamp).toLocaleTimeString()}] ${log.content}`)
														.join('\n');
													navigator.clipboard.writeText(logText);
												}}
												className={clsx(
													"h-7 w-7 p-0 rounded-md transition-all duration-200",
													"text-gray-500 hover:text-gray-700",
													"dark:text-gray-400 dark:hover:text-gray-200",
													"hover:bg-gray-100 dark:hover:bg-gray-700"
												)}
												title="Copy all logs"
											>
												<Copy text="" />
											</button>
											<ModelConfigInfo
												configs={modelConfigs}
												onRequestConfigs={handleRequestConfigs}
												loading={loadingConfigs}
											/>
										</div>
									</div>
									<div className="flex-1">
										<Terminal
											logs={terminalLogs}
											onCommand={handleTerminalCommand}
											isConnected={!!websocket && websocket.readyState === WebSocket.OPEN}
											className="h-full"
										/>
									</div>
								</div>
							)} */}

							{view === 'editor' && (
								<div className="flex-1 flex flex-col bg-bg-3 rounded-xl shadow-md shadow-bg-2 overflow-hidden border border-border-primary">
									{activeFile && (
										<div className="grid grid-cols-3 px-2 h-10 bg-bg-2 border-b">
											<div className="flex items-center">
												<ViewModeSwitch
													view={view}
													onChange={
														handleViewModeChange
													}
													previewAvailable={
														!!previewUrl
													}
													showTooltip={showTooltip}
												/>
											</div>

											<div className="flex items-center justify-center">
												<div className="flex items-center gap-2">
													<span className="text-sm font-mono text-text-50/70">
														{activeFile.filePath}
													</span>
													{previewUrl && (
														<Copy
															text={previewUrl}
														/>
													)}
												</div>
											</div>

											<div className="flex items-center justify-end gap-1.5">
												{/* <button
													className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-md transition-all duration-200 text-xs font-medium shadow-sm"
													onClick={() => handleDeployToCloudflare(chatId!)}
													disabled={isDeploying}
													title="Save & Deploy"
												>
													{isDeploying ? (
														<LoaderCircle className="size-3 animate-spin" />
													) : (
														<Save className="size-3" />
													)}
													{isDeploying ? 'Deploying...' : 'Save'}
												</button>
												<button
													className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200 text-xs font-medium shadow-sm ${
														isPhase1Complete
															? 'bg-gray-800 hover:bg-gray-900 text-white'
															: 'bg-gray-600 text-gray-400 cursor-not-allowed'
													}`}
													onClick={isPhase1Complete ? githubExport.openModal : undefined}
													disabled={!isPhase1Complete}
													title={isPhase1Complete ? "Export to GitHub" : "Complete Phase 1 to enable GitHub export"}
													aria-label={isPhase1Complete ? "Export to GitHub" : "GitHub export disabled - complete Phase 1 first"}
												>
													<Github className="size-3" />
													GitHub
												</button> */}
												{canEditCode && (
													<button
														className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200 text-xs font-medium shadow-sm ${
															isActiveFileDirty
																? 'bg-accent text-text-inverted hover:bg-accent/90'
																: 'bg-bg-3 text-text-primary/40 cursor-not-allowed'
														}`}
														onClick={isActiveFileDirty ? handleSaveEdit : undefined}
														disabled={!isActiveFileDirty}
														title={
															isActiveFileDirty
																? 'Save changes (⌘/Ctrl+S) — creates a reversion point'
																: 'No unsaved changes'
														}
													>
														<Save className="size-3" />
														Save
													</button>
												)}
												<ModelConfigInfo
													configs={modelConfigs}
													onRequestConfigs={handleRequestConfigs}
													loading={loadingConfigs}
												/>
												<button
													className="p-1 hover:bg-bg-2 rounded transition-colors"
													onClick={() => {
														editorRef.current?.requestFullscreen();
													}}
													title="Fullscreen"
												>
													<Expand className="size-4 text-text-primary/50" />
												</button>
											</div>
										</div>
									)}
									<div className="flex-1 relative">
										<div
											className="absolute inset-0 flex"
											ref={editorRef}
										>
											<FileExplorer
												files={files}
												bootstrapFiles={
													streamedBootstrapFiles
												}
												currentFile={activeFile}
												onFileClick={handleFileClick}
											/>
											<div className="flex-1">
												<MonacoEditor
													className="h-full"
													createOptions={{
														value: editorValue,
														language:
															activeFile?.language ||
															'plaintext',
														readOnly: !canEditCode,
														minimap: {
															enabled: false,
														},
														lineNumbers: 'on',
														scrollBeyondLastLine: false,
														fontSize: 13,
														automaticLayout: true,
													}}
													onChange={handleEditorChange}
													onSave={handleSaveEdit}
													find={
														edit &&
														edit.filePath ===
															activeFile?.filePath
															? edit.search
															: undefined
													}
													replace={
														edit &&
														edit.filePath ===
															activeFile?.filePath
															? edit.replacement
															: undefined
													}
												/>
											</div>
										</div>
									</div>
								</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Debug Panel */}
			<DebugPanel
				messages={debugMessages}
				onClear={clearDebugMessages}
				chatSessionId={chatId}
			/>

			{/* GitHub Export Modal */}
			<GitHubExportModal
				isOpen={githubExport.isModalOpen}
				onClose={githubExport.closeModal}
				onExport={githubExport.startExport}
				isExporting={githubExport.isExporting}
				exportProgress={githubExport.progress}
				exportResult={githubExport.result}
				onRetry={githubExport.retry}
			/>
		</div>
	);
}
