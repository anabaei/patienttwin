"use client";

import { RequireAuth } from "@/components/auth/require-auth";
import { InsuranceCoverageForm, type InsuranceCoverageData } from "@/components/insurance/insurance-coverage-form";
import { InsurancePolicyForm, type InsurancePolicyData } from "@/components/insurance/insurance-policy-form";
import { InsuranceProviderSelector, type InsuranceProvider } from "@/components/insurance/insurance-provider-selector";
import { InsuranceReview, type InsuranceReviewData } from "@/components/insurance/insurance-review";
import { Button } from "@/components/ui/button";
import { Wizard, type WizardStep } from "@/components/ui/wizard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useInsuranceStore } from "@twinn/store";
import { ArrowLeft, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

// Transform store providers to match component interface
const transformProviders = (storeProviders: any[]): InsuranceProvider[] => {
  return storeProviders.map(provider => ({
    id: provider.id,
    name: provider.name,
    image: provider.logoUrl,
    description: getProviderDescription(provider.id),
    isPopular: getIsPopular(provider.id),
  }));
};

const getProviderDescription = (id: string): string => {
  const descriptions: Record<string, string> = {
    sunlife: "Canadian life and health insurance",
    manulife: "Canadian financial services",
    rbc: "Royal Bank of Canada insurance",
    greenshield: "Canadian health benefits provider",
    desjardins: "Quebec-based insurance provider",
    greatwest: "Western Canadian insurance leader",
    bluecross: "Provincial health insurance",
    chambers: "Small business insurance solutions",
  };
  return descriptions[id] || "Insurance provider";
};

const getIsPopular = (id: string): boolean => {
  return ["sunlife", "manulife", "greenshield"].includes(id);
};

function AddInsuranceContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { providers } = useInsuranceStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider | null>(null);
  const [policyData, setPolicyData] = useState<InsurancePolicyData>({
    policyNumber: "",
    groupNumber: "",
    memberId: "",
    subscriberName: "",
    subscriberDob: "",
    relationship: "",
  });
  const [coverageData, setCoverageData] = useState<InsuranceCoverageData>({
    effectiveDate: "",
    expirationDate: "",
    copayAmount: "",
    deductible: "",
    outOfPocketMax: "",
    phoneNumber: "",
    address: "",
    notes: "",
    isPrimary: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const transformedProviders = useMemo(() => transformProviders(providers), [providers]);
  
  const validateStep = useCallback((step: number): boolean => {
    switch (step) {
      case 1:
        return !!selectedProvider;
        
      case 2:
        return !!(
          policyData.policyNumber.trim() &&
          policyData.memberId.trim() &&
          policyData.subscriberName.trim() &&
          policyData.subscriberDob &&
          policyData.relationship
        );
        
      case 3:
        return !!coverageData.effectiveDate;
        
      default:
        return true;
    }
  }, [selectedProvider, policyData, coverageData]);

  const validateStepWithErrors = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!selectedProvider) {
          newErrors.provider = "Please select an insurance provider";
          return false;
        }
        break;
        
      case 2:
        if (!policyData.policyNumber.trim()) {
          newErrors.policyNumber = "Policy number is required";
        }
        if (!policyData.memberId.trim()) {
          newErrors.memberId = "Member ID is required";
        }
        if (!policyData.subscriberName.trim()) {
          newErrors.subscriberName = "Subscriber name is required";
        }
        if (!policyData.subscriberDob) {
          newErrors.subscriberDob = "Subscriber date of birth is required";
        }
        if (!policyData.relationship) {
          newErrors.relationship = "Relationship is required";
        }
        break;
        
      case 3:
        if (!coverageData.effectiveDate) {
          newErrors.effectiveDate = "Effective date is required";
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleStepChange = (step: number) => {
    if (step > currentStep) {
      // Validate current step before advancing
      if (!validateStepWithErrors(currentStep)) {
        return;
      }
    }
    setCurrentStep(step);
    setErrors({});
  };
  
  const handleSubmit = async () => {
    if (!validateStepWithErrors(currentStep)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Insurance Added Successfully!",
        description: "Your insurance information has been saved and verified.",
      });
      
      router.push("/insurance");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add insurance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const reviewData: InsuranceReviewData = useMemo(() => ({
    provider: selectedProvider!,
    ...policyData,
    ...coverageData,
  }), [selectedProvider, policyData, coverageData]);
  
  const steps: WizardStep[] = useMemo(() => [
    {
      id: "provider",
      title: "Select Provider",
      description: "Choose your insurance provider",
      content: (
        <InsuranceProviderSelector
          providers={transformedProviders}
          selectedProviderId={selectedProvider?.id}
          onProviderSelect={setSelectedProvider}
        />
      ),
      isValid: validateStep(1),
    },
    {
      id: "policy",
      title: "Policy Information",
      description: "Enter your policy and member details",
      content: (
        <InsurancePolicyForm
          data={policyData}
          onChange={(data) => setPolicyData(prev => ({ ...prev, ...data }))}
          errors={errors}
        />
      ),
      isValid: validateStep(2),
    },
    {
      id: "coverage",
      title: "Coverage Details",
      description: "Add coverage information and benefits",
      content: (
        <InsuranceCoverageForm
          data={coverageData}
          onChange={(data) => setCoverageData(prev => ({ ...prev, ...data }))}
          errors={errors}
        />
      ),
      isValid: validateStep(3),
    },
    {
      id: "review",
      title: "Review & Submit",
      description: "Review your information before submitting",
      content: selectedProvider ? (
        <InsuranceReview data={reviewData} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Please select a provider first
        </div>
      ),
      isValid: true,
    },
  ], [
    transformedProviders,
    selectedProvider,
    policyData,
    coverageData,
    errors,
    reviewData,
    validateStep,
  ]);
  
  return (
    <div className="bg-gradient-to-br from-background to-muted/30 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/insurance")}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Add Insurance Provider</h1>
              <p className="text-muted-foreground">Add your insurance information for seamless booking</p>
            </div>
          </div>
        </div>
        
        {/* Wizard */}
        <Wizard
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onComplete={handleSubmit}
          onCancel={() => router.push("/insurance")}
          isSubmitting={isSubmitting}
          submitButtonText="Add Insurance"
          className={cn(errors.provider && "ring-2 ring-destructive")}
        />
        
        {errors.provider && (
          <p className="text-sm text-destructive mt-2 text-center">{errors.provider}</p>
        )}
      </div>
    </div>
  );
}

export default function AddInsurancePage() {
  return (
    <RequireAuth>
      <AddInsuranceContent />
    </RequireAuth>
  );
}