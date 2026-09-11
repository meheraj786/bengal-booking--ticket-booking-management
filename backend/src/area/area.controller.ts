import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { AreaDto } from "./area.dto";
import { AreaService } from "./area.service";
@Controller("areas")
export class AreaController {
  constructor(private readonly service: AreaService) {}
  @Get() list() {
    return this.service.list();
  }
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.SUPER_ADMIN) create(
    @Body() dto: AreaDto,
  ) {
    return this.service.create(dto);
  }
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  update(@Param("id") id: string, @Body() dto: AreaDto) {
    return this.service.update(id, dto);
  }
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
