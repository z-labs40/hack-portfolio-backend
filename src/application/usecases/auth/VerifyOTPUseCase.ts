import { IUserRepository } from '../../interfaces/IUserRepository';
import { OTPStore } from '../../../shared/OTPStore';

export class VerifyOTPUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, otp: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = OTPStore.verifyOTP(email, otp);
    
    if (!isValid) {
      const data = OTPStore.getOTPData(email);
      if (!data) throw new Error('No OTP requested');
      if (data.otp !== otp) throw new Error('Invalid OTP');
      if (new Date() > data.expires) throw new Error('OTP Expired');
      throw new Error('Invalid or expired OTP');
    }

    return true;
  }
}
