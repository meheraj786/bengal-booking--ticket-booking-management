import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { areaService } from "@/services/area.service";
import { ApiError } from "@/lib/api-client";
import type {
  Area,
  CreateAreaPayload,
  UpdateAreaPayload,
} from "@/types/area.types";

export const areaKeys = {
  all: ["areas"] as const,
  list: () => [...areaKeys.all, "list"] as const,
  detail: (id: string) => [...areaKeys.all, "detail", id] as const,
};

export function useAreaList(): UseQueryResult<Area[], ApiError> {
  return useQuery({
    queryKey: areaKeys.list(),
    queryFn: areaService.list,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaKeys.list() });
    },
  });
}
