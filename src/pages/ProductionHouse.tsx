import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const ProductionHouse = () => {
  const { ref: ctaRef, isInView: ctaInView } = useScrollAnimation();

  const showcaseItems = [
    { type: "Podcast", title: "Your Artist Story (Kailash Kher)", frames: 1 },
    { type: "TVC", title: "Festival Campaign Series", frames: 6 },
    { type: "Documentary", title: "Beyond The Veil", frames: 3 },
    { type: "Art Project", title: "The Abstract Line", frames: 3 },
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        <SectionTitle 
          title="From Our Production House" 
          subtitle="Our elite content quality comes from working on large-scale productions — commercials, documentaries, art films, and music videos."
        />

        {/* Showcase Grid */}
        <div className="max-w-6xl mx-auto space-y-16 mb-24">
          {showcaseItems.map((item, index) => {
            const { ref, isInView } = useScrollAnimation();
            
            return (
              <motion.div 
                key={index} 
                ref={ref}
                initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                transition={{ duration: 0.8 }}
              >
              <div className="mb-6">
                <p className="text-gold text-sm font-sans tracking-wider mb-2">{item.type}</p>
                <h3 className="font-serif text-3xl font-bold text-foreground">{item.title}</h3>
              </div>
              
              <div className={`grid ${item.frames > 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-3'} gap-4`}>
                {Array.from({ length: item.frames }).map((_, frameIndex) => (
                  <div 
                    key={frameIndex}
                    className="bg-card border border-border aspect-video hover:border-gold transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-gold font-sans text-sm tracking-wider">View Frame</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            );
          })}
        </div>

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
