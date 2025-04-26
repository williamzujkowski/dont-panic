/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    /* for example, use happy-dom to run tests */
    /* (requires installing happy-dom as a dev dependency) */
    environment: 'happy-dom',
    globals: true, // Use Vitest globals (describe, it, expect)
    // Optional: Setup file for global configurations or mocks
    // setupFiles: ['./tests/setup.ts'],
    // Removed server.deps.inline as it didn't resolve the issue
  },
});
