"use client";

import { getInsuranceLogo, getInsuranceLogoFallback } from "@/lib/insurance-logos";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface InsuranceLogoProps {
  providerId: string;
  providerName: string;
  className?: string;
  size?: number;
  preferAPI?: boolean;
  priority?: boolean;
}

export function InsuranceLogo({
  providerId,
  providerName,
  className,
  size = 64,
  preferAPI = false,
  priority = false,
}: InsuranceLogoProps) {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Get primary logo URL
  const primaryLogo = getInsuranceLogo(providerId, preferAPI);
  const fallbackLogo = getInsuranceLogoFallback(providerId);
  
  // Determine which logo to use based on error state and retry count
  const logoSrc = hasError && retryCount === 0 ? fallbackLogo : primaryLogo;
  
  const handleError = () => {
    if (retryCount === 0) {
      setHasError(true);
      setRetryCount(1);
    } else {
      // Ultimate fallback - show initials
      setHasError(true);
    }
  };
  
  const handleLoad = () => {
    setHasError(false);
  };
  
  // If both primary and fallback failed, show initials
  if (hasError && retryCount >= 1) {
    const initials = providerName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return (
      <div 
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted text-muted-foreground font-semibold",
          className
        )}
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: size * 0.3 }}>{initials}</span>
      </div>
    );
  }
  
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-muted", className)}>
      <Image
        src={logoSrc}
        alt={`${providerName} logo`}
        width={size}
        height={size}
        className="object-contain p-1"
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        unoptimized={logoSrc.includes('clearbit.com')} // External API logos
      />
    </div>
  );
}