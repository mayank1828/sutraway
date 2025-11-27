import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

const Work = () => {
  const { ref: gridRef, isInView: gridInView } = useScrollAnimation({ margin: "-50px" });
  const { ref: ctaRef, isInView: ctaInView } = useScrollAnimation();
  const [projects, setProjects] = useState<WorkPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('work_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackProjects = [
    {
      category: "Fashion",
      title: "The Runway Edit",
      description: "Where style meets story.",
    },
    {
      category: "Fashion",
      title: "Threads of Tomorrow",
      description: "Minimal design, maximal impact.",
    },
    {
      category: "Jewellery",
      title: "Heritage in Motion",
      description: "Cinematic jewellery story.",
    },
    {
      category: "Jewellery",
      title: "Gilded Whispers",
      description: "Quiet luxury in detail.",
    },
    {
      category: "Real Estate",
      title: "The Skyline Chapter",
      description: "Concrete turned into conversation.",
    },
    {
      category: "Real Estate",
      title: "House of Horizons",
      description: "Architecture meets aspiration.",
    },
    {
      category: "Restaurant",
      title: "Table for Two",
      description: "A dining experience that glows.",
    },
    {
      category: "Restaurant",
      title: "The Tasting Room",
      description: "Flavour, form, film.",
    },
    {
      category: "Influencer × Product",
      title: "The Drop",
      description: "Transitions + storytelling.",
    },
    {
      category: "Influencer × Product",
      title: "Made to Move",
      description: "Energetic creator-centric visuals.",
    },
  ];

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        <SectionTitle 
          title="Our Work" 
          subtitle="A curated look at stories we've helped shape — from fashion films and real estate launches to restaurant experiences and luxury collaborations."
        />

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {displayProjects.map((project, index) => {
              const projectId = 'id' in project ? project.id : `fallback-${index}`;
              const thumbnailUrl = 'thumbnail_url' in project ? (project.thumbnail_url as string | null) : null;
              
              return (
                <motion.div 
                  key={projectId as string}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 60 }}
                  animate={gridInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="bg-card border border-border aspect-[4/5] mb-4 overflow-hidden relative">
                    {thumbnailUrl ? (
                      <>
                        <img 
                          src={thumbnailUrl} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-gold font-sans text-sm tracking-wider">View Project</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gold text-sm font-sans tracking-wider">{project.category}</p>
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-gold transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{project.description}</p>
                  </div>
                </motion.div>
              );
            })}
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
            Let's create your next story.
          </p>
          <Link to="/contact">
            <Button 
              size="lg"
              className="bg-gold text-background hover:bg-gold-muted font-sans tracking-wide px-8 py-6 text-lg"
            >
              Start Your Project
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Work;
