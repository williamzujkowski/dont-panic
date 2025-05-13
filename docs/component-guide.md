# Component Guide

This guide documents the custom components available in the Don't Panic project and how to use them.

## Navigation and Layouts

### BaseLayout

The primary layout component provides a consistent page structure with navigation, footer, and proper meta tags. It uses `astro-navbar` for responsive navigation.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Page Title" description="Optional page description">
  <!-- Your page content here -->
</BaseLayout>
```

Properties:
- `title` (required): The page title
- `description` (optional): Meta description for SEO

### Navigation

The site navigation is powered by `astro-navbar` and uses the navigation items defined in `src/data/navItems.ts`. To update the navigation items, edit this file.

## UI Components

### Card

The `Card` component provides a styled container for content with a title and hover effects.

```astro
---
import Card from '../components/Card.astro';
---

<Card>
  <span slot="title">Card Title</span>
  <p>Card content goes here.</p>
  <!-- Optional footer content -->
</Card>
```

### Button

The enhanced `Button` component provides styled buttons with multiple variants and sizes.

```astro
---
import Button from '../components/Button.astro';
---

<!-- Default (primary, medium size) -->
<Button>Click Me</Button>

<!-- Variants -->
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>

<!-- Size variations -->
<Button size="xs">Extra Small Button</Button>
<Button size="sm">Small Button</Button>
<Button size="md">Medium Button</Button>
<Button size="lg">Large Button</Button>

<!-- Full width -->
<Button fullWidth={true}>Full Width Button</Button>

<!-- Disabled state -->
<Button disabled={true}>Disabled Button</Button>

<!-- As a link -->
<Button href="/some-page">Link Button</Button>

<!-- Form submit button -->
<Button type="submit">Submit Form</Button>

<!-- With icons -->
<Button>
  <span slot="icon-left">
    <svg><!-- SVG icon --></svg>
  </span>
  Button with Icon
  <span slot="icon-right">
    <svg><!-- SVG icon --></svg>
  </span>
</Button>
```

Properties:
- `variant` (optional): `"primary"` (default), `"secondary"`, `"outline"`, or `"ghost"`
- `size` (optional): `"xs"`, `"sm"`, `"md"` (default), or `"lg"`
- `href` (optional): If provided, renders as an `<a>` tag instead of a button
- `type` (optional): For `<button>` elements, specifies the button type (`"button"` by default, can also be `"submit"` or `"reset"`)
- `fullWidth` (optional): When `true`, button takes up 100% of container width
- `disabled` (optional): When `true`, disables the button and applies disabled styling
- `id` (optional): HTML id attribute
- `ariaLabel` (optional): HTML aria-label attribute
- `class` (optional): Additional CSS classes to apply

### ReportCard

The `ReportCard` component displays vulnerability report information in a card format.

```astro
---
import ReportCard from '../components/ReportCard.astro';
---

<ReportCard report={reportEntry} isHighlighted={false} />
```

Properties:
- `report` (required): A CollectionEntry object with report data
- `isHighlighted` (optional): When true, applies a highlight style to the card

### ReportMetaCard

The `ReportMetaCard` component displays detailed metadata for a vulnerability report.

```astro
---
import ReportMetaCard from '../components/ReportMetaCard.astro';
---

<ReportMetaCard report={reportEntry} />
```

Properties:
- `report` (required): A CollectionEntry object with report data

### ScoreDisplay

The `ScoreDisplay` component shows CVSS or EPSS scores with appropriate styling.

```astro
---
import ScoreDisplay from '../components/ScoreDisplay.astro';
---

<!-- Normal display -->
<ScoreDisplay type="CVSS" score={8.2} link="https://nvd.nist.gov/vuln/detail/CVE-2023-1234" />

<!-- Compact display for cards -->
<ScoreDisplay type="EPSS" score={0.85} compact={true} />
```

Properties:
- `type` (required): `"CVSS"` or `"EPSS"`
- `score` (required): The numerical score
- `link` (optional): URL to link the score to
- `compact` (optional): Use compact styling when `true`

### SeverityTag

The `SeverityTag` component displays a colored severity indicator.

```astro
---
import SeverityTag from '../components/SeverityTag.astro';
---

