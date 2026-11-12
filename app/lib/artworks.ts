// Lecture automatique des images déposées dans public/artworks/.
//
// Ce fichier tourne uniquement sur le serveur, au moment de la construction du site
// (et à chaque rafraîchissement pendant `npm run dev`). Il ne lit jamais rien
// en dehors de public/artworks/.
//
// RÈGLES (détaillées dans docs/AJOUTER_MES_IMAGES.md)
// - public/artworks/concept-art/ = page Concept Art ; public/artworks/illustration/ = page Illustration.
// - Chaque sous-dossier devient un filtre (une carte) : "01-character-design" -> "Character Design".
//   Le préfixe numérique fixe l'ordre et n'est pas affiché.
// - "All" montre tout. Le sous-dossier "all" et les images posées à la racine n'apparaissent que dans "All".
// - Titre déduit du nom de fichier : "01-dragon-knight.webp" -> "Dragon Knight".
// - Un nom qui commence par "_" ou "." est ignoré (pour masquer une image ou un dossier).
// - infos.json (facultatif) remplace titre, année, description ou texte alternatif, par nom de fichier.

import "server-only";

import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { humanize, IMAGE_EXTENSIONS, isHidden, slugify } from "./artwork-names";
import { sanitizeHeroSettings, type HeroSettings } from "./hero-settings";

// ───────────── RÉGLAGE ─────────────

/** Ordre d'affichage des images : "asc" (01, 02, 03…) ou "desc" (le plus grand numéro d'abord). */
export const SORT_ORDER: "asc" | "desc" = "asc";

// ───────────── Types ─────────────

export type Artwork = {
  /** Identifiant unique (chemin relatif dans public/artworks). */
  id: string;
  /** Adresse de l'image, prête pour next/image (caractères spéciaux encodés). */
  src: string;
  width: number;
  height: number;
  title: string;
  alt: string;
  year?: number;
  description?: string;
  /** Texte affiché sous le titre : nom du filtre, ou de la catégorie pour "All". */
  kind: string;
  /** Nom de la catégorie : "Concept Art", "Illustration"… */
  category: string;
  /** Cadrage quand l'image est recadrée (CSS object-position, ex. "50% 20%"). */
  position?: string;
  /** Page vers laquelle mène un clic sur l'image (champ "link" de infos.json, adresse interne). */
  link?: string;
};

export type GalleryFilter = {
  /** Adresse de la sous-page : "character-design". */
  slug: string;
  /** Nom affiché : "Character Design". */
  label: string;
  /** Dossier à remplir, affiché en développement quand il est vide. */
  folder: string;
  artworks: Artwork[];
};

export type Gallery = {
  slug: GalleryCategory;
  label: string;
  folder: string;
  /** Toutes les images de la catégorie (filtre "All"). */
  all: Artwork[];
  /** Filtres créés à partir des sous-dossiers (sans "All"). */
  filters: GalleryFilter[];
  /** Images du seul sous-dossier "all" (pour le réglage de l'ordre en mode édition local). */
  allFolder: Artwork[];
};

export type GalleryCategory = "concept-art" | "illustration";

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  "concept-art": "Concept Art",
  illustration: "Illustration",
};

// ───────────── Outils ─────────────

/** Dossier racine des images (rien n'est lu en dehors). */
export const ARTWORKS_ROOT = path.join(process.cwd(), "public", "artworks");
const ROOT = ARTWORKS_ROOT;
const EXTENSIONS = new Set(IMAGE_EXTENSIONS);
const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

type Infos = Record<
  string,
  { title?: string; year?: number; description?: string; alt?: string; position?: string; link?: string }
>;

/** Accepte seulement une adresse interne au site (ex. "/concept-art/environments"). */
function readLink(value: unknown): string | undefined {
  return typeof value === "string" && /^\/[a-z0-9/-]*$/.test(value.trim()) ? value.trim() : undefined;
}

/** Accepte seulement un cadrage du type "50% 20%" (deux pourcentages entre 0 et 100). */
function readPosition(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const match = /^\s*(\d{1,3}(?:\.\d+)?)%\s+(\d{1,3}(?:\.\d+)?)%\s*$/.exec(value);
  if (!match) return undefined;
  const [x, y] = [Number(match[1]), Number(match[2])];
  if (x > 100 || y > 100) return undefined;
  return `${x}% ${y}%`;
}

/** Lit un dossier sans jamais planter (dossier absent = liste vide). */
function readDir(dir: string): fs.Dirent[] {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function readInfos(dir: string): Infos {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(dir, "infos.json"), "utf8"));
    return parsed && typeof parsed === "object" ? (parsed as Infos) : {};
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT" && process.env.NODE_ENV === "development") {
      console.warn(`[artworks] infos.json illisible dans ${path.relative(process.cwd(), dir)} :`, error);
    }
    return {};
  }
}

