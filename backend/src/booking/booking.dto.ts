import { IsEnum, IsInt, IsString, IsUUID, Max, Min } from "class-validator";
import { BookingStatus } from "@prisma/client";
export class CreateBookingDto {
  @IsUUID() eventId!: string;
  @IsInt() @Min(1) @Max(100) quantity!: number;
  @IsString() buyerName!: string;
  @IsString() buyerAddress!: string;
  @IsString() buyerPhone!: string;
}

export class ConfirmBookingDto {}

export class CheckoutDto {
  @IsUUID() bookingId!: string;
}

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  status!: BookingStatus;
}
