import { memo } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  icon: LucideIcon;
  href: string;
}

export const QuickActionCard = memo(function QuickActionCard({ label, icon: Icon, href }: Props) {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 bg-muted border border-border rounded-lg p-4 hover:border-primary/30 transition-colors"
    >
      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="font-body text-sm text-foreground">{label}</span>
    </Link>
  );
});
