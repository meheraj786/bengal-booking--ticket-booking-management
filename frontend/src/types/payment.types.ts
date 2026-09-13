export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  bookingId: string;
  amount: string;
  provider: string;
  providerPaymentId?: string | null;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
  booking?: {
    id: string;
    eventId: string;
    buyerName: string;
    buyerPhone: string;
  };
}
