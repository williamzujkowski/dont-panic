**Assumptions:**

* You have Node.js and npm (or pnpm/yarn) installed.
* Basic familiarity with Astro concepts (components, layouts, pages).
* We'll use Astro's built-in testing capabilities or a compatible library conceptually (like `@astrojs/testing-library` or Vitest with appropriate setup) for component testing. The *exact* test syntax isn't the focus here, but rather the *what* to test at each step.

**Core Goal:** Create a flexible, good-looking homepage structure using Astro components that can be easily adapted for different projects.

---

**TDD Blueprint: Reusable Astro Homepage**

**Phase 1: Project Setup & Basic Structure**

* **Step 1.1: Initialize Astro Project**
    * **Action:** Run `npm create astro@latest` (or equivalent) and follow the prompts. Choose "Empty" or a minimal template. Select TypeScript if comfortable. Install dependencies.
    * **Test (Manual/Setup Verification):** Run `npm run dev`. Can you access the default Astro page in your browser?
    * **Rationale:** Establish the foundational Astro project environment.

* **Step 1.2: Create Basic Layout Component**
    * **(Red) Test:** Write a test asserting that a `Layout.astro` component:
        * Renders basic HTML structure (`<html>`, `<head>`, `<body>`).
        * Accepts and renders content passed into its default `<slot />`.
        * Accepts a `title` prop and renders it in the `<title>` tag.
    * **(Green) Code:** Create `src/layouts/Layout.astro`. Implement the minimal HTML structure, include `<slot />` within `<body>`, and add a `title` prop used in `<head>`.
    * **(Refactor) Code:** Ensure basic meta tags (charset, viewport) are present.
    * **Integration:** Modify `src/pages/index.astro` to *use* this `Layout`, passing a sample title.
    * **(Green) Test:** Run tests. Verify `index.astro` renders correctly within the layout structure in the browser.
    * **Rationale:** Define the main page wrapper required by Astro pages.

**Phase 2: Core Navigation Components**

* **Step 2.1: Create Header Component Shell**
    * **(Red) Test:** Write a test asserting that a `Header.astro` component:
        * Renders a `<header>` HTML element.
        * Renders a placeholder for a site title/logo.
        * Renders a `<nav>` element.
    * **(Green) Code:** Create `src/components/Header.astro`. Implement the minimal structure tested above.
    * **(Refactor) Code:** Add appropriate ARIA roles if applicable (e.g., `role="banner"` on `<header>`, `role="navigation"` on `<nav>`).
    * **Integration:** Import and place the `Header` component within the `<body>` of `src/layouts/Layout.astro` (likely before the `<slot />`).
    * **(Green) Test:** Run tests. Verify the header structure appears on the index page.
    * **Rationale:** Establish the header area within the main layout.

* **Step 2.2: Add Site Title/Logo to Header**
    * **(Red) Test:** Modify the `Header.astro` test to assert:
        * It accepts a `siteTitle` prop (string).
        * It renders the `siteTitle` within an appropriate element (e.g., `<div>` or `<a>`) inside the header.
    * **(Green) Code:** Update `Header.astro` to accept and display the `siteTitle` prop. Make it a link to the homepage (`/`).
    * **(Refactor) Code:** Add basic styling classes for the title/logo area.
    * **Integration:** Pass a `siteTitle` prop from `Layout.astro` to the `Header` component.
    * **(Green) Test:** Run tests. Verify the site title appears correctly in the header on the index page.
    * **Rationale:** Make the site branding configurable.

* **Step 2.3: Add Navigation Links to Header**
    * **(Red) Test:** Modify the `Header.astro` test to assert:
        * It accepts an array prop `navItems` (e.g., `[{ text: 'About', href: '/about' }, { text: 'Contact', href: '/contact' }]`).
        * It renders an unordered list (`<ul>`) containing list items (`<li>`) with anchor tags (`<a>`) for each item in `navItems` inside the `<nav>` element.
    * **(Green) Code:** Update `Header.astro` to accept `navItems`, loop through them using `map`, and render the navigation links.
    * **(Refactor) Code:** Add basic styling classes for the navigation list and links.
    * **Integration:** Define a sample `navItems` array (e.g., in `Layout.astro` or passed down from `index.astro`) and pass it to the `Header`.
    * **(Green) Test:** Run tests. Verify the navigation links appear correctly in the header.
    * **Rationale:** Implement the primary site navigation structure.

