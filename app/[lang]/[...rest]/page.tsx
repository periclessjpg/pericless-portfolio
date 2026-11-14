import { notFound } from "next/navigation";

// Toute adresse qui ne correspond à aucune page (ex. /fr/nimporte-quoi) :
// affiche la page 404 du site (app/[lang]/not-found.tsx), avec le menu et dans la bonne langue.

// Avec Cache Components, une page à adresse variable doit donner au moins un exemple.
export function generateStaticParams() {
  return [{ rest: ["404"] }];
}

export default function CatchAllPage() {
  notFound();
}
