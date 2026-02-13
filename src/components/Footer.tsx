import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/HW_Logo.png";

const footerPages = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Cloud Services", href: "/services/cloud" },
  { label: "Apps Development", href: "/services/apps" },
  { label: "Integrations", href: "/services/integrations" },
  { label: "Contact", href: "/contact" },
];

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left — Page Links */}
          <div>
            <h4 className="font-heading text-lg font-bold text-gray-900 mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {footerPages.map((page) => (
                <Link
                  key={page.href}
                  to={page.href}
                  className="font-body text-sm transition-colors duration-300"
                  style={{ color: "hsl(15 50% 45%)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(15 60% 35%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(15 50% 45%)")}
                >
                  {page.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center — Logo & Description */}
          <div className="flex flex-col items-center text-center">
            <img src={logo} alt="Holaweb" className="h-12 mb-4" />
            <p className="font-body text-sm text-gray-600 leading-relaxed max-w-xs">
              Holaweb Media Group is a South African digital solutions company
              focused on inclusive, cloud‑powered products that turn strategy into
              measurable outcomes.
            </p>
          </div>

          {/* Right — Contact Details */}
          <div className="md:text-right">
            <h4 className="font-heading text-lg font-bold text-gray-900 mb-6">Contact Us</h4>
            <div className="flex flex-col gap-4">
              <a href="tel:+27715138219" className="flex items-center md:justify-end gap-2 font-body text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <Phone className="h-4 w-4" />
                +27 71 513 8219
              </a>
              <a href="mailto:siya@holaweb.co.za" className="flex items-center md:justify-end gap-2 font-body text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <Mail className="h-4 w-4" />
                siya@holaweb.co.za
              </a>
              <div className="flex items-start md:justify-end gap-2 font-body text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>4382 Wild Current, Riverside,<br />Fourways, Gauteng, 2189</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-6 py-4 text-center">
          <p className="font-body text-xs text-gray-500">
            © {new Date().getFullYear()} Holaweb Media Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
