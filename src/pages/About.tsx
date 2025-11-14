import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThreadLine from "@/components/ThreadLine";

const About = () => {
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
        <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed mb-24">
          <p className="text-foreground animate-fade-in">
            <span className="font-serif text-2xl text-gold">Sutra</span> is a full-stack creative and growth agency based in Mumbai.
          </p>

          <p className="text-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="font-serif text-2xl text-gold">Sutra</span> means "thread" — the connection between creativity, strategy, and commerce.
          </p>

          <p className="text-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
            We build brands through stories crafted with cinematic precision and commercial clarity.
          </p>

          <p className="text-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
            We believe in <span className="text-gold font-medium">"The Thread"</span>: one connected system where strategy fuels creativity and creativity fuels growth.
          </p>
        </div>

        <ThreadLine />

        {/* Experience */}
        <div className="max-w-4xl mx-auto mb-24 animate-fade-in">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Built By Experience
          </h2>
          <p className="text-foreground text-lg text-center mb-12">
            Our team's experience includes working with industry leaders:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            {["Flipkart", "Star Sports", "Heineken", "IPL", "F4", "Nayara Energy"].map((brand, idx) => (
              <div 
                key={brand}
                className="text-muted-foreground hover:text-gold transition-colors duration-300 font-sans tracking-wide text-lg"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {brand}
              </div>
            ))}
          </div>
        </div>

        <ThreadLine />

        {/* Philosophy */}
        <div className="max-w-4xl mx-auto mb-24 text-center animate-fade-in">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">
            Our Philosophy
          </h2>
          <div className="space-y-6 text-lg">
            <p className="text-foreground">
              Every brand has a story worth telling.
            </p>
            <p className="text-foreground">
              Every story needs the right system to scale.
            </p>
            <p className="text-gold font-medium">
              And every great system is held together by a single thread.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in">
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
        </div>
      </div>
    </div>
  );
};

export default About;
