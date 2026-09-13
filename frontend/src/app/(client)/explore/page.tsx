"use client";

import React, {
  Suspense,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
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
  Sparkles,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { useEventList, useEventFilters } from "@/hooks/useEvent";
import { EventCard } from "@/components/client/EventCard";
import { useAuthStore } from "@/hooks/useAuthStore";
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const MAX_PRICE_LIMIT = 10000;

// ─── Types ───────────────────────────────────────────────────────────────────
interface FilterSidebarProps {
  filters: ReturnType<typeof useEventFilters>["data"];
  selectedCategories: string[];
  selectedArea: string;
  priceRange: [number, number];
  startDate: Date | undefined;
  endDate: Date | undefined;
  sortBy: string;
  categorySearch: string;
  filteredCategories: Array<{
    id: string | number;
    slug: string;
    name: string;
    eventCount?: number;
  }>;
  onCategoryToggle: (slug: string) => void;
  onAreaChange: (val: string) => void;
  onPriceRangeChange: (val: [number, number]) => void;
  onPriceRangeCommit: (val: [number, number]) => void;
  onStartDateChange: (d: Date | undefined) => void;
  onEndDateChange: (d: Date | undefined) => void;
  onSortChange: (val: string) => void;
  onCategorySearchChange: (val: string) => void;
  onClearAll: () => void;
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────
function FilterSidebar({
  filters,
  selectedCategories,
  selectedArea,
  priceRange,
  startDate,
  endDate,
  sortBy,
  categorySearch,
  filteredCategories,
  onCategoryToggle,
  onAreaChange,
  onPriceRangeChange,
  onPriceRangeCommit,
  onStartDateChange,
  onEndDateChange,
  onSortChange,
  onCategorySearchChange,
  onClearAll,
}: FilterSidebarProps) {
  const activeCount =
    selectedCategories.length +
    (selectedArea !== "all" ? 1 : 0) +
    (startDate || endDate ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < MAX_PRICE_LIMIT ? 1 : 0);

  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Filter className="w-3.5 h-3.5 text-primary" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Filters</h3>
          {activeCount > 0 && (
            <Badge className="h-5 min-w-5 px-1.5 text-[10px] font-bold bg-primary text-white rounded-full">
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {/* Sort By */}
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Sort by
            </span>
          </div>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full h-9 bg-slate-50 border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-primary">
              <SelectValue placeholder="Popularity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">🔥 Popularity</SelectItem>
              <SelectItem value="soonest">⏰ Soonest first</SelectItem>
              <SelectItem value="price-low">💸 Price: Low to high</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Date range
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger>
                <button
                  type="button"
                  className={cn(
                    "w-full text-left bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium hover:border-primary/50 hover:bg-primary/5 transition-all truncate",
                    startDate
                      ? "text-slate-800 border-primary/30 bg-primary/5"
                      : "text-slate-400",
                  )}
                >
                  {startDate ? format(startDate, "MMM d, yy") : "Start date"}
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-slate-200 shadow-xl"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={onStartDateChange}
                  autoFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger>
                <button
                  type="button"
                  className={cn(
                    "w-full text-left bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium hover:border-primary/50 hover:bg-primary/5 transition-all truncate",
                    endDate
                      ? "text-slate-800 border-primary/30 bg-primary/5"
                      : "text-slate-400",
                  )}
                >
                  {endDate ? format(endDate, "MMM d, yy") : "End date"}
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-slate-200 shadow-xl"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={onEndDateChange}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => {
                onStartDateChange(undefined);
                onEndDateChange(undefined);
              }}
              className="text-[11px] text-slate-400 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" /> Clear dates
            </button>
          )}
        </div>

        {/* Category */}
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Category
              </span>
            </div>
            {selectedCategories.length > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] h-5 px-1.5 bg-primary/10 text-primary font-bold"
              >
                {selectedCategories.length} selected
              </Badge>
            )}
          </div>

          {/* Category Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search categories..."
              value={categorySearch}
              onChange={(e) => onCategorySearchChange(e.target.value)}
              className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            />
            {categorySearch && (
              <button
                type="button"
                onClick={() => onCategorySearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category List */}
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const checked = selectedCategories.includes(category.slug);
                return (
                  <label
                    key={category.id}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all",
                      checked
                        ? "bg-primary/8 border border-primary/20"
                        : "hover:bg-slate-50 border border-transparent",
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => onCategoryToggle(category.slug)}
                        className="rounded border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary flex-shrink-0"
                      />
                      <span
                        className={cn(
                          "text-xs font-medium truncate",
                          checked
                            ? "text-primary font-semibold"
                            : "text-slate-700",
                        )}
                      >
                        {category.name}
                      </span>
                    </div>
                    {category.eventCount !== undefined && (
                      <span className="text-[10px] font-semibold text-slate-400 shrink-0 ml-2 bg-slate-100 px-1.5 py-0.5 rounded-md">
                        {category.eventCount}
                      </span>
                    )}
                  </label>
                );
              })
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-slate-400">No categories found</p>
              </div>
            )}
          </div>
        </div>

        {/* Price Range */}
        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleDollarSign className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Price range
              </span>
            </div>
          </div>

          {/* Price display boxes */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center">
              <p className="text-[10px] text-slate-400 font-medium mb-0.5">
                Min
              </p>
              <p className="text-sm font-bold text-slate-800">
                ৳{priceRange[0].toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center">
              <p className="text-[10px] text-slate-400 font-medium mb-0.5">
                Max
              </p>
              <p className="text-sm font-bold text-slate-800">
                ৳{priceRange[1].toLocaleString()}
                {priceRange[1] >= MAX_PRICE_LIMIT ? "+" : ""}
              </p>
            </div>
          </div>

          <div className="px-1 pb-1">
            <Slider
              value={[priceRange[0], priceRange[1]]}
              onValueChange={(val) => {
                if (Array.isArray(val) && val.length === 2) {
                  onPriceRangeChange([val[0], val[1]]);
                }
              }}
              onValueCommitted={(val: number | readonly number[]) => {
                if (Array.isArray(val) && val.length === 2) {
                  onPriceRangeCommit([val[0], val[1]]);
                }
              }}
              min={0}
              max={MAX_PRICE_LIMIT}
              step={100}
              className="py-2"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1">
              <span>$0</span>
              <span>${MAX_PRICE_LIMIT.toLocaleString()}+</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Location
            </span>
          </div>
          <Select value={selectedArea} onValueChange={onAreaChange}>
            <SelectTrigger className="w-full h-9 bg-slate-50 border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-primary">
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">📍 All locations</SelectItem>
              {filters?.areas?.map((area) => (
                <SelectItem key={area.id} value={area.slug}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </aside>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm animate-pulse overflow-hidden">
      <div className="aspect-[16/10] bg-slate-200 w-full" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/5 bg-slate-200 rounded-lg" />
        <div className="h-3.5 w-2/5 bg-slate-100 rounded-lg" />
        <div className="h-3.5 w-4/5 bg-slate-100 rounded-lg" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-16 bg-slate-100 rounded-full" />
          <div className="h-6 w-20 bg-slate-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fafafc] flex items-center justify-center">
          <div className="animate-pulse text-slate-400 text-sm font-medium">
            Loading events...
          </div>
        </main>
      }
    >
      <ExplorePageContent />
    </Suspense>
  );
}

// ─── Page Content ─────────────────────────────────────────────────────────────
function ExplorePageContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const currentPathname = pathname ?? "/explore";
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() ?? "";
  const currentParams = useMemo(
    () => new URLSearchParams(queryString),
    [queryString],
  );

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
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Sync state with URL params
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

  const updateUrl = useCallback(
    (newParams: Record<string, string | undefined>) => {
      setPage(1);
      const params = new URLSearchParams(currentParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value && value !== "all") params.set(key, value);
        else params.delete(key);
      });
      router.replace(
        `${currentPathname}${params.toString() ? `?${params}` : ""}`,
        { scroll: false },
      );
    },
    [currentParams, currentPathname, router],
  );

  const handleCategoryToggle = useCallback(
    (slug: string) => {
      const updated = selectedCategories.includes(slug)
        ? selectedCategories.filter((c) => c !== slug)
        : [...selectedCategories, slug];
      setSelectedCategories(updated);
      updateUrl({ category: updated.length ? updated.join(",") : undefined });
    },
    [selectedCategories, updateUrl],
  );

  const clearAllFilters = useCallback(() => {
    setSelectedCategories([]);
    setCategorySearch("");
    setSelectedArea("all");
    setPriceRange([0, MAX_PRICE_LIMIT]);
    setStartDate(undefined);
    setEndDate(undefined);
    setSortBy("popularity");
    router.replace(currentPathname, { scroll: false });
  }, [currentPathname, router]);

  const handleStartDateChange = useCallback(
    (d: Date | undefined) => {
      setStartDate(d);
      updateUrl({ startDate: d ? d.toISOString() : undefined });
    },
    [updateUrl],
  );

  const handleEndDateChange = useCallback(
    (d: Date | undefined) => {
      setEndDate(d);
      updateUrl({ endDate: d ? d.toISOString() : undefined });
    },
    [updateUrl],
  );

  const handleAreaChange = useCallback(
    (val: string) => {
      setSelectedArea(val);
      updateUrl({ area: val });
    },
    [updateUrl],
  );

  const handleSortChange = useCallback(
    (val: string) => {
      setSortBy(val);
      updateUrl({ sort: val });
    },
    [updateUrl],
  );

  // Price range: local state updates on drag, URL updates only on commit
  const handlePriceRangeChange = useCallback((val: [number, number]) => {
    setPriceRange(val);
  }, []);

  const handlePriceRangeCommit = useCallback(
    (val: [number, number]) => {
      setPriceRange(val);
      updateUrl({
        minPrice: val[0] > 0 ? String(val[0]) : undefined,
        maxPrice: val[1] < MAX_PRICE_LIMIT ? String(val[1]) : undefined,
      });
    },
    [updateUrl],
  );

  const { data: filters } = useEventFilters();
  const { data: eventResult, isLoading } = useEventList({
    category: selectedCategories.length
      ? selectedCategories.join(",")
      : undefined,
    area: selectedArea !== "all" ? selectedArea : undefined,
    minPrice: priceRange[0] > 0 ? String(priceRange[0]) : undefined,
    maxPrice:
      priceRange[1] < MAX_PRICE_LIMIT ? String(priceRange[1]) : undefined,
    startDate: startDate ? startDate.toISOString() : undefined,
    endDate: endDate ? endDate.toISOString() : undefined,
    sort: sortBy as "popularity" | "soonest" | "price-low",
    page,
    limit: pageSize,
  });

  const events = eventResult?.data ?? [];
  const totalPages = eventResult?.pagination.totalPages ?? 0;

  const filteredCategories = useMemo(() => {
    if (!filters?.categories) return [];
    if (!categorySearch.trim()) return filters.categories;
    return filters.categories.filter((cat) =>
      cat.name.toLowerCase().includes(categorySearch.toLowerCase().trim()),
    );
  }, [filters?.categories, categorySearch]);

  const sortedEvents = events;

  const activeFilterCount =
    selectedCategories.length +
    (selectedArea !== "all" ? 1 : 0) +
    (startDate || endDate ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < MAX_PRICE_LIMIT ? 1 : 0);

  const selectedAreaObj = filters?.areas?.find((a) => a.slug === selectedArea);

  const sidebarProps = {
    filters,
    selectedCategories,
    selectedArea,
    priceRange,
    startDate,
    endDate,
    sortBy,
    categorySearch,
    filteredCategories,
    onCategoryToggle: handleCategoryToggle,
    onAreaChange: handleAreaChange,
    onPriceRangeChange: handlePriceRangeChange,
    onPriceRangeCommit: handlePriceRangeCommit,
    onStartDateChange: handleStartDateChange,
    onEndDateChange: handleEndDateChange,
    onSortChange: handleSortChange,
    onCategorySearchChange: setCategorySearch,
    onClearAll: clearAllFilters,
  };

  return (
    <main className="min-h-screen bg-[#f8f9fc] pb-24 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-3">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-600 font-semibold">
                Explore events
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Explore Events
                </h1>
                <p className="text-sm text-slate-500 font-normal mt-0.5">
                  Find your next unforgettable experience
                </p>
              </div>
            </div>
          </div>

          {(!user || user.role === "USER") && (
            <Link
              href="/seller/terms"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-primary/25 transition-all active:scale-95 self-start sm:self-end"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Sell tickets
            </Link>
          )}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <FilterSidebar {...sidebarProps} />
          </div>

          {/* Events Section */}
          <div className="lg:col-span-9 space-y-5">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900">
                    {sortedEvents.length}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">
                    events{" "}
                    {selectedAreaObj ? `in ${selectedAreaObj.name}` : "found"}
                  </span>
                </div>

                {/* Active filter chips */}
                {selectedCategories.map((slug) => {
                  const cat = filters?.categories?.find((c) => c.slug === slug);
                  return (
                    <span
                      key={slug}
                      className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-2.5 py-1 rounded-full"
                    >
                      {cat?.name ?? slug}
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(slug)}
                        className="text-primary/60 hover:text-primary transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}

                {selectedAreaObj && (
                  <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                    <MapPin className="w-3 h-3" />
                    {selectedAreaObj.name}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedArea("all");
                        updateUrl({ area: undefined });
                      }}
                      className="text-primary/60 hover:text-primary transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {(startDate || endDate) && (
                  <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                    <CalendarIcon className="w-3 h-3" />
                    {startDate ? format(startDate, "MMM d") : "Any"}
                    {" → "}
                    {endDate ? format(endDate, "MMM d") : "Any"}
                    <button
                      type="button"
                      onClick={() => {
                        handleStartDateChange(undefined);
                        handleEndDateChange(undefined);
                      }}
                      className="text-primary/60 hover:text-primary transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE_LIMIT) && (
                  <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                    <CircleDollarSign className="w-3 h-3" />${priceRange[0]} – $
                    {priceRange[1]}
                    {priceRange[1] >= MAX_PRICE_LIMIT ? "+" : ""}
                    <button
                      type="button"
                      onClick={() => {
                        handlePriceRangeCommit([0, MAX_PRICE_LIMIT]);
                      }}
                      className="text-primary/60 hover:text-primary transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Mobile filter trigger */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-primary/40 hover:bg-primary/5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 transition-all"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Filters</span>
                      {activeFilterCount > 0 && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[320px] p-0 overflow-y-auto"
                  >
                    <SheetHeader className="px-5 py-4 border-b border-slate-100">
                      <SheetTitle className="text-sm font-bold text-slate-900">
                        Filters & Sort
                      </SheetTitle>
                    </SheetHeader>
                    <div className="p-4">
                      <FilterSidebar {...sidebarProps} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Events Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : sortedEvents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sortedEvents.map((event: Event) => (
                    <div key={event.id} className="flex justify-center">
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-4">
                    <button
                      type="button"
                      className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-primary/40 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                      disabled={page === 1}
                      onClick={() => setPage((v) => v - 1)}
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPage(p)}
                            className={cn(
                              "h-9 w-9 rounded-xl text-sm font-semibold transition-all",
                              p === page
                                ? "bg-primary text-white shadow-sm shadow-primary/25"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary",
                            )}
                          >
                            {p}
                          </button>
                        ),
                      )}
                    </div>
                    <button
                      type="button"
                      className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-primary/40 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((v) => v + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <Search className="w-7 h-7 text-slate-400" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800">
                    No events found
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Try adjusting your filters or clearing your search.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/15 text-primary text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
                >
                  <X className="w-4 h-4" />
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
