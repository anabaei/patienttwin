"use client";

import { HexagonBackground } from "@/components/ui/shadcn-io/hexagon-background";
import { cn } from "@/lib/utils";

type HealthcareHexagonBackgroundProps = {
  children?: React.ReactNode;
  className?: string;
};

export function HealthcareHexagonBackground({
  children,
  className,
}: HealthcareHexagonBackgroundProps) {
  return (
    <HexagonBackground
      hexagonSize={60}
      hexagonMargin={2}
      className={cn(
        "bg-background",
        className
      )}
      hexagonProps={{
        className: cn(
          // Custom healthcare-themed hexagon styling
          "before:bg-background/80 dark:before:bg-background/80",
          "after:bg-background/60 dark:after:bg-background/60",
          "hover:before:bg-primary/10 dark:hover:before:bg-primary/10",
          "hover:after:bg-primary/5 dark:hover:after:bg-primary/5",
          "transition-all duration-300 ease-in-out"
        )
      }}
    >
      {children}
    </HexagonBackground>
  );
}
