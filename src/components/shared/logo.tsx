import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "mark";
  className?: string;
}

const sizeMap = {
  sm: { mark: 24, text: "text-base" },
  md: { mark: 32, text: "text-xl" },
  lg: { mark: 44, text: "text-2xl" },
};

export function Logo({ size = "md", variant = "full", className }: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className={cn("logo", className)}>
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          width="44"
          height="44"
          rx="10"
          fill="currentColor"
          className="text-charcoal dark:text-cream"
        />
        <path
          d="M12 32V12h4v16h8v4H12Z"
          fill="var(--color-rose-gold)"
        />
        <path
          d="M26 12h4v20h-4V12Z"
          fill="var(--color-rose-gold)"
          opacity="0.6"
        />
        <circle
          cx="34"
          cy="14"
          r="3"
          fill="var(--color-blush)"
        />
      </svg>
      {variant === "full" && (
        <span
          className={cn(
            "logo-text font-display font-bold tracking-tight",
            s.text
          )}
        >
          LookBook<span className="text-gradient">AI</span>
        </span>
      )}
    </div>
  );
}
