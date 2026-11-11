// Liste de tes projets.
//
// OÙ METTRE TES VRAIES IMAGES
// 1. Crée un dossier par projet : public/artworks/<slug>/
//    Exemple : public/artworks/forest-guardian/cover.jpg
// 2. Dans ce fichier, référence l'image SANS le mot "public" :
//    src: "/artworks/forest-guardian/cover.jpg"
// 3. Renseigne la vraie largeur et hauteur de l'image en pixels (width, height).
//    Clic droit sur le fichier > Propriétés > Détails, sous Windows.
// 4. Écris un "alt" : une phrase qui décrit l'image pour les personnes
//    malvoyantes et pour Google. Il est obligatoire.
//
// Le guide complet est dans docs/AJOUTER_MES_IMAGES.md

// Character Design et Environment Design forment la rubrique "Concept Art".
// Illustration a sa propre rubrique.
export type Category = "Character Design" | "Environment Design" | "Illustration";

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type Project = {
  /** Identifiant dans l'adresse : /projects/<slug>. Minuscules et tirets uniquement. */
  slug: string;
  title: string;
  category: Category;
  year: number;
  summary: string;
  tools: string[];
  /** Image principale, utilisée dans les grilles. */
  cover: Omit<ProjectImage, "caption">;
  /** Images affichées en grand sur la page du projet. */
  images: ProjectImage[];
  /** true = le projet apparaît dans "Selected Works" sur l'accueil (6 maximum). */
  featured?: boolean;
};

export const categories: Category[] = ["Character Design", "Environment Design", "Illustration"];

/** Les catégories qui apparaissent dans la rubrique Concept Art. */
export const conceptArtCategories: Category[] = ["Character Design", "Environment Design"];

// Images provisoires (à remplacer par tes vraies images).
const P = {
  wide1: { src: "/placeholders/artwork-01-16x9.svg", width: 1600, height: 900 },
  tall2: { src: "/placeholders/artwork-02-4x5.svg", width: 1200, height: 1500 },
  square3: { src: "/placeholders/artwork-03-1x1.svg", width: 1200, height: 1200 },
  wide4: { src: "/placeholders/artwork-04-16x9.svg", width: 1600, height: 900 },
  tall5: { src: "/placeholders/artwork-05-4x5.svg", width: 1200, height: 1500 },
  square6: { src: "/placeholders/artwork-06-1x1.svg", width: 1200, height: 1200 },
};

const ALT = "[À REMPLACER] Placeholder artwork";

