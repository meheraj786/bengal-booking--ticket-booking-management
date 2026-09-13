import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  Query,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { BookingService } from "./booking.service";
import {
  CheckoutDto,
  ConfirmBookingDto,
  CreateBookingDto,
} from "./booking.dto";
import { AuthUser, CurrentUser } from "../common/auth-user";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";

@Controller("bookings")
export class BookingController {
  constructor(
    @Inject(BookingService) private readonly bookings: BookingService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  list(
    @CurrentUser() user: AuthUser,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    if (user.role === Role.SUPER_ADMIN) {
      return this.bookings.listAll({ page, limit });
    }
    return this.bookings.listForUser(user.id, { page, limit });
  }

  @Get("event/:eventId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.SUPER_ADMIN)
  listByEvent(
    @Param("eventId") eventId: string,
    @CurrentUser() user: AuthUser,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.bookings.listByEvent(eventId, user, { page, limit });
  }

  @Get(":bookingId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  get(@Param("bookingId") id: string, @CurrentUser() user: AuthUser) {
    return this.bookings.getForUser(id, user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  create(@Body() dto: CreateBookingDto, @CurrentUser() user: AuthUser) {
    return this.bookings.createBooking(dto.eventId, user.id, dto.quantity, {
      buyerName: dto.buyerName,
      buyerAddress: dto.buyerAddress,
      buyerPhone: dto.buyerPhone,
    });
  }

  @Post(":bookingId/confirm")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  confirm(
    @Param("bookingId") bookingId: string,
    @Body() _dto: ConfirmBookingDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.bookings.confirm(bookingId, user.id);
  }

  @Post(":bookingId/expire")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SELLER, Role.SUPER_ADMIN)
  expire(@Param("bookingId") bookingId: string, @CurrentUser() user: AuthUser) {
    return this.bookings.expire(bookingId, user);
  }

  @Post("checkout")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  checkout(@Body() dto: CheckoutDto, @CurrentUser() user: AuthUser) {
    return this.bookings.checkout(dto.bookingId, user.id);
  }
}
