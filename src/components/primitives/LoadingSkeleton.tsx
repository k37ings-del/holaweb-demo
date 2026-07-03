import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface LoadingSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

export const LoadingSkeleton = ({ lines = 1, className, ...rest }: LoadingSkeletonProps) => {
  if (lines <= 1) {
    return <div className={cn("animate-pulse bg-muted h-4 w-full", className)} {...rest} />;
  }
  return (
    <div className={cn("space-y-2", className)} {...rest}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn("animate-pulse bg-muted h-4", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
};
