"use client";

import { Badge } from "@/components/ui/badge";
import { BalanceDetailsModal } from "@/components/ui/balance-details-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { motion } from "framer-motion";
import {
    Activity,
    AlertCircle,
    Brain,
    Calendar,
    DollarSign,
    Leaf,
    Sparkles,
    Stethoscope,
    TrendingUp,
    Waves
} from "lucide-react";

interface HealthcareBalance {
  id: string;
  type: 'massage' | 'chiro' | 'mental-health' | 'physical-therapy' | 'acupuncture' | 'nutrition';
  name: string;
  amount: number;
  expiryDate: string;
  renewalDate: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status: 'active' | 'expiring' | 'expired';
}

const mockHealthcareBalances: HealthcareBalance[] = [
  {
    id: '1',
    type: 'massage',
    name: 'Massage Therapy',
    amount: 450.00,
    expiryDate: '2024-12-31',
    renewalDate: '2025-01-01',
    description: 'Therapeutic massage sessions for stress relief and muscle recovery',
    icon: <Waves className="h-4 w-4" />,
    color: 'text-pink-600',
    status: 'active'
  },
  {
    id: '2',
    type: 'chiro',
    name: 'Chiropractic Care',
    amount: 320.00,
    expiryDate: '2024-11-15',
    renewalDate: '2024-11-16',
    description: 'Spinal adjustments and musculoskeletal treatment',
    icon: <Activity className="h-4 w-4" />,
    color: 'text-blue-600',
    status: 'expiring'
  },
  {
    id: '3',
    type: 'mental-health',
    name: 'Mental Health',
    amount: 600.00,
    expiryDate: '2025-03-31',
    renewalDate: '2025-04-01',
    description: 'Counseling and therapy sessions for mental wellness',
    icon: <Brain className="h-4 w-4" />,
    color: 'text-purple-600',
    status: 'active'
  },
  {
    id: '4',
    type: 'physical-therapy',
    name: 'Physical Therapy',
    amount: 280.00,
    expiryDate: '2024-10-30',
    renewalDate: '2024-11-01',
    description: 'Rehabilitation services and recovery programs',
    icon: <Stethoscope className="h-4 w-4" />,
    color: 'text-green-600',
    status: 'active'
  },
  {
    id: '5',
    type: 'acupuncture',
    name: 'Acupuncture',
    amount: 180.00,
    expiryDate: '2024-09-20',
    renewalDate: '2024-09-21',
    description: 'Traditional Chinese medicine treatments',
    icon: <Sparkles className="h-4 w-4" />,
    color: 'text-orange-600',
    status: 'expiring'
  },
  {
    id: '6',
    type: 'nutrition',
    name: 'Nutrition Counseling',
    amount: 150.00,
    expiryDate: '2025-02-28',
    renewalDate: '2025-03-01',
    description: 'Dietary guidance and meal planning',
    icon: <Leaf className="h-4 w-4" />,
    color: 'text-teal-600',
    status: 'active'
  }
];

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
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2);
  return `${month} ${day}, ${year}`;
};

export function HealthcareBalanceCarousel() {
  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {mockHealthcareBalances.map((balance, index) => {
            const daysUntilExpiry = getDaysUntilExpiry(balance.expiryDate);
            
            return (
              <CarouselItem key={balance.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg bg-muted ${balance.color}`}>
                            {balance.icon}
                          </div>
                          <div>
                            <CardTitle className="text-sm font-semibold">{balance.name}</CardTitle>
                            <p className="text-xs text-muted-foreground line-clamp-2">{balance.description}</p>
                          </div>
                        </div>
                        {getStatusBadge(balance.status)}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3 pt-0">
                      {/* Balance Amount */}
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-2xl font-bold text-primary">
                            ${balance.amount.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Available Balance</p>
                      </div>

                      {/* Expiry Information */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-medium">Expires</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold">{formatDate(balance.expiryDate)}</p>
                            {daysUntilExpiry > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {daysUntilExpiry} days left
                              </p>
                            )}
                            {daysUntilExpiry <= 0 && (
                              <p className="text-xs text-red-600 font-medium">
                                Expired
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-medium">Renews</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold">{formatDate(balance.renewalDate)}</p>
                            <p className="text-xs text-muted-foreground">Next cycle</p>
                          </div>
                        </div>
                      </div>

                      {/* Warning for expiring balance */}
                      {balance.status === 'expiring' && daysUntilExpiry <= 30 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                        >
                          <AlertCircle className="h-3 w-3 text-yellow-600" />
                          <p className="text-xs text-yellow-800 dark:text-yellow-200">
                            Expires in {daysUntilExpiry} days
                          </p>
                        </motion.div>
                      )}

                      {/* View Details Button */}
                      <BalanceDetailsModal balanceId={balance.id}>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          View Details
                        </Button>
                      </BalanceDetailsModal>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
