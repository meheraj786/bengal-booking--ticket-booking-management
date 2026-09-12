import { AdminLayoutContent } from "./admin-layout-content";

export const metadata = {
  title: "Admin Dashboard - Evently",
  description: "Manage your Evently platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
