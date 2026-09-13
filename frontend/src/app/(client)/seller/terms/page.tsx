"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ShieldCheck,
  FileText,
  MapPinCheck,
  Ban,
  RotateCcw,
  AlertTriangle,
  Lock,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useBecomeSeller } from "@/hooks/use-auth";
import Logo from "@/components/Logo";

const TERMS = [
  {
    icon: FileText,
    text: "You must provide accurate event, venue, ticket, price, and schedule information.",
  },
  {
    icon: MapPinCheck,
    text: "You are responsible for delivering the events you publish and honoring confirmed bookings.",
  },
  {
    icon: Ban,
    text: "Do not publish misleading, illegal, unsafe, or unauthorized events or content.",
  },
  {
    icon: RotateCcw,
    text: "Handle cancellations and refunds according to the event policy shown to buyers.",
  },
  {
    icon: AlertTriangle,
    text: "We may suspend seller access for fraud, abuse, repeated complaints, or policy violations.",
  },
  {
    icon: Lock,
    text: "You agree to protect buyer information and use it only for fulfilling the booking.",
  },
];

export default function SellerTermsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const becomeSeller = useBecomeSeller();
  const [accepted, setAccepted] = useState(false);

  const submit = () => {
    if (!user) {
      router.push("/login?next=/seller/terms");
      return;
    }
    if (!accepted) return;
    becomeSeller.mutate(undefined, {
      onSuccess: () => router.push("/seller/dashboard"),
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--lavender)] px-5 py-12">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-2xl">

        <Card className="mt-8 border-none bg-[var(--cream)]/90 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-2">
            <Badge
              variant="secondary"
              className="w-fit gap-1.5 bg-primary/10 text-primary hover:bg-primary/10"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              SELLER TERMS
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Before you start selling
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Please read and accept these rules before becoming a seller.
            </p>
          </CardHeader>

          <Separator className="my-2" />

          <CardContent className="pt-4">
            <ol className="space-y-4">
              {TERMS.map(({ icon: Icon, text }, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/60 p-3.5 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="pt-1 text-sm leading-6 text-slate-700">
                    {text}
                  </span>
                </li>
              ))}
            </ol>

            <label
              htmlFor="accept-terms"
              className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm transition-colors hover:bg-primary/10"
            >
              <Checkbox
                id="accept-terms"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked === true)}
                className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="leading-6">
                I have read and accept the seller terms and privacy rules.
              </span>
            </label>

            {becomeSeller.isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {becomeSeller.error.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardContent>
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={submit}
              disabled={!accepted || becomeSeller.isPending}
            >
              {becomeSeller.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {becomeSeller.isPending
                ? "Updating account..."
                : "I accept and become a seller"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
