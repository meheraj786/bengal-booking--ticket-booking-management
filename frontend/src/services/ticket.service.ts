import { apiClient, type PaginatedResponse, type PaginationParams } from "@/lib/api-client";
import type {
  Ticket,
  CreateTicketPayload,
  UpdateTicketPayload,
  CreateTicketsResponse,
} from "@/types/ticket.types";

export const ticketService = {
  list: async (eventId: string, params?: PaginationParams): Promise<PaginatedResponse<Ticket>> => {
    const { data } = await apiClient.get<PaginatedResponse<Ticket>>(
      `/events/${eventId}/tickets`,
      { params },
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
  delete: async (eventId: string, ticketId: string): Promise<Ticket> => {
    const { data } = await apiClient.delete<Ticket>(`/events/${eventId}/tickets/${ticketId}`);
    return data;
  },
};
