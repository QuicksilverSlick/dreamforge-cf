# BYOP WebSocket Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          User Browser                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Import Page Component  (/src/routes/import.tsx)                 │  │
│  │                                                                   │  │
│  │  - Manages analysisId state                                      │  │
│  │  - Coordinates child components                                  │  │
│  │  - Handles view transitions                                      │  │
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               │                                         │
│                               ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  useAnalysisStatus Hook  (/src/hooks/use-byop.ts)                │  │
│  │                                                                   │  │
│  │  State:                                                           │  │
│  │  - status: AnalysisStateResponse | null                          │  │
│  │  - loading: boolean                                               │  │
│  │  - error: string | null                                           │  │
│  │                                                                   │  │
│  │  Refs:                                                            │  │
│  │  - wsRef: WebSocket | null                                        │  │
│  │  - intervalRef: NodeJS.Timeout | null (polling fallback)         │  │
│  │  - reconnectTimeoutRef: NodeJS.Timeout | null                    │  │
│  │  - reconnectAttempts: number (max 3)                             │  │
│  └────────────────┬─────────────────────────────┬───────────────────┘  │
│                   │                             │                       │
│                   ▼                             ▼                       │
│  ┌────────────────────────────┐   ┌──────────────────────────────┐    │
│  │  WebSocket Connection      │   │  HTTP Polling (Fallback)     │    │
│  │                            │   │                              │    │
│  │  ws://host/api/byop/       │   │  GET /api/byop/analysis/     │    │
│  │    analysis/:id/ws         │   │    :id/status                │    │
│  │                            │   │                              │    │
│  │  Events:                   │   │  Interval: 5 seconds         │    │
│  │  - open: Stop polling      │   │  Stop when: Completed/Failed │    │
│  │  - message: Update state   │   │                              │    │
│  │  - close: Reconnect/Poll   │   │                              │    │
│  │  - error: Fall back        │   │                              │    │
│  └────────────┬───────────────┘   └────────────┬─────────────────┘    │
│               │                                │                       │
│               └────────────────┬───────────────┘                       │
│                                │                                       │
│                                ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  AnalysisProgress Component  (/src/components/byop/)             │  │
│  │                                                                   │  │
│  │  - Progress bar (0-100%)                                         │  │
│  │  - Current phase display                                         │  │
│  │  - Phase checklist with icons                                    │  │
│  │  - File count                                                    │  │
│  │  - Status icon (Loading/Success/Error)                           │  │
│  │  - Action buttons                                                │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ WebSocket/HTTP
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Cloudflare Workers Edge                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Worker Entry Point  (/worker/index.ts)                          │  │
│  │                                                                   │  │
│  │  - Routes requests via Hono router                               │  │
│  │  - Applies authentication middleware                             │  │
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               │                                         │
│                               ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  BYOP Routes  (/worker/api/routes/byopRoutes.ts)                 │  │
│  │                                                                   │  │
│  │  WebSocket Route:                                                │  │
│  │  GET /api/byop/analysis/:analysisId/ws                           │  │
│  │  - Validates Upgrade header                                      │  │
│  │  - Gets CodebaseAnalyzer DO stub                                 │  │
│  │  - Forwards request to DO                                        │  │
│  │                                                                   │  │
│  │  Status Route:                                                   │  │
│  │  GET /api/byop/analysis/:analysisId/status                       │  │
│  │  - Polling fallback endpoint                                     │  │
│  │  - Returns same data as WebSocket                                │  │
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               │                                         │
│                               ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  BYOPController  (/worker/api/controllers/byop/)                 │  │
│  │                                                                   │  │
│  │  - initiateImport(): Creates analysis, returns ID                │  │
│  │  - getAnalysisStatus(): Fetches DO state                         │  │
│  │  - getBlueprint(): Returns completed result                      │  │
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               │                                         │
└───────────────────────────────┼─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              Durable Object: CodebaseAnalyzer                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  CodebaseAnalyzer  (/worker/agents/analyzer/codebaseAnalyzer.ts)│  │
│  │                                                                   │  │
│  │  State Management:                                               │  │
│  │  - this.state: AnalysisState                                     │  │
│  │  - this.ctx.storage: Durable Object storage                      │  │
│  │  - this.webSockets: Set<WebSocket>                               │  │
│  │                                                                   │  │
│  │  WebSocket Management:                                           │  │
│  │  - handleWebSocketUpgrade(): Creates WebSocket pair             │  │
│  │  - acceptWebSocket(): Adds to Set<WebSocket>                    │  │
│  │  - broadcastProgress(): Sends to all connected clients          │  │
│  │  - Cleanup: Removes closed connections                          │  │
│  │                                                                   │  │
│  │  Analysis Flow:                                                  │  │
│  │  1. startAnalysis()                                              │  │
│  │     - Validate input (size limits, file counts)                 │  │
│  │     - Initialize state                                           │  │
│  │     - Start async analysis                                       │  │
│  │                                                                   │  │
│  │  2. executeAnalysis()                                            │  │
│  │     ┌─────────────────────────────────────────────────────────┐ │  │
│  │     │ Phase 1: Reading repository structure (10%)             │ │  │
│  │     │ - updateState() → broadcastProgress()                   │ │  │
│  │     └─────────────────────────────────────────────────────────┘ │  │
│  │     ┌─────────────────────────────────────────────────────────┐ │  │
│  │     │ Phase 2: Analyzing package.json (30%)                   │ │  │
│  │     │ - updateState() → broadcastProgress()                   │ │  │
│  │     └─────────────────────────────────────────────────────────┘ │  │
│  │     ┌─────────────────────────────────────────────────────────┐ │  │
│  │     │ Phase 3: Parsing source files with ts-morph (30%)       │ │  │
│  │     │ - CodeAnalysisService.analyzeSourceFiles()              │ │  │
│  │     │ - updateState() → broadcastProgress()                   │ │  │
│  │     └─────────────────────────────────────────────────────────┘ │  │
│  │     ┌─────────────────────────────────────────────────────────┐ │  │
│  │     │ Phase 4: Analyzing dependencies (50%)                   │ │  │
│  │     │ - detectFramework()                                      │ │  │
│  │     │ - detectPackageManager()                                │ │  │
│  │     │ - updateState() → broadcastProgress()                   │ │  │
│  │     └─────────────────────────────────────────────────────────┘ │  │
│  │     ┌─────────────────────────────────────────────────────────┐ │  │
│  │     │ Phase 5: Building codebase context (65%)                │ │  │
│  │     │ - Build CodebaseContext object                          │ │  │
│  │     │ - updateState() → broadcastProgress()                   │ │  │
│  │     └─────────────────────────────────────────────────────────┘ │  │
│  │     ┌─────────────────────────────────────────────────────────┐ │  │
│  │     │ Phase 6: Generating blueprint with Gemini (80-100%)     │ │  │
│  │     │ - BlueprintGenerationService.generateBlueprint()        │ │  │
│  │     │ - env.AI (Cloudflare AI binding)                        │ │  │
│  │     │ - updateState() → broadcastProgress()                   │ │  │
│  │     └─────────────────────────────────────────────────────────┘ │  │
│  │                                                                   │  │
│  │  3. Complete/Fail                                                │  │
│  │     - Mark status as 'completed' or 'failed'                    │  │
│  │     - Final broadcastProgress()                                 │  │
│  │     - Close WebSocket connections                               │  │
│  │                                                                   │  │
│  │  Error Handling:                                                 │  │
│  │  - Timeout after 5 minutes                                       │  │
│  │  - Broadcast error state                                         │  │
│  │  - Preserve state for retry                                      │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## WebSocket Message Flow

