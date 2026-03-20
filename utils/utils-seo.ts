// utils/seo.ts
import { AboutPageMetadata, PersonalInfo } from "@/types/types-about";

interface SEOMeta {
  title: string;
  description: string;
  keywords: string;
  author: string;
}

/**
 * generateMetadata - Creates SEO-optimized metadata
 * 
 * Follows best practices for:
 * - Meta tag generation
 * - Keyword formatting
 * - Description length limits
 */
export function generateMetadata(metadata: AboutPageMetadata): SEOMeta {
  const titleMaxLength = 60;
  const descriptionMaxLength = 160;
  const keywordMaxItems = 10;

  const title =
    metadata.title.length > titleMaxLength
      ? metadata.title.slice(0, titleMaxLength) + "..."
      : metadata.title;

  const description =
    metadata.description.length > descriptionMaxLength
      ? metadata.description.slice(0, descriptionMaxLength) + "..."
      : metadata.description;

  const keywords = metadata.keywords
    .slice(0, keywordMaxItems)
    .join(", ");

  return {
    title,
    description,
    keywords,
    author: metadata.author || "Developer",
  };
}

/**
 * generateStructuredData - Creates JSON-LD structured data
 * 
 * Improves SEO by providing semantic markup for search engines.
 */
export function generateStructuredData(
  personalInfo: PersonalInfo,
  baseUrl: string = typeof window !== "undefined" ? window.location.origin : ""
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personalInfo?.name,
    url: baseUrl,
    jobTitle: personalInfo?.role?.[0],
    worksFor: {
      "@type": "Organization",
      name: personalInfo?.name,
    },
    location: {
      "@type": "Place",
      address: personalInfo?.location,
    },
    email: personalInfo?.email,
    telephone: personalInfo?.phone,
    sameAs: [
      personalInfo?.githubLink,
      personalInfo?.linkedinLink,
      personalInfo?.twitterLink,
    ].filter(Boolean),
  };
}

/**
 * generateBreadcrumbs - Creates breadcrumb schema
 */
export function generateBreadcrumbs(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
