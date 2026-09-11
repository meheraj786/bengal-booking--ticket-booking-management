"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/use-auth";
import { authStore } from "@/store/auth.store";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuthStore();
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

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="nav wrap">
      <Link className="brand" href="/">
        evently<span>.</span>
      </Link>

      <div className="nav-links hidden md:flex">
        <Link
          href="/explore"
          className={isActive("/explore") ? "active-link" : ""}
        >
          Explore
        </Link>
        <a href="/#categories">Categories</a>
        <a href="/#about">About us</a>
      </div>

      <div className="nav-actions">
        <button className="icon-button md:flex hidden" aria-label="Search">
          ⌕
        </button>

        {isLoading ? (
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer w-8 h-8">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem disabled className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/bookings">My Bookings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wishlist">Wishlist</Link>
              </DropdownMenuItem>
              {user.role === "SELLER" && (
                <DropdownMenuItem asChild>
                  <Link href="/seller/dashboard">Seller Dashboard</Link>
                </DropdownMenuItem>
              )}
              {user.role === "SUPER_ADMIN" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard">Admin Dashboard</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link className="login-link hidden md:inline" href="/login">
              Log in
            </Link>
            <Link className="button button-small" href="/register">
              Create account
            </Link>
          </>
        )}

        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 space-y-2">
          <Link
            href="/explore"
            className="block py-2"
            onClick={() => setIsOpen(false)}
          >
            Explore
          </Link>
          <a
            href="/#categories"
            className="block py-2"
            onClick={() => setIsOpen(false)}
          >
            Categories
          </a>
          <a
            href="/#about"
            className="block py-2"
            onClick={() => setIsOpen(false)}
          >
            About us
          </a>
          {!user && (
            <>
              <Link href="/login" className="block py-2">
                Log in
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
