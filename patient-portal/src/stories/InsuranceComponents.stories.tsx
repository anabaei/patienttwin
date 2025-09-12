import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { BenefitsSummaryCard } from '../components/insurance/benefits-summary-card';
import { InsuranceConnectForm } from '../components/insurance/insurance-connect-form';
import { InsurancePlanSelect } from '../components/insurance/insurance-plan-select';
import { InsuranceProviderSelect } from '../components/insurance/insurance-provider-select';

const meta: Meta = {
  title: 'Insurance/Components',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Insurance-related components for connecting and managing insurance coverage.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

// Provider Select Stories
export const ProviderSelect: StoryObj = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-96">
        <InsuranceProviderSelect value={value} onValueChange={setValue} />
      </div>
    );
  },
};

export const ProviderSelectWithSelection: StoryObj = {
  render: () => {
    const [value, setValue] = useState('provider-1');
    return (
      <div className="w-96">
        <InsuranceProviderSelect value={value} onValueChange={setValue} />
      </div>
    );
  },
};

// Plan Select Stories
export const PlanSelect: StoryObj = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-96">
        <InsurancePlanSelect 
          providerId="provider-1" 
          value={value} 
          onValueChange={setValue} 
        />
      </div>
    );
  },
};

export const PlanSelectWithSelection: StoryObj = {
  render: () => {
    const [value, setValue] = useState('plan-1');
    return (
      <div className="w-96">
        <InsurancePlanSelect 
          providerId="provider-1" 
          value={value} 
          onValueChange={setValue} 
        />
      </div>
    );
  },
};

// Benefits Summary Stories
export const BenefitsSummary: StoryObj = {
  render: () => (
    <div className="w-96">
      <BenefitsSummaryCard />
    </div>
  ),
};

export const BenefitsSummaryWithPlan: StoryObj = {
  render: () => (
    <div className="w-96">
      <BenefitsSummaryCard planId="plan-1" />
    </div>
  ),
};

// Connect Form Stories
export const ConnectForm: StoryObj = {
  render: () => (
    <div className="w-96">
      <InsuranceConnectForm 
        providerId="provider-1"
        planId="plan-1"
        onSuccess={() => console.log('Success!')}
      />
    </div>
  ),
};

// Mobile Views
export const ProviderSelectMobile: StoryObj = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <InsuranceProviderSelect value={value} onValueChange={setValue} />
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const BenefitsSummaryMobile: StoryObj = {
  render: () => (
    <div className="w-80">
      <BenefitsSummaryCard planId="plan-1" />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Dark Mode
export const BenefitsSummaryDark: StoryObj = {
  render: () => (
    <div className="w-96">
      <BenefitsSummaryCard planId="plan-1" />
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
