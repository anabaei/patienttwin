import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wizard, type WizardStep } from '@/components/ui/wizard';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof Wizard> = {
  title: 'UI/Wizard',
  component: Wizard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible wizard component for multi-step forms with proper theming and validation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 1, max: 4 },
      description: 'Current active step',
    },
    showStepNumbers: {
      control: { type: 'boolean' },
      description: 'Show step numbers in progress indicators',
    },
    allowSkipSteps: {
      control: { type: 'boolean' },
      description: 'Allow clicking on completed steps to navigate',
    },
    isSubmitting: {
      control: { type: 'boolean' },
      description: 'Show loading state on final step',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample wizard content
const SampleWizardContent = ({ 
  currentStep, 
  onStepChange, 
  onComplete, 
  isSubmitting = false,
  allowSkipSteps = false,
  showStepNumbers = true 
}: {
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
  isSubmitting?: boolean;
  allowSkipSteps?: boolean;
  showStepNumbers?: boolean;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const steps: WizardStep[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Enter your basic information',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>
        </div>
      ),
      isValid: formData.name.length > 0 && formData.email.length > 0,
    },
    {
      id: 'company',
      title: 'Company Details',
      description: 'Tell us about your organization',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Enter your company name"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            This step is optional but helps us provide better service.
          </p>
        </div>
      ),
      isOptional: true,
      isValid: true,
    },
    {
      id: 'message',
      title: 'Additional Information',
      description: 'Any additional details you would like to share',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter any additional information..."
              rows={4}
            />
          </div>
        </div>
      ),
      isValid: true,
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Please review your information',
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-2">
            <div>
              <span className="font-medium">Name:</span> {formData.name || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Email:</span> {formData.email || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Company:</span> {formData.company || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Message:</span> {formData.message || 'Not provided'}
            </div>
          </div>
        </div>
      ),
      isValid: true,
    },
  ];

  return (
    <Wizard
      steps={steps}
      currentStep={currentStep}
      onStepChange={onStepChange}
      onComplete={onComplete}
      isSubmitting={isSubmitting}
      submitButtonText="Submit Form"
      showStepNumbers={showStepNumbers}
      allowSkipSteps={allowSkipSteps}
    />
  );
};

export const Default: Story = {
  render: (args) => {
    const [currentStep, setCurrentStep] = useState(1);
    
    return (
      <SampleWizardContent
        {...args}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={() => alert('Form submitted!')}
      />
    );
  },
};

export const WithSubmitting: Story = {
  render: (args) => {
    const [currentStep, setCurrentStep] = useState(4);
    
    return (
      <SampleWizardContent
        {...args}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={() => alert('Form submitted!')}
        isSubmitting={true}
      />
    );
  },
};

export const WithSkipSteps: Story = {
  render: (args) => {
    const [currentStep, setCurrentStep] = useState(2);
    
    return (
      <SampleWizardContent
        {...args}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={() => alert('Form submitted!')}
        allowSkipSteps={true}
      />
    );
  },
};

export const WithoutStepNumbers: Story = {
  render: (args) => {
    const [currentStep, setCurrentStep] = useState(1);
    
    return (
      <SampleWizardContent
        {...args}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={() => alert('Form submitted!')}
        showStepNumbers={false}
      />
    );
  },
};