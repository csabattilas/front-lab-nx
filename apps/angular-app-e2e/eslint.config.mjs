import baseConfig from '../../eslint.config.mjs';
import typescriptConfig from '../../eslint.typescript.config.mjs';
import angularConfig from '../../eslint.angular.config.mjs';

export default [...baseConfig, ...angularConfig, ...typescriptConfig];
