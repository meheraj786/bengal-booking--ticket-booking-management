import { TicketStatus } from "@prisma/client";
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateTicketDto {
  @IsInt() @Min(1) quantity!: number;
  @IsString() name!: string;
  @IsString() description!: string;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price!: number;
}

export class UpdateTicketDto {
  @IsOptional() @IsEnum(TicketStatus) status?: TicketStatus;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price?: number;
}
