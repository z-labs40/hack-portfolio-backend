import { IUserRepository } from '../../interfaces/IUserRepository';

export class VerifyOTPUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, otp: string): Promise<boolean> {
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

    return true;
  }
}
