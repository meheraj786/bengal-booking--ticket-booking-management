import { apiClient } from "@/lib/api-client";
import type {
  Event,
  CreateEventPayload,
  UpdateEventPayload,
} from "@/types/event.types";
import type { Ticket, CreateTicketPayload } from "@/types/ticket.types";
import type { Booking } from "@/types/booking.types";

export const sellerService = {
  // Events
  getEvents: async (): Promise<Event[]> => {
    const { data } = await apiClient.get<Event[]>("/events");
    return data;
  },

  getEvent: async (id: string): Promise<Event> => {
    const { data } = await apiClient.get<Event>(`/events/${id}`);
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
  getEventTickets: async (eventId: string): Promise<Ticket[]> => {
    const { data } = await apiClient.get<Ticket[]>(
      `/events/${eventId}/tickets`,
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
    payload: { status?: string; note?: string },
  ): Promise<Ticket> => {
    const { data } = await apiClient.patch<Ticket>(
      `/events/${eventId}/tickets/${ticketId}`,
      payload,
    );
    return data;
  },

  // Bookings (read-only for seller's events)
  getEventBookings: async (eventId: string): Promise<Booking[]> => {
    // This endpoint doesn't exist yet, we'll need to add it to backend
    // For now, we'll fetch all bookings and filter by event
    const { data } = await apiClient.get<Booking[]>("/bookings");
    return data.filter((b) => b.eventId === eventId);
  },
};
