/**
 * All Blog Page Component
 * Displays blog posts from Firebase with filtering and search capabilities
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category?: string;
  author?: string;
  createdAt: Date;
  readTime?: string;
}

const AllBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'E-commerce',
    'Marketing',
    'Technology',
    'Business',
    'Design',
    'Development'
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, 'blog_posts'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedPosts: BlogPost[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const isPublished = data.status === 'published' || data.published === true;
          if (isPublished) {
            fetchedPosts.push({
              id: doc.id,
              title: data.title,
              slug: data.slug,
              excerpt: data.excerpt,
              featuredImage: data.featuredImage,
              category: data.category || 'Business',
              author: data.author || 'Devnzo Team',
              createdAt: data.createdAt?.toDate() || new Date(),
              readTime: data.readTime || '5 min read',
            });
          }
        });
        
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;
    
    if (activeCategory !== 'All') {
      result = result.filter(post => post.category === activeCategory);
    }
    
    if (searchQuery) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredPosts(result);
  }, [searchQuery, activeCategory, posts]);

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      'E-commerce': '📈',
      'Technology': '🤖',
      'Marketing': '📱',
      'Design': '🎨',
      'Development': '💻',
      'Business': '💝',
    };
    return emojiMap[category] || '📄';
  };

  return (
    <>
      <Helmet>
        <title>Blog & Resources - Devnzo</title>
        <meta name="description" content="Stay updated with the latest insights, tips, and trends in e-commerce, technology, and business growth." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Blog & Resources
              </h1>
              <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
                Stay updated with the latest insights, tips, and trends in e-commerce, 
                technology, and business growth.
              </p>
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-6 rounded-lg bg-background/95 border-border text-foreground placeholder:text-muted-foreground"
                  />
                  <Search className="w-5 h-5 text-muted-foreground absolute right-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Browse Articles</h2>
              <button className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                <Filter className="w-5 h-5 mr-2" />
                Filter
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors border ${
                    activeCategory === category
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">No posts found</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchQuery || activeCategory !== 'All' 
                    ? 'Try adjusting your search or filter criteria.'
                    : "We're working on creating valuable content for you. Check back soon!"}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="aspect-video overflow-hidden">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-5xl">
                          {getCategoryEmoji(post.category || 'Business')}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{format(post.createdAt, 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      <Link
                        to={`/blog/${post.slug || post.id}`}
                        className="mt-6 w-full flex items-center justify-center text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-6">
              Stay Updated with Our Newsletter
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Get the latest articles and insights delivered straight to your inbox.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-6 bg-background/95 border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button className="px-8 py-6 font-semibold">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AllBlogPage;
