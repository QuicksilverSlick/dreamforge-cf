# BYOP Developer Guide - Quick Reference

## Quick Start: Using Real-Time Progress

### 1. Import a Repository

```tsx
import { useImportRepository, useAnalysisStatus } from '@/hooks/use-byop';
import { AnalysisProgress } from '@/components/byop/AnalysisProgress';

function MyComponent() {
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const { importRepository, loading } = useImportRepository();
  const { status } = useAnalysisStatus(analysisId);

  const handleImport = async () => {
    const result = await importRepository({
      repositoryUrl: 'https://github.com/user/repo',
      branch: 'main'
    });

    if (result) {
      setAnalysisId(result.analysisId);
    }
  };

  return (
    <div>
      <button onClick={handleImport} disabled={loading}>
        Start Analysis
      </button>

      {status && (
        <AnalysisProgress
          status={status}
          onViewBlueprint={() => console.log('View blueprint')}
          onCancel={() => setAnalysisId(null)}
          blueprintReady={status.status === 'completed'}
        />
      )}
    </div>
  );
}
```

### 2. Access Real-Time Updates

```tsx
const { status, loading, error } = useAnalysisStatus(analysisId);

// status contains:
status.progress        // 0-100
status.currentPhase    // "Analyzing package.json"
status.status          // 'pending' | 'analyzing' | 'completed' | 'failed'
status.fileCount       // Number of files analyzed
status.repositoryName  // "my-repo"
status.analysisResult  // Available when completed
status.error           // Error message if failed
```

## Hook Reference

### useGitHubRepositories()

Fetches user's GitHub repositories (requires authentication).

```tsx
const { repositories, loading, error, refetch } = useGitHubRepositories();

// Returns:
repositories: GitHubRepository[]  // Array of repos
loading: boolean                  // Loading state
error: string | null              // Error message
refetch: () => Promise<void>      // Retry function
```

### useImportRepository()

Initiates repository import with automatic retry logic.

```tsx
const { importRepository, loading, error, retryCount } = useImportRepository();

// Usage:
const result = await importRepository({
  repositoryUrl: 'https://github.com/user/repo',
  branch: 'main'  // optional, defaults to default branch
});

// Returns:
result: {
  success: boolean
  analysisId: string
  repositoryName: string
  filesCount: number
  message: string
} | null
```

**Features:**
- Automatic retry on network errors (max 3 attempts)
- Exponential backoff (1s, 2s, 4s)
- Retries on 5xx errors and network failures

### useAnalysisStatus(analysisId)

Monitors analysis with WebSocket + polling fallback.

```tsx
const { status, loading, error, refetch } = useAnalysisStatus(analysisId);

// Status object:
status: {
  repositoryUrl: string
  repositoryName: string
  status: 'pending' | 'analyzing' | 'completed' | 'failed'
  progress: number              // 0-100
  currentPhase: string          // Current phase description
  fileCount: number             // Total files
  analysisResult?: {            // Available when completed
    framework: string
    dependencies: Record<string, string>
    sourceFiles: SourceFileInfo[]
    blueprint: GeneratedBlueprint
    // ... more fields
  }
  error?: string                // Error message if failed
}
```

**Connection Management:**
1. Automatically connects via WebSocket
2. Falls back to polling after 3 failed reconnection attempts
3. Reconnects with exponential backoff (1s, 2s, 4s, max 10s)
4. Auto-cleanup on unmount

### useBlueprint(analysisId)

Fetches completed blueprint (only use when status === 'completed').

```tsx
const { blueprint, loading, error, refetch } = useBlueprint(analysisId);

// Blueprint structure:
blueprint: {
  projectName: string
  description: string
  currentState: {
    framework: string
    totalFiles: number
    completenessPercentage: number
    implementedFeatures: string[]
    missingComponents: string[]
  }
  recommendations: Recommendation[]
  nextSteps: string[]
  technicalDebt: string[]
  completionPhases: CompletionPhase[]
}
```

## Component Reference

### AnalysisProgress

Real-time progress display with phase visualization.

```tsx
<AnalysisProgress
  status={analysisStatus}
  onViewBlueprint={() => handleViewBlueprint()}
  onCancel={() => handleCancel()}
  blueprintReady={analysisStatus.status === 'completed'}
/>
```

**Props:**
- `status: AnalysisStateResponse` - Current analysis state
- `onViewBlueprint: () => void` - Called when user clicks "View Blueprint"
- `onCancel: () => void` - Called when user clicks cancel/back
- `blueprintReady: boolean` - Whether blueprint is ready to view

