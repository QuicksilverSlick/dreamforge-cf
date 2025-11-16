/**
 * Mock Blueprint Fixtures
 * Provides sample blueprint outputs for testing
 */

import type { GeneratedBlueprint } from '../../worker/services/blueprint/BlueprintGenerationService';

export const MOCK_BLUEPRINTS: Record<string, GeneratedBlueprint> = {
  SIMPLE_REACT: {
    projectName: 'simple-react-app',
    framework: 'react',
    buildTool: 'vite',
    packageManager: 'npm',
    currentState: {
      completenessPercentage: 85,
      implementedFeatures: [
        'Component-based architecture',
        'Routing setup',
        'Basic styling',
        'TypeScript configuration'
      ],
      missingFeatures: [
        'Authentication',
        'Unit tests',
        'API integration',
        'Error boundaries'
      ],
      codeQuality: {
        hasTests: false,
        hasLinting: true,
        hasTypeChecking: true,
        hasCI: false
      }
    },
    suggestedTasks: [
      {
        id: 'task-1',
        title: 'Add authentication system',
        priority: 'high',
        estimatedEffort: '4-6 hours',
        description: 'Implement user authentication with JWT tokens'
      },
      {
        id: 'task-2',
        title: 'Set up unit testing with Vitest',
        priority: 'high',
        estimatedEffort: '2-4 hours',
        description: 'Add testing framework and write initial tests'
      },
      {
        id: 'task-3',
        title: 'Implement API integration',
        priority: 'medium',
        estimatedEffort: '3-5 hours',
        description: 'Connect to backend API endpoints'
      },
      {
        id: 'task-4',
        title: 'Add error boundaries',
        priority: 'medium',
        estimatedEffort: '1-2 hours',
        description: 'Implement error boundaries for better error handling'
      }
    ],
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'react-router-dom': '^6.0.0'
    },
    devDependencies: {
      '@vitejs/plugin-react': '^4.0.0',
      typescript: '^5.0.0',
      vite: '^4.3.0'
    },
    fileStructure: [
      {
        path: 'src/App.tsx',
        purpose: 'Main application component',
        importance: 'critical'
      },
      {
        path: 'src/main.tsx',
        purpose: 'Application entry point',
        importance: 'critical'
      },
      {
        path: 'src/components/Header.tsx',
        purpose: 'Header navigation component',
        importance: 'moderate'
      },
      {
        path: 'src/components/Footer.tsx',
        purpose: 'Footer component',
        importance: 'low'
      }
    ],
    architectureInsights: {
      pattern: 'Component-based SPA',
      strengths: [
        'Clean component structure',
        'TypeScript for type safety',
        'Modern build tooling (Vite)'
      ],
      weaknesses: [
        'No testing infrastructure',
        'Missing authentication',
        'No API layer'
      ],
      recommendations: [
        'Add comprehensive test coverage',
        'Implement authentication early',
        'Consider state management library for complex state'
      ]
    }
  } as GeneratedBlueprint,

  NEXTJS_ECOMMERCE: {
    projectName: 'nextjs-ecommerce',
    framework: 'next',
    buildTool: 'next',
    packageManager: 'npm',
    currentState: {
      completenessPercentage: 72,
      implementedFeatures: [
        'Server-side rendering',
        'Database integration (Prisma)',
        'Product catalog',
        'Shopping cart',
        'Payment processing (Stripe)'
      ],
      missingFeatures: [
        'User authentication',
        'Order management',
        'Admin dashboard',
        'Email notifications',
        'Product search'
      ],
      codeQuality: {
        hasTests: false,
        hasLinting: true,
        hasTypeChecking: true,
        hasCI: false
      }
    },
    suggestedTasks: [
      {
        id: 'task-1',
        title: 'Implement user authentication with NextAuth',
        priority: 'critical',
        estimatedEffort: '6-8 hours',
        description: 'Add user registration, login, and session management'
      },
      {
        id: 'task-2',
        title: 'Build order management system',
        priority: 'high',
        estimatedEffort: '8-12 hours',
        description: 'Create order tracking and history features'
      },
      {
        id: 'task-3',
        title: 'Add admin dashboard',
        priority: 'high',
        estimatedEffort: '10-15 hours',
        description: 'Build admin interface for product and order management'
      },
      {
        id: 'task-4',
        title: 'Implement product search and filtering',
        priority: 'medium',
        estimatedEffort: '4-6 hours',
        description: 'Add search functionality with filters'
      },
      {
        id: 'task-5',
        title: 'Set up email notifications',
        priority: 'medium',
        estimatedEffort: '3-5 hours',
        description: 'Send order confirmation and shipping emails'
      }
    ],
    dependencies: {
      next: '^14.0.0',
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      '@prisma/client': '^5.0.0',
      stripe: '^13.0.0'
    },
    devDependencies: {
      '@types/node': '^20.0.0',
      '@types/react': '^18.0.0',
      typescript: '^5.0.0',
      prisma: '^5.0.0'
    },
    fileStructure: [
      {
        path: 'app/page.tsx',
        purpose: 'Homepage',
        importance: 'critical'
      },
      {
        path: 'app/products/page.tsx',
        purpose: 'Product listing page',
        importance: 'critical'
      },
      {
        path: 'components/Cart.tsx',
        purpose: 'Shopping cart component',
        importance: 'critical'
      },
      {
        path: 'lib/db.ts',
        purpose: 'Database connection and queries',
        importance: 'critical'
      }
    ],
    architectureInsights: {
      pattern: 'Server-side rendered e-commerce application',
      strengths: [
        'SEO-friendly SSR',
        'Type-safe database with Prisma',
        'Payment processing integration',
        'Modern Next.js App Router'
      ],
      weaknesses: [
        'No user authentication',
        'Missing admin capabilities',
        'No test coverage',
        'Incomplete order flow'
      ],
      recommendations: [
        'Prioritize authentication implementation',
        'Add E2E tests for critical payment flows',
        'Implement admin dashboard for content management',
        'Add monitoring and error tracking'
      ]
    }
  } as GeneratedBlueprint,

  EMPTY_PROJECT: {
    projectName: 'empty-repo',
    framework: 'unknown',
    buildTool: 'unknown',
    packageManager: 'unknown',
    currentState: {
      completenessPercentage: 0,
      implementedFeatures: [],
      missingFeatures: ['Everything'],
      codeQuality: {
        hasTests: false,
        hasLinting: false,
        hasTypeChecking: false,
        hasCI: false
      }
    },
    suggestedTasks: [
      {
        id: 'task-1',
        title: 'Initialize project structure',
        priority: 'critical',
        estimatedEffort: '1-2 hours',
        description: 'Set up basic project scaffolding'
      }
    ],
    dependencies: {},
    devDependencies: {},
    fileStructure: [],
    architectureInsights: {
      pattern: 'Empty project',
      strengths: [],
      weaknesses: ['No code present'],
      recommendations: ['Start by defining project requirements']
    }
  } as GeneratedBlueprint
} as const;
