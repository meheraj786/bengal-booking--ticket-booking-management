import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { sellerService } from "@/services/seller.service";
import { ApiError, type PaginatedResponse, type PaginationParams } from "@/lib/api-client";
import type { Booking } from "@/types/booking.types";

export const sellerBookingKeys = {
  all: ["sellerBookings"] as const,
  list: (eventId: string) =>
    [...sellerBookingKeys.all, "list", eventId] as const,
};

export function useSellerEventBookings(
  eventId: string,
  params?: PaginationParams,
): UseQueryResult<PaginatedResponse<Booking>, ApiError> {
  return useQuery({
    queryKey: [...sellerBookingKeys.list(eventId), params],
    queryFn: () => sellerService.getEventBookings(eventId, params),
    staleTime: 2 * 60 * 1000,
    enabled: !!eventId,
  });
}
