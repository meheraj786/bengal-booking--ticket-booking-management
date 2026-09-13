"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEventBySlug } from "@/hooks/useEvent";
import { useCheckoutBooking } from "@/hooks/useBooking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CheckoutData = {
  eventId: string;
  quantity: number;
  ticketName: string;
  ticketSelections?: { ticketName: string; quantity: number }[];
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
};

export default function CheckoutPage() {
  const eventSlug = useParams<{ slug: string }>()?.slug as string;
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: event, isLoading } = useEventBySlug(eventSlug);
  const complete = useCheckoutBooking();
  const [data, setData] = useState<CheckoutData | null>(null);
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });

  useEffect(() => {
    const stored = sessionStorage.getItem(`checkout:${eventSlug}`);
    if (stored) setData(JSON.parse(stored) as CheckoutData);
  }, [eventSlug]);

  if (isLoading || !data) return <main className="mx-auto max-w-3xl p-8 text-center">Loading checkout...</main>;
  const amount = (data.ticketSelections ?? [{ ticketName: data.ticketName, quantity: data.quantity }]).reduce(
    (sum, selection) => sum + Number(event?.tickets?.find((ticket) => ticket.name === selection.ticketName)?.price ?? 0) * selection.quantity,
    0,
  );
  const requiresPayment = event?.paymentType === "Advance" && amount > 0;
  const canSubmit = !requiresPayment || Object.values(card).every(Boolean);
  const noPaymentMessage =
    event?.paymentType === "OnArrival"
      ? "Payment will be collected at the venue."
      : "No payment is required for this free event.";

  const submit = () => {
    if (!canSubmit || !user?.isVerified) return;
    complete.mutate(data, {
      onSuccess: (booking) => {
        sessionStorage.removeItem(`checkout:${eventSlug}`);
        router.push(`/bookings/${booking.id}`);
      },
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>{requiresPayment ? "Payment" : "Complete booking"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-semibold">{event?.title}</p>
            <div className="space-y-1">
              {(data.ticketSelections ?? [{ ticketName: data.ticketName, quantity: data.quantity }]).map((selection) => (
                <p key={selection.ticketName}>{selection.ticketName} × {selection.quantity}</p>
              ))}
            </div>
            <p className="text-xl font-bold">৳{amount.toLocaleString()}</p>
            {!requiresPayment && (
              <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                {noPaymentMessage}
              </p>
            )}
            {requiresPayment && (
              <>
                <Input placeholder="Cardholder name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                <Input placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
                  <Input placeholder="CVV" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
                </div>
                <p className="text-xs text-slate-500">Dummy payment only. No real charge is made.</p>
              </>
            )}
            {complete.isError && <p className="text-sm text-red-600">{complete.error.message}</p>}
            <Button className="w-full" onClick={submit} disabled={complete.isPending || !canSubmit}>
              {complete.isPending
                ? "Processing..."
                : requiresPayment
                  ? "Pay and complete booking"
                  : "Complete booking"}
            </Button>
            <Link className="block text-center text-sm underline" href={`/events/${eventSlug}`}>Back to event</Link>
          </CardContent>
        </Card>
        <Card className="h-fit"><CardHeader><CardTitle>Order summary</CardTitle></CardHeader><CardContent className="space-y-2">
          {(data.ticketSelections ?? [{ ticketName: data.ticketName, quantity: data.quantity }]).map((selection) => (
            <div key={selection.ticketName} className="flex justify-between gap-3 text-sm"><span>{selection.ticketName} × {selection.quantity}</span><span>৳{(Number(event?.tickets?.find((ticket) => ticket.name === selection.ticketName)?.price ?? 0) * selection.quantity).toLocaleString()}</span></div>
          ))}
          <p className="border-t pt-2 font-bold">Total ৳{amount.toLocaleString()}</p>
        </CardContent></Card>
      </div>
    </main>
  );
}
