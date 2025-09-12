import type { Meta, StoryObj } from '@storybook/nextjs';
import { AlertCircle, CheckCircle, CreditCard, Shield } from 'lucide-react';
import { useState } from 'react';
import { BenefitsSummaryCard } from '../components/insurance/benefits-summary-card';
import { InsuranceConnectForm } from '../components/insurance/insurance-connect-form';
import { InsurancePlanSelect } from '../components/insurance/insurance-plan-select';
import { InsuranceProviderSelect } from '../components/insurance/insurance-provider-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const meta: Meta = {
  title: 'Insurance/Complete Flow',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete insurance connection flow showing all steps and states.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

// Complete Flow Story
export const CompleteFlow: StoryObj = {
  render: () => {
    const [selectedProviderId, setSelectedProviderId] = useState('');
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [connectedPlan, setConnectedPlan] = useState<{ providerId: string; planId: string } | null>(null);

    const selectedProvider = { id: 'provider-1', name: 'SunLife Financial' };
    const selectedPlan = { id: 'plan-1', name: 'Premium Health Plan' };

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
                        setConnectedPlan(() => ({ providerId: selectedProviderId, planId: selectedPlanId }));
                        setSelectedProviderId('');
                        setSelectedPlanId('');
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Benefits Preview */}
              {selectedPlanId && (
                <Card>
                  <CardHeader>
                    <CardTitle>Coverage Preview</CardTitle>
                    <CardDescription>
                      Here's what your {selectedPlan?.name} plan covers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BenefitsSummaryCard planId={selectedPlanId} />
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
};

// Mobile Flow
export const MobileFlow: StoryObj = {
  render: () => {
    const [selectedProviderId, setSelectedProviderId] = useState('');
    const [selectedPlanId, setSelectedPlanId] = useState('');

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Insurance Coverage</h1>
            <p className="text-sm text-muted-foreground">
              Connect your insurance to see coverage
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <InsuranceProviderSelect
                value={selectedProviderId}
                onValueChange={setSelectedProviderId}
              />
            </CardContent>
          </Card>

          {selectedProviderId && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Plan</CardTitle>
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

          {selectedPlanId && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Benefits Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <BenefitsSummaryCard planId={selectedPlanId} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Dark Mode Flow
export const DarkModeFlow: StoryObj = {
  render: () => {
    const [selectedProviderId, setSelectedProviderId] = useState('provider-1');
    const [selectedPlanId, setSelectedPlanId] = useState('plan-1');

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Insurance Coverage</h1>
            <p className="text-muted-foreground">
              Connect your insurance to see coverage and book appointments
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Provider Selected</CardTitle>
            </CardHeader>
            <CardContent>
              <InsuranceProviderSelect
                value={selectedProviderId}
                onValueChange={setSelectedProviderId}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plan Selected</CardTitle>
            </CardHeader>
            <CardContent>
              <InsurancePlanSelect
                providerId={selectedProviderId}
                value={selectedPlanId}
                onValueChange={setSelectedPlanId}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefits Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <BenefitsSummaryCard planId={selectedPlanId} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
