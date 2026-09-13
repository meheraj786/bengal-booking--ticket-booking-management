import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { ApiError } from "@/lib/api-client";
import type { PaginatedResponse } from "@/lib/api-client";
import type {
  Category,
  CategoryFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category.types";
import { eventKeys } from "@/hooks/useEvent";

export const categoryKeys = {
  all: ["categories"] as const,
  list: (filters?: CategoryFilters) => [...categoryKeys.all, "list", filters] as const,
  detail: (id: string) => [...categoryKeys.all, "detail", id] as const,
};

export function useCategoryList(
  filters?: CategoryFilters,
): UseQueryResult<PaginatedResponse<Category>, ApiError> {
  return useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: () => categoryService.list(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory(): UseMutationResult<
  Category,
  ApiError,
  CreateCategoryPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      queryClient.invalidateQueries({ queryKey: eventKeys.filters() });
    },
  });
}

export function useUpdateCategory(
  id: string,
): UseMutationResult<Category, ApiError, UpdateCategoryPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => categoryService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      queryClient.invalidateQueries({ queryKey: eventKeys.filters() });
    },
  });
}

export function useDeleteCategory(): UseMutationResult<
  { message: string },
  ApiError,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => categoryService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      queryClient.invalidateQueries({ queryKey: eventKeys.filters() });
    },
  });
}
