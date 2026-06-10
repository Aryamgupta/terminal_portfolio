const SLUG_TO_TITLE: Record<string, string> = {
  "paykut": "Paykut — Merchant Growth & Engagement Platform",
  "developer-portfolio": "Developer Portfolio (Admin-Driven Portfolio System)",
  "techtac": "TechTac Landing Page",
  "ichat": "iChat",
  "streamify-ai": "Streamify: AI-Powered CCTV NVR System",
  "system-architect": "System Architect — Cyberpunk Linux Live Wallpaper & Telemetry Daemon",
  "bonafide-social": "Bonafide Social Group — Hybrid Serverless CMS & Web Portal",
};

const TITLE_TO_SLUG = Object.fromEntries(
  Object.entries(SLUG_TO_TITLE).map(([slug, title]) => [title, slug])
);

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Returns a clean URL slug for a given project title.
 * Uses custom mappings if available, otherwise falls back to a standard slugify function.
 */
export function getProjectSlug(title: string): string {
  if (TITLE_TO_SLUG[title]) {
    return TITLE_TO_SLUG[title];
  }
  return slugify(title);
}

/**
 * Tries to find the exact database title from a URL slug.
 * Returns null if not mapped.
 */
export function getProjectTitleBySlug(slug: string): string | null {
  return SLUG_TO_TITLE[slug.toLowerCase()] || null;
}
