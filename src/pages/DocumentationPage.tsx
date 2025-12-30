/**
 * Documentation Page Component
 * Technical documentation and API reference.
 */

import { FileText, Code, Book, ExternalLink, Download, Search } from 'lucide-react';

const DocumentationPage = () => {
  const docSections = [
    {
      title: 'Getting Started',
      description: 'Quick start guides and basic setup instructions',
      icon: <Book className="w-8 h-8 text-primary" />,
      items: [
        'Installation Guide',
        'Authentication Setup',
        'First API Call',
        'SDK Installation'
      ]
    },
    {
      title: 'API Reference',
      description: 'Complete API documentation with examples',
      icon: <Code className="w-8 h-8 text-accent" />,
      items: [
        'Authentication',
        'Users API',
        'Analytics API',
        'Webhooks'
      ]
    },
    {
      title: 'SDKs & Libraries',
      description: 'Official SDKs and community libraries',
      icon: <FileText className="w-8 h-8 text-purple-600" />,
      items: [
        'JavaScript SDK',
        'Python SDK',
        'PHP SDK',
        'Ruby SDK'
      ]
    },
    {
      title: 'Integrations',
      description: 'Third-party integrations and connectors',
      icon: <ExternalLink className="w-8 h-8 text-orange-500" />,
      items: [
        'Shopify Integration',
        'Salesforce Connector',
        'Slack Integration',
        'Zapier Apps'
      ]
    }
  ];

  const codeExample = `// Initialize the Devnzo SDK
import { DevnzoClient } from '@Devnzo/sdk';

const client = new DevnzoClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Get analytics data
const analytics = await client.analytics.getMetrics({
  dateRange: '30d',
  metrics: ['revenue', 'orders', 'customers']
});

console.log(analytics);`;

  const quickLinks = [
    {
      title: 'API Status',
      description: 'Check API uptime and status',
      url: '#'
    },
    {
      title: 'Changelog',
      description: 'Latest updates and changes',
      url: '#'
    },
    {
      title: 'Rate Limits',
      description: 'API rate limiting information',
      url: '#'
    },
    {
      title: 'Error Codes',
      description: 'Complete error code reference',
      url: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-white mb-6">
              Documentation
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Comprehensive guides, API reference, and technical documentation to help you integrate and build with Devnzo.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className="w-full pl-12 pr-4 py-4 rounded-full text-foreground placeholder:text-muted-foreground bg-background focus:outline-none focus:ring-4 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {docSections.map((section, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-6">
                  {section.icon}
                  <h3 className="text-2xl font-bold text-foreground ml-3">{section.title}</h3>
                </div>
                <p className="text-muted-foreground mb-6">{section.description}</p>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <a href="#" className="text-primary hover:text-primary/80 flex items-center">
                        {item}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 bg-[hsl(222,47%,11%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Quick Start Example
            </h2>
            <p className="text-xl text-gray-300">
              Get started with just a few lines of code
            </p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">JavaScript</span>
                <button className="text-gray-400 hover:text-white">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
              {codeExample}
            </pre>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Quick Reference
            </h2>
            <p className="text-xl text-muted-foreground">
              Essential links and resources for developers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="bg-secondary border border-border rounded-xl p-6 hover:bg-secondary/70 transition-colors text-center"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">{link.title}</h3>
                <p className="text-muted-foreground text-sm">{link.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Need Developer Support?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our developer support team is here to help you integrate successfully.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Contact Developer Support
            </button>
            <button className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
              Join Developer Community
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocumentationPage;
