// MODE ÉDITION LOCAL : retire une image du site en la déplaçant dans la corbeille
// .artworks-trash/ (à la racine du projet, ignorée par Git). Rien n'est effacé :
// tu peux remettre le fichier dans son dossier pour le récupérer.
// Sur le site publié (production), cette adresse répond toujours 404.
//
// Mêmes protections que l'envoi : développement uniquement, requêtes locales
// uniquement, image vérifiée dans public/artworks (ni "..", ni lien symbolique).

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

  const { moveToTrash, readInfosFile, writeInfosFile } = await import("../../../lib/dev-images");

  // 2. Requête locale uniquement.
  const forbidden = checkLocalRequest(request);
  if (forbidden) return errorResponse(forbidden, 403);

  let body: { id?: unknown };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request");
  }

  // 3. Image existante dans public/artworks.
  const target = resolveArtworkFile(String(body.id ?? ""));
  if ("error" in target) return errorResponse(target.error);

  // Réglages de l'image (titre, cadrage…) : sauvegardés dans la corbeille avec elle.
  const read = readInfosFile(target.dir);
  if ("error" in read) return errorResponse(read.error);
  const entry = read.infos[target.fileName];

  let trashName: string;
  try {
    trashName = moveToTrash(target.dir, target.fileName, entry).trashName;
  } catch {
    return errorResponse("Could not move the image to the trash", 500);
  }

  if (entry) {
    delete read.infos[target.fileName];
    writeInfosFile(target.dir, read.infos);
  }

  return Response.json({ trashed: trashName });
}

/** Toute autre méthode (ex. simple visite de l'adresse) : 404, en développement comme en production. */
export function GET() {
  return notFoundResponse();
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
