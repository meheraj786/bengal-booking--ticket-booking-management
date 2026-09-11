export const queryKeys = {
  auth: ["auth"] as const,
  events: ["events"] as const,
  event: (id: string) => ["events", id] as const,
  categories: ["categories"] as const,
  areas: ["areas"] as const,
  bookings: ["bookings"] as const,
  userDashboard: ["dashboard", "user"] as const,
  sellerDashboard: ["dashboard", "seller"] as const,
  adminDashboard: ["dashboard", "admin"] as const,
  users: ["users"] as const,
};
