import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { sellerService } from "@/services/seller.service";
import { ApiError } from "@/lib/api-client";
import type {
  Event,
  CreateEventPayload,
  UpdateEventPayload,
} from "@/types/event.types";

export const sellerEventKeys = {
  all: ["sellerEvents"] as const,
  list: () => [...sellerEventKeys.all, "list"] as const,
  detail: (id: string) => [...sellerEventKeys.all, "detail", id] as const,
};

export function useSellerEventList(): UseQueryResult<Event[], ApiError> {
  return useQuery({
    queryKey: sellerEventKeys.list(),
    queryFn: sellerService.getEvents,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSellerEvent(id: string): UseQueryResult<Event, ApiError> {
  return useQuery({
    queryKey: sellerEventKeys.detail(id),
    queryFn: () => sellerService.getEvent(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCreateSellerEvent(): UseMutationResult<
  Event,
  ApiError,
  CreateEventPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sellerService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerEventKeys.list() });
    },
  });
}

export function useUpdateSellerEvent(
  id: string,
): UseMutationResult<Event, ApiError, UpdateEventPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => sellerService.updateEvent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerEventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: sellerEventKeys.list() });
    },
  });
}

export function usePublishSellerEvent(
  id: string,
): UseMutationResult<Event, ApiError, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sellerService.publishEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerEventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: sellerEventKeys.list() });
    },
  });
}

export function useDeleteSellerEvent(): UseMutationResult<
  Event,
  ApiError,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => sellerService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerEventKeys.list() });
    },
  });
}