```
Frontend                        Worker                    Durable Object
   │                              │                             │
   │  1. POST /api/byop/import    │                             │
   ├─────────────────────────────>│                             │
   │                              │  startAnalysis()            │
   │                              ├────────────────────────────>│
   │                              │                             │ Initialize state
   │  analysisId: "abc123"        │<────────────────────────────┤ Start async analysis
   │<─────────────────────────────┤                             │
   │                              │                             │
   │  2. Connect WebSocket        │                             │
   │  ws://.../analysis/abc123/ws │                             │
   ├─────────────────────────────>│  Forward to DO              │
   │                              ├────────────────────────────>│
   │                              │                             │ Accept WebSocket
   │  WebSocket: OPEN             │                             │ Add to Set<WS>
   │<─────────────────────────────┴─────────────────────────────┤
   │                                                            │
   │  3. Phase 1 starts                                         │
   │  { progress: 10, phase: "Reading repository..." }          │
   │<───────────────────────────────────────────────────────────┤ updateState()
   │                                                            │ broadcastProgress()
   │  4. Phase 2 starts                                         │
   │  { progress: 30, phase: "Analyzing package.json" }         │
   │<───────────────────────────────────────────────────────────┤
   │                                                            │
   │  5. Phase 3 starts                                         │
   │  { progress: 30, phase: "Parsing source files..." }        │
   │<───────────────────────────────────────────────────────────┤
   │                                                            │
   │  6. Phase 4 starts                                         │
   │  { progress: 50, phase: "Analyzing dependencies" }         │
   │<───────────────────────────────────────────────────────────┤
   │                                                            │
   │  7. Phase 5 starts                                         │
   │  { progress: 65, phase: "Building codebase context" }      │
   │<───────────────────────────────────────────────────────────┤
   │                                                            │
   │  8. Phase 6 starts                                         │
   │  { progress: 80, phase: "Generating blueprint..." }        │
   │<───────────────────────────────────────────────────────────┤
   │                                                            │ Gemini API call
   │                                                            │ (10-30 seconds)
   │  9. Completed                                              │
   │  { progress: 100, status: "completed", result: {...} }     │
   │<───────────────────────────────────────────────────────────┤
   │                                                            │
   │  WebSocket: CLOSE                                          │
   │<───────────────────────────────────────────────────────────┤ Close connection
   │                                                            │
```

