"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  MapPin,
  SlidersHorizontal,
  Plus,
  X,
  Layers,
  CircleDollarSign,
  ChevronRight,
  Search,
} from "lucide-react";
import { useEventList, useEventFilters } from "@/hooks/useEvent";
import { EventCard } from "@/components/client/EventCard";
import type { Event } from "@/types/event.types";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ExplorePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#fafafc]" />}>
      <ExplorePageContent />
    </Suspense>
  );
}

function ExplorePageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const currentPathname = pathname ?? "/explore";
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() ?? "";
  const currentParams = useMemo(
    () => new URLSearchParams(queryString),
    [queryString],
  );

  const MAX_PRICE_LIMIT = 10000;

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cat = currentParams.get("category");
    return cat ? cat.split(",") : [];
  });
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedArea, setSelectedArea] = useState(
    currentParams.get("area") || "all",
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(currentParams.get("minPrice")) || 0,
    Number(currentParams.get("maxPrice")) || MAX_PRICE_LIMIT,
  ]);
  const [startDate, setStartDate] = useState<Date | undefined>(
    currentParams.get("startDate")
      ? new Date(currentParams.get("startDate")!)
      : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    currentParams.get("endDate")
      ? new Date(currentParams.get("endDate")!)
      : undefined,
  );
  const [sortBy, setSortBy] = useState(
    currentParams.get("sort") || "popularity",
  );

  useEffect(() => {
    const cat = currentParams.get("category");
    setSelectedCategories(cat ? cat.split(",") : []);
    setSelectedArea(currentParams.get("area") || "all");
    setPriceRange([
      Number(currentParams.get("minPrice")) || 0,
      Number(currentParams.get("maxPrice")) || MAX_PRICE_LIMIT,
    ]);
    setStartDate(
      currentParams.get("startDate")
        ? new Date(currentParams.get("startDate")!)
        : undefined,
    );
    setEndDate(
      currentParams.get("endDate")
        ? new Date(currentParams.get("endDate")!)
        : undefined,
    );
    setSortBy(currentParams.get("sort") || "popularity");
  }, [queryString, currentParams]);

  const updateUrl = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(currentParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    });
    router.replace(
      `${currentPathname}${params.toString() ? `?${params}` : ""}`,
      {
        scroll: false,
      },
    );
  };

  const handleCategoryToggle = (slug: string) => {
    const updated = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];
    setSelectedCategories(updated);
    updateUrl({ category: updated.length ? updated.join(",") : undefined });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setCategorySearch("");
    setSelectedArea("all");
    setPriceRange([0, MAX_PRICE_LIMIT]);
    setStartDate(undefined);
    setEndDate(undefined);
    setSortBy("popularity");
    router.replace(currentPathname, { scroll: false });
  };

  const { data: filters } = useEventFilters();
  const { data: events = [], isLoading } = useEventList({
    category: selectedCategories.length
      ? selectedCategories.join(",")
      : undefined,
    area: selectedArea !== "all" ? selectedArea : undefined,
    minPrice: priceRange[0] > 0 ? String(priceRange[0]) : undefined,
    maxPrice:
      priceRange[1] < MAX_PRICE_LIMIT ? String(priceRange[1]) : undefined,
    startDate: startDate ? startDate.toISOString() : undefined,
    endDate: endDate ? endDate.toISOString() : undefined,
  });

  const filteredCategories = useMemo(() => {
    if (!filters?.categories) return [];
    if (!categorySearch.trim()) return filters.categories;
    return filters.categories.filter((cat) =>
      cat.name.toLowerCase().includes(categorySearch.toLowerCase().trim()),
    );
  }, [filters?.categories, categorySearch]);

  const sortedEvents = useMemo(() => {
    const list = [...events];
    if (sortBy === "price-low") {
      return list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }
    if (sortBy === "soonest") {
      return list.sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      );
    }
    return list;
  }, [events, sortBy]);

  const activeFilterCount =
    selectedCategories.length +
    (selectedArea !== "all" ? 1 : 0) +
    (startDate || endDate ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < MAX_PRICE_LIMIT ? 1 : 0);

  const selectedAreaObj = filters?.areas?.find((a) => a.slug === selectedArea);

  const FilterSidebar = () => (
    <aside className="w-full bg-[#f8f9fd] border border-slate-200/80 rounded-3xl p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Filters</h3>
        <button
          type="button"
          onClick={clearAllFilters}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <CalendarIcon className="w-4 h-4 text-blue-600" />
          <span>Date range</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Popover>
            <PopoverTrigger >
              <button
                type="button"
                className="w-full text-left bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 truncate"
              >
                {startDate ? format(startDate, "MMM d, yyyy") : "Start date"}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-slate-200"
              align="start"
            >
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(d) => {
                  setStartDate(d);
                  updateUrl({ startDate: d ? d.toISOString() : undefined });
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger >
              <button
                type="button"
                className="w-full text-left bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 truncate"
              >
                {endDate ? format(endDate, "MMM d, yyyy") : "End date"}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-slate-200"
              align="start"
            >
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(d) => {
                  setEndDate(d);
                  updateUrl({ endDate: d ? d.toISOString() : undefined });
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Category</span>
          </div>
          {selectedCategories.length > 0 && (
            <span className="text-[11px] font-semibold text-blue-600">
              {selectedCategories.length} selected
            </span>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search categories..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {categorySearch && (
            <button
              type="button"
              onClick={() => setCategorySearch("")}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="max-h-52 overflow-y-auto pr-2 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => {
              const checked = selectedCategories.includes(category.slug);
              return (
                <label
                  key={category.id}
                  className="flex items-center justify-between text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() =>
                        handleCategoryToggle(category.slug)
                      }
                      className="rounded-md border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <span className="truncate">{category.name}</span>
                  </div>
                  <span className="text-slate-400 text-[11px] shrink-0 ml-2">
                    {(category as any).eventCount ?? ""}
                  </span>
                </label>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 py-2 text-center">
              No categories found
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <CircleDollarSign className="w-4 h-4 text-blue-600" />
            <span>Price range</span>
          </div>
          <span className="text-xs font-bold text-rose-500">
            ${priceRange[0]} - ${priceRange[1]}
            {priceRange[1] >= MAX_PRICE_LIMIT ? "+" : ""}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={(val) => setPriceRange([val[0], val[1]])}
          onValueCommit={(val) =>
            updateUrl({
              minPrice: val[0] > 0 ? String(val[0]) : undefined,
              maxPrice: val[1] < MAX_PRICE_LIMIT ? String(val[1]) : undefined,
            })
          }
          min={0}
          max={MAX_PRICE_LIMIT}
          step={100}
          className="py-2"
        />
        <div className="flex justify-between text-[11px] font-semibold text-slate-400">
          <span>$0</span>
          <span>${MAX_PRICE_LIMIT}+</span>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-200/60">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>Location</span>
        </div>
        <Select
          value={selectedArea}
          onValueChange={(val) => {
            setSelectedArea(val);
            updateUrl({ area: val });
          }}
        >
          <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs font-medium text-slate-800">
            <SelectValue placeholder="All locations" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200">
            <SelectItem value="all" className="text-xs">
              All locations
            </SelectItem>
            {filters?.areas?.map((area) => (
              <SelectItem key={area.id} value={area.slug} className="text-xs">
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-200/60">
        <span className="block text-xs font-bold text-slate-800">Sort by</span>
        <Select
          value={sortBy}
          onValueChange={(val) => {
            setSortBy(val);
            updateUrl({ sort: val });
          }}
        >
          <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs font-medium text-slate-800">
            <SelectValue placeholder="Popularity" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200">
            <SelectItem value="popularity" className="text-xs">
              Popularity
            </SelectItem>
            <SelectItem value="soonest" className="text-xs">
              Soonest first
            </SelectItem>
            <SelectItem value="price-low" className="text-xs">
              Price: Low to high
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </aside>
  );

  return (
    <main className="min-h-screen bg-[#fafafc] pb-24 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
              <Link href="/" className="hover:text-slate-700 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-700 font-semibold">
                Explore events
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Explore events
            </h1>
            <p className="mt-1 text-sm text-slate-500 font-normal">
              Find your next unforgettable experience.
            </p>
          </div>

          <Link
            href="/seller/events/create"
            className="inline-flex items-center gap-2 bg-[#ff5d41] hover:bg-[#eb4f34] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 self-start sm:self-center"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Sell tickets</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <FilterSidebar />
          </div>

          <div className="lg:col-span-9 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-transparent">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {sortedEvents.length} events
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  found{" "}
                  {selectedAreaObj ? `in ${selectedAreaObj.name}` : "near you"}
                </span>

                {selectedCategories.map((slug) => {
                  const cat = filters?.categories?.find((c) => c.slug === slug);
                  return (
                    <span
                      key={slug}
                      className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs"
                    >
                      {cat?.name ?? slug}
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(slug)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}

                {selectedAreaObj && (
                  <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
                    {selectedAreaObj.name}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedArea("all");
                        updateUrl({ area: undefined });
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger >
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 shadow-sm"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Filters</span>
                      {activeFilterCount > 0 && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[310px] p-4 overflow-y-auto"
                  >
                    <FilterSidebar />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-slate-100 bg-white p-0 shadow-sm animate-pulse overflow-hidden flex flex-col justify-between"
                  >
                    <div className="aspect-[16/10] bg-slate-200 w-full" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 w-3/5 bg-slate-200 rounded" />
                      <div className="h-3.5 w-2/5 bg-slate-200 rounded" />
                      <div className="h-3.5 w-4/5 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedEvents.map((event: Event) => (
                  <div key={event.id} className="flex justify-center">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  No events found
                </p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Try adjusting your filters or search keywords.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
