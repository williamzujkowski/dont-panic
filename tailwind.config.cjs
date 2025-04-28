/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector', // Enable dark mode based on html.dark class
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  theme: {
    extend: {
      colors: {
        // Reference CSS variables defined in global.css
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        accent: 'var(--color-accent)',
      },
      spacing: {
        // Reference CSS variables
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        xxl: 'var(--spacing-xxl)',
      },
      borderRadius: {
        // Reference CSS variables
        DEFAULT: 'var(--border-radius)',
        md: 'var(--border-radius)', // Use default for md
        lg: 'var(--border-radius-medium)', // Use medium for lg
      },
      boxShadow: {
        // Reference CSS variables
        sm: 'var(--shadow-small)',
        md: 'var(--shadow-medium)',
      },
      fontFamily: {
        // Example: Add a sans-serif stack (ensure 'Inter' is loaded if used)
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      // Customize prose styles for better dark mode and readability
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.text'),
            '--tw-prose-headings': theme('colors.text'), // Use default text for headings
            '--tw-prose-lead': theme('colors.text-secondary'),
            '--tw-prose-links': theme('colors.primary'),
            '--tw-prose-bold': theme('colors.text'),
            '--tw-prose-counters': theme('colors.text-muted'),
            '--tw-prose-bullets': theme('colors.border'),
            '--tw-prose-hr': theme('colors.border'),
            '--tw-prose-quotes': theme('colors.text'),
            '--tw-prose-quote-borders': theme('colors.border'),
            '--tw-prose-captions': theme('colors.text-muted'),
            '--tw-prose-code': theme('colors.secondary'),
            '--tw-prose-pre-code': theme('colors.gray[200]'), // Light background code text
            '--tw-prose-pre-bg': theme('colors.gray[800]'),   // Dark background for code blocks
            '--tw-prose-th-borders': theme('colors.border'),
            '--tw-prose-td-borders': theme('colors.border'),
            // Dark mode overrides using prose-invert variables
            '--tw-prose-invert-body': 'var(--dark-color-text)',
            '--tw-prose-invert-headings': 'var(--dark-color-text)',
            '--tw-prose-invert-lead': 'var(--dark-color-text-secondary)',
            '--tw-prose-invert-links': 'var(--dark-color-primary)',
            '--tw-prose-invert-bold': 'var(--dark-color-text)',
            '--tw-prose-invert-counters': 'var(--dark-color-text-muted)',
            '--tw-prose-invert-bullets': 'var(--dark-color-border)',
            '--tw-prose-invert-hr': 'var(--dark-color-border)',
            '--tw-prose-invert-quotes': 'var(--dark-color-text)',
            '--tw-prose-invert-quote-borders': 'var(--dark-color-border)',
            '--tw-prose-invert-captions': 'var(--dark-color-text-muted)',
            '--tw-prose-invert-code': 'var(--dark-color-secondary)',
            '--tw-prose-invert-pre-code': 'var(--dark-color-text-secondary)', // Adjusted dark code text
            '--tw-prose-invert-pre-bg': 'var(--dark-color-surface)', // Use surface for dark code bg
            '--tw-prose-invert-th-borders': 'var(--dark-color-border)',
            '--tw-prose-invert-td-borders': 'var(--dark-color-border)',
            // General prose adjustments
            'code::before': { content: 'none' }, // Remove backticks
            'code::after': { content: 'none' },
            'pre': {
              'border-radius': theme('borderRadius.lg'), // Rounded code blocks
              'border': '1px solid var(--color-border)', // Add border to code blocks
              'padding': theme('spacing.md'),
            },
            'h2': { // Add spacing for headings
              'margin-top': theme('spacing.xl'),
              'margin-bottom': theme('spacing.md'),
              'padding-bottom': theme('spacing.sm'),
              'border-bottom': '1px solid var(--color-border)',
            },
             'h3': {
              'margin-top': theme('spacing.lg'),
              'margin-bottom': theme('spacing.sm'),
            },
            'ul, ol': { // Add list spacing
              'margin-top': theme('spacing.md'),
              'margin-bottom': theme('spacing.md'),
            },
            'li': {
              'margin-top': theme('spacing.xs'),
              'margin-bottom': theme('spacing.xs'),
            },
            'p': { // Add paragraph spacing
              'margin-top': theme('spacing.md'),
              'margin-bottom': theme('spacing.md'),
            },
            'a': { // Style links within prose
              'font-weight': '500',
              'text-decoration': 'none',
              '&:hover': {
                'text-decoration': 'underline',
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
