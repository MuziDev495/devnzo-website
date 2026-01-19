/**
 * About Page Component
 * Company information, team details, mission, and values.
 */

import { useRef, useState, useEffect } from "react";
import { usePageContent } from '@/contexts/CMSContext';
import { renderBootstrapIcon } from '@/utils/iconRenderer';
import saadImage from '@/components/image/saad.jpg';
import muzzamilImage from '@/components/image/Muzzamil.jpg';
import umarImage from '@/components/image/umar.jpg';

const AboutPage = () => {
  const { pageContent, loading } = usePageContent();
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // CMS data with defaults
  const aboutTitle = pageContent?.about?.title || 'About Devnzo';
  const aboutDescription = pageContent?.about?.description || "We're on a mission to empower businesses worldwide with innovative technology solutions that drive sustainable growth and success.";
  const aboutMission = pageContent?.about?.mission || "At Devnzo, we believe every business deserves access to powerful, enterprise-grade tools that were once only available to large corporations. Our mission is to democratize technology and empower businesses of all sizes to compete and succeed in the digital age.";
  const aboutVision = pageContent?.about?.vision || "Since our founding, we've helped over 50,000 businesses across 150+ countries transform their operations, increase efficiency, and achieve remarkable growth.";

  // CMS stats with defaults
  const cmsStats = pageContent?.about?.stats || [
    { value: '50K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '500M+', label: 'Transactions' },
    { value: '200+', label: 'Team Members' },
  ];

  // CMS values with defaults
  const valuesData = pageContent?.about?.values || [
    {
      icon: "Target",
      title: "Innovation First",
      description: "We constantly push boundaries to deliver cutting-edge solutions that drive business growth.",
    },
    {
      icon: "People",
      title: "Customer Success",
      description: "Our customers' success is our success. We're committed to helping businesses thrive.",
    },
    {
      icon: "ShieldCheck",
      title: "Trust & Security",
      description: "We maintain the highest standards of security and reliability in everything we do.",
    },
    {
      icon: "Globe",
      title: "Global Impact",
      description: "We're building solutions that make a positive impact on businesses worldwide.",
    },
  ];

  // CMS team with defaults (using local images)
  const team = pageContent?.about?.team || [
    {
      name: "Saad Muneeb Khan",
      role: "CEO & Founder",
      image: saadImage,
      description: "Visionary leader with 15+ years in tech and eCommerce.",
    },
    {
      name: "Muzzamil Riaz",
      role: "CTO",
      image: muzzamilImage,
      description: "Technology expert driving innovation and platform development.",
    },
    {
      name: "Muhammad Umar",
      role: "Head of Product",
      image: umarImage,
      description: "Product strategist with a passion for user experience.",
    },
  ];

  // Mission Section customization
  const missionImageUrl = pageContent?.about?.missionSection?.imageUrl || "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600";
  const missionBadgeText = pageContent?.about?.missionSection?.badgeText || "2+";
  const missionBadgeSubtext = pageContent?.about?.missionSection?.badgeSubtext || "Years of Excellence";

  // Animated counter hook
  const useAnimatedCounter = (end: number, duration: number = 2000, isActive: boolean = false) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      if (!isActive || hasAnimated) return;

      setHasAnimated(true);
      let startTime: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(end * easeOutQuart);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [end, duration, isActive, hasAnimated]);

    return count;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [loading]); // Re-initialize observer after loading completes

  // Show loading state while CMS data is being fetched (after all hooks)
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Simple stat display for CMS string stats
  const StatDisplay = ({ stat, index }: { stat: { value: string; label: string }; index: number }) => {
    return (
      <div
        className={`text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
          {stat.value}
        </div>
        <div className="text-muted-foreground font-medium">{stat.label}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">{aboutTitle}</h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            {aboutDescription}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {aboutMission}
              </p>
              <p className="text-lg text-muted-foreground">
                {aboutVision}
              </p>
            </div>
            <div className="relative">
              <img
                src={missionImageUrl}
                alt="Team collaboration"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-gradient-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">{missionBadgeText}</div>
                <div className="text-sm">{missionBadgeSubtext}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {cmsStats.map((stat, index) => (
              <StatDisplay key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valuesData.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-md border border-border hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {renderBootstrapIcon(value.icon, "text-primary", 32)}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground">Meet the people driving innovation at Devnzo</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl overflow-hidden shadow-md border border-border hover:shadow-lg transition-all duration-300"
              >
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
