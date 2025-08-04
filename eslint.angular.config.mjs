import nx from '@nx/eslint-plugin';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

export default [
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.base.json', 'tsconfig.*.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'fl',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'fl',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-inject': 'error',
    },
  },
  ...compat
    .extends('plugin:@angular-eslint/template/recommended', 'plugin:@angular-eslint/template/accessibility')
    .map(config => ({
      ...config,
      files: ['**/*.html'],
      rules: {
        ...config.rules,
        '@angular-eslint/template/no-negated-async': 'error',
        '@angular-eslint/template/conditional-complexity': ['warn', { maxComplexity: 4 }],
        '@angular-eslint/template/prefer-control-flow': 'error',
      },
    })),
];
