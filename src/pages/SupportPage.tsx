/**
 * Support Page Component
 * Customer support hub with multiple contact options.
 */

import { Headphones, MessageCircle, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';

const SupportPage = () => {
  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      availability: 'Available 24/7',
      responseTime: 'Instant',
      bestFor: 'Quick questions and immediate assistance',
      action: 'Start Chat',
    },
    {
      title: 'Email Support',
      description: 'Send detailed questions and get comprehensive answers',
      icon: <Mail className="w-8 h-8 text-accent" />,
      availability: 'Always available',
      responseTime: 'Within 4 hours',
      bestFor: 'Complex issues and detailed explanations',
      action: 'Send Email',
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our technical experts',
      icon: <Phone className="w-8 h-8 text-purple-600" />,
      availability: 'Mon-Fri, 9AM-6PM PST',
      responseTime: 'Immediate',
      bestFor: 'Urgent issues and technical discussions',
      action: 'Call Now',
    }
  ];

  const commonIssues = [
    {
      title: 'Account & Billing',
      issues: [
        'Password reset',
        'Billing questions',
        'Plan upgrades',
        'Account settings'
      ]
    },
    {
      title: 'Technical Issues',
      issues: [
        'API integration',
        'Data synchronization',
        'Performance issues',
        'Error troubleshooting'
      ]
    },
    {
      title: 'Features & Usage',
      issues: [
        'Feature requests',
        'How-to guides',
        'Best practices',
        'Training resources'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Headphones className="w-16 h-16 text-white mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">
            Customer Support
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            We're here to help you succeed. Get the support you need, when you need it,
            from our dedicated customer success team.
          </p>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              How Can We Help You?
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the support option that works best for your needs
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="mb-6">{option.icon}</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{option.title}</h3>
                <p className="text-muted-foreground mb-6">{option.description}</p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                    <span className="text-sm text-muted-foreground">{option.availability}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-muted-foreground">Response: {option.responseTime}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  <strong>Best for:</strong> {option.bestFor}
                </p>

                <button className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  {option.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Common Support Topics
            </h2>
            <p className="text-xl text-muted-foreground">
              Quick access to help with the most common questions
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {commonIssues.map((category, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 shadow-sm border border-border">
                <h3 className="text-xl font-bold text-foreground mb-6">{category.title}</h3>
                <ul className="space-y-3">
                  {category.issues.map((issue, issueIndex) => (
                    <li key={issueIndex}>
                      <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                        {issue}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="py-20 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-red-200">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Emergency Support
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              For critical issues affecting your business operations, contact our emergency support line.
            </p>
            <div className="bg-red-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-red-600 mr-2" />
                <span className="text-2xl font-bold text-red-600">+1 307 225 5593</span>
              </div>
              <p className="text-red-700">Available 24/7 for Enterprise customers</p>
            </div>
            <p className="text-muted-foreground text-sm">
              Emergency support is available for service outages, security incidents, and critical business-impacting issues.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
