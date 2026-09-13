import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../infrastructure/prisma.service";
import { AreaDto, UpdateAreaDto } from "./area.dto";
import { getPagination, paginated } from "../common/pagination";

@Injectable()
export class AreaService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async list(query: { page?: string; limit?: string } = {}) {
    const { page, limit, skip } = getPagination(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.area.findMany({
      skip, take: limit,
      include: {
        division: true,
        _count: { select: { events: true } },
      },
      orderBy: { name: "asc" },
      }),
      this.prisma.area.count(),
    ]);
    return paginated(data, total, page, limit);
  }

  async listByDivision(divisionId: string, query: { page?: string; limit?: string } = {}) {
    const { page, limit, skip } = getPagination(query);
    const where = { divisionId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.area.findMany({
      where: { divisionId },
      skip, take: limit,
      include: {
        division: true,
        _count: { select: { events: true } },
      },
      orderBy: { name: "asc" },
      }),
      this.prisma.area.count({ where }),
    ]);
    return paginated(data, total, page, limit);
  }

  create(dto: AreaDto) {
    return this.prisma.area.create({
      data: dto,
      include: { division: true },
    });
  }

  async update(id: string, dto: UpdateAreaDto) {
    await this.ensure(id);
    return this.prisma.area.update({
      where: { id },
      data: dto,
      include: { division: true },
    });
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.area.delete({ where: { id } });
  }

  private async ensure(id: string) {
    const item = await this.prisma.area.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Area not found");
    return item;
  }
}
