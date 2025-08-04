/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../../node_modules/.vite/libs/ui/lion/form',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    outDir: '../../../../dist/libs/ui/lion/form',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.js',
      name: 'form',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: ['@open-wc/testing-helpers', '@lion/ui'],
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.js'],
    setupFiles: ['./vitest.setup.js'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/ui/lion/form',
      provider: 'v8' as const,
    },
  },
}));
