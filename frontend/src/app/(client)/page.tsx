"use client";

import Link from "next/link";
import { useEventFilters, useEventList } from "@/hooks/useEvent";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";

const categoryIcons: Record<string, { icon: string; tone: string }> = {
  music: { icon: "♪", tone: "coral" },
  food: { icon: "✦", tone: "gold" },
  sports: { icon: "◈", tone: "blue" },
  arts: { icon: "◌", tone: "lavender" },
  workshops: { icon: "＋", tone: "mint" },
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedArea, setSelectedArea] = useState<string | undefined>();

  const { data: filters, isLoading: isFiltersLoading } = useEventFilters();
  const { data: events = [], isLoading: isEventsLoading } = useEventList({
    search: searchQuery || undefined,
    category: selectedCategory,
    area: selectedArea,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the query parameter
  };

  const featuredEvent = events[0];
  const upcomingEvents = events.slice(0, 4);

  return (
    <main className="site-shell">


      {/* Hero Section */}
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">YOUR CITY, YOUR MOMENTS</p>
          <h1>
            Make plans
            <br />
            <em>worth remembering.</em>
          </h1>
          <p className="hero-text">
            Find the events that make your calendar feel alive. From intimate
            workshops to nights you&apos;ll talk about for years.
          </p>
          <div className="hero-actions">
            <a className="button" href="#explore">
              Explore events <span>↗</span>
            </a>
            <a className="text-link" href="#how-it-works">
              How it works <span>→</span>
            </a>
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="A crowd enjoying an outdoor concert"
        >
          <div className="hero-orbit orbit-one"></div>
          <div className="hero-orbit orbit-two"></div>
          <div className="hero-photo"></div>
          <div className="hero-note">
            <span>✦</span>
            <div>
              <strong>
                Good things
                <br />
                are happening.
              </strong>
              <small>Dhaka · right now</small>
            </div>
          </div>
        </div>
      </section>

      {/* Search Panel */}
      <section className="search-panel wrap">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-field">
            <span>⌕</span>
            <input
              aria-label="Search events"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="search-field location-field">
            <span>⌖</span>
            <select
              value={selectedArea || ""}
              onChange={(e) => setSelectedArea(e.target.value || undefined)}
              className="location-select"
              aria-label="Select location"
            >
              <option value="">Any location</option>
              {filters?.areas?.map((area) => (
                <option key={area.id} value={area.slug}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
          <div className="search-field date-field">
            <span>◷</span>
            <div>
              <small>When</small>
              <strong>Any date</strong>
            </div>
          </div>
          <button type="submit" className="button search-button">
            Search events
          </button>
        </form>
      </section>

      {/* Categories Section */}
      <section className="category-section wrap" id="categories">
        <div className="section-heading">
          <div>
            <p className="eyebrow">BROWSE BY MOOD</p>
            <h2>Something for everyone.</h2>
          </div>
          <Link className="text-link" href="/explore">
            See all categories <span>→</span>
          </Link>
        </div>
        <div className="category-row">
          {isFiltersLoading ? (
            <p className="text-gray-600">Loading categories...</p>
          ) : (
            filters?.categories?.map((category) => {
              const iconData =
                categoryIcons[category.slug] || categoryIcons.music;
              return (
                <Link
                  className={`category-card ${iconData.tone}`}
                  href={`/explore?category=${category.slug}`}
                  key={category.id}
                >
                  <span className="category-icon">{iconData.icon}</span>
                  <strong>{category.name}</strong>
                  <span className="category-arrow">↗</span>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* Events Section */}
      <section className="events-section" id="explore">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">DON&apos;T MISS OUT</p>
              <h2>
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : "Popular near you."}
              </h2>
            </div>
            <Link className="text-link" href="/explore">
              View all events <span>→</span>
            </Link>
          </div>

          {isEventsLoading ? (
            <div className="event-grid">
              {[...Array(4)].map((_, i) => (
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
          ) : upcomingEvents.length > 0 ? (
            <div className="event-grid">
              {upcomingEvents.map((event) => (
                <Link
                  className={`event-card ${
                    event.id === featuredEvent?.id ? "event-featured" : ""
                  }`}
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
                        // TODO: Implement save/wishlist functionality
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
              <Link href="/explore" className="text-link">
                Browse all events <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Statement Section */}
      <section className="statement wrap" id="about">
        <div className="statement-mark">✦</div>
        <p>
          There&apos;s more to life
          <br />
          than <em>routine.</em>
        </p>
        <Link className="button button-dark" href="/explore">
          Find your next thing <span>↗</span>
        </Link>
      </section>


    </main>
  );
}
