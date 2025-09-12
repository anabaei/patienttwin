"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  isValid?: boolean;
  isOptional?: boolean;
}

interface WizardProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  className?: string;
  showStepNumbers?: boolean;
  allowSkipSteps?: boolean;
}

const Wizard = React.forwardRef<HTMLDivElement, WizardProps>(
  ({
    steps,
    currentStep,
    onStepChange,
    onComplete,
    onCancel,
    isSubmitting = false,
    submitButtonText = "Complete",
    className,
    showStepNumbers = true,
    allowSkipSteps = false,
    ...props
  }, ref) => {
    const totalSteps = steps.length;
    const currentStepData = steps[currentStep - 1];
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    const handleNext = () => {
      if (currentStep < totalSteps) {
        onStepChange(currentStep + 1);
      } else {
        onComplete();
      }
    };

    const handlePrevious = () => {
      if (currentStep > 1) {
        onStepChange(currentStep - 1);
      }
    };

    const handleStepClick = (step: number) => {
      if (allowSkipSteps) {
        onStepChange(step);
      }
    };

    const getStepStatus = (stepIndex: number) => {
      const stepNumber = stepIndex + 1;
      if (stepNumber < currentStep) return "completed";
      if (stepNumber === currentStep) return "current";
      return "upcoming";
    };

    return (
      <div ref={ref} className={cn("space-y-8", className)} {...props}>
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const status = getStepStatus(index);
            const isClickable = allowSkipSteps && (status === "completed" || status === "current");

            return (
              <React.Fragment key={step.id}>
                <div 
                  className={cn(
                    "flex items-center",
                    isClickable && "cursor-pointer"
                  )}
                  onClick={() => isClickable && handleStepClick(stepNumber)}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                      {
                        "bg-success text-success-foreground": status === "completed",
                        "bg-primary text-primary-foreground": status === "current",
                        "bg-muted text-muted-foreground": status === "upcoming",
                      }
                    )}
                  >
                    {status === "completed" ? (
                      <Check className="h-4 w-4" />
                    ) : showStepNumbers ? (
                      stepNumber
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-current" />
                    )}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        {
                          "text-success": status === "completed",
                          "text-foreground": status === "current",
                          "text-muted-foreground": status === "upcoming",
                        }
                      )}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-12 transition-colors",
                      {
                        "bg-success": stepNumber < currentStep,
                        "bg-border": stepNumber >= currentStep,
                      }
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{currentStepData?.title}</span>
              <span className="text-sm font-normal text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
            </CardTitle>
            {currentStepData?.description && (
              <p className="text-muted-foreground">{currentStepData.description}</p>
            )}
          </CardHeader>
          <CardContent>
            {currentStepData?.content}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <div>
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {onCancel && (
              <Button
                variant="ghost"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={
                isSubmitting || 
                (!allowSkipSteps && currentStepData?.isValid === false)
              }
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                "Processing..."
              ) : isLastStep ? (
                <>
                  {submitButtonText}
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

Wizard.displayName = "Wizard";

export { Wizard };