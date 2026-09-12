"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useEventList, useEventFilters } from "@/hooks/useEvent";

export default function ExplorePage() {
  return (
    <Suspense fallback={<main className="route-shell" />}>
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
    <main className="route-shell">
      <section className="route-hero wrap">
        <p className="eyebrow">THE EVENT CALENDAR</p>
        <h1>
          Find your next
          <br />
          <em>good idea.</em>
        </h1>
        <p>
          Curated experiences, local favourites, and the kind of plans that turn
          into stories.
        </p>
      </section>

      <section className="explore-content wrap">
        <aside className="filter-panel">
          <strong>Filter events</strong>

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
          <div className="filter-tabs">
            <button
              className={!selectedCategory ? "selected" : ""}
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
                className={selectedCategory === cat.slug ? "selected" : ""}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="result-top">
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
            <div className="event-grid explore-grid">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="event-card skeleton"
                  role="status"
                  aria-label="Loading event"
                >
                  <div className="event-image skeleton-image" />
                  <div className="event-info">
                    <div className="skeleton-text" />
                    <div className="skeleton-text" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="event-grid explore-grid">
              {filteredEvents.map((event) => (
                <Link
                  className="event-card"
                  href={`/events/${event.id}`}
                  key={event.id}
                >
                  <div
                    className="event-image"
                    style={{
                      backgroundImage: event.coverImage
                        ? `url(${event.coverImage})`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    <span className="event-tag">
                      {event.category?.name || "Event"}
                    </span>
                    <button
                      className="save-button"
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
                  <div className="event-info">
                    <div>
                      <p className="event-date">
                        {new Date(event.startAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <h3>{event.title}</h3>
                      <p className="event-place">
                        {event.venueName}, {event.area?.name}
                      </p>
                    </div>
                    <strong className="event-price">৳ {event.price}</strong>
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
                className="text-link"
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
