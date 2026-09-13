import type { PaginationParams } from "@/lib/api-client";

export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
export interface Event {
  id: string;
  sellerId: string;
  categoryId: string;
  areaId: string;
  title: string;
  description: string;
  venueName: string;
  venueAddress: string;
  startAt: string;
  endAt: string;
  maxTicketsPerBooking: number;
  lastDateAndTimeOfCancel?: string;
  lastDateOfBooking?: string;
  paymentType: "Advance" | "OnArrival" | "Free";
  /** Deprecated compatibility fields for legacy client-only views. */
  price: string;
  totalTickets: number;
  soldTickets: number;
  status: EventStatus;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  category?: EventCategory;
  area?: EventArea;
  seller?: EventSeller;
  _count?: {
    tickets: number;
    bookings: number;
  };
}

export interface EventListFilters extends PaginationParams {
  category?: string;
  division?: string;
  area?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateEventPayload {
  categoryId: string;
  areaId: string;
  title: string;
  description: string;
  venueName: string;
  venueAddress: string;
  startAt: string;
  endAt: string;
  maxTicketsPerBooking: number;
  lastDateAndTimeOfCancel: string;
  lastDateOfBooking: string;
  paymentType: "Advance" | "OnArrival" | "Free";
  coverImage?: string;
}

export interface UpdateEventPayload {
  categoryId?: string;
  areaId?: string;
  title?: string;
  description?: string;
  venueName?: string;
  venueAddress?: string;
  startAt?: string;
  endAt?: string;
  maxTicketsPerBooking?: number;
  lastDateAndTimeOfCancel?: string;
  lastDateOfBooking?: string;
  paymentType?: "Advance" | "OnArrival" | "Free";
  coverImage?: string;
  status?: EventStatus;
}

export interface EventFiltersResponse {
  categories: EventCategory[];
  areas: EventArea[];
}

export interface EventFormInput {
  categoryId: string;
  areaId: string;
  title: string;
  description: string;
  venueName: string;
  venueAddress: string;
  startAt: string;
  endAt: string;
  maxTicketsPerBooking: number;
  lastDateAndTimeOfCancel: string;
  lastDateOfBooking: string;
  paymentType: "Advance" | "OnArrival" | "Free";
  coverImage?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventArea {
  id: string;
  name: string;
  slug: string;
  divisionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventSeller {
  id: string;
  name: string;
  image: string | null;
}
