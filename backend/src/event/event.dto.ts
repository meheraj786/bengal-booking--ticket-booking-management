import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

export class CreateEventDto {
  @IsUUID() categoryId!: string;
  @IsUUID() areaId!: string;
  @IsString() title!: string;
  @IsString() description!: string;
  @IsString() venueName!: string;
  @IsString() venueAddress!: string;
  @IsDateString() startAt!: string;
  @IsDateString() endAt!: string;
  @IsInt() @Min(0) totalTickets!: number;
  @IsInt() @Min(1) maxTicketsPerBooking!: number;
  @IsNumber() @Min(0) price!: number;
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
  @IsOptional() @IsInt() @Min(0) totalTickets?: number;
  @IsOptional() @IsInt() @Min(1) maxTicketsPerBooking?: number;
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() status?:
    | "DRAFT"
    | "PUBLISHED"
    | "CANCELLED"
    | "COMPLETED";
}
