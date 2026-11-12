import ArtworkFilter from "../components/ArtworkFilter";
import ComingSoon from "../components/ComingSoon";
import PageHeader from "../components/PageHeader";
import { container } from "../components/styles";
import { getGallery } from "../lib/artworks";
import { pageMetadata } from "../lib/metadata";

export const metadata = pageMetadata({
  title: "Projects",
  description: "All artworks by Rayan Houstti: concept art (characters and environments) and illustration.",
  path: "/projects",
});

export default function ProjectsPage() {
  // Vue d'ensemble : toutes les images de public/artworks/concept-art/ et illustration/.
  const galleries = [getGallery("concept-art"), getGallery("illustration")];
  const artworks = galleries.flatMap((gallery) => gallery.all);

  return (
    <div className={`${container} pt-32 md:pt-44`}>
      <PageHeader label="Portfolio" title="Projects">
        <p>[À REMPLACER] A short introduction to your work: the kind of projects you take on and what ties them together.</p>
      </PageHeader>
      {artworks.length > 0 ? (
        <ArtworkFilter
          artworks={artworks}
          categories={galleries.filter((g) => g.all.length > 0).map((g) => g.label)}
        />
      ) : (
        <ComingSoon folder="public/artworks/concept-art/ ou public/artworks/illustration/" />
      )}
    </div>
  );
}
