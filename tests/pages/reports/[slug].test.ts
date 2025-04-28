// NOTE: Testing Astro pages directly in Vitest can be problematic due to
// issues resolving `.astro` files and handling Astro's rendering context.
// These tests use mocking. E2E tests are better suited for full page validation.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/dom';
import '@testing-library/jest-dom/vitest';
import SlugPage from '../../src/pages/reports/[slug].astro'; // Adjust path if needed
import type { CollectionEntry } from 'astro:content';

// --- Mocking Astro Features ---

// Mock getCollection from 'astro:content'
vi.mock('astro:content', async (importOriginal) => {
    const original = await importOriginal() as typeof import('astro:content');
    return {
        ...original,
        getCollection: vi.fn(), // Mock the function used by getStaticPaths
    };
});

// Mock Astro global/config
const mockAstroConfig = {
    base: '/test-base/'
};
const mockAstroSite = new URL('http://test.com/test-base/');

// --- Mock Data ---

const mockEntry: CollectionEntry<'reports'> = {
    id: 'sample-cve.md',
    slug: 'sample-cve',
    body: 'Mock body content',
    collection: 'reports',
    data: {
        title: "Sample Vulnerability Report: CVE-2024-XXXX",
        pubDate: new Date("2024-07-15T00:00:00.000Z"),
        description: "A brief description of the sample vulnerability.",
        cvss: 9.8,
        epss: 0.85,
        tags: ["sample", "critical", "web"]
    },
    // Mock the render function to return a simple structure
    render: async () => ({
        Content: () => '<p>Rendered Markdown Content</p>', // Simple mock component/string
        headings: [{depth: 2, slug: 'summary', text: 'Summary'}], // Mock headings if needed
        remarkPluginFrontmatter: {}
    })
};

// --- Test Suite ---

describe('Report Slug Page (src/pages/reports/[slug].astro)', () => {

    beforeEach(async () => {
        vi.resetAllMocks();

        // Mock getCollection for getStaticPaths (though not directly tested here)
        const { getCollection } = await import('astro:content');
        vi.mocked(getCollection).mockResolvedValue([mockEntry]);

        // Mock Astro global
        // @ts-ignore
        globalThis.Astro = {
            config: mockAstroConfig,
            site: mockAstroSite,
            url: new URL('http://test.com/test-base/reports/sample-cve'), // Mock URL for this page
            props: { entry: mockEntry }, // Mock props passed by getStaticPaths
            generator: 'astro'
        };
    });

    afterEach(() => {
        cleanup();
         // @ts-ignore
        delete globalThis.Astro;
    });

    // Helper function to render the page component
    async function renderSlugPage() {
        // NOTE: This approach renders the page's structure but doesn't fully
        // replicate the Astro rendering lifecycle or scoped styles.
        // It relies heavily on mocking Astro.props.
        // @ts-ignore - Assuming direct render works for demonstration
        render(SlugPage, { props: { entry: mockEntry } }); // Pass props explicitly

        // Wait for async operations like entry.render()
        await screen.findByText('Rendered Markdown Content');
    }

    it('HYPOTHESIS: Should render the report title as the main heading', async () => {
        await renderSlugPage();
        expect(screen.getByRole('heading', { name: mockEntry.data.title, level: 1 })).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should render the publication date', async () => {
        await renderSlugPage();
        const expectedDate = mockEntry.data.pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        expect(screen.getByText(`Published on: ${expectedDate}`, { exact: false })).toBeInTheDocument();
        const timeElement = screen.getByText(expectedDate).closest('time');
        expect(timeElement).toHaveAttribute('datetime', mockEntry.data.pubDate.toISOString());
    });

     it('HYPOTHESIS: Should render CVSS score if provided', async () => {
        await renderSlugPage();
        expect(screen.getByText(`CVSS Score: ${mockEntry.data.cvss!.toFixed(1)}`)).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should render EPSS score if provided', async () => {
        await renderSlugPage();
        expect(screen.getByText(`EPSS Score: ${(mockEntry.data.epss! * 100).toFixed(1)}%`)).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should render tags if provided', async () => {
        await renderSlugPage();
        for (const tag of mockEntry.data.tags!) {
            expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
        }
    });

    it('HYPOTHESIS: Should render the Markdown content', async () => {
        await renderSlugPage();
        // Check for the mock content rendered by entry.render().Content
        expect(screen.getByText('Rendered Markdown Content')).toBeInTheDocument();
    });

     it('HYPOTHESIS: Should apply prose styles to the article', async () => {
        await renderSlugPage();
        const article = screen.getByRole('article');
        expect(article).toHaveClass('prose');
    });

    // Test case for a report with minimal data
    it('HYPOTHESIS: Should render correctly with minimal data (no description, cvss, epss, tags)', async () => {
        const minimalEntry: CollectionEntry<'reports'> = {
            ...mockEntry,
            data: {
                title: "Minimal Report Title",
                pubDate: new Date("2024-07-16T00:00:00.000Z"),
            },
             render: async () => ({ Content: () => '<p>Minimal Content</p>', headings: [], remarkPluginFrontmatter: {} })
        };
         // @ts-ignore
        globalThis.Astro.props = { entry: minimalEntry }; // Update mocked props

        // @ts-ignore
        render(SlugPage, { props: { entry: minimalEntry } });
        await screen.findByText('Minimal Content');

        expect(screen.getByRole('heading', { name: minimalEntry.data.title, level: 1 })).toBeInTheDocument();
        expect(screen.queryByText(/CVSS Score:/)).not.toBeInTheDocument();
        expect(screen.queryByText(/EPSS Score:/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Tags:/)).not.toBeInTheDocument();
        expect(screen.getByText('Minimal Content')).toBeInTheDocument();
    });
});
