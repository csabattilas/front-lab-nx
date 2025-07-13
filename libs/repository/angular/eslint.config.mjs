import baseConfig from '../../../eslint.base.config.mjs';
import angularConfig from '../../../angular.eslint.config.mjs';

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
          prefix: 'lib',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'lib',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
