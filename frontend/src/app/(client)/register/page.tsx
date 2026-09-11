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
    <main className="auth-shell">
      <Link className="brand" href="/">
        evently<span>.</span>
      </Link>
      <div className="auth-card">
        <p className="eyebrow">JOIN THE COMMUNITY</p>
        <h1>
          Make room for
          <br />
          <em>more moments.</em>
        </h1>
        <p className="auth-intro">
          Create an account and start finding things worth showing up for.
        </p>
        <a className="google-button" href={authService.googleLoginUrl()}>
          G <span>Continue with Google</span>
        </a>
        <div className="or">
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
              <p className="form-success">
                Check your email to verify your account.
              </p>
            )}

            {mutation.isError && (
              <p className="auth-error" role="alert">
                {mutation.error.message}
              </p>
            )}
          </FieldGroup>
        </form>

        <Button
          type="submit"
          form="register-form"
          className="button auth-button w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create account →"}
        </Button>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
