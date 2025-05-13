// @ts-check
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('Home page passes accessibility checks', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Wait for the table to be fully loaded
    await page.waitForSelector('#reportTable', { state: 'visible' });
    
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Output violations to console for easier debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\nAccessibility violations on homepage:');
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`\nRule: ${violation.id} (${violation.impact} impact)`);
        console.log(`Description: ${violation.description}`);
        console.log(`Help: ${violation.help}`);
        console.log(`Nodes affected: ${violation.nodes.length}`);
        violation.nodes.slice(0, 3).forEach((node) => {
          console.log(`- Element: ${node.html}`);
          console.log(`  Fix suggestion: ${node.failureSummary}`);
        });
        if (violation.nodes.length > 3) {
          console.log(`  ... and ${violation.nodes.length - 3} more elements`);
        }
      });
    }
    
    // Expect no violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});