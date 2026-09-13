import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import { ApiError, type PaginatedResponse, type PaginationParams } from "@/lib/api-client";
import type { Payment } from "@/types/payment.types";

export const paymentKeys = {
  all: ["payments"] as const,
  list: () => [...paymentKeys.all, "list"] as const,
};

export function usePaymentList(params?: PaginationParams): UseQueryResult<PaginatedResponse<Payment>, ApiError> {
  return useQuery({
    queryKey: [...paymentKeys.list(), params],
    queryFn: () => paymentService.list(params),
    staleTime: 30_000,
  });
}
