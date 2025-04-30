LLM Implementation Checklist: "Don't Panic" Frontend (Astro/Tailwind - Table Layout - Updated)
Objective: Generate the code for the "Don't Panic" vulnerability intelligence website frontend following the specified design and functionality, optimized for efficient data display and interaction via a table-based layout on the homepage.

Core Technologies: Astro.js, Tailwind CSS, TypeScript (Strict).
Primary UI Pattern: Data-dense, sortable, filterable table view on the homepage (/). Static content pages for About/Methodology/Report Details.
Key Standards: Adhere strictly to CLAUDE.md for all code, testing, accessibility, and Git practices. Follow the design principles outlined in styling_guide_dont_panic_v2 (table layout focus).
Current Status: Project setup, core static components/pages, search, and basic CI/CD are largely complete. Focus is on implementing the table view, filtering/sorting logic, and report syncing.

Phase 0: Project Setup & Configuration (✅ Mostly Complete)

[✅] Initialize Project: (Assumed complete based on file tree)

[✅] Configure Astro (astro.config.mjs): (Verify site, output: 'static', Tailwind integration, Pagefind integration).

[✅] Configure Tailwind (tailwind.config.cjs): (Verify @tailwindcss/typography plugin, font extensions, content paths).

[✅] Configure TypeScript (tsconfig.json): (Verify strict mode).

[✅] Setup Repository Files: (Verify structure, README.md, FILE_TREE.md, CLAUDE.md, .gitignore, linting/formatting configs).

[✅] Content Collection Setup (src/content/): (Verify config.ts schema and sample .md files in src/content/reports/).

Phase 1: Core Layout & Static Components (✅ Mostly Complete)

[✅] Verify/Update src/layouts/BaseLayout.astro:

Ensure standard HTML structure, meta tags (charset, viewport).

Verify Props interface (title, description).

Verify base <body> styling (Tailwind: bg-white dark:bg-gray-900...).

Ensure <Header /> and <Footer /> are included.

Ensure <main> tag with base padding (px-2 py-4...). Confirm no max-w- class applied directly here.

[✅] Verify/Update src/components/Header.astro:

Verify <header> tag, background, padding, border.

Verify flex justify-between items-center.

