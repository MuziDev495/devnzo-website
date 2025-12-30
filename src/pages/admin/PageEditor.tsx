/**
 * Page Editor Admin Component
 * Edit individual page content and section visibility
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Eye, Plus, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PageSection {
  visible: boolean;
  title?: string;
  content?: Record<string, any>;
}

interface PageData {
  isActive: boolean;
  lastUpdated?: Date;
  seo?: {
    title: string;
    description: string;
  };
  sections: Record<string, PageSection>;
}

// Define available sections for each page
const pageSections: Record<string, { key: string; label: string; description: string }[]> = {
  homepage: [
    { key: 'hero', label: 'Hero Section', description: 'Main banner with headline and CTA' },
    { key: 'partners', label: 'Partner Logos', description: 'Trusted by section with partner logos' },
    { key: 'features', label: 'Features Section', description: 'Key features grid' },
    { key: 'stats', label: 'Stats Section', description: 'Numbers and achievements' },
    { key: 'testimonials', label: 'Testimonials', description: 'Customer reviews' },
    { key: 'cta', label: 'CTA Section', description: 'Call to action banner' },
  ],
  products: [
    { key: 'hero', label: 'Hero Section', description: 'Product overview banner' },
    { key: 'ecosystem', label: 'Ecosystem Apps', description: 'App ecosystem showcase' },
    { key: 'tools', label: 'Tools Grid', description: 'Product tools listing' },
    { key: 'stats', label: 'Stats Section', description: 'Product statistics' },
    { key: 'testimonials', label: 'Testimonials', description: 'Customer testimonials' },
  ],
  about: [
    { key: 'hero', label: 'Hero Section', description: 'About us banner' },
    { key: 'mission', label: 'Mission Section', description: 'Company mission statement' },
    { key: 'stats', label: 'Stats Section', description: 'Company achievements' },
    { key: 'values', label: 'Values Section', description: 'Core values' },
    { key: 'team', label: 'Team Section', description: 'Team members' },
  ],
  contact: [
    { key: 'hero', label: 'Hero Section', description: 'Contact page banner' },
    { key: 'info', label: 'Contact Info', description: 'Contact details cards' },
    { key: 'form', label: 'Contact Form', description: 'Contact submission form' },
    { key: 'cta', label: 'CTA Section', description: 'Why choose us section' },
  ],
  partners: [
    { key: 'hero', label: 'Hero Section', description: 'Partners page banner' },
    { key: 'benefits', label: 'Benefits Section', description: 'Partner benefits' },
    { key: 'types', label: 'Partner Types', description: 'Types of partnerships' },
    { key: 'featured', label: 'Featured Partners', description: 'Logo showcase' },
    { key: 'cta', label: 'CTA Section', description: 'Become a partner CTA' },
  ],
  resources: [
    { key: 'hero', label: 'Hero Section', description: 'Resources page banner' },
    { key: 'categories', label: 'Resource Categories', description: 'Resource type cards' },
    { key: 'featured', label: 'Featured Resources', description: 'Highlighted resources' },
  ],
};

const pageInfo: Record<string, { title: string; description: string }> = {
  homepage: { title: 'Homepage', description: 'Main landing page' },
  products: { title: 'Products', description: 'Product showcase page' },
  about: { title: 'About', description: 'Company information page' },
  contact: { title: 'Contact', description: 'Contact form page' },
  partners: { title: 'Partners', description: 'Partner program page' },
  resources: { title: 'Resources', description: 'Resources hub page' },
};

const PageEditor: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<PageData>({
    isActive: true,
    seo: { title: '', description: '' },
    sections: {}
  });

  const currentPageInfo = pageInfo[pageId || ''] || { title: 'Page', description: '' };
  const availableSections = pageSections[pageId || ''] || [];

  useEffect(() => {
    if (pageId) {
      fetchPageData();
    }
  }, [pageId]);

  const fetchPageData = async () => {
    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const existingPageData = data.pages?.[pageId!];
        
        // Initialize sections with defaults
        const defaultSections: Record<string, PageSection> = {};
        availableSections.forEach(section => {
          defaultSections[section.key] = {
            visible: true,
            title: section.label,
            content: {}
          };
        });
        
        if (existingPageData) {
          setPageData({
            isActive: existingPageData.isActive !== false,
            lastUpdated: existingPageData.lastUpdated?.toDate?.(),
            seo: existingPageData.seo || { title: '', description: '' },
            sections: { ...defaultSections, ...existingPageData.sections }
          });
        } else {
          setPageData({
            isActive: true,
            seo: { title: '', description: '' },
            sections: defaultSections
          });
        }
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
      toast({
        title: "Error",
        description: "Failed to load page data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!pageId) return;
    
    setSaving(true);
    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      const updatedPages = {
        ...existingData.pages,
        [pageId]: {
          ...pageData,
          lastUpdated: new Date()
        }
      };
      
      await setDoc(docRef, { ...existingData, pages: updatedPages }, { merge: true });
      
      toast({
        title: "Success",
        description: "Page saved successfully"
      });
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (sectionKey: string, visible: boolean) => {
    setPageData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          visible
        }
      }
    }));
  };

  const updateSEO = (field: 'title' | 'description', value: string) => {
    setPageData(prev => ({
      ...prev,
      seo: {
        ...prev.seo!,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pageId || !pageInfo[pageId]) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-4">The page you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/admin/pages">Back to Pages</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/pages">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{currentPageInfo.title}</h1>
            <p className="text-muted-foreground">{currentPageInfo.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            asChild
          >
            <a href={`/${pageId === 'homepage' ? '' : pageId}`} target="_blank" rel="noopener noreferrer">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </a>
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sections" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
        </TabsList>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Visibility</CardTitle>
              <CardDescription>
                Toggle which sections are visible on this page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableSections.map((section) => {
                const sectionData = pageData.sections[section.key];
                return (
                  <div 
                    key={section.key}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{section.label}</p>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {sectionData?.visible !== false ? 'Visible' : 'Hidden'}
                      </span>
                      <Switch
                        checked={sectionData?.visible !== false}
                        onCheckedChange={(checked) => toggleSection(section.key, checked)}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> To edit the actual content of each section (text, images, etc.), 
                go to <Link to="/admin/content" className="text-primary hover:underline">Content Manager</Link> and 
                select the corresponding page tab.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize this page for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={pageData.seo?.title || ''}
                  onChange={(e) => updateSEO('title', e.target.value)}
                  placeholder={`${currentPageInfo.title} | Devnzo`}
                />
                <p className="text-sm text-muted-foreground">
                  Recommended: 50-60 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={pageData.seo?.description || ''}
                  onChange={(e) => updateSEO('description', e.target.value)}
                  placeholder="A brief description of this page for search engines..."
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Recommended: 150-160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageEditor;
