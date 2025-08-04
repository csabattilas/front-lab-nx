import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { join } from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../.vite/libs/ui/angular/documentation',
  plugins: [tsconfigPaths(), angular(), nxCopyAssetsPlugin(['*.md'])],
  build: {
    lib: {
      entry: join(__dirname, 'src/index.ts'),
      name: '@frontlab/ng-form',
      fileName: format => `index.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['@angular/core', '@angular/common', '@angular/forms'],
      output: {
        globals: {
          '@angular/core': 'ng.core',
          '@angular/common': 'ng.common',
          '@angular/forms': 'ng.forms',
        },
      },
      treeshake: false,
    },
    sourcemap: true,
    emptyOutDir: true,
    minify: false,
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/libs/ui/angular/form',
      provider: 'v8' as const,
    },
  },
});
