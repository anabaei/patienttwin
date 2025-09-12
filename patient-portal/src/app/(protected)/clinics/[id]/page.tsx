'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, Variants } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    Heart,
    Mail,
    MapPin,
    Navigation,
    Phone,
    Shield,
    Star,
    Stethoscope,
    Users
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Mock data for clinic details - using our existing clinic data
const mockClinicDetails = {
  '1': {
    id: '1',
    name: 'City Health Center',
    address: '123 Main St, Toronto, ON',
    distance: 1.2,
    rating: 4.8,
    reviewCount: 127,
    image: 'https://images.unsplash.com/photo-1631507623112-0092cef9c70d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'A comprehensive healthcare facility providing primary care, urgent care, and specialized services to the Toronto community. We are committed to delivering exceptional patient care with state-of-the-art facilities and experienced medical professionals.',
    hours: {
      'Monday - Friday': '8:00 AM - 6:00 PM',
      'Saturday': '9:00 AM - 1:00 PM',
      'Sunday': 'Closed',
    },
    contact: {
      phone: '(555) 123-4567',
      email: 'info@cityhealthcenter.com',
      website: 'www.cityhealthcenter.com',
    },
    services: [
      'Primary Care',
      'Urgent Care',
      'Physical Therapy',
      'Mental Health Counseling',
      'Lab Services',
      'X-Ray & Imaging',
      'Vaccinations',
      'Health Screenings',
    ],
    acceptedInsurances: [
      'Aetna',
      'Blue Cross',
      'Cigna',
      'UnitedHealthcare',
      'Medicare',
      'Medicaid',
    ],
    specialists: [
      {
        id: '1',
        name: 'Dr. Amelia Chen',
        specialty: 'Internal Medicine',
        rating: 4.9,
        image: 'https://i.pravatar.cc/100?img=1',
        nextAvailable: 'Tomorrow, 2:00 PM',
        experience: '8 years',
        education: 'MD, University of Toronto',
      },
      {
        id: '2',
        name: 'Dr. Michael Rodriguez',
        specialty: 'Family Medicine',
        rating: 4.7,
        image: 'https://i.pravatar.cc/100?img=2',
        nextAvailable: 'Today, 4:30 PM',
        experience: '12 years',
        education: 'MD, McMaster University',
      },
      {
        id: '3',
        name: 'Dr. Sarah Johnson',
        specialty: 'Physical Therapy',
        rating: 4.8,
        image: 'https://i.pravatar.cc/100?img=3',
        nextAvailable: 'Monday, 10:00 AM',
        experience: '6 years',
        education: 'DPT, University of Western Ontario',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Family Wellness Clinic',
    address: '456 Oak Ave, Ottawa, ON',
    distance: 2.5,
    rating: 4.5,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1642844613096-7b743b7d9915?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Dedicated to providing comprehensive family healthcare services in Ottawa. Our team of experienced physicians and healthcare professionals focuses on preventive care and wellness.',
    hours: {
      'Monday - Friday': '7:00 AM - 7:00 PM',
      'Saturday': '8:00 AM - 2:00 PM',
      'Sunday': 'Closed',
    },
    contact: {
      phone: '(555) 234-5678',
      email: 'info@familywellness.com',
      website: 'www.familywellness.com',
    },
    services: [
      'Family Medicine',
      'Pediatrics',
      'Mental Health',
      'Women\'s Health',
      'Preventive Care',
      'Vaccinations',
      'Health Screenings',
    ],
    acceptedInsurances: [
      'Aetna',
      'UnitedHealthcare',
      'Medicare',
      'Blue Cross',
    ],
    specialists: [
      {
        id: '4',
        name: 'Dr. Jennifer Lee',
        specialty: 'Family Medicine',
        rating: 4.6,
        image: 'https://i.pravatar.cc/100?img=4',
        nextAvailable: 'Wednesday, 11:00 AM',
        experience: '10 years',
        education: 'MD, University of Ottawa',
      },
      {
        id: '5',
        name: 'Dr. Robert Kim',
        specialty: 'Pediatrics',
        rating: 4.8,
        image: 'https://i.pravatar.cc/100?img=5',
        nextAvailable: 'Friday, 3:00 PM',
        experience: '7 years',
        education: 'MD, University of Toronto',
      },
    ],
  },
  '3': {
    id: '3',
    name: 'Community Medical Group',
    address: '789 Pine Ln, Hamilton, ON',
    distance: 3.1,
    rating: 4.2,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1669930605340-801a0be1f5a3?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'A comprehensive medical group serving the Hamilton community with specialized care in internal medicine, cardiology, and dermatology. Our experienced team provides personalized treatment plans.',
    hours: {
      'Monday - Friday': '9:00 AM - 5:00 PM',
      'Saturday': 'Closed',
      'Sunday': 'Closed',
    },
    contact: {
      phone: '(555) 345-6789',
      email: 'info@communitymedical.com',
      website: 'www.communitymedical.com',
    },
    services: [
      'Internal Medicine',
      'Cardiology',
      'Dermatology',
      'Lab Services',
      'Health Screenings',
      'Chronic Disease Management',
    ],
    acceptedInsurances: [
      'Blue Cross',
      'Cigna',
      'Aetna',
      'Medicare',
    ],
    specialists: [
      {
        id: '6',
        name: 'Dr. David Wilson',
        specialty: 'Internal Medicine',
        rating: 4.3,
        image: 'https://i.pravatar.cc/100?img=6',
        nextAvailable: 'Thursday, 1:30 PM',
        experience: '15 years',
        education: 'MD, McMaster University',
      },
      {
        id: '7',
        name: 'Dr. Lisa Chen',
        specialty: 'Cardiology',
        rating: 4.5,
        image: 'https://i.pravatar.cc/100?img=7',
        nextAvailable: 'Next week, Tuesday',
        experience: '12 years',
        education: 'MD, University of Toronto',
      },
    ],
  },
  '4': {
    id: '4',
    name: 'Downtown Medical Center',
    address: '321 Business Blvd, London, ON',
    distance: 0.8,
    rating: 4.7,
    reviewCount: 142,
    image: 'https://plus.unsplash.com/premium_photo-1753267731393-dd5785991e5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Located in the heart of London, our medical center offers comprehensive healthcare services with extended hours and weekend availability. We pride ourselves on accessibility and quality care.',
    hours: {
      'Monday - Friday': '8:00 AM - 8:00 PM',
      'Saturday': '9:00 AM - 3:00 PM',
      'Sunday': 'Closed',
    },
    contact: {
      phone: '(555) 456-7890',
      email: 'info@downtownmedical.com',
      website: 'www.downtownmedical.com',
    },
    services: [
      'Primary Care',
      'Specialists',
      'Lab Services',
      'Urgent Care',
      'X-Ray & Imaging',
      'Vaccinations',
      'Health Screenings',
    ],
    acceptedInsurances: [
      'Aetna',
      'Blue Cross',
      'UnitedHealthcare',
      'Medicare',
      'Medicaid',
    ],
    specialists: [
      {
        id: '8',
        name: 'Dr. Maria Garcia',
        specialty: 'Primary Care',
        rating: 4.8,
        image: 'https://i.pravatar.cc/100?img=8',
        nextAvailable: 'Today, 5:00 PM',
        experience: '9 years',
        education: 'MD, University of Western Ontario',
      },
      {
        id: '9',
        name: 'Dr. James Thompson',
        specialty: 'Urgent Care',
        rating: 4.6,
        image: 'https://i.pravatar.cc/100?img=9',
        nextAvailable: 'Tomorrow, 10:00 AM',
        experience: '11 years',
        education: 'MD, Queen\'s University',
      },
    ],
  },
  '5': {
    id: '5',
    name: 'Kitchener Health Hub',
    address: '567 Queen St, Kitchener, ON',
    distance: 4.2,
    rating: 4.6,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'A modern healthcare hub serving the Kitchener community with comprehensive urgent care, pediatric services, and mental health support. Open 7 days a week for your convenience.',
    hours: {
      'Monday - Friday': '7:00 AM - 9:00 PM',
      'Saturday': '8:00 AM - 6:00 PM',
      'Sunday': '8:00 AM - 6:00 PM',
    },
    contact: {
      phone: '(555) 567-8901',
      email: 'info@kitchenerhealth.com',
      website: 'www.kitchenerhealth.com',
    },
    services: [
      'Urgent Care',
      'Pediatrics',
      'Mental Health',
      'Lab Services',
      'Vaccinations',
      'Health Screenings',
      'Telehealth',
    ],
    acceptedInsurances: [
      'Blue Cross',
      'Cigna',
      'Medicare',
      'Aetna',
    ],
    specialists: [
      {
        id: '10',
        name: 'Dr. Emily Watson',
        specialty: 'Urgent Care',
        rating: 4.7,
        image: 'https://i.pravatar.cc/100?img=10',
        nextAvailable: 'Today, 3:00 PM',
        experience: '8 years',
        education: 'MD, University of Waterloo',
      },
      {
        id: '11',
        name: 'Dr. Mark Anderson',
        specialty: 'Pediatrics',
        rating: 4.9,
        image: 'https://i.pravatar.cc/100?img=11',
        nextAvailable: 'Monday, 9:00 AM',
        experience: '13 years',
        education: 'MD, McMaster University',
      },
    ],
  },
  '6': {
    id: '6',
    name: 'Windsor Medical Plaza',
    address: '890 Riverside Dr, Windsor, ON',
    distance: 5.8,
    rating: 4.3,
    reviewCount: 64,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Serving the Windsor community with comprehensive family medicine, cardiology, and physical therapy services. Our team is dedicated to providing personalized, compassionate care.',
    hours: {
      'Monday - Friday': '8:00 AM - 6:00 PM',
      'Saturday': 'Closed',
      'Sunday': 'Closed',
    },
    contact: {
      phone: '(555) 678-9012',
      email: 'info@windsormedical.com',
      website: 'www.windsormedical.com',
    },
    services: [
      'Family Medicine',
      'Cardiology',
      'Physical Therapy',
      'Lab Services',
      'Health Screenings',
      'Chronic Disease Management',
    ],
    acceptedInsurances: [
      'Aetna',
      'UnitedHealthcare',
      'Blue Cross',
      'Medicare',
    ],
    specialists: [
      {
        id: '12',
        name: 'Dr. Patricia Brown',
        specialty: 'Family Medicine',
        rating: 4.4,
        image: 'https://i.pravatar.cc/100?img=12',
        nextAvailable: 'Wednesday, 2:00 PM',
        experience: '16 years',
        education: 'MD, University of Windsor',
      },
      {
        id: '13',
        name: 'Dr. Kevin Lee',
        specialty: 'Physical Therapy',
        rating: 4.6,
        image: 'https://i.pravatar.cc/100?img=13',
        nextAvailable: 'Friday, 11:00 AM',
        experience: '7 years',
        education: 'DPT, University of Toronto',
      },
    ],
  },
};

// Skeleton components for loading states
function ClinicDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-48" />
      </div>

      {/* Banner Skeleton */}
      <Skeleton className="h-48 w-full rounded-xl" />

      {/* Rating Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Cards Skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ClinicDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const clinicId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const clinic = mockClinicDetails[clinicId as keyof typeof mockClinicDetails];

  if (isLoading) {
    return <ClinicDetailsSkeleton />;
  }

  if (!clinic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Clinic Not Found</h2>
        <p className="text-muted-foreground mb-6">The clinic you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/clinics')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clinics
        </Button>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  return (
    <motion.div
      className="space-y-6 pb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with Back Button */}
      <motion.div className="flex items-center space-x-4" variants={itemVariants}>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Clinic Details</h1>
      </motion.div>

      {/* Clinic Banner */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border border-border rounded-xl">
          <div className="relative h-48 sm:h-64">
            <Image 
              src={clinic.image} 
              alt={clinic.name} 
              fill 
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 640px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{clinic.name}</h2>
              <div className="flex items-center text-white/90">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-sm sm:text-base">{clinic.address}</span>
              </div>
              <div className="flex items-center mt-2">
                <Badge className="bg-primary/90 text-primary-foreground border-0">
                  {clinic.distance.toFixed(1)} km away
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Rating and Quick Actions */}
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" 
        variants={itemVariants}
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="font-semibold text-foreground">{clinic.rating}</span>
            <span className="text-muted-foreground ml-1">({clinic.reviewCount} reviews)</span>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => router.push(`/book?clinicId=${clinicId}`)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Directions
          </Button>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div variants={itemVariants}>
        <Card className="border border-border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Heart className="h-5 w-5 mr-2 text-primary" />
              About This Clinic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{clinic.description}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Hours */}
      <motion.div variants={itemVariants}>
        <Card className="border border-border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Hours of Operation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(clinic.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="font-medium text-foreground">{day}</span>
                  <span className="text-muted-foreground">{hours}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Services */}
      <motion.div variants={itemVariants}>
        <Card className="border border-border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Stethoscope className="h-5 w-5 mr-2 text-primary" />
              Services Offered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clinic.services.map((service) => (
                <div key={service} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-foreground">{service}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Accepted Insurances */}
      <motion.div variants={itemVariants}>
        <Card className="border border-border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Accepted Insurance Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {clinic.acceptedInsurances.map((insurance) => (
                <Badge key={insurance} variant="secondary" className="text-xs">
                  {insurance}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Specialists */}
      <motion.div variants={itemVariants}>
        <Card className="border border-border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Available Specialists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clinic.specialists.map((specialist) => (
                <motion.div
                  key={specialist.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={specialist.image} alt={specialist.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {specialist.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground">{specialist.name}</h4>
                    <p className="text-sm text-muted-foreground">{specialist.specialty}</p>
                    <p className="text-xs text-muted-foreground mt-1">{specialist.education}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{specialist.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {specialist.experience} experience
                      </span>
                    </div>
                    <p className="text-sm text-green-600 mt-1 font-medium">
                      Next available: {specialist.nextAvailable}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      router.push(`/book?clinicId=${clinicId}&specialistId=${specialist.id}`)
                    }
                  >
                    Book Now
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Information */}
      <motion.div variants={itemVariants}>
        <Card className="border border-border rounded-xl">
          <CardHeader>
            <CardTitle className="text-foreground">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{clinic.contact.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{clinic.contact.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{clinic.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Book Appointment CTA */}
      <motion.div 
        className="text-center space-y-4 pt-4" 
        variants={itemVariants}
      >
        <Button
          size="lg"
          className="w-full max-w-md bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          onClick={() => router.push(`/book?clinicId=${clinicId}`)}
        >
          <Calendar className="h-5 w-5 mr-2" />
          Book an Appointment
        </Button>
        <p className="text-sm text-muted-foreground">
          Select a specialist and choose your preferred time slot
        </p>
      </motion.div>
    </motion.div>
  );
}
