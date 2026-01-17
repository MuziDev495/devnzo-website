/**
 * Documentation Layout
 * GitBook-style two-column layout with sidebar navigation and search
 */

import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Menu, BookOpen, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';

export interface DocArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  order: number;
  parentId?: string;
  visible: boolean;
}

const DocumentationLayout: React.FC = () => {
  const [articles, setArticles] = useState<DocArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentSlug = location.pathname.replace('/docs/', '').replace('/docs', '');

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

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No articles found</p>
          </div>
        ) : (
          <nav className="space-y-1">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                to={`/docs/${article.slug}`}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                  currentSlug === article.slug
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <ChevronRight className={cn(
                  "h-3 w-3 transition-transform",
                  currentSlug === article.slug && "text-primary"
                )} />
                <span className="truncate">{article.title}</span>
              </Link>
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
            <Outlet context={{ articles }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentationLayout;
