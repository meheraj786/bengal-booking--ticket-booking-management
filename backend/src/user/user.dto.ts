import { IsEnum } from "class-validator";
import { Role, UserStatus } from "@prisma/client";

export class UpdateRoleDto {
  @IsEnum(Role) role!: Role;
}

export class UpdateStatusDto {
  @IsEnum(UserStatus) status!: UserStatus;
}
