"use client";

import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar as CalendarIcon,
  Search,
  Tag,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEventFilters } from "@/hooks/useEvent";
import { cn } from "@/lib/utils";

export default function HeroBanner() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: filters } = useEventFilters();

  const [date, setDate] = useState<Date | undefined>();
  const [category, setCategory] = useState<string>("");
  const [area, setArea] = useState<string>("");

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);

  const selectedCategoryObj = useMemo(
    () => filters?.categories?.find((c) => c.slug === category),
    [filters?.categories, category],
  );
  const selectedAreaObj = useMemo(
    () => filters?.areas?.find((a) => a.slug === area),
    [filters?.areas, area],
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (area) params.set("area", area);
    if (date) params.set("startDate", date.toISOString());

    const query = params.toString();
    router.push(`/explore${query ? `?${query}` : ""}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 font-sans">
      <div className="relative rounded-[2.5rem] bg-[#0c0d2a] overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial from-[#662855]/40 via-[#3a194c]/20 to-transparent blur-3xl pointer-events-none -mr-20 -mt-20 transform-gpu" />
        <div className="absolute bottom-0 left-1/3 w-[550px] h-[320px] bg-radial from-[#1e1b4b]/60 via-[#12112d]/20 to-transparent blur-3xl pointer-events-none transform-gpu" />
        <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 px-8 sm:px-12 md:px-16 pt-14 pb-24 md:pb-28 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 backdrop-blur-md transition-colors cursor-default">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span className="text-xs sm:text-sm font-medium text-slate-200 tracking-wide">
              Your next great memory starts here
            </span>
          </div>

          <h1 className="mt-8 text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-white tracking-tight leading-[1.12]">
            Discover & Book <br className="hidden sm:inline" />
            Unforgettable Events
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300/80 font-normal leading-relaxed max-w-xl">
            From electric concerts to intimate workshops, find the moments worth
            showing up for.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link href="/explore">
              <button className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm sm:text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-105 active:scale-[0.98] transition-all">
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </Link>

            {(!user || user.role === "USER") && (
              <Link href="/seller/terms">
                <button className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-[#2e335b]/50 hover:bg-[#2e335b]/80 text-white font-medium text-sm sm:text-base border border-white/10 backdrop-blur-md active:scale-[0.98] transition-all">
                  Become An Organizer
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative -mt-10 sm:-mt-12 mx-4 sm:mx-8 md:mx-12 z-20 font-sans">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 p-2 sm:p-2.5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0">
            {/* Category — searchable combobox */}
            <div className="flex-1 min-w-0">
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger >
                  <button
                    type="button"
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors text-left font-sans"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Tag className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        Category
                      </span>
                      <span
                        className={`block text-sm font-medium truncate font-sans ${
                          selectedCategoryObj
                            ? "text-slate-800"
                            : "text-slate-400"
                        }`}
                      >
                        {selectedCategoryObj?.name || "Any category"}
                      </span>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[260px] p-0 border-slate-200 shadow-xl rounded-2xl font-sans"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setCategory("");
                            setCategoryOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              !category ? "opacity-100" : "opacity-0",
                            )}
                          />
                          Any category
                        </CommandItem>
                        {filters?.categories?.map((item) => (
                          <CommandItem
                            key={item.id}
                            value={item.name}
                            onSelect={() => {
                              setCategory(
                                category === item.slug ? "" : item.slug,
                              );
                              setCategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                category === item.slug
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {item.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="hidden md:block w-px h-9 bg-slate-200/80 shrink-0" />

            {/* Date */}
            <div className="flex-1 min-w-0">
              <Popover>
                <PopoverTrigger >
                  <button
                    type="button"
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors text-left font-sans"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CalendarIcon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        When
                      </span>
                      <span
                        className={`block text-sm font-medium truncate font-sans ${
                          date ? "text-slate-800" : "text-slate-400"
                        }`}
                      >
                        {date ? format(date, "PPP") : "Choose a date"}
                      </span>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 border-slate-200 shadow-xl rounded-2xl font-sans"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="hidden md:block w-px h-9 bg-slate-200/80 shrink-0" />

            {/* Location — searchable combobox */}
            <div className="flex-1 min-w-0">
              <Popover open={areaOpen} onOpenChange={setAreaOpen}>
                <PopoverTrigger >
                  <button
                    type="button"
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors text-left font-sans"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MapPin className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        Location
                      </span>
                      <span
                        className={`block text-sm font-medium truncate font-sans ${
                          selectedAreaObj ? "text-slate-800" : "text-slate-400"
                        }`}
                      >
                        {selectedAreaObj?.name || "Where are you going?"}
                      </span>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[260px] p-0 border-slate-200 shadow-xl rounded-2xl font-sans"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Search location..." />
                    <CommandList>
                      <CommandEmpty>No location found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setArea("");
                            setAreaOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              !area ? "opacity-100" : "opacity-0",
                            )}
                          />
                          All locations
                        </CommandItem>
                        {filters?.areas?.map((item) => (
                          <CommandItem
                            key={item.id}
                            value={item.name}
                            onSelect={() => {
                              setArea(area === item.slug ? "" : item.slug);
                              setAreaOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                area === item.slug
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {item.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="shrink-0 p-1 md:pl-2">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground font-semibold py-3.5 px-7 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-sans cursor-pointer"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span className="text-sm tracking-wide">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
