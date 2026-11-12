import { GalleryOverview } from "../components/GalleryViews";
import LetsTalk from "../components/LetsTalk";
import PageHeader from "../components/PageHeader";
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
    <div className={`${container} pt-32 md:pt-44`}>
      <PageHeader
        label={t["conceptArt.eyebrow"]}
        title={t["conceptArt.title"]}
        intro={t["conceptArt.intro"]}
        keys={{ label: "conceptArt.eyebrow", title: "conceptArt.title", intro: "conceptArt.intro" }}
      />
      {/* Cartes créées automatiquement à partir des sous-dossiers de public/artworks/concept-art/ */}
      <GalleryOverview category="concept-art" />
      <LetsTalk />
    </div>
  );
}
