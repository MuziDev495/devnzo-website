/**
 * Documentation Editor
 * TipTap-based rich text editor for documentation articles
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, collection, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const DocumentationEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [visible, setVisible] = useState(true);
  const [order, setOrder] = useState(0);
  const [parentId, setParentId] = useState<string | null>(null);
  const [allArticles, setAllArticles] = useState<Array<{ id: string; title: string; slug: string; parentId?: string }>>([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline' },
      }),
      TiptapImage.configure({
        HTMLAttributes: { class: 'max-w-full rounded-lg' },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  useEffect(() => {
    fetchAllArticles();
    if (isEditing) {
      fetchArticle();
    } else {
      fetchNextOrder();
    }
  }, [id]);

  const fetchAllArticles = async () => {
    try {
      const q = query(collection(db, 'documentation'));
      const snapshot = await getDocs(q);
      const articles = snapshot.docs
        .filter(doc => doc.id !== id) // Exclude current article when editing
        .map(doc => ({
          id: doc.id,
          title: doc.data().title,
          slug: doc.data().slug,
          parentId: doc.data().parentId
        }))
        // Only show top-level articles as potential parents
        .filter(article => !article.parentId);
      setAllArticles(articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const fetchArticle = async () => {
    try {
      const docRef = doc(db, 'documentation', id!);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || '');
        setSlug(data.slug || '');
        setVisible(data.visible !== false);
        setOrder(data.order || 0);
        setParentId(data.parentId || null);
        editor?.commands.setContent(data.content || '');
      } else {
        toast({ title: 'Error', description: 'Article not found', variant: 'destructive' });
        navigate('/admin/documentation');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      toast({ title: 'Error', description: 'Failed to load article', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchNextOrder = async () => {
    try {
      const q = query(collection(db, 'documentation'), orderBy('order', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const maxOrder = snapshot.docs[0].data().order || 0;
        setOrder(maxOrder + 1);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isEditing || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }
    if (!slug.trim()) {
      toast({ title: 'Error', description: 'Slug is required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const content = editor?.getHTML() || '';
      // Find parent article slug for URL construction
      const parentArticle = parentId ? allArticles.find(a => a.id === parentId) : null;

      const articleData = {
        title: title.trim(),
        slug: slug.trim(),
        content,
        visible,
        order,
        parentId: parentId || null,
        parentSlug: parentArticle?.slug || null,
        updatedAt: serverTimestamp(),
      };

      if (isEditing) {
        await updateDoc(doc(db, 'documentation', id!), articleData);
        toast({ title: 'Saved', description: 'Article updated successfully' });
      } else {
        const newDocRef = doc(collection(db, 'documentation'));
        await setDoc(newDocRef, {
          ...articleData,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Created', description: 'Article created successfully' });
        navigate('/admin/documentation');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast({ title: 'Error', description: 'Failed to save article', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

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
          <Link to="/admin/documentation" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditing ? 'Edit Article' : 'New Article'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update your documentation article' : 'Create a new documentation article'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {slug && (
            <Button
              variant="outline"
              onClick={() => window.open(`/docs/${slug}`, '_blank')}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article title"
              className="text-lg"
            />
          </div>

          {/* Editor Toolbar */}
          <Card>
            <div className="flex flex-wrap gap-1 p-2 border-b">
              <Button
                type="button"
                variant={editor?.isActive('bold') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                B
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('italic') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                I
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              >
                H1
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                H2
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('heading', { level: 3 }) ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              >
                H3
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('bulletList') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              >
                • List
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('orderedList') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              >
                1. List
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('blockquote') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              >
                Quote
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('codeBlock') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              >
                Code
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('link') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={addLink}
              >
                Link
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addImage}
              >
                Image
              </Button>
            </div>
            <EditorContent editor={editor} />
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              {/* Parent Article Selection */}
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Article</Label>
                <select
                  id="parent"
                  value={parentId || ''}
                  onChange={(e) => setParentId(e.target.value || null)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">None (Top-level article)</option>
                  {allArticles.map(article => (
                    <option key={article.id} value={article.id}>
                      {article.title}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  {parentId ? 'This article will appear under the selected parent' : 'This will be a top-level article in the navigation'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    /docs/{parentId ? `${allArticles.find(a => a.id === parentId)?.slug || '...'}/` : ''}
                  </span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="article-slug"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first in the sidebar
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="visible">Visible</Label>
                <Switch
                  id="visible"
                  checked={visible}
                  onCheckedChange={setVisible}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentationEditor;
