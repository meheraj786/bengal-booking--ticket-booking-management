import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../infrastructure/prisma.service";
import { CategoryDto } from "./category.dto";
import { paginated } from "../common/pagination";

interface CategoryFilters {
  limit?: string | number;
  page?: string | number;
  search?: string;
}

@Injectable()
export class CategoryService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async list(filters: CategoryFilters = {}) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 10);
    const search = filters.search?.trim();

    const categories = await this.prisma.category.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
      include: {
        _count: {
          select: { events: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const data = categories.map(({ _count, ...category }) => ({
      ...category,
      eventCount: _count.events,
    }));
    const total = await this.prisma.category.count({ where: search ? {
      name: { contains: search, mode: "insensitive" },
    } : undefined });
    return paginated(data, total, page, limit);
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
