"use client";

import { useParams, useRouter } from "next/navigation";
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
import { useSellerEvent, useUpdateSellerEvent } from "@/hooks/useSellerEvent";
import React from "react";

export default function EditSellerEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const { data: event, isLoading } = useSellerEvent(eventId);
  const { data: filters } = useEventFilters();
  const updateEvent = useUpdateSellerEvent(eventId);

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

  React.useEffect(() => {
    if (event) {
      form.reset({
        categoryId: event.categoryId,
        areaId: event.areaId,
        title: event.title,
        description: event.description,
        venueName: event.venueName,
        venueAddress: event.venueAddress,
        startAt: event.startAt,
        endAt: event.endAt,
        maxTicketsPerBooking: event.maxTicketsPerBooking,
        lastDateAndTimeOfCancel: event.lastDateAndTimeOfCancel || "",
        lastDateOfBooking: event.lastDateOfBooking || "",
        paymentType: event.paymentType,
        coverImage: event.coverImage || "",
      });
    }
  }, [event, form]);

  const handleSubmit = form.handleSubmit((data) => {
    updateEvent.mutate(data, {
      onSuccess: () => {
        router.push(`/seller/events/${eventId}`);
      },
    });
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading event...</div>;
  }

  if (!event) {
    return (
      <div className="text-center py-8">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <p className="text-gray-600">Update your event details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardContent>Make changes to your event</CardContent>
        </CardHeader>
        <CardContent>
          <form id="edit-event-form" onSubmit={handleSubmit}>
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
                        disabled={updateEvent.isPending}
                      >
                        <SelectTrigger id="category">
                          <SelectValue />
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
                        disabled={updateEvent.isPending}
                      >
                        <SelectTrigger id="area">
                          <SelectValue />
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
                      disabled={updateEvent.isPending}
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
                      rows={4}
                      disabled={updateEvent.isPending}
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
                        disabled={updateEvent.isPending}
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
                        disabled={updateEvent.isPending}
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
                        disabled={updateEvent.isPending}
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
                        disabled={updateEvent.isPending}
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
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                        disabled={updateEvent.isPending}
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
                    <Input {...field} type="datetime-local" id="lastDateOfBooking" disabled={updateEvent.isPending} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
                <Controller name="lastDateAndTimeOfCancel" control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}><FieldLabel htmlFor="lastDateAndTimeOfCancel">Last Date and Time of Cancellation</FieldLabel>
                    <Input {...field} type="datetime-local" id="lastDateAndTimeOfCancel" disabled={updateEvent.isPending} />
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
                      disabled={updateEvent.isPending}
                    />
                    <FieldDescription>
                      Optional: Update your event cover image
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
          <Link href={`/seller/events/${eventId}`}>Cancel</Link>
        </Button>
        <Button
          type="submit"
          form="edit-event-form"
          disabled={updateEvent.isPending}
        >
          {updateEvent.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
