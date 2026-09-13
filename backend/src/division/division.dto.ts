import { IsString, MinLength, IsOptional } from "class-validator";

export class DivisionDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateDivisionDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
