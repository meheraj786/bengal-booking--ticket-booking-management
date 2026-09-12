import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../infrastructure/prisma.service";
import { DivisionDto, UpdateDivisionDto } from "./division.dto";

@Injectable()
export class DivisionService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.division.findMany({
      include: {
        areas: {
          include: { division: true },
        },
        _count: { select: { areas: true } },
      },
      orderBy: { name: "asc" },
    });
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
      data: dto,
      include: { areas: true },
    });
  }

  async update(id: string, dto: UpdateDivisionDto) {
    await this.ensure(id);
    return this.prisma.division.update({
      where: { id },
      data: dto,
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
