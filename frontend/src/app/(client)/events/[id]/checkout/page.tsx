"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  useBooking,
  useCheckoutBooking,
  useConfirmBooking,
} from "@/hooks/useBooking";
import { useSellerEvent } from "@/hooks/useSellerEvent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;
  const bookingId = params?.bookingId as string;

  const { user } = useAuthStore();
  const { data: event } = useSellerEvent(eventId);
  const { data: booking, isLoading: bookingLoading } = useBooking(bookingId);
  const checkout = useCheckoutBooking();
  const confirm = useConfirmBooking(bookingId);

  const [selectedPayment, setSelectedPayment] = useState<"FREE" | "SSLCOMMERZ">(
    Number(event?.price) === 0 ? "FREE" : "SSLCOMMERZ",
  );

  const isExpired = Boolean(
    booking?.expiresAt && new Date(booking.expiresAt) < new Date(),
  );

  useEffect(() => {
    if (isExpired) {
      router.push(`/events/${eventId}`);
    }
  }, [isExpired, eventId, router]);

  const handleCheckout = async () => {
    if (Number(event?.price) === 0) {
      confirm.mutate(
        {},
        {
          onSuccess: () => {
            router.push(`/bookings/${bookingId}`);
          },
        },
      );
    } else {
      checkout.mutate(
        { bookingId, paymentMethod: selectedPayment },
        {
          onSuccess: (data) => {
            if (data.paymentUrl) {
              window.location.href = data.paymentUrl;
            }
          },
        },
      );
    }
  };

  if (bookingLoading) {
    return (
      <main className="route-shell">
        <div className="wrap">
          <div className="text-center py-12">Loading checkout...</div>
        </div>
      </main>
    );
  }

  if (!booking || !event) {
    return (
      <main className="route-shell">
        <div className="wrap">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Booking not found</p>
            <Button asChild>
              <Link href="/explore">Back to events</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const timeRemaining = booking.expiresAt
    ? Math.floor(
        (new Date(booking.expiresAt).getTime() - new Date().getTime()) / 1000,
      )
    : 0;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <main className="route-shell">
      <section className="wrap">
        <Link href={`/events/${eventId}`} className="back-link">
          ← Back to event
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{booking.event?.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.event?.startAt || "").toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Tickets ({booking.quantity}x)</span>
                    <span className="font-medium">
                      ৳ {booking.event?.price}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Service fee</span>
                    <span className="font-medium">৳ 0</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                      ৳ {Number(booking.totalAmount).toLocaleString()}
                    </span>
                  </div>
                </div>

                {Number(event.price) === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">
                      This is a free event. No payment required.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {Number(event.price) > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="SSLCOMMERZ"
                      checked={selectedPayment === "SSLCOMMERZ"}
                      onChange={() => setSelectedPayment("SSLCOMMERZ")}
                    />
                    <div>
                      <p className="font-medium">SSLCommerz</p>
                      <p className="text-xs text-gray-600">
                        Pay with card, mobile money, or bank transfer
                      </p>
                    </div>
                  </label>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={user?.name || ""} readOnly disabled />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={user?.phone || ""}
                    readOnly
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order expires in</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-lg font-bold">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span>
                    {minutes}:{seconds.toString().padStart(2, "0")}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Complete your purchase before this runs out
                </p>
              </CardContent>
            </Card>

            <Button
              onClick={handleCheckout}
              disabled={checkout.isPending || confirm.isPending || isExpired}
              size="lg"
              className="w-full"
            >
              {confirm.isPending || checkout.isPending
                ? "Processing..."
                : "Complete Purchase"}
            </Button>

            {(confirm.isError || checkout.isError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  {confirm.error?.message || checkout.error?.message}
                </p>
              </div>
            )}

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <p className="text-xs text-blue-900">
                  By completing this purchase, you agree to our Terms of Service
                  and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
