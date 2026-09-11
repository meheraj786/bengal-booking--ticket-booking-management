export type Role = "SUPER_ADMIN" | "SELLER" | "USER";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: Role;
  status: UserStatus;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRolePayload {
  role: Role;
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
}
