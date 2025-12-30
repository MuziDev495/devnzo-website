import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, PenLine, Plus } from 'lucide-react';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  status: 'draft' | 'published';
  createdAt: Date;
  views?: number;
}

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0
  });
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const postsRef = collection(db, 'blog_posts');
        
        // Get all posts for stats
        const allPostsSnap = await getDocs(postsRef);
        const posts = allPostsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as BlogPost[];

        const publishedCount = posts.filter(p => p.status === 'published').length;
        
        setStats({
          totalPosts: posts.length,
          publishedPosts: publishedCount,
          draftPosts: posts.length - publishedCount
        });

        // Get recent posts
        const recentQuery = query(
          postsRef,
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const recentSnap = await getDocs(recentQuery);
        const recent = recentSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as BlogPost[];
        
        setRecentPosts(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      title: 'Total Posts', 
      value: stats.totalPosts, 
      icon: FileText, 
      color: 'text-primary' 
    },
    { 
      title: 'Published', 
      value: stats.publishedPosts, 
      icon: Eye, 
      color: 'text-success' 
    },
    { 
      title: 'Drafts', 
      value: stats.draftPosts, 
      icon: PenLine, 
      color: 'text-warning' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the Devnzo admin panel</p>
        </div>
        <Button asChild className="bg-gradient-primary hover:opacity-90">
          <Link to="/admin/blog/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loading ? '...' : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Your latest blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : recentPosts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No blog posts yet</p>
              <Button asChild>
                <Link to="/admin/blog/new">Create Your First Post</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/admin/blog/edit/${post.id}`}
                      className="font-medium hover:text-primary truncate block"
                    >
                      {post.title || 'Untitled'}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {format(post.createdAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                    {post.status}
                  </Badge>
                </div>
              ))}
              
              <div className="pt-4 border-t border-border">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/admin/blog">View All Posts</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <Link to="/admin/blog/new">
            <CardHeader>
              <CardTitle className="text-lg">Create Blog Post</CardTitle>
              <CardDescription>Write and publish new content</CardDescription>
            </CardHeader>
          </Link>
        </Card>
        
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <Link to="/admin/content">
            <CardHeader>
              <CardTitle className="text-lg">Edit Page Content</CardTitle>
              <CardDescription>Update website sections</CardDescription>
            </CardHeader>
          </Link>
        </Card>
        
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <Link to="/admin/seo">
            <CardHeader>
              <CardTitle className="text-lg">SEO Settings</CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
