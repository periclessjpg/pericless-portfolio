import LetsTalk from "../components/LetsTalk";
import PageHeader from "../components/PageHeader";
import SectionCards from "../components/SectionCards";
import { container } from "../components/styles";
import { conceptArtSections } from "../data/concept-art";
import { pageMetadata } from "../lib/metadata";

export const metadata = pageMetadata({
  title: "Concept Art",
  description:
    "Concept art by Rayan Houstti for video games and animation: character design and environment design.",
  path: "/concept-art",
});

export default function ConceptArtPage() {
  return (
    <div className={`${container} pt-32 md:pt-44`}>
      <PageHeader label="Portfolio" title="Concept Art">
        <p>
          [À REMPLACER] A short introduction to your concept art: the characters and worlds
          you design for video games and animation, and your process.
        </p>
      </PageHeader>
      {/* Les 3 cartes : Chara Design, Environment, All (définies dans app/data/concept-art.ts) */}
      <SectionCards sections={conceptArtSections} />
      <LetsTalk />
    </div>
  );
}
