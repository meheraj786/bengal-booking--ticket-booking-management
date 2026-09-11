import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { sellerService } from "@/services/seller.service";
import { ApiError } from "@/lib/api-client";
import type { Ticket, CreateTicketPayload } from "@/types/ticket.types";

export const sellerTicketKeys = {
  all: ["sellerTickets"] as const,
  list: (eventId: string) =>
    [...sellerTicketKeys.all, "list", eventId] as const,
};

export function useSellerTicketList(
  eventId: string,
): UseQueryResult<Ticket[], ApiError> {
  return useQuery({
    queryKey: sellerTicketKeys.list(eventId),
    queryFn: () => sellerService.getEventTickets(eventId),
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
    },
  });
}

export function useUpdateSellerTicket(
  eventId: string,
  ticketId: string,
): UseMutationResult<Ticket, ApiError, { status?: string; note?: string }> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      sellerService.updateTicket(eventId, ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sellerTicketKeys.list(eventId),
      });
    },
  });
}
