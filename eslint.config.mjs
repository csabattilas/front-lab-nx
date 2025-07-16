import baseConfig from './eslint.base.config.mjs';
import prettier from 'eslint-plugin-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  ...baseConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      '**/*.mjs',
      '**/.nx/**',
      '**/.angular/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          bracketSpacing: true,
          trailingComma: 'es5',
          arrowParens: 'avoid',
          htmlWhitespaceSensitivity: 'css',
          endOfLine: 'lf',
        },
      ],
      'no-console': 'error',
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
