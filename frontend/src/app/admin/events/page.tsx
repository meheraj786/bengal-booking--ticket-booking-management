"use client";

import { useState, useCallback, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2, Edit, CheckCircle2, Zap } from "lucide-react";
import DataTable from "@/components/data-table";
import { EventDialog } from "@/components/admin/dialogs/eventDialog";
import { DeleteDialog } from "@/components/admin/dialogs/deleteDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useEventList,
  useEventFilters,
  useCreateEvent,
  useUpdateEvent,
  usePublishEvent,
  useDeleteEvent,
} from "@/hooks/useEvent";
import type { Event, EventFormInput } from "@/types/event.types";
import type { PaginationParams } from "@/components/data-table";

export default function EventsPage() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: events = [], isLoading, error } = useEventList();
  const { data: filters } = useEventFilters();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent(editingEvent?.id || "");
  const publishEvent = usePublishEvent(editingEvent?.id || "");
  const deleteEvent = useDeleteEvent();

  const handleCreate = useCallback(
    (data: EventFormInput) => {
      createEvent.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    },
    [createEvent],
  );

  const handleUpdate = useCallback(
    (data: EventFormInput) => {
      if (!editingEvent) return;
      updateEvent.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingEvent(undefined);
        },
      });
    },
    [editingEvent, updateEvent],
  );

  const handlePublish = useCallback(
    (eventId: string) => {
      publishEvent.mutate(undefined, {
        onSuccess: () => {
          setEditingEvent(undefined);
        },
      });
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

  const openCreateDialog = () => {
    setEditingEvent(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

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
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `৳${row.getValue("price")}`,
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditDialog(row.original)}
          >
            <Edit className="w-4 h-4" />
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
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-gray-600">Manage all events on your platform</p>
        </div>
        <Button onClick={openCreateDialog}>+ Create Event</Button>
      </div>

      <DataTable
        columns={columns}
        data={events}
        totalCount={events.length}
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        onPaginationChange={setPagination}
        title="Events"
        searchPlaceholder="Search events..."
        showSearch
        enableExport
        enableColumnVisibility
        enablePagination
        loading={isLoading}
        emptyMessage={error ? "Failed to load events" : "No events found"}
      />

      <EventDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={editingEvent ? handleUpdate : handleCreate}
        event={editingEvent}
        categories={filters?.categories}
        areas={filters?.areas}
        isLoading={createEvent.isPending || updateEvent.isPending}
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
