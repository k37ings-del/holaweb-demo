import { MessageSquare, MessageCircle, Mail, Smartphone, Share2, Megaphone } from "lucide-react";

const channels = [
  {
    icon: MessageCircle,
    name: "WhatsApp Business",
    description: "Send product links, invoices, and order notifications via WhatsApp. Powered by Meta Business Suite.",
    status: "Coming Soon",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Mail,
    name: "Email",
    description: "Automated transactional emails, invoices, and marketing campaigns to your customers.",
    status: "Coming Soon",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Smartphone,
    name: "SMS",
    description: "Send SMS notifications for orders, payment confirmations, and promotional campaigns.",
    status: "Planned",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
];

const metaFeatures = [
  { title: "Product Catalog Sync", description: "Sync your products to Facebook & Instagram Shops" },
  { title: "Ad Campaigns", description: "Create and manage Meta ad campaigns from your dashboard" },
  { title: "Messenger Integration", description: "Respond to customer enquiries from Facebook Messenger" },
  { title: "Instagram DMs", description: "Manage Instagram Direct Messages in one place" },
];

const Messaging = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Messaging & Communication</h1>
      <p className="font-body text-sm text-muted-foreground">Reach your customers across every channel.</p>
    </div>

    {/* Channels */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {channels.map((channel) => (
        <div key={channel.name} className="bg-card border border-border rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 ${channel.bgColor} rounded-lg flex items-center justify-center`}>
              <channel.icon className={`w-5 h-5 ${channel.color}`} />
            </div>
            <span className="bg-accent text-accent-foreground px-2.5 py-0.5 rounded-full font-body text-[10px] font-medium">
              {channel.status}
            </span>
          </div>
          <div>
            <h3 className="font-subheading text-sm font-semibold text-foreground">{channel.name}</h3>
            <p className="font-body text-xs text-muted-foreground mt-1">{channel.description}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Meta Business Suite */}
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
          <Share2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">Meta Business Suite</h2>
          <p className="font-body text-xs text-muted-foreground">Facebook, Instagram & WhatsApp — all connected</p>
        </div>
        <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-body text-xs font-medium ml-auto">Coming Soon</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metaFeatures.map((feature) => (
          <div key={feature.title} className="bg-muted/50 border border-border/50 rounded-lg p-4">
            <p className="font-subheading text-sm font-semibold text-foreground">{feature.title}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Notification Engine */}
    <div className="bg-card border border-border rounded-lg p-6 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Megaphone className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">Automated Notifications</h2>
          <p className="font-body text-xs text-muted-foreground">Trigger-based messaging connected to your payments and orders</p>
        </div>
      </div>
      <div className="space-y-2">
        {["Order confirmed → WhatsApp + Email", "Payment received → Receipt via Email", "Payment link shared → SMS reminder after 24h", "New customer → Welcome message via WhatsApp"].map((item) => (
          <div key={item} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Messaging;
