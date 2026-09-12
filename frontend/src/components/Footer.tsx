"use client";

import React from "react";
import Link from "next/link";
import { Ticket, Plus } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const links = [
    { name: "About us", href: "/about" },
    { name: "Help center", href: "/help" },
    { name: "For vendors", href: "/seller" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ];

  return (
    <footer className="w-full bg-[#0c0d28] border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-4">
          <div className="flex items-center gap-4">
            <Logo />

            <span className="text-xs sm:text-sm !text-slate-400 font-normal ml-1">
              © {new Date().getFullYear()} bengalBooking Inc.
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs sm:text-sm font-medium !text-slate-300 hover:!text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div>
            <Link
              href="/seller/events/create"
              className="inline-flex items-center gap-2 bg-[#ff5d41] hover:bg-[#eb4f34] active:scale-95 !text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(255,93,65,0.4)] hover:shadow-[0_6px_24px_rgba(255,93,65,0.55)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5] !text-white" />
              <span className="!text-white">Sell Tickets</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
