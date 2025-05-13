// @ts-check
import { test, expect } from '@playwright/test';

// Advanced E2E tests for sorting and filtering functionality
test.describe('Vulnerability Table Sorting and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');
    // Ensure table is loaded
    await expect(page.locator('#reportTable')).toBeVisible();
  });
  
  test('combining multiple filters works correctly', async ({ page }) => {
    // Apply multiple filters
    // 1. Set CVSS to 7.0+
    await page.fill('#cvssSlider', '7.0');
    
    // 2. Select Critical severity
    await page.check('#criticalFilter');
    
    // 3. Apply filters
    await page.click('#applyFiltersBtn');
    
    // Wait for filtering to complete
    await page.waitForTimeout(200);
    
    // Check URL has both parameters
    await expect(page).toHaveURL(/cvssMin=7/);
    await expect(page).toHaveURL(/severity=Critical/);
    
    // Verify active filters display shows both filters
    await expect(page.locator('#activeFilters')).toBeVisible();
    await expect(page.locator('#activeFiltersList')).toContainText('CVSS');
    await expect(page.locator('#activeFiltersList')).toContainText('Critical');
    
    // Check all visible rows meet both criteria
    const visibleRows = await page.locator('tbody tr:visible').all();
    
    if (visibleRows.length > 0) {
      for (const row of visibleRows) {
        const cvss = parseFloat(await row.getAttribute('data-cvss') || '0');
        const severity = await row.getAttribute('data-severity');
        
        expect(cvss).toBeGreaterThanOrEqual(7.0);
        expect(severity).toBe('Critical');
      }
    }
  });
  
  test('date presets correctly update date inputs', async ({ page }) => {
    // Click on "Last 7d" preset
    await page.click('#datePreset7days');
    
    // Check that both date inputs are filled
    const startDateValue = await page.inputValue('#startDateFilter');
    const endDateValue = await page.inputValue('#endDateFilter');
    
    expect(startDateValue).not.toBe('');
    expect(endDateValue).not.toBe('');
    
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // The difference should be 7 days
    expect(diffDays).toBe(7);
    
    // Apply the filter
    await page.click('#applyFiltersBtn');
    
    // Check URL has the date range parameters
    await expect(page).toHaveURL(/startDate=/);
    await expect(page).toHaveURL(/endDate=/);
  });
  
  test('removing individual filters via active filters display works', async ({ page }) => {
    // Apply multiple filters
    await page.check('#criticalFilter');
    await page.check('#highFilter');
    await page.click('#applyFiltersBtn');
    
    // Wait for filtering to complete
    await page.waitForTimeout(200);
    
    // Verify both filters are active
    await expect(page.locator('#activeFiltersList')).toContainText('Critical');
    await expect(page.locator('#activeFiltersList')).toContainText('High');
    
    // Remove just the Critical filter by clicking its remove button
    const criticalFilter = await page.locator('.filter-chip').filter({ hasText: 'Critical' });
    await criticalFilter.locator('button').click();
    
    // Wait for filter removal to complete
    await page.waitForTimeout(200);
    
    // Verify Critical is gone but High remains
    await expect(page.locator('#activeFiltersList')).not.toContainText('Critical');
    await expect(page.locator('#activeFiltersList')).toContainText('High');
    
    // URL should no longer have Critical
    await expect(page).toHaveURL(/severity=High/);
    await expect(page).not.toHaveURL(/Critical/);
  });
  
  test('view toggle between table and card works', async ({ page }) => {
    // Table view should be active by default
    await expect(page.locator('#tableContainer')).toBeVisible();
    await expect(page.locator('#cardView')).not.toBeVisible();
    
    // Click on card view button
    await page.click('#cardViewBtn');
    
    // Wait for view transition
    await page.waitForTimeout(300);
    
    // Card view should now be visible, table hidden
    await expect(page.locator('#tableContainer')).not.toBeVisible();
    await expect(page.locator('#cardView')).toBeVisible();
    
    // Switch back to table view
    await page.click('#tableViewBtn');
    
    // Wait for view transition
    await page.waitForTimeout(300);
    
    // Table view should be visible again
    await expect(page.locator('#tableContainer')).toBeVisible();
    await expect(page.locator('#cardView')).not.toBeVisible();
  });
  
  test('filtering persists when switching views', async ({ page }) => {
    // Apply a filter in table view
    await page.check('#zeroDayFilter');
    await page.click('#applyFiltersBtn');
    
    // Wait for filtering to complete
    await page.waitForTimeout(200);
    
    // Get count of visible rows in table
    const tableRows = await page.locator('tbody tr:visible').count();
    
    // Switch to card view
    await page.click('#cardViewBtn');
    
    // Wait for view transition
    await page.waitForTimeout(300);
    
    // Count visible cards
    const visibleCards = await page.locator('#cardView > div:not([hidden])').count();
    
    // Both counts should match
    expect(visibleCards).toBe(tableRows);
  });
  
  test('sorting order toggle works correctly', async ({ page }) => {
    // Initial sort should be by date descending
    await expect(page.locator('th[data-sort-key="date"] span')).toHaveText('↓');
    
    // Click date header to toggle to ascending
    await page.click('th[data-sort-key="date"]');
    
    // Check that direction is now ascending
    await expect(page.locator('th[data-sort-key="date"] span')).toHaveText('↑');
    await expect(page).toHaveURL(/dir=asc/);
    
    // Get dates from the table
    const dateCells = await page.locator('tbody tr td:nth-child(7)').all();
    const dates = await Promise.all(dateCells.map(async cell => {
      return new Date(await cell.getAttribute('data-value') || '0').getTime();
    }));
    
    // Check that dates are in ascending order
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeLessThanOrEqual(dates[i + 1]);
    }
    
    // Click again to toggle back to descending
    await page.click('th[data-sort-key="date"]');
    
    // Check that direction is back to descending
    await expect(page.locator('th[data-sort-key="date"] span')).toHaveText('↓');
    await expect(page).toHaveURL(/dir=desc/);
  });
  
  test('VulnerabilityTable component keyboard navigation works', async ({ page }) => {
    // Tab to focus on the first row
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Now the first row should be focused
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeFocused();
    
    // Press Enter to navigate to the detail page
    await page.keyboard.press('Enter');
    
    // Should navigate to the report page
    await expect(page).toHaveURL(/\/reports\//);
  });
  
  test('filter sidebar toggle works on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // On mobile, sidebar should be hidden by default
    await expect(page.locator('#filterSidebarWrapper')).not.toBeVisible();
    
    // Toggle button should be visible
    const toggleButton = page.locator('#mobileFilterToggleBtn, #sidebarToggleBtn');
    await expect(toggleButton).toBeVisible();
    
    // Click to show sidebar
    await toggleButton.click();
    
    // Wait for animation
    await page.waitForTimeout(300);
    
    // Sidebar should now be visible
    await expect(page.locator('#filterSidebarWrapper')).toBeVisible();
    
    // Close sidebar
    await page.locator('#closeSidebarBtn').click();
    
    // Wait for animation
    await page.waitForTimeout(300);
    
    // Sidebar should be hidden again
    await expect(page.locator('#filterSidebarWrapper')).not.toBeVisible();
  });
  
  test('mobile responsiveness hides appropriate columns', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Title column should be hidden on mobile
    await expect(page.locator('th[data-sort-key="title"]')).not.toBeVisible();
    
    // EPSS column should be hidden on mobile
    await expect(page.locator('th[data-sort-key="epss"]')).not.toBeVisible();
    
    // Zero-day column should be hidden on mobile
    await expect(page.locator('th[data-sort-key="zeroday"]')).not.toBeVisible();
    
    // Essential columns (CVE ID, CVSS, Severity, Date) should still be visible
    await expect(page.locator('th[data-sort-key="cve"]')).toBeVisible();
    await expect(page.locator('th[data-sort-key="cvss"]')).toBeVisible();
    await expect(page.locator('th[data-sort-key="severity"]')).toBeVisible();
    await expect(page.locator('th[data-sort-key="date"]')).toBeVisible();
    
    // Set viewport back to desktop size
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // All columns should now be visible
    await expect(page.locator('th[data-sort-key="title"]')).toBeVisible();
    await expect(page.locator('th[data-sort-key="epss"]')).toBeVisible();
    await expect(page.locator('th[data-sort-key="zeroday"]')).toBeVisible();
  });
  
  test('filter sidebar vendor search works', async ({ page }) => {
    // Skip test if no vendors are present
    const vendorSearchExists = await page.locator('#vendorSearch').count() > 0;
    test.skip(!vendorSearchExists, 'No vendor search found, skipping test');
    
    if (vendorSearchExists) {
      // Type in vendor search box
      await page.fill('#vendorSearch', 'a');
      
      // Get all visible vendor checkboxes
      const visibleVendors = await page.locator('.vendor-checkboxes label:visible').count();
      
      // Type a more specific search
      await page.fill('#vendorSearch', 'xyz123nonexistent');
      
      // Check "no results" message appears
      await expect(page.locator('#noVendorResults')).toBeVisible();
      
      // Clear search
      await page.locator('#clearVendorSearch').click();
      
      // All vendors should be visible again
      const resetVisibleVendors = await page.locator('.vendor-checkboxes label:visible').count();
      expect(resetVisibleVendors).toBeGreaterThanOrEqual(visibleVendors);
    }
  });
});