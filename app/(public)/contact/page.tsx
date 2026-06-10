import ContactPageContent from "@/components/ContactPageContent";
import { PersonalInfo } from "@/types/types-about";
import { SocialLink } from "@/types/types-contact";
import { getCachedData } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { PersonalInfo as PrismaPersonalInfo } from "@prisma/client";

async function getContactData() {
  const [personalInfo, socialLinks] = await Promise.all([
    getCachedData<PersonalInfo | null>("personal-info", () =>
      prisma.personalInfo.findFirst() as any
    ),
    getCachedData<SocialLink[]>("social-links", () =>
      prisma.socialLinks.findMany({
        orderBy: { platform: "asc" },
      })
    ),
  ]);

  return {
    personalInfo,
    socialLinks,
  };
}


export async function generateMetadata() {
  let personalInfo: PersonalInfo | null = null;
  try {
    personalInfo = await getCachedData<PersonalInfo | null>("personal-info", () =>
      prisma.personalInfo.findFirst() as any
    );
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