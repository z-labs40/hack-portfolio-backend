import { IProjectRepository, CreateProjectData } from '../../interfaces/IProjectRepository';
import { BadRequestError, ConflictError } from '../../../shared/error';
import { ProjectContent } from '../../../shared/types';

export class CreateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(ownerId: string, slug: string, projectName: string, content: ProjectContent) {
    if (!slug || !projectName) {
      throw new BadRequestError('Slug and project name are required');
    }

    const existing = await this.projectRepository.findBySlug(slug);
    if (existing) {
      throw new ConflictError(`A project with slug "${slug}" already exists`);
    }

    const data: CreateProjectData = {
      slug,
      projectName,
      tagline: content.story?.description?.substring(0, 100) || '',
      status: 'in-progress',
      content,
      ownerId,
    };

    return this.projectRepository.create(data);
  }
}