* **Step 2.4: Create Footer Component Shell**
    * **(Red) Test:** Write a test asserting that a `Footer.astro` component:
        * Renders a `<footer>` HTML element.
        * Contains placeholder text for copyright information.
    * **(Green) Code:** Create `src/components/Footer.astro` with the minimal structure.
    * **(Refactor) Code:** Add appropriate ARIA roles (e.g., `role="contentinfo"`).
    * **Integration:** Import and place the `Footer` component within the `<body>` of `src/layouts/Layout.astro` (likely after the `<slot />`).
    * **(Green) Test:** Run tests. Verify the footer structure appears on the index page.
    * **Rationale:** Establish the footer area within the main layout.

* **Step 2.5: Add Dynamic Copyright Year to Footer**
    * **(Red) Test:** Modify the `Footer.astro` test to assert:
        * It displays copyright text including the *current* year.
        * Optionally, accepts a `startYear` prop to display a year range (e.g., "© 2023-2025").
    * **(Green) Code:** Update `Footer.astro` to calculate the current year (`new Date().getFullYear()`) and display it. Implement logic for the optional `startYear`.
    * **(Refactor) Code:** Add basic styling classes.
    * **Integration:** Pass an optional `startYear` if needed from `Layout.astro`.
    * **(Green) Test:** Run tests. Verify the correct copyright year/range appears in the footer.
    * **Rationale:** Ensure copyright information is accurate and maintainable.

**Phase 3: Homepage Content Sections**

* **Step 3.1: Create Hero Section Component**
    * **(Red) Test:** Write a test asserting that a `Hero.astro` component:
        * Renders a `<section>` element (or `<div>`).
        * Accepts and renders `headline` (string) and `subheadline` (string) props within appropriate heading/paragraph tags.
        * Accepts `ctaText` (string) and `ctaHref` (string) props and renders a call-to-action button/link (`<a>`).
    * **(Green) Code:** Create `src/components/Hero.astro`. Implement the structure and props as tested.
    * **(Refactor) Code:** Add styling classes for layout and appearance (e.g., background, text centering, button styling).
    * **Integration:** Import and use the `Hero` component in `src/pages/index.astro` (inside the `Layout`), passing sample props.
    * **(Green) Test:** Run tests. Verify the Hero section renders correctly on the index page with the provided content.
    * **Rationale:** Build the prominent introductory section of the homepage.

* **Step 3.2: Create Features Section Component**
    * **(Red) Test:** Write a test asserting that a `Features.astro` component:
        * Renders a `<section>` element.
        * Accepts an array prop `features` (e.g., `[{ title: 'Feature 1', description: '...', icon?: '...' }]`).
        * Renders a distinct block/card for each feature, displaying its `title` and `description`.
        * (Optional) Renders an icon if provided.
    * **(Green) Code:** Create `src/components/Features.astro`. Implement the structure, accept the `features` prop, and use `map` to render each feature item.
    * **(Refactor) Code:** Add styling classes for the section layout (e.g., grid or flexbox) and individual feature cards.
    * **Integration:** Import and use the `Features` component in `src/pages/index.astro`, passing a sample array of features.
    * **(Green) Test:** Run tests. Verify the Features section renders correctly with multiple feature items.
    * **Rationale:** Build a section to highlight key product/service points.

* **Step 3.3: Create Call To Action (CTA) Section Component**
    * **(Red) Test:** Write a test asserting that a `CTASection.astro` component:
        * Renders a `<section>` element.
        * Accepts and renders `headline` (string).
        * Accepts `ctaText` (string) and `ctaHref` (string) props and renders a prominent call-to-action button/link (`<a>`).
    * **(Green) Code:** Create `src/components/CTASection.astro`. Implement the structure and props.
    * **(Refactor) Code:** Add styling classes to make it visually distinct and encourage action.
    * **Integration:** Import and use the `CTASection` component in `src/pages/index.astro`, passing sample props.
    * **(Green) Test:** Run tests. Verify the CTA section renders correctly.
    * **Rationale:** Add another focused prompt for user engagement, often placed near the end of the page.

**Phase 4: Styling & Responsiveness**

