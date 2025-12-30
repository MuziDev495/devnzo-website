/**
 * Page Editor Admin Component
 * Edit individual page content, sections, and SEO settings
 * Supports both core pages (section toggles) and custom pages (full content editing)
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  GripVertical,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Undo,
  Redo,
  ImageIcon,
  LinkIcon,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PageSection {
  visible: boolean;
  title?: string;
  content?: Record<string, any>;
}

interface PageData {
  isActive: boolean;
  isCustom?: boolean;
  template?: string;
  title?: string;
  path?: string;
  description?: string;
  lastUpdated?: Date;
  seo?: {
    title: string;
    description: string;
  };
  sections: Record<string, PageSection>;
  // Content fields for custom pages
  featuredImage?: string;
  content?: string;
  excerpt?: string;
  // Display location settings
  showInHeader?: boolean;
  showInFooterCompany?: boolean;
  showInFooterResources?: boolean;
  headerOrder?: number;
  footerOrder?: number;
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
  const [searchParams] = useSearchParams();
  const isNewPage = searchParams.get('new') === 'true';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [pageData, setPageData] = useState<PageData>({
    isActive: true,
    seo: { title: '', description: '' },
    sections: {},
    featuredImage: '',
    content: '',
    excerpt: ''
  });

  const isCorePage = pageInfo[pageId || ''] !== undefined;
  const currentPageInfo = isCorePage 
    ? pageInfo[pageId || ''] 
    : { title: pageData.title || 'Custom Page', description: pageData.description || '' };
  const availableSections = isCorePage 
    ? (pageSections[pageId || ''] || [])
    : Object.entries(pageData.sections || {}).map(([key, section]) => ({
        key,
        label: section.title || key,
        description: `Custom section`
      }));

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TiptapLink.configure({
        openOnClick: false,
      }),
    ],
    content: pageData.content || '',
    onUpdate: ({ editor }) => {
      setPageData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (pageId) {
      fetchPageData();
    }
  }, [pageId]);

  useEffect(() => {
    if (editor && pageData.content && editor.getHTML() !== pageData.content) {
      editor.commands.setContent(pageData.content);
    }
  }, [pageData.content, editor]);

  const fetchPageData = async () => {
    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const existingPageData = data.pages?.[pageId!];
        
        if (isCorePage) {
          // Initialize sections with defaults for core pages
          const defaultSections: Record<string, PageSection> = {};
          (pageSections[pageId!] || []).forEach(section => {
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
        } else if (existingPageData) {
          // Custom page
          setPageData({
            isActive: existingPageData.isActive !== false,
            isCustom: existingPageData.isCustom,
            template: existingPageData.template,
            title: existingPageData.title,
            path: existingPageData.path,
            description: existingPageData.description,
            lastUpdated: existingPageData.lastUpdated?.toDate?.(),
            seo: existingPageData.seo || { title: '', description: '' },
            sections: existingPageData.sections || {},
            featuredImage: existingPageData.featuredImage || '',
            content: existingPageData.content || '',
            excerpt: existingPageData.excerpt || ''
          });
        } else {
          // Page not found
          toast({
            title: "Error",
            description: "Page not found",
            variant: "destructive"
          });
          navigate('/admin/pages');
          return;
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
          ...existingData.pages?.[pageId],
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const storageRef = ref(storage, `page-images/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setPageData(prev => ({ ...prev, featuredImage: downloadURL }));
      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setImageUploading(false);
    }
  };

  const addImageToEditor = () => {
    const url = prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLinkToEditor = () => {
    const url = prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
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
            <a href={pageData.path || `/${pageId === 'homepage' ? '' : pageId}`} target="_blank" rel="noopener noreferrer">
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

      {isNewPage && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-sm">
              <strong>Welcome to your new page!</strong> Add your content below using the rich text editor, 
              upload a featured image, and configure which sections should be visible.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={pageData.isCustom ? "content" : "sections"} className="space-y-6">
        <TabsList>
          {pageData.isCustom && <TabsTrigger value="content">Content</TabsTrigger>}
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
        </TabsList>

        {/* Content Tab (for custom pages) */}
        {pageData.isCustom && (
          <TabsContent value="content" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Page Content</CardTitle>
                    <CardDescription>
                      Write your page content using the rich text editor
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Content</Label>
                      {/* Editor Toolbar */}
                      <div className="flex flex-wrap gap-1 p-2 border border-border rounded-t-lg bg-muted/50">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => editor?.chain().focus().toggleBold().run()}
                          className={editor?.isActive('bold') ? 'bg-muted' : ''}
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => editor?.chain().focus().toggleItalic().run()}
                          className={editor?.isActive('italic') ? 'bg-muted' : ''}
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                          className={editor?.isActive('heading') ? 'bg-muted' : ''}
                        >
                          <Heading2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => editor?.chain().focus().toggleBulletList().run()}
                          className={editor?.isActive('bulletList') ? 'bg-muted' : ''}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                          className={editor?.isActive('orderedList') ? 'bg-muted' : ''}
                        >
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                          className={editor?.isActive('blockquote') ? 'bg-muted' : ''}
                        >
                          <Quote className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={addImageToEditor}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={addLinkToEditor}
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                        <div className="flex-1" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => editor?.chain().focus().undo().run()}
                        >
                          <Undo className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => editor?.chain().focus().redo().run()}
                        >
                          <Redo className="h-4 w-4" />
                        </Button>
                      </div>
                      {/* Editor Content */}
                      <div className="border border-t-0 border-border rounded-b-lg p-4 min-h-[300px] prose prose-sm max-w-none dark:prose-invert">
                        <EditorContent editor={editor} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt / Summary</Label>
                      <Textarea
                        id="excerpt"
                        value={pageData.excerpt || ''}
                        onChange={(e) => setPageData(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Brief summary of this page..."
                        rows={3}
                      />
                      <p className="text-sm text-muted-foreground">
                        Used for previews and search results
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Featured Image */}
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Image</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pageData.featuredImage && (
                      <img 
                        src={pageData.featuredImage} 
                        alt="Featured" 
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {imageUploading ? 'Uploading...' : 'Upload image'}
                          </span>
                        </div>
                      </Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={imageUploading}
                        className="hidden"
                      />
                    </div>
                    <div className="text-center text-sm text-muted-foreground">or</div>
                    <Input
                      placeholder="Image URL"
                      value={pageData.featuredImage || ''}
                      onChange={(e) => setPageData(prev => ({ ...prev, featuredImage: e.target.value }))}
                    />
                  </CardContent>
                </Card>

                {/* Page Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Page Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Template</Label>
                      <p className="text-sm text-muted-foreground capitalize">{pageData.template || 'Custom'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>URL Path</Label>
                      <code className="text-sm bg-muted px-2 py-1 rounded block">{pageData.path}</code>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <Label className="text-base font-semibold">Display Locations</Label>
                      <p className="text-sm text-muted-foreground mb-4">Choose where this page appears in navigation</p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-medium">Header Navigation</Label>
                            <p className="text-xs text-muted-foreground">Show in main menu</p>
                          </div>
                          <Switch
                            checked={pageData.showInHeader || false}
                            onCheckedChange={(checked) => setPageData(prev => ({ ...prev, showInHeader: checked }))}
                          />
                        </div>
                        
                        {pageData.showInHeader && (
                          <div className="ml-4 space-y-2">
                            <Label className="text-xs">Menu Order</Label>
                            <Input
                              type="number"
                              min={0}
                              value={pageData.headerOrder ?? 99}
                              onChange={(e) => setPageData(prev => ({ ...prev, headerOrder: parseInt(e.target.value) || 0 }))}
                              className="h-8 w-20"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-medium">Footer - Company</Label>
                            <p className="text-xs text-muted-foreground">Show in Company links</p>
                          </div>
                          <Switch
                            checked={pageData.showInFooterCompany || false}
                            onCheckedChange={(checked) => setPageData(prev => ({ ...prev, showInFooterCompany: checked }))}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-medium">Footer - Resources</Label>
                            <p className="text-xs text-muted-foreground">Show in Resources links</p>
                          </div>
                          <Switch
                            checked={pageData.showInFooterResources || false}
                            onCheckedChange={(checked) => setPageData(prev => ({ ...prev, showInFooterResources: checked }))}
                          />
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-4 italic">
                        Tip: Unchecking all options hides the page from menus (still accessible via URL)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}

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
              {availableSections.length > 0 ? (
                availableSections.map((section) => {
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
                })
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No sections configured for this page.
                </p>
              )}
            </CardContent>
          </Card>

          {isCorePage && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> To edit the actual content of each section (text, images, etc.), 
                  go to <Link to="/admin/content" className="text-primary hover:underline">Content Manager</Link> and 
                  select the corresponding page tab.
                </p>
              </CardContent>
            </Card>
          )}
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
                  Recommended: 50-60 characters ({(pageData.seo?.title || '').length}/60)
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
                  Recommended: 150-160 characters ({(pageData.seo?.description || '').length}/160)
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