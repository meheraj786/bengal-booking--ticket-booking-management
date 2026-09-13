"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BarChart3, CalendarDays, Ticket, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSellerDashboard } from "@/hooks/use-dashboards";

export default function SellerAnalyticsPage() {
  const { data, isLoading, error } = useSellerDashboard();
  const events = data?.events ?? [];
  const stats = data?.stats;
  const breakdown = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        sold: event.soldTickets ?? 0,
        capacity: event.totalTickets ?? 0,
        percentage:
          event.totalTickets > 0
            ? Math.min(100, (event.soldTickets / event.totalTickets) * 100)
            : 0,
      })),
    [events],
  );

  if (isLoading) return <div className="py-12 text-center">Loading analytics...</div>;
  if (error) return <div className="py-12 text-center text-red-600">Unable to load analytics.</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Performance overview</p>
          <h1 className="mt-2 text-3xl font-bold">Seller analytics</h1>
          <p className="mt-1 text-gray-600">Track event performance, ticket sales, and revenue.</p>
        </div>
        <Button asChild variant="outline"><Link href="/seller/events">Manage events</Link></Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="flex items-center gap-4 p-5"><CalendarDays className="h-9 w-9 rounded-xl bg-blue-100 p-2 text-blue-700" /><div><p className="text-sm text-gray-500">Published events</p><p className="text-2xl font-bold">{stats?.publishedEvents ?? 0}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-5"><Ticket className="h-9 w-9 rounded-xl bg-green-100 p-2 text-green-700" /><div><p className="text-sm text-gray-500">Tickets sold</p><p className="text-2xl font-bold">{stats?.ticketsSold ?? 0}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-5"><Wallet className="h-9 w-9 rounded-xl bg-orange-100 p-2 text-orange-700" /><div><p className="text-sm text-gray-500">Gross revenue</p><p className="text-2xl font-bold">৳{Number(stats?.grossRevenue ?? 0).toLocaleString()}</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Event performance</CardTitle></CardHeader>
        <CardContent>
          {breakdown.length === 0 ? <p className="py-8 text-center text-gray-500">Create an event to see analytics.</p> : (
            <div className="space-y-5">
              {breakdown.map((event) => (
                <div key={event.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div><p className="font-semibold">{event.title}</p><p className="text-xs text-gray-500">{new Date(event.startAt).toLocaleDateString()}</p></div>
                    <div className="flex items-center gap-3"><Badge variant="outline">{event.status}</Badge><span className="text-sm font-semibold">{event.sold}/{event.capacity} sold</span></div>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${event.percentage}%` }} /></div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
