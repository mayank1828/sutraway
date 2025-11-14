import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";

const ProductionHouse = () => {
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
          {showcaseItems.map((item, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
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
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in">
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
        </div>
      </div>
    </div>
  );
};

export default ProductionHouse;
