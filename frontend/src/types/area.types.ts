export interface Area {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    events: number;
  };
}

export interface CreateAreaPayload {
  name: string;
  slug: string;
}

export interface UpdateAreaPayload {
  name: string;
  slug: string;
}
