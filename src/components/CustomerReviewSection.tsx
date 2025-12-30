/**
 * Customer Review Section Component
 * Displays customer testimonials with scrolling animation
 */

import { Star, Shield, CheckCircle } from 'lucide-react';

const CustomerReviewSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Mitchell",
      company: "Unique Camping Marine",
      position: "Store Owner",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      text: "As far as compliance goes, there isn't an app better, we had to customize the widget a bit to fit our needs but it functions great. Customer support was kind and helpful.",
      verified: true
    },
    {
      id: 2,
      name: "Marcus Thompson",
      company: "Barefoot Junkie",
      position: "Founder",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      text: "Devnzo transformed our business operations. We've seen a 300% increase in efficiency since implementation. The team is exceptional.",
      verified: true
    },
    {
      id: 3,
      name: "Emily Chen",
      company: "TechFlow Solutions",
      position: "CEO",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      text: "Outstanding support and cutting-edge technology. Devnzo is truly a game-changer in our industry. Highly recommended!",
      verified: true
    },
    {
      id: 4,
      name: "David Kim",
      company: "StartupX",
      position: "CTO",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      text: "The analytics capabilities have given us insights we never had before. Our decision-making has improved dramatically.",
      verified: true
    },
    {
      id: 5,
      name: "Lisa Wang",
      company: "Enterprise Corp",
      position: "Director",
      avatar: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      text: "Security was our top concern, and Devnzo exceeded all our expectations. We feel completely protected.",
      verified: true
    },
    {
      id: 6,
      name: "James Wilson",
      company: "Growth Partners",
      position: "Manager",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      text: "The automation features have saved us countless hours. We can now focus on what really matters - growing our business.",
      verified: true
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
    <section className="py-20 bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-primary font-semibold">Trusted by 50,000+ Businesses</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their businesses with Devnzo Commerce.
          </p>
        </div>

        {/* Reviews Carousel */}
        <div className="testimonials-slider">
          <div className="testimonials-track gap-6">
            {/* First set of reviews */}
            {reviews.map((review) => (
              <div
                key={`first-${review.id}`}
                className="flex-shrink-0 w-[350px] bg-card rounded-2xl p-6 shadow-md border border-border"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{review.name}</h4>
                      {review.verified && (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{review.position} at {review.company}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {renderStars(review.rating)}
                </div>
                <p className="text-foreground leading-relaxed">{review.text}</p>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {reviews.map((review) => (
              <div
                key={`second-${review.id}`}
                className="flex-shrink-0 w-[350px] bg-card rounded-2xl p-6 shadow-md border border-border"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{review.name}</h4>
                      {review.verified && (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{review.position} at {review.company}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {renderStars(review.rating)}
                </div>
                <p className="text-foreground leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewSection;
