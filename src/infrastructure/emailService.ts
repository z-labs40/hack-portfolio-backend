import nodemailer from 'nodemailer';
import { Logger } from '../shared/logger';
import { BadRequestError } from '../shared/error';

// Port 465 (SSL) works reliably on cloud platforms like Render.
// Port 587 (STARTTLS) is commonly blocked by cloud providers.
const host = process.env.SMTP_HOST || 'smtp.gmail.com';
const port = parseInt(process.env.SMTP_PORT || '465');

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: port === 465, // true for SSL (465), false for STARTTLS (587)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000, // 10 seconds max to connect
  greetingTimeout: 10000,   // 10 seconds max for SMTP greeting
  socketTimeout: 15000,     // 15 seconds max for socket idle
});

// Verify connection configuration at startup
transporter.verify((error) => {
  if (error) {
    Logger.error('SMTP Connection Error:', error);
  } else {
    Logger.info('SMTP Server is ready to take our messages');
  }
});

export class EmailService {

  async sendOTP(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: `"Hackfolio Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Password Reset OTP',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Use the following OTP to proceed:</p>
          <div style="font-size: 32px; font-weight: bold; padding: 16px 24px; background: #f4f4f4; border-radius: 8px; display: inline-block; letter-spacing: 6px;">
            ${otp}
          </div>
          <p>This OTP will expire in 3 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      Logger.info(`OTP sent successfully to ${email}. MessageId: ${info.messageId}`);
    } catch (error) {
      Logger.error(`Failed to send email to ${email}: ${error}`);
      if (error instanceof Error) {
        Logger.error(`SMTP Error details: ${error.message}`);
      }
      throw new BadRequestError('Failed to send OTP email. Please try again later.');
    }
  }
}
