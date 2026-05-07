import { DataSource, Repository } from 'typeorm';
import { Project } from '../models/Project';
import {
  IProjectRepository,
  CreateProjectData,
  UpdateProjectData,
} from '../../application/interfaces/IProjectRepository';

export class ProjectImpl implements IProjectRepository {
  private repository: Repository<Project>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Project);
  }

  async findByOwnerId(ownerId: string): Promise<Project[]> {
    return this.repository.find({
      where: { ownerId },
      order: { updatedAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Project | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Project | null> {
    return this.repository.findOne({ where: { slug } });
  }

  async findPublishedBySlug(slug: string): Promise<Project | null> {
    return this.repository.findOne({ where: { slug, published: true } });
  }

  async create(data: CreateProjectData): Promise<Project> {
    const project = this.repository.create(data);
    return this.repository.save(project);
  }

  async update(id: string, data: UpdateProjectData): Promise<void> {
    await this.repository.update(id, data as any);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.repository.increment({ id }, 'viewCount', 1);
  }
}
