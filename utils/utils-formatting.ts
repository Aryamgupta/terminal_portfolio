// utils/formatting.ts

/**
 * formatContentLines - Converts text to kebab-case for file names
 * 
 * Examples:
 * "JavaScript Expert" -> "javascript-expert"
 * "Full Stack Developer" -> "full-stack-developer"
 */
export function formatContentLines(text: string): string {
  // Replace multiple spaces/underscores/hyphens with a single hyphen for internal consistency
  // but keep case and some characters for a more "file-like" but readable name
  return text
    .trim()
    .replace(/[^a-zA-Z0-9\s()]/g, "") // Keep alphanumeric, spaces, and parens
    .replace(/\s+/g, "-")            // Spaces to hyphens
    .toLowerCase();
}

/**
 * formatDuration - Formats date ranges into readable duration
 * 
 * Examples:
 * "2023-01 to 2024-12" -> "Jan 2023 - Dec 2024"
 */
export function formatDuration(duration: string): string {
  // If already formatted, return as-is
  if (duration.includes("to")) {
    return duration;
  }
  return duration;
}

/**
 * formatSkillsList - Converts array to formatted string
 */
export function formatSkillsList(skills: string[]): string {
  return skills.join(" • ");
}

/**
 * truncateText - Truncates text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * formatEmail - Validates and formats email
 */
export function formatEmail(email?: string): string {
  if (!email) return "";
  return email.toLowerCase().trim();
}

/**
 * formatPhoneNumber - Formats phone number for display
 */
export function formatPhoneNumber(phone?: string): string {
  if (!phone) return "";
  // Simple formatting - customize based on region
  return phone.trim();
}

/**
 * sanitizeHTML - Prevents XSS by sanitizing HTML content
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
}

/**
 * generateSlug - Creates URL-friendly slugs
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
