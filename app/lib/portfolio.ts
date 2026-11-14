// Portfolio en PDF : fichier public/portfolio.pdf (déposé avec la zone de la page Contact
// en mode édition local). Les boutons de téléchargement ne s'affichent que s'il existe.

import "server-only";

import fs from "node:fs";
import path from "node:path";
import { site } from "../data/site";

/** Adresse du fichier sur le site. */
export const PORTFOLIO_URL = "/portfolio.pdf";

/** Nom proposé au visiteur quand il télécharge le fichier : "Rayan-Houstti-Portfolio.pdf". */
export const PORTFOLIO_DOWNLOAD_NAME = `${site.name.trim().replace(/\s+/g, "-")}-Portfolio.pdf`;

/** true si public/portfolio.pdf existe. */
export function hasPortfolio(): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", "portfolio.pdf"));
}
