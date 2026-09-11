"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventFormSchema, type EventFormInput } from "@/lib/validators";
import { useEventFilters } from "@/hooks/useEvent";
import { useCreateSellerEvent } from "@/hooks/useSellerEvent";

export default function CreateSellerEventPage() {
  const router = useRouter();
  const { data: filters } = useEventFilters();
  const createEvent = useCreateSellerEvent();
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={createEvent.isPending}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {filters?.categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={createEvent.isPending}
                      >
                        <SelectTrigger id="area">
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                          {filters?.areas.map((area) => (
                            <SelectItem key={area.id} value={area.id}>
                              {area.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

              <div className="grid grid-cols-3 gap-4">
                <Controller
                  name="totalTickets"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="totalTickets">
                        Total Tickets
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        id="totalTickets"
                        placeholder="100"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
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
                  name="price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="price">Price (৳)</FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        id="price"
                        placeholder="0.00"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        disabled={createEvent.isPending}
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
