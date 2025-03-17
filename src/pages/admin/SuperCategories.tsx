
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchSuperCategories, 
  createSuperCategory, 
  updateSuperCategory, 
  deleteSuperCategory,
  toggleSuperCategoryVisibility,
  SuperCategory
} from '@/services/superCategoryService';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Folder, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import SuperCategoryForm from '@/components/admin/SuperCategoryForm';
import AnnouncementBannerForm from '@/components/admin/AnnouncementBannerForm'; 
import Header from '@/components/Header';
import { fetchAnnouncementBanner } from '@/services/announcementService';

const AdminSuperCategories: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<SuperCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SuperCategory | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<SuperCategory | null>(null);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [banner, setBanner] = useState<{text: string, isEnabled: boolean} | null>(null);
  
  const isAdmin = user.profile?.role === 'admin'; // Check if user is an admin
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await fetchSuperCategories();
        setCategories(fetchedCategories);
        
        const bannerData = await fetchAnnouncementBanner();
        setBanner(bannerData);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleCreateCategory = async (data: Omit<SuperCategory, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    try {
      const newCategory = await createSuperCategory(data);
      setCategories(prev => [...prev, newCategory]);
      setShowCreateDialog(false);
      toast({
        title: "Success",
        description: `Super category "${data.name}" created successfully.`,
      });
    } catch (error) {
      console.error('Failed to create super category:', error);
      toast({
        title: "Error",
        description: "Failed to create super category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateCategory = async (data: Partial<Omit<SuperCategory, 'id' | 'createdAt'>>) => {
    if (!editingCategory) return;
    
    setIsSubmitting(true);
    try {
      const updatedCategory = await updateSuperCategory(editingCategory.id, data);
      setCategories(prev => 
        prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
      );
      setShowEditDialog(false);
      setEditingCategory(null);
      toast({
        title: "Success",
        description: `Super category "${updatedCategory.name}" updated successfully.`,
      });
    } catch (error) {
      console.error('Failed to update super category:', error);
      toast({
        title: "Error",
        description: "Failed to update super category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteSuperCategory(categoryToDelete.id);
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
      setCategoryToDelete(null);
      toast({
        title: "Success",
        description: `Super category "${categoryToDelete.name}" deleted successfully.`,
      });
    } catch (error) {
      console.error('Failed to delete super category:', error);
      toast({
        title: "Error",
        description: "Failed to delete super category. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleVisibility = async (category: SuperCategory) => {
    try {
      const updatedCategory = await toggleSuperCategoryVisibility(category.id);
      setCategories(prev => 
        prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
      );
      toast({
        title: "Success",
        description: `Super category "${updatedCategory.name}" ${updatedCategory.isEnabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update visibility. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="page-container animate-slide-up">
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Folder className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access the admin super categories area.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="page-container animate-slide-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="page-header">Super Categories</h1>
            <p className="text-muted-foreground">
              Manage super categories for organizing different asset classes.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 space-x-2">
            <Button onClick={() => setShowAnnouncementDialog(true)}>
              Manage Announcement Banner
            </Button>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Super Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create New Super Category</DialogTitle>
                  <DialogDescription>
                    Add a new super category to organize assets.
                  </DialogDescription>
                </DialogHeader>
                
                <SuperCategoryForm 
                  onSubmit={handleCreateCategory}
                  isSubmitting={isSubmitting}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className={`hover:border-primary transition-colors ${!category.isEnabled ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <CardTitle>{category.name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleToggleVisibility(category)}
                        title={category.isEnabled ? "Disable" : "Enable"}
                      >
                        {category.isEnabled ? 
                          <Eye className="h-4 w-4" /> : 
                          <EyeOff className="h-4 w-4" />
                        }
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setEditingCategory(category);
                          setShowEditDialog(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setCategoryToDelete(category)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Super Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the super category "{category.name}"? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleDeleteCategory}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <CardDescription className="mt-1">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                
                <CardFooter className="text-xs text-muted-foreground flex justify-between pt-4">
                  <span>Slug: {category.slug}</span>
                  <span>
                    Created {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Super Categories Found</h3>
              <p className="text-muted-foreground mb-6">
                Create your first super category to organize different asset classes.
              </p>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Super Category
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Super Category</DialogTitle>
            <DialogDescription>
              Update the details for this super category.
            </DialogDescription>
          </DialogHeader>
          
          {editingCategory && (
            <SuperCategoryForm 
              initialData={editingCategory}
              onSubmit={handleUpdateCategory}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Manage Announcement Banner</DialogTitle>
            <DialogDescription>
              Configure the announcement banner that appears at the top of the app.
            </DialogDescription>
          </DialogHeader>
          
          {banner && (
            <AnnouncementBannerForm 
              initialData={banner}
              onClose={() => setShowAnnouncementDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSuperCategories;
