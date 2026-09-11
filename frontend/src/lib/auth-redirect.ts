import type { Role } from "@/types/auth.types";

export function getDashboardPathForRole(role: Role): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin/dashboard";
    case "SELLER":
      return "/seller/dashboard";
    case "USER":
      return "/";
    default:
      return "/";
  }
}