/** Largeur et hauteur réelles (photos de téléphone tournées incluses). */
function readSize(file: string): { width: number; height: number } | null {
  try {
    const size = imageSize(fs.readFileSync(file));
    if (!size.width || !size.height) return null;
    const rotated = size.orientation !== undefined && size.orientation >= 5;
    return rotated
      ? { width: size.height, height: size.width }
      : { width: size.width, height: size.height };
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[artworks] image illisible, ignorée : ${path.relative(process.cwd(), file)}`);
    }
    return null;
  }
}

function toUrl(relativeParts: string[]) {
  return `/artworks/${relativeParts.map(encodeURIComponent).join("/")}`;
}

function toFolder(relativeParts: string[]) {
  return `public/artworks/${relativeParts.join("/")}/`;
}

/**
 * Lit les images d'un dossier (sans ses sous-dossiers), triées.
 * `kind` : texte affiché sous le titre ; `filterLabel` : utilisé dans le texte alternatif.
 */
function readImages(parts: string[], kind: string, category: string): Artwork[] {
  const dir = path.join(ROOT, ...parts);
  const infos = readInfos(dir);

  const files = readDir(dir)
    .filter((entry) => entry.isFile() && !isHidden(entry.name))
    .map((entry) => entry.name)
    .filter((name) => EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort(collator.compare);
  if (SORT_ORDER === "desc") files.reverse();

  const artworks: Artwork[] = [];
  for (const name of files) {
    const size = readSize(path.join(dir, name));
    if (!size) continue;
    const info = infos[name] ?? {};
    const title = info.title?.trim() || humanize(path.parse(name).name);
    artworks.push({
      id: [...parts, name].join("/"),
      src: toUrl([...parts, name]),
      ...size,
      title,
      alt: info.alt?.trim() || `${title} – ${kind}`,
      year: typeof info.year === "number" ? info.year : undefined,
      description: info.description?.trim() || undefined,
      position: readPosition(info.position),
      link: readLink(info.link),
      kind,
      category,
    });
  }
  return artworks;
}

// ───────────── Données pour les pages ─────────────

/**
 * Image choisie pour chaque carte d'une catégorie (fichier public/artworks/<catégorie>/cards.json,
 * réglé avec "Choose image" en mode édition local) : { "<carte>": "<chemin de l'image>" },
 * par exemple { "all": "concept-art/environments/03-priest.webp" }. Fichier absent = aucun choix.
 */
export function getCardChoices(category: GalleryCategory): Record<string, string> {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(ROOT, category, "cards.json"), "utf8"));
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } catch {
    return {};
  }
}

/** Galerie d'une catégorie (Concept Art ou Illustration), avec ses filtres. */
export function getGallery(category: GalleryCategory): Gallery {
  const label = CATEGORY_LABELS[category];

  // Images "sans filtre" : à la racine de la catégorie et dans le sous-dossier "all".
  const allFolder = readImages([category, "all"], label, label);
  const unfiltered = [...readImages([category], label, label), ...allFolder];

  const filters: GalleryFilter[] = readDir(path.join(ROOT, category))
    .filter((entry) => entry.isDirectory() && !isHidden(entry.name))
    .map((entry) => entry.name)
    .filter((name) => slugify(name) !== "all" && slugify(name) !== "")
    .sort(collator.compare)
    .map((name) => {
      const filterLabel = humanize(name);
      return {
        slug: slugify(name),
        label: filterLabel,
        folder: toFolder([category, name]),
        artworks: readImages([category, name], filterLabel, label),
      };
    });

  return {
    slug: category,
    label,
    folder: toFolder([category]),
    // "All" : les images de chaque filtre (dans l'ordre des filtres), puis celles sans filtre.
    all: [...filters.flatMap((filter) => filter.artworks), ...unfiltered],
    filters,
    allFolder,
  };
}

/** Images de la section "Selected Works" de l'accueil (dossier home). */
/**
 * Hero (haut de l'accueil) : réglages de public/artworks/hero/settings.json
 * (valeurs invalides remplacées par les valeurs par défaut), image choisie
 * (sinon la première du dossier) et liste de toutes les images du dossier.
 */
export function getHero(): { settings: HeroSettings; image: Artwork | null; images: Artwork[] } {
  const images = readImages(["hero"], "Header", "Header");
  const fileName = (artwork: Artwork) => artwork.id.split("/").pop() ?? "";

  let raw: unknown = {};
  try {
    raw = JSON.parse(fs.readFileSync(path.join(ROOT, "hero", "settings.json"), "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT" && process.env.NODE_ENV === "development") {
      console.warn("[artworks] hero/settings.json illisible, réglages par défaut utilisés :", error);
    }
  }
  const settings = sanitizeHeroSettings(raw, images.map(fileName));
  const image = images.find((artwork) => fileName(artwork) === settings.image) ?? images[0] ?? null;
  return { settings, image, images };
}

export function getHomeArtworks(): Artwork[] {
  return readImages(["home"], "Selected Works", "Selected Works");
}

/**
 * Portrait et photos de la page About (dossier about).
 * Le portrait est le fichier nommé "portrait.*" (ou "01-portrait.*"), sinon la première image.
 * `portraitAlt` : texte alternatif du portrait, sauf s'il est donné dans infos.json.
 */
export function getAboutArtworks(portraitAlt: string): {
  portrait: Artwork | null;
  others: Artwork[];
  /** Toutes les images du dossier, dans l'ordre (pour le réglage de l'ordre en mode édition local). */
  all: Artwork[];
} {
  const images = readImages(["about"], "About", "About");
  const fileName = (image: Artwork) => image.id.split("/").pop() ?? "";
  const index = images.findIndex((image) => /^(\d+[\s._-]*)?portrait\./i.test(fileName(image)));
  const portraitIndex = index === -1 ? 0 : index;
  const found = images[portraitIndex];
  const customAlt = found && readInfos(path.join(ROOT, "about"))[fileName(found)]?.alt;
  const portrait = found ? { ...found, alt: customAlt?.trim() || portraitAlt } : null;
  return { portrait, others: images.filter((_, i) => i !== portraitIndex), all: images };
}

export const folders = {
  home: toFolder(["home"]),
  about: toFolder(["about"]),
  hero: toFolder(["hero"]),
};
