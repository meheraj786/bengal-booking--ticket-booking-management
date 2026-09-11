import { apiClient } from "@/lib/api-client";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category.types";

export const categoryService = {
  list: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>("/categories");
    return data;
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const { data } = await apiClient.post<Category>("/categories", payload);
    return data;
  },

  update: async (
    id: string,
    payload: UpdateCategoryPayload,
  ): Promise<Category> => {
    const { data } = await apiClient.patch<Category>(
      `/categories/${id}`,
      payload,
    );
    return data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/categories/${id}`,
    );
    return data;
  },
};
