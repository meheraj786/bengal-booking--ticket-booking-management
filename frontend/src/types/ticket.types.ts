export type TicketStatus = "AVAILABLE" | "LOCKED" | "SOLD" | "CANCELLED";

export interface Ticket {
  id: string;
  eventId: string;
  ticketNumber: number;
  status: TicketStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
  bookingId?: string;
}

export interface CreateTicketPayload {
  quantity: number;
  note?: string;
}

export interface UpdateTicketPayload {
  status?: TicketStatus;
  note?: string;
}

export interface CreateTicketsResponse {
  id: string;
  eventId: string;
  ticketNumber: number;
  status: TicketStatus;
  note?: string;
  createdAt: string;
}