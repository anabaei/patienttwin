"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CreditCard, Shield, User } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import type { InsuranceCoverageData } from "./insurance-coverage-form";
import type { InsurancePolicyData } from "./insurance-policy-form";
import type { InsuranceProvider } from "./insurance-provider-selector";

interface InsuranceReviewData extends InsurancePolicyData, InsuranceCoverageData {
  provider: InsuranceProvider;
}

interface InsuranceReviewProps {
  data: InsuranceReviewData;
  className?: string;
}

const InsuranceReview = React.forwardRef<HTMLDivElement, InsuranceReviewProps>(
  ({ data, className, ...props }, ref) => {
    const formatCurrency = (amount: string) => {
      if (!amount) return "Not specified";
      const num = parseFloat(amount);
      return isNaN(num) ? amount : `$${num.toFixed(2)}`;
    };

    const formatDate = (date: string) => {
      if (!date) return "Not specified";
      return new Date(date).toLocaleDateString();
    };

    const relationshipLabels = {
      self: "Self",
      spouse: "Spouse", 
      child: "Child",
      parent: "Parent",
      other: "Other"
    };

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        {/* Insurance Provider */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Insurance Provider</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              {data.provider.image && (
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={data.provider.image}
                    alt={`${data.provider.name} logo`}
                    fill
                    className="object-contain p-1"
                    sizes="48px"
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{data.provider.name}</h3>
                {data.provider.description && (
                  <p className="text-sm text-muted-foreground">{data.provider.description}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Member Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Policy Number:</span>
                  <span className="text-foreground">{data.policyNumber || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Group Number:</span>
                  <span className="text-foreground">{data.groupNumber || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Member ID:</span>
                  <span className="text-foreground">{data.memberId || "Not provided"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Subscriber:</span>
                  <span className="text-foreground">{data.subscriberName || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Subscriber DOB:</span>
                  <span className="text-foreground">{formatDate(data.subscriberDob)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Relationship:</span>
                  <span className="text-foreground">
                    {relationshipLabels[data.relationship as keyof typeof relationshipLabels] || "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coverage Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>Coverage Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Effective Date:</span>
                  <span className="text-foreground">{formatDate(data.effectiveDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Expiration Date:</span>
                  <span className="text-foreground">{formatDate(data.expirationDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Primary Insurance:</span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    data.isPrimary 
                      ? "bg-success/10 text-success" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {data.isPrimary ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Copay:</span>
                  <span className="text-foreground">{formatCurrency(data.copayAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Deductible:</span>
                  <span className="text-foreground">{formatCurrency(data.deductible)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Out of Pocket Max:</span>
                  <span className="text-foreground">{formatCurrency(data.outOfPocketMax)}</span>
                </div>
              </div>
            </div>

            {data.phoneNumber && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-muted-foreground">Phone Number:</span>
                  <span className="text-foreground">{data.phoneNumber}</span>
                </div>
              </div>
            )}

            {data.address && (
              <div className="mt-2">
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Address:</span>
                  <p className="mt-1 text-foreground">{data.address}</p>
                </div>
              </div>
            )}

            {data.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Additional Notes:</span>
                  <p className="mt-1 text-foreground">{data.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
);

InsuranceReview.displayName = "InsuranceReview";

export { InsuranceReview };
export type { InsuranceReviewData };