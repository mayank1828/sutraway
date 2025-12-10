import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Trash2, Edit, Plus, LogOut, X, Package, Film, Briefcase } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WorkPost {
  id: string;
  title: string;
  description: string;
  category: string;
  video_type: 'upload' | 'youtube' | 'vimeo' | null;
  video_url: string | null;
  video_file_path: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

interface ProductionPost {
  id: string;
  title: string;
  type: string;
  video_url: string | null;
  video_file_path: string | null;
  thumbnail_url: string | null;
  display_order: number;
  created_at: string;
}

interface PackageItem {
  id: string;
  name: string;
  subtitle: string | null;
  features: string[];
  is_popular: boolean;
  display_order: number;
  created_at: string;
}

const AdminPanel = () => {
  const { user, isAdmin, loading, signOut } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Work Posts State
  const [workPosts, setWorkPosts] = useState<WorkPost[]>([]);
  const [isLoadingWork, setIsLoadingWork] = useState(true);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [editingWork, setEditingWork] = useState<WorkPost | null>(null);
  
  // Production Posts State
  const [productionPosts, setProductionPosts] = useState<ProductionPost[]>([]);
  const [isLoadingProduction, setIsLoadingProduction] = useState(true);
  const [showProductionForm, setShowProductionForm] = useState(false);
  const [editingProduction, setEditingProduction] = useState<ProductionPost | null>(null);
  
  // Packages State
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Work Form State
  const [workTitle, setWorkTitle] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [workCategory, setWorkCategory] = useState('');
  const [workVideoType, setWorkVideoType] = useState<'upload' | 'youtube' | 'vimeo'>('youtube');
  const [workVideoUrl, setWorkVideoUrl] = useState('');
  const [workVideoFile, setWorkVideoFile] = useState<File | null>(null);
  const [workThumbnailFile, setWorkThumbnailFile] = useState<File | null>(null);

  // Production Form State
  const [prodTitle, setProdTitle] = useState('');
  const [prodType, setProdType] = useState('');
  const [prodVideoUrl, setProdVideoUrl] = useState('');
  const [prodVideoFile, setProdVideoFile] = useState<File | null>(null);
  const [prodThumbnailFile, setProdThumbnailFile] = useState<File | null>(null);

  // Package Form State
  const [pkgName, setPkgName] = useState('');
  const [pkgSubtitle, setPkgSubtitle] = useState('');
  const [pkgFeatures, setPkgFeatures] = useState('');
  const [pkgIsPopular, setPkgIsPopular] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchWorkPosts();
      fetchProductionPosts();
      fetchPackages();
    }
  }, [isAdmin]);

  // Fetch Functions
  const fetchWorkPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('work_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setWorkPosts(data || []);
    } catch (error: any) {
      toast({ title: 'Error fetching work posts', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoadingWork(false);
    }
  };

  const fetchProductionPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('production_posts')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setProductionPosts(data || []);
    } catch (error: any) {
      toast({ title: 'Error fetching production posts', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoadingProduction(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setPackages(data || []);
    } catch (error: any) {
      toast({ title: 'Error fetching packages', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoadingPackages(false);
    }
  };

  // Upload Helper
  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('work-media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('work-media')
      .getPublicUrl(filePath);

    return { filePath, publicUrl };
  };

  // Work Post Handlers
  const handleWorkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let videoFilePath = null;
      let thumbnailUrl = null;

      if (workVideoType === 'upload' && workVideoFile) {
        const result = await uploadFile(workVideoFile, 'videos');
        videoFilePath = result.filePath;
      }

      if (workThumbnailFile) {
        const result = await uploadFile(workThumbnailFile, 'thumbnails');
        thumbnailUrl = result.publicUrl;
      }

      const postData = {
        title: workTitle,
        description: workDescription,
        category: workCategory,
        video_type: workVideoType,
        video_url: workVideoType !== 'upload' ? workVideoUrl : null,
        video_file_path: videoFilePath,
        thumbnail_url: thumbnailUrl || editingWork?.thumbnail_url,
      };

      if (editingWork) {
        const { error } = await supabase.from('work_posts').update(postData).eq('id', editingWork.id);
        if (error) throw error;
        toast({ title: 'Post updated', description: 'Work post has been updated.' });
      } else {
        const { error } = await supabase.from('work_posts').insert([postData]);
        if (error) throw error;
        toast({ title: 'Post created', description: 'Work post has been created.' });
      }

      resetWorkForm();
      fetchWorkPosts();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditWork = (post: WorkPost) => {
    setEditingWork(post);
    setWorkTitle(post.title);
    setWorkDescription(post.description);
    setWorkCategory(post.category);
    setWorkVideoType(post.video_type || 'youtube');
    setWorkVideoUrl(post.video_url || '');
    setShowWorkForm(true);
  };

  const handleDeleteWork = async (id: string) => {
    if (!confirm('Delete this work post?')) return;
    try {
      const { error } = await supabase.from('work_posts').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Work post deleted.' });
      fetchWorkPosts();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const resetWorkForm = () => {
    setWorkTitle('');
    setWorkDescription('');
    setWorkCategory('');
    setWorkVideoType('youtube');
    setWorkVideoUrl('');
    setWorkVideoFile(null);
    setWorkThumbnailFile(null);
    setEditingWork(null);
    setShowWorkForm(false);
  };

  // Production Post Handlers
  const handleProductionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let videoFilePath = null;
      let thumbnailUrl = null;

      if (prodVideoFile) {
        const result = await uploadFile(prodVideoFile, 'production-videos');
        videoFilePath = result.filePath;
      }

      if (prodThumbnailFile) {
        const result = await uploadFile(prodThumbnailFile, 'production-thumbnails');
        thumbnailUrl = result.publicUrl;
      }

      const postData = {
        title: prodTitle,
        type: prodType,
        video_url: prodVideoUrl || null,
        video_file_path: videoFilePath || editingProduction?.video_file_path,
        thumbnail_url: thumbnailUrl || editingProduction?.thumbnail_url,
      };

      if (editingProduction) {
        const { error } = await supabase.from('production_posts').update(postData).eq('id', editingProduction.id);
        if (error) throw error;
        toast({ title: 'Updated', description: 'Production post updated.' });
      } else {
        const { error } = await supabase.from('production_posts').insert([postData]);
        if (error) throw error;
        toast({ title: 'Created', description: 'Production post created.' });
      }

      resetProductionForm();
      fetchProductionPosts();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduction = (post: ProductionPost) => {
    setEditingProduction(post);
    setProdTitle(post.title);
    setProdType(post.type);
    setProdVideoUrl(post.video_url || '');
    setShowProductionForm(true);
  };

  const handleDeleteProduction = async (id: string) => {
    if (!confirm('Delete this production post?')) return;
    try {
      const { error } = await supabase.from('production_posts').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Production post deleted.' });
      fetchProductionPosts();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const resetProductionForm = () => {
    setProdTitle('');
    setProdType('');
    setProdVideoUrl('');
    setProdVideoFile(null);
    setProdThumbnailFile(null);
    setEditingProduction(null);
    setShowProductionForm(false);
  };

  // Package Handlers
  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const featuresArray = pkgFeatures.split('\n').filter(f => f.trim());
      
      const pkgData = {
        name: pkgName,
        subtitle: pkgSubtitle || null,
        features: featuresArray,
        is_popular: pkgIsPopular,
      };

      if (editingPackage) {
        const { error } = await supabase.from('packages').update(pkgData).eq('id', editingPackage.id);
        if (error) throw error;
        toast({ title: 'Updated', description: 'Package updated.' });
      } else {
        const { error } = await supabase.from('packages').insert([pkgData]);
        if (error) throw error;
        toast({ title: 'Created', description: 'Package created.' });
      }

      resetPackageForm();
      fetchPackages();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPackage = (pkg: PackageItem) => {
    setEditingPackage(pkg);
    setPkgName(pkg.name);
    setPkgSubtitle(pkg.subtitle || '');
    setPkgFeatures(pkg.features.join('\n'));
    setPkgIsPopular(pkg.is_popular);
    setShowPackageForm(true);
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Delete this package?')) return;
    try {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Package deleted.' });
      fetchPackages();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const resetPackageForm = () => {
    setPkgName('');
    setPkgSubtitle('');
    setPkgFeatures('');
    setPkgIsPopular(false);
    setEditingPackage(null);
    setShowPackageForm(false);
  };

  if (loading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <Button onClick={signOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="work" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="work" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Work Gallery
            </TabsTrigger>
            <TabsTrigger value="production" className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              Production
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Packages
            </TabsTrigger>
          </TabsList>

          {/* WORK TAB */}
          <TabsContent value="work">
            {!showWorkForm && (
              <Button onClick={() => setShowWorkForm(true)} className="mb-6">
                <Plus className="mr-2 h-4 w-4" /> Add Work Post
              </Button>
            )}

            {showWorkForm && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleWorkSubmit}
                className="bg-card p-6 rounded-lg border border-border mb-8 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-foreground">{editingWork ? 'Edit Work Post' : 'New Work Post'}</h2>
                  <Button type="button" variant="ghost" size="sm" onClick={resetWorkForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workTitle">Title</Label>
                    <Input id="workTitle" value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workCategory">Category</Label>
                    <Input id="workCategory" value={workCategory} onChange={(e) => setWorkCategory(e.target.value)} placeholder="e.g., Fashion, Jewellery" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workDescription">Description</Label>
                  <Textarea id="workDescription" value={workDescription} onChange={(e) => setWorkDescription(e.target.value)} rows={3} required />
                </div>

                <div className="space-y-2">
                  <Label>Video Type</Label>
                  <Select value={workVideoType} onValueChange={(value: any) => setWorkVideoType(value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube Link</SelectItem>
                      <SelectItem value="vimeo">Vimeo Link</SelectItem>
                      <SelectItem value="upload">Upload Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {workVideoType !== 'upload' ? (
                  <div className="space-y-2">
                    <Label htmlFor="workVideoUrl">Video URL</Label>
                    <Input id="workVideoUrl" value={workVideoUrl} onChange={(e) => setWorkVideoUrl(e.target.value)} placeholder="https://..." required />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="workVideoFile">Upload Video</Label>
                    <Input id="workVideoFile" type="file" accept="video/*" onChange={(e) => setWorkVideoFile(e.target.files?.[0] || null)} required={!editingWork} />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="workThumbnail">Thumbnail Image</Label>
                  <Input id="workThumbnail" type="file" accept="image/*" onChange={(e) => setWorkThumbnailFile(e.target.files?.[0] || null)} />
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={resetWorkForm}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingWork ? 'Update' : 'Create'}</Button>
                </div>
              </motion.form>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Work Posts ({workPosts.length})</h2>
              {isLoadingWork ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : workPosts.length === 0 ? (
                <p className="text-muted-foreground">No work posts yet.</p>
              ) : (
                <div className="grid gap-3">
                  {workPosts.map((post) => (
                    <div key={post.id} className="bg-card p-4 rounded-lg border border-border flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{post.title}</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{post.category}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{post.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditWork(post)}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteWork(post.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* PRODUCTION TAB */}
          <TabsContent value="production">
            {!showProductionForm && (
              <Button onClick={() => setShowProductionForm(true)} className="mb-6">
                <Plus className="mr-2 h-4 w-4" /> Add Production Post
              </Button>
            )}

            {showProductionForm && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleProductionSubmit}
                className="bg-card p-6 rounded-lg border border-border mb-8 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-foreground">{editingProduction ? 'Edit Production Post' : 'New Production Post'}</h2>
                  <Button type="button" variant="ghost" size="sm" onClick={resetProductionForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prodTitle">Title</Label>
                    <Input id="prodTitle" value={prodTitle} onChange={(e) => setProdTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prodType">Type</Label>
                    <Input id="prodType" value={prodType} onChange={(e) => setProdType(e.target.value)} placeholder="e.g., Podcast, TVC, Documentary" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prodVideoUrl">Video URL (optional)</Label>
                  <Input id="prodVideoUrl" value={prodVideoUrl} onChange={(e) => setProdVideoUrl(e.target.value)} placeholder="https://..." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prodVideoFile">Upload Video (optional)</Label>
                  <Input id="prodVideoFile" type="file" accept="video/*" onChange={(e) => setProdVideoFile(e.target.files?.[0] || null)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prodThumbnail">Thumbnail Image</Label>
                  <Input id="prodThumbnail" type="file" accept="image/*" onChange={(e) => setProdThumbnailFile(e.target.files?.[0] || null)} />
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={resetProductionForm}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingProduction ? 'Update' : 'Create'}</Button>
                </div>
              </motion.form>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Production Posts ({productionPosts.length})</h2>
              {isLoadingProduction ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : productionPosts.length === 0 ? (
                <p className="text-muted-foreground">No production posts yet.</p>
              ) : (
                <div className="grid gap-3">
                  {productionPosts.map((post) => (
                    <div key={post.id} className="bg-card p-4 rounded-lg border border-border flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{post.title}</h3>
                          <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded">{post.type}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditProduction(post)}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteProduction(post.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* PACKAGES TAB */}
          <TabsContent value="packages">
            {!showPackageForm && (
              <Button onClick={() => setShowPackageForm(true)} className="mb-6">
                <Plus className="mr-2 h-4 w-4" /> Add Package
              </Button>
            )}

            {showPackageForm && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handlePackageSubmit}
                className="bg-card p-6 rounded-lg border border-border mb-8 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-foreground">{editingPackage ? 'Edit Package' : 'New Package'}</h2>
                  <Button type="button" variant="ghost" size="sm" onClick={resetPackageForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pkgName">Package Name</Label>
                    <Input id="pkgName" value={pkgName} onChange={(e) => setPkgName(e.target.value)} placeholder="e.g., Starter, Growth" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pkgSubtitle">Subtitle</Label>
                    <Input id="pkgSubtitle" value={pkgSubtitle} onChange={(e) => setPkgSubtitle(e.target.value)} placeholder="e.g., For early-stage brands" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pkgFeatures">Features (one per line)</Label>
                  <Textarea 
                    id="pkgFeatures" 
                    value={pkgFeatures} 
                    onChange={(e) => setPkgFeatures(e.target.value)} 
                    rows={6} 
                    placeholder="Brand Strategy & Positioning&#10;Content Creation (2 posts/week)&#10;Social Media Management"
                    required 
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Switch id="pkgPopular" checked={pkgIsPopular} onCheckedChange={setPkgIsPopular} />
                  <Label htmlFor="pkgPopular">Mark as Popular</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={resetPackageForm}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingPackage ? 'Update' : 'Create'}</Button>
                </div>
              </motion.form>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Packages ({packages.length})</h2>
              {isLoadingPackages ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : packages.length === 0 ? (
                <p className="text-muted-foreground">No packages yet.</p>
              ) : (
                <div className="grid gap-3">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-card p-4 rounded-lg border border-border flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                          {pkg.is_popular && (
                            <span className="text-xs bg-gold text-background px-2 py-0.5 rounded">POPULAR</span>
                          )}
                        </div>
                        {pkg.subtitle && <p className="text-sm text-muted-foreground mb-2">{pkg.subtitle}</p>}
                        <p className="text-xs text-muted-foreground">{pkg.features.length} features</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditPackage(pkg)}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeletePackage(pkg.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
