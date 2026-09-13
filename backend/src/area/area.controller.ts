import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { AreaDto, UpdateAreaDto } from "./area.dto";
import { AreaService } from "./area.service";

@Controller("areas")
export class AreaController {
  constructor(@Inject(AreaService) private readonly service: AreaService) {}

  @Get()
  list(
    @Query("divisionId") divisionId?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    if (divisionId) {
      return this.service.listByDivision(divisionId, { page, limit });
    }
    return this.service.list({ page, limit });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  create(@Body() dto: AreaDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  update(@Param("id") id: string, @Body() dto: UpdateAreaDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
