export interface NavItem {
  text: string;
  href: string;
  showOnMobile?: boolean; // Option to control visibility on mobile
  icon?: string; // Optional icon name
}

export const navItems: NavItem[] = [
  { text: 'Home', href: '/' },
  { text: 'About', href: '/about' },
  { text: 'Blog', href: '/blog' },
  { text: 'Search', href: '/search', showOnMobile: false }, // Hide on mobile as it's already in header
];