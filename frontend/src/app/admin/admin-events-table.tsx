"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import DataTable, { type PaginationParams } from "@/components/data-table";
import { useAdminDashboard } from "@/hooks/use-dashboards";
import type { AdminDashboard } from "@/services/dashboard.service";

type AdminEvent = AdminDashboard["events"][number];

export default function AdminEventsTable() {
  const query = useAdminDashboard();
  const [page, setPage] = useState(1);
  const columns = useMemo<ColumnDef<AdminEvent>[]>(
    () => [
      { accessorKey: "title", header: "Event" },
      { id: "seller", header: "Seller", accessorFn: (row) => row.seller.name },
      { accessorKey: "status", header: "Status" },
    ],
    [],
  );
  const handlePagination = (params: PaginationParams) => setPage(params.page);
  return (
    <DataTable
      columns={columns}
      data={query.data?.events ?? []}
      totalCount={query.data?.events.length ?? 0}
      currentPage={page}
      onPaginationChange={handlePagination}
      title="Event moderation"
      loading={query.isLoading}
      emptyMessage="No events found."
    />
  );
}
