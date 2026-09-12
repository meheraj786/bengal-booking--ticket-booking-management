import { Global, Module } from "@nestjs/common";
import { RolesGuard } from "./roles.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Global()
@Module({
  providers: [RolesGuard, JwtAuthGuard],
  exports: [RolesGuard, JwtAuthGuard],
})
export class CommonModule {}
