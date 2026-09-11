import { IsString, MinLength } from "class-validator";
export class AreaDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() slug!: string;
}
