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
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'flApi',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'fl-api',
          style: 'kebab-case',
        },
      ],
    },
  },
  ...compat.extends(
    'plugin:@angular-eslint/template/recommended',
    'plugin:@angular-eslint/template/accessibility'
  ).map((config) => ({
    ...config,
    files: ['**/*.html'],
    rules: {
      ...config.rules,
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/conditional-complexity': [
        'warn',
        { maxComplexity: 4 },
      ],
      '@angular-eslint/template/prefer-control-flow': 'error',
    },
  })),
];
