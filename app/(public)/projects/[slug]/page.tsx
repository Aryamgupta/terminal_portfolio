import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getProjectTitleBySlug, slugify } from "@/lib/slugs";
import { Project, SkillCategory, TechIcon } from "@prisma/client";
import ProjectWorkspace from "@/components/project/ProjectWorkspace";
import { getCachedData } from "@/lib/cache";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const projects = await getCachedData<Project[]>("projects", () =>
      prisma.project.findMany()
    );
    const mappedTitle = getProjectTitleBySlug(slug);
    const project = projects.find(
      (p: Project) =>
        (mappedTitle && p.title === mappedTitle) ||
        slugify(p.title) === slug
    );
    if (project) return project;
  } catch (err) {
    console.error("KV fetch failed in slug route", err);
  }

  // 2. Fallback direct db lookup if something failed
  try {
    const mappedTitle = getProjectTitleBySlug(slug);
    if (mappedTitle) {
      const project = await prisma.project.findFirst({
        where: { title: mappedTitle },
      });
      if (project) return project;
    }

    const allProjects = await prisma.project.findMany();
    const project = allProjects.find((p: Project) => slugify(p.title) === slug);
    if (project) return project;
  } catch (err) {
    console.error("Prisma lookup failed in slug route", err);
  }

  return null;
}

async function getTechIconMap(): Promise<Record<string, string>> {
  try {
    const skills = await getCachedData<{ categories: SkillCategory[]; icons: any[] } | null>("skills", async () => {
      const [categories, icons] = await Promise.all([
        prisma.skillCategory.findMany(),
        prisma.techIcon.findMany(),
      ]);
      return { categories, icons };
    });
    
    if (skills) {
      const icons = skills.icons || [];
      const map: Record<string, string> = {};
      icons.forEach((icon: any) => {
        map[icon.id] = icon.svg || "";
      });
      return map;
    }
  } catch (err) {
    console.error("KV skills fetch failed", err);
  }

  try {
    const icons = await prisma.techIcon.findMany();
    const map: Record<string, string> = {};
    icons.forEach((icon: any) => {
      map[icon.id] = icon.svg || "";
    });
    return map;
  } catch (err) {
    console.error("Prisma skills lookup failed", err);
  }

  return {};
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project case study could not be found.",
    };
  }

  let seoTitle = `${project.title} | Case Study`;
  let seoDesc = project.description;

  if (project.caseStudy) {
    try {
      const parsed = JSON.parse(project.caseStudy);
      if (parsed.seo?.title) seoTitle = parsed.seo.title;
      if (parsed.seo?.description) seoDesc = parsed.seo.description;
    } catch (e) {}
  }

  return {
    title: seoTitle,
    description: seoDesc,
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `/projects/${slug}`,
    },
    twitter: {
      title: seoTitle,
      description: seoDesc,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const techIconMap = await getTechIconMap();
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Breadcrumbs Schema
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${baseUrl}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${baseUrl}/projects/${slug}`,
      },
    ],
  };

  // TechArticle case study schema
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: project.title,
    description: project.description,
    url: `${baseUrl}/projects/${slug}`,
    image: project.imageLink || undefined,
    about: project.techStack.map((tech) => ({
      "@type": "Thing",
      name: tech,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <ProjectWorkspace project={project} techIconMap={techIconMap} />
    </>
  );
}
