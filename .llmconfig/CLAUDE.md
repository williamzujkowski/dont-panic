```markdown
# CLAUDE.md (Consolidated Project Guidance for Claude)

This file provides comprehensive guidance for Claude AI when working with code in this repository, specifically for the **Astro Reusable Homepage Template** project. It consolidates project-specific setup, coding standards, testing methodologies, and overall project principles.

**Purpose:** Use this file as a primary reference for understanding project conventions, requirements, and best practices when generating or modifying Astro components, TypeScript/JavaScript code, and related configurations.

**Important Notes:**
1. While this file provides general guidance, all prompt templates and LLM-specific configurations should be stored in the `.llmconfig/` directory to ensure consistent AI agent behavior across the project.
2. The `FILE_TREE.md` document MUST be kept updated whenever the repository structure changes to ensure AI agents can effectively navigate the codebase.
3. This project utilizes **Astro**, **TypeScript**, **Node.js**, and **npm**.

**Content Overview:**
1.  **Quick Start:** Build, setup, lint, and test commands.
2.  **Project Code Style Summary:** Key style guidelines for this specific project.
3.  **Detailed Coding Standards:** Comprehensive rules covering style, documentation, architecture, security, performance, and more for Astro/TS/JS.
4.  **Detailed Testing Manifesto:** In-depth testing principles and quality assurance standards for Astro/TS/JS.
5.  **Overall Project Standards Framework:** High-level view integrating development lifecycle, AI ethics, technical quality, and operations.
6.  **Repository Structure for LLM Code Agents:** Guidelines for organizing repositories to optimize for LLM-based development.
7.  **Master Prompts:** Pre-defined prompts for guiding LLM code generation based on these standards.

---

## 1. Quick Start: Build, Setup, Lint & Test Commands

### Build & Setup
```bash
# Install project dependencies (from package.json)
npm install

# (Optional) Install Git hooks if configured (e.g., using simple-git-hooks or husky)
# npx simple-git-hooks install  OR  npx husky install

# Start the development server (hot-reloading)
npm run dev

# Build the project for production
npm run build

# Preview the production build locally
npm run preview
```

### Lint & Test
```bash
# Format code using Prettier
npm run format
# or npx prettier --write .

# Lint code using ESLint
npm run lint
# or npx eslint . --ext .js,.ts,.astro

# Check TypeScript types
npm run check
# or npx tsc --noEmit

# Run all tests (using Vitest or Astro's testing integration)
npm run test

# Run a single test file (adjust path and command based on test runner)
npm run test -- tests/components/Header.test.ts

# Run tests with coverage (if configured)
npm run test -- --coverage
```

---

## 2. Project Code Style Summary

* **Base Standard:** Industry-standard JavaScript/TypeScript practices enforced by ESLint (e.g., configuration based on Airbnb, StandardJS, or project-specific rules) and formatted by Prettier.
* **Formatting:** Handled automatically by Prettier. Default settings apply unless overridden in `.prettierrc`.
* **Line Length:** Max 80 characters (Prettier default).
* **Naming:**
    * Variables, functions, methods: `camelCase` (e.g., `userCount`, `calculateTotal()`).
    * Classes, Interfaces, Types, Astro Components: `PascalCase` (e.g., `DependencyParser`, `RiskProfiler`, `Header.astro`).
    * Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`).
* **Type Annotations:** Required for all function/method signatures, variables where type inference is unclear, and component props (using TypeScript).
* **Documentation:** Use **JSDoc** or **TSDoc** format for documenting functions, classes, types, and especially **Astro component props** (`interface Props { ... }`).
* **Component/Function Size:** Aim for focused components and functions, ideally keeping components under 100-150 lines and functions under 50 lines. Break down complex components.
* **Error Handling:** Prefer custom `Error` classes for specific, recoverable error conditions. Use standard error handling for unexpected issues.
* **Imports:** Organize imports logically: Node built-ins, external packages, internal modules/components. Let ESLint/Prettier handle sorting.

---

## 3. Detailed Coding Standards

These standards provide comprehensive guidelines beyond the project summary, adapted for Astro/TypeScript/JavaScript.

### 3.1. Code Style and Formatting
1.  Follow established style guides enforced by **ESLint** (based on project configuration) and **Prettier**.
2.  Enforce consistent formatting automatically using **Prettier** (indentation, line length (80 chars), statement termination, brackets, whitespace).
3.  Use meaningful naming conventions (`PascalCase` for types/classes/components, `camelCase` for functions/variables, `UPPER_SNAKE_CASE` for constants). Use underscore prefix (`_`) for private class members where necessary, though TypeScript's `private` keyword is preferred.
4.  Structure code consistently (organize imports, group related functions/methods within files, consistent file organization in `src/components`, `src/layouts`, `src/pages`, etc., limit file/function/component size).
5.  Automate style enforcement using **ESLint**, **Prettier**, **TypeScript Compiler (`tsc`)**, pre-commit hooks (e.g., simple-git-hooks, husky), and CI/CD integration.

