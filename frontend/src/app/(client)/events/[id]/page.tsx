"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  ShieldCheck,
  Plus,
  Minus,
  ArrowRight,
  CreditCard,
  Lock,
  ChevronRight,
  Sparkles,
  Ticket as TicketIcon,
  CheckCircle2,
} from "lucide-react";
import { useSellerEvent } from "@/hooks/useSellerEvent";

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const { data: event, isLoading, error } = useSellerEvent(eventId);

  const [quantity, setQuantity] = useState(1);
  const [ticketType, setTicketType] = useState<"standard" | "vip">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "new">("card");
  const [timeLeft, setTimeLeft] = useState(582);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#fafafc] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">
            Loading booking details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-[#fafafc] flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full text-center shadow-xs">
          <h2 className="text-xl font-bold text-slate-900">Event not found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            The event you are trying to reserve tickets for is unavailable or
            has expired.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-3 rounded-xl transition-all"
          >
            Browse other events
          </Link>
        </div>
      </main>
    );
  }

  const basePrice = parseFloat(event.price) || 0;
  const isFree = basePrice === 0;

  const unitPrice = isFree
    ? 0
    : ticketType === "vip"
      ? basePrice * 1.6
      : basePrice;
  const subtotal = unitPrice * quantity;
  const serviceFee =
    !isFree && subtotal > 0 ? Number((subtotal * 0.05).toFixed(2)) : 0;
  const tax =
    !isFree && subtotal > 0 ? Number((subtotal * 0.08).toFixed(2)) : 0;
  const total = subtotal + serviceFee + tax;
  const maxLimit = event.maxTicketsPerBooking || 6;
  const availableTickets = Math.max(0, event.totalTickets - event.soldTickets);

  return (
    <main className="min-h-screen bg-[#fafafc] pb-24 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
              <Link
                href="/explore"
                className="hover:text-slate-700 transition-colors"
              >
                Events
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-700 font-semibold truncate max-w-[200px] sm:max-w-xs">
                {event.title}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {isFree ? "Complete your registration" : "Book your tickets"}
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 bg-blue-50/70 border border-blue-100 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold self-start sm:self-center">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Reservation held for {formatTimer(timeLeft)}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-3 sm:p-4 mb-8 shadow-xs">
          <div className="grid grid-cols-4 items-center gap-2 text-center text-xs font-semibold">
            <div className="flex items-center justify-center gap-2 text-slate-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white text-[11px] font-bold">
                1
              </span>
              <span className="hidden sm:inline">
                {isFree ? "Select Pass" : "Select Tickets"}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white text-[11px] font-bold">
                2
              </span>
              <span className="hidden sm:inline">Quantity</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 text-[11px] font-bold">
                3
              </span>
              <span className="hidden sm:inline">Attendee Info</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 text-[11px] font-bold">
                4
              </span>
              <span className="hidden sm:inline">
                {isFree ? "Confirmation" : "Checkout"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
              <div className="relative aspect-[16/10] w-full bg-slate-100">
                <Image
                  src={event.coverImage || ""}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 400px"
                  priority
                />
              </div>

              <div className="p-5 space-y-3">
                <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {event.category?.name || "General Event"}
                </span>

                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {event.title}
                </h2>

                <div className="space-y-2 text-xs text-slate-600 font-medium pt-1">
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      {format(new Date(event.startAt), "EEE, MMM d, yyyy")}
                      <br />
                      <span className="text-slate-400">
                        {format(new Date(event.startAt), "h:mm a")} –{" "}
                        {format(new Date(event.endAt), "h:mm a")}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      {event.venueName}
                      <br />
                      <span className="text-slate-400 text-[11px]">
                        {event.venueAddress}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {isFree ? "Guaranteed Entry" : "Secure booking"}
                </h4>
                <p className="text-[11px] text-slate-500 font-normal">
                  {isFree
                    ? "Passes are emailed immediately upon confirmation."
                    : "Your transaction is encrypted and protected."}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`space-y-5 ${isFree ? "lg:col-span-8" : "lg:col-span-5"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isFree
                    ? "Select registration quantity"
                    : "Choose your tickets"}
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  {isFree
                    ? "Select how many attendee passes you require."
                    : "Select a ticket type and quantity to continue."}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-600">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{event.soldTickets} attending</span>
              </div>
            </div>

            <div
              className={`relative bg-white rounded-3xl border p-5 shadow-xs transition-all ${
                isFree
                  ? "border-emerald-500 ring-1 ring-emerald-500"
                  : ticketType === "standard"
                    ? "border-blue-600 ring-1 ring-blue-600 cursor-pointer"
                    : "border-slate-200/80 hover:border-slate-300 cursor-pointer"
              }`}
              onClick={() => !isFree && setTicketType("standard")}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      isFree
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isFree ? (
                      <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                    ) : (
                      <TicketIcon className="w-5 h-5 stroke-[2]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">
                        {isFree ? "General Admission Pass" : "Regular Entry"}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isFree
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {isFree ? "Open Access" : "Best value"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">
                      {isFree
                        ? "Includes complete admission, keynote access, and seating."
                        : "General admission entry to all stages and venue areas."}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-lg font-extrabold ${
                      isFree ? "text-emerald-600" : "text-slate-900"
                    }`}
                  >
                    {isFree ? "Free" : `$${basePrice}`}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  {availableTickets} passes available
                </span>

                <div
                  className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={
                      quantity <= 1 || (!isFree && ticketType !== "standard")
                    }
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={
                      quantity >= maxLimit ||
                      (!isFree && ticketType !== "standard")
                    }
                    onClick={() =>
                      setQuantity((q) => Math.min(maxLimit, q + 1))
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {!isFree && (
              <div
                onClick={() => setTicketType("vip")}
                className={`relative bg-white rounded-3xl border p-5 shadow-xs transition-all cursor-pointer ${
                  ticketType === "vip"
                    ? "border-blue-600 ring-1 ring-blue-600"
                    : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xs">
                      <Sparkles className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">
                          VIP Access
                        </h4>
                        <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Limited
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-normal mt-0.5">
                        Front-stage priority zone, express entry and lounge
                        access.
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-extrabold text-slate-900">
                      ${(basePrice * 1.6).toFixed(0)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-rose-500 font-semibold">
                    Only 15 VIP spots remaining
                  </span>

                  <div
                    className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      disabled={quantity <= 1 || ticketType !== "vip"}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-800">
                      {ticketType === "vip" ? quantity : 1}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= maxLimit || ticketType !== "vip"}
                      onClick={() =>
                        setQuantity((q) => Math.min(maxLimit, q + 1))
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className={`space-y-5 ${isFree ? "lg:col-span-8 lg:col-start-5" : "lg:col-span-3"}`}
          >
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isFree ? "Registration summary" : "Order summary"}
                </h3>
                <p className="text-xs text-slate-500 font-normal truncate mt-0.5">
                  {event.title}
                </p>
              </div>

              {isFree ? (
                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between font-medium text-slate-700">
                    <span>General Admission Pass × {quantity}</span>
                    <span className="font-bold text-emerald-600">Free</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">
                      Total
                    </span>
                    <span className="text-lg font-black text-emerald-600">
                      Free
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between font-medium text-slate-700">
                    <span>
                      {ticketType === "vip" ? "VIP Access" : "Regular Entry"} ×{" "}
                      {quantity}
                    </span>
                    <span className="font-bold text-slate-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span>Service fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span>Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">
                      Total
                    </span>
                    <span className="text-lg font-black text-blue-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                className={`w-full inline-flex items-center justify-center gap-2 text-white font-semibold text-xs sm:text-sm py-3.5 px-4 rounded-2xl transition-all active:scale-98 cursor-pointer ${
                  isFree
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-[0_4px_16px_rgba(16,185,129,0.35)]"
                    : "bg-[#ff5d41] hover:bg-[#eb4f34] shadow-[0_4px_16px_rgba(255,93,65,0.35)]"
                }`}
              >
                <span>
                  {isFree ? "Confirm Registration" : "Proceed to Payment"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-400 text-center font-normal">
                {isFree
                  ? "No payment method required · Instant confirmation"
                  : "You won't be charged until the next step"}
              </p>
            </div>

            {!isFree && (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Payment method
                  </h4>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Secure checkout powered by Stripe
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-blue-600 bg-blue-50/30"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="accent-blue-600"
                      />
                      <span className="text-xs font-medium text-slate-800">
                        •••• 4242{" "}
                        <span className="text-slate-400">Visa · Default</span>
                      </span>
                    </div>
                    <CreditCard className="w-4 h-4 text-slate-400" />
                  </label>

                  <label
                    onClick={() => setPaymentMethod("new")}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "new"
                        ? "border-blue-600 bg-blue-50/30"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "new"}
                        onChange={() => setPaymentMethod("new")}
                        className="accent-blue-600"
                      />
                      <span className="text-xs font-medium text-slate-800">
                        Use a new card
                      </span>
                    </div>
                    <CreditCard className="w-4 h-4 text-slate-400" />
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    SSL encrypted
                  </span>
                  <span className="tracking-widest font-bold uppercase text-slate-500">
                    VISA · MASTERCARD
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
