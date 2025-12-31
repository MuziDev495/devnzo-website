/**
 * Navigation Manager
 * WordPress-style menu builder for managing all site navigation menus
 */

import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronRight, 
  ExternalLink,
  Save,
  Menu,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCMS } from '@/contexts/CMSContext';

export interface MenuItem {
  id: string;
  title: string;
  path: string;
  order: number;
  parentId?: string;
  category?: string;
  openInNewTab?: boolean;
  visible: boolean;
  children?: MenuItem[];
}

export interface MenuData {
  name: string;
  items: MenuItem[];
}

interface MenusData {
  [key: string]: MenuData;
}

// Default menus with the actual live navigation items from the website
const defaultMenus: MenusData = {
  header: {
    name: 'Header Navigation',
    items: [
      { id: 'header_1', title: 'Products', path: '/products', order: 0, visible: true },
      { id: 'header_2', title: 'Resources', path: '/resources', order: 1, visible: true },
      // Shopify category
      { id: 'header_2a', title: 'Knowledge', path: '/resources', order: 0, parentId: 'header_2', category: 'Shopify', visible: true },
      { id: 'header_2b', title: 'Shopify Apps', path: '/products', order: 1, parentId: 'header_2', category: 'Shopify', visible: true },
      // eCommerce category
      { id: 'header_2c', title: 'All Blog', path: '/blog', order: 2, parentId: 'header_2', category: 'eCommerce', visible: true },
      { id: 'header_2d', title: 'Free Tools', path: '/resources', order: 3, parentId: 'header_2', category: 'eCommerce', visible: true },
      { id: 'header_2e', title: 'Shopify Free Trial', path: 'https://www.shopify.com/free-trial', order: 4, parentId: 'header_2', category: 'eCommerce', openInNewTab: true, visible: true },
      { id: 'header_3', title: 'Partners', path: '/partners', order: 2, visible: true },
      { id: 'header_4', title: 'About', path: '/about', order: 3, visible: true },
      { id: 'header_5', title: 'Contact', path: '/contact', order: 4, visible: true },
    ]
  },
  footerCompany: {
    name: 'Footer - Company',
    items: [
      { id: 'footer_company_1', title: 'About Us', path: '/about', order: 0, visible: true },
      { id: 'footer_company_2', title: 'Contact', path: '/contact', order: 1, visible: true },
      { id: 'footer_company_3', title: 'Privacy Policy', path: '/privacy-policy', order: 2, visible: true },
      { id: 'footer_company_4', title: 'Terms of Service', path: '/terms-of-service', order: 3, visible: true },
    ]
  },
  footerResources: {
    name: 'Footer - Resources',
    items: [
      { id: 'footer_resources_1', title: 'Blog', path: '/blog', order: 0, visible: true },
      { id: 'footer_resources_2', title: 'Help Center', path: '/help-center', order: 1, visible: true },
      { id: 'footer_resources_3', title: 'Documentation', path: '/documentation', order: 2, visible: true },
      { id: 'footer_resources_4', title: 'Support', path: '/support', order: 3, visible: true },
      { id: 'footer_resources_5', title: 'FAQs', path: '/faq', order: 4, visible: true },
    ]
  }
};

