"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function WishlistPage() {
  return (
    <main className="route-shell">
      <section className="account-wrap wrap">
        <p className="eyebrow">YOUR EVENTLY</p>
        <h1>
          Your saved
          <br />
          <em>events.</em>
        </h1>

        <div className="account-tabs mb-8">
          <Link href="/bookings">My bookings</Link>
          <Link href="/wishlist" className="selected">
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
