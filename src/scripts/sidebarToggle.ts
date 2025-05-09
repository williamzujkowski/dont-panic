
/**
 * Initializes the sidebar toggle functionality for both mobile (off-canvas)
 * and desktop (show/hide) layouts.
 */
export function initializeSidebarToggle() {
  // DOM References
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn'); // Button in Header
  const filterSidebarWrapper = document.getElementById('filterSidebarWrapper'); // Sidebar element in index.astro
  const closeSidebarBtn = document.getElementById('closeSidebarBtn'); // Close button inside sidebar
  const existingOverlay = document.getElementById('sidebarOverlay'); // Overlay element in index.astro
  const mainContent = document.querySelector('main.flex-1'); // Main content area in index.astro

  let overlay = existingOverlay;

  // Create overlay if it doesn't exist yet (should be in index.astro, but defensive)
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sidebarOverlay';
    overlay.className = 'fixed inset-0 bg-black/50 z-40 hidden md:hidden opacity-0 transition-opacity duration-300 ease-out';
    document.body.appendChild(overlay);
  }

  // Enhanced toggle sidebar function that handles both desktop and mobile
  function toggleSidebar() {
    if (!filterSidebarWrapper || !overlay || !mainContent) return; // Ensure elements exist

    if (window.innerWidth < 768) {
      // Mobile behavior: off-canvas sidebar
      const isHidden = filterSidebarWrapper.classList.contains('hidden') ||
                       filterSidebarWrapper.classList.contains('-translate-x-full');

      if (isHidden) {
        // Show sidebar
        filterSidebarWrapper.classList.remove('hidden');

        // First show the overlay with opacity 0
        overlay.classList.remove('hidden');

        // Force a reflow to ensure transition starts from opacity 0
        void overlay.offsetWidth;

        // Animate the opacity
        overlay.classList.add('opacity-100');

        // Prepare sidebar
        filterSidebarWrapper.classList.add('fixed', 'inset-y-0', 'left-0', 'z-50', 'bg-surface', 'w-[280px]', 'max-w-[90vw]', 'shadow-lg', 'overflow-y-auto');
        filterSidebarWrapper.classList.remove('-translate-x-full');
        document.body.classList.add('overflow-hidden'); // Prevent scrolling body

        // Update mobile filter button if exists (in Header)
        if (sidebarToggleBtn) {
          sidebarToggleBtn.setAttribute('aria-expanded', 'true');
          // Add active styling to the button in the header
          sidebarToggleBtn.classList.add('bg-primary/10', 'text-primary', 'border-primary/30');
        }

      } else {
        // Hide sidebar
        // Animate out
        overlay.classList.remove('opacity-100');
        filterSidebarWrapper.classList.add('-translate-x-full');

        // Wait for animations to complete before hiding
        setTimeout(() => {
          filterSidebarWrapper.classList.add('hidden');
          overlay.classList.add('hidden');
          document.body.classList.remove('overflow-hidden'); // Re-enable scrolling

          // Reset sidebar position classes
          filterSidebarWrapper.classList.remove('fixed', 'inset-y-0', 'left-0', 'z-50', '-translate-x-full');
        }, 300); // Match the duration in the CSS transition

        // Update mobile filter button if exists (in Header)
        if (sidebarToggleBtn) {
          sidebarToggleBtn.setAttribute('aria-expanded', 'false');
           // Remove active styling from the button in the header
          sidebarToggleBtn.classList.remove('bg-primary/10', 'text-primary', 'border-primary/30');
        }
      }
    } else {
      // Desktop behavior: toggle sidebar visibility
      // Simply show/hide the sidebar element
      filterSidebarWrapper.classList.toggle('hidden');

      // Update display in main content area
      if (filterSidebarWrapper.classList.contains('hidden')) {
        // Sidebar is now hidden, expand main content
        mainContent.classList.remove('md:ml-80');
        mainContent.classList.add('expanded'); // Add expanded class for potential CSS transitions
        // Update toggle button state
        if (sidebarToggleBtn) {
           sidebarToggleBtn.setAttribute('aria-expanded', 'false');
           sidebarToggleBtn.classList.remove('bg-primary/10', 'text-primary', 'border-primary/30');
        }
      } else {
        // Sidebar is now visible, make space for it
        mainContent.classList.add('md:ml-80');
        mainContent.classList.remove('expanded');
         // Update toggle button state
        if (sidebarToggleBtn) {
           sidebarToggleBtn.setAttribute('aria-expanded', 'true');
           sidebarToggleBtn.classList.add('bg-primary/10', 'text-primary', 'border-primary/30');
        }
      }
    }
  }

  // Attach event listeners for sidebar toggle
  document.addEventListener('DOMContentLoaded', () => {
     // Initial state based on screen size
    if (window.innerWidth >= 768) {
      // On desktop, show sidebar by default
      if (filterSidebarWrapper) filterSidebarWrapper.classList.remove('hidden');
      if (mainContent) mainContent.classList.add('md:ml-80');
      if (sidebarToggleBtn) {
        sidebarToggleBtn.setAttribute('aria-expanded', 'true');
        sidebarToggleBtn.classList.add('bg-primary/10', 'text-primary', 'border-primary/30');
      }
    } else {
      // On mobile, hide sidebar by default
      if (filterSidebarWrapper) filterSidebarWrapper.classList.add('hidden');
      if (sidebarToggleBtn) {
        sidebarToggleBtn.setAttribute('aria-expanded', 'false');
        sidebarToggleBtn.classList.remove('bg-primary/10', 'text-primary', 'border-primary/30');
      }
    }


    if (sidebarToggleBtn) {
      sidebarToggleBtn.addEventListener('click', toggleSidebar);
    }

    if (closeSidebarBtn) {
      closeSidebarBtn.addEventListener('click', toggleSidebar);
    }

    if (overlay) {
      overlay.addEventListener('click', toggleSidebar);
    }

    // Handle resize events
    window.addEventListener('resize', () => {
      // Debounce or throttle resize handling if needed for performance
      // For now, simple resize handling:
      if (window.innerWidth >= 768) {
        // On desktop - ensure visible and correctly positioned
        if (filterSidebarWrapper) {
           filterSidebarWrapper.classList.remove('fixed', 'inset-y-0', 'left-0', 'z-50', '-translate-x-full', 'transform', 'hidden');
           filterSidebarWrapper.style.transform = ''; // Clear any inline transform
           filterSidebarWrapper.classList.add('md:block'); // Ensure it's block on desktop
        }
        if (overlay) overlay.classList.add('hidden', 'opacity-0'); // Hide overlay on desktop
        document.body.classList.remove('overflow-hidden'); // Allow scrolling

        // Adjust main content margin
        if (mainContent) {
           if (!filterSidebarWrapper || !filterSidebarWrapper.classList.contains('hidden')) {
              mainContent.classList.add('md:ml-80');
              mainContent.classList.remove('expanded');
           } else {
              mainContent.classList.remove('md:ml-80');
              mainContent.classList.add('expanded');
           }
        }
         // Ensure header button state is correct on desktop resize
         if (sidebarToggleBtn) {
            if (!filterSidebarWrapper || filterSidebarWrapper.classList.contains('hidden')) {
               sidebarToggleBtn.setAttribute('aria-expanded', 'false');
               sidebarToggleBtn.classList.remove('bg-primary/10', 'text-primary', 'border-primary/30');
            } else {
               sidebarToggleBtn.setAttribute('aria-expanded', 'true');
               sidebarToggleBtn.classList.add('bg-primary/10', 'text-primary', 'border-primary/30');
            }
         }


      } else {
        // On mobile - ensure hidden by default unless explicitly open
        if (filterSidebarWrapper && !document.body.classList.contains('overflow-hidden')) {
           // If not currently open (overflow-hidden means it's open on mobile)
           filterSidebarWrapper.classList.add('hidden', '-translate-x-full', 'transform');
           filterSidebarWrapper.classList.remove('md:block');
        }
         if (overlay && !document.body.classList.contains('overflow-hidden')) {
            overlay.classList.add('hidden', 'opacity-0');
         }
         // Ensure main content margin is reset on mobile
         if (mainContent) {
            mainContent.classList.remove('md:ml-80', 'expanded');
         }
         // Ensure header button state is correct on mobile resize
         if (sidebarToggleBtn) {
            if (!filterSidebarWrapper || filterSidebarWrapper.classList.contains('hidden') || filterSidebarWrapper.classList.contains('-translate-x-full')) {
               sidebarToggleBtn.setAttribute('aria-expanded', 'false');
               sidebarToggleBtn.classList.remove('bg-primary/10', 'text-primary', 'border-primary/30');
            } else {
               sidebarToggleBtn.setAttribute('aria-expanded', 'true');
               sidebarToggleBtn.classList.add('bg-primary/10', 'text-primary', 'border-primary/30');
            }
         }
      }
    });

     // Listen for close request from sidebar component (dispatched by the script)
     document.addEventListener('closeSidebarRequest', toggleSidebar as EventListener); // Cast to EventListener
  });
}

// Call the initialization function
initializeSidebarToggle();
````

Finally, update `src/components/Header.astro` to remove the old script block and import/initialize the new `sidebarToggle.ts` script:

src/components/Header.astro
````astro
<<<<<<< SEARCH
</header>

<script>
  // Handle mobile menu toggle
  document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');

        // Change icon based on menu state
        const isOpen = !mobileMenu.classList.contains('hidden');

        if (isOpen) {
          mobileMenuBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          `;
        } else {
          mobileMenuBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          `;
        }
      });
    }

    // Wire up sidebar toggle button for mobile
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const filterSidebarWrapper = document.getElementById('filterSidebarWrapper');

    if (sidebarToggleBtn && filterSidebarWrapper) {
      sidebarToggleBtn.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('toggleSidebar'));
      });
    }
  });
</script>
````
