import { IUserRepository } from '../../interfaces/IUserRepository';

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute() {
    const users = await this.userRepository.findAll();
    
    // Return users without passwords
    return users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
  }
}
