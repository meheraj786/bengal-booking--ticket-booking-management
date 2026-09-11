"use client";

import { useState, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2, Edit } from "lucide-react";
import DataTable from "@/components/data-table";
import { CategoryDialog } from "@/components/admin/dialogs/categoryDialog";
import { DeleteDialog } from "@/components/admin/dialogs/deleteDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useCategoryList,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategory";
import type { Category } from "@/types/category.types";
import type { CategoryFormInput } from "@/lib/validators";
import type { PaginationParams } from "@/components/data-table";

export default function CategoriesPage() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: categories = [], isLoading, error } = useCategoryList();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(editingCategory?.id || "");
  const deleteCategory = useDeleteCategory();

  const handleCreate = useCallback(
    async (data: CategoryFormInput) => {
      createCategory.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    },
    [createCategory],
  );

  const handleUpdate = useCallback(
    async (data: CategoryFormInput) => {
      if (!editingCategory) return;
      updateCategory.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingCategory(undefined);
        },
      });
    },
    [editingCategory, updateCategory],
  );

  const handleDelete = useCallback(() => {
    if (!deletingCategoryId) return;
    deleteCategory.mutate(deletingCategoryId, {
      onSuccess: () => {
        setDeletingCategoryId(null);
      },
    });
  }, [deletingCategoryId, deleteCategory]);

  const openCreateDialog = () => {
    setEditingCategory(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<Category>[] = [
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
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const desc = row.getValue("description") as string | undefined;
        return desc ? (
          <p className="text-sm truncate max-w-xs">{desc}</p>
        ) : (
          <span className="text-gray-400">—</span>
        );
      },
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
            onClick={() => setDeletingCategoryId(row.original.id)}
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
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-600">Manage event categories</p>
        </div>
        <Button onClick={openCreateDialog}>+ Create Category</Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        totalCount={categories.length}
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        onPaginationChange={setPagination}
        title="Categories"
        searchPlaceholder="Search categories..."
        showSearch
        enableExport
        enableColumnVisibility
        enablePagination
        loading={isLoading}
        emptyMessage={
          error ? "Failed to load categories" : "No categories found"
        }
      />

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={editingCategory ? handleUpdate : handleCreate}
        category={editingCategory}
        isLoading={createCategory.isPending || updateCategory.isPending}
      />

      <DeleteDialog
        open={!!deletingCategoryId}
        onOpenChange={(open) => !open && setDeletingCategoryId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="This category and all associated data will be permanently deleted."
        isLoading={deleteCategory.isPending}
      />
    </div>
  );
}
