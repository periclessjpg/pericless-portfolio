// MODE ÉDITION LOCAL : liste des polices installées sur l'ordinateur (lecture seule),
// pour le panneau "Typography". Sur le site publié (production), répond toujours 404.
// Protections : développement uniquement, requêtes locales uniquement.

import { checkLocalRequest, errorResponse, isDevelopment, notFoundResponse } from "../../../lib/dev-guard";

export async function POST(request: Request) {
  // 1. Uniquement en développement.
  if (!isDevelopment()) return notFoundResponse();

  const { listSystemFonts } = await import("../../../lib/system-fonts");

  // 2. Requête locale uniquement.
  const forbidden = checkLocalRequest(request);
  if (forbidden) return errorResponse(forbidden, 403);

  return Response.json({ fonts: listSystemFonts() });
}

/** Toute autre méthode (ex. simple visite de l'adresse) : 404, en développement comme en production. */
export function GET() {
  return notFoundResponse();
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
