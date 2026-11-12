// Les 3 cartes de la page Concept Art et leurs sous-pages.
//
// METTRE TES IMAGES DE CARTES
// 1. Dépose l'image dans public/artworks/concept-art/ (ex. chara-design.jpg).
// 2. Remplace "src" par "/artworks/concept-art/chara-design.jpg" (sans "public").
// 3. Renseigne la vraie largeur et hauteur (width, height) et un "alt".
// La carte est au format vertical 4:5 : l'image la remplit et est recadrée
// au centre si son format est différent.

import { type Category, conceptArtCategories } from "./projects";

export type ConceptArtSection = {
  /** Adresse de la sous-page : /concept-art/<slug>. */
  slug: string;
  /** Titre affiché sur la carte et en haut de la sous-page. */
  title: string;
  /** Courte introduction en haut de la sous-page. */
  intro: string;
  /** Catégories de projets affichées dans la sous-page. */
  categories: Category[];
  image: { src: string; alt: string; width: number; height: number };
};

export const conceptArtSections: ConceptArtSection[] = [
  {
    slug: "character-design",
    title: "Chara Design",
    intro:
      "[À REMPLACER] A short introduction to your character design work: the characters you create, your process and your influences.",
    categories: ["Character Design"],
    image: {
      src: "/placeholders/card-01-4x5.svg",
      alt: "[À REMPLACER] Placeholder artwork for character design",
      width: 1200,
      height: 1500,
    },
  },
  {
    slug: "environment",
    title: "Environment",
    intro:
      "[À REMPLACER] A short introduction to your environment design work: the worlds you build, the moods you look for and your process.",
    categories: ["Environment Design"],
    image: {
      src: "/placeholders/card-02-4x5.svg",
      alt: "[À REMPLACER] Placeholder artwork for environment design",
      width: 1200,
      height: 1500,
    },
  },
  {
    slug: "all",
    title: "All",
    intro: "[À REMPLACER] A short introduction to all your concept art projects.",
    categories: conceptArtCategories,
    image: {
      src: "/placeholders/card-03-4x5.svg",
      alt: "[À REMPLACER] Placeholder artwork for all concept art",
      width: 1200,
      height: 1500,
    },
  },
];

export function getConceptArtSection(slug: string) {
  return conceptArtSections.find((section) => section.slug === slug);
}
