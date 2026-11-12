// Informations générales du site.
// Remplace chaque texte qui commence par "[À REMPLACER]" par ton vrai contenu.

export type SocialLink = {
  label: string;
  href: string;
};

export const site = {
  /** Ton nom : barre du haut, pied de page, titres des onglets, aperçus de partage. */
  name: "Rayan Houstti",
  /** Texte en haut à gauche, au-dessus de ton nom. */
  title: "Concept Artist & Illustrator",
  // Accroche affichée dans le hero de l'accueil. Laisse "" pour ne rien afficher
  // (ancienne accroche : "Concept art for video games and animation.").
  tagline: "",
  // Description (Google et aperçus de partage) : traduction en anglais de tes textes actuels.
  description:
    "Portfolio of Rayan Houstti (Pericless), concept artist, illustrator and graphic designer specializing in video games and animation.",
  vision:
    "[À REMPLACER] A short paragraph about your vision: what you love to draw, the worlds and characters you want to bring to life, and how you work with art directors and studios.",
  // Ton adresse email (valeur par défaut ; modifiable avec "Edit texts" en local).
  email: "houstti.rayan@laposte.net",
  // Adresses complètes de tes profils (les noms affichés se modifient en mode édition local).
  socials: [
    { label: "ArtStation", href: "https://www.artstation.com/elgrande6" },
    { label: "Instagram", href: "https://www.instagram.com/__pericless__/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rayan-houstti-8bb952314/" },
  ] satisfies SocialLink[],
};
