/**
 * Home Page Component
 * Landing page with hero section, features, animated stats, testimonials, and CTA.
 */

import { ArrowRight, BarChart3, Users, Shield, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerReviewSection from '@/components/CustomerReviewSection';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState({
    stats: false,
    features: false,
  });

  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-accent" />,
      title: "Advanced Analytics",
      description: "Deep insights into your business performance with real-time data visualization and predictive analytics.",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Customer Management",
      description: "Comprehensive CRM tools to manage relationships, track interactions, and boost customer satisfaction.",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      icon: <Shield className="w-8 h-8 text-success" />,
      title: "Enterprise Security",
      description: "Bank-level security protocols protecting your data with advanced encryption and compliance standards.",
      image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      icon: <Zap className="w-8 h-8 text-warning" />,
      title: "Automation Suite",
      description: "Streamline workflows with intelligent automation that saves time and reduces manual errors.",
      image: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const stats = [
    { number: 50, label: "Active Users", suffix: "K+" },
    { number: 99.9, label: "Uptime", suffix: "%" },
    { number: 500, label: "Transactions", suffix: "M+" },
    { number: 150, label: "Countries", suffix: "+" }
  ];

  const partnerLogos = ['Microsoft', 'Google', 'Amazon', 'Apple', 'Tesla', 'Netflix'];

  // Animated counter hook
  const useAnimatedCounter = (end: number, duration: number = 2000, isActive: boolean = false) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      if (!isActive || hasAnimated) return;

      setHasAnimated(true);
      let startTime: number;
      const startValue = 0;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = startValue + (end - startValue) * easeOutQuart;

        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [end, duration, isActive, hasAnimated]);

    return Math.floor(count);
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === statsRef.current) {
            setIsVisible(prev => ({ ...prev, stats: true }));
          } else if (entry.target === featuresRef.current) {
            setIsVisible(prev => ({ ...prev, features: true }));
          }
        }
      });
    }, observerOptions);

    if (statsRef.current) observer.observe(statsRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);

    return () => observer.disconnect();
  }, []);

  // Animated counter component
  const AnimatedStat = ({ stat, index }: { stat: typeof stats[0], index: number }) => {
    const animatedValue = useAnimatedCounter(stat.number, 2500, isVisible.stats);

    const formatNumber = (num: number, suffix: string) => {
      if (suffix === '%') return num.toFixed(1);
      return Math.floor(num);
    };

    return (
      <div
        className={`text-center transform transition-all duration-700 ${
          isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        <div className={`text-4xl lg:text-5xl font-bold text-primary-foreground mb-2 ${
          isVisible.stats ? 'animate-bounce-once' : ''
        }`}>
          {formatNumber(animatedValue, stat.suffix)}{stat.suffix}
        </div>
        <div className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wide">
          {stat.label}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnY2aDZ2LTZoLTZ6bTYgMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-center opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-8">
            Transform Your Business with{' '}
            <span className="gradient-text-hero">
              Devnzo
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 max-w-3xl mx-auto">
            Empowering businesses with innovative solutions for sustainable growth and success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/products')}
              className="bg-background text-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-secondary transition-all duration-300 flex items-center justify-center"
            >
              Explore Our Solutions
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() => window.open('https://www.youtube.com/', '_blank')}
              className="border-2 border-primary-foreground text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-foreground hover:text-foreground transition-all duration-300"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground text-sm font-medium mb-8 uppercase tracking-wide">
            Trusted by Leading Companies Worldwide
          </p>
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-left">
              {/* First set of logos */}
              {partnerLogos.map((company) => (
                <div
                  key={`first-${company}`}
                  className="flex-shrink-0 mx-8 text-center"
                >
                  <div className="text-2xl font-bold text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap">
                    {company}
                  </div>
                </div>
              ))}
              {/* Second set of logos (duplicate for seamless loop) */}
              {partnerLogos.map((company) => (
                <div
                  key={`second-${company}`}
                  className="flex-shrink-0 mx-8 text-center"
                >
                  <div className="text-2xl font-bold text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap">
                    {company}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold text-foreground mb-6 transition-all duration-700 ${
              isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              Everything You Need for Business Success
            </h2>
            <p className={`text-xl text-muted-foreground max-w-3xl mx-auto transition-all duration-700 ${
              isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: '200ms' }}>
              Discover the comprehensive suite of tools designed to streamline your business operations,
              boost productivity, and drive sustainable growth.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-stats" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedStat key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Review Section */}
      <CustomerReviewSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join thousands of businesses already using Devnzo to accelerate their growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-background text-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-secondary transition-all duration-300"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/products')}
              className="border-2 border-primary-foreground text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-foreground hover:text-foreground transition-all duration-300"
            >
              View All Features
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
