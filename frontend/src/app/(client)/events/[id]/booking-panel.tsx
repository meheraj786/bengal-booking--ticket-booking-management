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

  const availableTickets = event.totalTickets - event.soldTickets;
  const totalPrice = Number(event.price) * quantity;

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
      <CardHeader>
        <CardTitle className="text-2xl">৳ {event.price}</CardTitle>
        <p className="text-sm text-gray-600">per ticket</p>
      </CardHeader>
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

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Subtotal</span>
            <span className="font-medium">৳ {totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Service fee</span>
            <span className="font-medium">৳ 0</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>৳ {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {availableTickets > 0 ? (
          <>
            <Button
              onClick={handleBooking}
              disabled={createBooking.isPending || availableTickets === 0}
              className="w-full"
              size="lg"
            >
              {createBooking.isPending ? "Booking..." : "Get tickets"}
            </Button>
            <p className="text-xs text-center text-gray-500">
              {availableTickets} tickets available
            </p>
          </>
        ) : (
          <Button disabled className="w-full" size="lg">
            Sold out
          </Button>
        )}

        {createBooking.isError && (
          <p className="text-sm text-red-600 text-center">
            {createBooking.error.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
