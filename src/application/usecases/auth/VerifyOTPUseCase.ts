import { IUserRepository } from '../../interfaces/IUserRepository';
import { OTPStore } from '../../../shared/OTPStore';
import { NotFoundError, BadRequestError } from '../../../shared/error';

export class VerifyOTPUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, otp: string): Promise<boolean> {
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

    return true;
  }
}
