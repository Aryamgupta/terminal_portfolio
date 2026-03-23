import ContactPageContent from "@/components/ContactPageContent";
import { PersonalInfo } from "@/types/types-about";
import { SocialLink } from "@/types/types-contact";
import { kv } from "@vercel/kv";

type KVResponse<T> = {
  data: T;
  exportedAt: string;
};

async function getContactData() {
  const [personalInfoData, socialLinksData] = await Promise.all([
    kv.get("personal-info"),
    kv.get("social-links"),
  ]);

  const personalInfo = (personalInfoData as KVResponse<PersonalInfo | null>)?.data || null;
  const socialLinks = (socialLinksData as KVResponse<SocialLink[]>)?.data || [];

  return {
    personalInfo,
    socialLinks,
  };
}


export default async function ContactPage() {
  const data = await getContactData();
  return <ContactPageContent {...data} />;
}