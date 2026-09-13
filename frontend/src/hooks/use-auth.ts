import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/lib/api-client";
import { authStore } from "@/store/auth.store";
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

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useCurrentUser(options?: {
  enabled?: boolean;
}): UseQueryResult<CurrentUser | null, ApiError> {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      try {
        return await authService.getMe();
      } catch (error) {
        if (error instanceof ApiError && error.statusCode === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}

export function useRegister(): UseMutationResult<
  RegisterResponse,
  ApiError,
  RegisterPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.register,
    onSuccess: async () => {
      const currentUser = await authService.getMe();
      authStore.setUser(currentUser);
      queryClient.setQueryData(authKeys.me(), currentUser);
    },
  });
}

export function useLogin(): UseMutationResult<
  LoginResponse,
  ApiError,
  LoginPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.login,
    onSuccess: async () => {
      const currentUser = await authService.getMe();
      authStore.setUser(currentUser);
      queryClient.setQueryData(authKeys.me(), currentUser);
    },
  });
}

export function useLogout(): UseMutationResult<LogoutResponse, ApiError, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me(), null);
      queryClient.clear();
    },
  });
}

export function useVerifyEmail(): UseMutationResult<
  VerifyEmailResponse,
  ApiError,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: async () => {
      const currentUser = await authService.getMe();
      authStore.setUser(currentUser);
      queryClient.setQueryData(authKeys.me(), currentUser);
    },
  });
}

export function useResendVerification(): UseMutationResult<
  VerifyEmailResponse,
  ApiError,
  void
> {
  return useMutation({ mutationFn: authService.resendVerification });
}

export function useBecomeSeller(): UseMutationResult<
  BecomeSellerResponse,
  ApiError,
  void
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.becomeSeller,
    onSuccess: async () => {
      const currentUser = await authService.getMe();
      authStore.setUser(currentUser);
      queryClient.setQueryData(authKeys.me(), currentUser);
    },
  });
}
