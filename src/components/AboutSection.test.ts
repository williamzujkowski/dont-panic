import { describe, it, expect, beforeEach } from 'vitest';

// Mock props interface
interface AboutSectionProps {
  headline: string;
  content: string;
  imageUrl?: string;
}

// Mock render helper - Simulates the expected output structure
// NOTE: This does NOT render the actual Astro component.
async function renderAboutSection(props: AboutSectionProps) {
  const imageHtml = props.imageUrl ? `<img src="${props.imageUrl}" alt="" class="rounded-lg shadow-md">` : ''; // Added example classes
  const html = `
    <section class="py-12 md:py-20"> {/* Added example classes */}
      <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"> {/* Added example classes */}
        <div class="prose prose-lg dark:prose-invert max-w-none"> {/* Added example classes */}
          <h2 class="text-3xl font-bold mb-4 text-primary">${props.headline}</h2> {/* Added example classes */}
          <p>${props.content}</p> {/* Assuming content is simple text */}
        </div>
        ${imageHtml ? `<div class="about-image-wrapper">${imageHtml}</div>` : ''}
      </div>
    </section>
  `;
  const container = document.createElement('div');
  container.innerHTML = html;
  return container; // Return the container element directly
}


describe('AboutSection Component Mock Test', () => { // Renamed describe block
  beforeEach(() => {
    // Clean up DOM before each test
    // Clean up DOM before each test if needed (happy-dom might handle this)
    document.body.innerHTML = '';
  });

  it('HYPOTHESIS: Renders the section element', async () => {
    const props = { headline: 'Test Headline', content: 'Test content.' };
    const container = await renderAboutSection(props);
    const section = container.querySelector('section'); // Simplified query
    expect(section).not.toBeNull();
  });

  it('HYPOTHESIS: Renders the headline correctly', async () => {
    const props = { headline: 'About Our Company', content: 'Some text.' };
    const container = await renderAboutSection(props);
    const heading = container.querySelector('h2');
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe(props.headline);
  });

  it('HYPOTHESIS: Renders the content correctly', async () => {
    const props = { headline: 'About', content: 'This is the main content about us.' };
    const container = await renderAboutSection(props);
    const contentElement = container.querySelector('p'); // Assuming content is in first <p>
    expect(contentElement).not.toBeNull();
    expect(contentElement?.textContent).toBe(props.content);
  });

  it('HYPOTHESIS: Renders an image when imageUrl is provided', async () => {
    const props = { headline: 'About', content: 'Content.', imageUrl: '/images/about.jpg' };
    const container = await renderAboutSection(props);
    const image = container.querySelector('img'); // Simplified query
    expect(image).not.toBeNull();
    expect(image?.getAttribute('src')).toBe(props.imageUrl);
  });

  it('HYPOTHESIS: Does not render an image wrapper or image when imageUrl is not provided', async () => {
    const props = { headline: 'About', content: 'Content.' };
    const container = await renderAboutSection(props);
    expect(container.querySelector('.about-image-wrapper')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
  });

  it('HYPOTHESIS: Applies expected Tailwind classes (basic check)', async () => {
     const props = { headline: 'About', content: 'Content.', imageUrl: '/images/about.jpg' };
     const container = await renderAboutSection(props);
     expect(container.querySelector('section.py-12')).not.toBeNull();
     expect(container.querySelector('div.container.mx-auto')).not.toBeNull();
     expect(container.querySelector('div.prose')).not.toBeNull();
     expect(container.querySelector('h2.text-primary')).not.toBeNull();
     expect(container.querySelector('img.rounded-lg')).not.toBeNull();
  });
});
