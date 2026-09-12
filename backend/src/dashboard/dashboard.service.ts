import { Inject, Injectable } from "@nestjs/common";
import { BookingStatus, EventStatus, Role } from "@prisma/client";
import { PrismaService } from "../infrastructure/prisma.service";

@Injectable()
export class DashboardService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  async user(userId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: { event: true, tickets: true, payment: true },
      orderBy: { createdAt: "desc" },
    });
    return { bookings, wishlist: [] };
  }
  async seller(sellerId?: string) {
    const events = await this.prisma.event.findMany({
      where: sellerId ? { sellerId } : undefined,
      include: { bookings: true },
      orderBy: { startAt: "asc" },
    });
    const bookings = events.flatMap((event) => event.bookings);
    return {
      events,
      stats: {
        publishedEvents: events.filter(
          (event) => event.status === EventStatus.PUBLISHED,
        ).length,
        ticketsSold: events.reduce(
          (total, event) => total + event.soldTickets,
          0,
        ),
        grossRevenue: bookings
          .filter((booking) => booking.status === BookingStatus.CONFIRMED)
          .reduce((total, booking) => total + Number(booking.totalAmount), 0),
      },
    };
  }
  async admin() {
    const [events, bookings, sellers, users] = await Promise.all([
      this.prisma.event.findMany({
        include: { seller: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.booking.findMany({
        where: { status: BookingStatus.CONFIRMED },
      }),
      this.prisma.user.count({ where: { role: Role.SELLER } }),
      this.prisma.user.count(),
    ]);
    return {
      events,
      stats: {
        bookings: bookings.length,
        grossRevenue: bookings.reduce(
          (total, booking) => total + Number(booking.totalAmount),
          0,
        ),
        sellers,
        users,
      },
    };
  }
}
