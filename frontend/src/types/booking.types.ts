export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
export type TicketStatus = "AVAILABLE" | "LOCKED" | "SOLD" | "CANCELLED";
export type PaymentMethod = "FREE" | "SSLCOMMERZ" | "STRIPE";

export interface Ticket {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: string;
  status: TicketStatus;
  bookingId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingEvent {
  id: string;
  slug: string;
  title: string;
  venueName: string;
  startAt: string;
  endAt: string;
  maxTicketsPerBooking: number;
  paymentType: "Advance" | "OnArrival" | "Free";
  price: string;
  totalTickets: number;
  soldTickets: number;
  venueAddress: string;
  description: string;
  seller?: {
    id: string;
    name: string;
    image: string | null;
  };
}

export interface BookingPayment {
  id: string;
  bookingId: string;
  amount: string;
  provider: string;
  providerPaymentId?: string;
  status: string;
  paidAt?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  quantity: number;
  ticketName: string;
  totalAmount: string;
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
  status: BookingStatus;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  event?: BookingEvent;
  tickets?: Ticket[];
  payment?: BookingPayment;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string | null;
  };
}

export interface CreateBookingPayload {
  eventId: string;
  quantity: number;
  ticketName: string;
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
  ticketSelections?: { ticketName: string; quantity: number }[];
}

export interface CreateBookingResponse {
  bookingId: string;
  expiresAt: string;
  ticketIds: string[];
}

export interface CheckoutPayload {
  eventId: string;
  quantity: number;
  ticketName: string;
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
  ticketSelections?: { ticketName: string; quantity: number }[];
}

export interface CheckoutResponse {
  bookingId: string;
  amount: string;
  eventTitle: string;
  ticketCount: number;
  paymentUrl?: string;
}

export interface ConfirmBookingPayload {}
