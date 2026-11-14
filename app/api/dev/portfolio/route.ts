// MODE ÉDITION LOCAL : enregistre (ou retire) le portfolio PDF de la page Contact,
// toujours au même endroit : public/portfolio.pdf.
// Sur le site publié (production), cette adresse répond toujours 404.
//
// Sécurité (dans l'ordre) :
// 1. 404 si on n'est pas en développement ;
// 2. requête locale uniquement (Host, Origin, en-tête x-dev-upload) ;
// 3. destination fixe (public/portfolio.pdf), dossier public/ jamais un lien symbolique ;
// 4. vrai fichier PDF vérifié (début du fichier "%PDF-"), 50 Mo maximum ;
// 5. l'ancien fichier n'est jamais effacé : il est déplacé dans la corbeille .artworks-trash/ ;
// 6. aucune commande, aucune opération Git.

import { checkLocalRequest, errorResponse, isDevelopment, notFoundResponse } from "../../../lib/dev-guard";

/** Taille maximale du PDF (50 Mo). */
const MAX_PDF_SIZE = 50 * 1024 * 1024;

export async function POST(request: Request) {
  // 1. Uniquement en développement.
  if (!isDevelopment()) return notFoundResponse();

  const fs = await import("node:fs");
  const path = await import("node:path");
  const { TRASH_ROOT } = await import("../../../lib/dev-images");

  // 2. Requête locale uniquement.
  const forbidden = checkLocalRequest(request);
  if (forbidden) return errorResponse(forbidden, 403);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorResponse("Invalid form data");
  }

  // 3. Destination fixe.
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir) || fs.lstatSync(publicDir).isSymbolicLink()) return errorResponse("Invalid folder");
  const target = path.join(publicDir, "portfolio.pdf");

  /** Déplace le PDF actuel dans la corbeille (jamais effacé). */
  function moveCurrentToTrash() {
    if (!fs.existsSync(target)) return;
    if (fs.existsSync(TRASH_ROOT) && fs.lstatSync(TRASH_ROOT).isSymbolicLink()) {
      throw new Error("Trash folder is a symbolic link");
    }
    fs.mkdirSync(TRASH_ROOT, { recursive: true });
    const stamp = new Date().toISOString().slice(0, 19).replace("T", "_").replace(/:/g, "-");
    let name = `${stamp}__portfolio.pdf`;
    for (let n = 2; fs.existsSync(path.join(TRASH_ROOT, name)); n++) name = `${stamp}-${n}__portfolio.pdf`;
    try {
      fs.renameSync(target, path.join(TRASH_ROOT, name));
    } catch {
      // Autre disque : copie puis retrait de l'original (c'est un déplacement, pas une perte).
      fs.copyFileSync(target, path.join(TRASH_ROOT, name), fs.constants.COPYFILE_EXCL);
      fs.unlinkSync(target);
    }
  }

  // Retirer le portfolio (il part dans la corbeille).
  if (form.get("action") === "remove") {
    try {
      moveCurrentToTrash();
    } catch {
      return errorResponse("Could not move the old PDF to the trash", 500);
    }
    return Response.json({ removed: true });
  }

  // 4. Fichier PDF valide.
  const file = form.get("file");
  if (!(file instanceof File)) return errorResponse("No file received");
  if (file.size === 0) return errorResponse("Empty file");
  if (file.size > MAX_PDF_SIZE) return errorResponse("File larger than 50 MB");
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.subarray(0, 5).toString("latin1") !== "%PDF-") return errorResponse("This file is not a PDF");

  // 5. Ancien fichier dans la corbeille, puis écriture (fichier temporaire, puis renommage).
  const temp = path.join(publicDir, `.portfolio-upload-${process.pid}-${Date.now()}.tmp`);
  try {
    fs.writeFileSync(temp, buffer, { flag: "wx" });
    moveCurrentToTrash();
    fs.renameSync(temp, target);
  } catch {
    if (fs.existsSync(temp)) fs.unlinkSync(temp);
    return errorResponse("Could not save the PDF", 500);
  }

  return Response.json({ saved: "portfolio.pdf", size: buffer.length });
}

/** Toute autre méthode (ex. simple visite de l'adresse) : 404, en développement comme en production. */
export function GET() {
  return notFoundResponse();
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
