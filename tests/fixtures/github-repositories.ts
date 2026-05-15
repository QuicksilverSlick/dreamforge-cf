/**
 * Mock GitHub Repository Fixtures
 * Provides test repository data
 */

export interface MockRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  clone_url: string;
  description: string | null;
  language: string | null;
  default_branch: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
}

export const MOCK_REPOSITORIES: Record<string, MockRepository> = {
  SIMPLE_REACT: {
    id: 123456,
    name: 'simple-react-app',
    full_name: 'testuser/simple-react-app',
    private: false,
    html_url: 'https://github.com/testuser/simple-react-app',
    clone_url: 'https://github.com/testuser/simple-react-app.git',
    description: 'A simple React application',
    language: 'TypeScript',
    default_branch: 'main',
    stargazers_count: 42,
    forks_count: 7,
    updated_at: '2025-01-10T12:00:00Z',
    created_at: '2024-06-15T08:30:00Z'
  },
  NEXTJS_ECOMMERCE: {
    id: 789012,
    name: 'nextjs-ecommerce',
    full_name: 'testuser/nextjs-ecommerce',
    private: true,
    html_url: 'https://github.com/testuser/nextjs-ecommerce',
    clone_url: 'https://github.com/testuser/nextjs-ecommerce.git',
    description: 'E-commerce platform built with Next.js',
    language: 'TypeScript',
    default_branch: 'develop',
    stargazers_count: 128,
    forks_count: 24,
    updated_at: '2025-01-12T15:45:00Z',
    created_at: '2024-03-20T10:00:00Z'
  },
  EMPTY_REPO: {
    id: 345678,
    name: 'empty-repo',
    full_name: 'testuser/empty-repo',
    private: false,
    html_url: 'https://github.com/testuser/empty-repo',
    clone_url: 'https://github.com/testuser/empty-repo.git',
    description: 'Empty repository for testing',
    language: null,
    default_branch: 'main',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2025-01-13T09:00:00Z',
    created_at: '2025-01-13T09:00:00Z'
  },
  MONOREPO: {
    id: 901234,
    name: 'monorepo',
    full_name: 'testuser/monorepo',
    private: false,
    html_url: 'https://github.com/testuser/monorepo',
    clone_url: 'https://github.com/testuser/monorepo.git',
    description: 'Monorepo with multiple packages',
    language: 'TypeScript',
    default_branch: 'main',
    stargazers_count: 256,
    forks_count: 48,
    updated_at: '2025-01-11T18:20:00Z',
    created_at: '2024-01-10T12:00:00Z'
  },
  NO_PACKAGE_JSON: {
    id: 567890,
    name: 'no-package-json',
    full_name: 'testuser/no-package-json',
    private: false,
    html_url: 'https://github.com/testuser/no-package-json',
    clone_url: 'https://github.com/testuser/no-package-json.git',
    description: 'Repository without package.json',
    language: 'Python',
    default_branch: 'main',
    stargazers_count: 15,
    forks_count: 3,
    updated_at: '2025-01-09T14:30:00Z',
    created_at: '2024-08-05T11:00:00Z'
  }
} as const;

/**
 * Mock repository file structures
 */
export const MOCK_FILE_STRUCTURES: Record<string, string[]> = {
  SIMPLE_REACT: [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'src/App.tsx',
    'src/main.tsx',
    'src/components/Header.tsx',
    'src/components/Footer.tsx',
    'src/styles/index.css',
    'public/index.html',
    'README.md'
  ],
  NEXTJS_ECOMMERCE: [
    'package.json',
    'next.config.js',
    'tsconfig.json',
    'app/page.tsx',
    'app/layout.tsx',
    'app/products/page.tsx',
    'components/Cart.tsx',
    'components/ProductCard.tsx',
    'lib/db.ts',
    'lib/api.ts',
    'prisma/schema.prisma',
    'README.md'
  ],
  EMPTY_REPO: [],
  MONOREPO: [
    'package.json',
    'turbo.json',
    'packages/ui/package.json',
    'packages/api/package.json',
    'packages/shared/package.json',
    'apps/web/package.json',
    'apps/admin/package.json'
  ],
  NO_PACKAGE_JSON: [
    'main.py',
    'requirements.txt',
    'README.md'
  ]
} as const;

/**
 * Mock package.json contents
 */
export const MOCK_PACKAGE_JSONS: Record<string, Record<string, unknown>> = {
  SIMPLE_REACT: {
    name: 'simple-react-app',
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0'
    },
    devDependencies: {
      '@vitejs/plugin-react': '^4.0.0',
      typescript: '^5.0.0',
      vite: '^4.3.0'
    }
  },
  NEXTJS_ECOMMERCE: {
    name: 'nextjs-ecommerce',
    version: '2.1.0',
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start'
    },
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
    }
  },
  MONOREPO: {
    name: 'monorepo',
    version: '1.0.0',
    private: true,
    workspaces: [
      'packages/*',
      'apps/*'
    ],
    scripts: {
      dev: 'turbo run dev',
      build: 'turbo run build'
    },
    devDependencies: {
      turbo: '^1.10.0'
    }
  }
} as const;
