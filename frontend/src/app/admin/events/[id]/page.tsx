"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TicketDialog } from "@/components/admin/dialogs/ticketDialog";
import { DeleteDialog } from "@/components/admin/dialogs/deleteDialog";
import { useEvent } from "@/hooks/useEvent";
import { useTicketList, useCreateTickets, useDeleteTicket } from "@/hooks/useTicket";
import type { Ticket } from "@/types/ticket.types";
import type { TicketFormInput } from "@/lib/validators";
import type { PaginationParams } from "@/components/data-table";

export default function AdminEventTicketsPage() {
  const eventId = useParams<{ id: string }>()?.id as string;
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, pageSize: 10 });
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);
  const { data: event } = useEvent(eventId);
  const { data, isLoading } = useTicketList(eventId, { page: pagination.page, limit: pagination.pageSize });
  const createTickets = useCreateTickets(eventId);
  const deleteTicket = useDeleteTicket(eventId);

  const columns: ColumnDef<Ticket>[] = [
    { accessorKey: "id", header: "Ticket ID", cell: ({ row }) => row.original.id },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description", cell: ({ row }) => row.original.description || "—" },
    { accessorKey: "price", header: "Price", cell: ({ row }) => `৳${Number(row.original.price).toLocaleString()}` },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.original.status}</Badge> },
    { id: "actions", header: "Actions", cell: ({ row }) => row.original.status !== "SOLD" && row.original.status !== "LOCKED" ? <Button variant="ghost" onClick={() => setDeletingTicketId(row.original.id)}>Delete</Button> : null },
  ];
  const handleCreate = (form: TicketFormInput) => createTickets.mutate({ ...form, description: form.description ?? "" }, { onSuccess: () => setTicketDialogOpen(false) });
  const handleDelete = () => {
    if (!deletingTicketId) return;
    deleteTicket.mutate(deletingTicketId, { onSuccess: () => setDeletingTicketId(null) });
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">{event?.title || "Event"} Tickets</h1><p className="text-gray-600">Create and manage tickets for this event.</p></div>
        <Button onClick={() => setTicketDialogOpen(true)}>Add Tickets</Button>
      </div>
      <DataTable columns={columns} data={data?.data ?? []} totalCount={data?.pagination.total ?? 0} currentPage={pagination.page} pageSize={pagination.pageSize} onPaginationChange={setPagination} title="Tickets" enablePagination loading={isLoading} emptyMessage="No tickets found" />
      <TicketDialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen} onSubmit={handleCreate} eventTitle={event?.title} paymentType={event?.paymentType} isLoading={createTickets.isPending} />
      <DeleteDialog open={!!deletingTicketId} onOpenChange={(open) => !open && setDeletingTicketId(null)} onConfirm={handleDelete} title="Delete ticket" description="This ticket will be removed from the event." isLoading={deleteTicket.isPending} />
    </div>
  );
}
