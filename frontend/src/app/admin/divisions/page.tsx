"use client";

import { useCallback, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import DataTable, { type PaginationParams } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteDialog } from "@/components/admin/dialogs/deleteDialog";
import { DivisionDialog } from "@/components/admin/dialogs/divisionDialog";
import {
  useCreateDivision,
  useDeleteDivision,
  useDivisionList,
  useUpdateDivision,
} from "@/hooks/useDivision";
import type { Division } from "@/types/division.types";
import type { DivisionFormInput } from "@/lib/validators";

export default function DivisionsPage() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [editingDivision, setEditingDivision] = useState<Division>();
  const [deletingDivisionId, setDeletingDivisionId] = useState<string | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: divisionResult, isLoading, error } = useDivisionList({
    page: pagination.page,
    limit: pagination.pageSize,
  });
  const divisions = divisionResult?.data ?? [];
  const createDivision = useCreateDivision();
  const updateDivision = useUpdateDivision(editingDivision?.id || "");
  const deleteDivision = useDeleteDivision();

  const handleCreate = useCallback(
    (data: DivisionFormInput) => {
      createDivision.mutate(data, { onSuccess: () => setIsDialogOpen(false) });
    },
    [createDivision],
  );

  const handleUpdate = useCallback(
    (data: DivisionFormInput) => {
      if (!editingDivision) return;
      updateDivision.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingDivision(undefined);
        },
      });
    },
    [editingDivision, updateDivision],
  );

  const handleDelete = useCallback(() => {
    if (!deletingDivisionId) return;
    deleteDivision.mutate(deletingDivisionId, {
      onSuccess: () => setDeletingDivisionId(null),
    });
  }, [deletingDivisionId, deleteDivision]);

  const columns: ColumnDef<Division>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent hover:text-primary-foreground/80"
        >
          Name <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {row.getValue("slug")}
        </code>
      ),
    },
    {
      accessorKey: "_count.areas",
      header: "Areas",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original._count?.areas || 0}</Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt") as string).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingDivision(row.original);
              setIsDialogOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeletingDivisionId(row.original.id)}
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
          <h1 className="text-3xl font-bold">Divisions</h1>
          <p className="text-gray-600">Manage divisions and their areas</p>
        </div>
        <Button
          onClick={() => {
            setEditingDivision(undefined);
            setIsDialogOpen(true);
          }}
        >
          + Create Division
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={divisions}
        totalCount={divisionResult?.pagination.total ?? 0}
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        onPaginationChange={setPagination}
        title="Divisions"
        searchPlaceholder="Search divisions..."
        showSearch
        enableExport
        enableColumnVisibility
        enablePagination
        loading={isLoading}
        emptyMessage={error ? "Failed to load divisions" : "No divisions found"}
      />
      <DivisionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={editingDivision ? handleUpdate : handleCreate}
        division={editingDivision}
        isLoading={createDivision.isPending || updateDivision.isPending}
      />
      <DeleteDialog
        open={!!deletingDivisionId}
        onOpenChange={(open) => !open && setDeletingDivisionId(null)}
        onConfirm={handleDelete}
        title="Delete Division"
        description="This division and its areas will be permanently deleted."
        isLoading={deleteDivision.isPending}
      />
    </div>
  );
}
