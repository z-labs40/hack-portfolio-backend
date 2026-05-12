import { BrevoClient } from '@getbrevo/brevo';
import { Logger } from '../shared/logger';
import { BadRequestError } from '../shared/error';

// Initialize Brevo Client
const apiKey = process.env.BREVO_API_KEY || '';
if (!apiKey || apiKey.startsWith('xkeysib-xxxx')) {
  Logger.warn('⚠️ BREVO_API_KEY is not configured or using placeholder value.');
}

const client = new BrevoClient({
  apiKey: apiKey,
});

export class EmailService {
  private senderEmail: string;
  private senderName: string;

  constructor() {
    this.senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@hackfolio.com';
    this.senderName = process.env.BREVO_SENDER_NAME || 'Hackfolio Support';
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    if (!process.env.BREVO_API_KEY) {
      Logger.error('Cannot send email: BREVO_API_KEY is missing.');
      throw new BadRequestError('Email service is not configured correctly.');
    }

    try {
      const response = await client.transactionalEmails.sendTransacEmail({
        subject: 'Your Password Reset OTP',
        htmlContent: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #4f46e5; text-align: center;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>You requested to reset your password. Use the following OTP to proceed:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="font-size: 32px; font-weight: bold; padding: 16px 24px; background: #f3f4f6; border-radius: 8px; display: inline-block; letter-spacing: 6px; color: #111827; border: 1px solid #e5e7eb;">
                ${otp}
              </div>
            </div>
            <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">This OTP will expire in <strong>3 minutes</strong>.</p>
            <p style="font-size: 14px; color: #6b7280;">If you didn't request this, please ignore this email or contact support if you have concerns.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">&copy; ${new Date().getFullYear()} Hackfolio. All rights reserved.</p>
          </div>
        `,
        sender: { name: this.senderName, email: this.senderEmail },
        to: [{ email: email }],
        replyTo: { email: this.senderEmail, name: this.senderName },
      });

      Logger.info(`📧 OTP sent successfully via Brevo to ${email}. MessageId: ${response.messageId}`);
    } catch (error: any) {
      Logger.error(`❌ Brevo API Error sending email to ${email}`);
      
      if (error.response && error.response.data) {
        Logger.error('Brevo Response Details:', JSON.stringify(error.response.data, null, 2));
      } else {
        Logger.error('Error Message:', error.message);
      }

      throw new BadRequestError('Failed to send OTP email via Brevo. Please check service configuration.');
    }
  }
}
