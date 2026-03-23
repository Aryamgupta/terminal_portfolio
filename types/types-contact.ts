import { PersonalInfo } from "./types-about";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconId?: string | null;
}

export interface ContactPageProps {
  personalInfo: PersonalInfo | null;
  socialLinks: SocialLink[];
}
