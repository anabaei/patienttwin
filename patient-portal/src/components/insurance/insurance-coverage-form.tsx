"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface InsuranceCoverageData {
  effectiveDate: string;
  expirationDate: string;
  copayAmount: string;
  deductible: string;
  outOfPocketMax: string;
  phoneNumber: string;
  address: string;
  notes: string;
  isPrimary: boolean;
}

interface InsuranceCoverageFormProps {
  data: InsuranceCoverageData;
  onChange: (data: Partial<InsuranceCoverageData>) => void;
  className?: string;
  errors?: Partial<Record<keyof InsuranceCoverageData, string>>;
  disabled?: boolean;
}

const InsuranceCoverageForm = React.forwardRef<HTMLDivElement, InsuranceCoverageFormProps>(
  ({ data, onChange, className, errors, disabled = false, ...props }, ref) => {
    const handleInputChange = (field: keyof InsuranceCoverageData, value: string | boolean) => {
      onChange({ [field]: value });
    };

    const formatCurrency = (value: string) => {
      // Remove non-numeric characters except decimal point
      const numericValue = value.replace(/[^0-9.]/g, '');
      return numericValue;
    };

    const handleCurrencyChange = (field: keyof InsuranceCoverageData, value: string) => {
      const formattedValue = formatCurrency(value);
      handleInputChange(field, formattedValue);
    };

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="effectiveDate">
              Effective Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="effectiveDate"
              type="date"
              value={data.effectiveDate}
              onChange={(e) => handleInputChange("effectiveDate", e.target.value)}
              disabled={disabled}
              className={cn(errors?.effectiveDate && "border-destructive")}
            />
            {errors?.effectiveDate && (
              <p className="text-sm text-destructive">{errors.effectiveDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Input
              id="expirationDate"
              type="date"
              value={data.expirationDate}
              onChange={(e) => handleInputChange("expirationDate", e.target.value)}
              disabled={disabled}
              className={cn(errors?.expirationDate && "border-destructive")}
            />
            {errors?.expirationDate && (
              <p className="text-sm text-destructive">{errors.expirationDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="copayAmount">Copay Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="copayAmount"
                value={data.copayAmount}
                onChange={(e) => handleCurrencyChange("copayAmount", e.target.value)}
                placeholder="0.00"
                disabled={disabled}
                className={cn("pl-8", errors?.copayAmount && "border-destructive")}
              />
            </div>
            {errors?.copayAmount && (
              <p className="text-sm text-destructive">{errors.copayAmount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deductible">Deductible</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="deductible"
                value={data.deductible}
                onChange={(e) => handleCurrencyChange("deductible", e.target.value)}
                placeholder="0.00"
                disabled={disabled}
                className={cn("pl-8", errors?.deductible && "border-destructive")}
              />
            </div>
            {errors?.deductible && (
              <p className="text-sm text-destructive">{errors.deductible}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="outOfPocketMax">Out of Pocket Maximum</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="outOfPocketMax"
                value={data.outOfPocketMax}
                onChange={(e) => handleCurrencyChange("outOfPocketMax", e.target.value)}
                placeholder="0.00"
                disabled={disabled}
                className={cn("pl-8", errors?.outOfPocketMax && "border-destructive")}
              />
            </div>
            {errors?.outOfPocketMax && (
              <p className="text-sm text-destructive">{errors.outOfPocketMax}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Insurance Phone Number</Label>
            <Input
              id="phoneNumber"
              value={data.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder="(555) 123-4567"
              disabled={disabled}
              className={cn(errors?.phoneNumber && "border-destructive")}
            />
            {errors?.phoneNumber && (
              <p className="text-sm text-destructive">{errors.phoneNumber}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Insurance Company Address</Label>
          <Textarea
            id="address"
            value={data.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Enter insurance company address"
            disabled={disabled}
            rows={2}
            className={cn(errors?.address && "border-destructive")}
          />
          {errors?.address && (
            <p className="text-sm text-destructive">{errors.address}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            value={data.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Any additional information about your coverage"
            disabled={disabled}
            rows={3}
            className={cn(errors?.notes && "border-destructive")}
          />
          {errors?.notes && (
            <p className="text-sm text-destructive">{errors.notes}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPrimary"
            checked={data.isPrimary}
            onCheckedChange={(checked) => handleInputChange("isPrimary", checked as boolean)}
            disabled={disabled}
          />
          <Label 
            htmlFor="isPrimary"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            This is my primary insurance
          </Label>
        </div>
      </div>
    );
  }
);

InsuranceCoverageForm.displayName = "InsuranceCoverageForm";

export { InsuranceCoverageForm };