export const projects: Project[] = [
  // ───────────── CHARACTER DESIGN ─────────────
  {
    slug: "character-project-01",
    title: "[À REMPLACER] Character Project 01",
    category: "Character Design",
    year: 2025,
    summary:
      "[À REMPLACER] Two or three sentences about the project: the brief, the universe, your role and what you explored.",
    tools: ["Photoshop", "Procreate"],
    // Exemple avec une vraie image :
    // cover: { src: "/artworks/character-project-01/cover.jpg", alt: "Warrior in red armor, full body", width: 1600, height: 2000 },
    cover: { ...P.tall2, alt: ALT },
    images: [
      { ...P.tall2, alt: ALT, caption: "[À REMPLACER] Final character sheet" },
      { ...P.wide1, alt: ALT, caption: "[À REMPLACER] Silhouette exploration" },
      { ...P.square3, alt: ALT, caption: "[À REMPLACER] Costume details" },
    ],
    featured: true,
  },
  {
    slug: "character-project-02",
    title: "[À REMPLACER] Character Project 02",
    category: "Character Design",
    year: 2025,
    summary: "[À REMPLACER] Short description of the project.",
    tools: ["Photoshop", "Blender"],
    cover: { ...P.tall5, alt: ALT },
    images: [
      { ...P.tall5, alt: ALT, caption: "[À REMPLACER] Caption" },
      { ...P.square6, alt: ALT, caption: "[À REMPLACER] Caption" },
    ],
    featured: true,
  },
  {
    slug: "character-project-03",
    title: "[À REMPLACER] Character Project 03",
    category: "Character Design",
    year: 2024,
    summary: "[À REMPLACER] Short description of the project.",
    tools: ["Procreate"],
    cover: { ...P.tall2, alt: ALT },
    images: [
      { ...P.tall2, alt: ALT, caption: "[À REMPLACER] Caption" },
      { ...P.wide4, alt: ALT, caption: "[À REMPLACER] Caption" },
    ],
    featured: true,
  },
  {
    slug: "character-project-04",
    title: "[À REMPLACER] Character Project 04",
    category: "Character Design",
    year: 2023,
    summary: "[À REMPLACER] Short description of the project.",
    tools: ["Photoshop", "ZBrush"],
    cover: { ...P.tall5, alt: ALT },
    images: [
      { ...P.tall5, alt: ALT, caption: "[À REMPLACER] Caption" },
      { ...P.square3, alt: ALT, caption: "[À REMPLACER] Caption" },
    ],
  },

  // ───────────── ENVIRONMENT DESIGN ─────────────
  {
    slug: "environment-project-01",
    title: "[À REMPLACER] Environment Project 01",
    category: "Environment Design",
    year: 2025,
    summary:
      "[À REMPLACER] Two or three sentences about the project: the place, the mood, the story it tells.",
    tools: ["Photoshop", "Blender"],
    cover: { ...P.wide1, alt: ALT },
    images: [
      { ...P.wide1, alt: ALT, caption: "[À REMPLACER] Key art" },
      { ...P.wide4, alt: ALT, caption: "[À REMPLACER] Lighting study" },
      { ...P.square6, alt: ALT, caption: "[À REMPLACER] Props" },
    ],
    featured: true,
  },
  {
    slug: "environment-project-02",
    title: "[À REMPLACER] Environment Project 02",
    category: "Environment Design",
    year: 2024,
    summary: "[À REMPLACER] Short description of the project.",
    tools: ["Photoshop"],
    cover: { ...P.wide4, alt: ALT },
    images: [
      { ...P.wide4, alt: ALT, caption: "[À REMPLACER] Caption" },
      { ...P.wide1, alt: ALT, caption: "[À REMPLACER] Caption" },
    ],
    featured: true,
  },
  {
    slug: "environment-project-03",
    title: "[À REMPLACER] Environment Project 03",
    category: "Environment Design",
    year: 2024,
    summary: "[À REMPLACER] Short description of the project.",
    tools: ["Blender", "Photoshop"],
    cover: { ...P.wide1, alt: ALT },
    images: [
      { ...P.wide1, alt: ALT, caption: "[À REMPLACER] Caption" },
      { ...P.tall2, alt: ALT, caption: "[À REMPLACER] Caption" },
    ],
    featured: true,
  },
  {
    slug: "environment-project-04",
    title: "[À REMPLACER] Environment Project 04",
    category: "Environment Design",
    year: 2023,
    summary: "[À REMPLACER] Short description of the project.",
    tools: ["Photoshop"],
    cover: { ...P.wide4, alt: ALT },
    images: [
      { ...P.wide4, alt: ALT, caption: "[À REMPLACER] Caption" },
      { ...P.square3, alt: ALT, caption: "[À REMPLACER] Caption" },
    ],
  },

  // ───────────── ILLUSTRATION ─────────────
  {
    slug: "illustration-01",
    title: "[À REMPLACER] Illustration 01",
    category: "Illustration",
    year: 2025,
    summary:
      "[À REMPLACER] Two or three sentences about the illustration: the context (book cover, poster, personal work), the story and the mood.",
    tools: ["Photoshop"],
    cover: { ...P.tall5, alt: ALT },
    images: [
      { ...P.tall5, alt: ALT, caption: "[À REMPLACER] Final illustration" },
      { ...P.square6, alt: ALT, caption: "[À REMPLACER] Detail" },
    ],
  },
  {
    slug: "illustration-02",
    title: "[À REMPLACER] Illustration 02",
    category: "Illustration",
    year: 2024,
    summary: "[À REMPLACER] Short description of the illustration.",
    tools: ["Procreate"],
    cover: { ...P.square3, alt: ALT },
    images: [{ ...P.square3, alt: ALT, caption: "[À REMPLACER] Caption" }],
  },
  {
    slug: "illustration-03",
    title: "[À REMPLACER] Illustration 03",
    category: "Illustration",
    year: 2023,
    summary: "[À REMPLACER] Short description of the illustration.",
    tools: ["Photoshop", "Procreate"],
    cover: { ...P.wide1, alt: ALT },
    images: [{ ...P.wide1, alt: ALT, caption: "[À REMPLACER] Caption" }],
  },
];

// ───────────── Fonctions utiles (pas besoin d'y toucher) ─────────────

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByCategory(category: Category): Project[] {
  return projects.filter((p) => p.category === category);
}

export function getConceptArtProjects(): Project[] {
  return projects.filter((p) => conceptArtCategories.includes(p.category));
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured).slice(0, 6);
}

/** Projet précédent et suivant (la liste boucle : après le dernier vient le premier). */
export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { previous: undefined, next: undefined };
  const n = projects.length;
  return {
    previous: projects[(i - 1 + n) % n],
    next: projects[(i + 1) % n],
  };
}

/** true si l'image est un SVG (les SVG ne passent pas par l'optimiseur d'images). */
export function isSvg(src: string) {
  return src.toLowerCase().endsWith(".svg");
}
