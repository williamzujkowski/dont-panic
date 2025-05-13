# Performance Optimization Guide for Don't Panic

This document outlines the performance optimization strategy for the Don't Panic website, based on Lighthouse audit findings and web performance best practices.

## Performance Goals

- **Lighthouse Performance Score:** 90+ on both mobile and desktop
- **Core Web Vitals:**
  - Largest Contentful Paint (LCP): < 2.5s
  - First Input Delay (FID): < 100ms
  - Cumulative Layout Shift (CLS): < 0.1
- **Time to Interactive (TTI):** < 3.8s
- **First Contentful Paint (FCP):** < 1.8s

## Current Optimizations

Don't Panic already implements several performance optimizations by leveraging Astro's features:

1. **Static Site Generation:** All pages are pre-rendered at build time
2. **Zero JavaScript by Default:** Only adding JS where needed (Island Architecture)
3. **Efficient Styling with Tailwind:** Minimal CSS footprint
4. **Responsive Images:** Appropriate sizing and formats
5. **Efficient Asset Loading:** Proper resource hints and lazy loading

## Further Optimization Opportunities

Based on Lighthouse audits, these areas can be further optimized:

### 1. Render-Blocking Resources

- Move non-critical CSS to separate files with async loading
- Inline critical CSS for above-the-fold content
- Defer non-essential JavaScript

```html
<!-- Example of deferring non-critical CSS -->
<link rel="preload" href="/styles/non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/styles/non-critical.css"></noscript>
```

### 2. Image Optimization

- Further optimize image formats (WebP, AVIF)
- Implement responsive images with `srcset` and `sizes`
- Use appropriate dimensions for images
- Apply lazy loading for below-the-fold images

```html
<!-- Example of responsive images with WebP -->
<picture>
  <source srcset="/images/report-cover.webp" type="image/webp">
  <source srcset="/images/report-cover.jpg" type="image/jpeg">
  <img src="/images/report-cover.jpg" alt="Report cover" width="800" height="600" loading="lazy">
</picture>
```

### 3. Font Loading Strategy

- Use `font-display: swap` for text visibility during font loading
- Preload critical fonts
- Consider using system fonts or variable fonts for better performance

```css
/* Example of optimized font loading */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-v12-latin-regular.woff2') format('woff2');
}
```

### 4. JavaScript Optimization

- Tree-shake unused JavaScript
- Split code into smaller chunks
- Minimize third-party JavaScript usage
- Defer non-critical scripts

```html
<!-- Example of deferring JavaScript -->
<script type="module" src="/scripts/features.js" defer></script>
```

### 5. Caching Strategy

- Implement proper cache headers
- Use hashed filenames for cache busting
- Leverage service workers for offline capabilities

```
# Example of cache headers in .htaccess
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## Astro-Specific Optimizations

1. **Island De-optimization:** Review client-side islands to ensure only necessary components are hydrated
2. **Content Collections Optimization:** Use pagination for large report collections
3. **Astro Assets Integration:** Use built-in image optimization where appropriate

```astro
---
// Example of using Astro's built-in image optimization
import { Image } from 'astro:assets';
import reportCover from '../assets/report-cover.jpg';
---

<Image src={reportCover} alt="Report cover" width={800} height={600} />
```

## Performance Testing and Monitoring

### Automated Testing

- Use the Lighthouse audit script `scripts/lighthouse-audit.js` to regularly test performance
- Configure GitHub Actions to run lighthouse checks on PRs
- Set performance budgets to prevent regressions

### Manual Testing

- Test with slow network connections and CPU throttling
- Test on actual devices, especially mid-range mobile phones
- Monitor real user metrics with tools like Google Analytics 4

## Implementing the Performance Improvements

1. **Audit:** Run Lighthouse audits to identify specific issues
2. **Prioritize:** Focus on improvements with the highest impact
3. **Implement:** Address issues one at a time
4. **Measure:** Re-run audits to verify improvements
5. **Iterate:** Continue until performance goals are met

## Resources

- [Astro Performance Guide](https://docs.astro.build/en/guides/performance/)
- [Web Vitals](https://web.dev/vitals/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/overview/)
- [CSS-Tricks: Front-End Performance Checklist](https://css-tricks.com/front-end-performance-checklist/)