## Reconnection Flow

```
Frontend                        Worker                    Durable Object
   │                              │                             │
   │  WebSocket: OPEN             │                             │
   │<─────────────────────────────┴─────────────────────────────┤
   │  { progress: 30 }                                          │
   │<───────────────────────────────────────────────────────────┤
   │                                                            │
   │  ❌ Connection Lost (network issue)                        │
   │                                                            │
   │  WebSocket: CLOSE                                          │
   │                                                            │
   │  Attempt 1: Wait 1s                                        │
   │  ⏱  ...                                                     │
   │                                                            │
   │  Reconnect WebSocket                                       │
   ├───────────────────────────────────────────────────────────>│
   │                                                            │
   │  ❌ Failed                                                  │
   │                                                            │
   │  Attempt 2: Wait 2s                                        │
   │  ⏱  ...                                                     │
   │                                                            │
   │  Reconnect WebSocket                                       │
   ├───────────────────────────────────────────────────────────>│
   │                                                            │
   │  ❌ Failed                                                  │
   │                                                            │
   │  Attempt 3: Wait 4s                                        │
   │  ⏱  ...                                                     │
   │                                                            │
   │  Reconnect WebSocket                                       │
   ├───────────────────────────────────────────────────────────>│
   │                                                            │
   │  ❌ Failed (Max attempts reached)                          │
   │                                                            │
   │  Fall back to HTTP polling                                 │
   │  GET /api/byop/analysis/abc123/status                      │
   ├─────────────────────────────>│                             │
   │                              │  getState()                 │
   │                              ├────────────────────────────>│
   │  { progress: 50 }            │<────────────────────────────┤
   │<─────────────────────────────┤                             │
   │                              │                             │
   │  ⏱  Wait 5s...                │                             │
   │                              │                             │
   │  GET /api/byop/analysis/abc123/status                      │
   ├─────────────────────────────>│                             │
   │  { progress: 65 }            │                             │
   │<─────────────────────────────┤                             │
   │                              │                             │
```

## State Transitions

```
┌─────────┐
│ pending │  Initial state when analysis is created
└────┬────┘
     │
     ▼
┌───────────┐
│ analyzing │  Analysis in progress (phases 1-6)
└─────┬─────┘
      │
      ├──────────┐
      ▼          ▼
┌───────────┐  ┌────────┐
│ completed │  │ failed │  Terminal states
└───────────┘  └────────┘
```

## Progress Milestones

```
0%    ├─────────┼─────────┼─────────┼─────────┼─────────┤ 100%
      10%       30%       50%       65%       80%

      │         │         │         │         │
      ▼         ▼         ▼         ▼         ▼
   Reading   Package   Deps    Context  Gemini
   Repo      JSON
```

## Component Hierarchy

```
ImportPage (/src/routes/import.tsx)
│
├─ useGitHubRepositories()
│  └─ GET /api/byop/repositories
│
├─ useImportRepository()
│  └─ POST /api/byop/import
│     └─ Returns analysisId
│
├─ useAnalysisStatus(analysisId)
│  ├─ WebSocket to /api/byop/analysis/:id/ws
│  └─ Polling to /api/byop/analysis/:id/status
│
├─ GitHubRepositoryList (if !analysisId)
│  └─ Shows repo selection UI
│
├─ AnalysisProgress (if analysisId && !showBlueprint)
│  ├─ Progress bar
│  ├─ Phase checklist
│  └─ Status messages
│
└─ BlueprintView (if showBlueprint)
   └─ Shows completed analysis results
```

## Key Files

### Frontend
- `/src/routes/import.tsx` - Main page component
- `/src/hooks/use-byop.ts` - All BYOP hooks including WebSocket
- `/src/components/byop/AnalysisProgress.tsx` - Progress UI
- `/src/components/byop/GitHubRepositoryList.tsx` - Repo selection
- `/src/components/byop/BlueprintView.tsx` - Results display
- `/src/api-types-byop.ts` - TypeScript type definitions

### Backend
- `/worker/api/routes/byopRoutes.ts` - Route definitions
- `/worker/api/controllers/byop/controller.ts` - Business logic
- `/worker/agents/analyzer/codebaseAnalyzer.ts` - Durable Object
- `/worker/services/analysis/CodeAnalysisService.ts` - ts-morph parsing
- `/worker/services/analysis/BlueprintGenerationService.ts` - Gemini integration

### Configuration
- `/wrangler.jsonc` - Durable Object bindings
- `/tsconfig.json` - TypeScript configuration
- `/vite.config.ts` - Vite bundler config
