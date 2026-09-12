import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { ApiError } from "@/lib/api-client";
import { divisionService } from "@/services/division.service";
import type {
  CreateDivisionPayload,
  Division,
  UpdateDivisionPayload,
} from "@/types/division.types";

export const divisionKeys = {
  all: ["divisions"] as const,
  list: () => [...divisionKeys.all, "list"] as const,
  detail: (id: string) => [...divisionKeys.all, "detail", id] as const,
};

export function useDivisionList(): UseQueryResult<Division[], ApiError> {
  return useQuery({
    queryKey: divisionKeys.list(),
    queryFn: divisionService.list,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDivision(): UseMutationResult<
  Division,
  ApiError,
  CreateDivisionPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: divisionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: divisionKeys.list() });
    },
  });
}

export function useUpdateDivision(
  id: string,
): UseMutationResult<Division, ApiError, UpdateDivisionPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => divisionService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: divisionKeys.list() });
      queryClient.invalidateQueries({ queryKey: divisionKeys.detail(id) });
    },
  });
}

export function useDeleteDivision(): UseMutationResult<
  Division,
  ApiError,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: divisionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: divisionKeys.list() });
    },
  });
}
