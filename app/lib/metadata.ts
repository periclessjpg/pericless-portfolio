import type { Metadata } from "next";
import { site } from "../data/site";
import { DEFAULT_LOCALE, LOCALES, OG_LOCALES, localizeHref, type Locale, type Localized } from "./i18n";
import { getLocale } from "./locale";

/** Adresse publique du site (définie dans site-url.ts), utilisée pour les aperçus de partage (Open Graph). */
export { siteUrl } from "./site-url";

/** Description générale du site (Google et aperçus de partage). */
export const siteDescription: Localized = {
  en: site.description,
  fr: "Portfolio de Rayan Houstti (Pericless), concept artist, illustrateur et graphiste spécialisé dans le jeu vidéo et l’animation.",
};

/**
 * Adresses de la page dans chaque langue : indique à Google que /about et /fr/about
 * sont la même page en anglais et en français.
 */
export function languageAlternates(path: string, locale: Locale): Metadata["alternates"] {
  return {
    canonical: localizeHref(path, locale),
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, localizeHref(path, l)])),
      "x-default": localizeHref(path, DEFAULT_LOCALE),
    },
  };
}

type PageMetadataInput = {
  /** Titre (le même dans toutes les langues, ou un par langue). */
  title: string | Localized;
  description: string | Localized;
  /** Adresse de la page sans la langue, ex. "/about". */
  path: string;
  image?: { src: string; alt: string; width: number; height: number };
};

/** Crée le titre, la description et l'aperçu de partage d'une page, dans la langue de la page. */
export async function pageMetadata({
  title: titleInput,
  description: descriptionInput,
  path,
  image,
}: PageMetadataInput): Promise<Metadata> {
  const locale = await getLocale();
  const title = typeof titleInput === "string" ? titleInput : titleInput[locale];
  const description = typeof descriptionInput === "string" ? descriptionInput : descriptionInput[locale];

  return {
    title,
    description,
    alternates: languageAlternates(path, locale),
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: localizeHref(path, locale),
      siteName: site.name,
      type: "website",
      locale: OG_LOCALES[locale],
      ...(image && {
        images: [
          { url: image.src, alt: image.alt, width: image.width, height: image.height },
        ],
      }),
    },
  };
}
