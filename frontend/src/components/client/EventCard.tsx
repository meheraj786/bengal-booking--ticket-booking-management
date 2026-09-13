"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Heart, MapPin } from "lucide-react";
import type { Event } from "@/types/event.types";
import { getWishlist, toggleWishlist } from "@/lib/wishlist";

export function EventCard({ event }: { event: Event }) {
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    const sync = () => setIsLiked(getWishlist().some((item) => item.id === event.id));
    sync();
    window.addEventListener("wishlistchange", sync);
    return () => window.removeEventListener("wishlistchange", sync);
  }, [event.id]);

  const isFree = event.paymentType === "Free";

  const formattedDate = event.startAt
    ? format(new Date(event.startAt), "EEE, MMM d · h:mm a").toUpperCase()
    : "DATE TBA";

  const locationText = [event.venueName, event.area?.name]
    .filter(Boolean)
    .join(", ");

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(toggleWishlist(event).some((item) => item.id === event.id));
  };

  if (isFree) {
    return (
      <Link
        href={`/events/${event.id}`}
        className="group relative flex w-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
      >
        <div className="relative w-[48%] min-h-[190px] overflow-hidden">
          <Image
            src={event.coverImage || ""}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 250px"
          />
          <button
            type="button"
            onClick={handleLikeClick}
            className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm transition-transform hover:scale-110 active:scale-95"
            aria-label="Save to favorites"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isLiked ? "fill-primary text-primary" : "text-slate-700"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="space-y-1.5">
            <h3 className="line-clamp-2 text-base font-bold text-[#141738] leading-tight">
              {event.title}
            </h3>

            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
              {formattedDate}
            </p>

            <div className="flex items-center gap-1 text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="line-clamp-1 text-xs font-normal">
                {locationText || event.venueAddress}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-sm font-bold text-[#141738]">Free</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/events/${event.id}`}
      className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={event.coverImage || ""}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
        />

        <button
          type="button"
          onClick={handleLikeClick}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm transition-transform hover:scale-110 active:scale-95"
          aria-label="Save to favorites"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isLiked ? "fill-primary text-primary" : "text-slate-700"
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-lg font-bold text-[#141738]">
            {event.title}
          </h3>

          <div className="text-right shrink-0">
            <span className="text-base font-bold text-[#141738]">
              {event.paymentType}
            </span>
            <span className="block text-[10px] text-slate-400">Payment</span>
          </div>
        </div>

        <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-primary">
          {formattedDate}
        </p>

        <div className="mt-2.5 flex items-center gap-1.5 text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="line-clamp-1 text-xs font-normal">
            {locationText || event.venueAddress}
          </span>
        </div>
      </div>
    </Link>
  );
}
