export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  description?: string;
  createdAt: string;
  updatedAt: string;
  eventCount?: number;
  _count?: {
    events: number;
  };
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface CategoryFilters {
  limit?: string | number;
  page?: string | number;
  search?: string;
}
