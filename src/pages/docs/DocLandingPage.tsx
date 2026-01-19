/**
 * Documentation Landing Page
 * Default page shown at /docs with overview, article links, and pagination
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ArrowRight, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { cn } from '@/lib/utils';

interface DocArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  order: number;
  visible: boolean;
  parentId?: string | null;
}

const ARTICLES_PER_PAGE = 10;

const DocLandingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<DocArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current page from URL params (default to 1)
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      // Fetch all articles and filter/sort client-side to avoid composite index requirement
      const q = query(collection(db, 'documentation'));
      const snapshot = await getDocs(q);
      const allDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DocArticle[];

      // Filter visible and sort by order
      const docs = allDocs
        .filter(doc => doc.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
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

  // Separate top-level articles (no parent) and child articles
  const topLevelArticles = articles.filter(a => !a.parentId);
  const childArticles = articles.filter(a => a.parentId);

  // Pagination calculations (for child/remaining articles only)
  const totalPages = Math.ceil(childArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const paginatedArticles = childArticles.slice(startIndex, endIndex);

  // Page navigation handlers
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
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
            {/* Quick Start - All Top-Level Navigation Articles (only show on first page) */}
            {currentPage === 1 && topLevelArticles.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Quick Start
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {topLevelArticles.map((article) => (
                    <Link key={article.id} to={`/docs/${article.slug}`}>
                      <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all group">
                        <CardContent className="flex items-center justify-between p-6">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {getExcerpt(article.content)}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 flex-shrink-0 ml-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles (paginated - only child articles) */}
            {childArticles.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {currentPage === 1 ? 'All Articles' : `Articles (Page ${currentPage})`}
                  </h2>
                  {totalPages > 1 && (
                    <span className="text-sm text-muted-foreground">
                      Showing {startIndex + 1}-{Math.min(endIndex, childArticles.length)} of {childArticles.length}
                    </span>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {paginatedArticles.map((article) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-8 border-t border-border">
                {/* Previous Button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    currentPage === 1
                      ? "text-muted-foreground/50 cursor-not-allowed"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-3 py-2 text-muted-foreground"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page as number)}
                        className={cn(
                          "min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          currentPage === page
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    currentPage === totalPages
                      ? "text-muted-foreground/50 cursor-not-allowed"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DocLandingPage;
