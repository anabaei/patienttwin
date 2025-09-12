"use client";

import { cn } from "@/lib/utils";
import { useNavigationStore } from "@twinn/store";
import { Calendar, Home, MapPin, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const bottomNavItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
    label: "Dashboard"
  },
  {
    name: "Clinics",
    href: "/clinics",
    icon: MapPin,
    label: "Find Clinics"
  },
  {
    name: "Book",
    href: "/book",
    icon: Calendar,
    label: "Book Appointment"
  },
  {
    name: "Insurance",
    href: "/insurance",
    icon: Shield,
    label: "Insurance"
  }
];

export function BottomNavigation() {
  const pathname = usePathname();
  const { setCurrentPath } = useNavigationStore();

  const handleNavigation = (href: string) => {
    setCurrentPath(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-bottom">
      <div className="grid grid-cols-4 h-16">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5 transition-transform",
                  isActive && "scale-110"
                )} 
              />
              <span className="text-xs font-medium truncate max-w-full px-1">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
