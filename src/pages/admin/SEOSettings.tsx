import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SEOSettings {
  siteTitle: string;
  siteTagline: string;
  defaultMetaDescription: string;
  defaultOgImage: string;
  googleAnalyticsId: string;
  twitterHandle: string;
  facebookUrl: string;
  linkedinUrl: string;
  robotsTxt: string;
}

const defaultSEOSettings: SEOSettings = {
  siteTitle: 'Devnzo',
  siteTagline: 'Transform Your Business',
  defaultMetaDescription: 'Devnzo provides enterprise-grade business transformation solutions.',
  defaultOgImage: '',
  googleAnalyticsId: '',
  twitterHandle: '',
  facebookUrl: '',
  linkedinUrl: '',
  robotsTxt: 'User-agent: *\nAllow: /',
};

const SEOSettings: React.FC = () => {
  const [settings, setSettings] = useState<SEOSettings>(defaultSEOSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'site_settings', 'seo');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSettings({ ...defaultSEOSettings, ...docSnap.data() as SEOSettings });
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_settings', 'seo'), settings);
      toast({
        title: "Success",
        description: "SEO settings saved successfully"
      });
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      toast({
        title: "Error",
        description: "Failed to save SEO settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (field: keyof SEOSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
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
          <h1 className="text-3xl font-bold">SEO Settings</h1>
          <p className="text-muted-foreground">Optimize your website for search engines</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* General SEO */}
        <Card>
          <CardHeader>
            <CardTitle>General SEO</CardTitle>
            <CardDescription>Basic search engine optimization settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                value={settings.siteTitle}
                onChange={(e) => updateSetting('siteTitle', e.target.value)}
                placeholder="Your site name"
              />
              <p className="text-xs text-muted-foreground">
                Appears in browser tabs and search results
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteTagline">Site Tagline</Label>
              <Input
                id="siteTagline"
                value={settings.siteTagline}
                onChange={(e) => updateSetting('siteTagline', e.target.value)}
                placeholder="Your site slogan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultMetaDescription">Default Meta Description</Label>
              <Textarea
                id="defaultMetaDescription"
                value={settings.defaultMetaDescription}
                onChange={(e) => updateSetting('defaultMetaDescription', e.target.value)}
                placeholder="Default description for search engines"
                maxLength={160}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {settings.defaultMetaDescription.length}/160 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultOgImage">Default Open Graph Image URL</Label>
              <Input
                id="defaultOgImage"
                value={settings.defaultOgImage}
                onChange={(e) => updateSetting('defaultOgImage', e.target.value)}
                placeholder="https://example.com/og-image.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Default image for social media shares (1200x630px recommended)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Connect your analytics services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="googleAnalyticsId">Google Analytics 4 Measurement ID</Label>
              <Input
                id="googleAnalyticsId"
                value={settings.googleAnalyticsId}
                onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-xs text-muted-foreground">
                Your GA4 Measurement ID (starts with G-)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Link your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twitterHandle">Twitter/X Handle</Label>
              <Input
                id="twitterHandle"
                value={settings.twitterHandle}
                onChange={(e) => updateSetting('twitterHandle', e.target.value)}
                placeholder="@yourusername"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook Page URL</Label>
              <Input
                id="facebookUrl"
                value={settings.facebookUrl}
                onChange={(e) => updateSetting('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                value={settings.linkedinUrl}
                onChange={(e) => updateSetting('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
          </CardContent>
        </Card>

        {/* Search Engine Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Search Engine Preview
            </CardTitle>
            <CardDescription>How your site may appear in search results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <p className="text-primary text-lg hover:underline cursor-pointer">
                {settings.siteTitle} {settings.siteTagline && `| ${settings.siteTagline}`}
              </p>
              <p className="text-success text-sm">
                www.devnzo.com
              </p>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {settings.defaultMetaDescription || 'No description set'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SEOSettings;
