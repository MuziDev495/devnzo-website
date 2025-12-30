/**
 * Products Page Component
 * Showcases the complete funnel solution with ecosystem overview and tools
 */

import { ArrowRight, TrendingUp, Users, Award, Star, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const navigate = useNavigate();

  const ecosystemApps = [
    { name: 'Shopify', color: 'bg-success', icon: '🛍️' },
    { name: 'SEO', color: 'bg-accent', icon: '🔍' },
    { name: 'Analytics', color: 'bg-primary', icon: '📊' },
    { name: 'Marketing', color: 'bg-destructive', icon: '📢' },
    { name: 'CRM', color: 'bg-info', icon: '👥' },
    { name: 'Support', color: 'bg-warning', icon: '💬' },
  ];

  const stats = [
    { number: '10+', label: 'Years' },
    { number: '30k+', label: 'Customers' },
    { number: '250k+', label: 'Projects' },
  ];

  const tools = [
    {
      name: 'Bulk Image Optimizer',
      category: 'Image & File Optimization',
      description: 'Optimize your store images for better performance',
      rating: 4.8,
      reviews: 1234,
      price: 'Free'
    },
    {
      name: 'SEO - Blog Post Builder',
      category: 'SEO',
      description: 'Create SEO-optimized blog posts automatically',
      rating: 4.9,
      reviews: 856,
      price: '$9.99/mo'
    },
    {
      name: 'Advanced Sales & Cost Analysis',
      category: 'Analytics',
      description: 'Deep insights into your sales and cost metrics',
      rating: 4.7,
      reviews: 2341,
      price: '$19.99/mo'
    },
    {
      name: 'Customer Review Manager',
      category: 'Reviews',
      description: 'Manage and showcase customer reviews effectively',
      rating: 4.9,
      reviews: 1567,
      price: '$14.99/mo'
    },
    {
      name: 'Inventory Sync Pro',
      category: 'Inventory',
      description: 'Keep your inventory synced across all channels',
      rating: 4.6,
      reviews: 892,
      price: '$24.99/mo'
    },
    {
      name: 'Email Marketing Suite',
      category: 'Marketing',
      description: 'Complete email marketing automation toolkit',
      rating: 4.8,
      reviews: 3421,
      price: '$29.99/mo'
    },
  ];

  const testimonials = [
    {
      name: 'John Smith',
      company: 'E-Commerce Pro',
      text: 'Devnzo tools have completely transformed how we run our Shopify store. The ROI has been incredible.',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5
    },
    {
      name: 'Sarah Johnson',
      company: 'Fashion Forward',
      text: 'The SEO tools alone have increased our organic traffic by 200%. Highly recommended!',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5
    },
    {
      name: 'Mike Chen',
      company: 'Tech Gadgets Store',
      text: 'Customer support is exceptional. They helped us set up everything within hours.',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            The Complete eCommerce Funnel
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
            Everything you need to build, grow, and scale your online business. 
            From analytics to automation, we've got you covered.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-background text-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-secondary transition-all duration-300 inline-flex items-center"
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Ecosystem Overview */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Ecosystem</h2>
            <p className="text-xl text-muted-foreground">
              A complete suite of integrated tools for your business
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {ecosystemApps.map((app, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 text-center shadow-md border border-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl`}>
                  {app.icon}
                </div>
                <h3 className="font-semibold text-foreground">{app.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-foreground/70 font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Handpicked Tools</h2>
            <p className="text-xl text-muted-foreground">
              Carefully selected tools to maximize your store's potential
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {tool.category}
                  </span>
                  <span className="text-lg font-bold text-foreground">{tool.price}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{tool.name}</h3>
                <p className="text-muted-foreground mb-4">{tool.description}</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">{renderStars(Math.floor(tool.rating))}</div>
                  <span className="text-sm text-muted-foreground">
                    {tool.rating} ({tool.reviews.toLocaleString()} reviews)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-md border border-border"
              >
                <div className="flex gap-1 mb-4">{renderStars(testimonial.rating)}</div>
                <p className="text-foreground mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join thousands of successful merchants using Devnzo tools.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-background text-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-secondary transition-all duration-300"
          >
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
