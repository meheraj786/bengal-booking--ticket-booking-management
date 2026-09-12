import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { CurrentUser, AuthUser } from "../common/auth-user";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { CreateEventDto, UpdateEventDto } from "./event.dto";
import { EventService } from "./event.service";

@Controller("events")
export class EventController {
  constructor(@Inject(EventService) private readonly service: EventService) {}

  @Get()
  list(
    @Query("category") category?: string,
    @Query("division") division?: string,
    @Query("area") area?: string,
    @Query("search") search?: string,
    @Query("minPrice") minPrice?: string,
    @Query("maxPrice") maxPrice?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.service.list({
      category,
      division,
      area,
      search,
      minPrice,
      maxPrice,
      startDate,
      endDate,
    });
  }

  @Get("filters/categories")
  categories() {
    return this.service.categories();
  }

  @Get("filters/areas")
  areas() {
    return this.service.areas();
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.get(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.SUPER_ADMIN)
  create(@Body() dto: CreateEventDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.SUPER_ADMIN)
  update(
    @Param("id") id: string,
    @Body() dto: UpdateEventDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.update(id, dto, user);
  }

  @Post(":id/publish")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.SUPER_ADMIN)
  publish(@Param("id") id: string, @CurrentUser() user: AuthUser) {
    return this.service.publish(id, user);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.SUPER_ADMIN)
  remove(@Param("id") id: string, @CurrentUser() user: AuthUser) {
    return this.service.remove(id, user);
  }
}
