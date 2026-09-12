import { AdminLayoutContent } from "./admin-layout-content";
import "../globals.css";

export const metadata = {
  title: "Admin Dashboard - Bengal Booking",
  description: "Manage your Bengal Booking platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
