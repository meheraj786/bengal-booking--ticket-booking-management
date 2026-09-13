export type TicketStatus = "AVAILABLE" | "LOCKED" | "SOLD" | "CANCELLED";

export interface Ticket {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  bookingId?: string;
}

export interface CreateTicketPayload {
  quantity: number;
  name: string;
  description: string;
  price: number;
}

export interface UpdateTicketPayload {
  status?: TicketStatus;
  name?: string;
  description?: string;
  price?: number;
}

export interface CreateTicketsResponse {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: string;
  status: TicketStatus;
  createdAt: string;
}