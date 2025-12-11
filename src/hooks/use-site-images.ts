import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteImage {
  id: string;
  key: string;
  image_url: string;
  alt_text: string | null;
}

export const useSiteImages = () => {
  const [images, setImages] = useState<Record<string, SiteImage>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('*');

        if (error) throw error;

        // Convert array to object keyed by image key
        const imageMap: Record<string, SiteImage> = {};
        data?.forEach((img) => {
          imageMap[img.key] = img;
        });
        setImages(imageMap);
      } catch (error) {
        console.error('Error fetching site images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const getImage = (key: string, fallback?: string): string => {
    return images[key]?.image_url || fallback || '';
  };

  const getAltText = (key: string, fallback?: string): string => {
    return images[key]?.alt_text || fallback || key;
  };

  return { images, isLoading, getImage, getAltText };
};
