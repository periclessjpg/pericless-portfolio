// MODE ÉDITION LOCAL : enregistre le cadrage d'une image (champ "position" de infos.json).
// Sur le site publié (production), cette adresse répond toujours 404.
//
// Mêmes protections que l'envoi d'images : développement uniquement, requêtes locales
// uniquement, image vérifiée dans public/artworks. Seul infos.json est modifié
// (les autres réglages qu'il contient sont conservés). Aucune suppression de fichier.

import {
  checkLocalRequest,
  errorResponse,
  isDevelopment,
  notFoundResponse,
  resolveArtworkFile,
} from "../../../lib/dev-guard";

export async function POST(request: Request) {
  // 1. Uniquement en développement.
  if (!isDevelopment()) return notFoundResponse();

  const fs = await import("node:fs");
  const path = await import("node:path");

  // 2. Requête locale uniquement.
  const forbidden = checkLocalRequest(request);
  if (forbidden) return errorResponse(forbidden, 403);

  let body: { id?: unknown; x?: unknown; y?: unknown; reset?: unknown };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request");
  }

  // 3. Image existante dans public/artworks.
  const target = resolveArtworkFile(String(body.id ?? ""));
  if ("error" in target) return errorResponse(target.error);

  // Cadrage : deux pourcentages entre 0 et 100, arrondis.
  const reset = body.reset === true;
  const x = Math.round(Number(body.x));
  const y = Math.round(Number(body.y));
  if (!reset && (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 100 || y < 0 || y > 100)) {
    return errorResponse("Invalid position");
  }

  // Mise à jour de infos.json (le reste du fichier est conservé).
  const infosPath = path.resolve(target.dir, "infos.json");
  let infos: Record<string, Record<string, unknown>> = {};
  if (fs.existsSync(infosPath)) {
    try {
      infos = JSON.parse(fs.readFileSync(infosPath, "utf8"));
    } catch {
      return errorResponse("infos.json is unreadable: please fix it by hand first");
    }
  }

  const entry = { ...(infos[target.fileName] ?? {}) };
  if (reset) delete entry.position;
  else entry.position = `${x}% ${y}%`;

  if (Object.keys(entry).length > 0) infos[target.fileName] = entry;
  else delete infos[target.fileName];

  fs.writeFileSync(infosPath, `${JSON.stringify(infos, null, 2)}\n`);
  return Response.json({ position: reset ? null : `${x}% ${y}%` });
}

/** Toute autre méthode (ex. simple visite de l'adresse) : 404, en développement comme en production. */
export function GET() {
  return notFoundResponse();
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
