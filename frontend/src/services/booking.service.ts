import { apiClient } from "@/lib/api-client";
import type {
  Booking,
  CreateBookingPayload,
  CreateBookingResponse,
  CheckoutPayload,
  CheckoutResponse,
  ConfirmBookingPayload,
} from "@/types/booking.types";

export const bookingService = {
  list: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get<Booking[]>("/bookings");
    return data;
  },

  get: async (id: string): Promise<Booking> => {
    const { data } = await apiClient.get<Booking>(`/bookings/${id}`);
    return data;
  },

  create: async (
    payload: CreateBookingPayload,
  ): Promise<CreateBookingResponse> => {
    const { data } = await apiClient.post<CreateBookingResponse>(
      "/bookings",
      payload,
    );
    return data;
  },

  checkout: async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
    const { data } = await apiClient.post<CheckoutResponse>(
      "/bookings/checkout",
      payload,
    );
    return data;
  },

  confirm: async (
    id: string,
    payload: ConfirmBookingPayload,
  ): Promise<Booking> => {
    const { data } = await apiClient.post<Booking>(
      `/bookings/${id}/confirm`,
      payload,
    );
    return data;
  },

  expire: async (id: string): Promise<Booking> => {
    const { data } = await apiClient.post<Booking>(
      `/bookings/${id}/expire`,
      {},
    );
    return data;
  },
};
