import { IUserRepository } from '../../interfaces/IUserRepository';
import { EmailService } from '../../../infrastructure/emailService';
import { Logger } from '../../../shared/logger';
import { NotFoundError } from '../../../shared/error';
import { OTPStore } from '../../../shared/OTPStore';

export class ForgotPasswordUseCase {
  private emailService: EmailService;

  constructor(private userRepository: IUserRepository) {
    this.emailService = new EmailService();
  }

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 3); // 3 minutes expiry

    // Store OTP in-memory instead of database
    OTPStore.setOTP(email, otp, expiry);

    // Send OTP email and await it so failures are properly reported
    await this.emailService.sendOTP(email, otp);

    Logger.info(`Forgot password OTP sent successfully to ${email}`);


  }
}
