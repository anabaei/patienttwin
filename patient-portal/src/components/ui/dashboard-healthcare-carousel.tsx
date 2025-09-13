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
  return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
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
    'massage': 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
    'chiro': 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
    'mental-health': 'linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 50%, #c4b5fd 100%)',
    'physical-therapy': 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)',
    'acupuncture': 'linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #fb923c 100%)',
    'nutrition': 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 50%, #5eead4 100%)',
    'other': 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)'
  };
  return gradients[type];
};

export function DashboardHealthcareCarousel() {
  const { balances } = useHealthcareBalancesStore();
  
  // Filter to show only the main services for dashboard (massage, chiro, mental-health, other)
  const dashboardBalances = balances.filter(balance => 
    ['massage', 'chiro', 'mental-health', 'other'].includes(balance.type)
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
                  style={balance.type === 'massage' ? {
                    backgroundImage: 'url(/images/massage.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  } : balance.type === 'chiro' ? {
                    backgroundImage: 'url(/images/chiro.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  } : balance.type === 'mental-health' ? {
                    backgroundImage: 'url(/images/mental.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  } : {
                    background: getBackgroundGradient(balance.type)
                  }}
                >
                  {/* Dark overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black/30" />
                  
                  {/* Status Badge - Positioned at top-right edge */}
                  <div className="absolute top-2 right-2 z-20">
                    {getStatusBadge(balance.status)}
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-3 flex flex-col justify-between h-full">
                    {/* Top section - Icon */}
                    <div className="flex items-start justify-start">
                      <div className="p-2 rounded-lg bg-white/80 backdrop-blur-sm">
                        <div className={balance.color}>
                          {getIconComponent(balance.iconName)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Middle section - Title */}
                    <div className="text-white">
                      <p className="text-sm font-semibold leading-tight drop-shadow-sm">{balance.name}</p>
                    </div>
                    
                    {/* Bottom section - Balance */}
                    <div className="text-white">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <p className="text-lg font-bold drop-shadow-sm">{balance.amount.toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20" />
                </motion.div>
              </BalanceDetailsModal>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
