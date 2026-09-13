import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { BookingStatus } from "@prisma/client";
export class CreateBookingDto {
  @IsUUID() eventId!: string;
  @IsInt() @Min(1) @Max(100) quantity!: number;
  @IsString() ticketName!: string;
  @IsString() buyerName!: string;
  @IsString() buyerAddress!: string;
  @IsString() buyerPhone!: string;
  ticketSelections?: { ticketName: string; quantity: number }[];
}

export class ConfirmBookingDto {}

export class CheckoutDto {
  @IsOptional() @IsUUID() bookingId?: string;
  @IsOptional() @IsUUID() eventId?: string;
  @IsOptional() @IsInt() @Min(1) @Max(100) quantity?: number;
  @IsOptional() @IsString() ticketName?: string;
  @IsOptional() @IsString() buyerName?: string;
  @IsOptional() @IsString() buyerAddress?: string;
  @IsOptional() @IsString() buyerPhone?: string;
  ticketSelections?: { ticketName: string; quantity: number }[];
}

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  status!: BookingStatus;
}
