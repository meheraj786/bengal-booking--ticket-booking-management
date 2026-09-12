export interface Division {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  areas?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  _count?: {
    areas: number;
  };
}

export interface CreateDivisionPayload {
  name: string;
  slug: string;
}

export interface UpdateDivisionPayload {
  name: string;
  slug: string;
}
