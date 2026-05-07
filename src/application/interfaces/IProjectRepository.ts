import { Project } from '../../adapters/models/Project';
import { ProjectContent, ProjectStatus } from '../../shared/types';

export interface CreateProjectData {
  slug: string;
  projectName: string;
  tagline?: string;
  status?: ProjectStatus;
  content: ProjectContent;
  ownerId: string;
}

export interface UpdateProjectData {
  projectName?: string;
  tagline?: string;
  status?: ProjectStatus;
  published?: boolean;
  content?: ProjectContent;
}

export interface IProjectRepository {
  findByOwnerId(ownerId: string): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  findBySlug(slug: string): Promise<Project | null>;
  findPublishedBySlug(slug: string): Promise<Project | null>;
  create(data: CreateProjectData): Promise<Project>;
  update(id: string, data: UpdateProjectData): Promise<void>;
  delete(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;
}
