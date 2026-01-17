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
}

interface CMSContextType {
  navigation: NavigationData | null;
  footer: FooterData | null;
  menus: { [key: string]: MenuData } | null;
  docArticles: DocArticle[];
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
        { id: 'res_1', title: 'Knowledge', path: '/resources', order: 0, category: 'Shopify', visible: true },
        { id: 'res_2', title: 'Shopify Apps', path: '/products', order: 1, category: 'Shopify', visible: true },
        { id: 'res_3', title: 'All Blog', path: '/blog', order: 2, category: 'eCommerce', visible: true },
        { id: 'res_4', title: 'Free Tools', path: '/resources', order: 3, category: 'eCommerce', visible: true },
        { id: 'res_5', title: 'Shopify Free Trial', path: 'https://www.shopify.com/free-trial', order: 4, category: 'eCommerce', openInNewTab: true, visible: true },
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
    { title: 'Documentation', path: '/documentation' },
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
  loading: true,
  refreshCMS: async () => {}
});

export const useCMS = () => useContext(CMSContext);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigation, setNavigation] = useState<NavigationData | null>(defaultNavigation);
  const [footer, setFooter] = useState<FooterData | null>(defaultFooter);
  const [menus, setMenus] = useState<{ [key: string]: MenuData } | null>(null);
  const [docArticles, setDocArticles] = useState<DocArticle[]>([]);
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
      const q = query(
        collection(db, 'documentation'),
        where('visible', '==', true),
        orderBy('order')
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        slug: doc.data().slug,
        order: doc.data().order,
        visible: doc.data().visible
      })) as DocArticle[];
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
            
            if (docsNavIndex !== -1 && docs.length > 0) {
              // Update existing Documentation item with dynamic children
              navItems[docsNavIndex] = {
                ...navItems[docsNavIndex],
                path: '/docs', // Normalize to /docs
                children: docs.map(doc => ({
                  id: doc.id,
                  title: doc.title,
                  path: `/docs/${doc.slug}`,
                  order: doc.order,
                  visible: true
                }))
              };
            } else if (docs.length > 0) {
              // No existing docs nav, add new one
              navItems.push({
                title: 'Documentation',
                path: '/docs',
                visible: true,
                order: 99,
                children: docs.map(doc => ({
                  id: doc.id,
                  title: doc.title,
                  path: `/docs/${doc.slug}`,
                  order: doc.order,
                  visible: true
                }))
              });
            }
            
            // Only use Firestore items if we got valid results, otherwise keep defaults
            setNavigation({
              main: navItems.length > 0 ? navItems : defaultNavigation.main,
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
          setNavigation({
            main: sortedNavItems.length > 0 ? sortedNavItems : defaultNavigation.main,
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
    <CMSContext.Provider value={{ navigation, footer, menus, docArticles, loading, refreshCMS: fetchCMSData }}>
      {children}
    </CMSContext.Provider>
  );
};

export default CMSContext;
