import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser, CurrentUser } from "../common/auth-user";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { CreateTicketDto, UpdateTicketDto } from "./ticket.dto";
import { TicketService } from "./ticket.service";

@Controller("events/:eventId/tickets")
export class TicketController {
  constructor(private readonly service: TicketService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.SUPER_ADMIN)
  list(@Param("eventId") eventId: string, @CurrentUser() user: AuthUser) {
    return this.service.list(eventId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.SUPER_ADMIN)
  create(
    @Param("eventId") eventId: string,
    @Body() dto: CreateTicketDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.create(eventId, dto, user);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.SUPER_ADMIN)
  update(
    @Param("id") id: string,
    @Body() dto: UpdateTicketDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.update(id, dto, user);
  }
}
