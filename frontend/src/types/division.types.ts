export interface Division {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  areas?: Array<{
    id: string;
    name: string;
    slug: string;
    image?: string;
  }>;
  _count?: {
    areas: number;
  };
}

export interface CreateDivisionPayload {
  name: string;
  slug: string;
  image?: string;
}

export interface UpdateDivisionPayload {
  name: string;
  slug: string;
  image?: string;
}
