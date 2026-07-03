import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Padding = "none" | "sm" | "md" | "lg";
type Variant = "default" | "muted" | "outline";

const PAD: Record<Padding, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

const VARIANT: Record<Variant, string> = {
  default: "bg-card border border-border",
  muted: "bg-muted border border-border/50",
  outline: "border border-border bg-transparent",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: Padding;
  variant?: Variant;
  hoverable?: boolean;
}

/** Sharp-cornered surface — project rule keeps radius on buttons/profiles only. */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ padding = "md", variant = "default", hoverable = false, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        VARIANT[variant],
        PAD[padding],
        hoverable && "transition-colors hover:border-primary/30",
        className,
      )}
      {...rest}
    />
  ),
);
Card.displayName = "Card";
