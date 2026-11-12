// MODE ÉDITION LOCAL : change l'ordre des images d'un dossier, ou des cartes (filtres)
// d'une catégorie, en renumérotant les noms (01-, 02-…). Rien n'est effacé ni écrasé :
// les fichiers sont seulement renommés, et les réglages de infos.json suivent.
// Sur le site publié (production), cette adresse répond toujours 404.
//
// Mêmes protections que les autres routes : développement uniquement, requêtes locales
// uniquement, dossiers pris dans une liste blanche, et la nouvelle liste doit contenir
// exactement les mêmes éléments que le dossier (ni ajout, ni oubli, ni chemin).

import {
  checkLocalRequest,
  errorResponse,
  isDevelopment,
  isInsideArtworks,
  notFoundResponse,
  resolveFilterCategory,
  resolveUploadDirectory,
} from "../../../lib/dev-guard";

const MAX_ITEMS = 500;
const IMAGE_CATEGORIES = ["concept-art", "illustration", "home", "about"];

export async function POST(request: Request) {
  // 1. Uniquement en développement.
  if (!isDevelopment()) return notFoundResponse();

  const fs = await import("node:fs");
  const path = await import("node:path");
  const { IMAGE_EXTENSIONS, isHidden, slugify } = await import("../../../lib/artwork-names");
  const { readInfosFile, writeInfosFile } = await import("../../../lib/dev-images");

  // 2. Requête locale uniquement.
  const forbidden = checkLocalRequest(request);
  if (forbidden) return errorResponse(forbidden, 403);

  let body: { type?: unknown; category?: unknown; filter?: unknown; order?: unknown };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request");
  }

  const order = body.order;
  if (!Array.isArray(order) || order.length > MAX_ITEMS || order.some((item) => typeof item !== "string")) {
    return errorResponse("Invalid order");
  }
  const wanted = order as string[];
  const category = String(body.category ?? "");

  /** Retire le numéro d'ordre : "03-dragon-knight" -> "dragon-knight". */
  const withoutPrefix = (name: string) => name.replace(/^\d+[\s._-]*/, "");
  const pad = (index: number, total: number) => String(index + 1).padStart(Math.max(2, String(total).length), "0");

  /**
   * Renomme en deux temps (noms temporaires masqués, puis noms finaux) pour ne jamais
   * écraser un élément. En cas d'erreur, remet les noms d'origine.
   */
  function renameAll(dir: string, renames: { from: string; to: string }[]) {
    const changed = renames.filter((r) => r.from !== r.to);
    const stamp = Date.now();
    const temps = changed.map((r, i) => ({ ...r, temp: `.reorder-${stamp}-${i}` }));
    const done: { from: string; to: string }[] = [];
    try {
      for (const r of temps) {
        fs.renameSync(path.join(dir, r.from), path.join(dir, r.temp));
        done.push({ from: r.from, to: r.temp });
      }
      for (const r of temps) {
        const target = path.join(dir, r.to);
        if (fs.existsSync(target)) throw new Error(`Name already used: ${r.to}`);
        fs.renameSync(path.join(dir, r.temp), target);
        done.push({ from: r.temp, to: r.to });
      }
    } catch (error) {
      // Retour en arrière, dans l'ordre inverse.
      for (const step of done.reverse()) {
        try {
          fs.renameSync(path.join(dir, step.to), path.join(dir, step.from));
        } catch {
          // On continue : chaque élément reste au moins sous un nom récupérable.
        }
      }
      throw error;
    }
    return changed.length;
  }

  // ───────────── Ordre des images d'un dossier ─────────────
  if (body.type === "images") {
    if (!IMAGE_CATEGORIES.includes(category)) return errorResponse("Unknown category");
    const destination = resolveUploadDirectory(category, String(body.filter ?? ""));
    if ("error" in destination) return errorResponse(destination.error);
    const dir = destination.dir;

    const current = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && !isHidden(entry.name))
      .map((entry) => entry.name)
      .filter((name) => IMAGE_EXTENSIONS.includes(path.extname(name).toLowerCase()));

    // La nouvelle liste doit être exactement les images du dossier, dans un autre ordre.
    const same = wanted.length === current.length && new Set(wanted).size === wanted.length && wanted.every((n) => current.includes(n));
    if (!same) return errorResponse("The folder has changed: reload the page and try again");

    const renames = wanted.map((name, index) => {
      const extension = path.extname(name);
      const base = withoutPrefix(name.slice(0, -extension.length)) || "image";
      return { from: name, to: `${pad(index, wanted.length)}-${base}${extension}` };
    });
    if (renames.some((r) => !isInsideArtworks(path.resolve(dir, r.to)))) return errorResponse("Invalid name");

    const read = readInfosFile(dir);
    if ("error" in read) return errorResponse(read.error);

    let count: number;
    try {
      count = renameAll(dir, renames);
    } catch {
      return errorResponse("Could not rename the files (is one of them open in another program?)", 500);
    }

    // Les réglages (titre, cadrage…) suivent les fichiers renommés.
    const mapping = new Map(renames.map((r) => [r.from, r.to]));
    const infos: Record<string, Record<string, unknown>> = {};
    for (const [key, value] of Object.entries(read.infos)) infos[mapping.get(key) ?? key] = value;
    if (count > 0 && Object.keys(read.infos).length > 0) writeInfosFile(dir, infos);

    return Response.json({ renamed: count });
  }

  // ───────────── Ordre des cartes (sous-dossiers d'une catégorie) ─────────────
  if (body.type === "filters") {
    const resolved = resolveFilterCategory(category);
    if ("error" in resolved) return errorResponse(resolved.error);
    const dir = resolved.dir;

    const folders = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !isHidden(entry.name))
      .map((entry) => entry.name)
      .filter((name) => slugify(name) !== "all" && slugify(name) !== "");
    const bySlug = new Map(folders.map((name) => [slugify(name), name]));

    const same =
      wanted.length === folders.length && new Set(wanted).size === wanted.length && wanted.every((slug) => bySlug.has(slug));
    if (!same) return errorResponse("The folders have changed: reload the page and try again");

    // Le numéro est ajouté devant le nom : l'adresse de la page (sans numéro) ne change pas.
    const renames = wanted.map((slug, index) => {
      const name = bySlug.get(slug)!;
      return { from: name, to: `${pad(index, wanted.length)}-${withoutPrefix(name) || slug}` };
    });
    if (renames.some((r) => !isInsideArtworks(path.resolve(dir, r.to)))) return errorResponse("Invalid name");

    try {
      return Response.json({ renamed: renameAll(dir, renames) });
    } catch {
      return errorResponse("Could not rename the folders (is one of them open in another program?)", 500);
    }
  }

  return errorResponse("Invalid request");
}

/** Toute autre méthode (ex. simple visite de l'adresse) : 404, en développement comme en production. */
export function GET() {
  return notFoundResponse();
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