### 3.2. Documentation Standards
1.  Include documentation for all public interfaces: **Astro component props**, exported functions, classes, types (purpose, parameters/props, returns, exceptions, usage examples).
2.  Add contextual documentation (module/file/class level comments, complex algorithms, rationale for non-obvious decisions). Use comments within `.astro` files for template logic explanation if needed.
3.  Follow documentation format standards (**JSDoc/TSDoc**). Clearly document **Astro component prop types** using TypeScript interfaces. Note side effects, performance considerations if applicable.
4.  Maintain system-level documentation (architecture diagrams in `/docs`, component interaction flows, deployment notes).
5.  Establish documentation review process (part of code reviews, test examples, update with code changes).

### 3.3. Architecture and Design Patterns
1.  Establish clear architectural boundaries (Astro `pages`, `layouts`, reusable `components`, potentially `utils` or `lib`). Emphasize Separation of Concerns. Document component responsibilities.
2.  Apply appropriate design patterns (e.g., Composition over Inheritance for UI, potentially State Management patterns if client-side interactivity grows). Use Astro's **Islands Architecture** for client-side interactivity where needed.
3.  Follow SOLID principles where applicable, especially Single Responsibility Principle for components.
4.  Design for extensibility and reusability (well-defined component props, slots for content injection, avoid tight coupling between components).
5.  Establish system boundaries (clear component APIs via Props, encapsulation within components). Document constraints/assumptions (e.g., expected data formats for props).

