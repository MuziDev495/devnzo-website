/**
 * CMS Context Provider
 * Provides dynamic navigation, footer, and page content from Firestore
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface MenuItem {
  id: string;
  title: string;
  path: string;
  order: number;
  parentId?: string;
  category?: string;
  openInNewTab?: boolean;
  visible: boolean;
  children?: MenuItem[];
}

export interface MenuData {
  name: string;
  items: MenuItem[];
}

interface NavItem {
  title: string;
  path: string;
  visible?: boolean;
  order?: number;
  children?: MenuItem[];
}

interface SocialLink {
  title: string;
  path: string;
  icon: string;
  visible?: boolean;
}

interface FooterData {
  company: NavItem[];
  resources: NavItem[];
  social: SocialLink[];
  description: string;
  copyright: string;
}

interface NavigationData {
  main: NavItem[];
  ctaText: string;
  ctaLink: string;
}

interface DocArticle {
  id: string;
  title: string;
  slug: string;
  order: number;
  visible: boolean;
  parentId?: string | null;
}

// ============== Page Content Types ==============

interface HeroSection {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface EcosystemApp {
  name: string;
  color: string;
  icon: string;
}

interface Tool {
  name: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  price: string;
}

interface Testimonial {
  name: string;
  company: string;
  text: string;
  avatar: string;
  rating: number;
}

interface PartnerBenefit {
  icon: string;
  title: string;
  description: string;
}

interface PartnerType {
  title: string;
  description: string;
  features: string[];
}

interface FeaturedPartner {
  name: string;
  logo: string;
}

interface ResourceCard {
  icon: string;
  title: string;
  description: string;
  path: string;
  color: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

interface CompanyValue {
  icon: string;
  title: string;
  description: string;
}

interface MissionSection {
  imageUrl: string;
  badgeText: string;
  badgeSubtext: string;
}

export interface PageContent {
  homepage: {
    hero: HeroSection;
    features: Feature[];
    stats: Stat[];
  };
  about: {
    title: string;
    description: string;
    mission: string;
    vision: string;
    stats: Stat[];
    team: TeamMember[];
    values: CompanyValue[];
    missionSection: MissionSection;
  };
  contact: {
    title: string;
    description: string;
    email: string;
    phone: string;
    address: string;
  };
  products: {
    hero: HeroSection;
    ecosystemApps: EcosystemApp[];
    stats: Stat[];
    tools: Tool[];
    testimonials: Testimonial[];
  };
  partners: {
    hero: HeroSection;
    benefits: PartnerBenefit[];
    partnerTypes: PartnerType[];
    featuredPartners: FeaturedPartner[];
  };
  resources: {
    hero: HeroSection;
    cards: ResourceCard[];
  };
}

interface CMSContextType {
  navigation: NavigationData | null;
  footer: FooterData | null;
  menus: { [key: string]: MenuData } | null;
  docArticles: DocArticle[];
  pageContent: PageContent | null;
  loading: boolean;
  refreshCMS: () => Promise<void>;
}

const defaultNavigation: NavigationData = {
  main: [
    { title: 'Products', path: '/products', visible: true },
    {
      title: 'Resources',
      path: '/resources',
      visible: true,
      children: [
        { id: 'res_1', title: 'Knowledge', path: '/docs', order: 0, category: 'Shopify', visible: true },
        { id: 'res_2', title: 'Shopify Apps', path: '/products', order: 1, category: 'Shopify', visible: true },
        { id: 'res_3', title: 'All Blog', path: '/blog', order: 2, category: 'eCommerce', visible: true },
        { id: 'res_4', title: 'Free Tools', path: '/free-tools', order: 3, category: 'eCommerce', visible: true },
      ]
    },
    { title: 'Partners', path: '/partners', visible: true },
    { title: 'About', path: '/about', visible: true },
    { title: 'Contact', path: '/contact', visible: true },
  ],
  ctaText: 'Start Free Trial',
  ctaLink: 'https://www.shopify.com/'
};

const defaultFooter: FooterData = {
  company: [
    { title: 'About Us', path: '/about' },
    { title: 'Contact', path: '/contact' },
    { title: 'Privacy Policy', path: '/privacy-policy' },
    { title: 'Terms of Service', path: '/terms-of-service' },
  ],
  resources: [
    { title: 'Blog', path: '/blog' },
    { title: 'Help Center', path: '/help-center' },
    { title: 'Support', path: '/support' },
    { title: 'FAQs', path: '/faq' },
  ],
  social: [
    { title: 'Twitter', path: 'https://twitter.com/Devnzo', icon: 'twitter' },
    { title: 'LinkedIn', path: 'https://linkedin.com/company/Devnzo', icon: 'linkedin' },
    { title: 'Facebook', path: 'https://facebook.com/Devnzo', icon: 'facebook' },
    { title: 'Instagram', path: 'https://instagram.com/Devnzo', icon: 'instagram' },
    { title: 'YouTube', path: 'https://youtube.com/Devnzo', icon: 'youtube' },
  ],
  description: 'Empowering businesses with innovative solutions for sustainable growth and success.',
  copyright: '© 2026 Devnzo. All rights reserved.'
};

const CMSContext = createContext<CMSContextType>({
  navigation: defaultNavigation,
  footer: defaultFooter,
  menus: null,
  docArticles: [],
  pageContent: null,
  loading: true,
  refreshCMS: async () => { }
});

export const useCMS = () => useContext(CMSContext);

// Helper hook for page content (convenience wrapper)
export const usePageContent = () => {
  const { pageContent, loading } = useContext(CMSContext);
  return { pageContent, loading };
};

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigation, setNavigation] = useState<NavigationData | null>(defaultNavigation);
  const [footer, setFooter] = useState<FooterData | null>(defaultFooter);
  const [menus, setMenus] = useState<{ [key: string]: MenuData } | null>(null);
  const [docArticles, setDocArticles] = useState<DocArticle[]>([]);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Build menu tree from flat items
  const buildMenuTree = (items: MenuItem[]): MenuItem[] => {
    const sortedItems = [...items].sort((a, b) => a.order - b.order);
    const topLevelItems = sortedItems.filter(item => !item.parentId && item.visible !== false);

    return topLevelItems.map(parent => ({
      ...parent,
      children: sortedItems.filter(child => child.parentId === parent.id && child.visible !== false)
    }));
  };

  const fetchDocArticles = async () => {
    try {
      // Fetch all articles and filter/sort client-side to avoid composite index requirement
      const q = query(collection(db, 'documentation'));
      const snapshot = await getDocs(q);
      const allDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        slug: doc.data().slug,
        order: doc.data().order,
        visible: doc.data().visible,
        parentId: doc.data().parentId || null, // Include parentId
      })) as DocArticle[];

      // Filter visible and sort by order
      const docs = allDocs
        .filter(doc => doc.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setDocArticles(docs);
      return docs;
    } catch (error) {
      console.error('Error fetching documentation articles:', error);
      return [];
    }
  };

  const fetchCMSData = async () => {
    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Extract and set page content (homepage, about, contact, products, partners, resources)
        if (data.homepage || data.about || data.contact || data.products || data.partners || data.resources) {
          setPageContent({
            homepage: data.homepage || null,
            about: data.about || null,
            contact: data.contact || null,
            products: data.products || null,
            partners: data.partners || null,
            resources: data.resources || null,
          } as PageContent);
        }

        // Load menus data
        if (data.menus) {
          setMenus(data.menus);

          // Fetch documentation articles for nav dropdown
          const docs = await fetchDocArticles();

          // Build navigation from header menu with fallback
          if (data.menus.header?.items && data.menus.header.items.length > 0) {
            const menuTree = buildMenuTree(data.menus.header.items);
            const navItems: NavItem[] = menuTree.map(item => ({
              title: item.title,
              path: item.path,
              visible: item.visible,
              order: item.order,
              children: item.children
            }));

            // Add Documentation dropdown children from documentation collection
            // Check for existing Documentation nav item (could be /docs or /documentation)
            const docsNavIndex = navItems.findIndex(item =>
              item.path === '/docs' || item.path === '/documentation'
            );

            // Only show top-level articles in header dropdown (not child articles)
            const topLevelDocs = docs.filter(doc => !doc.parentId);

            if (docsNavIndex !== -1 && topLevelDocs.length > 0) {
              // Update existing Documentation item with dynamic children
              navItems[docsNavIndex] = {
                ...navItems[docsNavIndex],
                path: '/docs', // Normalize to /docs
                children: topLevelDocs.map(doc => ({
                  id: doc.id,
                  title: doc.title,
                  path: `/docs/${doc.slug}`,
                  order: doc.order,
                  visible: true
                }))
              };
            } else if (topLevelDocs.length > 0) {
              // No existing docs nav, add new one
              navItems.push({
                title: 'Documentation',
                path: '/docs',
                visible: true,
                order: 99,
                children: topLevelDocs.map(doc => ({
                  id: doc.id,
                  title: doc.title,
                  path: `/docs/${doc.slug}`,
                  order: doc.order,
                  visible: true
                }))
              });
            }

            // Normalize paths for specific items if they point to /resources
            const normalizePaths = (items: NavItem[]) => {
              return items
                .filter(item => !item.title.toLowerCase().includes('shopify free trial'))
                .map(item => {
                  let newItem = { ...item };

                  // Check parent path
                  if (newItem.path === '/resources') {
                    if (newItem.title.toLowerCase().includes('knowledge')) newItem.path = '/docs';
                    if (newItem.title.toLowerCase().includes('free tool')) newItem.path = '/free-tools';
                    if (newItem.title.toLowerCase().includes('shopify app')) newItem.path = '/products';
                  }

                  // Check children
                  if (newItem.children) {
                    newItem.children = newItem.children
                      .filter(child => !child.title.toLowerCase().includes('shopify free trial'))
                      .map(child => {
                        let newChild = { ...child };
                        if (newChild.path === '/resources') {
                          if (newChild.title.toLowerCase().includes('knowledge')) newChild.path = '/docs';
                          if (newChild.title.toLowerCase().includes('free tool')) newChild.path = '/free-tools';
                          if (newChild.title.toLowerCase().includes('shopify app')) newChild.path = '/products';
                        }
                        return newChild;
                      });
                  }
                  return newItem;
                });
            };

            const normalizedNavItems = normalizePaths(navItems);

            // Only use Firestore items if we got valid results, otherwise keep defaults
            setNavigation({
              main: normalizedNavItems.length > 0 ? normalizedNavItems : defaultNavigation.main,
              ctaText: data.navigation?.ctaText || defaultNavigation.ctaText,
              ctaLink: data.navigation?.ctaLink || defaultNavigation.ctaLink
            });
          } else {
            // No menu items in Firestore, keep default navigation
            setNavigation({
              main: defaultNavigation.main,
              ctaText: data.navigation?.ctaText || defaultNavigation.ctaText,
              ctaLink: data.navigation?.ctaLink || defaultNavigation.ctaLink
            });
          }

          // Build footer from footer menus
          const footerCompany = data.menus.footerCompany?.items
            ?.filter((item: MenuItem) => item.visible !== false)
            ?.sort((a: MenuItem, b: MenuItem) => a.order - b.order)
            ?.map((item: MenuItem) => ({ title: item.title, path: item.path })) || defaultFooter.company;

          const footerResources = data.menus.footerResources?.items
            ?.filter((item: MenuItem) => item.visible !== false)
            ?.sort((a: MenuItem, b: MenuItem) => a.order - b.order)
            ?.map((item: MenuItem) => ({ title: item.title, path: item.path })) || defaultFooter.resources;

          setFooter({
            company: footerCompany,
            resources: footerResources,
            social: data.footer?.social?.filter((item: SocialLink) => item.visible !== false) || defaultFooter.social,
            description: data.footer?.description || defaultFooter.description,
            copyright: data.footer?.copyright || defaultFooter.copyright
          });
        } else {
          // Legacy: Load from old navigation/footer structure
          let navItems: NavItem[] = [];
          if (data.navigation) {
            navItems = data.navigation.main?.filter((item: NavItem) => item.visible !== false) || [];
          }

          if (data.pages) {
            const pageEntries = Object.entries(data.pages) as [string, any][];
            const headerPages = pageEntries
              .filter(([_, page]) => page.showInHeader && page.isActive)
              .map(([_, page]) => ({
                title: page.title || page.path?.replace('/', ''),
                path: page.path,
                order: page.headerOrder ?? 99,
                visible: true
              }));
            navItems = [...navItems, ...headerPages];
          }

          const sortedNavItems = navItems.sort((a: NavItem, b: NavItem) => (a.order || 0) - (b.order || 0));

          // Apply normalization to legacy paths too
          const normalizePathsLegacy = (items: NavItem[]) => {
            return items
              .filter(item => !item.title.toLowerCase().includes('shopify free trial'))
              .map(item => {
                let newItem = { ...item };
                if (newItem.path === '/resources') {
                  if (newItem.title.toLowerCase().includes('knowledge')) newItem.path = '/docs';
                  if (newItem.title.toLowerCase().includes('free tool')) newItem.path = '/free-tools';
                  if (newItem.title.toLowerCase().includes('shopify app')) newItem.path = '/products';
                }
                if (newItem.children) {
                  newItem.children = newItem.children
                    .filter(child => !child.title.toLowerCase().includes('shopify free trial'))
                    .map(child => {
                      let newChild = { ...child };
                      if (newChild.path === '/resources') {
                        if (newChild.title.toLowerCase().includes('knowledge')) newChild.path = '/docs';
                        if (newChild.title.toLowerCase().includes('free tool')) newChild.path = '/free-tools';
                        if (newChild.title.toLowerCase().includes('shopify app')) newChild.path = '/products';
                      }
                      return newChild;
                    });
                }
                return newItem;
              });
          };

          const normalizedLegacyNav = normalizePathsLegacy(sortedNavItems);

          setNavigation({
            main: normalizedLegacyNav.length > 0 ? normalizedLegacyNav : defaultNavigation.main,
            ctaText: data.navigation?.ctaText || defaultNavigation.ctaText,
            ctaLink: data.navigation?.ctaLink || defaultNavigation.ctaLink
          });

          let companyLinks: NavItem[] = data.footer?.company || defaultFooter.company;
          let resourceLinks: NavItem[] = data.footer?.resources || defaultFooter.resources;

          if (data.pages) {
            const pageEntries = Object.entries(data.pages) as [string, any][];

            const footerCompanyPages = pageEntries
              .filter(([_, page]) => page.showInFooterCompany && page.isActive)
              .map(([_, page]) => ({
                title: page.title || page.path?.replace('/', ''),
                path: page.path,
                order: page.footerOrder ?? 99
              }));

            const footerResourcePages = pageEntries
              .filter(([_, page]) => page.showInFooterResources && page.isActive)
              .map(([_, page]) => ({
                title: page.title || page.path?.replace('/', ''),
                path: page.path,
                order: page.footerOrder ?? 99
              }));

            companyLinks = [...companyLinks, ...footerCompanyPages];
            resourceLinks = [...resourceLinks, ...footerResourcePages];
          }

          if (data.footer) {
            setFooter({
              company: companyLinks,
              resources: resourceLinks,
              social: data.footer.social?.filter((item: SocialLink) => item.visible !== false) || defaultFooter.social,
              description: data.footer.description || defaultFooter.description,
              copyright: data.footer.copyright || defaultFooter.copyright
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching CMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCMSData();
  }, []);

  return (
    <CMSContext.Provider value={{ navigation, footer, menus, docArticles, pageContent, loading, refreshCMS: fetchCMSData }}>
      {children}
    </CMSContext.Provider>
  );
};

export default CMSContext;
