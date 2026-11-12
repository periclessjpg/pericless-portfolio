import { GalleryOverview } from "../components/GalleryViews";
import LetsTalk from "../components/LetsTalk";
import PageHeader from "../components/PageHeader";
import { container } from "../components/styles";
import { pageMetadata } from "../lib/metadata";

export const metadata = pageMetadata({
  title: "Illustration",
  description: "Illustrations by Rayan Houstti.",
  path: "/illustration",
});

export default function IllustrationPage() {
  return (
    <div className={`${container} pt-32 md:pt-44`}>
      <PageHeader label="Portfolio" title="Illustration">
        <p>
          [À REMPLACER] A short introduction to your illustration work: the stories you tell,
          the clients or projects, and your influences.
        </p>
      </PageHeader>
      {/* Images de public/artworks/illustration/ (cartes dès qu'il y a des sous-dossiers) */}
      <GalleryOverview category="illustration" />
      <LetsTalk />
    </div>
  );
}
