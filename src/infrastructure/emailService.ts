import nodemailer from 'nodemailer';
import { Logger } from '../shared/logger';
import { BadRequestError } from '../shared/error';

// Helper to get SMTP settings with better logging
const getSMTPConfig = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465');
  
  // Use SMTP_SECURE if provided, otherwise default to true for port 465
  const secure = process.env.SMTP_SECURE !== undefined 
    ? process.env.SMTP_SECURE === 'true' 
    : port === 465;

  if (!user || !pass) {
    Logger.warn('⚠️ SMTP_USER or SMTP_PASS is not defined in environment variables.');
  }

  return { host, port, secure, auth: { user, pass } };
};

const smtpConfig = getSMTPConfig();

const transporter = nodemailer.createTransport({
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.secure,
  auth: smtpConfig.auth,
  tls: {
    rejectUnauthorized: false, // Helps with some cloud provider certificate issues
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

// Verify connection configuration at startup
transporter.verify((error) => {
  if (error) {
    Logger.error('❌ SMTP Connection Error:', error);
    if (error.message.includes('EAI_AGAIN')) {
      Logger.error('DNS Lookup failed. Check if the server has internet access.');
    }
  } else {
    Logger.info('✅ SMTP Server is ready to take our messages');
  }
});

export class EmailService {
  async sendOTP(email: string, otp: string): Promise<void> {
    if (!process.env.SMTP_USER) {
      Logger.error('Cannot send email: SMTP_USER is missing.');
      throw new BadRequestError('Email service is not configured correctly.');
    }

    const mailOptions = {
      from: `"Hackfolio Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Password Reset OTP',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4f46e5;">Password Reset Request</h2>
          <p>You requested to reset your password. Use the following OTP to proceed:</p>
          <div style="font-size: 32px; font-weight: bold; padding: 16px 24px; background: #f3f4f6; border-radius: 8px; display: inline-block; letter-spacing: 6px; color: #111827; border: 1px solid #e5e7eb;">
            ${otp}
          </div>
          <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">This OTP will expire in 3 minutes.</p>
          <p style="font-size: 14px; color: #6b7280;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      Logger.info(`📧 OTP sent successfully to ${email}. MessageId: ${info.messageId}`);
    } catch (error: any) {
      Logger.error(`❌ Failed to send email to ${email}`);
      Logger.error(`Error Code: ${error.code || 'N/A'}`);
      Logger.error(`Error Message: ${error.message}`);
      
      if (error.code === 'EAUTH') {
        Logger.error('Authentication failed. Check SMTP_USER and SMTP_PASS (App Password).');
      } else if (error.code === 'ESOCKET') {
        Logger.error('Connection failed. Port might be blocked by the hosting provider.');
      }

      throw new BadRequestError('Failed to send OTP email. Please try again later.');
    }
  }
}
