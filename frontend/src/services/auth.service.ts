import { apiClient, API_BASE_URL } from "@/lib/api-client";
import type {
  CurrentUser,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyEmailResponse,
  BecomeSellerResponse,
} from "@/types/auth.types";

export const authService = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<RegisterResponse>(
      "/auth/register",
      payload,
    );
    return data;
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login",
      payload,
    );
    return data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const { data } = await apiClient.post<LogoutResponse>("/auth/logout");
    return data;
  },

  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    const { data } = await apiClient.get<VerifyEmailResponse>(
      "/auth/verify-email",
      { params: { token } },
    );
    return data;
  },

  resendVerification: async (): Promise<VerifyEmailResponse> => {
    const { data } = await apiClient.post<VerifyEmailResponse>(
      "/auth/resend-verification",
    );
    return data;
  },

  becomeSeller: async (): Promise<BecomeSellerResponse> => {
    const { data } = await apiClient.patch<BecomeSellerResponse>(
      "/auth/become-seller",
    );
    return data;
  },

  getMe: async (): Promise<CurrentUser> => {
    const { data } = await apiClient.get<CurrentUser>("/auth/me");
    return data;
  },

  googleLoginUrl: (): string => `${API_BASE_URL}/auth/google`,
};
