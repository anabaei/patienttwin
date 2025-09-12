"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DashboardAppointmentSkeleton,
  DashboardBalanceSkeleton,
  DashboardNotificationsSkeleton,
  DashboardQuickActionsSkeleton,
  DashboardStatsSkeleton
} from "@/components/ui/skeletons";
import { useAppointmentsStore, useAuthStore, useInsuranceStore } from "@twinn/store";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Building2,
  Calendar,
  Plus,
  Shield,
  User,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { account } = useAuthStore();
  const { connectedPlan } = useInsuranceStore();
  const { appointments } = useAppointmentsStore();
  
  // Simulate loading state for demo purposes
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Get next appointment (sorted by date, closest first)
  const nextAppointment = appointments
    .filter(apt => new Date(apt.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];

  // Get upcoming appointments count
  const upcomingAppointmentsCount = appointments.filter(apt => 
    new Date(apt.scheduledAt) > new Date()
  ).length;

  // Mock data for balances and stats
  const mockBalances = {
    hsa: 800,
    wsa: 450,
    total: 1250
  };

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
            Welcome back, {account?.patient?.firstName || 'Patient'}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your healthcare journey.
          </p>
        </motion.div>

        {/* Priority 1: Account Balances - Most Important */}
        <motion.div className="mb-6" variants={itemVariants}>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary text-lg">
                <Wallet className="h-5 w-5" />
                Your Healthcare Account Balances
              </CardTitle>
              <CardDescription>
                Use your funds for healthcare expenses and appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <motion.div 
                  className="text-center p-4 bg-secondary/10 rounded-lg border border-secondary/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl font-bold text-primary mb-1">${mockBalances.hsa}</div>
                  <div className="text-sm font-medium text-primary">HSA Balance</div>
                  <div className="text-xs text-muted-foreground">Health Savings Account</div>
                </motion.div>
                <motion.div 
                  className="text-center p-4 bg-secondary/10 rounded-lg border border-secondary/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl font-bold text-secondary-foreground mb-1">${mockBalances.wsa}</div>
                  <div className="text-sm font-medium text-secondary-foreground">WSA Balance</div>
                  <div className="text-xs text-muted-foreground">Wellness Savings Account</div>
                </motion.div>
                <motion.div 
                  className="text-center p-4 bg-accent/10 rounded-lg border-2 border-accent/30"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl font-bold mb-1">${mockBalances.total.toLocaleString()}</div>
                  <div className="text-sm font-medium">Total Available</div>
                  <div className="text-xs text-muted-foreground">Ready to use</div>
                </motion.div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="flex-1">
                  <Link href="/book">
                    <Plus className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/balances">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
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
                        {new Date(nextAppointment.scheduledAt).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric' 
                        })} at {new Date(nextAppointment.scheduledAt).toLocaleTimeString('en-US', { 
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
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Notifications */}
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Notifications
                  </CardTitle>
                  <CardDescription>Latest updates and reminders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {mockNotifications.map((notification, index) => (
                      <motion.div 
                        key={notification.id}
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (index * 0.1) }}
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.isRead ? 'bg-muted' : 'bg-primary'
                        }`}></div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/notifications">
                      View All Notifications
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <Button variant="outline" className="justify-start h-auto p-4" asChild>
                      <Link href="/book">
                        <Calendar className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Book New Appointment</div>
                          <div className="text-xs text-muted-foreground">Schedule with specialists</div>
                        </div>
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4" asChild>
                      <Link href="/clinics">
                        <Building2 className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Find Clinics</div>
                          <div className="text-xs text-muted-foreground">Browse nearby locations</div>
                        </div>
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4" asChild>
                      <Link href="/insurance">
                        <Shield className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Manage Insurance</div>
                          <div className="text-xs text-muted-foreground">Update coverage details</div>
                        </div>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
