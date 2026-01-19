import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { IconPicker } from '@/components/admin/IconPicker';
import saadImage from '@/components/image/saad.jpg';
import muzzamilImage from '@/components/image/Muzzamil.jpg';
import umarImage from '@/components/image/umar.jpg';

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
  image?: string;
  link?: string;
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

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

interface CompanyValue {
  icon: string;
  title: string;
  description: string;
}

interface MissionSection {
  imageUrl: string;
  badgeText: string;
  badgeSubtext: string;
}

interface NavItem {
  title: string;
  path: string;
  order?: number;
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
    team: TeamMember[];
    values: CompanyValue[];
    missionSection: MissionSection;
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
    description: "We're on a mission to empower businesses worldwide with innovative technology solutions that drive sustainable growth and success.",
    mission: 'At Devnzo, we believe every business deserves access to powerful, enterprise-grade tools that were once only available to large corporations. Our mission is to democratize technology and empower businesses of all sizes to compete and succeed in the digital age.',
    vision: "Since our founding, we've helped over 50,000 businesses across 150+ countries transform their operations, increase efficiency, and achieve remarkable growth.",
    stats: [
      { value: '50K+', label: 'Active Users' },
      { value: '99.9%', label: 'Uptime' },
      { value: '500M+', label: 'Transactions' },
      { value: '200+', label: 'Team Members' },
    ],
    team: [
      {
        name: "Saad Muneeb Khan",
        role: "CEO & Founder",
        image: saadImage,
        description: "Visionary leader with 15+ years in tech and eCommerce.",
      },
      {
        name: "Muzzamil Riaz",
        role: "CTO",
        image: muzzamilImage,
        description: "Technology expert driving innovation and platform development.",
      },
      {
        name: "Muhammad Umar",
        role: "Head of Product",
        image: umarImage,
        description: "Product strategist with a passion for user experience.",
      },
    ],
    values: [
      {
        icon: 'Target',
        title: "Innovation First",
        description: "We constantly push boundaries to deliver cutting-edge solutions that drive business growth.",
      },
      {
        icon: 'People',
        title: "Customer Success",
        description: "Our customers' success is our success. We're committed to helping businesses thrive.",
      },
      {
        icon: 'ShieldCheck',
        title: "Trust & Security",
        description: "We maintain the highest standards of security and reliability in everything we do.",
      },
      {
        icon: 'Globe',
        title: "Global Impact",
        description: "We're building solutions that make a positive impact on businesses worldwide.",
      },
    ],
    missionSection: {
      imageUrl: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600",
      badgeText: "10+",
      badgeSubtext: "Years of Excellence"
    }
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
      { name: 'Bulk Image Optimizer', category: 'Image & File Optimization', description: 'Optimize your store images for better performance', rating: 4.8, reviews: 1234, price: 'Free', image: '', link: '' },
      { name: 'SEO - Blog Post Builder', category: 'SEO', description: 'Create SEO-optimized blog posts automatically', rating: 4.9, reviews: 856, price: '$9.99/mo', image: '', link: '' },
      { name: 'Advanced Sales & Cost Analysis', category: 'Analytics', description: 'Deep insights into your sales and cost metrics', rating: 4.7, reviews: 2341, price: '$19.99/mo', image: '', link: '' },
      { name: 'Customer Review Manager', category: 'Reviews', description: 'Manage and showcase customer reviews effectively', rating: 4.9, reviews: 1567, price: '$14.99/mo', image: '', link: '' },
      { name: 'Inventory Sync Pro', category: 'Inventory', description: 'Keep your inventory synced across all channels', rating: 4.6, reviews: 892, price: '$24.99/mo', image: '', link: '' },
      { name: 'Email Marketing Suite', category: 'Marketing', description: 'Complete email marketing automation toolkit', rating: 4.8, reviews: 3421, price: '$29.99/mo', image: '', link: '' },
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
    copyright: '© 2026 Devnzo. All rights reserved.'
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

