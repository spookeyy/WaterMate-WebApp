import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
};

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full bg-gradient-to-br from-water-400 to-water-600 shadow-lg",
          sizeClasses[size],
        )}
      >
        {/* Water drop icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn(
            "text-white",
            size === "sm"
              ? "w-3 h-3"
              : size === "md"
                ? "w-4 h-4"
                : size === "lg"
                  ? "w-6 h-6"
                  : "w-8 h-8",
          )}
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" fill="currentColor" />
          <circle cx="9" cy="12" r="1" fill="rgba(255,255,255,0.4)" />
        </svg>

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
      </div>

      {showText && (
        <span
          className={cn(
            "font-bold gradient-text tracking-tight",
            textSizeClasses[size],
          )}
        >
          WaterMate
        </span>
      )}
    </div>
  );
}
