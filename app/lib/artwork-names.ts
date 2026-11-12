// Règles de nommage partagées par le site et par le mode édition local.
// (Aucun accès aux fichiers ici : ce module peut aussi servir dans le navigateur.)

/** Extensions d'images acceptées. */
export const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

/** "01-dragon-knight" -> "Dragon Knight" (préfixe numérique retiré, tirets en espaces). */
export function humanize(name: string) {
  const words = name
    .replace(/^\d+[\s._-]*/, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "Untitled";
  return words.map((w) => w.charAt(0).toLocaleUpperCase("en") + w.slice(1)).join(" ");
}

/** "02-Book Covers" -> "book-covers" (minuscules, sans accents ni espaces, préfixe retiré). */
export function slugify(name: string) {
  return name
    .replace(/^\d+[\s._-]*/, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Un nom qui commence par "_" ou "." est ignoré (image ou dossier masqué). */
export function isHidden(name: string) {
  return name.startsWith("_") || name.startsWith(".");
}

/** Retire l'extension : "photo.final.jpg" -> "photo.final". */
export function baseName(fileName: string) {
  const dot = fileName.lastIndexOf(".");
  return dot > 0 ? fileName.slice(0, dot) : fileName;
}