<SeverityTag severity="Critical" />
<SeverityTag severity="High" />
<SeverityTag severity="Medium" />
<SeverityTag severity="Low" />
```

Properties:
- `severity` (required): One of `"Critical"`, `"High"`, `"Medium"`, or `"Low"`

### ZeroDayTag

The `ZeroDayTag` component displays a zero-day vulnerability indicator.

```astro
---
import ZeroDayTag from '../components/ZeroDayTag.astro';
---

<ZeroDayTag isZeroDay={true} />
```

Properties:
- `isZeroDay` (required): Boolean indicating if the vulnerability is a zero-day

## Component Showcase

Visit `/sample` to see the basic components in action.

## Theme Support

The site supports both light and dark themes. A theme toggle button is included in the navigation bar, and the theme will be remembered across sessions.

## Example: Report Listing Page

This example shows how to display a list of reports in both table and card views:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ReportCard from '../components/ReportCard.astro';
import Button from '../components/Button.astro';
import { getCollection } from 'astro:content';

// Get reports
const reports = await getCollection('reports');
---

<BaseLayout title="Vulnerability Reports">
  <!-- View toggle -->
  <div class="flex justify-end mb-4">
    <div class="inline-flex rounded-md shadow-sm" role="group">
      <button id="tableViewBtn" class="px-4 py-2 bg-surface rounded-l-md">Table</button>
      <button id="cardViewBtn" class="px-4 py-2 bg-surface rounded-r-md">Cards</button>
    </div>
  </div>
  
  <!-- Table view -->
  <div id="tableView" class="overflow-x-auto">
    <!-- Table content -->
  </div>
  
  <!-- Card view -->
  <div id="cardView" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {reports.map(report => (
      <ReportCard report={report} />
    ))}
  </div>
</BaseLayout>

<script>
  // View toggle logic
  document.addEventListener('DOMContentLoaded', () => {
    const tableBtn = document.getElementById('tableViewBtn');
    const cardBtn = document.getElementById('cardViewBtn');
    const tableView = document.getElementById('tableView');
    const cardView = document.getElementById('cardView');
    
    tableBtn.addEventListener('click', () => {
      tableView.classList.remove('hidden');
      cardView.classList.add('hidden');
      tableBtn.classList.add('bg-primary/10');
      cardBtn.classList.remove('bg-primary/10');
    });
    
    cardBtn.addEventListener('click', () => {
      tableView.classList.add('hidden');
      cardView.classList.remove('hidden');
      cardView.classList.add('grid');
      tableBtn.classList.remove('bg-primary/10');
      cardBtn.classList.add('bg-primary/10');
    });
  });
</script>
```

## Example: Report Detail Page

This example shows how to display a detailed report with metadata:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ReportMetaCard from '../components/ReportMetaCard.astro';
import Button from '../components/Button.astro';
import { getCollection } from 'astro:content';

// Get report by slug
const { slug } = Astro.params;
const report = (await getCollection('reports')).find(r => r.slug === slug);
const { Content } = await report.render();
---

<BaseLayout title={report.data.title}>
  <div class="flex flex-col md:flex-row md:gap-6">
    <!-- Main content -->
    <div class="flex-1 order-2 md:order-1">
      <article>
        <header>
          <h1 class="text-3xl font-bold">{report.data.cveId}</h1>
          <h2 class="text-xl font-semibold">{report.data.title}</h2>
        </header>
        
        <!-- Report content -->
        <div class="prose prose-lg dark:prose-invert mt-6">
          <Content />
        </div>
      </article>
    </div>
    
    <!-- Sidebar -->
    <div class="w-full md:w-80 order-1 md:order-2 mb-6 md:mb-0">
      <ReportMetaCard report={report} />
    </div>
  </div>
</BaseLayout>
```