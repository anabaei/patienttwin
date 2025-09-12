"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInsuranceStore } from "@twinn/store";
import { Calendar, CheckCircle, DollarSign, Percent, Shield } from "lucide-react";

interface BenefitsSummaryCardProps {
  planId?: string;
}

export function BenefitsSummaryCard({ planId }: BenefitsSummaryCardProps) {
  const { connectedPlan, providers, plans, getBenefitsForServiceOption } = useInsuranceStore();
  
  // Get the current plan (either connected or preview)
  const currentPlan = planId 
    ? plans.find(p => p.id === planId)
    : connectedPlan 
      ? plans.find(p => p.id === connectedPlan.planId)
      : null;

  const provider = currentPlan 
    ? providers.find(p => p.id === currentPlan.providerId)
    : null;

  if (!currentPlan || !provider) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">No plan selected</p>
        </CardContent>
      </Card>
    );
  }

  // Get benefits for a sample service (dental cleaning)
  const sampleServiceId = "service-1"; // This would be a real service ID
  const benefits = getBenefitsForServiceOption(sampleServiceId);

  return (
    <div className="space-y-4">
      {/* Plan Info */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{currentPlan.name}</h3>
          <p className="text-sm text-muted-foreground">{provider.name}</p>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Deductible</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              ${currentPlan.deductible.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Annual deductible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Copay</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              ${currentPlan.copay}
            </p>
            <p className="text-xs text-muted-foreground">Per visit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Percent className="h-4 w-4" />
              <span>Coinsurance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {currentPlan.coinsurance}%
            </p>
            <p className="text-xs text-muted-foreground">After deductible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Annual Max</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              ${currentPlan.annualMax.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Maximum coverage</p>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Coverage Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network Type</span>
              <span className="text-sm font-medium">{currentPlan.networkType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plan Type</span>
              <span className="text-sm font-medium">{currentPlan.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">In-Network Coverage</span>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Covered</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Benefits Calculation */}
      {benefits && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Sample Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Service Cost</span>
                <span className="text-sm font-medium">${benefits.serviceCost}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Your Copay</span>
                <span className="text-sm font-medium">${benefits.copay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Insurance Pays</span>
                <span className="text-sm font-medium">${benefits.insurancePays}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm font-medium">You Pay</span>
                <span className="text-sm font-bold text-primary">${benefits.patientPays}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
