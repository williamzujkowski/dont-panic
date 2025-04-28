/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}' // Ensure this includes all relevant file types
  ],
  theme: {
    extend: {
      // Add custom theme extensions here if needed
      colors: {
        'primary': 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'secondary': 'var(--color-secondary)',
        'background': 'var(--color-background)',
        'surface': 'var(--color-surface)',
        'text': 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-secondary': 'var(--color-text-secondary)',
        'border': 'var(--color-border)',
        'accent': 'var(--color-accent)',
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        'xxl': 'var(--spacing-xxl)',
      },
      borderRadius: {
        'DEFAULT': 'var(--border-radius)',
        'md': 'var(--border-radius-medium)',
      },
      boxShadow: {
        'sm': 'var(--shadow-small)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Add typography plugin for Markdown styling
  ],
}
