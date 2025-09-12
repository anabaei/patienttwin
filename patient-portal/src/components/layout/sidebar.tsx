"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuthStore, useNavigationStore } from "@twinn/store";
import {
    Bell,
    Calendar,
    Home,
    LogOut,
    MapPin,
    Settings,
    Shield,
    User,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and quick actions"
  },
  {
    name: "Find Clinics",
    href: "/clinics",
    icon: MapPin,
    description: "Search and browse clinics"
  },
  {
    name: "Book Appointment",
    href: "/book",
    icon: Calendar,
    description: "Schedule your appointment"
  },
  {
    name: "My Appointments",
    href: "/appointments",
    icon: Calendar,
    description: "Manage your bookings"
  },
  {
    name: "Insurance",
    href: "/insurance",
    icon: Shield,
    description: "Manage your coverage"
  }
];

const secondaryItems = [
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    description: "Personal information"
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    description: "Alerts and updates"
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "App preferences"
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { account, signOut } = useAuthStore();
  const { setMobileMenuOpen } = useNavigationStore();

  const handleSignOut = () => {
    signOut();
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">T</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">TwinnLinks</h1>
            <p className="text-xs text-muted-foreground">Patient Portal</p>
          </div>
        </div>
        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close menu</span>
        </Button>
      </div>

      {/* User Info */}
      {account && (
        <div className="px-6 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {account.firstName} {account.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {account.email}
              </p>
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate">{item.name}</p>
                <p className="text-xs opacity-75 truncate">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Secondary Navigation */}
      <nav className="px-4 py-4 space-y-1">
        {secondaryItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate">{item.name}</p>
                <p className="text-xs opacity-75 truncate">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Sign Out */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start space-x-3 text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
