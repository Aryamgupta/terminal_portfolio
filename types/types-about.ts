// types/about.ts

export interface PersonalInfo {
  name: string;
  role: string[];
  bio: string[];
  interests: string[];
  email?: string;
  phone?: string;
  location?: string;
  githubLink?: string;
  linkedinLink?: string;
  twitterLink?: string;
  resumeLink?: string;
}

export interface Education {
  name: string;
  institution: string;
  year?: string;
  type: string;
}

export interface Certificate {
  name: string;
  issuer?: string;
  link?: string;
  img?: string;
  id: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  duration: string;
  description: string[];
}

export interface AboutPageProps {
  personalInfo: PersonalInfo | null;
  education: Education[];
  certificates: Certificate[];
  skillCategories: SkillCategory[];
  experiences: Experience[];
}

export interface AboutPageMetadata {
  title: string;
  description: string;
  keywords: string[];
  author?: string;
  location?: string;
}

export interface SidebarTreeProps extends AboutPageProps {
  openFolders: Record<string, boolean>;
  openTabs: string[];
  activeTab: string;
  onToggleFolder: (id: string) => void;
  onOpenFile: (id: string) => void;
  onSetActiveTab: (id: string) => void;
}

export interface EditorPaneProps {
  initialContent: Record<string, { label: string; lines: string[] }>;
  openTabs: string[];
  activeTab: string;
  onCloseTab: (id: string) => void;
  onSetActiveTab: (id: string) => void;
  isMobile: boolean;
  skillCategories: SkillCategory[];
  personalInfo: PersonalInfo | null;
  education: Education[];
  certificates: Certificate[];
  experiences: Experience[];
}

export interface TerminalCard {
  id: string;
  title: string;
  lines: TerminalLine[];
}

export interface TerminalLine {
  prompt: string;
  cmd: string;
  color: string;
}
