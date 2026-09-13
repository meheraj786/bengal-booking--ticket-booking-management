import { IsInt, IsString, IsUUID, Max, Min } from "class-validator";
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
