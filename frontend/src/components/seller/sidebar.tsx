"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useLogout } from "@/hooks/use-auth";
import { authStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/events", label: "Events", icon: Calendar },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/seller/settings", label: "Settings", icon: Settings },
];

export function SellerSidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        authStore.clearUser();
        window.location.href = "/login";
      },
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 hover:bg-gray-100 rounded-lg"
      >
        <LayoutDashboard className="w-6 h-6" />
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-blue-600 text-white transition-transform duration-300 md:translate-x-0 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-blue-500">
          <Link href="/seller/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-blue-600">
              E
            </div>
            <span className="font-bold text-lg">Bengal Booking Seller</span>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-blue-100 hover:bg-blue-500 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-500">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-blue-100 hover:bg-blue-500 hover:text-white"
            disabled={logout.isPending}
          >
            <LogOut className="w-5 h-5 mr-3" />
            {logout.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
