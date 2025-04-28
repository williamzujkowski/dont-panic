import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/dom'; // Use @testing-library/dom
import '@testing-library/jest-dom/vitest'; // Import Jest DOM matchers for Vitest
import ReportCard from '../../src/components/ReportCard.astro';
import type { CollectionEntry } from 'astro:content';

// Mock Astro environment variables/config if needed within tests
// For example, mocking Astro.config.base
const mockAstroConfig = {
    base: '/test-base/'
};

// Mock CollectionEntry data
const mockReport: CollectionEntry<'reports'> = {
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
    render: async () => ({
        Content: () => '', // Mock Content component
        headings: [],
        remarkPluginFrontmatter: {}
    })
};

const mockReportMinimal: CollectionEntry<'reports'> = {
    id: 'minimal-report.md',
    slug: 'minimal-report',
    body: 'Minimal body',
    collection: 'reports',
    data: {
        title: "Minimal Report",
        pubDate: new Date("2024-07-16T00:00:00.000Z"),
        // No description, cvss, epss, tags
    },
    render: async () => ({
        Content: () => '',
        headings: [],
        remarkPluginFrontmatter: {}
    })
};


// Helper to render the component - Astro components might need special handling
// This is a simplified approach assuming direct rendering works in the test env
// Real-world scenarios might require Astro's test utilities or more complex setup
async function renderComponent(props: { report: CollectionEntry<'reports'> }) {
    // Simulate Astro's rendering context if necessary
    // For now, directly use testing-library's render
    // We need to handle the component's async nature if it uses top-level await
    // or fetches data internally (which ReportCard doesn't directly)

    // @ts-ignore - Astro component rendering in Vitest can be tricky.
    // This might require a custom render function or Astro's testing tools.
    // We pass props directly here.
    render(ReportCard, { props });
}


describe('ReportCard Component', () => {

    beforeEach(() => {
        // Mock Astro global/config before each test if needed
        // @ts-ignore
        globalThis.Astro = { config: mockAstroConfig };
    });

    afterEach(() => {
        cleanup(); // Clean up the DOM after each test
        // @ts-ignore
        delete globalThis.Astro;
    });

    it('HYPOTHESIS: Should render the report title as a heading', async () => {
        await renderComponent({ report: mockReport });
        const heading = screen.getByRole('heading', { name: mockReport.data.title, level: 3 });
        expect(heading).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should render the publication date', async () => {
        await renderComponent({ report: mockReport });
        const expectedDate = mockReport.data.pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        // Check for text containing the formatted date
        expect(screen.getByText(`Published: ${expectedDate}`, { exact: false })).toBeInTheDocument();
        // Check the time element's datetime attribute
        const timeElement = screen.getByText(expectedDate).closest('time');
        expect(timeElement).toHaveAttribute('datetime', mockReport.data.pubDate.toISOString());
    });

    it('HYPOTHESIS: Should render the description if provided', async () => {
        await renderComponent({ report: mockReport });
        expect(screen.getByText(mockReport.data.description!)).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should NOT render the description if not provided', async () => {
        await renderComponent({ report: mockReportMinimal });
        expect(screen.queryByText(/description/i)).not.toBeInTheDocument(); // Check description text isn't present
    });

    it('HYPOTHESIS: Should render CVSS score if provided', async () => {
        await renderComponent({ report: mockReport });
        expect(screen.getByText(`CVSS: ${mockReport.data.cvss!.toFixed(1)}`)).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should render EPSS score if provided', async () => {
        await renderComponent({ report: mockReport });
        expect(screen.getByText(`EPSS: ${(mockReport.data.epss! * 100).toFixed(1)}%`)).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should render tags if provided', async () => {
        await renderComponent({ report: mockReport });
        for (const tag of mockReport.data.tags!) {
            expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
        }
    });

    it('HYPOTHESIS: Should NOT render CVSS, EPSS, or tags if not provided', async () => {
        await renderComponent({ report: mockReportMinimal });
        expect(screen.queryByText(/CVSS:/)).not.toBeInTheDocument();
        expect(screen.queryByText(/EPSS:/)).not.toBeInTheDocument();
        expect(screen.queryByText(/#/)).not.toBeInTheDocument(); // Check for '#' indicating tags
    });

    it('HYPOTHESIS: Should render a link pointing to the correct report slug with base path', async () => {
        await renderComponent({ report: mockReport });
        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        // Construct expected URL using the mocked base path
        const expectedHref = `${mockAstroConfig.base}reports/${mockReport.slug}/`;
        expect(link).toHaveAttribute('href', expectedHref);
    });
});
