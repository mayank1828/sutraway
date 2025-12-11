import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProductionPost {
  id: string;
  title: string;
  type: string;
  video_url: string | null;
  video_file_path: string | null;
  thumbnail_url: string | null;
  display_order: number;
}

const getVideoUrl = (post: ProductionPost) => {
  if (post.video_file_path) {
    const { data } = supabase.storage.from('work-media').getPublicUrl(post.video_file_path);
    return data.publicUrl;
  }
  return post.video_url;
};

const ProductionItem = ({ item, index }: { item: ProductionPost; index: number }) => {
  const { ref, isInView } = useScrollAnimation();
  const videoUrl = getVideoUrl(item);

  return (
    <motion.div 
      key={item.id} 
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mb-6">
        <p className="text-gold text-sm font-sans tracking-wider mb-2">{item.type}</p>
        <h3 className="font-serif text-3xl font-bold text-foreground">{item.title}</h3>
      </div>
      
      <div className="bg-card border border-border aspect-video hover:border-gold transition-all duration-300 cursor-pointer group relative overflow-hidden">
        {item.thumbnail_url ? (
          <img 
            src={item.thumbnail_url} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : videoUrl ? (
          <video 
            src={videoUrl} 
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-gold font-sans text-sm tracking-wider">View Project</span>
        </div>
      </div>
    </motion.div>
  );
};

const ProductionHouse = () => {
  const { ref: ctaRef, isInView: ctaInView } = useScrollAnimation();
  const [posts, setPosts] = useState<ProductionPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('production_posts')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching production posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackItems: ProductionPost[] = [
    { id: 'f1', type: "Podcast", title: "Your Artist Story (Kailash Kher)", video_url: null, video_file_path: null, thumbnail_url: null, display_order: 0 },
    { id: 'f2', type: "TVC", title: "Festival Campaign Series", video_url: null, video_file_path: null, thumbnail_url: null, display_order: 1 },
    { id: 'f3', type: "Documentary", title: "Beyond The Veil", video_url: null, video_file_path: null, thumbnail_url: null, display_order: 2 },
    { id: 'f4', type: "Art Project", title: "The Abstract Line", video_url: null, video_file_path: null, thumbnail_url: null, display_order: 3 },
  ];

  const displayItems = posts.length > 0 ? posts : fallbackItems;

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        <SectionTitle 
          title="From Our Production House" 
          subtitle="Our elite content quality comes from working on large-scale productions — commercials, documentaries, art films, and music videos."
        />

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-16 mb-24">
            {displayItems.map((item, index) => (
              <ProductionItem key={item.id} item={item} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div 
          ref={ctaRef}
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-serif text-2xl md:text-3xl text-foreground mb-8">
            Every frame begins with a story. Let's tell yours.
          </p>
          <Link to="/contact">
            <Button 
              size="lg"
              className="bg-gold text-background hover:bg-gold-muted font-sans tracking-wide px-8 py-6 text-lg"
            >
              Get Started
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductionHouse;
