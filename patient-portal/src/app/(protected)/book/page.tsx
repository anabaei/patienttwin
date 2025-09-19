'use client';

import { AppointmentCalendar } from '@/components/ui/appointment-calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useDirectoryStore } from '@twinn/store';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Heart,
  Mail,
  MapPin,
  Shield,
  Star,
  Stethoscope,
  User,
  Wallet,
  Zap
} from 'lucide-react';
import NextImage from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';


// Generate availability for September, October, November (excluding weekends and past days)
const generateAvailabilityDates = () => {
  const today = new Date();
  const dates: string[] = [];
  
  // Generate dates for September, October, November 2025
  const months = [
    { month: 8, year: 2025 }, // September (0-indexed)
    { month: 9, year: 2025 }, // October
    { month: 10, year: 2025 }, // November
  ];
  
  months.forEach(({ month, year }) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      // Skip weekends (Saturday = 6, Sunday = 0) and past dates
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && date >= today) {
        // Use local date string to avoid timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        dates.push(`${year}-${month}-${day}`);
      }
    }
  });
  
  return dates;
};

const availableDates = generateAvailabilityDates();

// Generate realistic availability for each specialist
const generateSpecialistAvailability = (specialistId: string) => {
  const availability: { [date: string]: string[] } = {};
  
  // All possible time slots
  const allTimeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', 
    '17:00', '17:30', '18:00'
  ];
  
  availableDates.forEach((date, index) => {
    // Create realistic availability patterns
    const availableSlots: string[] = [];
    
    // Different specialists have different availability patterns
    const specialistPattern = parseInt(specialistId) % 3;
    
    switch (specialistPattern) {
      case 0: // Morning specialist (8 AM - 2 PM)
        availableSlots.push(...allTimeSlots.slice(0, 12).filter((_, i) => i % 2 === 0));
        break;
      case 1: // Afternoon specialist (12 PM - 6 PM)
        availableSlots.push(...allTimeSlots.slice(8, 20).filter((_, i) => i % 2 === 0));
        break;
      case 2: // Full day specialist (8 AM - 6 PM)
        availableSlots.push(...allTimeSlots.filter((_, i) => i % 2 === 0));
        break;
    }
    
    // Add some randomness - some days have fewer slots
    if (index % 7 === 0) {
      // Every 7th day has reduced availability
      availableSlots.splice(0, Math.floor(availableSlots.length * 0.3));
    }
    
    // Some days are fully booked (no availability)
    if (index % 15 === 0) {
      availability[date] = [];
    } else {
      availability[date] = availableSlots;
    }
  });
  
  return availability;
};

// Define proper types for availability data
interface SpecialistAvailability {
  [specialistId: string]: { [date: string]: string[] };
}

interface ClinicAvailability {
  [clinicId: string]: SpecialistAvailability;
}

const mockAvailability: ClinicAvailability = {
  '1': {
    '1': generateSpecialistAvailability('1'),
    '2': generateSpecialistAvailability('2'),
  },
  '2': {
    '4': generateSpecialistAvailability('4'),
  },
  '3': {
    '6': generateSpecialistAvailability('6'),
    '7': generateSpecialistAvailability('7'),
  },
  '4': {
    '8': generateSpecialistAvailability('8'),
    '9': generateSpecialistAvailability('9'),
  },
  '5': {
    '10': generateSpecialistAvailability('10'),
    '11': generateSpecialistAvailability('11'),
  },
  '6': {
    '12': generateSpecialistAvailability('12'),
    '13': generateSpecialistAvailability('13'),
  },
};

