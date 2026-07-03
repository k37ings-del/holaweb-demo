import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Spacing = "none" | "sm" | "md" | "lg";

const SPACING: Record<Spacing, string> = {
  none: "",
  sm: "py-8",
  md: "py-16",
  lg: "py-24",
};

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: Spacing;
  as?: "section" | "div" | "header" | "footer";
}

/** Vertical page section with consistent spacing. */
export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ spacing = "md", as: Tag = "section", className, ...rest }, ref) => (
    <Tag
      ref={ref as never}
      className={cn(SPACING[spacing], className)}
      {...rest}
    />
  ),
);
Section.displayName = "Section";
