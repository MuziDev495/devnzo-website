import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string;
}

interface SiteSettings {
  siteTitle: string;
  siteTagline: string;
  defaultMetaDescription: string;
  defaultOgImage: string;
  twitterHandle: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords
}) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'site_settings', 'seo');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSiteSettings(docSnap.data() as SiteSettings);
        }
      } catch (error) {
        console.error('Error fetching SEO settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const siteTitle = siteSettings?.siteTitle || 'Devnzo';
  const pageTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | ${siteSettings?.siteTagline || 'Transform Your Business'}`;
  const metaDescription = description || siteSettings?.defaultMetaDescription || '';
  const ogImage = image || siteSettings?.defaultOgImage || '';
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {pageUrl && <meta property="og:url" content={pageUrl} />}
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {siteSettings?.twitterHandle && (
        <meta name="twitter:site" content={siteSettings.twitterHandle} />
      )}

      {/* Canonical URL */}
      {pageUrl && <link rel="canonical" href={pageUrl} />}
    </Helmet>
  );
};

export default SEOHead;
