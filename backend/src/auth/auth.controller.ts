import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Patch,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Throttle } from "@nestjs/throttler";
import { Request, Response } from "express";
import { AuthService, AuthTokenUser } from "./auth.service";
import { LoginDto, RegisterDto } from "./auth.dto";
import { JwtAuthGuard } from "../common/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  private setAuthCookie(response: Response, accessToken: string) {
    response.cookie("evently_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("register")
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.register(dto);
    this.setAuthCookie(response, result.accessToken);
    return { message: result.message, userId: result.userId, user: result.user };
  }

  @Get("verify-email")
  verifyEmail(@Query("token") token: string) {
    return this.auth.verifyEmail(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post("resend-verification")
  resendVerification(@Req() request: Request) {
    return this.auth.resendVerification((request.user as AuthTokenUser).email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("become-seller")
  async becomeSeller(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.becomeSeller((request.user as AuthTokenUser).id);
    this.setAuthCookie(response, result.accessToken);
    return { user: result.user };
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.login(dto.email, dto.password);
    this.setAuthCookie(response, result.accessToken);
    return { user: result.user };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("evently_access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return { message: "Logged out" };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() request: Request) {
    return request.user;
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  google() {
    return;
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleCallback(@Req() request: Request, @Res() response: Response) {
    const result = this.auth.googleLogin(request.user as AuthTokenUser);
    this.setAuthCookie(response, result.accessToken);
    return response.redirect(
      `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/auth/callback`,
    );
  }
}
