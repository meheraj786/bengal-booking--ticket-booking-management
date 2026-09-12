"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { eventFormSchema, type EventFormInput } from "@/lib/validators";
import type { Event, EventCategory, EventArea } from "@/types/event.types";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EventFormInput) => void;
  event?: Event;
  categories?: EventCategory[];
  areas?: EventArea[];
  isLoading?: boolean;
}

export function EventDialog({
  open,
  onOpenChange,
  onSubmit,
  event,
  categories = [],
  areas = [],
  isLoading,
}: EventDialogProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);

  const form = useForm<EventFormInput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      categoryId: "",
      areaId: "",
      title: "",
      description: "",
      venueName: "",
      venueAddress: "",
      startAt: "",
      endAt: "",
      totalTickets: 0,
      maxTicketsPerBooking: 5,
      price: 0,
      coverImage: "",
    },
  });

  useEffect(() => {
    if (event) {
      const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      form.reset({
        categoryId: event.categoryId,
        areaId: event.areaId,
        title: event.title,
        description: event.description,
        venueName: event.venueName,
        venueAddress: event.venueAddress,
        startAt: formatDateTime(event.startAt),
        endAt: formatDateTime(event.endAt),
        totalTickets: event.totalTickets,
        maxTicketsPerBooking: event.maxTicketsPerBooking,
        price: Number(event.price),
        coverImage: event.coverImage || "",
      });
    } else {
      form.reset({
        categoryId: "",
        areaId: "",
        title: "",
        description: "",
        venueName: "",
        venueAddress: "",
        startAt: "",
        endAt: "",
        totalTickets: 0,
        maxTicketsPerBooking: 5,
        price: 0,
        coverImage: "",
      });
    }
  }, [event, form, open]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formatToISO = (dateTimeLocal: string) => {
      if (!dateTimeLocal) return "";
      const date = new Date(dateTimeLocal);
      return date.toISOString();
    };

    onSubmit({
      ...data,
      startAt: formatToISO(data.startAt),
      endAt: formatToISO(data.endAt),
    });
  });

  const selectedCategory = categories.find(
    (cat) => cat.id === form.watch("categoryId"),
  );

  const selectedArea = areas.find((area) => area.id === form.watch("areaId"));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
          <DialogDescription>
            {event
              ? "Update the event details below."
              : "Create a new event for your platform."}
          </DialogDescription>
        </DialogHeader>

        <form id="event-form" onSubmit={handleFormSubmit}>
          <FieldGroup className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Category Searchable Dropdown */}
              <Controller
                name="categoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-category">Category</FieldLabel>
                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                      <PopoverTrigger>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={categoryOpen}
                          className="w-full justify-between"
                          disabled={isLoading}
                        >
                          {selectedCategory
                            ? selectedCategory.name
                            : "Select category..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command shouldFilter={true}>
                          <CommandInput
                            placeholder="Search categories..."
                            value={undefined}
                          />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  key={category.id}
                                  value={category.name}
                                  onSelect={() => {
                                    field.onChange(
                                      field.value === category.id
                                        ? ""
                                        : category.id,
                                    );
                                    setCategoryOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === category.id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {category.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Area Searchable Dropdown */}
              <Controller
                name="areaId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-area">Area</FieldLabel>
                    <Popover open={areaOpen} onOpenChange={setAreaOpen}>
                      <PopoverTrigger>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={areaOpen}
                          className="w-full justify-between"
                          disabled={isLoading}
                        >
                          {selectedArea ? selectedArea.name : "Select area..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command shouldFilter={true}>
                          <CommandInput
                            placeholder="Search areas..."
                            value={undefined}
                          />
                          <CommandList>
                            <CommandEmpty>No area found.</CommandEmpty>
                            <CommandGroup>
                              {areas.map((area) => (
                                <CommandItem
                                  key={area.id}
                                  value={area.name}
                                  onSelect={() => {
                                    field.onChange(
                                      field.value === area.id ? "" : area.id,
                                    );
                                    setAreaOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === area.id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {area.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="event-title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="event-title"
                    placeholder="e.g., Summer Music Festival"
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="event-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="event-description"
                    placeholder="Detailed description of the event..."
                    disabled={isLoading}
                    rows={3}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="venueName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-venue">Venue Name</FieldLabel>
                    <Input
                      {...field}
                      id="event-venue"
                      placeholder="e.g., Central Park"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="venueAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-address">Address</FieldLabel>
                    <Input
                      {...field}
                      id="event-address"
                      placeholder="Venue address"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="startAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-start">
                      Start Date & Time
                    </FieldLabel>
                    <Input
                      {...field}
                      type="datetime-local"
                      id="event-start"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="endAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-end">End Date & Time</FieldLabel>
                    <Input
                      {...field}
                      type="datetime-local"
                      id="event-end"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="totalTickets"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-tickets">
                      Total Tickets
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id="event-tickets"
                      placeholder="100"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="maxTicketsPerBooking"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-max-per-booking">
                      Max Per Booking
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id="event-max-per-booking"
                      placeholder="5"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-price">Price (৳)</FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      id="event-price"
                      placeholder="0.00"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="coverImage"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="event-image">
                    Cover Image URL (optional)
                  </FieldLabel>
                  <Input
                    {...field}
                    type="url"
                    id="event-image"
                    placeholder="https://example.com/image.jpg"
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Provide a valid image URL for the event cover
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" form="event-form" disabled={isLoading}>
            {isLoading ? "Saving..." : event ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
