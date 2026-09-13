"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin } from "lucide-react";
import { getWishlist, type WishlistEvent } from "@/lib/wishlist";

export default function WishlistPage() {
  const [events, setEvents] = useState<WishlistEvent[]>([]);
  useEffect(() => {
    const sync = () => setEvents(getWishlist());
    sync();
    window.addEventListener("wishlistchange", sync);
    return () => window.removeEventListener("wishlistchange", sync);
  }, []);

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[75px] max-md:w-[calc(100%-32px)]">
        <p className="mb-[18px] font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)]">
          YOUR EVENTLY
        </p>
        <h1 className="m-0 text-[clamp(48px,6vw,72px)] font-medium leading-[0.98] tracking-[-4px]">
          Your saved
          <br />
          <em>events.</em>
        </h1>

        <div className="mb-8 mt-[45px] flex gap-[25px] border-b border-[var(--line)]">
          <Link
            className="pb-[13px] text-xs text-[var(--muted)]"
            href="/bookings"
          >
            My bookings
          </Link>
          <Link
            href="/wishlist"
            className="border-b-2 border-[var(--coral)] pb-[13px] text-xs text-[var(--ink)]"
          >
            Wishlist
          </Link>
        </div>

        {events.length === 0 ? (
          <Card><CardContent className="p-12 text-center">
            <p className="mb-4 text-gray-600">Your wishlist is empty.</p>
            <p className="text-sm text-gray-500">Save events you want to revisit later.</p>
          </CardContent></Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative aspect-[16/10] bg-slate-100">
                  {event.coverImage && <Image src={event.coverImage} alt={event.title} fill className="object-cover" />}
                  <button
                    type="button"
                    onClick={() => {
                      const next = getWishlist().filter((item) => item.id !== event.id);
                      localStorage.setItem("bengal-booking-wishlist", JSON.stringify(next));
                      window.dispatchEvent(new Event("wishlistchange"));
                      setEvents(next);
                    }}
                    className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-500"
                    aria-label={`Remove ${event.title} from wishlist`}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                <CardContent className="space-y-2 p-4">
                  <Link href={`/events/${event.id}`} className="font-semibold hover:text-primary">{event.title}</Link>
                  <p className="text-xs text-primary">{new Date(event.startAt).toLocaleString()}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{event.venueName}, {event.areaName ?? event.venueAddress}</p>
                  <p className="text-sm font-semibold">{event.paymentType}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
