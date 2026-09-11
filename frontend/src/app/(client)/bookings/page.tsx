"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useBookingList } from "@/hooks/useBooking";
import { BookingTicketCard } from "@/components/booking-ticket-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Ticket,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import type { Booking } from "@/types/booking.types";

export default function BookingsPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useAuthStore();
  const { data: bookings = [], isLoading } = useBookingList();
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(
    bookings.length === 1 ? bookings[0]?.id : null,
  );

  if (userLoading) {
    return (
      <main className="route-shell">
        <section className="account-wrap wrap">
          <div className="text-center py-12">Loading...</div>
        </section>
      </main>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const statusColors: Record<
    string,
    { bg: string; text: string; icon: React.ElementType }
  > = {
    PENDING: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: AlertCircle,
    },
    CONFIRMED: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: CheckCircle2,
    },
    CANCELLED: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: AlertCircle,
    },
    EXPIRED: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      icon: AlertCircle,
    },
  };

  const upcomingBookings = bookings.filter(
    (b) =>
      b.status === "CONFIRMED" && new Date(b.event?.startAt || "") > new Date(),
  );
  const pastBookings = bookings.filter(
    (b) =>
      b.status === "CONFIRMED" &&
      new Date(b.event?.startAt || "") <= new Date(),
  );
  const otherBookings = bookings.filter((b) => b.status !== "CONFIRMED");

  const toggleBooking = (id: string) => {
    setExpandedBookingId(expandedBookingId === id ? null : id);
  };

  const renderBooking = (booking: Booking) => {
    const StatusIcon = statusColors[booking.status]?.icon;
    const isExpanded = expandedBookingId === booking.id;

    return (
      <div key={booking.id}>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => toggleBooking(booking.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link
                  href={`/events/${booking.eventId}`}
                  className="hover:underline focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="font-bold text-lg">{booking.event?.title}</h3>
                </Link>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                  <div className="flex gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-xs">When</p>
                      <p className="font-medium">
                        {new Date(
                          booking.event?.startAt || "",
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-xs">Where</p>
                      <p className="font-medium truncate">
                        {booking.event?.venueName}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Ticket className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-xs">Tickets</p>
                      <p className="font-medium">{booking.quantity}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Amount Paid</p>
                    <p className="font-medium">
                      ৳ {Number(booking.totalAmount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                <Badge
                  className={`${statusColors[booking.status]?.bg} ${statusColors[booking.status]?.text}`}
                >
                  {booking.status}
                </Badge>
                {booking.status === "CONFIRMED" && booking.tickets && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {booking.tickets.length} ticket
                    {booking.tickets.length > 1 ? "s" : ""}
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {isExpanded && booking.tickets && booking.tickets.length > 0 && (
              <div className="mt-6 pt-6 border-t space-y-3">
                <h4 className="font-semibold text-sm mb-3">Your Tickets</h4>
                {booking.tickets.map((ticket) => (
                  <BookingTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    eventTitle={booking.event?.title || ""}
                    eventDate={new Date(
                      booking.event?.startAt || "",
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  />
                ))}
                {booking.status === "CONFIRMED" && (
                  <Button asChild variant="outline" className="w-full mt-4">
                    <a href={`/bookings/${booking.id}/tickets`}>
                      Download Tickets
                    </a>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <main className="route-shell">
      <section className="account-wrap wrap">
        <p className="eyebrow">YOUR EVENTLY</p>
        <h1>
          Your plans
          <br />
          <em>in one place.</em>
        </h1>

        <div className="account-tabs mb-8">
          <Link href="/bookings" className="selected">
            My bookings
          </Link>
          <Link href="/wishlist">Wishlist</Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading your bookings...</div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Upcoming Events</h2>
                <div className="space-y-3">
                  {upcomingBookings.map((booking) => renderBooking(booking))}
                </div>
              </div>
            )}

            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 mt-8">Past Events</h2>
                <div className="space-y-3">
                  {pastBookings.map((booking) => renderBooking(booking))}
                </div>
              </div>
            )}

            {otherBookings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 mt-8">
                  Other Bookings
                </h2>
                <div className="space-y-3">
                  {otherBookings.map((booking) => renderBooking(booking))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600 mb-4">
                You don&apos;t have any bookings yet.
              </p>
              <Button asChild>
                <Link href="/explore">Browse events</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
