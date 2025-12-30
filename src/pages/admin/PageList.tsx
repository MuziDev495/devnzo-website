/**
 * Page List Admin Component
 * Displays all manageable pages with edit/visibility options
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Home, 
  Package, 
  Users, 
  Mail, 
  Handshake, 
  BookOpen, 
  Pencil,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface PageConfig {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  description: string;
  isActive: boolean;
  lastUpdated?: Date;
  sectionsCount?: number;
}

const defaultPages: PageConfig[] = [
  {
    id: 'homepage',
    title: 'Homepage',
    path: '/',
    icon: <Home className="h-5 w-5" />,
    description: 'Main landing page with hero, features, and stats',
    isActive: true,
  },
  {
    id: 'products',
    title: 'Products',
    path: '/products',
    icon: <Package className="h-5 w-5" />,
    description: 'Product showcase with ecosystem apps and tools',
    isActive: true,
  },
  {
    id: 'about',
    title: 'About',
    path: '/about',
    icon: <Users className="h-5 w-5" />,
    description: 'Company information, mission, and team',
    isActive: true,
  },
  {
    id: 'contact',
    title: 'Contact',
    path: '/contact',
    icon: <Mail className="h-5 w-5" />,
    description: 'Contact form and company information',
    isActive: true,
  },
  {
    id: 'partners',
    title: 'Partners',
    path: '/partners',
    icon: <Handshake className="h-5 w-5" />,
    description: 'Partner program benefits and types',
    isActive: true,
  },
  {
    id: 'resources',
    title: 'Resources',
    path: '/resources',
    icon: <BookOpen className="h-5 w-5" />,
    description: 'Resource hub with guides and tools',
    isActive: true,
  },
];

const PageList: React.FC = () => {
  const [pages, setPages] = useState<PageConfig[]>(defaultPages);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const pagesData = data.pages || {};
        
        const updatedPages = defaultPages.map(page => {
          const pageData = pagesData[page.id];
          return {
            ...page,
            isActive: pageData?.isActive !== false,
            lastUpdated: pageData?.lastUpdated?.toDate?.() || undefined,
            sectionsCount: pageData?.sections ? Object.keys(pageData.sections).length : undefined,
          };
        });
        
        setPages(updatedPages);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: "Error",
        description: "Failed to load pages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePageVisibility = async (pageId: string, isActive: boolean) => {
    setSaving(pageId);
    
    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      const updatedPages = {
        ...existingData.pages,
        [pageId]: {
          ...(existingData.pages?.[pageId] || {}),
          isActive,
          lastUpdated: new Date()
        }
      };
      
      await setDoc(docRef, { ...existingData, pages: updatedPages }, { merge: true });
      
      setPages(prev => prev.map(p => 
        p.id === pageId ? { ...p, isActive, lastUpdated: new Date() } : p
      ));
      
      toast({
        title: "Success",
        description: `Page ${isActive ? 'enabled' : 'disabled'} successfully`
      });
    } catch (error) {
      console.error('Error updating page:', error);
      toast({
        title: "Error",
        description: "Failed to update page",
        variant: "destructive"
      });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground">Manage your website pages and their content</p>
        </div>
      </div>

      {/* Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Pages ({pages.length})</CardTitle>
          <CardDescription>
            Edit page content, toggle visibility, and manage sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {page.icon}
                        </div>
                        <div>
                          <p className="font-medium">{page.title}</p>
                          <p className="text-sm text-muted-foreground">{page.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {page.path}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={page.isActive}
                          onCheckedChange={(checked) => togglePageVisibility(page.id, checked)}
                          disabled={saving === page.id || page.id === 'homepage'}
                        />
                        <Badge variant={page.isActive ? 'default' : 'secondary'}>
                          {page.isActive ? 'Active' : 'Hidden'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {page.lastUpdated 
                        ? format(page.lastUpdated, 'MMM d, yyyy')
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a 
                            href={page.path} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link to={`/admin/pages/edit/${page.id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Page Visibility</h3>
              <p className="text-sm text-muted-foreground">
                Toggle pages on/off to control what visitors can see. Hidden pages will show a 404 error.
                The homepage cannot be hidden.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageList;
