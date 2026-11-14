// MODE ÉDITION LOCAL : enregistre un texte du site dans content/texts.json (anglais)
// ou content/texts.fr.json (français), selon la langue de la page modifiée.
// Sur le site publié (production), cette adresse répond toujours 404.
//
// Protections : développement uniquement, requêtes locales uniquement (Host, Origin,
// en-tête x-dev-upload), fichiers fixes (content/texts.json, content/texts.<langue>.json,
// langue prise dans la liste des langues du site), identifiant de texte pris dans la
// liste des textes connus, texte brut uniquement (5000 caractères max, caractères de
// contrôle retirés ; le site l'affiche toujours comme du texte, jamais comme du code HTML).

import { checkLocalRequest, errorResponse, isDevelopment, notFoundResponse } from "../../../lib/dev-guard";

export async function POST(request: Request) {
  // 1. Uniquement en développement.
  if (!isDevelopment()) return notFoundResponse();

  const fs = await import("node:fs");
  const path = await import("node:path");
  const { cleanText, isSharedTextKey, isTextKey } = await import("../../../lib/texts-defaults");
  const { DEFAULT_LOCALE, isLocale } = await import("../../../lib/i18n");
  const { getBaseTextsFor, textsFile } = await import("../../../lib/texts");

  // 2. Requête locale uniquement.
  const forbidden = checkLocalRequest(request);
  if (forbidden) return errorResponse(forbidden, 403);

  let body: { key?: unknown; value?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request");
  }

  // 3. Texte connu, langue connue, valeur en texte brut.
  const key = String(body.key ?? "");
  if (!isTextKey(key)) return errorResponse("Unknown text");
  const locale = body.locale === undefined ? DEFAULT_LOCALE : body.locale;
  if (!isLocale(locale)) return errorResponse("Unknown language");
  const value = cleanText(body.value);
  if (value === null) return errorResponse("Invalid text");

  // Email, nom, réseaux… sont communs à toutes les langues : toujours dans content/texts.json.
  const target = isSharedTextKey(key) ? DEFAULT_LOCALE : locale;
  const file = textsFile(target);

  // Dossier content/ à la racine du projet (créé si besoin, jamais un lien symbolique).
  const dir = path.dirname(file);
  if (fs.existsSync(dir) && fs.lstatSync(dir).isSymbolicLink()) return errorResponse("Invalid folder");
  fs.mkdirSync(dir, { recursive: true });

  // Textes déjà enregistrés (fichier illisible : on n'y touche pas).
  let saved: Record<string, string> = {};
  if (fs.existsSync(file)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
      if (parsed && typeof parsed === "object") saved = parsed;
    } catch {
      return errorResponse(`content/${path.basename(file)} is unreadable: please fix it by hand first`);
    }
  }

  // Seuls les textes différents de l'original sont gardés dans le fichier.
  if (value === getBaseTextsFor(target)[key]) delete saved[key];
  else saved[key] = value;

  const sorted = Object.fromEntries(Object.entries(saved).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(file, `${JSON.stringify(sorted, null, 2)}\n`);

  return Response.json({ key, value, locale: target });
}

/** Toute autre méthode (ex. simple visite de l'adresse) : 404, en développement comme en production. */
export function GET() {
  return notFoundResponse();
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
