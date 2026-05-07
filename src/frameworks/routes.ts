import { Express } from 'express';
import { AuthController } from '../adapters/controller/AuthController';
import { ProjectController, PublicProjectController } from '../adapters/controller/ProjectController';
import { UploadController } from '../adapters/controller/UploadController';
import { Logger } from '../shared/logger';

export default (app: Express): void => {
  const authController = new AuthController();
  const projectController = new ProjectController();
  const publicProjectController = new PublicProjectController();
  const uploadController = new UploadController();

  app.use('/api/auth', authController.router);
  app.use('/api/projects', projectController.router);
  app.use('/api/p', publicProjectController.router);       // Public: GET /api/p/:slug
  app.use('/api/upload', uploadController.router);

  Logger.info('✅ Routes registered successfully');
};
