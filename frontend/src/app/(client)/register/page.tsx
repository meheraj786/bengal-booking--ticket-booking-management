"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { useRegister } from "@/hooks/use-auth";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const mutation = useRegister();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", phone: "" },
  });

  const handleSubmit = form.handleSubmit((values) =>
    mutation.mutate({ ...values, role: "USER" }),
  );

  return (
    <main className="min-h-screen bg-[var(--lavender)] px-[5%] py-[38px]">
      <Link
        className="block text-[25px] font-extrabold tracking-[-1.5px]"
        href="/"
      >
        bengalBooking<span className="text-primary">.</span>
      </Link>
      <div className="mx-auto mt-[35px] w-full max-w-[460px] bg-[var(--cream)] p-12 text-left max-sm:px-6 max-sm:py-9">
        <p className="mb-[18px] font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)]">
          JOIN THE COMMUNITY
        </p>
        <h1 className="m-0 text-[47px] font-medium leading-[0.98] tracking-[-4px]">
          Make room for
          <br />
          <em>more moments.</em>
        </h1>
        <p className="my-[15px] mb-7 max-w-[300px] font-sans text-[13px] leading-[1.6] text-[var(--muted)]">
          Create an account and start finding things worth showing up for.
        </p>
        <a
          className="block w-full border border-[var(--line)] bg-white p-[13px] text-center font-sans font-bold text-[#4285f4]"
          href={authService.googleLoginUrl()}
        >
          G <span>Continue with Google</span>
        </a>
        <div className="my-6 flex items-center gap-2.5 font-sans text-[10px] text-[var(--muted)] before:h-px before:flex-1 before:bg-[var(--line)] after:h-px after:flex-1 after:bg-[var(--line)]">
          <span>or sign up with email</span>
        </div>
        <form id="register-form" onSubmit={handleSubmit}>
          <FieldGroup className="space-y-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-name">Your name</FieldLabel>
                  <Input
                    {...field}
                    id="register-name"
                    placeholder="How should we call you?"
                    disabled={mutation.isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-email">
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    disabled={mutation.isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-phone">
                    Phone (optional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-phone"
                    placeholder="+880..."
                    disabled={mutation.isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="register-password"
                    type="password"
                    placeholder="At least 8 characters"
                    disabled={mutation.isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {mutation.isSuccess && (
              <p className="my-3 font-sans text-[11px] text-[#388d67]">
                Check your email to verify your account.
              </p>
            )}

            {mutation.isError && (
              <p className="font-sans text-[11px] text-[#b33e37]" role="alert">
                {mutation.error.message}
              </p>
            )}
          </FieldGroup>
        </form>

        <Button
          type="submit"
          form="register-form"
          className="w-full bg-[var(--coral)] font-sans text-xs font-bold text-white hover:bg-[var(--coral-dark)]"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create account →"}
        </Button>

        <p className="mt-4 text-center font-sans text-[11px] text-[var(--muted)]">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
