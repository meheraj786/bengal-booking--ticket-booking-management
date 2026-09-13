import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { TicketStatus } from "@prisma/client";
import { PrismaService } from "../infrastructure/prisma.service";
import { AuthUser } from "../common/auth-user";
import { CreateTicketDto, UpdateTicketDto } from "./ticket.dto";
import { getPagination, paginated } from "../common/pagination";

@Injectable()
export class TicketService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async list(eventId: string, query: { page?: string; limit?: string } = {}) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException("Event not found");

    const { page, limit, skip } = getPagination(query);
    const where = { eventId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.ticket.findMany({
      where: { eventId },
      skip, take: limit,
      select: {
        id: true,
        status: true,
        note: true,
        createdAt: true,
      },
      orderBy: { id: "asc" },
      }),
      this.prisma.ticket.count({ where }),
    ]);
    return paginated(data, total, page, limit);
  }

  async create(eventId: string, dto: CreateTicketDto, user: AuthUser) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException("Event not found");
    if (user.role !== "SUPER_ADMIN" && event.sellerId !== user.id)
      throw new ForbiddenException("You do not own this event");

    return this.prisma.$transaction(async (tx) => {
      await tx.ticket.createMany({
        data: Array.from({ length: dto.quantity }, (_, index) => ({
          eventId,
          status: TicketStatus.AVAILABLE,
          note: dto.note,
        })),
      });

      return tx.ticket.findMany({
        where: { eventId },
        orderBy: { createdAt: "desc" },
        take: dto.quantity,
      });
    });
  }

  async update(id: string, dto: UpdateTicketDto, user: AuthUser) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!ticket) throw new NotFoundException("Ticket not found");
    if (user.role !== "SUPER_ADMIN" && ticket.event.sellerId !== user.id)
      throw new ForbiddenException("You do not own this ticket");
    if (
      ticket.status === TicketStatus.SOLD ||
      ticket.status === TicketStatus.LOCKED
    )
      throw new ForbiddenException("Booked tickets cannot be edited");

    if (dto.status === TicketStatus.LOCKED || dto.status === TicketStatus.SOLD)
      throw new BadRequestException(
        "Cannot manually set ticket to LOCKED or SOLD status",
      );

    return this.prisma.ticket.update({
      where: { id },
      data: {
        status: dto.status ?? ticket.status,
        note: dto.note ?? ticket.note,
      },
    });
  }
}
