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
// 7. aucune suppression, aucune commande, aucune opération Git.

import {
  checkLocalRequest,
  errorResponse,
  isDevelopment,
  isInsideArtworks,
  notFoundResponse,
  resolveUploadDirectory,
} from "../../../lib/dev-guard";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 Mo
const MAX_FILES = 30;
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const MAX_SIDE = 2400;
const WEBP_QUALITY = 85;

export async function POST(request: Request) {
  // 1. Uniquement en développement.
  if (!isDevelopment()) return notFoundResponse();

  // Modules chargés seulement en développement.
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { default: sharp } = await import("sharp");
  const { baseName, slugify } = await import("../../../lib/artwork-names");

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

  // 4. Contrôle des fichiers.
  const files = form.getAll("files").filter((value): value is File => value instanceof File);
  if (files.length === 0) return errorResponse("No file received");
  if (files.length > MAX_FILES) return errorResponse(`Maximum ${MAX_FILES} files per upload`);
  const titles = form.getAll("titles").map((value) => String(value).trim().slice(0, 120));

  const saved: { file: string; title?: string }[] = [];
  const errors: { name: string; error: string }[] = [];

  for (const [index, file] of files.entries()) {
    const extension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      errors.push({ name: file.name, error: "Format not accepted (jpg, jpeg, png, webp, avif)" });
      continue;
    }
    if (file.size > MAX_FILE_SIZE) {
      errors.push({ name: file.name, error: "File larger than 25 MB" });
      continue;
    }

    const input = Buffer.from(await file.arrayBuffer());

    // Vrai type de l'image (lu dans le contenu, pas dans l'extension).
    let format: string | undefined;
    let compression: string | undefined;
    try {
      const metadata = await sharp(input).metadata();
      format = metadata.format;
      compression = metadata.compression;
    } catch {
      errors.push({ name: file.name, error: "Not a valid image" });
      continue;
    }
    const realImage =
      format === "jpeg" || format === "png" || format === "webp" || (format === "heif" && compression === "av1");
    if (!realImage) {
      errors.push({ name: file.name, error: "File content is not a jpg, png, webp or avif image" });
      continue;
    }

    // 6. Optimisation : orientation corrigée, 2400 px max, WebP 85.
    // sharp ne recopie aucune métadonnée (EXIF, GPS…) dans le fichier final.
    let output: Buffer;
    try {
      output = await sharp(input)
        .rotate()
        .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
    } catch {
      errors.push({ name: file.name, error: "Could not process this image" });
      continue;
    }

    // 5. Nom généré : numéro suivant + nom nettoyé, jamais d'écrasement.
    const existing = fs.readdirSync(dir);
    const nextNumber =
      existing.reduce((max, name) => {
        const match = /^(\d+)-/.exec(name);
        return match ? Math.max(max, Number(match[1])) : max;
      }, 0) + 1;
    const prefix = String(nextNumber).padStart(2, "0");
    const cleanName = slugify(baseName(file.name)) || "image";

    let fileName = `${prefix}-${cleanName}.webp`;
    for (let suffix = 2; existing.includes(fileName); suffix++) {
      fileName = `${prefix}-${cleanName}-${suffix}.webp`;
    }
    const target = path.resolve(dir, fileName);
    if (!isInsideArtworks(target)) {
      errors.push({ name: file.name, error: "Invalid destination" });
      continue;
    }

    try {
      // "wx" : échoue si le fichier existe déjà (aucun écrasement possible).
      fs.writeFileSync(target, output, { flag: "wx" });
    } catch {
      errors.push({ name: file.name, error: "Could not save the file" });
      continue;
    }

    // Titre facultatif : ajouté dans infos.json (le reste du fichier est conservé).
    const title = titles[index];
    if (title) {
      const infosPath = path.resolve(dir, "infos.json");
      let infos: Record<string, Record<string, unknown>> = {};
      let readable = true;
      if (fs.existsSync(infosPath)) {
        try {
          infos = JSON.parse(fs.readFileSync(infosPath, "utf8"));
        } catch {
          readable = false;
        }
      }
      if (readable) {
        infos[fileName] = { ...(infos[fileName] ?? {}), title };
        fs.writeFileSync(infosPath, `${JSON.stringify(infos, null, 2)}\n`);
      } else {
        errors.push({ name: file.name, error: "Saved, but infos.json is unreadable: title not saved" });
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
