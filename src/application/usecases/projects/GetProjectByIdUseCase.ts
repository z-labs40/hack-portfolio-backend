import { IProjectRepository } from '../../interfaces/IProjectRepository';
import { NotFoundError, ForbiddenError } from '../../../shared/error';

export class GetProjectByIdUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string, ownerId: string) {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.ownerId !== ownerId) {
      throw new ForbiddenError('You do not have access to this project');
    }

    return project;
  }
}
