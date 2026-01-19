/**
 * Documentation Layout
 * GitBook-style two-column layout with sidebar navigation and search
 * Supports hierarchical articles with parent-child relationships
 * Features: Contextual sidebar filtering, clickable parent titles, prev/next navigation
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Menu, BookOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';

export interface DocArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  order: number;
  parentId?: string | null;
  parentSlug?: string | null;
  visible: boolean;
}

interface ArticleWithChildren extends DocArticle {
  children: DocArticle[];
}

const DocumentationLayout: React.FC = () => {
  const [articles, setArticles] = useState<DocArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());
  const location = useLocation();

  const currentSlug = location.pathname.replace('/docs/', '').replace('/docs', '');

  useEffect(() => {
    fetchArticles();
  }, []);

  // Auto-expand parent when viewing a child article
  useEffect(() => {
    const currentArticle = articles.find(a => a.slug === currentSlug);
    if (currentArticle?.parentId) {
      setExpandedParents(prev => new Set([...prev, currentArticle.parentId!]));
    }
  }, [currentSlug, articles]);

  const fetchArticles = async () => {
    try {
      const q = query(collection(db, 'documentation'));
      const snapshot = await getDocs(q);
      const allDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DocArticle[];

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

  // Get current article and its context
  const currentArticle = useMemo(() =>
    articles.find(a => a.slug === currentSlug),
    [articles, currentSlug]
  );

  // Determine current parent context
  // Returns: parent ID if viewing a parent with children or a child article
  // Returns: null if viewing a standalone article (show all top-level)
  const currentParentId = useMemo(() => {
    if (!currentArticle) return null;

    // If current article has a parent, show that parent's context
    if (currentArticle.parentId) {
      return currentArticle.parentId;
    }

    // If current article is a parent (has children), show its context
    const hasChildren = articles.some(a => a.parentId === currentArticle.id);
    if (hasChildren) {
      return currentArticle.id;
    }

    // Standalone article (no parent, no children) - show ONLY this article
    return currentArticle.id;
  }, [currentArticle, articles]);

  // Build hierarchical structure - but now respects currentParentId for standalone articles too
  const buildTree = (articles: DocArticle[]): ArticleWithChildren[] => {
    const parentArticles = articles.filter(a => !a.parentId);
    const childArticles = articles.filter(a => a.parentId);

    return parentArticles.map(parent => ({
      ...parent,
      children: childArticles.filter(child => child.parentId === parent.id)
    }));
  };

  // Get filtered tree based on current context
  const getContextualTree = useMemo((): ArticleWithChildren[] => {
    const fullTree = buildTree(articles);

    // If searching, filter by search query across all articles
    if (searchQuery) {
      return fullTree.filter(parent =>
        parent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.children.some(child => child.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // If no article is currently viewed (landing page), show full tree
    if (!currentArticle) {
      return fullTree;
    }

    // Always filter to show only current article's tree
    // For parent articles: show self + children
    // For child articles: show parent + siblings
    // For standalone articles: show just self
    return fullTree.filter(parent => parent.id === currentParentId);
  }, [articles, currentParentId, currentArticle, searchQuery]);

  const toggleParent = (e: React.MouseEvent, parentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedParents(prev => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  };

  // Get previous and next articles for navigation
  const getSiblingNavigation = useMemo(() => {
    if (!currentArticle) return { prev: null, next: null };

    // Get all articles in the same context (same parent or all top-level)
    let siblingArticles: DocArticle[];
    if (currentArticle.parentId) {
      // Current is a child - siblings are other children of same parent + parent itself
      const parent = articles.find(a => a.id === currentArticle.parentId);
      const children = articles.filter(a => a.parentId === currentArticle.parentId);
      siblingArticles = parent ? [parent, ...children] : children;
    } else {
      // Current is a parent - siblings are parent + its children
      const children = articles.filter(a => a.parentId === currentArticle.id);
      siblingArticles = [currentArticle, ...children];
    }

    siblingArticles.sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentIndex = siblingArticles.findIndex(a => a.id === currentArticle.id);

    return {
      prev: currentIndex > 0 ? siblingArticles[currentIndex - 1] : null,
      next: currentIndex < siblingArticles.length - 1 ? siblingArticles[currentIndex + 1] : null
    };
  }, [currentArticle, articles]);

  // Check if current page is this article or one of its children
  const isParentActive = (article: ArticleWithChildren) => {
    if (currentSlug === article.slug) return true;
    return article.children.some(child => currentSlug === child.slug);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-8 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        ) : getContextualTree.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No articles found</p>
          </div>
        ) : (
          <nav className="space-y-1">
            {getContextualTree.map((article) => (
              <div key={article.id}>
                {/* Parent Article - Now with separate chevron and clickable title */}
                <div className="flex items-center">
                  {article.children.length > 0 ? (
                    <div className={cn(
                      "flex items-center w-full rounded-lg transition-colors",
                      isParentActive(article)
                        ? "bg-primary/10"
                        : "hover:bg-muted/50"
                    )}>
                      {/* Chevron toggle button */}
                      <button
                        onClick={(e) => toggleParent(e, article.id)}
                        className="p-2 hover:bg-muted/50 rounded-l-lg"
                      >
                        {expandedParents.has(article.id) ? (
                          <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                      {/* Clickable title link */}
                      <Link
                        to={`/docs/${article.slug}`}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex-1 py-2 pr-3 text-sm transition-colors",
                          currentSlug === article.slug
                            ? "text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span className="truncate">{article.title}</span>
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to={`/docs/${article.slug}`}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors w-full",
                        currentSlug === article.slug
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <ChevronRight className={cn(
                        "h-3 w-3 transition-transform flex-shrink-0",
                        currentSlug === article.slug && "text-primary"
                      )} />
                      <span className="truncate">{article.title}</span>
                    </Link>
                  )}
                </div>

                {/* Child Articles */}
                {article.children.length > 0 && expandedParents.has(article.id) && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-border/50 pl-2">
                    {article.children.map((child) => (
                      <Link
                        key={child.id}
                        to={`/docs/${child.slug}`}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                          currentSlug === child.slug
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <ChevronRight className={cn(
                          "h-3 w-3 transition-transform flex-shrink-0",
                          currentSlug === child.slug && "text-primary"
                        )} />
                        <span className="truncate">{child.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </ScrollArea>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-muted/30 h-[calc(100vh-4rem)] sticky top-16">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold">Documentation</span>
            </div>
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="max-w-4xl mx-auto px-6 py-8 lg:px-8">
            <Outlet context={{ articles, siblingNavigation: getSiblingNavigation }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentationLayout;
