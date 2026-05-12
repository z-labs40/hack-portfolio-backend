import { IUserRepository } from '../../interfaces/IUserRepository';
import { EmailService } from '../../../infrastructure/emailService';
import { Logger } from '../../../shared/logger';
import { NotFoundError } from '../../../shared/error';

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

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = expiry;

    await this.userRepository.update(user.id, {
      resetPasswordOTP: otp,
      resetPasswordExpires: expiry
    });

    // Send OTP email in the background
    this.emailService.sendOTP(email, otp).catch((error) => {
      Logger.error(`Background OTP sending failed for ${email}: ${error}`);
    });
    
    Logger.info(`Forgot password OTP request processed for ${email}`);
  }
}
