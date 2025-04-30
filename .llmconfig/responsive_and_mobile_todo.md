Checklist: Responsive & Mobile Implementation ("Don't Panic" Frontend)
Objective: Ensure the "Don't Panic" website is fully responsive, accessible, and user-friendly across all device sizes (mobile, tablet, desktop).

Reference: This checklist details the responsive aspects mentioned in the main implementation checklist (llm_checklist_dont_panic_v3). All implementations must use Tailwind CSS responsive prefixes (sm:, md:, lg:, xl:) and adhere to CLAUDE.md.

1. Base Layout & Viewport (src/layouts/BaseLayout.astro)

[ ] Verify Viewport Meta Tag: Ensure <meta name="viewport" content="width=device-width, initial-scale=1.0"> is present in the <head>.

[ ] Body/Main Padding: Check that base padding applied in BaseLayout.astro (e.g., px-2 sm:px-4 md:px-6) scales appropriately for different screen sizes.

2. Header (src/components/Header.astro)

[ ] Navigation Links:

Ensure sufficient touch target size for navigation links (About, Methodology) on mobile.

Consider collapsing navigation links into a "hamburger" menu on small screens (sm: or md:) if space becomes too tight, especially if more links are added later. Use JavaScript to toggle the menu visibility.

[ ] Search Component:

Verify the Pagefind search input/button is easily tappable on mobile.

Ensure the search modal/UI renders correctly and is usable on small screens.

3. Static Content Pages (/about, /methodology, /reports/[slug])

[ ] Prose Readability: Verify that the prose styles applied to Markdown content reflow correctly on mobile, ensuring text is readable without horizontal scrolling. Check line lengths and font sizes.

[ ] Code Blocks: Ensure code blocks within prose content are horizontally scrollable (overflow-x-auto) if they exceed the screen width on mobile.

[ ] Images/Media (If any): Ensure any images or embedded media are responsive (max-w-full h-auto).

4. Homepage Layout (src/pages/index.astro) (Verified 2025-04-30)

[X] Two-Column Layout Responsiveness:
    [X] Implement the main layout using Flexbox or Grid. (`flex`)
    [X] Ensure it stacks vertically by default (`flex-col`).
    [X] Use responsive prefixes to switch to a horizontal layout (`md:flex-row`).

[X] Filter Sidebar Responsiveness (src/components/FilterSidebar.astro & src/pages/index.astro script):
    [X] Mobile Visibility: Option A (Hide by default `hidden md:block`, toggle button `md:hidden`, JS toggle) implemented.
    [X] Width: Desktop width (`md:w-64...`) and mobile overlay width (`w-[85%] max-w-sm` via JS) implemented.
    [X] Toggle Button (Option A): Implemented with label, icon, ARIA (`aria-controls`, `aria-expanded`), and touch target size (`min-h-[44px]`).
    [X] Scrolling: Desktop scrolling (`md:overflow-y-auto`) and mobile overlay scrolling (`overflow-y-auto` via JS) implemented.

[X] Table Container Responsiveness: (Verified 2025-04-30)
    [X] Ensure the div wrapping the <table> has overflow-x-auto applied consistently. (`overflow-x-auto` is present on the container div).

5. Table Responsiveness (<table> in src/pages/index.astro) (Verified 2025-04-30)

[X] Horizontal Scrolling: Verify overflow-x-auto on the container works correctly. (Container has `overflow-x-auto`).

[X] Column Visibility (Optional but Recommended):
    [X] Identify less critical columns (Title, EPSS, Zero-Day).
    [X] Apply responsive utility classes (`hidden sm:table-cell`, `hidden md:table-cell`) to hide columns on smaller screens.
    [X] Ensure critical information remains visible.

[X] Cell Padding/Whitespace: Ensure appropriate padding (`px-2 sm:px-3 py-3`) and whitespace handling (`whitespace-nowrap` used selectively).

6. Filter Controls Responsiveness (src/components/FilterSidebar.astro) (Updated 2025-04-30)

[X] Touch Target Size:
    [X] Checkboxes, Date Inputs, Text Inputs, Summaries: Use `min-h-[44px]` or sufficient padding/labels.
    [X] Sliders: Added `py-2` to container divs for better vertical spacing.
    [X] Buttons: Date Presets (`min-h-[44px]`), Apply Filters (`min-h-[48px]`) OK. Reset All button padding increased (`py-2 px-3`). Close button padding increased (`p-2`).

[X] Input Fields: Native date pickers used. Text inputs OK. Sliders improved with padding.

[X] Collapsible Sections: `<details>/<summary>` use `min-h-[44px]`.

[X] Dynamic Lists (Vendor/Product): Use `max-h-40 overflow-y-auto`.

7. JavaScript Interactivity & Responsiveness (Verified 2025-04-30)

[X] Sidebar Toggle Logic (If implemented): JS in `index.astro` handles toggle button, close button event, ARIA attributes, overlay, and animations correctly.

[X] Event Listeners: Sorting/filtering listeners seem appropriate for touch/mouse.

8. Testing (Process Reminder)

[ ] Browser DevTools: Use browser developer tools extensively.
[ ] Physical Devices: Test on actual mobile and tablet devices.
[ ] Cross-Browser Testing: Check layout and functionality on major browsers.
[ ] E2E Tests (Playwright): Add specific tests for responsive behavior.