**Features:**
- Animated progress bar with color transitions
- 6-phase checklist with icons
- Real-time status updates
- Loading/success/error states
- File count display
- Estimated time remaining

### GitHubRepositoryList

Repository selection UI with import button.

```tsx
<GitHubRepositoryList
  repositories={repositories}
  loading={loadingRepos}
  error={reposError}
  selectedRepo={selectedRepo}
  onSelectRepo={(repo) => setSelectedRepo(repo)}
  onImport={(repo, branch) => handleImport(repo, branch)}
  importing={importing}
  onRefresh={() => refetchRepos()}
/>
```

### BlueprintView

Displays completed analysis results.

```tsx
<BlueprintView
  blueprint={blueprint.blueprint}
  repositoryName={analysisStatus.repositoryName}
  onBack={() => handleBack()}
  onNewImport={() => handleNewImport()}
/>
```

## Analysis Phases

| Phase | Progress | Description | Icon |
|-------|----------|-------------|------|
| 1 | 10% | Reading repository structure | FileSearch |
| 2 | 30% | Analyzing package.json | Package |
| 3 | 30% | Parsing source files with ts-morph | Code2 |
| 4 | 50% | Analyzing dependencies | Package |
| 5 | 65% | Building codebase context | FileSearch |
| 6 | 80-100% | Generating blueprint with Gemini 2.5 Pro | Brain |

## Error Handling

### Network Errors

```tsx
const { status, error } = useAnalysisStatus(analysisId);

if (error) {
  // WebSocket failed and polling failed
  // Display error to user
  console.error('Analysis connection failed:', error);
}
```

### Analysis Failures

```tsx
if (status?.status === 'failed') {
  // Analysis completed but failed
  // Error message in status.error
  console.error('Analysis failed:', status.error);

  // Offer retry option
}
```

### Timeout Handling

Analysis automatically times out after 5 minutes:
```tsx
if (status?.error?.includes('timeout')) {
  // Analysis took too long
  // Suggest retrying with smaller repo or fewer files
}
```

## Best Practices

### 1. Always Clean Up

```tsx
useEffect(() => {
  // WebSocket cleanup happens automatically
  // But you should reset state on unmount
  return () => {
    setAnalysisId(null);
  };
}, []);
```

### 2. Handle All States

```tsx
switch (status?.status) {
  case 'pending':
    return <div>Initializing...</div>;
  case 'analyzing':
    return <AnalysisProgress status={status} />;
  case 'completed':
    return <BlueprintView blueprint={blueprint} />;
  case 'failed':
    return <ErrorDisplay error={status.error} />;
  default:
    return <div>Unknown state</div>;
}
```

### 3. Provide User Feedback

```tsx
// Show retry count during import
{retryCount > 0 && importing && (
  <div className="text-yellow-400">
    Connection issue detected. Retrying... (Attempt {retryCount}/3)
  </div>
)}

// Show reconnection status
{wsReconnecting && (
  <div className="text-blue-400">
    Reconnecting to live updates...
  </div>
)}
```

### 4. Optimize Renders

```tsx
// Memoize callbacks to prevent unnecessary re-renders
const handleViewBlueprint = useCallback(() => {
  setShowBlueprint(true);
}, []);

const handleCancel = useCallback(() => {
  setAnalysisId(null);
  setSelectedRepo(null);
}, []);
```

## API Endpoints

### POST /api/byop/import
Initiates repository import.

**Request:**
```json
{
  "repositoryUrl": "https://github.com/user/repo",
  "branch": "main"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "analysisId": "abc123",
    "repositoryName": "my-repo",
    "filesCount": 42,
    "message": "Analysis started"
  }
}
```

### WebSocket: /api/byop/analysis/:analysisId/ws
Real-time progress updates.

**Messages:**
```json
{
  "type": "progress",
  "data": {
    "repositoryUrl": "https://github.com/user/repo",
    "repositoryName": "my-repo",
    "status": "analyzing",
    "progress": 50,
    "currentPhase": "Analyzing dependencies",
    "fileCount": 42
  }
}
```

### GET /api/byop/analysis/:analysisId/status
Polling fallback endpoint.

**Response:**
```json
{
  "success": true,
  "data": {
    "repositoryUrl": "https://github.com/user/repo",
    "repositoryName": "my-repo",
    "status": "analyzing",
    "progress": 50,
    "currentPhase": "Analyzing dependencies",
    "fileCount": 42
  }
}
```

### GET /api/byop/analysis/:analysisId/blueprint
Get completed blueprint.

