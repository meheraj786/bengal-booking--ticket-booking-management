import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { PrismaService } from "../infrastructure/prisma.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";
import { Role } from "@prisma/client";
@Controller("payments")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class PaymentController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() list() {
    return this.prisma.payment.findMany({
      include: { booking: true },
      orderBy: { createdAt: "desc" },
    });
  }
  @Get(":id") get(@Param("id") id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { booking: true },
    });
  }
}
