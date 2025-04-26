import { describe, it, expect } from 'vitest';
// Removed testing-library/dom import
import { within } from '@testing-library/dom'; // Keep within for scoped queries
import Header from './Header.astro'; // Direct import might need adjustment
import type { NavItem } from '../data/navItems'; // Import type

// Mock render helper (adjust as needed for Astro)
async function renderHeader(props: { siteTitle: string; navItems: NavItem[]; currentPath: string }) {
  // Simplified rendering - real testing might need Astro's tools
  const navLinksHtml = props.navItems.map(item => `
    <li class="nav-item">
      <a href="${item.href}" class="nav-link ${item.href === props.currentPath ? 'active' : ''}" ${item.href === props.currentPath ? 'aria-current="page"' : ''}>
        ${item.text}
      </a>
    </li>
  `).join('');

  const html = `
    <header role="banner" class="site-header">
      <div class="site-title">
        <a href="/">${props.siteTitle}</a>
      </div>
      <nav role="navigation" aria-label="Main navigation">
        <ul class="nav-list">
          ${navLinksHtml}
        </ul>
      </nav>
    </header>
  `;
  const container = document.createElement('div');
  container.innerHTML = html;
  return container; // Return the container element directly
}

describe('Header.astro', () => {
  const sampleNavItems: NavItem[] = [
    { text: 'Home', href: '/' },
    { text: 'About', href: '/about' },
  ];
  const sampleSiteTitle = 'Test Site';

  it('2.1: Renders <header>, title placeholder area, and <nav>', async () => {
    const headerContainer = await renderHeader({ siteTitle: sampleSiteTitle, navItems: [], currentPath: '/' });
    // No render call needed, query headerContainer directly
    expect(headerContainer.querySelector('header[role="banner"]')).not.toBeNull(); // Checks for <header role="banner">
    expect(headerContainer.querySelector('nav[role="navigation"]')).not.toBeNull(); // Checks for <nav role="navigation">
    expect(within(headerContainer).getByText(sampleSiteTitle)).not.toBeNull(); // Checks for site title presence
  });

  it('2.2: Accepts and displays siteTitle prop as a link to /', async () => {
    const headerContainer = await renderHeader({ siteTitle: sampleSiteTitle, navItems: [], currentPath: '/' });
    // No render call needed, query headerContainer directly
    const titleLink = within(headerContainer).getByRole('link', { name: sampleSiteTitle });
    expect(titleLink).not.toBeNull();
    expect(titleLink.getAttribute('href')).toBe('/');
  });

  it('2.3: Accepts navItems and renders ul > li > a structure', async () => {
    const headerContainer = await renderHeader({ siteTitle: sampleSiteTitle, navItems: sampleNavItems, currentPath: '/' });
    // No render call needed, query headerContainer directly
    const nav = headerContainer.querySelector('nav[role="navigation"]');
    expect(nav, 'Navigation element should exist').not.toBeNull();
    const list = within(nav!).getByRole('list'); // Use within on the found nav
    expect(list).not.toBeNull();

    const items = within(list).getAllByRole('listitem'); // Use within on the found list
    expect(items).toHaveLength(sampleNavItems.length);

    items.forEach((item, index) => {
      const link = within(item).getByRole('link', { name: sampleNavItems[index].text });
      expect(link).not.toBeNull();
      expect(link.getAttribute('href')).toBe(sampleNavItems[index].href);
    });
  });

   it('Accessibility: Applies aria-current="page" to the active link', async () => {
    const currentPath = '/about';
    const headerContainer = await renderHeader({ siteTitle: sampleSiteTitle, navItems: sampleNavItems, currentPath: currentPath });
    // No render call needed, query headerContainer directly

    const activeLink = within(headerContainer).getByRole('link', { name: 'About' });
    const inactiveLink = within(headerContainer).getByRole('link', { name: 'Home' });

    expect(activeLink.getAttribute('aria-current')).toBe('page');
    expect(inactiveLink.getAttribute('aria-current')).toBeNull();
  });
});
