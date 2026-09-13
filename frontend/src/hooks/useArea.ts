import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { areaService } from "@/services/area.service";
import { ApiError } from "@/lib/api-client";
import type { PaginatedResponse, PaginationParams } from "@/lib/api-client";
import type {
  Area,
  CreateAreaPayload,
  UpdateAreaPayload,
} from "@/types/area.types";
import { eventKeys } from "@/hooks/useEvent";

export const areaKeys = {
  all: ["areas"] as const,
  list: () => [...areaKeys.all, "list"] as const,
  detail: (id: string) => [...areaKeys.all, "detail", id] as const,
};

export function useAreaList(params?: PaginationParams): UseQueryResult<PaginatedResponse<Area>, ApiError> {
  return useQuery({
    queryKey: [...areaKeys.list(), params],
    queryFn: () => areaService.list(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateArea(): UseMutationResult<
  Area,
  ApiError,
  CreateAreaPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: areaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaKeys.list() });
      queryClient.invalidateQueries({ queryKey: eventKeys.list() });
      queryClient.invalidateQueries({ queryKey: eventKeys.filters() });
    },
  });
}

export function useUpdateArea(
  id: string,
): UseMutationResult<Area, ApiError, UpdateAreaPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => areaService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaKeys.list() });
      queryClient.invalidateQueries({ queryKey: areaKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.list() });
      queryClient.invalidateQueries({ queryKey: eventKeys.filters() });
    },
  });
}

export function useDeleteArea(): UseMutationResult<
  { message: string },
  ApiError,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => areaService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: areaKeys.list() });
      queryClient.invalidateQueries({ queryKey: areaKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.list() });
      queryClient.invalidateQueries({ queryKey: eventKeys.filters() });
    },
  });
}