**Response:**
```json
{
  "success": true,
  "data": {
    "blueprint": {
      "projectName": "my-repo",
      "description": "...",
      "currentState": {...},
      "recommendations": [...],
      "nextSteps": [...],
      "completionPhases": [...]
    }
  }
}
```

## Debugging

### View WebSocket Messages

1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. Click on the WebSocket connection
5. View Messages tab to see real-time updates

### Check Polling Fallback

```tsx
// Add logging to see when polling is active
const { status } = useAnalysisStatus(analysisId);

useEffect(() => {
  if (status) {
    console.log('Status update:', {
      progress: status.progress,
      phase: status.currentPhase,
      source: 'WebSocket or Polling'  // Can't tell from hook
    });
  }
}, [status]);
```

### Monitor Reconnection Attempts

Check browser console for:
```
WebSocket connected for analysis: abc123
WebSocket closed: 1006
Reconnecting WebSocket in 1000ms (attempt 1/3)
Max reconnection attempts reached, falling back to polling
```

## Performance Tips

### 1. Conditional Rendering

```tsx
// Don't render progress component until status is available
{status && <AnalysisProgress status={status} />}
```

### 2. Debounce State Updates

```tsx
// If you're logging every progress update, debounce it
const debouncedLog = useMemo(
  () => debounce((progress) => console.log(progress), 500),
  []
);

useEffect(() => {
  if (status?.progress) {
    debouncedLog(status.progress);
  }
}, [status?.progress, debouncedLog]);
```

### 3. Lazy Load Components

```tsx
const BlueprintView = lazy(() =>
  import('@/components/byop/BlueprintView')
);

// Only load when needed
{showBlueprint && (
  <Suspense fallback={<LoadingSpinner />}>
    <BlueprintView blueprint={blueprint} />
  </Suspense>
)}
```

## Common Issues

### Issue: WebSocket not connecting

**Solution:**
1. Check authentication is valid
2. Verify analysisId is correct
3. Check browser console for errors
4. Ensure no ad blockers are blocking WebSocket
5. Try polling fallback (should happen automatically)

### Issue: Progress stuck at certain percentage

**Solution:**
1. Check if analysis timed out (5 min max)
2. Verify Gemini API is responding (Phase 6)
3. Check Durable Object logs
4. Try with smaller repository

### Issue: Reconnection not working

**Solution:**
1. Check if max attempts (3) exceeded
2. Verify polling fallback is active
3. Check network connectivity
4. Try refreshing page

## TypeScript Types

All types are in `/src/api-types-byop.ts`:

```typescript
import type {
  GitHubRepository,
  ImportRepositoryRequest,
  ImportRepositoryResponse,
  AnalysisStateResponse,
  AnalysisStatus,
  CodebaseAnalysisResult,
  GeneratedBlueprint,
  Recommendation,
  CompletionPhase,
  BlueprintResponse
} from '@/api-types-byop';
```

## Testing

### Manual Testing Script

```tsx
function TestBYOP() {
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const { importRepository } = useImportRepository();
  const { status } = useAnalysisStatus(analysisId);

  const runTest = async () => {
    console.log('1. Starting import...');
    const result = await importRepository({
      repositoryUrl: 'https://github.com/cloudflare/workers-sdk',
      branch: 'main'
    });

    if (result) {
      console.log('2. Analysis started:', result.analysisId);
      setAnalysisId(result.analysisId);
    }
  };

  useEffect(() => {
    if (status) {
      console.log('3. Progress update:', {
        progress: status.progress,
        phase: status.currentPhase,
        status: status.status
      });

      if (status.status === 'completed') {
        console.log('4. Analysis complete!', status.analysisResult);
      }

      if (status.status === 'failed') {
        console.error('4. Analysis failed:', status.error);
      }
    }
  }, [status]);

  return <button onClick={runTest}>Run Test</button>;
}
```

## Production Checklist

Before deploying BYOP feature:

- [ ] Test WebSocket connection on staging
- [ ] Verify polling fallback works
- [ ] Test reconnection logic
- [ ] Check timeout handling (5 min)
- [ ] Test with large repositories (50MB limit)
- [ ] Test with many files (1000 file limit)
- [ ] Verify error messages are user-friendly
- [ ] Test on mobile devices
- [ ] Test with slow network (throttling)
- [ ] Verify authentication requirements
- [ ] Check rate limiting
- [ ] Test concurrent analyses
- [ ] Verify Gemini API integration
- [ ] Test blueprint generation quality
- [ ] Check analytics tracking
- [ ] Verify CORS if needed