  // Deep merge function to properly combine default content with Firestore data
  const deepMerge = (target: any, source: any): any => {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = deepMerge(target[key], source[key]);
          }
        } else if (Array.isArray(source[key])) {
          // For arrays, use the source array directly (don't merge)
          output[key] = source[key];
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  };

  const isObject = (item: any): boolean => {
    return item && typeof item === 'object' && !Array.isArray(item);
  };

  const fetchContent = async () => {
    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<PageContentData>;
        // Use deep merge to properly combine nested objects
        setContent(deepMerge(defaultContent, data));
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
                      <IconPicker
                        value={feature.icon}
                        onChange={(iconName) => updateArrayItem('homepage', 'features', index, 'icon', iconName)}
                        placeholder="Select icon"
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

          <Card>
            <CardHeader>
              <CardTitle>Mission Hero & Badge</CardTitle>
              <CardDescription>Main mission image and floating badge details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mission Image URL</Label>
                <Input
                  value={content.about.missionSection.imageUrl}
                  onChange={(e) => updateNestedField('about', 'missionSection', 'imageUrl', e.target.value)}
                  placeholder="https://images.pexels.com/..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Title (e.g., 10+)</Label>
                  <Input
                    value={content.about.missionSection.badgeText}
                    onChange={(e) => updateNestedField('about', 'missionSection', 'badgeText', e.target.value)}
                    placeholder="10+"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Badge Subtitle</Label>
                  <Input
                    value={content.about.missionSection.badgeSubtext}
                    onChange={(e) => updateNestedField('about', 'missionSection', 'badgeSubtext', e.target.value)}
                    placeholder="Years of Excellence"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Stats</CardTitle>
              <CardDescription>Key metrics displayed on the about page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.about.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <Input
                      value={stat.value}
                      onChange={(e) => updateArrayItem('about', 'stats', index, 'value', e.target.value)}
                      placeholder="Value (e.g., 50K+)"
                    />
                    <Input
                      value={stat.label}
                      onChange={(e) => updateArrayItem('about', 'stats', index, 'label', e.target.value)}
                      placeholder="Label (e.g., Active Users)"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('about', 'stats', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('about', 'stats', { value: '', label: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Values</CardTitle>
              <CardDescription>Core values with icons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.about.values.map((value, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <IconPicker
                        value={value.icon}
                        onChange={(iconName) => updateArrayItem('about', 'values', index, 'icon', iconName)}
                        placeholder="Select icon"
                      />
                      <Input
                        value={value.title}
                        onChange={(e) => updateArrayItem('about', 'values', index, 'title', e.target.value)}
                        placeholder="Value title"
                        className="md:col-span-2"
                      />
                    </div>
                    <Textarea
                      value={value.description}
                      onChange={(e) => updateArrayItem('about', 'values', index, 'description', e.target.value)}
                      placeholder="Description"
                      rows={2}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('about', 'values', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('about', 'values', { title: '', description: '', icon: 'star' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Value
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leadership Team</CardTitle>
              <CardDescription>Management and key personnel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.about.team.map((member, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeArrayItem('about', 'team', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => updateArrayItem('about', 'team', index, 'name', e.target.value)}
                        placeholder="Member name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={member.role}
                        onChange={(e) => updateArrayItem('about', 'team', index, 'role', e.target.value)}
                        placeholder="e.g., CEO & Founder"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Profile Image URL</Label>
                    <Input
                      value={member.image}
                      onChange={(e) => updateArrayItem('about', 'team', index, 'image', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={member.description}
                      onChange={(e) => updateArrayItem('about', 'team', index, 'description', e.target.value)}
                      placeholder="Brief bio..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('about', 'team', { name: '', role: '', image: '', description: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
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
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hero Subtitle</Label>
                  <Textarea
                    value={content.products.hero.subtitle}
                    onChange={(e) => updateNestedField('products', 'hero', 'subtitle', e.target.value)}
                    placeholder="Supporting text"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Button Link (opens in new tab)</Label>
                  <Input
                    value={content.products.hero.ctaLink || ''}
                    onChange={(e) => updateNestedField('products', 'hero', 'ctaLink', e.target.value)}
                    placeholder="https://www.shopify.com/"
                  />
                </div>
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
                    <IconPicker
                      value={app.icon}
                      onChange={(iconName) => updateArrayItem('products', 'ecosystemApps', index, 'icon', iconName)}
                      placeholder="Select icon"
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

          <Card>
            <CardHeader>
              <CardTitle>Handpicked Tools</CardTitle>
              <CardDescription>Tools displayed in the handpicked tools section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.products.tools.map((tool, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Input
                        value={tool.name}
                        onChange={(e) => updateArrayItem('products', 'tools', index, 'name', e.target.value)}
                        placeholder="Tool name"
                      />
                      <Input
                        value={tool.category}
                        onChange={(e) => updateArrayItem('products', 'tools', index, 'category', e.target.value)}
                        placeholder="Category"
                      />
                      <Input
                        value={tool.price}
                        onChange={(e) => updateArrayItem('products', 'tools', index, 'price', e.target.value)}
                        placeholder="Price (e.g. Free, $9.99/mo)"
                      />
                    </div>
                    <Textarea
                      value={tool.description}
                      onChange={(e) => updateArrayItem('products', 'tools', index, 'description', e.target.value)}
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={tool.rating}
                        onChange={(e) => updateArrayItem('products', 'tools', index, 'rating', parseFloat(e.target.value) || 0)}
                        placeholder="Rating (0-5)"
                      />
                      <Input
                        type="number"
                        value={tool.reviews}
                        onChange={(e) => updateArrayItem('products', 'tools', index, 'reviews', parseInt(e.target.value) || 0)}
                        placeholder="Number of reviews"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Image URL</Label>
                        <Input
                          value={tool.image || ''}
                          onChange={(e) => updateArrayItem('products', 'tools', index, 'image', e.target.value)}
                          placeholder="https://example.com/image.png"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Link (opens in new tab)</Label>
                        <Input
                          value={tool.link || ''}
                          onChange={(e) => updateArrayItem('products', 'tools', index, 'link', e.target.value)}
                          placeholder="https://apps.shopify.com/example"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('products', 'tools', index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('products', 'tools', { name: '', category: '', description: '', rating: 4.5, reviews: 0, price: 'Free', image: '', link: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tool
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
                      <IconPicker
                        value={card.icon}
                        onChange={(iconName) => updateArrayItem('resources', 'cards', index, 'icon', iconName)}
                        placeholder="Select icon"
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
              <CardDescription>Header navigation links (drag to reorder or use arrows)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {content.navigation.main
                .map((item, index) => ({ ...item, originalIndex: index }))
                .sort((a, b) => (a.order ?? a.originalIndex) - (b.order ?? b.originalIndex))
                .map((item, sortedIndex) => {
                  const originalIndex = item.originalIndex;
                  return (
                    <div
                      key={originalIndex}
                      className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', String(originalIndex));
                        e.currentTarget.classList.add('opacity-50');
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.classList.remove('opacity-50');
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-primary');
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove('border-primary');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-primary');
                        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                        if (fromIndex !== originalIndex) {
                          const newItems = [...content.navigation.main];
                          const [movedItem] = newItems.splice(fromIndex, 1);
                          // Find where to insert based on sorted position
                          const targetSortedIndex = content.navigation.main
                            .map((it, idx) => ({ ...it, originalIndex: idx }))
                            .sort((a, b) => (a.order ?? a.originalIndex) - (b.order ?? b.originalIndex))
                            .findIndex(it => it.originalIndex === originalIndex);
                          newItems.splice(targetSortedIndex > sortedIndex ? originalIndex : originalIndex, 0, movedItem);
                          // Update order values
                          const reorderedItems = newItems.map((it, idx) => ({ ...it, order: idx }));
                          setContent(prev => ({
                            ...prev,
                            navigation: { ...prev.navigation, main: reorderedItems }
                          }));
                        }
                      }}
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab flex-shrink-0" />
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Input
                          value={item.title}
                          onChange={(e) => updateArrayItem('navigation', 'main', originalIndex, 'title', e.target.value)}
                          placeholder="Link text"
                        />
                        <Input
                          value={item.path}
                          onChange={(e) => updateArrayItem('navigation', 'main', originalIndex, 'path', e.target.value)}
                          placeholder="Path e.g. /about"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={sortedIndex === 0}
                          onClick={() => {
                            const newItems = [...content.navigation.main].map((it, idx) => ({
                              ...it,
                              order: it.order ?? idx
                            }));
                            // Find the item before this one in sorted order
                            const sortedItems = newItems
                              .map((it, idx) => ({ ...it, origIdx: idx }))
                              .sort((a, b) => a.order - b.order);
                            const currentPos = sortedItems.findIndex(it => it.origIdx === originalIndex);
                            if (currentPos > 0) {
                              const prevItem = sortedItems[currentPos - 1];
                              const currentItem = sortedItems[currentPos];
                              newItems[prevItem.origIdx].order = currentItem.order;
                              newItems[originalIndex].order = prevItem.order;
                              setContent(prev => ({
                                ...prev,
                                navigation: { ...prev.navigation, main: newItems }
                              }));
                            }
                          }}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={sortedIndex === content.navigation.main.length - 1}
                          onClick={() => {
                            const newItems = [...content.navigation.main].map((it, idx) => ({
                              ...it,
                              order: it.order ?? idx
                            }));
                            // Find the item after this one in sorted order
                            const sortedItems = newItems
                              .map((it, idx) => ({ ...it, origIdx: idx }))
                              .sort((a, b) => a.order - b.order);
                            const currentPos = sortedItems.findIndex(it => it.origIdx === originalIndex);
                            if (currentPos < sortedItems.length - 1) {
                              const nextItem = sortedItems[currentPos + 1];
                              const currentItem = sortedItems[currentPos];
                              newItems[nextItem.origIdx].order = currentItem.order;
                              newItems[originalIndex].order = nextItem.order;
                              setContent(prev => ({
                                ...prev,
                                navigation: { ...prev.navigation, main: newItems }
                              }));
                            }
                          }}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeArrayItem('navigation', 'main', originalIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              <Button
                variant="outline"
                onClick={() => addArrayItem('navigation', 'main', { title: '', path: '', order: content.navigation.main.length })}
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
                  placeholder="© 2026 Company. All rights reserved."
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
