import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../interfaces/IUserRepository';
import { config } from '../../../config';
import { BadRequestError, ConflictError } from '../../../shared/error';

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new BadRequestError('Name, email and password are required');
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError('A user with this email already exists');
    }

    // Hash password manually (matching Dig-notice method)
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

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
