"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useCategoryList } from "@/hooks/useCategory";
import { CategoryCard } from "@/components/client/CategoryCard";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 12;

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useCategoryList({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
  });

  const categories = data?.data ?? [];
  const totalPages = data?.pagination.totalPages ?? 0;
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  return (
    <main className="min-h-screen bg-[#fafafc]">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Home <ArrowRight className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              All categories
            </h1>
            <p className="mt-2 text-slate-500">
              Explore events by finding the category that matches your mood.
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search categories..."
              className="h-11 rounded-xl border-slate-200 bg-white pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-sm text-red-600">
            Unable to load categories. Please try again.
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                count={category.eventCount ?? category._count?.events}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                  pageNumber === page
                    ? "bg-primary text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary"
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
