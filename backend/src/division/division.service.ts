import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../infrastructure/prisma.service";
import { DivisionDto, UpdateDivisionDto } from "./division.dto";
import { getPagination, paginated } from "../common/pagination";
import { slugify } from "../common/slugify";

@Injectable()
export class DivisionService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async list(query: { page?: string; limit?: string } = {}) {
    const { page, limit, skip } = getPagination(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.division.findMany({
      skip, take: limit,
      include: {
        areas: {
          include: { division: true },
        },
        _count: { select: { areas: true } },
      },
      orderBy: { name: "asc" },
      }),
      this.prisma.division.count(),
    ]);
    return paginated(data, total, page, limit);
  }

  get(id: string) {
    return this.prisma.division.findUnique({
      where: { id },
      include: {
        areas: true,
      },
    });
  }

  create(dto: DivisionDto) {
    return this.prisma.division.create({
      data: { ...dto, slug: slugify(dto.name) },
      include: { areas: true },
    });
  }

  async update(id: string, dto: UpdateDivisionDto) {
    await this.ensure(id);
    return this.prisma.division.update({
      where: { id },
      data: {
        ...dto,
        slug: dto.name || dto.slug ? slugify(dto.name ?? dto.slug!) : undefined,
      },
      include: { areas: true },
    });
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.division.delete({ where: { id } });
  }

  private async ensure(id: string) {
    const item = await this.prisma.division.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Division not found");
    return item;
  }
}
