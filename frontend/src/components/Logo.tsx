import { Ticket } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff6b4a] to-[#ff4a2d] text-white shadow-[0_4px_18px_rgba(255,87,51,0.35)] transition-transform group-hover:scale-105">
        <Ticket className="h-6 w-6 -rotate-12 fill-white/20 stroke-[2.2]" />
      </div>
      <span className="md:text-2xl text-md font-bold tracking-tight text-white">
        bengalBooking <span className="text-primary">.</span>
      </span>
    </Link>
  );
};

export default Logo;
