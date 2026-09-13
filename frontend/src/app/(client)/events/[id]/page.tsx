"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, Minus, Plus, Ticket as TicketIcon } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEvent } from "@/hooks/useEvent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

export default function EventDetailsPage() {
  const eventId = useParams<{ id: string }>()?.id as string;
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: event, isLoading, error } = useEvent(eventId);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [buyer, setBuyer] = useState({ buyerName: "", buyerAddress: "", buyerPhone: "" });

  const ticketGroups = useMemo(() => {
    const groups = new Map<string, { id: string; name: string; description: string; price: string; available: number }>();
    for (const ticket of event?.tickets ?? []) {
      const key = `${ticket.name}:${ticket.price}`;
      const existing = groups.get(key);
      if (existing) {
        if (ticket.status === "AVAILABLE") existing.available += 1;
      } else {
        groups.set(key, {
          id: ticket.id,
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          available: ticket.status === "AVAILABLE" ? 1 : 0,
        });
      }
    }
    return [...groups.values()];
  }, [event?.tickets]);

  const totalQuantity = Object.values(quantities).reduce((sum, value) => sum + value, 0);
  const selectedTickets = ticketGroups.filter((ticket) => (quantities[ticket.id] ?? 0) > 0);
  const total = selectedTickets.reduce((sum, ticket) => sum + Number(ticket.price) * (quantities[ticket.id] ?? 0), 0);

  if (isLoading) return <main className="mx-auto max-w-5xl p-8 text-center">Loading event...</main>;
  if (error || !event) {
    return <main className="mx-auto max-w-5xl p-8 text-center"><p>Published event not found.</p><Button asChild className="mt-4"><Link href="/explore">Browse events</Link></Button></main>;
  }

  const submitBooking = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!user.isVerified) return;
    if (!selectedTickets.length) return;
    const ticketSelections = selectedTickets.map((ticket) => ({
      ticketName: ticket.name,
      quantity: quantities[ticket.id],
    }));
    sessionStorage.setItem(`checkout:${event.id}`, JSON.stringify({
      eventId: event.id,
      quantity: totalQuantity,
      ticketName: selectedTickets[0].name,
      ticketSelections,
      ...buyer,
    }));
    router.push(`/events/${event.id}/checkout`);
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto grid max-w-6xl gap-8 p-4 pt-8 lg:grid-cols-[1.3fr_1fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative aspect-[16/8] bg-slate-200">
              {event.coverImage ? <Image src={event.coverImage} alt={event.title} fill className="object-cover" priority /> : null}
            </div>
            <div className="space-y-4 p-6">
              <p className="text-sm font-semibold text-blue-600">{event.category?.name}</p>
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <p className="whitespace-pre-line text-slate-600">{event.description}</p>
              <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <span className="flex gap-2"><Calendar className="h-4 w-4" />{new Date(event.startAt).toLocaleString()}</span>
                <span className="flex gap-2"><MapPin className="h-4 w-4" />{event.venueName}, {event.venueAddress}</span>
              </div>
              <p className="text-sm font-medium">Payment: {event.paymentType}</p>
              {event.seller && (
                <div className="flex items-center gap-3 border-t pt-4">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-200">
                    {event.seller.image ? (
                      <Image
                        src={event.seller.image}
                        alt={event.seller.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-lg font-bold text-slate-500">
                        {event.seller.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Event organizer</p>
                    <p className="font-semibold text-slate-900">{event.seller.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Choose your ticket</h2>
          {user && !user.isVerified && (
            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>
                Verify your email before booking tickets.{" "}
                <Link className="font-semibold underline" href="/verify-email">
                  Verify email with OTP
                </Link>
              </p>
            </div>
          )}
          {ticketGroups.length === 0 ? <p className="text-sm text-slate-500">No tickets are currently available.</p> : (
            <>
              <div className="space-y-3">
                {ticketGroups.map((ticket) => (
                  <div key={`${ticket.name}-${ticket.price}`} className={`w-full rounded-2xl border p-4 text-left ${(quantities[ticket.id] ?? 0) > 0 ? "border-blue-600 bg-blue-50" : "border-slate-200"} ${ticket.available === 0 ? "opacity-60" : ""}`}>
                    <div className="flex justify-between gap-3"><span className="font-semibold">{ticket.name}</span><span className="font-bold">৳{Number(ticket.price).toLocaleString()}</span></div>
                    <p className="mt-1 text-sm text-slate-500">{ticket.description}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>{ticket.available > 0 ? `${ticket.available} available` : "Sold out"}</span>
                      <span className="flex items-center gap-2">
                        <Button variant="outline" size="icon" disabled={!quantities[ticket.id]} onClick={() => setQuantities((current) => ({ ...current, [ticket.id]: Math.max(0, (current[ticket.id] ?? 0) - 1) }))}><Minus className="h-3 w-3" /></Button>
                        <span className="min-w-4 text-center">{quantities[ticket.id] ?? 0}</span>
                        <Button variant="outline" size="icon" disabled={ticket.available === 0 || (quantities[ticket.id] ?? 0) >= ticket.available || totalQuantity >= (event?.maxTicketsPerBooking ?? 1)} onClick={() => setQuantities((current) => ({ ...current, [ticket.id]: (current[ticket.id] ?? 0) + 1 }))}><Plus className="h-3 w-3" /></Button>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 border-t pt-4">
                <Input placeholder="Buyer name" value={buyer.buyerName} onChange={(e) => setBuyer({ ...buyer, buyerName: e.target.value })} />
                <Input placeholder="Buyer phone" value={buyer.buyerPhone} onChange={(e) => setBuyer({ ...buyer, buyerPhone: e.target.value })} />
                <Textarea placeholder="Buyer address" value={buyer.buyerAddress} onChange={(e) => setBuyer({ ...buyer, buyerAddress: e.target.value })} />
              </div>
              <div className="flex items-center justify-between border-t pt-4 text-lg font-bold"><span>Total</span><span>৳{total.toLocaleString()}</span></div>
              <Button className="w-full" onClick={submitBooking} disabled={!user?.isVerified || !totalQuantity || !buyer.buyerName || !buyer.buyerPhone || !buyer.buyerAddress}><TicketIcon className="mr-2 h-4 w-4" />{!user?.isVerified ? "Verify email to book" : "Continue to checkout"}</Button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
