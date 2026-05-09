// Shared types — data contract between frontend and backend (mirrors src/types/project.ts)

export type ProjectStatus = 'in-progress' | 'submitted' | 'winner';
export type ProjectTheme =
  | 'dark-modern'
  | 'light-minimal'
  | 'gradient-creative'
  | 'glassmorphism'
  | 'portfolio-luxury'
  | 'dark-hacker'
  | 'clean-minimal'
  | 'bold-colorful';
export type ProjectBackground = 'none' | 'mesh' | 'aurora' | 'grid' | 'dots' | 'orbs';
export type ProjectCategory = 'AI/ML' | 'Web3' | 'HealthTech' | 'EdTech' | 'FinTech' | 'Sustainability' | 'Other';
export type ThemeId = ProjectTheme;
export type SectionKind = 'hero' | 'about' | 'projects' | 'skills' | 'contact';
export type BgType = 'solid' | 'gradient' | 'image';
export type BtnStyle = 'solid' | 'outline' | 'glass' | 'neon' | 'rounded';
export type ImageLayout = 'grid' | 'masonry' | 'carousel';
export type ImageEffect = 'zoom' | 'blur' | 'overlay';
export type ElementType = 'title' | 'subtitle' | 'body' | 'cta' | 'image' | 'github' | 'youtube';

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
  variant?: string;
  style?: Record<string, string | number>;
  x: number;
  y: number;
}

export interface ProjectSection {
  id: string;
  kind: SectionKind;
  height: number;
  themeOverride: ThemeId | 'inherit';
  text: {
    family: string;
    size: number;
    weight: number;
    letterSpacing: number;
    lineHeight: number;
    align: 'left' | 'center' | 'right';
    color: string;
  };
  button: {
    style: BtnStyle;
    size: 'sm' | 'md' | 'lg';
    radius: number;
    color: string;
  };
  background: {
    type: BgType;
    value: string;
    overlay: boolean;
    overlayColor: string;
    opacity?: number;
    blur?: number;
  };
  gallery: {
    layout: ImageLayout;
    effect: ImageEffect;
    images: string[];
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
