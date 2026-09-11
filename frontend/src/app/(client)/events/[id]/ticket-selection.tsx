"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/types/event.types";
import { Minus, Plus } from "lucide-react";

interface TicketSelectionProps {
  event: Event;
  onSelectTickets: (quantity: number) => void;
  isLoading?: boolean;
}

export function TicketSelection({
  event,
  onSelectTickets,
  isLoading,
}: TicketSelectionProps) {
  const [quantity, setQuantity] = useState(1);
  const availableTickets = event.totalTickets - event.soldTickets;
  const totalPrice = Number(event.price) * quantity;
  const ticketPercentage = (event.soldTickets / event.totalTickets) * 100;

  const handleQuantityChange = (newQuantity: number) => {
    if (
      newQuantity >= 1 &&
      newQuantity <= event.maxTicketsPerBooking &&
      newQuantity <= availableTickets
    ) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Card className="sticky top-20 h-fit">
      <CardHeader>
        <CardTitle className="text-2xl">
          ৳ {Number(event.price).toLocaleString()}
        </CardTitle>
        <p className="text-sm text-gray-600">per ticket</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tickets available</span>
            <span className="font-medium">
              {availableTickets} / {event.totalTickets}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(ticketPercentage, 100)}%` }}
            />
          </div>
          {availableTickets < 10 && availableTickets > 0 && (
            <p className="text-xs text-orange-600">
              Only {availableTickets} tickets left!
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Number of tickets
          </label>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
            <button
              className="p-2 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isLoading}
              type="button"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center font-medium">{quantity}</span>
            <button
              className="p-2 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={
                quantity >= event.maxTicketsPerBooking ||
                quantity >= availableTickets ||
                isLoading
              }
              type="button"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Max {event.maxTicketsPerBooking} per booking
          </p>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Subtotal</span>
            <span className="font-medium">৳ {totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Service fee</span>
            <span className="font-medium">৳ 0</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>৳ {totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {availableTickets > 0 ? (
          <Button
            onClick={() => onSelectTickets(quantity)}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Processing..." : "Continue to checkout"}
          </Button>
        ) : (
          <Button disabled className="w-full" size="lg">
            Sold out
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
