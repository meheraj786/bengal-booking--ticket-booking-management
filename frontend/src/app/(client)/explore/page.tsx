"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useEventList, useEventFilters } from "@/hooks/useEvent";

export default function ExplorePage() {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
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
  const currentParams = new URLSearchParams(queryString);
  const [searchQuery, setSearchQuery] = useState(
    currentParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    currentParams.get("category") || undefined,
  );
  const [selectedDivision, setSelectedDivision] = useState(
    currentParams.get("division") || "",
  );
  const [selectedArea, setSelectedArea] = useState(
    currentParams.get("area") || "",
  );
  const [minPrice, setMinPrice] = useState(currentParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(currentParams.get("maxPrice") || "");
  const [startDate, setStartDate] = useState(
    currentParams.get("startDate") || "",
  );
  const [endDate, setEndDate] = useState(currentParams.get("endDate") || "");
  const [sortBy, setSortBy] = useState(currentParams.get("sort") || "date");

  useEffect(() => {
    setSearchQuery(currentParams.get("search") || "");
    setSelectedCategory(currentParams.get("category") || undefined);
    setSelectedDivision(currentParams.get("division") || "");
    setSelectedArea(currentParams.get("area") || "");
    setMinPrice(currentParams.get("minPrice") || "");
    setMaxPrice(currentParams.get("maxPrice") || "");
    setStartDate(currentParams.get("startDate") || "");
    setEndDate(currentParams.get("endDate") || "");
    setSortBy(currentParams.get("sort") || "date");
  }, [queryString]);

  const updateUrl = (key: string, value?: string) => {
    const params = new URLSearchParams(currentParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(
      `${currentPathname}${params.toString() ? `?${params}` : ""}`,
      {
        scroll: false,
      },
    );
  };

  const { data: filters } = useEventFilters();
  const { data: events = [], isLoading } = useEventList({
    search: searchQuery || undefined,
    category: selectedCategory,
    division: selectedDivision || undefined,
    area: selectedArea || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const filteredEvents = events.sort((a, b) => {
    if (sortBy === "price") {
      return Number(a.price) - Number(b.price);
    }
    return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
  });

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[85px_65px] max-md:w-[calc(100%-32px)] max-md:py-[60px_45px]">
        <p className="mb-[18px] font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)]">
          THE EVENT CALENDAR
        </p>
        <h1 className="m-0 text-[clamp(48px,6vw,72px)] font-medium leading-[0.98] tracking-[-4px]">
          Find your next
          <br />
          <em>good idea.</em>
        </h1>
        <p className="mt-[25px] max-w-[420px] font-sans text-[15px] leading-[1.6] text-[var(--muted)]">
          Curated experiences, local favourites, and the kind of plans that turn
          into stories.
        </p>
      </section>

      <section className="mx-auto grid w-[min(1180px,calc(100%-48px))] grid-cols-[205px_1fr] gap-12 pb-[90px] max-md:w-[calc(100%-32px)] max-md:grid-cols-1">
        <aside className="border-t border-[var(--ink)] pt-[17px] font-sans text-xs max-md:hidden">
          <strong className="mb-7 block text-[15px]">Filter events</strong>

          <label>
            Search
            <input
              placeholder="Event name or keyword"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateUrl("search", e.target.value);
              }}
            />
          </label>

          <label>
            Category
            <select
              value={selectedCategory || ""}
              onChange={(e) => {
                const value = e.target.value || undefined;
                setSelectedCategory(value);
                updateUrl("category", value);
              }}
            >
              <option value="">All categories</option>
              {filters?.categories?.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Division slug
            <input
              placeholder="e.g. dhaka"
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                updateUrl("division", e.target.value);
              }}
            />
          </label>

          <label>
            Where
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                updateUrl("area", e.target.value);
              }}
            >
              <option value="">All locations</option>
              {filters?.areas?.map((area) => (
                <option key={area.id} value={area.slug}>
                  {area.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Minimum price
            <input
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                updateUrl("minPrice", e.target.value);
              }}
            />
          </label>

          <label>
            Maximum price
            <input
              type="number"
              min="0"
              placeholder="10000"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                updateUrl("maxPrice", e.target.value);
              }}
            />
          </label>

          <label>
            From date
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                updateUrl("startDate", e.target.value);
              }}
            />
          </label>

          <label>
            To date
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                updateUrl("endDate", e.target.value);
              }}
            />
          </label>
        </aside>

        <div className="results">
          <div className="mb-[18px] flex gap-2 overflow-x-auto border-b border-[var(--line)] pb-3.5">
            <button
              className={`whitespace-nowrap border px-3 py-[9px] font-sans text-[11px] ${!selectedCategory ? "border-[var(--line)] bg-white text-[var(--ink)]" : "border-transparent bg-transparent text-[var(--muted)]"}`}
              onClick={() => {
                setSelectedCategory(undefined);
                updateUrl("category");
              }}
            >
              All events
            </button>
            {filters?.categories?.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                className={`whitespace-nowrap border px-3 py-[9px] font-sans text-[11px] ${selectedCategory === cat.slug ? "border-[var(--line)] bg-white text-[var(--ink)]" : "border-transparent bg-transparent text-[var(--muted)]"}`}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="mb-[22px] flex items-center justify-between font-sans text-[11px] text-[var(--muted)]">
            <span>
              Showing <strong>{filteredEvents.length}</strong> events
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateUrl("sort", e.target.value);
              }}
            >
              <option value="date">Date: Soonest first</option>
              <option value="price">Price: Low to high</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-3 gap-[18px] max-md:grid-cols-2 max-md:gap-[13px]">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-0 animate-pulse"
                  role="status"
                  aria-label="Loading event"
                >
                  <div className="h-[210px] rounded bg-gray-200 max-md:h-[155px]" />
                  <div className="space-y-2 px-px py-[15px]">
                    <div className="h-3 rounded bg-gray-200" />
                    <div className="h-3 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-3 gap-[18px] max-md:grid-cols-2 max-md:gap-[13px]">
              {filteredEvents.map((event) => (
                <Link
                  className="min-w-0"
                  href={`/events/${event.id}`}
                  key={event.id}
                >
                  <div
                    className="relative h-[210px] overflow-hidden rounded bg-cover bg-center max-md:h-[155px]"
                    style={{
                      backgroundImage: event.coverImage
                        ? `url(${event.coverImage})`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    <span className="absolute left-3 top-3 bg-white px-[9px] py-1.5 font-sans text-[10px]">
                      {event.category?.name || "Event"}
                    </span>
                    <button
                      className="absolute right-3 top-2.5 flex h-[29px] w-[29px] items-center justify-center rounded-full border-0 bg-white/85"
                      aria-label={`Save ${event.title}`}
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: Implement wishlist
                      }}
                      type="button"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-start justify-between gap-2 px-px py-[15px] max-md:block">
                    <div>
                      <p className="mb-1.5 font-sans text-[9px] font-bold uppercase tracking-[1px] text-[var(--coral-dark)]">
                        {new Date(event.startAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="m-0 text-lg font-medium leading-[1.1]">
                        {event.title}
                      </h3>
                      <p className="mt-2 font-sans text-[11px] text-[var(--muted)]">
                        {event.venueName}, {event.area?.name}
                      </p>
                    </div>
                    <strong className="whitespace-nowrap font-sans text-xs font-bold max-md:mt-2 max-md:block">
                      ৳ {event.price}
                    </strong>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No events found</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(undefined);
                  setSelectedDivision("");
                  setSelectedArea("");
                  setMinPrice("");
                  setMaxPrice("");
                  setStartDate("");
                  setEndDate("");
                  setSortBy("date");
                  router.replace(currentPathname, { scroll: false });
                }}
                className="font-sans text-xs font-bold"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
