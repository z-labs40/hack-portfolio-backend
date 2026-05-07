import { IProjectRepository, UpdateProjectData } from '../../interfaces/IProjectRepository';
import { NotFoundError, ForbiddenError } from '../../../shared/error';

export class UpdateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string, ownerId: string, data: UpdateProjectData) {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.ownerId !== ownerId) {
      throw new ForbiddenError('You do not have access to this project');
    }

    await this.projectRepository.update(id, data);

    return this.projectRepository.findById(id);
  }
}
