import { IUserRepository } from '../../interfaces/IUserRepository';
import { NotFoundError } from '../../../shared/error';
import bcrypt from 'bcryptjs';

export class UpdateProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, data: any) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Only allow updating certain fields
    const allowedFields = ['name', 'email', 'password'];
    const updateData: any = {};
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        if (field === 'password') {
          // Manual hash if updated via usecase (though BeforeUpdate hook in model should also handle it)
          updateData[field] = await bcrypt.hash(data[field], 12);
        } else {
          updateData[field] = data[field];
        }
      }
    }

    await this.userRepository.update(userId, updateData);
    
    const updatedUser = await this.userRepository.findById(userId);
    const { password, ...safeUser } = updatedUser!;
    return safeUser;
  }
}
