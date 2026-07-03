import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl" | "full";

const SIZES: Record<Size, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
}

/** Horizontal page/content constraint. */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "xl", className, ...rest }, ref) => (
    <div ref={ref} className={cn("mx-auto w-full px-6", SIZES[size], className)} {...rest} />
  ),
);
Container.displayName = "Container";
