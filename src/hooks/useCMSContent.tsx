/**
 * useCMSContent Hook
 * Fetches page-specific content from Firestore CMS
 */

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PageSection {
  visible: boolean;
  content: Record<string, any>;
}

interface PageData {
  isActive: boolean;
  lastUpdated?: Date;
  sections: Record<string, PageSection>;
}

interface UseCMSContentResult<T> {
  content: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCMSContent<T = Record<string, any>>(
  pageKey: string,
  defaultContent: T
): UseCMSContentResult<T> {
  const [content, setContent] = useState<T | null>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const pageData = data[pageKey];
        
        if (pageData) {
          setContent({ ...defaultContent, ...pageData } as T);
        } else {
          setContent(defaultContent);
        }
      } else {
        setContent(defaultContent);
      }
    } catch (err) {
      console.error(`Error fetching ${pageKey} content:`, err);
      setError('Failed to load content');
      setContent(defaultContent);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [pageKey]);

  return { content, loading, error, refetch: fetchContent };
}

/**
 * Hook to get page visibility status and sections
 */
export function usePageSections(pageKey: string): {
  sections: Record<string, PageSection>;
  isActive: boolean;
  loading: boolean;
} {
  const [sections, setSections] = useState<Record<string, PageSection>>({});
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const docRef = doc(db, 'page_content', 'main');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const pageData = data.pages?.[pageKey] as PageData | undefined;
          
          if (pageData) {
            setSections(pageData.sections || {});
            setIsActive(pageData.isActive !== false);
          }
        }
      } catch (err) {
        console.error(`Error fetching ${pageKey} sections:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [pageKey]);

  return { sections, isActive, loading };
}

export default useCMSContent;
