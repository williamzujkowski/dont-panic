
/**
 * Initializes the reports table and card view functionality,
 * including sorting, filtering, URL state persistence, and view toggling.
 */
export function initializeReportsView() {
  // DOM References
  const table = document.getElementById('reportTable');
  const tableBody = document.getElementById('reportTableBody');
  const sortableHeaders = document.querySelectorAll('th[data-sort-key]');
  const activeFiltersContainer = document.getElementById('activeFilters');
  const activeFiltersList = document.getElementById('activeFiltersList');
  const tableViewBtn = document.getElementById('tableViewBtn');
  const cardViewBtn = document.getElementById('cardViewBtn');
  const tableView = document.querySelector('.overflow-x-auto'); // Table container
  const cardView = document.getElementById('cardView');
  const resultsCount = document.getElementById('resultsCount');
  const clearAllFiltersBtn = document.getElementById('clearAllFilters');
  const mobileFilterCount = document.getElementById('mobileFilterCount');
  // filterButtonText is likely in the Header, but referenced here for clarity if needed
  // const filterButtonText = document.getElementById('filterButtonText');

  // State
  let state = {
    sort: 'date', // Default sort column
    dir: 'desc',   // Default sort direction
    filters: {},    // Active filters from sidebar and search
    currentView: 'table' // Default view
  };

  // --- Initialization ---
  function initialize() {
    // Read URL params for initial state
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('sort')) state.sort = urlParams.get('sort') || 'date';
    if (urlParams.has('dir')) state.dir = urlParams.get('dir') || 'desc';
    if (urlParams.has('view')) state.currentView = urlParams.get('view') || 'table';

    // Read filter params from URL, including search
    state.filters = readFiltersFromURL(urlParams);

    // Add event listeners for sorting, filtering events, view toggle, and search
    setupEventListeners();

    // Apply initial state
    applyFiltering(); // Apply filters first to determine visible rows
    applySorting();   // Then sort the visible rows
    handleHighlighting(); // Apply highlighting after initial sort/filter
    updateActiveFiltersDisplay(); // Show initial active filters
    updateURL(); // Ensure URL reflects initial state (including filters from URL)
  }

  // --- URL State Management ---
  function updateURL() {
    const url = new URL(window.location.origin + window.location.pathname); // Use origin + pathname to avoid issues with existing params

    // Set sorting params
    url.searchParams.set('sort', state.sort);
    url.searchParams.set('dir', state.dir);

    // Set view param
    url.searchParams.set('view', state.currentView);

    // Set filter params if present
    if (state.filters) {
      if (state.filters.zeroDay) url.searchParams.set('zeroDay', 'true');
      if (state.filters.kev) url.searchParams.set('kev', 'true');
      if (state.filters.patchAvailable) url.searchParams.set('patchAvailable', 'true');
      if (state.filters.cvssMin > 0) url.searchParams.set('cvssMin', state.filters.cvssMin.toString());
      if (state.filters.epssMin > 0) url.searchParams.set('epssMin', state.filters.epssMin.toString());

      // Handle severity filters
      const severities = [];
      if (state.filters.severity?.critical) severities.push('Critical');
      if (state.filters.severity?.high) severities.push('High');
      if (state.filters.severity?.medium) severities.push('Medium');
      if (state.filters.severity?.low) severities.push('Low');
      if (severities.length > 0) url.searchParams.set('severity', severities.join(','));

      // Handle date range
      if (state.filters.dateRange?.start) url.searchParams.set('startDate', state.filters.dateRange.start);
      if (state.filters.dateRange?.end) url.searchParams.set('endDate', state.filters.dateRange.end);

      // Handle vendors and products (if multiple, join with commas)
      if (state.filters.vendors?.length > 0) url.searchParams.set('vendors', state.filters.vendors.join(','));
      if (state.filters.products?.length > 0) url.searchParams.set('products', state.filters.products.join(','));

      // Handle text search filter
      if (state.filters.textSearch) url.searchParams.set('search', state.filters.textSearch);
    }

    // Remove filter params if they are at their default/empty state
    if (!state.filters.zeroDay) url.searchParams.delete('zeroDay');
    if (!state.filters.kev) url.searchParams.delete('kev');
    if (!state.filters.patchAvailable) url.searchParams.delete('patchAvailable');
    if (state.filters.cvssMin === 0) url.searchParams.delete('cvssMin');
    if (state.filters.epssMin === 0) url.searchParams.delete('epssMin');
    if (severities.length === 0) url.searchParams.delete('severity');
    if (!state.filters.dateRange?.start) url.searchParams.delete('startDate');
    if (!state.filters.dateRange?.end) url.searchParams.delete('endDate');
    if (state.filters.vendors?.length === 0) url.searchParams.delete('vendors');
    if (state.filters.products?.length === 0) url.searchParams.delete('products');
    if (!state.filters.textSearch) url.searchParams.delete('search');


    history.pushState({}, '', url);
  }

  // Read filters from URL params on page load
  function readFiltersFromURL(urlParams: URLSearchParams) {
    const filters: any = { // Use 'any' for now, ideally define a FilterState interface
      kev: urlParams.get('kev') === 'true',
      zeroDay: urlParams.get('zeroDay') === 'true',
      patchAvailable: urlParams.get('patchAvailable') === 'true',
      cvssMin: parseFloat(urlParams.get('cvssMin') || '0') || 0,
      epssMin: parseFloat(urlParams.get('epssMin') || '0') || 0,
      severity: {
        critical: urlParams.get('severity')?.includes('Critical') || false,
        high: urlParams.get('severity')?.includes('High') || false,
        medium: urlParams.get('severity')?.includes('Medium') || false,
        low: urlParams.get('severity')?.includes('Low') || false,
      },
      dateRange: {
        start: urlParams.get('startDate') || '',
        end: urlParams.get('endDate') || '',
      },
      vendors: urlParams.get('vendors')?.split(',').filter(v => v) || [],
      products: urlParams.get('products')?.split(',').filter(p => p) || [],
      textSearch: urlParams.get('search') || '', // Read search term from URL
    };

    // Ensure severity object exists even if no severity param is set
    if (!filters.severity) {
       filters.severity = { critical: false, high: false, medium: false, low: false };
    }
     // Ensure dateRange object exists even if no date params are set
    if (!filters.dateRange) {
       filters.dateRange = { start: '', end: '' };
    }

    // Dispatch a custom event so the sidebar can update its UI based on URL filters
    document.dispatchEvent(new CustomEvent('urlFiltersLoaded', { detail: filters }));

    return filters;
  }


  // --- Event Listeners ---
  function setupEventListeners() {
    // Add event listeners for sorting
    sortableHeaders.forEach(header => {
      header.addEventListener('click', (e) => handleSortClick(e));
    });

    // Add event listener for sidebar filter changes (custom event)
    document.addEventListener('sidebarFiltersChanged', (e) => {
      // Merge sidebar filters with current text search filter
      state.filters = { ...state.filters, ...(e as CustomEvent).detail };
      applyFiltering();
      updateActiveFiltersDisplay();
      updateURL();
    });

    // Add event listener for filters cleared by the sidebar (Reset button)
    document.addEventListener('filtersCleared', (e) => {
       state.filters = (e as CustomEvent).detail; // Use the cleared state from the event
       // Also clear the search input value(s) when filters are cleared
       const searchInputs = document.querySelectorAll('input[type="search"][placeholder="Search CVEs..."]');
        searchInputs.forEach(input => {
            (input as HTMLInputElement).value = '';
        });
       applyFiltering();
       updateActiveFiltersDisplay();
       updateURL();
    });


    // Setup view toggle buttons
    setupViewToggle();

    // Setup search input listeners
    setupSearchInputListeners();

    // Add event listener for clear all filters button (in the main content area)
    if (clearAllFiltersBtn) {
      clearAllFiltersBtn.addEventListener('click', handleClearAllFilters);
    }
  }


  // --- Sorting ---
  function handleSortClick(e: Event) {
    const clickedKey = (e.currentTarget as HTMLElement).getAttribute('data-sort-key');

    if (!clickedKey) return;

    // If clicking the same column, toggle direction
    if (clickedKey === state.sort) {
      state.dir = state.dir === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, set as active sort and default to desc (except for title/summary)
      state.sort = clickedKey;
      state.dir = (clickedKey === 'title' || clickedKey === 'cve') ? 'asc' : 'desc'; // CVE and Title usually sorted ascending
    }

    applySorting();
    updateURL();
  }

  function applySorting() {
    if (!tableBody) return;

    // Clear sort indicators
    sortableHeaders.forEach(header => {
      const span = header.querySelector('span');
      if (span) span.textContent = '↕';
    });

    // Set active sort indicator
    const activeHeader = document.querySelector(`th[data-sort-key="${state.sort}"]`);
    if (activeHeader) {
      const span = activeHeader.querySelector('span');
      if (span) span.textContent = state.dir === 'asc' ? '↑' : '↓';
    }

    // Get rows as array for sorting (only visible rows if filtering is applied)
    const rows = Array.from(tableBody.querySelectorAll('tr:not([hidden])'));

    // Sort rows
    rows.sort((rowA, rowB) => {
      // Get cell or data attribute to sort by
      let valueA, valueB;

      // Prioritize data-value attribute for numeric/date sorting
      const cellA = rowA.querySelector(`td[data-value]`) || rowA.cells[getColumnIndex(state.sort)];
      const cellB = rowB.querySelector(`td[data-value]`) || rowB.cells[getColumnIndex(state.sort)];

      if (state.sort === 'zeroday') {
        valueA = rowA.getAttribute('data-zeroday') === 'true';
        valueB = rowB.getAttribute('data-zeroday') === 'true';
      } else if (state.sort === 'severity') {
         // Custom sorting for severity: Critical > High > Medium > Low > Other
         const severityOrder: { [key: string]: number } = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1, '-': 0 };
         valueA = severityOrder[rowA.getAttribute('data-severity') || '-'] ?? 0;
         valueB = severityOrder[rowB.getAttribute('data-severity') || '-'] ?? 0;
      }
      else if (cellA && cellB && cellA.hasAttribute('data-value') && cellB.hasAttribute('data-value')) {
        valueA = cellA.getAttribute('data-value');
        valueB = cellB.getAttribute('data-value');

        // Convert numeric values
        if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
          valueA = Number(valueA);
          valueB = Number(valueB);
        }
      } else if (cellA && cellB) {
        // Fallback to text content if no data-value
        valueA = cellA.textContent.trim().toLowerCase();
        valueB = cellB.textContent.trim().toLowerCase();
      } else {
          // Should not happen if getColumnIndex is correct, but handle defensively
          return 0;
      }


      // Compare
      if (valueA === valueB) return 0;

      const direction = state.dir === 'asc' ? 1 : -1;

      // Handle comparison for different types
      if (typeof valueA === 'number' && typeof valueB === 'number') {
          return valueA > valueB ? direction : -direction;
      } else if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
           return valueA === valueB ? 0 : (valueA ? direction : -direction); // true comes after false in asc
      }
      else {
          // Default string comparison
          return String(valueA) > String(valueB) ? direction : -direction;
      }
    });

    // Clear table body
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }

    // Add sorted rows
    rows.forEach(row => tableBody.appendChild(row));
  }

  // Utility: Get column index by sort key, accounting for responsive visibility
  function getColumnIndex(key: string): number {
    // This needs to match the actual column order in the HTML
    // and account for hidden columns based on screen size if necessary.
    // A more robust way would be to read the headers directly.
    // For now, based on the provided HTML structure:
    switch (key) {
      case 'cve': return 0;
      case 'title': return 1;
      case 'cvss': return 2;
      case 'epss': return 3;
      case 'severity': return 4;
      case 'zeroday': return 5;
      case 'date': return 6;
      default: return 0; // Default to CVE or first column
    }
  }


  // --- Filtering ---
  function applyFiltering() {
    if (!state.filters || !tableBody || !cardView || !resultsCount) return;

    // Get all items (rows and cards)
    const tableRows = tableBody.querySelectorAll('tr');
    const cardItems = cardView.querySelectorAll('div[data-cve]'); // Select the div wrapper

    let visibleCount = 0;

    // Helper function to determine if an item should be visible
    const shouldBeVisible = (item: HTMLElement): boolean => {
      let visible = true;

      // Apply Zero-Day filter
      if (visible && state.filters.zeroDay) {
        const isZeroDay = item.getAttribute('data-zeroday') === 'true';
        if (!isZeroDay) visible = false;
      }

      // Apply KEV filter
      if (visible && state.filters.kev) {
        const kev = item.getAttribute('data-kev') === 'true';
        if (!kev) visible = false;
      }

      // Apply Patch Available filter
      if (visible && state.filters.patchAvailable) {
        const patchAvailable = item.getAttribute('data-patch-available') === 'true';
        if (!patchAvailable) visible = false;
      }

      // Apply CVSS Min filter
      if (visible && state.filters.cvssMin > 0) {
        const cvssScore = parseFloat(item.getAttribute('data-cvss') || '0');
        if (cvssScore < state.filters.cvssMin) visible = false;
      }

      // Apply EPSS Min filter
      if (visible && state.filters.epssMin > 0) {
        const epssScore = parseFloat(item.getAttribute('data-epss') || '0');
        if (epssScore < state.filters.epssMin) visible = false;
      }

      // Apply Severity filters
      if (visible && state.filters.severity &&
          (state.filters.severity.critical ||
           state.filters.severity.high ||
           state.filters.severity.medium ||
           state.filters.severity.low)) {

        const itemSeverity = item.getAttribute('data-severity');

        if (itemSeverity) {
          const matchesSeverity =
            (itemSeverity === 'Critical' && state.filters.severity.critical) ||
            (itemSeverity === 'High' && state.filters.severity.high) ||
            (itemSeverity === 'Medium' && state.filters.severity.medium) ||
            (itemSeverity === 'Low' && state.filters.severity.low);

          if (!matchesSeverity) visible = false;
        } else {
            // If item has no severity data, hide it if any severity filter is active
            visible = false;
        }
      }

      // Apply Date Range filters
      if (visible && state.filters.dateRange) {
        const itemDateStr = item.getAttribute('data-date');

        if (itemDateStr) {
          // Convert YYYY-MM-DD to Date object for comparison
          const itemDate = new Date(itemDateStr + 'T00:00:00'); // Add time to ensure correct date parsing

          if (state.filters.dateRange.start) {
            const startDate = new Date(state.filters.dateRange.start + 'T00:00:00');
             // Compare dates ignoring time
            if (itemDate < startDate) {
              visible = false;
            }
          }

          if (state.filters.dateRange.end) {
            const endDate = new Date(state.filters.dateRange.end + 'T00:00:00');
             // Compare dates ignoring time
            if (itemDate > endDate) {
              visible = false;
            }
          }
        }
      }

      // Apply Vendor filters
      if (visible && state.filters.vendors && state.filters.vendors.length > 0) {
        const vendor = item.getAttribute('data-vendor');
        if (!vendor || !state.filters.vendors.includes(vendor)) {
          visible = false;
        }
      }

      // Apply Product filters
      if (visible && state.filters.products && state.filters.products.length > 0) {
        const product = item.getAttribute('data-product');
        if (!product || !state.filters.products.includes(product)) {
          visible = false;
        }
      }

      // Apply Text Search filter
      if (visible && state.filters.textSearch) {
          const searchTerm = state.filters.textSearch.toLowerCase();
          const cveId = item.getAttribute('data-cve')?.toLowerCase() || '';
          // Need to check text content of relevant cells/elements for search
          // For table rows: check CVE ID cell, Title cell
          // For card items: check CVE ID link, Title heading
          let textContent = '';
          if (item.tagName === 'TR') {
              const cveCell = item.querySelector('td:nth-child(1)');
              const titleCell = item.querySelector('td:nth-child(2)');
              if (cveCell) textContent += cveCell.textContent?.toLowerCase() + ' ';
              if (titleCell) textContent += titleCell.textContent?.toLowerCase();
          } else { // Assuming it's a card div
              const cveLink = item.querySelector('a');
              const titleHeading = item.querySelector('h3');
              if (cveLink) textContent += cveLink.textContent?.toLowerCase() + ' ';
              if (titleHeading) textContent += titleHeading.textContent?.toLowerCase();
          }


          if (!textContent.includes(searchTerm)) {
              visible = false;
          }
      }


      return visible;
    };

    // Apply to table rows
    tableRows.forEach(row => {
      const visible = shouldBeVisible(row);
      row.hidden = !visible;
      if (visible) visibleCount++;
    });

    // Apply to card items
    cardItems.forEach(card => {
      const visible = shouldBeVisible(card);
      card.hidden = !visible;
      // No need to increment visibleCount as we already counted in the table view
    });

    // Re-apply sorting to the filtered rows (only affects table view)
    applySorting();

    // Update count in UI
    if (resultsCount) {
      const currentViewText = state.currentView === 'table' ? 'table' : 'card';
      resultsCount.textContent = `Showing ${visibleCount} vulnerability reports in ${currentViewText} view`;
    }
  }

  // --- Search Input Handling ---
  function setupSearchInputListeners() {
      // Find the search inputs. astro-pagefind Search component renders an input with type="search".
      // We can target these inputs directly.
      const searchInputs = document.querySelectorAll('input[type="search"][placeholder="Search CVEs..."]');

      searchInputs.forEach(input => {
          input.addEventListener('input', (e) => {
              const searchTerm = (e.target as HTMLInputElement).value.trim();
              state.filters.textSearch = searchTerm;
              applyFiltering();
              updateActiveFiltersDisplay(); // Update active filters display to show search term
              updateURL();
          });
      });
  }


  // --- Active Filters Display ---
  function updateActiveFiltersDisplay() {
    if (!state.filters || !activeFiltersContainer || !activeFiltersList) return;

    // Clear current filters
    activeFiltersList.innerHTML = '';

    // Track if we have any active filters
    let hasActiveFilters = false;
    let filterCount = 0;

    // Helper to add a filter chip with custom styling based on type
    const addFilterChip = (label: string, type: string = 'default') => {
      hasActiveFilters = true;
      filterCount++;

      const chip = document.createElement('div');
      chip.setAttribute('data-filter-label', label); // Use a distinct attribute for the label
      chip.setAttribute('data-filter-type', type); // Store filter type for removal logic
      chip.classList.add('filter-chip', 'animate-fade-in');

      // Define color scheme based on filter type
      let chipClass, iconSvg;

      switch (type) {
        case 'zeroday':
          chipClass = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
          break;
        case 'kev':
          chipClass = 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>';
          break;
        case 'patch':
          chipClass = 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
          break;
        case 'severity':
          const severityColor: { [key: string]: string } = {
            'Critical': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50',
            'High': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50',
            'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50',
            'Low': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50'
          };
          chipClass = severityColor[label] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>';
          break;
        case 'score':
          chipClass = 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>';
          break;
        case 'date':
          chipClass = 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
          break;
        case 'vendor':
          chipClass = 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>';
          break;
        case 'product':
          chipClass = 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
          break;
        case 'search':
           chipClass = 'bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
           iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>';
           break;
        default:
          chipClass = 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>';
      }

      chip.className = `px-2 py-1 ${chipClass} border rounded-full text-xs flex items-center justify-between gap-1 filter-chip transform transition-all duration-200 ease-in-out hover:shadow-sm group`;
      chip.style.animationDelay = `${filterCount * 0.05}s`;

      // Create wrapper for label with icon
      const labelWrapper = document.createElement('div');
      labelWrapper.className = 'flex items-center pr-1';
      labelWrapper.innerHTML = `${iconSvg}<span>${label}</span>`;

      // Create remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'ml-1 text-xs opacity-50 hover:opacity-100 w-4 h-4 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors';
      removeBtn.setAttribute('data-filter-label', label); // Use the label for removal logic
      removeBtn.setAttribute('aria-label', `Remove ${label} filter`);
      removeBtn.innerHTML = '×';

      chip.appendChild(labelWrapper);
      chip.appendChild(removeBtn);
      activeFiltersList.appendChild(chip);
    };

    // Add chips for each active filter with appropriate styling
    if (state.filters.zeroDay) addFilterChip('Zero-Day', 'zeroday');
    if (state.filters.kev) addFilterChip('Known Exploited', 'kev');
    if (state.filters.patchAvailable) addFilterChip('Patch Available', 'patch');

    if (state.filters.cvssMin > 0) {
      const cvssValue = parseFloat(state.filters.cvssMin);
      let scoreType = 'score';
      if (cvssValue >= 9.0) scoreType = 'severity'; // Use severity styling for high scores
      addFilterChip(`CVSS ≥ ${state.filters.cvssMin}`, scoreType);
    }

    if (state.filters.epssMin > 0) {
      addFilterChip(`EPSS ≥ ${(state.filters.epssMin * 100).toFixed(0)}%`, 'score');
    }

    // Severity filters
    if (state.filters.severity) {
      if (state.filters.severity.critical) addFilterChip('Critical', 'severity');
      if (state.filters.severity.high) addFilterChip('High', 'severity');
      if (state.filters.severity.medium) addFilterChip('Medium', 'severity');
      if (state.filters.severity.low) addFilterChip('Low', 'severity');
    }

    // Date range
    if (state.filters.dateRange) {
      if (state.filters.dateRange.start) {
        const formattedDate = new Date(state.filters.dateRange.start + 'T00:00:00') // Add time to ensure correct date parsing
          .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        addFilterChip(`From: ${formattedDate}`, 'date');
      }
      if (state.filters.dateRange.end) {
        const formattedDate = new Date(state.filters.dateRange.end + 'T00:00:00') // Add time to ensure correct date parsing
          .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        addFilterChip(`To: ${formattedDate}`, 'date');
      }
    }

    // Vendors
    if (state.filters.vendors && state.filters.vendors.length > 0) {
      state.filters.vendors.forEach((vendor: string) => addFilterChip(`Vendor: ${vendor}`, 'vendor'));
    }

    // Products
    if (state.filters.products && state.filters.products.length > 0) {
      state.filters.products.forEach((product: string) => addFilterChip(`Product: ${product}`, 'product'));
    }

    // Text Search
    if (state.filters.textSearch) {
        addFilterChip(`Search: "${state.filters.textSearch}"`, 'search');
    }


    // Update filter counters (both in sidebar and mobile button)
    const activeFiltersCountSpan = document.getElementById('activeFiltersCount');
    if (activeFiltersCountSpan) {
      activeFiltersCountSpan.textContent = filterCount.toString();
    }

    // Update mobile filter button (assuming it exists and has an ID like 'mobileFilterToggleBtn')
    const mobileFilterToggleBtn = document.getElementById('mobileFilterToggleBtn');
    // filterButtonText is likely in the Header, not here
    // const filterButtonText = document.getElementById('filterButtonText');
    if (mobileFilterCount && mobileFilterToggleBtn) {
      if (filterCount > 0) {
        mobileFilterCount.textContent = filterCount.toString();
        mobileFilterCount.classList.remove('hidden');
        // Optionally update button text if needed, but filterButtonText is used for the label
      } else {
        mobileFilterCount.classList.add('hidden');
        // Optionally reset button text
      }
    }


    // Show/hide the container based on whether there are active filters
    if (activeFiltersContainer) {
        activeFiltersContainer.classList.toggle('hidden', !hasActiveFilters);
         // Add animation to container when shown
        if (hasActiveFilters) {
          activeFiltersContainer.classList.add('animate-fade-in');
          setTimeout(() => {
            activeFiltersContainer.classList.remove('animate-fade-in');
          }, 500);
        }
    }


    // Add click handlers to remove filter buttons
    document.querySelectorAll('#activeFiltersList button').forEach(button => {
      button.addEventListener('click', (e) => {
        const filterLabel = (e.currentTarget as HTMLElement).getAttribute('data-filter-label');
        const filterType = (e.currentTarget as HTMLElement).getAttribute('data-filter-type');
        if (!filterLabel || !filterType) return;

        // Animate chip removal
        const chip = (e.currentTarget as HTMLElement).closest('.filter-chip');
        if (chip) {
          chip.style.opacity = '0';
          chip.style.transform = 'translateX(10px)';
          chip.style.transition = 'opacity 0.2s, transform 0.2s';

          // After animation, remove filter
          setTimeout(() => {
            // Remove filter based on type and label
            switch (filterType) {
              case 'zeroday':
                state.filters.zeroDay = false;
                break;
              case 'kev':
                state.filters.kev = false;
                break;
              case 'patch':
                state.filters.patchAvailable = false;
                break;
              case 'score':
                 if (filterLabel.startsWith('CVSS ≥ ')) {
                   state.filters.cvssMin = 0;
                 } else if (filterLabel.startsWith('EPSS ≥ ')) {
                   state.filters.epssMin = 0;
                 }
                 break;
              case 'severity':
                const severityKey = filterLabel.toLowerCase();
                // Remove the specific severity filter
                if (state.filters.severity && state.filters.severity.hasOwnProperty(severityKey)) {
                    state.filters.severity[severityKey] = false;
                }
                break;
              case 'date':
                if (filterLabel.startsWith('From: ')) {
                  state.filters.dateRange.start = '';
                } else if (filterLabel.startsWith('To: ')) {
                  state.filters.dateRange.end = '';
                }
                break;
              case 'vendor':
                const vendorToRemove = filterLabel.replace('Vendor: ', '');
                state.filters.vendors = state.filters.vendors.filter((v: string) => v !== vendorToRemove);
                break;
              case 'product':
                const productToRemove = filterLabel.replace('Product: ', '');
                state.filters.products = state.filters.products.filter((p: string) => p !== productToRemove);
                break;
              case 'search':
                 state.filters.textSearch = '';
                 // Clear the search input value(s)
                 const searchInputs = document.querySelectorAll('input[type="search"][placeholder="Search CVEs..."]');
                 searchInputs.forEach(input => {
                     (input as HTMLInputElement).value = '';
                 });
                 break;
            }

            // Dispatch event to sidebar to update its UI
            document.dispatchEvent(new CustomEvent('filtersCleared', { detail: state.filters }));

            applyFiltering();
            updateActiveFiltersDisplay();
            updateURL();
          }, 200);
        }
      });
    });

    // Handle Clear All Filters button click
    function handleClearAllFilters() {
     if (!activeFiltersContainer || !activeFiltersList) return;

      // Animate all chips out
      const chips = activeFiltersList.querySelectorAll('.filter-chip');
      chips.forEach((chip, index) => {
        (chip as HTMLElement).style.opacity = '0';
        (chip as HTMLElement).style.transform = 'translateY(10px)';
        (chip as HTMLElement).style.transition = 'opacity 0.2s, transform 0.2s';
        (chip as HTMLElement).style.transitionDelay = `${index * 0.02}s`;
      });

      // After animation completes for all chips
      setTimeout(() => {
        // Reset all filter values
        state.filters = {
          kev: false,
          zeroDay: false,
          patchAvailable: false,
          cvssMin: 0,
          epssMin: 0,
          severity: {
            critical: false,
            high: false,
            medium: false,
            low: false
          },
          dateRange: {
            start: '',
            end: ''
          },
          vendors: [],
          products: [],
          textSearch: '' // Also clear text search
        };

        // Dispatch event to sidebar to update its UI
        document.dispatchEvent(new CustomEvent('filtersCleared', { detail: state.filters }));

        // Clear search input value(s)
        const searchInputs = document.querySelectorAll('input[type="search"][placeholder="Search CVEs..."]');
        searchInputs.forEach(input => {
            (input as HTMLInputElement).value = '';
        });


        // Apply changes
        applyFiltering();
        updateActiveFiltersDisplay();
        updateURL();

        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed bottom-4 right-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded shadow-md z-50 animate-scale-in';
        successMsg.innerHTML = '<span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>All filters cleared</span>';
        document.body.appendChild(successMsg);

        setTimeout(() => {
          successMsg.style.opacity = '0';
          successMsg.style.transform = 'translateY(10px)';
          successMsg.style.transition = 'opacity 0.3s, transform 0.3s';

          setTimeout(() => {
            document.body.removeChild(successMsg);
          }, 300);
        }, 2000);
      }, 300); // Match the animation duration
  }


  // --- Highlighting ---
  function handleHighlighting() {
    if (!tableBody || !cardView) return;

    // Get last visit time from localStorage
    const lastVisit = localStorage.getItem('lastVisitTimestamp');
    const now = Date.now();

    if (lastVisit) {
      const items = Array.from(tableBody.querySelectorAll('tr')).concat(Array.from(cardView.querySelectorAll('div[data-cve]')));

      items.forEach(item => {
        const dateStr = item.getAttribute('data-date');
        if (dateStr) {
          // Parse date string as UTC to avoid timezone issues
          const reportDate = new Date(dateStr + 'T00:00:00Z').getTime();
          // If report is newer than last visit, highlight it
          if (reportDate > Number(lastVisit)) {
            item.classList.add('new-report');
          }
        }
      });
    }

    // Update last visit timestamp
    localStorage.setItem('lastVisitTimestamp', now.toString());
  }


  // --- View Toggle ---
  function setupViewToggle() {
    if (!tableViewBtn || !cardViewBtn || !tableView || !cardView || !resultsCount) return;

    // Add animations via stylesheet if not already present
    if (!document.getElementById('view-animations-style')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'view-animations-style';
      styleSheet.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(10px); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes tableRowsAppear {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-fade-out {
          animation: fadeOut 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
        .table-rows-appear tr {
          opacity: 0;
          animation: tableRowsAppear 0.5s ease-out forwards;
        }
        .table-rows-appear tr:nth-child(1) { animation-delay: 0.05s; }
        .table-rows-appear tr:nth-child(2) { animation-delay: 0.1s; }
        .table-rows-appear tr:nth-child(3) { animation-delay: 0.15s; }
        .table-rows-appear tr:nth-child(4) { animation-delay: 0.2s; }
        .table-rows-appear tr:nth-child(5) { animation-delay: 0.25s; }
        .table-rows-appear tr:nth-child(6) { animation-delay: 0.3s; }
        .table-rows-appear tr:nth-child(7) { animation-delay: 0.35s; }
        .table-rows-appear tr:nth-child(8) { animation-delay: 0.4s; }
        .table-rows-appear tr:nth-child(9) { animation-delay: 0.45s; }
        .table-rows-appear tr:nth-child(10) { animation-delay: 0.5s; }
        .view-toggle-active {
          background-color: var(--color-primary-50, rgba(59, 130, 246, 0.1)) !important;
          color: var(--color-primary, #3b82f6) !important;
          font-weight: 500 !important;
          box-shadow: inset 0 0 0 1px var(--color-primary, #3b82f6) !important;
        }
        .view-toggle-active svg {
          stroke: var(--color-primary, #3b82f6) !important;
          stroke-width: 2.5px !important;
        }
      `;
      document.head.appendChild(styleSheet);
    }


    // Function to toggle active state with enhanced animations
    const setActiveView = (view: 'table' | 'card') => {
      state.currentView = view;

      // Update button states
      tableViewBtn.classList.toggle('view-toggle-active', view === 'table');
      cardViewBtn.classList.toggle('view-toggle-active', view === 'card');
      tableViewBtn.setAttribute('aria-current', view === 'table' ? 'true' : 'false');
      cardViewBtn.setAttribute('aria-current', view === 'card' ? 'true' : 'false');

      // Update button accessibility attributes
      tableViewBtn.setAttribute('aria-pressed', view === 'table' ? 'true' : 'false');
      cardViewBtn.setAttribute('aria-pressed', view === 'card' ? 'true' : 'false');

      // Add haptic feedback on mobile if available
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(5); // Subtle vibration on mobile for both view changes
        } catch (e) {
          // Ignore errors if vibration is not available
        }
      }

      // Update results count text based on view
      const currentText = resultsCount.textContent || '';
      const numberMatch = currentText.match(/\d+/);
      const number = numberMatch ? numberMatch[0] : '0';
      resultsCount.textContent = `Showing ${number} vulnerability reports in ${view === 'table' ? 'table' : 'card'} view`;


      // Show view transition message
      const viewChangeMsg = document.createElement('div');
      viewChangeMsg.className = 'fixed left-1/2 transform -translate-x-1/2 top-4 bg-primary/90 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-medium z-50 flex items-center animate-scale-in';
      viewChangeMsg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>Switched to ${view === 'table' ? 'table' : 'card'} view`;
      document.body.appendChild(viewChangeMsg);

      // Remove message after animation
      setTimeout(() => {
        viewChangeMsg.style.opacity = '0';
        viewChangeMsg.style.transform = 'translate(-50%, -20px)';
        viewChangeMsg.style.transition = 'opacity 0.3s, transform 0.3s';
        setTimeout(() => viewChangeMsg.remove(), 300);
      }, 1500);

      // Show/hide views with enhanced transition
      if (view === 'card') {
        // Animate out table view
        tableView.style.transition = 'opacity 0.2s ease-out';
        tableView.style.opacity = '0';

        // After fade out, swap views
        setTimeout(() => {
          tableView.classList.add('hidden');
          tableView.style.opacity = ''; // Reset opacity for next time
          tableView.style.transition = ''; // Reset transition

          // Show card view with staggered animation
          cardView.classList.remove('hidden');
          cardView.classList.add('grid', 'animate-fade-in');

          // Add staggered animation to card items
          const cards = cardView.querySelectorAll('div[data-cve]');
          cards.forEach((card, index) => {
            (card as HTMLElement).style.opacity = '0';
            (card as HTMLElement).style.transform = 'translateY(15px)';
            (card as HTMLElement).style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            (card as HTMLElement).style.transitionDelay = `${index * 0.05}s`;

            // Force reflow to apply initial styles
            void (card as HTMLElement).offsetWidth;

            // Animate in
            setTimeout(() => {
              (card as HTMLElement).style.opacity = '1';
              (card as HTMLElement).style.transform = 'translateY(0)';
            }, 50);
          });
        }, 200); // Match fadeOut duration
      } else { // view === 'table'
        // Animate out card view
        if (!cardView.classList.contains('hidden')) {
          cardView.style.transition = 'opacity 0.2s ease-out';
          cardView.style.opacity = '0';

          // After fade out, swap views
          setTimeout(() => {
            cardView.classList.add('hidden');
            cardView.classList.remove('grid', 'animate-fade-in');
            cardView.style.opacity = ''; // Reset opacity for next time
            cardView.style.transition = ''; // Reset transition

            // Show table view with animation
            tableView.classList.remove('hidden');
            tableView.style.opacity = '0';
            tableView.style.transition = 'opacity 0.3s ease-out';

            // Force reflow
            void tableView.offsetWidth;

            // Animate in table
            tableView.style.opacity = '1';

            // Add staggered row animation effect
            const tableBody = document.getElementById('reportTableBody');
            if (tableBody) {
              tableBody.classList.add('table-rows-appear');
              setTimeout(() => {
                tableBody.classList.remove('table-rows-appear');
              }, 1000); // Duration of tableRowsAppear animation
            }
          }, 200); // Match fadeOut duration
        } else {
           // If card view was already hidden, just ensure table view is visible
           tableView.classList.remove('hidden');
           cardView.classList.add('hidden');
        }
      }

      // Save preference to localStorage
      localStorage.setItem('preferredView', view);
      localStorage.setItem('viewToggleUsed', 'true'); // Mark that user has interacted
      updateURL(); // Update URL with the new view
    };

    // Handle click on table view button with animation
    tableViewBtn.addEventListener('click', () => {
      if (state.currentView !== 'table') {
        // Add click animation
        tableViewBtn.classList.add('animate-pulse');
        setTimeout(() => {
          tableViewBtn.classList.remove('animate-pulse');
          setActiveView('table');
        }, 150); // Duration of pulse animation
      }
    });

    // Handle click on card view button with animation
    cardViewBtn.addEventListener('click', () => {
      if (state.currentView !== 'card') {
        // Add click animation
        cardViewBtn.classList.add('animate-pulse');
        setTimeout(() => {
          cardViewBtn.classList.remove('animate-pulse');
          setActiveView('card');
        }, 150); // Duration of pulse animation
      }
    });

    // Check for saved preference or screen size default on initial load
    const savedView = localStorage.getItem('preferredView');
    const viewToggleUsed = localStorage.getItem('viewToggleUsed');

    if (savedView) {
      setActiveView(savedView as 'table' | 'card');
    } else {
      // Set default based on screen size if no preference is set
      if (window.innerWidth < 640) {
        // On small screens, default to card view
        setActiveView('card');
      } else {
        // On larger screens, default to table view
        setActiveView('table');
      }
    }

    // Listen for screen size changes to adjust view if needed (only if no user preference set)
    window.addEventListener('resize', () => {
      if (!viewToggleUsed) { // Only auto-switch if user hasn't manually toggled
        if (window.innerWidth < 640 && state.currentView === 'table') {
          setActiveView('card');
        } else if (window.innerWidth >= 1200 && state.currentView === 'card') { // Example breakpoint for switching back to table
          setActiveView('table');
        }
      }
       // Re-apply filtering/sorting in case column visibility changed
       applyFiltering();
       applySorting();
    });

     // Show a brief help tooltip on first visit if user hasn't used the toggle
      if (!viewToggleUsed) {
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute top-10 right-0 bg-white dark:bg-gray-800 border border-primary rounded shadow-lg p-2 text-xs max-w-[200px] z-10 animate-fade-in';
        tooltip.innerHTML = 'Try switching between views to find your preferred way to browse reports! <button class="mt-1 px-2 py-0.5 bg-primary/10 text-primary rounded hover:bg-primary/20 text-center w-full">Got it</button>';
        tooltip.style.zIndex = '100';

        // Append to parent container
        const viewToggleParent = tableViewBtn.closest('div')?.parentElement;
        if (viewToggleParent) {
          viewToggleParent.style.position = 'relative';
          viewToggleParent.appendChild(tooltip);

          // Remove tooltip on click
          tooltip.querySelector('button')?.addEventListener('click', () => {
            tooltip.classList.add('animate-fade-out');
            setTimeout(() => tooltip.remove(), 300);
            localStorage.setItem('viewToggleUsed', 'true');
          });

          // Auto-remove tooltip after 8 seconds
          setTimeout(() => {
            if (document.body.contains(tooltip)) {
              tooltip.classList.add('animate-fade-out');
              setTimeout(() => tooltip.remove(), 300);
            }
          }, 8000);
        }
      }
  }


  // --- Sidebar Toggle (Placeholder - actual logic is in sidebarToggle.ts) ---
  // This function is a placeholder. The actual sidebar toggle logic is
  // implemented in sidebarToggle.ts. The event listener for 'closeSidebarRequest'
  // is also handled by sidebarToggle.ts.
  function closeSidebar() {
     // Dispatch a custom event that sidebarToggle.ts listens to
     document.dispatchEvent(new CustomEvent('closeSidebarRequest'));
  }


  // --- Initialize on DOMContentLoaded ---
  document.addEventListener('DOMContentLoaded', initialize);

  // Expose functions if needed externally (e.g., for testing or other scripts)
  // window.applyFiltering = applyFiltering; // Example
}

// Call the initialization function
initializeReportsView();
````

Now, let's clean up `src/pages/index.astro` by removing the old script block and ensuring it correctly imports and calls `initializeReportsView`.

src/pages/index.astro
````astro
<<<<<<< SEARCH
</BaseLayout>

<script>
  // This code is replaced by the centralized toggle code in the main DOMContentLoaded handler
  // No duplicate listeners needed
</script>

<script>
  // DOM References
  const table = document.getElementById('reportTable');
  const tableBody = document.getElementById('reportTableBody');
  const sortableHeaders = document.querySelectorAll('th[data-sort-key]');
  const activeFiltersContainer = document.getElementById('activeFilters');
  const activeFiltersList = document.getElementById('activeFiltersList');

  // State
  let state = {
    sort: 'date', // Default sort column
    dir: 'desc',   // Default sort direction
    filters: {}    // Active filters from sidebar
  };

  // Initialization function
  function initialize() {
    // Read URL params for initial state
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('sort')) state.sort = urlParams.get('sort');
    if (urlParams.has('dir')) state.dir = urlParams.get('dir');

    // Add event listeners for sorting
    sortableHeaders.forEach(header => {
      header.addEventListener('click', (e) => handleSortClick(e));
    });

    // Add event listener for sidebar filter changes
    document.addEventListener('sidebarFiltersChanged', (e) => {
      state.filters = e.detail;
      applyFiltering();
      updateActiveFiltersDisplay();
      updateURL();
    });

    // Apply initial sort and highlighting
    applySorting();
    handleHighlighting();
  }

  // Update URL with current state
  function updateURL() {
    const url = new URL(window.location);

    // Clear existing params
    url.searchParams.delete('sort');
    url.searchParams.delete('dir');

    // Set sorting params
    url.searchParams.set('sort', state.sort);
    url.searchParams.set('dir', state.dir);

    // Set filter params if present
    if (state.filters) {
      // Add filter parameters based on state.filters object
      // This is simplified - you'll need to expand this based on your filter structure
      if (state.filters.zeroDay) url.searchParams.set('zeroDay', 'true');
      if (state.filters.kev) url.searchParams.set('kev', 'true');
      if (state.filters.patchAvailable) url.searchParams.set('patchAvailable', 'true');
      if (state.filters.cvssMin > 0) url.searchParams.set('cvssMin', state.filters.cvssMin.toString());
      if (state.filters.epssMin > 0) url.searchParams.set('epssMin', state.filters.epssMin.toString());

      // Handle severity filters
      const severities = [];
      if (state.filters.severity?.critical) severities.push('Critical');
      if (state.filters.severity?.high) severities.push('High');
      if (state.filters.severity?.medium) severities.push('Medium');
      if (state.filters.severity?.low) severities.push('Low');
      if (severities.length > 0) url.searchParams.set('severity', severities.join(','));

      // Handle date range
      if (state.filters.dateRange?.start) url.searchParams.set('startDate', state.filters.dateRange.start);
      if (state.filters.dateRange?.end) url.searchParams.set('endDate', state.filters.dateRange.end);

      // Handle vendors and products (if multiple, join with commas)
      if (state.filters.vendors?.length > 0) url.searchParams.set('vendors', state.filters.vendors.join(','));
      if (state.filters.products?.length > 0) url.searchParams.set('products', state.filters.products.join(','));
    }

    history.pushState({}, '', url);
  }

  // Sort click handler
  function handleSortClick(e) {
    const clickedKey = e.currentTarget.getAttribute('data-sort-key');

    // If clicking the same column, toggle direction
    if (clickedKey === state.sort) {
      state.dir = state.dir === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, set as active sort and default to desc (except for title/summary)
      state.sort = clickedKey;
      state.dir = clickedKey === 'title' ? 'asc' : 'desc';
    }

    applySorting();
    updateURL();
  }

  // Apply filtering based on sidebar filters
  function applyFiltering() {
    if (!state.filters) return 0;

    // Apply filters to both table and card view
    const tableRows = tableBody.querySelectorAll('tr');
    const cardItems = document.querySelectorAll('#cardView > div');
    let visibleCount = 0;

    // Helper function to determine if an item should be visible
    const shouldBeVisible = (item) => {
      let visible = true;

      // Apply Zero-Day filter
      if (visible && state.filters.zeroDay) {
        const isZeroDay = item.getAttribute('data-zeroday') === 'true';
        if (!isZeroDay) visible = false;
      }

      // Apply KEV filter
      if (visible && state.filters.kev) {
        const kev = item.getAttribute('data-kev') === 'true';
        if (!kev) visible = false;
      }

      // Apply Patch Available filter
      if (visible && state.filters.patchAvailable) {
        const patchAvailable = item.getAttribute('data-patch-available') === 'true';
        if (!patchAvailable) visible = false;
      }

      // Apply CVSS Min filter
      if (visible && state.filters.cvssMin > 0) {
        const cvssScore = parseFloat(item.getAttribute('data-cvss') || '0');
        if (cvssScore < state.filters.cvssMin) visible = false;
      }

      // Apply EPSS Min filter
      if (visible && state.filters.epssMin > 0) {
        const epssScore = parseFloat(item.getAttribute('data-epss') || '0');
        if (epssScore < state.filters.epssMin) visible = false;
      }

      // Apply Severity filters
      if (visible && state.filters.severity &&
          (state.filters.severity.critical ||
           state.filters.severity.high ||
           state.filters.severity.medium ||
           state.filters.severity.low)) {

        const itemSeverity = item.getAttribute('data-severity');

        if (itemSeverity) {
          const matchesSeverity =
            (itemSeverity === 'Critical' && state.filters.severity.critical) ||
            (itemSeverity === 'High' && state.filters.severity.high) ||
            (itemSeverity === 'Medium' && state.filters.severity.medium) ||
            (itemSeverity === 'Low' && state.filters.severity.low);

          if (!matchesSeverity) visible = false;
        }
      }

      // Apply Date Range filters
      if (visible && state.filters.dateRange) {
        const itemDate = item.getAttribute('data-date');

        if (itemDate) {
          if (state.filters.dateRange.start && itemDate < state.filters.dateRange.start) {
            visible = false;
          }

          if (state.filters.dateRange.end && itemDate > state.filters.dateRange.end) {
            visible = false;
          }
        }
      }

      // Apply Vendor filters
      if (visible && state.filters.vendors && state.filters.vendors.length > 0) {
        const vendor = item.getAttribute('data-vendor');
        if (!vendor || !state.filters.vendors.includes(vendor)) {
          visible = false;
        }
      }

      // Apply Product filters
      if (visible && state.filters.products && state.filters.products.length > 0) {
        const product = item.getAttribute('data-product');
        if (!product || !state.filters.products.includes(product)) {
          visible = false;
        }
      }

      return visible;
    };

    // Apply to table rows
    tableRows.forEach(row => {
      const visible = shouldBeVisible(row);
      row.hidden = !visible;
      if (visible) visibleCount++;
    });

    // Apply to card items
    cardItems.forEach(card => {
      const visible = shouldBeVisible(card);
      card.hidden = !visible;
      // No need to increment visibleCount as we already counted in the table view
    });

    // Re-apply sorting to the filtered rows
    applySorting();

    // Update count in UI
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
      resultsCount.textContent = `Showing ${visibleCount} vulnerability reports`;
    }
    return visibleCount; // Return visible count
  }

  // Enhanced active filters display with animations and improved styling
  function updateActiveFiltersDisplay() {
    if (!state.filters || !activeFiltersContainer || !activeFiltersList) return;

    // Clear current filters
    activeFiltersList.innerHTML = '';

    // Track if we have any active filters
    let hasActiveFilters = false;
    let filterCount = 0;

    // Helper to add a filter chip with custom styling based on type
    const addFilterChip = (label, type = 'default') => {
      hasActiveFilters = true;
      filterCount++;

      const chip = document.createElement('div');
      chip.setAttribute('data-filter', label);
      chip.classList.add('filter-chip', 'animate-fade-in');

      // Define color scheme based on filter type
      let chipClass, iconSvg;

      switch (type) {
        case 'zeroday':
          chipClass = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
          break;
        case 'kev':
          chipClass = 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>';
          break;
        case 'patch':
          chipClass = 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
          break;
        case 'severity':
          const severityColor = {
            'Critical': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50',
            'High': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50',
            'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 py-1 px-2 rounded',
            'Low': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50'
          };
          chipClass = severityColor[label] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>';
          break;
        case 'score':
          chipClass = 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>';
          break;
        case 'date':
          chipClass = 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
          break;
        case 'vendor':
          chipClass = 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>';
          break;
        case 'product':
          chipClass = 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
          break;
        default:
          chipClass = 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>';
      }

      chip.className = `px-2 py-1 ${chipClass} border rounded-full text-xs flex items-center justify-between gap-1 filter-chip transform transition-all duration-200 ease-in-out hover:shadow-sm group`;
      chip.style.animationDelay = `${filterCount * 0.05}s`;

      // Create wrapper for label with icon
      const labelWrapper = document.createElement('div');
      labelWrapper.className = 'flex items-center pr-1';
      labelWrapper.innerHTML = `${iconSvg}<span>${label}</span>`;

      // Create remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'ml-1 text-xs opacity-50 hover:opacity-100 w-4 h-4 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors';
      removeBtn.setAttribute('data-filter', label);
      removeBtn.setAttribute('aria-label', `Remove ${label} filter`);
      removeBtn.innerHTML = '×';

      chip.appendChild(labelWrapper);
      chip.appendChild(removeBtn);
      activeFiltersList.appendChild(chip);
    };

    // Add chips for each active filter with appropriate styling
    if (state.filters.zeroDay) addFilterChip('Zero-Day', 'zeroday');
    if (state.filters.kev) addFilterChip('Known Exploited', 'kev');
    if (state.filters.patchAvailable) addFilterChip('Patch Available', 'patch');

    if (state.filters.cvssMin > 0) {
      const cvssValue = parseFloat(state.filters.cvssMin);
      let scoreType = 'score';
      if (cvssValue >= 9.0) scoreType = 'severity'; // Use severity styling for high scores
      addFilterChip(`CVSS ≥ ${state.filters.cvssMin}`, scoreType);
    }

    if (state.filters.epssMin > 0) {
      addFilterChip(`EPSS ≥ ${(state.filters.epssMin * 100).toFixed(0)}%`, 'score');
    }

    // Severity filters
    if (state.filters.severity) {
      if (state.filters.severity.critical) addFilterChip('Critical', 'severity');
      if (state.filters.severity.high) addFilterChip('High', 'severity');
      if (state.filters.severity.medium) addFilterChip('Medium', 'severity');
      if (state.filters.severity.low) addFilterChip('Low', 'severity');
    }

    // Date range
    if (state.filters.dateRange) {
      if (state.filters.dateRange.start) {
        const formattedDate = new Date(state.filters.dateRange.start)
          .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        addFilterChip(`From: ${formattedDate}`, 'date');
      }
      if (state.filters.dateRange.end) {
        const formattedDate = new Date(state.filters.dateRange.end)
          .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        addFilterChip(`To: ${formattedDate}`, 'date');
      }
    }

    // Vendors
    if (state.filters.vendors && state.filters.vendors.length > 0) {
      state.filters.vendors.forEach(vendor => addFilterChip(`Vendor: ${vendor}`, 'vendor'));
    }

    // Products
    if (state.filters.products && state.filters.products.length > 0) {
      state.filters.products.forEach(product => addFilterChip(`Product: ${product}`, 'product'));
    }

    // Update filter counters (both in sidebar and mobile button)
    const activeFiltersCount = document.getElementById('activeFiltersCount');
    const mobileFilterCount = document.getElementById('mobileFilterCount');
    const filterButtonText = document.getElementById('filterButtonText');

    if (activeFiltersCount) {
      activeFiltersCount.textContent = filterCount;
    }

    // Update mobile filter button
    if (mobileFilterCount && filterButtonText) {
      if (filterCount > 0) {
        mobileFilterCount.textContent = filterCount;
        mobileFilterCount.classList.remove('hidden');
        filterButtonText.textContent = 'Filters';
      } else {
        mobileFilterCount.classList.add('hidden');
        filterButtonText.textContent = 'Filters';
      }
    }

    // Show/hide the container based on whether there are active filters
    activeFiltersContainer.classList.toggle('hidden', !hasActiveFilters);

    // Create filter animations style if not exists
    if (hasActiveFilters && !document.getElementById('filter-animations-style')) {
      const style = document.createElement('style');
      style.id = 'filter-animations-style';
      style.textContent = `
        @keyframes filterFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .filter-chip {
          animation: filterFadeIn 0.3s ease-out forwards;
          opacity: 0;
        }
        @keyframes filterBackgroundPulse {
          0% { background-opacity: 0.3; }
          50% { background-opacity: 0.1; }
          100% { background-opacity: 0.3; }
        }
      `;
      document.head.appendChild(style);
    }

    // Add animation to container when shown
    if (hasActiveFilters) {
      activeFiltersContainer.classList.add('animate-fade-in');
      setTimeout(() => {
        activeFiltersContainer.classList.remove('animate-fade-in');
      }, 500);
    }

    // Add click handlers to remove filter buttons
    document.querySelectorAll('#activeFiltersList button').forEach(button => {
      button.addEventListener('click', (e) => {
        const filterLabel = e.currentTarget.getAttribute('data-filter');
        if (!filterLabel) return;

        // Animate chip removal
        const chip = e.currentTarget.closest('.filter-chip');
        if (chip) {
          chip.style.opacity = '0';
          chip.style.transform = 'translateX(10px)';
          chip.style.transition = 'opacity 0.2s, transform 0.2s';

          // After animation, remove filter
          setTimeout(() => {
            // Remove filter based on label
            switch (filterLabel) {
              case 'Zero-Day':
                state.filters.zeroDay = false;
                break;
              case 'Known Exploited':
                state.filters.kev = false;
                break;
              case 'Patch Available':
                state.filters.patchAvailable = false;
                break;
              default:
                if (filterLabel.startsWith('CVSS ≥ ')) {
                  state.filters.cvssMin = 0;
                } else if (filterLabel.startsWith('EPSS ≥ ')) {
                  state.filters.epssMin = 0;
                } else if (['Critical', 'High', 'Medium', 'Low'].includes(filterLabel)) {
                  const key = filterLabel.toLowerCase();
                  if (state.filters.severity) state.filters.severity[key] = false;
                } else if (filterLabel.startsWith('From: ')) {
                  state.filters.dateRange.start = '';
                } else if (filterLabel.startsWith('To: ')) {
                  state.filters.dateRange.end = '';
                } else if (filterLabel.startsWith('Vendor: ')) {
                  const vendor = filterLabel.replace('Vendor: ', '');
                  state.filters.vendors = state.filters.vendors.filter(v => v !== vendor);
                } else if (filterLabel.startsWith('Product: ')) {
                  const product = filterLabel.replace('Product: ', '');
                  state.filters.products = state.filters.products.filter(p => p !== product);
                }
            }

            applyFiltering();
            updateActiveFiltersDisplay();
            updateURL();
          }, 200);
        }
      });
    });

    // Setup clear all button
    const clearAllBtn = document.getElementById('clearAllFilters');
    if (clearAllBtn && hasActiveFilters) {
      clearAllBtn.addEventListener('click', () => {
        // Animate all chips out
        const chips = document.querySelectorAll('.filter-chip');
        chips.forEach((chip, index) => {
          chip.style.opacity = '0';
          chip.style.transform = 'translateY(10px)';
          chip.style.transition = 'opacity 0.2s, transform 0.2s';
          chip.style.transitionDelay = `${index * 0.02}s`;
        });

        // After animation completes for all chips
        setTimeout(() => {
          // Reset all filter values
          if (state.filters) {
            state.filters = {
              kev: false,
              zeroDay: false,
              patchAvailable: false,
              cvssMin: 0,
              epssMin: 0,
              severity: {
                critical: false,
                high: false,
                medium: false,
                low: false
              },
              dateRange: {
                start: '',
                end: ''
              },
              vendors: [],
              products: []
            };
          }

          // Apply changes
          applyFiltering();
          updateActiveFiltersDisplay();
          updateURL();

          // Show success message
          const successMsg = document.createElement('div');
          successMsg.className = 'fixed bottom-4 right-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded shadow-md z-50 animate-scale-in';
          successMsg.innerHTML = '<span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>All filters cleared</span>';
          document.body.appendChild(successMsg);

          setTimeout(() => {
            successMsg.style.opacity = '0';
            successMsg.style.transform = 'translateY(10px)';
            successMsg.style.transition = 'opacity 0.3s, transform 0.3s';

            setTimeout(() => {
              document.body.removeChild(successMsg);
            }, 300);
          }, 2000);
        }, 300);
      });
    }
  } // Close the updateActiveFiltersDisplay function here

  // Listen for close request from sidebar component
  document.addEventListener('closeSidebarRequest', () => {
    const sidebarWrapper = document.getElementById('filterSidebarWrapper');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebarWrapper && sidebarWrapper.classList.contains('fixed')) {
      // Trigger the animation
      if (overlay) overlay.classList.remove('opacity-100');
      sidebarWrapper.classList.add('-translate-x-full');

      // Clean up after animation completes
      setTimeout(() => {
        if (overlay) overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }, 300);
    }
  });

  // Highlight new reports
  function handleHighlighting() {
    // Get last visit time from localStorage
    const lastVisit = localStorage.getItem('lastVisitTimestamp');
    const now = Date.now();

    if (lastVisit) {
      const rows = tableBody.querySelectorAll('tr');

      rows.forEach(row => {
        const dateStr = row.getAttribute('data-date');
        if (dateStr) {
          const reportDate = new Date(dateStr).getTime();
          // If report is newer than last visit, highlight it
          if (reportDate > Number(lastVisit)) {
            row.classList.add('new-report');
          }
        }
      });
    }

    // Update last visit timestamp
    localStorage.setItem('lastVisitTimestamp', now);
  }

  // Utility: Get column index by sort key, accounting for responsive visibility
  function getColumnIndex(key) {
    // For desktop view
    if (window.innerWidth >= 640) { // sm breakpoint in Tailwind
      switch (key) {
        case 'cve': return 0;
        case 'title': return 1;
        case 'cvss': return 2;
        case 'epss': return 3;
        case 'severity': return 4;
        case 'zeroday': return 5;
        case 'date': return 6;
        default: return 0;
      }
    }
    // For mobile view (some columns are hidden)
    else {
      switch (key) {
        case 'cve': return 0;
        case 'cvss': return 1;
        case 'severity': return 2;
        case 'date': return 3;
        default: return 0;
      }
    }
  }

  // Define closeSidebar function in a higher scope
  function closeSidebar() {
    const sidebarWrapper = document.getElementById('filterSidebarWrapper');
    const mobileToggleBtn = document.getElementById('mobileFilterToggleBtn');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebarWrapper) {
      // Animate out
      if (overlay) {
        overlay.style.opacity = '0';
      }

      // Add animation to sidebar if on mobile
      if (window.innerWidth < 768) {
        sidebarWrapper.classList.add('transform', '-translate-x-full');
      }

      // Wait for animation before hiding
      setTimeout(() => {
        if (window.innerWidth < 768) {
          sidebarWrapper.classList.remove('fixed', 'inset-y-0', 'left-0', 'z-50', 'pt-16', 'pb-4', 'overflow-y-auto', 'w-[280px]', 'max-w-[90vw]');
        }
        sidebarWrapper.style.transform = '';

        if (overlay) {
          overlay.classList.add('hidden');
        }

        document.body.classList.remove('overflow-hidden');
      }, 300);

      if (mobileToggleBtn) {
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }

  // This function will be replaced by our improved toggleSidebar() implementation

  // Enhanced view toggle between table and card layout with animations
  function setupViewToggle() {
    const tableViewBtn = document.getElementById('tableViewBtn');
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableView = document.querySelector('.overflow-x-auto'); // Table container
    const cardView = document.getElementById('cardView');
    const resultsCount = document.getElementById('resultsCount');

    if (tableViewBtn && cardViewBtn && tableView && cardView) {
      // Add animations via stylesheet
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(10px); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes tableRowsAppear {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-fade-out {
          animation: fadeOut 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
        .table-rows-appear tr {
          opacity: 0;
          animation: tableRowsAppear 0.5s ease-out forwards;
        }
        .table-rows-appear tr:nth-child(1) { animation-delay: 0.05s; }
        .table-rows-appear tr:nth-child(2) { animation-delay: 0.1s; }
        .table-rows-appear tr:nth-child(3) { animation-delay: 0.15s; }
        .table-rows-appear tr:nth-child(4) { animation-delay: 0.2s; }
        .table-rows-appear tr:nth-child(5) { animation-delay: 0.25s; }
        .table-rows-appear tr:nth-child(6) { animation-delay: 0.3s; }
        .table-rows-appear tr:nth-child(7) { animation-delay: 0.35s; }
        .table-rows-appear tr:nth-child(8) { animation-delay: 0.4s; }
        .table-rows-appear tr:nth-child(9) { animation-delay: 0.45s; }
        .table-rows-appear tr:nth-child(10) { animation-delay: 0.5s; }
        .view-toggle-active {
          background-color: var(--color-primary-50, rgba(59, 130, 246, 0.1)) !important;
          color: var(--color-primary, #3b82f6) !important;
          font-weight: 500 !important;
          box-shadow: inset 0 0 0 1px var(--color-primary, #3b82f6) !important;
        }
        .view-toggle-active svg {
          stroke: var(--color-primary, #3b82f6) !important;
          stroke-width: 2.5px !important;
        }
      `;
      document.head.appendChild(styleSheet);

      // Set initial active state for table view
      tableViewBtn.classList.add('view-toggle-active');
      tableViewBtn.setAttribute('aria-current', 'true');
      tableViewBtn.setAttribute('aria-pressed', 'true');
      cardViewBtn.setAttribute('aria-pressed', 'false');

      // Show a brief help tooltip on first visit
      const isFirstVisit = !localStorage.getItem('viewToggleUsed');
      if (isFirstVisit) {
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute top-10 right-0 bg-white dark:bg-gray-800 border border-primary rounded shadow-lg p-2 text-xs max-w-[200px] z-10 animate-fade-in';
        tooltip.innerHTML = 'Try switching between views to find your preferred way to browse reports! <button class="mt-1 px-2 py-0.5 bg-primary/10 text-primary rounded hover:bg-primary/20 text-center w-full">Got it</button>';
        tooltip.style.zIndex = '100';

        // Append to parent container
        const viewToggleParent = tableViewBtn.closest('div').parentElement;
        if (viewToggleParent) {
          viewToggleParent.style.position = 'relative';
          viewToggleParent.appendChild(tooltip);

          // Remove tooltip on click
          tooltip.querySelector('button').addEventListener('click', () => {
            tooltip.classList.add('animate-fade-out');
            setTimeout(() => tooltip.remove(), 300);
            localStorage.setItem('viewToggleUsed', 'true');
          });

          // Auto-remove tooltip after 8 seconds
          setTimeout(() => {
            if (document.body.contains(tooltip)) {
              tooltip.classList.add('animate-fade-out');
              setTimeout(() => tooltip.remove(), 300);
            }
          }, 8000);
        }
      }

      // Function to toggle active state with enhanced animations
      const setActiveView = (view) => {
        // Update button states
        tableViewBtn.classList.toggle('view-toggle-active', view === 'table');
        cardViewBtn.classList.toggle('view-toggle-active', view === 'card');
        tableViewBtn.setAttribute('aria-current', view === 'table');
        cardViewBtn.setAttribute('aria-current', view === 'card');

        // Update button accessibility attributes
        tableViewBtn.setAttribute('aria-pressed', view === 'table');
        cardViewBtn.setAttribute('aria-pressed', view === 'card');

        // Add haptic feedback on mobile if available
        if ('vibrate' in navigator) {
          try {
            navigator.vibrate(5); // Subtle vibration on mobile for both view changes
          } catch (e) {
            // Ignore errors if vibration is not available
          }
        }

        // Update results count text based on view
        if (resultsCount) {
          const currentText = resultsCount.textContent || '';
          const number = currentText.match(/\d+/);
          if (number) {
            resultsCount.textContent = `Showing ${number[0]} vulnerability reports in ${view === 'table' ? 'table' : 'card'} view`;
          }
        }

        // Show view transition message
        const viewChangeMsg = document.createElement('div');
        viewChangeMsg.className = 'fixed left-1/2 transform -translate-x-1/2 top-4 bg-primary/90 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-medium z-50 flex items-center animate-scale-in';
        viewChangeMsg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>Switched to ${view === 'table' ? 'table' : 'card'} view`;
        document.body.appendChild(viewChangeMsg);

        // Remove message after animation
        setTimeout(() => {
          viewChangeMsg.style.opacity = '0';
          viewChangeMsg.style.transform = 'translate(-50%, -20px)';
          viewChangeMsg.style.transition = 'opacity 0.3s, transform 0.3s';
          setTimeout(() => viewChangeMsg.remove(), 300);
        }, 1500);

        // Show/hide views with enhanced transition
        if (view === 'card') {
          // Animate out table view
          tableView.style.transition = 'opacity 0.2s ease-out';
          tableView.style.opacity = '0';

          // After fade out, swap views
          setTimeout(() => {
            tableView.classList.add('hidden');
            tableView.style.opacity = '';

            // Show card view with staggered animation
            cardView.classList.remove('hidden');
            cardView.classList.add('grid', 'animate-fade-in');

            // Add staggered animation to card items
            const cards = cardView.querySelectorAll('div[data-cve]');
            cards.forEach((card, index) => {
              card.style.opacity = '0';
              card.style.transform = 'translateY(15px)';
              card.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
              card.style.transitionDelay = `${index * 0.05}s`;

              // Force reflow to apply initial styles
              void card.offsetWidth;

              // Animate in
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, 50);
            });
          }, 200);
        } else {
          // Animate out card view
          if (!cardView.classList.contains('hidden')) {
            cardView.style.transition = 'opacity 0.2s ease-out';
            cardView.style.opacity = '0';

            // After fade out, swap views
            setTimeout(() => {
              cardView.classList.add('hidden');
              cardView.classList.remove('grid', 'animate-fade-in');
              cardView.style.opacity = '';

              // Show table view with animation
              tableView.classList.remove('hidden');
              tableView.style.opacity = '0';
              tableView.style.transition = 'opacity 0.3s ease-out';

              // Force reflow
              void tableView.offsetWidth;

              // Animate in table
              tableView.style.opacity = '1';

              // Add staggered row animation effect
              const tableBody = document.getElementById('reportTableBody');
              if (tableBody) {
                tableBody.classList.add('table-rows-appear');
                setTimeout(() => {
                  tableBody.classList.remove('table-rows-appear');
                }, 1000);
              }
            }, 200);
          }
        }

        // Save preference to localStorage
        localStorage.setItem('preferredView', view);
        localStorage.setItem('viewToggleUsed', 'true');
      };

      // Handle click on table view button with animation
      tableViewBtn.addEventListener('click', () => {
        if (!tableViewBtn.classList.contains('view-toggle-active')) {
          // Add click animation
          tableViewBtn.classList.add('animate-pulse');
          setTimeout(() => {
            tableViewBtn.classList.remove('animate-pulse');
            setActiveView('table');
          }, 150);
        }
      });

      // Handle click on card view button with animation
      cardViewBtn.addEventListener('click', () => {
        if (!cardViewBtn.classList.contains('view-toggle-active')) {
          // Add click animation
          cardViewBtn.classList.add('animate-pulse');
          setTimeout(() => {
            cardViewBtn.classList.remove('animate-pulse');
            setActiveView('card');
          }, 150);
        }
      });

      // Check for saved preference
      const savedView = localStorage.getItem('preferredView');
      if (savedView) {
        setActiveView(savedView);
      } else {
        // Set default to table view if no preference
        setActiveView('table');

        // Adjust view based on screen size if no preference is set
        if (window.innerWidth < 640) {
          // On small screens, default to card view
          setActiveView('card');
        }
      }

      // Listen for screen size changes to adjust view if needed
      window.addEventListener('resize', () => {
        // Only auto-switch if no user preference has been set
        if (!localStorage.getItem('viewToggleUsed')) {
          if (window.innerWidth < 640 && tableViewBtn.classList.contains('view-toggle-active')) {
            setActiveView('card');
          } else if (window.innerWidth >= 1200 && cardViewBtn.classList.contains('view-toggle-active')) {
            setActiveView('table');
          }
        }
      });
    }
  }

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize layout based on screen size
    const sidebarWrapper = document.getElementById('filterSidebarWrapper');
    if (sidebarWrapper) {
      if (window.innerWidth >= 768) {
        // On desktop, show sidebar by default
        sidebarWrapper.classList.remove('hidden');

        // Add margin to main content
        const mainContent = document.querySelector('main.flex-1');
        if (mainContent) {
          mainContent.classList.add('md:ml-80');
        }

        // Update toggle button state
        const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
        if (sidebarToggleBtn) {
          sidebarToggleBtn.setAttribute('aria-expanded', 'true');
          sidebarToggleBtn.classList.add('bg-primary/10', 'text-primary', 'border-primary/30');
        }
      } else {
        // On mobile, hide sidebar by default
        sidebarWrapper.classList.add('hidden');

        // Update toggle button state
        const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
        if (sidebarToggleBtn) {
          sidebarToggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    }

    // Initialize regular components
    initialize();
    setupViewToggle();

    // Set up filter toggle behavior consistently
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn'); // This is in the header
    const filterSidebarWrapper = document.getElementById('filterSidebarWrapper');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const existingOverlay = document.getElementById('sidebarOverlay');
    let overlay = existingOverlay;

    // Create overlay if it doesn't exist yet
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'sidebarOverlay';
      overlay.className = 'fixed inset-0 bg-black/50 z-40 hidden md:hidden opacity-0 transition-opacity duration-300 ease-out';
      document.body.appendChild(overlay);
    }

    // Enhanced toggle sidebar function that handles both desktop and mobile
    function toggleSidebar() {
      if (window.innerWidth < 768) {
        // Mobile behavior: off-canvas sidebar
        const isHidden = sidebarWrapper.classList.contains('hidden') ||
                        sidebarWrapper.classList.contains('-translate-x-full');

        if (isHidden) {
          // Show sidebar
          sidebarWrapper.classList.remove('hidden');

          // First show the overlay with opacity 0
          overlay.classList.remove('hidden');

          // Force a reflow to ensure transition starts from opacity 0
          void overlay.offsetWidth;

          // Animate the opacity
          overlay.classList.add('opacity-100');

          // Prepare sidebar
          sidebarWrapper.classList.add('fixed', 'inset-y-0', 'left-0', 'z-50', 'bg-surface', 'w-[280px]', 'max-w-[90vw]', 'shadow-lg', 'overflow-y-auto');
          sidebarWrapper.classList.remove('-translate-x-full');
          document.body.classList.add('overflow-hidden');

          // Update mobile filter button if exists
          const mobileFilterCount = document.getElementById('mobileFilterCount');
          const mobileFilterBtn = document.getElementById('mobileFilterToggleBtn');
          if (mobileFilterBtn) {
            mobileFilterBtn.classList.add('active', 'bg-primary/10', 'text-primary');
            mobileFilterBtn.setAttribute('aria-expanded', 'true');
          }
        } else {
          // Hide sidebar
          // Animate out
          overlay.classList.remove('opacity-100');
          sidebarWrapper.classList.add('-translate-x-full');

          // Wait for animations to complete before hiding
          setTimeout(() => {
            sidebarWrapper.classList.add('hidden');
            overlay.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');

            // Reset sidebar position classes
            sidebarWrapper.classList.remove('fixed', 'inset-y-0', 'left-0', 'z-50', '-translate-x-full');
          }, 300); // Match the duration in the CSS transition

          // Update mobile filter button if exists
          const mobileFilterBtn = document.getElementById('mobileFilterToggleBtn');
          if (mobileFilterBtn) {
            mobileFilterBtn.classList.remove('active', 'bg-primary/10', 'text-primary');
            mobileFilterBtn.setAttribute('aria-expanded', 'false');
          }
        }
      } else {
        // Desktop behavior: toggle sidebar visibility
        // Simply show/hide the sidebar element
        sidebarWrapper.classList.toggle('hidden');

        // Update display in main content area
        const mainContent = document.querySelector('main.flex-1');
        if (mainContent) {
          if (sidebarWrapper.classList.contains('hidden')) {
            // Sidebar is now hidden, expand main content
            mainContent.classList.remove('md:ml-80');
            mainContent.classList.add('expanded');
          } else {
            // Sidebar is now visible, make space for it
            mainContent.classList.add('md:ml-80');
            mainContent.classList.remove('expanded');
          }
        }
      }
    }

    // Attach event listeners
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
      if (window.innerWidth >= 768) {
        // On desktop - ensure visible
        sidebarWrapper.classList.remove('fixed', 'inset-y-0', 'left-0', 'z-50', '-translate-x-full', 'transform');
        sidebarWrapper.style.transform = '';
        if (overlay) overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      } else {
        // On mobile - hide by default (if not explicitly shown)
        if (!document.body.classList.contains('overflow-hidden')) {
          sidebarWrapper.classList.add('-translate-x-full', 'transform');
        }
      }
    });
  });
</script>

<style>
  /* Highlight style for new reports using direct CSS */
  tr.new-report {
    /* Replace @apply with direct CSS properties */
    border-left-width: 4px;
    border-left-color: #10b981; /* Tailwind's emerald-500 */
    animation: fadeOutHighlight 3s ease-out forwards;
  }

  @keyframes fadeOutHighlight {
    /* Replace @apply with direct CSS properties */
    from { border-left-color: #10b981; } /* Tailwind's emerald-500 */
    to { border-left-color: transparent; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* View toggle buttons */
  #tableViewBtn.active, #cardViewBtn.active {
    background-color: rgba(var(--color-primary-rgb, 59, 130, 246), 0.15);
    color: var(--color-primary, #3b82f6);
    font-weight: 500;
    box-shadow: inset 0 0 0 1px var(--color-primary);
  }

  /* Table row hover effect */
  #reportTable tbody tr:hover {
    background-color: rgba(var(--color-primary-rgb, 59, 130, 246), 0.05);
  }

  /* Add some spacing for better mobile experience */
  /* Enhanced responsive styles for card view on small screens */
  @media (max-width: 640px) {
    #cardView {
      gap: 0.75rem;
      padding: 0.5rem;
    }

    /* Improve card sizing on very small screens */
    #cardView > div {
      min-height: 120px;
    }

    /* Adjust filter chips for better mobile view */
    .filter-chip {
      max-width: 95vw;
    }

    .filter-chip span {
      max-width: 180px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Adjust active filters display */
    #activeFilters {
      padding: 0.5rem;
    }

    /* Ensure view toggle buttons have equal width */
    #tableViewBtn, #cardViewBtn {
      flex: 1;
      justify-content: center;
    }

    /* Make status header more compact */
    .w-full.mx-auto.px-3.py-2 {
      padding: 0.5rem 0.25rem;
    }

    /* Make filter sidebar wider when open */
    #filterSidebarWrapper.fixed {
      width: 85% !important;
      max-width: 320px !important;
    }

    /* Smaller section titles in the filter sidebar */
    .filter-section summary {
      font-size: 0.875rem;
      min-height: 40px;
    }
  }

  /* Medium-sized screens */
  @media (min-width: 641px) and (max-width: 768px) {
    #cardView {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.875rem;
    }
  }

  /* Fix positioning issues on mobile */
  @media (max-width: 768px) {
    /* Ensure the mobile filters overlay properly */
    #filterSidebarWrapper {
      z-index: 50;
      max-height: calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
      height: 100%;
      -webkit-overflow-scrolling: touch;
      overflow-y: auto;
      position: fixed;
      top: env(safe-area-inset-top, 0px);
      bottom: env(safe-area-inset-bottom, 0px);
    }

    /* Fix table overlapping issues */
    #tableContainer {
      min-width: 100%;
      width: 100%;
      max-width: 100%;
      overflow-x: auto;
      border-radius: 0.375rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    /* Optimize table headers for mobile */
    #reportTable thead th {
      position: sticky;
      top: 0;
      background-color: var(--color-surface-accent, #f9fafb);
      z-index: 10;
      padding-top: 0.625rem;
      padding-bottom: 0.625rem;
      border-bottom: 1px solid var(--color-border, #e5e7eb);
    }

    /* Smaller font on mobile */
    #reportTable {
      font-size: 0.75rem; /* Smaller text on mobile */
    }

    /* Ensure sizing for the table cells */
    #reportTable th, #reportTable td {
      box-sizing: border-box;
      padding: 0.5rem 0.75rem; /* Tighter padding on mobile */
    }

    /* Make sure cells don't grow too wide */
    #reportTable th, #reportTable td {
      max-width: 90vw;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Fix cards in card view */
    #cardView > div {
      display: flex;
    }

    /* Prevent overflow on mobile */
    body {
      width: 100%;
      max-width: 100vw;
      overflow-x: hidden;
    }

    /* Ensure main content container doesn't overflow */
    .w-full {
      max-width: 100vw;
      overflow-x: hidden;
    }

    /* Better mobile-first approach for the main layout */
    .flex.flex-col.md\\:flex-row.md\\:gap-6 {
      gap: 0.5rem;
    }

    /* Improve filter button positioning */
    #mobileFilterToggleBtn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.375rem 0.75rem;
      background-color: var(--color-surface, #ffffff);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: 0.375rem;
      font-size: 0.75rem;
    }

    /* Fix mobile active filter display */
    #activeFiltersCount {
      padding: 0.125rem 0.375rem;
      min-width: 1.125rem;
      text-align: center;
      font-size: 0.625rem;
    }

    /* Improve any SVGs in the layout */
    svg {
      min-width: 1rem;
      min-height: 1rem;
    }

    /* Prevent filter sidebar jumps during transitions */
    #filterSidebarWrapper.transform {
      will-change: transform;
    }
  }

  /* Improved larger screen support */
  @media (min-width: 1200px) {
    /* Adjust main content padding for better breathing space */
    main.flex-1 {
      padding-left: 1rem;
    }

    /* Wider table on larger screens */
    #reportTable {
      table-layout: fixed;
    }

    /* Distribute table columns more evenly */
    #reportTable th:nth-child(1) { width: 10%; } /* CVE ID */
    #reportTable th:nth-child(2) { width: 30%; } /* Title */
    #reportTable th:nth-child(3) { width: 8%; }  /* CVSS */
    #reportTable th:nth-child(4) { width: 8%; }  /* EPSS */
    #reportTable th:nth-child(5) { width: 10%; } /* Severity */
    #reportTable th:nth-child(6) { width: 9%; }  /* Zero-day */
    #reportTable th:nth-child(7) { width: 15%; } /* Date */

    /* Improved table row styling */
    #reportTable tbody tr {
      height: 3rem;
      transition: background-color 0.15s;
    }

    #reportTable tbody tr:hover {
      background-color: var(--color-surface-accent, #f9fafb) !important;
    }

    /* Improved focus state for table rows */
    #reportTable tbody tr:focus-within {
      outline: 2px solid var(--color-primary, #3b82f6);
      outline-offset: -2px;
    }
  }

  /* Ultra-wide screen optimizations */
  @media (min-width: 1600px) {
    /* Add extra columns for wide screens */
    #cardView {
      grid-template-columns: repeat(5, 1fr);
    }

    /* Center the main container with max width */
    .w-full.max-w-\\[1800px\\] {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  /* Transition properties for sidebar and content */
  #filterSidebarWrapper {
    transition: transform 0.3s ease-out, opacity 0.3s ease-out, width 0.3s ease-out;
  }

  /* Desktop layout with sidebar */
  @media (min-width: 768px) {
    /* Create space for sidebar when visible */
    main.flex-1.md\\:ml-80 {
      margin-left: 20rem;
      transition: margin-left 0.3s ease-out;
    }

    /* Animation for when sidebar is toggled off */
    main.flex-1.expanded {
      margin-left: 0;
      transition: margin-left 0.3s ease-out;
    }

    /* Ensure content adjusts smoothly when sidebar toggle changes */
    .w-full.max-w-\\[1800px\\] {
      transition: padding-left 0.3s ease-out;
    }
  }

  @media (min-width: 2000px) {
    /* Add even more columns for ultra-wide screens */
    #cardView {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  /* Make sure content doesn't get too stretched on ultra-wide screens */
  @media (min-width: 2400px) {
    .w-full {
      max-width: 2400px;
      margin-left: auto;
      margin-right: auto;
    }
  }

  /* Dark mode improvements */
  @media (prefers-color-scheme: dark) {
    #tableContainer {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }

    #reportTable thead th {
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .filter-chip {
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Full width layout optimizations */
  @media (min-width: 1600px) {
    /* Add extra columns for wide screens */
    #cardView {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  @media (min-width: 2000px) {
    /* Add even more columns for ultra-wide screens */
    #cardView {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  /* Make sure content doesn't get too stretched on ultra-wide screens */
  @media (min-width: 2400px) {
    .w-full {
      max-width: 2400px;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
````

src/components/FilterSidebar.astro
````astro
<<<<<<< SEARCH
  document.getElementById('closeSidebarBtn')?.addEventListener('click', requestSidebarClose);
</script>
````
