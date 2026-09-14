"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Music,
  Trophy,
  Landmark,
  Sparkles,
  Lightbulb,
  Smile,
} from "lucide-react";
import { useCategoryList } from "@/hooks/useCategory";
import { CategoryCard } from "./CategoryCard";

const categoryThemeMap: Record<
  string,
  {
    bgGradient: string;
    icon: React.ReactNode;
    iconColor: string;
    defaultCount: string;
  }
> = {
  music: {
    bgGradient: "bg-gradient-to-br from-[#f87171] via-[#d946ef] to-[#6366f1]",
    icon: <Music className="h-5 w-5" />,
    iconColor: "text-blue-500",
    defaultCount: "240+ events",
  },
  sports: {
    bgGradient: "bg-[#181c3d]",
    icon: <Trophy className="h-5 w-5" />,
    iconColor: "text-blue-500",
    defaultCount: "180+ events",
  },
  theater: {
    bgGradient: "bg-[#e5e5f7]",
    icon: <Landmark className="h-5 w-5" />,
    iconColor: "text-blue-600",
    defaultCount: "96+ events",
  },
  festivals: {
    bgGradient: "bg-gradient-to-br from-[#fed7aa] to-[#f43f5e]",
    icon: <Sparkles className="h-5 w-5" />,
    iconColor: "text-sky-500",
    defaultCount: "320+ events",
  },
  workshops: {
    bgGradient: "bg-[#ececf6]",
    icon: <Lightbulb className="h-5 w-5" />,
    iconColor: "text-blue-600",
    defaultCount: "145+ events",
  },
  comedy: {
    bgGradient: "bg-gradient-to-br from-[#ff7a51] to-[#ff4e2d]",
    icon: <Smile className="h-5 w-5" />,
    iconColor: "text-blue-500",
    defaultCount: "88+ events",
  },
};

export default function CategorySection() {
  const { data: categoryResult, isLoading } = useCategoryList({
    limit: 6,
  });
  const categories = categoryResult?.data ?? [];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Explore by category
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-500 font-normal">
            Find something that fits your mood
          </p>
        </div>

        <Link
          href="/categories"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>View all</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[218px] rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm animate-pulse flex flex-col justify-between"
              >
                <div className="h-28 w-full bg-slate-200 rounded-xl" />
                <div className="space-y-2 mt-3">
                  <div className="h-4 w-5 bg-slate-200 rounded" />
                  <div className="h-4 w-2/3 bg-slate-200 rounded" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded" />
                </div>
              </div>
            ))
          : categories?.map((category) => {
              const theme = categoryThemeMap[category.slug] || {
                bgGradient: "bg-gradient-to-br from-slate-200 to-slate-300",
                icon: <Sparkles className="h-5 w-5" />,
                iconColor: "text-slate-600",
                defaultCount: "Explore events",
              };

              return (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  slug={category.slug}
                  count={
                    (category as unknown as { eventCount?: number })
                      .eventCount ?? theme.defaultCount
                  }
                  image={category.image ?? undefined}
                  bgGradient={theme.bgGradient}
                  icon={theme.icon}
                  iconColor={theme.iconColor}
                />
              );
            })}
      </div>
    </section>
  );
}
