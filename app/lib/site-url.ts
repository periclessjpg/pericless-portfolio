// Adresse publique du site (sans dépendance : utilisable partout, y compris sitemap.ts et robots.ts).
// Sur Vercel, elle est fournie automatiquement : c'est ton domaine, https://www.rayanhoustti.com
// (rayanhoustti.com redirige vers www). En local : http://localhost:3000.

export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

/** Adresse complète d'une page ou d'un fichier du site : absoluteUrl("/about"). */
export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
