import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { ProjectContent, ProjectStatus } from '../../shared/types';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  projectName!: string;

  @Column({ default: '' })
  tagline!: string;

  @Column({
    type: 'enum',
    enum: ['in-progress', 'submitted', 'winner'],
    default: 'in-progress',
  })
  status!: ProjectStatus;

  @Column({ default: false })
  published!: boolean;

  @Column({ default: 0 })
  viewCount!: number;

  // All nested data (sections, elements, team, etc.) stored as JSONB
  @Column({ type: 'jsonb', nullable: true })
  content!: ProjectContent;

  @Column()
  ownerId!: string;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
