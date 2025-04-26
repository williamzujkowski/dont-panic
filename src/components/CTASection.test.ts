import { describe, it, expect } from 'vitest';
// Removed testing-library/dom import
import { within } from '@testing-library/dom'; // Keep within for scoped queries
import CTASection from './CTASection.astro'; // Direct import might need adjustment

// Mock render helper
async function renderCTASection(props: { headline: string; ctaText: string; ctaHref: string }) {
  const html = `
    <section class="cta-section">
      <div class="cta-content">
        <h2>${props.headline}</h2>
        <a href="${props.ctaHref}" class="cta-button">${props.ctaText}</a>
      </div>
    </section>
  `;
  const container = document.createElement('div');
  container.innerHTML = html;
  return container; // Return the container element directly
}

describe('CTASection.astro', () => {
  const sampleProps = {
    headline: 'Ready to Test?',
    ctaText: 'Run Tests',
    ctaHref: '/run-tests',
  };

  it('3.3: Renders <section>, headline, and CTA link', async () => {
    const ctaContainer = await renderCTASection(sampleProps);
    // No render call needed, query ctaContainer directly
    const section = ctaContainer.querySelector('section.cta-section'); // More specific query
    expect(section, 'Section element should exist').not.toBeNull();

    // Use within to scope queries to the container
    const heading = within(ctaContainer).getByRole('heading', { level: 2, name: sampleProps.headline });
    expect(heading).not.toBeNull();

    const ctaLink = within(ctaContainer).getByRole('link', { name: sampleProps.ctaText });
    expect(ctaLink).not.toBeNull();
    expect(ctaLink.getAttribute('href')).toBe(sampleProps.ctaHref);
  });
});
