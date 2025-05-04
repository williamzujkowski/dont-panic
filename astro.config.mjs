// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite'; // Import the Vite plugin
import pagefind from 'astro-pagefind'; // Import the Pagefind integration

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
    console.log(`GitHub Actions: Deploying to repo site: ${site}${base}`);
  } else if (owner) {
    // Fallback or deploying to user/org site: https://owner.github.io/
    // Keep base as '/'
    site = `https://${owner}.github.io/`;
    console.warn(
      `Could not determine repository name from GITHUB_REPOSITORY env var. Assuming deployment to user/org root: ${site}`
    );
  } else {
    console.warn(
      `Could not determine owner or repository name from environment variables. Using default site/base.`
    );
  }
} else {
  console.log(`Local environment: Using default site='${site}' and base='${base}'`);
}

// https://astro.build/config
export default defineConfig({
  // Dynamically set based on environment
  site: site,

  // Dynamically set based on environment (e.g., '/dont-panic/')
  base: base,

  // Ensure the output directory is 'dist' as expected by the GitHub Pages actions
  outDir: 'dist',

  integrations: [
    // Add Pagefind integration
    pagefind({
      // Pagefind configuration options
      searchPagePath: '/search',  // Optional: path to a dedicated search page
      indexDist: true, // Create search index in dist folder
      customSelectors: [
        // Add any custom CSS selectors you want to include in the search
        { selector: "h1", defaultType: "header" },
        { selector: "h2", defaultType: "header" },
        { selector: "h3", defaultType: "header" },
        { selector: "article", defaultType: "content" }
      ],
      excludeSelectors: [
        // Add any selectors you want to exclude from search
        "nav", 
        "footer",
        "[data-pagefind-ignore]"
      ]
    })
  ],

  // Add the Tailwind Vite plugin and configure the dev server
  vite: {
    // Use port 4321 if available; fallback to next free port if not
    server: { port: 4321 },
    plugins: [tailwindcss()]
  }
});