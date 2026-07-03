import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "error";

const TONE: Record<Tone, { wrap: string; icon: ReactNode }> = {
  info: { wrap: "bg-primary/5 border-primary/30 text-foreground", icon: <Info className="w-4 h-4 text-primary" /> },
  success: { wrap: "bg-emerald-500/5 border-emerald-500/30 text-foreground", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
  warning: { wrap: "bg-amber-500/5 border-amber-500/30 text-foreground", icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
  error: { wrap: "bg-destructive/5 border-destructive/30 text-foreground", icon: <AlertCircle className="w-4 h-4 text-destructive" /> },
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  title?: string;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ tone = "info", title, children, className, ...rest }, ref) => {
    const t = TONE[tone];
    return (
      <div ref={ref} role="alert" className={cn("border p-4 flex gap-3", t.wrap, className)} {...rest}>
        <div className="pt-0.5 shrink-0">{t.icon}</div>
        <div className="flex-1 min-w-0">
          {title && <p className="font-subheading text-sm font-semibold mb-1">{title}</p>}
          <div className="font-body text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    );
  },
);
Alert.displayName = "Alert";
