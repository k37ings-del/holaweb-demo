import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/HW_Logo.png";

const serviceSubpages = [
  { label: "Cloud Services", href: "/services/cloud" },
  { label: "Apps Development", href: "/services/apps" },
  { label: "Go-To-Market Support", href: "/services/gtm" },
  { label: "Integrations", href: "/services/integrations" },
  { label: "Tech Reseller", href: "/services/reseller" },
  { label: "Business Strategy", href: "/services/strategy" },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Contact", href: "/contact" },
];

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-lg"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="Holaweb" className="h-8 md:h-10" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) =>
            item.hasDropdown ? (
              <div key={item.href} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
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
                </button>

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
              <Link
                key={item.href}
                to={item.href}
                className={`font-subheading text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                  location.pathname === item.href
                    ? "text-golden"
                    : "text-foreground/80 hover:text-golden"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border">
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
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
