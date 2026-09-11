"use client";

import { useState, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2, Edit } from "lucide-react";
import DataTable from "@/components/data-table";
import { AreaDialog } from "@/components/admin/dialogs/areaDialog";
import { DeleteDialog } from "@/components/admin/dialogs/deleteDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useAreaList,
  useCreateArea,
  useUpdateArea,
  useDeleteArea,
} from "@/hooks/useArea";
import type { Area } from "@/types/area.types";
import type { AreaFormInput } from "@/lib/validators";
import type { PaginationParams } from "@/components/data-table";

export default function AreasPage() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [editingArea, setEditingArea] = useState<Area | undefined>();
  const [deletingAreaId, setDeletingAreaId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: areas = [], isLoading, error } = useAreaList();
  const createArea = useCreateArea();
  const updateArea = useUpdateArea(editingArea?.id || "");
  const deleteArea = useDeleteArea();

  const handleCreate = useCallback(
    async (data: AreaFormInput) => {
      createArea.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    },
    [createArea],
  );

  const handleUpdate = useCallback(
    async (data: AreaFormInput) => {
      if (!editingArea) return;
      updateArea.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingArea(undefined);
        },
      });
    },
    [editingArea, updateArea],
  );

  const handleDelete = useCallback(() => {
    if (!deletingAreaId) return;
    deleteArea.mutate(deletingAreaId, {
      onSuccess: () => {
        setDeletingAreaId(null);
      },
    });
  }, [deletingAreaId, deleteArea]);

  const openCreateDialog = () => {
    setEditingArea(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (area: Area) => {
    setEditingArea(area);
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<Area>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent hover:text-primary-foreground/80"
        >
          Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
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
      accessorKey: "_count.events",
      header: "Events",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {(row.original._count?.events || 0).toString()}
        </Badge>
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
            onClick={() => openEditDialog(row.original)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeletingAreaId(row.original.id)}
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
          <h1 className="text-3xl font-bold">Areas</h1>
          <p className="text-gray-600">Manage event areas and locations</p>
        </div>
        <Button onClick={openCreateDialog}>+ Create Area</Button>
      </div>

      <DataTable
        columns={columns}
        data={areas}
        totalCount={areas.length}
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        onPaginationChange={setPagination}
        title="Areas"
        searchPlaceholder="Search areas..."
        showSearch
        enableExport
        enableColumnVisibility
        enablePagination
        loading={isLoading}
        emptyMessage={error ? "Failed to load areas" : "No areas found"}
      />

      <AreaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={editingArea ? handleUpdate : handleCreate}
        area={editingArea}
        isLoading={createArea.isPending || updateArea.isPending}
      />

      <DeleteDialog
        open={!!deletingAreaId}
        onOpenChange={(open) => !open && setDeletingAreaId(null)}
        onConfirm={handleDelete}
        title="Delete Area"
        description="This area and all associated data will be permanently deleted."
        isLoading={deleteArea.isPending}
      />
    </div>
  );
}
