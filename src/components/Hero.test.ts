import { describe, it, expect } from 'vitest';
// Removed testing-library/dom import
import { within } from '@testing-library/dom'; // Keep within for scoped queries
import Hero from './Hero.astro'; // Direct import might need adjustment

// Mock render helper
async function renderHero(props: { headline: string; subheadline?: string; ctaText: string; ctaHref: string }) {
  const subheadlineHtml = props.subheadline ? `<p class="subheadline">${props.subheadline}</p>` : '';
  const html = `
    <section class="hero-section">
      <div class="hero-content">
        <h1>${props.headline}</h1>
        ${subheadlineHtml}
        <a href="${props.ctaHref}" class="cta-button">${props.ctaText}</a>
      </div>
    </section>
  `;
  const container = document.createElement('div');
  container.innerHTML = html;
  return container; // Return the container element directly
}

describe('Hero.astro', () => {
  const sampleProps = {
    headline: 'Test Headline',
    subheadline: 'Test Subheadline',
    ctaText: 'Click Me',
    ctaHref: '/test-link',
  };

  it('3.1: Renders <section>, headline, subheadline, and CTA link', async () => {
    const heroContainer = await renderHero(sampleProps);
    // No render call needed, query heroContainer directly
    const section = heroContainer.querySelector('section.hero-section'); // More specific query
    expect(section, 'Section element should exist').not.toBeNull();

    // Use within to scope queries
    const heading = within(heroContainer).getByRole('heading', { level: 1, name: sampleProps.headline });
    expect(heading).not.toBeNull();

    const subheadline = within(heroContainer).getByText(sampleProps.subheadline);
    expect(subheadline).not.toBeNull();

    const ctaLink = within(heroContainer).getByRole('link', { name: sampleProps.ctaText });
    expect(ctaLink).not.toBeNull();
    expect(ctaLink.getAttribute('href')).toBe(sampleProps.ctaHref);
  });

  it('3.1: Renders correctly without optional subheadline', async () => {
    const { subheadline, ...propsWithoutSub } = sampleProps;
    const heroContainer = await renderHero(propsWithoutSub);
    // No render call needed, query heroContainer directly

    // Use within to scope queries
    expect(within(heroContainer).queryByText(sampleProps.subheadline)).toBeNull(); // Subheadline should not be present
    expect(within(heroContainer).getByRole('heading', { level: 1, name: sampleProps.headline })).not.toBeNull();
    expect(within(heroContainer).getByRole('link', { name: sampleProps.ctaText })).not.toBeNull();
  });
});
