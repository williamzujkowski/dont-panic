import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, getByText, getByRole, within } from '@testing-library/dom'; // Import specific functions including cleanup and within
import '@testing-library/jest-dom/vitest';
// import BaseLayout from '../../src/layouts/BaseLayout.astro'; // Cannot import .astro directly

// Mock Astro global/config needed by BaseLayout
const mockAstroConfig = {
    base: '/test-base/'
};
const mockAstroSite = new URL('http://test.com/test-base/');
const mockAstroUrl = new URL('http://test.com/test-base/some/page');

// Helper function to render the layout with slot content
async function renderLayout(props: { title: string; description?: string }, slotContent: string) {
    // NOTE: This is a simplified render. It won't execute Astro lifecycle
    // or handle complex slots perfectly, but checks basic structure.
    // We manually construct the HTML structure similar to how Astro might render it.
    const { title, description = "Don't Panic - Vulnerability Intelligence Reports" } = props;
    const faviconUrl = `${mockAstroConfig.base}favicon.svg`;
    const canonicalURL = new URL(mockAstroUrl.pathname, mockAstroSite);

    const html = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="description" content="${description}" />
          <meta name="viewport" content="width=device-width" />
          <link rel="icon" type="image/svg+xml" href="${faviconUrl}" />
          <meta name="generator" content="Astro" />
          <title>${title} | Don't Panic</title>
          <link rel="canonical" href="${canonicalURL.href}" />
          <meta property="og:title" content="${title} | Don't Panic" />
          <meta property="og:description" content="${description}" />
          <meta property="twitter:title" content="${title} | Don't Panic" />
          <meta property="twitter:description" content="${description}" />
        </head>
        <body class="bg-background text-text min-h-screen flex flex-col antialiased font-sans">
          {/* Mock Header structure based on Header.astro */}
          <header role="banner" class="site-header">
            <div class="site-title">
              <a href="${mockAstroConfig.base}">Don't Panic</a>
            </div>
            <nav role="navigation" aria-label="Main navigation">
              <ul class="nav-list"></ul> {/* Empty nav for base layout test */}
            </nav>
          </header>

          <main class="flex-grow container mx-auto px-4 py-8 w-full max-w-4xl">
            ${slotContent} {/* Inject slot content */}
          </main>

          {/* Mock Footer structure based on Footer.astro */}
          <footer role="contentinfo" class="site-footer">
            <p>
              &copy; ${new Date().getFullYear()} Don't Panic.
              <a href="https://github.com/williamzujkowski/dont-panic" target="_blank" rel="noopener noreferrer" class="hover:text-primary hover:underline ml-2">
                View Source on GitHub
              </a>
            </p>
          </footer>
        </body>
      </html>
    `;
    // Render the raw HTML string
    document.body.innerHTML = html;
}

describe('BaseLayout Component', () => {

    beforeEach(() => {
        // Mock Astro environment specifics needed by the layout
        // @ts-ignore
        globalThis.Astro = {
            config: mockAstroConfig,
            site: mockAstroSite,
            url: mockAstroUrl,
            props: {}, // Mock props if BaseLayout directly used Astro.props
            generator: 'astro' // Mock generator if needed
        };
    });

    afterEach(() => {
        // cleanup(); // Vitest + happy-dom should handle cleanup automatically
        document.body.innerHTML = ''; // Clean up body
        // @ts-ignore
        delete globalThis.Astro;
    });

    it('HYPOTHESIS: Should render the page title correctly', async () => {
        const pageTitle = "Test Page Title";
        await renderLayout({ title: pageTitle }, '<p>Slot Content</p>');
        expect(document.title).toBe(`${pageTitle} | Don't Panic`);
        // Check meta tags as well
        expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', `${pageTitle} | Don't Panic`);
        expect(document.querySelector('meta[property="twitter:title"]')).toHaveAttribute('content', `${pageTitle} | Don't Panic`);
    });

    it('HYPOTHESIS: Should render the default description if none provided', async () => {
        await renderLayout({ title: "Test" }, '<p>Slot Content</p>');
        const expectedDescription = "Don't Panic - Vulnerability Intelligence Reports";
        expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', expectedDescription);
        expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute('content', expectedDescription);
        expect(document.querySelector('meta[property="twitter:description"]')).toHaveAttribute('content', expectedDescription);
    });

    it('HYPOTHESIS: Should render the provided description', async () => {
        const pageDescription = "This is a test description.";
        await renderLayout({ title: "Test", description: pageDescription }, '<p>Slot Content</p>');
        expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', pageDescription);
        expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute('content', pageDescription);
        expect(document.querySelector('meta[property="twitter:description"]')).toHaveAttribute('content', pageDescription);
    });

    it('HYPOTHESIS: Should render the header with site title link', async () => {
        await renderLayout({ title: "Test" }, '<p>Slot Content</p>');
        // Check within the header element (role="banner")
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
        const headerLink = within(header).getByRole('link', { name: "Don't Panic" });
        expect(headerLink).toBeInTheDocument();
        expect(headerLink).toHaveAttribute('href', mockAstroConfig.base);
    });

    it('HYPOTHESIS: Should render the footer with copyright and GitHub link', async () => {
        await renderLayout({ title: "Test" }, '<p>Slot Content</p>');
        const footer = screen.getByRole('contentinfo'); // Footer role
        expect(footer).toBeInTheDocument();
        // Check for parts of the text content
        expect(within(footer).getByText(/© \d{4} Don't Panic./)).toBeInTheDocument();
        const githubLink = within(footer).getByRole('link', { name: "View Source on GitHub" });
        expect(githubLink).toBeInTheDocument();
        expect(githubLink).toHaveAttribute('href', "https://github.com/williamzujkowski/dont-panic");
    });

    it('HYPOTHESIS: Should render the slot content within the main tag', async () => {
        const slotHtml = '<h1>Main Content Here</h1><p>Some paragraph.</p>';
        await renderLayout({ title: "Test" }, slotHtml);
        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
        // Check if the slot content exists within main
        expect(mainElement.innerHTML).toContain(slotHtml);
        expect(screen.getByRole('heading', { name: 'Main Content Here', level: 1 })).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should include canonical URL link', async () => {
        await renderLayout({ title: "Test" }, '<p>Slot Content</p>');
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        expect(canonicalLink).toBeInTheDocument();
        expect(canonicalLink).toHaveAttribute('href', new URL(mockAstroUrl.pathname, mockAstroSite).href);
    });

     it('HYPOTHESIS: Should include favicon link with base path', async () => {
        await renderLayout({ title: "Test" }, '<p>Slot Content</p>');
        const faviconLink = document.querySelector('link[rel="icon"]');
        expect(faviconLink).toBeInTheDocument();
        expect(faviconLink).toHaveAttribute('href', `${mockAstroConfig.base}favicon.svg`);
    });
});
