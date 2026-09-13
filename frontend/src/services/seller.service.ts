import { apiClient, type PaginatedResponse, type PaginationParams } from "@/lib/api-client";
import type {
  Event,
  CreateEventPayload,
  UpdateEventPayload,
} from "@/types/event.types";
import type { Ticket, CreateTicketPayload } from "@/types/ticket.types";
import type { Booking } from "@/types/booking.types";

export const sellerService = {
  // Events
  getEvents: async (params?: PaginationParams): Promise<PaginatedResponse<Event>> => {
    const { data } = await apiClient.get<PaginatedResponse<Event>>("/events/seller/mine", { params });
    return data;
  },

  getEvent: async (id: string): Promise<Event> => {
    const { data } = await apiClient.get<Event>(`/events/seller/${id}`);
    return data;
  },

  createEvent: async (payload: CreateEventPayload): Promise<Event> => {
    const { data } = await apiClient.post<Event>("/events", payload);
    return data;
  },

  updateEvent: async (
    id: string,
    payload: UpdateEventPayload,
  ): Promise<Event> => {
    const { data } = await apiClient.patch<Event>(`/events/${id}`, payload);
    return data;
  },

  publishEvent: async (id: string): Promise<Event> => {
    const { data } = await apiClient.post<Event>(`/events/${id}/publish`, {});
    return data;
  },

  deleteEvent: async (id: string): Promise<Event> => {
    const { data } = await apiClient.delete<Event>(`/events/${id}`);
    return data;
  },

  // Tickets
  getEventTickets: async (eventId: string, params?: PaginationParams): Promise<PaginatedResponse<Ticket>> => {
    const { data } = await apiClient.get<PaginatedResponse<Ticket>>(
      `/events/${eventId}/tickets`,
      { params },
    );
    return data;
  },

  createTickets: async (
    eventId: string,
    payload: CreateTicketPayload,
  ): Promise<Ticket[]> => {
    const { data } = await apiClient.post<Ticket[]>(
      `/events/${eventId}/tickets`,
      payload,
    );
    return data;
  },

  updateTicket: async (
    eventId: string,
    ticketId: string,
    payload: { status?: string; name?: string; description?: string; price?: number },
  ): Promise<Ticket> => {
    const { data } = await apiClient.patch<Ticket>(
      `/events/${eventId}/tickets/${ticketId}`,
      payload,
    );
    return data;
  },

  getEventBookings: async (eventId: string, params?: PaginationParams): Promise<PaginatedResponse<Booking>> => {
    const { data } = await apiClient.get<PaginatedResponse<Booking>>(`/bookings/event/${eventId}`, { params });
    return data;
  },

  deleteTicket: async (eventId: string, ticketId: string): Promise<Ticket> => {
    const { data } = await apiClient.delete<Ticket>(`/events/${eventId}/tickets/${ticketId}`);
    return data;
  },
};
