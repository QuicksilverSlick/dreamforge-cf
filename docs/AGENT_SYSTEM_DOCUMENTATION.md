# Dreamforge Agent System Documentation

## Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Architecture](#architecture)
3. [Agent Catalog](#agent-catalog)
4. [Core Operations](#core-operations)
5. [Developer Guide](#developer-guide)
6. [API Reference](#api-reference)
7. [Integration Guide](#integration-guide)

---

## High-Level Overview

### Purpose

The Dreamforge Agent System is an AI-powered code generation platform that transforms natural language requirements into fully-functional web applications. It operates as a stateful, phase-wise code generation engine built on Cloudflare Durable Objects, enabling persistent, long-running AI operations with real-time streaming updates.

### Key Capabilities

- **Autonomous Web Application Generation**: Converts user prompts into complete, deployable web applications
- **Phase-Wise Development**: Breaks complex projects into manageable, iterative development phases
- **Intelligent Error Correction**: Automatically detects and fixes runtime errors, static analysis issues, and code quality problems
- **Real-Time Streaming**: Provides live updates via WebSocket as code is generated
- **Template-Based Scaffolding**: Starts from pre-configured templates (React+Vite, Next.js, etc.)
- **Multi-Model AI Orchestration**: Leverages multiple LLMs (Anthropic Claude, OpenAI GPT, Google Gemini) for different tasks

### Role in Dreamforge

The agent system serves as the **core intelligence** of Dreamforge. When a user submits a project request:

1. The agent generates a comprehensive blueprint (PRD) with visual design specifications
2. Selects an appropriate starting template from available options
3. Implements the project through multiple development phases
4. Continuously validates, reviews, and fixes generated code
5. Deploys to a sandbox environment for real-time preview
6. Iterates based on runtime feedback and user suggestions

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Dreamforge Frontend                         │
│                    (React + Vite + WebSocket)                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP/WebSocket
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Cloudflare Worker (API Layer)                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  POST /api/agent → Initialize Agent                        │ │
│  │  GET  /api/agent/:id/ws → WebSocket Connection            │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Durable Object Binding
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              SmartCodeGeneratorAgent (Durable Object)            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  State: CodeGenState (persistent across requests)         │  │
│  │  - Blueprint, Generated Files, Phases, Conversation       │  │
│  │  - Sandbox Instance ID, Preview URLs                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Operations (Stateless Services)                          │  │
│  │  - PhaseGenerationOperation                               │  │
│  │  - PhaseImplementationOperation                           │  │
│  │  - CodeReviewOperation                                    │  │
│  │  - FileRegenerationOperation                              │  │
│  │  - ScreenshotAnalysisOperation                            │  │
│  │  - FastCodeFixerOperation                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Assistants (Specialized Sub-Agents)                      │  │
│  │  - ProjectSetupAssistant                                  │  │
│  │  - RealtimeCodeFixer                                      │  │
│  │  - UserConversationProcessor                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────┬──────────────────┬──────────────────┬──────────────┘
            │                  │                  │
            ▼                  ▼                  ▼
    ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐
    │  AI Providers │  │   Sandbox    │  │  Database (D1)  │
    │  - Claude     │  │   Service    │  │  - Apps         │
    │  - GPT-4      │  │  (Runner)    │  │  - Sessions     │
    │  - Gemini     │  │              │  │  - Model Config │
    └───────────────┘  └──────────────┘  └─────────────────┘
```

### Component Architecture

#### 1. Durable Object Layer

**SmartCodeGeneratorAgent** (extends SimpleCodeGeneratorAgent)
- Stateful orchestrator managing the entire code generation lifecycle
- Persists state across requests using Cloudflare Durable Objects
- Handles WebSocket connections for real-time updates
- Coordinates operations and assistants

**Location**: `/worker/agents/core/smartGeneratorAgent.ts`, `/worker/agents/core/simpleGeneratorAgent.ts`

#### 2. Operations Layer (Stateless)

Operations are pure, stateless services that execute specific AI-driven tasks:

| Operation | Purpose | Input | Output |
|-----------|---------|-------|--------|
| **PhaseGenerationOperation** | Plans the next development phase | Issues, User Context | Phase Concept (files to create) |
| **PhaseImplementationOperation** | Generates code for a phase | Phase Concept, Issues | Generated Files (streaming) |
| **CodeReviewOperation** | Analyzes entire codebase for issues | Runtime/Static Errors | Review Report, Files to Fix |
| **FileRegenerationOperation** | Fixes specific files based on issues | File, Issues, Context | Fixed File |
| **ScreenshotAnalysisOperation** | Analyzes UI screenshots | Screenshot, Blueprint | UI Compliance Report |
| **FastCodeFixerOperation** | Applies deterministic fixes | Files, Errors | Fixed Files |

**Location**: `/worker/agents/operations/`

#### 3. Assistants Layer (Specialized Sub-Agents)

Assistants are stateful helpers that maintain conversation history:

- **ProjectSetupAssistant**: Handles project initialization and dependency management
- **RealtimeCodeFixer**: Applies real-time fixes during code generation
- **UserConversationProcessor**: Processes natural language user feedback into actionable suggestions

**Location**: `/worker/agents/assistants/`

#### 4. Services Layer

- **FileManager**: Manages file state, hashing, and diff tracking
- **StateManager**: Handles Durable Object state persistence
- **SandboxService**: Interfaces with the external code execution environment
- **InferenceService**: Abstracts AI model interactions

**Location**: `/worker/agents/services/`

### Data Flow

#### Initialization Flow

```
1. User submits prompt + images
   ↓
2. API selects template via selectTemplate()
   ↓
3. Create Durable Object instance (SmartCodeGeneratorAgent)
   ↓
4. Generate Blueprint (PRD with design system)
   ↓
5. Initialize sandbox instance
   ↓
6. Save to database (D1)
   ↓
7. Return agent ID + WebSocket URL
```

#### Generation Flow (Phase-Wise)

```
While (project not complete AND phases < MAX_PHASES):
  1. PhaseGenerationOperation
     - Analyze current state
     - Plan next phase (files to create/modify)
     ↓
  2. PhaseImplementationOperation
     - Stream code generation via SCOF format
     - Apply realtime fixes if enabled
     ↓
  3. Deploy to Sandbox
     - Upload files
     - Run build commands
     - Start dev server
     ↓
  4. Wait for runtime stability
     ↓
  5. Collect Issues
     - Runtime errors from sandbox webhooks
     - Static analysis (lint + typecheck)
     - Client-reported errors
     ↓
  6. If critical errors exist:
     - CodeReviewOperation (comprehensive analysis)
     - FileRegenerationOperation (parallel fixes)
     - Redeploy
     ↓
  7. Mark phase complete
```

#### Review & Fix Flow

```
1. CodeReviewOperation analyzes all files
   ↓
2. Generates per-file issue reports
   ↓
3. Parallel FileRegenerationOperation for each file
   ↓
4. Files streamed to client via WebSocket
   ↓
5. Redeploy to sandbox
   ↓
6. Validate fixes with new runtime data
```

### State Management

**CodeGenState** (Persistent in Durable Object):

```typescript
interface CodeGenState {
  // Project Definition
  blueprint: Blueprint;                    // PRD with visual design specs
  query: string;                           // Original user prompt

  // Generated Code
  generatedFilesMap: Record<string, FileState>; // All generated files with metadata
  generatedPhases: PhaseState[];           // Completed phases

  // Execution Context
  sandboxInstanceId?: string;              // Sandbox environment ID
  currentDevState: CurrentDevState;        // IDLE, PHASE_GENERATING, REVIEWING, etc.

  // Error Tracking
  clientReportedErrors: ClientReportedErrorType[]; // Browser-side errors

  // User Interaction
  pendingUserInputs: string[];             // Queued user requests
  conversationMessages: ConversationMessage[]; // Chat history

  // Configuration
  templateDetails: TemplateDetails;        // Starting template info
  inferenceContext: InferenceContext;      // User, agent, model config
  agentMode: 'deterministic' | 'smart';    // Orchestration mode

  // Control Flags
  shouldBeGenerating: boolean;             // Persistent generation intent
  mvpGenerated: boolean;                   // First working version complete
  reviewingInitiated: boolean;             // Code review started
}
```

**FileState** (Tracking per-file metadata):

```typescript
interface FileState extends FileOutputType {
  lasthash: string;      // Content hash for change detection
  lastmodified: number;  // Timestamp of last update
  unmerged: string[];    // Pending diffs not yet applied
  lastDiff: string;      // Most recent diff applied
}
```

### Communication Protocols

#### WebSocket Message Types

**Client → Agent (Requests)**:
- `generate_all`: Start full generation process
- `code_review`: Trigger comprehensive code review
- `deploy`: Deploy to Cloudflare Workers
- `user_suggestion`: Submit user feedback/changes
- `capture_screenshot`: Request UI screenshot
- `stop_generation` / `resume_generation`: Control flow

**Agent → Client (Responses)**:
- `generation_started` / `generation_complete`
- `phase_generating` / `phase_generated`
- `phase_implementing` / `phase_implemented`
- `file_generating` / `file_chunk_generated` / `file_generated`
- `code_reviewing` / `code_reviewed`
- `deployment_started` / `deployment_completed`
- `runtime_error_found` / `static_analysis_results`
- `error` / `rate_limit_error`

**Location**: `/worker/agents/constants.ts`, `/worker/agents/core/websocket.ts`

#### Streaming Code Format (SCOF)

**SCOF (Shell Command Output Format)** enables streaming file generation with arbitrary chunk boundaries:

```bash
# File start marker
$ cat > src/components/Button.tsx <<'EOF_MARKER_xyz'
import React from 'react';

export const Button = () => {
  return <button>Click me</button>;
}
EOF_MARKER_xyz

# File end marker
$ # File complete: src/components/Button.tsx
```

**Features**:
- Handles split tags across chunk boundaries
- Supports both `full_content` and `unified_diff` formats
- Extracts install commands automatically
- Single callback guarantee per file event

**Location**: `/worker/agents/output-formats/streaming-formats/scof.ts`

---

## Agent Catalog

### 1. SmartCodeGeneratorAgent

**Type**: Primary Agent (Durable Object)

**Purpose**: Top-level orchestrator for AI-powered web application generation with intelligent state management and phase-wise development.

**Responsibilities**:
- Lifecycle management (initialization → generation → deployment)
- State persistence across requests
- WebSocket connection handling
- Operation and assistant coordination
- Error recovery and retry logic

**Configuration**:
```typescript
interface AgentInitArgs {
  query: string;                      // User's project description
  language?: string;                  // Programming language (default: TypeScript)
  frameworks?: string[];              // Additional frameworks to use
  hostname: string;                   // Deployment hostname
  inferenceContext: InferenceContext; // User ID, model configs
  templateInfo: {
    templateDetails: TemplateDetails;
    selection: TemplateSelection;
  };
  sandboxSessionId: string;
  images?: ImageAttachment[];         // Reference images
  onBlueprintChunk: (chunk: string) => void; // Stream blueprint
}
```

**Key Methods**:
- `initialize(initArgs)`: Sets up project with blueprint generation
- `generateAllFiles(reviewCycles)`: Main generation loop
- `reviewCode()`: Triggers comprehensive code review
- `regenerateFile(file, issues, phaseIndex)`: Fixes specific file
- `deployToSandbox(files, redeploy)`: Deploys to sandbox environment
- `queueUserRequest(request, images)`: Handles user feedback

**State Machine**:
```typescript
enum CurrentDevState {
  IDLE,                 // Waiting for instructions
  PHASE_GENERATING,     // Planning next phase
  PHASE_IMPLEMENTING,   // Writing code for phase
  REVIEWING,            // Analyzing code quality
  FILE_REGENERATING,    // Fixing specific files
  FINALIZING,           // Final review before completion
}
```

**Location**: `/worker/agents/core/smartGeneratorAgent.ts`

---

### 2. PhaseGenerationOperation

**Type**: Stateless Operation

**Purpose**: Plans the next development phase based on current project state, runtime errors, and user feedback.

**Input**:
```typescript
interface PhaseGenerationInputs {
  issues: IssueReport;           // Runtime errors, static analysis
  userContext?: UserContext;     // User suggestions + images
  isUserSuggestedPhase?: boolean; // Triggered by user feedback
}
```

**Output**:
```typescript
interface PhaseConceptGenerationSchemaType {
  name: string;                  // "User Authentication System"
  description: string;           // Concise phase description
  files: FileConceptType[];      // Files to create/modify
  lastPhase: boolean;            // Is this the final phase?
  installCommands: string[];     // Additional dependencies needed
}
```

**AI Prompt Strategy**:
- Analyzes current codebase snapshot
- Prioritizes critical runtime errors (render loops, undefined errors)
- Plans beautiful UI/UX improvements
- Ensures deployable milestones
- Follows frontend-first development strategy

**Model Configuration** (configurable per user):
- Default: Claude 3.7 Sonnet (reasoning: medium)
- Fallback: Gemini 2.5 Flash (on rate limits)
- Token limit: 16,000 output tokens

**Location**: `/worker/agents/operations/PhaseGeneration.ts`

---

### 3. PhaseImplementationOperation

**Type**: Stateless Operation

**Purpose**: Generates complete, production-ready code for a planned phase with streaming output.

**Input**:
```typescript
interface PhaseImplementationInputs {
  phase: PhaseConceptType;       // Phase to implement
  issues: IssueReport;           // Known issues to fix
  isFirstPhase: boolean;         // Override template files?
  shouldAutoFix: boolean;        // Enable realtime code fixer
  userContext?: UserContext;     // User suggestions + images

  // Streaming callbacks
  fileGeneratingCallback: (filePath: string, purpose: string) => void;
  fileChunkGeneratedCallback: (filePath: string, chunk: string, format: 'full_content' | 'unified_diff') => void;
  fileClosedCallback: (file: FileOutputType, message: string) => void;
}
```

**Output**:
```typescript
interface PhaseImplementationOutputs {
  fixedFilePromises: Promise<FileOutputType>[]; // Files (some being fixed)
  deploymentNeeded: boolean;                    // Should deploy after this?
  commands: string[];                           // Install commands extracted
}
```

**AI Prompt Strategy**:
- Expert senior full-stack engineer persona
- One-shot implementation (no retries)
- Obsessive focus on visual excellence and UI polish
- Render loop prevention guidelines
- Comprehensive error handling
- Explicit layout patterns (flex, grid, responsive)

**Streaming Implementation**:
- Uses SCOF format for robust streaming
- Chunk size: 256 bytes (configurable)
- Realtime code fixer runs on files >50 lines (if enabled)
- Parallel processing of completed files

**Model Configuration**:
- Default: Claude 3.7 Sonnet
- First Phase: GPT-4o (more creative)
- Token limit: 16,000 output tokens

**Location**: `/worker/agents/operations/PhaseImplementation.ts`

---

### 4. CodeReviewOperation

**Type**: Stateless Operation

**Purpose**: Comprehensive codebase analysis to detect runtime errors, logic flaws, UI issues, and incomplete features.

**Input**:
```typescript
interface CodeReviewInputs {
  issues: IssueReport;  // Runtime errors, static analysis
}
```

**Output**:
```typescript
interface CodeReviewOutputType {
  dependenciesNotMet: string[];        // Missing dependencies
  issuesFound: boolean;                // Any issues detected?
  frontendIssues: string[];            // UI/React issues
  backendIssues: string[];             // Server/API issues
  filesToFix: Array<{
    filePath: string;
    issues: string[];                  // Specific problems
    require_code_changes: boolean;     // Needs regeneration?
  }>;
  commands: string[];                  // Fix commands (e.g., install deps)
}
```

**Analysis Priorities**:
1. **React Render Loops** (Critical) - Infinite loops, re-render bugs
2. **Runtime Errors** (Critical) - Undefined access, import errors
3. **Logic Errors** (High) - Incorrect business logic
4. **UI Issues** (High) - Layout breaks, styling errors
5. **State Management** (Medium-High) - State bugs, stale closures
6. **Incomplete Features** (Medium) - TODOs, missing functionality
7. **Stale Error Filtering** - Ignores outdated error reports

**Parallel-Ready Output**:
- Groups issues by file path
- Each file's issues are self-contained
- Enables parallel FileRegenerationOperation per file
- No cross-file dependency assumptions

**Model Configuration**:
- Default: Claude 3.7 Sonnet (reasoning: high for complex issues)
- Uses structured output with Zod schema validation

**Location**: `/worker/agents/operations/CodeReview.ts`

---

### 5. FileRegenerationOperation

**Type**: Stateless Operation

**Purpose**: Regenerates a specific file to fix identified issues while maintaining consistency with the broader codebase.

**Input**:
```typescript
interface FileRegenerationInputs {
  fileToRegenerate: FileOutputType;  // Current file state
  issuesAndFixes: string[];          // Problems to address
  context: GenerationContext;        // Full project context
}
```

**Output**:
```typescript
interface FileOutputType {
  filePath: string;
  fileContents: string;  // Fixed file contents
  filePurpose: string;   // Role in architecture
}
```

**AI Prompt Strategy**:
- Focuses on specific file in isolation
- Provides full codebase context
- Emphasizes backward compatibility
- Avoids breaking existing functionality
- Maintains coding standards and patterns

**Usage Pattern**:
- Typically run in parallel for multiple files
- Called after CodeReviewOperation identifies issues
- Used for targeted fixes vs. full phase regeneration

**Model Configuration**:
- Default: Claude 3.7 Sonnet
- Token limit: 8,000 output tokens

**Location**: `/worker/agents/operations/FileRegeneration.ts`

---

### 6. ScreenshotAnalysisOperation

**Type**: Stateless Operation

**Purpose**: Analyzes UI screenshots to verify visual implementation matches blueprint specifications.

**Input**:
```typescript
interface ScreenshotAnalysisInputs {
  screenshotUrl: string;          // URL to screenshot image
  context: GenerationContext;     // Blueprint, current files
}
```

**Output**:
```typescript
interface ScreenshotAnalysisType {
  hasIssues: boolean;
  issues: string[];               // Visual problems detected
  suggestions: string[];          // Improvement recommendations
  uiCompliance: {
    matchesBlueprint: boolean;
    deviations: string[];         // Differences from blueprint
  };
}
```

**Analysis Focus**:
- Visual hierarchy and layout
- Color palette compliance
- Typography and spacing
- Component styling accuracy
- Responsive design issues
- Accessibility concerns

**Model Configuration**:
- Uses vision-capable models (Claude 3.7 Sonnet, GPT-4o)
- Multi-modal input (text + image)

**Location**: `/worker/agents/operations/ScreenshotAnalysis.ts`

---

### 7. FastCodeFixerOperation

**Type**: Stateless Operation

**Purpose**: Applies deterministic, pattern-based fixes for common errors without full AI regeneration.

**Input**:
```typescript
interface FastCodeFixerInputs {
  files: FileOutputType[];      // Files to analyze
  errors: RuntimeError[];       // Known runtime errors
}
```

**Fixes Applied**:
- Missing imports auto-addition
- Undefined variable initialization
- Null safety guards (`?.` operator)
- Type assertion corrections
- Dependency array fixes in React hooks

**Advantages**:
- Fast execution (no LLM calls)
- Deterministic results
- Low token cost
- Useful for obvious errors

**Limitations**:
- Only handles known patterns
- Cannot fix complex logic issues
- Falls back to FileRegenerationOperation for unknowns

**Location**: `/worker/agents/operations/FastCodeFixer.ts`

---

### 8. UserConversationProcessor

**Type**: Stateless Operation

**Purpose**: Processes natural language user feedback and converts it into actionable development suggestions.

**Input**:
```typescript
interface UserConversationInputs {
  userMessage: string;            // User's feedback/request
  images?: ImageAttachment[];     // Optional screenshots/mockups
  context: GenerationContext;     // Current project state
}
```

**Output**:
```typescript
interface ConversationalResponseType {
  userResponse: string;           // Message to send back to user
  // Suggestions stored in state.pendingUserInputs
}
```

**Capabilities**:
- Clarifies ambiguous requests
- Extracts actionable suggestions
- Handles multi-modal input (text + images)
- Maintains conversation context
- Asks clarifying questions when needed

**Model Configuration**:
- Default: Claude 3.7 Sonnet (good at nuanced understanding)
- Supports vision models for image analysis

**Location**: `/worker/agents/operations/UserConversationProcessor.ts`

---

### 9. RealtimeCodeFixer (Assistant)

**Type**: Stateful Assistant

**Purpose**: Applies real-time fixes to generated code files during streaming to catch obvious errors early.

**When Triggered**:
- During PhaseImplementationOperation
- Only for files >50 lines (performance optimization)
- If `shouldAutoFix` enabled and user has feature flag

**Fixes Applied**:
- Import statement corrections
- React render loop prevention
- Null safety improvements
- Type error fixes
- Dependency array corrections

**Benefits**:
- Reduces deployment failures
- Catches errors before sandbox deployment
- Improves first-attempt success rate

**Implementation**:
- Runs asynchronously alongside streaming
- Returns Promise<FileOutputType>
- Collected with `Promise.all()` after streaming completes

**Location**: `/worker/agents/assistants/realtimeCodeFixer.ts`

---

### 10. ProjectSetupAssistant (Assistant)

**Type**: Stateful Assistant

**Purpose**: Manages project initialization, dependency installation, and environment setup.

**Responsibilities**:
- Analyzes blueprint for required dependencies
- Generates setup commands (bun add, npm install)
- Configures build tools (Vite, webpack)
- Sets up environment variables
- Validates dependency compatibility

**Usage**:
- Called during agent initialization
- Invoked when new dependencies needed
- Triggered on template changes

**Location**: `/worker/agents/assistants/projectsetup.ts`

---

## Core Operations

### Blueprint Generation

**Function**: `generateBlueprint()`

**Purpose**: Creates a comprehensive Product Requirements Document (PRD) with visual design specifications from a user prompt.

**Process**:
1. Analyze user prompt and images
2. Select appropriate use case and complexity
3. Design visual identity (color palette, typography, spacing)
4. Plan user flows and component architecture
5. Specify data models and state management
6. Suggest frameworks and dependencies
7. Create initial phase plan

**Output Schema**:
```typescript
interface Blueprint {
  title: string;                          // "Personal Finance Tracker"
  projectName: string;                    // "finance-tracker"
  description: string;                    // Brief overview
  detailedDescription: string;            // Comprehensive breakdown
  colorPalette: string[];                 // ["#3B82F6", "#10B981", "#F59E0B"]
  views: Array<{name: string, description: string}>;
  userFlow: {
    uiLayout: string;                     // Detailed layout specs
    uiDesign: string;                     // Visual design guidelines
    userJourney: string;                  // Interaction flows
  };
  dataFlow: string;
  architecture: {dataFlow: string};
  pitfalls: string[];                     // Domain-specific warnings
  frameworks: string[];                   // Required dependencies
  implementationRoadmap: Array<{phase: string, description: string}>;
  initialPhase: PhaseConceptType;        // First phase to implement
}
```

**AI Prompt Strategy**:
- Senior Software Architect + Product Manager persona
- Focus on visual excellence and stunning UI
- Modern design systems (Tailwind, shadcn/ui)
- Comprehensive dependency selection
- Frontend-first planning approach

**Location**: `/worker/agents/planning/blueprint.ts`

---

### Template Selection

**Function**: `selectTemplate()`

**Purpose**: Intelligently selects the most appropriate starting template for a project based on user requirements.

**Available Templates**:
- `react-vite-ts`: General-purpose React + TypeScript + Vite
- `nextjs-ts`: Full-stack Next.js with App Router
- `react-dashboard`: Pre-configured dashboard template
- `react-saas`: SaaS product template with auth

**Selection Criteria**:
- Project complexity (simple, moderate, complex)
- Use case (SaaS, Dashboard, Blog, Portfolio, E-Commerce)
- Required features (auth, database, API)
- Performance requirements

**Output**:
```typescript
interface TemplateSelection {
  selectedTemplateName: string | null;
  reasoning: string;
  useCase: 'SaaS Product Website' | 'Dashboard' | 'Blog' | 'Portfolio' | 'E-Commerce' | 'General' | 'Other';
  complexity: 'simple' | 'moderate' | 'complex';
  styleSelection: 'Minimalist Design' | 'Brutalism' | 'Retro' | 'Illustrative' | 'Kid_Playful' | 'Custom';
  projectName: string;
}
```

**Location**: `/worker/agents/planning/templateSelector.ts`

---

### Inference Execution

**Function**: `executeInference()`

**Purpose**: Unified interface for all AI model interactions with automatic retry, fallback, and error handling.

**Supported Models**:
- **Anthropic**: Claude 3.7 Sonnet, Claude 3.5 Sonnet
- **OpenAI**: GPT-4o, GPT-4o-mini, o1, o3-mini
- **Google**: Gemini 2.5 Pro, Gemini 2.5 Flash

**Features**:
- Structured output with Zod schema validation
- Automatic retry with exponential backoff
- Model fallback on rate limits (e.g., Sonnet → Flash)
- Streaming support with chunking
- Tool calling support (MCP, custom tools)
- Reasoning effort control (low, medium, high)
- Per-user model configuration overrides

**Configuration**:
```typescript
interface ModelConfig {
  name: AIModels;                  // Model identifier
  temperature: number;             // 0.0 - 1.0
  max_tokens: number;              // Output token limit
  reasoning_effort?: 'low' | 'medium' | 'high';
}

// Example: Agent-specific defaults
AGENT_CONFIG = {
  blueprint: { name: 'claude-sonnet-4-5', temperature: 0.2, max_tokens: 16000 },
  phaseGeneration: { name: 'claude-sonnet-4-5', temperature: 0.3, max_tokens: 16000 },
  phaseImplementation: { name: 'claude-sonnet-4-5', temperature: 0.2, max_tokens: 16000 },
  codeReview: { name: 'claude-sonnet-4-5', temperature: 0.1, max_tokens: 16000 },
  // ... other operations
}
```

**Usage Example**:
```typescript
const { object: blueprint } = await executeInference({
  env,
  messages: [systemMessage, userMessage],
  schema: BlueprintSchema,
  agentActionName: "blueprint",
  context: inferenceContext,
  stream: { chunk_size: 256, onChunk: (chunk) => ws.send(chunk) }
});
```

**Location**: `/worker/agents/inferutils/infer.ts`, `/worker/agents/inferutils/core.ts`

---

### Issue Collection

**Class**: `IssueReport`

**Purpose**: Aggregates all types of errors and issues from multiple sources into a unified report.

**Issue Sources**:
1. **Runtime Errors**: From sandbox webhooks (crashes, exceptions)
2. **Static Analysis**: Lint issues (ESLint) + typecheck errors (TSC)
3. **Client-Reported Errors**: Browser-side console errors
4. **Screenshot Analysis**: UI compliance issues

**Data Structure**:
```typescript
class IssueReport {
  runtimeErrors: RuntimeError[];
  staticAnalysis: StaticAnalysisResponse;
  clientErrors: ClientReportedErrorType[];

  // Helper methods
  hasRuntimeErrors(): boolean;
  hasStaticAnalysisIssues(): boolean;
  hasCriticalIssues(): boolean;
  getCriticalIssuesCount(): number;
}
```

**Serialization**:
- Formatted as structured prompts for AI models
- Prioritizes critical issues (runtime errors)
- Includes code context and stack traces
- Filters stale errors (outdated file references)

**Location**: `/worker/agents/domain/values/IssueReport.ts`

---

### Generation Context

**Class**: `GenerationContext`

**Purpose**: Provides comprehensive project context to all operations for informed decision-making.

**Contents**:
```typescript
class GenerationContext {
  query: string;                     // Original user prompt
  blueprint: Blueprint;              // Project PRD
  allFiles: FileOutputType[];        // Current codebase
  templateDetails: TemplateDetails;  // Starting template info
  dependencies: string[];            // Installed packages
  previousPhases: PhaseConceptType[]; // Completed phases
  commandHistory: string[];          // Commands run
}
```

**Usage**:
- Passed to all operations for consistency
- Serialized into AI prompts
- Used for file processing and validation
- Enables operations to understand project holistically

**Location**: `/worker/agents/domain/values/GenerationContext.ts`

---

### File Processing

**Module**: `FileProcessing`

**Pure Functions**:

1. **`findFilePurpose(filePath, phase, existingFiles)`**
   - Determines the purpose of a file based on its path and phase context
   - Matches against phase file concepts
   - Returns descriptive purpose string

2. **`processGeneratedFileContents(file, originalContents, logger)`**
   - Handles diff application if format is `unified_diff`
   - Validates file contents
   - Logs processing details
   - Returns final file contents

3. **`applyDiff(original, diff)`**
   - Applies unified diff format to existing file
   - Handles patch conflicts
   - Returns patched file contents

**Location**: `/worker/agents/domain/pure/FileProcessing.ts`

---

### Dependency Management

**Module**: `DependencyManagement`

**Functions**:

1. **`extractCommands(text, allowInstallCommands)`**
   - Parses text for shell commands
   - Extracts `bun add`, `npm install` commands
   - Returns array of commands to execute

2. **`validateDependencies(required, available)`**
   - Checks if required dependencies are installed
   - Returns missing dependencies
   - Suggests installation commands

**Location**: `/worker/agents/domain/pure/DependencyManagement.ts`

---

## Developer Guide

### Creating a New Agent

Agents in Dreamforge are Durable Objects that maintain persistent state. Follow these steps to create a new agent:

#### Step 1: Define State Interface

Create a state interface in `/worker/agents/core/state.ts`:

```typescript
export interface MyCustomAgentState {
  // Persistent state fields
  taskId: string;
  progress: number;
  results: string[];

  // Transient fields (not serialized)
  currentOperation?: Promise<void>;
}
```

#### Step 2: Create Agent Class

Create `/worker/agents/core/myCustomAgent.ts`:

```typescript
import { Agent } from 'agents';
import { MyCustomAgentState } from './state';
import { StructuredLogger, createObjectLogger } from '../../logger';

export class MyCustomAgent extends Agent<Env, MyCustomAgentState> {
  protected _logger: StructuredLogger | undefined;

  // Define initial state
  initialState: MyCustomAgentState = {
    taskId: '',
    progress: 0,
    results: [],
  };

  // Initialize logger
  logger(): StructuredLogger {
    if (!this._logger) {
      this._logger = createObjectLogger(this, 'MyCustomAgent');
      this._logger.setObjectId(this.state.taskId);
    }
    return this._logger;
  }

  // Initialize agent
  async initialize(taskId: string): Promise<void> {
    await this.setState({
      ...this.state,
      taskId,
      progress: 0,
      results: [],
    });

    this.logger().info('Agent initialized', { taskId });
  }

  // Main agent logic
  async executeTask(): Promise<string[]> {
    this.logger().info('Starting task execution');

    // Your agent logic here
    // Update state as you progress
    await this.setState({
      ...this.state,
      progress: 50,
    });

    // Return results
    return this.state.results;
  }

  // Handle WebSocket connections (optional)
  async webSocketMessage(connection: Connection, message: string): Promise<void> {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'start':
        await this.executeTask();
        break;
      case 'status':
        connection.send(JSON.stringify({ progress: this.state.progress }));
        break;
    }
  }
}
```

#### Step 3: Register Durable Object Binding

Add to `wrangler.jsonc`:

```json
{
  "durable_objects": {
    "bindings": [
      {
        "name": "MyCustomAgentObject",
        "class_name": "MyCustomAgent",
        "script_name": "dreamforge-worker"
      }
    ]
  }
}
```

Update `worker/types/env.d.ts`:

```typescript
interface Env {
  // ... existing bindings
  MyCustomAgentObject: DurableObjectNamespace;
}
```

#### Step 4: Create API Endpoint

Add to `/worker/api/routes.ts`:

```typescript
router.post('/api/my-agent', async (req, env, ctx) => {
  const { taskId } = await req.json();

  // Get or create agent instance
  const agentStub = env.MyCustomAgentObject.get(
    env.MyCustomAgentObject.idFromName(taskId)
  );

  // Initialize agent
  await agentStub.initialize(taskId);

  // Return agent ID for future requests
  return Response.json({ agentId: taskId });
});
```

#### Step 5: Add WebSocket Support (Optional)

```typescript
router.get('/api/my-agent/:id/ws', async (req, env, ctx) => {
  const agentId = req.params.id;

  // Upgrade connection
  const upgradeHeader = req.headers.get('Upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 });
  }

  // Get agent stub
  const agentStub = env.MyCustomAgentObject.get(
    env.MyCustomAgentObject.idFromName(agentId)
  );

  // Forward WebSocket to agent
  return agentStub.fetch(req);
});
```

---

### Creating a New Operation

Operations are stateless services that execute specific AI-driven tasks. They follow a consistent pattern:

#### Step 1: Define Input/Output Types

Create `/worker/agents/operations/MyOperation.ts`:

```typescript
export interface MyOperationInputs {
  // Input parameters
  data: string;
  context: GenerationContext;
  options?: {
    verbose: boolean;
  };
}

export interface MyOperationOutputs {
  // Output results
  result: string;
  metrics: {
    tokensUsed: number;
    durationMs: number;
  };
}
```

#### Step 2: Create Operation Class

```typescript
import { AgentOperation, OperationOptions } from './common';
import { executeInference } from '../inferutils/infer';
import { createUserMessage } from '../inferutils/common';
import z from 'zod';

const SYSTEM_PROMPT = `You are an expert AI assistant specialized in...
<detailed instructions>
`;

const OutputSchema = z.object({
  result: z.string().describe('The processed result'),
  confidence: z.number().describe('Confidence score 0-1'),
});

export class MyOperation extends AgentOperation<MyOperationInputs, MyOperationOutputs> {
  async execute(
    inputs: MyOperationInputs,
    options: OperationOptions
  ): Promise<MyOperationOutputs> {
    const { data, context } = inputs;
    const { env, logger, context: genContext } = options;

    logger.info('Starting MyOperation', { dataLength: data.length });

    try {
      // Build AI prompt
      const messages = [
        ...this.getSystemPrompt(context),
        createUserMessage(`Process this data: ${data}`)
      ];

      // Execute AI inference
      const startTime = Date.now();
      const { object: result } = await executeInference({
        env,
        messages,
        schema: OutputSchema,
        agentActionName: "myOperation",
        context: options.inferenceContext,
      });

      const durationMs = Date.now() - startTime;

      logger.info('MyOperation completed', {
        result: result.result,
        durationMs
      });

      return {
        result: result.result,
        metrics: {
          tokensUsed: 1000, // Estimate or get from API response
          durationMs,
        }
      };
    } catch (error) {
      logger.error('MyOperation failed', error);
      throw error;
    }
  }

  private getSystemPrompt(context: GenerationContext) {
    return getSystemPromptWithProjectContext(SYSTEM_PROMPT, context);
  }
}
```

#### Step 3: Register Operation in Agent

Add to `SmartCodeGeneratorAgent`:

```typescript
protected operations = {
  // ... existing operations
  myOperation: new MyOperation(),
};
```

#### Step 4: Use Operation

Call from agent methods:

```typescript
async performMyTask(data: string): Promise<void> {
  const result = await this.operations.myOperation.execute(
    {
      data,
      context: this.getGenerationContext(),
    },
    this.getOperationOptions()
  );

  this.logger().info('Task completed', result);
}
```

---

### Best Practices

#### 1. State Management

**DO**:
- Keep state minimal and serializable (no functions, promises)
- Use transient fields for non-persistent data
- Update state atomically with `setState()`
- Validate state on agent initialization

**DON'T**:
- Store large objects in state (>100KB)
- Mutate state directly without `setState()`
- Store external connections/sockets in state
- Use state for derived/computed values

#### 2. Error Handling

**DO**:
- Use structured logging with context
- Implement retry logic with exponential backoff
- Provide detailed error messages
- Clean up resources in finally blocks
- Handle rate limits gracefully

**DON'T**:
- Swallow errors silently
- Use generic error messages
- Retry indefinitely without backoff
- Leave connections open on errors

#### 3. AI Prompt Engineering

**DO**:
- Use clear, structured prompts with sections
- Provide comprehensive context
- Include examples for complex tasks
- Specify output format explicitly
- Use persona-based prompting (e.g., "You are a senior engineer...")
- Add validation instructions

**DON'T**:
- Use vague or ambiguous instructions
- Assume the model knows project context
- Mix multiple tasks in one prompt
- Use inconsistent formatting
- Skip input validation

#### 4. Performance

**DO**:
- Stream large outputs to avoid timeouts
- Use parallel operations where possible
- Cache expensive computations
- Batch API calls
- Monitor token usage

**DON'T**:
- Block on synchronous operations
- Make unnecessary API calls
- Generate files sequentially when parallel is possible
- Ignore memory usage in large codebases

#### 5. Testing

**DO**:
- Write unit tests for pure functions
- Mock AI inference calls
- Test state transitions
- Validate schema outputs
- Test error conditions

**DON'T**:
- Skip testing stateful logic
- Rely only on integration tests
- Ignore edge cases
- Test against live APIs in CI/CD

---

### Conventions

#### Naming Conventions

- **Agents**: `PascalCaseAgent` (e.g., `SmartCodeGeneratorAgent`)
- **Operations**: `PascalCaseOperation` (e.g., `PhaseGenerationOperation`)
- **Assistants**: `PascalCaseAssistant` (e.g., `RealtimeCodeFixer`)
- **State Interfaces**: `PascalCaseState` (e.g., `CodeGenState`)
- **Input Types**: `OperationNameInputs` (e.g., `PhaseGenerationInputs`)
- **Output Types**: `OperationNameOutputs` or `OperationNameType`

#### File Structure

```
/worker/agents/
├── core/                    # Core agents (Durable Objects)
│   ├── smartGeneratorAgent.ts
│   ├── simpleGeneratorAgent.ts
│   ├── types.ts             # Shared type definitions
│   ├── state.ts             # State interfaces
│   └── websocket.ts         # WebSocket handlers
├── operations/              # Stateless operations
│   ├── PhaseGeneration.ts
│   ├── PhaseImplementation.ts
│   ├── CodeReview.ts
│   ├── FileRegeneration.ts
│   └── common.ts            # Shared utilities
├── assistants/              # Specialized sub-agents
│   ├── assistant.ts         # Base class
│   ├── realtimeCodeFixer.ts
│   └── projectsetup.ts
├── services/                # Service layer
│   ├── interfaces/          # Interfaces
│   │   ├── ICodingAgent.ts
│   │   ├── IFileManager.ts
│   │   └── IStateManager.ts
│   └── implementations/     # Implementations
│       ├── CodingAgent.ts
│       ├── FileManager.ts
│       └── StateManager.ts
├── domain/                  # Domain logic
│   ├── pure/                # Pure functions
│   │   ├── FileProcessing.ts
│   │   └── DependencyManagement.ts
│   └── values/              # Value objects
│       ├── GenerationContext.ts
│       └── IssueReport.ts
├── output-formats/          # Code output parsers
│   ├── streaming-formats/   # Streaming parsers
│   │   ├── scof.ts
│   │   └── xml-stream.ts
│   └── diff-formats/        # Diff parsers
│       ├── udiff.ts
│       └── search-replace.ts
├── inferutils/              # AI inference utilities
│   ├── infer.ts             # Main inference function
│   ├── core.ts              # Core inference logic
│   ├── common.ts            # Message builders
│   ├── config.ts            # Model configurations
│   └── schemaFormatters.ts  # Schema serializers
├── planning/                # Planning utilities
│   ├── blueprint.ts         # Blueprint generation
│   └── templateSelector.ts  # Template selection
├── tools/                   # Agent tools
│   ├── types.ts
│   ├── customTools.ts
│   └── toolkit/             # Tool implementations
│       ├── web-search.ts
│       ├── get-logs.ts
│       └── deploy-preview.ts
├── utils/                   # Utility functions
│   ├── common.ts
│   ├── codeSerializers.ts
│   ├── operationError.ts
│   └── idGenerator.ts
├── constants.ts             # Constants
├── prompts.ts               # Prompt templates
├── schemas.ts               # Zod schemas
└── index.ts                 # Public API
```

#### Logging

Use structured logging with context:

```typescript
// Initialize logger
protected _logger: StructuredLogger | undefined;

logger(): StructuredLogger {
  if (!this._logger) {
    this._logger = createObjectLogger(this, 'AgentName');
    this._logger.setObjectId(this.state.agentId);
    this._logger.setFields({
      sessionId: this.state.sessionId,
      userId: this.state.userId,
    });
  }
  return this._logger;
}

// Use logger
this.logger().info('Operation started', { param1, param2 });
this.logger().error('Operation failed', error, { context });
```

#### WebSocket Messages

Follow consistent message structure:

```typescript
// Outgoing message
sendToConnection(connection, 'operation_started', {
  operationType: 'phaseImplementation',
  phaseIndex: 2,
  timestamp: Date.now(),
});

// Incoming message handling
switch (parsedMessage.type) {
  case 'operation_request':
    await this.handleOperation(parsedMessage.data);
    break;
}
```

---

## API Reference

### Core Classes

#### Agent<Env, State>

Base class for all Durable Object agents.

**Methods**:

```typescript
class Agent<Env, State> {
  // State management
  protected async setState(newState: State): Promise<void>;
  protected get state(): State;

  // Lifecycle
  abstract async initialize(...args: any[]): Promise<State>;
  async fetch(request: Request): Promise<Response>;

  // WebSocket (override these)
  async webSocketMessage(connection: Connection, message: string): Promise<void>;
  async webSocketClose(connection: Connection, code: number, reason: string): Promise<void>;
  async webSocketError(connection: Connection, error: Error): Promise<void>;

  // Storage access
  protected get storage(): DurableObjectStorage;
  protected get env(): Env;
  protected get ctx(): DurableObjectState;
}
```

---

#### AgentOperation<Input, Output>

Base class for stateless operations.

**Methods**:

```typescript
abstract class AgentOperation<Input, Output> {
  // Main execution method (implement this)
  abstract async execute(
    inputs: Input,
    options: OperationOptions
  ): Promise<Output>;

  // Helper methods
  protected getSystemPromptWithProjectContext(
    prompt: string,
    context: GenerationContext
  ): Message[];

  protected async executeWithRetry<T>(
    fn: () => Promise<T>,
    retries: number = 3
  ): Promise<T>;
}
```

**OperationOptions**:

```typescript
interface OperationOptions {
  env: Env;                              // Cloudflare environment bindings
  logger: StructuredLogger;              // Structured logger
  context: GenerationContext;            // Project context
  inferenceContext: InferenceContext;    // User/model config
}
```

---

#### Assistant<Env>

Base class for stateful assistants.

**Methods**:

```typescript
class Assistant<Env> {
  constructor(
    env: Env,
    inferenceContext: InferenceContext,
    systemPrompt?: Message
  );

  // Conversation management
  save(messages: Message[]): Message[];
  getHistory(): Message[];
  clearHistory(): void;

  protected env: Env;
  protected inferenceContext: InferenceContext;
  protected history: Message[];
}
```

---

### Key Interfaces

#### CodeGenState

```typescript
interface CodeGenState {
  // Project definition
  blueprint: Blueprint;
  query: string;
  templateDetails: TemplateDetails;

  // Generated code
  generatedFilesMap: Record<string, FileState>;
  generatedPhases: PhaseState[];
  phasesCounter: number;

  // Execution state
  currentDevState: CurrentDevState;
  sandboxInstanceId?: string;
  generationPromise?: Promise<void>;

  // Error tracking
  clientReportedErrors: ClientReportedErrorType[];

  // User interaction
  pendingUserInputs: string[];
  conversationMessages: ConversationMessage[];
  projectUpdatesAccumulator: string[];

  // Configuration
  sessionId: string;
  hostname: string;
  agentMode: 'deterministic' | 'smart';
  inferenceContext: InferenceContext;

  // Flags
  shouldBeGenerating: boolean;
  mvpGenerated: boolean;
  reviewingInitiated: boolean;
}
```

---

#### GenerationContext

```typescript
class GenerationContext {
  constructor(
    query: string,
    blueprint: Blueprint,
    allFiles: FileOutputType[],
    templateDetails: TemplateDetails,
    dependencies: string[],
    previousPhases: PhaseConceptType[],
    commandHistory?: string[]
  );

  // Accessors
  readonly query: string;
  readonly blueprint: Blueprint;
  readonly allFiles: FileOutputType[];
  readonly templateDetails: TemplateDetails;
  readonly dependencies: string[];
  readonly previousPhases: PhaseConceptType[];
  readonly commandHistory: string[];

  // Methods
  addFile(file: FileOutputType): void;
  updateFile(filePath: string, contents: string): void;
  getFile(filePath: string): FileOutputType | undefined;
  getAllFilePaths(): string[];
}
```

---

#### IssueReport

```typescript
class IssueReport {
  constructor(
    runtimeErrors: RuntimeError[],
    staticAnalysis: StaticAnalysisResponse,
    clientErrors: ClientReportedErrorType[]
  );

  // Properties
  readonly runtimeErrors: RuntimeError[];
  readonly staticAnalysis: StaticAnalysisResponse;
  readonly clientErrors: ClientReportedErrorType[];

  // Methods
  hasRuntimeErrors(): boolean;
  hasStaticAnalysisIssues(): boolean;
  hasCriticalIssues(): boolean;
  getCriticalIssuesCount(): number;

  // Serialization
  serialize(): string;
}
```

---

#### InferenceContext

```typescript
interface InferenceContext {
  userId: string;                      // User identifier
  agentId: string;                     // Agent identifier
  sessionId: string;                   // Session identifier
  userModelConfigs?: Record<AgentActionKey, ModelConfig>; // Custom configs
}
```

---

### Key Functions

#### executeInference

```typescript
// Structured output variant
async function executeInference<T extends z.AnyZodObject>(params: {
  env: Env;
  messages: Message[];
  schema: T;
  agentActionName: AgentActionKey;
  context: InferenceContext;
  maxTokens?: number;
  temperature?: number;
  modelName?: AIModels;
  retryLimit?: number;
  stream?: {
    chunk_size: number;
    onChunk: (chunk: string) => void;
  };
  reasoning_effort?: 'low' | 'medium' | 'high';
  format?: 'markdown' | 'json' | 'xml';
  tools?: ToolDefinition[];
}): Promise<InferResponseObject<T>>;

// String output variant
async function executeInference(params: {
  env: Env;
  messages: Message[];
  agentActionName: AgentActionKey;
  context: InferenceContext;
  // ... other params same as above
}): Promise<InferResponseString>;
```

**Returns**:
```typescript
interface InferResponseObject<T> {
  object: z.infer<T>;        // Parsed object
  string: string;            // Raw response text
}

interface InferResponseString {
  string: string;            // Response text
}
```

---

#### generateBlueprint

```typescript
async function generateBlueprint(args: {
  env: Env;
  inferenceContext: InferenceContext;
  query: string;
  language: string;
  frameworks: string[];
  templateDetails: TemplateDetails;
  templateMetaInfo: TemplateSelection;
  images?: ImageAttachment[];
  stream?: {
    chunk_size: number;
    onChunk: (chunk: string) => void;
  };
}): Promise<Blueprint>;
```

---

#### selectTemplate

```typescript
async function selectTemplate(args: {
  env: Env;
  inferenceContext: InferenceContext;
  query: string;
  availableTemplates: TemplateMetadata[];
  images?: ImageAttachment[];
}): Promise<TemplateSelection>;
```

---

### Zod Schemas

#### Blueprint Schema

```typescript
const BlueprintSchema = z.object({
  title: z.string(),
  projectName: z.string(),
  description: z.string(),
  detailedDescription: z.string(),
  colorPalette: z.array(z.string()),
  views: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })),
  userFlow: z.object({
    uiLayout: z.string(),
    uiDesign: z.string(),
    userJourney: z.string(),
  }),
  dataFlow: z.string(),
  architecture: z.object({
    dataFlow: z.string(),
  }),
  pitfalls: z.array(z.string()),
  frameworks: z.array(z.string()),
  implementationRoadmap: z.array(z.object({
    phase: z.string(),
    description: z.string(),
  })),
  initialPhase: PhaseConceptSchema,
});
```

---

#### Phase Concept Schema

```typescript
const PhaseConceptSchema = z.object({
  name: z.string().describe('Name of the phase'),
  description: z.string().describe('Description of the phase'),
  files: z.array(FileConceptSchema),
  lastPhase: z.boolean(),
});

const FileConceptSchema = z.object({
  path: z.string(),
  purpose: z.string(),
  changes: z.string().nullable(),
});
```

---

#### Code Review Schema

```typescript
const CodeReviewOutput = z.object({
  dependenciesNotMet: z.array(z.string()),
  issuesFound: z.boolean(),
  frontendIssues: z.array(z.string()),
  backendIssues: z.array(z.string()),
  filesToFix: z.array(z.object({
    filePath: z.string(),
    issues: z.array(z.string()),
    require_code_changes: z.boolean(),
  })),
  commands: z.array(z.string()),
});
```

---

### Constants

```typescript
// WebSocket message types
export const WebSocketMessageResponses = {
  GENERATION_STARTED: 'generation_started',
  GENERATION_COMPLETE: 'generation_complete',
  PHASE_GENERATING: 'phase_generating',
  PHASE_GENERATED: 'phase_generated',
  PHASE_IMPLEMENTING: 'phase_implementing',
  PHASE_IMPLEMENTED: 'phase_implemented',
  FILE_GENERATING: 'file_generating',
  FILE_CHUNK_GENERATED: 'file_chunk_generated',
  FILE_GENERATED: 'file_generated',
  CODE_REVIEWING: 'code_reviewing',
  CODE_REVIEWED: 'code_reviewed',
  DEPLOYMENT_STARTED: 'deployment_started',
  DEPLOYMENT_COMPLETED: 'deployment_completed',
  ERROR: 'error',
  // ... more types
};

// Limits
export const MAX_PHASES = 10;
export const MAX_DEPLOYMENT_RETRIES = 5;
export const MAX_LLM_MESSAGES = 100;
export const MAX_TOOL_CALLING_DEPTH = 7;

// Model identifiers
export enum AIModels {
  CLAUDE_SONNET_4_5 = 'claude-sonnet-4-5',
  CLAUDE_SONNET_3_7 = 'claude-sonnet-3-7',
  GPT_4O = 'gpt-4o',
  GPT_4O_MINI = 'gpt-4o-mini',
  GEMINI_2_5_PRO = 'gemini-2.5-pro-002',
  GEMINI_2_5_FLASH = 'gemini-2.5-flash-002',
  OPENAI_O1 = 'o1',
  OPENAI_O3_MINI = 'o3-mini',
}
```

---

## Integration Guide

### Frontend Integration

#### 1. Initialize Agent

**Endpoint**: `POST /api/agent`

**Request**:
```typescript
interface InitializeAgentRequest {
  query: string;          // User's project description
  images?: string[];      // Base64-encoded images (optional)
}
```

**Response**:
```typescript
interface InitializeAgentResponse {
  agentId: string;        // Unique agent identifier
  sessionId: string;      // Session identifier
  websocketUrl: string;   // WebSocket connection URL
  status: 'initializing' | 'ready';
}
```

**Example**:
```typescript
const response = await fetch('/api/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'Build a task management app with calendar view',
    images: [base64Image1, base64Image2],
  }),
});

