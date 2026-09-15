"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Minus,
  Plus,
  Ticket as TicketIcon,
  AlertCircle,
  CreditCard,
  User,
  Phone,
  Home,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEventBySlug } from "@/hooks/useEvent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export default function EventDetailsPage() {
  const eventSlug = useParams<{ slug: string }>()?.slug as string;
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: event, isLoading, error } = useEventBySlug(eventSlug);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [buyer, setBuyer] = useState({
    buyerName: "",
    buyerAddress: "",
    buyerPhone: "",
  });

  const ticketGroups = useMemo(() => {
    const groups = new Map<
      string,
      {
        id: string;
        name: string;
        description: string;
        price: string;
        available: number;
      }
    >();
    for (const ticket of event?.tickets ?? []) {
      const key = `${ticket.name}:${ticket.price}:${ticket.description}`;
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

  const totalQuantity = Object.values(quantities).reduce(
    (sum, value) => sum + value,
    0,
  );
  const selectedTickets = ticketGroups.filter(
    (ticket) => (quantities[ticket.id] ?? 0) > 0,
  );
  const total = selectedTickets.reduce(
    (sum, ticket) => sum + Number(ticket.price) * (quantities[ticket.id] ?? 0),
    0,
  );

  if (isLoading) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-slate-50 pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 p-4 pt-6 sm:gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="min-w-0 space-y-6">
            <Skeleton className="aspect-[16/9] w-full rounded-2xl sm:aspect-[16/8] sm:rounded-3xl" />
            <div className="space-y-3 rounded-2xl bg-white p-4 sm:rounded-3xl sm:p-6 shadow-sm">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <Card className="rounded-2xl border-none shadow-sm sm:rounded-3xl">
            <CardContent className="space-y-4 p-4 sm:p-6">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-24 w-full rounded-xl sm:rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-xl sm:rounded-2xl" />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-slate-50 px-4 py-8">
        <Card className="w-full max-w-md rounded-2xl border-none shadow-sm sm:rounded-3xl">
          <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:px-8 sm:py-14">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 sm:h-16 sm:w-16">
              <AlertCircle className="h-7 w-7 text-red-500 sm:h-8 sm:w-8" />
            </div>
            <p className="mb-1.5 text-base font-semibold sm:text-lg">
              Event not found
            </p>
            <p className="mb-7 text-xs text-muted-foreground sm:text-sm">
              This event may have been removed or is not published yet.
            </p>
            <Button
              asChild
              size="lg"
              className="w-full gap-2 rounded-full sm:w-auto"
            >
              <Link href="/explore">
                <ArrowLeft className="h-4 w-4" />
                Browse events
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
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
    sessionStorage.setItem(
      `checkout:${event.slug}`,
      JSON.stringify({
        eventId: event.id,
        quantity: totalQuantity,
        ticketName: selectedTickets[0].name,
        ticketSelections,
        ...buyer,
      }),
    );
    router.push(`/events/${event.slug}/checkout`);
  };

  const isFormValid =
    user?.isVerified &&
    !!totalQuantity &&
    !!buyer.buyerName &&
    !!buyer.buyerPhone &&
    !!buyer.buyerAddress;

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-slate-50 pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:pt-6">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </Link>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 p-4 pt-4 sm:gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <section className="min-w-0 space-y-6">
          <Card className="overflow-hidden rounded-2xl border-none shadow-sm sm:rounded-3xl">
            <div className="relative aspect-[16/9] w-full bg-slate-200 sm:aspect-[16/8]">
              {event.coverImage ? (
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <TicketIcon className="h-10 w-10" />
                </div>
              )}
              {event.category?.name && (
                <Badge className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-semibold text-primary shadow-sm hover:bg-white/95 sm:left-4 sm:top-4 sm:px-3 sm:py-1">
                  {event.category.name}
                </Badge>
              )}
            </div>

            <CardContent className="space-y-5 p-4 sm:p-6 md:p-8">
              <h1 className="break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                {event.title}
              </h1>

              <div className="grid gap-3 text-sm sm:grid-cols-2 sm:gap-4">
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:rounded-2xl sm:p-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:rounded-xl">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      Date & Time (Start)
                    </p>
                    <p className="break-words text-xs font-medium text-slate-800 sm:text-sm">
                      {new Date(event.startAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:rounded-2xl sm:p-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:rounded-xl">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      Date & Time (End)
                    </p>
                    <p className="break-words text-xs font-medium text-slate-800 sm:text-sm">
                      {new Date(event.endAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:rounded-2xl sm:p-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:rounded-xl">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Venue</p>
                    <p className="break-words text-xs font-medium text-slate-800 sm:text-sm">
                      {event.venueName}, {event.venueAddress}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="min-w-0">
                <h2 className="mb-2 text-sm font-semibold text-slate-900">
                  About this event
                </h2>
                <p className="break-words whitespace-pre-line text-xs leading-relaxed text-slate-600 sm:text-sm sm:leading-6">
                  {event.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CreditCard className="h-4 w-4 shrink-0" />
                  <span>Payment type:</span>
                </div>
                <Badge variant="secondary" className="rounded-full font-medium">
                  {event.paymentType}
                </Badge>
              </div>

              {event.seller && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-200 ring-2 ring-slate-100 sm:h-12 sm:w-12">
                      {event.seller.image ? (
                        <Image
                          src={event.seller.image}
                          alt={event.seller.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-base font-bold text-slate-500 sm:text-lg">
                          {event.seller.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        Event organizer
                      </p>
                      <p className="truncate font-semibold text-slate-900">
                        {event.seller.name}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="min-w-0 lg:sticky lg:top-6">
          <Card className="rounded-2xl border-none shadow-sm sm:rounded-3xl">
            <CardContent className="space-y-5 p-4 sm:p-6 lg:p-7">
              <div className="flex items-center gap-2">
                <TicketIcon className="h-5 w-5 shrink-0 text-primary" />
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Choose your ticket
                </h2>
              </div>

              {user && !user.isVerified && (
                <Alert className="rounded-xl border-amber-200 bg-amber-50 p-3 text-amber-900">
                  <AlertCircle className="h-4 w-4 shrink-0 !text-amber-600" />
                  <AlertDescription className="text-xs leading-relaxed text-amber-900 sm:text-sm">
                    Verify your email before booking tickets.{" "}
                    <Link
                      className="font-semibold underline underline-offset-2"
                      href="/verify-email"
                    >
                      Verify email with OTP
                    </Link>
                  </AlertDescription>
                </Alert>
              )}

              {ticketGroups.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 py-8 text-center sm:py-10">
                  <TicketIcon className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    No tickets are currently available.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {ticketGroups.map((ticket) => {
                      const qty = quantities[ticket.id] ?? 0;
                      const isSelected = qty > 0;
                      const isSoldOut = ticket.available === 0;

                      return (
                        <div
                          key={`${ticket.name}-${ticket.price}`}
                          className={cn(
                            "rounded-xl border p-3.5 transition-colors sm:rounded-2xl sm:p-4",
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-slate-200 hover:border-slate-300",
                            isSoldOut && "opacity-60",
                          )}
                        >
                          <div className="flex items-start justify-between gap-2 sm:gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="break-words text-sm font-semibold text-slate-900 sm:text-base">
                                  {ticket.name}
                                </span>
                                {isSelected && (
                                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                                )}
                              </div>
                              <p className="mt-0.5 break-words text-xs text-slate-500 sm:text-sm">
                                {ticket.description}
                              </p>
                            </div>
                            <span className="shrink-0 text-sm font-bold text-slate-900 sm:text-base">
                              ৳{Number(ticket.price).toLocaleString()}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                "text-xs font-medium",
                                isSoldOut
                                  ? "text-red-500"
                                  : "text-muted-foreground",
                              )}
                            >
                              {isSoldOut
                                ? "Sold out"
                                : `${ticket.available} available`}
                            </span>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-full sm:h-8 sm:w-8"
                                disabled={!qty}
                                onClick={() =>
                                  setQuantities((current) => ({
                                    ...current,
                                    [ticket.id]: Math.max(
                                      0,
                                      (current[ticket.id] ?? 0) - 1,
                                    ),
                                  }))
                                }
                              >
                                <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              </Button>
                              <span className="min-w-5 text-center text-xs font-semibold sm:text-sm">
                                {qty}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-full sm:h-8 sm:w-8"
                                disabled={
                                  isSoldOut ||
                                  qty >= ticket.available ||
                                  totalQuantity >=
                                    (event?.maxTicketsPerBooking ?? 1)
                                }
                                onClick={() =>
                                  setQuantities((current) => ({
                                    ...current,
                                    [ticket.id]: (current[ticket.id] ?? 0) + 1,
                                  }))
                                }
                              >
                                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-900 sm:text-sm">
                      Buyer information
                    </p>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="Buyer name"
                        className="h-10 pl-9 text-xs sm:text-sm"
                        value={buyer.buyerName}
                        onChange={(e) =>
                          setBuyer({ ...buyer, buyerName: e.target.value })
                        }
                      />
                    </div>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="Buyer phone"
                        className="h-10 pl-9 text-xs sm:text-sm"
                        value={buyer.buyerPhone}
                        onChange={(e) =>
                          setBuyer({ ...buyer, buyerPhone: e.target.value })
                        }
                      />
                    </div>
                    <div className="relative">
                      <Home className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Textarea
                        placeholder="Buyer address"
                        className="min-h-[72px] pl-9 text-xs sm:text-sm"
                        value={buyer.buyerAddress}
                        onChange={(e) =>
                          setBuyer({ ...buyer, buyerAddress: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-sm font-bold sm:text-base">
                    <span>Total</span>
                    <span className="text-base font-bold text-primary sm:text-lg">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>

                  <Button
                    className="w-full gap-2 rounded-xl text-sm"
                    size="lg"
                    onClick={submitBooking}
                    disabled={!isFormValid}
                  >
                    <TicketIcon className="h-4 w-4" />
                    {!user?.isVerified
                      ? "Verify email to book"
                      : "Continue to checkout"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
