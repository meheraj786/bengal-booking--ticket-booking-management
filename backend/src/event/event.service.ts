import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EventStatus, PaymentType, Prisma } from "@prisma/client";
import { PrismaService } from "../infrastructure/prisma.service";
import { AuthUser } from "../common/auth-user";
import { CreateEventDto, UpdateEventDto } from "./event.dto";
import { getPagination, paginated } from "../common/pagination";
import { slugify } from "../common/slugify";
import { randomUUID } from "node:crypto";

@Injectable()
export class EventService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async list(
    filters: {
      category?: string;
      division?: string;
      area?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
      minPrice?: string;
      maxPrice?: string;
      sort?: string;
      page?: string;
      limit?: string;
    } = {},
  ): Promise<unknown> {
    const { page, limit, skip } = getPagination(filters);
    const startDate = this.parseDate(filters.startDate, "startDate");
    const endDate = this.parseDate(filters.endDate, "endDate", true);
    const minPrice = this.parsePrice(filters.minPrice, "minPrice");
    const maxPrice = this.parsePrice(filters.maxPrice, "maxPrice");

    if (startDate && endDate && startDate > endDate)
      throw new BadRequestException("startDate cannot be after endDate");
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
      throw new BadRequestException("minPrice cannot be greater than maxPrice");

    const where: Prisma.EventWhereInput = {
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
        startAt: {
          gte: startDate,
          lte: endDate,
        },
        tickets:
          minPrice !== undefined || maxPrice !== undefined
            ? {
                some: {
                  status: { in: ["AVAILABLE", "LOCKED"] },
                  price: {
                    gte: minPrice,
                    lte: maxPrice,
                  },
                },
              }
            : undefined,
        OR: filters.search
          ? [
              { title: { contains: filters.search, mode: "insensitive" } },
              {
                description: { contains: filters.search, mode: "insensitive" },
              },
              { venueName: { contains: filters.search, mode: "insensitive" } },
            ]
          : undefined,
    };
    const events = await this.prisma.event.findMany({ where, include: {
        category: true,
        area: true,
        seller: { select: { id: true, name: true, image: true } },
        _count: { select: { bookings: true } },
        tickets: { select: { price: true, status: true } },
      }, orderBy: { startAt: "asc" } });
    const total = events.length;
    const sorted = [...events].sort((a, b) => {
      if (filters.sort === "popularity") {
        return b._count.bookings - a._count.bookings ||
          a.startAt.getTime() - b.startAt.getTime();
      }
      if (filters.sort === "price-low") {
        return this.lowestTicketPrice(a.tickets) - this.lowestTicketPrice(b.tickets);
      }
      return a.startAt.getTime() - b.startAt.getTime();
    });
    const data = sorted.slice(skip, skip + limit).map(({ tickets: _tickets, ...event }) => event);
    return paginated(data, total, page, limit);
  }

  private lowestTicketPrice(tickets: Array<{ price: Prisma.Decimal; status: string }>) {
    const available = tickets
      .filter((ticket) => ticket.status === "AVAILABLE" || ticket.status === "LOCKED")
      .map((ticket) => Number(ticket.price));
    return available.length ? Math.min(...available) : Number.POSITIVE_INFINITY;
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

  private parsePrice(value: string | undefined, name: string) {
    if (value === undefined) return undefined;
    const price = Number(value);
    if (!Number.isFinite(price) || price < 0)
      throw new BadRequestException(`${name} must be a non-negative number`);
    return price;
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
        tickets: {
          select: { id: true, name: true, description: true, price: true, status: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!event) throw new NotFoundException("Event not found");
    return event;
  }

  async getBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        category: true,
        area: true,
        seller: { select: { id: true, name: true, image: true } },
        _count: { select: { tickets: true, bookings: true } },
        tickets: {
          select: { id: true, name: true, description: true, price: true, status: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!event) throw new NotFoundException("Event not found");
    return event;
  }

  async getSellerEvent(id: string, user: AuthUser) {
    const event = await this.get(id);
    if (user.role !== "SUPER_ADMIN" && event.sellerId !== user.id)
      throw new ForbiddenException("You do not own this event");
    return event;
  }

  create(dto: CreateEventDto, user: AuthUser) {
    return this.prisma.event.create({
      data: {
        ...dto,
        slug: `${slugify(dto.title)}-${randomUUID().slice(0, 8)}`,
        sellerId: user.id,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        lastDateAndTimeOfCancel: new Date(dto.lastDateAndTimeOfCancel),
        lastDateOfBooking: new Date(dto.lastDateOfBooking),
        paymentType: dto.paymentType as PaymentType,
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
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined,
        lastDateAndTimeOfCancel: dto.lastDateAndTimeOfCancel
          ? new Date(dto.lastDateAndTimeOfCancel)
          : undefined,
        lastDateOfBooking: dto.lastDateOfBooking
          ? new Date(dto.lastDateOfBooking)
          : undefined,
        paymentType: dto.paymentType as PaymentType | undefined,
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
    if (ticketCount < 1)
      throw new BadRequestException(
        "An event must have at least one active ticket",
      );
    return this.prisma.event.update({
      where: { id },
      data: { status: EventStatus.PUBLISHED },
    });
  }

  async getSellerEvents(user: AuthUser, query: { page?: string; limit?: string } = {}) {
    const { page, limit, skip } = getPagination(query);
    const where = user.role === "SUPER_ADMIN" ? {} : { sellerId: user.id };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.event.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
        area: true,
        _count: { select: { tickets: true, bookings: true } },
        tickets: {
          select: { id: true, name: true, description: true, price: true, status: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      }),
      this.prisma.event.count({ where }),
    ]);
    return paginated(data, total, page, limit);
  }

  private async owned(id: string, user: AuthUser) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException("Event not found");
    if (user.role !== "SUPER_ADMIN" && event.sellerId !== user.id)
      throw new ForbiddenException("You do not own this event");
    return event;
  }
}