const { agentId, websocketUrl } = await response.json();
```

---

#### 2. Connect to WebSocket

**Endpoint**: `GET /api/agent/:agentId/ws`

**Protocol**: WebSocket (RFC 6455)

**Example**:
```typescript
const ws = new WebSocket(websocketUrl);

ws.onopen = () => {
  console.log('Connected to agent');

  // Start generation
  ws.send(JSON.stringify({
    type: 'generate_all',
    data: {},
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  handleAgentMessage(message);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected from agent');
};
```

---

#### 3. Handle Agent Messages

```typescript
function handleAgentMessage(message: WebSocketMessage) {
  switch (message.type) {
    case 'generation_started':
      // Show loading indicator
      break;

    case 'phase_generating':
      // Update UI: "Planning Phase X..."
      console.log('Planning phase:', message.data.phaseName);
      break;

    case 'phase_implementing':
      // Update UI: "Implementing Phase X..."
      console.log('Implementing phase:', message.data.phaseName);
      break;

    case 'file_generating':
      // Show file in file tree
      addFileToTree(message.data.filePath, message.data.purpose);
      break;

    case 'file_chunk_generated':
      // Stream file content to editor
      appendFileContent(message.data.filePath, message.data.chunk);
      break;

    case 'file_generated':
      // Mark file as complete
      markFileComplete(message.data.filePath);
      break;

    case 'deployment_started':
      // Show deployment progress
      break;

    case 'deployment_completed':
      // Show preview URL
      openPreview(message.data.previewUrl);
      break;

    case 'runtime_error_found':
      // Display error in console
      showError(message.data.error);
      break;

    case 'code_reviewed':
      // Show review results
      displayReview(message.data.review);
      break;

    case 'error':
      // Show error notification
      showNotification('error', message.data.message);
      break;

    case 'generation_complete':
      // Hide loading, show success
      showNotification('success', 'Project generation complete!');
      break;
  }
}
```

---

#### 4. Send User Feedback

```typescript
// Send text suggestion
function submitUserFeedback(feedback: string) {
  ws.send(JSON.stringify({
    type: 'user_suggestion',
    data: {
      message: feedback,
    },
  }));
}

// Send feedback with images
function submitUserFeedbackWithImages(feedback: string, images: File[]) {
  // Convert images to base64
  Promise.all(images.map(fileToBase64)).then(base64Images => {
    ws.send(JSON.stringify({
      type: 'user_suggestion',
      data: {
        message: feedback,
        images: base64Images.map((data, i) => ({
          mimeType: images[i].type,
          base64Data: data,
        })),
      },
    }));
  });
}

// Request code review
function requestCodeReview() {
  ws.send(JSON.stringify({
    type: 'code_review',
    data: { autoFix: true },
  }));
}

// Deploy to Cloudflare
function deployToCloudflare() {
  ws.send(JSON.stringify({
    type: 'deploy',
    data: {},
  }));
}
```

---

### Backend Integration

#### 1. Access Agent State

```typescript
import { getAgentState } from './worker/agents';

// Get agent state
const state = await getAgentState(env, agentId, true);

console.log('Blueprint:', state.blueprint);
console.log('Generated files:', Object.keys(state.generatedFilesMap));
console.log('Current phase:', state.currentDevState);
```

---

#### 2. Clone Agent

```typescript
import { cloneAgent } from './worker/agents';

// Clone existing agent to new session
const { newAgentId, newAgent } = await cloneAgent(env, originalAgentId, logger);

console.log('Cloned agent ID:', newAgentId);

// Original and cloned agents have same blueprint and files
// but independent sandbox instances and user inputs
```

---

#### 3. Custom Operations

Add custom operations to extend functionality:

```typescript
// In worker/agents/operations/MyCustomOperation.ts
export class MyCustomOperation extends AgentOperation<MyInputs, MyOutputs> {
  async execute(inputs: MyInputs, options: OperationOptions): Promise<MyOutputs> {
    // Your custom logic
    return { result: 'success' };
  }
}

// Register in SmartCodeGeneratorAgent
protected operations = {
  ...existingOperations,
  myCustomOperation: new MyCustomOperation(),
};

// Use in agent methods
async performCustomTask() {
  const result = await this.operations.myCustomOperation.execute(
    { data: 'input' },
    this.getOperationOptions()
  );
}
```

---

#### 4. Sandbox Integration

Interact with the code execution environment:

```typescript
// Get sandbox client
const sandboxClient = await getSandboxService(sandboxSessionId);

// Deploy files
const deployResult = await sandboxClient.deploy({
  files: generatedFiles,
  commitMessage: 'Initial implementation',
});

// Get preview URL
const previewUrl = deployResult.previewUrl;

// Execute commands
const commandResult = await sandboxClient.executeCommand({
  command: 'bun install',
  workingDir: '/project',
});

// Get logs
const logs = await sandboxClient.getLogs({
  since: Date.now() - 60000, // Last minute
});

// Capture screenshot
const screenshot = await sandboxClient.captureScreenshot({
  url: previewUrl,
  viewport: { width: 1920, height: 1080 },
});
```

---

#### 5. Database Integration

Store and retrieve agent data:

```typescript
import { AppService } from './worker/database';

const appService = new AppService(env);

// Save app metadata
await appService.createApp({
  id: agentId,
  userId: userId,
  title: blueprint.title,
  description: blueprint.description,
  originalPrompt: query,
  framework: blueprint.frameworks[0],
  visibility: 'private',
  status: 'generating',
});

// Update app status
await appService.updateApp(agentId, {
  status: 'completed',
  previewUrl: previewUrl,
});

// Get user's apps
const userApps = await appService.getUserApps(userId, {
  limit: 10,
  offset: 0,
  orderBy: 'createdAt',
  order: 'desc',
});
```

---

#### 6. Model Configuration

Customize AI model usage per user:

```typescript
import { ModelConfigService } from './worker/database/services/ModelConfigService';

const modelConfigService = new ModelConfigService(env);

// Set user-specific model config
await modelConfigService.setUserModelConfig(userId, 'phaseImplementation', {
  name: 'gpt-4o',
  temperature: 0.3,
  max_tokens: 8000,
});

// Get user's model configs
const configs = await modelConfigService.getUserModelConfigs(userId);

// Load configs into inference context
const inferenceContext: InferenceContext = {
  userId,
  agentId,
  sessionId,
  userModelConfigs: configs,
};
```

---

### Testing

#### Unit Testing Operations

```typescript
import { PhaseGenerationOperation } from './worker/agents/operations/PhaseGeneration';
import { IssueReport } from './worker/agents/domain/values/IssueReport';
import { GenerationContext } from './worker/agents/domain/values/GenerationContext';

describe('PhaseGenerationOperation', () => {
  it('should generate next phase with no errors', async () => {
    const operation = new PhaseGenerationOperation();

    const inputs = {
      issues: new IssueReport([], { lint: [], typecheck: [] }, []),
      userContext: undefined,
    };

    const options = createMockOptions();

    const result = await operation.execute(inputs, options);

    expect(result.name).toBeTruthy();
    expect(result.files.length).toBeGreaterThan(0);
  });

  it('should prioritize runtime errors in phase planning', async () => {
    const operation = new PhaseGenerationOperation();

    const inputs = {
      issues: new IssueReport(
        [{ message: 'TypeError: undefined', stack: '...' }],
        { lint: [], typecheck: [] },
        []
      ),
    };

    const result = await operation.execute(inputs, createMockOptions());

    expect(result.name.toLowerCase()).toContain('fix');
  });
});
```

---

#### Integration Testing Agents

```typescript
import { SmartCodeGeneratorAgent } from './worker/agents/core/smartGeneratorAgent';

describe('SmartCodeGeneratorAgent', () => {
  let agent: SmartCodeGeneratorAgent;
  let env: Env;

  beforeEach(() => {
    env = createMockEnv();
    agent = new SmartCodeGeneratorAgent(/* ... */);
  });

  it('should initialize with blueprint', async () => {
    const initArgs = createMockInitArgs();

    await agent.initialize(initArgs);

    expect(agent.state.blueprint.title).toBeTruthy();
    expect(agent.state.sandboxInstanceId).toBeTruthy();
  });

  it('should generate files phase-wise', async () => {
    await agent.initialize(createMockInitArgs());

    const fileGeneratedSpy = jest.fn();
    agent.on('file_generated', fileGeneratedSpy);

    await agent.generateAllFiles(1);

    expect(fileGeneratedSpy).toHaveBeenCalled();
    expect(agent.state.generatedPhases.length).toBeGreaterThan(0);
  });
});
```

---

### Monitoring & Observability

#### Structured Logging

All agents and operations use structured logging:

```typescript
// Logs are automatically formatted with context
this.logger().info('Starting phase implementation', {
  phaseName: phase.name,
  fileCount: phase.files.length,
  phaseIndex: this.state.generatedPhases.length,
});

this.logger().error('Deployment failed', error, {
  sandboxId: this.state.sandboxInstanceId,
  retryCount: 3,
});
```

**Log Format**:
```json
{
  "timestamp": "2025-10-13T12:34:56.789Z",
  "level": "info",
  "logger": "CodeGeneratorAgent",
  "objectId": "agent-abc123",
  "message": "Starting phase implementation",
  "data": {
    "phaseName": "User Authentication",
    "fileCount": 5,
    "phaseIndex": 2,
    "sessionId": "sess-xyz789",
    "userId": "user-123"
  }
}
```

---

#### Metrics Collection

Key metrics to monitor:

- **Generation Metrics**:
  - Time to first file generated
  - Total generation time per phase
  - Files generated per phase
  - Total tokens used

- **Quality Metrics**:
  - Runtime errors per phase
  - Lint issues per phase
  - Code review fix rate
  - User satisfaction feedback

- **Performance Metrics**:
  - Agent response time
  - WebSocket message latency
  - Deployment time
  - Sandbox startup time

---

#### Error Tracking

Errors are categorized and tracked:

```typescript
// Runtime errors from sandbox
interface RuntimeError {
  message: string;
  stack: string;
  timestamp: number;
  source: 'browser' | 'server' | 'build';
}

// Static analysis issues
interface StaticAnalysisIssue {
  file: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
  rule: string;
}

// Agent operation errors
class OperationError extends Error {
  constructor(
    message: string,
    public operation: string,
    public context: Record<string, any>
  ) {
    super(message);
  }
}
```

---

## Appendix

### Glossary

- **Agent**: Durable Object that orchestrates code generation
- **Operation**: Stateless service that executes specific AI-driven tasks
- **Assistant**: Stateful helper with conversation memory
- **Blueprint**: Product Requirements Document (PRD) with design specs
- **Phase**: Incremental development milestone with specific files
- **SCOF**: Shell Command Output Format for streaming files
- **Sandbox**: Isolated environment for code execution and preview
- **Inference Context**: User identification and model configuration
- **Generation Context**: Complete project context for operations
- **Issue Report**: Aggregated errors and problems from multiple sources

---

### File Locations Reference

| Component | Location |
|-----------|----------|
| Main Agent | `/worker/agents/core/smartGeneratorAgent.ts` |
| State Definitions | `/worker/agents/core/state.ts` |
| Operations | `/worker/agents/operations/` |
| Assistants | `/worker/agents/assistants/` |
| Schemas | `/worker/agents/schemas.ts` |
| Prompts | `/worker/agents/prompts.ts` |
| Inference | `/worker/agents/inferutils/` |
| Output Formats | `/worker/agents/output-formats/` |
| Services | `/worker/agents/services/` |
| Domain Logic | `/worker/agents/domain/` |
| Tools | `/worker/agents/tools/` |
| Planning | `/worker/agents/planning/` |
| API Endpoints | `/worker/api/` |
| Database | `/worker/database/` |
| Sandbox Integration | `/worker/services/sandbox/` |

---

### Related Documentation

- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Anthropic Claude API](https://docs.anthropic.com/en/api/messages)
- [OpenAI GPT API](https://platform.openai.com/docs/api-reference)
- [Google Gemini API](https://ai.google.dev/docs)
- [Zod Schema Validation](https://zod.dev/)
- [WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)

---

**Document Version**: 1.0.0
**Last Updated**: October 13, 2025
**Maintained by**: Dreamforge Development Team
