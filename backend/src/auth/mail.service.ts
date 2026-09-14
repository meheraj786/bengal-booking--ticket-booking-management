import { Injectable } from "@nestjs/common";
import nodemailer, { Transporter } from "nodemailer";

const COLORS = {
  lavender: "#EFEBFA",
  cream: "#FBF6EE",
  coral: "#E3755F",
  coralDark: "#C05A45",
  coralSoft: "#FBEAE6",
  muted: "#7A7686",
  line: "#E4DFD3",
  text: "#1E1B24",
};

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

    const { html, text } = this.buildVerificationEmail(token, url);

    await this.transporter.sendMail({
      from:
        process.env.MAIL_FROM ?? '"Bengal Booking" <no-reply@evently.local>',
      to: email,
      subject: "Verify your Bengal Booking email",
      text,
      html,
    });
  }

  private buildVerificationEmail(otp: string, url: string) {
    const otpDigits = otp
      .split("")
      .map(
        (digit) => `
          <td style="width:44px;height:54px;background:${COLORS.cream};border:1.5px solid ${COLORS.line};border-radius:8px;text-align:center;vertical-align:middle;">
            <span style="font-family:'Courier New', Courier, monospace;font-size:24px;font-weight:700;color:${COLORS.text};letter-spacing:0;">${digit}</span>
          </td>
          <td style="width:8px;"></td>`,
      )
      .join("");

    const text = `Verify your Bengal Booking email\n\nYour verification code is: ${otp}\n\nOr verify instantly using this link:\n${url}\n\nThis code expires shortly. If you didn't request this, you can safely ignore this email.\n\n— Team Bengal Booking`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>Verify your Bengal Booking email</title>
<!--[if mso]>
<noscript>
  <xml>
    <o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
</noscript>
<![endif]-->
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
  a[x-apple-data-detectors] {
    color: inherit !important;
    text-decoration: none !important;
    font-size: inherit !important;
    font-family: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
  }
  @media screen and (max-width: 480px) {
    .email-container { width: 100% !important; }
    .email-padding { padding-left: 24px !important; padding-right: 24px !important; }
    .otp-cell { width: 38px !important; height: 48px !important; }
    .otp-digit { font-size: 20px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.lavender};font-family:Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Your Bengal Booking verification code is ${otp}. This code expires shortly.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.lavender};">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-container" style="max-width:480px;">
          <tr>
            <td align="left" style="padding:0 4px 24px 4px;">
              <span style="font-size:22px;font-weight:800;letter-spacing:-1px;color:${COLORS.text};">
                bengalBooking<span style="color:${COLORS.coral};">.</span>
              </span>
            </td>
          </tr>

          <tr>
            <td style="background-color:${COLORS.cream};border-radius:16px;overflow:hidden;box-shadow:0 20px 50px -20px rgba(30,27,36,0.15);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="email-padding" style="padding:48px 48px 8px 48px;text-align:center;">

                    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 20px auto;">
                      <tr>
                        <td style="background-color:${COLORS.coralSoft};border-radius:999px;padding:6px 14px;">
                          <span style="font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;color:${COLORS.coralDark};">
                            EMAIL VERIFICATION
                          </span>
                        </td>
                      </tr>
                    </table>

                    <h1 style="margin:0 0 12px 0;font-size:30px;line-height:1.15;letter-spacing:-1.5px;font-weight:500;color:${COLORS.text};">
                      Verify your <em style="font-style:italic;color:${COLORS.coralDark};">email</em>
                    </h1>

                    <p style="margin:0 0 28px 0;font-size:13px;line-height:1.6;color:${COLORS.muted};max-width:320px;margin-left:auto;margin-right:auto;">
                      Use the code below to verify your Bengal Booking account. It expires shortly, so let&rsquo;s get you booked in.
                    </p>

                    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin-bottom:10px;">
                      <tr>
                        ${otpDigits}
                      </tr>
                    </table>

                    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:14px auto 30px auto;">
                      <tr>
                        <td style="background-color:#FFFFFF;border:1px solid ${COLORS.line};border-radius:8px;">
                          <a href="${url}" style="display:inline-flex;align-items:center;gap:6px;padding:9px 16px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;color:${COLORS.coralDark};text-decoration:none;">
                            &#128203;&nbsp; Copy code: <span style="font-family:'Courier New',monospace;letter-spacing:2px;">${otp}</span>
                          </a>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="border-top:1px solid ${COLORS.line};line-height:0;font-size:0;">&nbsp;</td>
                      </tr>
                    </table>

                    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin-bottom:16px;">
                      <tr>
                        <td style="background-color:${COLORS.coral};border-radius:8px;">
                          <a href="${url}" target="_blank" style="display:inline-block;padding:14px 36px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:8px;">
                            Verify Email &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 6px 0;font-size:11px;line-height:1.6;color:${COLORS.muted};">
                      Button not working?
                      <a href="${url}" style="color:${COLORS.coralDark};font-weight:700;text-decoration:underline;">Click here</a>
                      to verify instead.
                    </p>

                    <p style="margin:16px 0 0 0;font-size:10px;line-height:1.6;color:${COLORS.muted};word-break:break-all;">
                      ${url}
                    </p>

                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 48px 40px 48px;text-align:center;">
                    <p style="margin:0;font-size:10px;line-height:1.6;color:${COLORS.muted};">
                      Didn&rsquo;t request this? You can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:24px 4px 0 4px;">
              <p style="margin:0;font-size:11px;color:${COLORS.muted};">
                &copy; ${new Date().getFullYear()} Bengal Booking. All rights reserved.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

    return { html, text };
  }
}
