import { InsurancePolicyForm, type InsurancePolicyData } from '@/components/insurance/insurance-policy-form';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof InsurancePolicyForm> = {
  title: 'Insurance/InsurancePolicyForm',
  component: InsurancePolicyForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A form component for collecting insurance policy information with validation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Current form data',
    },
    onChange: {
      description: 'Callback fired when form data changes',
    },
    errors: {
      description: 'Validation errors object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveWrapper = ({ 
  initialData = {
    policyNumber: '',
    groupNumber: '',
    memberId: '',
    subscriberName: '',
    subscriberDob: '',
    relationship: '',
  },
  errors = {}
}: { 
  initialData?: Partial<InsurancePolicyData>;
  errors?: Record<string, string>;
}) => {
  const [data, setData] = useState<InsurancePolicyData>({
    policyNumber: '',
    groupNumber: '',
    memberId: '',
    subscriberName: '',
    subscriberDob: '',
    relationship: '',
    ...initialData,
  });

  const handleChange = (changes: Partial<InsurancePolicyData>) => {
    setData(prev => ({ ...prev, ...changes }));
  };

  return (
    <div className="max-w-2xl">
      <InsurancePolicyForm
        data={data}
        onChange={handleChange}
        errors={errors}
      />
      
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Current Form Data:</h4>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <InteractiveWrapper />,
};

export const WithInitialData: Story = {
  render: () => (
    <InteractiveWrapper 
      initialData={{
        policyNumber: 'SL-123456789',
        groupNumber: 'GRP-001',
        memberId: 'MB-987654321',
        subscriberName: 'John Doe',
        subscriberDob: '1985-06-15',
        relationship: 'self',
      }}
    />
  ),
};

export const WithErrors: Story = {
  render: () => (
    <InteractiveWrapper 
      errors={{
        policyNumber: 'Policy number is required',
        memberId: 'Member ID is required',
        subscriberName: 'Subscriber name is required',
        subscriberDob: 'Date of birth is required',
        relationship: 'Relationship is required',
      }}
    />
  ),
};

export const PartiallyFilled: Story = {
  render: () => (
    <InteractiveWrapper 
      initialData={{
        policyNumber: 'SL-123456789',
        subscriberName: 'Jane Smith',
        relationship: 'spouse',
      }}
      errors={{
        memberId: 'Member ID is required',
        subscriberDob: 'Date of birth is required',
      }}
    />
  ),
};

export const AllRelationshipOptions: Story = {
  render: () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        This shows all available relationship options in the dropdown.
      </p>
      <InteractiveWrapper 
        initialData={{
          policyNumber: 'SL-123456789',
          memberId: 'MB-987654321',
          subscriberName: 'John Doe',
          subscriberDob: '1985-06-15',
        }}
      />
    </div>
  ),
};