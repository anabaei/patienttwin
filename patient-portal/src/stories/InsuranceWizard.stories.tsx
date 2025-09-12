import type { Meta, StoryObj } from '@storybook/react';
import { InsuranceCoverageForm, type InsuranceCoverageData } from '@/components/insurance/insurance-coverage-form';
import { InsurancePolicyForm, type InsurancePolicyData } from '@/components/insurance/insurance-policy-form';
import { InsuranceProviderSelector, type InsuranceProvider } from '@/components/insurance/insurance-provider-selector';
import { InsuranceReview, type InsuranceReviewData } from '@/components/insurance/insurance-review';
import { Wizard, type WizardStep } from '@/components/ui/wizard';
import { useState } from 'react';

const meta: Meta = {
  title: 'Insurance/Complete Insurance Wizard',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete insurance wizard flow combining all insurance components for adding a new insurance provider.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockProviders: InsuranceProvider[] = [
  {
    id: 'sunlife',
    name: 'Sun Life',
    image: 'https://1000logos.net/wp-content/uploads/2022/09/Sun-Life-Financial-Logo.png',
    description: 'Canadian life and health insurance',
    category: 'Major Insurance',
    isPopular: true,
  },
  {
    id: 'manulife',
    name: 'Manulife',
    image: 'https://cdn.worldvectorlogo.com/logos/manulife.svg',
    description: 'Canadian financial services',
    category: 'Major Insurance',
    isPopular: true,
  },
  {
    id: 'rbc',
    name: 'RBC Insurance',
    image: 'https://dt8n8gomznf9q.cloudfront.net/null0f9545d9-00fd-41a0-8158-bc9ae63fac06/RBCInsurance_1-1312x740-trim(0,85,1312,825)-crop_w(1312)-crop_h(740)-crop_x(0)-crop_y(85).png',
    description: 'Royal Bank of Canada insurance',
    category: 'Bank Insurance',
  },
  {
    id: 'greenshield',
    name: 'Green Shield Canada',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTibcnhGTYEPgUGrwpWJoKl_WHeznPB4yYxgw&s',
    description: 'Canadian health benefits provider',
    category: 'Health Benefits',
    isPopular: true,
  },
  {
    id: 'desjardins',
    name: 'Desjardins Insurance',
    image: 'https://www.desjardins.com/etc/designs/desjardins/style/images/desjardins-logo.svg',
    description: 'Quebec-based insurance provider',
    category: 'Regional Insurance',
  },
  {
    id: 'greatwest',
    name: 'Great-West Life',
    image: 'https://www.greatwestlife.com/content/dam/gwl/about-us/media-centre/logos/GWL_Lockup_RGB.png',
    description: 'Western Canadian insurance leader',
    category: 'Major Insurance',
  },
];

const InsuranceWizardFlow = ({ 
  startStep = 1,
  preFilledData = {},
  allowSkipSteps = false,
  showValidation = true 
}: {
  startStep?: number;
  preFilledData?: any;
  allowSkipSteps?: boolean;
  showValidation?: boolean;
}) => {
  const [currentStep, setCurrentStep] = useState(startStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider | null>(
    preFilledData.provider || null
  );
  const [policyData, setPolicyData] = useState<InsurancePolicyData>({
    policyNumber: '',
    groupNumber: '',
    memberId: '',
    subscriberName: '',
    subscriberDob: '',
    relationship: '',
    ...preFilledData.policy,
  });
  const [coverageData, setCoverageData] = useState<InsuranceCoverageData>({
    effectiveDate: '',
    expirationDate: '',
    copayAmount: '',
    deductible: '',
    outOfPocketMax: '',
    phoneNumber: '',
    address: '',
    notes: '',
    isPrimary: false,
    ...preFilledData.coverage,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateStep = (step: number): boolean => {
    if (!showValidation) return true;
    
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!selectedProvider) {
          newErrors.provider = 'Please select an insurance provider';
          setErrors(newErrors);
          return false;
        }
        break;
        
      case 2:
        if (!policyData.policyNumber.trim()) {
          newErrors.policyNumber = 'Policy number is required';
        }
        if (!policyData.memberId.trim()) {
          newErrors.memberId = 'Member ID is required';
        }
        if (!policyData.subscriberName.trim()) {
          newErrors.subscriberName = 'Subscriber name is required';
        }
        if (!policyData.subscriberDob) {
          newErrors.subscriberDob = 'Date of birth is required';
        }
        if (!policyData.relationship) {
          newErrors.relationship = 'Relationship is required';
        }
        break;
        
      case 3:
        if (!coverageData.effectiveDate) {
          newErrors.effectiveDate = 'Effective date is required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleStepChange = (step: number) => {
    if (step > currentStep && !allowSkipSteps) {
      if (!validateStep(currentStep)) {
        return;
      }
    }
    setCurrentStep(step);
    setErrors({});
  };
  
  const handleSubmit = async () => {
    if (showValidation && !validateStep(currentStep)) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`Insurance added successfully!\n\nProvider: ${selectedProvider?.name}\nPolicy: ${policyData.policyNumber}\nMember: ${policyData.memberId}`);
    
    setIsSubmitting(false);
  };
  
  const reviewData: InsuranceReviewData = {
    provider: selectedProvider!,
    ...policyData,
    ...coverageData,
  };
  
  const steps: WizardStep[] = [
    {
      id: 'provider',
      title: 'Select Provider',
      description: 'Choose your insurance provider',
      content: (
        <InsuranceProviderSelector
          providers={mockProviders}
          selectedProviderId={selectedProvider?.id}
          onProviderSelect={setSelectedProvider}
          gridCols="3"
          showCategories={false}
        />
      ),
      isValid: !!selectedProvider,
    },
    {
      id: 'policy',
      title: 'Policy Information',
      description: 'Enter your policy and member details',
      content: (
        <InsurancePolicyForm
          data={policyData}
          onChange={(data) => setPolicyData(prev => ({ ...prev, ...data }))}
          errors={errors}
        />
      ),
      isValid: showValidation ? validateStep(2) : true,
    },
    {
      id: 'coverage',
      title: 'Coverage Details',
      description: 'Add coverage information and benefits',
      content: (
        <InsuranceCoverageForm
          data={coverageData}
          onChange={(data) => setCoverageData(prev => ({ ...prev, ...data }))}
          errors={errors}
        />
      ),
      isValid: showValidation ? validateStep(3) : true,
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your information before submitting',
      content: selectedProvider ? (
        <InsuranceReview data={reviewData} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Please complete the previous steps first
        </div>
      ),
      isValid: true,
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add Insurance Provider</h1>
          <p className="text-muted-foreground">
            Add your insurance information for seamless healthcare booking
          </p>
        </div>
        
        <Wizard
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onComplete={handleSubmit}
          onCancel={() => alert('Cancelled')}
          isSubmitting={isSubmitting}
          submitButtonText="Add Insurance"
          allowSkipSteps={allowSkipSteps}
        />
        
        {errors.provider && (
          <p className="text-sm text-destructive mt-2 text-center">{errors.provider}</p>
        )}
      </div>
    </div>
  );
};

export const CompleteFlow: Story = {
  render: () => <InsuranceWizardFlow />,
};

export const PreFilledData: Story = {
  render: () => (
    <InsuranceWizardFlow
      preFilledData={{
        provider: mockProviders[0], // Sun Life
        policy: {
          policyNumber: 'SL-123456789',
          groupNumber: 'GRP-001',
          memberId: 'MB-987654321',
          subscriberName: 'John Doe',
          subscriberDob: '1985-06-15',
          relationship: 'self',
        },
        coverage: {
          effectiveDate: '2024-01-01',
          expirationDate: '2024-12-31',
          copayAmount: '25',
          deductible: '500',
          outOfPocketMax: '2000',
          phoneNumber: '1-800-555-0199',
          isPrimary: true,
        },
      }}
    />
  ),
};

export const StartAtReviewStep: Story = {
  render: () => (
    <InsuranceWizardFlow
      startStep={4}
      preFilledData={{
        provider: mockProviders[1], // Manulife
        policy: {
          policyNumber: 'ML-789123456',
          memberId: 'ML-456789123',
          subscriberName: 'Jane Smith',
          subscriberDob: '1990-03-22',
          relationship: 'self',
        },
        coverage: {
          effectiveDate: '2024-01-01',
          expirationDate: '2025-01-01',
          copayAmount: '20',
          deductible: '300',
          outOfPocketMax: '1500',
          phoneNumber: '1-800-555-0150',
          isPrimary: false,
        },
      }}
    />
  ),
};

export const WithValidationDisabled: Story = {
  render: () => (
    <InsuranceWizardFlow
      allowSkipSteps={true}
      showValidation={false}
    />
  ),
};

export const ValidationDemo: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
        <p className="text-info text-sm">
          <strong>Try this:</strong> Click "Next" on any step without filling required fields to see validation in action.
        </p>
      </div>
      <InsuranceWizardFlow showValidation={true} />
    </div>
  ),
};