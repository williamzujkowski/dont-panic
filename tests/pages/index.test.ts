// NOTE: Testing Astro pages that use virtual modules like `astro:content`
// directly in Vitest can be complex. These tests use mocking.
// Consider E2E tests for full page validation.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/dom'; // Used for potential future DOM checks if rendering is solved
import '@testing-library/jest-dom/vitest'; // Import Jest DOM matchers for Vitest
// import IndexPage from '../../src/pages/index.astro'; // Cannot import .astro page directly in Vitest easily
import type { CollectionEntry } from 'astro:content';

// --- Mock Data ---
// (Moved mock data definition before mock setup for clarity)
const mockReports: CollectionEntry<'reports'>[] = [
    {
        id: 'report-1.md', slug: 'report-1', collection: 'reports', body: '',
        data: {
            cveId: "CVE-2024-0001", title: "Report One", publishDate: new Date("2024-07-20T00:00:00.000Z"),
            cvssScore: 7.5, severity: "High", isZeroDay: false
        },
        render: async () => ({ Content: () => '', headings: [], remarkPluginFrontmatter: {} })
    },
    {
        id: 'report-2.md', slug: 'report-2', collection: 'reports', body: '',
        data: {
            cveId: "CVE-2024-0002", title: "Report Two", publishDate: new Date("2024-07-18T00:00:00.000Z"),
            description: "Second report desc", cvssScore: 9.8, severity: "Critical", isZeroDay: true
        },
        render: async () => ({ Content: () => '', headings: [], remarkPluginFrontmatter: {} })
    },
];

// --- Mocking Astro Features ---

// 1. Hoist the mock function creation so it's available *before* imports
const { mockGetCollectionFn } = vi.hoisted(() => {
  return { mockGetCollectionFn: vi.fn() };
});

// 2. Mock the module and provide the hoisted mock function in the factory
vi.mock('astro:content', async (importOriginal) => {
    const original = await importOriginal() as typeof import('astro:content');
    return {
        ...original,
        getCollection: mockGetCollectionFn, // Use the hoisted mock function
    };
});

// 3. DO NOT import from 'astro:content' here anymore. Access the mock via the hoisted variable.
// import { getCollection } from 'astro:content'; // REMOVED STATIC IMPORT


// Mock Astro global/config
const mockAstroConfig = {
    base: '/test-base/'
};

// --- Test Suite ---
// (Mock data moved above mock setup)

describe('Index Page (src/pages/index.astro)', () => {

    beforeEach(() => {
        // Reset mocks before each test using the hoisted reference
        mockGetCollectionFn.mockClear();
        // Re-apply default mock behavior
        mockGetCollectionFn.mockResolvedValue(mockReports);

        // Mock Astro global
        // @ts-ignore
        globalThis.Astro = { config: mockAstroConfig };
        // @ts-ignore
        delete globalThis.Astro;
    });

    it('HYPOTHESIS: Mock setup works (mockGetCollectionFn can be called)', async () => {
        // This test verifies the basic mock setup is in place by calling the hoisted mock function.

        // Call the hoisted mock function directly
        const result = await mockGetCollectionFn('reports');

        // Assert that the mock was called and returned the expected value
        expect(mockGetCollectionFn).toHaveBeenCalledWith('reports');
        expect(result).toEqual(mockReports);
    });

    // NOTE: The following tests should be implemented as E2E tests since table
    // implementation includes client-side JavaScript for sorting and filtering

    // Suggested E2E tests for full page validation:
    // - Test initial table load with correct number of rows
    // - Test sorting by different columns (Date, CVSS, Severity)
    // - Test filtering by text, severity, and zero-day status
    // - Test URL state updates when sorting/filtering
    // - Test that clicking on CVE ID navigates to report detail page
});

// Playwright E2E Test Example (pseudo-code):
/*
import { test, expect } from '@playwright/test';

test('Table loads with correct number of rows', async ({ page }) => {
  await page.goto('/');
  const rows = await page.locator('table#reportTable tbody tr');
  await expect(rows).toHaveCount(2); // Assuming 2 sample reports
});

test('Sort by CVSS Score descending', async ({ page }) => {
  await page.goto('/');
  await page.click('th[data-sort-key="cvss"]');
  
  // Check sorting indicator is visible
  await expect(page.locator('th[data-sort-key="cvss"] span')).toHaveText('↓');
  
  // Verify first row has highest CVSS score
  const firstRowCvss = await page.locator('tbody tr:first-child td[data-value]').nth(0).getAttribute('data-value');
  expect(Number(firstRowCvss)).toBeGreaterThan(7);
});

test('Filter by severity', async ({ page }) => {
  await page.goto('/');
  await page.selectOption('#severityFilter', 'Critical');
  
  // Check URL is updated
  await expect(page).toHaveURL(/severity=Critical/);
  
  // Check filtered table shows only critical items
  const visibleRows = await page.locator('tbody tr:visible');
  await expect(visibleRows).toHaveCount(1);
  await expect(page.locator('tbody tr:visible td:nth-child(5)')).toHaveText(/Critical/);
});
*/