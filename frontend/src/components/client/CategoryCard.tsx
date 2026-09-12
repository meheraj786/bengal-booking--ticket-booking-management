import React from "react";
import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";

export interface CategoryCardProps {
  name: string;
  slug: string;
  count?: number | string;
  icon?: React.ReactNode;
  bgGradient?: string;
  iconColor?: string;
}

export function CategoryCard({
  name,
  slug,
  count,
  icon,
  bgGradient = "bg-gradient-to-br from-slate-100 to-slate-200",
  iconColor = "text-indigo-600",
}: CategoryCardProps) {
  return (
    <Link
      href={`/explore?category=${slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white shadow-sm p-2 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
    >
      <div
        className={`relative h-28 w-full overflow-hidden rounded-xl ${bgGradient} transition-transform duration-300 group-hover:scale-[1.02]`}
      >
        <span className="absolute bottom-2.5 right-2.5 flex h-6 w-6 items-center justify-center text-white/80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-3.5 flex flex-col gap-1">
        {/* <div className={`flex items-center text-lg ${iconColor}`}>
          {icon ?? <Compass className="h-5 w-5" />}
        </div> */}

        <h3 className="text-base font-bold text-slate-900 leading-tight">
          {name}
        </h3>

        <p className="text-sm text-primary font-medium">
          {typeof count === "number"
            ? `${count}+ events`
            : (count ?? "Explore events")}
        </p>
      </div>
    </Link>
  );
}
