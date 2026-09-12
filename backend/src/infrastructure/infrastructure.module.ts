import { Global, Module } from "@nestjs/common";
import { RolesGuard } from "../common/roles.guard";
import { PrismaService } from "./prisma.service";
import { RedisService } from "./redis.service";

@Global()
@Module({
  providers: [PrismaService, RedisService, RolesGuard],
  exports: [PrismaService, RedisService, RolesGuard],
})
export class InfrastructureModule {}
