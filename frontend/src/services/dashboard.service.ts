import { api } from "@/lib/api";

export type DashboardStats = {
  publishedEvents?: number;
  ticketsSold?: number;
  grossRevenue: number;
  bookings?: number;
  sellers?: number;
  users?: number;
};
export type SellerDashboard = {
  events: Array<{
    id: string;
    title: string;
    status: string;
    soldTickets: number;
    totalTickets: number;
    startAt: string;
  }>;
  stats: DashboardStats;
};
export type AdminDashboard = {
  events: Array<{
    id: string;
    title: string;
    status: string;
    seller: { name: string };
  }>;
  stats: DashboardStats;
};
export type UserDashboard = {
  bookings: Array<{
    id: string;
    status: string;
    quantity: number;
    event: { title: string; venueName: string; startAt: string };
  }>;
  wishlist: string[];
};

export const dashboardService = {
  user: () =>
    api.get<UserDashboard>("/dashboard/user").then((response) => response.data),
  seller: () =>
    api
      .get<SellerDashboard>("/dashboard/seller")
      .then((response) => response.data),
  admin: () =>
    api
      .get<AdminDashboard>("/dashboard/admin")
      .then((response) => response.data),
};
