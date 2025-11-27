-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create enum for video types
CREATE TYPE public.video_type AS ENUM ('upload', 'youtube', 'vimeo');

-- Create work_posts table
CREATE TABLE public.work_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  video_type video_type,
  video_url TEXT,
  video_file_path TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS on work_posts
ALTER TABLE public.work_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for work_posts (public read, admin write)
CREATE POLICY "Anyone can view work posts"
  ON public.work_posts
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert work posts"
  ON public.work_posts
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update work posts"
  ON public.work_posts
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete work posts"
  ON public.work_posts
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.work_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for work media
INSERT INTO storage.buckets (id, name, public)
VALUES ('work-media', 'work-media', true);

-- Storage policies for work-media bucket
CREATE POLICY "Public can view work media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'work-media');

CREATE POLICY "Admins can upload work media"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'work-media' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update work media"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'work-media' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete work media"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'work-media' 
    AND public.has_role(auth.uid(), 'admin')
  );