import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../infrastructure/prisma.service";
import { AuthUser } from "../common/auth-user";
import { getPagination, paginated } from "../common/pagination";

@Injectable()
export class PaymentService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async list(user: AuthUser, sellerId?: string, query: { page?: string; limit?: string } = {}) {
    const effectiveSeller = user.role === "SELLER" ? user.id : sellerId;
    const where = effectiveSeller ? { booking: { event: { sellerId: effectiveSeller } } } : {};
    const { page, limit, skip } = getPagination(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where, skip, take: limit, include: { booking: { include: { event: true, user: true } } },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.payment.count({ where }),
    ]);
    return paginated(data, total, page, limit);
  }

  async get(id: string, user: AuthUser) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { booking: { include: { event: true, user: true } } },
    });
    if (!payment) throw new NotFoundException("Payment not found");
    if (user.role === "SELLER" && payment.booking.event.sellerId !== user.id)
      throw new ForbiddenException("You cannot view this payment");
    return payment;
  }
}
