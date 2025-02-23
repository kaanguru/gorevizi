// eslint.config.mjs
import functional from 'eslint-plugin-functional';
import * as tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/components/ui/**', '**/database.types.ts'],
    plugins: {
      '@typescript-eslint': tseslint,
      functional: functional,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      // Use createTypeScriptImportResolver for flat config
      'import/resolver-next': [
        createTypeScriptImportResolver({
          project: './tsconfig.json',
          alwaysTryTypes: true, // Add this for resolving @types
        }),
      ],
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...functional.configs.externalTypeScriptRecommended.rules, //  Consider removing or selectively applying
      ...functional.configs.lite.rules,
      ...functional.configs.stylistic.rules,
      'functional/no-return-void': 'off',
      'functional/no-mixed-types': 'off',
      '@typescript-eslint/prefer-readonly': 'error',

      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin', 'external', 'type'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          warnOnUnassignedImports: true,
        },
      ],
    },
  },
];
