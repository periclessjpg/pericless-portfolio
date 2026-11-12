// MODE ÉDITION LOCAL : crée un nouveau filtre (sous-dossier) dans Concept Art ou Illustration.
// Sur le site publié (production), cette adresse répond toujours 404.

import {
  checkLocalRequest,
  errorResponse,
  isDevelopment,
  isInsideArtworks,
  notFoundResponse,
  resolveFilterCategory,
} from "../../../lib/dev-guard";

const README = (label: string, category: string) => `FILTRE "${label.toUpperCase()}"
Glisse ici les images de ce filtre. Elles apparaissent dans la carte "${label}" de la page ${category === "illustration" ? "Illustration" : "Concept Art"}, et aussi dans "All".

FORMATS ACCEPTÉS : .jpg .jpeg .png .webp .avif
TAILLE CONSEILLÉE : côté le plus long jusqu'à 3840 px (4K), WebP ou JPG en haute qualité (90 à 95), idéalement moins de 3 Mo.

- Le numéro au début du nom de fichier fixe l'ordre et n'est pas affiché : 01-dragon-knight.webp
- Pour changer l'ordre des filtres, renomme ce dossier avec un numéro devant (ex. 01-${label.toLowerCase().replace(/\s+/g, "-")}).
- Pour masquer une image sans la supprimer, ajoute "_" devant son nom.

Ce fichier LISEZ-MOI.txt est ignoré par le site.
`;

export async function POST(request: Request) {
  // 1. Uniquement en développement.
  if (!isDevelopment()) return notFoundResponse();

  const fs = await import("node:fs");
  const path = await import("node:path");
  const { humanize, slugify } = await import("../../../lib/artwork-names");

  // 2. Requête locale uniquement.
  const forbidden = checkLocalRequest(request);
  if (forbidden) return errorResponse(forbidden, 403);

  let body: { category?: unknown; name?: unknown };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request");
  }

  // 3. Catégorie dans la liste blanche, nom nettoyé en [a-z0-9-].
  const category = resolveFilterCategory(String(body.category ?? ""));
  if ("error" in category) return errorResponse(category.error);

  const slug = slugify(String(body.name ?? "")).slice(0, 40).replace(/-+$/, "");
  if (!slug) return errorResponse("Please enter a name (letters or numbers)");
  if (slug === "all") return errorResponse('"All" already exists');

  const exists = fs
    .readdirSync(category.dir, { withFileTypes: true })
    .some((entry) => entry.isDirectory() && slugify(entry.name) === slug);
  if (exists) return errorResponse("This filter already exists", 409);

  const dir = path.resolve(category.dir, slug);
  if (!isInsideArtworks(dir)) return errorResponse("Invalid folder name");

  const label = humanize(slug);
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, "LISEZ-MOI.txt"), README(label, String(body.category)), { flag: "wx" });

  return Response.json({ slug, label }, { status: 201 });
}

/** Toute autre méthode (ex. simple visite de l'adresse) : 404, en développement comme en production. */
export function GET() {
  return notFoundResponse();
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
