"use client";

import { useState } from "react";
import DataTable from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { usePaymentList } from "@/hooks/usePayment";
import type { Payment } from "@/types/payment.types";
import type { PaginationParams } from "@/components/data-table";

export default function AdminPaymentsPage() {
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, pageSize: 10 });
  const { data, isLoading, error } = usePaymentList({ page: pagination.page, limit: pagination.pageSize });
  const columns: ColumnDef<Payment>[] = [
    { accessorKey: "id", header: "Payment ID", cell: ({ row }) => row.original.id.slice(0, 8) },
    { accessorKey: "bookingId", header: "Booking", cell: ({ row }) => row.original.bookingId.slice(0, 8) },
    { accessorKey: "amount", header: "Amount", cell: ({ row }) => `৳${row.original.amount}` },
    { accessorKey: "provider", header: "Provider" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.original.status}</Badge> },
    { accessorKey: "createdAt", header: "Created", cell: ({ row }) => new Date(row.original.createdAt).toLocaleString() },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Payments</h1><p className="text-gray-600">Read payment records across the platform.</p></div>
      <DataTable columns={columns} data={data?.data ?? []} totalCount={data?.pagination.total ?? 0} currentPage={pagination.page} pageSize={pagination.pageSize} onPaginationChange={setPagination} title="Payments" enablePagination loading={isLoading} emptyMessage={error ? "Failed to load payments" : "No payments found"} />
    </div>
  );
}
