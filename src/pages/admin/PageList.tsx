/**
 * Page List Admin Component
 * Displays all manageable pages with edit/visibility options
 * Supports creating new pages from templates or custom
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Home, 
  Package, 
  Users, 
  Mail, 
  Handshake, 
  BookOpen, 
  Pencil,
  Eye,
  ExternalLink,
  Plus,
  FileText,
  HelpCircle,
  DollarSign,
  UsersRound,
  Layout,
  Trash2,
  FileQuestion
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface PageConfig {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  iconName: string;
  description: string;
  isActive: boolean;
  lastUpdated?: Date;
  sectionsCount?: number;
  isCustom?: boolean;
  template?: string;
}

interface PageTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconName: string;
  sections: { key: string; label: string; description: string }[];
}

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="h-5 w-5" />,
  Package: <Package className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Mail: <Mail className="h-5 w-5" />,
  Handshake: <Handshake className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
  FileText: <FileText className="h-5 w-5" />,
  HelpCircle: <HelpCircle className="h-5 w-5" />,
  DollarSign: <DollarSign className="h-5 w-5" />,
  UsersRound: <UsersRound className="h-5 w-5" />,
  Layout: <Layout className="h-5 w-5" />,
  FileQuestion: <FileQuestion className="h-5 w-5" />,
};

const defaultPages: PageConfig[] = [
  {
    id: 'homepage',
    title: 'Homepage',
    path: '/',
    icon: <Home className="h-5 w-5" />,
    iconName: 'Home',
    description: 'Main landing page with hero, features, and stats',
    isActive: true,
    isCustom: false,
  },
  {
    id: 'products',
    title: 'Products',
    path: '/products',
    icon: <Package className="h-5 w-5" />,
    iconName: 'Package',
    description: 'Product showcase with ecosystem apps and tools',
    isActive: true,
    isCustom: false,
  },
  {
    id: 'about',
    title: 'About',
    path: '/about',
    icon: <Users className="h-5 w-5" />,
    iconName: 'Users',
    description: 'Company information, mission, and team',
    isActive: true,
    isCustom: false,
  },
  {
    id: 'contact',
    title: 'Contact',
    path: '/contact',
    icon: <Mail className="h-5 w-5" />,
    iconName: 'Mail',
    description: 'Contact form and company information',
    isActive: true,
    isCustom: false,
  },
  {
    id: 'partners',
    title: 'Partners',
    path: '/partners',
    icon: <Handshake className="h-5 w-5" />,
    iconName: 'Handshake',
    description: 'Partner program benefits and types',
    isActive: true,
    isCustom: false,
  },
  {
    id: 'resources',
    title: 'Resources',
    path: '/resources',
    icon: <BookOpen className="h-5 w-5" />,
    iconName: 'BookOpen',
    description: 'Resource hub with guides and tools',
    isActive: true,
    isCustom: false,
  },
];

const pageTemplates: PageTemplate[] = [
  {
    id: 'faq',
    name: 'FAQ Page',
    description: 'Frequently asked questions with expandable answers',
    icon: <HelpCircle className="h-8 w-8" />,
    iconName: 'HelpCircle',
    sections: [
      { key: 'hero', label: 'Hero Section', description: 'Page title and description' },
      { key: 'categories', label: 'FAQ Categories', description: 'Question categories' },
      { key: 'questions', label: 'Questions', description: 'FAQ items' },
      { key: 'cta', label: 'CTA Section', description: 'Contact support CTA' },
    ],
  },
  {
    id: 'pricing',
    name: 'Pricing Page',
    description: 'Pricing plans with features comparison',
    icon: <DollarSign className="h-8 w-8" />,
    iconName: 'DollarSign',
    sections: [
      { key: 'hero', label: 'Hero Section', description: 'Pricing page headline' },
      { key: 'plans', label: 'Pricing Plans', description: 'Plan cards with features' },
      { key: 'comparison', label: 'Feature Comparison', description: 'Detailed comparison table' },
      { key: 'faq', label: 'FAQ Section', description: 'Pricing FAQs' },
    ],
  },
  {
    id: 'team',
    name: 'Team Page',
    description: 'Team members with bios and photos',
    icon: <UsersRound className="h-8 w-8" />,
    iconName: 'UsersRound',
    sections: [
      { key: 'hero', label: 'Hero Section', description: 'Team page introduction' },
      { key: 'leadership', label: 'Leadership', description: 'Executive team members' },
      { key: 'team', label: 'Team Members', description: 'Full team grid' },
      { key: 'careers', label: 'Careers CTA', description: 'Join the team section' },
    ],
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Generic landing page with customizable sections',
    icon: <Layout className="h-8 w-8" />,
    iconName: 'Layout',
    sections: [
      { key: 'hero', label: 'Hero Section', description: 'Main headline and CTA' },
      { key: 'features', label: 'Features', description: 'Key benefits grid' },
      { key: 'content', label: 'Content Section', description: 'Rich text content area' },
      { key: 'cta', label: 'CTA Section', description: 'Call to action banner' },
    ],
  },
  {
    id: 'custom',
    name: 'Custom Page',
    description: 'Blank page - requires developer to create the component',
    icon: <FileText className="h-8 w-8" />,
    iconName: 'FileText',
    sections: [
      { key: 'content', label: 'Content', description: 'Custom content area' },
    ],
  },
];

const PageList: React.FC = () => {
  const [pages, setPages] = useState<PageConfig[]>(defaultPages);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageDescription, setNewPageDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        
        // Start with default pages
        const updatedPages = defaultPages.map(page => {
          const pageData = pagesData[page.id];
          return {
            ...page,
            isActive: pageData?.isActive !== false,
            lastUpdated: pageData?.lastUpdated?.toDate?.() || undefined,
            sectionsCount: pageData?.sections ? Object.keys(pageData.sections).length : undefined,
          };
        });
        
        // Add custom pages from Firestore
        Object.entries(pagesData).forEach(([pageId, pageData]: [string, any]) => {
          if (pageData.isCustom && !updatedPages.find(p => p.id === pageId)) {
            updatedPages.push({
              id: pageId,
              title: pageData.title || pageId,
              path: pageData.path || `/${pageId}`,
              icon: iconMap[pageData.iconName] || <FileText className="h-5 w-5" />,
              iconName: pageData.iconName || 'FileText',
              description: pageData.description || 'Custom page',
              isActive: pageData.isActive !== false,
              lastUpdated: pageData.lastUpdated?.toDate?.() || undefined,
              sectionsCount: pageData.sections ? Object.keys(pageData.sections).length : undefined,
              isCustom: true,
              template: pageData.template,
            });
          }
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

  const handleCreatePage = async () => {
    if (!selectedTemplate || !newPageTitle.trim() || !newPageSlug.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Validate slug
    const slug = newPageSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    if (pages.some(p => p.path === `/${slug}`)) {
      toast({
        title: "Error",
        description: "A page with this URL already exists",
        variant: "destructive"
      });
      return;
    }

    setCreating(true);
    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};

      // Create sections from template
      const sections: Record<string, any> = {};
      selectedTemplate.sections.forEach(section => {
        sections[section.key] = {
          visible: true,
          title: section.label,
          content: {}
        };
      });

      const newPageData = {
        title: newPageTitle.trim(),
        path: `/${slug}`,
        description: newPageDescription.trim() || `${newPageTitle} page`,
        iconName: selectedTemplate.iconName,
        isActive: true,
        isCustom: true,
        template: selectedTemplate.id,
        sections,
        lastUpdated: new Date(),
        createdAt: new Date(),
      };

      const updatedPages = {
        ...existingData.pages,
        [slug]: newPageData
      };

      await setDoc(docRef, { ...existingData, pages: updatedPages }, { merge: true });

      toast({
        title: "Success",
        description: `Page "${newPageTitle}" created successfully`
      });

      // Reset form and close dialog
      setIsDialogOpen(false);
      setSelectedTemplate(null);
      setNewPageTitle('');
      setNewPageSlug('');
      setNewPageDescription('');
      
      // Refresh pages
      fetchPages();
      
      // Navigate to edit page
      navigate(`/admin/pages/edit/${slug}`);
    } catch (error) {
      console.error('Error creating page:', error);
      toast({
        title: "Error",
        description: "Failed to create page",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePage = async () => {
    if (!deletePageId) return;

    const pageToDelete = pages.find(p => p.id === deletePageId);
    if (!pageToDelete?.isCustom) {
      toast({
        title: "Error",
        description: "Cannot delete core pages",
        variant: "destructive"
      });
      return;
    }

    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};

      const updatedPages = { ...existingData.pages };
      delete updatedPages[deletePageId];

      await setDoc(docRef, { ...existingData, pages: updatedPages }, { merge: true });

      setPages(prev => prev.filter(p => p.id !== deletePageId));

      toast({
        title: "Success",
        description: "Page deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive"
      });
    } finally {
      setDeletePageId(null);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              New Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
              <DialogDescription>
                Choose a template or create a custom page
              </DialogDescription>
            </DialogHeader>

            {!selectedTemplate ? (
              <div className="grid grid-cols-2 gap-4 py-4">
                {pageTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className="p-4 border rounded-lg text-left hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {template.icon}
                      </div>
                      <h3 className="font-semibold">{template.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {selectedTemplate.icon}
                  </div>
                  <div>
                    <p className="font-medium">{selectedTemplate.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Change
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Page Title *</Label>
                  <Input
                    value={newPageTitle}
                    onChange={(e) => {
                      setNewPageTitle(e.target.value);
                      setNewPageSlug(generateSlug(e.target.value));
                    }}
                    placeholder="e.g., Pricing Plans"
                  />
                </div>

                <div className="space-y-2">
                  <Label>URL Slug *</Label>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-1">/</span>
                    <Input
                      value={newPageSlug}
                      onChange={(e) => setNewPageSlug(generateSlug(e.target.value))}
                      placeholder="pricing-plans"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The page will be available at: /{newPageSlug || 'your-page-slug'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newPageDescription}
                    onChange={(e) => setNewPageDescription(e.target.value)}
                    placeholder="Brief description of this page..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Included Sections</Label>
                  <div className="space-y-1">
                    {selectedTemplate.sections.map((section) => (
                      <div key={section.key} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded">
                        <Eye className="h-4 w-4 text-primary" />
                        <span className="font-medium">{section.label}</span>
                        <span className="text-muted-foreground">- {section.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedTemplate.id === 'custom' && (
                  <Card className="border-warning/50 bg-warning/5">
                    <CardContent className="pt-4">
                      <p className="text-sm">
                        <strong>Note:</strong> Custom pages require a developer to create the React component. 
                        The page will be registered in the CMS but won't display until the component is created.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                setSelectedTemplate(null);
                setNewPageTitle('');
                setNewPageSlug('');
                setNewPageDescription('');
              }}>
                Cancel
              </Button>
              {selectedTemplate && (
                <Button 
                  onClick={handleCreatePage}
                  disabled={creating || !newPageTitle.trim() || !newPageSlug.trim()}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {creating ? 'Creating...' : 'Create Page'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{page.title}</p>
                            {page.isCustom && (
                              <Badge variant="outline" className="text-xs">Custom</Badge>
                            )}
                          </div>
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
                        {page.isCustom && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeletePageId(page.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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
                The homepage cannot be hidden. Custom pages can be deleted.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePageId} onOpenChange={() => setDeletePageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this page? This action cannot be undone.
              All content and settings for this page will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PageList;
