import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";
import { PaymentType } from "@prisma/client";

export class CreateEventDto {
  @IsUUID() categoryId!: string;
  @IsUUID() areaId!: string;
  @IsString() title!: string;
  @IsString() description!: string;
  @IsString() venueName!: string;
  @IsString() venueAddress!: string;
  @IsDateString() startAt!: string;
  @IsDateString() endAt!: string;
  @IsInt() @Min(1) maxTicketsPerBooking!: number;
  @IsDateString() lastDateAndTimeOfCancel!: string;
  @IsDateString() lastDateOfBooking!: string;
  @IsEnum(PaymentType) paymentType!: PaymentType;
  @IsOptional() @IsString() coverImage?: string;
}

export class UpdateEventDto {
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsUUID() areaId?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() venueName?: string;
  @IsOptional() @IsString() venueAddress?: string;
  @IsOptional() @IsDateString() startAt?: string;
  @IsOptional() @IsDateString() endAt?: string;
  @IsOptional() @IsInt() @Min(1) maxTicketsPerBooking?: number;
  @IsOptional() @IsDateString() lastDateAndTimeOfCancel?: string;
  @IsOptional() @IsDateString() lastDateOfBooking?: string;
  @IsOptional() @IsEnum(PaymentType) paymentType?: PaymentType;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() status?:
    | "DRAFT"
    | "PUBLISHED"
    | "CANCELLED"
    | "COMPLETED";
}
