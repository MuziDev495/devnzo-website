/**
 * Help Center Page Component
 * Comprehensive help center with FAQs, guides, and support resources.
 */

import { HelpCircle, Search, Book, MessageCircle, Video, FileText, ArrowRight, Phone } from 'lucide-react';

const HelpCenterPage = () => {
  const helpCategories = [
    {
      title: 'Getting Started',
      description: 'Learn the basics and set up your account',
      icon: <Book className="w-8 h-8 text-primary" />,
      articles: 12,
    },
    {
      title: 'Account Management',
      description: 'Manage your profile, billing, and settings',
      icon: <FileText className="w-8 h-8 text-accent" />,
      articles: 8,
    },
    {
      title: 'Features & Tools',
      description: 'Detailed guides for all platform features',
      icon: <Video className="w-8 h-8 text-purple-600" />,
      articles: 24,
    },
    {
      title: 'Integrations',
      description: 'Connect with third-party services',
      icon: <MessageCircle className="w-8 h-8 text-orange-500" />,
      articles: 15,
    },
    {
      title: 'Troubleshooting',
      description: 'Solve common issues and problems',
      icon: <HelpCircle className="w-8 h-8 text-red-500" />,
      articles: 18,
    },
    {
      title: 'API Documentation',
      description: 'Developer resources and API guides',
      icon: <FileText className="w-8 h-8 text-indigo-500" />,
      articles: 32,
    }
  ];

  const popularArticles = [
    {
      title: 'How to Set Up Your First Dashboard',
      category: 'Getting Started',
      views: '12.5k views'
    },
    {
      title: 'Connecting Your CRM to Devnzo',
      category: 'Integrations',
      views: '8.2k views'
    },
    {
      title: 'Understanding Analytics Reports',
      category: 'Features & Tools',
      views: '7.8k views'
    },
    {
      title: 'Billing and Subscription Management',
      category: 'Account Management',
      views: '6.9k views'
    },
    {
      title: 'API Authentication Guide',
      category: 'API Documentation',
      views: '5.4k views'
    }
  ];

  const contactOptions = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: <MessageCircle className="w-6 h-6 text-primary" />,
      availability: 'Available 24/7',
      action: 'Start Chat'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: <FileText className="w-6 h-6 text-accent" />,
      availability: 'Response within 4 hours',
      action: 'Send Email'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our team',
      icon: <Phone className="w-6 h-6 text-purple-600" />,
      availability: 'Mon-Fri, 9AM-6PM PST',
      action: 'Call Now'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 text-white mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">
            Help Center
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Find answers to your questions, learn how to use our platform, and get the support you need.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles, guides, and more..."
                className="w-full pl-12 pr-28 py-4 rounded-full text-foreground placeholder:text-muted-foreground bg-background focus:outline-none focus:ring-4 focus:ring-primary/30"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Browse by Category
            </h2>
            <p className="text-xl text-muted-foreground">
              Find the help you need organized by topic
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpCategories.map((category, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="mb-6">{category.icon}</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{category.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{category.articles} articles</span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Popular Articles
            </h2>
            <p className="text-xl text-muted-foreground">
              Most viewed help articles and guides
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <div key={index} className="bg-secondary rounded-xl p-6 hover:bg-secondary/70 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{article.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full mr-3">
                          {article.category}
                        </span>
                        <span>{article.views}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground ml-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Still Need Help?
            </h2>
            <p className="text-xl text-muted-foreground">
              Our support team is here to help you succeed
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {contactOptions.map((option, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center">
                <div className="mb-6 flex justify-center">{option.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{option.title}</h3>
                <p className="text-muted-foreground mb-4">{option.description}</p>
                <p className="text-sm text-muted-foreground mb-6">{option.availability}</p>
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity w-full">
                  {option.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Quick Links
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a href="#" className="bg-primary/10 border border-primary/20 rounded-xl p-6 hover:bg-primary/20 transition-colors">
              <h3 className="text-lg font-semibold text-foreground mb-2">System Status</h3>
              <p className="text-muted-foreground">Check our current system status and uptime</p>
            </a>
            <a href="#" className="bg-accent/10 border border-accent/20 rounded-xl p-6 hover:bg-accent/20 transition-colors">
              <h3 className="text-lg font-semibold text-foreground mb-2">Feature Requests</h3>
              <p className="text-muted-foreground">Submit ideas for new features and improvements</p>
            </a>
            <a href="#" className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 hover:bg-purple-500/20 transition-colors">
              <h3 className="text-lg font-semibold text-foreground mb-2">Community Forum</h3>
              <p className="text-muted-foreground">Connect with other users and share experiences</p>
            </a>
            <a href="#" className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 hover:bg-orange-500/20 transition-colors">
              <h3 className="text-lg font-semibold text-foreground mb-2">Video Tutorials</h3>
              <p className="text-muted-foreground">Watch step-by-step video guides</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenterPage;
