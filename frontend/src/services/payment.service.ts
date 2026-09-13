import { apiClient, type PaginatedResponse, type PaginationParams } from "@/lib/api-client";
import type { Payment } from "@/types/payment.types";

export const paymentService = {
  list: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Payment>>("/payments", { params });
    return data;
  },
};
