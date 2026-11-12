// Textes du site : valeurs par défaut.
//
// Tu n'as pas besoin de modifier ce fichier : en mode édition local (npm run dev),
// clique sur un texte du site pour le changer. Tes modifications sont enregistrées
// dans content/texts.json (que tu peux aussi modifier à la main) et remplacent ces
// valeurs. Un texte vide ("") n'est pas affiché sur le site publié.
// (Aucun accès aux fichiers ici : ce module sert aussi dans le navigateur.)

import { site } from "../data/site";

export const DEFAULT_TEXTS = {
  // ───────────── Haut de page et menu ─────────────
  "nav.title": site.title,
  "nav.name": site.name,
  "nav.menu": "Menu",
  "nav.close": "Close",
  "nav.link.concept-art": "Concept Art",
  "nav.link.illustration": "Illustration",
  "nav.link.about": "About",
  "nav.link.contact": "Contact",

  // ───────────── Commun ─────────────
  "common.email": site.email,
  "common.back": "Back",
  "common.comingSoon": "Coming soon",
  "common.scroll": "Scroll to explore",
  "common.letsTalk": "Let's talk !",
  "common.all": "All",
  "social.0": site.socials[0]?.label ?? "",
  "social.1": site.socials[1]?.label ?? "",
  "social.2": site.socials[2]?.label ?? "",

  // ───────────── Pied de page ─────────────
  "footer.getInTouch": "Get in touch",
  "footer.name": site.name,
  "footer.rights": ". All rights reserved.",

  // ───────────── Accueil ─────────────
  "home.tagline": site.tagline,
  "home.selectedWorks.eyebrow": "Portfolio",
  "home.selectedWorks.title": "Selected Works",
  "home.selectedWorks.viewAll": "View all projects",
  "home.vision.title": "Vision",
  "home.vision.text": site.vision,
  "home.vision.link": "More about me",

  // ───────────── Projects ─────────────
  "projects.eyebrow": "Portfolio",
  "projects.title": "Projects",
  "projects.intro":
    "[À REMPLACER] A short introduction to your work: the kind of projects you take on and what ties them together.",

  // ───────────── Concept Art ─────────────
  "conceptArt.eyebrow": "Portfolio",
  "conceptArt.title": "Concept Art",
  "conceptArt.intro":
    "[À REMPLACER] A short introduction to your concept art: the characters and worlds you design for video games and animation, and your process.",

  // ───────────── Illustration ─────────────
  "illustration.eyebrow": "Portfolio",
  "illustration.title": "Illustration",
  "illustration.intro":
    "[À REMPLACER] A short introduction to your illustration work: the stories you tell, the clients or projects, and your influences.",

  // ───────────── About ─────────────
  "about.eyebrow": "About",
  "about.title": "[À REMPLACER] Hello, I'm Rayan Houstti.",
  "about.bio.0":
    "[À REMPLACER] Paragraph 1: who you are, where you are based and what you do (concept art, illustration, graphic design).",
  "about.bio.1":
    "[À REMPLACER] Paragraph 2: your background, training and the projects or studios that shaped you.",
  "about.bio.2":
    "[À REMPLACER] Paragraph 3: what you are looking for now (studios, types of projects) and how to reach you.",
  "about.cv": "Download CV",
  "about.skills.title": "Skills",
  "about.skills.0": "[À REMPLACER] Character design",
  "about.skills.1": "[À REMPLACER] Environment design",
  "about.skills.2": "[À REMPLACER] Illustration",
  "about.skills.3": "[À REMPLACER] Visual development",
  "about.skills.4": "",
  "about.skills.5": "",
  "about.software.title": "Software",
  "about.software.0": "[À REMPLACER] Photoshop",
  "about.software.1": "[À REMPLACER] Procreate",
  "about.software.2": "[À REMPLACER] Blender",
  "about.software.3": "",
  "about.software.4": "",
  "about.software.5": "",
  "about.experience.title": "Experience",
  "about.experience.0.role": "[À REMPLACER] Concept Artist",
  "about.experience.0.studio": "[À REMPLACER] Studio name",
  "about.experience.0.period": "[À REMPLACER] 2024 – Present",
  "about.experience.1.role": "[À REMPLACER] Illustrator",
  "about.experience.1.studio": "[À REMPLACER] Studio name",
  "about.experience.1.period": "[À REMPLACER] 2022 – 2024",
  "about.experience.2.role": "",
  "about.experience.2.studio": "",
  "about.experience.2.period": "",
  "about.experience.3.role": "",
  "about.experience.3.studio": "",
  "about.experience.3.period": "",

  // ───────────── Contact ─────────────
  "contact.eyebrow": "Contact",
  "contact.title": "[À REMPLACER] Let's create worlds together.",
  "contact.intro":
    "[À REMPLACER] A short sentence about your availability: freelance, full-time positions, the kind of projects you are interested in.",
  "contact.emailLabel": "Email",
  "contact.elsewhere": "Elsewhere",

  // ───────────── Page introuvable ─────────────
  "notFound.eyebrow": "Error 404",
  "notFound.title": "Project not found",
  "notFound.text": "This project does not exist or has been moved.",
  "notFound.link": "Back to all projects",
} satisfies Record<string, string>;

export type TextKey = keyof typeof DEFAULT_TEXTS;
export type Texts = Record<TextKey, string>;

/** Nombre d'éléments des listes de la page About (un élément vide n'est pas affiché). */
export const ABOUT_LIST_SIZES = { skills: 6, software: 6, experience: 4 } as const;

export function isTextKey(key: string): key is TextKey {
  return Object.prototype.hasOwnProperty.call(DEFAULT_TEXTS, key);
}

/** Nettoie un texte : texte brut uniquement, retours à la ligne gardés, 5000 caractères max. */
export function cleanText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return value
    .replace(/\r\n?/g, "\n")
    // Retire les caractères de contrôle invisibles (sauf retour à la ligne et tabulation).
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .slice(0, 5000);
}

/** Fusionne les textes enregistrés (content/texts.json) avec les valeurs par défaut. */
export function mergeTexts(saved: unknown): Texts {
  const texts: Texts = { ...DEFAULT_TEXTS };
  if (!saved || typeof saved !== "object") return texts;
  for (const [key, value] of Object.entries(saved as Record<string, unknown>)) {
    const clean = cleanText(value);
    if (isTextKey(key) && clean !== null) texts[key] = clean;
  }
  return texts;
}

/**
 * Texte à afficher : sa valeur ; s'il est vide, rien sur le site publié et
 * un repère "(empty)" cliquable en mode édition local.
 */
export function shown(value: string): string {
  if (value.trim()) return value;
  return process.env.NODE_ENV === "development" ? "(empty)" : "";
}

/**
 * Attribut qui rend un élément modifiable en mode édition local.
 * En production, renvoie un objet vide : rien n'est ajouté à la page.
 */
export function editable(key: TextKey): Record<string, string> {
  return process.env.NODE_ENV === "development" ? { "data-text-key": key } : {};
}
