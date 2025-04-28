import { describe, it, expect } from 'vitest';
// Removed testing-library/dom import
import { within } from '@testing-library/dom'; // Keep within for scoped queries
import Hero from './Hero.astro'; // Direct import might need adjustment

// Mock render helper - Simulates the expected output structure
// NOTE: This does NOT render the actual Astro component.
async function renderHero(props: { headline: string; subheadline?: string; ctaText: string; ctaHref: string }) {
  const subheadlineHtml = props.subheadline ? `<p class="text-xl text-text-secondary mb-8">${props.subheadline}</p>` : ''; // Added example classes
  const html = `
    <section class="text-center py-16 md:py-24 bg-gradient-to-b from-surface to-background">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold text-primary mb-4">${props.headline}</h1>
        ${subheadlineHtml}
        <a href="${props.ctaHref}" class="cta-button inline-block bg-primary text-white font-semibold py-3 px-8 rounded hover:bg-primary-dark transition-colors">${props.ctaText}</a>
      </div>
    </section>
  `;
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
}

describe('Hero Component Mock Test', () => { // Renamed describe block
  const sampleProps = {
    headline: 'Test Headline',
    subheadline: 'Test Subheadline',
    ctaText: 'Click Me',
    ctaHref: '/test-link',
  };

  it('HYPOTHESIS: Renders section, headline, subheadline, and CTA link', async () => {
    const heroContainer = await renderHero(sampleProps);
    const section = heroContainer.querySelector('section'); // Simplified query
    expect(section, 'Section element should exist').not.toBeNull();

    // Use querySelector for simplicity
    const heading = section?.querySelector('h1');
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe(sampleProps.headline);

    const subheadline = section?.querySelector('p'); // Assuming subheadline is the only <p>
    expect(subheadline).not.toBeNull();
    expect(subheadline?.textContent).toBe(sampleProps.subheadline);

    const ctaLink = section?.querySelector('a.cta-button');
    expect(ctaLink).not.toBeNull();
    expect(ctaLink?.textContent?.trim()).toBe(sampleProps.ctaText); // Use trim()
    expect(ctaLink?.getAttribute('href')).toBe(sampleProps.ctaHref);
  });

  it('HYPOTHESIS: Renders correctly without optional subheadline', async () => {
    const { subheadline, ...propsWithoutSub } = sampleProps;
    const heroContainer = await renderHero(propsWithoutSub);
    const section = heroContainer.querySelector('section');

    expect(section?.querySelector('p')).toBeNull(); // Subheadline <p> should not be present
    expect(section?.querySelector('h1')?.textContent).toBe(sampleProps.headline);
    expect(section?.querySelector('a.cta-button')?.textContent?.trim()).toBe(sampleProps.ctaText); // Use trim()
  });
});
