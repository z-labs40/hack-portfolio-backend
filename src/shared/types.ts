// Shared types — data contract between frontend and backend (mirrors src/types/project.ts)

export type ProjectStatus = 'in-progress' | 'submitted' | 'winner';
export type ProjectTheme = 'dark-hacker' | 'clean-minimal' | 'bold-colorful';
export type ProjectBackground = 'none' | 'mesh' | 'aurora' | 'grid' | 'dots' | 'orbs';
export type ProjectCategory = 'AI/ML' | 'Web3' | 'HealthTech' | 'EdTech' | 'FinTech' | 'Sustainability' | 'Other';
export type ElementType = 'text' | 'button' | 'image' | 'social-github' | 'social-youtube';
export type ElementVariant =
  | 'heading1' | 'heading2' | 'paragraph'
  | 'primary-btn' | 'pill-btn' | 'ghost-btn'
  | 'button' | 'link' | 'icon' | 'video';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  github?: string;
  linkedin?: string;
}

export interface ProjectElement {
  id: string;
  type: ElementType;
  content: string;
  variant: ElementVariant;
  style?: Record<string, string | number>;
  x?: number;
  y?: number;
}

export interface ProjectSection {
  id: string;
  title: string;
  height?: number;
  background: {
    type: 'color' | 'image';
    value: string;
    opacity?: number;
    blur?: number;
  };
  elements: ProjectElement[];
}

export interface ProjectContent {
  category: ProjectCategory;
  theme: ProjectTheme;
  background: ProjectBackground;
  coverImage?: string;
  gallery: string[];
  team: TeamMember[];
  techStack: string[];
  links: {
    github: string;
    youtube: string;
    liveDemo?: string;
  };
  story: {
    problem: string;
    description: string;
    features: string[];
    challenges?: string;
    futureScope?: string;
  };
  sections: ProjectSection[];
}
