import { TicketStatus } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateTicketDto {
  @IsInt() @Min(1) quantity!: number;
  @IsOptional() @IsString() note?: string;
}

export class UpdateTicketDto {
  @IsOptional() @IsEnum(TicketStatus) status?: TicketStatus;
  @IsOptional() @IsString() note?: string;
}
