/**
 * Documentation Landing Page
 * Default page shown at /docs with overview and article links
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ArrowRight, FileText } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

interface DocArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  order: number;
  visible: boolean;
}

const DocLandingPage: React.FC = () => {
  const [articles, setArticles] = useState<DocArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const q = query(
        collection(db, 'documentation'),
        where('visible', '==', true),
        orderBy('order')
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DocArticle[];
      setArticles(docs);
    } catch (error) {
      console.error('Error fetching documentation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get excerpt from HTML content
  const getExcerpt = (html: string, maxLength: number = 150): string => {
    const text = html.replace(/<[^>]*>/g, '').trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <>
      <SEOHead 
        title="Documentation"
        description="Browse our documentation to learn how to use our products and features effectively."
      />

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8 border-b border-border">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Documentation</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Learn how to use our products and features effectively. Browse articles below or use the sidebar to navigate.
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 w-3/4 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Articles Yet</h2>
            <p className="text-muted-foreground">
              Documentation articles will appear here once they're created.
            </p>
          </div>
        ) : (
          <>
            {/* Quick Start - First Article */}
            {articles.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Quick Start
                </h2>
                <Link to={`/docs/${articles[0].slug}`}>
                  <Card className="hover:border-primary/50 hover:shadow-md transition-all group">
                    <CardContent className="flex items-center justify-between p-6">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {articles[0].title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getExcerpt(articles[0].content)}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )}

            {/* All Articles */}
            {articles.length > 1 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  All Articles
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {articles.slice(1).map((article) => (
                    <Link key={article.id} to={`/docs/${article.slug}`}>
                      <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all group">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {article.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {getExcerpt(article.content, 100)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DocLandingPage;
