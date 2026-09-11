import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../infrastructure/prisma.service";
import { CategoryDto } from "./category.dto";
@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  list() {
    return this.prisma.category.findMany({
      include: { _count: { select: { events: true } } },
      orderBy: { name: "asc" },
    });
  }
  create(dto: CategoryDto) {
    return this.prisma.category.create({ data: dto });
  }
  async update(id: string, dto: CategoryDto) {
    await this.ensure(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }
  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.category.delete({ where: { id } });
  }
  private async ensure(id: string) {
    const item = await this.prisma.category.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Category not found");
    return item;
  }
}
