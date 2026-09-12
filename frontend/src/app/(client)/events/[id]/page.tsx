"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useSellerEvent } from "@/hooks/useSellerEvent";
import { MapPin, Calendar, Users } from "lucide-react";
import { BookingPanel } from "./booking-panel";

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const { data: event, isLoading, error } = useSellerEvent(eventId);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[55px_100px] max-md:w-[calc(100%-32px)]">
          <div className="text-center py-12">Loading event...</div>
        </section>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[55px_100px] max-md:w-[calc(100%-32px)]">
          <Link
            className="mb-[30px] inline-block font-sans text-[11px] text-[var(--muted)]"
            href="/explore"
          >
            ← Back to explore
          </Link>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Event not found</p>
            <Link href="/explore" className="font-sans text-xs font-bold">
              Browse other events
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const availableTickets = event.totalTickets - event.soldTickets;
  const ticketPercentage = (event.soldTickets / event.totalTickets) * 100;

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[55px_100px] max-md:w-[calc(100%-32px)]">
        <Link
          className="mb-[30px] inline-block font-sans text-[11px] text-[var(--muted)]"
          href="/explore"
        >
          ← Back to explore
        </Link>
        <div className="grid grid-cols-[1.3fr_0.7fr] gap-[55px] max-md:grid-cols-1 max-md:gap-8">
          <div>
            <div
              className="h-[400px] bg-cover bg-center max-md:h-[260px]"
              style={{
                backgroundImage: event.coverImage
                  ? `url(${event.coverImage})`
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            />
            <div className="py-[38px]">
              <p className="mb-[18px] font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)]">
                {event.category?.name?.toUpperCase()} ·{" "}
                {event.area?.name?.toUpperCase()}
              </p>
              <h1 className="m-0 text-[58px] font-medium leading-[0.98] tracking-[-4px] max-md:text-[50px]">
                {event.title.split(" ").slice(0, -1).join(" ")}
                <br />
                <em>{event.title.split(" ").slice(-1)[0]}</em>
              </h1>
              <p className=" text-black">{event.description}</p>

              <div className="flex gap-12 border-t border-[var(--line)] pt-6 max-md:flex-col max-md:gap-[18px]">
                <div>
                  <Calendar className="w-5 h-5" />
                  <div>
                    <strong>
                      {new Date(event.startAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </strong>
                    <small>
                      {new Date(event.startAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      onwards
                    </small>
                  </div>
                </div>
                <div>
                  <MapPin className="w-5 h-5" />
                  <div>
                    <strong>{event.venueName}</strong>
                    <small>{event.venueAddress}</small>
                  </div>
                </div>
                <div>
                  <Users className="w-5 h-5" />
                  <div>
                    <strong>{availableTickets} tickets left</strong>
                    <small>{Math.round(ticketPercentage)}% sold</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BookingPanel event={event} />
        </div>
      </section>
    </main>
  );
}
