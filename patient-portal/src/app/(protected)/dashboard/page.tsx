"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompactBalanceSummary } from "@/components/ui/compact-balance-summary";
import { DashboardHealthcareCarousel } from "@/components/ui/dashboard-healthcare-carousel";
import {
  DashboardAppointmentSkeleton,
  DashboardBalanceSkeleton,
  DashboardNotificationsSkeleton,
  DashboardQuickActionsSkeleton,
  DashboardStatsSkeleton
} from "@/components/ui/skeletons";
import type { Appointment, Clinic, Service, User as StoreUser } from "@twinn/store";
import { useAppointmentsStore, useAuthStore, useInsuranceStore } from "@twinn/store";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Building2,
  Calendar,
  DollarSign,
  Heart,
  Plus,
  Shield,
  TrendingUp,
  User
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Extended appointment type with nested data for display
interface ExtendedAppointment extends Appointment {
  specialist?: StoreUser & { specialties?: string[] };
  service?: Service;
  clinic?: Clinic;
  scheduledAt?: string; // Alias for startTime for backward compatibility
}

export default function DashboardPage() {
  const { account } = useAuthStore();
  const { connectedPlan } = useInsuranceStore();
  const { appointments } = useAppointmentsStore();
  
  // Simulate loading state for demo purposes
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for demonstration
  const mockSpecialists: (StoreUser & { specialties?: string[] })[] = [
    {
      id: '1',
      email: 'dr.chen@clinic.com',
      firstName: 'Amelia',
      lastName: 'Chen',
      role: 'SPECIALIST',
      avatarUrl: 'https://i.pravatar.cc/100?img=1',
      auditMetadata: {},
      specialties: ['Internal Medicine']
    },
    {
      id: '2',
      email: 'dr.rodriguez@clinic.com',
      firstName: 'Michael',
      lastName: 'Rodriguez',
      role: 'SPECIALIST',
      avatarUrl: 'https://i.pravatar.cc/100?img=2',
      auditMetadata: {},
      specialties: ['Family Medicine']
    }
  ];

  const mockServices: Service[] = [
    { id: '1', clinicId: '1', name: 'General Consultation' },
    { id: '2', clinicId: '1', name: 'Follow-up Visit' },
    { id: '3', clinicId: '1', name: 'Annual Physical' }
  ];

  const mockClinics: Clinic[] = [
    {
      id: '1',
      organizationId: 'org1',
      name: 'City Health Center',
      address: '123 Main St, Toronto, ON',
      phone: '(555) 123-4567',
      timezone: 'America/Toronto',
      avatarUrl: 'https://images.unsplash.com/photo-1631507623112-0092cef9c70d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      isDeleted: false
    }
  ];

  // Transform appointments to include nested data
  const extendedAppointments: ExtendedAppointment[] = appointments.map(apt => ({
    ...apt,
    specialist: mockSpecialists.find(s => s.id === apt.specialistId),
    service: mockServices.find(s => s.id === apt.serviceId),
    clinic: mockClinics.find(c => c.id === apt.clinicId),
    scheduledAt: apt.startTime // Alias for backward compatibility
  }));
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Get next appointment (sorted by date, closest first)
  const nextAppointment = extendedAppointments
    .filter(apt => new Date(apt.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

  // Get upcoming appointments count
  const upcomingAppointmentsCount = extendedAppointments.filter(apt => 
    new Date(apt.startTime) > new Date()
  ).length;

  // Mock data for balances and stats
  const mockBalances = [
    {
      label: "HSA Balance",
      amount: 800,
      description: "Health Savings Account",
      icon: <Heart className="h-4 w-4" />,
      color: "primary" as const
    },
    {
      label: "WSA Balance", 
      amount: 450,
      description: "Wellness Savings Account",
      icon: <TrendingUp className="h-4 w-4" />,
      color: "secondary" as const
    },
    {
      label: "Total Available",
      amount: 1250,
      description: "Ready to use",
      icon: <DollarSign className="h-4 w-4" />,
      color: "accent" as const
    }
  ];

  const mockStats = {
    notifications: 3,
    clinics: 2,
    upcomingAppointments: upcomingAppointmentsCount
  };

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      title: "Lab results ready",
      time: "2 hours ago",
      isRead: false,
      type: "lab"
    },
    {
      id: 2,
      title: "Appointment reminder",
      time: "1 day ago",
      isRead: false,
      type: "appointment"
    },
    {
      id: 3,
      title: connectedPlan ? "Insurance verified" : "Insurance update needed",
      time: "3 days ago",
      isRead: true,
      type: "insurance"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-background to-muted/30 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Welcome Section Skeleton */}
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-4 w-80 bg-muted animate-pulse rounded" />
          </div>
          
          {/* Balance Section Skeleton */}
          <DashboardBalanceSkeleton />
          
          {/* Next Appointment Skeleton */}
          <DashboardAppointmentSkeleton />
          
          {/* Stats Grid Skeleton */}
          <DashboardStatsSkeleton />
          
          {/* Main Content Grid Skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            <DashboardNotificationsSkeleton />
            <DashboardQuickActionsSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-background to-muted/30 py-8 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {account?.firstName || 'Patient'}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your healthcare journey.
          </p>
        </motion.div>

        {/* Priority 1: Healthcare Service Balances - Most Important */}
        <motion.div className="mb-6" variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Healthcare Services
              </CardTitle>
              <CardDescription>
                Your available healthcare service balances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardHealthcareCarousel />
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Balance Summary */}
        <motion.div className="mb-6" variants={itemVariants}>
          <CompactBalanceSummary
            balances={{
              hsa: 1250,
              wsa: 3200,
              total: 4450
            }}
            showDetails={true}
          />
        </motion.div>

        {/* Priority 2: Next Appointment */}
        {nextAppointment && (
          <motion.div className="mb-6" variants={itemVariants}>
            <Card className="border-success/20 bg-success/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-success text-lg">
                  <Calendar className="h-5 w-5" />
                  Your Next Appointment
                </CardTitle>
                <CardDescription>Upcoming appointment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      Dr. {nextAppointment.specialist?.firstName} {nextAppointment.specialist?.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {nextAppointment.specialist?.specialties?.[0] || 'General Practice'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {nextAppointment.service?.name || 'Consultation'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date & Time</span>
                      <span className="font-medium">
                        {nextAppointment.scheduledAt && new Date(nextAppointment.scheduledAt).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric' 
                        })} at {nextAppointment.scheduledAt && new Date(nextAppointment.scheduledAt).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">{nextAppointment.clinic?.name || 'Clinic Location'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Reschedule
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Priority 3: Quick Stats Grid - Important Overview */}
        <motion.div className="mb-6" variants={itemVariants}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.upcomingAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockStats.upcomingAppointments === 0 ? 'No upcoming appointments' : 
                     mockStats.upcomingAppointments === 1 ? 'Next appointment scheduled' : 
                     'Appointments scheduled'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Insurance Status</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{connectedPlan ? 'Active' : 'Pending'}</div>
                  <p className="text-xs text-muted-foreground">
                    {connectedPlan ? 'Coverage verified' : 'Setup required'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockNotifications.filter(n => !n.isRead).length}</div>
                  <p className="text-xs text-muted-foreground">Unread messages</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Priority 4: Main Content Grid */}
       
      </div>
    </motion.div>
  );
}
