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

const getBackgroundGradient = (type: HealthcareBalance['type']) => {
  const gradients = {
    'massage-therapist': 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
    'chiropractor': 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
    'psychologist': 'linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 50%, #c4b5fd 100%)',
    'physiotherapist': 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)',
    'acupuncturist': 'linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #fb923c 100%)',
    'dietician': 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 50%, #5eead4 100%)',
    'audiologist': 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
    'occupational-therapist': 'linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 50%, #c4b5fd 100%)',
    'osteopath': 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #ddd6fe 100%)',
    'podiatrist': 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 50%, #5eead4 100%)',
    'speech-therapist': 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
    'naturopath': 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)',
    'other': 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)'
  };
  return gradients[type];
};

const getLightThemeGradient = (type: HealthcareBalance['type']) => {
  const lightGradients = {
    'massage-therapist': 'linear-gradient(135deg, #fef7f7 0%, #fdf2f8 50%, #fce7f3 100%)',
    'chiropractor': 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 50%, #e0f2fe 100%)',
    'psychologist': 'linear-gradient(135deg, #fafaf9 0%, #faf5ff 50%, #f3e8ff 100%)',
    'physiotherapist': 'linear-gradient(135deg, #f7fef7 0%, #f0fdf4 50%, #dcfce7 100%)',
    'acupuncturist': 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
    'dietician': 'linear-gradient(135deg, #f7fef7 0%, #f0fdf4 50%, #dcfce7 100%)',
    'audiologist': 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 50%, #e0f2fe 100%)',
    'occupational-therapist': 'linear-gradient(135deg, #fafaf9 0%, #faf5ff 50%, #f3e8ff 100%)',
    'osteopath': 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
    'podiatrist': 'linear-gradient(135deg, #f7fef7 0%, #f0fdf4 50%, #dcfce7 100%)',
    'speech-therapist': 'linear-gradient(135deg, #fef7f7 0%, #fdf2f8 50%, #fce7f3 100%)',
    'naturopath': 'linear-gradient(135deg, #f7fef7 0%, #f0fdf4 50%, #dcfce7 100%)',
    'other': 'linear-gradient(135deg, #fafafa 0%, #f8fafc 50%, #f1f5f9 100%)'
  };
  return lightGradients[type];
};

const getTextColor = (type: HealthcareBalance['type']) => {
  const textColors = {
    'massage-therapist': 'text-pink-900 dark:text-pink-100',
    'chiropractor': 'text-blue-900 dark:text-blue-100', 
    'psychologist': 'text-purple-900 dark:text-purple-100',
    'physiotherapist': 'text-green-900 dark:text-green-100',
    'acupuncturist': 'text-amber-900 dark:text-amber-100',
    'dietician': 'text-teal-900 dark:text-teal-100',
    'audiologist': 'text-blue-900 dark:text-blue-100',
    'occupational-therapist': 'text-purple-900 dark:text-purple-100',
    'osteopath': 'text-indigo-900 dark:text-indigo-100',
    'podiatrist': 'text-teal-900 dark:text-teal-100',
    'speech-therapist': 'text-pink-900 dark:text-pink-100',
    'naturopath': 'text-green-900 dark:text-green-100',
    'other': 'text-gray-900 dark:text-gray-100'
  };
  return textColors[type];
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
                  className="relative h-28 w-full rounded-xl overflow-hidden cursor-pointer group"
                  style={{
                    background: getBackgroundGradient(balance.type)
                  }}
                >
                  {/* Light theme-aware background overlay */}
                  <div 
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: getLightThemeGradient(balance.type)
                    }}
                  ></div>
                  
                  {/* Status Badge - Positioned at top-right edge */}
                  <div className="absolute top-2 right-2 z-20">
                    {getStatusBadge(balance.status)}
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-3 flex flex-col justify-between h-full">
                    {/* Top section - Icon */}
                    <div className="flex items-start justify-start">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-white/60 backdrop-blur-sm border border-white/30 shadow-sm">
                        <div className={balance.color}>
                          {getIconComponent(balance.iconName)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Middle section - Title */}
                    <div>
                      <p className="text-sm font-semibold leading-tight text-black">{balance.name}</p>
                    </div>
                    
                    {/* Bottom section - Balance */}
                    <div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-black" />
                        <p className="text-lg font-bold text-black">{balance.amount.toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-white/20 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20" />
                </motion.div>
              </BalanceDetailsModal>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