### 3.4. Security Best Practices (Web Frontend Context)
1.  Apply input validation and output encoding: Sanitize user-generated content displayed in HTML to prevent **Cross-Site Scripting (XSS)**. Use Astro's automatic expression encoding. Be cautious with `set:html`.
2.  (If applicable) Implement security headers (CSP, HSTS, X-Frame-Options) usually via hosting configuration or Astro middleware.
3.  (If applicable) Protect against **Cross-Site Request Forgery (CSRF)** if forms performing state changes are used.
4.  Protect sensitive data: Avoid exposing sensitive information in client-side code bundles or HTML source. Use environment variables for API keys accessed during build or SSR.
5.  Apply secure coding practices: Secure defaults, proper error handling (don't leak sensitive details), keep dependencies updated (`npm audit`), avoid insecure APIs (e.g., `eval`).

### 3.5. Performance Optimization (Web Frontend Context)
1.  Establish performance targets (Lighthouse scores, Core Web Vitals - LCP, FID/INP, CLS, bundle size limits, Time to Interactive).
2.  Optimize assets: Use Astro's built-in asset optimization (`<Image>`, `<Picture>`), optimize CSS (minimize, purge unused), optimize JavaScript bundles (code splitting, tree shaking - largely handled by Astro/Vite).
3.  Implement resource optimization: Efficient client-side JavaScript (use Astro Islands sparingly), appropriate caching strategies (HTTP caching headers), minimize network requests.
4.  Optimize rendering: Leverage Astro's SSR/SSG capabilities. Minimize client-side rendering work.
5.  Implement proper benchmarking: Use tools like Lighthouse, WebPageTest, browser dev tools profiling. Monitor performance continuously.

### 3.6. Error Handling
1.  Define error handling strategy: Graceful degradation on errors, user-friendly error messages/pages (e.g., custom 404, 500 pages in Astro). Distinguish build-time vs. runtime errors.
2.  Implement defensive programming: Check prop validity within components, handle edge cases (e.g., empty arrays passed to list components), use optional chaining (`?.`) and nullish coalescing (`??`).
3.  Create informative error messages (for developers during build/dev, non-technical for users).
4.  Apply proper error handling: Use `try...catch` for synchronous operations, `.catch()` or `async/await` with `try...catch` for Promises. Use `Error` objects.
5.  Implement structured logging for server-side errors (if using SSR) or client-side error reporting services if needed.

### 3.7. Resource Management (Node.js/Browser Context)
1.  Apply proper resource lifecycle management: Close network connections if manually managed, manage event listeners (add/remove properly in client-side scripts to prevent memory leaks).
2.  Handle external API dependencies gracefully (loading states, error states, timeouts, fallbacks if applicable).
3.  (If applicable) Implement concurrency control for client-side operations if needed (e.g., debouncing, throttling user inputs). Understand the Node.js event loop for SSR performance.
4.  Manage memory efficiently: Avoid memory leaks in client-side JavaScript (detached DOM nodes, uncleared intervals/timeouts, dangling event listeners). Profile memory usage in browser dev tools if needed.
5.  Optimize file and network operations: Minimize data transferred, use efficient data formats (e.g., JSON), leverage browser caching.

### 3.8. Dependency Management (Node.js/npm Context)
1.  Define dependency selection criteria (license (check compatibility), security, maintenance status, community support, bundle size impact, compatibility with Astro/Node version).
2.  Implement version pinning using `package-lock.json` (generated by `npm install`). Use semantic versioning ranges (`^`, `~`) appropriately in `package.json`. Document rationale for specific versions if needed. Regularly update dependencies (`npm update`).
3.  Apply dependency isolation inherently via Node.js `node_modules` structure.
4.  Implement vulnerability scanning using `npm audit`. Integrate into CI/CD pipelines. Address vulnerabilities promptly.
5.  Create dependency documentation if non-obvious dependencies are used or complex configurations are required.

### 3.9. Version Control Practices (Git)
1.  Define branch management strategy (e.g., Trunk-Based Development or GitFlow-lite). Use clear naming conventions (e.g., `feature/`, `bugfix/`, `chore/`). Define merge requirements (reviews, passing checks).
2.  Create commit standards: Use Conventional Commits format (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`). Write descriptive messages. Reference issues (e.g., `fix: resolve #123 ...`). Make atomic commits.
3.  Implement code review workflows via Pull Requests (PRs) / Merge Requests (MRs). Define review criteria (correctness, standards, testing, etc.). Require approvals. Automate checks (lint, test, build) via CI.
4.  Apply versioning standards using Semantic Versioning (SemVer - MAJOR.MINOR.PATCH) for the project/template releases. Maintain a `CHANGELOG.md`. Tag releases in Git.
5.  Establish repository hygiene: Maintain a comprehensive `.gitignore` file (include `.astro`, `node_modules`, `dist`, etc.). Document repository structure in `FILE_TREE.md`. Use hooks (pre-commit, pre-push) if desired.

### 3.10. Code Review Standards
1.  Define review scope: Correctness, adherence to project standards (this doc!), component reusability, prop design, testing adequacy, security (XSS), performance (bundle impact), documentation, accessibility.
2.  Establish review process: Assign reviewers, suggest PR size limits, define expected turnaround times, use checklists if helpful.
3.  Apply technical review criteria: Logic correctness, error handling, test coverage/quality, maintainability, Astro best practices (props, slots, islands), TypeScript usage.
4.  Implement review automation: CI checks for linting, formatting, type checking, testing, building. Code coverage reports.
5.  Foster constructive review culture: Focus comments on the code, provide actionable feedback, explain reasoning, ask clarifying questions, acknowledge good work.

### 3.11. Accessibility Standards (WCAG)
1.  Apply semantic HTML structure: Use appropriate HTML5 elements (`<nav>`, `<main>`, `<article>`, `<aside>`, `<header>`, `<footer>`), use headings (`<h1>`-`<h6>`) correctly, use ARIA roles/attributes where semantic HTML is insufficient. Provide labels for form controls. Ensure logical keyboard navigation order.
2.  Implement responsive design: Ensure usability across screen sizes. Ensure sufficient touch target sizes. Use flexible layouts (CSS Grid/Flexbox). Use responsive images. Test on multiple devices/emulators.
3.  Apply color and contrast standards: Meet WCAG AA contrast ratios for text/backgrounds. Don't rely solely on color to convey information. Ensure focus indicators are clearly visible. Test with high contrast modes/simulators.
4.  Implement assistive technology support: Provide meaningful `alt` text for images. Use ARIA attributes judiciously. Ensure compatibility with screen readers (test manually with NVDA, JAWS, VoiceOver).
5.  Apply accessibility testing: Use automated checkers (e.g., Axe DevTools browser extension), perform manual keyboard navigation testing, perform screen reader testing. Include accessibility checks in QA process. Document accessibility features/considerations.

### 3.12. Internationalization & Localization (If Applicable)
1.  (If implemented) Apply proper text externalization: Store user-facing strings in resource files (e.g., JSON per locale). Avoid hardcoding text in components. Use libraries/frameworks (e.g., `astro-i18n`) to handle interpolation, pluralization, etc.
2.  (If implemented) Implement locale awareness: Format dates, times, numbers according to locale conventions. Handle text directionality (LTR/RTL) if needed.
3.  (If implemented) Design for text expansion: Ensure UI layouts can accommodate longer text in different languages. Avoid fixed-width containers for text.
4.  (If implemented) Implement resource management: Organize translation files logically. Implement fallback logic. Allow for locale switching. Define translation workflow.
5.  (If implemented) Apply localization testing: Use pseudo-localization to detect issues early. Verify content in target locales. Test RTL layouts if applicable. Consider cultural appropriateness.

### 3.13. Concurrency and Parallelism (Node.js/JavaScript Context)
1.  Understand the single-threaded event loop model of Node.js/JavaScript. Use `async/await` and Promises for non-blocking I/O operations (e.g., fetching data during SSR).
2.  Client-side JavaScript is generally single-threaded. Use Web Workers for computationally intensive tasks off the main thread if necessary (rare for this type of project).
3.  Avoid blocking the event loop in server-side code (SSR) or the main thread in client-side code.
4.  Manage asynchronous operations correctly: Handle Promise rejections, use `Promise.all`, `Promise.race` etc. where appropriate.
5.  Test asynchronous code thoroughly, including race conditions if applicable (though less common without shared memory threading).

### 3.14. API Design (Component Props)
1.  Apply API design principles to **Astro component props**: Design props to be consistent, intuitive, and predictable. Follow the principle of least surprise. Design for evolution (adding optional props is easier than changing existing ones).
2.  Clearly define the contract of each component through its props (types, required/optional, purpose documented via TSDoc).
3.  Use TypeScript interfaces (`interface Props`) to define component prop contracts explicitly.
4.  Keep prop interfaces focused (Single Responsibility Principle). Avoid overly complex prop objects if simpler alternatives exist.
5.  Use slots (`<slot />`) effectively for content projection, complementing props for component flexibility.

### 3.15. Refactoring Guidelines
1.  Define refactoring triggers: Code smells (duplication, long methods/components, tight coupling), high component complexity, performance bottlenecks, identified technical debt, poor maintainability/readability.
2.  Establish refactoring processes: Ensure adequate test coverage **before** refactoring. Make small, incremental changes. Run tests frequently. Use version control effectively (commit small changes). Review refactored code.
3.  Implement refactoring techniques: Extract Component, Extract function/method, Rename variable/function/prop, Introduce prop object, Simplify conditional logic, Use composition, etc.
4.  Apply refactoring tools: IDE refactoring capabilities, linters/static analysis can highlight areas needing refactoring.
5.  Document refactoring outcomes: Note improvements in commit messages or PR descriptions. Update related documentation.

### 3.16. Sustainability and Green Coding
1.  Optimize resource efficiency: Minimize JavaScript bundle size. Optimize CSS and images. Reduce unnecessary computations on the client-side. Leverage Astro's SSG/SSR to minimize client load.
2.  Apply energy-aware design: Reduce unnecessary background tasks or polling in client-side scripts. Use efficient event handling (debouncing/throttling).
3.  Implement efficient data practices: Minimize data transferred over the network. Use efficient data formats. Leverage caching effectively.
4.  Design for hardware efficiency: Ensure reasonable performance on lower-end devices. Progressive enhancement. Minimize resource-intensive animations.
5.  Consider environmental impact: Choose green hosting if possible. Track bundle sizes and Lighthouse performance scores as proxies for efficiency.

---

## 4. Detailed Testing Manifesto

Follow these principles and standards for comprehensive testing of Astro components and TypeScript/JavaScript code. We will likely use **Vitest** integrated with Astro.

### 4.1 Core Testing Principles

#### 4.1.1. Hypothesis Tests for Behavior Validation
* Identify the core hypothesis for each component/function (e.g., "Given `title` prop, the Header component should render an `<h1>` containing that title").
* Write tests defining clear expectations using Arrange-Act-Assert (AAA pattern).
* Test component rendering with different props (valid, invalid, edge cases, optional). Test slot rendering. Test event handling/emission if applicable (for interactive islands).
* Verify error handling (e.g., component behavior with invalid props).
* Use descriptive test names (`it('should render the headline when headline prop is provided')`).
```typescript
// Example (using Vitest syntax with a testing library like @testing-library/react or similar concept for Astro)
import { render, screen } from '@testing-library/react'; // Use appropriate library for Astro component testing
import Header from '../src/components/Header.astro'; // Adjust import path
import { describe, it, expect } from 'vitest';

describe('Header Component', () => {
  it('HYPOTHESIS: Should render the site title passed as a prop', () => {
    // Arrange
    const siteTitle = "My Test Site";
    // Act
    render(<Header siteTitle={siteTitle} navItems={[]} />); // Render component with props
    // Assert
    // Use testing-library queries to find elements
    const titleElement = screen.getByRole('link', { name: siteTitle });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveAttribute('href', '/');
  });

  it('HYPOTHESIS: Should render navigation links based on navItems prop', () => {
      // Arrange
      const navItems = [
          { text: 'Home', href: '/' },
          { text: 'About', href: '/about' },
      ];
      // Act
      render(<Header siteTitle="Test" navItems={navItems} />);
      // Assert
      const homeLink = screen.getByRole('link', { name: 'Home' });
      const aboutLink = screen.getByRole('link', { name: 'About' });
      expect(homeLink).toBeInTheDocument();
      expect(aboutLink).toBeInTheDocument();
      expect(screen.getAllByRole('listitem').length).toBe(navItems.length);
  });
});
```

#### 4.1.2. Regression Tests for Known Fail States
* For each bug fix, create a specific test reproducing the failure conditions.
* Document the original issue (e.g., comment with issue number `#1234`) and verify the fix.
* Ensure the regression test specifically targets the scenario that previously failed.
```typescript
// Example (Vitest)
it('REGRESSION: Bug #567 - Should handle empty navItems array gracefully', () => {
  // Arrange
  const navItems = [];
  // Act
  render(<Header siteTitle="Test" navItems={navItems} />);
  // Assert
  const navElement = screen.getByRole('navigation');
  const listItems = screen.queryAllByRole('listitem'); // Use queryAllByRole as items shouldn't exist
  expect(navElement).toBeInTheDocument();
  expect(listItems.length).toBe(0); // Ensure no list items are rendered
});
```

#### 4.1.3. Benchmark Tests with SLA Enforcement
* Less critical for this template project, but could apply to complex client-side islands or SSR performance.
* Define metrics (e.g., component render time, interaction latency).
* Use benchmarking libraries (e.g., `vitest --benchmark`) if needed.
* Define acceptable thresholds.
```typescript
// Example (Conceptual using Vitest benchmark)
// import { bench, describe } from 'vitest';
// describe('Component Rendering Benchmark', () => {
//   bench('Header component with 10 nav items', () => {
//      render(<Header siteTitle="Bench" navItems={[...Array(10).keys()].map(i => ({ text: `Item ${i}`, href: `/${i}`}))} />);
//   });
// });
```

#### 4.1.4. Fuzzing/Property-Based Tests for Edge Discovery
* Define properties components/functions should uphold (e.g., "Rendering Header with any valid `navItems` array should not throw errors").
* Use libraries like `fast-check` integrated with Vitest.
* Define strategies for generating prop data (strings, arrays of objects, etc.).
* Log failures and add specific regression tests for discovered edge cases.
```typescript
// Example (Conceptual using fast-check with Vitest)
// import { test, fc } from 'vitest'; // Assuming integration exists
// import { render } from '@testing-library/react';
// import Header from '../src/components/Header.astro';

// const navItemArbitrary = fc.record({ text: fc.string(), href: fc.webUrl() }); // Simplified href

// test.prop([fc.string(), fc.array(navItemArbitrary)])('PROPERTY: Header should render without throwing for valid props', (title, items) => {
//   // Arrange / Act / Assert (check for errors during render)
//   expect(() => render(<Header siteTitle={title} navItems={items} />)).not.toThrow();
// });
```

#### 4.1.5. Structured Logs for Agent Feedback (Less Applicable)
* Primarily relevant for backend agents or complex client-side state machines. Not a high priority for this static template project unless significant client-side logic is added. If needed, use `console.log` structured as JSON or use a client-side logging library.

### 4.2 Quality Assurance Standards

#### 4.2.1. Code Coverage Requirements
* Aim for thresholds: **80-85%+ overall line/branch coverage**, 90%+ for critical components/utils.
* Track coverage using Vitest's built-in coverage (often via `c8` or `istanbul`).
* Focus on testing logic, branches, and important states, not just lines hit.
* Integrate reports in CI/CD (`npm run test -- --coverage`), potentially fail builds below threshold.
```json
// Example Vitest config in `vite.config.ts` or `vitest.config.ts`
// import { defineConfig } from 'vitest/config';
// export default defineConfig({
//   test: {
//     coverage: {
//       provider: 'istanbul', // or 'c8'
//       reporter: ['text', 'json', 'html'],
//       lines: 80,
//       functions: 80,
//       branches: 80,
//       statements: 80,
//       exclude: [ /* node_modules, config files, etc. */ ],
//     },
//   },
// });
```

#### 4.2.2. Static Analysis Rules
* Configure **ESLint** with strict rules (e.g., `eslint:recommended`, `plugin:@typescript-eslint/recommended`, `plugin:astro/recommended`, potentially `eslint-plugin-jsx-a11y`).
* Configure **TypeScript** (`tsconfig.json`) with `strict: true` or specific strict flags (`noImplicitAny`, `strictNullChecks`, etc.).
* Enforce style (via Prettier integration), find potential bugs, identify accessibility/performance issues.
* Integrate into pre-commit hooks and CI/CD.
* Maintain a "zero lint/type errors" policy.
```json
// Example `.eslintrc.cjs` (partial)
// module.exports = {
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:astro/recommended',
//     'plugin:jsx-a11y/recommended', // For accessibility in JSX-like syntax
//     'prettier', // Ensure Prettier runs last
//   ],
//   parser: '@typescript-eslint/parser',
//   plugins: ['@typescript-eslint'],
//   root: true,
//   // ... other configs ...
// };
```

#### 4.2.3. Contract Testing Framework (Less Applicable)
* Relevant if the frontend template consumes external APIs with defined contracts.
* Could use tools like Pact if interacting with microservices.
* Not a primary focus for the initial template build.

#### 4.2.4. Mutation Testing Guidelines
* Apply mutation testing periodically to assess test suite effectiveness using tools like **StrykerJS**.
* Establish mutation score thresholds (e.g., aim for 70-80%+).
* Integrate into CI/CD (can be slow, may run less frequently).
* Analyze surviving mutants – indicates tests might be missing assertions or scenarios.
```bash
# Example (using StrykerJS)
# npm install --save-dev @stryker-mutator/core @stryker-mutator/vitest-runner
# npx stryker run
```

#### 4.2.5. Property-Based Testing Framework
* Define invariant properties components/functions must satisfy (e.g., "A component rendering a list from an array prop should always render the same number of items as the array length").
* Use libraries like **fast-check** with Vitest.
* Define explicit property assertions. Focus on "what" holds true for all valid inputs.
```typescript
// Example (using fast-check with Vitest - see 4.1.4)
import { test, fc } from 'vitest';
import MyListComponent from '../src/components/MyList.astro'; // Fictional component

const itemArbitrary = fc.record({ id: fc.uuid(), name: fc.string() });

test.prop([fc.array(itemArbitrary)])('PROPERTY: MyListComponent renders one item per element in props.items', (items) => {
    render(<MyListComponent items={items} />);
    const renderedItems = screen.queryAllByRole('listitem'); // Assuming items are LIs
    expect(renderedItems.length).toBe(items.length);
});
```

### 4.3 Security and Resilience

#### 4.3.1. Security Testing Guidelines
* Apply security testing relevant to web frontends:
    * **SAST:** Use ESLint security plugins (e.g., `eslint-plugin-security`) or dedicated scanners.
    * **Dependency Scanning:** Use `npm audit` or tools like Snyk, Dependabot.
    * **DAST:** Less applicable for static templates, but relevant if complex client-side logic or API interactions are added. Use browser dev tools and manual checks for common issues (XSS vectors).
* Test against OWASP Top 10 relevant risks (e.g., Injection (XSS), Security Misconfiguration, Vulnerable Dependencies).
* Incorporate `npm audit` into CI/CD, block on critical vulnerabilities.

#### 4.3.2. Resilience Testing Framework (Chaos Engineering) (Less Applicable)
* Primarily for backend systems or complex distributed frontends.
* Could conceptually involve testing component behavior when expected props are `undefined` or APIs (if called) fail, but formal Chaos Engineering is overkill here. Focus on robust error handling and prop validation.

### 4.4 Documentation and Integration

#### 4.4.1. Documentation Testing
* Test code examples within JSDoc/TSDoc comments or Markdown files if feasible (can be complex to set up for components).
* Manually verify prop documentation matches component implementation during code reviews.
* Ensure README instructions (setup, build, test commands) are accurate.

#### 4.4.2. Integration Testing Patterns (Component/Page Level)
* Test interactions *between* components integrated into a layout or page.
* Test page-level rendering in Astro (`*.test.ts` files alongside pages). Verify major sections appear correctly using the testing library.
* Can use tools like Playwright or Cypress for end-to-end testing (simulating user interaction in a browser), especially if client-side interactivity (Astro Islands) is significant. This is a heavier level of testing.
```typescript
// Example (Conceptual Page Test using testing library with Astro test utils)
import { render } from '@testing-library/react'; // Or Astro test utils
import IndexPage from '../src/pages/index.astro'; // Assuming direct import works or using test setup
import { describe, it, expect } from 'vitest';

describe('Index Page', () => {
  it('INTEGRATION: Should render Header, Hero, Features, and Footer sections', async () => {
    // Arrange/Act
    // Need appropriate setup to render a full Astro page in test environment
    // May involve mocking or using Astro's specific test utilities if available
    // render(<IndexPage />); // Simplified

    // Assert (assuming components render identifiable elements/roles)
    // expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    // expect(screen.getByRole('heading', { name: /Welcome/i })).toBeInTheDocument(); // Hero headline
    // expect(screen.getByRole('region', { name: /Features/i })).toBeInTheDocument(); // Features section
    // expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
  });
});
```

#### 4.4.3. Testability Guidelines
* Design components for testability: Prefer passing dependencies/data via props. Use slots for flexible content. Keep components focused.
* Avoid complex logic directly in the `.astro` template; extract it to functions in the frontmatter script or utility modules (`.ts`/`.js`) which are easier to unit test.
* For client-side islands, ensure logic is testable independent of the UI framework if possible.

---

## 5. Overall Project Standards Framework

This outlines the high-level framework guiding the project:

1.  **Development Lifecycle:** Agile TDD approach as planned, focus on reusable components, clear documentation, knowledge sharing via code reviews and this document.
2.  **AI Ethics and Governance:** Standard responsible AI guidelines apply to the development *process* using Claude. Ensure generated code is reviewed for bias if it handles user data (unlikely for this template). Privacy by design.
3.  **Technical Quality:** Testing standards (as detailed above), coding standards (as detailed above), data governance (N/A unless handling data), Astro best practices, performance monitoring (Lighthouse).
4.  **Operational Excellence:** Clear build/deploy process, potential CI/CD automation, dependency monitoring (`npm audit`), focus on frontend performance and accessibility. Sustainability considerations (bundle size).

*(This section provides context; detailed implementation is covered in Coding and Testing standards sections.)*

---

## 6. Repository Structure for LLM Code Agents

Designing a repository optimized for LLM-driven code agents involves establishing a structured, maintainable, and secure environment that facilitates high-quality code generation and adherence to established standards. **This structure aligns with typical Astro project layouts.**

### 6.1. Root-Level Files and Directories

- **`README.md`**: Project overview, purpose, setup, usage.
- **`CONTRIBUTING.md`**: Contribution guidelines, standards, branching.
- **`CODE_OF_CONDUCT.md`**: Community behavior expectations.
- **`LICENSE`**: Project license.
- **`FILE_TREE.md`**: **CRITICAL** - Up-to-date file structure map. Keep current!
- **`package.json`**: Project dependencies and scripts.
- **`package-lock.json`**: Locked dependency versions.
- **`astro.config.mjs`**: Astro configuration file.
- **`tsconfig.json`**: TypeScript configuration.
- **`.eslintrc.cjs`** (or `.json`, `.js`): ESLint configuration.
- **`.prettierrc`** (or `.json`, `.js`): Prettier configuration.
- **`public/`**: Static assets (images, fonts, favicons) copied as-is.
- **`src/`**: Main application code.
    - **`components/`**: Reusable Astro UI components (`.astro`, potentially `.tsx`/`.jsx` for islands).
    - **`layouts/`**: Base page layouts (`.astro`).
    - **`pages/`**: Site pages/routes (`.astro`, `.md`, `.mdx`).
    - **`styles/`**: Global CSS/SCSS files.
    - **`scripts/`**: Client-side JavaScript for Astro islands.
    - **`env.d.ts`**: TypeScript environment definitions for Astro.
    * **(Optional) `lib/` or `utils/`**: Shared TypeScript/JavaScript logic.
    * **(Optional) `data/`**: JSON or TS files containing site data.
- **`tests/`**: Unit, integration, component tests (e.g., `.test.ts` files mirroring `src`).
- **`docs/`**: Detailed documentation (architecture, guides).
- **`.github/`**: GitHub-specific files (workflows, issue templates).
- **`.llmconfig/`**: Dedicated directory for LLM agent configurations and rules.

### 6.2. LLM Agent Configuration (`.llmconfig/`)

**IMPORTANT:** All LLM-specific configurations, prompts, and context files MUST be stored in the `.llmconfig/` directory.

The `.llmconfig/` directory should contain:
- **`CLAUDE.md`**: This file.
- **`PROJECT_PLAN.md`**: Overarching goals for this project.
- **`todo.md`**: A checklist of steps to perform.
- **`agent-rules.md`**: Specific coding rules for the LLM (potentially extracted from this file).
- **`prompt-templates/`**: Reusable prompt templates (like those in Section 7).
- **`context/`**: Files providing context (e.g., component examples, design system tokens).
- **`examples/`**: Exemplary interactions for few-shot learning.
- **`system-prompts/`**: System-level instructions.

### 6.3. Maintaining FILE_TREE.md

**CRITICAL:** Update `FILE_TREE.md` whenever files/directories in `src/`, `public/`, `layouts/`, `components/`, etc., are added, removed, or moved. This map is essential for LLM navigation and context.

### 6.4. Configuration and Tooling

- **Framework:** Astro
- **Language:** TypeScript, JavaScript
- **Package Manager:** npm
- **Formatting:** Prettier
- **Linting:** ESLint (with TypeScript, Astro, a11y plugins)
- **Type Checking:** TypeScript Compiler (`tsc`)
- **Testing:** Vitest (or chosen Astro testing integration)
- **CI/CD:** GitHub Actions (or similar)
- **Git Hooks:** simple-git-hooks, husky (optional)

### 6.5. Coding Standards and Best Practices (Recap)

- **Naming:** `camelCase` (functions/vars), `PascalCase` (components/types/classes), `UPPER_SNAKE_CASE` (constants).
- **Structure:** Modular Astro components, clear separation (`pages`, `layouts`, `components`), single responsibility.
- **Documentation:** JSDoc/TSDoc for components (props!), functions, types.

### 6.6. Security and Compliance (Recap)

- **Web Security:** Prevent XSS (use Astro encoding, careful with `set:html`).
- **Dependencies:** Regularly run `npm audit`, update dependencies.
- **Secrets:** Use environment variables for build/SSR secrets, avoid client-side exposure.

### 6.7. Testing and Quality Assurance (Recap)

- **Coverage:** Aim for 80-85%+ coverage.
- **Automation:** Integrate linting, type checking, testing into CI/CD.
- **Reviews:** Thorough code reviews focusing on correctness, standards, testing, accessibility.

### 6.8. Documentation and Communication (Recap)

- **Component API:** Document props clearly using TSDoc in `interface Props`.
- **Changelog:** Maintain `CHANGELOG.md`.
- **Architecture:** Diagrams in `/docs` if complex.
- **`FILE_TREE.md`**: **Keep updated!**

---

## 7. Master Prompts for LLM Interaction

Use these prompts as starting points when requesting code generation or modification for this **Astro/TypeScript** project:

### Master Prompt for Astro Component Generation
```
Generate an Astro component for [specific feature/UI element description, e.g., 'a responsive card component for displaying blog post previews'].

**IMPORTANT CONTEXT:** Before starting, review the `PROJECT_PLAN.md` and `todo.md` files located in the repository root. Ensure the component you generate aligns with the overall project vision, current phase objectives (TDD step), and core principles outlined there (reusability, adaptability).

Follow these comprehensive coding standards for Astro/TypeScript:

1.  **Style and Structure:**
    * Create a `.astro` file in `src/components/`.
    * Use `PascalCase` for the filename and component concept.
    * Use TypeScript for the frontmatter script (`<script lang="ts">`).
    * Define component props using a TypeScript `interface Props { ... }` documented with TSDoc comments explaining each prop's purpose and type.
    * Structure the template using semantic HTML.
    * Use CSS scoped within the component (`<style>...</style>`) or global styles/utility classes where appropriate. Apply BEM-like or descriptive class naming.
    * Format code using Prettier (ensure it's run).
    * Keep the component focused (Single Responsibility). Extract sub-components if complexity increases.

2.  **Props and Slots:**
    * Design clear, predictable props. Use required/optional props appropriately.
    * Use default values for optional props where sensible.
    * Utilize `<slot />` for content projection where flexibility is needed (e.g., card body content). Name slots if multiple are required.

3.  **TypeScript and Logic:**
    * Use strong typing for props and internal variables.
    * Keep complex logic out of the template; place it in the frontmatter script or import from `utils/`.
    * Ensure code passes ESLint checks and TypeScript compilation (`tsc --noEmit`).

4.  **Accessibility (A11y):**
    * Ensure semantic HTML structure.
    * Include necessary ARIA attributes if semantics are insufficient.
    * Ensure interactive elements are keyboard accessible and have focus indicators.
    * Include `alt` text for images passed via props or handle appropriately.

5.  **Quality and Maintenance:**
    * Generate a corresponding test file (`.test.ts`) alongside the component (or update existing tests) following the Testing Manifesto (Section 4). Tests should cover prop variations, slot rendering, and basic structure.
    * Document the component's purpose and props clearly (TSDoc).

The component should be robust, performant (minimal client-side JS unless an island is explicitly requested), accessible, maintainable, reusable, directly contribute to the objectives in `PROJECT_PLAN.md`/`todo.md`, and adhere to all project standards outlined in `CLAUDE.md`.

Place the generated component file at: `src/components/[ComponentName].astro`
Place the generated test file at: `tests/components/[ComponentName].test.ts` (or similar conventional location)
```

### Master Prompt for Test Suite Generation (Vitest/Astro)
```
Generate a comprehensive test suite using Vitest for the provided Astro component/TypeScript module: [link/path to file(s)].

**IMPORTANT CONTEXT:** Before starting, review the `PROJECT_PLAN.md` and `todo.md` files located in the repository root. Ensure the tests verify that the code behaves according to the overall project vision, TDD step objectives, and core principles outlined there. Test scenarios should reflect component usage patterns.

Follow the project's Testing Manifesto (detailed in CLAUDE.md):

1.  **Core Testing Principles:**
    * Hypothesis tests validating component rendering based on props (required, optional, edge cases) and slots.
    * Test emitted events or state changes if testing interactive client-side islands.
    * Regression tests covering known edge cases or previously fixed bugs (reference issue numbers if applicable).

2.  **Quality Assurance:**
    * Aim for high code coverage (target 80-85%+).
    * Ensure tests use appropriate testing library utilities (e.g., `@testing-library/react` or Astro testing utils) for querying the DOM and making assertions.
    * Consider property-based tests (using `fast-check`) for utility functions or components with clear invariants across many inputs.

3.  **Security and Resilience:**
    * Include tests verifying correct output encoding if the component handles user-generated content (less common for this template, but good practice).
    * Test component behavior with invalid or missing props (graceful failure/defaults).

4.  **Documentation and Integration:**
    * If testing a page or layout, create integration tests verifying key components are rendered.
    * Ensure tests are clear, readable, and serve as documentation for component usage.

For each test (`it(...)` block):
* Use descriptive names explaining the scenario and expected outcome (e.g., `it('should render the fallback image when imageUrl prop is omitted')`).
* Follow the Arrange-Act-Assert (AAA) pattern.
* Use `describe` blocks to group related tests (e.g., by component or feature).
* Use Vitest's `expect` for assertions. Matchers from `@testing-library/jest-dom` are helpful (e.g., `toBeInTheDocument`, `toHaveAttribute`).
* Use `beforeEach`, `afterEach` for setup/teardown if needed.

The test suite should be maintainable, provide fast feedback using Vitest, and verify the code's correctness, robustness, accessibility attributes (where testable), and alignment with the requirements specified in `CLAUDE.md` and `PROJECT_PLAN.md`/`todo.md`.

Place the generated test file at: `tests/[corresponding path]/[FileName].test.ts`
```

---
**End of CLAUDE.md**
```