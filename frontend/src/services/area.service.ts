import { apiClient } from "@/lib/api-client";
import type {
  Area,
  CreateAreaPayload,
  UpdateAreaPayload,
} from "@/types/area.types";

export const areaService = {
  list: async (): Promise<Area[]> => {
    const { data } = await apiClient.get<Area[]>("/areas");
    return data;
  },

  create: async (payload: CreateAreaPayload): Promise<Area> => {
    const { data } = await apiClient.post<Area>("/areas", payload);
    return data;
  },

  update: async (id: string, payload: UpdateAreaPayload): Promise<Area> => {
    const { data } = await apiClient.patch<Area>(`/areas/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/areas/${id}`,
    );
    return data;
  },
};
