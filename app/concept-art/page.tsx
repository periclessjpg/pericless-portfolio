import { GalleryOverview } from "../components/GalleryViews";
import LetsTalk from "../components/LetsTalk";
import { container } from "../components/styles";
import { pageMetadata } from "../lib/metadata";
import { getTexts } from "../lib/texts";

export const metadata = pageMetadata({
  title: "Concept Art",
  description:
    "Concept art by Rayan Houstti for video games and animation: character design and environment design.",
  path: "/concept-art",
});

export default function ConceptArtPage() {
  const t = getTexts();
  return (
    <div className={container}>
      {/* Titre invisible à l'écran, lu par Google et les lecteurs d'écran */}
      <h1 className="sr-only">{t["conceptArt.title"]}</h1>

      {/* Cartes au milieu de l'écran dès l'arrivée, à une taille qui tient dans la fenêtre.
          Elles sont créées automatiquement à partir des sous-dossiers de public/artworks/concept-art/. */}
      <section
        aria-label={t["conceptArt.title"]}
        className="flex min-h-svh flex-col items-center justify-center pb-12 pt-28 md:pt-32"
      >
        <GalleryOverview category="concept-art" centered />
      </section>

      <LetsTalk />
    </div>
  );
}
