"use client";

import { useAuth } from "@/hooks/useAuth";
import { AppNavigation } from "./AppNavigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Debug: Add visible indicator
  console.log("AuthenticatedLayout - user:", user, "loading:", loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Debug indicator */}
      <div className="fixed top-0 right-0 bg-red-500 text-white p-2 z-50 text-xs">
        AuthLayout: {user ? 'LOGGED IN' : 'NO USER'} | Role: {user?.profile?.role || 'NONE'}
      </div>
      
      <AppNavigation />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}