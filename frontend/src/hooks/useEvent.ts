import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { eventService } from "@/services/event.service";
import { ApiError } from "@/lib/api-client";
import type { PaginatedResponse, PaginationParams } from "@/lib/api-client";
import type {
  Event,
  EventListFilters,
  EventFiltersResponse,
  CreateEventPayload,
  UpdateEventPayload,
} from "@/types/event.types";
import { queryKeys } from "@/lib/query-keys";

export const eventKeys = {
  all: ["events"] as const,
  list: (filters?: EventListFilters) =>
    [...eventKeys.all, "list", filters] as const,
  detail: (id: string) => [...eventKeys.all, "detail", id] as const,
  filters: () => [...eventKeys.all, "filters"] as const,
};

export function useEventList(
  filters?: EventListFilters,
): UseQueryResult<PaginatedResponse<Event>, ApiError> {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => eventService.list(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useEvent(id: string): UseQueryResult<Event, ApiError> {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventService.get(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useEventFilters(): UseQueryResult<
  EventFiltersResponse,
  ApiError
> {
  return useQuery({
    queryKey: eventKeys.filters(),
    queryFn: eventService.getFilters,
    staleTime: 30 * 60 * 1000,
  });
}

export function useCreateEvent(): UseMutationResult<
  Event,
  ApiError,
  CreateEventPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.list() });
      queryClient.invalidateQueries({ queryKey: eventKeys.filters() });
      queryClient.invalidateQueries({ queryKey: ["sellerEvents"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.sellerDashboard });
    },
  });
}

export function useUpdateEvent(
  id: string,
): UseMutationResult<Event, ApiError, UpdateEventPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => eventService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.list() });
      queryClient.invalidateQueries({ queryKey: eventKeys.filters() });
      queryClient.invalidateQueries({ queryKey: ["sellerEvents", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["sellerEvents"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.sellerDashboard });
    },
  });
}

export function usePublishEvent(
  id: string,
): UseMutationResult<Event, ApiError, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => eventService.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.list() });
      queryClient.invalidateQueries({ queryKey: eventKeys.filters() });
      queryClient.invalidateQueries({ queryKey: ["sellerEvents", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["sellerEvents"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.sellerDashboard });
    },
  });
}

export function useDeleteEvent(): UseMutationResult<Event, ApiError, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => eventService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.list() });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.filters() });
      queryClient.invalidateQueries({ queryKey: ["sellerEvents", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["sellerEvents"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.sellerDashboard });
    },
  });
}
