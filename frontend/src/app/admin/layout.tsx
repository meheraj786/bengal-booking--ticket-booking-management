import { ProtectedRoute } from "@/lib/protectedRoute";
import { AdminHeader } from "@/components/admin/header";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata = {
  title: "Admin Dashboard - Evently",
  description: "Manage your Evently platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={["SUPER_ADMIN"]}>
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
