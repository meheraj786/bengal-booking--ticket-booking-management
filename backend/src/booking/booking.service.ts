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
import { getPagination, paginated } from "../common/pagination";

@Injectable()
export class BookingService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(RedisService) private readonly redis: RedisService,
  ) {}

  async createBooking(
    eventId: string,
    userId: string,
    quantity: number,
    buyer: { buyerName: string; buyerAddress: string; buyerPhone: string; ticketName: string; ticketSelections?: { ticketName: string; quantity: number }[] },
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event || event.status !== "PUBLISHED")
      throw new NotFoundException("Published event not found");
    if (quantity < 1 || quantity > event.maxTicketsPerBooking)
      throw new BadRequestException("Invalid quantity");

    const selections = buyer.ticketSelections?.length
      ? buyer.ticketSelections
      : [{ ticketName: buyer.ticketName, quantity }];
    const selectedQuantity = selections.reduce((sum, item) => sum + item.quantity, 0);
    if (selectedQuantity !== quantity)
      throw new BadRequestException("Invalid ticket selection");
    const candidates: Array<{ id: string; price: Prisma.Decimal }> = [];
    for (const selection of selections) {
      const tickets = await this.prisma.ticket.findMany({
        where: { eventId, status: TicketStatus.AVAILABLE, name: selection.ticketName },
        orderBy: { id: "asc" },
        take: selection.quantity,
      });
      candidates.push(...tickets);
    }
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
        const createdBooking = await tx.booking.create({
          data: {
            id: bookingId,
            userId,
            eventId,
            quantity,
            totalAmount: candidates.reduce(
              (total, ticket) => total.add(ticket.price),
              new Prisma.Decimal(0),
            ),
            buyerName: buyer.buyerName,
            buyerAddress: buyer.buyerAddress,
            buyerPhone: buyer.buyerPhone,
            expiresAt,
          },
        });
        const locked = await tx.ticket.updateMany({
          where: { id: { in: acquired }, status: TicketStatus.AVAILABLE },
          data: { status: TicketStatus.LOCKED, bookingId },
        });
        if (locked.count !== acquired.length)
          throw new BadRequestException("Ticket availability changed");
        return createdBooking;
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
      const isOnArrival = booking.event.paymentType === "OnArrival";
      await tx.payment.upsert({
        where: { bookingId },
        create: {
          bookingId,
          amount: booking.totalAmount,
          provider: isOnArrival
            ? "on_arrival"
            : booking.totalAmount.equals(0)
              ? "free"
              : "dummy",
          status: isOnArrival ? "PENDING" : "SUCCESS",
          paidAt: isOnArrival ? null : new Date(),
        },
        update: {
          status: isOnArrival ? "PENDING" : "SUCCESS",
          paidAt: isOnArrival ? null : new Date(),
        },
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

  async completeBooking(
    eventId: string,
    userId: string,
    quantity: number,
    buyer: { buyerName: string; buyerAddress: string; buyerPhone: string; ticketName: string; ticketSelections?: { ticketName: string; quantity: number }[] },
  ) {
    const pending = await this.createBooking(eventId, userId, quantity, buyer);
    return this.confirm(pending.bookingId, userId);
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

  async listForUser(userId: string, query: { page?: string; limit?: string } = {}) {
    const { page, limit, skip } = getPagination(query);
    const where = { userId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
      where: { userId },
      skip, take: limit,
      include: { event: true, tickets: true, payment: true },
      orderBy: { createdAt: "desc" },
      }),
      this.prisma.booking.count({ where }),
    ]);
    return paginated(data, total, page, limit);
  }

  async listForSeller(sellerId: string, query: { page?: string; limit?: string } = {}) {
    const { page, limit, skip } = getPagination(query);
    const where = { event: { sellerId } };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where, skip, take: limit,
        include: { event: true, tickets: true, payment: true, user: true },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.booking.count({ where }),
    ]);
    return paginated(data, total, page, limit);
  }

  async listAll(query: { page?: string; limit?: string } = {}) {
    const { page, limit, skip } = getPagination(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
      skip, take: limit,
      include: { event: true, tickets: true, payment: true, user: true },
      orderBy: { createdAt: "desc" },
      }),
      this.prisma.booking.count(),
    ]);
    return paginated(data, total, page, limit);
  }

  async getForUser(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
      include: {
        event: {
          include: {
            seller: { select: { id: true, name: true, image: true } },
          },
        },
        tickets: true,
        payment: true,
      },
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

  async listForEvent(eventId: string, query: { page?: string; limit?: string } = {}) {
    const { page, limit, skip } = getPagination(query);
    const where = { eventId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: { user: true, tickets: true, payment: true },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.booking.count({ where }),
    ]);
    return paginated(data, total, page, limit);
  }
  async listByEvent(eventId: string, user: AuthUser, query: { page?: string; limit?: string } = {}) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { sellerId: true },
    });
    if (!event) throw new NotFoundException("Event not found");
    if (user.role !== "SUPER_ADMIN" && event.sellerId !== user.id)
      throw new ForbiddenException("You cannot view these bookings");

    const { page, limit, skip } = getPagination(query);
    const where = { eventId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
      where, skip, take: limit,
      include: { user: true, tickets: true, payment: true },
      orderBy: { createdAt: "desc" },
      }),
      this.prisma.booking.count({ where }),
    ]);
    return paginated(data, total, page, limit);
  }

  async updateStatus(id: string, status: BookingStatus, user: AuthUser) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { event: true, tickets: true },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    if (user.role !== "SUPER_ADMIN" && booking.event.sellerId !== user.id)
      throw new ForbiddenException("You cannot update this booking");
    if (status === BookingStatus.CANCELLED) return this.cancel(id, user);
    if (status !== BookingStatus.CONFIRMED && status !== BookingStatus.EXPIRED)
      throw new BadRequestException("Unsupported booking status update");
    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException("Only pending bookings can be updated");
    await this.prisma.$transaction(async (tx) => {
      await tx.ticket.updateMany({
        where: { bookingId: id, status: TicketStatus.LOCKED },
        data: status === BookingStatus.CONFIRMED
          ? { status: TicketStatus.SOLD }
          : { status: TicketStatus.AVAILABLE, bookingId: null },
      });
      await tx.booking.update({ where: { id }, data: { status } });
    });
    if (status === BookingStatus.EXPIRED) {
      await Promise.all(booking.tickets.map((ticket) => this.redis.releaseTicket(ticket.id, id)));
    }
    return this.prisma.booking.findUnique({ where: { id }, include: { tickets: true, payment: true } });
  }

  async cancel(id: string, user: AuthUser) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { event: true, tickets: true },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    const privileged = user.role === "SUPER_ADMIN" ||
      (user.role === "SELLER" && booking.event.sellerId === user.id);
    if (user.role === "USER" && booking.userId !== user.id)
      throw new ForbiddenException("You cannot cancel this booking");
    if (user.role === "SELLER" && !privileged)
      throw new ForbiddenException("You cannot cancel this booking");
    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.CONFIRMED)
      throw new BadRequestException("Booking cannot be cancelled");
    if (!privileged && booking.event.lastDateAndTimeOfCancel &&
        new Date() > booking.event.lastDateAndTimeOfCancel)
      throw new BadRequestException("The cancellation deadline has passed");

    await this.prisma.$transaction(async (tx) => {
      await tx.ticket.updateMany({
        where: { bookingId: id },
        data: booking.status === BookingStatus.PENDING
          ? { status: TicketStatus.AVAILABLE, bookingId: null }
          : { status: TicketStatus.CANCELLED },
      });
      await tx.booking.update({ where: { id }, data: { status: BookingStatus.CANCELLED } });
    });
    if (booking.status === BookingStatus.PENDING) {
      await Promise.all(booking.tickets.map((ticket) => this.redis.releaseTicket(ticket.id, id)));
    }
    return this.prisma.booking.findUnique({ where: { id }, include: { tickets: true, payment: true } });
  }
  async checkout(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId, status: "PENDING" },
      include: { event: true, tickets: true },
    });
    if (!booking) throw new NotFoundException("Booking not found");

    if (booking.event.paymentType === "Free") {
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
