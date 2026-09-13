import { apiClient, type PaginatedResponse, type PaginationParams } from "@/lib/api-client";
import type {
  User,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
} from "@/types/user.types";

export const userService = {
  list: async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get<PaginatedResponse<User>>("/users", { params });
    return data;
  },

  get: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  updateRole: async (
    id: string,
    payload: UpdateUserRolePayload,
  ): Promise<User> => {
    const { data } = await apiClient.patch<User>(`/users/${id}/role`, payload);
    return data;
  },

  updateStatus: async (
    id: string,
    payload: UpdateUserStatusPayload,
  ): Promise<User> => {
    const { data } = await apiClient.patch<User>(
      `/users/${id}/status`,
      payload,
    );
    return data;
  },
};
