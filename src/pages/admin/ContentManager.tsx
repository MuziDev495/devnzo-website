import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ============== Type Definitions ==============

interface HeroSection {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface EcosystemApp {
  name: string;
  color: string;
  icon: string;
}

interface Tool {
  name: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  price: string;
}

interface Testimonial {
  name: string;
  company: string;
  text: string;
  avatar: string;
  rating: number;
}

interface PartnerBenefit {
  icon: string;
  title: string;
  description: string;
}

interface PartnerType {
  title: string;
  description: string;
  features: string[];
}

interface FeaturedPartner {
  name: string;
  logo: string;
}

interface ResourceCard {
  icon: string;
  title: string;
  description: string;
  path: string;
  color: string;
}

interface NavItem {
  title: string;
  path: string;
}

interface FooterSection {
  company: NavItem[];
  resources: NavItem[];
  social: Array<{ title: string; path: string; icon: string }>;
  description: string;
  copyright: string;
}

interface PageContentData {
  homepage: {
    hero: HeroSection;
    features: Feature[];
    stats: Stat[];
  };
  about: {
    title: string;
    description: string;
    mission: string;
    vision: string;
    stats: Stat[];
  };
  contact: {
    title: string;
    description: string;
    email: string;
    phone: string;
    address: string;
  };
  products: {
    hero: HeroSection;
    ecosystemApps: EcosystemApp[];
    stats: Stat[];
    tools: Tool[];
    testimonials: Testimonial[];
  };
  partners: {
    hero: HeroSection;
    benefits: PartnerBenefit[];
    partnerTypes: PartnerType[];
    featuredPartners: FeaturedPartner[];
  };
  resources: {
    hero: HeroSection;
    cards: ResourceCard[];
  };
  navigation: {
    main: NavItem[];
    ctaText: string;
    ctaLink: string;
  };
  footer: FooterSection;
}

// ============== Default Content ==============

const defaultContent: PageContentData = {
  homepage: {
    hero: {
      title: 'Transform Your Business with Devnzo',
      subtitle: 'Enterprise-grade solutions for modern businesses',
      ctaText: 'Get Started',
      ctaLink: '/contact'
    },
    features: [
      { title: 'Analytics', description: 'Deep insights into your business', icon: '📊' },
      { title: 'Automation', description: 'Streamline your operations', icon: '⚡' },
      { title: 'Support', description: '24/7 expert assistance', icon: '💬' },
    ],
    stats: [
      { value: '100+', label: 'Clients' },
      { value: '50+', label: 'Projects' },
      { value: '99%', label: 'Satisfaction' },
    ],
  },
  about: {
    title: 'About Devnzo',
    description: 'We are a technology company dedicated to helping businesses grow.',
    mission: 'Our mission is to empower businesses with innovative solutions.',
    vision: 'Our vision is to be the leading provider of eCommerce solutions.',
    stats: [
      { value: '10+', label: 'Years Experience' },
      { value: '500+', label: 'Happy Clients' },
    ],
  },
  contact: {
    title: 'Get in Touch',
    description: 'We would love to hear from you',
    email: 'contact@devnzo.com',
    phone: '+1 234 567 890',
    address: '123 Business Street, City, Country',
  },
  products: {
    hero: {
      title: 'The Complete eCommerce Funnel',
      subtitle: 'Everything you need to build, grow, and scale your online business.',
      ctaText: 'Start Free Trial',
      ctaLink: '/contact'
    },
    ecosystemApps: [
      { name: 'Shopify', color: 'bg-success', icon: '🛍️' },
      { name: 'SEO', color: 'bg-accent', icon: '🔍' },
      { name: 'Analytics', color: 'bg-primary', icon: '📊' },
      { name: 'Marketing', color: 'bg-destructive', icon: '📢' },
      { name: 'CRM', color: 'bg-info', icon: '👥' },
      { name: 'Support', color: 'bg-warning', icon: '💬' },
    ],
    stats: [
      { value: '10+', label: 'Years' },
      { value: '30k+', label: 'Customers' },
      { value: '250k+', label: 'Projects' },
    ],
    tools: [
      { name: 'Bulk Image Optimizer', category: 'Image & File Optimization', description: 'Optimize your store images', rating: 4.8, reviews: 1234, price: 'Free' },
    ],
    testimonials: [
      { name: 'John Smith', company: 'E-Commerce Pro', text: 'Amazing tools!', avatar: '', rating: 5 },
    ],
  },
  partners: {
    hero: {
      title: 'Partner with Devnzo',
      subtitle: 'Join our growing ecosystem of partners.',
      ctaText: 'Become a Partner',
      ctaLink: '/contact'
    },
    benefits: [
      { icon: '📈', title: 'Revenue Growth', description: 'Earn competitive commissions' },
      { icon: '👥', title: 'Dedicated Support', description: 'Priority partner support' },
    ],
    partnerTypes: [
      { title: 'Agency Partners', description: 'For agencies', features: ['White-label', 'Bulk licensing'] },
    ],
    featuredPartners: [
      { name: 'Shopify', logo: '🛍️' },
      { name: 'Google', logo: '🔍' },
    ],
  },
  resources: {
    hero: {
      title: 'Resources',
      subtitle: 'Everything you need to succeed in eCommerce.',
      ctaText: 'Explore',
      ctaLink: '/resources'
    },
    cards: [
      { icon: '📚', title: 'Knowledge Base', description: 'Guides and tutorials', path: '/resources/knowledge', color: 'bg-accent/10' },
      { icon: '🛍️', title: 'Shopify Apps', description: 'Essential applications', path: '/resources/shopify-apps', color: 'bg-primary/10' },
    ],
  },
  navigation: {
    main: [
      { title: 'Products', path: '/products' },
      { title: 'Resources', path: '/resources' },
      { title: 'Partners', path: '/partners' },
      { title: 'About', path: '/about' },
      { title: 'Contact', path: '/contact' },
    ],
    ctaText: 'Start Free Trial',
    ctaLink: 'https://www.shopify.com/'
  },
  footer: {
    company: [
      { title: 'About Us', path: '/about' },
      { title: 'Contact', path: '/contact' },
      { title: 'Privacy Policy', path: '/privacy-policy' },
      { title: 'Terms of Service', path: '/terms-of-service' },
    ],
    resources: [
      { title: 'Blog', path: '/blog' },
      { title: 'Help Center', path: '/help-center' },
      { title: 'Documentation', path: '/documentation' },
    ],
    social: [
      { title: 'Twitter', path: 'https://twitter.com/Devnzo', icon: 'twitter' },
      { title: 'LinkedIn', path: 'https://linkedin.com/company/Devnzo', icon: 'linkedin' },
      { title: 'Facebook', path: 'https://facebook.com/Devnzo', icon: 'facebook' },
    ],
    description: 'Empowering businesses with innovative solutions for sustainable growth and success.',
    copyright: '© 2025 Devnzo. All rights reserved.'
  }
};

// ============== Main Component ==============

const ContentManager: React.FC = () => {
  const [content, setContent] = useState<PageContentData>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<PageContentData>;
        setContent({ ...defaultContent, ...data });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'page_content', 'main'), content);
      toast({
        title: "Success",
        description: "Content saved successfully"
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // ============== Helper Update Functions ==============

  const updateNestedField = (section: keyof PageContentData, subsection: string, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value
        }
      }
    }));
  };

  const updateField = (section: keyof PageContentData, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateArrayItem = (section: keyof PageContentData, field: string, index: number, key: string, value: any) => {
    setContent(prev => {
      const arr = [...(prev[section] as any)[field]];
      arr[index] = { ...arr[index], [key]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: arr
        }
      };
    });
  };

  const addArrayItem = (section: keyof PageContentData, field: string, newItem: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...(prev[section] as any)[field], newItem]
      }
    }));
  };

  const removeArrayItem = (section: keyof PageContentData, field: string, index: number) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section] as any)[field].filter((_: any, i: number) => i !== index)
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

  // ============== Render ==============

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Content Manager</h1>
          <p className="text-muted-foreground">Edit all website content from one place</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* =============== HOMEPAGE TAB =============== */}
        <TabsContent value="homepage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main banner content on the homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input
                    value={content.homepage.hero.title}
                    onChange={(e) => updateNestedField('homepage', 'hero', 'title', e.target.value)}
                    placeholder="Main headline"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Button Text</Label>
                  <Input
                    value={content.homepage.hero.ctaText}
                    onChange={(e) => updateNestedField('homepage', 'hero', 'ctaText', e.target.value)}
                    placeholder="Button text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Textarea
                  value={content.homepage.hero.subtitle}
                  onChange={(e) => updateNestedField('homepage', 'hero', 'subtitle', e.target.value)}
                  placeholder="Supporting text"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats Section</CardTitle>
              <CardDescription>Key numbers displayed on homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.homepage.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-4">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <Input
                      value={stat.value}
                      onChange={(e) => updateArrayItem('homepage', 'stats', index, 'value', e.target.value)}
                      placeholder="e.g., 100+"
                    />
                    <Input
                      value={stat.label}
                      onChange={(e) => updateArrayItem('homepage', 'stats', index, 'label', e.target.value)}
                      placeholder="e.g., Clients"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('homepage', 'stats', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('homepage', 'stats', { value: '', label: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Feature highlights on homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.homepage.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Input
                        value={feature.icon}
                        onChange={(e) => updateArrayItem('homepage', 'features', index, 'icon', e.target.value)}
                        placeholder="Icon emoji"
                      />
                      <Input
                        value={feature.title}
                        onChange={(e) => updateArrayItem('homepage', 'features', index, 'title', e.target.value)}
                        placeholder="Feature title"
                        className="md:col-span-2"
                      />
                    </div>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => updateArrayItem('homepage', 'features', index, 'description', e.target.value)}
                      placeholder="Description"
                      rows={2}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('homepage', 'features', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('homepage', 'features', { icon: '⭐', title: '', description: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =============== ABOUT TAB =============== */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Page Content</CardTitle>
              <CardDescription>Company information and story</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={content.about.title}
                  onChange={(e) => updateField('about', 'title', e.target.value)}
                  placeholder="About page title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content.about.description}
                  onChange={(e) => updateField('about', 'description', e.target.value)}
                  placeholder="Company description"
                  rows={4}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mission Statement</Label>
                  <Textarea
                    value={content.about.mission}
                    onChange={(e) => updateField('about', 'mission', e.target.value)}
                    placeholder="Our mission..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vision Statement</Label>
                  <Textarea
                    value={content.about.vision}
                    onChange={(e) => updateField('about', 'vision', e.target.value)}
                    placeholder="Our vision..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =============== CONTACT TAB =============== */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Page Content</CardTitle>
              <CardDescription>Contact information and page text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Page Title</Label>
                  <Input
                    value={content.contact.title}
                    onChange={(e) => updateField('contact', 'title', e.target.value)}
                    placeholder="Contact page title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) => updateField('contact', 'email', e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content.contact.description}
                  onChange={(e) => updateField('contact', 'description', e.target.value)}
                  placeholder="Contact page description"
                  rows={2}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={content.contact.phone}
                    onChange={(e) => updateField('contact', 'phone', e.target.value)}
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={content.contact.address}
                    onChange={(e) => updateField('contact', 'address', e.target.value)}
                    placeholder="Full address"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =============== PRODUCTS TAB =============== */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Products Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input
                    value={content.products.hero.title}
                    onChange={(e) => updateNestedField('products', 'hero', 'title', e.target.value)}
                    placeholder="Main headline"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Button Text</Label>
                  <Input
                    value={content.products.hero.ctaText}
                    onChange={(e) => updateNestedField('products', 'hero', 'ctaText', e.target.value)}
                    placeholder="Button text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Textarea
                  value={content.products.hero.subtitle}
                  onChange={(e) => updateNestedField('products', 'hero', 'subtitle', e.target.value)}
                  placeholder="Supporting text"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ecosystem Apps</CardTitle>
              <CardDescription>App icons displayed in ecosystem section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.products.ecosystemApps.map((app, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <Input
                      value={app.icon}
                      onChange={(e) => updateArrayItem('products', 'ecosystemApps', index, 'icon', e.target.value)}
                      placeholder="Icon emoji"
                    />
                    <Input
                      value={app.name}
                      onChange={(e) => updateArrayItem('products', 'ecosystemApps', index, 'name', e.target.value)}
                      placeholder="App name"
                    />
                    <Input
                      value={app.color}
                      onChange={(e) => updateArrayItem('products', 'ecosystemApps', index, 'color', e.target.value)}
                      placeholder="e.g., bg-success"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('products', 'ecosystemApps', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('products', 'ecosystemApps', { name: '', icon: '⭐', color: 'bg-primary' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add App
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.products.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <Input
                      value={stat.value}
                      onChange={(e) => updateArrayItem('products', 'stats', index, 'value', e.target.value)}
                      placeholder="Value"
                    />
                    <Input
                      value={stat.label}
                      onChange={(e) => updateArrayItem('products', 'stats', index, 'label', e.target.value)}
                      placeholder="Label"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('products', 'stats', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('products', 'stats', { value: '', label: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stat
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =============== PARTNERS TAB =============== */}
        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partners Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input
                    value={content.partners.hero.title}
                    onChange={(e) => updateNestedField('partners', 'hero', 'title', e.target.value)}
                    placeholder="Main headline"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Button Text</Label>
                  <Input
                    value={content.partners.hero.ctaText}
                    onChange={(e) => updateNestedField('partners', 'hero', 'ctaText', e.target.value)}
                    placeholder="Button text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Textarea
                  value={content.partners.hero.subtitle}
                  onChange={(e) => updateNestedField('partners', 'hero', 'subtitle', e.target.value)}
                  placeholder="Supporting text"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Partners</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.partners.featuredPartners.map((partner, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <Input
                      value={partner.logo}
                      onChange={(e) => updateArrayItem('partners', 'featuredPartners', index, 'logo', e.target.value)}
                      placeholder="Logo emoji or URL"
                    />
                    <Input
                      value={partner.name}
                      onChange={(e) => updateArrayItem('partners', 'featuredPartners', index, 'name', e.target.value)}
                      placeholder="Partner name"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('partners', 'featuredPartners', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('partners', 'featuredPartners', { name: '', logo: '🏢' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Partner
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =============== RESOURCES TAB =============== */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resources Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input
                    value={content.resources.hero.title}
                    onChange={(e) => updateNestedField('resources', 'hero', 'title', e.target.value)}
                    placeholder="Main headline"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Button Text</Label>
                  <Input
                    value={content.resources.hero.ctaText}
                    onChange={(e) => updateNestedField('resources', 'hero', 'ctaText', e.target.value)}
                    placeholder="Button text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Textarea
                  value={content.resources.hero.subtitle}
                  onChange={(e) => updateNestedField('resources', 'hero', 'subtitle', e.target.value)}
                  placeholder="Supporting text"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resource Cards</CardTitle>
              <CardDescription>Cards displayed on the resources page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.resources.cards.map((card, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-4">
                    <div className="grid md:grid-cols-4 gap-4">
                      <Input
                        value={card.icon}
                        onChange={(e) => updateArrayItem('resources', 'cards', index, 'icon', e.target.value)}
                        placeholder="Icon"
                      />
                      <Input
                        value={card.title}
                        onChange={(e) => updateArrayItem('resources', 'cards', index, 'title', e.target.value)}
                        placeholder="Title"
                        className="md:col-span-2"
                      />
                      <Input
                        value={card.path}
                        onChange={(e) => updateArrayItem('resources', 'cards', index, 'path', e.target.value)}
                        placeholder="Path e.g. /resources/blog"
                      />
                    </div>
                    <Textarea
                      value={card.description}
                      onChange={(e) => updateArrayItem('resources', 'cards', index, 'description', e.target.value)}
                      placeholder="Description"
                      rows={2}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('resources', 'cards', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('resources', 'cards', { icon: '📚', title: '', description: '', path: '', color: 'bg-primary/10' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Resource Card
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =============== NAVIGATION TAB =============== */}
        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Main Navigation</CardTitle>
              <CardDescription>Header navigation links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.navigation.main.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <Input
                      value={item.title}
                      onChange={(e) => updateArrayItem('navigation', 'main', index, 'title', e.target.value)}
                      placeholder="Link text"
                    />
                    <Input
                      value={item.path}
                      onChange={(e) => updateArrayItem('navigation', 'main', index, 'path', e.target.value)}
                      placeholder="Path e.g. /about"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('navigation', 'main', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('navigation', 'main', { title: '', path: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Navigation Item
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CTA Button</CardTitle>
              <CardDescription>Header call-to-action button</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input
                    value={content.navigation.ctaText}
                    onChange={(e) => updateField('navigation', 'ctaText', e.target.value)}
                    placeholder="e.g., Start Free Trial"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Link</Label>
                  <Input
                    value={content.navigation.ctaLink}
                    onChange={(e) => updateField('navigation', 'ctaLink', e.target.value)}
                    placeholder="e.g., https://shopify.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =============== FOOTER TAB =============== */}
        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer Content</CardTitle>
              <CardDescription>Description and copyright text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Footer Description</Label>
                <Textarea
                  value={content.footer.description}
                  onChange={(e) => updateField('footer', 'description', e.target.value)}
                  placeholder="Company description for footer"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Copyright Text</Label>
                <Input
                  value={content.footer.copyright}
                  onChange={(e) => updateField('footer', 'copyright', e.target.value)}
                  placeholder="© 2025 Company. All rights reserved."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.footer.company.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <Input
                      value={item.title}
                      onChange={(e) => updateArrayItem('footer', 'company', index, 'title', e.target.value)}
                      placeholder="Link text"
                    />
                    <Input
                      value={item.path}
                      onChange={(e) => updateArrayItem('footer', 'company', index, 'path', e.target.value)}
                      placeholder="Path"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('footer', 'company', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('footer', 'company', { title: '', path: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Company Link
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resources Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.footer.resources.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <Input
                      value={item.title}
                      onChange={(e) => updateArrayItem('footer', 'resources', index, 'title', e.target.value)}
                      placeholder="Link text"
                    />
                    <Input
                      value={item.path}
                      onChange={(e) => updateArrayItem('footer', 'resources', index, 'path', e.target.value)}
                      placeholder="Path"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('footer', 'resources', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('footer', 'resources', { title: '', path: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Resources Link
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.footer.social.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <Input
                      value={item.title}
                      onChange={(e) => updateArrayItem('footer', 'social', index, 'title', e.target.value)}
                      placeholder="Platform name"
                    />
                    <Input
                      value={item.path}
                      onChange={(e) => updateArrayItem('footer', 'social', index, 'path', e.target.value)}
                      placeholder="URL"
                    />
                    <Input
                      value={item.icon}
                      onChange={(e) => updateArrayItem('footer', 'social', index, 'icon', e.target.value)}
                      placeholder="Icon: twitter, linkedin, etc."
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('footer', 'social', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('footer', 'social', { title: '', path: '', icon: 'twitter' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Social Link
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;
