"use client";

import { useState, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2, Edit, CheckCircle2, Plus } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/data-table";
import { DeleteDialog } from "@/components/admin/dialogs/deleteDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useSellerEventList,
  usePublishSellerEvent,
  useDeleteSellerEvent,
} from "@/hooks/useSellerEvent";
import type { Event } from "@/types/event.types";
import type { PaginationParams } from "@/components/data-table";

export default function SellerEventsPage() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const { data: eventResult, isLoading, error } = useSellerEventList({
    page: pagination.page,
    limit: pagination.pageSize,
  });
  const events = eventResult?.data ?? [];
  const publishEvent = usePublishSellerEvent("");
  const deleteEvent = useDeleteSellerEvent();

  const handlePublish = useCallback(
    (eventId: string) => {
      publishEvent.mutate(undefined);
    },
    [publishEvent],
  );

  const handleDelete = useCallback(() => {
    if (!deletingEventId) return;
    deleteEvent.mutate(deletingEventId, {
      onSuccess: () => {
        setDeletingEventId(null);
      },
    });
  }, [deletingEventId, deleteEvent]);

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent hover:text-primary-foreground/80"
        >
          Title
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue("title")}</span>
          <span className="text-xs text-gray-500">
            {row.original.category?.name}
          </span>
        </div>
      ),
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
          DRAFT: "secondary",
          PUBLISHED: "default",
          CANCELLED: "destructive",
          COMPLETED: "secondary",
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
      },
    },
    {
      accessorKey: "startAt",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.getValue("startAt") as string).toLocaleDateString(),
    },
    {
      accessorKey: "paymentType",
      header: "Payment",
      cell: ({ row }) => row.original.paymentType,
    },
    {
      accessorKey: "_count.bookings",
      header: "Bookings",
      cell: ({ row }) => (
        <Badge variant="outline">
          {(row.original._count?.bookings || 0).toString()}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.status === "DRAFT" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePublish(row.original.id)}
              title="Publish event"
            >
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </Button>
          )}
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/seller/events/${row.original.id}/edit`}>
              <Edit className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeletingEventId(row.original.id)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-gray-600">Create and manage your events</p>
        </div>
        <Button asChild>
          <Link href="/seller/events/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={events}
        totalCount={eventResult?.pagination.total ?? 0}
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        onPaginationChange={setPagination}
        title="My Events"
        searchPlaceholder="Search your events..."
        showSearch
        enableExport
        enableColumnVisibility
        enablePagination
        loading={isLoading}
        emptyMessage={error ? "Failed to load events" : "No events found"}
      />

      <DeleteDialog
        open={!!deletingEventId}
        onOpenChange={(open) => !open && setDeletingEventId(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        description="This event and all associated bookings will be permanently deleted."
        isLoading={deleteEvent.isPending}
      />
    </div>
  );
}
