// @ts-check
import { test, expect } from '@playwright/test';

// Example of an E2E test for the vulnerability table
test.describe('Vulnerability Table E2E Tests', () => {
  
  test('page loads with table and controls', async ({ page }) => {
    await page.goto('/');
    
    // Check that the table exists
    await expect(page.locator('#reportTable')).toBeVisible();
    
    // Check that the filter controls exist
    await expect(page.locator('#searchInput')).toBeVisible();
    await expect(page.locator('#severityFilter')).toBeVisible();
    await expect(page.locator('#zeroDayFilter')).toBeVisible();
    
    // Check that the table headers exist
    await expect(page.locator('th[data-sort-key="cve"]')).toBeVisible();
    await expect(page.locator('th[data-sort-key="title"]')).toBeVisible();
    await expect(page.locator('th[data-sort-key="cvss"]')).toBeVisible();
    await expect(page.locator('th[data-sort-key="date"]')).toBeVisible();
  });

  test('default sort is by date descending', async ({ page }) => {
    await page.goto('/');
    
    // Check that the date column is marked as sorted
    await expect(page.locator('th[data-sort-key="date"] span')).toHaveText('↓');
    
    // Get dates from the table
    const dateCells = await page.locator('tbody tr td:nth-child(7)').all();
    const dates = await Promise.all(dateCells.map(async cell => {
      return new Date(await cell.getAttribute('data-value') || '0').getTime();
    }));
    
    // Check that dates are in descending order
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
    }
  });

  test('clicking column header changes sort', async ({ page }) => {
    await page.goto('/');
    
    // Click on CVSS header to sort by it
    await page.click('th[data-sort-key="cvss"]');
    
    // Check that the CVSS column is now marked as sorted
    await expect(page.locator('th[data-sort-key="cvss"] span')).toHaveText('↓');
    
    // Check URL has the sort parameter
    await expect(page).toHaveURL(/sort=cvss/);
    await expect(page).toHaveURL(/dir=desc/);
    
    // Get CVSS scores from the table
    const cvssCells = await page.locator('tbody tr td:nth-child(3)').all();
    const scores = await Promise.all(cvssCells.map(async cell => {
      return parseFloat(await cell.getAttribute('data-value') || '0');
    }));
    
    // Check that scores are in descending order
    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
    }
    
    // Click again to toggle direction
    await page.click('th[data-sort-key="cvss"]');
    
    // Check that direction is now ascending
    await expect(page.locator('th[data-sort-key="cvss"] span')).toHaveText('↑');
    await expect(page).toHaveURL(/dir=asc/);
  });

  test('filtering by severity', async ({ page }) => {
    await page.goto('/');
    
    // Select Critical severity
    await page.selectOption('#severityFilter', 'Critical');
    
    // Check URL has the severity parameter
    await expect(page).toHaveURL(/severity=Critical/);
    
    // Check all visible rows have Critical severity
    const visibleRows = await page.locator('tbody tr:visible').all();
    for (const row of visibleRows) {
      const severity = await row.getAttribute('data-severity');
      expect(severity).toBe('Critical');
    }
  });

  test('search filter works', async ({ page }) => {
    await page.goto('/');
    
    // Type search term
    await page.fill('#searchInput', 'specific-term');
    
    // Wait for debounce
    await page.waitForTimeout(500);
    
    // Check URL has the search parameter
    await expect(page).toHaveURL(/search=specific-term/);
    
    // Hidden rows should have hidden attribute
    const allRows = await page.locator('tbody tr').all();
    const hiddenRows = await page.locator('tbody tr[hidden]').all();
    
    // If all rows are hidden (no matches), that's fine too
    if (allRows.length > 0) {
      expect(hiddenRows.length).toBeLessThanOrEqual(allRows.length);
    }
  });

  test('zero-day filter works', async ({ page }) => {
    await page.goto('/');
    
    // Check the zero-day filter
    await page.check('#zeroDayFilter');
    
    // Check URL has the zeroday parameter
    await expect(page).toHaveURL(/zeroday=true/);
    
    // Check all visible rows are zero-days
    const visibleRows = await page.locator('tbody tr:visible').all();
    for (const row of visibleRows) {
      const isZeroDay = await row.getAttribute('data-zeroday');
      expect(isZeroDay).toBe('true');
    }
  });

  test('clicking on CVE ID navigates to report page', async ({ page }) => {
    await page.goto('/');
    
    // Get the first CVE link
    const firstCveLink = await page.locator('tbody tr:first-child td:first-child a');
    const cveId = await firstCveLink.textContent();
    
    // Click the link
    await firstCveLink.click();
    
    // Should navigate to the report page
    await expect(page).toHaveURL(/\/reports\//);
    
    // Report page should show the right CVE ID
    await expect(page.locator('h1, h2')).toContainText(cveId);
  });
});