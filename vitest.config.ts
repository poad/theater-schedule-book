/// <reference types="vitest" />
import solid from '@solidjs/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solid({ ssr: false })],
  resolve: {
    conditions: ['development', 'browser'],
  },
  test: {
    coverage: {
      reporter: ['text', 'json-summary', 'json', 'html', 'cobertura'],
      reportOnFailure: true,
    },
  },
});
