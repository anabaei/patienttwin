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
          // Subtle healthcare-themed hexagon styling
          "transition-all duration-300 ease-in-out"
        )
      }}
    >
      {children}
    </HexagonBackground>
  );
}
