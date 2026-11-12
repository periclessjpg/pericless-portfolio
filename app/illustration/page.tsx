import { GalleryOverview } from "../components/GalleryViews";
import LetsTalk from "../components/LetsTalk";
import PageHeader from "../components/PageHeader";
import { container } from "../components/styles";
import { pageMetadata } from "../lib/metadata";
import { getTexts } from "../lib/texts";

export const metadata = pageMetadata({
  title: "Illustration",
  description: "Illustrations by Rayan Houstti.",
  path: "/illustration",
});

export default function IllustrationPage() {
  const t = getTexts();
  return (
    <div className={`${container} pt-32 md:pt-44`}>
      <PageHeader
        label={t["illustration.eyebrow"]}
        title={t["illustration.title"]}
        intro={t["illustration.intro"]}
        keys={{ label: "illustration.eyebrow", title: "illustration.title", intro: "illustration.intro" }}
      />
      {/* Images de public/artworks/illustration/ (cartes dès qu'il y a des sous-dossiers) */}
      <GalleryOverview category="illustration" />
      <LetsTalk />
    </div>
  );
}
