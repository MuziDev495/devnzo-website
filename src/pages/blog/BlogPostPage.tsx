import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  createdAt: Date;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

const BlogPostPage: React.FC = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        // Try to get by document ID first (which is the slug)
        const docRef = doc(db, 'blog_posts', slug);
        let docSnap = await getDoc(docRef);

        // If not found by ID, search by slug field
        if (!docSnap.exists()) {
          const postsRef = collection(db, 'blog_posts');
          const q = query(postsRef, where('slug', '==', slug), limit(1));
          const querySnap = await getDocs(q);
          
          if (!querySnap.empty) {
            docSnap = querySnap.docs[0];
          }
        }

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPost({
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date()
          } as BlogPost);

          // Fetch related posts
          const relatedQuery = query(
            collection(db, 'blog_posts'),
            where('status', '==', 'published'),
            limit(3)
          );
          const relatedSnap = await getDocs(relatedQuery);
          const related = relatedSnap.docs
            .filter(d => d.id !== docSnap.id)
            .slice(0, 2)
            .map(d => ({
              id: d.id,
              ...d.data(),
              createdAt: d.data().createdAt?.toDate() || new Date()
            })) as BlogPost[];
          setRelatedPosts(related);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.metaTitle || post.title} | Devnzo Blog</title>
        <meta name="description" content={post.metaDescription || post.excerpt || ''} />
        {post.keywords && <meta name="keywords" content={post.keywords} />}
        <meta property="og:title" content={post.metaTitle || post.title} />
        <meta property="og:description" content={post.metaDescription || post.excerpt || ''} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
        <meta property="og:type" content="article" />
      </Helmet>

      <article className="min-h-screen py-16 md:py-24">
        <div className="container max-w-4xl">
          {/* Back button */}
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(post.createdAt, 'MMMM d, yyyy')}
              </div>
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow group">
                    {relatedPost.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={relatedPost.featuredImage} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        <Link to={`/blog/${relatedPost.slug || relatedPost.id}`}>
                          {relatedPost.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link 
                        to={`/blog/${relatedPost.slug || relatedPost.id}`}
                        className="inline-flex items-center text-primary hover:underline"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogPostPage;
