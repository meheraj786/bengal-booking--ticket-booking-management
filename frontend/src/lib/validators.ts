import { z } from "zod";

// Auth Validators
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^[0-9+\-\s()]{7,20}$/.test(value), {
      message: "Enter a valid phone number",
    }),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const sellerRegisterSchema = registerSchema;
export type SellerRegisterInput = z.infer<typeof sellerRegisterSchema>;

// Admin Validators
export const areaFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .toLowerCase()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    )
    .max(100, "Slug is too long"),
});
export type AreaFormInput = z.infer<typeof areaFormSchema>;

export const divisionFormSchema = areaFormSchema;
export type DivisionFormInput = z.infer<typeof divisionFormSchema>;

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .toLowerCase()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    )
    .max(100, "Slug is too long"),
  description: z
    .string()
    .max(500, "Description is too long")
    .optional()
    .or(z.literal("")),
});
export type CategoryFormInput = z.infer<typeof categoryFormSchema>;

export const userRoleSchema = z.object({
  role: z.enum(["USER", "SELLER", "SUPER_ADMIN"]),
});
export type UserRoleInput = z.infer<typeof userRoleSchema>;

export const userStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});
export type UserStatusInput = z.infer<typeof userStatusSchema>;

// Event & Ticket Validators (used by both Admin and Seller)
export const eventFormSchema = z.object({
  categoryId: z.string().uuid("Please select a valid category"),
  areaId: z.string().uuid("Please select a valid area"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long"),
  venueName: z
    .string()
    .min(2, "Venue name must be at least 2 characters")
    .max(200, "Venue name is too long"),
  venueAddress: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address is too long"),
  startAt: z.string().datetime("Please select a valid start date and time"),
  endAt: z.string().datetime("Please select a valid end date and time"),
  totalTickets: z
    .number()
    .int("Total tickets must be a whole number")
    .min(1, "Event must have at least 1 ticket"),
  maxTicketsPerBooking: z
    .number()
    .int("Max tickets must be a whole number")
    .min(1, "Max tickets per booking must be at least 1"),
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(9999999, "Price is too high"),
  coverImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
});
export type EventFormInput = z.infer<typeof eventFormSchema>;

export const eventStatusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]),
});
export type EventStatusInput = z.infer<typeof eventStatusSchema>;

export const ticketFormSchema = z.object({
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(10000, "Quantity is too high"),
  note: z.string().max(500, "Note is too long").optional().or(z.literal("")),
});
export type TicketFormInput = z.infer<typeof ticketFormSchema>;
