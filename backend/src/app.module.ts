import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AreaModule } from "./area/area.module";
import { BookingModule } from "./booking/booking.module";
import { CategoryModule } from "./category/category.module";
import { EventModule } from "./event/event.module";
import { PaymentModule } from "./payment/payment.module";
import { RequestContextMiddleware } from "./common/request-context.middleware";
import { TicketModule } from "./ticket/ticket.module";
import { UserModule } from "./user/user.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { HealthModule } from "./health/health.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";

@Module({
  imports: [
    AuthModule,
    AreaModule,
    BookingModule,
    CategoryModule,
    EventModule,
    PaymentModule,
    TicketModule,
    UserModule,
    DashboardModule,
    HealthModule,
    InfrastructureModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes("*");
  }
}
