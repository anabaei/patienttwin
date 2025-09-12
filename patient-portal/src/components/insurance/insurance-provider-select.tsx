"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useInsuranceStore } from "@twinn/store";
import { Check, Shield } from "lucide-react";

interface InsuranceProviderSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function InsuranceProviderSelect({ value, onValueChange }: InsuranceProviderSelectProps) {
  const { providers } = useInsuranceStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {providers.map((provider) => (
        <Card
          key={provider.id}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md",
            value === provider.id
              ? "ring-2 ring-primary bg-primary/5 border-primary"
              : "hover:border-primary/50"
          )}
          onClick={() => onValueChange(provider.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {provider.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {provider.plans.length} plan{provider.plans.length !== 1 ? 's' : ''} available
                </p>
              </div>
              {value === provider.id && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
