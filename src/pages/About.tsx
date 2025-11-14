import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThreadLine from "@/components/ThreadLine";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const About = () => {
  const { ref: storyRef, isInView: storyInView } = useScrollAnimation();
  const { ref: experienceRef, isInView: experienceInView } = useScrollAnimation();
  const { ref: philosophyRef, isInView: philosophyInView } = useScrollAnimation();
  const { ref: ctaRef, isInView: ctaInView } = useScrollAnimation();

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-24 animate-fade-in">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8">
            SUTRA
          </h1>
          <div className="w-24 h-px bg-gold mx-auto mb-12" />
        </div>

        {/* Story */}
        <motion.div 
          ref={storyRef}
          className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed mb-24"
        >
          {[
            <>
              <span className="font-serif text-2xl text-gold">Sutra</span> is a full-stack creative and growth agency based in Mumbai.
            </>,
            <>
              <span className="font-serif text-2xl text-gold">Sutra</span> means "thread" — the connection between creativity, strategy, and commerce.
            </>,
            "We build brands through stories crafted with cinematic precision and commercial clarity.",
            <>
              We believe in <span className="text-gold font-medium">"The Thread"</span>: one connected system where strategy fuels creativity and creativity fuels growth.
            </>
          ].map((text, idx) => (
            <motion.p 
              key={idx}
              className="text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={storyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              {text}
            </motion.p>
          ))}
        </motion.div>

        <ThreadLine />

        {/* Experience */}
        <motion.div 
          ref={experienceRef}
          className="max-w-4xl mx-auto mb-24"
          initial={{ opacity: 0, y: 50 }}
          animate={experienceInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Built By Experience
          </h2>
          <p className="text-foreground text-lg text-center mb-12">
            Our team's experience includes working with industry leaders:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            {["Flipkart", "Star Sports", "Heineken", "IPL", "F4", "Nayara Energy"].map((brand, idx) => (
              <motion.div 
                key={brand}
                className="text-muted-foreground hover:text-gold transition-colors duration-300 font-sans tracking-wide text-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={experienceInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <ThreadLine />

        {/* Philosophy */}
        <motion.div 
          ref={philosophyRef}
          className="max-w-4xl mx-auto mb-24 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={philosophyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">
            Our Philosophy
          </h2>
          <div className="space-y-6 text-lg">
            {[
              { text: "Every brand has a story worth telling.", className: "text-foreground" },
              { text: "Every story needs the right system to scale.", className: "text-foreground" },
              { text: "And every great system is held together by a single thread.", className: "text-gold font-medium" }
            ].map((item, idx) => (
              <motion.p 
                key={idx}
                className={item.className}
                initial={{ opacity: 0, x: -20 }}
                animate={philosophyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.3 + idx * 0.2 }}
              >
                {item.text}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          ref={ctaRef}
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-serif text-2xl md:text-3xl text-foreground mb-8">
            Every brand has a story. Let's tell yours.
          </p>
          <Link to="/contact">
            <Button 
              size="lg"
              className="bg-gold text-background hover:bg-gold-muted font-sans tracking-wide px-8 py-6 text-lg"
            >
              Start Your Story
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
