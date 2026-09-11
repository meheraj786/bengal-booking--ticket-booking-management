import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { ApiError } from "@/lib/api-client";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category.types";

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  detail: (id: string) => [...categoryKeys.all, "detail", id] as const,
};

export function useCategoryList(): UseQueryResult<Category[], ApiError> {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: categoryService.list,
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
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
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
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
}
