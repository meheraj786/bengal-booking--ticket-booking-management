import { Controller, Get, Inject, Param, Query, UseGuards } from "@nestjs/common";
import { PrismaService } from "../infrastructure/prisma.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";
import { Role } from "@prisma/client";
import { getPagination, paginated } from "../common/pagination";
@Controller("payments")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class PaymentController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  @Get() async list(@Query("page") page?: string, @Query("limit") limit?: string) {
    const { page: currentPage, limit: pageSize, skip } = getPagination({ page, limit });
    const [data, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
      skip, take: pageSize,
      include: { booking: true },
      orderBy: { createdAt: "desc" },
      }),
      this.prisma.payment.count(),
    ]);
    return paginated(data, total, currentPage, pageSize);
  }
  @Get(":id") get(@Param("id") id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { booking: true },
    });
  }
}
