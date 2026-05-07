import { IUserRepository } from '../../interfaces/IUserRepository';
import { NotFoundError } from '../../../shared/error';

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }
}