Verify Site Title link (<a href="/">Don't Panic</a>, text-lg font-semibold).

Verify navigation links (<nav>) for About/Methodology (text-sm space-x-4 hover:underline).

Verify integration of the existing Search.astro component (using Pagefind).

[✅] Verify/Update src/components/Footer.astro:

Verify <footer> tag, padding, margins, borders.

Verify copyright text and optional links (text-xs text-gray-500...).

[✅] Verify/Update src/components/SeverityTag.astro:

Verify Props interface and conditional rendering.

Verify Tailwind classes for "Critical" and "High" severities match the plan (including dark mode variants).

[✅] Verify/Update src/components/ZeroDayTag.astro:

Verify Props interface and conditional rendering (isZeroDay).

Verify Tailwind classes match the plan (including dark mode variants).

Phase 2: Static Pages (Detail, About, Methodology) (✅ Mostly Complete)

[✅] Verify/Update src/pages/reports/[slug].astro (Report Detail Page):

Verify getStaticPaths implementation.

Verify use of BaseLayout.astro.

Verify container div with class="max-w-prose mx-auto px-4 py-8".

Verify rendering of Report Header (CVE ID <h1>, Title <h2>, Date, <SeverityTag>, <ZeroDayTag>) with appropriate styles/margins.

Verify rendering of Key Scores section (CVSS/EPSS with text colors, links).

Verify rendering of Markdown content via <entry.Content /> within a div using class="prose dark:prose-invert max-w-none".

[✅] Verify/Update src/pages/about.astro:

Verify import of content from src/content/pages/about.md (or similar).

Verify use of BaseLayout.astro.

Verify container div with class="max-w-prose mx-auto px-4 py-8 prose dark:prose-invert max-w-none".

Verify rendering of <Content />.

[✅] Verify/Update src/pages/methodology.astro:

Verify import of content from src/content/pages/methodology.md (or similar).

Verify use of BaseLayout.astro.

Verify container div with class="max-w-prose mx-auto px-4 py-8 prose dark:prose-invert max-w-none".

Verify rendering of <Content />.

[✅] Verify Static Build: (Run npm run build periodically).

Phase 3: Homepage Table View Implementation (❗ Requires significant changes to index.astro)

[ ] Refactor src/pages/index.astro:

[ ] Remove/Replace Existing Content: Remove usage of Hero.astro, Features.astro, Testimonials.astro, ReportCard.astro components from this page if they exist. The primary content will be the table.

[ ] Use BaseLayout.astro (pass title="Vulnerability Reports").

[ ] Fetch all reports: const reports = await getCollection('reports'); (Apply default sort by date descending).

[ ] Add optional <h1>Vulnerability Reports</h1> (text-xl font-semibold mb-4).

[ ] Implement Filter Controls Structure (HTML):

Add container div (flex flex-wrap gap-2 mb-4).

Add text input: <input type="text" id="searchInput" placeholder="Search..." class="border rounded px-2 py-1 text-sm">.

Add severity select: <select id="severityFilter" class="border rounded px-2 py-1 text-sm appearance-none"><option value="">All Severities</option><option value="Critical">Critical</option><option value="High">High</option></select>.

Add zero-day checkbox: <label class="text-sm flex items-center gap-1"><input type="checkbox" id="zeroDayFilter"> Show Only Zero-Days</label>.

[ ] Implement Table Structure (HTML & Astro):

Add container div (overflow-x-auto).

Add <table> (id="reportTable", w-full text-left text-sm).

Add <thead> (bg-gray-100 dark:bg-gray-700).

Add <tr>.

Add <th> for each column (CVE ID, Title/Summary, CVSS, EPSS, Severity, Zero-Day?, Date). Apply styling: px-3 py-2 font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600. Add scope="col". Add data-sort-key="...". Add placeholder sort icons (<span>↕</span>).

Add <tbody> (id="reportTableBody").

Use Astro's map function ({reports.map((report) => ...)}) to generate <tr> elements.

Apply <tr> styling: border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50. Add data attributes for filtering: data-cve={report.slug}, data-severity={report.data.severity}, data-date={report.data.date.toISOString().split('T')[0]}, data-zeroday={report.data.isZeroDay}.

Generate <td> for each column. Apply styling: px-3 py-2. Adjust whitespace-nowrap/normal.

CVE ID: Render as link <a> to /reports/${report.slug}. Style: text-blue-600 dark:text-blue-400 font-medium hover:underline.

Title: Render report.data.title.

CVSS/EPSS: Render score. Apply conditional text color. Add data-value={report.data.cvss}. Use font-mono.

Severity: Render <SeverityTag severity={report.data.severity} />.

Zero-Day?: Render checkmark SVG or "Yes" if report.data.isZeroDay.

Date: Render formatted date. Add data-value={report.data.date...}.

[ ] Verify Layout: Run npm run dev. Check the new table structure, styling, and responsiveness. Ensure data attributes are present. Confirm previous Hero/Card components are gone from this page.

[ ] Cleanup Vestigial Components:

[ ] Delete Unused Files: Remove the component files (Hero.astro, Features.astro, Testimonials.astro, ReportCard.astro) from src/components/ as they are no longer used on index.astro.

[ ] Delete Associated Tests: Remove the corresponding test files (e.g., Hero.test.ts, ReportCard.test.ts) from src/components/ or tests/components/.

[ ] Remove Unused Imports: Check index.astro and other files for any imports related to the deleted components and remove them.

[ ] Update FILE_TREE.md: Reflect the removal of these files.

Phase 4: Client-Side JavaScript for Table Interactivity (❗ High Priority Implementation)

[ ] Implement JavaScript Logic (in <script is:inline> tag in index.astro or linked .ts file):

[ ] Get DOM References: Get table body, filter inputs, sortable headers.

[ ] Initialization Function:

Call on DOMContentLoaded.

Read URLSearchParams for initial state (sort, dir, search, severity, zeroday).

Store initial state. Set filter control values.

Call applySorting() and applyFiltering().

Call handleHighlighting().

[ ] URL Update Function (updateURL()):

Takes current state, constructs URLSearchParams, uses history.pushState.

[ ] Sorting Logic (applySorting(), handleSortClick()):

Add click listeners to <th>.

handleSortClick: Update sort state, call applySorting(), call updateURL().

applySorting: Get state. Get <tr> elements. Sort array based on data-value or text content (handle types). Clear <tbody>. Append sorted rows. Update sort icons.

[ ] Filtering Logic (applyFiltering(), handleFilterChange()):

Add event listeners (input/change) to filters (debounce text input).

handleFilterChange: Update filter state, call applyFiltering(), call updateURL().

applyFiltering: Get state. Iterate <tr>. Check data attributes against all filters. Set row.hidden = !matches.

[ ] Highlighting Logic (handleHighlighting()):

Use localStorage for lastVisitTimestamp. Compare report data-date. Add new-report class to new <tr>. Update timestamp.

[ ] Define Highlighting Style: Add CSS rule for .new-report (e.g., tr.new-report { border-left: 4px solid theme('colors.green.500'); animation: fadeOutHighlight 3s ease-out forwards; } and define @keyframes fadeOutHighlight).

[ ] Test Interactivity: Thoroughly test sorting, filtering, URL state persistence, and highlighting.

Phase 5: Report Syncing, CI/CD & Final Checks (❗ Syncing is High Priority)

[ ] Implement Automated Report Syncing:

[ ] Finalize sync strategy (GitHub Action pulling from Repo 2, S3 trigger, etc. - refer to docs/report-syncing.md if it exists).

[ ] Implement/Update the corresponding GitHub workflow (e.g., sync_reports.yml or integrate into deploy.yml). Ensure it reliably places new/updated .md files into src/content/reports/.

[ ] Test the sync process thoroughly.

[✅] Verify/Update CI/CD Workflows (.github/workflows/):

[✅] build_test.yml: Ensure it runs lint, build, and E2E tests.

[✅] deploy.yml: Ensure it triggers correctly (e.g., on merge to main), includes the build step, and deploys the dist/ directory. Verify secret handling.

[ ] Write/Update E2E Tests (Playwright):

[ ] Test initial table load.

[ ] Test sorting functionality (Date, CVSS).

[ ] Test filtering functionality (text search, severity).

[ ] Test URL state updates on sort/filter.

[✅] Test navigation to detail/about/methodology pages (likely exists).

[✅] Test Pagefind search functionality (likely exists).

[ ] Final Review & Accessibility:

[ ] Perform manual testing across browsers/screen sizes.

[ ] Conduct accessibility audit (keyboard nav, screen reader, contrast). Remediate issues.

[ ] Perform Code Cleanup: Review code for unused variables, functions, imports, or CSS classes. Remove any dead code.

[ ] Ensure FILE_TREE.md is accurate after all changes and removals.

[ ] Ensure all code adheres to CLAUDE.md.