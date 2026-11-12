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
};

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
};

type NumberKey = {
  [K in keyof HeroSettings]: HeroSettings[K] extends number ? K : never;
}[keyof HeroSettings];

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
 * Nettoie des réglages venant d'un fichier ou du panneau : chaque valeur est
 * vérifiée (type, limites, choix autorisés, couleur valide, image existante),
 * sinon remplacée par la valeur par défaut.
 */
export function sanitizeHeroSettings(input: unknown, images: string[]): HeroSettings {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const result: HeroSettings = { ...HERO_DEFAULTS };

  for (const key of Object.keys(HERO_RANGES) as NumberKey[]) {
    const value = Number(raw[key]);
    const { min, max } = HERO_RANGES[key];
    if (raw[key] !== undefined && raw[key] !== null && raw[key] !== "" && Number.isFinite(value)) {
      result[key] = Math.min(max, Math.max(min, Math.round(value * 10) / 10));
    }
  }
  for (const key of Object.keys(HERO_CHOICES) as (keyof typeof HERO_CHOICES)[]) {
    const value = raw[key];
    if ((HERO_CHOICES[key] as readonly unknown[]).includes(value)) {
      (result as Record<string, unknown>)[key] = value;
    }
  }
  if (typeof raw.overlayColor === "string" && HEX.test(raw.overlayColor)) result.overlayColor = raw.overlayColor.toLowerCase();
  if (typeof raw.textColor === "string" && HEX.test(raw.textColor)) result.textColor = raw.textColor.toLowerCase();
  if (typeof raw.showScroll === "boolean") result.showScroll = raw.showScroll;
  if (typeof raw.image === "string" && images.includes(raw.image)) result.image = raw.image;
  return result;
}

function rgba(hex: string, alpha: number) {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${Math.round(alpha * 1000) / 1000})`;
}

/**
 * Traduit les réglages en variables CSS appliquées sur le hero.
 * Le panneau du mode édition utilise la même fonction pour l'aperçu en direct.
 */
export function heroCssVars(s: HeroSettings): Record<string, string> {
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
