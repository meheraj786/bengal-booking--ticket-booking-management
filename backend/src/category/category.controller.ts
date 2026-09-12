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
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { CategoryDto } from "./category.dto";
import { CategoryService } from "./category.service";

@Controller("categories")
export class CategoryController {
  constructor(
    @Inject(CategoryService) private readonly service: CategoryService,
  ) {}

  @Get()
  list(
    @Query("limit") limit?: string,
    @Query("page") page?: string,
    @Query("search") search?: string,
  ) {
    return this.service.list({
      limit,
      page,
      search,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  create(@Body() dto: CategoryDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  update(@Param("id") id: string, @Body() dto: CategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
