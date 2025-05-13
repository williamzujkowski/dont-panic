// @ts-check
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

/**
 * This file contains accessibility tests for the Don't Panic website.
 * It uses axe-core to perform WCAG compliance checks on key pages.
 * 
 * To run these tests:
 * 1. Install the required packages: npm install -D @axe-core/playwright
 * 2. Run: npx playwright test a11y-audit.js
 * 
 * These tests check for WCAG 2.1 AA compliance issues and report them.
 */

test.describe('accessibility', () => {
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
  
  test('Report detail page passes accessibility checks', async ({ page }) => {
    // First, go to the homepage and click on the first report to get to a detail page
    await page.goto('/');
    
    // Get the link to the first report
    const firstReportLink = page.locator('tbody tr:first-child td:first-child a');
    await firstReportLink.click();
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Output violations to console for easier debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\nAccessibility violations on report detail page:');
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
  
  test('About page passes accessibility checks', async ({ page }) => {
    // Navigate to the about page
    await page.goto('/about');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Output violations to console for easier debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\nAccessibility violations on about page:');
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
  
  test('Mobile view passes accessibility checks', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to the homepage
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForSelector('#reportTable', { state: 'visible' });
    
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Output violations to console for easier debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\nAccessibility violations on mobile view:');
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
  
  test('Sidebar filter controls are accessible', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Run axe accessibility tests specifically on the filter sidebar
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#filterSidebar')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Output violations to console for easier debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\nAccessibility violations in filter sidebar:');
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
  
  test('VulnerabilityTable component is accessible', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Run axe accessibility tests specifically on the VulnerabilityTable component
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#reportTable')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Output violations to console for easier debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\nAccessibility violations in VulnerabilityTable:');
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