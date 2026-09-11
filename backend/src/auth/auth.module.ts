import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleStrategy } from "./google.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { MailService } from "./mail.service";

@Module({
  imports: [
    PassportModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "development-secret",
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as any },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, JwtStrategy, GoogleStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
