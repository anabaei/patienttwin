"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface InsurancePolicyData {
  policyNumber: string;
  groupNumber: string;
  memberId: string;
  subscriberName: string;
  subscriberDob: string;
  relationship: string;
}

interface InsurancePolicyFormProps {
  data: InsurancePolicyData;
  onChange: (data: Partial<InsurancePolicyData>) => void;
  className?: string;
  errors?: Partial<Record<keyof InsurancePolicyData, string>>;
  disabled?: boolean;
}

const relationships = [
  { value: "self", label: "Self" },
  { value: "spouse", label: "Spouse" },
  { value: "child", label: "Child" },
  { value: "parent", label: "Parent" },
  { value: "other", label: "Other" },
];

const InsurancePolicyForm = React.forwardRef<HTMLDivElement, InsurancePolicyFormProps>(
  ({ data, onChange, className, errors, disabled = false, ...props }, ref) => {
    const handleInputChange = (field: keyof InsurancePolicyData, value: string) => {
      onChange({ [field]: value });
    };

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="policyNumber">
              Policy Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="policyNumber"
              value={data.policyNumber}
              onChange={(e) => handleInputChange("policyNumber", e.target.value)}
              placeholder="Enter policy number"
              disabled={disabled}
              className={cn(errors?.policyNumber && "border-destructive")}
            />
            {errors?.policyNumber && (
              <p className="text-sm text-destructive">{errors.policyNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupNumber">Group Number</Label>
            <Input
              id="groupNumber"
              value={data.groupNumber}
              onChange={(e) => handleInputChange("groupNumber", e.target.value)}
              placeholder="Enter group number"
              disabled={disabled}
              className={cn(errors?.groupNumber && "border-destructive")}
            />
            {errors?.groupNumber && (
              <p className="text-sm text-destructive">{errors.groupNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="memberId">
              Member ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="memberId"
              value={data.memberId}
              onChange={(e) => handleInputChange("memberId", e.target.value)}
              placeholder="Enter member ID"
              disabled={disabled}
              className={cn(errors?.memberId && "border-destructive")}
            />
            {errors?.memberId && (
              <p className="text-sm text-destructive">{errors.memberId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriberName">
              Subscriber Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subscriberName"
              value={data.subscriberName}
              onChange={(e) => handleInputChange("subscriberName", e.target.value)}
              placeholder="Enter subscriber name"
              disabled={disabled}
              className={cn(errors?.subscriberName && "border-destructive")}
            />
            {errors?.subscriberName && (
              <p className="text-sm text-destructive">{errors.subscriberName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriberDob">
              Subscriber Date of Birth <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subscriberDob"
              type="date"
              value={data.subscriberDob}
              onChange={(e) => handleInputChange("subscriberDob", e.target.value)}
              disabled={disabled}
              className={cn(errors?.subscriberDob && "border-destructive")}
            />
            {errors?.subscriberDob && (
              <p className="text-sm text-destructive">{errors.subscriberDob}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">
              Relationship to Subscriber <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.relationship}
              onValueChange={(value) => handleInputChange("relationship", value)}
              disabled={disabled}
            >
              <SelectTrigger className={cn(errors?.relationship && "border-destructive")}>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {relationships.map((rel) => (
                  <SelectItem key={rel.value} value={rel.value}>
                    {rel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.relationship && (
              <p className="text-sm text-destructive">{errors.relationship}</p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

InsurancePolicyForm.displayName = "InsurancePolicyForm";

export { InsurancePolicyForm };