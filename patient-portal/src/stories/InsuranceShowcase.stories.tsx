import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { BenefitsSummaryCard } from '../components/insurance/benefits-summary-card';
import { InsuranceConnectForm } from '../components/insurance/insurance-connect-form';
import { InsurancePlanSelect } from '../components/insurance/insurance-plan-select';
import { InsuranceProviderSelect } from '../components/insurance/insurance-provider-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const meta: Meta = {
  title: 'Insurance/Showcase',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Showcase of all insurance components with different configurations and states.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

// Provider Selection Showcase
export const ProviderSelection: StoryObj = {
  render: () => {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('provider-1');
    
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">No Selection</h3>
          <div className="w-96">
            <InsuranceProviderSelect value={value1} onValueChange={setValue1} />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">With Selection</h3>
          <div className="w-96">
            <InsuranceProviderSelect value={value2} onValueChange={setValue2} />
          </div>
        </div>
      </div>
    );
  },
};

// Plan Selection Showcase
export const PlanSelection: StoryObj = {
  render: () => {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('plan-1');
    
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">No Selection</h3>
          <div className="w-96">
            <InsurancePlanSelect 
              providerId="provider-1" 
              value={value1} 
              onValueChange={setValue1} 
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">With Selection</h3>
          <div className="w-96">
            <InsurancePlanSelect 
              providerId="provider-1" 
              value={value2} 
              onValueChange={setValue2} 
            />
          </div>
        </div>
      </div>
    );
  },
};

// Benefits Summary Showcase
export const BenefitsShowcase: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Connected Plan</h3>
        <div className="w-96">
          <BenefitsSummaryCard />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Plan Preview</h3>
        <div className="w-96">
          <BenefitsSummaryCard planId="plan-1" />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Different Plan</h3>
        <div className="w-96">
          <BenefitsSummaryCard planId="plan-2" />
        </div>
      </div>
    </div>
  ),
};

// Connect Form Showcase
export const ConnectFormShowcase: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Connection Form</h3>
        <div className="w-96">
          <InsuranceConnectForm 
            providerId="provider-1"
            planId="plan-1"
            onSuccess={() => console.log('Success!')}
          />
        </div>
      </div>
    </div>
  ),
};

// Complete Component Grid
export const ComponentGrid: StoryObj = {
  render: () => {
    const [providerValue, setProviderValue] = useState('provider-1');
    const [planValue, setPlanValue] = useState('plan-1');
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Provider</CardTitle>
              <CardDescription>Select your insurance provider</CardDescription>
            </CardHeader>
            <CardContent>
              <InsuranceProviderSelect 
                value={providerValue} 
                onValueChange={setProviderValue} 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Insurance Plan</CardTitle>
              <CardDescription>Choose your specific plan</CardDescription>
            </CardHeader>
            <CardContent>
              <InsurancePlanSelect 
                providerId={providerValue}
                value={planValue} 
                onValueChange={setPlanValue} 
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benefits Summary</CardTitle>
              <CardDescription>Your coverage details</CardDescription>
            </CardHeader>
            <CardContent>
              <BenefitsSummaryCard planId={planValue} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connect Insurance</CardTitle>
              <CardDescription>Enter your plan details</CardDescription>
            </CardHeader>
            <CardContent>
              <InsuranceConnectForm 
                providerId={providerValue}
                planId={planValue}
                onSuccess={() => console.log('Connected!')}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  },
};

// Mobile Showcase
export const MobileShowcase: StoryObj = {
  render: () => {
    const [providerValue, setProviderValue] = useState('provider-1');
    const [planValue, setPlanValue] = useState('plan-1');
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <InsuranceProviderSelect 
              value={providerValue} 
              onValueChange={setProviderValue} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <InsurancePlanSelect 
              providerId={providerValue}
              value={planValue} 
              onValueChange={setPlanValue} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <BenefitsSummaryCard planId={planValue} />
          </CardContent>
        </Card>
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
