"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useBookingList } from "@/hooks/useBooking";
import { BookingTicketCard } from "@/components/booking-ticket-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MapPin,
  Ticket,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Loader2,
  CalendarX2,
  Wallet,
  CalendarCheck,
  TicketCheck,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import type { Booking } from "@/types/booking.types";
import { bookingService } from "@/services/booking.service";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  string,
  { bg: string; text: string; dot: string; icon: React.ElementType }
> = {
  PENDING: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    icon: Clock,
  },
  CONFIRMED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  CANCELLED: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    icon: XCircle,
  },
  EXPIRED: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
    icon: AlertCircle,
  },
};

function getDateParts(dateStr?: string) {
  if (!dateStr) return { month: "--", day: "--" };
  const date = new Date(dateStr);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: date.getDate().toString(),
  };
}

function formatFullDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getRelativeLabel(dateStr?: string) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil(
    (target.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `In ${diffDays} days`;
  return null;
}

function BookingSkeleton() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-5">
          <Skeleton className="h-16 w-16 flex-shrink-0 rounded-2xl" />
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
          <Skeleton className="hidden h-8 w-24 rounded-full sm:block" />
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="group flex items-center gap-3.5 rounded-2xl border border-border/60 bg-card p-4 transition-shadow hover:shadow-sm sm:p-5">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold leading-tight">{value}</p>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useAuthStore();
  const { data: bookingResult, isLoading } = useBookingList();
  const bookings = bookingResult?.data ?? [];
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(
    bookings.length === 1 ? bookings[0]?.id : null,
  );
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(
    null,
  );

  if (userLoading) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-16 sm:py-20 max-md:w-[calc(100%-32px)]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <BookingSkeleton key={i} />
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const upcomingBookings = confirmedBookings.filter(
    (b) => new Date(b.event?.startAt || "") > new Date(),
  );
  const pastBookings = confirmedBookings.filter(
    (b) => new Date(b.event?.startAt || "") <= new Date(),
  );
  const otherBookings = bookings.filter((b) => b.status !== "CONFIRMED");

  const totalTickets = confirmedBookings.reduce(
    (sum, b) => sum + (b.quantity || 0),
    0,
  );
  const totalSpent = confirmedBookings.reduce(
    (sum, b) => sum + Number(b.totalAmount || 0),
    0,
  );

  const toggleBooking = (id: string) => {
    setExpandedBookingId(expandedBookingId === id ? null : id);
  };

  const renderBooking = (booking: Booking) => {
    const cancelBooking = async () => {
      setCancellingBookingId(booking.id);
      try {
        await bookingService.cancel(booking.id);
        router.refresh();
      } finally {
        setCancellingBookingId(null);
      }
    };

    const status = statusConfig[booking.status] ?? statusConfig.EXPIRED;
    const isExpanded = expandedBookingId === booking.id;
    const { month, day } = getDateParts(booking.event?.startAt);
    const relative =
      booking.status === "CONFIRMED"
        ? getRelativeLabel(booking.event?.startAt)
        : null;
    const canCancel =
      booking.status === "PENDING" || booking.status === "CONFIRMED";
    const canViewTickets =
      booking.status === "CONFIRMED" && (booking.tickets?.length ?? 0) > 0;

    return (
      <Card
        key={booking.id}
        className={cn(
          "overflow-hidden rounded-2xl border-border/60 shadow-sm transition-all duration-200 hover:shadow-md",
          isExpanded && "border-primary/30 shadow-md",
        )}
      >
        <CardContent className="p-0">
          <div
            className="flex cursor-pointer items-center gap-4 p-5 sm:gap-5 sm:p-6"
            onClick={() => toggleBooking(booking.id)}
          >
            <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-90">
                {month}
              </span>
              <span className="text-xl font-bold leading-none">{day}</span>
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={`/events/${booking.event?.slug ?? booking.eventId}`}
                className="inline-block max-w-full truncate align-top font-semibold hover:underline focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              >
                {booking.event?.title}
              </Link>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{booking.event?.venueName}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Ticket className="h-3.5 w-3.5" />
                  {booking.quantity} ticket{booking.quantity > 1 ? "s" : ""}
                </span>
                {relative && (
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-primary/10 px-2 py-0 text-[11px] font-medium text-primary"
                  >
                    {relative}
                  </Badge>
                )}
              </div>
            </div>

            <div className="hidden flex-shrink-0 flex-col items-end gap-2 sm:flex">
              <span className="font-semibold">
                ৳ {Number(booking.totalAmount).toLocaleString()}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "gap-1.5 rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-medium",
                  status.bg,
                  status.text,
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                {booking.status}
              </Badge>
            </div>

            <ChevronDown
              className={cn(
                "h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-300",
                isExpanded && "rotate-180 text-primary",
              )}
            />
          </div>

          <div className="flex items-center justify-between px-5 pb-4 sm:hidden">
            <span className="font-semibold">
              ৳ {Number(booking.totalAmount).toLocaleString()}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-medium",
                status.bg,
                status.text,
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
              {booking.status}
            </Badge>
          </div>

          {(canCancel || canViewTickets) && (
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 px-5 py-3 sm:px-6">
              {canViewTickets && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-full"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Link href={`/bookings/${booking.id}`}>
                    <Eye className="h-3.5 w-3.5" />
                    View tickets
                  </Link>
                </Button>
              )}

              {canCancel && (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={cancellingBookingId === booking.id}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {cancellingBookingId === booking.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      {cancellingBookingId === booking.id
                        ? "Cancelling..."
                        : "Cancel booking"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    onClick={(event) => event.stopPropagation()}
                  >
                    <AlertDialogHeader>
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You&apos;re about to cancel your booking for{" "}
                        <span className="font-semibold text-foreground">
                          {booking.event?.title}
                        </span>
                        . This action can&apos;t be undone
                        {booking.status === "CONFIRMED"
                          ? " and your tickets will be released."
                          : "."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep booking</AlertDialogCancel>
                      <AlertDialogAction
                        className="gap-1.5 bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        onClick={() => void cancelBooking()}
                      >
                        Yes, cancel booking
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}

          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              isExpanded
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              {booking.tickets && booking.tickets.length > 0 && (
                <div className="space-y-3 border-t border-border/60 bg-muted/20 p-5 sm:p-6">
                  <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold">
                    <TicketCheck className="h-4 w-4 text-primary" />
                    Your Tickets
                  </h4>
                  {booking.tickets.map((ticket) => (
                    <BookingTicketCard
                      key={ticket.id}
                      ticket={ticket}
                      eventTitle={booking.event?.title || ""}
                      eventDate={formatFullDate(booking.event?.startAt)}
                    />
                  ))}
                  {booking.status === "CONFIRMED" && (
                    <Button
                      asChild
                      variant="outline"
                      className="mt-2 w-full gap-2 rounded-xl"
                    >
                      <a href={`/bookings/${booking.id}`}>
                        <Download className="h-4 w-4" />
                        Download Tickets
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSection = (title: string, items: Booking[]) => {
    if (items.length === 0) return null;
    return (
      <div>
        <div className="mb-4 flex items-center gap-2.5">
          <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {items.length}
          </span>
        </div>
        <div className="space-y-3.5">{items.map((b) => renderBooking(b))}</div>
      </div>
    );
  };

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-16 sm:py-20 max-md:w-[calc(100%-32px)]">
        <p className="mb-4 font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)]">
          YOUR EVENTLY
        </p>
        <h1 className="m-0 text-[clamp(40px,6vw,68px)] font-medium leading-[0.98] tracking-[-3px]">
          Your plans
          <br />
          <em>in one place.</em>
        </h1>

        {bookings.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
            <StatCard
              icon={CalendarCheck}
              label="Total bookings"
              value={bookings.length}
            />
            <StatCard
              icon={Clock}
              label="Upcoming"
              value={upcomingBookings.length}
            />
            <StatCard
              icon={TicketCheck}
              label="Total tickets"
              value={totalTickets}
            />
            <StatCard
              icon={Wallet}
              label="Total spent"
              value={`৳ ${totalSpent.toLocaleString()}`}
            />
          </div>
        )}

        <div className="mt-10 inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/40 p-1">
          <Link
            href="/bookings"
            className="rounded-full bg-background px-4 py-2 text-xs font-semibold shadow-sm"
          >
            My bookings
          </Link>
          <Link
            href="/wishlist"
            className="rounded-full px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Wishlist
          </Link>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <BookingSkeleton key={i} />
              ))}
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-12">
              {renderSection("Upcoming Events", upcomingBookings)}
              {renderSection("Past Events", pastBookings)}
              {renderSection("Other Bookings", otherBookings)}
            </div>
          ) : (
            <Card className="rounded-3xl border-dashed border-border/70 shadow-none">
              <CardContent className="flex flex-col items-center px-6 py-16 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CalendarX2 className="h-8 w-8 text-primary" />
                </div>
                <p className="mb-1.5 text-lg font-medium text-foreground">
                  No bookings yet
                </p>
                <p className="mb-7 max-w-sm text-sm text-muted-foreground">
                  You don&apos;t have any bookings yet. Start exploring events
                  near you and reserve your spot.
                </p>
                <Button asChild size="lg" className="gap-2 rounded-full">
                  <Link href="/explore">Browse events</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}
