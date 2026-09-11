export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
export type TicketStatus = "AVAILABLE" | "LOCKED" | "SOLD" | "CANCELLED";
export type PaymentMethod = "FREE" | "SSLCOMMERZ" | "STRIPE";

export interface Ticket {
  id: string;
  eventId: string;
  ticketNumber: number;
  status: TicketStatus;
  bookingId: string | null;
  createdAt: string;
  updatedAt: string;
  note?: string;
}

export interface BookingEvent {
  id: string;
  title: string;
  venueName: string;
  startAt: string;
  endAt: string;
  price: string;
  totalTickets: number;
  soldTickets: number;
  maxTicketsPerBooking: number;
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
  totalAmount: string;
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
}

export interface CreateBookingResponse {
  bookingId: string;
  expiresAt: string;
  ticketIds: string[];
}

export interface CheckoutPayload {
  bookingId: string;
  paymentMethod?: PaymentMethod;
}

export interface CheckoutResponse {
  bookingId: string;
  amount: string;
  eventTitle: string;
  ticketCount: number;
  paymentUrl?: string;
}

export interface ConfirmBookingPayload {}
