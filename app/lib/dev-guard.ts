// Protections du mode édition local (routes /api/dev/*).
// Ces routes n'existent qu'en développement : partout ailleurs elles répondent 404.

import "server-only";

import fs from "node:fs";
import path from "node:path";
import { slugify } from "./artwork-names";
import { ARTWORKS_ROOT } from "./artworks";

/** En-tête obligatoire envoyé par l'interface du mode édition. */
export const DEV_HEADER = "x-dev-upload";

/** Dossiers où l'on peut déposer des images. */
const UPLOAD_CATEGORIES = ["concept-art", "illustration", "home", "about", "hero"] as const;
/** Dossiers qui ont des filtres (sous-dossiers). */
export const FILTER_CATEGORIES = ["concept-art", "illustration"] as const;

type UploadCategory = (typeof UPLOAD_CATEGORIES)[number];

export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

export function notFoundResponse() {
  return new Response("Not Found", { status: 404 });
}

export function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

/**
 * Règle 2 : la requête doit venir de ton propre ordinateur, depuis le site lui-même.
 * - Host : localhost ou 127.0.0.1 ;
 * - Origin (si présent) : exactement le même hôte ;
 * - en-tête personnalisé x-dev-upload: 1 (un autre site ne peut pas l'ajouter sans autorisation).
 * Renvoie un message d'erreur, ou null si tout va bien.
 */
export function checkLocalRequest(request: Request): string | null {
  const host = request.headers.get("host") ?? "";
  const hostname = host.replace(/:\d+$/, "");
  if (hostname !== "localhost" && hostname !== "127.0.0.1") return "Forbidden host";

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== host) return "Forbidden origin";
    } catch {
      return "Forbidden origin";
    }
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return "Forbidden origin";

  if (request.headers.get(DEV_HEADER) !== "1") return "Missing dev header";
  return null;
}

/** Vérifie qu'un dossier existe, n'est pas un lien symbolique et reste dans public/artworks. */
function isSafeDirectory(dir: string) {
  const root = fs.realpathSync(ARTWORKS_ROOT);
  try {
    if (fs.lstatSync(dir).isSymbolicLink() || !fs.statSync(dir).isDirectory()) return false;
    const real = fs.realpathSync(dir);
    return real === root || real.startsWith(root + path.sep);
  } catch {
    return false;
  }
}

/** Le chemin résolu doit rester à l'intérieur de public/artworks. */
export function isInsideArtworks(target: string) {
  const resolved = path.resolve(target);
  return resolved.startsWith(path.resolve(ARTWORKS_ROOT) + path.sep);
}

/**
 * Règle 3 : transforme (catégorie, filtre) en dossier de destination, à partir
 * d'une liste blanche. Le filtre est l'adresse nettoyée [a-z0-9-] d'un sous-dossier
 * existant ("all" = dossier all). Renvoie le dossier, ou un message d'erreur.
 */
export function resolveUploadDirectory(
  category: string,
  filter: string,
): { dir: string } | { error: string } {
  if (!(UPLOAD_CATEGORIES as readonly string[]).includes(category)) return { error: "Unknown category" };
  const categoryDir = path.resolve(ARTWORKS_ROOT, category);
  if (!isInsideArtworks(categoryDir) || !isSafeDirectory(categoryDir)) return { error: "Invalid category folder" };

  const hasFilters = (FILTER_CATEGORIES as readonly string[]).includes(category as UploadCategory);
  if (!hasFilters) {
    if (filter && filter !== "all") return { error: "This page has no filters" };
    return { dir: categoryDir };
  }

  const wanted = filter || "all";
  if (!/^[a-z0-9-]+$/.test(wanted)) return { error: "Invalid filter name" };

  if (wanted === "all") {
    const allDir = path.resolve(categoryDir, "all");
    if (!fs.existsSync(allDir)) fs.mkdirSync(allDir);
    return isInsideArtworks(allDir) && isSafeDirectory(allDir) ? { dir: allDir } : { error: "Invalid folder" };
  }

  // Cherche le sous-dossier existant dont l'adresse correspond (ex. "03-props" -> "props").
  const match = fs
    .readdirSync(categoryDir, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && !entry.name.startsWith("_") && !entry.name.startsWith(".") && slugify(entry.name) === wanted);
  if (!match) return { error: "Unknown filter" };

  const dir = path.resolve(categoryDir, match.name);
  return isInsideArtworks(dir) && isSafeDirectory(dir) ? { dir } : { error: "Invalid folder" };
}

/**
 * Vérifie l'identifiant d'une image existante (chemin relatif dans public/artworks,
 * ex. "concept-art/character-design/01-dragon-knight.webp") et renvoie son dossier
 * et son nom. Refuse "..", les chemins absolus, les liens symboliques, les fichiers
 * masqués et tout ce qui n'est pas une image acceptée.
 */
export function resolveArtworkFile(id: string): { dir: string; fileName: string } | { error: string } {
  if (!id || id.length > 300 || id.includes("\\") || id.includes("\0")) return { error: "Invalid image" };
  const parts = id.split("/");
  if (parts.some((part) => !part || part === "." || part === ".." || part.startsWith("_") || part.startsWith("."))) {
    return { error: "Invalid image" };
  }
  if (!(UPLOAD_CATEGORIES as readonly string[]).includes(parts[0]) || parts.length > 3) {
    return { error: "Invalid image" };
  }
  const extension = path.extname(id).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(extension)) return { error: "Invalid image" };

  const file = path.resolve(ARTWORKS_ROOT, ...parts);
  if (!isInsideArtworks(file)) return { error: "Invalid image" };
  try {
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink() || !stat.isFile()) return { error: "Invalid image" };
  } catch {
    return { error: "Image not found" };
  }
  const dir = path.dirname(file);
  if (!isSafeDirectory(dir)) return { error: "Invalid folder" };
  return { dir, fileName: path.basename(file) };
}

/** Dossier d'une catégorie qui accepte les filtres (pour créer un nouveau filtre). */
export function resolveFilterCategory(category: string): { dir: string } | { error: string } {
  if (!(FILTER_CATEGORIES as readonly string[]).includes(category)) return { error: "Unknown category" };
  const dir = path.resolve(ARTWORKS_ROOT, category);
  return isInsideArtworks(dir) && isSafeDirectory(dir) ? { dir } : { error: "Invalid category folder" };
}
