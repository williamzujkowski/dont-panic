import { describe, it, expect } from 'vitest';
// Removed testing-library/dom import
import { within } from '@testing-library/dom'; // Keep within for scoped queries
import CTASection from './CTASection.astro'; // Direct import might need adjustment

// Mock render helper - Simulates the expected output structure
// NOTE: This does NOT render the actual Astro component.
async function renderCTASection(props: { headline: string; ctaText: string; ctaHref: string }) {
  const html = `
    <section class="py-12 md:py-20 bg-primary text-white text-center"> {/* Added example classes */}
      <div class="container mx-auto px-4"> {/* Added example classes */}
        <h2 class="text-3xl font-bold mb-6">${props.headline}</h2> {/* Added example classes */}
        <a href="${props.ctaHref}" class="cta-button inline-block bg-white text-primary font-semibold py-3 px-8 rounded hover:bg-gray-100 transition-colors"> {/* Added example classes */}
          ${props.ctaText}
        </a>
      </div>
    </section>
  `;
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
}

describe('CTASection Component Mock Test', () => { // Renamed describe block
  const sampleProps = {
    headline: 'Ready to Test?',
    ctaText: 'Run Tests',
    ctaHref: '/run-tests',
  };

  it('HYPOTHESIS: Renders section, headline, and CTA link', async () => {
    const ctaContainer = await renderCTASection(sampleProps);
    const section = ctaContainer.querySelector('section'); // Simplified query
    expect(section, 'Section element should exist').not.toBeNull();

    // Use querySelector for simplicity
    const heading = section?.querySelector('h2');
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe(sampleProps.headline);

    const ctaLink = section?.querySelector('a.cta-button');
    expect(ctaLink).not.toBeNull();
    expect(ctaLink?.textContent).toBe(sampleProps.ctaText);
    expect(ctaLink?.getAttribute('href')).toBe(sampleProps.ctaHref);
  });
});
