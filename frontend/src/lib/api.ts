import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export type EventSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  venueName: string;
  venueAddress: string;
  startAt: string;
  endAt: string;
  price: string;
  totalTickets: number;
  soldTickets: number;
  maxTicketsPerBooking: number;
  coverImage?: string | null;
  category: { name: string; slug: string };
  area: { name: string; slug: string };
};

export type BookingResponse = {
  bookingId: string;
  expiresAt: string;
  ticketIds: string[];
};

export const eventApi = {
  get: (id: string) =>
    api.get<EventSummary>(`/events/${id}`).then((response) => response.data),
  list: () =>
    api.get<EventSummary[]>("/events").then((response) => response.data),
};

export const bookingApi = {
  create: (payload: { eventId: string; quantity: number }) =>
    api
      .post<BookingResponse>("/bookings", payload)
      .then((response) => response.data),
  confirm: (bookingId: string) =>
    api
      .post(`/bookings/${bookingId}/confirm`)
      .then((response) => response.data),
};
