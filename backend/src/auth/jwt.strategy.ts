import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../infrastructure/prisma.service";

function accessTokenFromCookie(request?: {
  cookies?: Record<string, string>;
  headers?: { cookie?: string };
}) {
  const parsedToken = request?.cookies?.evently_access_token;
  if (parsedToken) return parsedToken;

  const header = request?.headers?.cookie;
  const match = header
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("evently_access_token="));
  return match
    ? decodeURIComponent(match.slice("evently_access_token=".length))
    : undefined;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: (request) => {
        const cookieToken = accessTokenFromCookie(request);
        return cookieToken ?? ExtractJwt.fromAuthHeaderAsBearerToken()(request);
      },
      secretOrKey: process.env.JWT_SECRET ?? "development-secret",
    });
  }
  async validate(payload: { sub: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        image: true,
        role: true,
        isVerified: true,
        status: true,
      },
    });
    if (!user || user.status !== "ACTIVE") throw new UnauthorizedException();
    return user;
  }
}
