import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import holawebLogo from "@/assets/holaweb-logo.png";

const serviceLinks = [
  { label: "Cloud Services", to: "/services/cloud-services" },
  { label: "Web & App Development", to: "/services/web-app-development" },
  { label: "Market Access", to: "/services/market-access" },
  { label: "META Solutions", to: "/services/meta-solutions" },
];

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services", hasDropdown: true },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-golden/10"
          : "bg-background"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={holawebLogo} alt="Holaweb" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                <Link
                  to={link.to}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium font-noto transition-colors flex items-center gap-1",
                    location.pathname.startsWith(link.to) && link.to !== "/"
                      ? "text-golden"
                      : location.pathname === link.to
                      ? "text-golden"
                      : "text-foreground/80 hover:text-golden"
                  )}
                  onMouseEnter={() => link.hasDropdown && setServicesOpen(true)}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>

                {/* Services Dropdown */}
                {link.hasDropdown && (
                  <div
                    className={cn(
                      "absolute top-full left-0 mt-1 w-60 rounded-xl border border-golden/20 bg-card shadow-xl shadow-black/30 overflow-hidden transition-all duration-200 z-50",
                      servicesOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    )}
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    {serviceLinks.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        className="block px-5 py-3 text-sm font-poppins text-foreground/80 hover:text-golden hover:bg-muted transition-colors"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-golden/10 animate-fade-in-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  to={link.to}
                  className="block px-4 py-3 rounded-lg text-sm font-medium font-noto text-foreground/80 hover:text-golden transition-colors"
                  onClick={() => !link.hasDropdown && setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.hasDropdown && (
                  <div className="ml-4 border-l-2 border-golden/20 pl-4">
                    {serviceLinks.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        className="block py-2 text-sm font-poppins text-foreground/60 hover:text-golden transition-colors"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
