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

4. Homepage Layout (src/pages/index.astro)

[ ] Two-Column Layout Responsiveness:

Implement the main layout using Flexbox or Grid.

Ensure it stacks vertically by default (flex-col).

Use responsive prefixes to switch to a horizontal layout on larger screens (e.g., md:flex-row).

[ ] Filter Sidebar Responsiveness (src/components/FilterSidebar.astro):

Mobile Visibility: Decide on mobile behavior:

Option A (Recommended): Hide the sidebar by default on small screens (hidden md:block). Add a "Filters" button (e.g., near the top or header) that toggles the sidebar visibility using JavaScript (e.g., sliding in from the side or appearing as a modal).

Option B: Stack the sidebar above the table on small screens (w-full md:w-64 ...).

Width: Ensure the sidebar takes w-full when stacked or appropriately sized (md:w-64 md:flex-shrink-0) when side-by-side.

Toggle Button (If Option A): Implement a clearly labeled button (<button>) with an icon (e.g., filter icon) visible only on small screens (md:hidden). Add necessary JavaScript and ARIA attributes (aria-controls, aria-expanded) for toggling. Ensure the button has adequate touch target size.

Scrolling: If filter sections become long, ensure the sidebar content itself is vertically scrollable (overflow-y-auto) within its container, especially on mobile when it might have limited height (if shown as an overlay/modal).

[ ] Table Container Responsiveness:

Ensure the div wrapping the <table> has overflow-x-auto applied consistently to allow horizontal scrolling of the table content on small screens where it might not fit.

5. Table Responsiveness (<table> in src/pages/index.astro)

[ ] Horizontal Scrolling: Verify overflow-x-auto on the container works correctly, allowing users to scroll the table horizontally on small screens.

[ ] Column Visibility (Optional but Recommended):

Identify less critical columns (e.g., EPSS score, potentially Title/Summary if CVE ID is primary).

Apply responsive utility classes to hide these columns on smaller screens (e.g., hidden md:table-cell on both the <th> and corresponding <td> elements).

Ensure the most critical information (CVE ID, Severity, Date, CVSS) remains visible by default if possible.

[ ] Cell Padding/Whitespace: Ensure px- and py- on <th> and <td> provide enough space but don't waste too much horizontal space, especially on mobile. Adjust padding for smaller screens if necessary (px-2 md:px-3). Use whitespace-nowrap judiciously (e.g., for scores, dates, tags) but allow wrapping for titles/summaries (whitespace-normal).

6. Filter Controls Responsiveness (src/components/FilterSidebar.astro)

[ ] Touch Target Size: Ensure all interactive elements (checkboxes, radio buttons, select dropdowns, sliders, date inputs, buttons, collapsible <summary> elements) have sufficient size and spacing to be easily tapped on mobile devices (minimum 44x44px recommended guideline). Use appropriate padding (p-2, p-3).

[ ] Input Fields: Ensure text inputs, date inputs, and sliders are usable on mobile keyboards/touch interfaces. Consider native date pickers where appropriate.

[ ] Collapsible Sections: Verify <details>/<summary> elements work correctly on touch devices. Ensure the clickable area for <summary> is large enough.

[ ] Dynamic Lists (Vendor/Product): If these lists become long, ensure they are scrollable within their container inside the sidebar (overflow-y-auto max-h-XX).

7. JavaScript Interactivity & Responsiveness

[ ] Sidebar Toggle Logic (If implemented): Ensure the JavaScript correctly toggles the visibility/state of the sidebar and the toggle button's ARIA attributes.

[ ] Event Listeners: Ensure all event listeners for filtering/sorting work correctly on both touch and mouse events.

8. Testing

[ ] Browser DevTools: Use browser developer tools extensively to simulate different screen sizes (mobile, tablet, desktop) and touch events.

[ ] Physical Devices: Test on actual mobile and tablet devices (iOS and Android) if possible.

[ ] Cross-Browser Testing: Check layout and functionality on major browsers (Chrome, Firefox, Safari, Edge).

[ ] E2E Tests (Playwright): Add specific tests that resize the viewport and verify layout changes (e.g., sidebar hiding/showing, column hiding, table scrolling).