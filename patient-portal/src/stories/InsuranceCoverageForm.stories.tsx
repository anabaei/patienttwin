import type { Meta, StoryObj } from '@storybook/react';
import { InsuranceCoverageForm, type InsuranceCoverageData } from '@/components/insurance/insurance-coverage-form';
import { useState } from 'react';

const meta: Meta<typeof InsuranceCoverageForm> = {
  title: 'Insurance/InsuranceCoverageForm',
  component: InsuranceCoverageForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A form component for collecting insurance coverage details including dates, costs, and contact information.',
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
    effectiveDate: '',
    expirationDate: '',
    copayAmount: '',
    deductible: '',
    outOfPocketMax: '',
    phoneNumber: '',
    address: '',
    notes: '',
    isPrimary: false,
  },
  errors = {}
}: { 
  initialData?: Partial<InsuranceCoverageData>;
  errors?: Record<string, string>;
}) => {
  const [data, setData] = useState<InsuranceCoverageData>({
    effectiveDate: '',
    expirationDate: '',
    copayAmount: '',
    deductible: '',
    outOfPocketMax: '',
    phoneNumber: '',
    address: '',
    notes: '',
    isPrimary: false,
    ...initialData,
  });

  const handleChange = (changes: Partial<InsuranceCoverageData>) => {
    setData(prev => ({ ...prev, ...changes }));
  };

  return (
    <div className="max-w-2xl">
      <InsuranceCoverageForm
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
        effectiveDate: '2024-01-01',
        expirationDate: '2024-12-31',
        copayAmount: '25',
        deductible: '500',
        outOfPocketMax: '2000',
        phoneNumber: '1-800-555-0199',
        address: '123 Insurance Way, Toronto, ON M5V 1A1',
        notes: 'Coverage includes dental and vision',
        isPrimary: true,
      }}
    />
  ),
};

export const WithErrors: Story = {
  render: () => (
    <InteractiveWrapper 
      errors={{
        effectiveDate: 'Effective date is required',
        phoneNumber: 'Please enter a valid phone number',
        copayAmount: 'Please enter a valid amount',
      }}
    />
  ),
};

export const PrimaryInsurance: Story = {
  render: () => (
    <InteractiveWrapper 
      initialData={{
        effectiveDate: '2024-01-01',
        expirationDate: '2025-01-01',
        copayAmount: '20',
        deductible: '300',
        outOfPocketMax: '1500',
        isPrimary: true,
      }}
    />
  ),
};

export const SecondaryInsurance: Story = {
  render: () => (
    <InteractiveWrapper 
      initialData={{
        effectiveDate: '2024-01-01',
        expirationDate: '2024-12-31',
        copayAmount: '0',
        deductible: '0',
        outOfPocketMax: '0',
        phoneNumber: '1-800-555-0123',
        notes: 'Secondary coverage - covers what primary doesn\'t',
        isPrimary: false,
      }}
    />
  ),
};

export const MinimalCoverage: Story = {
  render: () => (
    <InteractiveWrapper 
      initialData={{
        effectiveDate: '2024-01-01',
        phoneNumber: '1-800-555-0100',
        isPrimary: false,
      }}
    />
  ),
};

export const ComprehensiveCoverage: Story = {
  render: () => (
    <InteractiveWrapper 
      initialData={{
        effectiveDate: '2024-01-01',
        expirationDate: '2024-12-31',
        copayAmount: '15',
        deductible: '200',
        outOfPocketMax: '1000',
        phoneNumber: '1-800-555-0150',
        address: '456 Healthcare Blvd, Suite 100, Vancouver, BC V6B 1A1',
        notes: 'Premium plan with comprehensive coverage including specialist visits, prescription drugs, dental, and vision care. Low deductible and out-of-pocket maximum.',
        isPrimary: true,
      }}
    />
  ),
};