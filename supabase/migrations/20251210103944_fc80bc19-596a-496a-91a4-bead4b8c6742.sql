-- Create packages table
CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subtitle text,
  features text[] NOT NULL DEFAULT '{}',
  is_popular boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- RLS policies for packages
CREATE POLICY "Anyone can view packages"
ON public.packages FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert packages"
ON public.packages FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update packages"
ON public.packages FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete packages"
ON public.packages FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create production_posts table
CREATE TABLE public.production_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  video_url text,
  video_file_path text,
  thumbnail_url text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.production_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for production_posts
CREATE POLICY "Anyone can view production posts"
ON public.production_posts FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert production posts"
ON public.production_posts FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update production posts"
ON public.production_posts FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete production posts"
ON public.production_posts FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at triggers
CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_production_posts_updated_at
BEFORE UPDATE ON public.production_posts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();