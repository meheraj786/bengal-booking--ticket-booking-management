"use client";

import { useSellerEventList } from "@/hooks/useSellerEvent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const { data: events = [], isLoading } = useSellerEventList();

  const activeEvents = events.filter((e) => e.status === "PUBLISHED");
  const draftEvents = events.filter((e) => e.status === "DRAFT");
  const totalBookings = events.reduce(
    (sum, e) => sum + (e._count?.bookings || 0),
    0,
  );
  const totalRevenue = events.reduce((sum, e) => {
    const amount =
      parseFloat(e.price as unknown as string) * (e._count?.bookings || 0);
    return sum + amount;
  }, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Manage and grow your events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEvents.length}</div>
            <p className="text-xs text-gray-500">Currently published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Draft Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftEvents.length}</div>
            <p className="text-xs text-gray-500">Ready to publish</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-gray-500">Across all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500">Total earnings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild className="w-full">
              <Link href="/seller/events/create">Create Event</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/seller/events">View Events</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/seller/bookings">Bookings</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/seller/settings">Settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-8">
          <p>Loading your events...</p>
        </div>
      )}
    </div>
  );
}
