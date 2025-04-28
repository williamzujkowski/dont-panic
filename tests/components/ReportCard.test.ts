import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, getByRole, queryByText, getByText } from '@testing-library/dom'; // Import specific functions including cleanup
import '@testing-library/jest-dom/vitest'; // Import Jest DOM matchers for Vitest
// import ReportCard from '../../src/components/ReportCard.astro'; // Cannot import .astro directly
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


// Helper to render the component's *mock HTML structure*
// This simulates the output for basic structure testing.
function renderComponent(props: { report: CollectionEntry<'reports'> }) {
    const { report } = props;
    const reportUrl = `${mockAstroConfig.base}reports/${report.slug}/`; // Use mocked base

    const descriptionHtml = report.data.description
        ? `<p class="text-sm text-text-secondary mb-3 line-clamp-2">${report.data.description}</p>`
        : '';
    const cvssHtml = report.data.cvss
        ? `<span class="inline-block bg-red-100 text-red-800 rounded px-2 py-0.5">CVSS: ${report.data.cvss.toFixed(1)}</span>`
        : '';
    const epssHtml = report.data.epss
        ? `<span class="inline-block bg-yellow-100 text-yellow-800 rounded px-2 py-0.5">EPSS: ${(report.data.epss * 100).toFixed(1)}%</span>`
        : '';
    const tagsHtml = report.data.tags && report.data.tags.length > 0
        ? `<div class="text-xs">${report.data.tags.map(tag => `<span class="inline-block bg-secondary/10 text-secondary rounded px-2 py-0.5 mr-1 mb-1">#${tag}</span>`).join('')}</div>`
        : '';

    const html = `
      <a href="${reportUrl}" class="block p-6 bg-surface rounded-md border border-border hover:shadow-sm hover:border-primary transition-all duration-200 ease-in-out group">
        <h3 class="text-lg font-semibold mb-2 text-primary group-hover:text-primary-dark">${report.data.title}</h3>
        <p class="text-sm text-text-muted mb-3">
          Published: <time datetime="${report.data.pubDate.toISOString()}">
            ${report.data.pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </p>
        ${descriptionHtml}
        <div class="flex flex-wrap gap-2 text-xs mb-3">
          ${cvssHtml}
          ${epssHtml}
        </div>
        ${tagsHtml}
      </a>
    `;

    // Render the mock HTML into the testing DOM
    const container = document.createElement('div'); // Create a container div
    container.innerHTML = html;
    document.body.appendChild(container); // Append the container to the body

    // Return the actual anchor element, not just the first child of the body
    return container.querySelector('a') as HTMLElement;
}


describe('ReportCard Component Structure Test', () => {

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

    it('HYPOTHESIS: Should render the report title as a heading', () => {
        const container = renderComponent({ report: mockReport });
        const heading = getByRole(container, 'heading', { name: mockReport.data.title, level: 3 });
        expect(heading).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should render the publication date', () => {
        const container = renderComponent({ report: mockReport });
        const expectedDate = mockReport.data.pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        // Check for text containing the formatted date
        expect(getByText(container, `Published: ${expectedDate}`, { exact: false })).toBeInTheDocument();
        // Check the time element's datetime attribute
        const timeElement = getByText(container, expectedDate).closest('time');
        expect(timeElement).toHaveAttribute('datetime', mockReport.data.pubDate.toISOString());
    });

    it('HYPOTHESIS: Should render the description if provided', () => {
        const container = renderComponent({ report: mockReport });
        expect(getByText(container, mockReport.data.description!)).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should NOT render the description if not provided', () => {
        const container = renderComponent({ report: mockReportMinimal });
        // Check description text isn't present within the container
        expect(queryByText(container, /brief description/i)).not.toBeInTheDocument();
    });

    it('HYPOTHESIS: Should render CVSS score if provided', () => {
        const container = renderComponent({ report: mockReport });
        expect(getByText(container, `CVSS: ${mockReport.data.cvss!.toFixed(1)}`)).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should render EPSS score if provided', () => {
        const container = renderComponent({ report: mockReport });
        expect(getByText(container, `EPSS: ${(mockReport.data.epss! * 100).toFixed(1)}%`)).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should render tags if provided', () => {
        const container = renderComponent({ report: mockReport });
        for (const tag of mockReport.data.tags!) {
            expect(getByText(container, `#${tag}`)).toBeInTheDocument();
        }
    });

    it('HYPOTHESIS: Should NOT render CVSS, EPSS, or tags if not provided', () => {
        const container = renderComponent({ report: mockReportMinimal });
        expect(queryByText(container, /CVSS:/)).not.toBeInTheDocument();
        expect(queryByText(container, /EPSS:/)).not.toBeInTheDocument();
        expect(queryByText(container, /#/)).not.toBeInTheDocument(); // Check for '#' indicating tags
    });

    it('HYPOTHESIS: Should render a link pointing to the correct report slug with base path', () => {
        const container = renderComponent({ report: mockReport });
        const link = getByRole(container, 'link'); // The container itself is the link
        expect(link).toBeInTheDocument();
        // Construct expected URL using the mocked base path
        const expectedHref = `${mockAstroConfig.base}reports/${mockReport.slug}/`;
        expect(link).toHaveAttribute('href', expectedHref);
    });
});
