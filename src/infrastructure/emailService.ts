import nodemailer from 'nodemailer';
import { config } from '../config';
import { Logger } from '../shared/logger';
import { BadRequestError } from '../shared/error';

const host = process.env.SMTP_HOST || 'smtp.gmail.com';
const port = parseInt(process.env.SMTP_PORT || '587');

const transporter = nodemailer.createTransport({
  service: host.includes('gmail') ? 'gmail' : undefined,
  host: !host.includes('gmail') ? host : undefined,
  port: port,
  secure: port === 465,
  connectionTimeout: 10000, // 10 seconds timeout
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export class EmailService {
  async sendOTP(email: string, otp: string) {
    const mailOptions = {
      from: `"Hackfolio Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Password Reset OTP',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Use the following OTP to proceed:</p>
          <div style="font-size: 24px; font-weight: bold; padding: 10px; background: #f4f4f4; border-radius: 5px; display: inline-block;">
            ${otp}
          </div>
          <p>This OTP will expire in 3 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      Logger.info(`OTP sent to ${email}`);
    } catch (error) {
      Logger.error(`Failed to send email to ${email}: ${error}`);
      throw new BadRequestError('Failed to send OTP email. Please check your SMTP settings.');
    }
  }
}
