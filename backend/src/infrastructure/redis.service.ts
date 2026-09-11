import { Injectable, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  readonly client = new Redis(
    process.env.REDIS_URL ?? "redis://localhost:6379",
  );
  readonly lockSeconds = 600;
  async acquireTicket(ticketId: string, bookingId: string) {
    return (
      (await this.client.set(
        `ticket_lock:${ticketId}`,
        bookingId,
        "EX",
        this.lockSeconds,
        "NX",
      )) === "OK"
    );
  }
  async releaseTicket(ticketId: string, bookingId: string) {
    await this.client.eval(
      "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
      1,
      `ticket_lock:${ticketId}`,
      bookingId,
    );
  }
  async onModuleDestroy() {
    await this.client.quit();
  }
}
