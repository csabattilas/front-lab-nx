/// <reference types='vitest' />
import { defineConfig, mergeConfig, UserConfig } from 'vite';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';

import { tailwindConfig } from '../../libs/ui/styles/vite.config.mts';

const mainConfig: UserConfig = {
  root: __dirname,
  cacheDir: '../../.vite/apps/angular-app',
  server: {
    port: 4200,
    host: 'localhost',
    hmr: {
      overlay: true,
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [tsconfigPaths(), angular(), nxCopyAssetsPlugin(['*.md'])],
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/angular-app',
      provider: 'v8' as const,
    },
  },
};

export default mergeConfig(tailwindConfig, defineConfig(mainConfig));
