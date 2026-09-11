import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import { ApiError } from "@/lib/api-client";
import type {
  Booking,
  CreateBookingPayload,
  CreateBookingResponse,
  CheckoutPayload,
  CheckoutResponse,
  ConfirmBookingPayload,
} from "@/types/booking.types";

export const bookingKeys = {
  all: ["bookings"] as const,
  list: () => [...bookingKeys.all, "list"] as const,
  detail: (id: string) => [...bookingKeys.all, "detail", id] as const,
};

export function useBookingList(): UseQueryResult<Booking[], ApiError> {
  return useQuery({
    queryKey: bookingKeys.list(),
    queryFn: bookingService.list,
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
    },
  });
}

export function useCheckoutBooking(): UseMutationResult<
  CheckoutResponse,
  ApiError,
  CheckoutPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.checkout,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.detail(data.bookingId),
      });
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
    },
  });
}
