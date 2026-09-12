export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    events: number;
  };
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
}

export interface CategoryFilters {
  limit?: string | number;
  page?: string | number;
  search?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  eventCount?: number;
  createdAt: string;
  updatedAt: string;
}
