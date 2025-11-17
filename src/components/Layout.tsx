import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import sutraLogo from "@/assets/sutra-logo.png";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "What We Do", path: "/what-we-do" },
    { name: "Work", path: "/work" },
    { name: "Production", path: "/production" },
    { name: "Packages", path: "/packages" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img src={sutraLogo} alt="SUTRA" className="h-12 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-sans tracking-wide transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-gold font-medium"
                      : "text-foreground hover:text-gold"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 animate-fade-in">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 text-sm font-sans tracking-wide transition-colors ${
                    isActive(link.path)
                      ? "text-gold font-medium"
                      : "text-foreground hover:text-gold"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border mt-32 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <img src={sutraLogo} alt="SUTRA" className="h-10 w-auto" />
            <div className="text-muted-foreground text-sm">
              © 2025 SUTRA. Every thread begins with a conversation.
            </div>
            <div className="flex gap-6">
              <a href="mailto:workwithsutra@gmail.com" className="text-foreground hover:text-gold transition-colors text-sm">
                workwithsutra@gmail.com
              </a>
              <a href="tel:+919892484254" className="text-foreground hover:text-gold transition-colors text-sm">
                +91 98924 84254
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
