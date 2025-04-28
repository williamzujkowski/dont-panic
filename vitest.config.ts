/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    // Configure Vitest environment (e.g., happy-dom, jsdom)
    environment: 'happy-dom', // Or 'jsdom'
    // Optional: Setup files for global configurations or mocks
    // setupFiles: ['./tests/setup.ts'],
    // Optional: Glob patterns for test files
    // include: ['tests/**/*.test.ts'],
    globals: true, // Use global APIs (describe, it, expect, etc.)
  },
});
