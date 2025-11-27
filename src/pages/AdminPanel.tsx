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
import { Trash2, Edit, Plus, LogOut, Link as LinkIcon, Upload } from 'lucide-react';
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

const AdminPanel = () => {
  const { user, isAdmin, loading, signOut } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<WorkPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<WorkPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [videoType, setVideoType] = useState<'upload' | 'youtube' | 'vimeo'>('youtube');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('work_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching posts',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('work-media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('work-media')
      .getPublicUrl(filePath);

    return { filePath, publicUrl };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let videoFilePath = null;
      let thumbnailUrl = null;

      // Upload video file if type is upload
      if (videoType === 'upload' && videoFile) {
        const result = await uploadFile(videoFile, 'videos');
        videoFilePath = result.filePath;
      }

      // Upload thumbnail if provided
      if (thumbnailFile) {
        const result = await uploadFile(thumbnailFile, 'thumbnails');
        thumbnailUrl = result.publicUrl;
      }

      const postData = {
        title,
        description,
        category,
        video_type: videoType,
        video_url: videoType !== 'upload' ? videoUrl : null,
        video_file_path: videoFilePath,
        thumbnail_url: thumbnailUrl,
      };

      if (editingPost) {
        const { error } = await supabase
          .from('work_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;

        toast({
          title: 'Post updated',
          description: 'Your work post has been updated successfully.',
        });
      } else {
        const { error } = await supabase
          .from('work_posts')
          .insert([postData]);

        if (error) throw error;

        toast({
          title: 'Post created',
          description: 'Your work post has been created successfully.',
        });
      }

      resetForm();
      fetchPosts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post: WorkPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setCategory(post.category);
    setVideoType(post.video_type || 'youtube');
    setVideoUrl(post.video_url || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('work_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Post deleted',
        description: 'The work post has been deleted successfully.',
      });

      fetchPosts();
    } catch (error: any) {
      toast({
        title: 'Error deleting post',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setVideoType('youtube');
    setVideoUrl('');
    setVideoFile(null);
    setThumbnailFile(null);
    setEditingPost(null);
    setShowForm(false);
  };

  if (loading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button onClick={signOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Add New Post Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="mb-8">
            <Plus className="mr-2 h-4 w-4" />
            Add New Work Post
          </Button>
        )}

        {/* Post Form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-card p-6 rounded-lg border mb-8 space-y-4"
          >
            <h2 className="text-2xl font-bold mb-4">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., COMMERCIAL, DOCUMENTARY, MUSIC VIDEO"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Video Type</Label>
              <Select value={videoType} onValueChange={(value: any) => setVideoType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube Link</SelectItem>
                  <SelectItem value="vimeo">Vimeo Link</SelectItem>
                  <SelectItem value="upload">Upload Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {videoType !== 'upload' ? (
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="videoFile">Upload Video</Label>
                <Input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  required={!editingPost}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Image (Optional)</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </motion.form>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Work Posts</h2>
          {isLoadingPosts ? (
            <p>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground">No posts yet. Create your first one!</p>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card p-4 rounded-lg border flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="font-bold text-lg">{post.title}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{post.description}</p>
                    {post.video_type && (
                      <p className="text-xs text-muted-foreground">
                        Video: {post.video_type === 'upload' ? 'Uploaded' : post.video_type}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
