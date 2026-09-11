"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { queryKeys } from "@/lib/query-keys";

export function useUserDashboard() {
  return useQuery({
    queryKey: queryKeys.userDashboard,
    queryFn: dashboardService.user,
  });
}
export function useSellerDashboard() {
  return useQuery({
    queryKey: queryKeys.sellerDashboard,
    queryFn: dashboardService.seller,
  });
}
export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.adminDashboard,
    queryFn: dashboardService.admin,
  });
}
