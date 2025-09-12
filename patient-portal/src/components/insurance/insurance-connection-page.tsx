"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInsuranceStore } from "@twinn/store";
import { AlertCircle, CheckCircle, CreditCard, Shield } from "lucide-react";
import { useState } from "react";
import { BenefitsSummaryCard } from "./benefits-summary-card";
import { InsuranceConnectForm } from "./insurance-connect-form";
import { InsurancePlanSelect } from "./insurance-plan-select";
import { InsuranceProviderSelect } from "./insurance-provider-select";

export function InsuranceConnectionPage() {
  const { connectedPlan, providers, plans } = useInsuranceStore();
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  const selectedProvider = providers.find(p => p.id === selectedProviderId);
  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Insurance Coverage</h1>
          <p className="text-muted-foreground">
            Connect your insurance to see coverage and book appointments with in-network providers
          </p>
        </div>

        {/* Current Status */}
        {connectedPlan ? (
          <Card className="border-success bg-success/5">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <CardTitle className="text-success">
                  Insurance Connected
                </CardTitle>
              </div>
              <CardDescription className="text-success/80">
                Your insurance is connected and ready for booking appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BenefitsSummaryCard />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-warning bg-warning/5">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                <CardTitle className="text-warning">
                  No Insurance Connected
                </CardTitle>
              </div>
              <CardDescription className="text-warning/80">
                Connect your insurance to see coverage and book appointments with in-network providers
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Connection Flow */}
        {!connectedPlan && (
          <div className="space-y-6">
            {/* Step 1: Provider Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Step 1: Select Your Insurance Provider</CardTitle>
                </div>
                <CardDescription>
                  Choose your insurance company from the list below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InsuranceProviderSelect
                  value={selectedProviderId}
                  onValueChange={setSelectedProviderId}
                />
              </CardContent>
            </Card>

            {/* Step 2: Plan Selection */}
            {selectedProviderId && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <CardTitle>Step 2: Select Your Plan</CardTitle>
                  </div>
                  <CardDescription>
                    Choose your specific plan from {selectedProvider?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InsurancePlanSelect
                    providerId={selectedProviderId}
                    value={selectedPlanId}
                    onValueChange={setSelectedPlanId}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 3: Connection Form */}
            {selectedPlanId && (
              <Card>
                <CardHeader>
                  <CardTitle>Step 3: Connect Your Plan</CardTitle>
                  <CardDescription>
                    Enter your plan details to connect your insurance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InsuranceConnectForm
                    providerId={selectedProviderId}
                    planId={selectedPlanId}
                    onSuccess={() => {
                      setSelectedProviderId("");
                      setSelectedPlanId("");
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Benefits Preview */}
        {selectedPlan && !connectedPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Coverage Preview</CardTitle>
              <CardDescription>
                Here's what your {selectedPlan.name} plan covers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BenefitsSummaryCard planId={selectedPlanId} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
