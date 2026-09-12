import { Injectable } from "@nestjs/common";
import nodemailer, { Transporter } from "nodemailer";

@Injectable()
export class MailService {
  private readonly transporter: Transporter | null;
  constructor() {
    this.transporter =
      process.env.SMTP_HOST && process.env.SMTP_USER
        ? nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT ?? 587),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
          })
        : null;
  }
  async sendVerification(email: string, token: string) {
    const url = `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/verify-email?token=${token}`;
    if (!this.transporter) {
      console.info(`[Bengal Booking] Verification link for ${email}: ${url}`);
      return;
    }
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM ?? "no-reply@evently.local",
      to: email,
      subject: "Verify your Bengal Booking email",
      text: `Verify your email: ${url}`,
    });
  }
}
