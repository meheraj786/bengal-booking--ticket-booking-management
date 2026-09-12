"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarX } from "lucide-react";
import { useEventList } from "@/hooks/useEvent";
import { EventCard } from "./EventCard";
import type { Event } from "@/types/event.types";

export default function EventSection() {
  const { data: events, isLoading, isError } = useEventList();

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Don&apos;t Miss Out
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#141738]">
            Upcoming Events
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-slate-500 font-normal">
            Curated experiences happening around you this week
          </p>
        </div>

        <Link
          href="/explore"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors self-start sm:self-auto"
        >
          <span>View all events</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm animate-pulse"
            >
              <div className="aspect-[16/10] w-full bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-3/5 bg-slate-200 rounded" />
                  <div className="h-5 w-1/5 bg-slate-200 rounded" />
                </div>
                <div className="h-3.5 w-2/5 bg-slate-200 rounded" />
                <div className="h-3.5 w-4/5 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CalendarX className="h-12 w-12 text-slate-300 mb-3" />
          <p className="text-base font-semibold text-slate-700">
            Unable to load events
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Please try refreshing the page or check back later.
          </p>
        </div>
      )}

      {!isLoading && !isError && events && events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CalendarX className="h-12 w-12 text-slate-300 mb-3" />
          <p className="text-base font-semibold text-slate-700">
            No events found
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Check back soon for upcoming events in your area.
          </p>
        </div>
      )}

      {!isLoading && !isError && events && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event: Event) => {
            const isFree = parseFloat(event.price) === 0;

            return (
              <div
                key={event.id}
                className={
                  isFree ? "col-span-1 sm:col-span-2 flex" : "col-span-1 flex"
                }
              >
                <EventCard event={event} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
