/**
 * This script adds a testing overlay to help with screen reader testing.
 * It displays key information about the focused element and helps debug
 * accessibility issues.
 * 
 * Usage:
 * 1. Run the site with npm run dev
 * 2. Open browser console and paste this script
 * 3. Press Tab to navigate and see accessibility info
 */

(function() {
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = 'a11y-test-overlay';
  overlay.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    width: 300px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
    border-top-right-radius: 5px;
    max-height: 300px;
    overflow: auto;
  `;
  document.body.appendChild(overlay);

  // Track focused element
  let currentFocusedElement = null;

  // Update overlay content
  function updateOverlay(element) {
    if (!element) return;
    
    // Get element properties
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `id="${element.id}"` : '';
    const classes = element.className ? `class="${element.className}"` : '';
    
    // Get accessibility properties
    const role = element.getAttribute('role') || 'none';
    const ariaLabel = element.getAttribute('aria-label') || 'none';
    const ariaLabelledBy = element.getAttribute('aria-labelledby') || 'none';
    const ariaDescribedBy = element.getAttribute('aria-describedby') || 'none';
    
    // Check for accessible name
    let accessibleName = 'No accessible name!';
    if (element.textContent.trim()) {
      accessibleName = element.textContent.trim().substring(0, 30) + 
                      (element.textContent.trim().length > 30 ? '...' : '');
    } else if (ariaLabel !== 'none') {
      accessibleName = ariaLabel;
    } else if (element.getAttribute('alt')) {
      accessibleName = element.getAttribute('alt');
    } else if (element.getAttribute('title')) {
      accessibleName = element.getAttribute('title');
    }
    
    // Check for common issues
    const issues = [];
    if (tagName === 'img' && !element.getAttribute('alt')) {
      issues.push('⚠️ Image missing alt text');
    }
    if ((tagName === 'a' || tagName === 'button') && !accessibleName) {
      issues.push('⚠️ Interactive element missing accessible name');
    }
    if (element.tabIndex > 0) {
      issues.push('⚠️ Positive tabindex (avoid using tabindex > 0)');
    }
    
    // Update overlay content
    overlay.innerHTML = `
      <h3 style="margin: 0 0 5px; font-size: 14px; border-bottom: 1px solid #555;">Screen Reader Test</h3>
      <div><strong>Element:</strong> &lt;${tagName} ${id} ${classes}&gt;</div>
      <div><strong>Accessible Name:</strong> ${accessibleName}</div>
      <div><strong>Role:</strong> ${role}</div>
      <div><strong>aria-label:</strong> ${ariaLabel}</div>
      <div><strong>aria-labelledby:</strong> ${ariaLabelledBy}</div>
      <div><strong>aria-describedby:</strong> ${ariaDescribedBy}</div>
      ${issues.length ? `<div style="margin-top: 10px; color: #ff6b6b;"><strong>Issues:</strong><ul style="margin: 5px 0 0 20px; padding: 0;">
        ${issues.map(issue => `<li>${issue}</li>`).join('')}
      </ul></div>` : ''}
      <div style="margin-top: 10px; font-size: 10px; color: #aaa;">Tab through the page to inspect elements</div>
    `;
  }

  // Listen for focus changes
  document.addEventListener('focusin', function(e) {
    currentFocusedElement = e.target;
    updateOverlay(currentFocusedElement);
  });

  // Initial check
  if (document.activeElement) {
    updateOverlay(document.activeElement);
  }

  console.log('Screen reader testing overlay activated');
})();