import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Events | Bengal Booking",
    template: "%s | Bengal Booking",
  },
  description:
    "Discover and book concerts, festivals, workshops, sports, and more with Bengal Booking.",
  alternates: {
    canonical: "/events",
  },
};

export default function EventsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
