import { apiClient } from "@/lib/api-client";
import type {
  Ticket,
  CreateTicketPayload,
  UpdateTicketPayload,
  CreateTicketsResponse,
} from "@/types/ticket.types";

export const ticketService = {
  list: async (eventId: string): Promise<Ticket[]> => {
    const { data } = await apiClient.get<Ticket[]>(
      `/events/${eventId}/tickets`,
    );
    return data;
  },

  create: async (
    eventId: string,
    payload: CreateTicketPayload,
  ): Promise<CreateTicketsResponse[]> => {
    const { data } = await apiClient.post<CreateTicketsResponse[]>(
      `/events/${eventId}/tickets`,
      payload,
    );
    return data;
  },

  update: async (
    eventId: string,
    ticketId: string,
    payload: UpdateTicketPayload,
  ): Promise<Ticket> => {
    const { data } = await apiClient.patch<Ticket>(
      `/events/${eventId}/tickets/${ticketId}`,
      payload,
    );
    return data;
  },
};
