import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { sellerService } from "@/services/seller.service";
import { ApiError, type PaginatedResponse, type PaginationParams } from "@/lib/api-client";
import type { Ticket, CreateTicketPayload, UpdateTicketPayload } from "@/types/ticket.types";

export const sellerTicketKeys = {
  all: ["sellerTickets"] as const,
  list: (eventId: string) =>
    [...sellerTicketKeys.all, "list", eventId] as const,
};

export function useSellerTicketList(
  eventId: string,
  params?: PaginationParams,
): UseQueryResult<PaginatedResponse<Ticket>, ApiError> {
  return useQuery({
    queryKey: [...sellerTicketKeys.list(eventId), params],
    queryFn: () => sellerService.getEventTickets(eventId, params),
    staleTime: 2 * 60 * 1000,
    enabled: !!eventId,
  });
}

export function useCreateSellerTickets(
  eventId: string,
): UseMutationResult<Ticket[], ApiError, CreateTicketPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => sellerService.createTickets(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sellerTicketKeys.list(eventId),
      });
      queryClient.invalidateQueries({ queryKey: ["tickets", "list", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events", "list"] });
    },
  });
}

export function useUpdateSellerTicket(
  eventId: string,
  ticketId: string,
): UseMutationResult<Ticket, ApiError, UpdateTicketPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      sellerService.updateTicket(eventId, ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sellerTicketKeys.list(eventId),
      });
      queryClient.invalidateQueries({ queryKey: ["tickets", "list", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events", "list"] });
    },
  });
}

export function useDeleteSellerTicket(eventId: string): UseMutationResult<Ticket, ApiError, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId) => sellerService.deleteTicket(eventId, ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerTicketKeys.list(eventId) });
      queryClient.invalidateQueries({ queryKey: ["tickets", "list", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events", "list"] });
    },
  });
}
