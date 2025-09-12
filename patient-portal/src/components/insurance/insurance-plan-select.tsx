"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useInsuranceStore } from "@twinn/store";
import { Check, CreditCard, Star } from "lucide-react";

interface InsurancePlanSelectProps {
  providerId: string;
  value: string;
  onValueChange: (value: string) => void;
}

export function InsurancePlanSelect({ providerId, value, onValueChange }: InsurancePlanSelectProps) {
  const { plans } = useInsuranceStore();
  
  // Filter plans by provider
  const providerPlans = plans.filter(plan => plan.providerId === providerId);

  return (
    <div className="space-y-4">
      {providerPlans.map((plan) => (
        <Card
          key={plan.id}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md",
            value === plan.id
              ? "ring-2 ring-primary bg-primary/5 border-primary"
              : "hover:border-primary/50"
          )}
          onClick={() => onValueChange(plan.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-foreground">
                      {plan.name}
                    </h3>
                    {plan.isPopular && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-xs text-amber-600 font-medium">Popular</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.type} • {plan.networkType}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Deductible: </span>
                      <span className="font-medium">${plan.deductible.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Copay: </span>
                      <span className="font-medium">${plan.copay}</span>
                    </div>
                  </div>
                </div>
              </div>
              {value === plan.id && (
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
