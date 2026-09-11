import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from "class-validator";
enum PaymentMethod {
  FREE = "FREE",
  SSLCOMMERZ = "SSLCOMMERZ",
  STRIPE = "STRIPE",
}
export class CreateBookingDto {
  @IsUUID() eventId!: string;
  @IsInt() @Min(1) @Max(100) quantity!: number;
}

export class ConfirmBookingDto {}

export class CheckoutDto {
  @IsUUID() bookingId!: string;
  @IsOptional() @IsEnum(PaymentMethod) paymentMethod?: PaymentMethod;
}
