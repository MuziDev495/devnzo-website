/**
 * Seed Blog Posts Utility
 * Seeds demo blog posts to Firebase for testing purposes
 */

import { collection, addDoc, getDocs, query, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const demoBlogPosts = [
  {
    title: '10 Ways to Boost Your E-commerce Sales in 2024',
    slug: '10-ways-boost-ecommerce-sales-2024',
    excerpt: 'Discover proven strategies to increase your online store revenue and customer engagement.',
    content: `<h2>Introduction</h2>
<p>In today's competitive e-commerce landscape, standing out requires more than just having great products. You need smart strategies that drive traffic, convert visitors, and build lasting customer relationships.</p>

<h2>1. Optimize Your Product Pages</h2>
<p>Your product pages are your digital salespeople. Ensure they have high-quality images, detailed descriptions, and clear calls-to-action.</p>

<h2>2. Implement Email Marketing Automation</h2>
<p>Set up automated email sequences for abandoned carts, welcome series, and post-purchase follow-ups to maximize revenue.</p>

<h2>3. Leverage Social Proof</h2>
<p>Display customer reviews, ratings, and user-generated content to build trust with potential buyers.</p>

<h2>4. Offer Multiple Payment Options</h2>
<p>From credit cards to digital wallets, give customers the flexibility to pay how they prefer.</p>

<h2>5. Focus on Mobile Experience</h2>
<p>With over 60% of e-commerce traffic coming from mobile devices, a seamless mobile experience is essential.</p>`,
    featuredImage: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'E-commerce',
    author: 'John Smith',
    published: true,
    readTime: '8 min read',
    seoTitle: '10 Ways to Boost Your E-commerce Sales in 2024 | Devnzo',
    seoDescription: 'Discover proven strategies to increase your online store revenue and customer engagement.',
  },
  {
    title: 'The Future of AI in E-commerce',
    slug: 'future-ai-ecommerce',
    excerpt: 'How artificial intelligence is transforming the online shopping experience.',
    content: `<h2>AI Revolution in E-commerce</h2>
<p>Artificial intelligence is no longer a futuristic concept—it's reshaping how we shop online today. From personalized recommendations to chatbots, AI is everywhere.</p>

<h2>Personalized Product Recommendations</h2>
<p>AI algorithms analyze customer behavior to suggest products they're most likely to purchase, increasing conversion rates significantly.</p>

<h2>Intelligent Chatbots</h2>
<p>24/7 customer support powered by AI can handle common queries, process orders, and provide instant assistance.</p>

<h2>Visual Search Technology</h2>
<p>Customers can now search for products using images instead of text, making discovery more intuitive.</p>

<h2>Dynamic Pricing</h2>
<p>AI-powered pricing strategies adjust prices in real-time based on demand, competition, and inventory levels.</p>`,
    featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Technology',
    author: 'Sarah Johnson',
    published: true,
    readTime: '6 min read',
    seoTitle: 'The Future of AI in E-commerce | Devnzo',
    seoDescription: 'How artificial intelligence is transforming the online shopping experience.',
  },
  {
    title: 'Mastering Social Media Marketing',
    slug: 'mastering-social-media-marketing',
    excerpt: 'A comprehensive guide to leveraging social media for your business growth.',
    content: `<h2>The Power of Social Media</h2>
<p>Social media platforms offer unprecedented access to your target audience. Learn how to leverage these channels for maximum impact.</p>

<h2>Choosing the Right Platforms</h2>
<p>Not every platform is right for every business. Focus on where your target audience spends their time.</p>

<h2>Creating Engaging Content</h2>
<p>From videos to stories to posts, learn what types of content resonate with your audience and drive engagement.</p>

<h2>Building Community</h2>
<p>Social media is about building relationships. Engage with your followers and create a community around your brand.</p>

<h2>Measuring Success</h2>
<p>Track the right metrics to understand what's working and optimize your strategy accordingly.</p>`,
    featuredImage: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Marketing',
    author: 'Mike Wilson',
    published: true,
    readTime: '10 min read',
    seoTitle: 'Mastering Social Media Marketing | Devnzo',
    seoDescription: 'A comprehensive guide to leveraging social media for your business growth.',
  },
  {
    title: 'Design Trends for 2024',
    slug: 'design-trends-2024',
    excerpt: 'Stay ahead of the curve with these emerging design trends in e-commerce.',
    content: `<h2>The Evolution of E-commerce Design</h2>
<p>Design trends evolve rapidly. Stay ahead of your competition by implementing these cutting-edge design principles.</p>

<h2>Minimalist Aesthetics</h2>
<p>Clean, simple designs with plenty of white space help products stand out and improve user experience.</p>

<h2>Dark Mode Support</h2>
<p>Offering a dark mode option caters to user preferences and can reduce eye strain.</p>

<h2>Micro-interactions</h2>
<p>Small, delightful animations make your site feel more responsive and engaging.</p>

<h2>3D Product Visualization</h2>
<p>Allow customers to interact with 3D models of products for a more immersive shopping experience.</p>`,
    featuredImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Design',
    author: 'Emily Brown',
    published: true,
    readTime: '7 min read',
    seoTitle: 'Design Trends for 2024 | Devnzo',
    seoDescription: 'Stay ahead of the curve with these emerging design trends in e-commerce.',
  },
  {
    title: 'Optimizing Your Store for Mobile',
    slug: 'optimizing-store-mobile',
    excerpt: 'Essential tips for creating a seamless mobile shopping experience.',
    content: `<h2>Mobile-First is Essential</h2>
<p>With mobile commerce growing every year, optimizing for mobile isn't optional—it's essential for success.</p>

<h2>Responsive Design</h2>
<p>Ensure your site looks and functions perfectly on all screen sizes and devices.</p>

<h2>Fast Loading Times</h2>
<p>Mobile users expect speed. Optimize images, minimize code, and use caching to improve load times.</p>

<h2>Touch-Friendly Navigation</h2>
<p>Design buttons and navigation elements that are easy to tap with fingers, not just click with a mouse.</p>

<h2>Simplified Checkout</h2>
<p>Reduce friction in the mobile checkout process with auto-fill, digital wallets, and minimal form fields.</p>`,
    featuredImage: 'https://images.pexels.com/photos/38544/imac-apple-mockup-app-38544.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Development',
    author: 'David Lee',
    published: true,
    readTime: '9 min read',
    seoTitle: 'Optimizing Your Store for Mobile | Devnzo',
    seoDescription: 'Essential tips for creating a seamless mobile shopping experience.',
  },
  {
    title: 'Building Customer Loyalty',
    slug: 'building-customer-loyalty',
    excerpt: 'Strategies to create lasting relationships with your customers.',
    content: `<h2>Why Loyalty Matters</h2>
<p>Acquiring new customers costs 5x more than retaining existing ones. Invest in loyalty programs and customer relationships.</p>

<h2>Create a Loyalty Program</h2>
<p>Reward repeat customers with points, discounts, and exclusive perks to keep them coming back.</p>

<h2>Exceptional Customer Service</h2>
<p>Go above and beyond to resolve issues quickly and make customers feel valued.</p>

<h2>Personalized Experiences</h2>
<p>Use customer data to create personalized recommendations, offers, and communications.</p>

<h2>Build Community</h2>
<p>Create spaces for customers to connect with each other and your brand through social media, forums, and events.</p>`,
    featuredImage: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Business',
    author: 'Lisa Chen',
    published: true,
    readTime: '5 min read',
    seoTitle: 'Building Customer Loyalty | Devnzo',
    seoDescription: 'Strategies to create lasting relationships with your customers.',
  },
];

export const seedBlogPosts = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if posts already exist
    const existingQuery = query(collection(db, 'blog_posts'), limit(1));
    const existingDocs = await getDocs(existingQuery);
    
    if (!existingDocs.empty) {
      return { success: false, message: 'Blog posts already exist. Skipping seed.' };
    }

    // Add demo posts
    for (const post of demoBlogPosts) {
      await addDoc(collection(db, 'blog_posts'), {
        ...post,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    return { success: true, message: `Successfully seeded ${demoBlogPosts.length} blog posts.` };
  } catch (error) {
    console.error('Error seeding blog posts:', error);
    return { success: false, message: 'Failed to seed blog posts.' };
  }
};

export const forceSeedBlogPosts = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Add demo posts without checking
    for (const post of demoBlogPosts) {
      await addDoc(collection(db, 'blog_posts'), {
        ...post,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    return { success: true, message: `Successfully seeded ${demoBlogPosts.length} blog posts.` };
  } catch (error) {
    console.error('Error seeding blog posts:', error);
    return { success: false, message: 'Failed to seed blog posts.' };
  }
};
