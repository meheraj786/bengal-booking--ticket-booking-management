import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import { ApiError } from "@/lib/api-client";
import type { PaginatedResponse, PaginationParams } from "@/lib/api-client";
import type {
  Booking,
  CreateBookingPayload,
  CreateBookingResponse,
  CheckoutPayload,
  ConfirmBookingPayload,
} from "@/types/booking.types";
import { sellerBookingKeys } from "@/hooks/useSellerBooking";
import { paymentKeys } from "@/hooks/usePayment";
import { queryKeys } from "@/lib/query-keys";

export const bookingKeys = {
  all: ["bookings"] as const,
  list: () => [...bookingKeys.all, "list"] as const,
  detail: (id: string) => [...bookingKeys.all, "detail", id] as const,
};

export function useBookingList(params?: PaginationParams): UseQueryResult<PaginatedResponse<Booking>, ApiError> {
  return useQuery({
    queryKey: [...bookingKeys.list(), params],
    queryFn: () => bookingService.list(params),
    staleTime: 30 * 1000,
  });
}

export function useBooking(id: string): UseQueryResult<Booking, ApiError> {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingService.get(id),
    staleTime: 30 * 1000,
    enabled: !!id,
  });
}

export function useCreateBooking(): UseMutationResult<
  CreateBookingResponse,
  ApiError,
  CreateBookingPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.create,
    onSuccess: (data) => {
      queryClient.setQueryData(
        bookingKeys.detail(data.bookingId),
        (old: Booking | undefined) => ({
          ...old,
          id: data.bookingId,
          expiresAt: data.expiresAt,
        }),
      );
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      queryClient.invalidateQueries({ queryKey: sellerBookingKeys.all });
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.userDashboard });
    },
  });
}

export function useCheckoutBooking(): UseMutationResult<
  Booking,
  ApiError,
  CheckoutPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.checkout,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.detail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      queryClient.invalidateQueries({ queryKey: sellerBookingKeys.all });
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.userDashboard });
    },
  });
}

export function useConfirmBooking(
  id: string,
): UseMutationResult<Booking, ApiError, ConfirmBookingPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => bookingService.confirm(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: sellerBookingKeys.all });
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.userDashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}

export function useExpireBooking(
  id: string,
): UseMutationResult<Booking, ApiError, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => bookingService.expire(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: sellerBookingKeys.all });
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.userDashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}

export function useCancelBooking(id: string): UseMutationResult<Booking, ApiError, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => bookingService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: sellerBookingKeys.all });
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.userDashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}
