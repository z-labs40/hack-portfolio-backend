import { Request, Response, Router } from 'express';
import { UserImpl } from '../repositories/UserImpl';
import { AppDataSource } from '../../infrastructure/database';
import { RegisterUseCase } from '../../application/usecases/auth/RegisterUseCase';
import { LoginUseCase } from '../../application/usecases/auth/LoginUseCase';
import { ForgotPasswordUseCase } from '../../application/usecases/auth/ForgotPasswordUseCase';
import { VerifyOTPUseCase } from '../../application/usecases/auth/VerifyOTPUseCase';
import { ResetPasswordUseCase } from '../../application/usecases/auth/ResetPasswordUseCase';
import { GetUserByIdUseCase } from '../../application/usecases/users/GetUserByIdUseCase';
import { UpdateProfileUseCase } from '../../application/usecases/users/UpdateProfileUseCase';
import { DeleteUserUseCase } from '../../application/usecases/users/DeleteUserUseCase';
import { ListUsersUseCase } from '../../application/usecases/users/ListUsersUseCase';
import { authMiddleware } from '../../frameworks/middleware';
import { SuccessResponse } from '../../frameworks/types';

export class AuthController {
  public router: Router = Router();
  private userRepository: UserImpl;

  constructor() {
    this.userRepository = new UserImpl(AppDataSource);
    this.router.post('/register', this.registerHandler.bind(this));
    this.router.post('/login', this.loginHandler.bind(this));
    this.router.post('/forgot-password', this.forgotPasswordHandler.bind(this));
    this.router.post('/verify-otp', this.verifyOTPHandler.bind(this));
    this.router.post('/reset-password', this.resetPasswordHandler.bind(this));
    
    // Integrated User CRUD routes
    this.router.get('/all-users', authMiddleware, this.listUsersHandler.bind(this));
    this.router.get('/users/:id', authMiddleware, this.getUserByIdHandler.bind(this));
    this.router.patch('/users/:id', authMiddleware, this.updateUserHandler.bind(this));
    this.router.delete('/users/:id', authMiddleware, this.deleteUserHandler.bind(this));
  }

  async registerHandler(req: Request, res: Response, next: any) {
    try {
      const { name, email, password } = req.body;
      const usecase = new RegisterUseCase(this.userRepository);
      const result = await usecase.execute(name, email, password);

      res.status(201).json({
        ok: true,
        data: result,
        message: 'Registration successful',
      } as SuccessResponse<typeof result>);
    } catch (error) {
      next(error);
    }
  }

  async loginHandler(req: Request, res: Response, next: any) {
    try {
      const { email, password } = req.body;
      const usecase = new LoginUseCase(this.userRepository);
      const result = await usecase.execute(email, password);

      res.status(200).json({
        ok: true,
        data: result,
        message: 'Login successful',
      } as SuccessResponse<typeof result>);
    } catch (error) {
      next(error);
    }
  }

  async listUsersHandler(req: Request, res: Response, next: any) {
    try {
      const usecase = new ListUsersUseCase(this.userRepository);
      const result = await usecase.execute();

      res.status(200).json({
        ok: true,
        data: result,
      } as SuccessResponse<typeof result>);
    } catch (error) {
      next(error);
    }
  }

  async getUserByIdHandler(req: Request, res: Response, next: any) {
    try {
      const usecase = new GetUserByIdUseCase(this.userRepository);
      const result = await usecase.execute(req.params.id as string);

      res.status(200).json({
        ok: true,
        data: result,
      } as SuccessResponse<typeof result>);
    } catch (error) {
      next(error);
    }
  }

  async updateUserHandler(req: Request, res: Response, next: any) {
    try {
      const usecase = new UpdateProfileUseCase(this.userRepository);
      const result = await usecase.execute(req.params.id as string, req.body);

      res.status(200).json({
        ok: true,
        data: result,
        message: 'User updated successfully',
      } as SuccessResponse<typeof result>);
    } catch (error) {
      next(error);
    }
  }

  async deleteUserHandler(req: Request, res: Response, next: any) {
    try {
      const usecase = new DeleteUserUseCase(this.userRepository);
      const result = await usecase.execute(req.params.id as string);

      res.status(200).json({
        ok: true,
        data: result,
      } as SuccessResponse<typeof result>);
    } catch (error) {
      next(error);
    }
  }

  async forgotPasswordHandler(req: Request, res: Response, next: any) {
    try {
      const { email } = req.body;
      const usecase = new ForgotPasswordUseCase(this.userRepository);
      await usecase.execute(email);

      res.status(200).json({
        ok: true,
        message: 'OTP sent to your email',
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyOTPHandler(req: Request, res: Response, next: any) {
    try {
      const { email, otp } = req.body;
      const usecase = new VerifyOTPUseCase(this.userRepository);
      const isValid = await usecase.execute(email, otp);

      res.status(200).json({
        ok: true,
        data: { isValid },
        message: 'OTP verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPasswordHandler(req: Request, res: Response, next: any) {
    try {
      const { email, otp, password } = req.body;
      const usecase = new ResetPasswordUseCase(this.userRepository);
      await usecase.execute(email, otp, password);

      res.status(200).json({
        ok: true,
        message: 'Password reset successful',
      });
    } catch (error) {
      next(error);
    }
  }
}
