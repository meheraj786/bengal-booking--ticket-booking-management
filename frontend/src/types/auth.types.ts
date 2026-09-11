export type Role = "SUPER_ADMIN" | "SELLER" | "USER";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: Role;
  isVerified: boolean;
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  image: string | null;
  role: Role;
  isVerified: boolean;
  status: UserStatus;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "USER" | "SELLER";
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}
