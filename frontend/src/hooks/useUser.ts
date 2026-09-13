import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { ApiError } from "@/lib/api-client";
import type { PaginatedResponse, PaginationParams } from "@/lib/api-client";
import type {
  User,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
} from "@/types/user.types";
import { queryKeys } from "@/lib/query-keys";

export const userKeys = {
  all: ["users"] as const,
  list: () => [...userKeys.all, "list"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

export function useUserList(params?: PaginationParams): UseQueryResult<PaginatedResponse<User>, ApiError> {
  return useQuery({
    queryKey: [...userKeys.list(), params],
    queryFn: () => userService.list(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUser(id: string): UseQueryResult<User, ApiError> {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.get(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateUserRole(): UseMutationResult<
  User,
  ApiError,
  { id: string; payload: UpdateUserRolePayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => userService.updateRole(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}

export function useUpdateUserStatus(): UseMutationResult<
  User,
  ApiError,
  { id: string; payload: UpdateUserStatusPayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => userService.updateStatus(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}
