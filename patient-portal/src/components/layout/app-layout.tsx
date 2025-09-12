"use client";

import { RequireAuth } from "@/components/auth/require-auth";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigationStore } from "@twinn/store";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen, setCurrentPath } = useNavigationStore();

  // Update current path when route changes
  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname, setCurrentPath]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        {/* Desktop/Tablet Layout */}
        <div className="hidden md:flex min-h-screen">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col min-h-screen">
          {/* Mobile Header */}
          <header className="sticky top-0 z-50 bg-background border-b border-border">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-3">
                <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    <Sidebar />
                  </SheetContent>
                </Sheet>
                <h1 className="text-lg font-semibold text-foreground">
                  TwinnLinks
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                {/* Theme toggle or user menu could go here */}
              </div>
            </div>
          </header>

          {/* Mobile Main Content */}
          <main className="flex-1 overflow-auto pb-20">
            <div className="p-4">
              {children}
            </div>
          </main>

          {/* Bottom Navigation */}
          <BottomNavigation />
        </div>
      </div>
    </RequireAuth>
  );
}
