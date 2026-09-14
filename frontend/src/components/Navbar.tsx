"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ticket,
  Home,
  Search,
  Heart,
  Menu,
  X,
  LogOut,
  Settings,
  LayoutDashboard,
  MailCheck,
} from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useLogout } from "@/hooks/use-auth";
import { authStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "./ui/separator";
import Logo from "./Logo";

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

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname?.startsWith(path);
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore Events", href: "/explore", icon: Search },
    { name: "My Tickets", href: "/bookings", icon: Ticket },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0c0d28] border-b border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo />

          <nav className="hidden md:flex items-center gap-2 lg:gap-4 h-full">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 h-full text-sm font-medium tracking-wide transition-all ${
                    active
                      ? "!text-white font-semibold"
                      : "!text-slate-300 hover:!text-white"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      active
                        ? "!text-white stroke-[2.5]"
                        : "!text-slate-300 group-hover:!text-white stroke-[2]"
                    }`}
                  />
                  <span>{link.name}</span>
                  {active && (
                    <span className="absolute bottom-0 inset-x-2 h-[3px] rounded-full bg-[#ff5236]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
                <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
              </div>
            ) : user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff5236] focus:ring-offset-2 focus:ring-offset-[#0c0d28]">
                      <Avatar className="h-10 w-10 border border-white/20 cursor-pointer">
                        <AvatarImage
                          src={user.image ?? undefined}
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-[#b6b4f6] text-[#131238] font-bold text-sm tracking-wider">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 !bg-[#141638] !border-white/10 !text-slate-200 shadow-2xl rounded-2xl p-1.5"
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold !text-white">
                        {user.name}
                      </p>
                      <p className="text-xs !text-slate-400 truncate">
                        {user.email}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#ff6849]">
                        {user.role === "SUPER_ADMIN"
                          ? "Administrator"
                          : user.role === "SELLER"
                            ? "Organizer"
                            : "Attendee"}
                      </p>
                    </div>

                    <Separator className="bg-white/10 my-1" />

                    <DropdownMenuItem
                      asChild
                      className="rounded-xl hover:bg-white/10 focus:bg-white/10 cursor-pointer !text-slate-200"
                    >
                      <Link
                        href="/bookings"
                        className="flex items-center gap-2"
                      >
                        <Ticket className="h-4 w-4 text-[#ff6849]" />
                        <span>My Tickets</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className="rounded-xl hover:bg-white/10 focus:bg-white/10 cursor-pointer !text-slate-200"
                    >
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-2"
                      >
                        <Heart className="h-4 w-4 text-[#ff6849]" />
                        <span>Wishlist</span>
                      </Link>
                    </DropdownMenuItem>

                    {!user.isVerified && (
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl hover:bg-white/10 focus:bg-white/10 cursor-pointer !text-slate-200"
                      >
                        <Link
                          href="/verify-email"
                          className="flex items-center gap-2"
                        >
                          <MailCheck className="h-4 w-4 text-[#ff6849]" />
                          <span>Email Verify</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {user.role === "SELLER" && (
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl hover:bg-white/10 focus:bg-white/10 cursor-pointer !text-slate-200"
                      >
                        <Link
                          href="/seller/dashboard"
                          className="flex items-center gap-2"
                        >
                          <LayoutDashboard className="h-4 w-4 text-[#ff6849]" />
                          <span>Seller Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {user.role === "SUPER_ADMIN" && (
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl hover:bg-white/10 focus:bg-white/10 cursor-pointer !text-slate-200"
                      >
                        <Link href="/admin" className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4 text-[#ff6849]" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      asChild
                      className="rounded-xl hover:bg-white/10 focus:bg-white/10 cursor-pointer !text-slate-200"
                    >
                      <Link href="/setting" className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-slate-400" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    <Separator className="bg-white/10 my-1" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-xl hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 focus:text-red-400 cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium !text-slate-300 hover:!text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold !text-white bg-gradient-to-r from-[#ff6b4a] to-[#ff4a2d] hover:brightness-105 active:scale-95 rounded-xl shadow-[0_4px_15px_rgba(255,87,51,0.35)] transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}

            <button
              type="button"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 !text-slate-200 hover:!text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0c0d28]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 !text-white font-semibold"
                    : "!text-slate-300 hover:bg-white/5 hover:!text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${active ? "!text-[#ff5236]" : ""}`}
                />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {user && !user.isVerified && (
            <Link
              href="/verify-email"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium !text-slate-200 bg-[#ff5236]/10 border border-[#ff5236]/30"
            >
              <MailCheck className="h-4 w-4 text-[#ff6849]" />
              <span>Email Verify</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
