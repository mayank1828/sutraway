import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThreadLine from "@/components/ThreadLine";
import heroImage from "@/assets/hero-bg.jpg";
import sutraLogo from "@/assets/sutra-logo-optimized.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const Home = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const { ref: experienceRef, isInView: experienceInView } = useScrollAnimation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <motion.div 
          className="absolute inset-0 bg-black/60"
          style={{ y }}
        />
        
        <motion.div 
          className="relative z-10 container mx-auto px-6 text-center"
          style={{ opacity }}
        >
          {/* Logo */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <img src={sutraLogo} alt="SUTRA" width="512" height="320" className="h-32 md:h-40 lg:h-48 w-auto mx-auto" />
          </motion.div>

          {/* Tagline */}
          <motion.h2 
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            THE THREAD CONNECTING ALL YOUR NEEDS
          </motion.h2>

          {/* Sub-line */}
          <motion.p 
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            We connect creativity, strategy, and commerce under one thread.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
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
          </motion.div>
        </motion.div>
      </section>

      <ThreadLine />

      {/* Experience Section */}
      <section className="py-24 container mx-auto px-6">
        <motion.div 
          ref={experienceRef}
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={experienceInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Experience that speaks before we do.
          </h3>
          <p className="text-muted-foreground text-lg md:text-xl mb-16">
            Built by people who've shaped work for brands like Flipkart, Star Sports, Heineken, IPL, F4, and Nayara Energy.
          </p>

          {/* Brand Logos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center justify-items-center">
            {[
              { name: "Flipkart", url: "flipkart-logo.png" },
              { name: "Star Sports", url: "starsports-logo.png" },
              { name: "Heineken", url: "heineken-logo.png" },
              { name: "IPL", url: "ipl-logo.png" },
              { name: "F4", url: "f4-logo.png" },
              { name: "Nayara Energy", url: "nayara-logo.png" }
            ].map((brand, idx) => (
              <motion.div 
                key={brand.name}
                className="flex flex-col items-center gap-3 hover:scale-110 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={experienceInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
              >
                <div className="w-24 h-24 md:w-28 md:h-28 bg-card border border-border rounded-lg flex items-center justify-center p-4 hover:border-gold transition-colors">
                  <img 
                    src={`/logos/${brand.url}`} 
                    alt={brand.name}
                    width="256"
                    height="256"
                    className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const textDiv = document.createElement('div');
                        textDiv.className = 'text-muted-foreground font-sans text-xs text-center';
                        textDiv.textContent = brand.name;
                        parent.appendChild(textDiv);
                      }
                    }}
                  />
                </div>
                <span className="text-muted-foreground font-sans text-xs tracking-wider">
                  {brand.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
