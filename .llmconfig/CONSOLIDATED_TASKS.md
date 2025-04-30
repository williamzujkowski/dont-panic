LLM Implementation Checklist: "Don't Panic" Frontend (Astro/Tailwind - Table Layout - Prioritized)
Objective: Generate the code for the "Don't Panic" vulnerability intelligence website frontend following the specified design and functionality, optimized for efficient data display and interaction via a table-based layout on the homepage with a dedicated filter sidebar.

Core Technologies: Astro.js, Tailwind CSS, TypeScript (Strict).
Primary UI Pattern: Data-dense, sortable, filterable table view on the homepage (/) accompanied by a left-hand filter sidebar. Static content pages for About/Methodology/Report Details.
Key Standards: Adhere strictly to CLAUDE.md for all code, testing, accessibility, and Git practices. Follow the design principles outlined in styling_guide_dont_panic_v2 (table layout focus, incorporating sidebar).
Current Status: Project setup, core static components/pages, search, basic CI/CD, and base styling are complete. Refactoring the index page to table view is in progress.

Phase 0: Project Setup & Configuration (✅ Completed)

[✅] Initialize Project & Dependencies (Astro, Tailwind, TS, Pagefind, Playwright, Linters)

[✅] Configure Astro (astro.config.mjs)

[✅] Configure Tailwind (tailwind.config.cjs with Typography plugin)

[✅] Configure TypeScript (tsconfig.json - Strict mode)

[✅] Setup Repository Files (README.md, FILE_TREE.md, CLAUDE.md, .gitignore, linting configs)

[✅] Content Collection Setup (src/content/config.ts schema, sample reports)

Phase 1: Core Layout & Static Components (✅ Completed)

[✅] Verify/Update src/layouts/BaseLayout.astro (Structure, Meta, Body Styling, Slots)

[✅] Verify/Update src/components/Header.astro (Structure, Styling, Title Link, Nav Links, Search Integration)

[✅] Verify/Update src/components/Footer.astro (Structure, Styling, Content)

[✅] Verify/Update src/components/SeverityTag.astro (Props, Styling, Dark Mode)

[✅] Verify/Update src/components/ZeroDayTag.astro (Props, Styling, Dark Mode)

Phase 2: Static Pages (Detail, About, Methodology) (✅ Completed)

[✅] Verify/Update src/pages/reports/[slug].astro (Detail Page - getStaticPaths, Layout, Content Rendering, Styling)

[✅] Verify/Update src/pages/about.astro (Layout, Content Rendering, Styling)

[✅] Verify/Update src/pages/methodology.astro (Layout, Content Rendering, Styling)

[✅] Verify Static Build (npm run build)

Phase 3: Homepage Refactor: Table View & Filter Sidebar (✅ Completed)

[✅] Refactor src/pages/index.astro:

[✅] Remove Existing Content: Confirm Hero.astro, Features.astro, Testimonials.astro, ReportCard.astro components are removed from this page's usage.

[✅] Use BaseLayout.astro (pass title="Vulnerability Reports").

[✅] Fetch all reports: const reports = await getCollection('reports'); (Apply default sort by date descending).

[✅] Implement Two-Column Layout:

Use Flexbox or Grid (e.g., <div class="flex flex-col md:flex-row">).

Place <FilterSidebar reports={reports} /> (from next step) in the first column (fixed width).

Place the table container in the second column (flexible width, flex-grow).

[✅] Add optional <h1>Vulnerability Reports</h1> (text-xl font-semibold mb-4) above the table container.

[✅] Add optional Active Filter Summary display area above the table (placeholder div for now).

[✅] Implement Table Structure (HTML & Astro):

Add container div (overflow-x-auto).

Add <table> (id="reportTable", w-full text-left text-sm).

Add <thead> (bg-gray-100 dark:bg-gray-700). Add <th> for columns (CVE ID, Title/Summary, CVSS, EPSS, Severity, Zero-Day?, Date). Apply styling, scope="col", data-sort-key, sort icons (<span>↕</span>).

Add <tbody> (id="reportTableBody"). Map reports to generate <tr>. Apply styling, data attributes for filtering (data-cve, data-severity, data-date, data-zeroday, data-cvss, data-epss, potentially data-vendors, data-products).

Generate <td>. Apply styling. Render content (Link for CVE, Text, <SeverityTag>, Checkmark/Yes for ZeroDay, Formatted Date). Apply conditional text colors for scores. Add data-value for sorting scores/dates.

[✅] Create src/components/FilterSidebar.astro:

Define component structure (<aside>/<div>). Apply Tailwind for width, padding, background, border.

Implement Filter Sections (Collapsible):

Use <details>/<summary> elements. Style summary elements.

Quick Filters/Status: Add checkboxes (<input type="checkbox">+labels) for "Known Exploited (KEV)", "Zero-Day/Preliminary". Give unique IDs.

Severity & Risk Score: Add range sliders (<input type="range">) for CVSS/EPSS (needs JS). Add labels/value displays. Add checkboxes/radio buttons for Severity levels (Critical, High). Give unique IDs/names.

Date Ranges: Add date inputs (<input type="date">). Give unique IDs. Add preset buttons (Last 7 days, etc.).

Vendor/Product/OS: Implement collapsible lists (<details>). Add placeholder structure (dynamic population via JS later). Add checkboxes for items. Add search input within lists if needed.

Add "Reset Filters" Button: Style appropriately. Give ID.

[✅] Verify Layout: Run npm run dev. Check the two-column layout, sidebar structure, table structure, responsiveness. Ensure data attributes are present.

[✅] Cleanup Vestigial Components:

[✅] Delete Unused Files: Confirm Hero.astro, Features.astro, Testimonials.astro, ReportCard.astro and their tests are deleted.

[✅] Remove Unused Imports.

[✅] Update FILE_TREE.md (after removals and adding FilterSidebar.astro).

Phase 4: Client-Side JavaScript for Interactivity (✅ Completed)

[✅] Implement JavaScript Logic (e.g., in separate .ts file imported by index.astro with <script>):

[✅] Get DOM References: Get table body, all filter controls in the sidebar, sortable headers, reset button, active filter display.

[✅] Initialization Function: Call on DOMContentLoaded. Read URLSearchParams. Store initial state. Set filter control values. Initialize sliders/dynamic lists. Call applySorting(), applyFiltering(), handleHighlighting(). Add event listeners.

[✅] URL Update Function (updateURL()): Takes state, constructs URLSearchParams, uses history.pushState.

[✅] Sorting Logic (applySorting(), handleSortClick()): Implement/verify sorting based on data-value or text, handling types. Update DOM order. Update sort icons. Update URL.

[✅] Filtering Logic (applyFiltering(), handleFilterChange()): Implement/verify reading all sidebar filter values. Iterate rows, check data attributes against all filters. Update row visibility (row.hidden). Update URL. Update active filter summary display.

[✅] Reset Filters Logic: Implement listener. Clear state/inputs. Call applyFiltering(), updateURL().

[✅] Highlighting Logic (handleHighlighting()): Implement/verify localStorage timestamp comparison. Add/remove new-report class. Update timestamp.

[✅] Define Highlighting Style: Add CSS rule for .new-report with optional fade-out animation.

[✅] Test Interactivity: Thoroughly test sorting, all filter types, combinations, reset, URL state, highlighting.

Phase 5: Report Syncing (✅ Completed / ❗ High Priority)

[✅] Implement Automated Report Syncing:

[✅] Finalize sync strategy (GitHub Action pulling from vulnerability-intelligence-generator repository).

[✅] Implement/Update the corresponding GitHub workflow (sync_reports.yml). Ensure reliable placement of .md files into src/content/reports/.

[✅] Test the sync process thoroughly.

[✅] Document the sync process (docs/report-syncing.md).

Phase 6: Testing & Accessibility (Ongoing / ❗ Medium Priority)

[ ] Write/Update E2E Tests (Playwright):

[ ] Test initial table load with sidebar.

[ ] Test sorting functionality (Date, CVSS).

[ ] Test filtering functionality using sidebar controls (severity, date, etc.).

[ ] Test URL state updates on sort/filter.

[✅] Test navigation (detail/about/methodology).

[✅] Test Pagefind search.

[⚠️] Improve Accessibility:

[ ] Conduct accessibility audit (WCAG compliance) using axe or similar tools.

[✅] Fix any identified contrast, focus order, or semantic issues.

[✅] Ensure proper ARIA attributes for table, controls, and dynamic regions.

[ ] Add keyboard navigation improvements (e.g., skip-to-content link).

[ ] Test with screen readers.

Phase 7: Final Review & Enhancements (Future / Low Priority)

[❌] Perform Performance Optimization: Lighthouse audit, image optimization, bundle analysis.

[❌] Enhance Report Visualization: Charts, timelines, related vulnerabilities on detail pages.

[❌] Final Review & Cleanup: Manual testing (browsers/screens), code cleanup (unused vars/imports/CSS), ensure FILE_TREE.md is accurate.