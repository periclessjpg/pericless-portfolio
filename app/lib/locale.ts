// Langue de la page en cours (côté serveur) : lue dans l'adresse (dossier app/[lang]/)
// grâce à next/root-params, sans avoir à la transmettre de composant en composant.

import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, localizeHref, type Locale, type Localized } from "./i18n";

export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!isLocale(value)) notFound();
  return value;
}

/** Adresse d'une page du site dans la langue en cours ("/about" -> "/fr/about" en français). */
export async function localHref(href: string): Promise<string> {
  return localizeHref(href, await getLocale());
}

/** Choisit le texte de la langue en cours. */
export async function pick(text: Localized): Promise<string> {
  return text[await getLocale()];
}
