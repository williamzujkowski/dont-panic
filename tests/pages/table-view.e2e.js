// @ts-check
import { test, expect } from '@playwright/test';

// E2E tests for the vulnerability table with sidebar filters
test.describe('Vulnerability Table E2E Tests', () => {
  
  test('page loads with table and sidebar controls', async ({ page }) => {
    await page.goto('/');
    
    // Check that the table exists
    await expect(page.locator('#reportTable')).toBeVisible();
    
    // Check that the filter sidebar exists
    await expect(page.locator('aside')).toBeVisible();
    
    // Check that the sidebar filter controls exist
    await expect(page.locator('#zeroDayFilter')).toBeVisible();
    await expect(page.locator('#cvssSlider')).toBeVisible();
    await expect(page.locator('#epssSlider')).toBeVisible();
    await expect(page.locator('#criticalFilter')).toBeVisible();
    await expect(page.locator('#startDateFilter')).toBeVisible();
    await expect(page.locator('#resetFilters')).toBeVisible();
    await expect(page.locator('#applyFiltersBtn')).toBeVisible();
    
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

  test('severity filter in sidebar works', async ({ page }) => {
    await page.goto('/');
    
    // Check Critical severity in the sidebar
    await page.check('#criticalFilter');
    await page.click('#applyFiltersBtn');
    
    // Wait for filtering to complete
    await page.waitForTimeout(100);
    
    // Check URL has the severity parameter
    await expect(page).toHaveURL(/severity=Critical/);
    
    // Active filters display should show the Critical chip
    await expect(page.locator('#activeFilters')).toBeVisible();
    await expect(page.locator('#activeFiltersList')).toContainText('Critical');
    
    // Check all visible rows have Critical severity
    const visibleRows = await page.locator('tbody tr:visible').all();
    
    // If we have visible rows, they should all be Critical
    if (visibleRows.length > 0) {
      for (const row of visibleRows) {
        const severity = await row.getAttribute('data-severity');
        expect(severity).toBe('Critical');
      }
    }
  });

  test('CVSS slider filter works', async ({ page }) => {
    await page.goto('/');
    
    // Set CVSS slider to 7.0
    await page.fill('#cvssSlider', '7.0');
    await page.click('#applyFiltersBtn');
    
    // Wait for filtering to complete
    await page.waitForTimeout(100);
    
    // Check URL has the CVSS parameter
    await expect(page).toHaveURL(/cvssMin=7/);
    
    // Active filters display should show the CVSS filter chip
    await expect(page.locator('#activeFilters')).toBeVisible();
    await expect(page.locator('#activeFiltersList')).toContainText('CVSS');
    
    // Check all visible rows have CVSS >= 7.0
    const visibleRows = await page.locator('tbody tr:visible').all();
    
    // If we have visible rows, they should all meet the CVSS threshold
    if (visibleRows.length > 0) {
      for (const row of visibleRows) {
        const cvss = parseFloat(await row.getAttribute('data-cvss') || '0');
        expect(cvss).toBeGreaterThanOrEqual(7.0);
      }
    }
  });

  test('zero-day filter in sidebar works', async ({ page }) => {
    await page.goto('/');
    
    // Check the zero-day filter in sidebar
    await page.check('#zeroDayFilter');
    await page.click('#applyFiltersBtn');
    
    // Wait for filtering to complete
    await page.waitForTimeout(100);
    
    // Check URL has the zeroDay parameter
    await expect(page).toHaveURL(/zeroDay=true/);
    
    // Active filters display should show the Zero-Day chip
    await expect(page.locator('#activeFilters')).toBeVisible();
    await expect(page.locator('#activeFiltersList')).toContainText('Zero-Day');
    
    // Check all visible rows are zero-days
    const visibleRows = await page.locator('tbody tr:visible').all();
    
    // If we have visible rows, they should all be zero-days
    if (visibleRows.length > 0) {
      for (const row of visibleRows) {
        const isZeroDay = await row.getAttribute('data-zeroday');
        expect(isZeroDay).toBe('true');
      }
    }
  });
  
  test('date range filter works', async ({ page }) => {
    await page.goto('/');
    
    // Set start date to 30 days ago
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const startDate = thirtyDaysAgo.toISOString().split('T')[0]; // YYYY-MM-DD
    const endDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    await page.fill('#startDateFilter', startDate);
    await page.fill('#endDateFilter', endDate);
    await page.click('#applyFiltersBtn');
    
    // Wait for filtering to complete
    await page.waitForTimeout(100);
    
    // Check URL has the date range parameters
    await expect(page).toHaveURL(/startDate=/);
    await expect(page).toHaveURL(/endDate=/);
    
    // Active filters display should show the date range chips
    await expect(page.locator('#activeFilters')).toBeVisible();
    await expect(page.locator('#activeFiltersList')).toContainText('From:');
    
    // Check all visible rows are within the date range
    const visibleRows = await page.locator('tbody tr:visible').all();
    
    // If we have visible rows, they should all be within the date range
    if (visibleRows.length > 0) {
      for (const row of visibleRows) {
        const rowDate = await row.getAttribute('data-date');
        expect(rowDate >= startDate).toBeTruthy();
        expect(rowDate <= endDate).toBeTruthy();
      }
    }
  });
  
  test('reset filters button works', async ({ page }) => {
    await page.goto('/');
    
    // Apply a filter - check Zero-Day
    await page.check('#zeroDayFilter');
    await page.click('#applyFiltersBtn');
    
    // Wait for filtering to complete
    await page.waitForTimeout(100);
    
    // Verify filter is applied (URL has parameter)
    await expect(page).toHaveURL(/zeroDay=true/);
    
    // Click reset filters button
    await page.click('#resetFilters');
    
    // Wait for reset to complete
    await page.waitForTimeout(100);
    
    // Verify Zero-Day checkbox is unchecked
    await expect(page.locator('#zeroDayFilter')).not.toBeChecked();
    
    // Active filters display should be hidden
    await expect(page.locator('#activeFilters')).toBeHidden();
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