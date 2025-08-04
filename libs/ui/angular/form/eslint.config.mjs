import baseConfig from '../../../../eslint.config.mjs';
import typescriptConfig from '../../../../eslint.typescript.config.mjs';
import angularConfig from '../../../../eslint.angular.config.mjs';

export default [
  ...baseConfig,
  ...angularConfig,
  ...typescriptConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'fl-form',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'fl-form',
          style: 'kebab-case',
        },
      ],
    },
  },
];
