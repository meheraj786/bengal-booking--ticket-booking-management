import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { ticketService } from "@/services/ticket.service";
import { ApiError, type PaginatedResponse, type PaginationParams } from "@/lib/api-client";
import type {
  Ticket,
  CreateTicketPayload,
  UpdateTicketPayload,
  CreateTicketsResponse,
} from "@/types/ticket.types";
import { eventKeys } from "@/hooks/useEvent";

export const ticketKeys = {
  all: ["tickets"] as const,
  list: (eventId: string) => [...ticketKeys.all, "list", eventId] as const,
};

export function useTicketList(
  eventId: string,
  params?: PaginationParams,
): UseQueryResult<PaginatedResponse<Ticket>, ApiError> {
  return useQuery({
    queryKey: [...ticketKeys.list(eventId), params],
    queryFn: () => ticketService.list(eventId, params),
    staleTime: 2 * 60 * 1000,
    enabled: !!eventId,
  });
}

export function useDeleteTicket(eventId: string): UseMutationResult<Ticket, ApiError, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId) => ticketService.delete(eventId, ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.list(eventId) });
      queryClient.invalidateQueries({ queryKey: ["sellerTickets", "list", eventId] });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useCreateTickets(
  eventId: string,
): UseMutationResult<CreateTicketsResponse[], ApiError, CreateTicketPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => ticketService.create(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.list(eventId) });
      queryClient.invalidateQueries({ queryKey: ["sellerTickets", "list", eventId] });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useUpdateTicket(
  eventId: string,
  ticketId: string,
): UseMutationResult<Ticket, ApiError, UpdateTicketPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => ticketService.update(eventId, ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.list(eventId) });
      queryClient.invalidateQueries({ queryKey: ["sellerTickets", "list", eventId] });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}