* **Step 4.1: Implement Basic Global Styles**
    * **Action:** Create `src/styles/global.css` (or use another convention). Add basic resets, font definitions (consider importing web fonts), and potentially CSS custom properties for colors, spacing, etc.
    * **Integration:** Import `global.css` in `Layout.astro`.
    * **Test (Manual/Visual):** Observe changes in the browser. Are fonts applied? Is default browser styling reset? Component tests can verify the *presence* of classes that *should* apply global styles.
    * **Rationale:** Establish a consistent visual baseline.

* **Step 4.2: Component-Scoped Styling**
    * **(Red) Test:** Where applicable, add tests to verify components have specific CSS classes applied to key elements (e.g., `Header.astro`'s root element has class `site-header`). This helps ensure styling hooks are present.
    * **(Green) Code:** Add `<style>` tags within individual components (`.astro` files) to define component-specific styles. Use the classes added during refactoring steps. Style the Header, Footer, Hero, Features, CTA sections for better visual appeal and layout.
    * **(Refactor) Code:** Refine styles for better spacing, alignment, and visual hierarchy. Use CSS custom properties defined globally where appropriate.
    * **(Green) Test:** Run tests. Check visual appearance in the browser.
    * **Rationale:** Encapsulate styles with their components for maintainability.

* **[x] Step 4.3: Implement Basic Responsiveness**
    * **(Red) Test:** Conceptually, tests could check for the *existence* of elements specific to mobile (like a hamburger menu button, even if hidden) or the application of responsive utility classes if using a framework. Direct visual testing is more practical here.
    * **(Green) Code:** Add CSS media queries within `global.css` or component `<style>` tags to adjust layout, font sizes, visibility, etc., for different screen sizes (e.g., stack navigation links vertically on small screens, adjust grid columns in Features section).
    * **(Refactor) Code:** Test thoroughly across different viewport widths using browser developer tools. Ensure usability and readability on mobile, tablet, and desktop.
    * **Integration:** No specific code integration, but modifies existing CSS.
    * **(Green) Test (Manual/Visual):** Verify layout adapts correctly at different breakpoints.
    * **Rationale:** Ensure the homepage looks and functions well on all devices.

---

**Phase 5: Additional Content Sections**

* **Step 5.1: Create About Section Component**
    * **(Red) Test:** Write a test asserting that an `AboutSection.astro` component:
        * Renders a `<section>` element.
        * Accepts and renders a `headline` prop (e.g., "About Us").
        * Accepts and renders `content` prop (string, potentially Markdown later) within a content area (e.g., `<div>`).
        * Optionally accepts an `imageUrl` prop and renders an `<img>` if provided.
    * **(Green) Code:** Create `src/components/AboutSection.astro`. Implement the structure, accept the props, and render the headline, content, and optional image.
    * **(Refactor) Code:** Add styling classes for layout (e.g., two columns if image is present), text formatting, and image styling.
    * **Integration:** Import and use the `AboutSection` component in `src/pages/index.astro` (e.g., after Features, before Testimonials), passing sample props.
    * **(Green) Test:** Run tests. Verify the About section renders correctly with and without an image.
    * **Rationale:** Provide context about the entity behind the website.
    * *Note: Step numbering adjusted after removing Testimonials.*

---

**Next Steps & Considerations:**

* **Adding More Sections:** Follow the pattern (Red-Test -> Green-Code -> Refactor -> Integrate -> Green-Test) for any additional sections (e.g., Testimonials, About Section, Contact Form stub).
* **Accessibility (A11y):** Continuously review ARIA roles, semantic HTML, color contrast, and keyboard navigation throughout the process. Add specific a11y tests where feasible (e.g., using axe-core integrated with testing).
* **Image Handling:** Introduce components or logic for optimized images (using Astro's `<Image />` component).
* **Interactivity:** For elements requiring JavaScript (e.g., mobile menu toggle), use Astro Islands and potentially UI framework components (React, Vue, etc.), testing them appropriately.
* **Configuration:** Consider moving repeatable data (like `navItems`, `features`) into separate data files (e.g., `.json` or `.ts`) and importing them into pages/components for easier customization per project.

This step-by-step plan provides a structured approach using TDD principles. Remember that the "Red" step is about defining the *expected outcome* before implementation, guiding development towards small, verifiable goals and ensuring all pieces are connected.
