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
import {
  areaFormSchema,
  type AreaFormInput,
} from "@/lib/validators";
import type { Area } from "@/types/area.types";

interface AreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AreaFormInput) => void;
  area?: Area;
  isLoading?: boolean;
}

export function AreaDialog({
  open,
  onOpenChange,
  onSubmit,
  area,
  isLoading,
}: AreaDialogProps) {
  const form = useForm<AreaFormInput>({
    resolver: zodResolver(areaFormSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    if (area) {
      form.reset({
        name: area.name,
        slug: area.slug,
      });
    } else {
      form.reset({
        name: "",
        slug: "",
      });
    }
  }, [area, form, open]);

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    if (!form.getValues("slug") || area === undefined) {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      form.setValue("slug", slug);
    }
  };

  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{area ? "Edit Area" : "Create Area"}</DialogTitle>
          <DialogDescription>
            {area
              ? "Update the area details below."
              : "Add a new area to your platform."}
          </DialogDescription>
        </DialogHeader>

        <form id="area-form" onSubmit={handleFormSubmit}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="area-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="area-name"
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
                  <FieldLabel htmlFor="area-slug">Slug</FieldLabel>
                  <Input
                    {...field}
                    id="area-slug"
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
          <Button type="submit" form="area-form" disabled={isLoading}>
            {isLoading ? "Saving..." : area ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
