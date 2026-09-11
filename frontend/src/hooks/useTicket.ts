import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { ticketService } from "@/services/ticket.service";
import { ApiError } from "@/lib/api-client";
import type {
  Ticket,
  CreateTicketPayload,
  UpdateTicketPayload,
  CreateTicketsResponse,
} from "@/types/ticket.types";

export const ticketKeys = {
  all: ["tickets"] as const,
  list: (eventId: string) => [...ticketKeys.all, "list", eventId] as const,
};

export function useTicketList(
  eventId: string,
): UseQueryResult<Ticket[], ApiError> {
  return useQuery({
    queryKey: ticketKeys.list(eventId),
    queryFn: () => ticketService.list(eventId),
    staleTime: 2 * 60 * 1000,
    enabled: !!eventId,
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
    },
  });
}
