"use client";

import { useState, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Shield, Lock } from "lucide-react";
import DataTable from "@/components/data-table";
import { UserRoleDialog } from "@/components/admin/dialogs/userRoleDialog";
import { UserStatusDialog } from "@/components/admin/dialogs/userStatusDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useUserList,
  useUpdateUserRole,
  useUpdateUserStatus,
} from "@/hooks/useUser";
import type { User } from "@/types/user.types";
import type { UserRoleInput } from "@/lib/validators";
import type { UserStatusInput } from "@/lib/validators";
import type { PaginationParams } from "@/components/data-table";

export default function UsersPage() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [roleDialogUser, setRoleDialogUser] = useState<User | undefined>();
  const [statusDialogUser, setStatusDialogUser] = useState<User | undefined>();
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const { data: userResult, isLoading, error } = useUserList({
    page: pagination.page,
    limit: pagination.pageSize,
  });
  const users = userResult?.data ?? [];
  const updateRole = useUpdateUserRole();
  const updateStatus = useUpdateUserStatus();

  const handleUpdateRole = useCallback(
    (data: UserRoleInput) => {
      if (!roleDialogUser) return;
      updateRole.mutate(
        { id: roleDialogUser.id, payload: data },
        {
          onSuccess: () => {
            setRoleDialogOpen(false);
            setRoleDialogUser(undefined);
          },
        },
      );
    },
    [roleDialogUser, updateRole],
  );

  const handleUpdateStatus = useCallback(
    (data: UserStatusInput) => {
      if (!statusDialogUser) return;
      updateStatus.mutate(
        { id: statusDialogUser.id, payload: data },
        {
          onSuccess: () => {
            setStatusDialogOpen(false);
            setStatusDialogUser(undefined);
          },
        },
      );
    },
    [statusDialogUser, updateStatus],
  );

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent hover:text-primary-foreground/80"
        >
          User
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={row.original.image ?? undefined}
              alt={row.original.name}
            />
            <AvatarFallback>
              {row.original.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-gray-500">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const variants: Record<
          string,
          "default" | "secondary" | "destructive"
        > = {
          SUPER_ADMIN: "destructive",
          SELLER: "default",
          USER: "secondary",
        };
        return <Badge variant={variants[role]}>{role}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isVerified",
      header: "Verified",
      cell: ({ row }) => (
        <Badge variant={row.getValue("isVerified") ? "default" : "outline"}>
          {row.getValue("isVerified") ? "✓" : "✗"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
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
              setRoleDialogUser(row.original);
              setRoleDialogOpen(true);
            }}
            title="Change role"
          >
            <Shield className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusDialogUser(row.original);
              setStatusDialogOpen(true);
            }}
            title="Change status"
          >
            <Lock className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-600">Manage platform users and permissions</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        totalCount={userResult?.pagination.total ?? 0}
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        onPaginationChange={setPagination}
        title="Users"
        searchPlaceholder="Search users..."
        showSearch
        enableExport
        enableColumnVisibility
        enablePagination
        loading={isLoading}
        emptyMessage={error ? "Failed to load users" : "No users found"}
      />

      <UserRoleDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onSubmit={handleUpdateRole}
        user={roleDialogUser}
        isLoading={updateRole.isPending}
      />

      <UserStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onSubmit={handleUpdateStatus}
        user={statusDialogUser}
        isLoading={updateStatus.isPending}
      />
    </div>
  );
}