const NavigationManager: React.FC = () => {
  const [menus, setMenus] = useState<MenusData>(defaultMenus);
  const [activeMenu, setActiveMenu] = useState<string>('header');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', path: '', openInNewTab: false, parentId: '' });
  const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);
  const [availablePages, setAvailablePages] = useState<{ title: string; path: string }[]>([]);
  const { refreshCMS } = useCMS();

  useEffect(() => {
    fetchMenus();
    fetchAvailablePages();
  }, []);

  const fetchMenus = async () => {
    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.menus) {
          setMenus({ ...defaultMenus, ...data.menus });
        } else {
          // Migrate existing navigation data to new menu structure
          const migratedMenus = { ...defaultMenus };
          
          if (data.navigation?.main) {
            migratedMenus.header.items = data.navigation.main.map((item: any, index: number) => ({
              id: `header_${index}`,
              title: item.title,
              path: item.path,
              order: item.order ?? index,
              visible: item.visible !== false,
              openInNewTab: false
            }));
          }
          
          if (data.footer?.company) {
            migratedMenus.footerCompany.items = data.footer.company.map((item: any, index: number) => ({
              id: `footer_company_${index}`,
              title: item.title,
              path: item.path,
              order: item.order ?? index,
              visible: true,
              openInNewTab: false
            }));
          }
          
          if (data.footer?.resources) {
            migratedMenus.footerResources.items = data.footer.resources.map((item: any, index: number) => ({
              id: `footer_resources_${index}`,
              title: item.title,
              path: item.path,
              order: item.order ?? index,
              visible: true,
              openInNewTab: false
            }));
          }
          
          setMenus(migratedMenus);
        }
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast({ title: 'Error', description: 'Failed to load menus', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePages = async () => {
    try {
      const docRef = doc(db, 'page_content', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.pages) {
          const pages = Object.entries(data.pages)
            .filter(([_, page]: [string, any]) => page.isActive)
            .map(([_, page]: [string, any]) => ({
              title: page.title,
              path: page.path
            }));
          setAvailablePages(pages);
        }
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const saveMenus = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'page_content', 'main');
      
      // Also update the legacy navigation/footer structure for backward compatibility
      const headerItems = menus.header?.items || [];
      const footerCompanyItems = menus.footerCompany?.items || [];
      const footerResourcesItems = menus.footerResources?.items || [];
      
      await updateDoc(docRef, {
        menus,
        'navigation.main': headerItems.filter(item => !item.parentId).map(item => ({
          title: item.title,
          path: item.path,
          visible: item.visible,
          order: item.order
        })),
        'footer.company': footerCompanyItems.map(item => ({
          title: item.title,
          path: item.path
        })),
        'footer.resources': footerResourcesItems.map(item => ({
          title: item.title,
          path: item.path
        }))
      });
      
      await refreshCMS();
      toast({ title: 'Success', description: 'Menus saved successfully' });
    } catch (error) {
      console.error('Error saving menus:', error);
      toast({ title: 'Error', description: 'Failed to save menus', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addMenuItem = () => {
    if (!newItem.title || !newItem.path) {
      toast({ title: 'Error', description: 'Title and path are required', variant: 'destructive' });
      return;
    }

    const currentMenu = menus[activeMenu];
    const newMenuItem: MenuItem = {
      id: `${activeMenu}_${Date.now()}`,
      title: newItem.title,
      path: newItem.path.startsWith('/') || newItem.path.startsWith('http') ? newItem.path : `/${newItem.path}`,
      order: currentMenu.items.length,
      parentId: newItem.parentId || undefined,
      openInNewTab: newItem.openInNewTab,
      visible: true
    };

    setMenus({
      ...menus,
      [activeMenu]: {
        ...currentMenu,
        items: [...currentMenu.items, newMenuItem]
      }
    });

    setNewItem({ title: '', path: '', openInNewTab: false, parentId: '' });
    setIsAddDialogOpen(false);
    toast({ title: 'Item added', description: 'Don\'t forget to save your changes' });
  };

  const updateMenuItem = () => {
    if (!editingItem) return;

    const currentMenu = menus[activeMenu];
    const updatedItems = currentMenu.items.map(item =>
      item.id === editingItem.id ? editingItem : item
    );

    setMenus({
      ...menus,
      [activeMenu]: {
        ...currentMenu,
        items: updatedItems
      }
    });

    setEditingItem(null);
    setIsEditDialogOpen(false);
    toast({ title: 'Item updated', description: 'Don\'t forget to save your changes' });
  };

  const deleteMenuItem = (itemId: string) => {
    const currentMenu = menus[activeMenu];
    // Also delete children if deleting a parent
    const updatedItems = currentMenu.items.filter(
      item => item.id !== itemId && item.parentId !== itemId
    );

    // Reorder remaining items
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      order: index
    }));

    setMenus({
      ...menus,
      [activeMenu]: {
        ...currentMenu,
        items: reorderedItems
      }
    });

    toast({ title: 'Item deleted', description: 'Don\'t forget to save your changes' });
  };

  const handleDragStart = (e: React.DragEvent, item: MenuItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetItem: MenuItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const currentMenu = menus[activeMenu];
    const items = [...currentMenu.items];
    
    const draggedIndex = items.findIndex(i => i.id === draggedItem.id);
    const targetIndex = items.findIndex(i => i.id === targetItem.id);
    
    items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItem);
    
    // Update order
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setMenus({
      ...menus,
      [activeMenu]: {
        ...currentMenu,
        items: reorderedItems
      }
    });

    setDraggedItem(null);
  };

  const makeSubItem = (itemId: string, parentId: string) => {
    const currentMenu = menus[activeMenu];
    const updatedItems = currentMenu.items.map(item =>
      item.id === itemId ? { ...item, parentId } : item
    );

    setMenus({
      ...menus,
      [activeMenu]: {
        ...currentMenu,
        items: updatedItems
      }
    });
  };

  const removeFromParent = (itemId: string) => {
    const currentMenu = menus[activeMenu];
    const updatedItems = currentMenu.items.map(item =>
      item.id === itemId ? { ...item, parentId: undefined } : item
    );

    setMenus({
      ...menus,
      [activeMenu]: {
        ...currentMenu,
        items: updatedItems
      }
    });
  };

  // Build tree structure from flat items
  const buildMenuTree = (items: MenuItem[]): MenuItem[] => {
    const sortedItems = [...items].sort((a, b) => a.order - b.order);
    const topLevelItems = sortedItems.filter(item => !item.parentId);
    
    return topLevelItems.map(parent => ({
      ...parent,
      children: sortedItems.filter(child => child.parentId === parent.id)
    }));
  };

  const currentMenuData = menus[activeMenu];
  const menuTree = currentMenuData ? buildMenuTree(currentMenuData.items) : [];
  const topLevelItems = currentMenuData?.items.filter(i => !i.parentId) || [];

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
            <h1 className="text-2xl font-bold text-foreground">Navigation Manager</h1>
            <p className="text-muted-foreground">Manage your site's navigation menus</p>
          </div>
        </div>
        <Button onClick={saveMenus} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu Selector Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Menu className="h-5 w-5" />
              Menus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(menus).map(([key, menu]) => (
              <button
                key={key}
                onClick={() => setActiveMenu(key)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === key
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span className="font-medium">{menu.name}</span>
                <span className="block text-sm opacity-75">
                  {menu.items.length} items
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Menu Editor */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{currentMenuData?.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Drag items to reorder. Click indent arrow to create sub-menus.
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle>Add Menu Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      placeholder="e.g., Products"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL Path</Label>
                    <Input
                      value={newItem.path}
                      onChange={(e) => setNewItem({ ...newItem, path: e.target.value })}
                      placeholder="e.g., /products or https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Or select from pages</Label>
                    <Select
                      onValueChange={(value) => {
                        const page = availablePages.find(p => p.path === value);
                        if (page) {
                          setNewItem({ ...newItem, title: page.title, path: page.path });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select a page" />
                      </SelectTrigger>
                      <SelectContent className="bg-card z-50">
                        {availablePages.map((page) => (
                          <SelectItem key={page.path} value={page.path}>
                            {page.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {activeMenu === 'header' && topLevelItems.length > 0 && (
                    <div className="space-y-2">
                      <Label>Parent Item (for sub-menu)</Label>
                      <Select
                        value={newItem.parentId || '__none__'}
                        onValueChange={(value) => setNewItem({ ...newItem, parentId: value === '__none__' ? '' : value })}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="None (top level)" />
                        </SelectTrigger>
                        <SelectContent className="bg-card z-50">
                          <SelectItem value="__none__">None (top level)</SelectItem>
                          {topLevelItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="openInNewTab"
                      checked={newItem.openInNewTab}
                      onCheckedChange={(checked) => 
                        setNewItem({ ...newItem, openInNewTab: checked === true })
                      }
                    />
                    <Label htmlFor="openInNewTab" className="text-sm">
                      Open in new tab
                    </Label>
                  </div>
                  <Button onClick={addMenuItem} className="w-full">
                    Add Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {menuTree.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Menu className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No menu items yet.</p>
                <p className="text-sm">Click "Add Item" to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {menuTree.map((item) => (
                  <div key={item.id}>
                    {/* Parent Item */}
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, item)}
                      className={`flex items-center gap-3 p-3 bg-muted rounded-lg border border-border hover:border-primary/50 transition-colors cursor-move ${
                        !item.visible ? 'opacity-50' : ''
                      }`}
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{item.title}</span>
                          {item.openInNewTab && (
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          )}
                          {item.children && item.children.length > 0 && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              {item.children.length} sub-items
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">{item.path}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingItem(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMenuItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Children */}
                    {item.children && item.children.length > 0 && (
                      <div className="ml-8 mt-2 space-y-2 border-l-2 border-primary/20 pl-4">
                        {item.children.map((child) => (
                          <div
                            key={child.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, child)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, child)}
                            className={`flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors cursor-move ${
                              !child.visible ? 'opacity-50' : ''
                            }`}
                          >
                            <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{child.title}</span>
                                {child.openInNewTab && (
                                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">{child.path}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromParent(child.id)}
                                className="text-xs"
                              >
                                Remove indent
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingItem(child);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteMenuItem(child.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>URL Path</Label>
                <Input
                  value={editingItem.path}
                  onChange={(e) => setEditingItem({ ...editingItem, path: e.target.value })}
                />
              </div>
              {activeMenu === 'header' && !editingItem.parentId && (
                <div className="space-y-2">
                  <Label>Make sub-item of</Label>
                  <Select
                    value={editingItem.parentId || '__none__'}
                    onValueChange={(value) => setEditingItem({ ...editingItem, parentId: value === '__none__' ? undefined : value })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="None (top level)" />
                    </SelectTrigger>
                <SelectContent className="bg-card z-50">
                      <SelectItem value="__none__">None (top level)</SelectItem>
                      {topLevelItems
                        .filter(item => item.id !== editingItem.id)
                        .map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="editOpenInNewTab"
                  checked={editingItem.openInNewTab}
                  onCheckedChange={(checked) => 
                    setEditingItem({ ...editingItem, openInNewTab: checked === true })
                  }
                />
                <Label htmlFor="editOpenInNewTab" className="text-sm">
                  Open in new tab
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="editVisible"
                  checked={editingItem.visible}
                  onCheckedChange={(checked) => 
                    setEditingItem({ ...editingItem, visible: checked === true })
                  }
                />
                <Label htmlFor="editVisible" className="text-sm">
                  Visible
                </Label>
              </div>
              <Button onClick={updateMenuItem} className="w-full">
                Update Item
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NavigationManager;
