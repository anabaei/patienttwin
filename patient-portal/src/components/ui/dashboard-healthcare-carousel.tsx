"use client";

import { Badge } from "@/components/ui/badge";
import { BalanceDetailsModal } from "@/components/ui/balance-details-modal";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useHealthcareBalancesStore } from "@twinn/store";
import { motion } from "framer-motion";
import {
    Activity,
    Brain,
    CheckCircle,
    Clock,
    DollarSign,
    Grid3X3,
    Leaf,
    Sparkles,
    Stethoscope,
    Waves,
    XCircle
} from "lucide-react";

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
  return IconComponent ? <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" /> : null;
};

const getStatusBadge = (status: HealthcareBalance['status']) => {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 p-1.5 rounded-full">
          <CheckCircle className="h-3 w-3" />
        </Badge>
      );
    case 'expiring':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 p-1.5 rounded-full">
          <Clock className="h-3 w-3" />
        </Badge>
      );
    case 'expired':
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 p-1.5 rounded-full">
          <XCircle className="h-3 w-3" />
        </Badge>
      );
  }
};


export function DashboardHealthcareCarousel() {
  const { balances } = useHealthcareBalancesStore();
  
  
  // Filter to show only the main services for dashboard (massage-therapist, chiropractor, psychologist, other)
  const dashboardBalances = balances.filter(balance => 
    ['massage-therapist', 'chiropractor', 'psychologist', 'other'].includes(balance.type)
  );
  
  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {dashboardBalances.map((balance, index) => (
            <CarouselItem key={balance.id} className="pl-2 md:pl-4 basis-1/3">
              <BalanceDetailsModal balanceId={balance.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative h-28 w-full rounded-xl overflow-hidden cursor-pointer group ${
                    balance.type === 'massage-therapist' ? 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-purple-900 dark:to-pink-900' :
                    balance.type === 'chiropractor' ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800' :
                    balance.type === 'psychologist' ? 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800' :
                    balance.type === 'other' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800' :
                    'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700'
                  }`}
                >
                  {/* Status Badge - Positioned at top-right edge */}
                  <div className="absolute top-2 right-2 z-20">
                    {getStatusBadge(balance.status)}
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-3 flex flex-col justify-between h-full">
                    {/* Top section - Icon */}
                    <div className="flex items-start justify-start">
                      <div className="p-1.5 sm:p-2 rounded-lg backdrop-blur-sm border shadow-sm bg-white/60 dark:bg-white/20 border-white/30 dark:border-white/20">
                        <div className={`${
                          balance.type === 'massage-therapist' ? 'text-pink-900 dark:text-pink-100' :
                          balance.type === 'chiropractor' ? 'text-blue-900 dark:text-blue-100' :
                          balance.type === 'psychologist' ? 'text-purple-900 dark:text-purple-100' :
                          balance.type === 'other' ? 'text-emerald-900 dark:text-emerald-100' :
                          'text-gray-900 dark:text-gray-100'
                        }`}>
                          {getIconComponent(balance.iconName)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Middle section - Title */}
                    <div>
                      <p className={`text-sm font-semibold leading-tight ${
                        balance.type === 'massage-therapist' ? 'text-pink-900 dark:text-pink-100' :
                        balance.type === 'chiropractor' ? 'text-blue-900 dark:text-blue-100' :
                        balance.type === 'psychologist' ? 'text-purple-900 dark:text-purple-100' :
                        balance.type === 'other' ? 'text-emerald-900 dark:text-emerald-100' :
                        'text-gray-900 dark:text-gray-100'
                      }`}>
                        {balance.name}
                      </p>
                    </div>
                    
                    {/* Bottom section - Balance */}
                    <div>
                      <div className="flex items-center gap-1">
                        <DollarSign className={`h-4 w-4 ${
                          balance.type === 'massage-therapist' ? 'text-pink-900 dark:text-pink-100' :
                          balance.type === 'chiropractor' ? 'text-blue-900 dark:text-blue-100' :
                          balance.type === 'psychologist' ? 'text-purple-900 dark:text-purple-100' :
                          balance.type === 'other' ? 'text-emerald-900 dark:text-emerald-100' :
                          'text-gray-900 dark:text-gray-100'
                        }`} />
                        <p className={`text-lg font-bold ${
                          balance.type === 'massage-therapist' ? 'text-pink-900 dark:text-pink-100' :
                          balance.type === 'chiropractor' ? 'text-blue-900 dark:text-blue-100' :
                          balance.type === 'psychologist' ? 'text-purple-900 dark:text-purple-100' :
                          balance.type === 'other' ? 'text-emerald-900 dark:text-emerald-100' :
                          'text-gray-900 dark:text-gray-100'
                        }`}>
                          {balance.amount.toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-white/20 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20" />
                </motion.div>
              </BalanceDetailsModal>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
