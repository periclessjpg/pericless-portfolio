// Lecture de la typographie (côté serveur) : content/typography.json, nettoyé.
// Un fichier absent ou illisible ne casse jamais le site : la typographie d'origine s'affiche.

import "server-only";

import fs from "node:fs";
import path from "node:path";
import { sanitizeTypography, type Typography } from "./typography";

/** Fichier des réglages typographiques (à la racine du projet, hors du dossier public). */
export const TYPOGRAPHY_FILE = path.join(process.cwd(), "content", "typography.json");

export function getTypography(): Typography {
  try {
    return sanitizeTypography(JSON.parse(fs.readFileSync(TYPOGRAPHY_FILE, "utf8")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT" && process.env.NODE_ENV === "development") {
      console.warn("[typography] content/typography.json illisible, typographie d'origine utilisée :", error);
    }
    return sanitizeTypography(null);
  }
}
