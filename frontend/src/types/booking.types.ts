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
  title: string;
  venueName: string;
  startAt: string;
  endAt: string;
  maxTicketsPerBooking: number;
  paymentType: "Advance" | "OnArrival" | "Free";
  price: string;
  totalTickets: number;
  soldTickets: number;
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
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
}

export interface CreateBookingResponse {
  bookingId: string;
  expiresAt: string;
  ticketIds: string[];
}

export interface CheckoutPayload {
  bookingId: string;
}

export interface CheckoutResponse {
  bookingId: string;
  amount: string;
  eventTitle: string;
  ticketCount: number;
  paymentUrl?: string;
}

export interface ConfirmBookingPayload {}
