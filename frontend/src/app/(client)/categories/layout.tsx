import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Categories",
  description:
    "Browse all event categories and find the perfect experience on Bengal Booking.",
  alternates: {
    canonical: "/categories",
  },
};

export default function CategoriesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
