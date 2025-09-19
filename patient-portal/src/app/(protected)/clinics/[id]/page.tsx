'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDirectoryStore } from '@twinn/store';
import { motion, Variants } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Heart,
  MapPin,
  Navigation,
  Phone,
  Star,
  Stethoscope,
  Users
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


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
  const { clinics, servicesByClinic, getSpecialistsByClinic } = useDirectoryStore();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const clinic = clinics.find(c => c.id === clinicId);
  const services = servicesByClinic[clinicId] || [];
  const specialists = getSpecialistsByClinic(clinicId);

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
        <Card className="overflow-hidden border border-border rounded-xl p-0">
          <div className="relative h-48 sm:h-64">
            {clinic.avatarUrl ? (
              <>
                <Image
                  src={clinic.avatarUrl}
                  alt={clinic.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
            )}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{clinic.name}</h2>
              <div className="flex items-center text-white/90">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-sm sm:text-base">{clinic.address}</span>
              </div>
              <div className="flex items-center mt-2">
                <Badge className="bg-primary/90 text-primary-foreground border-0">
                  {clinic.phone}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" 
        variants={itemVariants}
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="font-semibold text-foreground">4.5</span>
            <span className="text-muted-foreground ml-1">(12 reviews)</span>
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
            <p className="text-muted-foreground leading-relaxed">
              A comprehensive paramedical service provider offering specialized healthcare services 
              to the community. Our experienced team is dedicated to providing high-quality care 
              and personalized treatment plans for all our patients.
            </p>
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
              {services.map((service) => (
                <div key={service.id} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-foreground">{service.name}</span>
                </div>
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
              {specialists.map((specialist) => (
                <motion.div
                  key={specialist.userId}
                  className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={specialist.image} alt={specialist.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {specialist.name
                        .split(' ')
                        .map((n: string) => n[0])
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
                      {specialist.telehealth && (
                        <Badge variant="secondary" className="text-xs">
                          Telehealth Available
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Languages: {specialist.languages.join(', ')}
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
                      router.push(`/book?clinicId=${clinicId}&specialistId=${specialist.userId}`)
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
                <span className="text-foreground">{clinic.phone}</span>
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
