import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import holawebLogo from "@/assets/holaweb-logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-golden/10">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <img src={holawebLogo} alt="Holaweb" className="h-10 w-auto" />
            <p className="text-muted-foreground text-sm font-poppins leading-relaxed">
              Your trusted technology solutions partner — empowering businesses across Africa with cloud, web, market access, and META solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-golden font-garet text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About", "Services", "Contact"].map((label) => (
                <li key={label}>
                  <Link
                    to={`/${label.toLowerCase() === "home" ? "" : label.toLowerCase()}`}
                    className="text-muted-foreground hover:text-golden text-sm font-poppins transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-golden font-garet text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              {[
                { label: "Cloud Services", to: "/services/cloud-services" },
                { label: "Web & App Development", to: "/services/web-app-development" },
                { label: "Market Access", to: "/services/market-access" },
                { label: "META Solutions", to: "/services/meta-solutions" },
              ].map((s) => (
                <li key={s.to}>
                  <Link
                    to={s.to}
                    className="text-muted-foreground hover:text-golden text-sm font-poppins transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-golden font-garet text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground text-sm font-poppins">
                <Mail className="w-4 h-4 text-golden mt-0.5 flex-shrink-0" />
                info@holaweb.com
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm font-poppins">
                <Phone className="w-4 h-4 text-golden mt-0.5 flex-shrink-0" />
                +254 700 000 000
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm font-poppins">
                <MapPin className="w-4 h-4 text-golden mt-0.5 flex-shrink-0" />
                Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-golden/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs font-poppins">
            © {new Date().getFullYear()} Holaweb. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-golden transition-colors text-xs font-poppins">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-golden transition-colors text-xs font-poppins">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
