"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthcareCornerButton } from "@/components/ui/healthcare-corner-button";
import { HealthcareHero } from "@/components/ui/healthcare-hero";
import { useAuthStore } from "@twinn/store";
import {
  Calendar,
  CheckCircle,
  Clock,
  Facebook,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  Twitter,
  Users
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { account } = useAuthStore();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (account) {
      router.push("/dashboard");
    }
  }, [account, router]);
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TwinnLinks</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section with Animated Shapes */}
      <HealthcareHero />

      {/* Trust Indicators */}
      <section className="py-8 bg-muted/20">
        <div className="container px-4">
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Healthcare Providers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Patients Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for your healthcare journey
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From booking appointments to managing insurance, we've got you covered
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Easy Booking</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Schedule appointments in minutes with our intuitive booking system. 
                View real-time availability and get instant confirmations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Insurance Integration</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect your insurance and see real-time coverage and costs. 
                No surprises, just transparent pricing.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Ontario Wide</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find healthcare providers across Ontario with location-based search. 
                From Toronto to Thunder Bay, we've got you covered.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Professional Care</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access qualified specialists and healthcare professionals. 
                All providers are verified and licensed.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>24/7 Access</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Book appointments anytime, anywhere. Our platform is always available 
                when you need it most.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Patient Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get help when you need it with our dedicated patient support team. 
                We're here to make healthcare accessible.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30">
        <div className="container px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What our patients say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of satisfied patients across Ontario
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "TwinnLinks made finding and booking my specialist appointment so easy. 
                  The insurance integration saved me so much time and hassle."
                </p>
                <div className="font-semibold">Sarah M.</div>
                <div className="text-sm text-muted-foreground">Toronto, ON</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "I love how I can see all my appointments in one place and get 
                  reminders. The mobile app is fantastic!"
                </p>
                <div className="font-semibold">Michael R.</div>
                <div className="text-sm text-muted-foreground">Ottawa, ON</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Finally, a healthcare platform that actually works! The interface 
                  is clean, fast, and I can find providers near me instantly."
                </p>
                <div className="font-semibold">Jennifer L.</div>
                <div className="text-sm text-muted-foreground">Hamilton, ON</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to take control of your healthcare?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of patients who have simplified their healthcare journey
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <HealthcareCornerButton 
              variant="primary" 
              className="btn-mobile-lg"
              onClick={() => window.location.href = '/signin'}
            >
              Get Started Today
            </HealthcareCornerButton>
            <HealthcareCornerButton 
              variant="outline" 
              className="btn-mobile-lg"
              onClick={() => window.location.href = '/clinics'}
            >
              Browse Providers
            </HealthcareCornerButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">TwinnLinks</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting patients with healthcare providers across Ontario. 
                Your health, your schedule, your choice.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">For Patients</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/book" className="hover:text-primary">Book Appointment</Link></li>
                <li><Link href="/insurance" className="hover:text-primary">Insurance</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>1-800-TWINN-LINKS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@twinnlinks.ca</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 TwinnLinks. All rights reserved. Made with ❤️ in Ontario, Canada.</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}