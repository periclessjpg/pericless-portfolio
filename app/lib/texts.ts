// Lecture des textes du site (côté serveur), dans la langue de la page :
// valeurs par défaut de texts-defaults.ts, remplacées par celles de
// content/texts.json (anglais) et content/texts.fr.json (français),
// modifiées en mode édition local ou à la main.
// Un fichier absent ou illisible ne casse jamais le site : les textes par défaut s'affichent.

import "server-only";

import fs from "node:fs";
import path from "node:path";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import { getLocale } from "./locale";
import { buildTexts, type Texts } from "./texts-defaults";

/** Fichier des textes modifiés d'une langue (à la racine du projet, hors du dossier public). */
export function textsFile(locale: Locale): string {
  const name = locale === DEFAULT_LOCALE ? "texts.json" : `texts.${locale}.json`;
  return path.join(process.cwd(), "content", name);
}

/** Contenu d'un fichier de textes (null s'il est absent ou illisible). */
export function readSavedTexts(locale: Locale): unknown {
  const file = textsFile(locale);
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT" && process.env.NODE_ENV === "development") {
      console.warn(`[texts] ${path.relative(process.cwd(), file)} illisible, textes par défaut utilisés :`, error);
    }
    return null;
  }
}

/** Textes d'une langue donnée. */
export function getTextsFor(locale: Locale): Texts {
  const savedEn = readSavedTexts(DEFAULT_LOCALE);
  return buildTexts(locale, savedEn, locale === DEFAULT_LOCALE ? null : readSavedTexts(locale));
}

/**
 * Textes "d'origine" d'une langue, sans ses propres modifications
 * (bouton "Original text" du mode édition local).
 */
export function getBaseTextsFor(locale: Locale): Texts {
  return buildTexts(locale, locale === DEFAULT_LOCALE ? null : readSavedTexts(DEFAULT_LOCALE), null);
}

/** Textes de la langue de la page en cours. */
export async function getTexts(): Promise<Texts> {
  return getTextsFor(await getLocale());
}
