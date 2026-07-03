import { memo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href: string;
}

export const StatCard = memo(function StatCard({ label, value, icon: Icon, href }: Props) {
  return (
    <Link
      to={href}
      className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
      <p className="font-body text-xs text-muted-foreground">{label}</p>
    </Link>
  );
});
