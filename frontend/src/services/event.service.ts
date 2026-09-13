import { apiClient, type PaginatedResponse, type PaginationParams } from "@/lib/api-client";
import type {
  Event,
  EventListFilters,
  EventFiltersResponse,
  CreateEventPayload,
  UpdateEventPayload,
  EventCategory,
  EventArea,
} from "@/types/event.types";

export const eventService = {
  list: async (filters?: EventListFilters & PaginationParams): Promise<PaginatedResponse<Event>> => {
    const { data } = await apiClient.get<PaginatedResponse<Event>>("/events", {
      params: filters,
    });
    return data;
  },

  get: async (id: string): Promise<Event> => {
    const { data } = await apiClient.get<Event>(`/events/${id}`);
    return data;
  },

  getBySlug: async (slug: string): Promise<Event> => {
    const { data } = await apiClient.get<Event>(`/events/slug/${slug}`);
    return data;
  },

  getFilters: async (): Promise<EventFiltersResponse> => {
    const categories = await eventService.getCategories();
    const areas = await eventService.getAreas();
    return { categories, areas };
  },

  getCategories: async (): Promise<EventCategory[]> => {
    const { data } = await apiClient.get<EventCategory[]>(
      "/events/filters/categories",
    );
    return data;
  },

  getAreas: async (): Promise<EventArea[]> => {
    const { data } = await apiClient.get<EventArea[]>("/events/filters/areas");
    return data;
  },

  create: async (payload: CreateEventPayload): Promise<Event> => {
    const { data } = await apiClient.post<Event>("/events", payload);
    return data;
  },

  update: async (id: string, payload: UpdateEventPayload): Promise<Event> => {
    const { data } = await apiClient.patch<Event>(`/events/${id}`, payload);
    return data;
  },

  publish: async (id: string): Promise<Event> => {
    const { data } = await apiClient.post<Event>(`/events/${id}/publish`, {});
    return data;
  },

  delete: async (id: string): Promise<Event> => {
    const { data } = await apiClient.delete<Event>(`/events/${id}`);
    return data;
  },
};
