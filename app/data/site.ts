// Informations générales du site.
// Remplace chaque texte qui commence par "[À REMPLACER]" par ton vrai contenu.

export type SocialLink = {
  label: string;
  href: string;
};

export const site = {
  name: "Pericless",
  role: "Concept Artist · Illustrator · Graphic Designer",
  // Accroche et description : traduction en anglais de tes textes actuels.
  tagline: "Concept art for video games and animation.",
  description:
    "Portfolio of Pericless, concept artist, illustrator and graphic designer specializing in video games and animation.",
  vision:
    "[À REMPLACER] A short paragraph about your vision: what you love to draw, the worlds and characters you want to bring to life, and how you work with art directors and studios.",
  // [À REMPLACER] Ton adresse email (sans "[À REMPLACER]" devant, sinon le lien mailto ne marche pas).
  email: "contact@example.com",
  // Mets l'adresse complète de ton profil à la place de "#".
  socials: [
    { label: "ArtStation", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
  ] satisfies SocialLink[],
};
