import { Response, Router } from 'express';
import { ProjectImpl } from '../repositories/ProjectImpl';
import { AppDataSource } from '../../infrastructure/database';
import { CreateProjectUseCase } from '../../application/usecases/projects/CreateProjectUseCase';
import { GetProjectsUseCase } from '../../application/usecases/projects/GetProjectsUseCase';
import { GetProjectByIdUseCase } from '../../application/usecases/projects/GetProjectByIdUseCase';
import { UpdateProjectUseCase } from '../../application/usecases/projects/UpdateProjectUseCase';
import { DeleteProjectUseCase } from '../../application/usecases/projects/DeleteProjectUseCase';
import { GetPublicProjectUseCase } from '../../application/usecases/projects/GetPublicProjectUseCase';
import { authMiddleware } from '../../frameworks/middleware';
import { SuccessResponse } from '../../frameworks/types';

export class ProjectController {
  public router: Router = Router();
  private projectRepository: ProjectImpl;

  constructor() {
    this.projectRepository = new ProjectImpl(AppDataSource);

    // Private routes (authenticated)
    this.router.get('/', authMiddleware, this.getProjectsHandler.bind(this));
    this.router.post('/', authMiddleware, this.createProjectHandler.bind(this));
    this.router.get('/:id', authMiddleware, this.getProjectByIdHandler.bind(this));
    this.router.patch('/:id', authMiddleware, this.updateProjectHandler.bind(this));
    this.router.delete('/:id', authMiddleware, this.deleteProjectHandler.bind(this));
  }

  async getProjectsHandler(req: any, res: Response, next: any) {
    try {
      const usecase = new GetProjectsUseCase(this.projectRepository);
      const result = await usecase.execute(req.user.id);

      res.status(200).json({
        ok: true,
        data: result,
      } as SuccessResponse<typeof result>);
    } catch (error) {
      next(error);
    }
  }

  async createProjectHandler(req: any, res: Response, next: any) {
    try {
      const { slug, projectName, content } = req.body;
      const usecase = new CreateProjectUseCase(this.projectRepository);
      const result = await usecase.execute(req.user.id, slug, projectName, content);

      res.status(201).json({
        ok: true,
        data: result,
        message: 'Project created successfully',
      } as SuccessResponse<typeof result>);
    } catch (error) {
      next(error);
    }
  }

  async getProjectByIdHandler(req: any, res: Response, next: any) {
    try {
      const usecase = new GetProjectByIdUseCase(this.projectRepository);
      const result = await usecase.execute(req.params.id, req.user.id);

      res.status(200).json({
        ok: true,
        data: result,
      } as SuccessResponse<typeof result>);
    } catch (error) {
      next(error);
    }
  }

  async updateProjectHandler(req: any, res: Response, next: any) {
    try {
      const usecase = new UpdateProjectUseCase(this.projectRepository);
      const result = await usecase.execute(req.params.id, req.user.id, req.body);

      res.status(200).json({
        ok: true,
        data: result,
        message: 'Project updated successfully',
      } as SuccessResponse<typeof result>);
    } catch (error) {
      next(error);
    }
  }

  async deleteProjectHandler(req: any, res: Response, next: any) {
    try {
      const usecase = new DeleteProjectUseCase(this.projectRepository);
      const result = await usecase.execute(req.params.id, req.user.id);

      res.status(200).json({
        ok: true,
        data: result,
      } as SuccessResponse<typeof result>);
    } catch (error) {
      next(error);
    }
  }
}

// Separate controller for public routes (no auth)
export class PublicProjectController {
  public router: Router = Router();
  private projectRepository: ProjectImpl;

  constructor() {
    this.projectRepository = new ProjectImpl(AppDataSource);
    this.router.get('/:slug', this.getPublicProjectHandler.bind(this));
  }

  async getPublicProjectHandler(req: any, res: Response, next: any) {
    try {
      const usecase = new GetPublicProjectUseCase(this.projectRepository);
      const result = await usecase.execute(req.params.slug);

      res.status(200).json({
        ok: true,
        data: result,
      } as SuccessResponse<typeof result>);
    } catch (error) {
      next(error);
    }
  }
}
