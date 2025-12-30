/**
 * Route Type Definitions
 * Type definitions and constants for route management
 */

export interface RouteConfig {
  path: string;
  name: string;
  component: string;
  isProtected?: boolean;
  children?: RouteConfig[];
}

export interface NavigationItem {
  title: string;
  path: string;
  category?: string;
  isExternal?: boolean;
}

export interface ResourceLink extends NavigationItem {
  category: 'Shopify' | 'eCommerce';
}

export interface FooterLink extends NavigationItem {
  section: 'Company' | 'Resources' | 'Connect';
  icon?: string;
}

// Route constants for consistent URL management
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  RESOURCES: {
    INDEX: '/resources',
    KNOWLEDGE: '/resources/knowledge',
    SHOPIFY_APPS: '/resources/shopify-apps',
    ALL_BLOG: '/resources/all-blog',
    FREE_TOOLS: '/resources/free-tools',
    SHOPIFY_FREE_TRIAL: '/resources/shopify-free-trial',
  },
  ABOUT: '/about',
  CONTACT: '/contact',
  PARTNERS: '/partners',
  CAREERS: '/careers',
  PRESS: '/press-media',
  PRIVACY: '/privacy-policy',
  TERMS: '/terms-of-service',
  BLOG: '/blog',
  HELP: '/help-center',
  DOCUMENTATION: '/documentation',
  SUPPORT: '/support',
  FAQ: '/faq',
} as const;

// Navigation configuration for header component
export const NAVIGATION_CONFIG: NavigationItem[] = [
  { title: 'Products', path: ROUTES.PRODUCTS },
  { title: 'Resources', path: ROUTES.RESOURCES.INDEX },
  { title: 'Partners', path: ROUTES.PARTNERS },
  { title: 'About', path: ROUTES.ABOUT },
  { title: 'Contact', path: ROUTES.CONTACT },
];

// Resource links for dropdown navigation
export const RESOURCE_LINKS: ResourceLink[] = [
  { title: 'Knowledge', path: ROUTES.RESOURCES.KNOWLEDGE, category: 'Shopify' },
  { title: 'Shopify Apps', path: ROUTES.RESOURCES.SHOPIFY_APPS, category: 'Shopify' },
  { title: 'All Blog', path: ROUTES.RESOURCES.ALL_BLOG, category: 'eCommerce' },
  { title: 'Free Tools', path: ROUTES.RESOURCES.FREE_TOOLS, category: 'eCommerce' },
  { title: 'Shopify Free Trial', path: ROUTES.RESOURCES.SHOPIFY_FREE_TRIAL, category: 'eCommerce' },
];

// Footer links configuration
export const FOOTER_LINKS: FooterLink[] = [
  // Company section
  { title: 'About Us', path: ROUTES.ABOUT, section: 'Company' },
  { title: 'Contact', path: ROUTES.CONTACT, section: 'Company' },
  { title: 'Privacy Policy', path: ROUTES.PRIVACY, section: 'Company' },
  { title: 'Terms of Service', path: ROUTES.TERMS, section: 'Company' },

  // Resources section
  { title: 'Blog', path: ROUTES.BLOG, section: 'Resources' },
  { title: 'Help Center', path: ROUTES.HELP, section: 'Resources' },
  { title: 'Documentation', path: ROUTES.DOCUMENTATION, section: 'Resources' },
  { title: 'Support', path: ROUTES.SUPPORT, section: 'Resources' },
  { title: 'FAQs', path: ROUTES.FAQ, section: 'Resources' },

  // Connect section (external links)
  { title: 'Twitter', path: 'https://twitter.com/Devnzo', section: 'Connect', isExternal: true, icon: 'twitter' },
  { title: 'LinkedIn', path: 'https://linkedin.com/company/Devnzo', section: 'Connect', isExternal: true, icon: 'linkedin' },
  { title: 'Facebook', path: 'https://facebook.com/Devnzo', section: 'Connect', isExternal: true, icon: 'facebook' },
  { title: 'Instagram', path: 'https://instagram.com/Devnzo', section: 'Connect', isExternal: true, icon: 'instagram' },
  { title: 'YouTube', path: 'https://youtube.com/Devnzo', section: 'Connect', isExternal: true, icon: 'youtube' },
];
