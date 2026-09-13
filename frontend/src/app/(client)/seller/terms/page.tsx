"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useBecomeSeller } from "@/hooks/use-auth";

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
    <main className="min-h-screen bg-[var(--lavender)] px-5 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl bg-[var(--cream)] p-8 shadow-sm sm:p-12">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          bengalBooking<span className="text-primary">.</span>
        </Link>
        <p className="eyebrow mt-10">SELLER TERMS</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">Before you start selling</h1>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          Please read and accept these rules before becoming a seller.
        </p>
        <ol className="mt-8 list-decimal space-y-4 pl-5 text-sm leading-6 text-slate-700">
          <li>You must provide accurate event, venue, ticket, price, and schedule information.</li>
          <li>You are responsible for delivering the events you publish and honoring confirmed bookings.</li>
          <li>Do not publish misleading, illegal, unsafe, or unauthorized events or content.</li>
          <li>Handle cancellations and refunds according to the event policy shown to buyers.</li>
          <li>We may suspend seller access for fraud, abuse, repeated complaints, or policy violations.</li>
          <li>You agree to protect buyer information and use it only for fulfilling the booking.</li>
        </ol>
        <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-4 w-4" />
          <span>I have read and accept the seller terms and privacy rules.</span>
        </label>
        {becomeSeller.isError && <p className="mt-4 text-sm text-red-600">{becomeSeller.error.message}</p>}
        <Button className="mt-6 w-full" onClick={submit} disabled={!accepted || becomeSeller.isPending}>
          {becomeSeller.isPending ? "Updating account..." : "I accept and become a seller"}
        </Button>
      </div>
    </main>
  );
}
