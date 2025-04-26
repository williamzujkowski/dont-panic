// @ts-check
import { defineConfig } from 'astro/config';

// Determine base path and site URL based on environment
// Fallback for local development
let base = '/';
let site = 'http://localhost:4321'; // Default for local dev

// Check if running in GitHub Actions
if (process.env.GITHUB_ACTIONS === 'true') {
  // GITHUB_REPOSITORY is owner/repo format
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const owner = process.env.GITHUB_REPOSITORY_OWNER;

  if (repoName && owner) {
    // Deploying to project site: https://owner.github.io/repo/
    base = `/${repoName}/`;
    site = `https://${owner}.github.io/${repoName}/`;
  } else {
    // Fallback or deploying to user/org site: https://owner.github.io/
    // Keep base as '/'
    site = `https://${owner}.github.io/`;
    console.warn(
      `Could not determine repository name from GITHUB_REPOSITORY env var. Assuming deployment to user/org root: ${site}`
    );
  }
}

console.log(`Astro Config: Using site='${site}' and base='${base}'`);

// https://astro.build/config
export default defineConfig({
  site: site, // Dynamically set based on environment
  base: base, // Dynamically set based on environment (e.g., '/astro-template-website/')
  // Ensure the output directory is 'dist' as expected by the GitHub Pages actions
  outDir: 'dist',
});
