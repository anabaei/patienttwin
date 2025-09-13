"use client";

import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, AlertCircle, Brain, Calendar, DollarSign, Leaf, Sparkles, Waves, X, Zap } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { Carousel, CarouselContext } from './shadcn-io/apple-cards-carousel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

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
        icon: <Zap className="h-4 w-4" />,
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
            return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-1.5 py-0.5 h-5">Active</Badge>;
        case 'expiring':
            return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs px-1.5 py-0.5 h-5">Expiring</Badge>;
        case 'expired':
            return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs px-1.5 py-0.5 h-5">Expired</Badge>;
    }
};

const getStatusColor = (status: HealthcareBalance['status']) => {
    switch (status) {
        case 'active':
            return 'bg-green-500';
        case 'expiring':
            return 'bg-yellow-500';
        case 'expired':
            return 'bg-red-500';
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2);
    return `${month} ${day}, ${year}`;
};

const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const DummyContent = ({ balance }: { balance: HealthcareBalance }) => {
    const daysUntilExpiry = getDaysUntilExpiry(balance.expiryDate);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(balance.status)}`}>
                            {balance.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{balance.name}</h3>
                            <p className="text-sm text-muted-foreground">{balance.description}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="font-medium">Available Balance</span>
                            </div>
                            <span className="font-bold text-lg">${balance.amount.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">Expires</span>
                            </div>
                            <span className="font-medium">{formatDate(balance.expiryDate)}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-purple-600" />
                                <span className="font-medium">Renews</span>
                            </div>
                            <span className="font-medium">{formatDate(balance.renewalDate)}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-3">Status Information</h4>
                        <div className="space-y-2">
                            {getStatusBadge(balance.status)}
                            {balance.status === 'expiring' && daysUntilExpiry <= 30 && (
                                <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        Expires in {daysUntilExpiry} days
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-3">Quick Actions</h4>
                        <div className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full">
                                Book Appointment
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                                View History
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Vector background gradients and illustrations for each healthcare service
const getBackgroundGradient = (type: HealthcareBalance['type']) => {
    const gradients = {
        'massage': 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)', // Pink gradient
        'chiro': 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)', // Blue gradient
        'mental-health': 'linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 50%, #c4b5fd 100%)', // Purple gradient
        'physical-therapy': 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)', // Green gradient
        'acupuncture': 'linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #fb923c 100%)', // Orange gradient
        'nutrition': 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 50%, #5eead4 100%)' // Teal gradient
    };
    return gradients[type];
};

// Vector illustrations for each healthcare service
const getVectorIllustration = (type: HealthcareBalance['type']) => {
    const illustrations = {
        'massage': (
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
                <defs>
                    <radialGradient id="massageGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="url(#massageGrad)" />
                <path d="M60 100 Q100 60 140 100 Q100 140 60 100" fill="none" stroke="white" strokeWidth="3" opacity="0.6" />
                <circle cx="80" cy="80" r="8" fill="white" opacity="0.7" />
                <circle cx="120" cy="80" r="8" fill="white" opacity="0.7" />
                <circle cx="100" cy="120" r="6" fill="white" opacity="0.7" />
            </svg>
        ),
        'chiro': (
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
                <defs>
                    <radialGradient id="chiroGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                    </radialGradient>
                </defs>
                <rect x="50" y="50" width="100" height="100" rx="20" fill="url(#chiroGrad)" />
                <path d="M70 100 L130 100 M100 70 L100 130" stroke="white" strokeWidth="4" opacity="0.6" />
                <circle cx="100" cy="100" r="15" fill="none" stroke="white" strokeWidth="3" opacity="0.7" />
            </svg>
        ),
        'mental-health': (
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
                <defs>
                    <radialGradient id="mentalGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="url(#mentalGrad)" />
                <path d="M80 100 Q100 80 120 100 Q100 120 80 100" fill="white" opacity="0.6" />
                <circle cx="90" cy="90" r="4" fill="white" opacity="0.8" />
                <circle cx="110" cy="90" r="4" fill="white" opacity="0.8" />
                <path d="M85 110 Q100 115 115 110" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
            </svg>
        ),
        'physical-therapy': (
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
                <defs>
                    <radialGradient id="ptGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                    </radialGradient>
                </defs>
                <rect x="50" y="50" width="100" height="100" rx="20" fill="url(#ptGrad)" />
                <path d="M70 80 L130 120 M130 80 L70 120" stroke="white" strokeWidth="4" opacity="0.6" />
                <circle cx="100" cy="100" r="20" fill="none" stroke="white" strokeWidth="3" opacity="0.7" />
            </svg>
        ),
        'acupuncture': (
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
                <defs>
                    <radialGradient id="acupGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="url(#acupGrad)" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
                <circle cx="100" cy="100" r="20" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
                <circle cx="100" cy="100" r="4" fill="white" opacity="0.8" />
            </svg>
        ),
        'nutrition': (
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
                <defs>
                    <radialGradient id="nutritionGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="url(#nutritionGrad)" />
                <path d="M80 100 Q100 80 120 100 Q100 120 80 100" fill="white" opacity="0.6" />
                <circle cx="90" cy="90" r="6" fill="white" opacity="0.7" />
                <circle cx="110" cy="90" r="6" fill="white" opacity="0.7" />
                <circle cx="100" cy="110" r="4" fill="white" opacity="0.7" />
                <path d="M85 115 Q100 120 115 115" stroke="white" strokeWidth="2" fill="none" opacity="0.6" />
            </svg>
        )
    };
    return illustrations[type];
};

// Custom Healthcare Card Component with Gradient Background
const HealthcareCard = ({
    balance,
    index,
    layout = false
}: {
    balance: HealthcareBalance;
    index: number;
    layout?: boolean;
}) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { onCardClose } = useContext(CarouselContext);
    const gradient = getBackgroundGradient(balance.type);
    const illustration = getVectorIllustration(balance.type);

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                handleClose();
            }
        }
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]);

    useOnClickOutside(containerRef as React.RefObject<HTMLElement>, () => handleClose());

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        onCardClose(index);
    };

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 h-screen overflow-auto"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            ref={containerRef}
                            layoutId={layout ? `card-${balance.name}` : undefined}
                            className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 font-sans md:p-10 dark:bg-neutral-900"
                        >
                            <button
                                className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
                                onClick={handleClose}
                            >
                                <X className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
                            </button>
                            <motion.p
                                layoutId={layout ? `category-${balance.name}` : undefined}
                                className="text-base font-medium text-black dark:text-white"
                            >
                                Healthcare Service
                            </motion.p>
                            <motion.p
                                layoutId={layout ? `title-${balance.name}` : undefined}
                                className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white"
                            >
                                {balance.name}
                            </motion.p>
                            <div className="py-10">
                                <DummyContent balance={balance} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

             <motion.button
                 layoutId={layout ? `card-${balance.name}` : undefined}
                 onClick={handleOpen}
                 className="relative z-10 flex h-52 w-36 flex-col items-start justify-start overflow-hidden rounded-2xl sm:h-56 sm:w-40 md:h-64 md:w-48 lg:h-72 lg:w-56 bg-background border-2 border-border hover:border-primary/50 transition-colors"
             >
                {/* Content */}
                <div className="relative z-40 p-3 sm:p-3.5 md:p-4 flex flex-col h-full w-full">
                    {/* Header with icon and title */}
                    <div className="flex items-start gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        <div className={`p-1 sm:p-1.5 rounded-lg bg-muted ${balance.color} flex-shrink-0 mt-0.5`}>
                            {balance.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                            <motion.p
                                layoutId={layout ? `title-${balance.name}` : undefined}
                                className="text-left font-sans text-xs sm:text-sm font-semibold text-foreground leading-tight mb-1"
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <p className="text-xs text-muted-foreground cursor-help hover:text-foreground transition-colors">
                                                {balance.name}
                                            </p>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs">{balance.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </motion.p>
                            <div className="flex items-center gap-1 sm:gap-2">
                                {getStatusBadge(balance.status)}

                            </div>
                        </div>
                    </div>

                    {/* Balance Amount */}
                    <div className="text-center mb-3 sm:mb-4">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            <span className="text-lg sm:text-xl font-bold text-primary">
                                ${balance.amount.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Expiry Information */}
                    <div className="mb-3 sm:mb-4">
                         <div className="flex items-center justify-between p-1.5 sm:p-2 bg-muted/50 rounded-lg">
                             <div className="flex items-center gap-1 flex-shrink-0">
                                 <Calendar className="h-3 w-3 text-muted-foreground" />
                                 <span className="text-xs font-medium">Expires</span>
                             </div>
                             <div className="text-right min-w-0 flex-1 ml-2">
                                 <p className="text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{formatDate(balance.expiryDate)}</p>
                                 <p className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                                     {getDaysUntilExpiry(balance.expiryDate)}d left
                                 </p>
                             </div>
                         </div>
                     </div>

                    {/* Warning for expiring balance - Reserve space to maintain consistent height */}
                    <div className="mt-auto min-h-[32px] sm:min-h-[36px] flex items-center">
                        {balance.status === 'expiring' && getDaysUntilExpiry(balance.expiryDate) <= 30 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-1 p-1 sm:p-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg w-full"
                            >
                                <AlertCircle className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                    Expires in {getDaysUntilExpiry(balance.expiryDate)} days
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.button>
        </>
    );
};

export const HealthcareBalanceAppleCarousel = () => {
    const cards = mockHealthcareBalances.map((balance, index) => {
        return (
            <HealthcareCard
                key={balance.id}
                balance={balance}
                index={index}
                layout={true}
            />
        );
    });

    return (
        <div className="w-full">
            <Carousel items={cards} />
        </div>
    );
};
