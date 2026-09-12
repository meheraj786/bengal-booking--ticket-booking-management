import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EventStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../infrastructure/prisma.service";
import { AuthUser } from "../common/auth-user";
import { CreateEventDto, UpdateEventDto } from "./event.dto";

@Injectable()
export class EventService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  list(
    filters: {
      category?: string;
      division?: string;
      area?: string;
      search?: string;
      minPrice?: string;
      maxPrice?: string;
      startDate?: string;
      endDate?: string;
    } = {},
  ) {
    const minPrice = this.parsePrice(filters.minPrice, "minPrice");
    const maxPrice = this.parsePrice(filters.maxPrice, "maxPrice");
    const startDate = this.parseDate(filters.startDate, "startDate");
    const endDate = this.parseDate(filters.endDate, "endDate", true);

    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
      throw new BadRequestException("minPrice cannot be greater than maxPrice");
    if (startDate && endDate && startDate > endDate)
      throw new BadRequestException("startDate cannot be after endDate");

    return this.prisma.event.findMany({
      where: {
        status: EventStatus.PUBLISHED,
        category: filters.category ? { slug: filters.category } : undefined,
        area:
          filters.area || filters.division
            ? {
                slug: filters.area,
                division: filters.division
                  ? { slug: filters.division }
                  : undefined,
              }
            : undefined,
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
        startAt: {
          gte: startDate,
          lte: endDate,
        },
        OR: filters.search
          ? [
              { title: { contains: filters.search, mode: "insensitive" } },
              {
                description: { contains: filters.search, mode: "insensitive" },
              },
              { venueName: { contains: filters.search, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: {
        category: true,
        area: true,
        seller: { select: { id: true, name: true, image: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { startAt: "asc" },
    });
  }

  private parsePrice(value: string | undefined, name: string) {
    if (value === undefined) return undefined;
    const price = Number(value);
    if (!Number.isFinite(price) || price < 0)
      throw new BadRequestException(`${name} must be a non-negative number`);
    return price;
  }

  private parseDate(value: string | undefined, name: string, endOfDay = false) {
    if (value === undefined) return undefined;
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
      throw new BadRequestException(`${name} must be a valid date`);
    if (endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(value))
      date.setUTCHours(23, 59, 59, 999);
    return date;
  }

  categories() {
    return this.prisma.category.findMany({ orderBy: { name: "asc" } });
  }

  areas() {
    return this.prisma.area.findMany({ orderBy: { name: "asc" } });
  }

  async get(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        area: true,
        seller: { select: { id: true, name: true, image: true } },
        _count: { select: { tickets: true, bookings: true } },
      },
    });
    if (!event) throw new NotFoundException("Event not found");
    return event;
  }

  create(dto: CreateEventDto, user: AuthUser) {
    return this.prisma.event.create({
      data: {
        ...dto,
        sellerId: user.id,
        price: new Prisma.Decimal(dto.price),
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        status: EventStatus.DRAFT,
      },
      include: {
        category: true,
        area: true,
        seller: { select: { id: true, name: true, image: true } },
      },
    });
  }

  async update(id: string, dto: UpdateEventDto, user: AuthUser) {
    const event = await this.owned(id, user);
    if (
      event.status === EventStatus.PUBLISHED &&
      dto.status === EventStatus.DRAFT
    ) {
      throw new BadRequestException(
        "Published events cannot be reverted to draft",
      );
    }
    return this.prisma.event.update({
      where: { id: event.id },
      data: {
        ...dto,
        price:
          dto.price === undefined ? undefined : new Prisma.Decimal(dto.price),
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined,
      },
      include: {
        category: true,
        area: true,
        seller: { select: { id: true, name: true, image: true } },
      },
    });
  }

  async remove(id: string, user: AuthUser) {
    await this.owned(id, user);
    return this.prisma.event.update({
      where: { id },
      data: { status: EventStatus.CANCELLED },
    });
  }

  async publish(id: string, user: AuthUser) {
    const event = await this.owned(id, user);
    if (event.status !== EventStatus.DRAFT)
      throw new BadRequestException("Only draft events can be published");

    const ticketCount = await this.prisma.ticket.count({
      where: { eventId: id, status: { not: "CANCELLED" } },
    });
    if (event.totalTickets < 1 || ticketCount < 1)
      throw new BadRequestException(
        "An event must have at least one active ticket",
      );
    return this.prisma.event.update({
      where: { id },
      data: { status: EventStatus.PUBLISHED },
    });
  }

  async getSellerEvents(sellerId: string) {
    return this.prisma.event.findMany({
      where: { sellerId },
      include: {
        category: true,
        area: true,
        _count: { select: { tickets: true, bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  private async owned(id: string, user: AuthUser) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException("Event not found");
    if (user.role !== "SUPER_ADMIN" && event.sellerId !== user.id)
      throw new ForbiddenException("You do not own this event");
    return event;
  }
}
