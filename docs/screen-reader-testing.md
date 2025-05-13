# Screen Reader Testing Guide for Don't Panic

This document outlines a comprehensive approach to testing the Don't Panic website with screen readers to ensure compatibility with assistive technology.

## Recommended Screen Readers for Testing

- **NVDA** (Windows) - Free, open-source screen reader
- **JAWS** (Windows) - Commercial screen reader, widely used
- **VoiceOver** (macOS/iOS) - Built into Apple devices
- **TalkBack** (Android) - Built into Android devices
- **Orca** (Linux) - Open-source screen reader for Linux

## Testing Checklist

### 1. Navigation and Page Structure

- [ ] Test the skip-to-content link functionality
  - Tab to it from the start of the page
  - Activate it and verify it moves focus to the main content
- [ ] Verify all pages have proper heading structure (h1, h2, etc.)
  - Use screen reader heading navigation commands
  - Ensure heading levels are used logically
- [ ] Test keyboard navigation through all interactive elements
  - All interactive elements should be reachable by keyboard
  - Focus order should be logical and follow visual order
- [ ] Verify ARIA landmarks are correctly implemented
  - header, nav, main, footer, etc.
  - Use screen reader landmark navigation commands

### 2. Content and Components

- [ ] Test VulnerabilityTable component
  - Table should be announced properly as a table
  - Column headers should be announced
  - Screen reader should read row and column information
- [ ] Test FilterSidebar functionality
  - All filters should be operable via keyboard
  - Screen reader should announce filter status changes
- [ ] Test all buttons, links, and form controls
  - Each should have accessible names
  - States (pressed, expanded, etc.) should be announced
- [ ] Test expandable/collapsible content
  - Expanded/collapsed state should be announced
  - Screen reader should announce when state changes

### 3. Specific Pages

- [ ] Home page
  - Verify navigation and filtering capabilities
  - Test table view sorting and filtering
- [ ] Report detail page
  - Test navigation through report content
  - Verify heading structure and readability
- [ ] About page
  - Test navigation and readability
  
### 4. Testing Tools & Commands

#### NVDA (Windows)
- Navigate by headings: H
- Navigate by landmarks: D
- Navigate by tables: T
- List all elements: NVDA+F7

#### VoiceOver (macOS)
- Navigate by headings: VO+Command+H
- Navigate by landmarks: VO+Command+L
- Navigate by tables: VO+Command+T
- Web rotor: VO+U

## Testing Process

1. Open the website in a supported browser
2. Enable the screen reader
3. Navigate through the site using only keyboard controls
4. Test each item in the checklist
5. Document any issues found
6. Fix issues and retest

## Common Issues to Watch For

- Missing alternative text for images
- Improper heading structure
- Unlabeled form controls
- Inaccessible custom components
- Keyboard traps
- Missing focus indicators
- Lack of ARIA attributes for dynamic content
- Insufficient color contrast

## Recommendations for Fixes

- Always provide alt text for images
- Maintain logical heading hierarchy (h1 → h2 → h3)
- Label all form controls explicitly
- Implement keyboard navigation for all interactive elements
- Use ARIA attributes appropriately for dynamic content
- Ensure sufficient color contrast
- Provide visible focus indicators
- Test regularly with screen readers

## Resources

- [WebAIM Screen Reader Survey](https://webaim.org/projects/screenreadersurvey9/)
- [NVDA Documentation](https://www.nvaccess.org/files/nvda/documentation/userGuide.html)
- [VoiceOver User Guide](https://support.apple.com/guide/voiceover/welcome/mac)
- [W3C ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)