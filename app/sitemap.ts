// Plan du site pour Google et les autres moteurs de recherche : /sitemap.xml.
// Chaque page y figure en anglais (/about) et en français (/fr/about), avec l'indication
// que ce sont les deux langues de la même page, et la liste des œuvres qu'elle montre
// (pour Google Images). Se met à jour tout seul quand tu ajoutes des images ou des dossiers.

import type { MetadataRoute } from "next";
import { getAboutArtworks, getGallery, getHero, getHomeArtworks, type Artwork, type GalleryCategory } from "./lib/artworks";
import { LOCALES, localizeHref } from "./lib/i18n";
import { absoluteUrl } from "./lib/site-url";

type Page = { path: string; images: Artwork[]; priority: number };

/** Images d'une sous-page de galerie ("all" ou un filtre). */
function sectionImages(category: GalleryCategory, slug: string): Artwork[] {
  const gallery = getGallery(category);
  if (slug === "all") return gallery.all;
  return gallery.filters.find((filter) => filter.slug === slug)?.artworks ?? [];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const hero = getHero();
  const pages: Page[] = [
    { path: "/", images: [...(hero.image ? [hero.image] : []), ...getHomeArtworks()], priority: 1 },
    { path: "/concept-art", images: [], priority: 0.9 },
    ...["all", ...getGallery("concept-art").filters.map((filter) => filter.slug)].map((slug) => ({
      path: `/concept-art/${slug}`,
      images: sectionImages("concept-art", slug),
      priority: 0.8,
    })),
    { path: "/illustration", images: getGallery("illustration").all, priority: 0.9 },
    ...getGallery("illustration").filters.map((filter) => ({
      path: `/illustration/${filter.slug}`,
      images: filter.artworks,
      priority: 0.8,
    })),
    { path: "/projects", images: [], priority: 0.6 },
    { path: "/about", images: getAboutArtworks("").all, priority: 0.7 },
    { path: "/contact", images: [], priority: 0.7 },
    { path: "/legal", images: [], priority: 0.1 },
  ];

  return pages.flatMap((page) => {
    // Adresses de la page dans chaque langue (indiquées pour chacune des versions).
    const languages = Object.fromEntries(LOCALES.map((locale) => [locale, absoluteUrl(localizeHref(page.path, locale))]));
    const images = [...new Set(page.images.map((image) => absoluteUrl(image.src)))];
    return LOCALES.map((locale) => ({
      url: absoluteUrl(localizeHref(page.path, locale)),
      changeFrequency: "monthly" as const,
      priority: page.priority,
      alternates: { languages },
      ...(images.length > 0 && { images }),
    }));
  });
}
