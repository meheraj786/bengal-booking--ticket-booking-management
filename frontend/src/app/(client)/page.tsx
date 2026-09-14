"use client";

import Link from "next/link";
import { useEventFilters, useEventList } from "@/hooks/useEvent";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";
import HeroBanner from "@/components/client/HeroBanner";
import CategorySection from "@/components/client/CategorySection";
import EventSection from "@/components/client/EventSection";

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
  const { data: eventResponse, isLoading: isEventsLoading } = useEventList({
    search: searchQuery || undefined,
    category: selectedCategory,
    area: selectedArea,
  });
  const events = eventResponse?.data ?? [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the query parameter
  };

  const featuredEvent = events[0];
  const upcomingEvents = events.slice(0, 4);

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      {/* <section className="mx-auto grid min-h-[500px] w-[min(1180px,calc(100%-48px))] grid-cols-2 items-center py-[65px_45px] max-md:w-[calc(100%-32px)] max-md:grid-cols-1 max-md:py-[55px_25px]">
        <div className="relative z-[1]">
          <p className="mb-[18px] font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)]">
            YOUR CITY, YOUR MOMENTS
          </p>
          <h1>
            Make plans
            <br />
            <em>worth remembering.</em>
          </h1>
          <p className="my-7 max-w-[390px] font-sans text-[15px] leading-[1.7] text-[var(--muted)]">
            Find the events that make your calendar feel alive. From intimate
            workshops to nights you&apos;ll talk about for years.
          </p>
          <div className="flex items-center gap-7">
            <a
              className="inline-flex items-center justify-center gap-[15px] rounded-[5px] bg-[var(--coral)] px-[22px] py-4 font-sans text-xs font-bold text-white"
              href="#explore"
            >
              Explore events <span>↗</span>
            </a>
            <a className="font-sans text-xs font-bold" href="#how-it-works">
              How it works <span>→</span>
            </a>
          </div>
        </div>
        <div
          className="relative h-[400px] max-md:mt-[35px] max-md:h-[300px]"
          aria-label="A crowd enjoying an outdoor concert"
        >
          <div className="absolute inset-[5px_10px_5px_45px] -rotate-20 rounded-full border border-[#cbc7e9]"></div>
          <div className="absolute inset-[35px_70px_30px_0] -rotate-20 rounded-full border border-[#efc0b6]"></div>
          <div className="absolute inset-[25px_40px_10px_70px] rotate-4 rounded-[50%_50%_8px_8px] bg-[linear-gradient(0deg,rgba(11,17,42,0.25),transparent_45%),url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=90')] bg-cover bg-center shadow-[18px_20px_0_#ede9fc] max-md:inset-[17px_35px_4px_40px]"></div>
          <div className="absolute bottom-[22px] right-0 flex -rotate-3 items-center gap-2.5 bg-white px-[17px] py-3.5 text-[13px] shadow-[0_12px_30px_rgba(24,32,52,0.12)]">
            <span>✦</span>
            <div>
              <strong>
                Good things
                <br />
                are happening.
              </strong>
              <small className="mt-1 block font-sans text-[10px] text-[var(--muted)]">
                Dhaka · right now
              </small>
            </div>
          </div>
        </div>
      </section> */}

      {/* Search Panel */}
      {/* <section className="relative z-[2] mx-auto w-[min(1180px,calc(100%-48px))] translate-y-3 border border-[var(--line)] bg-white p-[11px] shadow-[0_12px_30px_rgba(24,32,52,0.05)] max-md:w-[calc(100%-32px)]">
        <form
          onSubmit={handleSearch}
          className="flex items-stretch gap-0 max-md:flex-wrap"
        >
          <div className="flex flex-[1.5] items-center gap-3 border-r border-[var(--line)] px-5 py-[9px] max-md:basis-full max-md:border-b max-md:border-r-0">
            <span>⌕</span>
            <input
              aria-label="Search events"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-1 items-center gap-3 border-r border-[var(--line)] px-5 py-[9px] max-md:basis-1/2 max-md:border-r-0">
            <span>⌖</span>
            <select
              value={selectedArea || ""}
              onChange={(e) => setSelectedArea(e.target.value || undefined)}
              className="w-full border-0 bg-transparent font-semibold outline-none"
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
          <div className="flex-1 items-center gap-3 px-5 py-[9px] max-md:basis-1/2">
            <span>◷</span>
            <div>
              <small className="block font-sans text-[10px]">When</small>
              <strong className="mt-1 block font-sans text-xs text-[var(--ink)]">
                Any date
              </strong>
            </div>
          </div>
          <button
            type="submit"
            className="ml-[11px] bg-[var(--coral)] px-[23px] py-4 font-sans text-xs font-bold text-white max-md:ml-0 max-md:w-full"
          >
            Search events
          </button>
        </form>
      </section> */}
      <HeroBanner />
      {/* Categories Section */}
      {/* <section
        className="mx-auto w-[min(1180px,calc(100%-48px))] py-[100px_78px] max-md:w-[calc(100%-32px)] max-md:pt-20"
        id="categories"
      >
        <div className="mb-[30px] flex items-end justify-between max-md:flex-col max-md:items-start max-md:gap-[17px]">
          <div>
            <p className="mb-[18px] font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)]">
              BROWSE BY MOOD
            </p>
            <h2 className="m-0 text-[38px] font-medium tracking-[-1.8px] max-md:text-[32px]">
              Something for everyone.
            </h2>
          </div>
          <Link className="font-sans text-xs font-bold" href="/explore">
            See all categories <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-[13px] max-md:grid-cols-2">
          {isFiltersLoading ? (
            <p className="text-gray-600">Loading categories...</p>
          ) : (
            filters?.categories?.map((category) => {
              const iconData =
                categoryIcons[category.slug] || categoryIcons.music;
              return (
                <Link
                  className={`relative flex min-h-[145px] flex-col justify-between rounded p-[21px] transition hover:-translate-y-1 max-md:last:col-span-2 ${iconData.tone === "coral" ? "bg-[#f4c8be]" : iconData.tone === "gold" ? "bg-[var(--gold)]" : iconData.tone === "blue" ? "bg-[#c5dcf2]" : iconData.tone === "lavender" ? "bg-[var(--lavender)]" : "bg-[var(--mint)]"}`}
                  href={`/explore?category=${category.slug}`}
                  key={category.id}
                >
                  <span className="text-[27px]">{iconData.icon}</span>
                  <strong className="text-base font-medium">
                    {category.name}
                  </strong>
                  <span className="absolute bottom-[17px] right-[19px] font-sans text-lg">
                    ↗
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </section> */}
      <CategorySection />
      <EventSection />

      {/* Statement Section */}
      {/* <section
        className="mx-auto grid w-[min(1180px,calc(100%-48px))] grid-cols-[70px_1fr_auto] items-center gap-5 py-[100px] max-md:w-[calc(100%-32px)] max-md:grid-cols-[45px_1fr] max-md:py-[72px]"
        id="about"
      >
        <div className="text-[53px] text-[var(--coral)]">✦</div>
        <p className="m-0 text-[41px] leading-[0.99] tracking-[-2px] max-md:text-[31px]">
          There&apos;s more to life
          <br />
          than <em>routine.</em>
        </p>
        <Link
          className="inline-flex items-center justify-center gap-[15px] bg-[var(--ink)] px-[22px] py-4 font-sans text-xs font-bold text-white max-md:col-start-2"
          href="/explore"
        >
          Find your next thing <span>↗</span>
        </Link> */}
      {/* </section> */}
    </main>
  );
}
