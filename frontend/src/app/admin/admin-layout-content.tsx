"use client";

import { usePathname } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ProtectedRoute } from "@/lib/protectedRoute";

export function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} fallbackPath="/admin/login">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 md:ml-64">
          <AdminHeader />
          <main className="mt-16 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
