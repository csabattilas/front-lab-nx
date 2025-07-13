/// <reference types='vitest' />
import { UserConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export const tailwindConfig: UserConfig = {
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      tailwindcss: path.resolve(
        __dirname,
        '../../../node_modules/tailwindcss/index.css'
      ),
      '@front-lab-nx/styles/lion-tabs': path.resolve(
        __dirname,
        './src/lib/lion/lion-tabs.css'
      ),
      '@front-lab-nx/styles': path.resolve(__dirname, './src/lib/index.css'),
    },
  },
};

export default tailwindConfig;
