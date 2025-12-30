/**
 * CMS Context Provider
 * Provides dynamic navigation, footer, and page content from Firestore
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface NavItem {
  title: string;
  path: string;
  visible?: boolean;
  order?: number;
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

interface CMSContextType {
  navigation: NavigationData | null;
  footer: FooterData | null;
  loading: boolean;
  refreshCMS: () => Promise<void>;
}

const defaultNavigation: NavigationData = {
  main: [
    { title: 'Products', path: '/products', visible: true },
    { title: 'Resources', path: '/resources', visible: true },
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
  loading: true,
  refreshCMS: async () => {}
});

export const useCMS = () => useContext(CMSContext);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigation, setNavigation] = useState<NavigationData | null>(defaultNavigation);
  const [footer, setFooter] = useState<FooterData | null>(defaultFooter);
  const [loading, setLoading] = useState(true);

  const fetchCMSData = async () => {
    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.navigation) {
          const navItems = data.navigation.main?.filter((item: NavItem) => item.visible !== false) || [];
          setNavigation({
            main: navItems.sort((a: NavItem, b: NavItem) => (a.order || 0) - (b.order || 0)),
            ctaText: data.navigation.ctaText || defaultNavigation.ctaText,
            ctaLink: data.navigation.ctaLink || defaultNavigation.ctaLink
          });
        }
        
        if (data.footer) {
          setFooter({
            company: data.footer.company || defaultFooter.company,
            resources: data.footer.resources || defaultFooter.resources,
            social: data.footer.social?.filter((item: SocialLink) => item.visible !== false) || defaultFooter.social,
            description: data.footer.description || defaultFooter.description,
            copyright: data.footer.copyright || defaultFooter.copyright
          });
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
    <CMSContext.Provider value={{ navigation, footer, loading, refreshCMS: fetchCMSData }}>
      {children}
    </CMSContext.Provider>
  );
};

export default CMSContext;
