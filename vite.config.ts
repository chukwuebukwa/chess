/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vite + Vitest configuration. Tests run in a plain Node environment because the
// trainer engine, move-tree builder, and opening data are all pure logic with no
// DOM dependency — keeping them fast and dependency-light.
export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    // Pure-logic suites run in Node; component suites opt into jsdom via a
    // per-file `// @vitest-environment jsdom` docblock.
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
