"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function WishlistPage() {
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

        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 mb-4">Wishlist feature coming soon!</p>
            <p className="text-sm text-gray-500">
              Start adding events to your wishlist to save them for later.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
