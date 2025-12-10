import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionTitle from "@/components/SectionTitle";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PackageItem {
  id: string;
  name: string;
  subtitle: string | null;
  features: string[];
  is_popular: boolean;
  display_order: number;
}

const Packages = () => {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackPackages = [
    {
      id: 'fallback-1',
      name: "Starter",
      subtitle: "For early-stage brands",
      features: [
        "Brand Strategy & Positioning",
        "Content Creation (2 posts/week)",
        "Social Media Management",
        "Basic Analytics & Reporting",
      ],
      is_popular: false,
      display_order: 0,
    },
    {
      id: 'fallback-2',
      name: "Growth",
      subtitle: "For scaling brands",
      features: [
        "Everything in Starter",
        "Content Production (4 posts/week)",
        "Paid Media Management",
        "E-Commerce Setup & Management",
        "Influencer Collaborations",
        "Advanced Analytics & Strategy",
      ],
      is_popular: true,
      display_order: 1,
    },
    {
      id: 'fallback-3',
      name: "Enterprise",
      subtitle: "Full-stack creative + performance",
      features: [
        "Everything in Growth",
        "Dedicated Account Team",
        "Video Production & Editing",
        "Full E-Commerce Optimization",
        "Multi-Channel Media Strategy",
        "Custom Partnership Deals",
        "Monthly Strategy Sessions",
      ],
      is_popular: false,
      display_order: 2,
    },
  ];

  const displayPackages = packages.length > 0 ? packages : fallbackPackages;

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        <SectionTitle 
          title="Packages That Grow With You" 
          subtitle="Every brand grows differently — but every growth story needs a system."
        />

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading packages...</p>
          </div>
        ) : (
          <>
            {/* Packages Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
              {displayPackages.map((pkg, index) => (
                <div 
                  key={pkg.id}
                  className={`bg-card border p-8 hover:border-gold transition-all duration-300 animate-fade-in ${
                    pkg.is_popular ? 'border-gold scale-105 relative' : 'border-border'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {pkg.is_popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-background px-4 py-1 text-sm font-sans tracking-wider">
                      POPULAR
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className="font-serif text-3xl font-bold text-foreground mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-muted-foreground">{pkg.subtitle}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/contact">
                    <Button 
                      className={`w-full ${
                        pkg.is_popular 
                          ? 'bg-gold text-background hover:bg-gold-muted' 
                          : 'bg-secondary text-foreground hover:bg-gold hover:text-background'
                      }`}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Add-ons */}
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                Optional Add-Ons
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                {[
                  "Brand Photography Sessions",
                  "Video Production Projects",
                  "Influencer Campaign Management",
                  "E-Commerce Consulting",
                  "Custom Web Development",
                  "Advanced Automation Setup",
                ].map((addon, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>{addon}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Packages;
