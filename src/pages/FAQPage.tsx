/**
 * FAQ Page Component
 * Frequently asked questions organized by category.
 */

import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useState } from 'react';

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = ['All', 'Getting Started', 'Billing', 'Features', 'Technical', 'Security'];

  const faqs = [
    {
      category: 'Getting Started',
      question: 'How do I get started with Devnzo?',
      answer: 'Getting started is easy! Simply sign up for a free account, complete the onboarding process, and you can start using our platform immediately. We provide step-by-step guides and tutorials to help you set up your first dashboard and connect your data sources.'
    },
    {
      category: 'Getting Started',
      question: 'What integrations are available?',
      answer: 'Devnzo integrates with over 100+ popular business tools including Shopify, Salesforce, HubSpot, Slack, Google Analytics, and many more. You can find the complete list of integrations in our documentation or contact our support team for custom integration requests.'
    },
    {
      category: 'Billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers. All payments are processed securely through our encrypted payment system.'
    },
    {
      category: 'Billing',
      question: 'Can I change my plan at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle. Any prorated charges or credits will be applied to your next invoice.'
    },
    {
      category: 'Billing',
      question: 'Do you offer refunds?',
      answer: "We offer a 30-day money-back guarantee for new customers. If you're not satisfied with our service within the first 30 days, contact our support team for a full refund. Refunds for subsequent months are handled on a case-by-case basis."
    },
    {
      category: 'Features',
      question: 'What analytics features are included?',
      answer: 'Our analytics suite includes real-time dashboards, custom reporting, data visualization, predictive analytics, and automated insights. You can track KPIs, monitor performance, and generate detailed reports across all your business metrics.'
    },
    {
      category: 'Features',
      question: 'Can I customize my dashboard?',
      answer: 'Absolutely! Our dashboards are fully customizable. You can add, remove, and rearrange widgets, create custom charts, set up automated alerts, and save multiple dashboard views for different use cases or team members.'
    },
    {
      category: 'Features',
      question: 'Is there a mobile app available?',
      answer: 'Yes, we offer mobile apps for both iOS and Android devices. The mobile app provides access to your dashboards, real-time notifications, and key metrics on the go. You can download it from the App Store or Google Play Store.'
    },
    {
      category: 'Technical',
      question: 'What are the API rate limits?',
      answer: 'API rate limits vary by plan: Basic (1,000 requests/hour), Professional (10,000 requests/hour), and Enterprise (custom limits). Rate limits reset every hour, and we provide headers in API responses to help you track your usage.'
    },
    {
      category: 'Technical',
      question: 'How do I authenticate API requests?',
      answer: 'We use API keys for authentication. You can generate API keys in your account settings under the "API Access" section. Include your API key in the Authorization header of your requests. We also support OAuth 2.0 for more complex integrations.'
    },
    {
      category: 'Technical',
      question: 'What data formats do you support?',
      answer: 'We support JSON, CSV, XML, and Excel formats for data import/export. Our API exclusively uses JSON for requests and responses. For bulk data operations, we recommend using CSV format for optimal performance.'
    },
    {
      category: 'Security',
      question: 'How is my data protected?',
      answer: 'We use enterprise-grade security measures including AES-256 encryption for data at rest, TLS 1.3 for data in transit, regular security audits, and SOC 2 Type II compliance. Your data is stored in secure, geographically distributed data centers.'
    },
    {
      category: 'Security',
      question: 'Do you offer single sign-on (SSO)?',
      answer: 'Yes, we support SSO through SAML 2.0 and OAuth 2.0 protocols. We integrate with popular identity providers like Okta, Azure AD, Google Workspace, and others. SSO is available on our Professional and Enterprise plans.'
    },
    {
      category: 'Security',
      question: 'What compliance certifications do you have?',
      answer: 'We maintain SOC 2 Type II, ISO 27001, and GDPR compliance. We also follow industry best practices for data protection and regularly undergo third-party security audits. Compliance documentation is available upon request.'
    }
  ];

  const filteredFaqs = activeCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 text-white mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Find quick answers to the most common questions about our platform, features, and services.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                className="w-full pl-12 pr-4 py-4 rounded-full text-foreground placeholder:text-muted-foreground bg-background focus:outline-none focus:ring-4 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {faqCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground border border-border hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-card rounded-2xl shadow-sm border border-border">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-secondary/50 transition-colors rounded-2xl"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mr-3">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                  </div>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground ml-4" />
                  )}
                </button>
                {openItems.includes(index) && (
                  <div className="px-8 pb-6">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Contact Support
            </button>
            <button className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
              Browse Help Center
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
