import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const Work = () => {
  const { ref: gridRef, isInView: gridInView } = useScrollAnimation({ margin: "-50px" });
  const { ref: ctaRef, isInView: ctaInView } = useScrollAnimation();

  const projects = [
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

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        <SectionTitle 
          title="Our Work" 
          subtitle="A curated look at stories we've helped shape — from fashion films and real estate launches to restaurant experiences and luxury collaborations."
        />

        {/* Projects Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 60 }}
              animate={gridInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-card border border-border aspect-[4/5] mb-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
          ))}
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
