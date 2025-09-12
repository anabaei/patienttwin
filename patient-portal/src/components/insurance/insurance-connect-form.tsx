"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useInsuranceStore } from "@twinn/store";
import { Calendar, CreditCard, FileText } from "lucide-react";
import { useState } from "react";

interface InsuranceConnectFormProps {
  providerId: string;
  planId: string;
  onSuccess: () => void;
}

export function InsuranceConnectForm({ providerId, planId, onSuccess }: InsuranceConnectFormProps) {
  const { connectInsurance } = useInsuranceStore();
  const [memberId, setMemberId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await connectInsurance({
        providerId,
        planId,
        memberId,
        dob: dateOfBirth,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect insurance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Member ID" htmlFor="memberId" required>
          <InputWithIcon
            id="memberId"
            type="text"
            placeholder="Enter your member ID"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            icon={CreditCard}
            required
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Date of Birth" htmlFor="dateOfBirth" required>
          <InputWithIcon
            id="dateOfBirth"
            type="date"
            placeholder="MM/DD/YYYY"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            icon={Calendar}
            required
            disabled={isLoading}
          />
        </FormField>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg border border-dashed">
        <div className="flex items-start space-x-3">
          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Information Security</p>
            <p>
              Your insurance information is encrypted and secure. We only use this information 
              to verify your coverage and calculate benefits for appointments.
            </p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        disabled={isLoading || !memberId || !dateOfBirth}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Connecting Insurance...
          </>
        ) : (
          "Connect Insurance"
        )}
      </Button>
    </form>
  );
}
