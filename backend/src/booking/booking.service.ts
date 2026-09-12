import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { BookingStatus, Prisma, TicketStatus } from "@prisma/client";
import { PrismaService } from "../infrastructure/prisma.service";
import { RedisService } from "../infrastructure/redis.service";
import { AuthUser } from "../common/auth-user";

@Injectable()
export class BookingService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(RedisService) private readonly redis: RedisService,
  ) {}

  async createBooking(eventId: string, userId: string, quantity: number) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event || event.status !== "PUBLISHED")
      throw new NotFoundException("Published event not found");
    if (quantity < 1 || quantity > event.maxTicketsPerBooking)
      throw new BadRequestException("Invalid quantity");

    const availableTickets = event.totalTickets - event.soldTickets;
    if (quantity > availableTickets)
      throw new BadRequestException("Not enough tickets available");

    const candidates = await this.prisma.ticket.findMany({
      where: { eventId, status: TicketStatus.AVAILABLE },
      orderBy: { ticketNumber: "asc" },
      take: quantity,
    });
    if (candidates.length !== quantity)
      throw new BadRequestException("Tickets are no longer available");

    const bookingId = crypto.randomUUID();
    const acquired: string[] = [];
    try {
      for (const ticket of candidates) {
        if (!(await this.redis.acquireTicket(ticket.id, bookingId)))
          throw new BadRequestException("Tickets are currently being booked");
        acquired.push(ticket.id);
      }
      const expiresAt = new Date(Date.now() + this.redis.lockSeconds * 1000);
      const booking = await this.prisma.$transaction(async (tx) => {
        const locked = await tx.ticket.updateMany({
          where: { id: { in: acquired }, status: TicketStatus.AVAILABLE },
          data: { status: TicketStatus.LOCKED, bookingId },
        });
        if (locked.count !== acquired.length)
          throw new BadRequestException("Ticket availability changed");
        return tx.booking.create({
          data: {
            id: bookingId,
            userId,
            eventId,
            quantity,
            totalAmount: new Prisma.Decimal(event.price.toString()).mul(
              quantity,
            ),
            expiresAt,
          },
        });
      });
      return { bookingId: booking.id, expiresAt, ticketIds: acquired };
    } catch (error) {
      await Promise.all(
        acquired.map((ticketId) =>
          this.redis.releaseTicket(ticketId, bookingId),
        ),
      );
      throw error;
    }
  }

  async confirm(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tickets: true, event: true },
    });
    if (!booking || booking.userId !== userId)
      throw new NotFoundException("Booking not found");

    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException("Booking cannot be confirmed");

    if (!booking.expiresAt || booking.expiresAt <= new Date())
      throw new BadRequestException("Booking has expired");

    await this.prisma.$transaction(async (tx) => {
      await tx.ticket.updateMany({
        where: { bookingId, status: TicketStatus.LOCKED },
        data: { status: TicketStatus.SOLD },
      });
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CONFIRMED },
      });
      await tx.event.update({
        where: { id: booking.eventId },
        data: { soldTickets: { increment: booking.quantity } },
      });
    });
    await Promise.all(
      booking.tickets.map((ticket) =>
        this.redis.releaseTicket(ticket.id, bookingId),
      ),
    );
    return this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tickets: true, payment: true },
    });
  }

  async expire(bookingId: string, user: AuthUser) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tickets: true, event: true },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException("Only pending bookings can be expired");

    if (user.role === "USER" && booking.userId !== user.id)
      throw new ForbiddenException("Cannot expire booking");

    if (user.role === "SELLER" && booking.event.sellerId !== user.id)
      throw new ForbiddenException("Cannot expire booking");

    await this.prisma.$transaction(async (tx) => {
      await tx.ticket.updateMany({
        where: { bookingId, status: TicketStatus.LOCKED },
        data: { status: TicketStatus.AVAILABLE, bookingId: null },
      });
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.EXPIRED },
      });
    });
    await Promise.all(
      booking.tickets.map((ticket) =>
        this.redis.releaseTicket(ticket.id, bookingId),
      ),
    );
    return this.prisma.booking.findUnique({ where: { id: bookingId } });
  }

  listForUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { event: true, tickets: true, payment: true },
      orderBy: { createdAt: "desc" },
    });
  }

  listAll() {
    return this.prisma.booking.findMany({
      include: { event: true, tickets: true, payment: true, user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getForUser(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
      include: { event: true, tickets: true, payment: true },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    return booking;
  }

  async getById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { event: true, tickets: true, payment: true, user: true },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    return booking;
  }

  async listForEvent(eventId: string) {
    return this.prisma.booking.findMany({
      where: { eventId },
      include: { user: true, tickets: true, payment: true },
      orderBy: { createdAt: "desc" },
    });
  }
  async listByEvent(eventId: string, user: AuthUser) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { sellerId: true },
    });
    if (!event) throw new NotFoundException("Event not found");
    if (user.role !== "SUPER_ADMIN" && event.sellerId !== user.id)
      throw new ForbiddenException("You cannot view these bookings");

    return this.prisma.booking.findMany({
      where: { eventId },
      include: { user: true, tickets: true, payment: true },
      orderBy: { createdAt: "desc" },
    });
  }
  async checkout(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId, status: "PENDING" },
      include: { event: true, tickets: true },
    });
    if (!booking) throw new NotFoundException("Booking not found");

    if (booking.event.price.equals(0)) {
      return this.confirm(bookingId, userId);
    }

    return {
      bookingId: booking.id,
      amount: booking.totalAmount,
      eventTitle: booking.event.title,
      ticketCount: booking.quantity,
    };
  }
}
