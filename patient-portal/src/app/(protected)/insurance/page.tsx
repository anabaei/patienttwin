"use client";

import { RequireAuth } from "@/components/auth/require-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InsuranceLogo } from "@/components/ui/insurance-logo";
import { InsurancePageSkeleton } from "@/components/ui/skeletons";
import { useInsuranceStore } from "@twinn/store";
import { Check, Plus, Shield, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Mock connected insurances for display
const mockConnectedInsurances = [
  {
    id: "conn-1",
    provider: {
      id: "sunlife",
      name: "Sun Life",
      logoUrl: "https://1000logos.net/wp-content/uploads/2022/09/Sun-Life-Financial-Logo.png",
    },
    policyNumber: "SL-123456789",
    memberId: "MB-987654321",
    isPrimary: true,
    effectiveDate: "2024-01-01",
    expirationDate: "2024-12-31",
    status: "Active",
  },
  {
    id: "conn-2", 
    provider: {
      id: "greenshield",
      name: "Green Shield Canada",
      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTibcnhGTYEPgUGrwpWJoKl_WHeznPB4yYxgw&s",
    },
    policyNumber: "GS-456789123",
    memberId: "GM-123456789",
    isPrimary: false,
    effectiveDate: "2024-01-01",
    expirationDate: "2025-12-31",
    status: "Active",
  },
];

function InsuranceContent() {
  const { providers } = useInsuranceStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    
    return () => clearTimeout(timer);
  }, []);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-success/10 text-success";
      case "expired":
        return "bg-warning/10 text-warning";
      case "pending":
        return "bg-info/10 text-info";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  
  // Show loading state
  if (isLoading) {
    return <InsurancePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Insurance Coverage</h1>
              <p className="text-muted-foreground">Manage your insurance providers and coverage</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/insurance/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Insurance
            </Link>
          </Button>
        </div>
        
        {/* Connected Insurances */}
        {mockConnectedInsurances.length > 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Insurance Plans</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockConnectedInsurances.map((insurance) => (
                  <Card key={insurance.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <InsuranceLogo
                            providerId={insurance.provider.id}
                            providerName={insurance.provider.name}
                            size={40}
                          />
                          <div>
                            <CardTitle className="text-lg">{insurance.provider.name}</CardTitle>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(insurance.status)}`}>
                                {insurance.status}
                              </span>
                              {insurance.isPrimary && (
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                  <Star className="mr-1 h-3 w-3" />
                                  Primary
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Check className="h-5 w-5 text-success" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Policy:</span>
                          <p className="font-mono">{insurance.policyNumber}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Member ID:</span>
                          <p className="font-mono">{insurance.memberId}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Effective:</span>
                          <p>{formatDate(insurance.effectiveDate)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Expires:</span>
                          <p>{formatDate(insurance.expirationDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          View Coverage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Add Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Popular Insurance Providers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {providers.slice(0, 6).map((provider: any) => (
                <Card 
                  key={provider.id}
                  className="cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200 group"
                >
                  <CardContent className="p-4 text-center">
                    <div className="mx-auto mb-2">
                      <InsuranceLogo
                        providerId={provider.id}
                        providerName={provider.name}
                        size={64}
                        className="mx-auto"
                      />
                    </div>
                    <p className="text-xs font-medium text-center leading-tight group-hover:text-primary">
                      {provider.name}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Common questions about adding insurance coverage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">Where do I find my policy number?</h4>
                <p className="text-muted-foreground">
                  Your policy number is typically found on your insurance card or in your benefits booklet.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">What if my provider isn't listed?</h4>
                <p className="text-muted-foreground">
                  Contact our support team and we'll help you add your insurance provider.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Can I add multiple insurance plans?</h4>
                <p className="text-muted-foreground">
                  Yes, you can add multiple plans and designate one as your primary coverage.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Is my information secure?</h4>
                <p className="text-muted-foreground">
                  All insurance information is encrypted and stored securely according to healthcare privacy standards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function InsurancePage() {
  return (
    <RequireAuth>
      <InsuranceContent />
    </RequireAuth>
  );
}
