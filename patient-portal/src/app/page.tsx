"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@twinn/store";
import { Calendar, Heart, MapPin, Shield } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TwinnLinks</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-12 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your Health, Your Schedule
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            Book appointments with healthcare providers across Ontario. 
            Find specialists, manage your insurance, and take control of your healthcare journey.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="btn-mobile-lg" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button variant="outline" size="lg" className="btn-mobile-lg" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="secondary" size="lg" className="btn-mobile-lg" asChild>
              <Link href="/insurance">Insurance</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="card-healthcare">
            <CardHeader className="text-center">
              <Calendar className="mx-auto h-8 w-8 text-primary" />
              <CardTitle className="text-lg">Easy Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Schedule appointments in minutes with our intuitive booking system
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-healthcare">
            <CardHeader className="text-center">
              <Shield className="mx-auto h-8 w-8 text-primary" />
              <CardTitle className="text-lg">Insurance Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Connect your insurance and see real-time coverage and costs
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-healthcare">
            <CardHeader className="text-center">
              <MapPin className="mx-auto h-8 w-8 text-primary" />
              <CardTitle className="text-lg">Ontario Wide</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Find healthcare providers across Ontario with location-based search
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-healthcare">
            <CardHeader className="text-center">
              <Heart className="mx-auto h-8 w-8 text-primary" />
              <CardTitle className="text-lg">Professional Care</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Access qualified specialists and healthcare professionals
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Status Badge */}
      <section className="container px-4 py-8">
        <div className="flex justify-center">
          <Badge variant="secondary" className="px-4 py-2">
            🚀 Mobile-First Design • 🌙 Dark Mode • ♿ Accessible
          </Badge>
        </div>
      </section>

    </div>
  );
}