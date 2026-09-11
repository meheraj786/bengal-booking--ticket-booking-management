import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { RedisService } from "../infrastructure/redis.service";

@Module({
  controllers: [BookingController],
  providers: [BookingService, RedisService],
  exports: [BookingService],
})
export class BookingModule {}
