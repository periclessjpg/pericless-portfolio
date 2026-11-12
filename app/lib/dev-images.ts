// MODE ÉDITION LOCAL : outils partagés par les routes /api/dev/* (envoi, remplacement,
// suppression). Utilisés seulement en développement : les routes répondent 404 avant
// d'appeler quoi que ce soit ici quand le site est publié.

import "server-only";

import fs from "node:fs";
import path from "node:path";
import { baseName, slugify } from "./artwork-names";
import { ARTWORKS_ROOT } from "./artworks";

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 Mo
export const MAX_FILES = 30;
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const MAX_SIDE = 2400;
const WEBP_QUALITY = 85;

/** Corbeille : à la racine du projet, hors du site, ignorée par Git (.gitignore). */
export const TRASH_ROOT = path.join(process.cwd(), ".artworks-trash");

/**
 * Vérifie et optimise une image envoyée :
 * extension acceptée, 25 Mo maximum, vrai format lu dans le contenu,
 * orientation corrigée, 2400 px maximum, WebP qualité 85.
 * sharp ne recopie aucune métadonnée (EXIF, GPS…) dans le fichier final.
 */
export async function processImage(file: File): Promise<{ output: Buffer } | { error: string }> {
  const extension = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { error: "Format not accepted (jpg, jpeg, png, webp, avif)" };
  }
  if (file.size > MAX_FILE_SIZE) return { error: "File larger than 25 MB" };

  const { default: sharp } = await import("sharp");
  const input = Buffer.from(await file.arrayBuffer());

  let format: string | undefined;
  let compression: string | undefined;
  try {
    const metadata = await sharp(input).metadata();
    format = metadata.format;
    compression = metadata.compression;
  } catch {
    return { error: "Not a valid image" };
  }
  const realImage =
    format === "jpeg" || format === "png" || format === "webp" || (format === "heif" && compression === "av1");
  if (!realImage) return { error: "File content is not a jpg, png, webp or avif image" };

  try {
    const output = await sharp(input)
      .rotate()
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    return { output };
  } catch {
    return { error: "Could not process this image" };
  }
}

/** Nom nettoyé d'un fichier envoyé : "Héros Final.PNG" -> "heros-final". */
export function cleanName(fileName: string) {
  return slugify(baseName(fileName)) || "image";
}

/** Prochain numéro d'ordre dans un dossier ("01", "02"…). */
export function nextPrefix(dir: string) {
  const max = fs.readdirSync(dir).reduce((highest, name) => {
    const match = /^(\d+)-/.exec(name);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return String(max + 1).padStart(2, "0");
}

/** Nom libre "<prefix>-<name>.webp" (suffixe -2, -3… si déjà pris). Jamais d'écrasement. */
export function availableName(dir: string, prefix: string, name: string) {
  const existing = new Set(fs.readdirSync(dir));
  const start = prefix ? `${prefix}-${name}` : name;
  let fileName = `${start}.webp`;
  for (let suffix = 2; existing.has(fileName); suffix++) fileName = `${start}-${suffix}.webp`;
  return fileName;
}

/** Lit infos.json d'un dossier (absent = vide ; illisible = erreur, on n'y touche pas). */
export function readInfosFile(dir: string): { infos: Record<string, Record<string, unknown>> } | { error: string } {
  const infosPath = path.join(dir, "infos.json");
  if (!fs.existsSync(infosPath)) return { infos: {} };
  try {
    const parsed = JSON.parse(fs.readFileSync(infosPath, "utf8"));
    return parsed && typeof parsed === "object" ? { infos: parsed } : { error: "infos.json is unreadable" };
  } catch {
    return { error: "infos.json is unreadable: please fix it by hand first" };
  }
}

export function writeInfosFile(dir: string, infos: Record<string, Record<string, unknown>>) {
  fs.writeFileSync(path.join(dir, "infos.json"), `${JSON.stringify(infos, null, 2)}\n`);
}

/**
 * Déplace une image dans la corbeille (.artworks-trash/), sans jamais l'effacer.
 * Le nom dans la corbeille indique la date et le dossier d'origine, pour la retrouver :
 * "2026-11-12_14-03-22__concept-art__character-design__01-dragon-knight.webp".
 * `infos` : réglages de l'image (titre, cadrage…), sauvegardés à côté si présents.
 */
export function moveToTrash(dir: string, fileName: string, infos?: Record<string, unknown>) {
  if (fs.existsSync(TRASH_ROOT) && fs.lstatSync(TRASH_ROOT).isSymbolicLink()) {
    throw new Error("Trash folder is a symbolic link");
  }
  fs.mkdirSync(TRASH_ROOT, { recursive: true });

  const stamp = new Date().toISOString().slice(0, 19).replace("T", "_").replace(/:/g, "-");
  const origin = path.relative(ARTWORKS_ROOT, path.join(dir, fileName)).split(path.sep).join("__");
  let trashName = `${stamp}__${origin}`;
  for (let n = 2; fs.existsSync(path.join(TRASH_ROOT, trashName)); n++) trashName = `${stamp}-${n}__${origin}`;

  const source = path.join(dir, fileName);
  const target = path.join(TRASH_ROOT, trashName);
  try {
    fs.renameSync(source, target);
  } catch {
    // Autre disque : copie puis retrait de l'original (c'est un déplacement, pas une perte).
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
    fs.unlinkSync(source);
  }
  if (infos && Object.keys(infos).length > 0) {
    fs.writeFileSync(`${target}.infos.json`, `${JSON.stringify(infos, null, 2)}\n`);
  }
  return { trashName, trashPath: target };
}
