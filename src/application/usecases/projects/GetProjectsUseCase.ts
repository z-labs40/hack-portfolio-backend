import { IProjectRepository } from '../../interfaces/IProjectRepository';

export class GetProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(ownerId: string) {
    return this.projectRepository.findByOwnerId(ownerId);
  }
}
