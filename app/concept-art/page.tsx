import CategoryFilter from "../components/CategoryFilter";
import PageHeader from "../components/PageHeader";
import { container } from "../components/styles";
import { conceptArtCategories, getConceptArtProjects } from "../data/projects";
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
      <CategoryFilter projects={getConceptArtProjects()} filterBy={conceptArtCategories} />
    </div>
  );
}
