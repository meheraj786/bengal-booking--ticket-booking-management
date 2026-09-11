import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../infrastructure/prisma.service";
import { AreaDto } from "./area.dto";
@Injectable()
export class AreaService {
  constructor(private readonly prisma: PrismaService) {}
  list() {
    return this.prisma.area.findMany({
      include: { _count: { select: { events: true } } },
      orderBy: { name: "asc" },
    });
  }
  create(dto: AreaDto) {
    return this.prisma.area.create({ data: dto });
  }
  async update(id: string, dto: AreaDto) {
    await this.ensure(id);
    return this.prisma.area.update({ where: { id }, data: dto });
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
