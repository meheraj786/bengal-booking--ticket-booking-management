import { apiClient, type PaginatedResponse, type PaginationParams } from "@/lib/api-client";
import type {
  CreateDivisionPayload,
  Division,
  UpdateDivisionPayload,
} from "@/types/division.types";

export const divisionService = {
  list: async (params?: PaginationParams): Promise<PaginatedResponse<Division>> => {
    const { data } = await apiClient.get<PaginatedResponse<Division>>("/divisions", { params });
    return data;
  },

  get: async (id: string): Promise<Division> => {
    const { data } = await apiClient.get<Division>(`/divisions/${id}`);
    return data;
  },

  create: async (payload: CreateDivisionPayload): Promise<Division> => {
    const { data } = await apiClient.post<Division>("/divisions", payload);
    return data;
  },

  update: async (
    id: string,
    payload: UpdateDivisionPayload,
  ): Promise<Division> => {
    const { data } = await apiClient.patch<Division>(
      `/divisions/${id}`,
      payload,
    );
    return data;
  },

  delete: async (id: string): Promise<Division> => {
    const { data } = await apiClient.delete<Division>(`/divisions/${id}`);
    return data;
  },
};
