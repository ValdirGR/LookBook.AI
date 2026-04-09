import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "premium";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  children: ReactNode;
}

function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        `badge-${variant}`,
        `badge-${size}`,
        className
      )}
      {...props}
    >
      {dot && <span className="badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

export { Badge, type BadgeProps, type BadgeVariant };
