import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  variant = "text",
  width,
  height,
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton",
        `skeleton-${variant}`,
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
      {...props}
    />
  );
}

function SkeletonCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("skeleton-card-wrapper", className)} {...props}>
      <Skeleton variant="rectangular" height={200} />
      <div className="skeleton-card-body">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  );
}

export { Skeleton, SkeletonCard };
