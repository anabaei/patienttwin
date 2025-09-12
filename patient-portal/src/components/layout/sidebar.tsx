"use client";

import { UserDropdown } from "@/components/layout/user-dropdown";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@twinn/store";
import {
    Calendar,
    Home,
    MapPin,
    Settings,
    Shield
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
  const { account } = useAuthStore();

  return (
    <div className="flex h-full flex-col bg-card border-r border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 flex-shrink-0">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs md:text-sm font-bold text-primary-foreground">T</span>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-semibold text-foreground">TwinnLinks</h1>
            <p className="text-xs text-muted-foreground">Patient Portal</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 min-h-0 px-3 md:px-4 py-3 md:py-4 space-y-1 overflow-y-auto">
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

      {/* User Dropdown */}
      {account && (
        <>
          <Separator />
          <div className="p-2 md:p-3">
            <UserDropdown className="flex-shrink-0" />
          </div>
        </>
      )}

    </div>
  );
}
