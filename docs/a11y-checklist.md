# Accessibility Testing Checklist for Don't Panic

This checklist provides a structured approach for manual accessibility testing of the Don't Panic website. Use it alongside automated testing tools like axe-core to ensure comprehensive coverage.

## Keyboard Navigation

- [ ] All interactive elements are focusable with keyboard
- [ ] Tab order is logical and follows the visual layout
- [ ] Skip-to-content link works correctly
- [ ] Focus indicators are clearly visible
- [ ] No keyboard traps exist
- [ ] All dropdowns and menus are accessible via keyboard
- [ ] Modal dialogs trap focus appropriately when open

## Screen Reader Support

- [ ] All images have appropriate alt text
- [ ] Complex images have detailed descriptions
- [ ] Form controls have proper labels
- [ ] ARIA landmarks are used correctly
- [ ] Heading structure is logical (h1 → h2 → h3)
- [ ] Tables have proper headers and structure
- [ ] Custom components have appropriate ARIA roles and properties
- [ ] Dynamic content changes are announced

## Color and Contrast

- [ ] Text has sufficient contrast against its background (4.5:1 for normal text, 3:1 for large text)
- [ ] UI controls have sufficient contrast
- [ ] Information is not conveyed by color alone
- [ ] Links are visually distinct from surrounding text
- [ ] Focus indicators have sufficient contrast

## Text and Typography

- [ ] Text can be resized to 200% without loss of content or functionality
- [ ] Line spacing is at least 1.5 times the font size
- [ ] Paragraph spacing is at least 2 times the font size
- [ ] Letter spacing is at least 0.12 times the font size
- [ ] Word spacing is at least 0.16 times the font size

## Responsive Design

- [ ] Content reflows correctly at 320px width
- [ ] Content is usable at 400% zoom
- [ ] Touch targets are at least 44px × 44px
- [ ] Spacing between touch targets is adequate

## Multimedia

- [ ] Pre-recorded audio has captions or transcripts
- [ ] Pre-recorded video has captions
- [ ] Auto-playing content can be paused, stopped, or hidden
- [ ] No content flashes more than 3 times per second

## User Preferences

- [ ] Site respects reduced motion preferences
- [ ] Site respects contrast preferences
- [ ] Site works with forced colors mode
- [ ] Site works with high contrast mode

## Page Structure

- [ ] Each page has a unique, descriptive title
- [ ] Main content is wrapped in a `<main>` element
- [ ] Navigation is wrapped in a `<nav>` element
- [ ] Complementary content is wrapped in an `<aside>` element
- [ ] Footer is wrapped in a `<footer>` element

## VulnerabilityTable Component

- [ ] Table headers are properly marked up with `<th>` elements
- [ ] Sort controls are accessible and have clear state indicators
- [ ] Filter controls have proper labels and instructions
- [ ] Table pagination controls are keyboard accessible
- [ ] Screen readers announce row and column information correctly

## Testing Tools

### Automated Testing
- [ ] Run axe-core tests on all pages
- [ ] Validate HTML using W3C Validator
- [ ] Run Lighthouse accessibility audit

### Browser Extensions
- [ ] axe DevTools (Chrome, Firefox)
- [ ] WAVE Evaluation Tool (Chrome, Firefox)
- [ ] Accessibility Insights (Chrome)

### Screen Readers
- [ ] Test with NVDA on Windows
- [ ] Test with VoiceOver on macOS
- [ ] Test with TalkBack on Android (for responsive views)

## Testing Process

1. Run automated tests to identify potential issues
2. Perform manual testing using this checklist
3. Test with at least one screen reader
4. Document and prioritize issues found
5. Fix issues and retest

## Resources

- [WebAIM WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Inclusive Components](https://inclusive-components.design/)
- [The A11Y Project Checklist](https://www.a11yproject.com/checklist/)