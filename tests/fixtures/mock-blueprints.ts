/**
 * Mock Blueprint Fixtures
 *
 * Provides sample `GeneratedBlueprint` payloads for BYOP tests. The shape
 * tracks the production type in
 * `worker/services/blueprint/BlueprintGenerationService.ts` — `currentState`
 * with `missingComponents` (not `missingFeatures`), top-level `recommendations`
 * with priority+category, `completionPhases`, `nextSteps`, and `technicalDebt`.
 */

import type { GeneratedBlueprint } from '../../worker/services/blueprint/BlueprintGenerationService';

export const MOCK_BLUEPRINTS: Record<string, GeneratedBlueprint> = {
	SIMPLE_REACT: {
		projectName: 'simple-react-app',
		description: 'A simple React application built with Vite and TypeScript.',
		currentState: {
			framework: 'react',
			totalFiles: 12,
			totalLinesOfCode: 850,
			completenessPercentage: 85,
			implementedFeatures: [
				'Component-based architecture',
				'Routing setup',
				'Basic styling',
				'TypeScript configuration',
			],
			missingComponents: [
				'Authentication',
				'Unit tests',
				'API integration',
				'Error boundaries',
			],
		},
		recommendations: [
			{
				priority: 'high',
				category: 'functionality',
				title: 'Add authentication system',
				description: 'Implement user authentication with JWT tokens',
				estimatedEffort: '4-6 hours',
			},
			{
				priority: 'high',
				category: 'testing',
				title: 'Set up unit testing with Vitest',
				description: 'Add testing framework and write initial tests',
				estimatedEffort: '2-4 hours',
			},
			{
				priority: 'medium',
				category: 'functionality',
				title: 'Implement API integration',
				description: 'Connect to backend API endpoints',
				estimatedEffort: '3-5 hours',
			},
			{
				priority: 'medium',
				category: 'quality',
				title: 'Add error boundaries',
				description: 'Implement error boundaries for better error handling',
				estimatedEffort: '1-2 hours',
			},
		],
		nextSteps: [
			'Add authentication',
			'Write unit tests for App component',
			'Wire up backend API',
		],
		technicalDebt: [
			'No tests in repository',
			'No CI/CD configured',
		],
		completionPhases: [
			{
				phase: 1,
				title: 'Foundation hardening',
				tasks: ['Add authentication', 'Set up unit testing'],
				estimatedTime: '6-10 hours',
			},
			{
				phase: 2,
				title: 'Feature completion',
				tasks: ['API integration', 'Error boundaries'],
				estimatedTime: '4-7 hours',
			},
		],
	},

	NEXTJS_ECOMMERCE: {
		projectName: 'nextjs-ecommerce',
		description: 'Next.js e-commerce storefront with Prisma and Stripe.',
		currentState: {
			framework: 'next',
			totalFiles: 84,
			totalLinesOfCode: 6200,
			completenessPercentage: 72,
			implementedFeatures: [
				'Server-side rendering',
				'Database integration (Prisma)',
				'Product catalog',
				'Shopping cart',
				'Payment processing (Stripe)',
			],
			missingComponents: [
				'User authentication',
				'Order management',
				'Admin dashboard',
				'Email notifications',
				'Product search',
			],
		},
		recommendations: [
			{
				priority: 'high',
				category: 'security',
				title: 'Implement user authentication with NextAuth',
				description: 'Add user registration, login, and session management',
				estimatedEffort: '6-8 hours',
			},
			{
				priority: 'high',
				category: 'functionality',
				title: 'Build order management system',
				description: 'Create order tracking and history features',
				estimatedEffort: '8-12 hours',
			},
			{
				priority: 'medium',
				category: 'functionality',
				title: 'Add admin dashboard',
				description: 'Build admin interface for product and order management',
				estimatedEffort: '10-15 hours',
			},
		],
		nextSteps: [
			'Set up NextAuth providers',
			'Design order schema',
			'Sketch admin UI surface',
		],
		technicalDebt: [
			'No automated tests for payment flow',
			'No structured logging',
		],
		completionPhases: [
			{
				phase: 1,
				title: 'Authentication & accounts',
				tasks: ['Add NextAuth', 'Create user profile pages'],
				estimatedTime: '8-12 hours',
			},
			{
				phase: 2,
				title: 'Order lifecycle',
				tasks: ['Order tracking', 'Email notifications'],
				estimatedTime: '12-18 hours',
			},
		],
	},

	EMPTY_PROJECT: {
		projectName: 'empty-repo',
		description: 'Empty repository with no source code.',
		currentState: {
			totalFiles: 0,
			totalLinesOfCode: 0,
			completenessPercentage: 0,
			implementedFeatures: [],
			missingComponents: ['Everything'],
		},
		recommendations: [
			{
				priority: 'high',
				category: 'functionality',
				title: 'Initialize project structure',
				description: 'Set up basic project scaffolding',
				estimatedEffort: '1-2 hours',
			},
		],
		nextSteps: ['Define project requirements', 'Pick a framework'],
		technicalDebt: [],
		completionPhases: [
			{
				phase: 1,
				title: 'Scaffolding',
				tasks: ['Initialize repo', 'Pick framework'],
				estimatedTime: '1-2 hours',
			},
		],
	},
} as const;
