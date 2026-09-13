"use client";

import { useEffect } from "react";
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ticketFormSchema,
  type TicketFormInput,
} from "@/lib/validators";

interface TicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TicketFormInput) => void;
  eventTitle?: string;
  isLoading?: boolean;
}

export function TicketDialog({
  open,
  onOpenChange,
  onSubmit,
  eventTitle,
  isLoading,
}: TicketDialogProps) {
  const form = useForm<TicketFormInput>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      quantity: 1,
      name: "",
      description: "",
      price: 0,
    },
  });

  useEffect(() => {
    form.reset({
      quantity: 1,
      name: "",
      description: "",
      price: 0,
    });
  }, [form, open]);

  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Tickets</DialogTitle>
          <DialogDescription>
            {eventTitle
              ? `Add tickets for ${eventTitle}`
              : "Add tickets to this event"}
          </DialogDescription>
        </DialogHeader>

        <form id="ticket-form" onSubmit={handleFormSubmit}>
          <FieldGroup className="space-y-4">
            <Controller
              name="quantity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ticket-quantity">Quantity</FieldLabel>
                  <Input
                    {...field}
                    value={field.value}
                    type="number"
                    min="1"
                    id="ticket-quantity"
                    placeholder="100"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Number of tickets to generate for this event
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ticket-name">Ticket name</FieldLabel>
                  <Input
                    {...field}
                    id="ticket-name"
                    placeholder="VIP Admission"
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
                  <FieldLabel htmlFor="ticket-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="ticket-description"
                    placeholder="Describe what this ticket includes..."
                    disabled={isLoading}
                    rows={3}
                    aria-invalid={fieldState.invalid}
                  />

                  <Controller
                    name="price"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="ticket-price">Price</FieldLabel>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          id="ticket-price"
                          placeholder="0.00"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          disabled={isLoading}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldDescription>Price per ticket</FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
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
          <Button type="submit" form="ticket-form" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Tickets"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
