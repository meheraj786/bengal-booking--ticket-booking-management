import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Compass } from "lucide-react";

export interface CategoryCardProps {
  name: string;
  slug: string;
  count?: number | string;
  icon?: React.ReactNode;
  bgGradient?: string;
  iconColor?: string;
  image?: string;
}

export function CategoryCard({
  name,
  slug,
  count,
  image,
  icon,
  bgGradient = "bg-gradient-to-br from-slate-100 to-slate-200",
  iconColor = "text-indigo-600",
}: CategoryCardProps) {
  return (
    <Link
      href={`/explore?category=${slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm p-2 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
    >
      {/* Image / fallback area */}
      <div className="relative h-28 w-full overflow-hidden rounded-xl">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center ${bgGradient}`}
          >
            <span className={`text-3xl ${iconColor}`}>
              {icon ?? <Compass className="h-8 w-8" />}
            </span>
          </div>
        )}

        {/* Subtle gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

        {/* Arrow badge */}
        <span className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white/25">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      {/* Text content */}
      <div className="mt-3.5 flex flex-col gap-1 px-1 pb-1.5">
        <h3 className="text-base font-bold text-slate-900 leading-tight truncate">
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
