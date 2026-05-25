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


export async function generateMetadata() {
  let personalInfo: PersonalInfo | null = null;
  try {
    const personalInfoData = await kv.get("personal-info");
    personalInfo = (personalInfoData as KVResponse<PersonalInfo | null>)?.data || null;
  } catch (e) {
    console.error("Failed to load contact page metadata", e);
  }

  const name = personalInfo?.name || "Aryam Gupta";

  return {
    title: "Contact Me",
    description: `Get in touch with ${name} for hiring, collaboration, or general inquiries.`,
    keywords: ["Contact", "Hire Developer", "Collaboration", "Get in touch", name],
    openGraph: {
      title: `Contact | ${name}`,
      description: `Get in touch with ${name}.`,
      url: "/contact",
    },
    twitter: {
      title: `Contact | ${name}`,
      description: `Get in touch with ${name}.`,
    },
  };
}

export default async function ContactPage() {
  const data = await getContactData();
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact",
        "item": `${baseUrl}/contact`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ContactPageContent {...data} />
    </>
  );
}