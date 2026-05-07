import { Request, Response, Router } from 'express';
import { UserImpl } from '../repositories/UserImpl';
import { AppDataSource } from '../../infrastructure/database';
import { RegisterUseCase } from '../../application/usecases/auth/RegisterUseCase';
import { LoginUseCase } from '../../application/usecases/auth/LoginUseCase';
import { SuccessResponse } from '../../frameworks/types';

export class AuthController {
  public router: Router = Router();
  private userRepository: UserImpl;

  constructor() {
    this.userRepository = new UserImpl(AppDataSource);
    this.router.post('/register', this.registerHandler.bind(this));
    this.router.post('/login', this.loginHandler.bind(this));
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
}
