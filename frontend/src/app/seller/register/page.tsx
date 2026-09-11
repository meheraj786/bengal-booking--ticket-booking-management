"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  sellerRegisterSchema,
  type SellerRegisterInput,
} from "@/lib/validators";
import { useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SellerRegisterPage() {
  const mutation = useRegister();
  const form = useForm<SellerRegisterInput>({
    resolver: zodResolver(sellerRegisterSchema),
    defaultValues: { name: "", email: "", password: "", phone: "" },
  });

  const submit = form.handleSubmit((values) =>
    mutation.mutate({ ...values, role: "SELLER" }),
  );

  return (
    <main className="auth-shell">
      <Link className="brand" href="/">
        evently<span>.</span>
      </Link>
      <div className="auth-card">
        <p className="eyebrow">SELLER SIGN UP</p>
        <h1>
          Start selling
          <br />
          <em>your events.</em>
        </h1>
        <p className="auth-intro">
          Create a seller account to publish events and manage bookings.
        </p>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Business / your name</Label>
            <Input
              id="name"
              placeholder="e.g. Acme Events"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="form-error">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="form-error">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              placeholder="+880..."
              {...form.register("phone")}
            />
            {form.formState.errors.phone && (
              <p className="form-error">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="form-error">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          {mutation.isSuccess && (
            <p className="form-success">
              Check your email to verify your seller account.
            </p>
          )}
          {mutation.isError && (
            <p className="auth-error" role="alert">
              {mutation.error.message}
            </p>
          )}
          <Button
            type="submit"
            className="button auth-button w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create seller account →"}
          </Button>
        </form>
        <p className="auth-switch">
          Already a seller? <Link href="/seller/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
