import type { Metadata } from "next";
import { site } from "../data/site";

/**
 * Adresse publique du site, utilisée pour les aperçus de partage (Open Graph).
 * Sur Vercel, elle est fournie automatiquement. Quand pericless.fr sera branché,
 * tu pourras la remplacer par "https://pericless.fr".
 */
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: { src: string; alt: string; width: number; height: number };
};

/** Crée le titre, la description et l'aperçu de partage d'une page. */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      ...(image && {
        images: [
          { url: image.src, alt: image.alt, width: image.width, height: image.height },
        ],
      }),
    },
  };
}
