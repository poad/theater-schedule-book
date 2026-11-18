/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from 'path';

import solidPlugin from '@solidjs/vite-plugin';
import { defineConfig, Plugin } from 'vite';
import pages from 'vite-plugin-pages';

const solidV1Shim = path.resolve(__dirname, 'src/compat/solid-v1-shim.ts');
const solidWebShim = path.resolve(__dirname, 'src/compat/solid-web-shim.ts');

// node_modules 内のサードパーティ製パッケージが solid-js v1.x 用エクスポート
// (mergeProps, on, onMount, batch, splitProps) や @solidjs/web の use を参照する
// 場合に互換シムを返す。src/ 内の自前コードは通常通り解決される。
const solidCompatPlugin: Plugin = {
  name: 'solid-v1-compat',
  enforce: 'pre',
  resolveId(id, importer) {
    if (!importer || !importer.includes('node_modules')) {
      return null;
    }
    if (id === 'solid-js') return solidV1Shim;
    if (id === '@solidjs/web') return solidWebShim;
    return null;
  },
};

export default defineConfig({
  plugins: [
    pages({
      extensions: ['tsx', 'jsx'],
      importMode: 'async',
    }),
    solidPlugin(),
    solidCompatPlugin,
  ],
  test: {
    environment: 'jsdom',
    globals: true,

    setupFiles: './setupVitest.ts',
    // if you have few tests, try commenting one
    // or both out to improve performance:
    isolate: false,
  },
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    exclude: ['terracotta'],
  },
  resolve: {
    conditions: ['development', 'browser'],
    dedupe: ['solid-js'],
    alias: {
      'solid-js/web': '@solidjs/web',
      'solid-js/store': 'solid-js',
      'solid-js/html': 'solid-js',
      'solid-js/h': 'solid-js',
    },
  },
});
