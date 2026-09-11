import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Role, UserStatus } from "@prisma/client";
import { PrismaService } from "../infrastructure/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.user.findMany({
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
    });
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