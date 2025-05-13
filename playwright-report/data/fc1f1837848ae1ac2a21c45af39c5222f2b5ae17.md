# Test info

- Name: Accessibility Tests >> Home page passes accessibility checks
- Location: /home/william/git/dont-panic/tests/accessibility/a11y.spec.js:6:3

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/william/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | // @ts-check
   2 | import { test, expect } from '@playwright/test';
   3 | import { AxeBuilder } from '@axe-core/playwright';
   4 |
   5 | test.describe('Accessibility Tests', () => {
>  6 |   test('Home page passes accessibility checks', async ({ page }) => {
     |   ^ Error: browserType.launch: Executable doesn't exist at /home/william/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
   7 |     // Navigate to the homepage
   8 |     await page.goto('/');
   9 |     
  10 |     // Wait for the table to be fully loaded
  11 |     await page.waitForSelector('#reportTable', { state: 'visible' });
  12 |     
  13 |     // Run axe accessibility tests
  14 |     const accessibilityScanResults = await new AxeBuilder({ page })
  15 |       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  16 |       .analyze();
  17 |     
  18 |     // Output violations to console for easier debugging
  19 |     if (accessibilityScanResults.violations.length > 0) {
  20 |       console.log('\nAccessibility violations on homepage:');
  21 |       accessibilityScanResults.violations.forEach((violation) => {
  22 |         console.log(`\nRule: ${violation.id} (${violation.impact} impact)`);
  23 |         console.log(`Description: ${violation.description}`);
  24 |         console.log(`Help: ${violation.help}`);
  25 |         console.log(`Nodes affected: ${violation.nodes.length}`);
  26 |         violation.nodes.slice(0, 3).forEach((node) => {
  27 |           console.log(`- Element: ${node.html}`);
  28 |           console.log(`  Fix suggestion: ${node.failureSummary}`);
  29 |         });
  30 |         if (violation.nodes.length > 3) {
  31 |           console.log(`  ... and ${violation.nodes.length - 3} more elements`);
  32 |         }
  33 |       });
  34 |     }
  35 |     
  36 |     // Expect no violations
  37 |     expect(accessibilityScanResults.violations).toEqual([]);
  38 |   });
  39 | });
```