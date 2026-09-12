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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { divisionFormSchema, type DivisionFormInput } from "@/lib/validators";
import type { Division } from "@/types/division.types";

interface DivisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DivisionFormInput) => void;
  division?: Division;
  isLoading?: boolean;
}

export function DivisionDialog({
  open,
  onOpenChange,
  onSubmit,
  division,
  isLoading,
}: DivisionDialogProps) {
  const form = useForm<DivisionFormInput>({
    resolver: zodResolver(divisionFormSchema),
    defaultValues: { name: "", slug: "" },
  });

  useEffect(() => {
    form.reset(
      division
        ? { name: division.name, slug: division.slug }
        : { name: "", slug: "" },
    );
  }, [division, form, open]);

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    if (!form.getValues("slug") || !division) {
      form.setValue(
        "slug",
        value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, ""),
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {division ? "Edit Division" : "Create Division"}
          </DialogTitle>
          <DialogDescription>
            {division
              ? "Update the division details below."
              : "Add a new division to your platform."}
          </DialogDescription>
        </DialogHeader>
        <form id="division-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="division-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="division-name"
                    placeholder="e.g., Dhaka"
                    onChange={(e) => handleNameChange(e.target.value)}
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
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="division-slug">Slug</FieldLabel>
                  <Input
                    {...field}
                    id="division-slug"
                    placeholder="e.g., dhaka"
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    URL-friendly version of the name
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
          <Button type="submit" form="division-form" disabled={isLoading}>
            {isLoading ? "Saving..." : division ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
