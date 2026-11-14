// Réglages du hero (haut de la page d'accueil).
// Enregistrés dans public/artworks/hero/settings.json (modifiable à la main ou avec
// le panneau "Customize hero" du mode édition local). Toute valeur absente ou invalide
// est remplacée par la valeur par défaut : le site ne plante jamais.
// (Aucun accès aux fichiers ici : ce module sert aussi dans le navigateur.)

export type HeroSettings = {
  /** Image du dossier hero/ à afficher ("" = la première). */
  image: string;
  /** Hauteur du hero, en % de la hauteur de l'écran (40 à 100). */
  height: number;
  /** Opacité de l'image, en % (0 = invisible, 100 = pleine). */
  imageOpacity: number;
  /** Zoom de l'image, en % (100 = normal). */
  zoom: number;
  /** Flou de l'image, en pixels. */
  blur: number;
  /** Noir et blanc, en % (0 = couleurs, 100 = noir et blanc). */
  grayscale: number;
  /** Saturation des couleurs, en % (100 = normale). */
  saturation: number;
  /** Luminosité, en % (100 = normale). */
  brightness: number;
  /** Contraste, en % (100 = normal). */
  contrast: number;
  /** Couleur du voile posé sur l'image (#rrggbb). */
  overlayColor: string;
  /** Intensité du voile, en %. */
  overlayOpacity: number;
  /** Direction du dégradé (de la couleur du voile vers le transparent). */
  gradient: "bottom" | "left" | "bottom-left" | "none";
  /** Force du dégradé, en %. */
  gradientStrength: number;
  /** Position verticale de l'accroche. */
  textVertical: "top" | "center" | "bottom";
  /** Position horizontale de l'accroche. */
  textHorizontal: "left" | "center" | "right";
  /** Taille de l'accroche, en pixels. */
  textSize: number;
  /** Couleur de l'accroche (#rrggbb). */
  textColor: string;
  /** Afficher "Scroll to explore". */
  showScroll: boolean;
  /** Arrivée de l'image au chargement. */
  animation: "fade" | "zoom" | "none";
  /** Durée de l'arrivée, en secondes. */
  animationDuration: number;
  /** Effet de parallaxe au défilement, en % (0 = aucun). */
  parallax: number;
  /**
   * Réglages propres aux téléphones (écrans de moins de 768 px) : seulement ceux qui
   * diffèrent de l'ordinateur. Panneau "Customize hero" ouvert dans l'aperçu "Phone".
   */
  mobile: HeroMobileSettings;
};

/** Réglages qui peuvent être différents sur téléphone (pas l'image, l'animation ni la parallaxe). */
export const HERO_MOBILE_KEYS = [
  "height",
  "imageOpacity",
  "zoom",
  "blur",
  "grayscale",
  "saturation",
  "brightness",
  "contrast",
  "overlayColor",
  "overlayOpacity",
  "gradient",
  "gradientStrength",
  "textVertical",
  "textHorizontal",
  "textSize",
  "textColor",
  "showScroll",
] as const;
export type HeroMobileKey = (typeof HERO_MOBILE_KEYS)[number];
export type HeroMobileSettings = Partial<Pick<HeroSettings, HeroMobileKey>>;

/** Valeurs par défaut : elles reproduisent le hero d'origine. */
export const HERO_DEFAULTS: HeroSettings = {
  image: "",
  height: 100,
  imageOpacity: 100,
  zoom: 100,
  blur: 0,
  grayscale: 0,
  saturation: 100,
  brightness: 100,
  contrast: 100,
  overlayColor: "#0a0a0a",
  overlayOpacity: 30,
  gradient: "bottom-left",
  gradientStrength: 100,
  textVertical: "center",
  textHorizontal: "left",
  textSize: 18,
  textColor: "#e5e5e5",
  showScroll: true,
  animation: "fade",
  animationDuration: 0.8,
  parallax: 0,
  mobile: {},
};

type NumberKey = {
  [K in keyof HeroSettings]: HeroSettings[K] extends number ? K : never;
}[keyof HeroSettings];

type ValueKey = Exclude<keyof HeroSettings, "mobile">;

/** Limites des réglages numériques (et texte du panneau). */
export const HERO_RANGES: Record<NumberKey, { min: number; max: number; step: number; label: string; unit: string }> = {
  height: { min: 40, max: 100, step: 1, label: "Height", unit: "% of screen" },
  imageOpacity: { min: 0, max: 100, step: 1, label: "Image opacity", unit: "%" },
  zoom: { min: 100, max: 200, step: 1, label: "Zoom", unit: "%" },
  blur: { min: 0, max: 20, step: 0.5, label: "Blur", unit: "px" },
  grayscale: { min: 0, max: 100, step: 1, label: "Black & white", unit: "%" },
  saturation: { min: 0, max: 200, step: 1, label: "Saturation", unit: "%" },
  brightness: { min: 0, max: 200, step: 1, label: "Brightness", unit: "%" },
  contrast: { min: 0, max: 200, step: 1, label: "Contrast", unit: "%" },
  overlayOpacity: { min: 0, max: 100, step: 1, label: "Overlay strength", unit: "%" },
  gradientStrength: { min: 0, max: 100, step: 1, label: "Gradient strength", unit: "%" },
  textSize: { min: 12, max: 64, step: 1, label: "Text size", unit: "px" },
  animationDuration: { min: 0.2, max: 4, step: 0.1, label: "Animation duration", unit: "s" },
  parallax: { min: 0, max: 100, step: 1, label: "Parallax", unit: "%" },
};

