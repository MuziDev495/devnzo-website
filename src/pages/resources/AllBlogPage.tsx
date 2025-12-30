/**
 * All Blog Page Component
 * Displays blog posts from Firebase for the resources section
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Helmet } from 'react-helmet-async';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  createdAt: Date;
  readTime?: string;
}

const AllBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Query for posts with status='published' OR published=true (for backward compatibility)
        const q = query(
          collection(db, 'blog_posts'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedPosts: BlogPost[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Check for both 'status' field (new) and 'published' field (seed data)
          const isPublished = data.status === 'published' || data.published === true;
          if (isPublished) {
            fetchedPosts.push({
              id: doc.id,
              title: data.title,
              slug: data.slug,
              excerpt: data.excerpt,
              featuredImage: data.featuredImage,
              createdAt: data.createdAt?.toDate() || new Date(),
              readTime: data.readTime || '5 min read',
            });
          }
        });
        
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog - Devnzo Resources</title>
        <meta name="description" content="Latest insights, tips, and industry news for eCommerce success. Read our blog for expert guidance." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
              Blog
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              Latest insights, tips, and industry news for eCommerce success
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">No posts yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We're working on creating valuable content for you. Check back soon for our latest articles and insights.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-card rounded-2xl shadow-md border border-border overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="aspect-video overflow-hidden bg-muted">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <Calendar className="w-12 h-12 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(post.createdAt, 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Link
                        to={`/blog/${post.slug || post.id}`}
                        className="inline-flex items-center text-primary font-medium group-hover:gap-3 transition-all"
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
      </div>
    </>
  );
};

export default AllBlogPage;
