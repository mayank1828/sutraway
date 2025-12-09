import SectionTitle from "@/components/SectionTitle";
import ThreadLine from "@/components/ThreadLine";
import { Lightbulb, Camera, ShoppingCart, TrendingUp, Handshake } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const WhatWeDo = () => {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation();
  const { ref: bodyRef, isInView: bodyInView } = useScrollAnimation();
  const { ref: pillarsRef, isInView: pillarsInView } = useScrollAnimation();

  const pillars = [
    {
      icon: Lightbulb,
      title: "Marketing & Strategy",
      description: "Positioning, campaign architecture, GTM plans.",
    },
    {
      icon: Camera,
      title: "Content Production",
      description: "Films, Reels, Music Videos, Product Shoot, Design, Grapics.",
    },
    {
      icon: ShoppingCart,
      title: "E-Commerce",
      description: "Shopify builds, listings, CRO, CRM.",
    },
    {
      icon: TrendingUp,
      title: "Growth & Media",
      description: "Paid social/search, testing, reporting.",
    },
    {
      icon: Handshake,
      title: "Brand Collaborations",
      description: "Influencers, partnerships, co-branded drops.",
    },
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          ref={headerRef}
          className="text-center max-w-4xl mx-auto mb-24"
          initial={{ opacity: 0, y: 50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            THE SUTRA WAY
          </h1>
          <h2 className="font-serif text-3xl md:text-4xl text-gold mb-8">
            We cater everything your brand needs.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            One continuous thread connects our foundations: Marketing & Strategy, Content Production, E-Commerce, Growth & Media, and Brand Collaborations.
          </p>
        </motion.div>

        <ThreadLine />

        {/* Body Copy */}
        <motion.div 
          ref={bodyRef}
          className="max-w-4xl mx-auto mb-24 space-y-6 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={bodyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          {[
            "Every brand has a story. We help you tell it, scale it, and sell it. — connecting strategy, content, and growth in one seamless rhythm.",
            "From positioning and production to performance and partnerships — Sutra connects it all.",
            "We don't just create campaigns — we build systems."
          ].map((text, idx) => (
            <motion.p 
              key={idx}
              className="text-foreground text-xl leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              animate={bodyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              {text}
            </motion.p>
          ))}
          <motion.p 
            className="text-gold text-xl leading-relaxed font-medium"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={bodyInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Because when everything moves in sync, stories start to sell themselves.
          </motion.p>
        </motion.div>

        <ThreadLine />

        {/* Five Pillars */}
        <div ref={pillarsRef} className="max-w-6xl mx-auto">
          <SectionTitle 
            title="Our Five Pillars" 
            subtitle="A comprehensive approach to brand growth"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <motion.div 
                key={pillar.title}
                className="bg-card border border-border p-8 hover:border-gold transition-all duration-300 group"
                initial={{ opacity: 0, y: 50 }}
                animate={pillarsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <pillar.icon className="w-12 h-12 text-gold mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDo;
