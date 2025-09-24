"use client";

import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useHealthcareBalancesStore } from "@twinn/store";
import { motion } from "framer-motion";
import {
    Activity,
    AlertCircle,
    Brain,
    Calendar,
    Clock,
    ExternalLink,
    Grid3X3,
    Info,
    Leaf,
    Sparkles,
    Stethoscope,
    TrendingUp,
    Waves
} from "lucide-react";
import { useRouter } from "next/navigation";

// Import the type from the store
import type { HealthcareBalance } from "@twinn/store";

const getIconComponent = (iconName: string) => {
  const iconMap = {
    Waves,
    Activity,
    Brain,
    Stethoscope,
    Sparkles,
    Leaf,
    Grid3X3
  };
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent ? <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" /> : null;
};

const getStatusBadge = (status: HealthcareBalance['status']) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
    case 'expiring':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Expiring Soon</Badge>;
    case 'expired':
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Expired</Badge>;
  }
};

const getDaysUntilExpiry = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

interface BalanceDetailsModalProps {
  balanceId: string;
  children: React.ReactNode;
}

export function BalanceDetailsModal({ balanceId, children }: BalanceDetailsModalProps) {
  const { getBalanceById, fetchBalances } = useHealthcareBalancesStore();
  useEffect(() => {
    void fetchBalances();
  }, [fetchBalances]);
  const balance = getBalanceById(balanceId);
  const router = useRouter();
  
  if (!balance) return null;

  const daysUntilExpiry = getDaysUntilExpiry(balance.expiryDate);

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="w-full h-[85vh] flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-background border border-border ${balance.color}`}>
              {getIconComponent(balance.iconName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {balance.name}
                {getStatusBadge(balance.status)}
              </div>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                {balance.description}
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6">
          {/* Service Balance Summary */}
          <div className="mb-3">
            <div className="flex items-center gap-6 text-sm">
              <span className="text-muted-foreground">Available: <span className="font-semibold text-foreground">${balance.amount.toFixed(2)}</span></span>
              <span className="text-muted-foreground">Max/Session: <span className="font-semibold text-foreground">${balance.coverage.maxPerSession}</span></span>
              <span className="text-muted-foreground">Annual Limit: <span className="font-semibold text-primary">${balance.coverage.maxPerYear}</span></span>
            </div>
          </div>

          <div className="space-y-6 pt-4">
   


          {/* Expiry and Renewal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Expiry Date</span>
                  </div>
                  <p className="text-lg font-semibold">{formatDate(balance.expiryDate)}</p>
                  {daysUntilExpiry > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {daysUntilExpiry} days remaining
                    </p>
                  )}
                  {daysUntilExpiry <= 0 && (
                    <p className="text-sm text-red-600 font-medium">
                      Balance has expired
                    </p>
                  )}
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Renewal Date</span>
                  </div>
                  <p className="text-lg font-semibold">{formatDate(balance.renewalDate)}</p>
                  <p className="text-sm text-muted-foreground">Next benefit cycle</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coverage Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Coverage Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Maximum per Session</p>
                    <p className="text-xl font-bold">${balance.coverage.maxPerSession}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Annual Maximum</p>
                    <p className="text-xl font-bold">${balance.coverage.maxPerYear}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Copay</p>
                    <p className="text-xl font-bold">
                      {balance.coverage.copay === 0 ? 'No Copay' : `$${balance.coverage.copay}`}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Covered Benefits</h4>
                  <ul className="space-y-1">
                    {balance.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {balance.usageHistory.map((usage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{usage.service}</p>
                      <p className="text-sm text-muted-foreground">{usage.provider}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(usage.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">${Math.abs(usage.amount).toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t bg-background p-6 pt-4">
          <Button 
            className="w-full"
            onClick={() => router.push('/clinics')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Find Providers
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
