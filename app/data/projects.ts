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
  /** Type de réalisation, affiché en petit sous le titre dans les listes (ex. "Key art"). */
  kind: string;
  /** "wip" = travail en cours : affiché dans les listes sans lien, avec "Work in progress". */
  status?: "wip";
  year: number;
  summary: string;
  tools: string[];
  /** Petite vignette des listes Concept Art / Illustration (jamais recadrée). */
  thumb: Omit<ProjectImage, "caption">;
  /** Image principale, utilisée dans les grilles et sur l'accueil. */
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

// Vignettes provisoires de formats variés (listes Concept Art / Illustration).
const T = {
  landscape: { src: "/placeholders/thumb-3x2.svg", width: 600, height: 400 },
  portrait: { src: "/placeholders/thumb-2x3.svg", width: 400, height: 600 },
  square: { src: "/placeholders/thumb-1x1.svg", width: 500, height: 500 },
  panorama: { src: "/placeholders/thumb-21x9.svg", width: 840, height: 360 },
  tall: { src: "/placeholders/thumb-3x4.svg", width: 450, height: 600 },
};

const ALT = "[À REMPLACER] Placeholder artwork";

export const projects: Project[] = [
  // ───────────── CHARACTER DESIGN ─────────────
  {
    slug: "character-project-01",
    title: "[À REMPLACER] Character Project 01",
    category: "Character Design",
    kind: "[À REMPLACER] Character sheet",
    year: 2025,
    summary:
      "[À REMPLACER] Two or three sentences about the project: the brief, the universe, your role and what you explored.",
    tools: ["Photoshop", "Procreate"],
    // Exemple avec une vraie image :
    // cover: { src: "/artworks/character-project-01/cover.jpg", alt: "Warrior in red armor, full body", width: 1600, height: 2000 },
    thumb: { ...T.portrait, alt: ALT },
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
    kind: "[À REMPLACER] Costume exploration",
    year: 2025,
    summary: "[À REMPLACER] Short description of the project.",
    tools: ["Photoshop", "Blender"],
    thumb: { ...T.tall, alt: ALT },
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
    kind: "[À REMPLACER] Character design",
    year: 2024,
    summary: "[À REMPLACER] Short description of the project.",
    tools: ["Procreate"],
    thumb: { ...T.square, alt: ALT },
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
    kind: "[À REMPLACER] Creature design",
    year: 2023,
    summary: "[À REMPLACER] Short description of the project.",
    tools: ["Photoshop", "ZBrush"],
    thumb: { ...T.portrait, alt: ALT },
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
    kind: "[À REMPLACER] Key art",
    year: 2025,
    summary:
      "[À REMPLACER] Two or three sentences about the project: the place, the mood, the story it tells.",
    tools: ["Photoshop", "Blender"],
    thumb: { ...T.panorama, alt: ALT },
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
    kind: "[À REMPLACER] Environment study",
    year: 2024,
    summary: "[À REMPLACER] Short description of the project.",
    tools: ["Photoshop"],
    thumb: { ...T.landscape, alt: ALT },
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
    kind: "[À REMPLACER] Lighting study",
    year: 2024,
    summary: "[À REMPLACER] Short description of the project.",
    tools: ["Blender", "Photoshop"],
    thumb: { ...T.landscape, alt: ALT },
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
    kind: "[À REMPLACER] Props design",
    year: 2023,
    summary: "[À REMPLACER] Short description of the project.",
    tools: ["Photoshop"],
    thumb: { ...T.square, alt: ALT },
    cover: { ...P.wide4, alt: ALT },
    images: [
      { ...P.wide4, alt: ALT, caption: "[À REMPLACER] Caption" },
      { ...P.square3, alt: ALT, caption: "[À REMPLACER] Caption" },
    ],
  },
  {
    // Exemple de travail en cours : visible dans la liste, sans lien ni page.
    slug: "environment-wip-01",
    title: "[À REMPLACER] Environment Project 05",
    category: "Environment Design",
    kind: "Work in progress",
    status: "wip",
    year: 2026,
    summary: "[À REMPLACER] Short description of the project.",
    tools: [],
    thumb: { ...T.panorama, alt: ALT },
    cover: { ...P.wide1, alt: ALT },
    images: [],
  },

  // ───────────── ILLUSTRATION ─────────────
  {
    slug: "illustration-01",
    title: "[À REMPLACER] Illustration 01",
    category: "Illustration",
    kind: "[À REMPLACER] Book cover",
    year: 2025,
    summary:
      "[À REMPLACER] Two or three sentences about the illustration: the context (book cover, poster, personal work), the story and the mood.",
    tools: ["Photoshop"],
    thumb: { ...T.tall, alt: ALT },
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
    kind: "[À REMPLACER] Poster",
    year: 2024,
    summary: "[À REMPLACER] Short description of the illustration.",
    tools: ["Procreate"],
    thumb: { ...T.square, alt: ALT },
    cover: { ...P.square3, alt: ALT },
    images: [{ ...P.square3, alt: ALT, caption: "[À REMPLACER] Caption" }],
  },
  {
    slug: "illustration-03",
    title: "[À REMPLACER] Illustration 03",
    category: "Illustration",
    kind: "[À REMPLACER] Personal work",
    year: 2023,
    summary: "[À REMPLACER] Short description of the illustration.",
    tools: ["Photoshop", "Procreate"],
    thumb: { ...T.landscape, alt: ALT },
    cover: { ...P.wide1, alt: ALT },
    images: [{ ...P.wide1, alt: ALT, caption: "[À REMPLACER] Caption" }],
  },
  {
    // Exemple de travail en cours : visible dans la liste, sans lien ni page.
    slug: "illustration-wip-01",
    title: "[À REMPLACER] Illustration 04",
    category: "Illustration",
    kind: "Work in progress",
    status: "wip",
    year: 2026,
    summary: "[À REMPLACER] Short description of the illustration.",
    tools: [],
    thumb: { ...T.portrait, alt: ALT },
    cover: { ...P.tall2, alt: ALT },
    images: [],
  },
];

// ───────────── Fonctions utiles (pas besoin d'y toucher) ─────────────

/** true si le projet est terminé (pas "wip"). */
export function isPublished(project: Project) {
  return project.status !== "wip";
}

/** Projets terminés : ce sont les seuls qui ont une page détail. */
export const publishedProjects = projects.filter(isPublished);

/** Projet terminé correspondant au slug (undefined pour un projet "wip" ou inconnu). */
export function getProject(slug: string): Project | undefined {
  return publishedProjects.find((p) => p.slug === slug);
}

/** Tous les projets d'une catégorie, y compris les travaux en cours (listes). */
export function getProjectsByCategory(category: Category): Project[] {
  return projects.filter((p) => p.category === category);
}

/** Tous les projets Concept Art, y compris les travaux en cours (liste). */
export function getConceptArtProjects(): Project[] {
  return projects.filter((p) => conceptArtCategories.includes(p.category));
}

export function getFeaturedProjects(): Project[] {
  return publishedProjects.filter((p) => p.featured).slice(0, 6);
}

/** Projet précédent et suivant (la liste boucle : après le dernier vient le premier). */
export function getAdjacentProjects(slug: string) {
  const list = publishedProjects;
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1) return { previous: undefined, next: undefined };
  const n = list.length;
  return {
    previous: list[(i - 1 + n) % n],
    next: list[(i + 1) % n],
  };
}

/** true si l'image est un SVG (les SVG ne passent pas par l'optimiseur d'images). */
export function isSvg(src: string) {
  return src.toLowerCase().endsWith(".svg");
}
