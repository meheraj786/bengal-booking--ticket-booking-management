import { ProtectedRoute } from "@/lib/protectedRoute";
import { SellerSidebar } from "@/components/seller/sidebar";
import { SellerHeader } from "@/components/seller/header";

export const metadata = {
  title: "Seller Dashboard - Bengal Booking",
  description: "Manage your events",
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={["SELLER"]}>
      <div className="flex">
        <SellerSidebar />
        <div className="flex-1 md:ml-64">
          <SellerHeader />
          <main className="mt-16 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
