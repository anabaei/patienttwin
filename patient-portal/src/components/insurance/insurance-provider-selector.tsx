"use client";

import { Card, CardContent } from "@/components/ui/card";
import { InsuranceLogo } from "@/components/ui/insurance-logo";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import * as React from "react";

export interface InsuranceProvider {
  id: string;
  name: string;
  image?: string;
  description?: string;
  category?: string;
  isPopular?: boolean;
}

interface InsuranceProviderSelectorProps {
  providers: InsuranceProvider[];
  selectedProviderId?: string;
  onProviderSelect: (provider: InsuranceProvider) => void;
  className?: string;
  gridCols?: "1" | "2" | "3";
  showCategories?: boolean;
}

const InsuranceProviderSelector = React.forwardRef<
  HTMLDivElement,
  InsuranceProviderSelectorProps
>(({
  providers,
  selectedProviderId,
  onProviderSelect,
  className,
  gridCols = "2",
  showCategories = false,
  ...props
}, ref) => {
  const gridClass = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  }[gridCols];

  const groupedProviders = React.useMemo(() => {
    if (!showCategories) return { all: providers };
    
    return providers.reduce((acc, provider) => {
      const category = provider.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(provider);
      return acc;
    }, {} as Record<string, InsuranceProvider[]>);
  }, [providers, showCategories]);

  const renderProvider = (provider: InsuranceProvider) => {
    const isSelected = selectedProviderId === provider.id;
    
    return (
      <Card
        key={provider.id}
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          {
            "ring-2 ring-primary bg-primary/5 shadow-md": isSelected,
            "hover:border-primary/50": !isSelected,
          }
        )}
        onClick={() => onProviderSelect(provider)}
      >
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {provider.image && (
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={provider.image}
                  alt={`${provider.name} logo`}
                  fill
                  className="object-contain p-2"
                  sizes="64px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-card-foreground">
                    {provider.name}
                    {provider.isPopular && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        Popular
                      </span>
                    )}
                  </h3>
                  {provider.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {provider.description}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div ref={ref} className={cn("space-y-6", className)} {...props}>
      {showCategories ? (
        Object.entries(groupedProviders).map(([category, categoryProviders]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{category}</h3>
            <div className={cn("grid gap-4", gridClass)}>
              {categoryProviders.map(renderProvider)}
            </div>
          </div>
        ))
      ) : (
        <div className={cn("grid gap-4", gridClass)}>
          {providers.map(renderProvider)}
        </div>
      )}
      
      {providers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No insurance providers available</p>
        </div>
      )}
    </div>
  );
});

InsuranceProviderSelector.displayName = "InsuranceProviderSelector";

export { InsuranceProviderSelector };