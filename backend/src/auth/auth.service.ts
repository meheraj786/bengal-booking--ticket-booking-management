import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "node:crypto";
import { compare, hash } from "bcryptjs";
import { PrismaService } from "../infrastructure/prisma.service";
import { MailService } from "./mail.service";
import { RegisterDto } from "./auth.dto";

export interface AuthTokenUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: string;
  isVerified: boolean;
}

export interface AuthTokenResult {
  accessToken: string;
  user: AuthTokenUser;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(JwtService) private readonly jwt: JwtService,
    @Inject(MailService) private readonly mail: MailService,
  ) {}

  private token(user: AuthTokenUser): AuthTokenResult {
    return {
      accessToken: this.jwt.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (exists) throw new ConflictException("Email is already registered");
    const verificationToken = randomBytes(32).toString("hex");
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        passwordHash: await hash(dto.password, 12),
        verificationToken,
        verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    await this.mail.sendVerification(user.email, verificationToken);
    return {
      message:
        "Registration successful. Check your email to verify your account.",
      userId: user.id,
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpiresAt: { gt: new Date() },
      },
    });
    if (!user)
      throw new UnauthorizedException(
        "Verification link is invalid or expired",
      );
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationExpiresAt: null,
      },
    });
    return { message: "Email verified successfully" };
  }

  async login(email: string, password: string): Promise<AuthTokenResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user?.passwordHash || !(await compare(password, user.passwordHash)))
      throw new UnauthorizedException("Invalid email or password");
    if (!user.isVerified)
      throw new UnauthorizedException("Verify your email before signing in");
    if (user.status !== "ACTIVE")
      throw new UnauthorizedException("Account is suspended");
    return this.token(user);
  }

  async findOrCreateGoogleUser(data: {
    email: string;
    name: string;
    image?: string;
  }) {
    return this.prisma.user.upsert({
      where: { email: data.email.toLowerCase() },
      update: { name: data.name, image: data.image, isVerified: true },
      create: {
        email: data.email.toLowerCase(),
        name: data.name,
        image: data.image,
        isVerified: true,
      },
    });
  }

  googleLogin(user: AuthTokenUser): AuthTokenResult {
    return this.token(user);
  }
}
