/**
 * Mock Analysis State Fixtures
 * Provides sample analysis states for different stages
 */

import type { AnalysisState } from '../../worker/agents/analyzer/codebaseAnalyzer';
import { MOCK_BLUEPRINTS } from './mock-blueprints';

export const MOCK_ANALYSIS_STATES: Record<string, Partial<AnalysisState>> = {
  PENDING: {
    repositoryUrl: 'https://github.com/testuser/simple-react-app',
    repositoryName: 'simple-react-app',
    clonePath: '/app/imported-repo',
    status: 'pending',
    progress: 0,
    startedAt: new Date().toISOString()
  },

  ANALYZING_CLONE: {
    repositoryUrl: 'https://github.com/testuser/simple-react-app',
    repositoryName: 'simple-react-app',
    clonePath: '/app/imported-repo',
    status: 'analyzing',
    progress: 15,
    currentPhase: 'Cloning repository',
    startedAt: new Date(Date.now() - 5000).toISOString()
  },

  ANALYZING_FILES: {
    repositoryUrl: 'https://github.com/testuser/simple-react-app',
    repositoryName: 'simple-react-app',
    clonePath: '/app/imported-repo',
    status: 'analyzing',
    progress: 35,
    currentPhase: 'Reading file structure',
    fileCount: 42,
    startedAt: new Date(Date.now() - 15000).toISOString()
  },

  ANALYZING_CODE: {
    repositoryUrl: 'https://github.com/testuser/simple-react-app',
    repositoryName: 'simple-react-app',
    clonePath: '/app/imported-repo',
    status: 'analyzing',
    progress: 55,
    currentPhase: 'Analyzing source code with ts-morph',
    fileCount: 42,
    startedAt: new Date(Date.now() - 25000).toISOString()
  },

  ANALYZING_BLUEPRINT: {
    repositoryUrl: 'https://github.com/testuser/simple-react-app',
    repositoryName: 'simple-react-app',
    clonePath: '/app/imported-repo',
    status: 'analyzing',
    progress: 75,
    currentPhase: 'Generating blueprint with Gemini AI',
    fileCount: 42,
    startedAt: new Date(Date.now() - 35000).toISOString()
  },

  COMPLETED: {
    repositoryUrl: 'https://github.com/testuser/simple-react-app',
    repositoryName: 'simple-react-app',
    clonePath: '/app/imported-repo',
    status: 'completed',
    progress: 100,
    currentPhase: 'Analysis complete',
    fileCount: 42,
    startedAt: new Date(Date.now() - 45000).toISOString(),
    completedAt: new Date().toISOString(),
    analysisResult: {
      framework: 'react',
      packageManager: 'npm',
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0'
      },
      devDependencies: {
        '@vitejs/plugin-react': '^4.0.0',
        typescript: '^5.0.0',
        vite: '^4.3.0'
      },
      fileStructure: [
        {
          name: 'src',
          path: '/app/imported-repo/src',
          type: 'directory',
          children: [
            {
              name: 'App.tsx',
              path: '/app/imported-repo/src/App.tsx',
              type: 'file',
              size: 2048
            },
            {
              name: 'main.tsx',
              path: '/app/imported-repo/src/main.tsx',
              type: 'file',
              size: 512
            }
          ]
        }
      ],
      entryPoints: ['src/main.tsx'],
      configFiles: ['package.json', 'tsconfig.json', 'vite.config.ts'],
      sourceFiles: [
        {
          path: 'src/App.tsx',
          language: 'typescript',
          linesOfCode: 85,
          functions: ['App'],
          classes: [],
          imports: ['react', 'react-router-dom'],
          exports: ['App'],
          hasTests: false
        },
        {
          path: 'src/main.tsx',
          language: 'typescript',
          linesOfCode: 12,
          functions: [],
          classes: [],
          imports: ['react', 'react-dom/client', './App'],
          exports: [],
          hasTests: false
        }
      ],
      completionSuggestions: [
        'Add authentication system',
        'Implement unit tests',
        'Set up CI/CD pipeline'
      ],
      estimatedCompleteness: 85,
      blueprint: MOCK_BLUEPRINTS.SIMPLE_REACT
    }
  },

  FAILED_CLONE: {
    repositoryUrl: 'https://github.com/testuser/private-repo',
    repositoryName: 'private-repo',
    clonePath: '/app/imported-repo',
    status: 'failed',
    progress: 10,
    currentPhase: 'Cloning repository',
    error: 'Git clone failed: Authentication failed',
    startedAt: new Date(Date.now() - 5000).toISOString(),
    completedAt: new Date().toISOString()
  },

  FAILED_ANALYSIS: {
    repositoryUrl: 'https://github.com/testuser/complex-repo',
    repositoryName: 'complex-repo',
    clonePath: '/app/imported-repo',
    status: 'failed',
    progress: 60,
    currentPhase: 'Analyzing source code',
    fileCount: 2500,
    error: 'Analysis timeout: Repository too large (2500 files)',
    startedAt: new Date(Date.now() - 300000).toISOString(),
    completedAt: new Date().toISOString()
  },

  FAILED_AI: {
    repositoryUrl: 'https://github.com/testuser/simple-react-app',
    repositoryName: 'simple-react-app',
    clonePath: '/app/imported-repo',
    status: 'failed',
    progress: 80,
    currentPhase: 'Generating blueprint',
    fileCount: 42,
    error: 'Gemini API rate limit exceeded. Please try again later.',
    startedAt: new Date(Date.now() - 40000).toISOString(),
    completedAt: new Date().toISOString()
  }
} as const;

/**
 * WebSocket progress message samples
 */
export const MOCK_WS_MESSAGES = {
  PROGRESS_UPDATE: (progress: number, phase: string) => ({
    type: 'progress',
    progress,
    phase,
    timestamp: new Date().toISOString()
  }),

  FILE_COUNT_UPDATE: (fileCount: number) => ({
    type: 'file_count',
    fileCount,
    timestamp: new Date().toISOString()
  }),

  PHASE_TRANSITION: (fromPhase: string, toPhase: string, progress: number) => ({
    type: 'phase_transition',
    fromPhase,
    toPhase,
    progress,
    timestamp: new Date().toISOString()
  }),

  COMPLETION: {
    type: 'complete',
    progress: 100,
    message: 'Analysis completed successfully',
    timestamp: new Date().toISOString()
  },

  ERROR: (error: string) => ({
    type: 'error',
    error,
    timestamp: new Date().toISOString()
  })
} as const;
