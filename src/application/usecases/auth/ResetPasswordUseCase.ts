import { IUserRepository } from '../../interfaces/IUserRepository';
import bcrypt from 'bcryptjs';

export class ResetPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, otp: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.resetPasswordOTP || !user.resetPasswordExpires) {
      throw new Error('No OTP requested');
    }

    if (user.resetPasswordOTP !== otp) {
      throw new Error('Invalid OTP');
    }

    if (new Date() > user.resetPasswordExpires) {
      throw new Error('OTP Expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user and clear OTP fields
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetPasswordOTP: undefined,
      resetPasswordExpires: undefined
    });
  }
}
