import { Link } from "react-router-dom";
import { Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import logo from "@/assets/HW_Logo.png";

const footerPages = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
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

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-gray-500 hover:text-gray-900 transition-colors cursor-default"
                aria-label="Facebook (coming soon)"
                title="Coming soon"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-gray-500 hover:text-gray-900 transition-colors cursor-default"
                aria-label="X (coming soon)"
                title="Coming soon"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-gray-500 hover:text-gray-900 transition-colors cursor-default"
                aria-label="Instagram (coming soon)"
                title="Coming soon"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-gray-500 hover:text-blue-700 transition-colors cursor-default"
                aria-label="LinkedIn (coming soon)"
                title="Coming soon"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/27715138219"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-600 transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right — Contact Details */}
          <div className="md:text-right">
            <h4 className="font-heading text-lg font-bold text-gray-900 mb-6">Contact Us</h4>
            <div className="flex flex-col gap-4">
              <a
                href="https://wa.me/27715138219"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center md:justify-end gap-2 font-body text-sm text-gray-600 hover:text-green-600 transition-colors"
              >
                {/* WhatsApp icon inline */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
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
