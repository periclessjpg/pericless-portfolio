// Langues du site : anglais (par défaut) et français.
//
// Adresses :
// - anglais : adresses sans préfixe (/about, /concept-art…) ;
// - français : les mêmes adresses précédées de /fr (/fr/about, /fr/concept-art…).
// En interne, toutes les pages sont rangées dans app/[lang]/ : proxy.ts (à la racine
// du projet) fait correspondre /about à /en/about sans changer l'adresse affichée.
// (Aucun accès aux fichiers ici : ce module sert aussi dans le navigateur.)

export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Nom de chaque langue, affiché dans le sélecteur de langue. */
export const LOCALE_LABELS: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  fr: { short: "FR", name: "Français" },
};

/** Code utilisé pour les aperçus de partage (Open Graph). */
export const OG_LOCALES: Record<Locale, string> = { en: "en_US", fr: "fr_FR" };

/** Cookie qui retient la langue choisie avec le sélecteur. */
export const LOCALE_COOKIE = "lang";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Texte disponible dans chaque langue. */
export type Localized = Record<Locale, string>;

/**
 * Adresse d'une page dans une langue : localizeHref("/about", "fr") -> "/fr/about".
 * Les liens externes, mailto: et ancres (#…) sont laissés tels quels.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const path = stripLocale(href).path;
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Sépare la langue de l'adresse : "/fr/about" -> { locale: "fr", path: "/about" }. */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first)) return { locale: first, path: `/${rest.join("/")}` };
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}
