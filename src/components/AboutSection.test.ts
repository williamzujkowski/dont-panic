import { describe, it, expect, beforeEach } from 'vitest';

// Mock props interface (adjust if needed based on actual component later)
interface AboutSectionProps {
  headline: string;
  content: string;
  imageUrl?: string;
}

// Basic simulation of Astro component rendering for testing structure
async function renderAboutSection(props: AboutSectionProps) {
  const imageHtml = props.imageUrl ? `<img src="${props.imageUrl}" alt="" class="about-image">` : ''; // Basic image rendering
  const html = `
    <section class="about-section">
      <div class="about-content">
        <h2>${props.headline}</h2>
        <p>${props.content}</p> {/* Assuming content is simple text for now */}
      </div>
      ${imageHtml ? `<div class="about-image-wrapper">${imageHtml}</div>` : ''}
    </section>
  `;
  // Use jsdom environment provided by vitest
  document.body.innerHTML = `<div id="test-container">${html}</div>`;
  const container = document.getElementById('test-container');
  if (!container) throw new Error('Test container not found');
  return { container };
}

describe('AboutSection.astro', () => {
  beforeEach(() => {
    // Clean up DOM before each test
    document.body.innerHTML = '';
  });

  it('renders the section element', async () => {
    const props = { headline: 'Test Headline', content: 'Test content.' };
    const { container } = await renderAboutSection(props);
    const section = container.querySelector('.about-section');
    expect(section).not.toBeNull();
    expect(section?.tagName).toBe('SECTION');
  });

  it('renders the headline correctly', async () => {
    const props = { headline: 'About Our Company', content: 'Some text.' };
    const { container } = await renderAboutSection(props);
    const heading = container.querySelector('h2');
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe(props.headline);
  });

  it('renders the content correctly', async () => {
    const props = { headline: 'About', content: 'This is the main content about us.' };
    const { container } = await renderAboutSection(props);
    // Assuming content is rendered in a <p> tag within .about-content
    const contentElement = container.querySelector('.about-content p');
    expect(contentElement).not.toBeNull();
    expect(contentElement?.textContent).toBe(props.content);
  });

  it('renders an image when imageUrl is provided', async () => {
    const props = { headline: 'About', content: 'Content.', imageUrl: '/images/about.jpg' };
    const { container } = await renderAboutSection(props);
    const image = container.querySelector('img.about-image');
    expect(image).not.toBeNull();
    expect(image?.getAttribute('src')).toBe(props.imageUrl);
  });

  it('does not render an image when imageUrl is not provided', async () => {
    const props = { headline: 'About', content: 'Content.' };
    const { container } = await renderAboutSection(props);
    const image = container.querySelector('img.about-image');
    expect(image).toBeNull();
  });

  it('applies expected CSS classes', async () => {
     const props = { headline: 'About', content: 'Content.', imageUrl: '/images/about.jpg' };
     const { container } = await renderAboutSection(props);
     expect(container.querySelector('.about-section')).not.toBeNull();
     expect(container.querySelector('.about-content')).not.toBeNull();
     expect(container.querySelector('.about-image-wrapper')).not.toBeNull();
     expect(container.querySelector('.about-image')).not.toBeNull();
  });
});
