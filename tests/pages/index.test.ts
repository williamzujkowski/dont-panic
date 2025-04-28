import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/happy-dom';
import IndexPage from '../../src/pages/index.astro'; // Adjust path if needed
import type { CollectionEntry } from 'astro:content';

// --- Mocking Astro Features ---

// Mock getCollection from 'astro:content'
vi.mock('astro:content', async (importOriginal) => {
    const original = await importOriginal() as typeof import('astro:content');
    return {
        ...original,
        getCollection: vi.fn(), // Mock the function
    };
});

// Mock Astro global/config
const mockAstroConfig = {
    base: '/test-base/'
};

// --- Mock Data ---

const mockReports: CollectionEntry<'reports'>[] = [
    {
        id: 'report-1.md', slug: 'report-1', collection: 'reports', body: '',
        data: { title: "Report One", pubDate: new Date("2024-07-20T00:00:00.000Z"), cvss: 7.5 },
        render: async () => ({ Content: () => '', headings: [], remarkPluginFrontmatter: {} })
    },
    {
        id: 'report-2.md', slug: 'report-2', collection: 'reports', body: '',
        data: { title: "Report Two", pubDate: new Date("2024-07-18T00:00:00.000Z"), description: "Second report desc" },
        render: async () => ({ Content: () => '', headings: [], remarkPluginFrontmatter: {} })
    },
];

// --- Test Suite ---

describe('Index Page (src/pages/index.astro)', () => {

    beforeEach(async () => {
        // Reset mocks before each test
        vi.resetAllMocks();

        // Provide mock implementation for getCollection
        const { getCollection } = await import('astro:content');
        vi.mocked(getCollection).mockResolvedValue(mockReports);

        // Mock Astro global
        // @ts-ignore
        globalThis.Astro = { config: mockAstroConfig };
    });

    afterEach(() => {
        cleanup();
         // @ts-ignore
        delete globalThis.Astro;
    });

    // Helper function to render the page component
    async function renderIndexPage() {
        // Rendering a full Astro page in Vitest might require Astro's specific testing utilities
        // or a more complex setup. This is a simplified approach.
        // @ts-ignore - Assuming direct render works for demonstration
        render(IndexPage);
        // Wait for any potential async operations within the component if necessary
        // await screen.findByText('Latest Vulnerability Reports'); // Example wait
    }

    it('HYPOTHESIS: Should render the main heading', async () => {
        await renderIndexPage();
        expect(screen.getByRole('heading', { name: /Latest Vulnerability Reports/i, level: 1 })).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should render a ReportCard for each report fetched', async () => {
        await renderIndexPage();
        // Check if headings corresponding to report titles are present (rendered by ReportCard)
        const reportHeadings = await screen.findAllByRole('heading', { level: 3 });
        expect(reportHeadings).toHaveLength(mockReports.length);
        expect(screen.getByRole('heading', { name: "Report One", level: 3 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: "Report Two", level: 3 })).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should display reports sorted by pubDate descending', async () => {
        // Note: The sorting happens *before* rendering in index.astro.
        // We check the order of elements rendered.
        await renderIndexPage();
        const reportCards = screen.getAllByRole('link'); // ReportCards are links

        // Assuming the order in the DOM reflects the map order
        // Check if the first card corresponds to the latest report (Report One)
        expect(reportCards[0]).toHaveTextContent("Report One");
        // Check if the second card corresponds to the older report (Report Two)
        expect(reportCards[1]).toHaveTextContent("Report Two");
    });

    it('HYPOTHESIS: Should display a "No reports found" message when getCollection returns empty', async () => {
        // Override mock for this specific test
        const { getCollection } = await import('astro:content');
        vi.mocked(getCollection).mockResolvedValue([]); // Return empty array

        await renderIndexPage();

        expect(screen.getByText('No reports found.')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument(); // No report cards
    });
});
