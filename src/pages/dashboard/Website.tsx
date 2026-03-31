import { Globe, Layout, ShoppingCart, Calendar, Palette, Smartphone } from "lucide-react";

const features = [
  { icon: Layout, label: "Landing Pages", description: "Create beautiful landing pages to showcase your business and capture leads" },
  { icon: ShoppingCart, label: "Online Store", description: "Set up a full e-commerce store with product listings, cart, and checkout" },
  { icon: Calendar, label: "Booking Pages", description: "Let customers book services directly from your website with calendar integration" },
  { icon: Palette, label: "Custom Themes", description: "Choose from professionally designed templates and customise colours, fonts, and layout" },
  { icon: Smartphone, label: "Mobile Optimised", description: "All pages are responsive and optimised for mobile devices out of the box" },
  { icon: Globe, label: "Custom Domain", description: "Connect your own domain or use a free Holaweb subdomain for your business" },
];

const Website = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Website Builder</h1>
      <p className="font-body text-sm text-muted-foreground">Build your online presence — no code required.</p>
    </div>

    {/* Feature Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((feature) => (
        <div key={feature.label} className="bg-card border border-border rounded-lg p-5 space-y-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <feature.icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-subheading text-sm font-semibold text-foreground">{feature.label}</h3>
            <p className="font-body text-xs text-muted-foreground mt-1">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>

    {/* CTA */}
    <div className="bg-card border border-border rounded-lg p-8 text-center">
      <Globe className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
      <h3 className="font-heading text-lg font-bold text-foreground mb-2">Website Builder Coming Soon</h3>
      <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
        Create landing pages, online stores, and booking pages — all connected to your payments, products, and CRM. Hosted on secure AWS infrastructure.
      </p>
    </div>
  </div>
);

export default Website;
