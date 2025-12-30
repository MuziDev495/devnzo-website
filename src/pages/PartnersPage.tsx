/**
 * Partners Page Component
 * Partner information and collaboration details
 */

import { Handshake, TrendingUp, Users, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PartnersPage = () => {
  const navigate = useNavigate();

  const partnerBenefits = [
    {
      icon: <TrendingUp className="w-8 h-8 text-accent" />,
      title: 'Revenue Growth',
      description: 'Earn competitive commissions on every referral and unlock new revenue streams.'
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: 'Dedicated Support',
      description: 'Get access to a dedicated partner success manager and priority support.'
    },
    {
      icon: <Handshake className="w-8 h-8 text-success" />,
      title: 'Co-Marketing',
      description: 'Collaborate on joint marketing initiatives to expand your reach.'
    },
    {
      icon: <Award className="w-8 h-8 text-warning" />,
      title: 'Exclusive Access',
      description: 'Early access to new features, beta programs, and exclusive partner resources.'
    }
  ];

  const partnerTypes = [
    {
      title: 'Agency Partners',
      description: 'Perfect for agencies looking to offer eCommerce solutions to their clients.',
      features: [
        'White-label solutions',
        'Bulk licensing options',
        'Dedicated account manager',
        'Priority implementation support'
      ]
    },
    {
      title: 'Technology Partners',
      description: 'Integrate your technology with Devnzo to create powerful combined solutions.',
      features: [
        'API access and documentation',
        'Technical integration support',
        'Joint product development',
        'Co-branded solutions'
      ]
    },
    {
      title: 'Referral Partners',
      description: 'Earn commissions by referring businesses to Devnzo.',
      features: [
        'Competitive commission rates',
        'Tracking dashboard',
        'Marketing materials',
        'Monthly payouts'
      ]
    }
  ];

  const featuredPartners = [
    { name: 'Shopify', logo: '🛍️' },
    { name: 'Google', logo: '🔍' },
    { name: 'Meta', logo: '📱' },
    { name: 'Amazon', logo: '📦' },
    { name: 'Stripe', logo: '💳' },
    { name: 'HubSpot', logo: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            Partner with Devnzo
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
            Join our growing ecosystem of partners and unlock new opportunities 
            for growth, revenue, and success.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-background text-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-secondary transition-all duration-300 inline-flex items-center"
          >
            Become a Partner
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Partner Benefits</h2>
            <p className="text-xl text-muted-foreground">
              Why businesses choose to partner with Devnzo
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnerBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-md border border-border hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Partnership Programs</h2>
            <p className="text-xl text-muted-foreground">
              Choose the partnership type that best fits your business
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-md border border-border hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-foreground mb-4">{type.title}</h3>
                <p className="text-muted-foreground mb-6">{type.description}</p>
                <ul className="space-y-3 mb-8">
                  {type.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full bg-gradient-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Partners</h2>
            <p className="text-xl text-muted-foreground">
              Trusted by leading companies worldwide
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {featuredPartners.map((partner, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-md border border-border flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-3">{partner.logo}</div>
                <span className="font-semibold text-foreground">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Partner with Us?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join our partner ecosystem and let's grow together.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-background text-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-secondary transition-all duration-300"
          >
            Get in Touch
          </button>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;
