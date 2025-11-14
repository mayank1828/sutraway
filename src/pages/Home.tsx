import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThreadLine from "@/components/ThreadLine";
import heroImage from "@/assets/hero-bg.jpg";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 container mx-auto px-6 text-center animate-fade-in-slow">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold text-gold tracking-wider mb-2">
              SUTRA
            </h1>
            <div className="w-24 h-px bg-gold mx-auto opacity-50" />
          </div>

          {/* Tagline */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 tracking-wide">
            THE THREAD CONNECTING ALL YOUR NEEDS
          </h2>

          {/* Sub-line */}
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12">
            We connect creativity, strategy, and commerce under one thread.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/work">
              <Button 
                size="lg"
                className="bg-gold text-background hover:bg-gold-muted font-sans tracking-wide px-8 py-6 text-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
              >
                View Work
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                size="lg"
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-background font-sans tracking-wide px-8 py-6 text-lg transition-all duration-300"
              >
                Start a Project
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ThreadLine />

      {/* Experience Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Experience that speaks before we do.
          </h3>
          <p className="text-muted-foreground text-lg md:text-xl mb-16">
            Built by people who've shaped work for brands like Flipkart, Star Sports, Heineken, IPL, F4, and Nayara Energy.
          </p>

          {/* Brand Logos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {["Flipkart", "Star Sports", "Heineken", "IPL", "F4", "Nayara Energy"].map((brand) => (
              <div 
                key={brand}
                className="text-muted-foreground hover:text-gold transition-all duration-300 hover:scale-110 cursor-pointer font-sans text-sm tracking-wider"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
