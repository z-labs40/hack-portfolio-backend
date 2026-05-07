import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../interfaces/IUserRepository';
import { config } from '../../../config';
import { UnauthorizedError, BadRequestError } from '../../../shared/error';

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
