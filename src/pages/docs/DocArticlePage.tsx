/**
 * Documentation Article Page
 * Renders individual documentation articles with breadcrumbs and prev/next navigation
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChevronRight, ChevronLeft, Home } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import DocumentationContent from '@/components/DocumentationContent';
import { DocArticle } from './DocumentationLayout';

interface LayoutContext {
  articles: DocArticle[];
  siblingNavigation: {
    prev: DocArticle | null;
    next: DocArticle | null;
  };
}

const DocArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { siblingNavigation } = useOutletContext<LayoutContext>();
  const [article, setArticle] = useState<DocArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const q = query(
        collection(db, 'documentation'),
        where('slug', '==', slug),
        where('visible', '==', true)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setNotFound(true);
        setArticle(null);
      } else {
        const doc = snapshot.docs[0];
        setArticle({
          id: doc.id,
          ...doc.data()
        } as DocArticle);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 w-48 bg-muted rounded" />
        <div className="h-10 w-3/4 bg-muted rounded" />
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The documentation article you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/docs"
          className="text-primary hover:underline inline-flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Back to Documentation
        </Link>
      </div>
    );
  }

  if (!article) return null;

  return (
    <>
      <SEOHead
        title={`${article.title} - Documentation`}
        description={`Learn about ${article.title} in our documentation.`}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <Link to="/docs" className="hover:text-primary transition-colors">
          Documentation
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium truncate">{article.title}</span>
      </nav>

      {/* Article Content */}
      <article className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold text-foreground mb-6">{article.title}</h1>
        <DocumentationContent content={article.content} />
      </article>

      {/* Previous / Next Navigation */}
      {(siblingNavigation?.prev || siblingNavigation?.next) && (
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-2 gap-4">
            {/* Previous */}
            <div>
              {siblingNavigation?.prev && (
                <Link
                  to={`/docs/${siblingNavigation.prev.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                >
                  <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div className="flex-1 text-left">
                    <div className="text-xs text-muted-foreground mb-1">Previous</div>
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {siblingNavigation.prev.title}
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Next */}
            <div>
              {siblingNavigation?.next && (
                <Link
                  to={`/docs/${siblingNavigation.next.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                >
                  <div className="flex-1 text-right">
                    <div className="text-xs text-muted-foreground mb-1">Next</div>
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {siblingNavigation.next.title}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Styling for documentation content */}
      <style>{`
        .documentation-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: hsl(var(--foreground));
        }
        .documentation-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          color: hsl(var(--foreground));
        }
        .documentation-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: hsl(var(--foreground));
        }
        .documentation-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
          color: hsl(var(--muted-foreground));
        }
        .documentation-content ul, 
        .documentation-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .documentation-content li {
          margin-bottom: 0.5rem;
          color: hsl(var(--muted-foreground));
        }
        .documentation-content a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }
        .documentation-content a:hover {
          opacity: 0.8;
        }
        .documentation-content blockquote {
          border-left: 4px solid hsl(var(--primary));
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }
        .documentation-content pre {
          background: hsl(var(--muted));
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .documentation-content code {
          background: hsl(var(--muted));
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
        .documentation-content pre code {
          background: transparent;
          padding: 0;
        }
        .documentation-content img {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        .documentation-content hr {
          border-color: hsl(var(--border));
          margin: 2rem 0;
        }
      `}</style>
    </>
  );
};

export default DocArticlePage;
