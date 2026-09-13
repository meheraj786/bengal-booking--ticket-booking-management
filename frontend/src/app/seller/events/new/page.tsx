"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventFormSchema, type EventFormInput } from "@/lib/validators";
import { useEventFilters } from "@/hooks/useEvent";
import { useCreateSellerEvent } from "@/hooks/useSellerEvent";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreateSellerEventPage() {
  const router = useRouter();
  const { data: filters } = useEventFilters();
  const createEvent = useCreateSellerEvent();
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
      maxTicketsPerBooking: 5,
      lastDateAndTimeOfCancel: "",
      lastDateOfBooking: "",
      paymentType: "Free",
      coverImage: "",
    },
  });

  const selectedCategory = filters?.categories.find(
    (category) => category.id === form.watch("categoryId"),
  );
  const selectedArea = filters?.areas.find(
    (area) => area.id === form.watch("areaId"),
  );

  const handleSubmit = form.handleSubmit((data) => {
    createEvent.mutate(data, {
      onSuccess: (event) => {
        router.push(`/seller/events/${event.id}`);
      },
    });
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Create Event</h1>
        <p className="text-gray-600">
          Create a new event to start selling tickets
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardContent>Fill in the information for your event</CardContent>
        </CardHeader>
        <CardContent>
          <form id="create-event-form" onSubmit={handleSubmit}>
            <FieldGroup className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="categoryId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="category">Category</FieldLabel>
                      <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                        <PopoverTrigger>
                          <Button
                            id="category"
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={categoryOpen}
                            className="w-full justify-between"
                            disabled={createEvent.isPending}
                          >
                            {selectedCategory?.name ?? "Select category..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Search categories..." />
                            <CommandList>
                              <CommandEmpty>No category found.</CommandEmpty>
                              <CommandGroup>
                                {filters?.categories.map((category) => (
                                  <CommandItem
                                    key={category.id}
                                    value={category.name}
                                    onSelect={() => {
                                      field.onChange(
                                        field.value === category.id ? "" : category.id,
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

                <Controller
                  name="areaId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="area">Area</FieldLabel>
                      <Popover open={areaOpen} onOpenChange={setAreaOpen}>
                        <PopoverTrigger>
                          <Button
                            id="area"
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={areaOpen}
                            className="w-full justify-between"
                            disabled={createEvent.isPending}
                          >
                            {selectedArea?.name ?? "Select area..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Search areas..." />
                            <CommandList>
                              <CommandEmpty>No area found.</CommandEmpty>
                              <CommandGroup>
                                {filters?.areas.map((area) => (
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
                    <FieldLabel htmlFor="title">Event Title</FieldLabel>
                    <Input
                      {...field}
                      id="title"
                      placeholder="e.g., Summer Music Festival"
                      disabled={createEvent.isPending}
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
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Detailed description of your event..."
                      rows={4}
                      disabled={createEvent.isPending}
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
                      <FieldLabel htmlFor="venueName">Venue Name</FieldLabel>
                      <Input
                        {...field}
                        id="venueName"
                        placeholder="e.g., Central Park"
                        disabled={createEvent.isPending}
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
                      <FieldLabel htmlFor="venueAddress">Address</FieldLabel>
                      <Input
                        {...field}
                        id="venueAddress"
                        placeholder="Full venue address"
                        disabled={createEvent.isPending}
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
                      <FieldLabel htmlFor="startAt">
                        Start Date & Time
                      </FieldLabel>
                      <Input
                        {...field}
                        type="datetime-local"
                        id="startAt"
                        disabled={createEvent.isPending}
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
                      <FieldLabel htmlFor="endAt">End Date & Time</FieldLabel>
                      <Input
                        {...field}
                        type="datetime-local"
                        id="endAt"
                        disabled={createEvent.isPending}
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
                  name="maxTicketsPerBooking"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="maxPerBooking">
                        Max Per Booking
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        id="maxPerBooking"
                        placeholder="5"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                        disabled={createEvent.isPending}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="paymentType"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Payment Type</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Advance">Advance</SelectItem>
                          <SelectItem value="OnArrival">On Arrival</SelectItem>
                          <SelectItem value="Free">Free</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Controller name="lastDateOfBooking" control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}><FieldLabel htmlFor="lastDateOfBooking">Last Date of Booking</FieldLabel>
                    <Input {...field} type="datetime-local" id="lastDateOfBooking" disabled={createEvent.isPending} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
                <Controller name="lastDateAndTimeOfCancel" control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}><FieldLabel htmlFor="lastDateAndTimeOfCancel">Last Date and Time of Cancellation</FieldLabel>
                    <Input {...field} type="datetime-local" id="lastDateAndTimeOfCancel" disabled={createEvent.isPending} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
              </div>

              <Controller
                name="coverImage"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="coverImage">
                      Cover Image URL
                    </FieldLabel>
                    <Input
                      {...field}
                      type="url"
                      id="coverImage"
                      placeholder="https://example.com/image.jpg"
                      disabled={createEvent.isPending}
                    />
                    <FieldDescription>
                      Optional: Provide a cover image for your event
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="button" variant="outline" asChild>
          <Link href="/seller/events">Cancel</Link>
        </Button>
        <Button
          type="submit"
          form="create-event-form"
          disabled={createEvent.isPending}
        >
          {createEvent.isPending ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </div>
  );
}
