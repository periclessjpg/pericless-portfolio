// MODE ÉDITION LOCAL : enregistre une image déposée sur le site pendant `npm run dev`.
// Sur le site publié (production), cette adresse répond toujours 404.
//
// Sécurité (dans l'ordre) :
// 1. 404 si on n'est pas en développement ;
// 2. requête locale uniquement (Host, Origin, en-tête x-dev-upload) ;
// 3. dossier de destination pris dans une liste blanche, sans "..", sans lien symbolique ;
// 4. vrai format d'image vérifié, 25 Mo maximum par fichier, 30 fichiers maximum ;
// 5. nom de fichier généré par le serveur, jamais d'écrasement ;
// 6. orientation corrigée, métadonnées (GPS compris) supprimées, 2400 px maximum, WebP qualité 85 ;
// 7. aucune commande, aucune opération Git.

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

  // Modules chargés seulement en développement.
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { MAX_FILES, availableName, cleanName, nextPrefix, processImage, readInfosFile, writeInfosFile } =
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

  // 3. Destination (liste blanche).
  const destination = resolveUploadDirectory(
    String(form.get("category") ?? ""),
    String(form.get("filter") ?? ""),
  );
  if ("error" in destination) return errorResponse(destination.error);
  const dir = destination.dir;

  // 4. Nombre de fichiers.
  const files = form.getAll("files").filter((value): value is File => value instanceof File);
  if (files.length === 0) return errorResponse("No file received");
  if (files.length > MAX_FILES) return errorResponse(`Maximum ${MAX_FILES} files per upload`);
  const titles = form.getAll("titles").map((value) => String(value).trim().slice(0, 120));

  const saved: { file: string; title?: string }[] = [];
  const errors: { name: string; error: string }[] = [];

  for (const [index, file] of files.entries()) {
    // 4 et 6. Contrôle du fichier, puis optimisation.
    const processed = await processImage(file);
    if ("error" in processed) {
      errors.push({ name: file.name, error: processed.error });
      continue;
    }

    // 5. Nom généré : numéro suivant + nom nettoyé, jamais d'écrasement.
    const fileName = availableName(dir, nextPrefix(dir), cleanName(file.name));
    const target = path.resolve(dir, fileName);
    if (!isInsideArtworks(target)) {
      errors.push({ name: file.name, error: "Invalid destination" });
      continue;
    }
    try {
      // "wx" : échoue si le fichier existe déjà (aucun écrasement possible).
      fs.writeFileSync(target, processed.output, { flag: "wx" });
    } catch {
      errors.push({ name: file.name, error: "Could not save the file" });
      continue;
    }

    // Titre facultatif : ajouté dans infos.json (le reste du fichier est conservé).
    const title = titles[index];
    if (title) {
      const read = readInfosFile(dir);
      if ("error" in read) {
        errors.push({ name: file.name, error: "Saved, but infos.json is unreadable: title not saved" });
      } else {
        read.infos[fileName] = { ...(read.infos[fileName] ?? {}), title };
        writeInfosFile(dir, read.infos);
      }
    }

    saved.push({ file: fileName, title: title || undefined });
  }

  const status = saved.length === 0 ? 400 : 200;
  return Response.json({ saved, errors }, { status });
}

/** Toute autre méthode (ex. simple visite de l'adresse) : 404, en développement comme en production. */
export function GET() {
  return notFoundResponse();
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
