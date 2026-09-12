import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "./auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID ?? "not-configured",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "not-configured",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ??
        "http://localhost:4000/auth/google/callback",
      scope: ["email", "profile"],
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error("Google account has no email"), false);
    const user = await this.auth.findOrCreateGoogleUser({
      email,
      name: profile.displayName,
      image: profile.photos?.[0]?.value,
    });
    done(null, user);
  }
}
