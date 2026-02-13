import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/HW_Logo.png";

const serviceItems = [
  { label: "Cloud Services", href: "/services/cloud" },
  { label: "Apps Development", href: "/services/apps" },
  { label: "Go-To-Market Support", href: "/services/gtm" },
  { label: "Integrations", href: "/services/integrations" },
  { label: "Tech Reseller", href: "/services/reseller" },
  { label: "Business Strategy", href: "/services/strategy" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-secondary/95 backdrop-blur-md shadow-lg"
          : "bg-secondary"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="Holaweb" className="h-8 md:h-10" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            to="/"
            className="font-heading text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="font-heading text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            About
          </Link>

          {/* Services Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="flex items-center gap-1 font-heading text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
            >
              Services
              <ChevronDown
                className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-3 w-56 rounded-lg bg-card shadow-xl border border-border overflow-hidden animate-fade-in-up">
                {serviceItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setServicesOpen(false)}
                    className="block px-5 py-3 text-sm font-body text-card-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/contact"
            className="font-heading text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-primary-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-secondary border-t border-primary-foreground/10">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="py-3 font-heading text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              className="py-3 font-heading text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground"
            >
              About
            </Link>

            {/* Mobile Services Accordion */}
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="flex items-center justify-between py-3 font-heading text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground"
            >
              Services
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileServicesOpen && (
              <div className="pl-4 flex flex-col gap-1">
                {serviceItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileServicesOpen(false);
                    }}
                    className="py-2 text-sm font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="py-3 font-heading text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
