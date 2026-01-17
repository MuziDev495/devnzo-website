/**
 * Documentation Manager
 * Admin page for managing GitBook-style documentation articles
 */

import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Search,
  GripVertical,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export interface DocArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  order: number;
  parentId?: string;
  visible: boolean;
  createdAt: any;
  updatedAt: any;
}

const DocumentationManager: React.FC = () => {
  const [articles, setArticles] = useState<DocArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<DocArticle | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const q = query(collection(db, 'documentation'), orderBy('order'));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DocArticle[];
      setArticles(docs);
    } catch (error) {
      console.error('Error fetching documentation:', error);
      toast({ title: 'Error', description: 'Failed to load documentation articles', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (article: DocArticle) => {
    try {
      await updateDoc(doc(db, 'documentation', article.id), {
        visible: !article.visible
      });
      setArticles(articles.map(a => 
        a.id === article.id ? { ...a, visible: !a.visible } : a
      ));
      toast({ title: 'Updated', description: `Article ${article.visible ? 'hidden' : 'visible'} now` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update visibility', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, 'documentation', deleteId));
      setArticles(articles.filter(a => a.id !== deleteId));
      toast({ title: 'Deleted', description: 'Article deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete article', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, article: DocArticle) => {
    setDraggedItem(article);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetArticle: DocArticle) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetArticle.id) return;

    const newArticles = [...articles];
    const draggedIndex = newArticles.findIndex(a => a.id === draggedItem.id);
    const targetIndex = newArticles.findIndex(a => a.id === targetArticle.id);

    newArticles.splice(draggedIndex, 1);
    newArticles.splice(targetIndex, 0, draggedItem);

    // Update order for all articles
    const reordered = newArticles.map((article, index) => ({
      ...article,
      order: index
    }));

    setArticles(reordered);
    setDraggedItem(null);

    // Save new order to Firestore
    try {
      await Promise.all(
        reordered.map(article => 
          updateDoc(doc(db, 'documentation', article.id), { order: article.order })
        )
      );
      toast({ title: 'Reordered', description: 'Article order updated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save order', variant: 'destructive' });
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Documentation</h1>
            <p className="text-muted-foreground">Manage your GitBook-style documentation</p>
          </div>
        </div>
        <Button onClick={() => navigate('/admin/documentation/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Article
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Articles ({filteredArticles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No documentation articles yet.</p>
              <Button 
                variant="link" 
                onClick={() => navigate('/admin/documentation/new')}
                className="mt-2"
              >
                Create your first article
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, article)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, article)}
                  className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                    draggedItem?.id === article.id 
                      ? 'opacity-50 border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">/docs/{article.slug}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={article.visible}
                      onCheckedChange={() => toggleVisibility(article)}
                    />
                    <span className="text-xs text-muted-foreground w-12">
                      {article.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(`/docs/${article.slug}`, '_blank')}
                      title="Preview"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/documentation/edit/${article.id}`)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(article.id)}
                      className="text-destructive hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentationManager;
