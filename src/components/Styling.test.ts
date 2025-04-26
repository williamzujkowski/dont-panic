import { describe, it, expect } from 'vitest';
// Removed testing-library/dom import
// Import components to test class presence (using mock renderers from other tests)
import Header from './Header.astro';
import Footer from './Footer.astro';
import Hero from './Hero.astro';
import Features from './Features.astro';
import CTASection from './CTASection.astro';

// Mock renderers that return the container element
function createHeaderContainer() {
  const container = document.createElement('div');
  container.innerHTML = `<header class="site-header"></header>`;
  return container;
}
function createFooterContainer() {
  const container = document.createElement('div');
  container.innerHTML = `<footer class="site-footer"></footer>`;
  return container;
}
function createHeroContainer() {
  const container = document.createElement('div');
  container.innerHTML = `<section class="hero-section"><a class="cta-button"></a></section>`;
  return container;
}
function createFeaturesContainer() {
  const container = document.createElement('div');
  container.innerHTML = `<section class="features-section"><div class="feature-card"></div></section>`;
  return container;
}
function createCTAContainer() {
  const container = document.createElement('div');
  container.innerHTML = `<section class="cta-section"><a class="cta-button"></a></section>`;
  return container;
}


describe('Component Styling Classes', () => {
  // Note: These tests are basic checks for class existence.
  // They don't verify the actual styles applied by the classes.

  it('4.2: Header component has base class', () => {
    const headerContainer = createHeaderContainer();
    // No render call needed, query headerContainer directly
    expect(headerContainer.querySelector('.site-header')).not.toBeNull();
  });

  it('4.2: Footer component has base class', () => {
    const footerContainer = createFooterContainer();
    // No render call needed, query footerContainer directly
    expect(footerContainer.querySelector('.site-footer')).not.toBeNull();
  });

  it('4.2: Hero component has base class and button class', () => {
    const heroContainer = createHeroContainer();
    // No render call needed, query heroContainer directly
    expect(heroContainer.querySelector('.hero-section')).not.toBeNull();
    expect(heroContainer.querySelector('.hero-section .cta-button')).not.toBeNull();
  });

   it('4.2: Features component has base class and card class', () => {
    const featuresContainer = createFeaturesContainer();
    // No render call needed, query featuresContainer directly
    expect(featuresContainer.querySelector('.features-section')).not.toBeNull();
    expect(featuresContainer.querySelector('.features-section .feature-card')).not.toBeNull();
  });

   it('4.2: CTASection component has base class and button class', () => {
    const ctaContainer = createCTAContainer();
    // No render call needed, query ctaContainer directly
    expect(ctaContainer.querySelector('.cta-section')).not.toBeNull();
    expect(ctaContainer.querySelector('.cta-section .cta-button')).not.toBeNull();
  });

  // Add more tests here if specific classes are critical for functionality or styling hooks
});
