import { IUserRepository } from '../../interfaces/IUserRepository';
import bcrypt from 'bcryptjs';
import { OTPStore } from '../../../shared/OTPStore';
import { NotFoundError, BadRequestError } from '../../../shared/error';

export class ResetPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, otp: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValid = OTPStore.verifyOTP(email, otp);
    
    if (!isValid) {
      const data = OTPStore.getOTPData(email);
      if (!data) throw new BadRequestError('No OTP requested');
      if (data.otp !== otp) throw new BadRequestError('Invalid OTP');
      if (new Date() > data.expires) throw new BadRequestError('OTP Expired');
      throw new BadRequestError('Invalid or expired OTP');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await this.userRepository.update(user.id, {
      password: hashedPassword
    });

    // Clear OTP from memory
    OTPStore.clearOTP(email);
  }
}
