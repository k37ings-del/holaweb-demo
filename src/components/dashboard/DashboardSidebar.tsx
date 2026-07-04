import { memo } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Globe,
  CreditCard,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  X,
  Share2,
  type LucideIcon,
} from "lucide-react";
import logo from "@/assets/HW_Logo.png";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const DEFAULT_SIDEBAR_ITEMS: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: ShoppingBag, label: "Products", href: "/dashboard/products" },
  { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
  { icon: Users, label: "Customers", href: "/dashboard/customers" },
  { icon: Share2, label: "Meta Business", href: "/dashboard/messaging" },
  { icon: Globe, label: "Website", href: "/dashboard/website" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

interface Props {
  items?: SidebarItem[];
  open: boolean;
  onClose: () => void;
  onNavigate: () => void;
  onSignOut: () => void;
  isActive: (href: string) => boolean;
  businessName?: string | null;
  /** Optional filter: if provided, items whose href is rejected are hidden. */
  canAccessHref?: (href: string) => boolean;
}

export const DashboardSidebar = memo(function DashboardSidebar({
  items = DEFAULT_SIDEBAR_ITEMS,
  open,
  onClose,
  onNavigate,
  onSignOut,
  isActive,
  businessName,
  canAccessHref,
}: Props) {
  const visibleItems = canAccessHref ? items.filter((i) => canAccessHref(i.href)) : items;
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="px-6 py-5 border-b border-sidebar-border flex items-center justify-between">
          <img src={logo} alt="Holaweb" className="h-7" />
          <button onClick={onClose} className="lg:hidden text-sidebar-foreground" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        {businessName && (
          <div className="px-6 py-4 border-b border-sidebar-border">
            <p className="font-subheading text-xs text-sidebar-foreground/60 uppercase tracking-wider">Business</p>
            <p className="font-heading text-sm font-semibold text-sidebar-foreground truncate">{businessName}</p>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-sidebar-border">
          <button
            onClick={onSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
});
