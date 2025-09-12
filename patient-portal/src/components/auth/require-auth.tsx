"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthStore } from "@twinn/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { account, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !account) {
      router.push("/signin");
    }
  }, [account, isLoading, router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      )
    );
  }

  if (!account) {
    return null; // Will redirect to signin
  }

  return <>{children}</>;
}
