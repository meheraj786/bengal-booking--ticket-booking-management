import { Controller, Get, Inject, Param, Query, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";
import { Role } from "@prisma/client";
import { AuthUser, CurrentUser } from "../common/auth-user";
@Controller("payments")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SELLER, Role.SUPER_ADMIN)
export class PaymentController {
  constructor(@Inject(PaymentService) private readonly service: PaymentService) {}
  @Get() list(
    @CurrentUser() user: AuthUser,
    @Query("sellerId") sellerId?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.service.list(user, sellerId, { page, limit });
  }
  @Get(":id") get(@Param("id") id: string, @CurrentUser() user: AuthUser) {
    return this.service.get(id, user);
  }
}
