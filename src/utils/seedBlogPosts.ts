/**
 * Seed Blog Posts Utility
 * Seeds demo blog posts to Firebase for testing purposes
 */

import { collection, addDoc, getDocs, query, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const demoBlogPosts = [
  {
    title: 'The Ultimate Guide to Shopify SEO in 2025',
    slug: 'ultimate-guide-shopify-seo-2025',
    excerpt: 'Learn how to optimize your Shopify store for search engines and drive more organic traffic. This comprehensive guide covers everything from keyword research to technical SEO.',
    content: `<h2>Introduction to Shopify SEO</h2>
<p>Search engine optimization (SEO) is crucial for any e-commerce business. With millions of Shopify stores competing for attention, having a solid SEO strategy can make the difference between success and obscurity.</p>

<h2>Keyword Research</h2>
<p>Start by identifying the keywords your target customers are searching for. Use tools like Google Keyword Planner, Ahrefs, or SEMrush to discover high-value keywords in your niche.</p>

<h2>On-Page Optimization</h2>
<p>Optimize your product titles, descriptions, and meta tags with your target keywords. Make sure your URLs are clean and descriptive.</p>

<h2>Technical SEO</h2>
<p>Ensure your store loads quickly, is mobile-friendly, and has proper schema markup. These technical factors significantly impact your search rankings.</p>

<h2>Content Marketing</h2>
<p>Create valuable blog content that attracts and engages your target audience. This builds authority and drives organic traffic to your store.</p>`,
    featuredImage: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
    published: true,
    readTime: '8 min read',
    seoTitle: 'The Ultimate Guide to Shopify SEO in 2025 | Devnzo',
    seoDescription: 'Master Shopify SEO with our comprehensive 2025 guide. Learn keyword research, on-page optimization, and technical SEO strategies.',
  },
  {
    title: '10 Essential Shopify Apps Every Store Needs',
    slug: '10-essential-shopify-apps',
    excerpt: 'Discover the must-have Shopify apps that will help you boost sales, improve customer experience, and streamline your operations.',
    content: `<h2>Why Apps Matter</h2>
<p>Shopify apps extend the functionality of your store, helping you automate tasks, improve customer experience, and increase conversions.</p>

<h2>1. Email Marketing Apps</h2>
<p>Email marketing remains one of the highest ROI channels. Apps like Klaviyo and Omnisend help you create targeted campaigns.</p>

<h2>2. Review Apps</h2>
<p>Social proof is powerful. Apps like Judge.me and Loox help you collect and display customer reviews effectively.</p>

<h2>3. SEO Apps</h2>
<p>Optimize your store for search engines with apps that help you manage meta tags, fix broken links, and improve site structure.</p>

<h2>4. Analytics Apps</h2>
<p>Understand your customers better with advanced analytics tools that go beyond Shopify's built-in reporting.</p>

<h2>5. Customer Support Apps</h2>
<p>Provide excellent customer service with live chat and help desk solutions integrated directly into your store.</p>`,
    featuredImage: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
    published: true,
    readTime: '6 min read',
    seoTitle: '10 Essential Shopify Apps Every Store Needs | Devnzo',
    seoDescription: 'Discover the top 10 Shopify apps that will transform your e-commerce store. From email marketing to analytics.',
  },
  {
    title: 'How to Increase Your Shopify Store Conversion Rate',
    slug: 'increase-shopify-conversion-rate',
    excerpt: 'Practical strategies to convert more visitors into customers. Learn proven techniques to optimize your product pages and checkout process.',
    content: `<h2>Understanding Conversion Rate</h2>
<p>Your conversion rate is the percentage of visitors who complete a purchase. Even small improvements can significantly impact your revenue.</p>

<h2>Optimize Product Pages</h2>
<p>Use high-quality images, compelling descriptions, and clear calls-to-action. Include social proof like reviews and testimonials.</p>

<h2>Streamline Checkout</h2>
<p>Remove friction from the checkout process. Offer guest checkout, multiple payment options, and clear shipping information.</p>

<h2>Build Trust</h2>
<p>Display security badges, clear return policies, and customer testimonials. Trust is essential for e-commerce conversions.</p>

<h2>Mobile Optimization</h2>
<p>Ensure your store provides an excellent mobile experience. Over 50% of e-commerce traffic comes from mobile devices.</p>`,
    featuredImage: 'https://images.pexels.com/photos/67112/pexels-photo-67112.jpeg?auto=compress&cs=tinysrgb&w=800',
    published: true,
    readTime: '7 min read',
    seoTitle: 'How to Increase Your Shopify Store Conversion Rate | Devnzo',
    seoDescription: 'Learn proven strategies to boost your Shopify store conversion rate. Optimize product pages, streamline checkout, and more.',
  },
  {
    title: 'Building a Successful Dropshipping Business in 2025',
    slug: 'successful-dropshipping-business-2025',
    excerpt: 'Everything you need to know about starting and scaling a dropshipping business. From finding suppliers to marketing your products.',
    content: `<h2>What is Dropshipping?</h2>
<p>Dropshipping is a retail fulfillment method where you don't keep products in stock. Instead, you purchase items from a third party and ship directly to customers.</p>

<h2>Finding the Right Niche</h2>
<p>Choose a niche that has demand but isn't oversaturated. Look for products with good margins and passionate audiences.</p>

<h2>Supplier Selection</h2>
<p>Partner with reliable suppliers who offer quality products and fast shipping. Consider using platforms like Spocket or DSers.</p>

<h2>Marketing Strategies</h2>
<p>Focus on building a strong brand and using targeted advertising. Social media marketing and influencer partnerships can be highly effective.</p>

<h2>Customer Service</h2>
<p>Provide excellent customer service to build loyalty and encourage repeat purchases. Respond quickly to inquiries and handle issues professionally.</p>`,
    featuredImage: 'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&cs=tinysrgb&w=800',
    published: true,
    readTime: '9 min read',
    seoTitle: 'Building a Successful Dropshipping Business in 2025 | Devnzo',
    seoDescription: 'Complete guide to starting a profitable dropshipping business in 2025. Learn about niche selection, suppliers, and marketing.',
  },
  {
    title: 'Email Marketing Best Practices for E-commerce',
    slug: 'email-marketing-best-practices-ecommerce',
    excerpt: 'Master email marketing for your online store. Learn how to build your list, create engaging campaigns, and drive repeat purchases.',
    content: `<h2>The Power of Email Marketing</h2>
<p>Email marketing offers one of the highest ROIs of any marketing channel. For e-commerce, it's essential for customer retention and repeat sales.</p>

<h2>Building Your Email List</h2>
<p>Use pop-ups, exit-intent offers, and landing pages to capture email addresses. Offer incentives like discounts or free shipping.</p>

<h2>Segmentation</h2>
<p>Segment your list based on behavior, purchase history, and preferences. Personalized emails have much higher open and click rates.</p>

<h2>Automated Flows</h2>
<p>Set up automated email sequences for welcome series, abandoned cart recovery, post-purchase follow-ups, and win-back campaigns.</p>

<h2>Testing and Optimization</h2>
<p>Continuously test subject lines, content, and send times. Use A/B testing to improve your email performance over time.</p>`,
    featuredImage: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800',
    published: true,
    readTime: '6 min read',
    seoTitle: 'Email Marketing Best Practices for E-commerce | Devnzo',
    seoDescription: 'Learn email marketing best practices specifically for e-commerce stores. Build your list, segment, and automate for success.',
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
