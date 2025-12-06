// ESLint flat config with boundaries enforcement and design system isolation
// For more info:
// - https://eslint.org/docs/latest/use/configure/configuration-files
// - https://github.com/javierbrea/eslint-plugin-boundaries
// - https://github.com/storybookjs/eslint-plugin-storybook

import typescriptPlugin
  from '@typescript-eslint/eslint-plugin'
import typescriptParser
  from '@typescript-eslint/parser'
import boundaries
  from 'eslint-plugin-boundaries'
import importPlugin
  from 'eslint-plugin-import'
import storybook
  from 'eslint-plugin-storybook'
import resonancePlugin
  from './scripts/eslint-plugin-jamium.mjs'

export default [
  // Ignore build outputs and generated files
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'storybook-static/**',
      '.serena/cache/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.next/**',
      '**/.vercel/**',
      'frontend/.next/**',
      'frontend/node_modules/**',
      'frontend/dist/**',
      'frontend/build/**',
      'frontend/next-env.d.ts',
      'scraper/bin/**',
      'scraper/vendor/**',
      'scripts/test-ast-grep-rules.ts',
      '.claude/**',
    ],
  },

  // Global configuration for all files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      boundaries,
      import: importPlugin,
      resonance: resonancePlugin,
    },
    settings: {
      // Define architecture boundaries
      'boundaries/elements': [
        {
          type: 'ui-components',
          pattern: 'app/components/ui/**/*',
          mode: 'folder',
        },
        {
          type: 'feature-user',
          pattern: 'app/features/user/**/*',
          mode: 'folder',
        },
        {
          type: 'shared-components',
          pattern: 'app/components/**/*',
          mode: 'folder',
        },
        {
          type: 'feature',
          pattern: 'app/features/**/*',
          mode: 'folder',
        },
        {
          type: 'page',
          pattern: 'app/(chat|profile|auth|login|test-aside|pages)/**/*',
          mode: 'folder',
        },
        {
          type: 'layout',
          pattern: 'app/layouts/**/*',
          mode: 'folder',
        },
        {
          type: 'provider',
          pattern: 'app/providers/**/*',
          mode: 'folder',
        },
      ],
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // Ban console usage - use logger instead
      'no-console': 'error',

      // Prevent circular dependencies that slip past bundlers
      'import/no-cycle': ['error', { ignoreExternal: true }],

      // Enforce absolute imports - block ALL relative imports except for CSS/assets
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message:
                'Prefer absolute imports over relative parent imports. Use "@/" prefix for internal imports.',
            },
            {
              group: ['./*', '!./*.css', '!./*.module.css', '!./*.scss', '!./*.sass'],
              message:
                'Prefer absolute imports over relative imports. Use "@/" prefix for internal imports. CSS imports are allowed.',
            },
          ],
        },
      ],

      // Enforce architecture boundaries
      // Features and pages can only import from shared components, not from other features/pages
      'boundaries/element-types': [
        'error',
        {
          default: 'allow',
          rules: [
            // Pages can import from features, layouts, providers, and shared components
            {
              from: ['page'],
              allow: ['feature', 'layout', 'provider', 'shared-components', 'ui-components'],
            },
            // Features can only import from shared components (not other features)
            {
              from: ['feature'],
              allow: ['shared-components', 'ui-components', 'provider', 'feature-user'],
              disallow: ['feature', 'page', 'layout'],
            },
            {
              from: ['feature-user'],
              allow: ['shared-components', 'ui-components', 'provider'],
              disallow: ['feature', 'page', 'layout'],
            },
            // Layouts can import from shared components and providers
            {
              from: ['layout'],
              allow: ['shared-components', 'ui-components', 'provider'],
              disallow: ['feature', 'page'],
            },
            // UI components should be isolated (can't import from features, pages, or layouts)
            {
              from: ['ui-components'],
              disallow: ['feature', 'page', 'layout'],
            },
          ],
        },
      ],
    },
  },

  // TypeScript-specific rules for preventing direct Mantine imports
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      // Prevent direct Mantine imports outside of ui components
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@mantine/core',
              message:
                'Do not import directly from @mantine/core. Use components from app/components/ui instead.',
              allowTypeImports: true, // Allow type imports for typing
            },
            // @mantine/hooks is allowed - hooks don't need wrappers
            // {
            //   name: '@mantine/hooks',
            //   message:
            //     'Do not import directly from @mantine/hooks. Use components from app/components/ui or create a wrapper in app/hooks instead.',
            //   allowTypeImports: true,
            // },
            {
              name: '@mantine/form',
              message:
                'Do not import directly from @mantine/form. Create form wrappers in app/components/ui instead.',
              allowTypeImports: true,
            },
            {
              name: '@mantine/notifications',
              message:
                'Do not import directly from @mantine/notifications. Create notification wrappers in app/components/ui instead.',
              allowTypeImports: true,
            },
            {
              name: '@mantine/dates',
              message:
                'Do not import directly from @mantine/dates. Create date component wrappers in app/components/ui instead.',
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },

  // Allow Mantine imports ONLY in UI components, providers, config, and Storybook
  {
    files: [
      'app/components/ui/**/*',
      'app/providers/**/*',
      'app/layout.tsx',
      'app/config/**/*',
      '.storybook/**/*',
    ],
    rules: {
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },

  // JavaScript files (non-TypeScript)
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      // For JS files, enforce absolute imports
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message:
                'Prefer absolute imports over relative parent imports. Use "@/" prefix for internal imports.',
            },
            {
              group: ['./*', '!./*.css', '!./*.module.css', '!./*.scss', '!./*.sass'],
              message:
                'Prefer absolute imports over relative imports. Use "@/" prefix for internal imports. CSS imports are allowed.',
            },
            {
              group: ['@mantine/*'],
              message: 'Import from app/components/ui, not @mantine/* directly.',
            },
          ],
        },
      ],
    },
  },

  // Storybook files - apply recommended Storybook rules
  {
    files: ['**/*.stories.{js,jsx,ts,tsx}'],
    plugins: {
      storybook,
    },
    rules: {
      ...storybook.configs.recommended.rules,
      // Allow direct Mantine imports in stories for now
      '@typescript-eslint/no-restricted-imports': 'off',
      'no-restricted-imports': 'off',
    },
  },

  // Logger implementation - allow console usage
  {
    files: ['app/utils/logger.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // Configuration files - less strict
  {
    files: [
      'eslint.config.{js,mjs,cjs}',
      'playwright.config.{js,ts}',
      'vitest.config.{js,ts}',
      'next.config.{js,mjs}',
      '.storybook/**/*.{js,ts,tsx}',
    ],
    rules: {
      '@typescript-eslint/no-restricted-imports': 'off',
      'no-restricted-imports': 'off',
      'boundaries/element-types': 'off',
    },
  },

  // Test files - less strict boundaries and allow relative imports
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}', 'e2e/**/*'],
    rules: {
      '@typescript-eslint/no-restricted-imports': 'off',
      'boundaries/element-types': 'off',
      'no-restricted-imports': 'off',
    },
  },
]
