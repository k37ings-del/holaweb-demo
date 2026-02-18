import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import logo from "@/assets/HW_Logo.png";

const serviceSubpages = [
  { label: "Cloud Services", href: "/services/cloud-services" },
  { label: "Web & App Development", href: "/services/web-app-development" },
  { label: "Market Access", href: "/services/market-access" },
  { label: "META Solutions", href: "/services/meta-solutions" },
];

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "SME Impact",
    href: "https://smeimpact.co.za/",
    external: true,
  },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Quick Start", href: "/quick_start" },
  { label: "Contact", href: "/contact" },
];

const WhatsAppIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const XIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isServicesActive = location.pathname.startsWith("/services");

  const renderNavLink = (item: typeof navItems[0]) => {
    const isActive = item.href === "/" ? location.pathname === "/" : location.pathname.startsWith(item.href);
    const baseClass = `font-subheading text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
      isActive ? "text-golden" : "text-foreground/80 hover:text-golden"
    }`;

    if (item.external) {
      return (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClass}
        >
          {item.label}
        </a>
      );
    }
    return (
      <Link key={item.href} to={item.href} className={baseClass}>
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-card border-b border-border text-foreground/70 text-xs fixed top-0 left-0 right-0 z-[60]">
        <div className="container mx-auto px-6 flex items-center justify-between h-9">
          <div className="flex items-center gap-6">
            <a href="tel:+27715138219" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone className="h-3 w-3" />
              <span className="font-body">Tel: +27 71 513 8219</span>
            </a>
            <Link to="/contact" className="hidden sm:flex items-center gap-1.5 hover:text-primary transition-colors">
              <Mail className="h-3 w-3" />
              <span className="font-body">Email: siya@holaweb.co.za</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Facebook">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="X">
              <XIcon className="h-4 w-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`fixed top-9 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-md shadow-lg"
            : "bg-background"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Holaweb" className="h-8 md:h-10" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) =>
              item.hasDropdown ? (
                <div key={item.href} className="relative" ref={dropdownRef}
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-1 font-subheading text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                      isServicesActive
                        ? "text-golden"
                        : "text-foreground/80 hover:text-golden"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Link>

                  {servicesOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-card border border-border shadow-xl z-50">
                      <div className="py-2">
                        <Link
                          to="/services"
                          className="block px-4 py-2.5 font-subheading text-xs font-semibold uppercase tracking-wider text-golden/80 hover:text-golden hover:bg-muted transition-colors"
                        >
                          All Services
                        </Link>
                        <div className="mx-3 h-px bg-border my-1" />
                        {serviceSubpages.map((sub) => (
                          <Link
                            key={sub.href}
                            to={sub.href}
                            className={`block px-4 py-2.5 font-body text-sm transition-colors ${
                              location.pathname === sub.href
                                ? "text-golden bg-muted"
                                : "text-foreground/70 hover:text-foreground hover:bg-muted"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                renderNavLink(item)
              )
            )}

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/27715138219"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold font-subheading text-white transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden bg-background border-t border-border">
            <nav className="container mx-auto px-6 py-4 flex flex-col gap-1">
              {navItems.map((item) =>
                item.hasDropdown ? (
                  <div key={item.href}>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className={`w-full flex items-center justify-between py-3 font-subheading text-sm font-medium uppercase tracking-wide transition-colors ${
                        isServicesActive
                          ? "text-golden"
                          : "text-foreground/80 hover:text-golden"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          mobileServicesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileServicesOpen && (
                      <div className="pl-4 flex flex-col gap-1 mb-2">
                        <Link
                          to="/services"
                          className="py-2 font-body text-xs font-semibold uppercase tracking-wider text-golden/80 hover:text-golden transition-colors"
                        >
                          All Services
                        </Link>
                        {serviceSubpages.map((sub) => (
                          <Link
                            key={sub.href}
                            to={sub.href}
                            className={`py-2 font-body text-sm transition-colors ${
                              location.pathname === sub.href
                                ? "text-golden"
                                : "text-foreground/60 hover:text-foreground"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 font-subheading text-sm font-medium uppercase tracking-wide text-foreground/80 hover:text-golden transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`py-3 font-subheading text-sm font-medium uppercase tracking-wide transition-colors ${
                      location.pathname === item.href
                        ? "text-golden"
                        : "text-foreground/80 hover:text-golden"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}

              {/* Mobile WhatsApp Button */}
              <a
                href="https://wa.me/27715138219"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold font-subheading text-white transition-all duration-300"
                style={{ backgroundColor: "#25D366" }}
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
