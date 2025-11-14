import SectionTitle from "@/components/SectionTitle";
import ThreadLine from "@/components/ThreadLine";
import { Lightbulb, Camera, ShoppingCart, TrendingUp, Handshake } from "lucide-react";

const WhatWeDo = () => {
  const pillars = [
    {
      icon: Lightbulb,
      title: "Marketing & Strategy",
      description: "Positioning, campaign architecture, GTM plans.",
    },
    {
      icon: Camera,
      title: "Content Production",
      description: "Films, photo, design, post.",
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
        <div className="text-center max-w-4xl mx-auto mb-24 animate-fade-in">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            THE SUTRA WAY
          </h1>
          <h2 className="font-serif text-3xl md:text-4xl text-gold mb-8">
            We cater everything your brand needs.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            One continuous thread connects our foundations: Marketing & Strategy, Content Production, E-Commerce, Growth & Media, and Brand Collaborations.
          </p>
        </div>

        <ThreadLine />

        {/* Body Copy */}
        <div className="max-w-4xl mx-auto mb-24 space-y-6 text-center animate-fade-in">
          <p className="text-foreground text-xl leading-relaxed">
            Every brand has a story. We help you tell it, scale it, and sell it.
          </p>
          <p className="text-foreground text-xl leading-relaxed">
            From positioning and production to performance and partnerships — Sutra connects it all.
          </p>
          <p className="text-foreground text-xl leading-relaxed">
            We don't just create campaigns — we build systems.
          </p>
          <p className="text-gold text-xl leading-relaxed font-medium">
            Because when everything moves in sync, stories start to sell themselves.
          </p>
        </div>

        <ThreadLine />

        {/* Five Pillars */}
        <div className="max-w-6xl mx-auto">
          <SectionTitle 
            title="Our Five Pillars" 
            subtitle="A comprehensive approach to brand growth"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <div 
                key={pillar.title}
                className="bg-card border border-border p-8 hover:border-gold transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <pillar.icon className="w-12 h-12 text-gold mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDo;
