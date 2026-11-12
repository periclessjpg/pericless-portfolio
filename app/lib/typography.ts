// Typographie du site : une police et ses réglages pour chaque rôle (comme des
// styles de paragraphe). Enregistrée dans content/typography.json (panneau
// "Typography" du mode édition local, ou à la main). Toute valeur absente ou
// invalide est remplacée par la valeur par défaut, qui reproduit le site d'origine.
// (Aucun accès aux fichiers ici : ce module sert aussi dans le navigateur.)

export type RoleName = "display" | "heading" | "ui" | "body";

export type RoleSettings = {
  /** Nom de la police (affichage) ; "" = Geist, la police d'origine du site. */
  family: string;
  /** Fichier de la police copié dans public/fonts/ (ex. "/fonts/inter-bold.ttf") ; "" = Geist. */
  file: string;
  /** Graisse (100 = très fine, 400 = normale, 700 = grasse, 900 = très grasse). */
  weight: number;
  /** Taille, en % de la taille d'origine (non utilisé pour le texte courant). */
  scale: number;
  /** Espacement des lettres, en em (0 = normal, 0.2 = très espacé). */
  tracking: number;
  /** Capitales (non utilisé pour le texte courant). */
  uppercase: boolean;
};

export type Typography = Record<RoleName, RoleSettings>;

export const ROLES: { name: RoleName; label: string; description: string; sizes: boolean }[] = [
  { name: "display", label: "Page titles", description: "Large title at the top of each page", sizes: true },
  { name: "heading", label: "Secondary titles", description: "Sections, cards, banners, captions", sizes: true },
  { name: "ui", label: "Header & menu", description: "Name, “Menu”, menu links, “Back”", sizes: true },
  { name: "body", label: "Body text", description: "Paragraphs, lists, links, small texts", sizes: false },
];

/** Valeurs par défaut : elles reproduisent la typographie d'origine (Geist). */
export const TYPOGRAPHY_DEFAULTS: Typography = {
  display: { family: "", file: "", weight: 600, scale: 100, tracking: 0.12, uppercase: true },
  heading: { family: "", file: "", weight: 600, scale: 100, tracking: 0.2, uppercase: true },
  ui: { family: "", file: "", weight: 600, scale: 100, tracking: 0.2, uppercase: true },
  body: { family: "", file: "", weight: 400, scale: 100, tracking: 0, uppercase: false },
};

export const LIMITS = {
  weight: { min: 100, max: 900, step: 100 },
  scale: { min: 50, max: 200, step: 5 },
  tracking: { min: -0.05, max: 0.5, step: 0.01 },
};

/** Formats de police acceptés (extension -> format CSS). */
export const FONT_FORMATS: Record<string, string> = {
  ".ttf": "truetype",
  ".otf": "opentype",
  ".woff": "woff",
  ".woff2": "woff2",
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Nom de police sûr pour le CSS : lettres, chiffres, espaces, tirets, points. */
export function safeFamily(value: unknown): string {
  return typeof value === "string" ? value.replace(/[^\p{L}\p{N} ._-]/gu, "").trim().slice(0, 80) : "";
}

/** Adresse de fichier sûre : uniquement /fonts/<nom simple>.<ttf|otf|woff|woff2>. */
export function safeFontFile(value: unknown): string {
  return typeof value === "string" && /^\/fonts\/[a-z0-9][a-z0-9._-]{0,120}\.(ttf|otf|woff2?)$/.test(value) ? value : "";
}

/** Nettoie des réglages venant d'un fichier ou du panneau. */
export function sanitizeTypography(input: unknown): Typography {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const result = structuredClone(TYPOGRAPHY_DEFAULTS);

  for (const { name } of ROLES) {
    const role = (raw[name] && typeof raw[name] === "object" ? raw[name] : {}) as Record<string, unknown>;
    const target = result[name];
    const family = safeFamily(role.family);
    const file = safeFontFile(role.file);
    // Une police n'est utilisée que si son nom ET son fichier sont valides.
    if (family && file) {
      target.family = family;
      target.file = file;
    }
    const weight = Number(role.weight);
    if (Number.isFinite(weight)) target.weight = clamp(Math.round(weight / 100) * 100, LIMITS.weight.min, LIMITS.weight.max);
    const scale = Number(role.scale);
    if (Number.isFinite(scale)) target.scale = clamp(Math.round(scale), LIMITS.scale.min, LIMITS.scale.max);
    const tracking = Number(role.tracking);
    if (Number.isFinite(tracking)) target.tracking = clamp(Math.round(tracking * 100) / 100, LIMITS.tracking.min, LIMITS.tracking.max);
    if (typeof role.uppercase === "boolean") target.uppercase = role.uppercase;
  }
  return result;
}

/** Nom interne de la police servie par le site pour un rôle (évite tout conflit de noms). */
const fontAlias = (role: RoleName) => `site-${role}`;

/**
 * Variables CSS d'un rôle. `family` : nom à utiliser (police servie par le site,
 * ou police installée sur l'ordinateur pour l'aperçu du panneau).
 */
export function roleVars(role: RoleName, settings: RoleSettings, family?: string): Record<string, string> {
  const fallback = "var(--font-geist-sans), system-ui, sans-serif";
  return {
    [`--type-${role}-family`]: family ? `"${family}", ${fallback}` : fallback,
    [`--type-${role}-weight`]: String(settings.weight),
    [`--type-${role}-scale`]: String(settings.scale / 100),
    [`--type-${role}-tracking`]: `${settings.tracking}em`,
    [`--type-${role}-transform`]: settings.uppercase ? "uppercase" : "none",
  };
}

/**
 * Feuille de style de la typographie : une règle @font-face par police choisie
 * (fichiers de public/fonts/) et les variables CSS de chaque rôle.
 * Toutes les valeurs sont nettoyées avant : aucun code ne peut y être injecté.
 */
export function typographyCss(typography: Typography): string {
  const faces: string[] = [];
  const vars: string[] = [];
  for (const { name } of ROLES) {
    const settings = typography[name];
    const file = safeFontFile(settings.file);
    if (file) {
      const extension = file.slice(file.lastIndexOf("."));
      faces.push(
        // La graisse déclarée est celle du fichier choisi : le navigateur n'invente pas de faux gras.
        `@font-face{font-family:"${fontAlias(name)}";src:url("${file}") format("${FONT_FORMATS[extension]}");font-weight:${settings.weight};font-display:swap;}`,
      );
    }
    for (const [key, value] of Object.entries(roleVars(name, settings, file ? fontAlias(name) : undefined))) {
      vars.push(`${key}:${value};`);
    }
  }
  return `${faces.join("")}:root{${vars.join("")}}`;
}
