// Lecture des textes du site (côté serveur) : valeurs par défaut de texts-defaults.ts,
// remplacées par celles de content/texts.json (modifiées en mode édition local ou à la main).
// Un fichier absent ou illisible ne casse jamais le site : les textes par défaut s'affichent.

import "server-only";

import fs from "node:fs";
import path from "node:path";
import { mergeTexts, type Texts } from "./texts-defaults";

/** Fichier des textes modifiés (à la racine du projet, hors du dossier public). */
export const TEXTS_FILE = path.join(process.cwd(), "content", "texts.json");

export function getTexts(): Texts {
  try {
    return mergeTexts(JSON.parse(fs.readFileSync(TEXTS_FILE, "utf8")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT" && process.env.NODE_ENV === "development") {
      console.warn("[texts] content/texts.json illisible, textes par défaut utilisés :", error);
    }
    return mergeTexts(null);
  }
}
