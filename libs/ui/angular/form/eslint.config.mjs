import baseConfig from '../../../../eslint.base.config.mjs';
import baseConfig from '../../../../eslint.config.mjs';
import angularConfig from '../../../../angular.eslint.config.mjs';

export default [
  ...baseConfig,
  ...baseConfig,
  ...angularConfig,
  // Project-specific overrides can be added here
  {
    files: ['**/*.ts'],
    rules: {
      // Override the component/directive prefix for this library if needed
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