// Mock payment options based on connected insurance
const getMockPaymentOptions = (servicePrice: number) => {
  const insuranceCoverageRate = 0.8;
  const maxAnnualCoverage = 300;
  const insuranceCovered = Math.min(servicePrice * insuranceCoverageRate, maxAnnualCoverage);
  const remainingBalance = Math.max(servicePrice - insuranceCovered, 0);

  return [
    {
      id: 'insurance-coverage',
      name: 'Insurance Coverage',
      amount: `$${maxAnnualCoverage.toFixed(2)}`,
      covered: `$${insuranceCovered.toFixed(2)}`,
      description: 'Your insurance covers 80% of the service cost up to $300 annually.',
      type: 'insurance',
    },
    {
      id: 'hsa-health',
      name: 'Health Spending Account (HSA)',
      amount: '$1,500.00',
      covered: `$${remainingBalance.toFixed(2)}`,
      description: 'Use your Health Spending Account to cover remaining costs.',
      type: 'hsa',
    },
    {
      id: 'hsa-wellness',
      name: 'Wellness Spending Account (HSA)',
      amount: '$300.00',
      description: 'Use your Wellness Spending Account for wellness services.',
      type: 'hsa',
    },
    {
      id: 'credit-card',
      name: 'Credit Card',
      description: 'Pay with your credit card for the full amount.',
      type: 'credit',
    },
  ];
};

type BookingStep = 'clinic' | 'specialist' | 'service' | 'datetime' | 'confirmation';

