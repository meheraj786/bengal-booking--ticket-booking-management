import { Controller, Get, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser, CurrentUser } from "../common/auth-user";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get("user") @Roles(Role.USER) user(@CurrentUser() user: AuthUser) {
    return this.dashboard.user(user.id);
  }
  @Get("seller") @Roles(Role.SELLER, Role.SUPER_ADMIN) seller(
    @CurrentUser() user: AuthUser,
  ) {
    return this.dashboard.seller(
      user.role === Role.SUPER_ADMIN ? undefined : user.id,
    );
  }
  @Get("admin") @Roles(Role.SUPER_ADMIN) admin() {
    return this.dashboard.admin();
  }
}
