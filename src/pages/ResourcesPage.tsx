/**
 * Resources Page Component
 * Resource hub with organized categories
 */

import { Book, Code, ShoppingBag, FileText, Wrench, Gift, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/types/routes';
import { usePageContent } from '@/contexts/CMSContext';

const ResourcesPage = () => {
  const { pageContent } = usePageContent();
  const navigate = useNavigate();

  // CMS data with defaults
  const heroTitle = pageContent?.resources?.hero?.title || 'Resources';
  const heroSubtitle = pageContent?.resources?.hero?.subtitle || 'Everything you need to succeed in eCommerce. Guides, tools, apps, and more.';

  const resources = [
    {
      icon: <Book className="w-8 h-8 text-accent" />,
      title: 'Knowledge Base',
      description: 'Comprehensive guides and tutorials for Shopify development.',
      path: ROUTES.RESOURCES.KNOWLEDGE,
      color: 'bg-accent/10'
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-primary" />,
      title: 'Shopify Apps',
      description: 'Curated collection of essential Shopify applications.',
      path: ROUTES.RESOURCES.SHOPIFY_APPS,
      color: 'bg-primary/10'
    },
    {
      icon: <FileText className="w-8 h-8 text-success" />,
      title: 'Blog',
      description: 'Latest insights, tips, and industry news for eCommerce.',
      path: ROUTES.RESOURCES.ALL_BLOG,
      color: 'bg-success/10'
    },
    {
      icon: <Wrench className="w-8 h-8 text-warning" />,
      title: 'Free Tools',
      description: 'Helpful free tools to boost your business operations.',
      path: ROUTES.RESOURCES.FREE_TOOLS,
      color: 'bg-warning/10'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            {heroTitle}
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <div
                key={index}
                onClick={() => navigate(resource.path)}
                className="bg-card rounded-2xl p-8 shadow-md border border-border hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className={`w-16 h-16 ${resource.color} rounded-2xl flex items-center justify-center mb-6`}>
                  {resource.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-muted-foreground mb-6">{resource.description}</p>
                <div className="flex items-center text-primary font-medium group-hover:gap-3 transition-all">
                  <span>Explore</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;
