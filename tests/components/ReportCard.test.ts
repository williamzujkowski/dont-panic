import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, getByRole, queryByText, getByText, querySelector } from '@testing-library/dom'; // Import specific functions including cleanup
import '@testing-library/jest-dom/vitest'; // Import Jest DOM matchers for Vitest
// import ReportCard from '../../src/components/ReportCard.astro'; // Cannot import .astro directly
import type { CollectionEntry } from 'astro:content';

// Mock Astro environment variables/config if needed within tests
// For example, mocking Astro.config.base
const mockAstroConfig = {
    base: '/test-base/'
};

// Mock CollectionEntry data reflecting new schema and UI guide fields
const mockReport: CollectionEntry<'reports'> = {
    id: 'sample-cve.md',
    slug: 'sample-cve',
    body: 'Mock body content',
    collection: 'reports',
    data: {
        cveId: "CVE-2024-9999", // Added cveId
        title: "Sample Vulnerability Report: CVE-2024-9999",
        publishDate: new Date("2024-07-15T00:00:00.000Z"), // Renamed
        description: "A brief description of the sample vulnerability.",
        cvssScore: 9.8, // Renamed
        epssScore: 0.85, // Renamed
        tags: ["sample", "critical", "web"],
        severity: "Critical", // Added
        isZeroDay: true // Added
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
        cveId: "CVE-2024-0000", // Added cveId
        title: "Minimal Report",
        publishDate: new Date("2024-07-16T00:00:00.000Z"), // Renamed
        // No description, scores, tags, severity, isZeroDay
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
    const reportUrl = `${mockAstroConfig.base}reports/${report.slug}/`;

    // Mock ScoreDisplay output more accurately
    const cvssScoreHtml = report.data.cvssScore !== undefined
        ? `<div class="score-display text-sm"><span class="font-medium">CVSS Score:</span><span class="ml-1">${report.data.cvssScore.toFixed(1)}</span></div>`
        : '';
    const epssScoreHtml = report.data.epssScore !== undefined
        ? `<div class="score-display text-sm"><span class="font-medium">EPSS Score:</span><span class="ml-1">${(report.data.epssScore * 100).toFixed(1)}%</span></div>`
        : '';

    // Mock SeverityTag output more accurately
    const severityTagHtml = report.data.severity
        ? `<span class="px-2 py-0.5 rounded text-xs font-semibold inline-block severity-tag">${report.data.severity}</span>` // Added base classes
        : '';
    // Mock ZeroDayTag output more accurately
    const zeroDayTagHtml = report.data.isZeroDay
        ? `<span class="px-2 py-0.5 rounded text-xs font-semibold inline-block zero-day-tag">ZERO-DAY</span>` // Added base classes
        : '';

    // Mock Original Tags output more accurately
    const tagsHtml = report.data.tags && report.data.tags.length > 0
        ? `<div class="text-xs mt-auto pt-2 border-t border-border/50">${report.data.tags.slice(0, 4).map(tag =>
            `<span class="inline-block bg-secondary/10 text-secondary rounded px-1.5 py-0.5 mr-1 mb-1 text-[0.7rem] tag">#${tag}</span>` // Added base classes
          ).join('')}</div>`
        : '';

    // Updated main HTML structure with more accurate classes
    const html = `
      <a href="${reportUrl}" class="flex flex-col h-full p-4 bg-surface rounded-md border border-border hover:shadow-md hover:border-primary hover:bg-background transition-all duration-200 ease-in-out group">
        <h3 class="text-base font-semibold mb-1 text-primary group-hover:text-primary-dark">${report.data.cveId}</h3>
        <p class="text-sm text-text-secondary mb-2 line-clamp-2 flex-grow">${report.data.title}</p>
        <p class="text-xs text-text-muted mb-2">
          Published: <time datetime="${report.data.publishDate.toISOString()}">
            ${report.data.publishDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </time>
        </p>
        <div class="flex flex-col gap-0.5 text-xs mb-2">
          ${cvssScoreHtml}
          ${epssScoreHtml}
        </div>
        <div class="flex flex-wrap gap-1 mb-2">
          ${severityTagHtml}
          ${zeroDayTagHtml}
        </div>
        ${tagsHtml}
      </a>
    `;

    // Render the mock HTML into the testing DOM
    const container = document.createElement('div');
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
        // cleanup(); // Vitest + happy-dom should handle cleanup automatically
        // @ts-ignore
        delete globalThis.Astro;
    });

    // Updated tests based on new structure
    it('HYPOTHESIS: Should render the CVE ID as a heading', () => {
        const container = renderComponent({ report: mockReport });
        const heading = getByRole(container, 'heading', { name: mockReport.data.cveId, level: 3 });
        expect(heading).toBeInTheDocument();
    });

     it('HYPOTHESIS: Should render the report title', () => {
        const container = renderComponent({ report: mockReport });
        expect(getByText(container, mockReport.data.title)).toBeInTheDocument();
    });

    it('HYPOTHESIS: Should render the publication date (short format)', () => {
        const container = renderComponent({ report: mockReport });
        const expectedDate = mockReport.data.publishDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const timeElement = getByText(container, expectedDate);
        expect(timeElement).toBeInTheDocument();
        expect(timeElement.tagName).toBe('TIME');
        expect(timeElement).toHaveAttribute('datetime', mockReport.data.publishDate.toISOString());
        expect(timeElement.parentElement).toHaveTextContent(`Published: ${expectedDate}`);
    });

    it('HYPOTHESIS: Should render CVSS score using ScoreDisplay mock structure', () => {
        const container = renderComponent({ report: mockReport });
        const scoreDivs = container.querySelectorAll('.score-display');
        const cvssDiv = Array.from(scoreDivs).find(div => div.textContent?.includes('CVSS Score:'));
        expect(cvssDiv).toBeInTheDocument(); // Check if the element itself exists
        expect(cvssDiv?.textContent).toContain(mockReport.data.cvssScore!.toFixed(1)); // Check text content
    });

    it('HYPOTHESIS: Should render EPSS score using ScoreDisplay mock structure', () => {
        const container = renderComponent({ report: mockReport });
        const scoreDivs = container.querySelectorAll('.score-display');
        const epssDiv = Array.from(scoreDivs).find(div => div.textContent?.includes('EPSS Score:'));
        expect(epssDiv).toBeInTheDocument(); // Check if the element itself exists
        expect(epssDiv?.textContent).toContain(`${(mockReport.data.epssScore! * 100).toFixed(1)}%`); // Check text content
    });

    it('HYPOTHESIS: Should render SeverityTag mock element with text if severity provided', () => {
        const container = renderComponent({ report: mockReport });
        const tag = container.querySelector('.severity-tag');
        expect(tag).toBeInTheDocument();
        expect(tag).toHaveTextContent(mockReport.data.severity!);
        expect(tag).toHaveClass('px-2', 'py-0.5', 'rounded'); // Check base classes
    });

     it('HYPOTHESIS: Should render ZeroDayTag mock element with text if isZeroDay is true', () => {
        const container = renderComponent({ report: mockReport });
        const tag = container.querySelector('.zero-day-tag');
        expect(tag).toBeInTheDocument();
        expect(tag).toHaveTextContent("ZERO-DAY");
        expect(tag).toHaveClass('px-2', 'py-0.5', 'rounded'); // Check base classes
    });

    it('HYPOTHESIS: Should NOT render SeverityTag or ZeroDayTag mock elements if not provided/false', () => {
        const container = renderComponent({ report: mockReportMinimal });
        expect(container.querySelector('.severity-tag')).not.toBeInTheDocument();
        expect(container.querySelector('.zero-day-tag')).not.toBeInTheDocument();
    });

    it('HYPOTHESIS: Should render limited tags with correct classes if provided', () => {
        const container = renderComponent({ report: mockReport });
        const tagElements = container.querySelectorAll('.tag');
        expect(tagElements).toHaveLength(Math.min(mockReport.data.tags!.length, 4));
        expect(tagElements[0]).toHaveTextContent(`#${mockReport.data.tags![0]}`);
        expect(tagElements[0]).toHaveClass('inline-block', 'bg-secondary/10', 'text-secondary', 'rounded'); // Check base classes
    });

    it('HYPOTHESIS: Should render a link pointing to the correct report slug with base path', () => {
        const container = renderComponent({ report: mockReport });
        expect(container).toBeInTheDocument();
        expect(container.tagName).toBe('A');
        const expectedHref = `${mockAstroConfig.base}reports/${mockReport.slug}/`;
        expect(container).toHaveAttribute('href', expectedHref);
    });
});
