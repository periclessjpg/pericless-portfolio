// MODE ÉDITION LOCAL : enregistre un texte du site dans content/texts.json.
// Sur le site publié (production), cette adresse répond toujours 404.
//
// Protections : développement uniquement, requêtes locales uniquement (Host, Origin,
// en-tête x-dev-upload), fichier fixe (content/texts.json), identifiant de texte pris
// dans la liste des textes connus, texte brut uniquement (5000 caractères max,
// caractères de contrôle retirés ; le site l'affiche toujours comme du texte, jamais
// comme du code HTML).

import { checkLocalRequest, errorResponse, isDevelopment, notFoundResponse } from "../../../lib/dev-guard";

export async function POST(request: Request) {
  // 1. Uniquement en développement.
  if (!isDevelopment()) return notFoundResponse();

  const fs = await import("node:fs");
  const path = await import("node:path");
  const { DEFAULT_TEXTS, cleanText, isTextKey } = await import("../../../lib/texts-defaults");
  const { TEXTS_FILE } = await import("../../../lib/texts");

  // 2. Requête locale uniquement.
  const forbidden = checkLocalRequest(request);
  if (forbidden) return errorResponse(forbidden, 403);

  let body: { key?: unknown; value?: unknown };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request");
  }

  // 3. Texte connu, valeur en texte brut.
  const key = String(body.key ?? "");
  if (!isTextKey(key)) return errorResponse("Unknown text");
  const value = cleanText(body.value);
  if (value === null) return errorResponse("Invalid text");

  // Dossier content/ à la racine du projet (créé si besoin, jamais un lien symbolique).
  const dir = path.dirname(TEXTS_FILE);
  if (fs.existsSync(dir) && fs.lstatSync(dir).isSymbolicLink()) return errorResponse("Invalid folder");
  fs.mkdirSync(dir, { recursive: true });

  // Textes déjà enregistrés (fichier illisible : on n'y touche pas).
  let saved: Record<string, string> = {};
  if (fs.existsSync(TEXTS_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(TEXTS_FILE, "utf8"));
      if (parsed && typeof parsed === "object") saved = parsed;
    } catch {
      return errorResponse("content/texts.json is unreadable: please fix it by hand first");
    }
  }

  // Seuls les textes différents de l'original sont gardés dans le fichier.
  if (value === DEFAULT_TEXTS[key]) delete saved[key];
  else saved[key] = value;

  const sorted = Object.fromEntries(Object.entries(saved).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(TEXTS_FILE, `${JSON.stringify(sorted, null, 2)}\n`);

  return Response.json({ key, value });
}

/** Toute autre méthode (ex. simple visite de l'adresse) : 404, en développement comme en production. */
export function GET() {
  return notFoundResponse();
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
