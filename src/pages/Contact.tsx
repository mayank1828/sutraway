import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import SectionTitle from "@/components/SectionTitle";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    brandName: "",
    services: [] as string[],
    budget: "",
    description: "",
  });

  const serviceOptions = [
    "Marketing & Strategy",
    "Content Production",
    "E-Commerce",
    "Growth & Media",
    "Brand Collaborations",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({
      name: "",
      email: "",
      brandName: "",
      services: [],
      budget: "",
      description: "",
    });
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        <SectionTitle 
          title="Let's Begin Your Story" 
          subtitle="Every thread begins with a conversation."
        />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div>
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <Input
                placeholder="Brand Name"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-3">
              <label className="text-foreground font-sans text-sm">What do you need?</label>
              {serviceOptions.map((service) => (
                <div key={service} className="flex items-center space-x-3">
                  <Checkbox
                    id={service}
                    checked={formData.services.includes(service)}
                    onCheckedChange={() => handleServiceToggle(service)}
                    className="border-border data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                  />
                  <label 
                    htmlFor={service}
                    className="text-foreground cursor-pointer"
                  >
                    {service}
                  </label>
                </div>
              ))}
            </div>

            <div>
              <Input
                placeholder="Budget Range"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <Textarea
                placeholder="Tell us about your project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={6}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            <Button 
              type="submit"
              size="lg"
              className="w-full bg-gold text-background hover:bg-gold-muted font-sans tracking-wide"
            >
              Send It Across →
            </Button>
          </form>

          {/* Contact Info */}
          <div className="space-y-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="font-serif text-3xl font-bold text-foreground mb-8">
                Get in Touch
              </h3>
              <p className="text-muted-foreground text-lg mb-8">
                Ready to start your project? Reach out to us and let's create something extraordinary together.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Email</p>
                  <a 
                    href="mailto:workwithsutra@gmail.com"
                    className="text-foreground hover:text-gold transition-colors text-lg"
                  >
                    workwithsutra@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Phone</p>
                  <a 
                    href="tel:+919892484254"
                    className="text-foreground hover:text-gold transition-colors text-lg"
                  >
                    +91 98924 84254
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Location</p>
                  <p className="text-foreground text-lg">Mumbai, India</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <p className="text-gold font-serif text-xl italic">
                "Every thread begins with a conversation."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
