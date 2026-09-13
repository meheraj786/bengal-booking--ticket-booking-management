"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useCreateBooking } from "@/hooks/useBooking";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/types/event.types";

interface BookingPanelProps {
  event: Event;
}

export function BookingPanel({ event }: BookingPanelProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const createBooking = useCreateBooking();
  const [quantity, setQuantity] = useState(1);
  const [buyer, setBuyer] = useState({ buyerName: "", buyerAddress: "", buyerPhone: "" });

  const handleBooking = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (event.status !== "PUBLISHED") {
      alert("This event is not available for booking");
      return;
    }

    createBooking.mutate(
      {
        eventId: event.id,
        quantity,
        ...buyer,
      },
      {
        onSuccess: (data) => {
          router.push(`/bookings/${data.bookingId}`);
        },
      },
    );
  };

  return (
    <Card className="sticky top-20 h-fit">
      <CardHeader><CardTitle className="text-2xl">{event.paymentType}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Number of tickets
          </label>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
            <button
              className="px-3 py-2"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="flex-1 text-center">{quantity}</span>
            <button
              className="px-3 py-2"
              onClick={() =>
                setQuantity(Math.min(event.maxTicketsPerBooking, quantity + 1))
              }
              disabled={quantity >= event.maxTicketsPerBooking}
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Max {event.maxTicketsPerBooking} per booking
          </p>
        </div>

        <div className="space-y-2">
          <input className="w-full rounded border p-2" placeholder="Buyer name" value={buyer.buyerName} onChange={(e) => setBuyer({ ...buyer, buyerName: e.target.value })} />
          <input className="w-full rounded border p-2" placeholder="Buyer phone" value={buyer.buyerPhone} onChange={(e) => setBuyer({ ...buyer, buyerPhone: e.target.value })} />
          <textarea className="w-full rounded border p-2" placeholder="Buyer address" value={buyer.buyerAddress} onChange={(e) => setBuyer({ ...buyer, buyerAddress: e.target.value })} />
        </div>

        {
          <>
            <Button
              onClick={handleBooking}
              disabled={createBooking.isPending || !buyer.buyerName || !buyer.buyerPhone || !buyer.buyerAddress}
              className="w-full"
              size="lg"
            >
              {createBooking.isPending ? "Booking..." : "Get tickets"}
            </Button>
          </>
        }

        {createBooking.isError && (
          <p className="text-sm text-red-600 text-center">
            {createBooking.error.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
