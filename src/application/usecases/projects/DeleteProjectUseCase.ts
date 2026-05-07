import { IProjectRepository } from '../../interfaces/IProjectRepository';
import { NotFoundError, ForbiddenError } from '../../../shared/error';

export class DeleteProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string, ownerId: string) {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.ownerId !== ownerId) {
      throw new ForbiddenError('You do not have access to this project');
    }

    await this.projectRepository.delete(id);

    return { message: 'Project deleted successfully' };
  }
}
