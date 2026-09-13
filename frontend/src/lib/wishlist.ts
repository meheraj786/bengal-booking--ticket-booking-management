import type { Event } from "@/types/event.types";

export const WISHLIST_STORAGE_KEY = "bengal-booking-wishlist";

export type WishlistEvent = Pick<
  Event,
  "id" | "title" | "coverImage" | "startAt" | "venueName" | "venueAddress" | "paymentType"
> & {
  areaName?: string;
};

export function getWishlist(): WishlistEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as WishlistEvent[]) : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(event: Event): WishlistEvent[] {
  const wishlist = getWishlist();
  const exists = wishlist.some((item) => item.id === event.id);
  const next = exists
    ? wishlist.filter((item) => item.id !== event.id)
    : [
        ...wishlist,
        {
          id: event.id,
          title: event.title,
          coverImage: event.coverImage,
          startAt: event.startAt,
          venueName: event.venueName,
          venueAddress: event.venueAddress,
          paymentType: event.paymentType,
          areaName: event.area?.name,
        },
      ];
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("wishlistchange"));
  return next;
}
