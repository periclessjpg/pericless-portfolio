// MODE ÉDITION LOCAL : enregistre l'image choisie pour une carte de la page
// Concept Art ou Illustration (fichier public/artworks/<catégorie>/cards.json).
// Sur le site publié (production), cette adresse répond toujours 404.
//
// Protections : développement uniquement, requêtes locales uniquement, catégorie
// dans la liste blanche, carte existante ("all" ou un filtre), et l'image doit faire
// partie des images de cette carte. Seul cards.json est modifié ; aucune image n'est touchée.

import { getGallery } from "../../../lib/artworks";
import {
  checkLocalRequest,
  errorResponse,
  isDevelopment,
  notFoundResponse,
  resolveFilterCategory,
} from "../../../lib/dev-guard";

export async function POST(request: Request) {
  // 1. Uniquement en développement.
  if (!isDevelopment()) return notFoundResponse();

  const fs = await import("node:fs");
  const path = await import("node:path");

  // 2. Requête locale uniquement.
  const forbidden = checkLocalRequest(request);
  if (forbidden) return errorResponse(forbidden, 403);

  let body: { category?: unknown; card?: unknown; image?: unknown };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request");
  }

  // 3. Catégorie (liste blanche), carte existante, image parmi celles de la carte.
  const category = String(body.category ?? "");
  const resolved = resolveFilterCategory(category);
  if ("error" in resolved) return errorResponse(resolved.error);
  const gallery = getGallery(category as "concept-art" | "illustration");

  const card = String(body.card ?? "");
  const filter = gallery.filters.find((f) => f.slug === card);
  if (card !== "all" && !filter) return errorResponse("Unknown card");
  const candidates = card === "all" ? gallery.all : filter!.artworks;

  const image = body.image === null || body.image === "" ? null : String(body.image ?? "");
  if (image !== null && !candidates.some((artwork) => artwork.id === image)) {
    return errorResponse("This image is not part of this card");
  }

  // Mise à jour de cards.json (les autres cartes sont conservées).
  try {
    // Choix déjà enregistrés (fichier absent ou illisible : on repart de zéro).
    const file = path.join(resolved.dir, "cards.json");
    let choices: Record<string, string> = {};
    try {
      const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
      if (parsed && typeof parsed === "object") choices = parsed;
    } catch {
      choices = {};
    }
    if (image === null) delete choices[card];
    else choices[card] = image;
    fs.writeFileSync(file, `${JSON.stringify(choices, null, 2)}\n`);
  } catch (error) {
    return errorResponse(`Could not save the choice: ${(error as Error).message}`, 500);
  }

  return Response.json({ card, image });
}

/** Toute autre méthode (ex. simple visite de l'adresse) : 404, en développement comme en production. */
export function GET() {
  return notFoundResponse();
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
