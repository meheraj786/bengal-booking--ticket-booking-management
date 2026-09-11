"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useEventList, useEventFilters } from "@/hooks/useEvent";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedArea, setSelectedArea] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState(5000);
  const [sortBy, setSortBy] = useState("date");

  const { data: filters } = useEventFilters();
  const { data: events = [], isLoading } = useEventList({
    search: searchQuery || undefined,
    category: selectedCategory,
    area: selectedArea,
  });

  const filteredEvents = events
    .filter((event) => Number(event.price) <= priceRange)
    .sort((a, b) => {
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>

          <label>
            Category
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || undefined)}
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
            Where
            <select
              value={selectedArea || ""}
              onChange={(e) => setSelectedArea(e.target.value || undefined)}
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
            Price range: ৳{priceRange}
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
          </label>
        </aside>

        <div className="results">
          <div className="filter-tabs">
            <button
              className={!selectedCategory ? "selected" : ""}
              onClick={() => setSelectedCategory(undefined)}
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
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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
                  setSelectedArea(undefined);
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