// Mock images for clinics (same as clinics page)
const mockImages = [
  'https://images.unsplash.com/photo-1631507623112-0092cef9c70d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1642844613096-7b743b7d9915?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1669930605340-801a0be1f5a3?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1753267731393-dd5785991e5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1669930605340-801a0be1f5a3?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

// Helper function to get clinic image (consistent with clinics page)
const getClinicImage = (clinicId: string): string => {
  // Use a deterministic approach based on clinic ID to ensure consistency
  const index = clinicId.split('-')[1]; // Extract number from clinic-001, clinic-002, etc.
  const numIndex = parseInt(index) - 1; // Convert to 0-based index
  return mockImages[numIndex % mockImages.length];
};

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clinics, servicesByClinic, serviceOptionsByService, getSpecialistsByClinic, getAvailability } = useDirectoryStore();
  const [currentStep, setCurrentStep] = useState<BookingStep>('clinic');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [creditCardDetails, setCreditCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedRemainingPayment, setSelectedRemainingPayment] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize from URL params
  useEffect(() => {
    const clinicId = searchParams.get('clinicId');
    const specialistId = searchParams.get('specialistId');
    
    if (clinicId) {
      setSelectedClinic(clinicId);
      if (specialistId) {
        setSelectedSpecialist(specialistId);
        setCurrentStep('service');
      } else {
        setCurrentStep('specialist');
      }
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [searchParams]);

  // Scroll to top when step changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentStep]);

  const clinic = selectedClinic ? clinics.find(c => c.id === selectedClinic) : null;
  const specialists = selectedClinic ? getSpecialistsByClinic(selectedClinic) : [];
  const specialist = selectedSpecialist 
    ? specialists.find(s => s.userId === selectedSpecialist) 
    : null;
  const services = selectedClinic ? servicesByClinic[selectedClinic] || [] : [];
  const serviceOptions = services.flatMap(service => 
    (serviceOptionsByService[service.id] || []).map(option => ({
      ...option,
      serviceName: service.name
    }))
  );
  const service = selectedService 
    ? serviceOptions.find(s => s.id === selectedService) 
    : null;

  // Calculate insurance coverage (80% coverage up to $300 annually)
  const insuranceCoverageRate = 0.8;
  const maxAnnualCoverage = 300;
  const servicePrice = service?.price || 0;
  const insuranceCovered = Math.min(servicePrice * insuranceCoverageRate, maxAnnualCoverage);
  const remainingBalance = Math.max(servicePrice - insuranceCovered, 0);

  // Get availability from store
  const availabilitySlots = selectedClinic && selectedSpecialist && selectedService
    ? getAvailability({
        clinicId: selectedClinic,
        specialistId: selectedSpecialist,
        serviceOptionId: selectedService,
        from: new Date().toISOString(),
        to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
    : [];


  // Filter slots for selected date
  const availableTimes = selectedDate
    ? availabilitySlots
        .filter(slot => {
          const slotDate = new Date(slot.start).toISOString().split('T')[0];
          return slotDate === selectedDate;
        })
        .map(slot => {
          const startTime = new Date(slot.start);
          return startTime.toTimeString().slice(0, 5); // HH:MM format
        })
        .sort()
    : [];

  // Helper function to format availability data for the calendar component
  const getAvailabilityForSpecialist = () => {
    if (!selectedClinic || !selectedSpecialist || !selectedService) return {};
    
    const specialistAvailabilitySlots = getAvailability({
      clinicId: selectedClinic,
      specialistId: selectedSpecialist,
      serviceOptionId: selectedService,
      from: new Date().toISOString(),
      to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    
    const formattedAvailability: { [date: string]: Array<{ time: string; available: boolean; reason?: string }> } = {};
    
    // All possible time slots for a day
    const allTimeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
    
    // Group slots by date
    const slotsByDate: { [date: string]: string[] } = {};
    specialistAvailabilitySlots.forEach(slot => {
      const slotDate = new Date(slot.start).toISOString().split('T')[0];
      const slotTime = new Date(slot.start).toTimeString().slice(0, 5);
      if (!slotsByDate[slotDate]) {
        slotsByDate[slotDate] = [];
      }
      slotsByDate[slotDate].push(slotTime);
    });
    
    // Generate formatted availability for each date
    Object.entries(slotsByDate).forEach(([date, availableTimes]) => {
      formattedAvailability[date] = allTimeSlots.map(time => {
        const isAvailable = availableTimes.includes(time);
        return {
          time,
          available: isAvailable,
          reason: !isAvailable ? (time < '09:00' || time > '17:00' ? 'Outside hours' : 'Booked') : undefined,
        };
      });
    });
    
    return formattedAvailability;
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'clinic':
        if (selectedClinic) {
          setCurrentStep('specialist');
          scrollToTop();
        }
        break;
      case 'specialist':
        if (selectedSpecialist) {
          setCurrentStep('service');
          scrollToTop();
        }
        break;
      case 'service':
        if (selectedService) {
          setCurrentStep('datetime');
          scrollToTop();
        }
        break;
      case 'datetime':
        if (selectedDate && selectedTime) {
          setCurrentStep('confirmation');
          scrollToTop();
        }
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'specialist':
        setCurrentStep('clinic');
        scrollToTop();
        break;
      case 'service':
        setCurrentStep('specialist');
        scrollToTop();
        break;
      case 'datetime':
        setCurrentStep('service');
        scrollToTop();
        break;
      case 'confirmation':
        setCurrentStep('datetime');
        scrollToTop();
        break;
    }
  };

  // Scroll to top of content area when step changes
  const scrollToTop = () => {
    // Use setTimeout to ensure DOM has updated with new step content
    setTimeout(() => {
      console.log('scrollToTop function called');
      
      // Since our booking page uses fixed positioning, we need to scroll our own container
      if (scrollContainerRef.current) {
        console.log('Scrolling our own container');
        console.log('Container scrollTop before:', scrollContainerRef.current.scrollTop);
        console.log('Container scrollHeight:', scrollContainerRef.current.scrollHeight);
        console.log('Container clientHeight:', scrollContainerRef.current.clientHeight);
        
        scrollContainerRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Also try direct assignment as backup
        scrollContainerRef.current.scrollTop = 0;
        
        console.log('Container scrollTop after:', scrollContainerRef.current.scrollTop);
        console.log('Scrolled our container to top');
      } else {
        console.log('Container ref not found');
      }
    }, 200);
  };

  // Credit card formatting helpers
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const isCreditCardValid = () => {
    if (selectedPaymentMethod !== 'credit-card') return true;
    
    const { cardNumber, expiryDate, cvv, cardholderName } = creditCardDetails;
    return (
      cardNumber.replace(/\s/g, '').length === 16 &&
      expiryDate.length === 5 &&
      cvv.length >= 3 &&
      cardholderName.trim().length > 0
    );
  };

  const handleBookAppointment = () => {
    // In a real app, this would make an API call
    console.log('Booking appointment:', {
      clinic: selectedClinic,
      specialist: selectedSpecialist,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      paymentMethod: selectedPaymentMethod,
      creditCardDetails: selectedPaymentMethod === 'credit-card' ? creditCardDetails : null,
    });
    
    // Show success dialog
    setShowSuccessDialog(true);
    
    // Auto-dismiss after 5 seconds and navigate
    setTimeout(() => {
      setShowSuccessDialog(false);
      router.push('/dashboard');
    }, 5000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
      },
    },
  };

  const paymentCardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const paymentOptionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
      },
    },
  };

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Fixed Header with Steps */}
      <div className="fixed top-16 left-0 right-0 bg-background border-b border-border z-40 md:left-64 md:top-0">
        <div className="">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.back()}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-base font-bold text-foreground">Book Appointment</h1>
              <p className="text-xs text-muted-foreground">Schedule your healthcare visit</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-1"></div>

          {/* Steps */}
          <div className="py-3">
                {/* Desktop Steps */}
                <div className="hidden md:flex items-center justify-between">
                  {[
                    { key: 'clinic', label: 'Clinic', icon: MapPin },
                    { key: 'specialist', label: 'Specialist', icon: User },
                    { key: 'service', label: 'Service', icon: Stethoscope },
                    { key: 'datetime', label: 'Date & Time', icon: Calendar },
                    { key: 'confirmation', label: 'Confirm', icon: CheckCircle }
                  ].map((step, index) => {
                    const isActive = currentStep === step.key;
                    const isCompleted = [
                      'clinic', 'specialist', 'service', 'datetime', 'confirmation'
                    ].indexOf(currentStep) > index;
                    const canNavigate = isCompleted || isActive;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.key} className="flex items-center flex-1">
                        <button
                          onClick={() => canNavigate && setCurrentStep(step.key as BookingStep)}
                          disabled={!canNavigate}
                          className={`flex items-center ${canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        >
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                            isActive 
                              ? 'bg-primary border-primary text-primary-foreground' 
                              : isCompleted 
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-muted-foreground text-muted-foreground'
                          }`}>
                            <Icon className="h-3 w-3" />
                          </div>
                          <span className={`ml-2 text-xs font-medium ${
                            isActive ? 'text-primary' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                          }`}>
                            {step.label}
                          </span>
                        </button>
                        {index < 4 && (
                          <div className="flex-1 mx-4">
                            <div className={`h-0.5 ${
                              isCompleted ? 'bg-green-500' : 'bg-muted-foreground/30'
                            }`}></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Steps - Compact */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between relative">
                    {[
                      { key: 'clinic', label: 'Clinic', icon: MapPin },
                      { key: 'specialist', label: 'Doctor', icon: User },
                      { key: 'service', label: 'Service', icon: Stethoscope },
                      { key: 'datetime', label: 'Time', icon: Calendar },
                      { key: 'confirmation', label: 'Confirm', icon: CheckCircle }
                    ].map((step, index) => {
                      const isActive = currentStep === step.key;
                      const isCompleted = [
                        'clinic', 'specialist', 'service', 'datetime', 'confirmation'
                      ].indexOf(currentStep) > index;
                      const canNavigate = isCompleted || isActive;
                      const Icon = step.icon;
                      
                      return (
                        <div key={step.key} className="flex flex-col items-center flex-1 relative">
                          <button
                            onClick={() => canNavigate && setCurrentStep(step.key as BookingStep)}
                            disabled={!canNavigate}
                            className={`flex flex-col items-center ${canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                          >
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 relative z-10 ${
                              isActive 
                                ? 'bg-primary border-primary text-primary-foreground' 
                                : isCompleted 
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-muted-foreground text-muted-foreground'
                            }`}>
                              <Icon className="h-3 w-3" />
                            </div>
                            <span className={`text-xs font-medium text-center leading-tight mt-1 ${
                              isActive ? 'text-primary' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                            }`}>
                              {step.label}
                            </span>
                          </button>
                          {index < 4 && (
                            <div className="absolute top-3 left-1/2 w-full h-0.5 -translate-y-1/2 z-0">
                              <div className={`h-full ${
                                isCompleted ? 'bg-green-500' : 'bg-muted-foreground/30'
                              }`} style={{ width: 'calc(100% - 12px)', marginLeft: '12px' }}></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
          </div>
          
        </div>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollContainerRef} className="fixed top-40 left-0 right-0 bottom-20 overflow-y-auto md:top-36 md:left-64 md:bottom-16">
        <motion.div
          className="p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-4">

      {/* Step Content */}
      <motion.div variants={itemVariants}>
        {currentStep === 'clinic' && (
          <Card className="border border-border rounded-xl">
            <CardHeader>
              <CardTitle>Select a Clinic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clinics.map((clinic) => (
                  <motion.div
                    key={clinic.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedClinic === clinic.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedClinic(clinic.id)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-15 h-15 rounded-lg overflow-hidden flex-shrink-0">
                        <NextImage
                          src={getClinicImage(clinic.id)}
                          alt={clinic.name}
                          width={60}
                          height={60}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{clinic.name}</h3>
                        <p className="text-sm text-muted-foreground">{clinic.address}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">4.5</span>
                          <span className="text-sm text-muted-foreground ml-1">
                            (12 reviews)
                          </span>
                        </div>
                      </div>
                      {selectedClinic === clinic.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'specialist' && clinic && (
          <Card className="border border-border rounded-xl">
            <CardHeader>
              <CardTitle>Select a Specialist</CardTitle>
              <p className="text-muted-foreground">Available at {clinic.name}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {specialists.map((specialist) => (
                  <motion.div
                    key={specialist.userId}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedSpecialist === specialist.userId
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedSpecialist(specialist.userId)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={specialist.image} alt={specialist.name} />
                        <AvatarFallback>
                          {specialist.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{specialist.name}</h3>
                        <p className="text-sm text-muted-foreground">{specialist.specialty}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{specialist.rating}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {specialist.experience} experience
                          </span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Next available: {specialist.nextAvailable}
                        </p>
                      </div>
                      {selectedSpecialist === specialist.userId && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'service' && clinic && (
          <Card className="border border-border rounded-xl">
            <CardHeader>
              <CardTitle>Select a Service</CardTitle>
              <p className="text-muted-foreground">Choose the type of appointment</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {serviceOptions.map((service) => (
                  <motion.div
                    key={service.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedService === service.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{service.serviceName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Duration: {service.duration} minutes
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${service.price}</p>
                        {selectedService === service.id && (
                          <CheckCircle className="h-5 w-5 text-primary mt-1" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'datetime' && (
          <AppointmentCalendar
            availability={getAvailabilityForSpecialist()}
            selectedDate={selectedDate ? new Date(selectedDate + 'T00:00:00') : undefined}
            onDateSelect={(date) => setSelectedDate(format(date, 'yyyy-MM-dd'))}
            selectedTime={selectedTime || undefined}
            onTimeSelect={setSelectedTime}
            specialistName={specialist?.name || ''}
            isLoading={false}
          />
        )}

        {currentStep === 'confirmation' && clinic && specialist && service && (
          <div className="space-y-6">
            {/* Appointment Summary */}
            <Card className="border border-border rounded-xl">
              <CardHeader>
                <CardTitle>Confirm Your Appointment</CardTitle>
                <p className="text-muted-foreground">Review your booking details</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/30 border border-border/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Appointment Details</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Clinic</span>
                        </div>
                        <span className="text-foreground font-medium">{clinic.name}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Specialist</span>
                        </div>
                        <span className="text-foreground font-medium">{specialist.name}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Service</span>
                        </div>
                        <span className="text-foreground font-medium">{service.serviceName}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Date</span>
                        </div>
                        <span className="text-foreground font-medium">
                          {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Time</span>
                        </div>
                        <span className="text-foreground font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Duration</span>
                        </div>
                        <span className="text-foreground font-medium">{service.duration} minutes</span>
                      </div>
                      <div className="flex items-center justify-between py-3 bg-primary/5 rounded-md px-3 mt-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary" />
                          <span className="text-foreground font-semibold">Total Cost</span>
                        </div>
                        <span className="text-primary font-bold text-lg">${service.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Insurance Coverage Info */}
                  <div className="bg-muted/30 border border-border/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Insurance Coverage</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Insurance covers</span>
                        </div>
                        <span className="text-foreground font-medium">${insuranceCovered.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Your remaining balance</span>
                        </div>
                        <span className="text-foreground font-medium">${remainingBalance.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Options */}
            <motion.div
              variants={paymentCardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="border border-border rounded-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    </motion.div>
                    Payment Options
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">Choose how you'd like to pay for your appointment</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <RadioGroup value={selectedPaymentMethod}>
                    <div className="space-y-3">
                      {getMockPaymentOptions(servicePrice).map((option, index) => {
                        const getIcon = (id: string) => {
                          switch (id) {
                            case 'hsa': return <Building2 className="h-5 w-5 text-blue-600" />;
                            case 'wellness': return <Heart className="h-5 w-5 text-pink-600" />;
                            case 'credit-card': return <CreditCard className="h-5 w-5 text-purple-600" />;
                            default: return <Wallet className="h-5 w-5 text-green-600" />;
                          }
                        };

                        return (
                          <motion.div
                            key={option.id}
                            variants={paymentOptionVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-start space-x-4 p-4 border rounded-xl transition-all cursor-pointer group ${
                              selectedPaymentMethod === option.id
                                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                : 'border-border hover:bg-muted/50 hover:border-primary/50'
                            }`}
                            onClick={() => {
                              console.log('Setting payment method to:', option.id);
                              setSelectedPaymentMethod(option.id);
                              // Clear credit card details when switching away from credit card
                              if (option.id !== 'credit-card') {
                                setCreditCardDetails({
                                  cardNumber: '',
                                  expiryDate: '',
                                  cvv: '',
                                  cardholderName: '',
                                });
                              }
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                            <motion.div
                              className="flex items-center space-x-3"
                              animate={selectedPaymentMethod === option.id ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            >
                              {getIcon(option.id)}
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <Label
                                htmlFor={option.id}
                                className="text-base font-semibold cursor-pointer text-foreground block"
                              >
                                {option.name}
                              </Label>
                              {option.amount && (
                                <p className="text-sm text-muted-foreground mt-1 font-medium">
                                  {option.amount} {option.covered && `• Covered: ${option.covered}`}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{option.description}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>

            {/* Credit Card Form */}
            {selectedPaymentMethod === 'credit-card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Card className="border border-border rounded-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <CreditCard className="h-5 w-5 mr-2 text-primary" />
                      </motion.div>
                      Credit Card Details
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">Enter your credit card information</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label htmlFor="cardholderName" className="text-sm font-medium">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          placeholder="John Doe"
                          value={creditCardDetails.cardholderName}
                          onChange={(e) => setCreditCardDetails(prev => ({
                            ...prev,
                            cardholderName: e.target.value
                          }))}
                          className="mt-2 h-11"
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label htmlFor="cardNumber" className="text-sm font-medium">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={creditCardDetails.cardNumber}
                          onChange={(e) => setCreditCardDetails(prev => ({
                            ...prev,
                            cardNumber: formatCardNumber(e.target.value)
                          }))}
                          maxLength={19}
                          className="mt-2 h-11"
                        />
                      </motion.div>
                      
                      <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div>
                          <Label htmlFor="expiryDate" className="text-sm font-medium">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={creditCardDetails.expiryDate}
                            onChange={(e) => setCreditCardDetails(prev => ({
                              ...prev,
                              expiryDate: formatExpiryDate(e.target.value)
                            }))}
                            maxLength={5}
                            className="mt-2 h-11"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cvv" className="text-sm font-medium">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={creditCardDetails.cvv}
                            onChange={(e) => setCreditCardDetails(prev => ({
                              ...prev,
                              cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                            }))}
                            maxLength={4}
                            className="mt-2 h-11"
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div
                        className="bg-muted/50 p-4 rounded-xl border border-border/50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <p className="text-sm text-muted-foreground flex items-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            <Shield className="h-4 w-4 mr-2 text-green-600" />
                          </motion.div>
                          Your payment information is secure and encrypted.
                        </p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Remaining Balance Payment */}
            <motion.div
              variants={paymentCardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="border border-border rounded-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                    >
                      <Zap className="h-5 w-5 mr-2 text-primary" />
                    </motion.div>
                    Remaining Balance Payment
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">Choose how to pay the remaining $25.80</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <RadioGroup value={selectedRemainingPayment}>
                    <div className="space-y-3">
                      <motion.div
                        variants={paymentOptionVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                        className={`flex items-center space-x-4 p-4 border rounded-xl transition-all cursor-pointer group ${
                          selectedRemainingPayment === 'hsa-remaining'
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border hover:bg-muted/50 hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedRemainingPayment('hsa-remaining')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RadioGroupItem value="hsa-remaining" id="hsa-remaining" />
                        <motion.div
                          animate={selectedRemainingPayment === 'hsa-remaining' ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <Label htmlFor="hsa-remaining" className="cursor-pointer text-foreground font-semibold block">
                            Health Spending Account (HSA)
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Available: $1,500.00 • Covered: $25.80
                          </p>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        variants={paymentOptionVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.2 }}
                        className={`flex items-center space-x-4 p-4 border rounded-xl transition-all cursor-pointer group ${
                          selectedRemainingPayment === 'wellness-remaining'
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border hover:bg-muted/50 hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedRemainingPayment('wellness-remaining')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RadioGroupItem value="wellness-remaining" id="wellness-remaining" />
                        <motion.div
                          animate={selectedRemainingPayment === 'wellness-remaining' ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart className="h-5 w-5 text-pink-600" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <Label htmlFor="wellness-remaining" className="cursor-pointer text-foreground font-semibold block">
                            Wellness Spending Account (HSA)
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Available: $300.00
                          </p>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        variants={paymentOptionVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                        className={`flex items-center space-x-4 p-4 border rounded-xl transition-all cursor-pointer group ${
                          selectedRemainingPayment === 'credit-remaining'
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border hover:bg-muted/50 hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedRemainingPayment('credit-remaining')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RadioGroupItem value="credit-remaining" id="credit-remaining" />
                        <motion.div
                          animate={selectedRemainingPayment === 'credit-remaining' ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <CreditCard className="h-5 w-5 text-purple-600" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <Label htmlFor="credit-remaining" className="cursor-pointer text-foreground font-semibold block">
                            Credit Card
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pay with your credit card
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>

            {/* Credit Card Form for Remaining Balance */}
            {selectedRemainingPayment === 'credit-remaining' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Card className="border border-border rounded-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <CreditCard className="h-5 w-5 mr-2 text-primary" />
                      </motion.div>
                      Credit Card Details for Remaining Balance
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">Enter your credit card information to pay the remaining $25.80</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label htmlFor="remainingCardholderName" className="text-sm font-medium">Cardholder Name</Label>
                        <Input
                          id="remainingCardholderName"
                          placeholder="John Doe"
                          className="mt-2 h-11"
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label htmlFor="remainingCardNumber" className="text-sm font-medium">Card Number</Label>
                        <Input
                          id="remainingCardNumber"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="mt-2 h-11"
                        />
                      </motion.div>
                      
                      <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div>
                          <Label htmlFor="remainingExpiryDate" className="text-sm font-medium">Expiry Date</Label>
                          <Input
                            id="remainingExpiryDate"
                            placeholder="MM/YY"
                            maxLength={5}
                            className="mt-2 h-11"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="remainingCvv" className="text-sm font-medium">CVV</Label>
                          <Input
                            id="remainingCvv"
                            placeholder="123"
                            maxLength={4}
                            className="mt-2 h-11"
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div
                        className="bg-muted/50 p-4 rounded-xl border border-border/50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <p className="text-sm text-muted-foreground flex items-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            <Shield className="h-4 w-4 mr-2 text-green-600" />
                          </motion.div>
                          Your payment information is secure and encrypted.
                        </p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Fixed Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-3 z-50 md:left-64 md:pb-3 pb-20">
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 'clinic'}
            className="flex-1 max-w-[120px]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          {currentStep === 'confirmation' ? (
            <Button
              onClick={handleBookAppointment}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 flex-1 max-w-[180px]"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 'clinic' && !selectedClinic) ||
                (currentStep === 'specialist' && !selectedSpecialist) ||
                (currentStep === 'service' && !selectedService) ||
                (currentStep === 'datetime' && (!selectedDate || !selectedTime))
              }
              className="flex-1 max-w-[120px]"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-background border border-border rounded-xl p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Appointment Booked Successfully!
              </h3>
              <p className="text-muted-foreground mb-4">
                Your appointment has been confirmed. A confirmation email has been sent to your registered email address.
              </p>
              <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                <Mail className="h-4 w-4 mr-2" />
                Email notification sent
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  You will be redirected to your dashboard in a few seconds...
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}