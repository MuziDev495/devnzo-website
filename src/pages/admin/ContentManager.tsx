import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PageContentData {
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    features: Array<{ title: string; description: string }>;
    statsSection: Array<{ value: string; label: string }>;
  };
  about: {
    title: string;
    description: string;
    mission: string;
    vision: string;
  };
  contact: {
    title: string;
    description: string;
    email: string;
    phone: string;
    address: string;
  };
}

const defaultContent: PageContentData = {
  homepage: {
    heroTitle: 'Transform Your Business with Devnzo',
    heroSubtitle: 'Enterprise-grade solutions for modern businesses',
    heroCta: 'Get Started',
    features: [
      { title: 'Feature 1', description: 'Description for feature 1' },
      { title: 'Feature 2', description: 'Description for feature 2' },
      { title: 'Feature 3', description: 'Description for feature 3' },
    ],
    statsSection: [
      { value: '100+', label: 'Clients' },
      { value: '50+', label: 'Projects' },
      { value: '99%', label: 'Satisfaction' },
    ],
  },
  about: {
    title: 'About Devnzo',
    description: 'We are a technology company...',
    mission: 'Our mission is to...',
    vision: 'Our vision is to...',
  },
  contact: {
    title: 'Get in Touch',
    description: 'We would love to hear from you',
    email: 'contact@devnzo.com',
    phone: '+1 234 567 890',
    address: '123 Business Street, City, Country',
  },
};

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
        setContent({ ...defaultContent, ...docSnap.data() as PageContentData });
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

  const updateHomepage = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      homepage: { ...prev.homepage, [field]: value }
    }));
  };

  const updateAbout = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      about: { ...prev.about, [field]: value }
    }));
  };

  const updateContact = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Page Content</h1>
          <p className="text-muted-foreground">Edit your website content</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="homepage">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Homepage Tab */}
        <TabsContent value="homepage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main banner content on the homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input
                  id="heroTitle"
                  value={content.homepage.heroTitle}
                  onChange={(e) => updateHomepage('heroTitle', e.target.value)}
                  placeholder="Main headline"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Textarea
                  id="heroSubtitle"
                  value={content.homepage.heroSubtitle}
                  onChange={(e) => updateHomepage('heroSubtitle', e.target.value)}
                  placeholder="Supporting text"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroCta">CTA Button Text</Label>
                <Input
                  id="heroCta"
                  value={content.homepage.heroCta}
                  onChange={(e) => updateHomepage('heroCta', e.target.value)}
                  placeholder="Call to action button text"
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
              {content.homepage.statsSection.map((stat, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Value {index + 1}</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...content.homepage.statsSection];
                        newStats[index] = { ...stat, value: e.target.value };
                        setContent(prev => ({
                          ...prev,
                          homepage: { ...prev.homepage, statsSection: newStats }
                        }));
                      }}
                      placeholder="e.g., 100+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Label {index + 1}</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...content.homepage.statsSection];
                        newStats[index] = { ...stat, label: e.target.value };
                        setContent(prev => ({
                          ...prev,
                          homepage: { ...prev.homepage, statsSection: newStats }
                        }));
                      }}
                      placeholder="e.g., Clients"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Page Content</CardTitle>
              <CardDescription>Company information and story</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aboutTitle">Page Title</Label>
                <Input
                  id="aboutTitle"
                  value={content.about.title}
                  onChange={(e) => updateAbout('title', e.target.value)}
                  placeholder="About page title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutDescription">Description</Label>
                <Textarea
                  id="aboutDescription"
                  value={content.about.description}
                  onChange={(e) => updateAbout('description', e.target.value)}
                  placeholder="Company description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea
                  id="mission"
                  value={content.about.mission}
                  onChange={(e) => updateAbout('mission', e.target.value)}
                  placeholder="Our mission..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision">Vision Statement</Label>
                <Textarea
                  id="vision"
                  value={content.about.vision}
                  onChange={(e) => updateAbout('vision', e.target.value)}
                  placeholder="Our vision..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Page Content</CardTitle>
              <CardDescription>Contact information and page text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactTitle">Page Title</Label>
                <Input
                  id="contactTitle"
                  value={content.contact.title}
                  onChange={(e) => updateContact('title', e.target.value)}
                  placeholder="Contact page title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactDescription">Description</Label>
                <Textarea
                  id="contactDescription"
                  value={content.contact.description}
                  onChange={(e) => updateContact('description', e.target.value)}
                  placeholder="Contact page description"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={content.contact.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={content.contact.phone}
                  onChange={(e) => updateContact('phone', e.target.value)}
                  placeholder="+1 234 567 890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={content.contact.address}
                  onChange={(e) => updateContact('address', e.target.value)}
                  placeholder="Full address"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;
