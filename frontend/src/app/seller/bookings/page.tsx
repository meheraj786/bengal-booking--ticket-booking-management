"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSellerEventList } from "@/hooks/useSellerEvent";
import { useSellerEventBookings } from "@/hooks/useSellerBooking";
import { useBookingList } from "@/hooks/useBooking";
import type { Booking } from "@/types/booking.types";
import type { PaginationParams } from "@/components/data-table";

export default function SellerBookingsPage() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const { data: eventResult } = useSellerEventList();
  const events = eventResult?.data ?? [];
  const { data: allBookingResult, isLoading: allBookingsLoading } =
    useBookingList(selectedEventId ? undefined : {
      page: pagination.page,
      limit: pagination.pageSize,
    });
  const { data: eventBookingResult, isLoading: eventBookingsLoading } =
    useSellerEventBookings(selectedEventId || "", pagination);
  const bookingResult = selectedEventId ? eventBookingResult : allBookingResult;
  const bookings = bookingResult?.data ?? [];

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "buyerName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent hover:text-primary-foreground/80"
        >
          Customer
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback>{row.original.buyerName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{row.original.buyerName}</p>
            <p className="text-xs text-gray-500">{row.original.buyerPhone}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "buyerAddress",
      header: "Address",
      cell: ({ row }) => (
        <span className="max-w-48 truncate" title={row.original.buyerAddress}>
          {row.original.buyerAddress}
        </span>
      ),
    },
    {
      accessorKey: "buyerPhone",
      header: "Phone",
    },
    {
      id: "tickets",
      header: "Tickets",
      cell: ({ row }) =>
        row.original.tickets?.map((ticket) => ticket.name).join(", ") || "-",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("quantity")}</Badge>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => `৳${row.getValue("totalAmount")}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<
          string,
          "default" | "secondary" | "destructive"
        > = {
          PENDING: "secondary",
          CONFIRMED: "default",
          CANCELLED: "destructive",
          EXPIRED: "secondary",
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Booked On",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt") as string).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-gray-600">View bookings for your events</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSelectedEventId(null)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            selectedEventId === null
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          All Events
        </button>
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => setSelectedEventId(event.id)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              selectedEventId === event.id
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {event.title}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        totalCount={bookingResult?.pagination.total ?? 0}
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        onPaginationChange={setPagination}
        title="Bookings"
        searchPlaceholder="Search bookings..."
        showSearch
        enableColumnVisibility
        enablePagination
        loading={selectedEventId ? eventBookingsLoading : allBookingsLoading}
        emptyMessage={
          selectedEventId ? "No bookings for this event" : "No bookings found"
        }
      />
    </div>
  );
}
