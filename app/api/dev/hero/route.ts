// MODE ÉDITION LOCAL : enregistre les réglages du hero dans public/artworks/hero/settings.json.
// Sur le site publié (production), cette adresse répond toujours 404.
//
// Mêmes protections que les autres routes : développement uniquement, requêtes locales
// uniquement, dossier fixe (public/artworks/hero). Chaque valeur est vérifiée
// (type, limites, choix autorisés, couleur valide, image existante dans hero/).

import {
  checkLocalRequest,
  errorResponse,
  isDevelopment,
  isInsideArtworks,
  notFoundResponse,
  resolveUploadDirectory,
} from "../../../lib/dev-guard";

export async function POST(request: Request) {
  // 1. Uniquement en développement.
  if (!isDevelopment()) return notFoundResponse();

  const fs = await import("node:fs");
  const path = await import("node:path");
  const { IMAGE_EXTENSIONS, isHidden } = await import("../../../lib/artwork-names");
  const { sanitizeHeroSettings } = await import("../../../lib/hero-settings");

  // 2. Requête locale uniquement.
  const forbidden = checkLocalRequest(request);
  if (forbidden) return errorResponse(forbidden, 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request");
  }

  // 3. Dossier fixe : public/artworks/hero.
  const destination = resolveUploadDirectory("hero", "");
  if ("error" in destination) return errorResponse(destination.error);
  const dir = destination.dir;

  // Images existantes du dossier (pour vérifier le choix de l'image).
  const images = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !isHidden(entry.name))
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.includes(path.extname(name).toLowerCase()));

  const settings = sanitizeHeroSettings(body, images);

  const target = path.resolve(dir, "settings.json");
  if (!isInsideArtworks(target)) return errorResponse("Invalid destination");
  fs.writeFileSync(target, `${JSON.stringify(settings, null, 2)}\n`);

  return Response.json({ settings });
}

/** Toute autre méthode (ex. simple visite de l'adresse) : 404, en développement comme en production. */
export function GET() {
  return notFoundResponse();
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