export const HERO_CHOICES = {
  gradient: ["bottom", "left", "bottom-left", "none"],
  textVertical: ["top", "center", "bottom"],
  textHorizontal: ["left", "center", "right"],
  animation: ["fade", "zoom", "none"],
} as const;

const HEX = /^#[0-9a-fA-F]{6}$/;

/**
 * Vérifie une valeur (type, limites, choix autorisés, couleur valide).
 * Renvoie undefined si elle n'est pas valable.
 */
function cleanValue(key: ValueKey, value: unknown, images: string[]): unknown {
  if (key in HERO_RANGES) {
    const number = Number(value);
    if (value === undefined || value === null || value === "" || !Number.isFinite(number)) return undefined;
    const { min, max } = HERO_RANGES[key as NumberKey];
    return Math.min(max, Math.max(min, Math.round(number * 10) / 10));
  }
  if (key in HERO_CHOICES) {
    return (HERO_CHOICES[key as keyof typeof HERO_CHOICES] as readonly unknown[]).includes(value) ? value : undefined;
  }
  if (key === "overlayColor" || key === "textColor") {
    return typeof value === "string" && HEX.test(value) ? value.toLowerCase() : undefined;
  }
  if (key === "showScroll") return typeof value === "boolean" ? value : undefined;
  if (key === "image") return typeof value === "string" && images.includes(value) ? value : undefined;
  return undefined;
}

/**
 * Nettoie des réglages venant d'un fichier ou du panneau : chaque valeur est
 * vérifiée (type, limites, choix autorisés, couleur valide, image existante),
 * sinon remplacée par la valeur par défaut. Les réglages téléphone ("mobile")
 * sont vérifiés de la même façon ; une valeur invalide y est simplement ignorée.
 */
export function sanitizeHeroSettings(input: unknown, images: string[]): HeroSettings {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const result: HeroSettings = { ...HERO_DEFAULTS, mobile: {} };

  for (const key of Object.keys(HERO_DEFAULTS) as (keyof HeroSettings)[]) {
    if (key === "mobile") continue;
    const value = cleanValue(key, raw[key], images);
    if (value !== undefined) (result as Record<string, unknown>)[key] = value;
  }

  const rawMobile = (raw.mobile && typeof raw.mobile === "object" ? raw.mobile : {}) as Record<string, unknown>;
  for (const key of HERO_MOBILE_KEYS) {
    const value = cleanValue(key, rawMobile[key], images);
    // Seules les valeurs différentes de l'ordinateur sont gardées.
    if (value !== undefined && value !== result[key]) (result.mobile as Record<string, unknown>)[key] = value;
  }
  return result;
}

/** Réglages vus sur téléphone : ceux de l'ordinateur, remplacés par les réglages téléphone. */
export function heroPhoneSettings(s: HeroSettings): HeroSettings {
  return { ...s, ...s.mobile };
}

function rgba(hex: string, alpha: number) {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${Math.round(alpha * 1000) / 1000})`;
}

/**
 * Traduit les réglages en variables CSS appliquées sur le hero :
 * --hero-d-… (ordinateur) ou --hero-m-… (téléphone) ; app/globals.css choisit
 * les unes ou les autres selon la largeur de l'écran (variables --hero-…).
 * Le panneau du mode édition utilise la même fonction pour l'aperçu en direct.
 */
export function heroCssVars(s: HeroSettings, device: "d" | "m" = "d"): Record<string, string> {
  return Object.fromEntries(
    Object.entries(heroVars(s)).map(([name, value]) => [name.replace("--hero-", `--hero-${device}-`), value]),
  );
}

function heroVars(s: HeroSettings): Record<string, string> {
  const strength = s.gradientStrength / 100;
  const color = s.overlayColor;
  const gradients: Record<HeroSettings["gradient"], string> = {
    none: "none",
    bottom: `linear-gradient(to top, ${rgba(color, strength)} 0%, ${rgba(color, strength * 0.5)} 45%, transparent 100%)`,
    left: `linear-gradient(to right, ${rgba(color, strength * 0.8)} 0%, transparent 70%)`,
    "bottom-left": `linear-gradient(to top, ${rgba(color, strength)} 0%, ${rgba(color, strength * 0.5)} 45%, transparent 100%), linear-gradient(to right, ${rgba(color, strength * 0.6)} 0%, transparent 70%)`,
  };
  const justify = { top: "flex-start", center: "center", bottom: "flex-end" }[s.textVertical];
  const align = { left: "flex-start", center: "center", right: "flex-end" }[s.textHorizontal];

  return {
    "--hero-height": `${s.height}svh`,
    "--hero-img-opacity": String(s.imageOpacity / 100),
    "--hero-zoom": String(s.zoom / 100),
    "--hero-filter": `blur(${s.blur}px) grayscale(${s.grayscale}%) saturate(${s.saturation}%) brightness(${s.brightness}%) contrast(${s.contrast}%)`,
    "--hero-overlay": rgba(color, s.overlayOpacity / 100),
    "--hero-gradient": gradients[s.gradient],
    "--hero-justify": justify,
    "--hero-align": align,
    "--hero-text-align": s.textHorizontal,
    "--hero-text-size": `${s.textSize}px`,
    "--hero-text-color": s.textColor,
    "--hero-scroll-display": s.showScroll ? "block" : "none",
  };
}
