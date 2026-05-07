import { IProjectRepository } from '../../interfaces/IProjectRepository';
import { NotFoundError } from '../../../shared/error';

export class GetPublicProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(slug: string) {
    const project = await this.projectRepository.findPublishedBySlug(slug);

    if (!project) {
      throw new NotFoundError('Project not found or is not published');
    }

    // Increment view count asynchronously (fire and forget)
    this.projectRepository.incrementViewCount(project.id).catch(() => {});

    return project;
  }
}
