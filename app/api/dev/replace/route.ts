// MODE ÉDITION LOCAL : remplace une image par une nouvelle, au même emplacement.
// - la nouvelle image garde le même numéro (donc la même place dans la page) et le même titre ;
// - son cadrage repart du centre ;
// - l'ancienne image est déplacée dans la corbeille .artworks-trash/ (jamais effacée).
// Sur le site publié (production), cette adresse répond toujours 404.
//
// Mêmes protections que l'envoi : développement uniquement, requêtes locales uniquement,
// image d'origine vérifiée dans public/artworks, nouvelle image contrôlée et optimisée
// (vrai format, 25 Mo max, orientation, métadonnées supprimées, 2400 px, WebP 85).

import {
  checkLocalRequest,
  errorResponse,
  isDevelopment,
  isInsideArtworks,
  notFoundResponse,
  resolveArtworkFile,
} from "../../../lib/dev-guard";

export async function POST(request: Request) {
  // 1. Uniquement en développement.
  if (!isDevelopment()) return notFoundResponse();

  const fs = await import("node:fs");
  const path = await import("node:path");
  const { baseName, humanize } = await import("../../../lib/artwork-names");
  const { availableName, cleanName, moveToTrash, processImage, readInfosFile, writeInfosFile } =
    await import("../../../lib/dev-images");

  // 2. Requête locale uniquement.
  const forbidden = checkLocalRequest(request);
  if (forbidden) return errorResponse(forbidden, 403);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorResponse("Invalid form data");
  }

  // 3. Image à remplacer, existante dans public/artworks.
  const target = resolveArtworkFile(String(form.get("id") ?? ""));
  if ("error" in target) return errorResponse(target.error);

  const files = form.getAll("files").filter((value): value is File => value instanceof File);
  if (files.length !== 1) return errorResponse("Please send exactly one image");

  // 4. Nouvelle image : contrôle et optimisation AVANT de toucher à l'ancienne.
  const processed = await processImage(files[0]);
  if ("error" in processed) return errorResponse(processed.error);

  const read = readInfosFile(target.dir);
  if ("error" in read) return errorResponse(read.error);
  const oldEntry = read.infos[target.fileName] ?? {};

  // 5. Nom : même numéro que l'ancienne + nom de la nouvelle (adresse différente,
  // pour que le navigateur n'affiche pas l'ancienne version gardée en mémoire).
  const prefix = /^(\d+)-/.exec(target.fileName)?.[1] ?? "";
  const newName = availableName(target.dir, prefix, cleanName(files[0].name));
  const newPath = path.resolve(target.dir, newName);
  if (!isInsideArtworks(newPath)) return errorResponse("Invalid destination");

  // L'ancienne image va dans la corbeille (avec ses réglages), puis la nouvelle est écrite.
  let trash: { trashName: string; trashPath: string };
  try {
    trash = moveToTrash(target.dir, target.fileName, oldEntry);
  } catch {
    return errorResponse("Could not move the old image to the trash", 500);
  }
  try {
    fs.writeFileSync(newPath, processed.output, { flag: "wx" });
  } catch {
    // Échec : on remet l'ancienne image à sa place.
    try {
      fs.renameSync(trash.trashPath, path.join(target.dir, target.fileName));
    } catch {
      // Elle reste récupérable dans la corbeille.
    }
    return errorResponse("Could not save the new image", 500);
  }

  // Réglages : même titre (celui de infos.json, ou celui déduit de l'ancien nom),
  // année et description conservées, cadrage remis au centre.
  const rest = { ...oldEntry };
  delete rest.position;
  const title =
    typeof oldEntry.title === "string" && oldEntry.title.trim()
      ? oldEntry.title
      : humanize(baseName(target.fileName));
  delete read.infos[target.fileName];
  read.infos[newName] = { ...rest, title };
  writeInfosFile(target.dir, read.infos);

  return Response.json({ file: newName, trashed: trash.trashName });
}

/** Toute autre méthode (ex. simple visite de l'adresse) : 404, en développement comme en production. */
export function GET() {
  return notFoundResponse();
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
