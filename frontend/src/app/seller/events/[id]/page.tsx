"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpDown, Edit, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/data-table";
import { TicketDialog } from "@/components/admin/dialogs/ticketDialog";
import { DeleteDialog } from "@/components/admin/dialogs/deleteDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useSellerEvent,
  usePublishSellerEvent,
  useDeleteSellerEvent,
} from "@/hooks/useSellerEvent";
import {
  useSellerTicketList,
  useCreateSellerTickets,
} from "@/hooks/useSellerTicket";
import { useSellerEventBookings } from "@/hooks/useSellerBooking";
import type { Ticket } from "@/types/ticket.types";
import type { PaginationParams } from "@/components/data-table";

export default function SellerEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const { data: event, isLoading } = useSellerEvent(eventId);
  const { data: tickets = [] } = useSellerTicketList(eventId);
  const { data: bookings = [] } = useSellerEventBookings(eventId);
  const createTickets = useCreateSellerTickets(eventId);
  const publishEvent = usePublishSellerEvent(eventId);
  const deleteEvent = useDeleteSellerEvent();

  if (isLoading) {
    return <div className="text-center py-8">Loading event...</div>;
  }

  if (!event) {
    return (
      <div className="text-center py-8">
        <p>Event not found</p>
        <Button asChild className="mt-4">
          <Link href="/seller/events">Back to Events</Link>
        </Button>
      </div>
    );
  }

  const ticketColumns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "ticketNumber",
      header: "Ticket #",
      cell: ({ row }) => `#${row.getValue("ticketNumber")}`,
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
          AVAILABLE: "secondary",
          LOCKED: "default",
          SOLD: "default",
          CANCELLED: "destructive",
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
      },
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => row.getValue("note") || "—",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt") as string).toLocaleDateString(),
    },
  ];

  const bookingColumns: ColumnDef<any>[] = [
    {
      accessorKey: "user.name",
      header: "Customer",
      cell: ({ row }) => row.original.user?.name,
    },
    {
      accessorKey: "quantity",
      header: "Qty",
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
  ];

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-gray-600 mt-1">{event.category?.name}</p>
        </div>
        <div className="flex gap-2">
          {event.status === "DRAFT" && (
            <Button
              onClick={() => publishEvent.mutate(undefined)}
              disabled={publishEvent.isPending}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Publish
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/seller/events/${eventId}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setDeletingEventId(eventId)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Event Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>{event.status}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">৳{event.price}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {event.soldTickets}/{event.totalTickets}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{bookings.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Tickets</h2>
          <Button onClick={() => setIsTicketDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Tickets
          </Button>
        </div>
        <DataTable
          columns={ticketColumns}
          data={tickets}
          totalCount={tickets.length}
          currentPage={pagination.page}
          pageSize={pagination.pageSize}
          onPaginationChange={setPagination}
          title="Tickets"
          searchPlaceholder="Search tickets..."
          showSearch
          enableColumnVisibility
          enablePagination
          loading={false}
          emptyMessage="No tickets found"
        />
      </div>

      {/* Bookings Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Bookings</h2>
        <DataTable
          columns={bookingColumns}
          data={bookings}
          totalCount={bookings.length}
          currentPage={pagination.page}
          pageSize={pagination.pageSize}
          onPaginationChange={setPagination}
          title="Bookings"
          searchPlaceholder="Search bookings..."
          showSearch
          enableColumnVisibility
          enablePagination
          loading={false}
          emptyMessage="No bookings yet"
        />
      </div>

      {/* Dialogs */}
      <TicketDialog
        open={isTicketDialogOpen}
        onOpenChange={setIsTicketDialogOpen}
        onSubmit={(data) => {
          createTickets.mutate(data, {
            onSuccess: () => {
              setIsTicketDialogOpen(false);
            },
          });
        }}
        eventTitle={event.title}
        isLoading={createTickets.isPending}
      />

      <DeleteDialog
        open={!!deletingEventId}
        onOpenChange={(open) => !open && setDeletingEventId(null)}
        onConfirm={() => {
          deleteEvent.mutate(eventId, {
            onSuccess: () => {
              router.push("/seller/events");
            },
          });
        }}
        title="Delete Event"
        description="This event and all associated bookings will be permanently deleted."
        isLoading={deleteEvent.isPending}
      />
    </div>
  );
}
