"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Role } from "@/types/auth.types";
import { useAuthStore } from "@/hooks/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: Role[];
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredRoles,
  fallbackPath = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (!user || !requiredRoles.includes(user.role)) {
      router.push(fallbackPath);
    }
  }, [user, isLoading, requiredRoles, fallbackPath, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !requiredRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
