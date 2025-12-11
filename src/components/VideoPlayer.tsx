import { supabase } from "@/integrations/supabase/client";

interface VideoPlayerProps {
  videoUrl: string | null;
  videoFilePath: string | null;
  thumbnailUrl?: string | null;
  title: string;
  className?: string;
  autoPlayOnHover?: boolean;
}

// Extract YouTube video ID from various URL formats
const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Extract Vimeo video ID
const getVimeoId = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
};

// Get full URL for uploaded files
const getStorageUrl = (filePath: string): string => {
  const { data } = supabase.storage.from('work-media').getPublicUrl(filePath);
  return data.publicUrl;
};

const VideoPlayer = ({ 
  videoUrl, 
  videoFilePath, 
  thumbnailUrl, 
  title, 
  className = "",
  autoPlayOnHover = true 
}: VideoPlayerProps) => {
  // Determine video source
  const directVideoUrl = videoFilePath ? getStorageUrl(videoFilePath) : null;
  const youtubeId = videoUrl ? getYouTubeId(videoUrl) : null;
  const vimeoId = videoUrl ? getVimeoId(videoUrl) : null;

  // YouTube embed
  if (youtubeId) {
    return (
      <div className={`relative ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=1&rel=0`}
          title={title}
          className="w-full h-full absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Vimeo embed
  if (vimeoId) {
    return (
      <div className={`relative ${className}`}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=0&muted=1`}
          title={title}
          className="w-full h-full absolute inset-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Direct video file - always show video, use thumbnail as poster
  if (directVideoUrl) {
    return (
      <div className={`relative ${className}`}>
        <video 
          src={directVideoUrl} 
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          poster={thumbnailUrl || undefined}
          onMouseEnter={autoPlayOnHover ? (e) => e.currentTarget.play() : undefined}
          onMouseLeave={autoPlayOnHover ? (e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; } : undefined}
        />
      </div>
    );
  }

  // Fallback - show thumbnail or placeholder
  if (thumbnailUrl) {
    return (
      <div className={`relative ${className}`}>
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Empty placeholder
  return (
    <div className={`relative bg-card flex items-center justify-center ${className}`}>
      <span className="text-muted-foreground text-sm">No media</span>
    </div>
  );
};

export default VideoPlayer;
