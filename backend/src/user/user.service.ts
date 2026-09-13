import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Role, UserStatus } from "@prisma/client";
import { PrismaService } from "../infrastructure/prisma.service";
import { getPagination, paginated } from "../common/pagination";

@Injectable()
export class UserService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async list(query: { page?: string; limit?: string } = {}) {
    const { page, limit, skip } = getPagination(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
      skip, take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        status: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count(),
    ]);
    return paginated(data, total, page, limit);
  }

  async get(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        status: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async updateRole(id: string, role: Role) {
    const user = await this.ensure(id);

    if (user.role === Role.SUPER_ADMIN && role !== Role.SUPER_ADMIN) {
      const adminCount = await this.prisma.user.count({
        where: { role: Role.SUPER_ADMIN },
      });
      if (adminCount === 1) {
        throw new BadRequestException(
          "Cannot demote the last super admin. Create another super admin first.",
        );
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
  }

  async updateStatus(id: string, status: UserStatus) {
    await this.ensure(id);
    return this.prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });
  }

  private async ensure(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
